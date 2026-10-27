# Responsive audit: findings, fixes and test checklist

Site audited: the course web app in this folder (`index.html`, `css/style.css`, `js/app.js`).
Method: a Playwright script (`tests/responsive-audit.js`, `tests/responsive-states.js`) loaded all 25 pages at
320, 375, 425, 768, 1024, 1280 and 1920 px and measured horizontal overflow, elements outside the viewport,
touch-target sizes, clipped text and (with the menu, notes panel, search and offline banner open) overlaps.
Files changed: `css/style.css` (edits in place plus one clearly marked block at the end), `js/app.js`, `sw.js` (cache version).
Complete unified diffs: `docs/responsive-audit-css.patch`, `docs/responsive-audit-js.patch`.

## 1. Issues found

| # | File and selector | Symptom | Root cause |
|---|---|---|---|
| 1 | `css/style.css` `.topbar`, `.topbar-actions`, `.icon-btn`, `.brand` | At 320 px the page scrolled sideways by 5 px and the profile button was cut off | Header items are fixed 36 px wide, the wordmark "Full Stack" cannot shrink, and flex items were allowed to shrink only unevenly. Total width was 325 px in a 320 px viewport |
| 2 | `.icon-btn` (menu, search, notes, theme, account), `.brand`, `#searchInput` | Touch targets 36 x 36 px (30 px for `.icon-btn.sm`); at 768 px the menu button was squeezed below 44 px | Fixed `width/height: 36px`, and no `flex: none` so the search box squeezed it |
| 3 | `.tab` (language tabs), `.code-copy`, `.seg button` (Sign in / Create account), `summary`, `.rec-link`, `.btn-sm` | 28 to 40 px tall tap targets | Fixed small paddings; only `.btn` had a mobile minimum |
| 4 | `code.inline` (for example a long URL in the exam and Advanced JavaScript pages) | Page overflowed by 39 px at 320 px; inside quizzes the text was clipped by the card | `white-space: break-spaces` does not break a long unbroken string; `.quiz` has `overflow: hidden`, which hid the overflow instead of fixing it |
| 5 | `.offline-banner` + `.topbar` + `.sidebar` / `.notes-panel` (`top: var(--topbar-h)`) | When the offline banner showed, the menu and notes drawers started 35 px too high and the top rows were hidden under the header | The banner sits in normal flow above a sticky header, but the fixed drawers assumed the header was at y = 0 |
| 6 | `.notes-panel` on 1241 px and wider | The panel covered the right side of the lesson with no way to read both | Fixed overlay with no layout change |
| 7 | `.notes-panel` and `.sidebar` (`js/app.js` `setMenu`, `setNotes`) | Both drawers could be open at once, stacked at the same z-index (95) | No mutual exclusion; the scrim threshold (960 px) did not match where the panel starts to overlay content |
| 8 | `.term-tip` (z-index 90) | Glossary tooltips could appear behind the notes panel (95) and equal to the scrim (90) | z-index scale was not planned |
| 9 | Anchors: `h3`, `.challenge`, `.lab-box`, glossary entries | Only `h2` and `.quiz` had `scroll-margin-top`; everything else could land under the sticky header | Per-element margins instead of one global rule |
| 10 | `.shell`, `.sidebar`, `.toc` (`100vh`) | On phones with a collapsing address bar the sidebar bottom (the language select and progress) could be pushed off-screen | `100vh` is the largest viewport on mobile. Use `100dvh` |
| 11 | `.brand .brand-sub` between 721 and 900 px | The wordmark was truncated to "Development C..." | Hidden only below 720 px |
| 12 | `.order-item` (ordering questions) | At 320 px the item text was squeezed into 3 or 4 lines next to two arrow buttons | Number + text + two buttons in one non-wrapping row |
| 13 | Fixed-width SVG figures (ER diagram, JWT blocks) | Content clipped inside the figure | Widths computed for 900 px+ with a high `min-width`; fixed by wrapping text in the generator and a smaller min width (done in the previous round) |

