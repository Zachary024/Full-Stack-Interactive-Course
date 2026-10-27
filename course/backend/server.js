const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const db = require('./db');

async function createApp() {
  await db.init();
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // course pages use inline handlers/scripts and call public demo APIs
        'script-src': ["'self'", "'unsafe-inline'", "'wasm-unsafe-eval'"],   // wasm: in-browser SQL sandbox
        'worker-src': ["'self'", 'blob:'],
        'script-src-attr': ["'unsafe-inline'"],
        'connect-src': ["'self'", 'https://jsonplaceholder.typicode.com'],
        'upgrade-insecure-requests': process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
  }));
  app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true }));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));

  // brute-force protection on auth routes
  app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, standardHeaders: true, legacyHeaders: false }));
  app.use('/api', require('./routes/api'));
  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

  // The code-runner worker needs eval (learner code runs inside it). Give ONLY that file a CSP that allows it.
  app.get('/js/runner.js', (req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self' 'unsafe-eval'");
    next();
  });

  // Static course (front-end). Service worker must never be cached by HTTP cache.
  const root = path.join(__dirname, '..');
  app.get('/sw.js', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(root, 'sw.js'));
  });
  // Serve ONLY the public front-end files (never backend source, env files or deploy configs)
  for (const dir of ['css', 'js', 'modules', 'assets', 'offline', 'vendor']) {
    app.use('/' + dir, express.static(path.join(root, dir), { dotfiles: 'deny' }));
  }
  app.get('/manifest.json', (req, res) => res.sendFile(path.join(root, 'manifest.json')));
  // index.html: fill in absolute URLs for link previews (Open Graph needs them). Set PUBLIC_URL=https://your-domain.com
  const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  app.get(['/', '/index.html'], (req, res) => {
    const base = (process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');
    res.set('Cache-Control', 'no-cache').type('html').send(indexHtml
      .replace('content="assets/og.png"', `content="${base}/assets/og.png"`)
      .replace('<link rel="manifest"', `<link rel="canonical" href="${base}/">\n<meta property="og:url" content="${base}/">\n<link rel="manifest"`));
  });
  app.get('/favicon.ico', (req, res) => res.sendFile(path.join(root, 'assets', 'icon-192.png')));
  app.get('/robots.txt', (req, res) => {
    const base = (process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');
    res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${base}/sitemap.xml\n`);
  });
  app.get('/sitemap.xml', (req, res) => {
    const base = (process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base}/</loc></url></urlset>\n`);
  });
  // Digital Asset Links for a Google Play (Trusted Web Activity) build: put the file in well-known/assetlinks.json
  app.get('/.well-known/assetlinks.json', (req, res, next) => {
    const f = path.join(root, 'well-known', 'assetlinks.json');
    fs.existsSync(f) ? res.type('json').sendFile(f) : next();
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });
  return app;
}

module.exports = { createApp };

if (require.main === module) {
  createApp().then((app) => {
    const port = process.env.PORT || 3000;
    const server = app.listen(port, '0.0.0.0', () => console.log(`Course server on http://localhost:${port}`));
    // finish in-flight requests when the host stops or redeploys the container
    for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => { console.log(sig + ' received, shutting down'); server.close(() => process.exit(0)); setTimeout(() => process.exit(0), 8000).unref(); });
  });
}
