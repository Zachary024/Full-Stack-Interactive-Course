---
id: js-fund
number: 8
title: JavaScript: Making Pages Interactive
track: Foundations
duration: 170 min
level: Beginner
summary: JavaScript in the browser: variables, functions, objects, arrays, the DOM and events. Build pages that respond to people.
---

::: objectives
- Explain where JavaScript runs and how to run it in the browser console and in a page.
- Use `let` and `const`, and avoid the common type surprises.
- Write functions, including arrow functions, and pass them around as values.
- Work with objects and arrays, and transform lists with `map`, `filter` and `reduce`.
- Select and change page elements with the DOM, and react to events.
- Build a small interactive app.
:::

::: prereq
Programming Fundamentals (variables, conditions, loops, functions, lists, dictionaries) and HTML. CSS is helpful. If you chose another language for the fundamentals, nothing here is wasted: the browser only runs JavaScript, so everyone learns it for the front end.
:::

## JavaScript in the browser

JavaScript is the only programming language that every browser understands. HTML gives a page structure, CSS makes it look good, and JavaScript makes it **do** things: validate a form, update a counter, load new content without reloading, play a game. With **Node.js**, the same language also runs on servers, which is why it is so popular for full stack work.

Three places to run it:

1. **The browser console.** Press F12, open the **Console** tab, type code and press Enter. Perfect for experiments.
2. **Inside a page**, with a `<script>` element:
```html
<script src="app.js" defer></script>
```
The `defer` attribute waits until the HTML is loaded before running your script, so that the elements exist when you look for them.
3. **Node.js**, with `node file.js`, for programs without a page.

::: playground js Your JavaScript lab
Everything in this module that does not need a page runs right here. Edit and press Run.
```js
const language = "JavaScript";
console.log("Hello from " + language);
console.log(2 ** 10);   // 2 to the power of 10
```
:::

## Variables: `let` and `const`

```js
const pi = 3.14159;        // cannot be reassigned
let score = 0;             // can be reassigned
score = score + 10;
```

Use **`const`** by default, and **`let`** when the value must change. Avoid the old `var`, which has confusing scope rules. A `const` object or array can still have its *contents* changed. What cannot happen is pointing the name at something else.

## Types and their surprises

| Type | Example | Notes |
|---|---|---|
| number | `42`, `3.14` | One type for integers and decimals |
| string | `"hi"`, `'hi'`, `` `hi` `` | Three kinds of quotes |
| boolean | `true`, `false` | |
| undefined | `undefined` | A variable that has no value yet |
| null | `null` | "Deliberately empty" |
| object | `{ a: 1 }`, `[1, 2]` | Arrays are objects too |

`typeof` tells you the type of a value: `typeof 42` is `"number"`.

### Always use `===`

JavaScript has two equality operators. `==` tries to convert types first, with bizarre results. `===` compares without converting.

::: playground js Equality surprises
Read each line and guess the answer first.
```js
console.log(5 == "5");     // true: converted!
console.log(5 === "5");    // false: different types
console.log(0 == false);   // true
console.log(0 === false);  // false
console.log("5" + 3);      // "53"
console.log("5" - 3);      // 2
console.log(0.1 + 0.2);    // 0.30000000000000004
```
:::

::: best One rule that prevents most surprises
Use `===` and `!==`. Never `==` or `!=`. Convert types yourself, deliberately: `Number("5")`, `String(5)`.
:::

### Truthy and falsy

In a condition, JavaScript treats these values as **falsy**: `false`, `0`, `""` (empty text), `null`, `undefined` and `NaN`. Everything else is **truthy**, including `"0"`, `[]` and `{}`.

```js
const name = "";
if (name) {
  console.log("Hello, " + name);
} else {
  console.log("Please enter your name");
}
```

## Functions

You know functions from the fundamentals. JavaScript gives you two common ways to write them.

```js
// a function declaration
function add(a, b) {
  return a + b;
}

// an arrow function stored in a constant
const multiply = (a, b) => a * b;

// default parameter values
function greet(name = "friend") {
  return `Hello, ${name}!`;
}
```

