---
id: html
number: 6
title: HTML: The Structure of Web Pages
track: Foundations
duration: 120 min
level: Beginner
summary: Elements, attributes, links, images, lists, tables, forms and semantic layout. Learn to write pages that are well structured and accessible from the start.
---

::: objectives
- Explain what HTML does and how a browser turns it into a page.
- Write elements with opening tags, closing tags, attributes and nesting.
- Build a complete page with headings, paragraphs, links, images, lists and tables.
- Create accessible forms with labels and the right input types.
- Choose semantic elements (`header`, `nav`, `main`, `article`, `footer`) instead of generic boxes.
- Describe the DOM tree the browser builds from your HTML.
:::

::: prereq
How the Web Works. You should know that a browser requests a page and receives HTML in the response.
:::

## What HTML is

**HTML** (HyperText Markup Language) describes the **structure and meaning** of a web page: this is a heading, this is a paragraph, this is a link, this is an image. It is not a programming language, because it makes no decisions or calculations. It is a *markup* language: you label content, and the browser decides how to show it.

::: plain
Imagine a document in a word processor. You select a line and mark it "Heading 1", another part "bullet list", another "bold". HTML is the same idea, except you write the labels (called **tags**) yourself in plain text.
:::

Every website you have ever visited is built on three languages, each with a separate job.

::: figure layers The three languages of the front end
*HTML | Structure and meaning: what is on the page
CSS | Presentation: colours, fonts, spacing, layout
JavaScript | Behaviour: what happens when the user clicks, types or scrolls
:::

This module covers the first. The next covers CSS. Learning them in this order is deliberate: good structure first, decoration second.

## Elements, tags and attributes

An HTML **element** usually has an **opening tag**, some **content**, and a **closing tag**. Tags are written in angle brackets, and the closing tag has a slash.

::: figure blocks Anatomy of an element
Opening tag | <a href="/about"> ; Content | About us ; Closing tag | </a>
:::

- The **tag name** (`a`, for anchor) says what kind of element it is.
- An **attribute** gives extra information as a `name="value"` pair inside the opening tag. Here `href` says where the link goes.
- Some elements have no content and no closing tag, for example `<img>` and `<br>`. They are called **void elements**.

Elements can be **nested** inside each other, like boxes inside boxes. The closing tag must close the *innermost* open element first.

```html
<p>This is <strong>very <em>important</em></strong> news.</p>
```

::: pitfall Overlapping tags
`<p>One <strong>two</p></strong>` is wrong, because `strong` was opened inside `p` and must be closed before `p` closes. Browsers try to guess what you meant, which hides your mistakes and makes bugs hard to find. Close tags in the reverse order you opened them.
:::

## Your first page

Every HTML page has the same skeleton.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My first page</title>
  </head>
  <body>
    <h1>Hello, web</h1>
    <p>This is my first page.</p>
  </body>
