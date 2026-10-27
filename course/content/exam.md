---
id: exam
number: 20
title: Final Exam
track: Engineering practice
duration: 45 min
level: Mixed
summary: Thirty-one questions across the whole course. Score 70% or more to unlock your certificate of completion.
---

::: objectives
- Show that you can recall and apply the core ideas from every part of the course.
- Find the topics you still need to review, and go back to them with a plan.
- Earn your certificate of completion.
:::

::: prereq
Finish the modules you care about first. You do not have to complete all of them to take the exam, but the questions cover the whole course.
:::

## How the exam works

- **31 questions**, in several formats: multiple choice, true or false, short answer, choose-all-that-apply and put-in-order.
- **Pass mark: 70%.** That is 22 correct answers.
- You can **retake** it as often as you like. Your best score counts, and the certificate shows it.
- It is **open-mind, not open-book**. Try first from memory. Retrieving an answer is what makes it stick, even when you get it wrong.
- There is no timer, but aim for about 45 minutes.

::: tip Before you start
Take a short break first, drink some water, and close other tabs. Read every question twice. For "choose all that apply", each correct choice must be selected and no wrong ones. When you are unsure, eliminate the options that are clearly wrong, and then decide.
:::

## Where each question comes from

| Topic area | Questions |
|---|---|
| The web, languages and programming fundamentals | 1 to 6, and 31 |
| HTML and CSS | 7 to 11 |
| JavaScript, basic and advanced | 12 to 15 |
| React and Vue | 16 to 18 |
| Back end, databases, data and APIs | 19 to 25 |
| Security | 26 to 27 |
| Engineering practice, DevOps and the capstone | 28 to 30 |

After the exam, the result screen shows which questions you missed and why. Use it to decide which module to review.

## If you do not pass

That is information, not failure. Look at your wrong answers, find the module that taught each one, and redo that module's checkpoints and coding challenges. Then retake the exam after a day or two. Spacing your attempts works far better than retrying immediately.

::: quiz test Final exam
?  What does the HTTP status code 404 mean?
- The server crashed
- You are not signed in
- *The requested resource was not found
- The request was successful
> 404 Not Found: the server is reachable, but it has nothing at that address.

?tf In the URL `https://shop.example.com/products?category=books&page=2`, the part after the question mark is the query string. | true
> The query string carries extra parameters, here category and page.

?  Which programming language is built into every web browser?
- Python
- Java
- *JavaScript
- Go
> Browsers run JavaScript natively. Other languages need a server (or a conversion step such as WebAssembly).

?  What is the value of `17 % 5`, where `%` is the remainder (modulo) operator?
- 3
- *2
- 3.4
- 12
> 17 divided by 5 is 3 with a remainder of 2.

?  A program must keep asking for a password until the user enters the correct one. Which loop is the natural fit?
- A `for` loop over a fixed range
- *A `while` loop that continues until the condition is satisfied
- No loop is possible
- Recursion is the only way
> You do not know in advance how many attempts are needed, so use a condition-controlled loop.

?  What is printed by this pseudocode? `total = 0; for i from 1 to 4: total = total + i; print total`
- 4
- 6
- *10
- 24
> 1 + 2 + 3 + 4 = 10.

?  Which HTML element is the best choice for the main navigation links?
- `<div class="links">`
- *`<nav>`
- `<section>`
- `<span>`
> `<nav>` is semantic: it tells browsers and assistive technology that this is navigation.

?tf The `alt` text on an image helps screen-reader users and appears if the image fails to load. | true
> It is the text alternative for the image.

?  An ID selector and a class selector both set the colour of one element. Which wins?
- The class
- The one written first
- *The ID selector, because it is more specific
- They cancel out
> IDs are more specific than classes.

?  Which pair of properties centres a flex item both horizontally and vertically in a flex container?
- `text-align` and `vertical-align`
- *`justify-content: center` and `align-items: center`
- `margin: auto` and `float: center`
- `position: middle`
> On the container, `justify-content` works along the main axis and `align-items` along the cross axis.

?short Which CSS property sets the space BETWEEN an element's content and its border? Type the property name. | padding
> Padding is inside the border, and margin is outside it.

?  What does `[1, 2, 3, 4].filter((n) => n > 1).length` evaluate to?
- 1
- 2
- *3
- 4
> `filter` keeps 2, 3 and 4, which is three items.

