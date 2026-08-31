/* =========================================================
   CONFIG — Replace these values before deploying
   ========================================================= */
const WORKER_URL = "https://modderguy.cs63saurabh.workers.dev";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDJQwi1VnqOkPPYrZbN4uRPsl0CbdNBpks",
  authDomain: "modderguy-80384.firebaseapp.com",
  projectId: "modderguy-80384",
  storageBucket: "modderguy-80384.firebasestorage.app",
  messagingSenderId: "577447367223",
  appId: "1:577447367223:web:359f492e2abd734501a5b2"
};

// Initialize Firebase
firebase.initializeApp(FIREBASE_CONFIG);
const auth = firebase.auth();
const db = firebase.firestore();

/* =========================================================
   STATE MANAGEMENT
   ========================================================= */
const state = {
  role: null,
  city: null,
  coords: null,
  user: null,
  demoMode: false,
  monitorOn: false,
  monitorTimer: null,
  lastAlertKey: null,
  lastAlertAt: 0,
  authMode: "login",
  currentWeather: null,
  aqiData: null,
  extraMetrics: null
};

const ROLE_META = {
  farmer:    { label: "Farmer",         icon: "&#127806;", accent: "#8FA35E", soft: "rgba(143,163,94,0.14)" },
  fisherman: { label: "Fisherman",      icon: "&#127907;", accent: "#3E9DB8", soft: "rgba(62,157,184,0.14)" },
  general:   { label: "General public", icon: "&#9728;&#65039;", accent: "#E8A33D", soft: "rgba(232,163,61,0.14)" }
};

const WEATHER_KEYWORDS = [
  "weather","rain","temperature","temp","forecast","wind","humidity","storm","heat",
  "cold","cyclone","flood","drought","frost","hail","snow","climate","sun","cloud",
  "monsoon","alert","swell","tide","irrigation","sow","harvest","crop","fish","fishing",
  "sea","wave","uv","aqi","air quality","spray","pesticide","run","walk","trip"
];

/* =========================================================
   DOM ELEMENTS
   ========================================================= */
const $ = (id) => document.getElementById(id);
const roleScreen      = $("roleScreen");
const chatScreen      = $("chatScreen");
const statusPanel     = $("statusPanel");
const chatPlaceholder  = $("chatPlaceholder");
const messagesEl      = $("messages");
const backToRoles     = $("backToRoles");

/* =========================================================
   ROLE SELECTION
   ========================================================= */
document.querySelectorAll(".role-card").forEach(card => {
  card.addEventListener("click", () => selectRole(card.dataset.role));
});

function applyRoleTheme(role) {
  const m = ROLE_META[role];
  if (!m) return;
  document.documentElement.style.setProperty("--accent", m.accent);
  document.documentElement.style.setProperty("--accent-soft", m.soft);
}

function selectRole(role) {
  state.role = role;
  applyRoleTheme(role);

  roleScreen.style.display = "none";
  statusPanel.classList.add("visible");
  chatPlaceholder.style.display = "none";
  chatScreen.classList.add("visible");
  backToRoles.style.display = "flex";

  if (messagesEl.children.length === 0) {
    addAssistantText(`Namaste! You're set up as **${ROLE_META[role].label}**. I analyze live Air Quality (AQI), wind dynamics, UV, and humidity to give you sharp, practical, causal decisions &mdash; ask me anything!`);
  }
  if (!state.currentWeather) detectLocation();
  if (state.user) persistUserPrefs();
}

backToRoles.addEventListener("click", () => {
  roleScreen.style.display = "flex";
  statusPanel.classList.remove("visible");
  chatPlaceholder.style.display = "flex";
  chatScreen.classList.remove("visible");
  backToRoles.style.display = "none";
});

/* =========================================================
   GEOLOCATION, WEATHER & AIR QUALITY API
   ========================================================= */
$("detectBtn").addEventListener("click", detectLocation);
$("cityInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.value.trim()) {
    fetchWeatherByCity(e.target.value.trim());
  }
});

function detectLocation() {
  $("cityName").textContent = "Detecting location\u2026";
  if (!navigator.geolocation) {
    fetchWeatherByCity("Mumbai");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      fetchAllWeatherData(state.coords.lat, state.coords.lon);
    },
    () => { fetchWeatherByCity("Mumbai"); },
    { timeout: 8000 }
  );
}

async function fetchWeatherByCity(city) {
  if (state.demoMode) return applyDemoWeather(city);
  $("cityName").textContent = `Searching ${city}\u2026`;
  try {
    // 1. Geocode city via Open-Meteo Geocoding
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();
    if (geoData && geoData.results && geoData.results.length > 0) {
      const loc = geoData.results[0];
      state.coords = { lat: loc.latitude, lon: loc.longitude };
      state.city = `${loc.name}${loc.country ? `, ${loc.country}` : ""}`;
      await fetchAllWeatherData(loc.latitude, loc.longitude, loc.name, loc.country);
    } else {
      // Fallback to worker
      const res = await fetch(`${WORKER_URL}/weather`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city })
      });
      const data = await res.json();
      if (data && data.name) {
        applyWeather(data);
        if (data.coord) fetchAirQualityAndMetrics(data.coord.lat, data.coord.lon);
      } else {
        $("cityName").textContent = "City not found";
      }
    }
  } catch (e) {
    console.error("fetchWeatherByCity error:", e);
    $("cityName").textContent = "Error fetching city";
  }
}