</html>
```

| Part | Purpose |
|---|---|
| `<!doctype html>` | Tells the browser to use modern standards |
| `<html lang="en">` | The root element. `lang` helps screen readers choose the right voice |
| `<head>` | Information *about* the page that is not shown in it |
| `<meta charset="utf-8">` | Lets you use any character, including accents and emoji |
| `<meta name="viewport" ...>` | Makes the page fit phone screens properly |
| `<title>` | The text on the browser tab and in search results |
| `<body>` | Everything the visitor actually sees |

Try it. The editor below is real HTML. Change the text and watch the result update.

::: playground html Edit this page
```html
<h1>Hello, web</h1>
<p>This is my <strong>first</strong> page.</p>
<p>Change me, then press Run.</p>
```
:::

### The DOM: the tree the browser builds

When the browser reads your HTML it builds a tree in memory called the **Document Object Model**, or [[DOM]]. Every element is a node, and nesting becomes parent and child relationships. CSS and JavaScript work on this tree, not on the text you wrote.

::: figure tree The DOM tree for the page above
html
  head
    title
  body
    h1
    p
:::

## Text content

### Headings and paragraphs

`<h1>` to `<h6>` are headings, from most to least important. Use **one** `h1` per page for the main title, then `h2` for sections, `h3` for subsections, and so on without skipping levels. Search engines and screen reader users navigate by headings, so they form an outline of your page.

::: pitfall Do not pick headings by size
Choosing `<h3>` because it "looks smaller" is a mistake. Size is CSS's job. Headings describe the *structure*. If you want different sizing, change it in CSS.
:::

`<p>` is a paragraph. Browsers collapse extra spaces and line breaks inside it, so spacing in your source is for you. To force a line break use `<br>`, though CSS spacing is usually better.

### Emphasis and inline elements

| Tag | Meaning |
|---|---|
| `<strong>` | Strong importance (usually bold) |
| `<em>` | Stress emphasis (usually italic) |
| `<code>` | A snippet of computer code |
| `<a>` | A link |
| `<span>` | A neutral inline wrapper for styling |

## Links and images

### Links

The anchor element creates a link. The `href` attribute holds the destination.

```html
<a href="https://example.com">An external site</a>
<a href="/contact.html">A page on my own site</a>
<a href="#pricing">Jump to the pricing section</a>
<a href="mailto:hello@example.com">Send an email</a>
```

Write link text that makes sense out of context. "Read our privacy policy" is useful. "Click here" is useless to a screen reader user who lists all links on a page.

### Images

```html
<img src="cat.jpg" alt="A grey cat asleep on a sofa" width="640" height="420">
```

The `src` is the image file. The **`alt`** text describes the image for people who cannot see it, and is shown if the image fails to load. Every meaningful image needs useful alt text. A purely decorative image gets an empty `alt=""` so that screen readers skip it. The `width` and `height` let the browser reserve space so the page does not jump while loading.

::: best Accessibility is not optional
About one in six people lives with a disability. Alt text, headings in order, labelled form fields and sufficient colour contrast are not extras. Building these in from the start is much cheaper than fixing them later, and it improves the experience for everybody, including search engines.
:::

## Lists and tables

Use lists for lists. Browsers and assistive technology then understand the grouping.

```html
<ul>
  <li>Milk</li>
  <li>Bread</li>
</ul>

<ol>
  <li>Preheat the oven</li>
  <li>Mix the ingredients</li>
</ol>
```

`<ul>` is an unordered (bulleted) list and `<ol>` is ordered (numbered). Each item is an `<li>`.

Use a table for real tabular data, and not for layout.

```html
<table>
  <thead>
    <tr><th>Language</th><th>Typing</th></tr>
  </thead>
  <tbody>
    <tr><td>Python</td><td>Dynamic</td></tr>
    <tr><td>Go</td><td>Static</td></tr>
  </tbody>
</table>
```

`tr` is a row, `th` a heading cell and `td` a data cell.

::: playground html Build a list and a table
```html
<h2>My favourite languages</h2>
<ol>
  <li>JavaScript</li>
  <li>Python</li>
</ol>

<table border="1" cellpadding="6">
  <tr><th>Language</th><th>Typing</th></tr>
  <tr><td>Python</td><td>Dynamic</td></tr>
  <tr><td>Go</td><td>Static</td></tr>
</table>
```
:::

::: quiz check Checkpoint: the basics of HTML
?  Which element is the correct choice for the main title of a page?
- `<title>`
- *`<h1>`
- `<head>`
- `<strong>`
> `h1` is the top-level visible heading. `<title>` is the tab text inside `head`, and not shown on the page.

?tf Every HTML element must have a closing tag. | false
> Void elements such as `img`, `br` and `input` have no content and no closing tag.

?  What is `alt` on an image for?
- Making the image bigger
- *Describing the image for people who cannot see it
- Choosing the image file
- Adding a border
> Alt text is read by screen readers and shown when the image does not load.
:::

## Semantic layout

Early websites used `<div>` (a generic box) for everything, which tells a browser or a screen reader nothing. HTML5 introduced **semantic** elements that describe the *role* of each region.

::: figure layers A semantic page layout
*header | Site logo and title, usually at the top
nav | The main navigation links
main | The unique content of this page (only one per page)
article / section | A self-contained piece, or a themed group, inside main
aside | Side content, such as related links
footer | Copyright, contact and legal links
:::

```html
<body>
  <header>
    <h1>The Daily Code</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/articles">Articles</a>
    </nav>
  </header>
  <main>
    <article>
      <h2>Why loops matter</h2>
      <p>...</p>
    </article>
    <aside>Related: Functions</aside>
  </main>
  <footer>Copyright 2026</footer>
