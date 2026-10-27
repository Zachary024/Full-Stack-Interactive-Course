---
id: js-adv
number: 9
title: Advanced JavaScript
track: Foundations
duration: 180 min
level: Intermediate
summary: Scope and closures, classes, modules, asynchronous code with promises and async/await, fetch, JSON, errors and modern syntax.
---

::: objectives
- Explain scope and closures, and use a closure to keep private state.
- Create classes with constructors, methods and inheritance.
- Split code into modules with `import` and `export`.
- Explain why asynchronous code exists and how the event loop schedules it.
- Write promise chains and `async`/`await` code with proper error handling.
- Call an API with `fetch`, and read and write JSON.
- Use modern syntax: optional chaining, nullish coalescing, spread and destructuring.
:::

::: prereq
JavaScript: Making Pages Interactive. You should be comfortable with functions, arrays, objects and callbacks.
:::

## Scope and closures

**Scope** is the area of code where a name is visible. Variables declared with `let` and `const` live inside the nearest pair of curly braces (a **block**) and disappear after it.

```js
function demo() {
  const secret = 42;
  if (true) {
    let inner = "only here";
  }
  // console.log(inner);  // ReferenceError: not defined here
  return secret;
}
```

An inner function can see variables of the outer functions around it. When a function **remembers** the variables from where it was created, even after the outer function has finished, we call it a **closure**.

```js
function makeCounter() {
  let count = 0;            // private: nothing outside can touch it
  return function () {
    count = count + 1;
    return count;
  };
}

const a = makeCounter();
const b = makeCounter();
console.log(a(), a(), a());  // 1 2 3
console.log(b());            // 1: b has its own separate count
```

::: plain
A closure is a backpack. When a function is created, it packs the variables around it into a backpack and carries it forever. Every call to `makeCounter` gives out a new function with its own backpack, so `a` and `b` cannot interfere with each other.
:::

::: playground js Closures at work
Create a second counter and check that the two are independent. Then add a `reset` method by returning an object with `next` and `reset` functions.
```js
function makeCounter() {
  let count = 0;
  return () => ++count;
}

const clicks = makeCounter();
clicks();
clicks();
console.log("clicks:", clicks());
```
:::

::: challenge counter Build a counter with a closure
Write `makeCounter(start = 0)` that returns an object with three functions: `next()` increases the count by one and returns it, `value()` returns the current count without changing it, and `reset()` sets it back to `start`. Each counter must keep its own private count.

Hint: Declare `let count = start` inside `makeCounter`, then return an object whose methods use `count`.
Hint: `reset` should assign `count = start`.
```js starter
function makeCounter(start = 0) {
  // your code here
}
```
```js tests
test('counts up', () => { const c = makeCounter(); c.next(); c.next(); assert.equal(c.value(), 2); });
test('next returns new value', () => { const c = makeCounter(); assert.equal(c.next(), 1); });
test('custom start', () => { const c = makeCounter(10); assert.equal(c.next(), 11); });
test('reset', () => { const c = makeCounter(5); c.next(); c.reset(); assert.equal(c.value(), 5); });
test('independent counters', () => { const a = makeCounter(); const b = makeCounter(); a.next(); a.next(); assert.equal(b.value(), 0); });
```
```js solution
function makeCounter(start = 0) {
  let count = start;
  return {
    next() { count = count + 1; return count; },
    value() { return count; },
    reset() { count = start; },
  };
}
```
:::

## Classes and `this`

A **class** is a blueprint for creating objects with the same shape and behaviour. The objects it creates are called **instances**. (The Advanced Engineering module goes deeper into object-oriented design.)

```js
class Account {
  #balance = 0;                    // a private field

  constructor(owner) {
    this.owner = owner;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.#balance += amount;
  }

  get balance() {
    return this.#balance;
  }
}

const acc = new Account("Ada");
acc.deposit(100);
console.log(acc.owner, acc.balance);  // Ada 100
```

