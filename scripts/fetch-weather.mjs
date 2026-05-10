import { mkdir, writeFile } from "node:fs/promises";

const CWA_API_KEY = process.env.CWA_API_KEY;
const API_BASE = "https://opendata.cwa.gov.tw/api/v1/rest/datastore";
const OUTPUT_FILE = new URL("../data/weather.json", import.meta.url);

const cityDatasets = [
  {
    key: "taipei",
    name: "台北",
    displayName: "臺北市",
    datasetId: "F-D0047-063",
    fallbackNote: "午後雲量增加，短暫陣雨機率偏高，外出建議帶傘。",
  },
  {
    key: "keelung",
    name: "基隆",
    displayName: "基隆市",
    datasetId: "F-D0047-051",
    fallbackNote: "迎風面雲量較多，早晚容易有短暫雨，海邊風感較明顯。",
  },
];

if (!CWA_API_KEY) {
  throw new Error("Missing CWA_API_KEY environment variable.");
}

function asArray(value) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function getProp(object, ...keys) {
  for (const key of keys) {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      return object[key];
    }
  }

  return undefined;
}

function getElementValue(time) {
  const values = asArray(getProp(time, "ElementValue", "elementValue"));
  const first = values[0] ?? {};

  return (
    getProp(first, "Value", "value", "Weather", "weather", "Temperature", "temperature", "ProbabilityOfPrecipitation") ??
    getProp(first, "MaxTemperature", "MinTemperature") ??
    ""
  );
}

function toNumber(value) {
  if (typeof value === "number") {
    return value;
  }

  const match = String(value).match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function toDateKey(value) {
  if (!value) {
    return null;
  }

  return String(value).slice(0, 10);
}

function mode(values) {
  const counts = new Map();

  values.filter(Boolean).forEach((value) => {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "多雲";
}

function weatherIcon(label) {
  if (/雷/.test(label)) {
    return "⛈️";
  }

  if (/雨/.test(label)) {
    return /晴|多雲/.test(label) ? "🌦️" : "🌧️";
  }

  if (/晴/.test(label)) {
    return /雲/.test(label) ? "🌤️" : "☀️";
  }

  if (/陰/.test(label)) {
    return "☁️";
  }

  return "🌥️";
}

function weatherNote(days, fallback) {
  const rainyDays = days.filter((day) => (day.rain ?? 0) >= 50).length;
  const maxHigh = Math.max(...days.map((day) => day.high).filter(Number.isFinite));

  if (rainyDays >= 4) {
    return "未來一週降雨機率偏高，外出建議攜帶雨具並留意路面濕滑。";
  }

  if (maxHigh >= 33) {
    return "白天高溫偏熱，戶外活動建議補充水分並留意午後短暫雨。";
  }

  return fallback;
}

function summarizeCity(raw, config) {
  const locations =
    asArray(raw?.records?.Locations)
      .flatMap((group) => asArray(getProp(group, "Location", "location"))) ??
    asArray(raw?.records?.locations)
      .flatMap((group) => asArray(getProp(group, "location", "Location")));

  const grouped = new Map();

  locations.forEach((location) => {
    const elements = asArray(getProp(location, "WeatherElement", "weatherElement"));

    elements.forEach((element) => {
      const elementName = getProp(element, "ElementName", "elementName");
      const times = asArray(getProp(element, "Time", "time"));

      times.forEach((time) => {
        const dateKey = toDateKey(getProp(time, "StartTime", "startTime", "DataTime", "dataTime"));

        if (!dateKey) {
          return;
        }

        if (!grouped.has(dateKey)) {
          grouped.set(dateKey, {
            date: dateKey,
            lows: [],
            highs: [],
            rains: [],
            labels: [],
            descriptions: [],
          });
        }

        const day = grouped.get(dateKey);
        const value = getElementValue(time);
        const numeric = toNumber(value);

        if (/最低溫度|MinT|最低溫/.test(elementName) && numeric !== null) {
          day.lows.push(numeric);
        } else if (/最高溫度|MaxT|最高溫/.test(elementName) && numeric !== null) {
          day.highs.push(numeric);
        } else if (/降雨機率|PoP/.test(elementName) && numeric !== null) {
          day.rains.push(numeric);
        } else if (/天氣現象|Wx/.test(elementName)) {
          day.labels.push(String(value));
        } else if (/綜合描述|WeatherDescription/.test(elementName)) {
          day.descriptions.push(String(value));
        }
      });
    });
  });

  const days = [...grouped.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 7)
    .map((day) => {
      const label = mode(day.labels);
      const rain =
        day.rains.length > 0
          ? Math.round(day.rains.reduce((sum, value) => sum + value, 0) / day.rains.length)
          : null;

      return {
        date: day.date,
        label,
        low: day.lows.length > 0 ? Math.min(...day.lows) : null,
        high: day.highs.length > 0 ? Math.max(...day.highs) : null,
        rain,
        icon: weatherIcon(label),
        description: mode(day.descriptions),
      };
    })
    .filter((day) => day.low !== null && day.high !== null);

  if (days.length === 0) {
    throw new Error(`No forecast days parsed for ${config.displayName}.`);
  }

  return {
    key: config.key,
    name: config.name,
    displayName: config.displayName,
    datasetId: config.datasetId,
    note: weatherNote(days, config.fallbackNote),
    days,
  };
}

async function fetchCity(config) {
  const url = new URL(`${API_BASE}/${config.datasetId}`);
  url.searchParams.set("Authorization", CWA_API_KEY);
  url.searchParams.set("format", "JSON");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`CWA ${config.datasetId} failed: ${response.status} ${response.statusText}`);
  }

  const raw = await response.json();
  return summarizeCity(raw, config);
}

const cities = {};

for (const config of cityDatasets) {
  const city = await fetchCity(config);
  cities[city.key] = city;
}

await mkdir(new URL("../data/", import.meta.url), { recursive: true });
await writeFile(
  OUTPUT_FILE,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: "中央氣象署開放資料平台",
      cities,
    },
    null,
    2,
  )}\n`,
);

console.log(`Wrote ${OUTPUT_FILE.pathname}`);
