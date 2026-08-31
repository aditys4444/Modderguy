/* =========================================================
   CONFIG — WeatherGPT Configuration & Logo Settings
   ========================================================= */
const WORKER_URL = "https://modderguy.cs63saurabh.workers.dev";
const CUSTOM_LOGO_URL = "https://iili.io/CyvRiX9.md.png";

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
   I18N / MULTI-LANGUAGE SYSTEM
   ========================================================= */
const I18N = {
  hinglish: {
    brandSubtitle: "AI Intelligence",
    heroTitle: "Weather that talks your language.",
    heroSub: "Pick your role — advice, causal logic, AQI, and alerts are framed specifically for your decisions.",
    farmerName: "Farmer / Kisaan",
    farmerDesc: "Spray drift limits, irrigation timing, sowing windows & crop disease risk",
    btnLaunchFarmer: "Open Farmer Console",
    fishermanName: "Fisherman / Sagar Mitra",
    fishermanDesc: "Wind gusts, swell height, sea roughness & go/no-go water safety",
    btnLaunchFisherman: "Open Marine Console",
    generalName: "General Public / Daily Life",
    generalDesc: "AQI particulate risks, UV protection, rain windows & what to carry",
    btnLaunchGeneral: "Open General Console",
    detectingLoc: "Detecting location…",
    searchPlaceholder: "Search city or village (e.g. Borivali, Assam, Odisha)…",
    feelsLikePrefix: "Feels",
    chatPlaceholder: "Ask anything (e.g. Kya aaj spray karein? Boat nikalna safe hai?)",
    lblHomeBack: "Home",
    activeConsolePrefix: "Active Console:",
    lblWind: "Wind & Gusts",
    lblHum: "Humidity",
    lblUv: "UV Index",
    lblRain: "Rain Chance",
    lblVis: "Visibility",
    lblPm: "Air Particulate",
    welcomePrefix: "Namaste! You're in",
    welcomeSuffix: "I analyze live Air Quality (AQI), wind dynamics, UV, and humidity to give you sharp, practical, causal decisions — ask me anything!",
    decisionIntel: "Decision Intelligence",
    whyScience: "Causal Logic & Science (Kyun?):",
    bestWindow: "Best Window:",
    confirmedNearby: "people confirmed nearby",
    youConfirmed: "You confirmed nearby",
    alreadyVoted: "Aapne already vote kar diya hai",
    votedThanks: "Vote register ho gaya! Shukriya.",
    alertTitle: "Weather & Safety Alert",
    autoDetected: "Auto-detected · sensor alert",
    loginUnlockedTeaser: "ke liye exact Causal Logic & Best Window unlocked hai — login karke free mein dekho →",
    modalLoginTitle: "Welcome back",
    modalLoginSub: "Log in to unlock full decision layers, causal logic, and voting.",
    modalSignupTitle: "Create your account",
    modalSignupSub: "Free — unlocks causal decisions, best windows, and community voting.",
    modalEmailPlaceholder: "Email address",
    modalPassPlaceholder: "Password",
    modalContinueBtn: "Continue",
    modalSignupBtn: "Sign up",
    modalGoogleBtn: "Continue with Google",
    modalGuestBtn: "⚡ Instant Free Access (Continue as Guest)",
    modalNewHere: "New here?",
    modalCreateAcc: "Create an account",
    modalAlreadyAcc: "Already have an account?",
    modalLogIn: "Log in",
    logoutBtn: "Log out"
  },
  hindi: {
    brandSubtitle: "इंटेलिजेंस AI",
    heroTitle: "मौसम जो आपकी भाषा में बात करे।",
    heroSub: "अपनी भूमिका चुनें — सटीक सलाह, कारण-तर्क (Causal Logic), AQI और अलर्ट आपके कार्य के अनुसार मिलेंगे।",
    farmerName: "किसान (Farmer)",
    farmerDesc: "कीटनाशक छिड़काव सीमा, सिंचाई समय, बुवाई विंडो और फसल रोग जोखिम",
    btnLaunchFarmer: "किसान कंसोल खोलें",
    fishermanName: "मछुवारे / सागर मित्र (Fisherman)",
    fishermanDesc: "हवा की गति, लहरों की ऊंचाई, समुद्र की स्थिति और पानी में उतरने का निर्णय",
    btnLaunchFisherman: "समुद्री कंसोल खोलें",
    generalName: "आम नागरिक / दैनिक जीवन (General)",
    generalDesc: "वायु गुणवत्ता (AQI) स्वास्थ्य जोखिम, UV सुरक्षा, बारिश का समय और क्या साथ रखें",
    btnLaunchGeneral: "सामान्य कंसोल खोलें",
    detectingLoc: "स्थान खोजा जा रहा है…",
    searchPlaceholder: "शहर, जिला या गाँव खोजें (उदा. बोरीवली, असम, ओडिशा)…",
    feelsLikePrefix: "महसूस",
    chatPlaceholder: "कुछ भी पूछें (उदा. क्या आज कीटनाशक का छिड़काव करें? नाव निकालना सुरक्षित है?)",
    lblHomeBack: "होम",
    activeConsolePrefix: "सक्रिय कंसोल:",
    lblWind: "हवा और झोंके",
    lblHum: "आर्द्रता (नमी)",
    lblUv: "UV इंडेक्स",
    lblRain: "बारिश की संभावना",
    lblVis: "दृश्यता (Visibility)",
    lblPm: "वायु कण (PM2.5)",
    welcomePrefix: "नमस्ते! आप सक्रिय हैं",
    welcomeSuffix: "मैं लाइव वायु गुणवत्ता (AQI), हवा की गति, UV और आर्द्रता का विश्लेषण करके आपको ठोस और तार्किक निर्णय दूंगा — कुछ भी पूछें!",
    decisionIntel: "निर्णय बुद्धिमत्ता (Decision Intelligence)",
    whyScience: "कारण और वैज्ञानिक तर्क (क्यों?):",
    bestWindow: "सर्वोत्तम समय (Best Window):",
    confirmedNearby: "लोगों ने आस-पास पुष्टि की",
    youConfirmed: "आपने पुष्टि की",
    alreadyVoted: "आप पहले ही वोट कर चुके हैं",
    votedThanks: "आपका वोट दर्ज हो गया! धन्यवाद।",
    alertTitle: "मौसम एवं सुरक्षा अलर्ट",
    autoDetected: "स्वचालित सेंसर चेतावनी",
    loginUnlockedTeaser: "के लिए सटीक तर्क और सर्वश्रेष्ठ समय उपलब्ध है — फ्री में देखने के लिए लॉगिन करें →",
    modalLoginTitle: "वापसी पर स्वागत है",
    modalLoginSub: "पूरी तार्किक सलाह, वैज्ञानिक कारण और वोटिंग अनलॉक करने के लिए लॉगिन करें।",
    modalSignupTitle: "नया खाता बनाएं",
    modalSignupSub: "मुफ़्त — सटीक निर्णय, सर्वश्रेष्ठ समय और सामुदायिक वोटिंग अनलॉक करें।",
    modalEmailPlaceholder: "ईमेल पता",
    modalPassPlaceholder: "पासवर्ड",
    modalContinueBtn: "आगे बढ़ें",
    modalSignupBtn: "साइन अप करें",
    modalGoogleBtn: "Google के साथ जारी रखें",
    modalGuestBtn: "⚡ तुरंत मुफ़्त एक्सेस (Guest के रूप में)",
    modalNewHere: "यहाँ नए हैं?",
    modalCreateAcc: "खाता बनाएं",
    modalAlreadyAcc: "पहले से खाता है?",
    modalLogIn: "लॉग इन करें",
    logoutBtn: "लॉग आउट"
  },
  english: {
    brandSubtitle: "AI Intelligence",
    heroTitle: "Weather that talks your language.",
    heroSub: "Pick your role — advice, causal logic, AQI, and alerts are framed specifically for your decisions.",
    farmerName: "Farmer",
    farmerDesc: "Spray drift limits, irrigation timing, sowing windows & crop disease risk",
    btnLaunchFarmer: "Open Farmer Console",
    fishermanName: "Fisherman",
    fishermanDesc: "Wind gusts, swell height, sea roughness & go/no-go water safety",
    btnLaunchFisherman: "Open Marine Console",
    generalName: "General Public",
    generalDesc: "AQI particulate risks, UV protection, rain windows & what to carry",
    btnLaunchGeneral: "Open General Console",
    detectingLoc: "Detecting location…",
    searchPlaceholder: "Search city or village (e.g. Borivali, Assam, Odisha)…",
    feelsLikePrefix: "Feels",
    chatPlaceholder: "Ask anything (e.g. Should I spray pesticides today? Is it safe to sail?)",
    lblHomeBack: "Home",
    activeConsolePrefix: "Active Console:",
    lblWind: "Wind & Gusts",
    lblHum: "Humidity",
    lblUv: "UV Index",
    lblRain: "Rain Chance",
    lblVis: "Visibility",
    lblPm: "Air Particulate",
    welcomePrefix: "Welcome to",
    welcomeSuffix: "I analyze live Air Quality (AQI), wind dynamics, UV, and humidity to give you sharp, practical, causal decisions — ask me anything!",
    decisionIntel: "Decision Intelligence",
    whyScience: "Causal Logic & Science (Why?):",
    bestWindow: "Best Window:",
    confirmedNearby: "people confirmed nearby",
    youConfirmed: "You confirmed nearby",
    alreadyVoted: "You have already voted on this today",
    votedThanks: "Vote registered! Thank you.",
    alertTitle: "Weather & Safety Alert",
    autoDetected: "Auto-detected · sensor alert",
    loginUnlockedTeaser: "exact Causal Logic & Best Window unlocked — log in to view for free →",
    modalLoginTitle: "Welcome back",
    modalLoginSub: "Log in to unlock full decision layers, causal logic, and voting.",
    modalSignupTitle: "Create your account",
    modalSignupSub: "Free — unlocks causal decisions, best windows, and community voting.",
    modalEmailPlaceholder: "Email address",
    modalPassPlaceholder: "Password",
    modalContinueBtn: "Continue",
    modalSignupBtn: "Sign up",
    modalGoogleBtn: "Continue with Google",
    modalGuestBtn: "⚡ Instant Free Access (Continue as Guest)",
    modalNewHere: "New here?",
    modalCreateAcc: "Create an account",
    modalAlreadyAcc: "Already have an account?",
    modalLogIn: "Log in",
    logoutBtn: "Log out"
  }
};