- `constructor` runs when you call `new Account(...)`.
- `this` refers to the instance the method is being called on.
- `#balance` is a **private field**: code outside the class cannot read it, so the only way to change the balance is through the methods that enforce the rules.

### Inheritance

A class can **extend** another, inheriting its properties and methods, and adding or replacing some.

```js
class Savings extends Account {
  addInterest(rate) {
    this.deposit(this.balance * rate);
  }
}
const s = new Savings("Grace");
s.deposit(200);
s.addInterest(0.1);
console.log(s.balance);   // 220
```

::: pitfall The slippery `this`
`this` depends on **how** a function is called, not where it is written. A method detached from its object loses it:
```js
const f = acc.deposit;
f(10);          // TypeError: this is undefined
```
Arrow functions do not have their own `this`: they use the one around them, which makes them handy for callbacks inside methods. When a callback must keep its object, use an arrow function.
:::

::: challenge account A safe bank account class
Write a class `BankAccount`. `new BankAccount(balance = 0)` starts with an opening balance. It needs `deposit(amount)`, `withdraw(amount)` and a `balance` getter. Both methods must throw an `Error` when the amount is not a positive number. `withdraw` must also throw if the amount is bigger than the balance, leaving the balance unchanged.

Hint: Store the balance in a private field such as `#balance`, and expose it with `get balance() { ... }`.
Hint: Check for bad amounts first, then change the balance, so that a failed call changes nothing.
```js starter
class BankAccount {
  // your code here
}
```
```js tests
test('opening balance', () => assert.equal(new BankAccount(50).balance, 50));
test('default balance is zero', () => assert.equal(new BankAccount().balance, 0));
test('deposit', () => { const a = new BankAccount(10); a.deposit(5); assert.equal(a.balance, 15); });
test('withdraw', () => { const a = new BankAccount(10); a.withdraw(4); assert.equal(a.balance, 6); });
test('rejects bad deposit', () => assert.throws(() => new BankAccount().deposit(-5)));
test('rejects zero withdrawal', () => assert.throws(() => new BankAccount(10).withdraw(0)));
test('cannot overdraw', () => { const a = new BankAccount(10); assert.throws(() => a.withdraw(11)); assert.equal(a.balance, 10); });
```
```js solution
class BankAccount {
  #balance;
  constructor(balance = 0) { this.#balance = balance; }
  deposit(amount) {
    if (typeof amount !== 'number' || !(amount > 0)) throw new Error('Amount must be positive');
    this.#balance += amount;
  }
  withdraw(amount) {
    if (typeof amount !== 'number' || !(amount > 0)) throw new Error('Amount must be positive');
    if (amount > this.#balance) throw new Error('Insufficient funds');
    this.#balance -= amount;
  }
  get balance() { return this.#balance; }
}
```
:::

::: quiz check Checkpoint: closures and classes
?  What is a closure?
- A function that has no parameters
- *A function that remembers the variables from where it was created
- A way of closing the browser window
- A class with private fields
> A closure carries its surrounding variables with it, which is how `makeCounter` keeps a private count.

?  What does `#balance` mean inside a class?
- A comment
- *A private field that code outside the class cannot access
- A constant
- A CSS id
> The hash prefix makes a field private to the class.

?tf In an arrow function, `this` is the object the function was called on. | false
> Arrow functions have no `this` of their own. They use the `this` of the code around them.
:::

## Modules: splitting code into files

Real programs are split into many files. JavaScript **modules** let each file `export` what it offers, and other files `import` what they need.

```js nocheck
// math.js
export function add(a, b) { return a + b; }
export const PI = 3.14159;
export default function square(n) { return n * n; }

// app.js
import square, { add, PI } from "./math.js";
console.log(add(2, 3), square(4), PI);
```

In a page, load the entry file with `<script type="module" src="app.js">`. Node.js also supports modules (`"type": "module"` in `package.json`, or the `.mjs` extension). You will use modules constantly in React and Vue.