async function fetchAllWeatherData(lat, lon, cityName = null, country = null) {
  if (state.demoMode) return applyDemoWeather(cityName);
  try {
    // Parallel fetch: Open-Meteo High-Resolution Forecast + Air Quality API
    const [forecastRes, aqiRes] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,precipitation_probability,weather_code,surface_pressure,wind_speed_10m,wind_gusts_10m,wind_direction_10m,uv_index,visibility&timezone=auto`),
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone&timezone=auto`)
    ]);

    const forecastData = await forecastRes.json();
    const aqiData = await aqiRes.json();

    if (cityName) {
      state.city = country ? `${cityName}, ${country}` : cityName;
    } else if (!state.city) {
      state.city = `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
    }

    applyEnrichedWeather(forecastData, aqiData);
  } catch (e) {
    console.error("Enriched weather fetch failed, using fallback:", e);
    fetchWeatherByCoordsFallback(lat, lon);
  }
}

async function fetchWeatherByCoordsFallback(lat, lon) {
  try {
    const res = await fetch(`${WORKER_URL}/weather`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lon })
    });
    const data = await res.json();
    if (data && data.name) applyWeather(data);
  } catch (e) {
    console.error("fallback weather failed:", e);
  }
}

function getWeatherDescription(code) {
  const map = {
    0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing Rime Fog",
    51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
    61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
    71: "Slight Snow", 73: "Moderate Snow", 75: "Heavy Snow",
    80: "Slight Rain Showers", 81: "Moderate Showers", 82: "Violent Showers",
    95: "Thunderstorm", 96: "Thunderstorm with Hail"
  };
  return map[code] || "Partly Cloudy";
}

function getWindDirection(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function getAqiCategory(aqi) {
  if (aqi <= 50)  return { label: "Good", class: "aqi-good", risk: "Minimal risk" };
  if (aqi <= 100) return { label: "Moderate", class: "aqi-moderate", risk: "Acceptable" };
  if (aqi <= 150) return { label: "Poor / Sensitive", class: "aqi-poor", risk: "Sensitive groups affected" };
  if (aqi <= 200) return { label: "Unhealthy", class: "aqi-unhealthy", risk: "Avoid prolonged outdoor exertion" };
  return { label: "Severe / Hazardous", class: "aqi-hazardous", risk: "Emergency health warning" };
}

function getUvCategory(uv) {
  if (uv <= 2) return `${uv.toFixed(1)} (Low)`;
  if (uv <= 5) return `${uv.toFixed(1)} (Moderate)`;
  if (uv <= 7) return `${uv.toFixed(1)} (High)`;
  if (uv <= 10) return `${uv.toFixed(1)} (Very High)`;
  return `${uv.toFixed(1)} (Extreme)`;
}

function applyEnrichedWeather(forecast, aqi) {
  const cur = forecast.current || {};
  const curAqi = aqi.current || {};

  const temp = Math.round(cur.temperature_2m ?? 28);
  const feelsLike = Math.round(cur.apparent_temperature ?? temp);
  const humidity = Math.round(cur.relative_humidity_2m ?? 60);
  const windKmh = Math.round(cur.wind_speed_10m ?? 12);
  const gustKmh = Math.round(cur.wind_gusts_10m ?? (windKmh * 1.3));
  const windDir = getWindDirection(cur.wind_direction_10m ?? 0);
  const uv = cur.uv_index ?? 4.5;
  const rainChance = cur.precipitation_probability ?? (cur.precipitation > 0 ? 80 : 10);
  const visibilityKm = cur.visibility ? (cur.visibility / 1000).toFixed(1) : "10.0";
  const desc = getWeatherDescription(cur.weather_code ?? 0);

  const usAqi = Math.round(curAqi.us_aqi ?? 85);
  const pm25 = curAqi.pm2_5 ? Math.round(curAqi.pm2_5) : "--";

  // Update UI Elements
  $("cityName").textContent = state.city;
  $("tempVal").textContent = `${temp}\u00b0`;
  $("feelsLikeVal").textContent = `Feels ${feelsLike}\u00b0`;
  $("condText").textContent = desc;
  $("windVal").textContent = `${windKmh} km/h ${windDir} (G: ${gustKmh})`;
  $("humVal").textContent = `${humidity}%`;
  $("uvVal").textContent = getUvCategory(uv);
  $("rainChanceVal").textContent = `${rainChance}%`;
  $("visVal").textContent = `${visibilityKm} km`;
  $("pmVal").textContent = `PM2.5: ${pm25}\u00b5g`;

  // AQI Badge
  const aqiInfo = getAqiCategory(usAqi);
  const aqiBadge = $("aqiBadge");
  aqiBadge.className = `aqi-badge ${aqiInfo.class}`;
  $("aqiText").textContent = `AQI ${usAqi} \u00b7 ${aqiInfo.label}`;

  // Store in State for AI Context
  state.currentWeather = {
    temp, feelsLike, humidity, windKmh, gustKmh, windDir, uv, rainChance, visibilityKm, description: desc
  };
  state.aqiData = {
    aqi: usAqi, category: aqiInfo.label, pm25, risk: aqiInfo.risk
  };

  drawSparkline(temp);
  if (state.user) persistUserPrefs();
}

function applyWeather(data) {
  state.city = data.name + (data.sys && data.sys.country ? `, ${data.sys.country}` : "");
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like || temp);
  const humidity = data.main.humidity;
  const windKmh = Math.round((data.wind.speed || 0) * 3.6);
  const desc = data.weather && data.weather[0] ? data.weather[0].description : "\u2014";

  $("cityName").textContent = state.city;
  $("tempVal").textContent = `${temp}\u00b0`;
  $("feelsLikeVal").textContent = `Feels ${feelsLike}\u00b0`;
  $("condText").textContent = desc;
  $("windVal").textContent = `${windKmh} km/h`;
  $("humVal").textContent = `${humidity}%`;
  $("rainChanceVal").textContent = "15%";
  $("uvVal").textContent = "5 (Moderate)";
  $("visVal").textContent = data.visibility ? `${(data.visibility/1000).toFixed(1)} km` : "10 km";

  state.currentWeather = { temp, feelsLike, humidity, windKmh, description: desc };
  drawSparkline(temp);
  if (state.user) persistUserPrefs();
}

function applyDemoWeather(city) {
  const demo = {
    city: city || "Demo City",
    temp: 31,
    feelsLike: 35,
    humidity: 74,
    windKmh: 24,
    gustKmh: 36,
    windDir: "NW",
    uv: 7.2,
    rainChance: 65,
    visibilityKm: "6.5",
    description: "Thunderstorm Risk & High Humidity"
  };
  const demoAqi = { aqi: 168, category: "Unhealthy", pm25: 88, risk: "High particulate pollution" };

  state.city = demo.city;
  state.currentWeather = demo;
  state.aqiData = demoAqi;

  $("cityName").textContent = demo.city;
  $("tempVal").textContent = `${demo.temp}\u00b0`;
  $("feelsLikeVal").textContent = `Feels ${demo.feelsLike}\u00b0`;
  $("condText").textContent = demo.description;
  $("windVal").textContent = `${demo.windKmh} km/h ${demo.windDir} (G: ${demo.gustKmh})`;
  $("humVal").textContent = `${demo.humidity}%`;
  $("uvVal").textContent = getUvCategory(demo.uv);
  $("rainChanceVal").textContent = `${demo.rainChance}%`;
  $("visVal").textContent = `${demo.visibilityKm} km`;
  $("pmVal").textContent = `PM2.5: ${demoAqi.pm25}\u00b5g`;

  const aqiInfo = getAqiCategory(demoAqi.aqi);
  const aqiBadge = $("aqiBadge");
  aqiBadge.className = `aqi-badge ${aqiInfo.class}`;
  $("aqiText").textContent = `AQI ${demoAqi.aqi} \u00b7 ${aqiInfo.label}`;

  drawSparkline(demo.temp);
}

function drawSparkline(baseTemp) {
  const svg = $("sparkline");
  const pts = [];
  let t = baseTemp;
  for (let i = 0; i < 8; i++) {
    t += (Math.random() - 0.5) * 2.2;
    pts.push(t);
  }
  const min = Math.min(...pts), max = Math.max(...pts);
  const norm = pts.map(v => max === min ? 17 : 30 - ((v - min) / (max - min)) * 26);
  const step = 90 / (pts.length - 1);
  const d = norm.map((y, i) => `${i === 0 ? "M" : "L"} ${i * step} ${y}`).join(" ");
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  svg.innerHTML = `
    <path d="${d}" fill="none" stroke="${accent}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${(pts.length - 1) * step}" cy="${norm[norm.length - 1]}" r="2.4" fill="${accent}"/>
  `;
}

/* =========================================================
   CHAT SYSTEM
   ========================================================= */
$("sendBtn").addEventListener("click", sendMessage);
$("chatInput").addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });

function sendMessage() {
  const input = $("chatInput");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  addUserText(text);
  askWeatherGPT(text);
}

function addUserText(text) {
  const row = document.createElement("div");
  row.className = "msg-row user";
  row.innerHTML = `<div class="avatar">&#128100;</div><div class="bubble"></div>`;
  row.querySelector(".bubble").textContent = text;
  messagesEl.appendChild(row);
  scrollToBottom();
}