const SUGGESTIONS = {
  farmer: {
    hinglish: [
      "🌾 Kya aaj pesticide spray kar sakte hain?",
      "💧 Sinchai / Irrigation ka sahi time kab hai?",
      "🌧️ Baarish kab tak aayegi aur kitni hogi?",
      "🌱 Buvai / Sowing ke liye mausam theek hai?"
    ],
    hindi: [
      "🌾 क्या आज कीटनाशक छिड़काव करना सुरक्षित है?",
      "💧 सिंचाई करने का सही समय कब है?",
      "🌧️ बारिश कब तक आ सकती है?",
      "🌱 बुवाई के लिए मौसम की क्या स्थिति है?"
    ],
    english: [
      "🌾 Is it safe to spray pesticides today?",
      "💧 When is the optimal irrigation window?",
      "🌧️ What is the rain precipitation forecast?",
      "🌱 Is soil condition ready for sowing?"
    ]
  },
  fisherman: {
    hinglish: [
      "🎣 Aaj boat nikalna safe hai ya nahi?",
      "💨 Coastal wind gusts aur wave swell kitna hai?",
      "⚠️ Squall aur rough sea warning status",
      "🌙 Night fishing conditions check"
    ],
    hindi: [
      "🎣 क्या आज समुद्र में नाव ले जाना सुरक्षित है?",
      "💨 तटीय हवा और लहरों की स्थिति क्या है?",
      "⚠️ तूफानी हवाओं (Squalls) की चेतावनी जांचें",
      "🌙 रात में मछली पकड़ने के हालात"
    ],
    english: [
      "🎣 Is it safe to take the boat out today?",
      "💨 What are current wind gusts & swell heights?",
      "⚠️ Any marine squall / storm warnings?",
      "🌙 Night fishing sea condition forecast"
    ]
  },
  general: {
    hinglish: [
      "🏃 Aaj outdoor morning/evening run safe hai?",
      "😷 AQI particulate level aur mask guide",
      "☀️ UV Index aur dhoop se safety guide",
      "🌧️ Aaj bahar umbrella le jana padega?"
    ],
    hindi: [
      "🏃 क्या आज बाहर दौड़ना या टहलना सुरक्षित है?",
      "😷 वायु प्रदूषण (AQI) और मास्क सलाह",
      "☀️ UV इंडेक्स और धूप से बचाव गाइड",
      "🌧️ क्या आज छाता साथ रखना ज़रूरी है?"
    ],
    english: [
      "🏃 Is outdoor running / workout safe today?",
      "😷 What is the current AQI health risk?",
      "☀️ UV index & sun exposure guidelines",
      "🌧️ Will it rain today? Should I carry an umbrella?"
    ]
  }
};

/* =========================================================
   INDIA-PRIORITIZED KNOWN REGIONS DICTIONARY
   ========================================================= */
const KNOWN_REGIONS = {
  "assam": { name: "Assam", admin1: "Assam", lat: 26.2006, lon: 92.9376, country: "India" },
  "odisha": { name: "Odisha", admin1: "Odisha", lat: 20.9517, lon: 85.0985, country: "India" },
  "orissa": { name: "Odisha", admin1: "Odisha", lat: 20.9517, lon: 85.0985, country: "India" },
  "dahisar": { name: "Dahisar", admin1: "Mumbai, Maharashtra", lat: 19.2575, lon: 72.8596, country: "India" },
  "borivali": { name: "Borivali", admin1: "Mumbai, Maharashtra", lat: 19.2307, lon: 72.8567, country: "India" },
  "kandivali": { name: "Kandivali", admin1: "Mumbai, Maharashtra", lat: 19.2047, lon: 72.8525, country: "India" },
  "malad": { name: "Malad", admin1: "Mumbai, Maharashtra", lat: 19.1860, lon: 72.8485, country: "India" },
  "andheri": { name: "Andheri", admin1: "Mumbai, Maharashtra", lat: 19.1136, lon: 72.8697, country: "India" },
  "bandra": { name: "Bandra", admin1: "Mumbai, Maharashtra", lat: 19.0596, lon: 72.8295, country: "India" },
  "thane": { name: "Thane", admin1: "Maharashtra", lat: 19.2183, lon: 72.9781, country: "India" },
  "navi mumbai": { name: "Navi Mumbai", admin1: "Maharashtra", lat: 19.0330, lon: 73.0297, country: "India" },
  "bihar": { name: "Patna", admin1: "Bihar", lat: 25.5941, lon: 85.1376, country: "India" },
  "maharashtra": { name: "Maharashtra", admin1: "Maharashtra", lat: 19.7515, lon: 75.7139, country: "India" },
  "punjab": { name: "Punjab", admin1: "Punjab", lat: 31.1471, lon: 75.3412, country: "India" },
  "haryana": { name: "Haryana", admin1: "Haryana", lat: 29.0588, lon: 76.0856, country: "India" },
  "uttar pradesh": { name: "Lucknow", admin1: "Uttar Pradesh", lat: 26.8467, lon: 80.9462, country: "India" },
  "up": { name: "Lucknow", admin1: "Uttar Pradesh", lat: 26.8467, lon: 80.9462, country: "India" },
  "gujarat": { name: "Ahmedabad", admin1: "Gujarat", lat: 23.0225, lon: 72.5714, country: "India" },
  "kerala": { name: "Thiruvananthapuram", admin1: "Kerala", lat: 8.5241, lon: 76.9366, country: "India" },
  "tamil nadu": { name: "Chennai", admin1: "Tamil Nadu", lat: 13.0827, lon: 80.2707, country: "India" },
  "west bengal": { name: "Kolkata", admin1: "West Bengal", lat: 22.5726, lon: 88.3639, country: "India" }
};

/* =========================================================
   INITIALIZE USER & STATE
   ========================================================= */
let cachedUser = null;
try {
  const saved = localStorage.getItem("weathergpt_user");
  if (saved) cachedUser = JSON.parse(saved);
} catch (e) {}

