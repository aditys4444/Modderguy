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
  "sea","wave","uv","aqi","air quality"
];

/* =========================================================
   DOM ELEMENTS
   ========================================================= */
const $ = (id) => document.getElementById(id);
const roleScreen     = $("roleScreen");
const chatScreen     = $("chatScreen");
const statusPanel    = $("statusPanel");
const chatPlaceholder = $("chatPlaceholder");
const messagesEl     = $("messages");
const backToRoles    = $("backToRoles");

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
    addAssistantText(`You're set up as ${ROLE_META[role].label}. Ask me anything about the weather \u2014 I'll frame it for your work.`);
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
   GEOLOCATION & WEATHER FETCHING
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
      fetchWeatherByCoords(state.coords.lat, state.coords.lon);
    },
    () => { fetchWeatherByCity("Mumbai"); },
    { timeout: 8000 }
  );
}

async function fetchWeatherByCoords(lat, lon) {
  if (state.demoMode) return applyDemoWeather();
  try {
    const res = await fetch(`${WORKER_URL}/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lon })
    });
    const data = await res.json();
    if (data && data.name) applyWeather(data);
  } catch (e) {
    console.error("fetchWeatherByCoords error:", e);
  }
}

async function fetchWeatherByCity(city) {
  if (state.demoMode) return applyDemoWeather(city);
  try {
    const res = await fetch(`${WORKER_URL}/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city })
    });
    const data = await res.json();
    if (data && data.name) {
      applyWeather(data);
    } else {
      $("cityName").textContent = "City not found";
    }
  } catch (e) {
    console.error("fetchWeatherByCity error:", e);
  }
}

function applyWeather(data) {
  state.city = data.name;
  state.currentWeather = data;
  $("cityName").textContent = data.name + (data.sys && data.sys.country ? `, ${data.sys.country}` : "");
  $("tempVal").textContent = Math.round(data.main.temp) + "\u00b0";
  $("condText").textContent = data.weather && data.weather[0] ? data.weather[0].description : "\u2014";
  $("humVal").textContent = data.main.humidity;
  $("windVal").textContent = Math.round((data.wind.speed || 0) * 3.6);
  drawSparkline(Math.round(data.main.temp));
  if (state.user) persistUserPrefs();
}

function applyDemoWeather(city) {
  const demo = {
    name: city || "Demo City",
    main: { temp: 29, humidity: 64 },
    wind: { speed: 3.6 },
    weather: [{ description: "partly cloudy" }],
    sys: { country: "IN" }
  };
  applyWeather(demo);
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
  row.innerHTML = `<div class="avatar">${ROLE_META[state.role]?.icon || "&#127777;&#65039;"}</div><div class="bubble"></div>`;
  row.querySelector(".bubble").textContent = text;
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
  const steps = ["Fetching live data", "Analyzing for your role", "Cross-referencing community reports", "Generating response"];
  row.innerHTML = `<div class="avatar">${ROLE_META[state.role]?.icon || "&#127777;&#65039;"}</div>
    <div class="trace-card">
      ${steps.map((s, i) => `<div class="trace-step" data-i="${i}"><div class="tick"></div><span>${s}</span></div>`).join("")}
    </div>`;
  messagesEl.appendChild(row);
  scrollToBottom();

  const stepEls = row.querySelectorAll(".trace-step");
  let i = 0;
  const stepDelay = 480;
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
   AI QUERY
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
  return `You are WeatherGPT, a weather-only assistant for a ${state.role}.
Current conditions for ${state.city || "the user's location"}: ${JSON.stringify(state.currentWeather ? {
    temp: state.currentWeather.main.temp,
    humidity: state.currentWeather.main.humidity,
    wind_kmh: Math.round((state.currentWeather.wind.speed || 0) * 3.6),
    condition: state.currentWeather.weather[0].description
  } : "unknown")}.

Rules:
- ONLY answer questions about weather, climate, forecasts, or weather-related safety.
- If the question is unrelated to weather, politely refuse and redirect the user back to weather topics.
- Tailor "advice" specifically to a ${state.role}'s decisions (e.g. irrigation timing for farmers, go/no-go for fishermen, what to carry for general public).
- Respond in strict JSON only, matching this schema exactly, no markdown fences:
{"reply": string, "advice": string, "confidence": number (0-100), "confidence_reason": string, "is_alert": boolean, "alert_message": string}

User message: "${userText}"`;
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
    return JSON.parse(textPart);
  } catch (e) {
    console.error("realAsk error:", e);
    return { reply: "Sorry, I couldn\u2019t reach the weather service. Try again in a moment.", advice: "", confidence: 0, confidence_reason: "", is_alert: false, alert_message: "" };
  }
}

