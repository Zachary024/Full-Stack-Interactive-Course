/* Quiz engine. Window.Quiz.mount(el, data, opts)
   data = { id, kind: 'check'|'test', title, questions: [ {t, q, o?, a, why} ] }
   Question types: mcq, tf, short, multi, order. All question/option text arrives as trusted,
   build-time sanitised HTML (inline code + bold only).
   - check : instant feedback after each answer; never completes a module.
   - test  : answer everything, submit once, review explanations; pass mark completes a module. */
(function () {
  'use strict';
  var PASS = 0.7, KEYS = 'ABCDEFGH';
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var icon = function (n) { return '<svg class="i" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };
  var strip = function (h) { var d = document.createElement('div'); d.innerHTML = h; return d.textContent; };

  function norm(s) { return String(s == null ? '' : s).toLowerCase().replace(/[`"'.,;:!?]+/g, '').replace(/\s+/g, ' ').trim(); }

  function isCorrect(q, a) {
    if (a === undefined || a === null) return false;
    switch (q.t) {
      case 'mcq': return a === q.a;
      case 'tf': return a === q.a;
      case 'short': return q.a.some(function (x) { return norm(x) === norm(a); });
      case 'multi': return Array.isArray(a) && a.length === q.a.length && q.a.every(function (x) { return a.indexOf(x) >= 0; });
      case 'order': return Array.isArray(a) && a.length === q.o.length && a.every(function (v, i) { return v === q.a[i]; });
    }
    return false;
  }
  function answered(q, a) {
    if (q.t === 'multi') return Array.isArray(a) && a.length > 0;
    if (q.t === 'short') return !!norm(a);
    return a !== undefined && a !== null;
  }
  function correctText(q) {
    switch (q.t) {
      case 'mcq': return q.o[q.a];
      case 'tf': return q.a ? 'True' : 'False';
      case 'short': return esc(q.a[0]);
      case 'multi': return q.a.map(function (i) { return q.o[i]; }).join('; ');
      case 'order': return q.a.map(function (k, i) { return (i + 1) + '. ' + q.o[k]; }).join(' &rarr; ');
    }
  }

  function mount(root, data, opts) {
    opts = opts || {};
    var qs = data.questions, isTest = data.kind === 'test';
    var uid = 'qz-' + data.id.replace(/[^a-z0-9]+/gi, '-');
    var answers = {}, locked = {}, submitted = false;

    // order questions start in their shuffled order
    qs.forEach(function (q, i) { if (q.t === 'order') answers[i] = q.o.map(function (_, k) { return k; }); });

    function right() { return qs.filter(function (q, i) { return isCorrect(q, answers[i]); }).length; }
    function done() { return isTest ? submitted : qs.every(function (q, i) { return locked[i]; }); }

    function qBody(q, i) {
      var show = isTest ? submitted : locked[i];
      var a = answers[i], h = '';
      var dis = show ? ' disabled' : '';
      if (q.t === 'mcq' || q.t === 'tf') {
        var opts2 = q.t === 'mcq' ? q.o.map(function (o, k) { return { l: o, v: k, key: KEYS[k] }; }) : [{ l: 'True', v: true, key: 'T' }, { l: 'False', v: false, key: 'F' }];
        h += '<div class="opts" role="group" aria-label="Answer options">' + opts2.map(function (o) {
          var cls = a === o.v ? 'selected' : '';
          if (show) cls = o.v === q.a ? 'correct' : (a === o.v ? 'wrong' : '');
          return '<button type="button" class="opt ' + cls + '" data-q="' + i + '" data-v="' + o.v + '" aria-pressed="' + (a === o.v) + '"' + dis + '><span class="opt-key">' + o.key + '</span><span>' + o.l + '</span></button>';
        }).join('') + '</div>';
      } else if (q.t === 'multi') {
        h += '<div class="opts" role="group" aria-label="Select all that apply">' + q.o.map(function (o, k) {
          var on = Array.isArray(a) && a.indexOf(k) >= 0, cls = on ? 'selected' : '';
          if (show) cls = q.a.indexOf(k) >= 0 ? 'correct' : (on ? 'wrong' : '');
          return '<button type="button" class="opt opt-multi ' + cls + '" data-q="' + i + '" data-m="' + k + '" aria-pressed="' + on + '"' + dis + '><span class="opt-key opt-box">' + (on ? icon('check') : '') + '</span><span>' + o + '</span></button>';
        }).join('') + '</div><div class="q-hint">Select all that apply.</div>';
      } else if (q.t === 'short') {
        h += '<input class="field" type="text" data-q="' + i + '" aria-label="Answer to question ' + (i + 1) + '" value="' + esc(a || '') + '" placeholder="Type your answer" autocomplete="off" autocapitalize="off" spellcheck="false"' + dis + '>';
      } else if (q.t === 'order') {
        h += '<ol class="order-list" aria-label="Put these steps in order">' + a.map(function (k, pos) {
          var cls = '';
          if (show) cls = q.a[pos] === k ? 'correct' : 'wrong';
          return '<li class="order-item ' + cls + '"><span class="order-n">' + (pos + 1) + '</span><span class="order-t">' + q.o[k] + '</span>' +
            '<span class="order-btns"><button type="button" class="icon-btn sm" data-q="' + i + '" data-mv="' + pos + '" data-d="-1" aria-label="Move up"' + (dis || (pos === 0 ? ' disabled' : '')) + '>' + icon('chev-up') + '</button>' +
            '<button type="button" class="icon-btn sm" data-q="' + i + '" data-mv="' + pos + '" data-d="1" aria-label="Move down"' + (dis || (pos === a.length - 1 ? ' disabled' : '')) + '>' + icon('chev-down') + '</button></span></li>';
        }).join('') + '</ol><div class="q-hint">Use the arrows to put the items in the correct order.</div>';
      }
      if (!isTest && !locked[i] && (q.t === 'multi' || q.t === 'short' || q.t === 'order')) {
        h += '<div class="q-actions"><button type="button" class="btn btn-secondary btn-sm" data-check="' + i + '">Check answer</button></div>';
      }
      if (show) {
        var ok = isCorrect(q, a);
        h += '<div class="q-feedback ' + (ok ? 'ok' : 'bad') + '" role="status">' + icon(ok ? 'check-circle' : 'x-circle') +
          '<div><strong>' + (ok ? 'Correct.' : 'Not quite.') + '</strong>' + (ok ? '' : ' Correct answer: ' + correctText(q) + '.') +
          (q.why ? '<div class="q-why">' + q.why + '</div>' : '') + '</div></div>';
      }
      return h;
    }

    function render() {
      var total = qs.length, r = right(), sc = r / total, pass = sc >= PASS;
      var lockedN = Object.keys(locked).length;
      var cls = 'quiz ' + (isTest ? 'quiz-test' : 'quiz-check');
      var headRight = isTest ? total + ' questions &middot; ' + Math.round(PASS * 100) + '% to pass' : total + ' question' + (total > 1 ? 's' : '') + ' &middot; instant feedback';
      var html = '<section class="' + cls + '" aria-labelledby="' + uid + '-h"><div class="quiz-head"><div><span class="badge">' + (isTest ? 'Module test' : 'Checkpoint') + '</span><h3 id="' + uid + '-h">' + esc(data.title) + '</h3></div><span class="quiz-meta">' + headRight + '</span></div><div class="quiz-body">';
      html += qs.map(function (q, i) {
        return '<div class="q" id="' + uid + '-q' + i + '"><div class="q-text"><span class="q-num">' + (i + 1) + '.</span><span>' + q.q + '</span></div>' + qBody(q, i) + '</div>';
      }).join('');
      html += '<div class="quiz-foot">';
      if (isTest) {
        html += submitted ? '<button type="button" class="btn btn-secondary" data-act="retry">Retake test</button>' :
          '<button type="button" class="btn btn-primary" data-act="submit">Submit answers</button><span class="quiz-progress">' + qs.filter(function (q, i) { return q.t !== 'order' && answered(q, answers[i]); }).length + ' of ' + qs.filter(function (q) { return q.t !== 'order'; }).length + ' answered' + (qs.some(function (q) { return q.t === 'order'; }) ? ' (plus ordering questions)' : '') + '</span>';
        html += '<div class="quiz-result ' + (submitted ? 'show ' + (pass ? 'pass' : 'fail') : '') + '" role="status">' +
          (submitted ? '<span class="score">' + Math.round(sc * 100) + '%</span><span class="detail">' + r + ' of ' + total + ' correct. ' +
            (pass ? (opts.passNote || 'Passed.') : 'You need ' + Math.round(PASS * 100) + '% to pass. Read the explanations above, review the lesson, then retake the test.') + '</span>' : '') + '</div>';
      } else {
        html += done() ? '<button type="button" class="btn btn-secondary" data-act="retry">Try again</button>' : '<span class="quiz-progress">' + lockedN + ' of ' + total + ' answered</span>';
        html += '<div class="quiz-result ' + (done() ? 'show ' + (pass ? 'pass' : 'fail') : '') + '" role="status">' +
          (done() ? '<span class="score">' + r + '/' + total + '</span><span class="detail">' + (sc >= PASS ? 'Good. You are ready to move on.' : 'Re-read the section above, then try again. Mistakes are how this sticks.') + '</span>' : '') + '</div>';
      }
      html += '</div></div></section>';
      var keepFocus = document.activeElement && root.contains(document.activeElement) ? document.activeElement : null;
      var fk = keepFocus ? { q: keepFocus.dataset.q, v: keepFocus.dataset.v, m: keepFocus.dataset.m, mv: keepFocus.dataset.mv, d: keepFocus.dataset.d, f: keepFocus.classList.contains('field') } : null;
      root.innerHTML = html;
      bind();
      if (fk) {
        var sel = fk.f ? 'input.field[data-q="' + fk.q + '"]' : fk.mv !== undefined ? '[data-q="' + fk.q + '"][data-d="' + fk.d + '"]' : fk.m !== undefined ? '[data-q="' + fk.q + '"][data-m="' + fk.m + '"]' : fk.v !== undefined ? '[data-q="' + fk.q + '"][data-v="' + fk.v + '"]' : null;
        var el = sel && root.querySelector(sel);
        if (el && !el.disabled) el.focus({ preventScroll: true });
      }
    }

    function report() {
      var wrong = [];
      qs.forEach(function (q, i) { if (!isCorrect(q, answers[i])) wrong.push(i); });
      var pct = Math.round(right() / qs.length * 100);
      if (opts.onResult) opts.onResult({ id: data.id, kind: data.kind, pct: pct, right: right(), total: qs.length, wrong: wrong, pass: pct >= PASS * 100 });
    }
    function lock(i) {
      locked[i] = true;
      render();
      if (done()) report();
    }

    function bind() {
      root.querySelectorAll('.opt:not(.opt-multi)').forEach(function (b) {
        b.addEventListener('click', function () {
          var i = +b.dataset.q, v = b.dataset.v;
          answers[i] = v === 'true' ? true : v === 'false' ? false : parseInt(v, 10);
          if (isTest) render(); else lock(i);
        });
      });
      root.querySelectorAll('.opt-multi').forEach(function (b) {
        b.addEventListener('click', function () {
          var i = +b.dataset.q, k = +b.dataset.m, a = answers[i] = answers[i] || [];
          var p = a.indexOf(k); if (p >= 0) a.splice(p, 1); else a.push(k);
          render();
        });
      });
      root.querySelectorAll('input.field').forEach(function (inp) {
        inp.addEventListener('input', function () { answers[+inp.dataset.q] = inp.value; });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !isTest) { e.preventDefault(); if (answered(qs[+inp.dataset.q], inp.value)) lock(+inp.dataset.q); } });
      });
      root.querySelectorAll('[data-mv]').forEach(function (b) {
        b.addEventListener('click', function () {
          var i = +b.dataset.q, pos = +b.dataset.mv, d = +b.dataset.d, a = answers[i];
          var t = a[pos]; a[pos] = a[pos + d]; a[pos + d] = t;
          render();
        });
      });
      root.querySelectorAll('[data-check]').forEach(function (b) {
        b.addEventListener('click', function () {
          var i = +b.dataset.check;
          if (!answered(qs[i], answers[i])) { b.textContent = 'Choose an answer first'; return; }
          lock(i);
        });
      });
      var sub = root.querySelector('[data-act="submit"]');
      if (sub) sub.addEventListener('click', function () {
        var missing = qs.filter(function (q, i) { return q.t !== 'order' && !answered(q, answers[i]); }).length;
        if (missing && !window.confirm(missing + ' question' + (missing > 1 ? 's are' : ' is') + ' unanswered and will count as wrong. Submit anyway?')) return;
        submitted = true; render(); report();
        var res = root.querySelector('.quiz-result'); if (res) res.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      var retry = root.querySelector('[data-act="retry"]');
      if (retry) retry.addEventListener('click', function () {
        answers = {}; locked = {}; submitted = false;
        qs.forEach(function (q, i) { if (q.t === 'order') answers[i] = q.o.map(function (_, k) { return k; }); });
        render();
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    render();
  }

  function mountAll(container, opts) {
    container.querySelectorAll('.quiz-mount').forEach(function (m) {
      var s = m.querySelector('script.quiz-data');
      if (!s) return;
      var data;
      try { data = JSON.parse(s.textContent); } catch (e) { console.warn('bad quiz data', e); return; }
      m.classList.add('quiz-slot');
      mount(m, data, { onResult: opts.onResult, passNote: data.kind === 'test' ? opts.passNote : '' });
    });
  }
  window.Quiz = { mount: mount, mountAll: mountAll, PASS: PASS, isCorrect: isCorrect };
})();