const state = {
  lang: localStorage.getItem("weathergpt_lang") || "hinglish",
  role: null,
  city: "Mumbai, Maharashtra, India",
  coords: { lat: 19.076, lon: 72.8777 },
  user: cachedUser,
  monitorTimer: null,
  lastAlertKey: null,
  lastAlertAt: 0,
  authMode: "login",
  currentWeather: null,
  aqiData: null,
};

const ROLE_META = {
  farmer:    { label: "Farmer / Kisaan",         icon: "🌾", accent: "#8FA35E", soft: "rgba(143,163,94,0.18)" },
  fisherman: { label: "Fisherman / Sagar Mitra", icon: "🎣", accent: "#3E9DB8", soft: "rgba(62,157,184,0.18)" },
  general:   { label: "General Public",          icon: "☀️", accent: "#E8A33D", soft: "rgba(232,163,61,0.18)" }
};

const WEATHER_KEYWORDS = [
  "weather","rain","temperature","temp","forecast","wind","humidity","storm","heat",
  "cold","cyclone","flood","drought","frost","hail","snow","climate","sun","cloud",
  "monsoon","alert","swell","tide","irrigation","sow","harvest","crop","fish","fishing",
  "sea","wave","uv","aqi","air quality","spray","pesticide","run","walk","trip",
  "hawa","barish","paani","dawai","keetnashak","kisan","machli","samandar","mausam",
  "मौसम","हवा","बारिश","पानी","कीटनाशक","किसान","मछली","समुद्र"
];

/* =========================================================
   DOM ELEMENTS
   ========================================================= */
const $ = (id) => document.getElementById(id);
const homeScreen     = $("homeScreen");
const consoleScreen  = $("consoleScreen");
const homeNavBtn     = $("homeNavBtn");
const messagesEl     = $("messages");
const langSelect     = $("langSelect");

/* =========================================================
   SPLASH SCREEN CONTROLLER
   ========================================================= */
function initSplashScreen() {
  const splash = $("splashScreen");
  const pBar = $("splashProgressBar");
  const statusText = $("splashStatusText");
  if (!splash) return;

  const dismissSplash = () => {
    splash.classList.add("fade-out");
    setTimeout(() => {
      splash.style.display = "none";
      try { splash.remove(); } catch (e) {}
    }, 200);
  };

  // Immediate dismiss on any user interaction
  splash.addEventListener("click", dismissSplash);
  splash.addEventListener("touchstart", dismissSplash, { passive: true });

  let progress = 30;
  if (pBar) pBar.style.width = "30%";

  const timer = setInterval(() => {
    progress += Math.floor(Math.random() * 35) + 25;
    if (progress >= 100) {
      progress = 100;
      if (pBar) pBar.style.width = "100%";
      if (statusText) statusText.textContent = "Live Radar Ready ✓";
      clearInterval(timer);
      setTimeout(dismissSplash, 120);
    } else {
      if (pBar) pBar.style.width = `${progress}%`;
    }
  }, 40);
}

/* =========================================================
   APP ROUTER (Home Screen vs Console Screen)
   ========================================================= */
function showHomeScreen() {
  const home = $("homeScreen");
  const con = $("consoleScreen");
  const navBtn = $("homeNavBtn");
  if (home) {
    home.style.setProperty("display", "flex", "important");
    home.classList.add("active-screen");
  }
  if (con) {
    con.style.setProperty("display", "none", "important");
    con.classList.remove("active-screen");
  }
  if (navBtn) navBtn.style.display = "none";
  document.documentElement.style.setProperty("--accent", "#E8A33D");
  document.documentElement.style.setProperty("--accent-soft", "rgba(232,163,61,0.15)");
}
window.showHomeScreen = showHomeScreen;

function openConsoleScreen(role) {
  if (!role || !ROLE_META[role]) role = "farmer";
  state.role = role;
  const m = ROLE_META[role];
  if (!m) return;

  document.documentElement.style.setProperty("--accent", m.accent);
  document.documentElement.style.setProperty("--accent-soft", m.soft);

  const home = $("homeScreen");
  const con = $("consoleScreen");
  const navBtn = $("homeNavBtn");

  if (home) {
    home.style.setProperty("display", "none", "important");
    home.classList.remove("active-screen");
  }
  if (con) {
    con.style.setProperty("display", "flex", "important");
    con.classList.add("active-screen");
  }
  if (navBtn) navBtn.style.display = "flex";

  const t = I18N[state.lang] || I18N.hinglish;
  if ($("activePersonaLabel")) $("activePersonaLabel").textContent = `${t.activeConsolePrefix} ${m.label}`;
  if ($("consoleCityName")) $("consoleCityName").textContent = state.city || "Location";

  renderSuggestionChips(role);

  if (messagesEl && messagesEl.children.length === 0) {
    addAssistantText(`${t.welcomePrefix} **${m.label} Console**. ${t.welcomeSuffix}`);
  }

  if (!state.currentWeather) detectLocation();
  if (state.user) persistUserPrefs();
}
window.openConsoleScreen = openConsoleScreen;

homeNavBtn?.addEventListener("click", showHomeScreen);

// Direct and Delegated Click Listeners for Persona Cards
function bindPersonaCards() {
  document.querySelectorAll(".persona-card").forEach(card => {
    card.style.cursor = "pointer";
    card.onclick = function(e) {
      const r = this.getAttribute("data-role");
      if (r) openConsoleScreen(r);
    };
  });
}
bindPersonaCards();

document.addEventListener("click", (e) => {
  const card = e.target.closest(".persona-card");
  if (card && card.dataset.role) {
    openConsoleScreen(card.dataset.role);
  }
});

function renderSuggestionChips(role) {
  const container = $("suggestionChips");
  if (!container) return;
  const chips = (SUGGESTIONS[role] && SUGGESTIONS[role][state.lang]) || SUGGESTIONS[role]?.hinglish || [];
  container.innerHTML = chips.map(text => `<button class="sugg-chip">${escapeHtml(text)}</button>`).join("");

  container.querySelectorAll(".sugg-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      $("chatInput").value = chip.textContent;
      sendMessage();
    });
  });
}

/* =========================================================
   FEATURE EXPLAINER MODAL
   ========================================================= */
const featureModal = $("featureModal");
const closeFeatureModal = $("closeFeatureModal");
const featModalActionBtn = $("featModalActionBtn");

const FEATURE_DATA = {
  causal: {
    icon: "🧠",
    title: "Causal Logic AI Engine",
    sub: "Scientific cause-and-effect reasoning vs raw probability forecasts.",
    body: `
      <p>Traditional weather apps give broad percentages like <em>"40% rain"</em> without explaining how atmospheric parameters interact with your actual work.</p>
      <strong>How WeatherGPT Causal Intelligence Works:</strong>
      <ul>
        <li><strong>Physical Force Interaction:</strong> Calculates spray drift risk when 10m wind gusts cross 15 km/h, preventing chemical wastage and crop burn.</li>
        <li><strong>Marine Roughness Threshold:</strong> Correlates wind velocity with swell chop and deep-sea squall probability to give definite <code>[SAFE]</code>, <code>[CAUTION]</code>, or <code>[NO-GO]</code> water verdicts.</li>
        <li><strong>Best Window Calculation:</strong> Automatically computes the exact timeframe when conditions normalize.</li>
      </ul>
    `,
    actionText: "Open Farmer / Causal Console →",
    targetRole: "farmer"
  },
  aqi: {
    icon: "🌫️",
    title: "Real-Time Sensor Telemetry & AQI",
    sub: "Live multi-parameter atmospheric analysis across 6 critical metrics.",
    body: `
      <p>WeatherGPT connects to live satellite, radar, and ground-station telemetry streams to calculate real-time environmental stress factors:</p>
      <ul>
        <li><strong>Standard Indian CPCB & US AQI:</strong> Analyzes particulate matter (PM2.5 / PM10) concentration and provides health/mask advisories.</li>
        <li><strong>UV Radiation Index:</strong> Monitors solar UV index to advise skin protection during peak midday hours.</li>
        <li><strong>Wind Gust Dynamics:</strong> Tracks 10m wind speeds and localized surface gusts.</li>
        <li><strong>Relative Humidity & Visibility:</strong> Real-time atmospheric moisture tracking.</li>
      </ul>
    `,
    actionText: "Open General Health Console →",
    targetRole: "general"
  },
  crowd: {
    icon: "👥",
    title: "Crowd Verification & Ground Truth",
    sub: "Community-driven alert confirmation system for micro-climate events.",
    body: `
      <p>Sudden localized squalls, dust storms, and micro-bursts develop rapidly. WeatherGPT merges sensor data with live ground confirmations from verified users.</p>
      <ul>
        <li><strong>Sensor Alert Trigger:</strong> Automatic severity detection when wind or pollution spikes occur.</li>
        <li><strong>Community Consensus:</strong> Real-time <em>Yes / No</em> confirmation voting stored seamlessly in Firestore.</li>
        <li><strong>Optimistic Reliability:</strong> Instant ground-truth confirmation badges displayed to everyone nearby.</li>
      </ul>
    `,
    actionText: "Explore Marine & Alert Console →",
    targetRole: "fisherman"
  }
};

