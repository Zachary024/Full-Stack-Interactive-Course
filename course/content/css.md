---
id: css
number: 7
title: CSS: Styling and Layout
track: Foundations
duration: 150 min
level: Beginner
summary: Selectors, the cascade, the box model, colour and type, Flexbox, Grid and responsive design. Make pages look good on every screen.
---

::: objectives
- Write CSS rules with selectors, properties and values, and link a stylesheet to a page.
- Predict which rule wins when several apply, using the cascade, specificity and inheritance.
- Use the box model to control size, spacing and borders.
- Lay out pages with Flexbox and Grid.
- Make a layout responsive with relative units and media queries.
- Use CSS variables to keep a design consistent.
:::

::: prereq
HTML. You should be able to write a page with headings, paragraphs, lists and a form.
:::

## What CSS does

**CSS** (Cascading Style Sheets) controls how HTML elements look: colours, fonts, sizes, spacing and layout. Without CSS the browser shows plain, default-styled content. With CSS the same HTML can look like a magazine, a dashboard or a game.

::: plain
HTML is the skeleton and the organs. CSS is the clothes, hair and posture. You can change the outfit completely without touching the person underneath. That separation is why websites can be redesigned without rewriting the content.
:::

A CSS **rule** has a **selector** (which elements?) and a **declaration block** with **properties** and **values** (what to do to them).

::: figure blocks Anatomy of a CSS rule
Selector | p ; Property | color ; Value | navy ; Declaration | color: navy
:::

```css
p {
  color: navy;
  font-size: 18px;
}
```

This says: for every `<p>` element, make the text navy and 18 pixels tall. Each declaration ends with a semicolon.

### Three ways to add CSS

| Method | How | When to use |
|---|---|---|
| External stylesheet | `<link rel="stylesheet" href="style.css">` in `head` | **Almost always.** One file styles many pages and is cached |
| Internal | A `<style>` element in `head` | Quick experiments, single pages |
| Inline | `style="color: red"` on one element | Rarely. It is hard to maintain and hard to override |

::: playground html Your first styles
Change the colours, then try changing `font-size` and `border-radius`.
```html
<h1>Styled heading</h1>
<p class="note">A note with style.</p>
<p>A normal paragraph.</p>
```
```css
h1 {
  color: #1d4ed8;
}
.note {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 12px 16px;
  border-radius: 6px;
}
```
:::

## Selectors: choosing what to style

| Selector | Example | Selects |
|---|---|---|
| Type | `p` | Every `<p>` |
| Class | `.note` | Every element with `class="note"`. Reusable, and the most common |
| ID | `#logo` | The one element with `id="logo"` |
| Descendant | `nav a` | Every `<a>` inside a `<nav>` |
| Child | `ul > li` | `<li>` that are direct children of a `<ul>` |
| Group | `h1, h2, h3` | All three types |
| Pseudo-class | `a:hover` | A link while the mouse is over it |
| Attribute | `input[type="email"]` | Inputs of a given type |

::: best Prefer classes
Style with **classes** (`.card`, `.button-primary`). Types are too broad, and IDs are too strong and cannot be reused. Name classes after what something *is* (`.product-card`), not how it looks (`.red-box`).
:::

## The cascade: who wins?

Several rules often target the same element, and a conflict has to be settled. CSS resolves it by three things, in this order.

1. **Importance.** Rules marked `!important` beat everything. Avoid them: they cause arms races.
2. **Specificity.** More specific selectors beat less specific ones. An ID beats a class, and a class beats a type.
3. **Order.** If specificity ties, the rule that comes **last** wins.

::: figure layers Specificity: stronger rules at the top
*Inline style | style="..." on the element. The strongest
ID selector | #logo. Very strong
Class, attribute, pseudo-class | .card, [type="text"], :hover. Medium
Type selector | p, h1, a. Weak
:::

```css
p { color: black; }          /* weak */
.note { color: green; }      /* medium: wins over p */
p.note { color: orange; }    /* type + class: stronger still */
```

### Inheritance

Some properties, such as `color` and `font-family`, are **inherited** by child elements. Set the font on `body` and the whole page uses it. Others, such as `border` and `margin`, are not inherited, which is what you would want.

::: pitfall When a style "does not work"
Nine times out of ten, a more specific rule is overriding yours. Open the browser's developer tools (F12), click the element in the **Elements** panel and look at the **Styles** pane. Overridden declarations are crossed out, and it tells you which rule won.
:::

## The box model

Every element on a page is a rectangular box with four layers.

::: figure boxmodel The box model: content, padding, border and margin
:::

| Layer | Property | Job |
|---|---|---|
| Content | `width`, `height` | The text or image itself |
| Padding | `padding` | Space between the content and the border, inside the element |
| Border | `border` | A line around the padding |
| Margin | `margin` | Space between this element and its neighbours |

