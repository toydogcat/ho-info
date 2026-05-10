const fallbackWeatherProfiles = {
  taipei: {
    name: "台北",
    note: "午後雲量增加，短暫陣雨機率偏高，外出建議帶傘。",
    days: [
      ["多雲短暫雨", 25, 31, 60, "🌦️"],
      ["陰時多雲", 24, 30, 45, "⛅"],
      ["午後雷陣雨", 25, 32, 70, "⛈️"],
      ["多雲", 26, 33, 35, "🌤️"],
      ["晴時多雲", 26, 34, 30, "☀️"],
      ["短暫陣雨", 25, 31, 55, "🌧️"],
      ["多雲悶熱", 26, 33, 40, "🌥️"],
    ],
  },
  keelung: {
    name: "基隆",
    note: "迎風面雲量較多，早晚容易有短暫雨，海邊風感較明顯。",
    days: [
      ["陰短暫雨", 23, 28, 70, "🌧️"],
      ["多雲有雨", 23, 29, 65, "🌦️"],
      ["陰時多雲", 24, 29, 50, "🌥️"],
      ["短暫陣雨", 24, 30, 60, "🌧️"],
      ["多雲", 24, 30, 40, "⛅"],
      ["晴時多雲", 25, 31, 35, "🌤️"],
      ["午後短暫雨", 24, 30, 55, "🌦️"],
    ],
  },
};

const busRoutes = [
  {
    id: "645",
    title: "645",
    direction: "舊庄 ⇄ 捷運石牌站",
    operator: "三重客運",
    tone: "石牌三玉宮",
    stops: ["捷運石牌站", "綜合市場", "三玉宮", "天母廣場", "故宮", "內湖", "舊庄"],
    note: "可作為石牌往三玉宮、天母東西路一帶的靜態參考；完整雙向站序待 TDX 補齊。",
  },
  {
    id: "645副",
    title: "645副",
    direction: "中華科技大學 ⇄ 捷運石牌站",
    operator: "三重客運",
    tone: "石牌三玉宮",
    stops: ["捷運石牌站", "綜合市場", "三玉宮", "天母廣場", "故宮", "內湖", "中華科技大學"],
    note: "645 副線也可由石牌往三玉宮周邊，之後可加上與正線的班距比較。",
  },
  {
    id: "red12",
    title: "紅12",
    direction: "科學教育館 ⇄ 捷運石牌站",
    operator: "中興巴士",
    tone: "三玉宮",
    stops: ["捷運石牌站", "綜合市場", "榮總", "三玉宮", "天母廣場", "士林高商", "科學教育館"],
    note: "可到三玉宮站，適合石牌、榮總、天母周邊短程移動。",
  },
  {
    id: "red19",
    title: "紅19",
    direction: "天母 ⇄ 捷運石牌站",
    operator: "臺北市公車",
    tone: "天母石牌",
    stops: ["天母", "天母國小", "天母廣場", "振興醫院", "榮總", "石牌國中", "捷運石牌站"],
    note: "先保留常用站點，下一版可加入方向切換與首末班資訊。",
  },
  {
    id: "224",
    title: "224",
    direction: "天母 ⇄ 捷運石牌站周邊",
    operator: "臺北市公車",
    tone: "天母接駁",
    stops: ["天母", "天母廣場", "齊賢華廈", "振興醫院", "榮總", "綜合市場", "捷運石牌站"],
    note: "適合放在石牌往返天母的常用路線群，站點先以常見轉乘點示意。",
  },
  {
    id: "602",
    title: "602",
    direction: "天母 ⇄ 石牌生活圈",
    operator: "臺北市公車",
    tone: "石牌三玉宮",
    stops: ["捷運石牌站", "綜合市場", "榮總", "福德廟(石牌)", "天北站", "天母國小", "三玉宮"],
    note: "602 有三玉宮站，也經過綜合市場(捷運石牌站)與榮總，適合做石牌往三玉宮的主推路線。",
  },
  {
    id: "606",
    title: "606",
    direction: "萬芳社區 ⇄ 榮總",
    operator: "臺北市公車",
    tone: "三玉宮",
    stops: ["榮總", "天母", "三玉宮", "士林", "松山", "六張犁", "萬芳社區"],
    note: "可到三玉宮站，較適合從市區東南側或榮總方向接天母。",
  },
  {
    id: "285",
    title: "285",
    direction: "榮總 ⇄ 市區",
    operator: "臺北市公車",
    tone: "三玉宮",
    stops: ["榮總", "三玉宮", "天母廣場", "士林", "圓山", "南京東路周邊"],
    note: "多個天母店家交通資訊列為三玉宮站可用路線，完整走向待 TDX 補正式站序。",
  },
  {
    id: "646",
    title: "646",
    direction: "天母 / 三玉宮 ⇄ 東區廊帶",
    operator: "臺北市公車",
    tone: "三玉宮",
    stops: ["三玉宮", "天母廣場", "士林", "松山機場周邊", "信義敦化周邊"],
    note: "可先列入三玉宮周邊路線，後續等 TDX key 補站序與即時到站。",
  },
  {
    id: "280直",
    title: "280直",
    direction: "天母 ⇄ 公館",
    operator: "臺北市公車",
    tone: "南北向",
    stops: ["天母", "士林", "捷運劍潭站", "圓山", "台大醫院", "台電大樓", "公館"],
    note: "可作為天母往市區、公館方向的靜態交通參考。",
  },
  {
    id: "中山幹線",
    title: "中山幹線",
    direction: "天母 ⇄ 青年公園",
    operator: "臺北市公車",
    tone: "幹線公車",
    stops: ["天母", "士林", "圓山", "民權中山路口", "台北車站", "小南門", "青年公園"],
    note: "適合放入天母往中山北路、台北車站方向的常用路線。",
  },
  {
    id: "重慶幹線",
    title: "重慶幹線",
    direction: "天母 ⇄ 重慶南北路廊帶",
    operator: "臺北市公車",
    tone: "幹線公車",
    stops: ["天母", "士林", "大同區", "台北車站", "重慶南路", "古亭周邊"],
    note: "站點先抓主要廊帶，細站序建議等 TDX 或官方資料補完整。",
  },
  {
    id: "9006",
    title: "9006",
    direction: "台北士林 / 國立科教館 ⇄ 基隆國家新城",
    operator: "基隆客運 / 光華巴士",
    tone: "國道客運",
    stops: ["國立科教館", "士林", "圓山轉運站", "基隆長庚醫院", "麥金路樂利三街口", "安樂區", "國家新城"],
    note: "先做國道客運靜態稿；即時到站與班次可等 TDX key 核准後接入。",
  },
];

