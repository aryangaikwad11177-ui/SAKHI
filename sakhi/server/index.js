// SAKHI backend: read-only API for the service directory and the sample dashboard,
// plus static hosting of the built frontend. It deliberately has NO endpoint that
// accepts screening answers, names, phone numbers or any personal data.
import express from 'express';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const load = (f) => JSON.parse(readFileSync(path.join(here, 'data', f), 'utf8'));
const services = load('services.json'); // { categories, records }
const dashboard = load('dashboard.json');

const app = express();
app.disable('x-powered-by');

// The frontend is one HTML file with an inline script, so the CSP allows exactly that script by its hash
// (no blanket 'unsafe-inline' for scripts). Recomputed at startup, so rebuilding the page just works.
let scriptHashes = '';
try {
  const html = readFileSync(path.join(here, '..', 'public', 'index.html'), 'utf8');
  scriptHashes = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
    .filter((m) => m[1].trim())
    .map((m) => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`)
    .join(' ');
} catch { /* no built page yet */ }

app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy':
      `default-src 'self'; script-src 'self' ${scriptHashes}; img-src 'self' data:; font-src 'self' data:; ` +
      "style-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'",
  });
  next();
});
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

const q = (v) => (typeof v === 'string' ? v.trim().toLowerCase().slice(0, 80) : '');

app.get('/api/health', (req, res) => res.json({ ok: true }));

// State -> districts, and category list, for the filter dropdowns
app.get('/api/meta', (req, res) => {
  const states = {};
  for (const r of services.records) (states[r.state] ||= new Set()).add(r.district);
  res.json({
    categories: services.categories,
    states: Object.fromEntries(Object.entries(states).map(([s, d]) => [s, [...d].sort()])),
    sample: true,
  });
});

app.get('/api/services', (req, res) => {
  const state = q(req.query.state), district = q(req.query.district);
  const category = q(req.query.category), text = q(req.query.q);
  const out = services.records.filter(
    (r) =>
      (!state || r.state.toLowerCase() === state) &&
      (!district || r.district.toLowerCase() === district) &&
      (!category || r.category === category) &&
      (!text || `${r.name} ${r.district} ${r.state} ${r.categoryLabel}`.toLowerCase().includes(text)),
  );
  res.json({ total: out.length, sample: true, records: out.slice(0, 100) });
});

app.get('/api/dashboard', (req, res) => res.json(dashboard));

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// The built single-file frontend (public/index.html) is committed, so no build step is needed to deploy.
app.use(express.static(path.join(here, '..', 'public'), { maxAge: '5m' }));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`SAKHI running on http://localhost:${port}`));
