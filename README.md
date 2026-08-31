# 🌤️ WeatherGPT

WeatherGPT is a role-tailored AI weather assistant for **Farmers**, **Fishermen**, and the **General Public**. It provides contextual advice, live weather conditions, confidence scores, and community alert verifications — all in one clean UI.

---

## ✨ Features

- **Role-Based Intelligence** — Weather framing tuned to your persona
- **Decision Layer & Confidence Score** — Direct actionable answers
- **Live Weather Strip** — Real-time temp, humidity, wind + sparkline
- **Demo Mode** — Try everything offline without API calls
- **Live Monitor** — Auto-alerts for severe conditions (wind, heat)
- **Community Verification** — Firestore-backed Yes/No voting on alerts
- **Firebase Auth** — Email/password + Google sign-in
- **Responsive** — Mobile-first with a two-panel desktop layout

---

## 🚀 GitHub Pages Setup

1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Choose branch `main`, folder `/ (root)`
4. Click **Save** — live at `https://<username>.github.io/<repo-name>/`

---

## ⚙️ Configuration

Edit the top of [`app.js`](app.js) to set your own credentials:

```js
const WORKER_URL = "https://your-worker.workers.dev";

const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
```

---

## 📁 File Structure

```
├── index.html   — App shell & layout
├── style.css    — All styles & theme variables
├── app.js       — Firebase, weather API, AI, chat logic
└── README.md    — This file
```

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Vanilla HTML / CSS / JS |
| Fonts | Google Fonts (Inter + Space Grotesk) |
| Auth & DB | Firebase (Auth + Firestore) |
| AI | Gemini via Cloudflare Worker |
| Weather | OpenWeatherMap via Cloudflare Worker |
| Hosting | GitHub Pages |