The back-tick strings `` `Hello, ${name}!` `` are **template literals**: whatever is in `${...}` is calculated and inserted. They also allow multiple lines.

### Functions are values

In JavaScript a function is a value like any other. You can store it in a variable, put it in a list, pass it to another function and return it from one. A function passed to another is called a **callback**. This idea powers events, array methods and asynchronous code.

```js
function repeat(times, action) {
  for (let i = 0; i < times; i++) {
    action(i);
  }
}
repeat(3, (n) => console.log("Round " + n));
```

::: plain
Handing a function to another function is like leaving a note for a babysitter: "When the baby wakes up, do this." You are not doing it now. You are saying what to do later, when something happens.
:::

## Objects and arrays

### Objects

An **object** groups related values under names (called properties).

```js
const user = {
  name: "Ada",
  age: 36,
  skills: ["maths", "code"],
  greet() {
    return "Hi, I am " + this.name;
  },
};

console.log(user.name);        // dot notation
console.log(user["age"]);      // bracket notation (for dynamic keys)
user.email = "ada@example.com"; // add a property
console.log(user.greet());
```

Two modern shortcuts you will see everywhere:

```js
const { name, age } = user;                 // destructuring: pull values out
const older = { ...user, age: 37 };         // spread: copy an object, change one value
```

### Arrays and their superpowers

Arrays have built-in methods that replace most hand-written loops. Three of them will do most of your daily data work.

| Method | What it does | Returns |
|---|---|---|
| `map(fn)` | Transform every item | A new array of the same length |
| `filter(fn)` | Keep items for which `fn` returns true | A shorter array |
| `reduce(fn, start)` | Combine all items into a single value | One value |
| `find(fn)` | The first item for which `fn` is true | One item or `undefined` |
| `some(fn)` / `every(fn)` | Is any / are all items matching? | A boolean |
| `includes(x)` | Is `x` in the array? | A boolean |
| `sort(fn)` | Sort in place (use a compare function for numbers) | The array |

::: figure flow filter, then map, then reduce: a pipeline of small steps
Numbers | [1, 2, 3, 4, 5, 6] -> *filter even | [2, 4, 6] -> map square | [4, 16, 36] -> reduce sum | 56
:::

::: playground js Build a data pipeline
Change the data and the functions. Try filtering numbers above 3, or doubling instead of squaring.
```js
const numbers = [1, 2, 3, 4, 5, 6];

const evens = numbers.filter((n) => n % 2 === 0);
const squares = evens.map((n) => n * n);
const total = squares.reduce((sum, n) => sum + n, 0);

console.log(evens);    // [2, 4, 6]
console.log(squares);  // [4, 16, 36]
console.log(total);    // 56
```
:::

Here is the same idea as a comparison with the language you chose. This is a good way to see that the **idea** (filter, transform) is universal, even though the syntax differs.

::: code Squares of the even numbers from 1 to 6
```javascript
const result = [1, 2, 3, 4, 5, 6]
  .filter((n) => n % 2 === 0)
  .map((n) => n * n);
console.log(result.join(" "));
```
```python
result = [n * n for n in range(1, 7) if n % 2 == 0]
print(" ".join(str(n) for n in result))
```
```java
String result = IntStream.rangeClosed(1, 6)
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .mapToObj(String::valueOf)
    .collect(Collectors.joining(" "));
System.out.println(result);
```
```csharp
using System.Linq;

var result = Enumerable.Range(1, 6).Where(n => n % 2 == 0).Select(n => n * n);
Console.WriteLine(string.Join(" ", result));
```
```php
<?php
$even = array_filter(range(1, 6), fn($n) => $n % 2 === 0);
$result = array_map(fn($n) => $n * $n, $even);
echo implode(" ", $result) . "\n";
```
```go
var out []string
for n := 1; n <= 6; n++ {
    if n%2 == 0 {
        out = append(out, strconv.Itoa(n*n))
    }
}
fmt.Println(strings.Join(out, " "))
```
```ruby
result = (1..6).select(&:even?).map { |n| n * n }
puts result.join(" ")
```
```output
4 16 36
```
:::

::: challenge double Double every number
Write `doubleAll(numbers)` that returns a **new** array with every number multiplied by 2. Use `map`.

