const weatherProfiles = {
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
    tone: "跨區通勤",
    stops: ["舊庄", "中華科技大學", "南港展覽館", "內湖行政中心", "捷運劍南路站", "士林", "捷運石牌站"],
    note: "站點為版面示意稿，之後可依官方路線資料補齊雙向完整站序。",
  },
  {
    id: "red12",
    title: "紅12",
    direction: "科學教育館 ⇄ 捷運石牌站",
    operator: "中興巴士",
    tone: "士林石牌",
    stops: ["科學教育館", "士林高商", "蘭雅國中", "天母棒球場", "振興醫院", "榮總", "捷運石牌站"],
    note: "適合做成短線接駁資訊，搭配捷運石牌站轉乘提醒。",
  },
  {
    id: "red19",
    title: "紅19",
    direction: "天母 ⇄ 捷運石牌站",
    operator: "示意資料",
    tone: "天母石牌",
    stops: ["天母", "天母國小", "天母廣場", "振興醫院", "榮總", "石牌國中", "捷運石牌站"],
    note: "先保留常用站點，下一版可加入方向切換與首末班資訊。",
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

function renderWeather(cityKey) {
  const profile = weatherProfiles[cityKey];
  const today = new Date();
  const dates = profile.days.map((_, index) => addDays(today, index));
  const list = document.querySelector("#forecast-list");

  document.querySelector("#weather-city").textContent = profile.name;
  document.querySelector("#weather-note").textContent = profile.note;
  document.querySelector("#weather-range").textContent = `${dateFormatter.format(dates[0])} - ${dateFormatter.format(dates[6])}`;

  list.innerHTML = profile.days
    .map(([label, low, high, rain, icon], index) => {
      const date = dates[index];
      const dayLabel = index === 0 ? "今天" : weekdayFormatter.format(date);
      return `
        <article class="forecast-card">
          <div class="date">${dayLabel} ${dateFormatter.format(date)}</div>
          <div class="icon" aria-hidden="true">${icon}</div>
          <h3>${label}</h3>
          <div class="temp">${low}° - ${high}°</div>
          <div class="rain">降雨 ${rain}%</div>
        </article>
      `;
    })
    .join("");
}

function renderBusRoutes() {
  const busList = document.querySelector("#bus-list");

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

renderWeather("taipei");
renderBusRoutes();