::: note Modules give each file its own scope
A variable in one module does not leak into another unless it is exported. This removes the old problem of two scripts accidentally overwriting each other's names.
:::

## Asynchronous JavaScript

Some jobs take time: downloading data, reading a file, waiting for a timer. If JavaScript **waited** for each one, the page would freeze. Instead it starts the job, carries on with other work, and handles the result **later**. This is **asynchronous** code.

### The event loop

JavaScript runs one thing at a time on a single thread. The **event loop** is how it juggles waiting tasks: finished jobs line up in a queue, and the loop runs them when the call stack is empty.

::: figure flow The event loop
Your code | runs on the call stack -> *Browser APIs | timers, network, clicks wait here -> Task queue | finished jobs line up -> Event loop | when the stack is empty, runs the next job
:::

This explains a famous puzzle. Predict the output before running it.

::: playground js Why does "last" come before "timer"?
Even with a delay of 0 milliseconds, the callback waits until the current code has finished.
```js
console.log("first");
setTimeout(() => console.log("timer"), 0);
console.log("last");
```
:::

### Callbacks, and "callback hell"

The oldest way to handle asynchronous results is a **callback**. Dependent steps nest deeper and deeper, which gets unreadable and makes errors hard to handle.

```js
getUser(1, (user) => {
  getOrders(user.id, (orders) => {
    getItems(orders[0].id, (items) => {
      console.log(items);   // three levels deep!
    });
  });
});
```

### Promises

A **promise** is an object that represents a value that will arrive later. It is in one of three states.

::: figure blocks The three states of a promise
Pending | Work in progress ; Fulfilled | It worked. A value is available ; Rejected | It failed. An error is available
:::

```js
const wait = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

wait(100, "done")
  .then((result) => console.log(result))
  .catch((error) => console.error(error))
  .finally(() => console.log("always runs"));
```

`.then` handles success, `.catch` handles failure, and `.finally` runs either way. Chains stay flat, and one `.catch` can handle errors from any step above it.

### `async` and `await`

`async`/`await` is syntax that makes promise code read like ordinary top-to-bottom code. An `async` function always returns a promise. Inside it, `await` pauses **that function** until a promise settles, without freezing the rest of the page.

```js
async function showUser() {
  try {
    const user = await getUser(1);
    const orders = await getOrders(user.id);
    console.log(orders);
  } catch (error) {
    console.error("Something failed:", error.message);
  }
}
```

The ordinary `try`/`catch` works because `await` turns a rejected promise back into a thrown error.

::: playground js Async/await in action
The code below simulates two slow steps. Change the delays, and make the second step fail (`throw new Error("no orders")`) to see the `catch` run.
```js
const wait = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function main() {
  try {
    console.log("loading user...");
    const user = await wait(60, { id: 1, name: "Ada" });
    console.log("got", user.name);
    const orders = await wait(60, ["book", "pen"]);
    console.log("orders:", orders.length);
  } catch (error) {
    console.log("failed:", error.message);
  }
}
main();
console.log("main() has started, but not finished");
```
:::

::: pitfall Sequential or parallel?
Two `await`s in a row run **one after the other**. If the jobs are independent, start both first and wait together:
```js
const [users, products] = await Promise.all([getUsers(), getProducts()]);
```
It takes as long as the slowest job, not the sum. If any one fails, `Promise.all` fails too (use `Promise.allSettled` to get every outcome). Forgetting `await` is a classic mistake: you get a promise object instead of its value.
:::

::: challenge delay Write a delay helper
Write `delay(ms, value)` that returns a promise which **resolves to `value`** after `ms` milliseconds. Use `setTimeout`.

