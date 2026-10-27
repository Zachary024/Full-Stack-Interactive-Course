// End-to-end smoke test against the in-memory database
const assert = require('assert');
const { createApp } = require('../server');

(async () => {
  const app = await createApp();
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, path, body, token) => {
    const r = await fetch(base + path, {
      method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      body: body ? JSON.stringify(body) : undefined });
    const text = await r.text();
    let json; try { json = JSON.parse(text); } catch { json = text; }
    return { status: r.status, json };
  };

  let r = await call('POST', '/api/auth/register', { name: 'Ada', email: 'ada@example.com', password: 'short' });
  assert.equal(r.status, 400);
  r = await call('POST', '/api/auth/register', { name: 'Ada', email: 'ada@example.com', password: 'longenough1' });
  assert.equal(r.status, 201); const token = r.json.token;
  r = await call('POST', '/api/auth/register', { name: 'Ada', email: 'ada@example.com', password: 'longenough1' });
  assert.equal(r.status, 409);
  r = await call('POST', '/api/auth/login', { email: 'ada@example.com', password: 'wrong' });
  assert.equal(r.status, 401);
  r = await call('POST', '/api/auth/login', { email: 'ada@example.com', password: 'longenough1' });
  assert.equal(r.status, 200);
  r = await call('GET', '/api/me');
  assert.equal(r.status, 401);
  r = await call('PUT', '/api/me', { name: 'Ada L', bio: 'hi' }, token);
  assert.equal(r.json.name, 'Ada L');

  r = await call('PUT', '/api/sync', { completed: { intro: true }, bookmarks: ['react'], notes: { intro: 'hello' }, highlights: { intro: ['full stack'] }, extra: { prefs: { language: 'go' }, challenges: { 'basics.celsius': true } } }, token);
  assert.equal(r.status, 200);
  r = await call('GET', '/api/sync', null, token);
  assert.deepEqual(r.json, { completed: { intro: true }, bookmarks: ['react'], notes: { intro: 'hello' }, highlights: { intro: ['full stack'] }, extra: { prefs: { language: 'go' }, challenges: { 'basics.celsius': true } } });

  r = await call('POST', '/api/quizzes/intro/attempts', { quizId: 'quiz1', score: 75 }, token);
  assert.equal(r.status, 201); assert.equal(r.json.passed, true);
  r = await call('GET', '/api/grades', null, token);
  assert.equal(r.json[0].best, 75);

  r = await call('GET', '/api/admin/stats', null, token);
  assert.equal(r.status, 403);   // RBAC

  r = await call('POST', '/api/forum', { title: 'Q', body: 'How do I use Express middleware?', module: 'backend' }, token);
  assert.equal(r.status, 201); const tid = r.json.id;
  r = await call('POST', '/api/forum', { body: 'Read the docs', parentId: tid }, token);
  assert.equal(r.status, 201);
  r = await call('GET', '/api/forum/' + tid);
  assert.equal(r.json.length, 2);
  r = await call('GET', '/api/forum?module=backend');
  assert.equal(r.json.length, 1);

  r = await call('GET', '/backend/server.js'); assert.equal(r.status, 404);
  r = await call('GET', '/Dockerfile'); assert.equal(r.status, 404);
  r = await call('GET', '/modules/intro.html'); assert.equal(r.status, 200);
  r = await call('GET', '/css/style.css'); assert.equal(r.status, 200);
  r = await call('GET', '/vendor/sql/sql-wasm.wasm'); assert.equal(r.status, 200);
  r = await call('GET', '/'); assert.equal(r.status, 200);
  r = await call('GET', '/sw.js'); assert.equal(r.status, 200);
  console.log('All backend smoke tests passed');
  for (const [path, type, needle] of [['/robots.txt', 'text/plain', 'Disallow: /api/'], ['/sitemap.xml', 'xml', '<urlset'], ['/manifest.json', 'json', 'maskable'], ['/', 'html', 'rel="canonical"']]) {
    const resp = await fetch(base + path); const body = await resp.text();
    assert.equal(resp.status, 200, path); assert.ok((resp.headers.get('content-type') || '').includes(type), path + ' type'); assert.ok(body.includes(needle), path + ' content');
  }
  assert.equal((await fetch(base + '/.env')).status, 404, 'dotfiles are not served');
  assert.equal((await fetch(base + '/backend/server.js')).status, 404, 'source is not served');
  assert.equal((await fetch(base + '/favicon.ico')).status, 200, 'favicon');
  server.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