Hint: `numbers.map(...)` takes a function that receives one item and returns its replacement.
Hint: `return numbers.map((n) => n * 2);`
```js starter
function doubleAll(numbers) {
  // your code here
}
```
```js tests
test('doubles a list', () => assert.deepEqual(doubleAll([1, 2, 3]), [2, 4, 6]));
test('empty list', () => assert.deepEqual(doubleAll([]), []));
test('negatives', () => assert.deepEqual(doubleAll([-1, 0, 5]), [-2, 0, 10]));
test('does not change the original', () => { const a = [1, 2]; doubleAll(a); assert.deepEqual(a, [1, 2]); });
```
```js solution
function doubleAll(numbers) {
  return numbers.map((n) => n * 2);
}
```
:::

::: challenge adults Keep only the adults
Write `adultNames(people)`. Given an array of objects like `{ name: "Ada", age: 36 }`, return an array with just the **names** of people aged 18 or over, in the same order.

Hint: First `filter` the people by age, then `map` them to their names.
Hint: `people.filter((p) => p.age >= 18).map((p) => p.name)`
```js starter
function adultNames(people) {
  // your code here
}
```
```js tests
const group = [{ name: 'Ada', age: 36 }, { name: 'Tim', age: 12 }, { name: 'Grace', age: 18 }];
test('finds adults', () => assert.deepEqual(adultNames(group), ['Ada', 'Grace']));
test('no adults', () => assert.deepEqual(adultNames([{ name: 'Kid', age: 5 }]), []));
test('empty', () => assert.deepEqual(adultNames([]), []));
```
```js solution
function adultNames(people) {
  return people.filter((p) => p.age >= 18).map((p) => p.name);
}
```
:::

::: challenge cart Total a shopping cart
Write `cartTotal(items)`. Each item looks like `{ price: 2.5, quantity: 4 }`. Return the sum of `price * quantity` for all items. Use `reduce`.

Hint: `reduce` takes a function `(running, item) => ...` and a starting value. Start at 0.
Hint: `items.reduce((sum, item) => sum + item.price * item.quantity, 0)`
```js starter
function cartTotal(items) {
  // your code here
}
```
```js tests
test('two items', () => assert.equal(cartTotal([{ price: 2, quantity: 3 }, { price: 5, quantity: 1 }]), 11));
test('empty cart', () => assert.equal(cartTotal([]), 0));
test('single', () => assert.equal(cartTotal([{ price: 10, quantity: 2 }]), 20));
```
```js solution
function cartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```
:::

::: quiz check Checkpoint: JavaScript basics
?  Which declaration should you reach for by default?
- `var`
- *`const`
- `let`, always
- No keyword
> Use `const` unless the value has to change, then `let`. `var` has confusing scope rules and is best avoided.

?  What does `"5" + 3` evaluate to in JavaScript?
- 8
- *"53"
- 2
- NaN
> With text on one side, `+` joins. `-` has no text meaning, so `"5" - 3` gives 2.

?tf `5 === "5"` is true because JavaScript converts the text to a number. | false
> Triple equals compares without converting types, so a number and a string are never equal.
:::

::: quiz check Checkpoint: arrays and objects
?  Which method returns a NEW array of the same length with each item changed?
- `filter`
- `reduce`
- *`map`
- `find`
> `map` transforms each item. `filter` keeps some of them and `reduce` collapses them to a single value.

?  What does `[1, 2, 3, 4].filter((n) => n > 2)` return?
- `[1, 2]`
- `[false, false, true, true]`
- *`[3, 4]`
- `7`
> `filter` keeps only the items for which the function returns true.
:::

## The DOM: changing the page

In the HTML module you met the DOM, the tree of elements the browser builds. JavaScript can **find** elements, **change** them, **create** new ones and **remove** them. Every change appears on screen immediately.

::: figure flow The DOM workflow in three steps
*1. Find | document.querySelector -> 2. Change | textContent, classList, style -> 3. Observe | the page updates instantly
:::

```js
const title = document.querySelector("h1");     // find the first h1
title.textContent = "New title";                // change its text
title.classList.add("highlight");               // add a CSS class
```