Hint: `return new Promise((resolve) => { ... })`, and call `resolve(value)` from a timer.
Hint: `return new Promise((resolve) => setTimeout(() => resolve(value), ms));`
```js starter
function delay(ms, value) {
  // your code here
}
```
```js tests
test('returns a promise', () => assert(delay(1, 'x') instanceof Promise, 'delay must return a Promise'));
test('resolves with the value', async () => assert.equal(await delay(5, 'hello'), 'hello'));
test('waits', async () => { const t = Date.now(); await delay(40, 1); assert(Date.now() - t >= 30, 'resolved too early'); });
```
```js solution
function delay(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
```
:::

::: challenge retry Retry a failing task
Write the **async** function `retry(task, attempts)`. `task` is an async function. Call it. If it succeeds, return its result. If it throws, try again, up to `attempts` calls in total. If every attempt fails, throw the **last** error.

Hint: Use a `for` loop from 1 to `attempts`, with `try { return await task(); } catch (e) { lastError = e; }`.
Hint: After the loop, `throw lastError`.
```js starter
async function retry(task, attempts) {
  // your code here
}
```
```js tests
test('succeeds first time', async () => assert.equal(await retry(async () => 'ok', 3), 'ok'));
test('retries until success', async () => {
  let n = 0;
  const r = await retry(async () => { n++; if (n < 3) throw new Error('fail'); return n; }, 5);
  assert.equal(r, 3);
});
test('gives up with the last error', async () => {
  let calls = 0, caught = null;
  try { await retry(async () => { calls++; throw new Error('bad ' + calls); }, 2); } catch (e) { caught = e; }
  assert(caught, 'should have thrown');
  assert.equal(caught.message, 'bad 2');
  assert.equal(calls, 2);
});
```
```js solution
async function retry(task, attempts) {
  let lastError;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await task();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}
```
:::

## Talking to servers with `fetch`

`fetch` requests data over HTTP and returns a promise. You learned HTTP in the web module. Now you use it from code.

```js
async function loadTodos() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=3");
  if (!response.ok) {
    throw new Error("HTTP " + response.status);   // fetch only rejects on network failure!
  }
  const todos = await response.json();            // parse the JSON body
  return todos;
}
```

::: pitfall fetch does not reject on 404 or 500
`fetch` only fails if the **network** fails. A `404 Not Found` or `500 Server Error` is a *successful* fetch with `response.ok === false`. Always check `response.ok` (or `response.status`) yourself.
:::

Sending data uses the same function with options:

```js
const response = await fetch("/api/todos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Learn fetch" }),
});
const created = await response.json();
```

::: figure sequence A fetch request and its promise
Your code | Browser | Server
Your code -> Browser: fetch(url) returns a pending promise
Your code -> Your code: carries on with other work
Browser -> Server: GET /todos
Server --> Browser: 200 OK and a JSON body
Browser --> Your code: promise fulfilled, await continues
:::

### JSON

**JSON** is the text format APIs use to exchange data. It looks like a JavaScript object, but keys must be in double quotes, and there are no functions, comments or trailing commas.

::: playground js JSON round trip
`JSON.stringify` turns a value into text. `JSON.parse` turns text back into a value. Try parsing invalid JSON and see the error.
```js
const user = { name: "Ada", age: 36, skills: ["maths", "code"] };

const text = JSON.stringify(user);
console.log(text);

const back = JSON.parse(text);
console.log(back.skills[1]);

try {
  JSON.parse("{ name: 'Ada' }");     // invalid JSON
} catch (e) {
  console.log("Bad JSON:", e.name);
}
```
:::

## Errors

You already met `try`/`catch`. A few more details give you real control.

```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

function checkAge(age) {
  if (!Number.isInteger(age) || age < 0) {
    throw new ValidationError("Age must be a whole number", "age");
  }
}

try {
  checkAge(-3);
} catch (e) {
  if (e instanceof ValidationError) console.log(e.field + ": " + e.message);
  else throw e;               // unknown error: do not swallow it
}
```

::: best Handle errors where you can do something useful
Catch an error where you can recover or show the user a helpful message. Otherwise let it travel up. Never write an empty `catch` that silently hides problems, because it will cost you hours of debugging later.
:::