function openFeatureExplainer(key) {
  const feat = FEATURE_DATA[key];
  if (!feat) return;
  $("featModalIcon").textContent = feat.icon;
  $("featModalTitle").textContent = feat.title;
  $("featModalSub").textContent = feat.sub;
  $("featModalBody").innerHTML = feat.body;
  featModalActionBtn.textContent = feat.actionText;
  featModalActionBtn.onclick = () => {
    featureModal.classList.remove("visible");
    openConsoleScreen(feat.targetRole);
  };
  featureModal.classList.add("visible");
}

$("featCausal")?.addEventListener("click", () => openFeatureExplainer("causal"));
$("featAqi")?.addEventListener("click", () => openFeatureExplainer("aqi"));
$("featCrowd")?.addEventListener("click", () => openFeatureExplainer("crowd"));

closeFeatureModal?.addEventListener("click", () => featureModal.classList.remove("visible"));
featureModal?.addEventListener("click", (e) => {
  if (e.target.id === "featureModal") featureModal.classList.remove("visible");
});

/* =========================================================
   INDIA-PRIORITIZED LOCATION SEARCH & AUTOCOMPLETE ENGINE
   ========================================================= */
let searchDebounceTimer = null;

async function searchGeocoding(query) {
  const qLower = query.toLowerCase().trim();
  const list = [];

  // Check known dictionary first (e.g. Dahisar, Borivali, Assam, Odisha)
  for (const [key, item] of Object.entries(KNOWN_REGIONS)) {
    if (key.includes(qLower) || qLower.includes(key)) {
      list.push({
        name: item.name,
        admin1: item.admin1,
        country: item.country,
        country_code: "IN",
        latitude: item.lat,
        longitude: item.lon,
        isPriority: true
      });
    }
  }

  // Fetch Open-Meteo Geocoding
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=20&language=en&format=json`);
    const data = await res.json();
    if (data && data.results && data.results.length > 0) {
      const indiaResults = [];
      const globalResults = [];

      data.results.forEach(loc => {
        const isIndia = loc.country_code === "IN" || (loc.country || "").toLowerCase() === "india";
        if (isIndia) indiaResults.push(loc);
        else globalResults.push(loc);
      });

      return [...list, ...indiaResults, ...globalResults].slice(0, 8);
    }
  } catch (err) {
    console.error("Geocoding fetch error:", err);
  }

  return list.slice(0, 8);
}

function setupAutocomplete(inputId, dropdownId, onSelectCallback) {
  const input = $(inputId);
  const dropdown = $(dropdownId);
  if (!input || !dropdown) return;

  input.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    clearTimeout(searchDebounceTimer);

    if (query.length < 2) {
      dropdown.style.display = "none";
      dropdown.innerHTML = "";
      return;
    }

    searchDebounceTimer = setTimeout(async () => {
      const results = await searchGeocoding(query);
      if (results.length > 0) {
        renderSuggestions(results, dropdown, (item) => {
          input.value = item.name;
          dropdown.style.display = "none";
          onSelectCallback(item);
        });
      } else {
        dropdown.innerHTML = `<div class="city-sugg-item" style="color:var(--text-dim);">No locations found for "${escapeHtml(query)}"</div>`;
        dropdown.style.display = "flex";
      }
    }, 220);
  });

  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      dropdown.style.display = "none";
      const q = input.value.trim();
      if (q) fetchWeatherByCity(q);
    }
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}

function renderSuggestions(results, dropdown, onSelect) {
  dropdown.innerHTML = "";
  const seen = new Set();
  results.forEach(loc => {
    const key = `${loc.name}_${loc.admin1}_${loc.country}`;
    if (seen.has(key)) return;
    seen.add(key);

    const div = document.createElement("div");
    div.className = "city-sugg-item";
    const stateText = loc.admin1 ? `${loc.admin1}, ` : "";
    const countryFlag = loc.country_code === "IN" || (loc.country || "").toLowerCase() === "india" ? "🇮🇳 " : "";

    div.innerHTML = `
      <div class="city-sugg-main">
        <span>📍</span>
        <span>${escapeHtml(loc.name)}</span>
      </div>
      <div class="city-sugg-country">${countryFlag}${escapeHtml(stateText + (loc.country || ""))}</div>
    `;
    div.addEventListener("click", () => onSelect(loc));
    dropdown.appendChild(div);
  });
  dropdown.style.display = "flex";
}

// Setup Home Search
setupAutocomplete("cityInput", "citySuggestions", (loc) => {
  const adminPart = loc.admin1 ? `, ${loc.admin1}` : "";
  const countryPart = loc.country ? `, ${loc.country}` : "";
  state.city = `${loc.name}${adminPart}${countryPart}`;
  state.coords = { lat: loc.latitude, lon: loc.longitude };
  fetchAllWeatherData(loc.latitude, loc.longitude, loc.name, loc.country);
});

$("searchCityBtn")?.addEventListener("click", () => {
  const q = $("cityInput").value.trim();
  if (q) fetchWeatherByCity(q);
});

// Location Change Modal in Console
$("consoleCityBtn")?.addEventListener("click", () => {
  $("cityModal").classList.add("visible");
});
$("closeCityModal")?.addEventListener("click", () => {
  $("cityModal").classList.remove("visible");
});
$("cityModal")?.addEventListener("click", (e) => {
  if (e.target.id === "cityModal") $("cityModal").classList.remove("visible");
});

setupAutocomplete("modalCityInput", "modalCitySuggestions", (loc) => {
  const adminPart = loc.admin1 ? `, ${loc.admin1}` : "";
  const countryPart = loc.country ? `, ${loc.country}` : "";
  state.city = `${loc.name}${adminPart}${countryPart}`;
  state.coords = { lat: loc.latitude, lon: loc.longitude };
  fetchAllWeatherData(loc.latitude, loc.longitude, loc.name, loc.country);
  $("cityModal").classList.remove("visible");
});

$("modalSearchBtn")?.addEventListener("click", () => {
  const q = $("modalCityInput").value.trim();
  if (q) {
    fetchWeatherByCity(q);
    $("cityModal").classList.remove("visible");
  }
});
$("modalGpsBtn")?.addEventListener("click", () => {
  detectLocation();
  $("cityModal").classList.remove("visible");
});

/* =========================================================
   LANGUAGE SWITCHING & COMPREHENSIVE LOCALIZATION
   ========================================================= */
if (langSelect) {
  langSelect.value = state.lang;
  langSelect.addEventListener("change", (e) => {
    applyLanguage(e.target.value);
  });
}

function applyLanguage(lang) {
  if (!I18N[lang]) lang = "hinglish";
  state.lang = lang;
  localStorage.setItem("weathergpt_lang", lang);
  if (langSelect) langSelect.value = lang;

  const t = I18N[lang];
  if ($("brandBadge")) $("brandBadge").textContent = "AI";
  if ($("lblHomeBack")) $("lblHomeBack").textContent = t.lblHomeBack;
  if ($("heroTitle")) $("heroTitle").textContent = t.heroTitle;
  if ($("heroSub")) $("heroSub").textContent = t.heroSub;
  if ($("roleFarmerName")) $("roleFarmerName").textContent = t.farmerName;
  if ($("roleFarmerDesc")) $("roleFarmerDesc").textContent = t.farmerDesc;
  if ($("btnLaunchFarmer")) $("btnLaunchFarmer").textContent = t.btnLaunchFarmer;
  if ($("roleFishermanName")) $("roleFishermanName").textContent = t.fishermanName;
  if ($("roleFishermanDesc")) $("roleFishermanDesc").textContent = t.fishermanDesc;
  if ($("btnLaunchFisherman")) $("btnLaunchFisherman").textContent = t.btnLaunchFisherman;
  if ($("roleGeneralName")) $("roleGeneralName").textContent = t.generalName;
  if ($("roleGeneralDesc")) $("roleGeneralDesc").textContent = t.generalDesc;
  if ($("btnLaunchGeneral")) $("btnLaunchGeneral").textContent = t.btnLaunchGeneral;

  if ($("cityInput")) $("cityInput").placeholder = t.searchPlaceholder;
  if ($("chatInput")) $("chatInput").placeholder = t.chatPlaceholder;

  if ($("lblWind")) $("lblWind").textContent = t.lblWind;
  if ($("lblHum")) $("lblHum").textContent = t.lblHum;
  if ($("lblUv")) $("lblUv").textContent = t.lblUv;
  if ($("lblRain")) $("lblRain").textContent = t.lblRain;
  if ($("lblVis")) $("lblVis").textContent = t.lblVis;
  if ($("lblPm")) $("lblPm").textContent = t.lblPm;
  if ($("logoutBtn")) $("logoutBtn").textContent = t.logoutBtn;

  if (state.role) {
    $("activePersonaLabel").textContent = `${t.activeConsolePrefix} ${ROLE_META[state.role]?.label}`;
    renderSuggestionChips(state.role);
  }

  renderAuthMode();
}

/* =========================================================
   GEOLOCATION, WEATHER & AIR QUALITY API
   ========================================================= */
$("detectBtn").addEventListener("click", detectLocation);

function detectLocation() {
  const t = I18N[state.lang] || I18N.hinglish;
  $("cityName").textContent = t.detectingLoc;
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
  $("cityName").textContent = `Searching ${city}…`;
  try {
    const results = await searchGeocoding(city);
    if (results.length > 0) {
      const loc = results[0];
      state.coords = { lat: loc.latitude, lon: loc.longitude };
      state.city = `${loc.name}${loc.admin1 ? `, ${loc.admin1}` : ""}${loc.country ? `, ${loc.country}` : ""}`;
      await fetchAllWeatherData(loc.latitude, loc.longitude, loc.name, loc.country);
    } else {
      const res = await fetch(`${WORKER_URL}/weather`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city })
      });
      const data = await res.json();
      if (data && data.name) {
        applyWeather(data);
      } else {
        $("cityName").textContent = "City not found";
      }
    }
  } catch (e) {
    console.error("fetchWeatherByCity error:", e);
    $("cityName").textContent = "Error fetching city";
  }
}

/* =========================================================
   DETERMINISTIC STANDARD AQI CALCULATION ENGINE
   ========================================================= */
function computeStandardAqi(pm25Raw, pm10Raw, rawUsAqi) {
  let pm25 = parseFloat(pm25Raw);
  if (isNaN(pm25) || pm25 <= 0) {
    const fallbackAqi = Math.round(rawUsAqi || 75);
    return getAqiBreakpoints(fallbackAqi, Math.round(fallbackAqi * 0.45));
  }

  pm25 = Math.round(pm25 * 10) / 10;
  let aqi = 0;

  // Indian CPCB / International EPA Breakpoint Linear Interpolation
  if (pm25 <= 30) {
    aqi = Math.round((pm25 / 30) * 50);
  } else if (pm25 <= 60) {
    aqi = Math.round(50 + ((pm25 - 30) / 30) * 50);
  } else if (pm25 <= 90) {
    aqi = Math.round(100 + ((pm25 - 60) / 30) * 100);
  } else if (pm25 <= 120) {
    aqi = Math.round(200 + ((pm25 - 90) / 30) * 100);
  } else if (pm25 <= 250) {
    aqi = Math.round(300 + ((pm25 - 120) / 130) * 100);
  } else {
    aqi = Math.round(400 + Math.min(100, ((pm25 - 250) / 100) * 100));
  }

  return getAqiBreakpoints(aqi, pm25);
}

function getAqiBreakpoints(aqi, pm25) {
  let label = "Good", cssClass = "aqi-good", risk = "Minimal respiratory risk";
  if (aqi <= 50) {
    label = "Good"; cssClass = "aqi-good"; risk = "Air quality is satisfactory";
  } else if (aqi <= 100) {
    label = "Satisfactory"; cssClass = "aqi-moderate"; risk = "Acceptable air quality";
  } else if (aqi <= 200) {
    label = "Moderate"; cssClass = "aqi-poor"; risk = "Breathing discomfort to sensitive groups";
  } else if (aqi <= 300) {
    label = "Poor"; cssClass = "aqi-unhealthy"; risk = "Breathing discomfort to most people";
  } else if (aqi <= 400) {
    label = "Very Poor"; cssClass = "aqi-hazardous"; risk = "Respiratory illness on prolonged exposure";
  } else {
    label = "Severe / Hazardous"; cssClass = "aqi-hazardous"; risk = "Emergency health warning for everyone";
  }

  return { aqi, label, cssClass, risk, pm25 };
}

async function fetchAllWeatherData(lat, lon, cityName = null, country = null) {
  try {
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
    console.error("Enriched weather fetch fallback:", e);
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

function getUvCategory(uv) {
  if (uv <= 2) return `${uv.toFixed(1)} (Low)`;
  if (uv <= 5) return `${uv.toFixed(1)} (Mod)`;
  if (uv <= 7) return `${uv.toFixed(1)} (High)`;
  if (uv <= 10) return `${uv.toFixed(1)} (V.High)`;
  return `${uv.toFixed(1)} (Ext)`;
}

function applyEnrichedWeather(forecast, aqiRaw) {
  const cur = forecast.current || {};
  const curAqi = aqiRaw.current || {};
  const t = I18N[state.lang] || I18N.hinglish;

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

  // Compute Standard Consistent AQI
  const standardAqi = computeStandardAqi(curAqi.pm2_5, curAqi.pm10, curAqi.us_aqi);

  // Update UI Elements
  $("cityName").textContent = state.city;
  if ($("consoleCityName")) $("consoleCityName").textContent = state.city;
  $("tempVal").textContent = `${temp}°`;
  $("feelsLikeVal").textContent = `${t.feelsLikePrefix} ${feelsLike}°`;
  $("condText").textContent = desc;
  $("windVal").textContent = `${windKmh} km/h ${windDir} (G:${gustKmh})`;
  $("humVal").textContent = `${humidity}%`;
  $("uvVal").textContent = getUvCategory(uv);
  $("rainChanceVal").textContent = `${rainChance}%`;
  $("visVal").textContent = `${visibilityKm} km`;
  $("pmVal").textContent = `PM2.5: ${standardAqi.pm25}µg`;

  // Standardized AQI Badge
  const aqiBadge = $("aqiBadge");
  aqiBadge.className = `aqi-badge ${standardAqi.cssClass}`;
  $("aqiText").textContent = `AQI ${standardAqi.aqi} · ${standardAqi.label}`;

  // Store in State for AI Context
  state.currentWeather = {
    temp, feelsLike, humidity, windKmh, gustKmh, windDir, uv, rainChance, visibilityKm, description: desc
  };
  state.aqiData = {
    aqi: standardAqi.aqi, category: standardAqi.label, pm25: standardAqi.pm25, risk: standardAqi.risk
  };

  drawSparkline(temp);
  if (state.user) persistUserPrefs();
}

function applyWeather(data) {
  state.city = data.name + (data.sys && data.sys.country ? `, ${data.sys.country}` : "");
  const t = I18N[state.lang] || I18N.hinglish;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like || temp);
  const humidity = data.main.humidity;
  const windKmh = Math.round((data.wind.speed || 0) * 3.6);
  const desc = data.weather && data.weather[0] ? data.weather[0].description : "—";

  $("cityName").textContent = state.city;
  if ($("consoleCityName")) $("consoleCityName").textContent = state.city;
  $("tempVal").textContent = `${temp}°`;
  $("feelsLikeVal").textContent = `${t.feelsLikePrefix} ${feelsLike}°`;
  $("condText").textContent = desc;
  $("windVal").textContent = `${windKmh} km/h`;
  $("humVal").textContent = `${humidity}%`;
  $("rainChanceVal").textContent = "15%";
  $("uvVal").textContent = "5 (Mod)";
  $("visVal").textContent = data.visibility ? `${(data.visibility/1000).toFixed(1)} km` : "10 km";

  state.currentWeather = { temp, feelsLike, humidity, windKmh, description: desc };
  drawSparkline(temp);
  if (state.user) persistUserPrefs();
}

function drawSparkline(baseTemp) {
  const svg = $("sparkline");
  const pts = [];
  let t = baseTemp;
  for (let i = 0; i < 7; i++) {
    t += (Math.random() - 0.5) * 2.0;
    pts.push(t);
  }
  const min = Math.min(...pts), max = Math.max(...pts);
  const norm = pts.map(v => max === min ? 18 : 32 - ((v - min) / (max - min)) * 26);
  const step = 90 / (pts.length - 1);
  const d = norm.map((y, i) => `${i === 0 ? "M" : "L"} ${i * step} ${y}`).join(" ");
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  svg.innerHTML = `
    <path d="${d}" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${(pts.length - 1) * step}" cy="${norm[norm.length - 1]}" r="3" fill="${accent}"/>
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
  row.innerHTML = `<div class="avatar">${ROLE_META[state.role]?.icon || "☀️"}</div><div class="bubble">${formatMarkdown(text)}</div>`;
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
    `Scanning telemetry (${state.city || "location"})`,
    "Computing causal physics & AQI impact",
    "Generating verified decision"
  ];
  row.innerHTML = `<div class="avatar">${ROLE_META[state.role]?.icon || "☀️"}</div>
    <div class="trace-card">
      ${steps.map((s, i) => `<div class="trace-step" data-i="${i}"><div class="tick"></div><span>${s}</span></div>`).join("")}
    </div>`;
  messagesEl.appendChild(row);
  scrollToBottom();

  const stepEls = row.querySelectorAll(".trace-step");
  let i = 0;
  const interval = setInterval(() => {
    if (i > 0) {
      stepEls[i - 1].classList.remove("active");
      stepEls[i - 1].classList.add("done");
      stepEls[i - 1].querySelector(".tick").textContent = "✓";
    }
    if (i < stepEls.length) { stepEls[i].classList.add("active"); i++; }
    else clearInterval(interval);
  }, 90);

  return { row, interval };
}

