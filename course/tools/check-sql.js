// Verifies every SQL sandbox and SQL challenge using the same sql.js build as the browser.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const initSqlJs = require(path.join(root, 'vendor/sql/sql-wasm.js'));
const last = (db, sql) => { const r = db.exec(sql); return r.length ? r[r.length - 1] : null; };
const norm = (r) => r ? r.values.map(v => JSON.stringify(v.map(x => typeof x === 'number' ? Math.round(x * 1e6) / 1e6 : x))) : [];
(async () => {
  const SQL = await initSqlJs({ locateFile: (f) => path.join(root, 'vendor/sql', f) });
  const list = JSON.parse(fs.readFileSync(path.join(root, 'build/sqlchecks.json'), 'utf8'));
  let bad = 0;
  for (const c of list) {
    try {
      const d1 = new SQL.Database(); d1.exec(c.schema);
      if (c.kind === 'play') { last(d1, c.starter); continue; }
      const sol = last(d1, c.solution);
      if (!sol || !sol.values.length) throw new Error('solution returns no rows');
      const d2 = new SQL.Database(); d2.exec(c.schema);
      let st = null, err = false;
      try { st = last(d2, c.starter); } catch (e) { err = true; }
      const same = !err && st && JSON.stringify(norm(st)) === JSON.stringify(norm(sol));
      if (same) throw new Error('starter already gives the right answer');
    } catch (e) { bad++; console.log('FAIL', c.id, e.message); }
  }
  console.log(`${list.length} SQL items checked, ${bad} failing`);
  process.exit(bad ? 1 : 0);
})();