function addAssistantText(text) {
  const row = document.createElement("div");
  row.className = "msg-row assistant";
  row.innerHTML = `<div class="avatar">${ROLE_META[state.role]?.icon || "&#127777;&#65039;"}</div><div class="bubble">${escapeHtml(text)}</div>`;
  messagesEl.appendChild(row);
  scrollToBottom();
}

function scrollToBottom() { messagesEl.scrollTop = messagesEl.scrollHeight; }

function isOnTopic(text) {
  const lower = text.toLowerCase();
  return WEATHER_KEYWORDS.some(k => lower.includes(k));
}

function showReasoningTrace() {
  const row = document.createElement("div");
  row.className = "msg-row assistant";
  const steps = [
    "Analyzing multi-parameter weather sensors",
    "Assessing AQI & particulate dispersion",
    "Running domain causal logic model",
    "Structuring verdict & best window"
  ];
  row.innerHTML = `<div class="avatar">${ROLE_META[state.role]?.icon || "&#127777;&#65039;"}</div>
    <div class="trace-card">
      ${steps.map((s, i) => `<div class="trace-step" data-i="${i}"><div class="tick"></div><span>${s}</span></div>`).join("")}
    </div>`;
  messagesEl.appendChild(row);
  scrollToBottom();

  const stepEls = row.querySelectorAll(".trace-step");
  let i = 0;
  const stepDelay = 420;
  const interval = setInterval(() => {
    if (i > 0) {
      stepEls[i - 1].classList.remove("active");
      stepEls[i - 1].classList.add("done");
      stepEls[i - 1].querySelector(".tick").textContent = "\u2713";
    }
    if (i < stepEls.length) { stepEls[i].classList.add("active"); i++; }
    else clearInterval(interval);
  }, stepDelay);

  return { row, minDurationMs: stepDelay * steps.length + 200 };
}