## Modern syntax you will see everywhere

| Feature | Example | What it does |
|---|---|---|
| Optional chaining | `user?.address?.city` | Gives `undefined` instead of an error if something is missing |
| Nullish coalescing | `input ?? "default"` | Uses the default only for `null` or `undefined` (not for `0` or `""`) |
| Destructuring | `const { name, age } = user` | Pulls properties into variables |
| Array destructuring | `const [first, ...rest] = list` | Splits a list into the first item and the rest |
| Spread | `{ ...user, age: 37 }`, `[...a, ...b]` | Copies and merges objects and arrays |
| Rest parameters | `function sum(...nums)` | Collects extra arguments into an array |
| Template literals | `` `Hi ${name}` `` | Embeds expressions in text |

::: playground js Modern syntax tour
Predict each result, then run it.
```js
const user = { name: "Ada", address: null, visits: 0 };

console.log(user.address?.city);          // undefined, no error
console.log(user.visits || 10);           // 10   (0 is falsy!)
console.log(user.visits ?? 10);           // 0    (0 is a real value)

const [first, ...rest] = [1, 2, 3, 4];
console.log(first, rest);

const merged = { ...user, visits: user.visits + 1, role: "admin" };
console.log(merged);

const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
console.log(sum(1, 2, 3, 4));
```
:::

### Storing data in the browser

`localStorage` keeps text under a key, even after the tab closes. It is perfect for preferences and small drafts. Store objects as JSON.

```js
localStorage.setItem("prefs", JSON.stringify({ theme: "dark" }));
const prefs = JSON.parse(localStorage.getItem("prefs") ?? "{}");
```

Never store passwords or tokens you cannot afford to leak in `localStorage`: any script on the page can read it. The Security module explains the safer options.

## Introducing TypeScript

JavaScript lets you pass anything anywhere, and finds out at runtime that you passed the wrong thing. **TypeScript** adds **types** to JavaScript, checked **before** the code runs, in your editor.

```js nocheck
// TypeScript
function area(width: number, height: number): number {
  return width * height;
}
area(3, "4");   // error caught immediately: "4" is not a number
```

TypeScript compiles to plain JavaScript, so it runs anywhere JavaScript does. Most professional front-end and Node.js teams use it, and React, Vue and Angular all support it. You do not need it yet, and everything you have learned carries over. It is a good next step once you are comfortable here.

::: lab Lab: a GitHub profile viewer
Use a free public API, and apply everything from this module. Work on your own machine with an HTML page and a JavaScript module.
1. Build a page with a search box, a button and an empty results area.
2. Write `async function getUser(name)` which calls `https://api.github.com/users/` followed by the name, checks `response.ok`, and returns the parsed JSON.
3. On submit, show "Loading..." and call `getUser`. Display the avatar, name, public repository count and a link, using `createElement` and `textContent` (not `innerHTML`).
4. Handle failure: show a friendly message for a 404 ("User not found") and for network errors.
5. Use optional chaining and `??` for fields that may be `null` (such as `name` or `bio`).
6. Put the fetching code in its own module and `import` it.
7. Save the last search in `localStorage` and reload it when the page opens.
8. Stretch goal: also fetch the user's repositories in parallel with `Promise.all` and list the five most recently updated.
:::

::: quiz check Checkpoint: asynchronous code
?  What does an `async` function always return?
- Nothing
- The value of the last line
- *A promise
- A callback
> Even if you `return 5`, an async function wraps it in a promise that resolves to 5.

?  What does `fetch` do when the server answers with status 404?
- Rejects the promise
- *Resolves normally, with `response.ok` set to false
- Throws a syntax error
- Retries automatically
> `fetch` only rejects on network failure. Always check `response.ok` yourself.