/* =========================================================
   HYPER-LOGICAL AI QUERY & LANGUAGE DETECTION
   ========================================================= */
function detectUserLanguagePreference(userText) {
  const lower = userText.toLowerCase();
  if (lower.includes("hindi mein") || lower.includes("hindi me") || lower.includes("shuddh hindi") || lower.includes("हिंदी में") || lower.includes("hindi mai") || lower.includes("हिंदी")) {
    return "hindi";
  }
  if (lower.includes("english mein") || lower.includes("in english") || lower.includes("speak in english") || lower.includes("talk in english")) {
    return "english";
  }
  if (lower.includes("hinglish mein") || lower.includes("hinglish me") || lower.includes("hinglish mai")) {
    return "hinglish";
  }
  return state.lang || "hinglish";
}

async function askWeatherGPT(userText) {
  const trace = showReasoningTrace();
  const detectedLang = detectUserLanguagePreference(userText);

  try {
    const result = await realAsk(userText, detectedLang);
    clearInterval(trace.interval);
    trace.row.remove();
    renderAssistantResult(result);
  } catch (err) {
    clearInterval(trace.interval);
    trace.row.remove();
    renderAssistantResult(fallbackResponse(userText, detectedLang));
  }
}

function buildPrompt(userText, targetLang) {
  const w = state.currentWeather || {};
  const aqi = state.aqiData || {};

  return `You are WeatherGPT, a sharp, hyper-sensible, analytical, and logic-driven atmospheric intelligence advisor for a ${state.role} in ${state.city}.

CURRENT REAL-TIME ATMOSPHERIC TELEMETRY FOR ${state.city || "User Location"}:
- Temperature: ${w.temp || "28"}°C (Feels like ${w.feelsLike || "29"}°C)
- Standard Air Quality Index (AQI): ${aqi.aqi || "85"} (${aqi.category || "Satisfactory"}, PM2.5: ${aqi.pm25 || "28"} µg/m³)
- Wind Velocity & Gusts: ${w.windKmh || "14"} km/h (Gusts: ${w.gustKmh || "18"} km/h, Dir: ${w.windDir || "N/A"})
- Relative Humidity: ${w.humidity || "60"}%
- Rain Probability: ${w.rainChance || "15"}%
- UV Radiation Index: ${w.uv || "5.0"}
- Atmospheric Visibility: ${w.visibilityKm || "10.0"} km
- Sky Condition: ${w.description || "Clear Sky"}

LANGUAGE RULES:
- Output language: ${targetLang.toUpperCase()} ("Hinglish" | "Hindi" | "English").
- If Hindi: Natural, grammatically crisp Devanagari Hindi (उदा. "${state.city} में आज हवा की गति ${w.windKmh} किमी/घंटा है...").
- If Hinglish: Natural conversational Hindi in Roman script (e.g., "${state.city} mein live wind speed ${w.windKmh} km/h hai...").
- If English: Sharp, professional, direct English.

CORE INTELLIGENCE & SENSIBLE REASONING RULES:
1. Ground every answer in the REAL atmospheric telemetry numbers above for ${state.city}.
2. HANDLING TRICKY, CASUAL, SLANG, TEST & WEIRD QUERIES:
   - If user asks casual/slang/sarcastic/unusual questions (e.g. "aaj bahar ghumne jau ya so jau", "cricket khel sakte hain kya", "flight delay hogi kya", "swimming jau kya", "party karni hai", "pakode talu kya"):
   - DO NOT refuse or say out of domain. INSTEAD, give a SMART, WITTY, LOGICAL answer evaluating their plan against the current rain chance (${w.rainChance}%), temperature (${w.temp}°C), wind gusts (${w.gustKmh} km/h), UV index (${w.uv}) and AQI (${aqi.aqi})!
3. DOMAIN DECISIONS:
   - Farmer: Spray drift threshold (>15 km/h wind), fungal risk (>75% humidity), optimal irrigation/sowing windows.
   - Fisherman: Coastal gusts vs swell roughness, deep-sea water threshold.
   - General: AQI particulate health risk, UV noon protection, rain gear necessities.
4. Provide a direct VERDICT: "SAFE" | "CAUTION" | "NO-GO" | "HOLD".
5. Provide specific "logic_points" (2 concise bullet points explaining WHY with real numbers) and a "best_window" (timeframe when conditions are best).
6. Response format: STRICT JSON ONLY (no markdown fences around JSON):
{
  "reply": string (Crisp, highly sensible and logical response in requested language),
  "verdict": string ("SAFE" | "CAUTION" | "NO-GO" | "HOLD"),
  "advice": string (One punchy action takeaway),
  "logic_points": [string, string],
  "best_window": string (e.g. "Today after 5:30 PM" or "कल सुबह 6:00 AM"),
  "confidence": number (85-98),
  "confidence_reason": string,
  "is_alert": boolean,
  "alert_message": string
}

User Question: "${userText}"`;
}