Checked and found fine: no `img` or `video` in the app (so no stretching), `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">` is present, `* { box-sizing: border-box }` is global, layouts already use grid/flex with `minmax(0, 1fr)`, tables and code blocks scroll inside their own wrapper (so they do not widen the page), no floats, no blanket `overflow-x: hidden` on `html` or `body`.
Intentionally left: the skip link is parked off-screen until focused; inline text links inside paragraphs are not enlarged (WCAG exempts inline links); radio inputs are 22 px but their whole label is 44 px tall.

## 2. Corrected code

The complete corrected files are in the workspace (`css/style.css`, `js/app.js`). The in-place edits are:
* every `var(--topbar-h)` used for an offset became `var(--header-h)`; the top bar's own height still uses `--topbar-h`
* `100vh` became `100dvh`
* `.topbar` got `top: var(--banner-h, 0px)`; `.offline-banner` became `position: sticky; top: 0; z-index: 101`

The appended block, in full:

```css
/* =====================================================================
   RESPONSIVE AUDIT (v5)  -  root-cause fixes, mobile first
   ===================================================================== */

/* 1. Anchors, scrollIntoView and focus never end up hidden under the sticky header */
html { scroll-padding-top: calc(var(--header-h) + 16px); -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }

/* 2. Media can never be wider than its container; text always wraps instead of overflowing */
img, video, canvas { max-width: 100%; height: auto; }
iframe { max-width: 100%; }
.content, .prose, .card, .panel, .callout, .q-text, .opt > span, .lesson-sum, .module-row, .search-results a { overflow-wrap: break-word; }
code.inline, .prose code.inline, .q-text code.inline, .opt code.inline, .q-why code.inline { overflow-wrap: anywhere; word-break: normal; }
.opt, .order-item { min-width: 0; }
.opt > span:last-child, .order-t { min-width: 0; flex: 1 1 auto; }
.pg-cols > *, .page > *, .grid-2 > * { min-width: 0; }

/* 3. Fluid type */
.prose h2 { font-size: clamp(1.3rem, 1.12rem + .9vw, 1.5rem); }
.lesson-head h1 { font-size: clamp(1.75rem, 1.2rem + 2.4vw, 2.6rem); overflow-wrap: break-word; }
.lesson-sum { font-size: clamp(1rem, .95rem + .3vw, 1.125rem); }

/* 4. z-index scale: scrim 90 < drawers 95 < header 100/101 < floating helpers 110 */
.term-tip, .hl-pop { z-index: 110; }

/* 5. Offline banner, search overlay and drawers all follow --header-h (set by app.js) */
.topbar.search-open .search-wrap { z-index: 5; }

/* 6. The notes panel pushes the page aside on wide screens instead of covering it */
@media (min-width: 1241px) {
  body.notes-open .content { margin-right: 360px; }
  body.notes-open .toc { display: none; }
  body.notes-open .page { grid-template-columns: minmax(0, 740px); }
}

/* 7. Header that always fits: 320px = menu + logo + 4 actions, each at least 44x44 */
@media (max-width: 960px), (pointer: coarse) {
  .icon-btn { width: 44px; height: 44px; }
  .icon-btn.sm { width: 44px; height: 44px; }
  .brand { min-height: 44px; min-width: 44px; padding: 0 4px; }
  .topbar-actions { gap: 0; }
  input.field, select.field, .search-wrap input { min-height: 44px; }
  .btn-sm { min-height: 44px; }
  .sidebar a, .toc a, .pager a { min-height: 44px; }
}
@media (max-width: 720px) {
  .topbar { gap: 2px; padding: 0 6px; }
  .search-wrap input, .topbar.search-open #searchInput { height: 44px; }
  .topbar.search-open .search-wrap { padding: 6px; }
  .topbar.search-open .search-wrap > .i { left: 20px; top: 50%; transform: translateY(-50%); }
  .topbar.search-open .search-wrap input { padding-left: 38px; padding-right: 52px; }
}
@media (max-width: 440px) {
  /* keep the logo, keep the name for screen readers, drop the visible wordmark to make room */
  .brand > span { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .page { padding-left: 16px; padding-right: 16px; }
}

/* 8. Touch targets: at least 44x44 on small screens and on touch devices */
.icon-btn { flex: none; }
@media (max-width: 960px), (pointer: coarse) {
  .btn { min-height: 44px; }
  .tab, .seg button { min-height: 44px; min-width: 44px; }
  .code-copy { min-height: 44px; min-width: 44px; justify-content: center; }
  .rec-link { display: inline-flex; align-items: center; min-height: 44px; }
  summary { display: list-item; min-height: 44px; padding-block: 10px; box-sizing: border-box; cursor: pointer; }
  label:has(> input[type="radio"]), label:has(> input[type="checkbox"]) { min-height: 44px; display: flex; align-items: center; gap: 10px; }
  input[type="radio"], input[type="checkbox"] { width: 22px; height: 22px; flex: none; }
}
@media (max-width: 900px) { .brand .brand-sub { display: none; } }   /* no half-truncated wordmark between phone and desktop */

/* Ordering questions: on narrow screens the 44px arrow buttons drop under the text instead of squeezing it */
.order-item { flex-wrap: wrap; }
.order-t { flex: 1 1 9rem; }
.order-btns { margin-left: auto; flex: none; }
```

