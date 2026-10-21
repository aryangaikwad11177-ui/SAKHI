# SAKHI – Adolescent Girls Health & Empowerment Portal (NIRMAAN prototype)

Not an official government portal. Sample data only.

## Use it
- **Just the page:** open `public/index.html` in a browser (double-click). Everything is inside that one file. Works offline.
- **With the backend:** `npm install` then `npm start` -> http://localhost:3001

## Deploy (Render, free)
1. Push this folder to a GitHub repo (keep `public/index.html`).
2. render.com -> New -> Blueprint (reads `render.yaml`) -> pick the repo -> Apply.
   Or New -> Web Service: Build `npm install --omit=dev`, Start `node server/index.js`.

Static-only alternative: upload `public/index.html` to Netlify Drop / GitHub Pages. It runs on its built-in sample data.

## Backend (server/index.js)
Read-only: `GET /api/health`, `/api/meta`, `/api/services?state=&district=&category=&q=`, `/api/dashboard`.
There is deliberately no endpoint that accepts screening answers or personal data.
Sample data lives in `server/data/*.json`. Replace it with a verified directory when available.

## Editing the frontend
Source is React + TypeScript + Tailwind in `src/`. Rebuild the single file with `npm install && npm run build`.
