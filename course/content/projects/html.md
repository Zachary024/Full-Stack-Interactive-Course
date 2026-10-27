::: project community-event Community event page
Time: 2-3 hours
Level: Beginner
Skills: semantic HTML, tables, forms, accessibility, validation

A local library is running a coding workshop day and needs a web page to tell people about it and let them register. You will write the page in plain HTML, with no styling yet. The next module's project will make it look good, so build a solid structure now.

Requirements:
- The page has a correct skeleton: doctype, `lang` attribute, charset, viewport meta tag and a descriptive `title`.
- Use semantic elements for the layout: `header`, `nav`, `main`, at least two `section` elements, and a `footer`. There is exactly one `h1`, and headings never skip a level.
- The navigation has at least three links that jump to sections on the same page, using ids.
- A schedule table with a caption, header cells with `scope`, and at least five rows (time, session, room).
- A list of what to bring, and a description list or ordered list of the steps for getting to the venue.
- At least one image with useful `alt` text, and one decorative image (or none) handled correctly.
- A registration form with a labelled name field, an email field, a drop-down to choose a session, a group of radio buttons grouped in a `fieldset` with a `legend`, a checkbox for agreeing to the code of conduct, and a submit button.
- The form uses built-in validation: `required`, the right input types and at least one `pattern` or length limit.
- The page passes the W3C HTML validator with no errors, and you can reach every link and field using only the keyboard.

Steps:
1. Write the skeleton and the outline using only headings and comments, so you can see the structure before you add content.
2. Fill in the header, navigation and the introduction section.
3. Add the schedule table, then the two lists.
4. Build the form field by field. Give each input an `id` and a matching label, and use `name` attributes so the data would be sent properly.
5. Add the image and write alt text that would make sense if the image could not be seen.
6. Run the page through the W3C validator and fix every error. Then try the page using only Tab, Shift+Tab, Enter and Space.

Starter:
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Library Coding Day</title>
</head>
<body>
  <header>
    <h1>Library Coding Day</h1>
    <nav aria-label="Main">
      <!-- TODO: three links to #about, #schedule and #register -->
    </nav>
  </header>
  <main>
    <section id="about">
      <h2>About the day</h2>
      <!-- TODO -->
    </section>
    <section id="schedule">
      <h2>Schedule</h2>
      <!-- TODO: table with caption -->
    </section>
    <section id="register">
      <h2>Register</h2>
      <!-- TODO: form -->
    </section>
  </main>
  <footer><p><!-- TODO: contact details --></p></footer>
</body>
</html>
```

Hints:
- A link to a section is `<a href="#schedule">` and the target is any element with `id="schedule"`.
- Pair a label and input by giving the input an `id` and the label a `for` with the same value. Clicking the label should focus the field.
- Radio buttons in one group share the same `name`.
- `type="email"` and `required` give you free validation in every modern browser.

Stretch:
- Add a `details` and `summary` pair for a short FAQ.
- Add a skip link at the top of the page that jumps to `main`.
- Mark up the event date and time with the `time` element and a machine-readable `datetime` attribute.

Deliver:
- The `index.html` file.
- A screenshot of the validator result showing no errors.
- A note listing two accessibility checks you carried out.

Rubric:
- Semantics | Elements are chosen for their meaning, not their look, and the heading outline makes sense on its own.
- Forms | Every control has a visible label, related controls are grouped, and validation works without JavaScript.
- Accessibility | Images have meaningful alt text, the page works with the keyboard alone and the table is properly marked up.
- Validity | The validator reports no errors, and the code is indented and consistent.
:::