`querySelector` takes any CSS selector and returns the first match. `querySelectorAll` returns all matches.

| Do this | With |
|---|---|
| Change text safely | `el.textContent = "..."` |
| Add or remove a class | `el.classList.add("x")`, `.remove("x")`, `.toggle("x")` |
| Read or set an attribute | `el.getAttribute("href")`, `el.setAttribute("href", "...")` |
| Create an element | `document.createElement("li")` |
| Insert it | `parent.append(child)` |
| Remove it | `el.remove()` |

::: pitfall Beware of innerHTML
`el.innerHTML = userText` inserts text as **HTML**. If a visitor types `<script>` or `<img onerror=...>`, you have just given them control of your page. This is an **XSS** attack. Use `textContent` for text, and build elements with `createElement`.
:::

## Events: reacting to the user

An **event** is something that happens: a click, a key press, a form submission, a page load. You attach a function (a callback) that runs when it happens.

```js
button.addEventListener("click", () => {
  counter = counter + 1;
  display.textContent = counter;
});
```

::: stepper How a click becomes a change on screen
1. **The user clicks the button.** The browser notices and creates an event describing the click.
2. **The browser looks for listeners.** It checks whether any function was registered with `addEventListener("click", ...)` on that element.
3. **Your callback runs.** Your code updates a variable and changes the page, for example with `textContent`.
4. **The browser repaints.** The visitor sees the new number. Nothing was reloaded.
:::

Try it. The editor has HTML, CSS and JavaScript tabs. Click the tabs to read all three, then press the button in the result.

::: playground html A click counter
Change the step from 1 to 5. Add a "Reset" button as an extra challenge.
```html
<p>You clicked <strong id="count">0</strong> times.</p>
<button id="btn">Click me</button>
```
```css
body { font-family: system-ui, sans-serif; padding: 16px; }
button { padding: 10px 18px; font-size: 1rem; border: 0; border-radius: 8px; background: #1d4ed8; color: #fff; cursor: pointer; }
```
```javascript
let count = 0;
const display = document.getElementById("count");
document.getElementById("btn").addEventListener("click", () => {
  count = count + 1;
  display.textContent = count;
});
```
:::

### Forms and `preventDefault`

When a form is submitted, the browser normally reloads the page. In interactive apps we intercept the event and handle it ourselves.

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();       // stop the page reload
  const text = input.value.trim();
  if (!text) return;            // ignore empty input
  addTodo(text);
  input.value = "";
});
```

::: playground html A to-do list
Read the JavaScript tab carefully. Everything in it is something you have already learned. Then add a feature: clicking an item removes it.
```html
<form id="form">
  <label for="item">New task</label>
  <input id="item" required>
  <button>Add</button>
