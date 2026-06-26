# Production Deployment Guide

## Architecture

```
Vercel (CDN)                Render (Node)               MongoDB Atlas
┌──────────────┐           ┌──────────────┐            ┌──────────────┐
│  SmartNotes  │  ───►     │  Express API  │  ───►     │   MongoDB    │
│  React SPA   │  HTTPS    │  :10000       │  mongoose  │   Atlas      │
│  smartnotes  │           │  smartnotes-  │            │   (cloud)    │
│  .vercel.app │           │  api.onrender │            │              │
└──────────────┘           └──────────────┘            └──────────────┘
       │                           │
       │                    cron-job.org (every 10 min)
       │                    pings /api/health to keep
       │                    Render instance awake
```

---

## Step 1 — Deploy Server on Render

### 1a. Push code to GitHub
```bash
git push origin main
```

### 1b. Create a new Web Service on Render
1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repo (`Abhijeetkr70/SmartNotes-Application`)
4. Configure:

| Field | Value |
|---|---|
| **Name** | `smartnotes-api` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node index.js` |
| **Plan** | Free |

### 1c. Set Environment Variables (Render Dashboard)

Go to **Environment** tab and add:

| Key | Value |
|---|---|
| `NODE_VERSION` | `20.18.0` |
| `PORT` | `10000` |
| `MONGO_URI` | `mongodb+srv://abhijeetkr:Abhijeet%4000@cluster0.f2xncxx.mongodb.net/smartnotes` |
| `CORS_ORIGIN` | `https://smartnotes-<your-vercel-name>.vercel.app` (set after Step 2) |

> **Important:** Render automatically assigns a `PORT` env variable. The `server/index.js` uses `process.env.PORT` directly. If you want a specific port, set `PORT=10000`.

### 1d. Deploy
Click **Deploy**. Wait for build logs to finish. Copy your Render URL, e.g.:
```
https://smartnotes-api.onrender.com
```

Verify:
```bash
curl https://smartnotes-api.onrender.com/api/health
# {"status":"ok"}
```

---

## Step 2 — Deploy Client on Vercel

### 2a. Import project on Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Configure:

| Field | Value |
|---|---|
| **Framework Preset** | `Vite` |
| **Root Directory** | `client` |
| **Build Command** | `vite build` (auto-detected) |
| **Output Directory** | `dist` (auto-detected) |

### 2b. Set Environment Variable (Vercel)

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://smartnotes-api.onrender.com/api/notes` |

> `VITE_API_BASE_URL` replaces the dev proxy. In production, the React app calls Render directly.

### 2c. Deploy
Click **Deploy**. Vercel will build and give you a URL like:
```
https://smartnotes-<name>.vercel.app
```

### 2d. Update CORS on Render
Go back to **Render Dashboard → Environment** and update:
```
CORS_ORIGIN=https://smartnotes-<name>.vercel.app
```
Then click **Manual Deploy → Deploy latest commit** to restart the service with the new CORS origin.

---

## Step 3 — Keep Render Awake (Cron Job)

Render's free tier **spins down after 15 minutes of inactivity**. The first request after a spin-down takes 30-60 seconds. To prevent this:

### 3a. Use cron-job.org (free)
1. Go to https://cron-job.org
2. Sign up → **Create Cronjob**
3. Configure:

| Field | Value |
|---|---|
| **URL** | `https://smartnotes-api.onrender.com/api/health` |
| **Interval** | Every **10 minutes** |
| **Request Method** | `GET` |
| **Timeout** | `30 seconds` |

### 3b. Alternative: UptimeRobot (free)
1. Go to https://uptimerobot.com
2. Add a **Monitor** → type `HTTP(s)`, URL: `https://smartnotes-api.onrender.com/api/health`, interval: 10 min

### 3c. Alternative: BetterStack Uptime
1. Go to https://betterstack.com/uptime
2. Add heartbeat monitor → URL: `https://smartnotes-api.onrender.com/api/health`, check every 5-10 min

> **Why every 10 min?** Render's free tier spins down after 15 min. A ping every 10 min keeps it active. If the site is unused for more than 30 min, it'll spin down again — the cronjob will wake it back up within 10 min.

---

## Step 4 — Verify End-to-End

```bash
# 1. Health check (always works regardless of CORS)
curl https://smartnotes-api.onrender.com/api/health

# 2. API directly
curl https://smartnotes-api.onrender.com/api/notes

# 3. Open the Vercel URL in a browser
open https://smartnotes-<name>.vercel.app

# 4. Create a note via API
curl -X POST https://smartnotes-api.onrender.com/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Deploy test","body":"SmartNotes is live!"}'
```

---

## Troubleshooting

### CORS errors in browser console
- Verify `CORS_ORIGIN` in Render matches **exactly** the Vercel URL (no trailing slash).
- Run `curl -I -H "Origin: https://smartnotes-<name>.vercel.app" https://smartnotes-api.onrender.com/api/notes` and check for `Access-Control-Allow-Origin` header.

### MongoDB connection refused
- Check MongoDB Atlas **Network Access** → Add IP `0.0.0.0/0` (allow all) for Render.
- Verify `MONGO_URI` is correctly URL-encoded (the `%40` for `@` in the password is correct).

### API returns 404
- Make sure the request goes to `https://smartnotes-api.onrender.com/api/notes` (not `/api/note`).

### Render cold start is slow
- This is expected on the free plan (30-60s wake-up). The cron job minimizes this.
- Upgrade to Render's Starter plan ($7/mo) for zero cold starts.

---

## Files Changed for Production

| File | Purpose |
|---|---|
| `client/src/api/notes.js` | Uses `VITE_API_BASE_URL` env var instead of hardcoded `/api/notes` |
| `client/vercel.json` | Rewrites all routes to `index.html` for SPA client-side routing |
| `server/index.js` | Reads `PORT`, `CORS_ORIGIN`, `MONGO_URI` exclusively from env |
| `server/.env` | Local dev config (gitignored — never committed) |
| `.gitignore` | Excludes `.env`, `node_modules/`, `dist/`, IDE files |