?  In what order does this print? `console.log("A"); setTimeout(() => console.log("B"), 0); console.log("C");`
- A B C
- B A C
- *A C B
- C A B
> The timer callback runs only after the current synchronous code finishes.

?tf Two `await` statements one after another run at the same time. | false
> They run in sequence. Use `Promise.all` to run independent jobs in parallel.
:::

::: pitfall Common mistakes in advanced JavaScript
- **Forgetting `await`**, then using a promise as if it were its value.
- **Assuming `fetch` rejects on HTTP errors.** Check `response.ok`.
- **Using `await` in a loop** over independent jobs, making everything slow. Use `Promise.all`.
- **Swallowing errors** with empty `catch` blocks.
- **Losing `this`** when passing a method as a callback.
- **Mutating shared objects** when you meant to copy (use spread).
- **Using `||` for defaults** when `0` or an empty string are valid values. Use `??`.
:::

::: recap
- A closure is a function carrying the variables from where it was created. It gives you private state.
- Classes create objects with a shared blueprint. `extends` inherits, `#field` is private, and `this` depends on the call.
- Modules (`import`/`export`) give each file its own scope.
- JavaScript is single-threaded and uses the event loop to handle waiting jobs. Promises and `async`/`await` make that readable.
- `fetch` returns a promise, does not reject on HTTP errors, and speaks JSON.
- Use `Promise.all` for parallel work and handle errors where you can act on them.
- Optional chaining, `??`, destructuring and spread make modern code shorter and safer.
- TypeScript adds checked types on top of JavaScript.
:::

::: quiz test Module test: Advanced JavaScript
?  What will this print? `const f = () => { let n = 0; return () => ++n; }; const c = f(); c(); console.log(c());`
- 0
- 1
- *2
- undefined
> The inner function keeps its own `n`. The first call makes it 1 and the second makes it 2.

?  Which keyword creates an instance of a class?
- `create`
- `make`
- *`new`
- `class`
> `new Account("Ada")` runs the constructor and returns a new instance.

?  What does `user?.address?.city` return when `user.address` is `null`?
- It throws a TypeError
- *`undefined`
- `null`
- An empty string
> Optional chaining stops at the first null or undefined and gives `undefined`.

?  What does `0 ?? 10` evaluate to?
- 10
- *0
- null
- undefined
> `??` only replaces `null` and `undefined`. Zero is a valid value, so it stays.

?  Which is the correct way to wait for two independent promises at the same time?
- `await a; await b;`
- *`await Promise.all([a, b])`
- `a.then(b)`
- `Promise.wait(a, b)`
> `Promise.all` starts both together and finishes when both have finished.

?  Inside an `async` function, what is the effect of `await somePromise`?
- It freezes the whole browser tab until the promise settles
- *It pauses that function until the promise settles, while the rest of the page keeps working
- It cancels the promise
- It converts the promise to a callback
> `await` only suspends the async function, not the event loop.

?  What is the output of `console.log("1"); Promise.resolve().then(() => console.log("2")); console.log("3");`?
- 1 2 3
- *1 3 2
- 2 1 3
- 3 2 1
> The `.then` callback is queued and runs after the synchronous code has finished.

?tf `JSON.parse("{ name: 'Ada' }")` works because it is valid JavaScript. | false
> JSON requires double-quoted keys and strings. That text is a valid JavaScript object literal but is not valid JSON, and `JSON.parse` throws.

?tf A `#private` class field can be read from outside the class. | false
> Private fields are only accessible inside the class body.

?short Which method turns a JavaScript value into JSON text? Type the full call without arguments, such as `JSON.something`. | JSON.stringify
> `JSON.stringify` serializes a value into text. `JSON.parse` reverses it.

?multi Which of these are true about `export` and `import`? Select all that apply.
- *A module can have one default export
- *A module's variables are private unless exported
- *In a page, you load a module with `type="module"`
- Every variable is automatically global
> Modules isolate their scope. Nothing is global unless you attach it deliberately.
:::