By default, `width` sets only the content width, so padding and border are added on top. That makes sums awkward. The universal fix is one line, and most professional stylesheets begin with it:

```css
*, *::before, *::after {
  box-sizing: border-box;   /* width includes padding and border */
}
```

::: playground html Explore the box model
Change `padding`, `border` and `margin` and watch the boxes move. Try removing `box-sizing`.
```html
<div class="box">Box one</div>
<div class="box">Box two</div>
```
```css
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 4px solid #1d4ed8;
  margin: 16px 0;
  background: #eef3ff;
}
```
:::

## Colours, text and units

### Colours

```css
color: red;                 /* a name */
color: #1d4ed8;             /* hex: red, green, blue pairs */
color: rgb(29 78 216);      /* the same blue with rgb() */
color: rgb(0 0 0 / 50%);    /* black at half opacity */
```

**Contrast** matters: light grey text on a white background is hard to read, and fails accessibility guidelines. Aim for a contrast ratio of at least 4.5 to 1 for body text. Browser developer tools and free online checkers can measure it.

### Typography

```css
body {
  font-family: system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
}
```

A `line-height` between 1.4 and 1.7 makes paragraphs much easier to read. Limit line length to about 60 to 80 characters (`max-width: 65ch`).

### Units

| Unit | Meaning | Use for |
|---|---|---|
| `px` | A fixed pixel | Borders, shadows, small precise details |
| `rem` | A multiple of the page's base font size (16px by default) | Font sizes and spacing. Respects the user's settings |
| `em` | A multiple of the element's own font size | Spacing inside a component |
| `%` | A percentage of the parent | Flexible widths |
| `vw`, `vh` | 1% of the viewport width or height | Full-screen sections |
| `fr` | A share of the free space in a Grid | Grid columns |

::: best Use rem for text
Users who have set a larger default font size (for example because of low vision) expect your page to follow. Sizes in `rem` do. Sizes in `px` do not.
:::

::: quiz check Checkpoint: selectors and the cascade
?  Which selector targets every element with `class="card"`?
- `card`
- `#card`
- *`.card`
- `*card`
> A dot means class. A hash means id, and a bare name means an HTML tag of that name.

?  Two rules have equal specificity and both set `color` on the same element. Which wins?
- The first one in the file
- *The last one in the file
- The shortest one
- Neither
> With equal specificity, order decides and later rules override earlier ones.

?tf `box-sizing: border-box` makes the width include padding and border. | true
> That is exactly its purpose, and it makes layout arithmetic far more predictable.
:::

## Layout: Flexbox

Placing items next to each other was once hard. **Flexbox** makes it simple for layouts in **one direction**: a row or a column. Make a container flexible with `display: flex`, and its direct children become **flex items**.

::: figure svg Flexbox lays items along a main axis
<svg class="fg" viewBox="0 0 640 210" role="img" aria-label="A flex container holds three boxes in a row. The main axis points right and the cross axis points down. The justify-content property spreads them along the main axis." style="max-width:640px;min-width:461px" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="ah-c1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="fg-head"/></marker></defs>
<rect x="20" y="40" width="600" height="110" rx="10" class="fg-box"/>
<rect x="44" y="64" width="110" height="62" rx="8" class="fg-box fg-accent"/><text x="99" y="101" text-anchor="middle" class="fg-title">Item 1</text>
<rect x="264" y="64" width="110" height="62" rx="8" class="fg-box fg-accent"/><text x="319" y="101" text-anchor="middle" class="fg-title">Item 2</text>
<rect x="484" y="64" width="110" height="62" rx="8" class="fg-box fg-accent"/><text x="539" y="101" text-anchor="middle" class="fg-title">Item 3</text>
<line x1="40" y1="24" x2="600" y2="24" class="fg-line" marker-end="url(#ah-c1)"/><text x="320" y="16" text-anchor="middle" class="fg-msg">main axis (flex-direction: row)</text>
<line x1="8" y1="46" x2="8" y2="146" class="fg-line fg-dash" marker-end="url(#ah-c1)"/><text x="320" y="178" text-anchor="middle" class="fg-msg">cross axis runs from top to bottom. justify-content spreads items along the main axis</text>
<text x="320" y="200" text-anchor="middle" class="fg-sub">here: justify-content: space-between and align-items: center</text>
</svg>
:::

The properties to know:

| Property | On | Effect |
|---|---|---|
| `display: flex` | Container | Turns on Flexbox |
| `flex-direction` | Container | `row` (default) or `column` |
| `justify-content` | Container | Spacing along the main axis: `flex-start`, `center`, `space-between`, `space-around` |
| `align-items` | Container | Alignment along the cross axis: `stretch`, `center`, `flex-start` |
| `gap` | Container | Space between items |
| `flex-wrap` | Container | Let items wrap onto new lines |
| `flex: 1` | Item | Let this item grow to share leftover space |