function mockAsk(userText) {
  if (!isOnTopic(userText)) {
    return { reply: "I can only help with weather, climate, and forecast questions \u2014 ask me about rain, temperature, wind, or safety conditions.", advice: "", confidence: 0, confidence_reason: "", is_alert: false, alert_message: "" };
  }
  const lower = userText.toLowerCase();
  const adviceByRole = {
    farmer:    { rain: "Hold off on irrigation for the next 24h \u2014 expected rainfall covers it.", heat: "Irrigate early morning or evening to reduce evaporation loss.", wind: "Delay any pesticide spraying until wind drops below 15 km/h." },
    fisherman: { rain: "Sea conditions manageable, but watch for sudden squalls near the coast.", heat: "Good visibility expected \u2014 standard trip conditions.", wind: "Wind gusts above safe threshold \u2014 consider delaying departure." },
    general:   { rain: "Carry an umbrella and allow extra travel time.", heat: "Stay hydrated and avoid peak sun 12\u20133pm.", wind: "Secure loose outdoor items; light breeze otherwise fine." }
  };
  let category = "rain";
  if (lower.includes("heat") || lower.includes("hot") || lower.includes("temp")) category = "heat";
  if (lower.includes("wind") || lower.includes("storm") || lower.includes("cyclone")) category = "wind";
  const isAlert = category === "wind" && (lower.includes("storm") || lower.includes("cyclone"));
  return {
    reply: `Based on current conditions, expect ${category === "rain" ? "scattered rain" : category === "heat" ? "elevated temperatures" : "stronger winds"} today.`,
    advice: adviceByRole[state.role]?.[category] || "Follow standard daily precautions.",
    confidence: 72 + Math.floor(Math.random() * 20),
    confidence_reason: "Based on current local readings and short-range trend.",
    is_alert: isAlert,
    alert_message: isAlert ? "Strong wind conditions detected \u2014 exercise caution outdoors and near the coast." : ""
  };
}

/* =========================================================
   RENDER RESULTS
   ========================================================= */
const pendingTeasers = [];

function adviceBlockHtml(result) {
  return `
    <div class="advice-block">
      <div class="label">Your decision layer</div>
      <div>${escapeHtml(result.advice)}</div>
      <div class="confidence-bar-track"><div class="confidence-bar-fill" style="width:${result.confidence || 0}%"></div></div>
      <div class="confidence-reason">${result.confidence}% confidence \u2014 ${escapeHtml(result.confidence_reason || "")}</div>
    </div>`;
}

function renderAssistantResult(result) {
  const row = document.createElement("div");
  row.className = "msg-row assistant";
  let inner = `<div class="bubble">${escapeHtml(result.reply || "")}</div>`;
  let teaserId = null;

  if (state.user && result.advice) {
    inner += adviceBlockHtml(result);
  } else if (!state.user && result.advice) {
    teaserId = "teaser-" + Math.random().toString(36).slice(2);
    inner += `<div class="teaser-line" id="${teaserId}" onclick="openLoginModal()">&#128274; ${ROLE_META[state.role].label} ke liye ek specific decision hai \u2014 login karke free mein dekho &#8594;</div>`;
  }

  row.innerHTML = `<div class="avatar">${ROLE_META[state.role]?.icon || "&#127777;&#65039;"}</div><div style="display:flex;flex-direction:column;max-width:82%;">${inner}</div>`;
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
      <div class="alert-head">&#9888;&#65039; Weather Alert</div>
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
    if (Math.random() < 0.3) {
      severe = true; key = "demo_wind_spike";
      message = "Simulated: wind gusts have risen sharply in your area \u2014 small craft and outdoor work should take caution.";
    }
  } else {
    if (state.coords) await fetchWeatherByCoords(state.coords.lat, state.coords.lon);
    else if (state.city) await fetchWeatherByCity(state.city);
    const w = state.currentWeather;
    if (w) {
      const windKmh = (w.wind.speed || 0) * 3.6;
      if (windKmh > 40)    { severe = true; key = "wind_" + Math.round(windKmh / 10);   message = `High wind detected: ${Math.round(windKmh)} km/h near ${state.city}.`; }
      else if (w.main.temp > 42) { severe = true; key = "heat_" + Math.round(w.main.temp / 2); message = `Extreme heat detected: ${Math.round(w.main.temp)}\u00b0C near ${state.city}.`; }
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
    $("modalSub").textContent = "Log in to see your role-specific decisions, not just the forecast.";
    $("emailAuthBtn").textContent = "Continue";
    $("switchModeText").innerHTML = `New here? <span id="switchModeLink">Create an account</span>`;
  } else {
    $("modalTitle").textContent = "Create your account";
    $("modalSub").textContent = "Free \u2014 unlocks decisions, confidence scores, and community voting.";
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
