/* Usage: start the server (cd backend && npm start), then `node tests/responsive-audit.js` with playwright installed. Prints overflow, off-screen and touch-target problems at 7 widths for every page. */
const { chromium } = require('playwright');
const W = (process.env.WIDTHS || '320,375,425,768,1024,1280,1920').split(',').map(Number);
const pages = ['home', 'start', 'web', 'languages', 'basics', 'html', 'css', 'js-fund', 'js-adv', 'react', 'vue', 'backend', 'databases', 'data', 'api', 'auth', 'advanced', 'devops', 'capstone', 'exam', 'glossary', 'profile', 'forum', 'bookmarks', 'certificate', 'progress', 'projects', 'reference', 'ref-cli', 'ref-git', 'ref-tools', 'ref-shortcuts', 'ref-lookup', 'ref-syntax'];
(async () => {
  const b = await chromium.launch(); const out = {};
  for (const w of W) {
    const p = await b.newPage({ viewport: { width: w, height: 800 } });
    await p.goto('http://localhost:3000/#home'); await p.waitForTimeout(600);
    for (const id of pages) {
      await p.goto('http://localhost:3000/#' + id); await p.waitForTimeout(450);
      const r = await p.evaluate((w) => {
        const vw = document.documentElement.clientWidth, res = { over: document.documentElement.scrollWidth - vw, culprits: [], small: [], clip: [], distort: [] };
        const sel = (e) => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
        const inScroller = (e) => { for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden') return true; } return false; };
        document.querySelectorAll('body *').forEach(e => {
          const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return;
          const r = e.getBoundingClientRect(); if (!r.width || !r.height) return;
          if (r.right > vw + 1 && !inScroller(e) && cs.position !== 'fixed') res.culprits.push(sel(e) + ' right=' + Math.round(r.right));
          if (r.left < -1 && !inScroller(e) && cs.position !== 'fixed') res.culprits.push(sel(e) + ' left=' + Math.round(r.left));
          if (w <= 768 && ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'SUMMARY'].includes(e.tagName) && (r.height < 43.5 || r.width < 43.5) && !e.classList.contains('term') && !e.classList.contains('skip-link') && !e.closest('pre,.code-block')) res.small.push(sel(e) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
          if (cs.overflowX === 'hidden' && e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 0 && e.tagName !== 'svg') res.clip.push(sel(e) + ' sw=' + e.scrollWidth + ' cw=' + e.clientWidth);
          if (['IMG', 'VIDEO', 'CANVAS'].includes(e.tagName) && e.naturalWidth && Math.abs(r.width / r.height - e.naturalWidth / e.naturalHeight) > 0.05 && cs.objectFit === 'fill') res.distort.push(sel(e));
        });
        return res;
      }, w);
      const uniq = a => [...new Set(a)].slice(0, 6);
      r.culprits = uniq(r.culprits); r.small = [...new Set(r.small.map(x => x.replace(/ \d+x\d+$/, '')))].slice(0, 30); r.clip = uniq(r.clip);
      if (r.over > 1 || r.culprits.length || r.small.length || r.clip.length || r.distort.length) out[w + ' ' + id] = r;
    }
    await p.close();
  }
  const keys = Object.keys(out); console.log('issues in', keys.length, 'page/width combos');
  const agg = {};
  for (const k of keys) for (const t of ['culprits', 'small', 'clip', 'distort']) for (const s of out[k][t]) { const key = t + ': ' + s.replace(/#[\w-]+/g, '').replace(/ (right|left|sw|cw)=-?\d+/g, '').replace(/ \d+x\d+$/, ''); (agg[key] = agg[key] || new Set()).add(k.split(' ')[0]); }
  Object.entries(agg).sort((a, b) => b[1].size - a[1].size).slice(0, 50).forEach(([k, v]) => console.log(k, '@', [...v].join(',')));
  console.log('overflow pages:', keys.filter(k => out[k].over > 1).map(k => k + '(' + out[k].over + ')').join(' '));
  require('fs').writeFileSync('audit.json', JSON.stringify(out, null, 1));
  await b.close();
})();
