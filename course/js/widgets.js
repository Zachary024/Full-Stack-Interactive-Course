/* Interactive lesson widgets: code tabs, steppers, playgrounds, coding challenges,
   SQL sandbox, glossary tooltips and demos. Window.Widgets.enhance(root, hooks) */
(function () {
  'use strict';
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var icon = function (n, c) { return '<svg class="i ' + (c || '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };
  var H = window.Highlight;
  var hooks = { getLang: function () { return null; }, setLang: function () {}, isDone: function () { return false; }, onChallenge: function () {} };
  var uidN = 0, uid = function (p) { return p + '-' + (++uidN); };
  var part = function (root, name) { var s = root.querySelector(':scope > script[data-part="' + name + '"]'); return s ? s.textContent.replace(/^\n/, '') : ''; };

  /* ---------------------------------------------------------- code blocks */
  function copyText(text, btn) {
    var done = function () { var s = btn.querySelector('span'), o = s.textContent; s.textContent = 'Copied'; setTimeout(function () { s.textContent = o; }, 1500); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, done);
    else { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} t.remove(); done(); }
  }
  function enhanceCode(root) {
    root.querySelectorAll('pre.code-block').forEach(function (pre) {
      if (pre.id) { pre.classList.remove('code-block'); pre.classList.add('output'); return; }
      var lang = pre.dataset.lang || 'text';
      var tag = pre.querySelector('.lang-tag'); if (tag) tag.remove();
      var code = pre.textContent.replace(/^\n+|\s+$/g, '');
      var wrap = document.createElement('div');
      wrap.dataset.lang = lang;
      if (lang === 'output') {
        wrap.className = 'code code-out';
        wrap.innerHTML = '<div class="code-head"><span>Output</span></div><pre tabindex="0"><code></code></pre>';
        wrap.querySelector('code').textContent = code;
      } else {
        wrap.className = 'code';
        wrap.innerHTML = '<div class="code-head"><span>' + esc(H.names[lang] || lang) + '</span><button type="button" class="code-copy" aria-label="Copy code">' + icon('copy') + '<span>Copy</span></button></div><pre tabindex="0"><code>' + H.highlight(code, lang) + '</code></pre>';
        wrap.querySelector('button').addEventListener('click', function (e) { copyText(code, e.currentTarget); });
      }
      pre.replaceWith(wrap);
    });
  }

  /* ---------------------------------------------------------- language tabs */
  var tabGroups = [];
  function langRank(l) { var i = window.Languages.ORDER.indexOf(l); return i < 0 ? 50 : i; }
  function buildTabs(root) {
    root.querySelectorAll('.code-tabs').forEach(function (g) {
      var panels = [].slice.call(g.querySelectorAll(':scope > .code:not(.code-out)'));
      var out = g.querySelector(':scope > .code-out');
      if (panels.length < 2) { return; }
      panels.sort(function (a, b) { return langRank(a.dataset.lang) - langRank(b.dataset.lang); });
      var id = uid('tabs');
      var list = document.createElement('div'); list.className = 'tablist'; list.setAttribute('role', 'tablist'); list.setAttribute('aria-label', (g.dataset.title || 'Code') + ' language');
      var tabs = panels.map(function (p, i) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.setAttribute('role', 'tab');
        b.id = id + '-t' + i; b.setAttribute('aria-controls', id + '-p' + i); b.dataset.lang = p.dataset.lang; b.textContent = H.names[p.dataset.lang] || p.dataset.lang;
        p.id = id + '-p' + i; p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', b.id);
        list.appendChild(b); return b;
      });
      var title = g.querySelector(':scope > .code-tabs-title');
      if (title) title.after(list); else g.prepend(list);
      var grp = { panels: panels, tabs: tabs, show: null };
      grp.show = function (lang, focus) {
        var idx = tabs.findIndex(function (t) { return t.dataset.lang === lang; });
        if (idx < 0) idx = 0;
        tabs.forEach(function (t, i) { var on = i === idx; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; panels[i].hidden = !on; });
        if (focus) tabs[idx].focus();
      };
      list.addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) { hooks.setLang(b.dataset.lang); } });
      list.addEventListener('keydown', function (e) {
        var i = tabs.indexOf(document.activeElement); if (i < 0) return;
        var n = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : -1;
        if (n >= 0) { e.preventDefault(); hooks.setLang(tabs[n].dataset.lang, true); }
      });
      tabGroups.push(grp);
      grp.show(hooks.getLang());
    });
  }
  function applyLang(lang, focus) { tabGroups = tabGroups.filter(function (g) { return document.body.contains(g.tabs[0]); }); tabGroups.forEach(function (g) { g.show(lang, focus && g.tabs.some(function (t) { return t === document.activeElement; })); }); }

  /* ---------------------------------------------------------- stepper */
  function buildSteppers(root) {
    root.querySelectorAll('.stepper').forEach(function (s) {
      var items = [].slice.call(s.querySelectorAll('.stepper-list > li'));
      if (!items.length) return;
      var i = 0, id = uid('stp');
      var box = document.createElement('div'); box.className = 'stepper-ui';
      box.innerHTML = '<div class="stepper-head"><span class="badge">Walkthrough</span><strong>' + esc(s.dataset.title || '') + '</strong></div>' +
        '<div class="stepper-dots" aria-hidden="true">' + items.map(function () { return '<i></i>'; }).join('') + '</div>' +
        '<div class="stepper-card" aria-live="polite"></div>' +
        '<div class="stepper-nav"><button type="button" class="btn btn-secondary btn-sm" data-s="-1">' + icon('arrow-left') + 'Back</button><span class="stepper-count"></span><button type="button" class="btn btn-primary btn-sm" data-s="1">Next' + icon('arrow-right') + '</button></div>';
      s.querySelector('.stepper-list').hidden = true; s.appendChild(box);
      var card = box.querySelector('.stepper-card'), dots = box.querySelectorAll('.stepper-dots i'), cnt = box.querySelector('.stepper-count');
      var back = box.querySelector('[data-s="-1"]'), next = box.querySelector('[data-s="1"]');
      function draw() {
        var li = items[i], strong = li.querySelector('strong'), sp = li.querySelector('span');
        card.innerHTML = '<div class="stepper-n">' + (i + 1) + '</div><div><div class="stepper-t">' + (strong ? strong.innerHTML : '') + '</div><div class="stepper-b">' + (sp ? sp.innerHTML : li.innerHTML) + '</div></div>';
        dots.forEach(function (d, k) { d.className = k === i ? 'on' : k < i ? 'seen' : ''; });
        cnt.textContent = 'Step ' + (i + 1) + ' of ' + items.length;
        back.disabled = i === 0; next.disabled = i === items.length - 1;
      }
      box.addEventListener('click', function (e) { var b = e.target.closest('[data-s]'); if (!b || b.disabled) return; i = Math.max(0, Math.min(items.length - 1, i + +b.dataset.s)); draw(); });
      draw();
    });
  }

  /* ---------------------------------------------------------- JS runner (Web Worker) */
  var workerUrl = null;
  function runJS(code, tests, settle) {
    return new Promise(function (resolve) {
      var w, timer, finish = function (r) { clearTimeout(timer); if (w) w.terminate(); resolve(r); };
      try {
        if (window.__RUNNER_SRC__) {            // single-file edition: no server, so use a blob worker
          if (!workerUrl) workerUrl = URL.createObjectURL(new Blob([window.__RUNNER_SRC__], { type: 'text/javascript' }));
          w = new Worker(workerUrl);
        } else w = new Worker('js/runner.js');
      } catch (e) {
        // Fallback (no Worker/blob support): run on the main thread. No timeout protection here.
        var logs = [], results = [], fatal = null;
        try {
          var cons = { log: function () { logs.push([].slice.call(arguments).join(' ')); } };
          var test = function (n, f) { try { f(); results.push({ name: n, pass: true }); } catch (er) { results.push({ name: n, pass: false, msg: String(er.message || er) }); } };
          var assert = function (c, m) { if (!c) throw new Error(m || 'Assertion failed'); };
          assert.equal = function (a, b) { if (!Object.is(a, b)) throw new Error('Expected ' + JSON.stringify(b) + ' but got ' + JSON.stringify(a)); };
          assert.deepEqual = function (a, b) { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error('Expected ' + JSON.stringify(b) + ' but got ' + JSON.stringify(a)); };
          assert.throws = function (f) { var t = false; try { f(); } catch (er) { t = true; } if (!t) throw new Error('Expected an error'); };
          (new Function('console', 'test', 'assert', code + '\n;' + (tests || '')))(cons, test, assert);
        } catch (er) { fatal = er.name + ': ' + er.message; }
        resolve({ logs: logs, results: results, fatal: fatal }); return;
      }
      timer = setTimeout(function () { finish({ logs: [], results: [], fatal: 'Timeout: your code ran for more than 4 seconds. Check for an infinite loop.' }); }, 4000);
      w.onmessage = function (e) { finish(e.data); };
      w.onerror = function (e) { finish({ logs: [], results: [], fatal: e.message || 'Script error' }); };
      w.postMessage({ code: code, tests: tests, settle: settle || 0 });
    });
  }

  /* ---------------------------------------------------------- editors */
  function editor(value, label, rows) {
    var t = document.createElement('textarea');
    t.className = 'editor'; t.value = value; t.spellcheck = false; t.setAttribute('autocapitalize', 'off'); t.setAttribute('autocomplete', 'off'); t.setAttribute('aria-label', label);
    t.rows = rows || Math.min(18, Math.max(5, value.split('\n').length + 1));
    return t;
  }

  /* ---------------------------------------------------------- playgrounds */
  function buildPlaygrounds(root) {
    root.querySelectorAll('.playground').forEach(function (pg) {
      var kind = pg.dataset.kind, title = pg.dataset.title || 'Try it';
      var intro = pg.querySelector('.pg-intro');
      var box = document.createElement('div'); box.className = 'pg';
      var head = document.createElement('div'); head.className = 'pg-head';
      head.innerHTML = '<span class="badge">Live editor</span><strong>' + esc(title) + '</strong>';
      box.appendChild(head);
      if (kind === 'html') {
        var parts = ['html', 'css', 'js'].filter(function (p) { return part(pg, p) || p === 'html'; });
        var initial = {}, eds = {};
        parts.forEach(function (p) { initial[p] = part(pg, p); });
        var tabs = document.createElement('div'); tabs.className = 'pg-tabs'; tabs.setAttribute('role', 'tablist');
        var edWrap = document.createElement('div'); edWrap.className = 'pg-editors';
        parts.forEach(function (p, i) {
          var b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.setAttribute('role', 'tab'); b.textContent = p.toUpperCase(); b.dataset.p = p;
          tabs.appendChild(b);
          eds[p] = editor(initial[p], p.toUpperCase() + ' code');
        });
        var frame = document.createElement('iframe'); frame.className = 'pg-frame'; frame.title = 'Preview: ' + title;
        frame.setAttribute('sandbox', 'allow-scripts'); frame.setAttribute('loading', 'lazy');
        var bar = document.createElement('div'); bar.className = 'pg-bar';
        bar.innerHTML = '<button type="button" class="btn btn-primary btn-sm" data-a="run">' + icon('play') + 'Run</button><button type="button" class="btn btn-secondary btn-sm" data-a="reset">' + icon('refresh') + 'Reset</button><span class="pg-note">Updates as you type</span>';
        var cols = document.createElement('div'); cols.className = 'pg-cols';
        var left = document.createElement('div'); left.className = 'pg-left'; left.appendChild(tabs); left.appendChild(edWrap); left.appendChild(bar);
        var right = document.createElement('div'); right.className = 'pg-right'; right.innerHTML = '<div class="pg-label">Result</div>'; right.appendChild(frame);
        cols.appendChild(left); cols.appendChild(right); box.appendChild(cols);
        var show = function (p) { tabs.querySelectorAll('.tab').forEach(function (t) { var on = t.dataset.p === p; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; }); edWrap.innerHTML = ''; edWrap.appendChild(eds[p]); };
        tabs.addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) show(b.dataset.p); });
        var render = function () {
          var h = eds.html.value, css = eds.css ? eds.css.value : '', js = eds.js ? eds.js.value : '';
          var doc = /<html[\s>]/i.test(h) ? h : '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:system-ui,sans-serif;margin:12px;line-height:1.5;color:#111}</style><style>' + css + '</style></head><body>' + h + '<script>' + js.replace(/<\/script/gi, '<\\/script') + '<\/script></body></html>';
          if (/<html[\s>]/i.test(h)) doc = h.replace('</head>', '<style>' + css + '</style></head>').replace('</body>', '<script>' + js.replace(/<\/script/gi, '<\\/script') + '<\/script></body>');
          frame.srcdoc = doc;
        };
        var t0; var sched = function () { clearTimeout(t0); t0 = setTimeout(render, 450); };
        Object.keys(eds).forEach(function (p) { eds[p].addEventListener('input', sched); });
        bar.addEventListener('click', function (e) {
          var a = e.target.closest('[data-a]'); if (!a) return;
          if (a.dataset.a === 'reset') parts.forEach(function (p) { eds[p].value = initial[p]; });
          render();
        });
        show('html'); render();
      } else {
        var src = part(pg, 'js');
        var ed = editor(src, 'JavaScript code');
        var out = document.createElement('pre'); out.className = 'console'; out.setAttribute('aria-live', 'polite'); out.textContent = 'Output appears here.';
        var bar2 = document.createElement('div'); bar2.className = 'pg-bar';
        bar2.innerHTML = '<button type="button" class="btn btn-primary btn-sm" data-a="run">' + icon('play') + 'Run</button><button type="button" class="btn btn-secondary btn-sm" data-a="reset">' + icon('refresh') + 'Reset</button><span class="pg-note">Ctrl or Cmd + Enter also runs</span>';
        box.appendChild(ed); box.appendChild(bar2); box.appendChild(out);
        var run = function () {
          out.textContent = 'Running...';
          runJS(ed.value, '', 400).then(function (r) {
            var t = r.logs.join('\n');
            if (r.fatal) t += (t ? '\n' : '') + r.fatal;
            out.textContent = t || '(no output - use console.log to print something)';
            out.classList.toggle('error', !!r.fatal);
          });
        };
        bar2.addEventListener('click', function (e) { var a = e.target.closest('[data-a]'); if (!a) return; if (a.dataset.a === 'reset') { ed.value = src; out.textContent = 'Output appears here.'; out.classList.remove('error'); } else run(); });
        ed.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); } });
      }
      pg.innerHTML = '';
      if (intro) pg.appendChild(intro);
      pg.appendChild(box);
    });
  }

  /* ---------------------------------------------------------- coding challenges (JS) */
  function resultList(res) {
    if (res.fatal && !res.results.length) return '<div class="ch-error">' + icon('x-circle') + '<span>' + esc(res.fatal) + '</span></div>';
    var h = '<ul class="test-list">' + res.results.map(function (r) {
      return '<li class="' + (r.pass ? 'pass' : 'fail') + '">' + icon(r.pass ? 'check-circle' : 'x-circle') + '<div><strong>' + esc(r.name) + '</strong>' + (r.pass ? '' : '<div class="test-msg">' + esc(r.msg || 'Failed') + '</div>') + '</div></li>';
    }).join('') + '</ul>';
    if (res.fatal) h = '<div class="ch-error">' + icon('x-circle') + '<span>' + esc(res.fatal) + '</span></div>' + h;
    return h;
  }
  function buildChallenges(root) {
    root.querySelectorAll('.challenge:not(.sql-challenge)').forEach(function (c) {
      var id = c.dataset.id;
      var starter = part(c, 'starter'), tests = part(c, 'tests'), solution = part(c, 'solution');
      var hints = [].slice.call(c.querySelectorAll(':scope > .hint-text')).map(function (h) { return h.innerHTML; });
      var ed = editor(starter, 'Your solution', Math.min(20, Math.max(7, starter.split('\n').length + 2)));
      var panel = document.createElement('div'); panel.className = 'ch-panel';
      var results = document.createElement('div'); results.className = 'ch-results'; results.setAttribute('aria-live', 'polite');
      var hintBox = document.createElement('div'); hintBox.className = 'ch-hints';
      var bar = document.createElement('div'); bar.className = 'pg-bar';
      bar.innerHTML = '<button type="button" class="btn btn-primary btn-sm" data-a="run">' + icon('play') + 'Run tests</button>' +
        (hints.length ? '<button type="button" class="btn btn-secondary btn-sm" data-a="hint">' + icon('bulb') + 'Hint</button>' : '') +
        '<button type="button" class="btn btn-secondary btn-sm" data-a="reset">' + icon('refresh') + 'Reset</button>' +
        '<button type="button" class="btn btn-secondary btn-sm" data-a="solution" hidden>Show solution</button>';
      panel.appendChild(ed); panel.appendChild(bar); panel.appendChild(hintBox); panel.appendChild(results);
      c.querySelectorAll(':scope > script, :scope > .hint-text').forEach(function (n) { n.remove(); });
      c.appendChild(panel);
      var head = c.querySelector('.challenge-head');
      var badge = document.createElement('span'); badge.className = 'badge badge-ok'; badge.textContent = 'Solved'; badge.hidden = !hooks.isDone(id); head.appendChild(badge);
      var fails = 0, hi = 0;
      var run = function () {
        results.innerHTML = '<div class="ch-running">Running tests...</div>';
        runJS(ed.value, tests, 0).then(function (res) {
          var passN = res.results.filter(function (r) { return r.pass; }).length, total = res.results.length;
          var ok = !res.fatal && total > 0 && passN === total;
          var summary = ok ? '<div class="ch-summary ok">' + icon('check-circle') + '<span>All ' + total + ' tests passed. Well done.</span></div>'
            : '<div class="ch-summary bad">' + icon('x-circle') + '<span>' + (res.fatal && !total ? 'Your code did not run.' : passN + ' of ' + total + ' tests passed. Read the messages below and try again.') + '</span></div>';
          var logs = res.logs.length ? '<div class="pg-label">console.log output</div><pre class="console">' + esc(res.logs.join('\n')) + '</pre>' : '';
          results.innerHTML = summary + resultList(res) + logs;
          if (ok) { badge.hidden = false; hooks.onChallenge(id); }
          else { fails++; if (fails >= 2) bar.querySelector('[data-a="solution"]').hidden = false; }
        });
      };
      bar.addEventListener('click', function (e) {
        var a = e.target.closest('[data-a]'); if (!a) return;
        if (a.dataset.a === 'run') run();
        else if (a.dataset.a === 'reset') { ed.value = starter; results.innerHTML = ''; }
        else if (a.dataset.a === 'hint') {
          if (hi < hints.length) { var p = document.createElement('div'); p.className = 'ch-hint'; p.innerHTML = icon('bulb') + '<div><strong>Hint ' + (hi + 1) + ' of ' + hints.length + '.</strong> ' + hints[hi] + '</div>'; hintBox.appendChild(p); hi++; }
          if (hi >= hints.length) a.disabled = true;
        } else if (a.dataset.a === 'solution') {
          if (window.confirm('Try the hints first. Replace your code with the solution?')) { ed.value = solution; results.innerHTML = '<div class="ch-summary bad">' + icon('x-circle') + '<span>Solution loaded. Read it line by line, then reset and write it from memory.</span></div>'; }
        }
      });
      ed.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); } });
    });
  }

  /* ---------------------------------------------------------- SQL (sql.js) */
  var sqlPromise = null;
  function loadSql() {
    if (sqlPromise) return sqlPromise;
    sqlPromise = new Promise(function (resolve, reject) {
      var init = function () {
        var cfg = {};
        if (window.__SQL_WASM_B64__) { var bin = atob(window.__SQL_WASM_B64__), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); cfg.wasmBinary = u.buffer; }
        else cfg.locateFile = function (f) { return 'vendor/sql/' + f; };
        window.initSqlJs(cfg).then(resolve, reject);
      };
      if (window.initSqlJs) return init();
      var s = document.createElement('script'); s.src = 'vendor/sql/sql-wasm.js'; s.onload = init; s.onerror = function () { reject(new Error('The SQL engine could not be loaded. Open the lesson once while online so it can be cached.')); };
      document.head.appendChild(s);
    });
    sqlPromise.catch(function () { sqlPromise = null; });
    return sqlPromise;
  }
  function sqlTable(r) {
    if (!r) return '<div class="sql-empty">Statement ran. No rows returned.</div>';
    var rows = r.values.slice(0, 200);
    return '<div class="table-wrap"><table class="sql-table"><thead><tr>' + r.columns.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (v) { return '<tr>' + v.map(function (x) { return '<td>' + (x === null ? '<em>NULL</em>' : esc(x)) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' +
      '<div class="sql-count">' + r.values.length + ' row' + (r.values.length === 1 ? '' : 's') + (r.values.length > 200 ? ' (first 200 shown)' : '') + '</div>';
  }
  function freshDb(SQL, schema) { var db = new SQL.Database(); if (schema.trim()) db.exec(schema); return db; }
  function lastResult(db, sql) { var r = db.exec(sql); return r.length ? r[r.length - 1] : null; }

  function buildSql(root) {
    root.querySelectorAll('.sqlplay').forEach(function (pg) {
      var schema = part(pg, 'schema'), starter = part(pg, 'starter');
      var intro = pg.querySelector('.pg-intro');
      var box = document.createElement('div'); box.className = 'pg';
      box.innerHTML = '<div class="pg-head"><span class="badge">SQL sandbox</span><strong>' + esc(pg.dataset.title) + '</strong></div>';
      var details = document.createElement('details'); details.className = 'sql-schema';
      details.innerHTML = '<summary>Show the tables in this sandbox</summary>'; var pre = document.createElement('pre'); pre.className = 'code-block-lite'; pre.innerHTML = H.highlight(schema.trim(), 'sql'); details.appendChild(pre);
      var ed = editor(starter, 'SQL query', 5);
      var out = document.createElement('div'); out.className = 'sql-out'; out.setAttribute('aria-live', 'polite');
      var bar = document.createElement('div'); bar.className = 'pg-bar';
      bar.innerHTML = '<button type="button" class="btn btn-primary btn-sm" data-a="run">' + icon('play') + 'Run</button><button type="button" class="btn btn-secondary btn-sm" data-a="reset">' + icon('refresh') + 'Reset data</button><span class="pg-note">Runs in your browser. Nothing is sent anywhere.</span>';
      box.appendChild(details); box.appendChild(ed); box.appendChild(bar); box.appendChild(out);
      pg.innerHTML = ''; if (intro) pg.appendChild(intro); pg.appendChild(box);
      var db = null;
      var run = function (reset) {
        out.innerHTML = '<div class="ch-running">Running...</div>';
        loadSql().then(function (SQL) {
          if (!db || reset === true) db = freshDb(SQL, schema);
          if (reset === true) { out.innerHTML = '<div class="sql-empty">Data reset to the original tables.</div>'; return; }
          try { out.innerHTML = sqlTable(lastResult(db, ed.value)); }
          catch (e) { out.innerHTML = '<div class="ch-error">' + icon('x-circle') + '<span>' + esc(e.message) + '</span></div>'; }
        }).catch(function (e) { out.innerHTML = '<div class="ch-error">' + icon('x-circle') + '<span>' + esc(e.message) + '</span></div>'; });
      };
      bar.addEventListener('click', function (e) { var a = e.target.closest('[data-a]'); if (a) run(a.dataset.a === 'reset'); });
      ed.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); } });
    });

    root.querySelectorAll('.sql-challenge').forEach(function (c) {
      var id = c.dataset.id, schema = part(c, 'schema'), starter = part(c, 'starter'), solution = part(c, 'solution');
      var hints = [].slice.call(c.querySelectorAll(':scope > .hint-text')).map(function (h) { return h.innerHTML; });
      var ed = editor(starter, 'Your SQL query', 5);
      var panel = document.createElement('div'); panel.className = 'ch-panel';
      var details = document.createElement('details'); details.className = 'sql-schema';
      details.innerHTML = '<summary>Show the tables</summary>'; var pre = document.createElement('pre'); pre.className = 'code-block-lite'; pre.innerHTML = H.highlight(schema.trim(), 'sql'); details.appendChild(pre);
      var results = document.createElement('div'); results.className = 'ch-results'; results.setAttribute('aria-live', 'polite');
      var hintBox = document.createElement('div'); hintBox.className = 'ch-hints';
      var bar = document.createElement('div'); bar.className = 'pg-bar';
      bar.innerHTML = '<button type="button" class="btn btn-primary btn-sm" data-a="run">' + icon('play') + 'Run and check</button>' +
        (hints.length ? '<button type="button" class="btn btn-secondary btn-sm" data-a="hint">' + icon('bulb') + 'Hint</button>' : '') +
        '<button type="button" class="btn btn-secondary btn-sm" data-a="solution" hidden>Show solution</button>';
      panel.appendChild(details); panel.appendChild(ed); panel.appendChild(bar); panel.appendChild(hintBox); panel.appendChild(results);
      c.querySelectorAll(':scope > script, :scope > .hint-text').forEach(function (n) { n.remove(); });
      c.appendChild(panel);
      var badge = document.createElement('span'); badge.className = 'badge badge-ok'; badge.textContent = 'Solved'; badge.hidden = !hooks.isDone(id); c.querySelector('.challenge-head').appendChild(badge);
      var fails = 0, hi = 0;
      var norm = function (r) { return r ? r.values.map(function (v) { return JSON.stringify(v.map(function (x) { return typeof x === 'number' ? Math.round(x * 1e6) / 1e6 : x; })); }) : []; };
      var check = function () {
        results.innerHTML = '<div class="ch-running">Running...</div>';
        loadSql().then(function (SQL) {
          var mine, want;
          try { var d1 = freshDb(SQL, schema); mine = lastResult(d1, ed.value); } catch (e) { results.innerHTML = '<div class="ch-error">' + icon('x-circle') + '<span>' + esc(e.message) + '</span></div>'; fails++; return; }
          var d2 = freshDb(SQL, schema); want = lastResult(d2, solution);
          var ordered = /order\s+by/i.test(solution);
          var a = norm(mine), b = norm(want);
          if (!ordered) { a = a.slice().sort(); b = b.slice().sort(); }
          var sameCols = mine && want && mine.columns.length === want.columns.length;
          var ok = sameCols && a.length === b.length && a.every(function (x, i) { return x === b[i]; });
          var msg;
          if (ok) msg = 'Your query returns exactly the expected result.';
          else if (!mine) msg = 'Your query returned no result set. Did you write a SELECT?';
          else if (!sameCols) msg = 'Expected ' + want.columns.length + ' column' + (want.columns.length === 1 ? '' : 's') + ' but your query returned ' + mine.columns.length + '.';
          else if (a.length !== b.length) msg = 'Expected ' + b.length + ' row' + (b.length === 1 ? '' : 's') + ' but your query returned ' + a.length + '.';
          else msg = 'The right number of rows came back, but some values differ' + (ordered ? ' (check the ORDER BY too)' : '') + '.';
          results.innerHTML = '<div class="ch-summary ' + (ok ? 'ok' : 'bad') + '">' + icon(ok ? 'check-circle' : 'x-circle') + '<span>' + esc(msg) + '</span></div><div class="pg-label">Your result</div>' + sqlTable(mine);
          if (ok) { badge.hidden = false; hooks.onChallenge(id); } else { fails++; if (fails >= 2) bar.querySelector('[data-a="solution"]').hidden = false; }
        }).catch(function (e) { results.innerHTML = '<div class="ch-error">' + icon('x-circle') + '<span>' + esc(e.message) + '</span></div>'; });
      };
      bar.addEventListener('click', function (e) {
        var a = e.target.closest('[data-a]'); if (!a) return;
        if (a.dataset.a === 'run') check();
        else if (a.dataset.a === 'hint') { if (hi < hints.length) { var p = document.createElement('div'); p.className = 'ch-hint'; p.innerHTML = icon('bulb') + '<div><strong>Hint ' + (hi + 1) + ' of ' + hints.length + '.</strong> ' + hints[hi] + '</div>'; hintBox.appendChild(p); hi++; } if (hi >= hints.length) a.disabled = true; }
        else if (a.dataset.a === 'solution') { if (window.confirm('Try the hints first. Replace your query with the solution?')) ed.value = solution; }
      });
      ed.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); check(); } });
    });
  }

  /* ---------------------------------------------------------- glossary tooltips */
  var tip = null, tipFor = null;
  function closeTip() { if (tip) { tip.remove(); tip = null; } if (tipFor) { tipFor.setAttribute('aria-expanded', 'false'); tipFor = null; } }
  function openTip(btn) {
    if (tipFor === btn) { closeTip(); return; }
    closeTip();
    tip = document.createElement('div'); tip.className = 'term-tip'; tip.setAttribute('role', 'tooltip');
    tip.innerHTML = '<strong>' + esc(btn.dataset.term) + '</strong><div>' + esc(btn.dataset.def) + '</div><a href="#glossary">Open glossary</a>';
    document.body.appendChild(tip); tipFor = btn; btn.setAttribute('aria-expanded', 'true');
    var r = btn.getBoundingClientRect(), t = tip.getBoundingClientRect();
    var left = Math.max(8, Math.min(window.innerWidth - t.width - 8, r.left + r.width / 2 - t.width / 2));
    var top = r.bottom + 8; if (top + t.height > window.innerHeight - 8) top = Math.max(8, r.top - t.height - 8);
    tip.style.left = left + 'px'; tip.style.top = top + 'px';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.term');
    if (b) { e.preventDefault(); openTip(b); return; }
    if (tip && !tip.contains(e.target)) closeTip();
    else if (tip && e.target.closest('a')) closeTip();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeTip(); });
  window.addEventListener('scroll', closeTip, { passive: true });
  window.addEventListener('hashchange', closeTip);

  /* ---------------------------------------------------------- demos */
  var b64url = function (buf) { var s = ''; new Uint8Array(buf).forEach(function (b) { s += String.fromCharCode(b); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  var b64urlText = function (t) { return b64url(new TextEncoder().encode(t)); };
  var unb64 = function (s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return decodeURIComponent(escape(atob(s))); };
  function hmac(secret, data) {
    var enc = new TextEncoder();
    return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']).then(function (k) { return crypto.subtle.sign('HMAC', k, enc.encode(data)); });
  }
  function demoJwt(m) {
    m.innerHTML = '<div class="demo"><div class="demo-head"><span class="badge">Interactive</span><strong>Build and verify a JSON Web Token</strong></div>' +
      '<label class="lbl" for="jw-p">Payload (JSON)</label><textarea id="jw-p" class="editor" rows="4" spellcheck="false">{"sub":"42","name":"Ada","role":"student"}</textarea>' +
      '<label class="lbl" for="jw-s">Secret key (only the server knows this)</label><input id="jw-s" class="field" value="my-secret-key" spellcheck="false" autocomplete="off">' +
      '<div class="pg-bar"><button type="button" class="btn btn-primary btn-sm" data-a="sign">Sign token</button><button type="button" class="btn btn-secondary btn-sm" data-a="tamper">Tamper with the payload</button><button type="button" class="btn btn-secondary btn-sm" data-a="verify">Verify</button></div>' +
      '<div class="jwt-out" aria-live="polite"><div class="pg-label">Token</div><div class="jwt-token" id="jw-t">Press "Sign token".</div><div class="jwt-status" id="jw-v"></div></div></div>';
    var tok = '', $ = function (s) { return m.querySelector(s); };
    var setTok = function (t) { tok = t; var p = t.split('.'); $('#jw-t').innerHTML = '<span class="j1">' + esc(p[0]) + '</span>.<span class="j2">' + esc(p[1]) + '</span>.<span class="j3">' + esc(p[2] || '') + '</span>'; };
    var status = function (ok, msg) { var v = $('#jw-v'); v.className = 'jwt-status ' + (ok ? 'ok' : 'bad'); v.innerHTML = icon(ok ? 'check-circle' : 'x-circle') + '<span>' + esc(msg) + '</span>'; };
    var noCrypto = function () { status(false, 'This demo needs the Web Crypto API (HTTPS or localhost).'); };
    m.addEventListener('click', function (e) {
      var a = e.target.closest('[data-a]'); if (!a) return;
      if (!(window.crypto && crypto.subtle)) return noCrypto();
      if (a.dataset.a === 'sign') {
        var payload; try { payload = JSON.stringify(JSON.parse($('#jw-p').value)); } catch (er) { return status(false, 'The payload is not valid JSON: ' + er.message); }
        var head = b64urlText('{"alg":"HS256","typ":"JWT"}'), body = b64urlText(payload);
        hmac($('#jw-s').value, head + '.' + body).then(function (sig) { setTok(head + '.' + body + '.' + b64url(sig)); status(true, 'Signed. Anyone can read the payload, but only the key holder can create a valid signature.'); });
      } else if (a.dataset.a === 'tamper') {
        if (!tok) return status(false, 'Sign a token first.');
        var p = tok.split('.'), obj; try { obj = JSON.parse(unb64(p[1])); } catch (er) { return status(false, 'Cannot read the payload.'); }
        obj.role = 'admin'; setTok(p[0] + '.' + b64urlText(JSON.stringify(obj)) + '.' + p[2]); status(false, 'Payload changed to role "admin" but the old signature was kept. Now press Verify.');
      } else if (a.dataset.a === 'verify') {
        if (!tok) return status(false, 'Sign a token first.');
        var q = tok.split('.');
        hmac($('#jw-s').value, q[0] + '.' + q[1]).then(function (sig) {
          if (b64url(sig) === q[2]) status(true, 'Signature valid. The server trusts this token.'); else status(false, 'Signature INVALID. The server rejects this token because the payload no longer matches the signature.');
        });
      }
    });
  }

  function demoFinder(m) {
    var L = window.Languages, saved = (hooks.getPrefs && hooks.getPrefs()) || {};
    var ans = { goal: saved.goal || '', exp: saved.exp || '', style: saved.style || '' };
    var radios = function (name, opts, v) { return '<fieldset class="finder-q"><legend>' + name[1] + '</legend><div class="finder-opts">' + opts.map(function (o) { return '<label class="chip-radio"><input type="radio" name="fd-' + name[0] + '" value="' + o[0] + '"' + (v === o[0] ? ' checked' : '') + '><span>' + esc(o[1]) + '</span></label>'; }).join('') + '</div></fieldset>'; };
    m.innerHTML = '<div class="demo finder"><div class="demo-head"><span class="badge">Interactive</span><strong>Which language should I learn first?</strong></div>' +
      radios(['goal', 'What do you most want to build?'], L.GOALS, ans.goal) + radios(['exp', 'How much programming have you done?'], L.EXPERIENCE, ans.exp) + radios(['style', 'What matters most to you?'], L.STYLE, ans.style) +
      '<div class="finder-result" aria-live="polite"></div></div>';
    var out = m.querySelector('.finder-result');
    var render = function () {
      if (!ans.goal || !ans.exp) { out.innerHTML = '<p class="muted">Answer the first two questions to see your matches.</p>'; return; }
      var scores = hooks.getScores ? hooks.getScores() : {};
      var rec = L.recommend(ans, scores).slice(0, 3);
      out.innerHTML = '<div class="pg-label">Your top matches</div><ol class="finder-list">' + rec.map(function (r, i) {
        var d = L.DATA[r.id]; return '<li class="' + (i === 0 ? 'top' : '') + '"><div><strong>' + esc(d.name) + '</strong> <span class="muted">' + esc(d.tag) + '</span><p>' + esc(d.first) + '</p>' +
          (r.why.length ? '<p class="why">Why: ' + esc(r.why.join(', ')) + '.</p>' : '') + '</div>' + '<button type="button" class="btn btn-secondary btn-sm" data-lang="' + r.id + '">Use ' + esc(d.name) + ' in examples</button></li>';
      }).join('') + '</ol><p class="muted">You can change your language at any time from the selector in the sidebar. Code examples that include it will switch automatically.</p>';
    };
    m.addEventListener('change', function (e) { var r = e.target; if (r.name && r.name.indexOf('fd-') === 0) { ans[r.name.slice(3)] = r.value; if (hooks.setPrefs) hooks.setPrefs(ans); render(); } });
    m.addEventListener('click', function (e) { var b = e.target.closest('[data-lang]'); if (b) { hooks.setLang(b.dataset.lang); b.textContent = 'Selected: ' + L.name(b.dataset.lang); } });
    render();
  }
  function buildDemos(root) {
    root.querySelectorAll('.demo-mount').forEach(function (m) {
      if (m.dataset.demo === 'jwt') demoJwt(m);
      else if (m.dataset.demo === 'finder') demoFinder(m);
    });
  }

  /* ---------------------------------------------------------- public API */

  /* ---------- Projects: requirement checklist, rubric, reflection, completion ---------- */
  function buildProjects(root) {
    root.querySelectorAll('.project').forEach(function (box) {
      var id = box.dataset.id, nReq = +box.dataset.req;
      var saved = (hooks.getProject && hooks.getProject(id)) || {};
      var boxes = box.querySelectorAll('input[type="checkbox"]');
      var link = box.querySelector('input[type="url"]'), note = box.querySelector('textarea');
      var finish = box.querySelector('[data-a="finish"]'), reopen = box.querySelector('[data-a="reopen"]');
      var fill = box.querySelector('.fill'), count = box.querySelector('.pj-count');
      var data = { req: [], stretch: [], rubric: false, link: '', note: '', done: !!saved.done, doneAt: saved.doneAt || null };
      boxes.forEach(function (b) {
        var k = b.dataset.k, v = false;
        if (k === 'rubric') v = !!saved.rubric;
        else if (k[0] === 'r') v = !!(saved.req && saved.req[+k.slice(1)]);
        else v = !!(saved.stretch && saved.stretch[+k.slice(1)]);
        b.checked = v;
      });
      if (saved.link) link.value = saved.link;
      if (saved.note) note.value = saved.note;
      function collect() {
        data.req = []; data.stretch = []; data.rubric = false;
        boxes.forEach(function (b) {
          var k = b.dataset.k;
          if (k === 'rubric') data.rubric = b.checked;
          else if (k[0] === 'r') data.req[+k.slice(1)] = b.checked;
          else data.stretch[+k.slice(1)] = b.checked;
        });
        data.link = link.value.trim(); data.note = note.value.slice(0, 2000);
      }
      function linkOk() {
        if (!data.link) return true;
        try { var u = new URL(data.link); return u.protocol === 'http:' || u.protocol === 'https:'; } catch (e) { return false; }
      }
      function paint() {
        collect();
        var got = data.req.filter(Boolean).length, ok = got === nReq && data.rubric && linkOk();
        var pct = Math.round((got + (data.rubric ? 1 : 0)) / (nReq + 1) * 100);
        fill.style.width = (data.done ? 100 : pct) + '%';
        count.textContent = data.done ? 'Project complete' : got + ' of ' + nReq + ' requirements met' + (data.rubric ? ', rubric reviewed' : '');
        link.setAttribute('aria-invalid', linkOk() ? 'false' : 'true');
        var lbl = link.closest('.form-row').querySelector('.label');
        var msg = box.querySelector('.pj-linkmsg');
        if (!linkOk()) { if (!msg) { msg = document.createElement('p'); msg.className = 'form-msg error pj-linkmsg'; msg.setAttribute('role', 'alert'); link.closest('.form-row').appendChild(msg); } msg.textContent = 'Enter a full web address starting with http:// or https://'; }
        else if (msg) msg.remove();
        finish.disabled = data.done || !ok;
        finish.hidden = data.done; reopen.hidden = !data.done;
        box.classList.toggle('is-done', data.done);
        box.querySelectorAll('input, textarea').forEach(function (i) { if (i.type === 'checkbox') i.disabled = false; });
      }
      function save(kind) { collect(); if (hooks.onProject) hooks.onProject(id, JSON.parse(JSON.stringify(data)), kind); }
      boxes.forEach(function (b) { b.addEventListener('change', function () { paint(); save('edit'); }); });
      link.addEventListener('input', function () { paint(); });
      link.addEventListener('change', function () { if (linkOk()) save('edit'); });
      var t; note.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { collect(); save('edit'); }, 500); });
      finish.addEventListener('click', function () { collect(); data.done = true; data.doneAt = new Date().toISOString(); paint(); save('finish'); reopen.focus(); });
      reopen.addEventListener('click', function () { data.done = false; data.doneAt = null; paint(); save('reopen'); });
      paint();
    });
  }

  /* ---------- Cheat sheets: live filter and copy buttons ---------- */
  function buildCheats(root) {
    var sheets = root.querySelectorAll('.cheat');
    if (!sheets.length) return;
    root.querySelectorAll('.cs-copy').forEach(function (b) {
      b.addEventListener('click', function () { copyText(b.dataset.copy, b); });
    });
    var bar = document.createElement('div');
    bar.className = 'cheat-filter';
    bar.innerHTML = '<label class="sr-only" for="csFilter">Filter this page</label><input id="csFilter" class="field" type="search" placeholder="Filter this page: type a command, key or word" autocomplete="off"><p class="cheat-status" role="status" aria-live="polite"></p>';
    var head = root.querySelector('.lesson-head');
    if (head) head.after(bar); else root.prepend(bar);
    var input = bar.querySelector('input'), status = bar.querySelector('.cheat-status');
    var heads = root.querySelectorAll('h2');
    function run() {
      var q = input.value.trim().toLowerCase(), shown = 0, total = 0;
      sheets.forEach(function (sh) {
        var any = 0;
        sh.querySelectorAll('tbody tr').forEach(function (tr) {
          total++;
          var hit = !q || tr.textContent.toLowerCase().indexOf(q) >= 0;
          tr.hidden = !hit; if (hit) { any++; shown++; }
        });
        sh.hidden = !any;
        var prev = sh.previousElementSibling;
        if (prev && prev.classList.contains('cheat-title')) prev.hidden = !any;
      });
      heads.forEach(function (h) {
        var n = h.nextElementSibling, cheats = 0, vis = 0;
        while (n && n.tagName !== 'H2') { if (n.classList.contains('cheat')) { cheats++; if (!n.hidden) vis++; } n = n.nextElementSibling; }
        h.hidden = !!q && cheats > 0 && !vis;
      });
      status.textContent = q ? (shown ? shown + ' of ' + total + ' entries match' : 'No entries match') : '';
    }
    input.addEventListener('input', run);
  }

  function enhance(root, h) {
    if (h) { for (var k in h) hooks[k] = h[k]; }
    enhanceCode(root);
    buildTabs(root);
    buildSteppers(root);
    buildPlaygrounds(root);
    buildChallenges(root);
    buildSql(root);
    buildDemos(root);
    buildProjects(root);
    buildCheats(root);
  }
  window.Widgets = { enhance: enhance, enhanceCode: enhanceCode, applyLang: applyLang, runJS: runJS, setHooks: function (h) { for (var k in h) hooks[k] = h[k]; } };
})();
