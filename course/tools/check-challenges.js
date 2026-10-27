// Verifies every coding challenge: the solution must pass all tests, the starter must fail at least one.
// Uses the very same worker harness source as the browser (js/runner.js).
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const WORKER_SRC = fs.readFileSync(path.join(root, 'js/runner.js'), 'utf8');

function run(code, tests) {
  return new Promise((resolve) => {
    const sandbox = { setTimeout, Promise, JSON, Object, Array, Error, String, Map, Set, Math, Number, Date, RegExp, Symbol, BigInt, URL, URLSearchParams, parseInt, parseFloat, isNaN, Intl };
    sandbox.self = sandbox; sandbox.postMessage = resolve;
    vm.createContext(sandbox);
    vm.runInContext(WORKER_SRC, sandbox);
    const t = setTimeout(() => resolve({ fatal: 'timeout', results: [], logs: [] }), 5000);
    sandbox.onmessage({ data: { code, tests, settle: 0 } });
  });
}
(async () => {
  const list = JSON.parse(fs.readFileSync(path.join(root, 'build/challenges.json'), 'utf8'));
  let bad = 0;
  for (const c of list) {
    const sol = await run(c.solution, c.tests);
    const solPass = !sol.fatal && sol.results.length > 0 && sol.results.every(r => r.pass);
    const st = await run(c.starter, c.tests);
    const starterFails = st.fatal || st.results.some(r => !r.pass) || st.results.length === 0;
    const flag = solPass && starterFails ? 'ok  ' : 'FAIL';
    if (flag === 'FAIL') {
      bad++;
      console.log(flag, c.id, solPass ? '' : 'solution fails: ' + (sol.fatal || JSON.stringify(sol.results.filter(r => !r.pass))), starterFails ? '' : 'starter already passes');
    }
  }
  console.log(`${list.length} challenges checked, ${bad} failing`);
  process.exit(bad ? 1 : 0);
})();
