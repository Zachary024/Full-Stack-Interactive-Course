// Usage: DATABASE_URL=... node scripts/make-admin.js you@example.com [student|instructor|admin]
// Changes the role of an existing account (create the account in the app first).
const db = require('../db');
(async () => {
  const [email, role = 'admin'] = process.argv.slice(2);
  if (!email || !['student', 'instructor', 'admin'].includes(role)) {
    console.error('Usage: node scripts/make-admin.js <email> [student|instructor|admin]'); process.exit(1);
  }
  if (!process.env.DATABASE_URL) { console.error('Set DATABASE_URL first (otherwise this would only change a throw-away in-memory database).'); process.exit(1); }
  await db.init();
  const r = await db.query('UPDATE users SET role = $1 WHERE lower(email) = lower($2) RETURNING id, email, role', [role, email]);
  if (!r.rows.length) { console.error('No account with that email. Register in the app first.'); process.exit(2); }
  console.log('Updated:', r.rows[0]); process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