`js/app.js` changes (full diff):

```diff
--- /tmp/app.before.js	2026-10-19 09:56:37.755059219 +0000
+++ js/app.js	2026-10-19 09:57:00.143059219 +0000
@@ -665,7 +665,13 @@
 }
 
 /* ---------- Offline / install ---------- */
-function updateOnlineStatus() { $('offlineBanner').classList.toggle('show', !navigator.onLine); if (navigator.onLine) scheduleSync(); }
+/* The offline banner is sticky above the top bar, so everything fixed below the header follows --banner-h. */
+function syncBannerHeight() {
+  const b = $('offlineBanner');
+  document.documentElement.style.setProperty('--banner-h', b.classList.contains('show') ? b.offsetHeight + 'px' : '0px');
+}
+function updateOnlineStatus() { $('offlineBanner').classList.toggle('show', !navigator.onLine); syncBannerHeight(); if (navigator.onLine) scheduleSync(); }
+window.addEventListener('resize', syncBannerHeight);
 let deferredInstall = null;
 window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; $('installBtn').classList.remove('hidden'); });
 
@@ -681,12 +687,19 @@
   window.addEventListener('offline', updateOnlineStatus);
 
   const sidebar = $('sidebar'), scrim = $('scrim'), menuBtn = $('menuBtn');
-  const setMenu = (open) => { sidebar.classList.toggle('open', open); scrim.classList.toggle('show', open); menuBtn.setAttribute('aria-expanded', open); menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); };
+  const OVERLAY_MAX = 1240;                       // up to this width the notes panel overlays the page (with a scrim)
+  const setMenu = (open) => { if (open && typeof setNotes === 'function') setNotes(false); sidebar.classList.toggle('open', open); scrim.classList.toggle('show', open); menuBtn.setAttribute('aria-expanded', open); menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); };
   menuBtn.addEventListener('click', () => setMenu(!sidebar.classList.contains('open')));
   scrim.addEventListener('click', () => { setMenu(false); setNotes(false); });
 
   const notes = $('notesPanel');
-  const setNotes = (open) => { notes.classList.toggle('open', open); $('notesToggle').setAttribute('aria-expanded', open); if (open) { if (innerWidth <= 960) scrim.classList.add('show'); $('notesTextarea').focus(); } else if (!sidebar.classList.contains('open')) scrim.classList.remove('show'); };
+  const setNotes = (open) => {
+    if (open) setMenu(false);
+    notes.classList.toggle('open', open); document.body.classList.toggle('notes-open', open);
+    $('notesToggle').setAttribute('aria-expanded', open);
+    if (open) { if (innerWidth <= OVERLAY_MAX) scrim.classList.add('show'); $('notesTextarea').focus(); }
+    else if (!sidebar.classList.contains('open')) scrim.classList.remove('show');
+  };
   $('notesToggle').addEventListener('click', () => setNotes(!notes.classList.contains('open')));
   $('notesClose').addEventListener('click', () => { setNotes(false); $('notesToggle').focus(); });
   $('notesTextarea').addEventListener('input', () => { clearTimeout(init._t); init._t = setTimeout(saveNotes, 600); });
```

## 3. Why these changes

