const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { sign, required } = require('../auth');

const router = express.Router();
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const clean = (s, max) => String(s ?? '').trim().slice(0, max);
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, bio: u.bio });
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------- Auth & profile ---------- */
router.post('/auth/register', wrap(async (req, res) => {
  const name = clean(req.body.name, 80);
  const email = clean(req.body.email, 200).toLowerCase();
  const password = String(req.body.password || '');
  if (!name || !emailRe.test(email)) return res.status(400).json({ error: 'Valid name and email required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  const exists = await db.query('SELECT 1 FROM users WHERE email = $1', [email]);
  if (exists.rows.length) return res.status(409).json({ error: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await db.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1,$2,$3) RETURNING id,name,email,role,bio',
    [name, email, hash]);
  res.status(201).json({ token: sign(rows[0]), user: publicUser(rows[0]) });
}));

router.post('/auth/login', wrap(async (req, res) => {
  const email = clean(req.body.email, 200).toLowerCase();
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const u = rows[0];
  if (!u || !(await bcrypt.compare(String(req.body.password || ''), u.password_hash))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  res.json({ token: sign(u), user: publicUser(u) });
}));

router.get('/me', required(), wrap(async (req, res) => {
  const { rows } = await db.query('SELECT id,name,email,role,bio FROM users WHERE id=$1', [req.user.id]);
  if (!rows[0]) return res.status(404).json({ error: 'User not found' });
  res.json(publicUser(rows[0]));
}));

router.put('/me', required(), wrap(async (req, res) => {
  const name = clean(req.body.name, 80);
  const bio = clean(req.body.bio, 500);
  if (!name) return res.status(400).json({ error: 'Name required' });
  const { rows } = await db.query(
    'UPDATE users SET name=$1, bio=$2 WHERE id=$3 RETURNING id,name,email,role,bio',
    [name, bio, req.user.id]);
  res.json(publicUser(rows[0]));
}));

router.delete('/me', required(), wrap(async (req, res) => {
  await db.query('DELETE FROM users WHERE id=$1', [req.user.id]);
  res.status(204).end();
}));

/* ---------- Learning-state sync (progress, bookmarks, notes, highlights) ---------- */
router.get('/sync', required(), wrap(async (req, res) => {
  const id = req.user.id;
  const [p, b, n, h, x] = await Promise.all([
    db.query('SELECT module_id FROM progress WHERE user_id=$1', [id]),
    db.query('SELECT module_id FROM bookmarks WHERE user_id=$1', [id]),
    db.query('SELECT module_id, body FROM notes WHERE user_id=$1', [id]),
    db.query('SELECT module_id, text FROM highlights WHERE user_id=$1 ORDER BY id', [id]),
    db.query('SELECT data FROM learner_data WHERE user_id=$1', [id]),
  ]);
  let extra = {};
  try { extra = x.rows[0] ? JSON.parse(x.rows[0].data) : {}; } catch (e) { extra = {}; }
  const completed = {}; p.rows.forEach(r => (completed[r.module_id] = true));
  const notes = {}; n.rows.forEach(r => (notes[r.module_id] = r.body));
  const highlights = {};
  h.rows.forEach(r => (highlights[r.module_id] = highlights[r.module_id] || []).push(r.text));
  res.json({ completed, bookmarks: b.rows.map(r => r.module_id), notes, highlights, extra });
}));

router.put('/sync', required(), wrap(async (req, res) => {
  const id = req.user.id;
  const { completed = {}, bookmarks = [], notes = {}, highlights = {}, extra = {} } = req.body || {};
  const mod = (s) => clean(s, 40);
  await db.query('DELETE FROM progress WHERE user_id=$1', [id]);
  for (const m of Object.keys(completed).filter(k => completed[k]))
    await db.query('INSERT INTO progress (user_id,module_id) VALUES ($1,$2)', [id, mod(m)]);
  await db.query('DELETE FROM bookmarks WHERE user_id=$1', [id]);
  for (const m of [...new Set(bookmarks)])
    await db.query('INSERT INTO bookmarks (user_id,module_id) VALUES ($1,$2)', [id, mod(m)]);
  await db.query('DELETE FROM notes WHERE user_id=$1', [id]);
  for (const m of Object.keys(notes))
    if (String(notes[m]).trim())
      await db.query('INSERT INTO notes (user_id,module_id,body) VALUES ($1,$2,$3)', [id, mod(m), clean(notes[m], 20000)]);
  await db.query('DELETE FROM highlights WHERE user_id=$1', [id]);
  for (const m of Object.keys(highlights))
    for (const t of highlights[m].slice(0, 200))
      await db.query('INSERT INTO highlights (user_id,module_id,text) VALUES ($1,$2,$3)', [id, mod(m), clean(t, 500)]);
  const extraText = JSON.stringify(extra && typeof extra === 'object' ? extra : {});
  if (extraText.length > 100000) return res.status(413).json({ error: 'Learner data is too large' });
  await db.query('DELETE FROM learner_data WHERE user_id=$1', [id]);
  await db.query('INSERT INTO learner_data (user_id,data) VALUES ($1,$2)', [id, extraText]);
  res.json({ ok: true });
}));

/* ---------- Quizzes & grades ---------- */
router.post('/quizzes/:moduleId/attempts', required(), wrap(async (req, res) => {
  const score = Math.max(0, Math.min(100, parseInt(req.body.score, 10)));
  if (Number.isNaN(score)) return res.status(400).json({ error: 'score required' });
  const quizId = clean(req.body.quizId, 40) || 'quiz';
  const { rows } = await db.query(
    `INSERT INTO quiz_attempts (user_id,module_id,quiz_id,score,passed)
     VALUES ($1,$2,$3,$4,$5) RETURNING id,module_id,score,passed,created_at`,
    [req.user.id, clean(req.params.moduleId, 40), quizId, score, score >= 70]);
  res.status(201).json(rows[0]);
}));

router.get('/grades', required(), wrap(async (req, res) => {
  const { rows } = await db.query(
    `SELECT module_id, MAX(score) AS best, COUNT(*) AS attempts
     FROM quiz_attempts WHERE user_id=$1 GROUP BY module_id ORDER BY module_id`, [req.user.id]);
  res.json(rows.map(r => ({ module_id: r.module_id, best: Number(r.best), attempts: Number(r.attempts) })));
}));

// RBAC example: instructors/admins see class-wide stats
router.get('/admin/stats', required('admin', 'instructor'), wrap(async (req, res) => {
  const u = await db.query('SELECT COUNT(*) AS n FROM users');
  const a = await db.query('SELECT AVG(score) AS avg, COUNT(*) AS n FROM quiz_attempts');
  res.json({ users: Number(u.rows[0].n), attempts: Number(a.rows[0].n), averageScore: Math.round(Number(a.rows[0].avg) || 0) });
}));

/* ---------- Discussion forum ---------- */
router.get('/forum', wrap(async (req, res) => {
  const mod = clean(req.query.module, 40);
  const params = []; let where = 'p.parent_id IS NULL';
  if (mod) { params.push(mod); where += ' AND p.module_id = $1'; }
  const { rows } = await db.query(
    `SELECT p.id, p.module_id, p.title, p.body, p.created_at, u.name AS author
     FROM forum_posts p JOIN users u ON u.id = p.user_id
     WHERE ${where} ORDER BY p.id DESC LIMIT 50`, params);
  res.json(rows);
}));

router.get('/forum/:id', wrap(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { rows } = await db.query(
    `SELECT p.id, p.parent_id, p.title, p.body, p.created_at, u.name AS author
     FROM forum_posts p JOIN users u ON u.id = p.user_id
     WHERE p.id = $1 OR p.parent_id = $1 ORDER BY p.id`, [id]);
  if (!rows.length) return res.status(404).json({ error: 'Thread not found' });
  res.json(rows);
}));

router.post('/forum', required(), wrap(async (req, res) => {
  const body = clean(req.body.body, 4000);
  if (!body) return res.status(400).json({ error: 'Body required' });
  let parent = null;
  if (req.body.parentId) {
    parent = parseInt(req.body.parentId, 10);
    const p = await db.query('SELECT 1 FROM forum_posts WHERE id=$1', [parent]);
    if (!p.rows.length) return res.status(404).json({ error: 'Parent not found' });
  }
  const { rows } = await db.query(
    `INSERT INTO forum_posts (user_id, module_id, parent_id, title, body)
     VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [req.user.id, clean(req.body.module, 40) || 'general', parent, clean(req.body.title, 160) || null, body]);
  res.status(201).json(rows[0]);
}));

router.delete('/forum/:id', required('admin', 'instructor'), wrap(async (req, res) => {
  await db.query('DELETE FROM forum_posts WHERE id=$1', [parseInt(req.params.id, 10)]);
  res.status(204).end();
}));

router.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

module.exports = router;
