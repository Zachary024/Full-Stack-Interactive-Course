::: project style-the-event Style the event page, mobile first
Time: 3-4 hours
Level: Beginner
Skills: selectors, box model, flexbox, grid, custom properties, media queries

Take the community event page from the HTML module (or the starter below) and make it look professional on every screen size. You will design for a phone first and add layout for larger screens afterwards. The work must be done in one stylesheet, without changing the HTML structure except for adding classes.

Requirements:
- A single external stylesheet linked from the page, with no inline styles.
- Colours, spacing and font sizes defined once as CSS custom properties on `:root` and reused throughout.
- A readable base: a system font stack, a line height of at least 1.5, a comfortable maximum line length for body text and sufficient colour contrast (at least 4.5 to 1 for normal text).
- Mobile first: the base styles are for a narrow screen, and at least two `min-width` media queries add layout for tablets and desktops.
- The navigation is a flexbox row that wraps or collapses sensibly on small screens, and the links have a visible hover and focus style.
- The schedule section uses a table that remains usable on a phone (for example by scrolling inside a wrapper, without making the whole page scroll sideways).
- The registration form is laid out with grid or flexbox, with fields that fill the width on a phone and sit in two columns on a wide screen.
- Buttons and form controls are at least 44 pixels tall and have visible focus outlines.
- A dark colour scheme that follows `prefers-color-scheme` by changing only the custom properties.
- The page has no horizontal scrolling at 320, 768 and 1280 pixels wide.

Steps:
1. Define your design tokens (colours, spacing steps, radius, font sizes) as custom properties.
2. Add a reset (box-sizing and margins) and style the base typography.
3. Style the header and navigation for a phone, then the main sections and the table.
4. Style the form and its states: focus, invalid and disabled.
5. Add the media queries one at a time, resizing the browser after each to confirm nothing breaks.
6. Add the dark scheme by overriding the custom properties, then check contrast in both schemes.
7. Test at the three widths and fix any horizontal scrolling at the root cause.

Starter:
```css
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
  --accent: #1d4ed8;
  --space: 1rem;
  --radius: 8px;
  font-family: system-ui, sans-serif;
}

*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  color: var(--text);
  background: var(--bg);
  line-height: 1.6;
}

/* TODO: header, nav, sections, table, form */

@media (min-width: 48rem) {
  /* TODO: tablet layout */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* TODO: override the colour variables */
  }
}
```

Hints:
- Make images and tables fit with `max-width: 100%`, and wrap wide tables in a container with `overflow-x: auto`.
- If something forces a horizontal scrollbar, find the element that is too wide with the browser inspector instead of hiding the overflow.
- `gap` is simpler than margins for spacing flex and grid items.
- Use `:focus-visible` for focus rings so they show for keyboard users.

Stretch:
- Add a smooth, subtle transition on buttons and links that respects `prefers-reduced-motion`.
- Build the event cards with CSS grid using `repeat(auto-fit, minmax(16rem, 1fr))`.
- Add a print stylesheet that hides the navigation and the form.

Deliver:
- The HTML file and `styles.css`.
- Three screenshots: 320, 768 and 1280 pixels wide.
- One screenshot in the dark scheme.

Rubric:
- Responsiveness | The layout adapts smoothly with no horizontal scrolling and no overlapping content at any width.
- Consistency | Colours and spacing come from the custom properties, with no repeated magic numbers.
- Accessibility | Contrast, focus styles and touch-target sizes meet the requirements in both colour schemes.
- Craft | The stylesheet is organised, short selectors are used and there is no unneeded repetition.
:::
