/* End-to-end test (Playwright). Starts nothing: run the server first (cd backend && npm start).
   Usage: BASE=http://localhost:3000 node tests/e2e.js     (needs `npm i playwright` somewhere on NODE_PATH)
   Covers: registration, solving a module test through the real UI, progress persistence,
   cross-device sync (second browser context), the final exam and the certificate. */
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:3000';
const assert = require('assert');
// tiny helper: pull one quiz's JSON out of a lesson's HTML without a DOM library
const DOMParser2 = function (html) { this.quiz = (id) => {
  const re = /<div class="quiz-mount" data-id="([^"]+)"[^>]*><script type="application\/json" class="quiz-data">([\s\S]*?)<\/script>/g; let m;
  while ((m = re.exec(html))) if (m[1] === id) return JSON.parse(m[2].replace(/<\\\//g, '</'));
  throw new Error('quiz not found: ' + id); }; };

async function solveQuiz(page, mountSel) {
  const mount = page.locator(mountSel).first();
  await mount.scrollIntoViewIfNeeded();
  const id = await mount.getAttribute('data-id');
  // the engine replaces the mount's contents, so read the question data from the lesson file itself
  const html = await page.evaluate(async (m) => (await fetch('modules/' + m + '.html')).text(), id.replace(/-c\d+$/, ''));
  const doc = new DOMParser2(html);
  const data = doc.quiz(id);
  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i], root = mount;
    if (q.t === 'mcq') await root.locator(`.opt[data-q="${i}"][data-v="${q.a}"]`).click();
    else if (q.t === 'tf') await root.locator(`.opt[data-q="${i}"][data-v="${q.a}"]`).click();
    else if (q.t === 'multi') for (const k of q.a) await root.locator(`.opt-multi[data-q="${i}"][data-m="${k}"]`).click();
    else if (q.t === 'short') await root.locator(`input.field[data-q="${i}"]`).fill(q.a[0]);
    else if (q.t === 'order') {
      // bubble the shuffled list into the right order using the move buttons
      for (let pos = 0; pos < q.a.length; pos++) {
        for (let guard = 0; guard < 20; guard++) {
          const cur = await root.locator(`.q:nth-of-type(${i + 1}) .order-item .order-t`).allInnerTexts();
          const want = q.o[q.a[pos]].replace(/<[^>]+>/g, '');
          const at = cur.findIndex(t => t.trim() === want.trim());
          if (at <= pos) break;
          await root.locator(`[data-q="${i}"][data-mv="${at}"][data-d="-1"]`).click();
        }
      }
    }
  }
  page.once('dialog', d => d.accept());
  await mount.locator('[data-act=submit]').click();
  await mount.locator('.quiz-result.show').waitFor();
  return (await mount.locator('.quiz-result .score').innerText()).trim();
}