::: playground html Flexbox playground
Change `justify-content` to `center`, `flex-end` and `space-around`. Then change `flex-direction` to `column`.
```html
<div class="row">
  <div class="item">One</div>
  <div class="item">Two</div>
  <div class="item">Three</div>
</div>
```
```css
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f3f4f6;
}
.item {
  padding: 16px 24px;
  background: #1d4ed8;
  color: white;
  border-radius: 8px;
}
```
:::

::: learn The classic centring trick
To centre something both ways inside its parent: `display: flex; justify-content: center; align-items: center;` on the parent. It used to be famously hard. It is now three lines.
:::

## Layout: CSS Grid

Where Flexbox is for one direction, **Grid** is for **rows and columns together**: page layouts, galleries, dashboards. You define the tracks, and the browser places the children.

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);   /* three equal columns */
  gap: 16px;
}
```

`1fr` means "one share of the free space", so three `1fr` columns are equal. A very useful pattern creates as many columns as fit, with **no media queries**:

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
```

This means: fit as many columns as you can, each at least 220px wide, sharing the leftover space. On a phone you get one column. On a laptop you get four.

::: playground html Responsive grid
Drag the width of your browser or this window and watch the columns rearrange. Then change `220px`.
```html
<div class="cards">
  <div class="card">1</div><div class="card">2</div><div class="card">3</div>
  <div class="card">4</div><div class="card">5</div><div class="card">6</div>
</div>
```
```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 12px;
}
.card {
  padding: 28px 12px;
  text-align: center;
  background: #eef3ff;
  border: 1px solid #1d4ed8;
  border-radius: 8px;
  font-weight: bold;
}
```
:::

::: note Which one should I use?
Use **Flexbox** to line things up in a row or column (a navigation bar, a button group, the inside of a card). Use **Grid** for the overall page or any two-dimensional layout. They combine well: a grid of cards, each card laid out with Flexbox.
:::

## Positioning

Normally elements flow top to bottom in the order of the HTML. The `position` property lets you move them out of the flow.

| Value | Behaviour |
|---|---|
| `static` | The default. Normal flow |
| `relative` | Stays in flow, but can be nudged with `top` and `left`. Also the anchor for absolute children |
| `absolute` | Removed from the flow and placed relative to the nearest positioned ancestor |
| `fixed` | Placed relative to the browser window, and stays when you scroll |
| `sticky` | Behaves normally until it would scroll away, then sticks. Great for headers |

## Responsive design

People use phones, tablets, laptops and giant monitors. **Responsive design** means one page that adapts to all of them. You need three ingredients.

1. The **viewport meta tag** in your HTML (see the HTML module).
2. **Flexible units**: percentages, `rem`, `fr`, `max-width` instead of fixed widths.
3. **Media queries**, to change the layout at certain screen widths.

```css
.layout {
  display: grid;
  grid-template-columns: 1fr;        /* phones: a single column */
  gap: 16px;
}

@media (min-width: 800px) {
  .layout {
    grid-template-columns: 240px 1fr; /* wide screens: sidebar + content */
  }
}
```

::: best Design mobile first
Write the small-screen layout as the default. Then add `min-width` media queries that enhance it for larger screens. It forces you to focus on what matters, and mobile users load less CSS.
:::

Images should shrink inside narrow containers. Add this to your base styles:

```css
img { max-width: 100%; height: auto; }
```

## CSS variables and transitions

**Custom properties** (CSS variables) store a value once and reuse it. Change one line to retheme a whole site. This course's colour scheme works exactly this way.

```css
:root {
  --accent: #1d4ed8;
  --radius: 8px;
}
.button {
  background: var(--accent);
  border-radius: var(--radius);
  transition: background 0.2s;
}
.button:hover {
  background: #1e40af;
}
```

`transition` animates a property change smoothly instead of snapping. Use animations sparingly, and respect users who ask their device to reduce motion with `@media (prefers-reduced-motion: reduce)`.

::: playground html Build a button
Make the button change colour on hover, and add a `:focus-visible` outline so that keyboard users can see where they are.
```html
<button class="btn">Click me</button>
```
```css
:root { --accent: #1d4ed8; }
.btn {
  padding: 10px 20px;
  border: 0;
  border-radius: 8px;
  background: var(--accent);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn:hover { background: #1e40af; }
.btn:focus-visible { outline: 3px solid #93c5fd; outline-offset: 2px; }
```
:::