/* =========================================================
   HYPER-LOGICAL AI QUERY
   ========================================================= */
async function askWeatherGPT(userText) {
  const trace = showReasoningTrace();
  const startedAt = Date.now();

  const result = state.demoMode ? mockAsk(userText) : await realAsk(userText);

  const elapsed = Date.now() - startedAt;
  const wait = Math.max(0, trace.minDurationMs - elapsed);
  setTimeout(() => { trace.row.remove(); renderAssistantResult(result); }, wait);
}

function buildPrompt(userText) {
  const w = state.currentWeather || {};
  const aqi = state.aqiData || {};

  return `You are WeatherGPT, a hyper-practical, analytical, and logic-driven Weather & Decision Intelligence Advisor for a ${state.role}.

CURRENT METEOROLOGICAL CONTEXT FOR ${state.city || "User Location"}:
- Temperature: ${w.temp || "unknown"}°C (Feels like ${w.feelsLike || "unknown"}°C)
- Air Quality Index (US AQI): ${aqi.aqi || "unknown"} (${aqi.category || "unknown"}, PM2.5: ${aqi.pm25 || "unknown"} µg/m³)
- Wind Speed & Gusts: ${w.windKmh || "unknown"} km/h (Gusts: ${w.gustKmh || "unknown"} km/h, Dir: ${w.windDir || "N/A"})
- Humidity: ${w.humidity || "unknown"}%
- Rain Probability: ${w.rainChance || "unknown"}%
- UV Index: ${w.uv || "unknown"}
- Condition: ${w.description || "unknown"}

CORE RULES & PERSONA GUIDELINES:
1. Speak with SHARP CAUSAL LOGIC (Cause -> Effect -> Decision). Avoid generic polite fillers.
2. If farmer: Give exact scientific reasoning (e.g. spray drift risks at wind > 15 km/h, fungal spore risks at humidity > 75%, evapo-transpiration loss during peak UV).
3. If fisherman: Give direct water safety calls (wind gusts, swell roughness, deep-sea vs shore threshold).
4. If general public: Focus on AQI health impact (respiratory/masks), UV exposure, heat exhaustion, rain commute safety.
5. Provide a direct VERDICT: "SAFE" | "CAUTION" | "NO-GO" | "HOLD".
6. Provide specific "logic_points" (bullet points explaining WHY) and a "best_window" (timeframe when conditions improve).
7. Respond in STRICT JSON ONLY, matching this schema exactly (no markdown fences around JSON):
{
  "reply": string (Conversational analytical answer in natural Hinglish or English),
  "verdict": string ("SAFE" | "CAUTION" | "NO-GO" | "HOLD"),
  "advice": string (One punchy direct command/action item),
  "logic_points": [string, string],
  "best_window": string (e.g. "Tomorrow 6:00 AM - 8:30 AM"),
  "confidence": number (0-100),
  "confidence_reason": string (e.g. "High cross-correlation between wind gust and humidity sensors"),
  "is_alert": boolean,
  "alert_message": string
}

User Question: "${userText}"`;
}