const weekdayFormatter = new Intl.DateTimeFormat("zh-TW", {
  weekday: "short",
});

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  month: "numeric",
  day: "numeric",
});

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(date.getDate() + amount);
  return next;
}

let weatherProfiles = fallbackWeatherProfiles;

function renderWeather(cityKey) {
  const profile = weatherProfiles[cityKey];
  const today = new Date();
  const dates = profile.days.map((_, index) => addDays(today, index));
  const list = document.querySelector("#forecast-list");
  const city = document.querySelector("#weather-city");
  const note = document.querySelector("#weather-note");
  const range = document.querySelector("#weather-range");

  if (!list || !city || !note || !range) {
    return;
  }

  const rangeDates = profile.days.map((day, index) => {
    if (!Array.isArray(day) && day.date) {
      return new Date(`${day.date}T00:00:00`);
    }

    return dates[index];
  });

  city.textContent = profile.name;
  note.textContent = profile.note;
  range.textContent = `${dateFormatter.format(rangeDates[0])} - ${dateFormatter.format(rangeDates[rangeDates.length - 1])}`;

  list.innerHTML = profile.days
    .map((day, index) => {
      const normalizedDay = Array.isArray(day)
        ? {
            label: day[0],
            low: day[1],
            high: day[2],
            rain: day[3],
            icon: day[4],
            date: null,
          }
        : day;
      const date = normalizedDay.date ? new Date(`${normalizedDay.date}T00:00:00`) : dates[index];
      const rainText = Number.isFinite(normalizedDay.rain) ? `${normalizedDay.rain}%` : "暫無";
      const dayLabel = index === 0 ? "今天" : weekdayFormatter.format(date);
      return `
        <article class="forecast-card">
          <div class="date">${dayLabel} ${dateFormatter.format(date)}</div>
          <div class="icon" aria-hidden="true">${normalizedDay.icon}</div>
          <h3>${normalizedDay.label}</h3>
          <div class="temp">${normalizedDay.low}° - ${normalizedDay.high}°</div>
          <div class="rain">降雨 ${rainText}</div>
        </article>
      `;
    })
    .join("");
}

async function loadWeatherProfiles() {
  if (!document.querySelector("#forecast-list")) {
    return;
  }

  try {
    const response = await fetch("data/weather.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Weather data unavailable: ${response.status}`);
    }

    const data = await response.json();

    if (data?.cities?.taipei && data?.cities?.keelung) {
      weatherProfiles = data.cities;
      const activeCity = document.querySelector(".city-tab.active")?.dataset.city ?? "taipei";
      renderWeather(activeCity);
    }
  } catch (error) {
    console.info("Using fallback weather data.", error);
  }
}

function renderBusRoutes() {
  const busList = document.querySelector("#bus-list");

  if (!busList) {
    return;
  }

  busList.innerHTML = busRoutes
    .map((route) => {
      const stops = route.stops
        .map(
          (stop) => `
            <li>
              <span class="stop-dot" aria-hidden="true"></span>
              <span>${stop}</span>
            </li>
          `,
        )
        .join("");

      return `
        <article class="bus-card">
          <div>
            <p class="eyebrow">${route.id}</p>
            <h3>${route.title} ${route.direction}</h3>
          </div>
          <div class="bus-meta">
            <span>${route.operator}</span>
            <span>${route.tone}</span>
          </div>
          <ul class="stop-list">${stops}</ul>
          <p class="bus-note">${route.note}</p>
        </article>
      `;
    })
    .join("");
}

document.querySelectorAll(".city-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".city-tab").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    renderWeather(button.dataset.city);
  });
});

if (document.querySelector("#forecast-list")) {
  renderWeather("taipei");
  loadWeatherProfiles();
}

renderBusRoutes();