::: pitfall Common CSS mistakes
- **Using `px` for everything.** Prefer `rem` and `%` so that the page adapts.
- **Removing the focus outline** (`outline: none`) without replacing it. Keyboard users get lost.
- **Fighting specificity with `!important`.** Fix the selector instead.
- **Fixed widths on containers.** `width: 1200px` breaks on a phone. Use `max-width: 1200px; width: 100%`.
- **Forgetting the viewport meta tag**, then wondering why the mobile layout is tiny.
- **Relying on colour alone** to convey meaning, such as red for errors. Add text or an icon.
:::

::: lab Lab: a responsive profile card page
Style the profile page you built in the HTML module (or start fresh).
1. Create `style.css`, link it in your page `head`, and begin with the `box-sizing: border-box` reset.
2. Define colours and a radius as CSS variables on `:root`. Use them throughout.
3. Set `font-family`, `line-height` and a comfortable `max-width` on the main content, centred with `margin: 0 auto`.
4. Turn your `nav` into a horizontal bar with Flexbox. Use `gap` and give links a hover state and a visible `:focus-visible` outline.
5. Lay out your skills as a Grid of cards using `repeat(auto-fit, minmax(200px, 1fr))`.
6. Make the header `position: sticky; top: 0`.
7. Add one media query at 800px that places the About text and the image side by side.
8. Test at phone width (use the browser's device toolbar), at tablet width and full screen. Nothing should scroll sideways.
9. Run a contrast check on your main text and button.
:::

## Check your understanding

::: quiz check Checkpoint: layout
?  Which CSS turns an element into a flex container?
- `position: flex`
- `flex: container`
- *`display: flex`
- `layout: flex`
> `display: flex` enables Flexbox. The element's direct children become flex items.

?  Which is the best tool for a layout with rows AND columns, such as a photo gallery?
- Floats
- *CSS Grid
- Inline styles
- `<br>` tags
> Grid handles two dimensions at once. Flexbox is for one dimension.

?short Which unit means "one share of the free space" in a Grid? Type the unit. | fr
> `1fr` columns share the leftover space in proportion to their numbers.
:::

::: recap
- A CSS rule is a selector plus declarations. Use external stylesheets and mostly class selectors.
- The cascade decides a winner by importance, specificity, then order. Some properties are inherited.
- The box model has content, padding, border and margin. Use `box-sizing: border-box`.
- Use `rem` for type, relative units for widths, and check colour contrast.
- Flexbox lays out one dimension, Grid lays out two. `repeat(auto-fit, minmax(...))` is a responsive layout with no media queries.
- Responsive design is the viewport tag, flexible units and media queries, mobile first.
- Custom properties keep a design consistent. Always keep a visible focus style.
:::

::: quiz test Module test: CSS
?  Which rule makes all paragraphs red?
- `.p { color: red; }`
- *`p { color: red; }`
- `#p { color: red; }`
- `p: color = red;`
> A bare name selects HTML tags of that name. A dot would select a class called "p".

?  A class rule and an ID rule both set the background of the same element. Which wins?
- The class
- *The ID, because it is more specific
- Whichever is shorter
- Neither
> IDs are more specific than classes. That is why styling with classes is easier to override.

?  What is the total width of the visible box if `width: 200px; padding: 20px; border: 5px solid;` and the default `box-sizing: content-box`?
- 200px
- 225px
- *250px
- 245px
> Content 200 + padding 20 on each side (40) + border 5 on each side (10) = 250.

?  Which value of `position` keeps an element at the top of the viewport while the user scrolls?
- relative
- *fixed
- static
- inherit
> `fixed` positions relative to the viewport. `sticky` also works, but sticks only after scrolling to it.

?  Which approach is mobile first?
- Write desktop styles, then use `max-width` queries to shrink
- *Write the small-screen layout, then use `min-width` queries to add larger layouts
- Build a separate site for phones
- Use fixed widths
> Mobile first starts with a simple default and enhances it as space allows.

?tf Using `outline: none` on focusable elements with no replacement is fine for accessibility. | false
> Keyboard users rely on the focus outline. Remove it only if you provide an equally clear replacement.

?tf Flexbox is designed mainly for laying out items in one direction at a time. | true
> Use it for rows or columns. Grid is the tool for both directions at once.

?short Which CSS function reads a custom property, as in `var(--accent)`? Type its name. | var
> `var()` reads a custom property so you can reuse values across a stylesheet.

?multi Which of these make a layout responsive? Select all that apply.
- *The viewport meta tag
- *Relative units such as % and rem
- *Media queries
- Fixed widths in pixels on every container
> Fixed pixel widths break on small screens. The other three are the core of responsive design.

?order Put these in order of the cascade, from strongest to weakest.
1. Inline style
2. ID selector
3. Class selector
4. Type selector
> Specificity increases from tag names through classes and IDs to inline styles.
:::
