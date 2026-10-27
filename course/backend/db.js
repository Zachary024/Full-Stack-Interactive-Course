// Database layer: PostgreSQL via `pg`.
// If DATABASE_URL is not set, falls back to an in-memory Postgres (pg-mem) so
// the project runs with zero setup in development. Data is NOT persisted then.
const fs = require('fs');
const path = require('path');

let pool;

async function init() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  if (process.env.DATABASE_URL) {
    const { Pool } = require('pg');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });
    await pool.query(schema);
    console.log('[db] connected to PostgreSQL');
  } else {
    const { newDb } = require('pg-mem');
    const mem = newDb();
    const { Pool } = mem.adapters.createPg();
    pool = new Pool();
    await pool.query(schema);
    console.warn('[db] DATABASE_URL not set - using in-memory database (dev only)');
  }
  return pool;
}

const query = (text, params) => pool.query(text, params);
module.exports = { init, query };