</body>
```

The benefits are real: screen reader users can jump straight to the `main` or `nav` region, search engines understand your content better, and your own code is easier to read. Use `<div>` and `<span>` only when no semantic element fits.

## Forms: collecting input

A **form** lets visitors send data: signing up, searching, commenting. This is where front end meets back end, because the browser sends the form data to a server in an HTTP request.

```html
<form action="/signup" method="post">
  <label for="email">Email address</label>
  <input id="email" name="email" type="email" required>

  <label for="age">Age</label>
  <input id="age" name="age" type="number" min="13" max="120">

  <label for="level">Experience</label>
  <select id="level" name="level">
    <option value="new">Brand new</option>
    <option value="some">Some experience</option>
  </select>

  <label>
    <input type="checkbox" name="terms" required>
    I accept the terms
  </label>

  <button type="submit">Create account</button>
</form>
```

Key points:

- **`action`** is the URL that receives the data. **`method`** is the HTTP method (use `post` when changing data).
- Each field has a **`name`**. The server reads the value by that name.
- Each `<label>` is linked to its input by matching `for` and `id`. Clicking the label focuses the field, and screen readers announce it.
- **`type`** picks the right keyboard and built-in validation: `email`, `number`, `password`, `date`, `tel`, `checkbox`, `radio` and more.
- **`required`**, `min`, `max` and `pattern` give free validation in the browser.

::: pitfall Placeholders are not labels
Placeholder text disappears when typing begins, has poor contrast, and is not reliably announced. Always use a visible `<label>`. The placeholder can be an extra example, like `name@example.com`.
:::

::: pitfall Browser validation is not security
Browser validation helps honest users. It does nothing against an attacker, who can send any request to your server directly. The server must always check the data again. The Auth module returns to this.
:::

::: playground html A working form
Try submitting it empty, then with a bad email, and see the browser's own messages. (This preview does not send data anywhere.)
```html
<form onsubmit="event.preventDefault(); document.getElementById('msg').textContent = 'Thanks, ' + this.name.value + '!'">
  <p>
    <label for="name">Name</label><br>
    <input id="name" name="name" required>
  </p>
  <p>
    <label for="email">Email</label><br>
    <input id="email" name="email" type="email" required>
  </p>
  <button type="submit">Send</button>
  <p id="msg"></p>
</form>
```
:::

## Writing HTML that lasts

::: best Good habits from day one
- **Indent** nested elements so that the structure is visible.
- **Use lowercase** tag and attribute names, and always put attribute values in quotes.
- **Validate** your page with the free W3C validator when something looks odd.
- **Use semantic elements** first, and `div` last.
- **Give every image an `alt`**, every field a `label`, and every page a `lang` and a `title`.
- **Keep content and style separate.** Put presentation in CSS and not in attributes like `bgcolor`.
:::

::: learn Develop the habit of "View Source" and Inspect
Open any website, right click and choose **Inspect**. You will see its real DOM. You can even edit it live to experiment (changes are lost on reload and affect only your browser). Seeing professional HTML is one of the fastest ways to learn.
:::

::: lab Lab: build a personal profile page
Create a file named `profile.html` on your computer (or work in the live editor above). Open it in a browser to check.
1. Start with the full skeleton: doctype, `html` with `lang`, `head` with charset, viewport and a title, and a `body`.
2. Inside `body`, add a `header` with your name as the only `h1` and a `nav` with three links that jump to sections of the page using `#id` hrefs.
3. In `main`, add three `section` elements with `h2` headings: About me, My skills, Contact.
4. In About me, write a paragraph with at least one `strong` and one link to a site you like.
5. In My skills, add an unordered list of at least four items, and a small table comparing two things you are learning.
6. Add an image with useful `alt` text.
7. In Contact, add a form with a labelled name field, an email field, a message `textarea` and a submit button.
8. Add a `footer` with the year.
9. Check: can you reach every part with only the keyboard (press Tab)? Does every field have a label?
:::

