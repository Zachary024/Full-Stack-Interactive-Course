/* Usage: with the server running, `node tests/responsive-states.js`. Checks drawers, notes panel, search overlay, offline banner and anchors at 7 widths. */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const bad = [];
  for (const w of [320, 375, 425, 768, 1024, 1280, 1920]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 760 } }); const p = await ctx.newPage();
    await p.goto('http://localhost:3000/#start'); await p.waitForTimeout(700);
    const rect = (s) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { t: Math.round(r.top), b: Math.round(r.bottom), l: Math.round(r.left), r: Math.round(r.right), w: Math.round(r.width), h: Math.round(r.height) }; }, s);
    // menu
    if (w <= 960) {
      await p.click('#menuBtn'); await p.waitForTimeout(450);
      const sb = await rect('#sidebar'), tb = await rect('#topbar');
      if (sb.t < tb.b - 1) bad.push(`${w} sidebar top ${sb.t} < topbar bottom ${tb.b}`);
      const small = await p.evaluate(() => [...document.querySelectorAll('#sidebar a, #sidebar select, #sidebar button')].filter(e => { const r = e.getBoundingClientRect(); return r.height < 43.5; }).map(e => e.tagName + '.' + e.className + ' ' + Math.round(e.getBoundingClientRect().height)).slice(0, 3));
      if (small.length) bad.push(`${w} small sidebar targets ${small}`);
      await p.click('#menuBtn'); await p.waitForTimeout(350);
    }
    // notes
    await p.click('#notesToggle'); await p.waitForTimeout(450);
    const np = await rect('#notesPanel'), tb2 = await rect('#topbar');
    if (np.t < tb2.b - 1) bad.push(`${w} notes top ${np.t} < topbar bottom ${tb2.b}`);
    if (np.r > w + 1 || np.l < -1) bad.push(`${w} notes outside viewport ${JSON.stringify(np)}`);
    const ov = await p.evaluate(() => { const c = document.querySelector('.content').getBoundingClientRect(); const n = document.getElementById('notesPanel').getBoundingClientRect(); return { cr: Math.round(c.right), nl: Math.round(n.left), scrim: document.getElementById('scrim').classList.contains('show') }; });
    if (ov.cr > ov.nl + 1 && !ov.scrim) bad.push(`${w} notes panel covers content without scrim ${JSON.stringify(ov)}`);
    await p.screenshot({ path: `shots/b_notes_${w}.png` });
    await p.click('#notesClose'); await p.waitForTimeout(350);
    // search (mobile overlay)
    if (w <= 720) {
      await p.click('#searchToggle'); await p.waitForTimeout(300); await p.fill('#searchInput', 'array'); await p.waitForTimeout(600);
      const si = await rect('#searchInput'), sr = await rect('#searchResults');
      if (si.r > w || si.l < 0 || si.h < 44) bad.push(`${w} search input ${JSON.stringify(si)}`);
      if (sr && (sr.r > w || sr.l < 0)) bad.push(`${w} search results ${JSON.stringify(sr)}`);
      await p.screenshot({ path: `shots/b_search_${w}.png` });
      await p.keyboard.press('Escape');
    }
    // offline banner
    await ctx.setOffline(true); await p.evaluate(() => window.dispatchEvent(new Event('offline'))); await p.waitForTimeout(400);
    const bn = await rect('#offlineBanner'), tb3 = await rect('#topbar');
    if (!bn || Math.abs(tb3.t - bn.b) > 1) bad.push(`${w} topbar not directly below banner ${JSON.stringify([bn, tb3])}`);
    await p.evaluate(() => window.scrollTo(0, 600)); await p.waitForTimeout(300);
    const bn2 = await rect('#offlineBanner'), tb4 = await rect('#topbar');
    if (bn2.t !== 0 || Math.abs(tb4.t - bn2.b) > 1) bad.push(`${w} banner/topbar not stuck after scroll ${JSON.stringify([bn2, tb4])}`);
    if (w <= 960) { await p.click('#menuBtn'); await p.waitForTimeout(450); const sb = await rect('#sidebar'), tbb = await rect('#topbar'); if (sb.t < tbb.b - 1) bad.push(`${w} sidebar under topbar with banner: ${sb.t} < ${tbb.b}`); await p.screenshot({ path: `shots/b_offmenu_${w}.png` }); }
    // anchor: click first TOC / scroll heading below header
    await ctx.setOffline(false); await p.evaluate(() => window.dispatchEvent(new Event('online')));
    await p.goto('http://localhost:3000/#js-fund'); await p.waitForTimeout(700);
    const hid = await p.evaluate(async () => { const out = []; const hs = [...document.querySelectorAll('.prose h2, .prose h3, .challenge, .quiz, .lab-box')].slice(0, 40); for (const h of hs) { h.scrollIntoView(); await new Promise(r => setTimeout(r, 30)); const top = h.getBoundingClientRect().top; const hh = document.getElementById('topbar').getBoundingClientRect().bottom; if (top < hh - 1) out.push(h.tagName + '.' + h.className + ' top=' + Math.round(top) + ' hdr=' + Math.round(hh)); } return out.slice(0, 4); });
    if (hid.length) bad.push(`${w} anchors hidden under header: ${hid}`);
    await ctx.close();
  }
  console.log(bad.join('\n') || 'state checks: all OK');
  await b.close();
})();