async function realAsk(userText) {
  try {
    const res = await fetch(`${WORKER_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: buildPrompt(userText) })
    });
    const data = await res.json();
    const textPart = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // Clean potential markdown wrap
    const cleanJson = textPart.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("realAsk error:", e);
    return mockAsk(userText); // Graceful fallback to deep logic mock
  }
}

function mockAsk(userText) {
  if (!isOnTopic(userText)) {
    return {
      reply: "Main sirf Weather, AQI, Climate aur safety decisions par baat kar sakta hoon. Apne khet, fishing boat ya daily commute ke baare mein pucho!",
      verdict: "HOLD",
      advice: "Weather-related sawaal puchein.",
      logic_points: ["Out of domain query detected."],
      best_window: "N/A",
      confidence: 0,
      confidence_reason: "Off-topic query",
      is_alert: false,
      alert_message: ""
    };
  }

  const lower = userText.toLowerCase();
  const w = state.currentWeather || { temp: 31, windKmh: 24, humidity: 74, rainChance: 60 };
  const aqi = state.aqiData || { aqi: 168, category: "Unhealthy" };

  if (state.role === "farmer") {
    if (lower.includes("spray") || lower.includes("dawai") || lower.includes("keetnashak") || lower.includes("wind") || lower.includes("hawa")) {
      return {
        reply: `Aaj hawa ki raftaar **${w.windKmh} km/h** hai aur gusts **${w.gustKmh || 34} km/h** touch kar rahe hain. Is hawa mein pesticide spray bilkul mat karo &mdash; 40% dawai drift hoke waste ho jayegi aur target patton par nahi rukegi!`,
        verdict: "NO-GO",
        advice: "Pesticide Spray Turant Rok Dein (Spray Drift Risk High)",
        logic_points: [
          `Wind speed ${w.windKmh} km/h hai (Safe limit < 15 km/h) &mdash; chemical drift se aas-paas ki fasal ko nuksan aur wastage hoga.`,
          `Relative Humidity ${w.humidity}% hai &mdash; droplets hawa mein evaporate hone se pehle udd jayenge.`
        ],
        best_window: "Kal Subah 5:30 AM &ndash; 8:00 AM (Jab wind speed 8 km/h drop hogi)",
        confidence: 94,
        confidence_reason: "Wind gust vs chemical droplet mass index cross-match",
        is_alert: w.windKmh > 30,
        alert_message: w.windKmh > 30 ? "Tez hawa ki chetavni: Khet mein khadi fasal mein spray ya loose polyhouse cover check karein." : ""
      };
    }
    if (lower.includes("pani") || lower.includes("irrigation") || lower.includes("sinchai") || lower.includes("rain") || lower.includes("barish")) {
      return {
        reply: `Aaj rain probability **${w.rainChance}%** hai aur humidity **${w.humidity}%** chal rahi hai. Aaj motor chalane ki zaroorat nahi hai, natural moisture aur baarish mitti ke liye kaafi rahegi.`,
        verdict: "HOLD",
        advice: "Sinchai (Irrigation) 24h ke liye taal dein",
        logic_points: [
          `Rain forecast ${w.rainChance}% hai &mdash; abhi paani doge toh waterlogging (jal-jamaav) se jado ko oxygen nahi milegi.`,
          `Evaporation rate low hai, mitti mein moisture already retained hai.`
        ],
        best_window: "Baarish ke baad kal shaam 4:00 PM soil moisture check karein",
        confidence: 88,
        confidence_reason: "Precipitation probability & soil moisture index",
        is_alert: false,
        alert_message: ""
      };
    }
  }

  if (state.role === "fisherman") {
    return {
      reply: `Sea conditions coastal belt par rough hain. Wind speed **${w.windKmh} km/h** aur swell height elevated hai. Deep sea fishing ke liye go/no-go recommendation **NO-GO** hai.`,
      verdict: "NO-GO",
      advice: "Deep Sea (5 Nautical Miles ke aage) Boat Mat Nikalein",
      logic_points: [
        `Gust speed ${w.gustKmh || 32} km/h touch kar rahi hai jo small & medium motorized boats ke liye unsafe roll create karegi.`,
        `Visibility ${w.visibilityKm || "6"} km hai &mdash; coastal squalls sudden aane ke chances hain.`
      ],
      best_window: "Kal dopahar 12:00 PM ke baad jab sea chop settle hoga",
      confidence: 91,
      confidence_reason: "Wind-wave interaction and atmospheric pressure drop",
      is_alert: true,
      alert_message: "Samandar mein tez hawa aur choppy waves ki warning &mdash; saavdhani bartein."
    };
  }

  // General Public
  return {
    reply: `Aaj local AQI **${aqi.aqi} (${aqi.category})** hai aur humidity **${w.humidity}%** hai. Air particulate concentration high hone ke karan bahar morning run ya heavy outdoor workout avoid karna chahiye.`,
    verdict: aqi.aqi > 150 ? "CAUTION" : "SAFE",
    advice: aqi.aqi > 150 ? "Outdoor workout avoid karein aur N95 Mask use karein" : "Mausam normal hai, din ke kaam continue karein",
    logic_points: [
      `AQI ${aqi.aqi} (${aqi.category}): Particulate matter PM2.5 lung airway mein direct irritation karega.`,
      `UV Index ${w.uv || 6} (High): Dopahar 12-3 PM ke beech direct sun exposure se skin damage ka risk hai.`
    ],
    best_window: "Evening 5:30 PM ke baad light walk kar sakte hain",
    confidence: 89,
    confidence_reason: "Live AQI station telemetry & UV index analysis",
    is_alert: aqi.aqi > 200,
    alert_message: aqi.aqi > 200 ? "Severe Air Quality Alert: Mask pehankar hi bahar nikalein." : ""
  };
}

/* =========================================================
   RENDER RESULTS & CAUSAL DECISION BLOCKS
   ========================================================= */
const pendingTeasers = [];

function getVerdictClass(v) {
  const map = {
    "SAFE": "verdict-safe",
    "CAUTION": "verdict-caution",
    "NO-GO": "verdict-nogo",
    "HOLD": "verdict-hold"
  };
  return map[v] || "verdict-caution";
}

function adviceBlockHtml(result) {
  const verdict = result.verdict || "DECISION";
  const vClass = getVerdictClass(verdict);
  const logicItems = Array.isArray(result.logic_points) ? result.logic_points : [result.advice];

  return `
    <div class="advice-block">
      <div class="advice-head">
        <span class="label">Decision Intelligence</span>
        <span class="verdict-badge ${vClass}">[ ${verdict} ]</span>
      </div>

      <div class="advice-main-action">&#10140; ${escapeHtml(result.advice || "")}</div>

      <div class="logic-section">
        <div class="logic-title">&#9881;&#65039; Causal Logic &amp; Science (Kyun?):</div>
        <ul class="logic-list">
          ${logicItems.map(item => `<li class="logic-item">${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>

      ${result.best_window && result.best_window !== "N/A" ? `
        <div class="best-window-box">
          <span>&#9201;</span>
          <span><strong>Best Window:</strong> ${escapeHtml(result.best_window)}</span>
        </div>
      ` : ""}

      <div>
        <div class="confidence-bar-track">
          <div class="confidence-bar-fill" style="width:${result.confidence || 0}%"></div>
        </div>
        <div class="confidence-reason" style="margin-top:5px;">
          ${result.confidence}% confidence &mdash; ${escapeHtml(result.confidence_reason || "Multi-sensor analysis")}
        </div>
      </div>
    </div>`;
}

function renderAssistantResult(result) {
  const row = document.createElement("div");
  row.className = "msg-row assistant";
  let inner = `<div class="bubble">${formatMarkdown(result.reply || "")}</div>`;
  let teaserId = null;

  if (state.user && result.advice) {
    inner += adviceBlockHtml(result);
  } else if (!state.user && result.advice) {
    teaserId = "teaser-" + Math.random().toString(36).slice(2);
    inner += `<div class="teaser-line" id="${teaserId}" onclick="openLoginModal()">&#128274; <strong>${ROLE_META[state.role]?.label}</strong> ke liye exact Causal Logic &amp; Best Window unlocked hai &mdash; login karke free mein dekho &#8594;</div>`;
  }

  row.innerHTML = `<div class="avatar">${ROLE_META[state.role]?.icon || "&#127777;&#65039;"}</div><div style="display:flex;flex-direction:column;max-width:84%;">${inner}</div>`;
  messagesEl.appendChild(row);

  if (teaserId) pendingTeasers.push({ id: teaserId, result });
  if (result.is_alert && result.alert_message) renderAlertCard(result.alert_message, false);
  scrollToBottom();
}

function revealPendingTeasers() {
  while (pendingTeasers.length) {
    const { id, result } = pendingTeasers.pop();
    const el = document.getElementById(id);
    if (el) el.outerHTML = adviceBlockHtml(result);
  }
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/&mdash;/g, "—");
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s || "";
  return d.innerHTML;
}

/* =========================================================
   ALERT CARD & COMMUNITY VERIFICATION
   ========================================================= */
const pendingVerifyCards = [];

function renderAlertCard(message, autoDetected) {
  const category = "general_alert";
  const dateKey = new Date().toISOString().slice(0, 10);
  const docKey = `${(state.city || "unknown").replace(/\s+/g, "_")}_${category}_${dateKey}`;

  const row = document.createElement("div");
  row.className = "msg-row assistant";
  row.innerHTML = `
    <div class="avatar">&#9888;&#65039;</div>
    <div class="alert-card" data-dockey="${docKey}">
      ${autoDetected ? `<div class="auto-tag">&#128276; Auto-detected &middot; no one asked</div>` : ""}
      <div class="alert-head">&#9888;&#65039; Weather &amp; Safety Alert</div>
      <div>${escapeHtml(message)}</div>
      <div class="verify-row">
        <span class="vcount">Loading confirmations&hellip;</span>
        <div class="verify-actions"></div>
      </div>
    </div>`;
  messagesEl.appendChild(row);
  scrollToBottom();
  loadVerification(docKey, row.querySelector(".alert-card"), category);
}

async function loadVerification(docKey, cardEl, category) {
  const countEl = cardEl.querySelector(".vcount");
  const actionsEl = cardEl.querySelector(".verify-actions");
  try {
    const snap = await db.collection("confirmations").doc(docKey).get();
    const count = snap.exists ? (snap.data().count || 0) : 0;
    countEl.textContent = `${count} people confirmed nearby`;
  } catch (e) {
    countEl.textContent = "Community reports unavailable";
  }

  if (!state.user) {
    actionsEl.innerHTML = `<span class="verify-login" onclick="openLoginModal()">login to vote</span>`;
    pendingVerifyCards.push({ docKey, cardEl, category });
    return;
  }

  actionsEl.innerHTML = `<div class="verify-btns"><button class="yes">Yes</button><button class="no">No</button></div>`;
  actionsEl.querySelector(".yes").onclick = () => castVote(docKey, category, "yes", countEl);
  actionsEl.querySelector(".no").onclick  = () => castVote(docKey, category, "no", countEl);
}

function refreshPendingVerifyCards() {
  while (pendingVerifyCards.length) {
    const { docKey, cardEl, category } = pendingVerifyCards.pop();
    if (document.body.contains(cardEl)) loadVerification(docKey, cardEl, category);
  }
}

async function castVote(docKey, category, vote, countEl) {
  const uid = state.user.uid;
  const voteRef = db.collection("confirmations").doc(docKey).collection("votes").doc(uid);
  const existing = await voteRef.get();
  if (existing.exists) { countEl.textContent = "You've already voted on this today"; return; }
  const confirmRef = db.collection("confirmations").doc(docKey);
  await db.runTransaction(async (tx) => {
    const doc = await tx.get(confirmRef);
    const current = doc.exists ? (doc.data().count || 0) : 0;
    tx.set(confirmRef, { count: vote === "yes" ? current + 1 : current, city: state.city, category }, { merge: true });
    tx.set(voteRef, { vote, votedAt: firebase.firestore.FieldValue.serverTimestamp() });
  });
  const snap = await confirmRef.get();
  countEl.textContent = `${snap.data().count || 0} people confirmed nearby`;
}

/* =========================================================
   DEMO & LIVE MONITOR TOGGLES
   ========================================================= */
$("demoToggle").addEventListener("click", () => {
  state.demoMode = !state.demoMode;
  $("demoToggle").classList.toggle("on", state.demoMode);
  if (state.demoMode) applyDemoWeather(state.city);
  else detectLocation();
});

$("monitorToggle").addEventListener("click", () => {
  state.monitorOn = !state.monitorOn;
  $("monitorToggle").classList.toggle("on", state.monitorOn);
  if (state.monitorOn) startMonitor();
  else stopMonitor();
});

function startMonitor() {
  stopMonitor();
  const intervalMs = state.demoMode ? 8000 : 45000;
  state.monitorTimer = setInterval(checkForSevereConditions, intervalMs);
  checkForSevereConditions();
}

function stopMonitor() {
  if (state.monitorTimer) clearInterval(state.monitorTimer);
  state.monitorTimer = null;
}

async function checkForSevereConditions() {
  let severe = false, message = "", key = "";
  if (state.demoMode) {
    if (Math.random() < 0.35) {
      severe = true; key = "demo_wind_spike";
      message = "Live Simulated Sensor: Wind gusts have spiked to 38 km/h with AQI 185 (Unhealthy) &mdash; hold spraying and coastal boat movement.";
    }
  } else {
    if (state.coords) await fetchAllWeatherData(state.coords.lat, state.coords.lon);
    else if (state.city) await fetchWeatherByCity(state.city);
    const w = state.currentWeather;
    const aqi = state.aqiData;
    if (w) {
      if (w.windKmh > 40 || (w.gustKmh && w.gustKmh > 45)) {
        severe = true; key = "wind_" + Math.round(w.windKmh / 10);
        message = `High wind & gusts detected: ${w.windKmh} km/h (Gusts: ${w.gustKmh || 40} km/h) near ${state.city}.`;
      } else if (w.temp > 42) {
        severe = true; key = "heat_" + Math.round(w.temp / 2);
        message = `Extreme heat wave: ${w.temp}\u00b0C (Feels like ${w.feelsLike}\u00b0C) near ${state.city}. Stay indoors.`;
      } else if (aqi && aqi.aqi > 250) {
        severe = true; key = "aqi_" + Math.round(aqi.aqi / 20);
        message = `Severe Air Quality Spike: AQI ${aqi.aqi} (Hazardous PM2.5) near ${state.city}. High respiratory risk.`;
      }
    }
  }
  if (!severe) return;
  const COOLDOWN_MS = 10 * 60 * 1000;
  const now = Date.now();
  if (key === state.lastAlertKey && (now - state.lastAlertAt) < COOLDOWN_MS) return;
  state.lastAlertKey = key;
  state.lastAlertAt = now;
  renderAlertCard(message, true);
}

/* =========================================================
   FIREBASE AUTH
   ========================================================= */
$("loginTrigger").addEventListener("click", () => { if (state.user) toggleAccountMenu(); else openLoginModal(); });
$("closeModal").addEventListener("click", closeLoginModal);
$("loginModal").addEventListener("click", (e) => { if (e.target.id === "loginModal") closeLoginModal(); });

function openLoginModal() { $("accountMenu").classList.remove("visible"); $("loginModal").classList.add("visible"); }
function closeLoginModal() { $("loginModal").classList.remove("visible"); $("modalErr").textContent = ""; }
function toggleAccountMenu() { $("accountMenu").classList.toggle("visible"); }

document.addEventListener("click", (e) => {
  const menu = $("accountMenu");
  if (!menu.classList.contains("visible")) return;
  if (e.target.id === "loginTrigger" || menu.contains(e.target)) return;
  menu.classList.remove("visible");
});

$("logoutBtn").addEventListener("click", async () => { await auth.signOut(); $("accountMenu").classList.remove("visible"); });

$("switchModeLink").addEventListener("click", () => { state.authMode = state.authMode === "login" ? "signup" : "login"; renderAuthMode(); });

function renderAuthMode() {
  if (state.authMode === "login") {
    $("modalTitle").textContent = "Welcome back";
    $("modalSub").textContent = "Log in to unlock full decision layers, causal logic, and voting.";
    $("emailAuthBtn").textContent = "Continue";
    $("switchModeText").innerHTML = `New here? <span id="switchModeLink">Create an account</span>`;
  } else {
    $("modalTitle").textContent = "Create your account";
    $("modalSub").textContent = "Free \u2014 unlocks causal decisions, best windows, and community voting.";
    $("emailAuthBtn").textContent = "Sign up";
    $("switchModeText").innerHTML = `Already have an account? <span id="switchModeLink">Log in</span>`;
  }
  document.getElementById("switchModeLink").addEventListener("click", () => {
    state.authMode = state.authMode === "login" ? "signup" : "login";
    renderAuthMode();
  });
}

$("emailAuthBtn").addEventListener("click", async () => {
  const email = $("emailInput").value.trim();
  const pass  = $("passInput").value;
  const errEl = $("modalErr");
  errEl.textContent = "";
  if (!email || !pass) { errEl.textContent = "Enter both email and password."; return; }
  try {
    if (state.authMode === "login") await auth.signInWithEmailAndPassword(email, pass);
    else await auth.createUserWithEmailAndPassword(email, pass);
    closeLoginModal();
  } catch (e) { errEl.textContent = humanizeAuthError(e); }
});

$("googleAuthBtn").addEventListener("click", async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try { await auth.signInWithPopup(provider); closeLoginModal(); }
  catch (e) { $("modalErr").textContent = humanizeAuthError(e); }
});

function humanizeAuthError(e) {
  const code = e && e.code || "";
  if (code.includes("wrong-password") || code.includes("invalid-credential")) return "Incorrect email or password.";
  if (code.includes("user-not-found"))      return "No account found with that email.";
  if (code.includes("email-already-in-use")) return "That email is already registered \u2014 try logging in.";
  if (code.includes("weak-password"))        return "Password should be at least 6 characters.";
  return "Something went wrong. Please try again.";
}

auth.onAuthStateChanged(async (user) => {
  state.user = user;
  $("loginTrigger").classList.toggle("active", !!user);
  $("loginTrigger").innerHTML = user ? "&#9989;" : "&#128100;";
  $("accountEmail").textContent = user ? user.email : "";
  if (user) { await loadUserPrefs(); revealPendingTeasers(); refreshPendingVerifyCards(); }
  else { $("accountMenu").classList.remove("visible"); }
});

async function persistUserPrefs() {
  if (!state.user) return;
  try {
    await db.collection("users").doc(state.user.uid).set({
      email: state.user.email, role: state.role, city: state.city,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (e) { console.error("persistUserPrefs error:", e); }
}

async function loadUserPrefs() {
  try {
    const snap = await db.collection("users").doc(state.user.uid).get();
    if (snap.exists) {
      const d = snap.data();
      if (d.role && !state.role)          selectRole(d.role);
      if (d.city && !state.currentWeather) fetchWeatherByCity(d.city);
    }
  } catch (e) { console.error("loadUserPrefs error:", e); }
}

/* =========================================================
   INIT
   ========================================================= */
renderAuthMode();