## Check your understanding

::: quiz check Checkpoint: semantic HTML and forms
?  Which element is best for the site's main navigation links?
- `<div>`
- `<aside>`
- *`<nav>`
- `<span>`
> `nav` tells browsers and assistive technology that this region contains the primary navigation.

?  How is a `<label>` connected to an input?
- By putting the label after the input
- *By matching the label's `for` attribute with the input's `id`
- By using the same colour
- Labels do not need connecting
> Matching `for` and `id` ties them together. Clicking the label focuses the field and screen readers read it.

?short Which attribute of an input becomes the key the server uses to read its value? | name
> The `name` attribute is what the server sees. An input with no name is not submitted.
:::

::: recap
- HTML marks up structure and meaning. CSS styles it and JavaScript adds behaviour.
- An element is an opening tag, content and a closing tag. Attributes add detail. Void elements have no closing tag.
- Every page has the doctype, `html`, `head` (charset, viewport, title) and `body`.
- Use headings in order, `alt` text on images, lists for lists and tables only for data.
- Semantic elements (`header`, `nav`, `main`, `article`, `aside`, `footer`) describe a page's regions.
- Forms need labels, a `name` on each field, the right `type`, and server-side checks.
- The browser builds the DOM tree from your HTML.
:::

::: quiz test Module test: HTML
?  What does HTML primarily describe?
- How a page looks
- How a page behaves
- *The structure and meaning of its content
- Where data is stored
> HTML is markup. Look is CSS, behaviour is JavaScript.

?  Which is the correct way to nest these tags?
- `<p><strong>Hi</p></strong>`
- *`<p><strong>Hi</strong></p>`
- `<strong><p>Hi</strong></p>`
- `<p><strong>Hi</p>`
> The innermost element must close first. Overlapping tags are invalid.

?  Which tag is a void element, meaning it has no closing tag?
- `<p>`
- `<h1>`
- *`<img>`
- `<a>`
> `img`, `br`, `input` and `meta` have no content, so they are written without a closing tag.

?  Why should you not use `<table>` to lay out a whole page?
- Tables are not allowed in HTML5
- *Tables are for tabular data, and using them for layout confuses assistive technology
- Tables are always slow
- Tables cannot contain links
> Screen readers announce tables as data tables. Use CSS Flexbox or Grid for layout.

?  Which attribute makes a link point somewhere?
- `src`
- `alt`
- *`href`
- `name`
> `href` is the hypertext reference: the link destination.

?  What does `<meta name="viewport" content="width=device-width, initial-scale=1">` do?
- Changes the page colour
- *Makes the page scale properly on phones
- Adds a title
- Loads JavaScript
> Without it, mobile browsers pretend the screen is wide and shrink the page.

?tf Placeholder text is a proper replacement for a label. | false
> Placeholders vanish, have low contrast and are not reliably read out. Use real labels.

?tf Browser form validation is enough to keep a server safe. | false
> Attackers bypass the browser. The server must validate every request itself.

?short Which element holds the information about a page that is not displayed, such as its title and charset? Type the tag name without brackets. | head
> The `head` element contains metadata. The visible content goes in `body`.

?multi Which are semantic HTML elements? Select all that apply.
- *`<header>`
- *`<main>`
- *`<footer>`
- `<div>`
> `div` is a generic container with no meaning. The others describe the role of a region.

?order Put the skeleton of a page in order, from the outermost element inward.
1. `<!doctype html>`
2. `<html lang="en">`
3. `<head>`
4. `<body>`
> The doctype comes first. The `html` element wraps everything. Inside, `head` comes before `body`.
:::