?tf A `const` array in JavaScript can still have items added with `push`. | true
> `const` prevents reassigning the name, not changing the contents.

?  What does this print? `console.log("A"); setTimeout(() => console.log("B"), 0); console.log("C");`
- A B C
- *A C B
- B A C
- C B A
> Timer callbacks wait until the current synchronous code has finished.

?  A `fetch` call receives a 500 response from the server. What happens to the promise?
- It rejects automatically
- It never settles
- *It resolves, and `response.ok` is false
- It retries three times
> `fetch` only rejects on network failure. Always check `response.ok`.

?  Which React code correctly adds an item to an array held in state?
- `items.push(newItem)`
- *`setItems([...items, newItem])`
- `items = items + newItem`
- `items[items.length] = newItem`
> React needs a new array, so it can see that the state changed.

?  What does the dependency array `[]` in `useEffect(fn, [])` mean?
- Run on every render
- *Run once, after the first render
- Never run
- Run before the component renders
> With no dependencies, the effect does not need to re-run.

?  In Vue, which feature gives a value that is derived from other reactive data and cached until those change?
- `watch`
- `v-show`
- *`computed`
- `emit`
> A computed value recalculates only when its dependencies change.

?  An API receives a request with an invalid email in the body. Which response is most appropriate?
- 200 with an error message
- *400 Bad Request (or 422) with a helpful error
- 404
- 500
> The client sent bad data, so use a 4xx status with details about the problem.

?  What does a middleware function in Express do when it finishes and wants the request to continue to the next step?
- Returns the response
- *Calls `next()`
- Restarts the server
- Throws an error
> Calling `next()` passes control along the pipeline. Not calling it (or sending a response) stops the chain.

?  Which join returns ALL rows from the left table, even when there is no match on the right?
- `INNER JOIN`
- *`LEFT JOIN`
- `CROSS JOIN`
- `WHERE JOIN`
> The unmatched right-hand columns are filled with NULL.

?tf A foreign key in one table stores the primary key value of a row in another table. | true
> That is how relationships are represented in a relational database.

?  What is the median of 10, 20, 30 and 1000?
- 265
- 20
- *25
- 30
> With an even count, the median is the average of the two middle values: (20 + 30) / 2 = 25. The mean (265) is pulled up by the outlier.

?  Which HTTP method is NOT idempotent?
- GET
- PUT
- DELETE
- *POST
> Repeating a POST can create another resource each time.

?multi Which of these are good reasons to choose WebSockets over normal HTTP requests? Select all that apply.
- *A live chat where the server must push messages
- *A multiplayer game that needs two-way, low-latency messages
- A page that loads a blog post once
- A form that submits once and finishes
> WebSockets suit continuous two-way communication. One-off requests do not need them.

?  How should passwords be stored in a database?
- In plain text, protected by a firewall
- Encrypted with a key kept in the same database
- *As salted hashes using a slow algorithm such as bcrypt or Argon2
- Hashed once with MD5
> Slow, salted hashing makes stolen databases hard to crack.

?  Which is the most direct defence against cross-site scripting (XSS) when displaying a user's comment?
- Making the comment longer
- *Escaping the text, or inserting it with `textContent`, so that it is never treated as HTML
- Using HTTP instead of HTTPS
- Hashing the comment
> XSS happens when attacker text is interpreted as code. Treat it as text.

?  A loop inside a loop goes over the same list of n items. What is the likely time complexity?
- O(1)
- O(log n)
- O(n)
- *O(n squared)
> Each of the n items is compared with n items, which is about n times n steps.

?  Where should a production database password be configured?
- In the JavaScript sent to the browser
- Committed in the repository
- *In an environment variable or secrets store on the server
- In the README
> Secrets are supplied by the environment, never stored in the code or the image.

?multi Which of these belong in a capstone project's "definition of done"? Select all that apply.
- *Automated tests running in CI
- *A deployed version with HTTPS
- *A README with run instructions
- Every nice-to-have feature that anyone suggested
> Done is about quality and delivery. Scope creep never ends.

?order Put these steps of a web request in order, from first to last.
1. The browser looks up the domain name with DNS
2. The browser opens a secure connection and sends the HTTP request
3. The server runs its code and sends back a response
4. The browser renders the page
> A name becomes an address, the request is sent, the server answers, and the browser draws the result.
:::