* **One variable for the header height.** `--header-h = topbar + banner`. Everything that must sit below the header (drawers, scrim, table of contents, scroll padding) uses it, and JavaScript only has to set `--banner-h`. That removes the guesswork that caused issue 5.
* **`scroll-padding-top` on `html`** fixes anchors for every element type at once (also `scrollIntoView`), instead of adding `scroll-margin-top` to each component.
* **`overflow-wrap: anywhere` on inline code** fixes the cause of the sideways scroll. `overflow: hidden` on the quiz card was only hiding it. `min-width: 0` on flex and grid children lets them shrink below their content width, which is what stops long content from stretching a column.
* **Touch targets** are enlarged in a `(max-width: 960px), (pointer: coarse)` query so tablets and touch laptops get them too. The 320 px header fits because the visible wordmark is replaced by a visually hidden label (still read by screen readers) below 440 px: 5 buttons x 44 px + the 44 px logo + gaps = 308 px.
* **The notes panel pushes the page** on wide screens (`margin-right` on `.content`) and overlays with a scrim on narrower ones, using the same 1240 px breakpoint in CSS and JavaScript.
* **`dvh`** follows the visible viewport on mobile browsers, `vh` does not.
* **Fluid type** with `clamp()` for h1, h2 and the lead paragraph, so they scale between 320 and 1920 px without breakpoints.

## 4. Manual test checklist (DevTools device toolbar)

1. Test at 320, 375, 425, 768, 1024, 1280 and 1920 px, and also drag the width slowly from 320 to 1920 in "Responsive" mode: nothing should jump, clip or overlap.
2. Scroll sideways on every width on Overview, Languages, Databases (tables and ER diagram), API and Exam. The page must not move; only code blocks, tables and figures may scroll inside their own box.
3. Header at 320 px: all five buttons visible and tappable, nothing cut off at the right edge. Open the menu: the first sidebar row is fully visible below the header.
4. Turn on Network > Offline: the yellow banner appears, the header sits directly below it, scrolling keeps both stuck at the top, and the menu and notes drawers still start below the header.
5. Open Notes at 1280 px (page shifts left, no overlap), at 1024 px and below (overlay with a dark scrim). Open the menu while Notes is open: only one stays open.
6. Click a glossary term while Notes is open: the tooltip appears above the panel.
7. Click an entry in "On this page" and search results: the heading lands below the header, not under it.
8. Rotate to landscape on a 375 x 667 device: header and drawers still fit.
9. Quizzes at 320 px: ordering questions wrap, arrow buttons are large enough; a long URL in a question wraps.
10. Toggle "Show touch targets" or use the Accessibility panel: every button, tab, Copy button and form control should be at least 44 x 44 px.
11. Zoom the browser to 200% at 1280 px (equals a 640 px layout): still no horizontal scrolling.
12. Dark mode on a phone width: banner, drawers and tooltips keep their contrast.
13. Re-run the automated checks: `node tests/responsive-audit.js` and `node tests/responsive-states.js` (server running; see the top of each file).

## Addendum: v8 re-audit (dark-only theme, back-to-top)

Re-run with `tests/responsive-audit.js` on 31 routes at 16 widths (280, 320, 360, 375, 390, 412, 425, 600, 768, 820, 1024, 1280, 1366, 1440, 1920, 2560) plus `tests/responsive-states.js`.

| Finding | Fix |
|---|---|
| Home page overflowed by 3 px at 280 px (`.btn` text did not wrap) | Below 420 px buttons wrap, grow in height and keep a 44 px minimum |
| "Layers" diagrams were drawn as a scaled SVG that scrolled sideways and cut text on phones | They are now a semantic list (`ul.fg-layers`) that reflows at any width and is read properly by screen readers |
| Home statistics wrapped unevenly on phones | Two-column grid below 560 px |
| Copy buttons, glossary filter chips, progress-table links and four plain text links were under 44 px on touch screens | 44 px minimum at 768 px and below (`.tap-link` for the text links) |
| Floating button could cover the last content on small screens | Pages keep at least 72 px of bottom padding up to 1024 px wide |

Remaining reports are intentional: the skip link, visually hidden labels and headings, the hidden table header used by the mobile card layout, and 20 px checkboxes inside 44 px-high labels. No page overflows horizontally at any tested width.

Theme: the light theme was removed. The colour tokens in `:root` are the former dark values, the toggle and its pre-paint script are gone, and an `@media print` block restores light colours so printed certificates stay ink-friendly.