(async () => {
  const browser = await chromium.launch();
  const email = `e2e${Date.now()}@example.com`;
  const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx1.newPage();
  const errors = []; p.on('pageerror', e => errors.push(e.message));

  // 1. register
  await p.goto(BASE + '/#profile'); await p.click('#tabReg');
  await p.fill('#authName', 'E2E Learner'); await p.fill('#authEmail', email); await p.fill('#authPass', 'longenough1');
  await p.click('#authSubmit'); await p.waitForSelector('#profForm');
  console.log('registered', email);

  // 2. pick a language, pass a module test
  await p.selectOption('#langSel', 'go');
  await p.goto(BASE + '/#start'); await p.waitForSelector('.quiz-mount[data-id="start"] .quiz');
  const score = await solveQuiz(p, '.quiz-mount[data-id="start"]');
  assert.equal(score, '100%'); console.log('module test passed:', score);
  await p.waitForTimeout(2500);               // let the debounced sync run
  await p.reload(); await p.waitForSelector('#moduleNav');
  assert.ok(await p.locator('#moduleNav a[href="#start"] .check, #moduleNav a[href="#start"] svg').count());
  console.log('progress persisted after reload');

  // 3. second device: log in and see the same progress and language
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const q = await ctx2.newPage();
  await q.goto(BASE + '/#profile'); await q.fill('#authEmail', email); await q.fill('#authPass', 'longenough1'); await q.click('#authSubmit');
  await q.waitForSelector('#profForm');
  const state = await q.evaluate(() => JSON.parse(localStorage.fs_course_state_v1));
  assert.ok(state.completed.start, 'completed module syncs');
  console.log('sync across devices OK; language pref =', JSON.stringify(state.prefs));

  // 4. final exam and certificate
  await p.goto(BASE + '/#exam'); await p.waitForSelector('.quiz-mount[data-id="exam"] .quiz');
  const exam = await solveQuiz(p, '.quiz-mount[data-id="exam"]');
  assert.equal(exam, '100%'); console.log('exam passed:', exam);
  await p.goto(BASE + '/#certificate'); await p.waitForSelector('text=Certificate of completion');
  assert.ok(await p.locator('text=has completed the interactive course').count(), 'certificate unlocked');
  console.log('certificate unlocked');

  // 5. projects, progress dashboard, reference pages, glossary topics
  await p.goto(BASE + '/#html'); await p.waitForSelector('.project');
  const finish = p.locator('.project [data-a="finish"]');
  assert.ok(await finish.isDisabled(), 'finish is locked until requirements are met');
  assert.ok(!(await p.locator('.project [data-a="reopen"]').isVisible()), 'reopen hidden before completion');
  for (const b of await p.locator('.project .pj-checks:not(.pj-stretch) input').all()) await b.check();
  assert.ok(await finish.isDisabled() === false, 'finish unlocks when everything is ticked');
  await p.fill('.project input[type="url"]', 'javascript:alert(1)');
  assert.ok(await finish.isDisabled(), 'a non-http link blocks completion');
  assert.ok(await p.locator('.pj-linkmsg').count(), 'link error is shown');
  await p.fill('.project input[type="url"]', 'https://github.com/example/community-event');
  await p.fill('.project textarea', 'Learned about labels.');
  await finish.click();
  assert.ok(await p.locator('.project.is-done').count(), 'project marked done');
  await p.reload(); await p.waitForSelector('.project.is-done');
  assert.equal(await p.inputValue('.project textarea'), 'Learned about labels.', 'reflection persisted');
  console.log('project completion persisted');

  await p.goto(BASE + '/#progress'); await p.waitForSelector('.ring');
  const prog = await p.evaluate(() => JSON.parse(localStorage.fs_course_state_v1));
  assert.ok(prog.projects['html.community-event'].done, 'project saved in state');
  assert.ok(Object.keys(prog.activity).length >= 1, 'activity logged');
  assert.ok((await p.textContent('#pgOverall + *, .ring-num')).includes('%'), 'ring shows a percentage');
  assert.ok(await p.locator('.dash-table tbody tr').count() >= 20, 'module table lists every module');
  assert.ok(await p.locator('.badges .badge-card.earned').count() >= 1, 'a milestone was earned');
  await p.selectOption('#goalSel', '5');
  assert.equal((await p.evaluate(() => JSON.parse(localStorage.fs_course_state_v1))).goal, 5, 'weekly goal saved');
  console.log('progress dashboard OK');

  await p.goto(BASE + '/#projects'); await p.waitForSelector('.pj-item');
  assert.equal(await p.locator('.pj-item').count(), 16, 'sixteen projects listed');
  console.log('projects hub OK');

  await p.goto(BASE + '/#ref-cli'); await p.waitForSelector('.cheat');
  const rowsBefore = await p.locator('.cheat tbody tr:visible').count();
  await p.fill('#csFilter', 'chmod');
  const rowsAfter = await p.locator('.cheat tbody tr:visible').count();
  assert.ok(rowsAfter > 0 && rowsAfter < rowsBefore, 'cheat filter narrows rows');
  assert.ok(await p.locator('.cheat tbody tr:visible .cs-copy').first().isVisible(), 'copy button visible');
  await p.goto(BASE + '/#ref-shortcuts'); await p.waitForSelector('kbd');
  assert.ok(await p.locator('.cs-kbd kbd').count() > 100, 'shortcuts are rendered as keys');
  console.log('reference pages OK');

  await p.goto(BASE + '/#glossary'); await p.waitForSelector('.gl-item');
  const allTerms = await p.locator('.gl-item:visible').count();
  assert.ok(allTerms >= 400, 'glossary has 400+ terms, found ' + allTerms);
  await p.click('.gl-cats [data-cat="Security"]');
  const sec = await p.locator('.gl-item:visible').count();
  assert.ok(sec > 20 && sec < allTerms, 'category filter works');
  console.log('glossary OK:', allTerms, 'terms;', sec, 'in Security');

  // import merge keeps what you already have
  await p.goto(BASE + '/#progress'); await p.waitForSelector('#pgImport');
  await p.setInputFiles('#pgImport', { name: 'p.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ completed: { web: true }, activity: { '2026-01-01': 4 }, projects: { 'css.style-the-event': { done: true, req: [], note: 'x'.repeat(5000), link: 'ftp://bad' } } })) });
  await p.waitForSelector('#pgMsg.ok');
  const merged = await p.evaluate(() => JSON.parse(localStorage.fs_course_state_v1));
  assert.ok(merged.completed.web && merged.completed.start, 'import merges completed modules');
  assert.ok(merged.projects['html.community-event'].done, 'import keeps existing projects');
  assert.equal(merged.projects['css.style-the-event'].note.length, 2000, 'imported note is capped');
  assert.equal(merged.projects['css.style-the-event'].link, '', 'imported non-http link is dropped');
  await p.setInputFiles('#pgImport', { name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('not json') });
  await p.waitForSelector('#pgMsg.error');
  console.log('import/merge OK');


  // 6. dark theme only, back-to-top button
  await p.goto(BASE + '/#html'); await p.waitForSelector('.project');
  assert.equal(await p.locator('#themeBtn').count(), 0, 'no theme toggle');
  assert.equal(await p.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(11, 18, 32)', 'dark background');
  assert.ok(await p.locator('#toTop').isHidden(), 'back to top hidden at the top of the page');
  await p.evaluate(() => window.scrollTo(0, 2000)); await p.waitForSelector('#toTop:not([hidden])');
  const tb = await p.locator('#toTop').boundingBox();
  assert.ok(tb.width >= 44 && tb.height >= 44, 'back to top is a 44px target');
  await p.click('#toTop'); await p.waitForFunction(() => window.scrollY < 5);
  assert.ok(await p.locator('#toTop').isHidden(), 'button hides again after scrolling to the top');
  console.log('dark theme and back-to-top OK');


  assert.deepEqual(errors, [], 'no page errors');
  console.log('E2E PASSED');
  await browser.close();
})().catch(e => { console.error('E2E FAILED', e); process.exit(1); });