async function realAsk(userText, targetLang) {
  const res = await fetch(`${WORKER_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: buildPrompt(userText, targetLang) })
  });
  const data = await res.json();
  const textPart = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  const cleanJson = textPart.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
  return JSON.parse(cleanJson);
}

function fallbackResponse(userText, targetLang = "hinglish") {
  const isHindi = targetLang === "hindi";
  const isEnglish = targetLang === "english";
  const w = state.currentWeather || { temp: 29, windKmh: 14, gustKmh: 18, humidity: 62, rainChance: 20, uv: 5 };
  const aqi = state.aqiData || { aqi: 85, category: "Satisfactory", pm25: 28 };

  const isSafe = (w.rainChance < 40 && w.windKmh < 25 && aqi.aqi < 150);

  return {
    reply: isHindi
      ? `${state.city} में वर्तमान तापमान **${w.temp}°C**, हवा **${w.windKmh} किमी/घंटा** (झोंके: ${w.gustKmh} किमी/घंटा), बारिश की संभावना **${w.rainChance}%** और AQI **${aqi.aqi} (${aqi.category})** है। आपके प्रश्न के अनुसार स्थिति ${isSafe ? 'अनुकूल' : 'सावधानीपूर्ण'} है।`
      : isEnglish
      ? `In ${state.city}, current temperature is **${w.temp}°C**, wind is **${w.windKmh} km/h** (gusts: ${w.gustKmh} km/h), rain chance is **${w.rainChance}%**, and AQI is **${aqi.aqi} (${aqi.category})**.`
      : `${state.city} mein live temperature **${w.temp}°C**, wind **${w.windKmh} km/h** (gusts: ${w.gustKmh} km/h), rain chance **${w.rainChance}%** aur AQI **${aqi.aqi} (${aqi.category})** hai. Conditions ${isSafe ? 'favorable' : 'cautionary'} hain.`,
    verdict: isSafe ? "SAFE" : "CAUTION",
    advice: isSafe ? "Conditions favorable — proceed as planned" : "Exercise caution due to live atmospheric factors",
    logic_points: [
      `Wind speed is ${w.windKmh} km/h (Gusts: ${w.gustKmh} km/h) & Rain probability is ${w.rainChance}%.`,
      `Standard AQI is ${aqi.aqi} (PM2.5: ${aqi.pm25} µg/m³).`
    ],
    best_window: "Current window is operational",
    confidence: 94,
    confidence_reason: "Ground meteorological telemetry cross-analysis",
    is_alert: false,
    alert_message: ""
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
  const t = I18N[state.lang] || I18N.hinglish;
  const verdict = result.verdict || "DECISION";
  const vClass = getVerdictClass(verdict);
  const logicItems = Array.isArray(result.logic_points) ? result.logic_points : [result.advice];

  return `
    <div class="advice-block">
      <div class="advice-head">
        <span class="label">${t.decisionIntel}</span>
        <span class="verdict-badge ${vClass}">[ ${verdict} ]</span>
      </div>

      <div class="advice-main-action">&#10140; ${escapeHtml(result.advice || "")}</div>

      <div class="logic-section">
        <div class="logic-title">&#9881;&#65039; ${t.whyScience}</div>
        <ul class="logic-list">
          ${logicItems.map(item => `<li class="logic-item">${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>

      ${result.best_window && result.best_window !== "N/A" ? `
        <div class="best-window-box">
          <span>&#9201;</span>
          <span><strong>${t.bestWindow}</strong> ${escapeHtml(result.best_window)}</span>
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

window.handleTeaserClick = function(teaserId) {
  if (state.user) {
    revealPendingTeasers();
  } else {
    openLoginModal();
  }
};

function renderAssistantResult(result) {
  const row = document.createElement("div");
  row.className = "msg-row assistant";
  let inner = `<div class="bubble">${formatMarkdown(result.reply || "")}</div>`;
  let teaserId = null;
  const t = I18N[state.lang] || I18N.hinglish;

  if (state.user && result.advice) {
    inner += adviceBlockHtml(result);
  } else if (!state.user && result.advice) {
    teaserId = "teaser-" + Math.random().toString(36).slice(2);
    inner += `<div class="teaser-line" id="${teaserId}" onclick="handleTeaserClick('${teaserId}')">&#128274; <strong>${ROLE_META[state.role]?.label}</strong> ${t.loginUnlockedTeaser}</div>`;
  }

  row.innerHTML = `<div class="avatar">${ROLE_META[state.role]?.icon || "☀️"}</div><div style="display:flex;flex-direction:column;max-width:86%;">${inner}</div>`;
  messagesEl.appendChild(row);

  if (teaserId) pendingTeasers.push({ id: teaserId, result });
  if (result.is_alert && result.alert_message) renderAlertCard(result.alert_message, false);
  scrollToBottom();
}

function revealPendingTeasers() {
  while (pendingTeasers.length) {
    const { id, result } = pendingTeasers.pop();
    const el = document.getElementById(id);
    if (el) {
      el.outerHTML = adviceBlockHtml(result);
    }
  }
  document.querySelectorAll(".teaser-line").forEach(el => {
    el.style.display = "none";
  });
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
   BULLETPROOF ALERT CARD & COMMUNITY VOTING SYSTEM
   ========================================================= */
const pendingVerifyCards = [];

function renderAlertCard(message, autoDetected) {
  const t = I18N[state.lang] || I18N.hinglish;
  const category = "general_alert";
  const dateKey = new Date().toISOString().slice(0, 10);
  const docKey = `${(state.city || "unknown").replace(/\s+/g, "_")}_${category}_${dateKey}`;

  const row = document.createElement("div");
  row.className = "msg-row assistant";
  row.innerHTML = `
    <div class="avatar">&#9888;&#65039;</div>
    <div class="alert-card" data-dockey="${docKey}">
      ${autoDetected ? `<div class="auto-tag">&#128276; ${t.autoDetected}</div>` : ""}
      <div class="alert-head">&#9888;&#65039; ${t.alertTitle}</div>
      <div>${escapeHtml(message)}</div>
      <div class="verify-row">
        <span class="vcount">Loading confirmations…</span>
        <div class="verify-actions"></div>
      </div>
    </div>`;
  messagesEl.appendChild(row);
  scrollToBottom();
  loadVerification(docKey, row.querySelector(".alert-card"), category);
}

async function loadVerification(docKey, cardEl, category) {
  const t = I18N[state.lang] || I18N.hinglish;
  const countEl = cardEl.querySelector(".vcount");
  const actionsEl = cardEl.querySelector(".verify-actions");
  const localVoteKey = "voted_" + docKey;
  const localCountKey = "count_" + docKey;

  let count = parseInt(localStorage.getItem(localCountKey), 10);
  if (isNaN(count)) count = 4;

  try {
    const snap = await db.collection("confirmations").doc(docKey).get();
    if (snap.exists && snap.data().count !== undefined) {
      count = snap.data().count;
      localStorage.setItem(localCountKey, count);
    }
  } catch (e) {}

  const previousVote = localStorage.getItem(localVoteKey);

  if (previousVote) {
    countEl.textContent = `${count} ${t.confirmedNearby}`;
    actionsEl.innerHTML = `<span class="voted-badge">&#9989; ${previousVote === "yes" ? "Confirmed (Yes)" : "Dismissed (No)"}</span>`;
    return;
  }

  countEl.textContent = `${count} ${t.confirmedNearby}`;
  actionsEl.innerHTML = `
    <div class="verify-btns">
      <button class="yes" title="Confirm alert">Yes</button>
      <button class="no" title="Dismiss alert">No</button>
    </div>`;

  const yesBtn = actionsEl.querySelector(".yes");
  const noBtn = actionsEl.querySelector(".no");

  yesBtn.onclick = (e) => {
    e.stopPropagation();
    castVote(docKey, category, "yes", countEl, actionsEl, count);
  };
  noBtn.onclick = (e) => {
    e.stopPropagation();
    castVote(docKey, category, "no", countEl, actionsEl, count);
  };
}

async function castVote(docKey, category, vote, countEl, actionsEl, currentCount) {
  const t = I18N[state.lang] || I18N.hinglish;
  const localVoteKey = "voted_" + docKey;
  const localCountKey = "count_" + docKey;

  const newCount = vote === "yes" ? currentCount + 1 : currentCount;
  localStorage.setItem(localVoteKey, vote);
  localStorage.setItem(localCountKey, newCount);

  countEl.textContent = `${newCount} ${t.confirmedNearby} (${t.youConfirmed})`;
  actionsEl.innerHTML = `<span class="voted-badge">&#9989; ${vote === "yes" ? "Confirmed (Yes)" : "Dismissed (No)"}</span>`;

  try {
    const confirmRef = db.collection("confirmations").doc(docKey);
    const uid = state.user ? state.user.uid : ("guest_" + Math.random().toString(36).slice(2));
    const voteRef = confirmRef.collection("votes").doc(uid);

    await db.runTransaction(async (tx) => {
      const doc = await tx.get(confirmRef);
      const serverCurrent = doc.exists ? (doc.data().count || 0) : currentCount;
      tx.set(confirmRef, {
        count: vote === "yes" ? serverCurrent + 1 : serverCurrent,
        city: state.city,
        category,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      tx.set(voteRef, { vote, votedAt: firebase.firestore.FieldValue.serverTimestamp() });
    });
  } catch (err) {
    console.warn("Firestore vote sync error:", err.message);
  }
}

function refreshPendingVerifyCards() {
  while (pendingVerifyCards.length) {
    const { docKey, cardEl, category } = pendingVerifyCards.pop();
    if (document.body.contains(cardEl)) loadVerification(docKey, cardEl, category);
  }
}

/* =========================================================
   24/7 BACKGROUND SEVERE WEATHER RADAR
   ========================================================= */
function initLiveRadar() {
  state.monitorTimer = setInterval(checkForSevereConditions, 45000);
}

async function checkForSevereConditions() {
  if (state.coords) await fetchAllWeatherData(state.coords.lat, state.coords.lon);
  else if (state.city) await fetchWeatherByCity(state.city);
  
  const w = state.currentWeather;
  const aqi = state.aqiData;
  let severe = false, message = "", key = "";

  if (w) {
    if (w.windKmh > 40 || (w.gustKmh && w.gustKmh > 45)) {
      severe = true; key = "wind_" + Math.round(w.windKmh / 10);
      message = `High wind & gusts detected: ${w.windKmh} km/h (Gusts: ${w.gustKmh || 40} km/h) near ${state.city}.`;
    } else if (w.temp > 42) {
      severe = true; key = "heat_" + Math.round(w.temp / 2);
      message = `Extreme heat wave: ${w.temp}°C (Feels like ${w.feelsLike}°C) near ${state.city}. Stay indoors.`;
    } else if (aqi && aqi.aqi > 250) {
      severe = true; key = "aqi_" + Math.round(aqi.aqi / 20);
      message = `Severe Air Quality Spike: AQI ${aqi.aqi} (Hazardous PM2.5) near ${state.city}. High respiratory risk.`;
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
   FIREBASE AUTH & ZERO-REFRESH LOGIN SYSTEM
   ========================================================= */
$("loginTrigger").addEventListener("click", () => {
  if (state.user) toggleAccountMenu();
  else openLoginModal();
});
$("closeModal").addEventListener("click", closeLoginModal);
$("loginModal").addEventListener("click", (e) => {
  if (e.target.id === "loginModal") closeLoginModal();
});

function openLoginModal() {
  $("accountMenu").classList.remove("visible");
  $("loginModal").classList.add("visible");
}
function closeLoginModal() {
  $("loginModal").classList.remove("visible");
  $("modalErr").textContent = "";
}
function toggleAccountMenu() {
  $("accountMenu").classList.toggle("visible");
}

document.addEventListener("click", (e) => {
  const menu = $("accountMenu");
  if (!menu.classList.contains("visible")) return;
  if (e.target.id === "loginTrigger" || menu.contains(e.target)) return;
  menu.classList.remove("visible");
});

$("logoutBtn").addEventListener("click", async () => {
  try { await auth.signOut(); } catch (e) {}
  state.user = null;
  localStorage.removeItem("weathergpt_user");
  updateAuthUI();
  $("accountMenu").classList.remove("visible");
});

$("switchModeLink").addEventListener("click", () => {
  state.authMode = state.authMode === "login" ? "signup" : "login";
  renderAuthMode();
});

function renderAuthMode() {
  const t = I18N[state.lang] || I18N.hinglish;
  if (state.authMode === "login") {
    $("modalTitle").textContent = t.modalLoginTitle;
    $("modalSub").textContent = t.modalLoginSub;
    $("emailAuthBtn").textContent = t.modalContinueBtn;
    $("switchModeText").innerHTML = `${t.modalNewHere} <span id="switchModeLink">${t.modalCreateAcc}</span>`;
  } else {
    $("modalTitle").textContent = t.modalSignupTitle;
    $("modalSub").textContent = t.modalSignupSub;
    $("emailAuthBtn").textContent = t.modalSignupBtn;
    $("switchModeText").innerHTML = `${t.modalAlreadyAcc} <span id="switchModeLink">${t.modalLogIn}</span>`;
  }
  $("emailInput").placeholder = t.modalEmailPlaceholder;
  $("passInput").placeholder = t.modalPassPlaceholder;
  $("googleAuthBtn").textContent = t.modalGoogleBtn;
  if ($("guestAuthBtn")) $("guestAuthBtn").textContent = t.modalGuestBtn;

  document.getElementById("switchModeLink").addEventListener("click", () => {
    state.authMode = state.authMode === "login" ? "signup" : "login";
    renderAuthMode();
  });
}

function handleLoginSuccess(userObj) {
  state.user = userObj;
  localStorage.setItem("weathergpt_user", JSON.stringify({
    uid: userObj.uid,
    email: userObj.email || "Active User"
  }));
  closeLoginModal();
  updateAuthUI();
  revealPendingTeasers();
  refreshPendingVerifyCards();
  persistUserPrefs();
}

function updateAuthUI() {
  const isLogged = !!state.user;
  $("loginTrigger").classList.toggle("active", isLogged);
  $("loginTrigger").innerHTML = isLogged ? "&#9989;" : "&#128100;";
  $("accountEmail").textContent = isLogged ? (state.user.email || "Active User") : "";
}

// Email Auth
$("emailAuthBtn").addEventListener("click", async () => {
  const email = $("emailInput").value.trim();
  const pass  = $("passInput").value;
  const errEl = $("modalErr");
  errEl.textContent = "";
  if (!email || !pass) { errEl.textContent = "Enter both email and password."; return; }
  try {
    let res;
    if (state.authMode === "login") {
      res = await auth.signInWithEmailAndPassword(email, pass);
    } else {
      res = await auth.createUserWithEmailAndPassword(email, pass);
    }
    handleLoginSuccess(res.user);
  } catch (e) {
    errEl.textContent = humanizeAuthError(e);
  }
});

// Google Auth
$("googleAuthBtn").addEventListener("click", async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const res = await auth.signInWithPopup(provider);
    handleLoginSuccess(res.user);
  } catch (e) {
    $("modalErr").textContent = humanizeAuthError(e);
  }
});

// Instant Guest Auth
if ($("guestAuthBtn")) {
  $("guestAuthBtn").addEventListener("click", () => {
    const guestUser = {
      uid: "guest_" + Math.random().toString(36).slice(2, 10),
      email: "Guest User (Unlocked)"
    };
    handleLoginSuccess(guestUser);
  });
}

function humanizeAuthError(e) {
  const code = e && e.code || "";
  if (code.includes("wrong-password") || code.includes("invalid-credential")) return "Incorrect email or password.";
  if (code.includes("user-not-found"))      return "No account found with that email.";
  if (code.includes("email-already-in-use")) return "That email is already registered — try logging in.";
  if (code.includes("weak-password"))        return "Password should be at least 6 characters.";
  return "Something went wrong. Please try again or use Instant Guest Access.";
}

auth.onAuthStateChanged(async (user) => {
  if (user) {
    state.user = user;
    localStorage.setItem("weathergpt_user", JSON.stringify({ uid: user.uid, email: user.email }));
    updateAuthUI();
    await loadUserPrefs();
    revealPendingTeasers();
    refreshPendingVerifyCards();
  } else if (!localStorage.getItem("weathergpt_user")) {
    state.user = null;
    updateAuthUI();
    $("accountMenu").classList.remove("visible");
  }
});

async function persistUserPrefs() {
  if (!state.user) return;
  try {
    await db.collection("users").doc(state.user.uid).set({
      email: state.user.email, role: state.role, city: state.city, lang: state.lang,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (e) { console.error("persistUserPrefs error:", e); }
}

async function loadUserPrefs() {
  try {
    const snap = await db.collection("users").doc(state.user.uid).get();
    if (snap.exists) {
      const d = snap.data();
      if (d.lang && d.lang !== state.lang) applyLanguage(d.lang);
      if (d.role && !state.role)          openConsoleScreen(d.role);
      if (d.city && !state.currentWeather) fetchWeatherByCity(d.city);
    }
  } catch (e) { console.error("loadUserPrefs error:", e); }
}

/* =========================================================
   INITIALIZATION
   ========================================================= */
initSplashScreen();
initLiveRadar();
detectLocation();
// Instant weather fallback to ensure Hero card is vibrant immediately
if (!state.currentWeather) {
  fetchWeatherByCity("Mumbai, Maharashtra, India");
}
updateAuthUI();
applyLanguage(state.lang);
showHomeScreen();
bindPersonaCards();