</form>
<ul id="list"></ul>
```
```css
body { font-family: system-ui, sans-serif; padding: 16px; }
li { margin: 6px 0; }
input { padding: 6px; }
button { padding: 6px 12px; }
```
```javascript
const form = document.getElementById("form");
const input = document.getElementById("item");
const list = document.getElementById("list");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const li = document.createElement("li");
  li.textContent = input.value.trim();
  list.append(li);
  input.value = "";
});
```
:::

::: learn Read the error, then fix
If a DOM script does nothing, open the console. The most common messages: `Cannot read properties of null` (your `querySelector` found nothing, so check the selector or whether the script ran before the element existed) and `x is not defined` (a typo).
:::

## Debugging in the browser

The developer tools are a superpower. Press F12 and try these.

- **Console**: see errors and your `console.log` output. Type code to test ideas.
- **Elements**: inspect and edit the live DOM and CSS.
- **Sources**: set a **breakpoint** by clicking a line number. The page pauses there, and you can inspect every variable and step through line by line.
- **Network**: see every request the page makes, with status codes and timings.

::: lab Lab: build a tip calculator
Make a page that works out a tip and a bill split. Use your own computer, or the live HTML editor.
1. In HTML, add number inputs for **bill amount**, **tip percentage** and **number of people**, each with a visible label. Add a "Calculate" button and an empty `<output>` or `<p>` for the result.
2. Write a function `calculateTip(bill, percent, people)` that returns an object with `tip`, `total` and `perPerson`, rounded to two decimals (`Number(x.toFixed(2))`).
3. Listen for the form's `submit` event, call `event.preventDefault()`, read the input values with `Number(input.value)`, and show the result.
4. Handle bad input: if the bill is not positive or the number of people is below 1, show a clear error message instead of a result.
5. Add three quick-select buttons for 10%, 15% and 20% that fill in the percentage field.
6. Style it with CSS and make it work on a phone screen.
7. Stretch goal: remember the last used values with `localStorage.setItem` and `localStorage.getItem`.
:::

::: pitfall Common JavaScript mistakes
- **Using `==`.** Use `===`.
- **Forgetting `defer`**, so the script runs before the elements exist and finds `null`.
- **Mutating when you meant to copy.** `const b = a` does not copy an array, it gives it a second name. Use `[...a]`.
- **Comparing floating-point numbers exactly** (`0.1 + 0.2 === 0.3` is false).
- **Using `innerHTML` with user text.** Use `textContent`.
- **Treating a string from an input as a number.** `input.value` is always text. Convert it with `Number(...)`.
:::

::: recap
- JavaScript runs in every browser, and also on servers with Node.js.
- Use `const` by default, `let` when needed. Always compare with `===`.
- Functions are values. Arrow functions and callbacks are everywhere.
- Objects group named values. Arrays have `map`, `filter` and `reduce`.
- The DOM is a tree you can find, change, create and remove with JavaScript.
- Events (clicks, submits, key presses) trigger your callbacks. Use `preventDefault` on form submits.
- Use `textContent`, not `innerHTML`, for user-provided text. Debug with the browser's developer tools.
:::

::: quiz test Module test: JavaScript
?  What does `[1, 2, 3].map((n) => n * 2)` return?
- `6`
- `[1, 2, 3]`
- *`[2, 4, 6]`
- `[2, 3]`
> `map` returns a new array with the function applied to each item.

?  Which statement about `const` is TRUE?
- A `const` array can never change in any way
- *A `const` name cannot be reassigned, but an array or object it points to can still be modified
- `const` is only for numbers
- `const` makes the program faster
> `const` stops you from pointing the name at something else, but the contents of an object or array are still mutable.

?  What does `console.log(0 == false, 0 === false)` print?
- `false false`
- `true true`
- *`true false`
- `false true`
> `==` converts types, so 0 equals false. `===` does not convert, so they differ.

?  What is the output of `` const n = 3; console.log(`n is ${n + 1}`); ``?
- `n is ${n + 1}`
- *`n is 4`
- `n is 31`
- An error
> Inside `${...}` any expression is evaluated, so `n + 1` becomes 4.

?  Why is `el.innerHTML = userInput` dangerous?
- It is slow
- *It can run scripts or HTML supplied by an attacker (XSS)
- It only works on buttons
- It deletes the element
> innerHTML parses its input as HTML. Use `textContent` for plain text.

?  A script run in `<head>` without `defer` calls `document.querySelector("h1")` and gets `null`. Why?
- There is no h1 in any page
- *The script ran before the browser had built the elements
- querySelector is broken
- null means success
> The DOM does not exist yet while the head is being parsed. Use `defer` or place the script at the end of the body.

?tf The value of `input.value` for a number input is a number. | false
> It is always a string. Convert it with `Number(input.value)` before doing arithmetic.

?tf `event.preventDefault()` on a form's submit event stops the browser from reloading the page. | true
> This lets your JavaScript handle the data instead.

?short Which array method combines all items into a single value? Type its name. | reduce
> `reduce` takes a function and a starting value and folds the array into one result, such as a total.

?multi Which of these are falsy in JavaScript? Select all that apply.
- *`0`
- *`""` (an empty string)
- *`null`
- `[]` (an empty array)
> An empty array is an object, so it is truthy. The other three are falsy.

?order Put these steps of handling a click in order.
1. The user clicks
2. The browser finds the registered listener
3. Your callback runs and updates the variable
4. The page shows the new value
> The event happens, the browser dispatches it, your code responds, and the screen is repainted.
:::
