/* Sandboxed code runner (Web Worker). Runs learner code plus tests and posts back
   { logs, results, fatal }. Served with its own CSP that allows eval ONLY for this file;
   the main page keeps a strict CSP. */
self.onmessage = function (ev) {
  var code = ev.data.code, tests = ev.data.tests || '', settle = ev.data.settle || 0;
  var logs = [], results = [], pending = [];
  var fmt = function (v) {
    try {
      if (typeof v === 'string') return v;
      if (v === undefined) return 'undefined';
      if (typeof v === 'function') return v.toString();
      if (v instanceof Error) return String(v);
      var s = JSON.stringify(v, function (k, x) {
        return typeof x === 'bigint' ? x.toString() + 'n' : x === undefined ? 'undefined' : (x instanceof Map ? Object.fromEntries(x) : x instanceof Set ? Array.from(x) : x);
      });
      return s === undefined ? String(v) : s;
    } catch (e) { return String(v); }
  };
  var push = function (a) { logs.push(Array.prototype.map.call(a, fmt).join(' ')); };
  var cons = { log: function () { push(arguments); }, info: function () { push(arguments); }, warn: function () { push(arguments); }, error: function () { push(arguments); } };
  var same = function (a, b) { return JSON.stringify(a) === JSON.stringify(b); };
  var assert = function (c, m) { if (!c) throw new Error(m || 'Assertion failed'); };
  assert.equal = function (a, b, m) { if (!Object.is(a, b)) throw new Error((m ? m + ' - ' : '') + 'Expected ' + fmt(b) + ' but got ' + fmt(a)); };
  assert.deepEqual = function (a, b, m) { if (!same(a, b)) throw new Error((m ? m + ' - ' : '') + 'Expected ' + fmt(b) + ' but got ' + fmt(a)); };
  assert.throws = function (f, m) { var t = false; try { f(); } catch (e) { t = true; } if (!t) throw new Error(m || 'Expected an error to be thrown'); };
  var test = function (name, fn) {
    var slot = results.length; results.push(null);
    try {
      var r = fn();
      if (r && typeof r.then === 'function') {
        pending.push(r.then(function () { results[slot] = { name: name, pass: true }; },
          function (e) { results[slot] = { name: name, pass: false, msg: String(e && e.message || e) }; }));
      } else results[slot] = { name: name, pass: true };
    } catch (e) { results[slot] = { name: name, pass: false, msg: String(e && e.message || e) }; }
  };
  var fatal = null;
  try { (new Function('console', 'test', 'assert', code + '\n;' + tests))(cons, test, assert); }
  catch (e) { fatal = (e && e.name ? e.name + ': ' : '') + (e && e.message || e); }
  Promise.all(pending).then(function () { return new Promise(function (r) { setTimeout(r, settle); }); }).then(function () {
    postMessage({ logs: logs, results: results.filter(Boolean), fatal: fatal });
  });
};
