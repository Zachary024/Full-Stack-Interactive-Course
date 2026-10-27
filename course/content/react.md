---
id: react
number: 10
title: React: Building User Interfaces
track: Front-end frameworks
duration: 190 min
level: Intermediate
summary: Components, JSX, props, state, effects and hooks. Think in components and build interfaces that update themselves.
---

::: objectives
- Explain why frameworks like React exist and what problem they solve.
- Break a screen into components and pass data down with props.
- Keep changing data in state with `useState`, and update it immutably.
- Render lists and conditional content, and build controlled forms.
- Run side effects such as data fetching with `useEffect`.
- Lift state up, write a reducer, and extract a custom hook.
- Create a React project with Vite and know the next steps.
:::

::: prereq
Advanced JavaScript (modules, arrow functions, destructuring, spread, promises). React is "just JavaScript", so the stronger your JavaScript, the easier React becomes.
:::

## Why a framework?

In the JavaScript module you updated the page by hand: find an element, change its text, create an item. That works for a counter. For an application with hundreds of elements that depend on shared data (a shopping cart, a notifications badge, a list and its filters), manual updates become a tangle. You forget to update one place, and the screen disagrees with the data.

React changes the question. Instead of "how do I change the page?", you describe **what the page should look like for the current data**, and React works out the changes.

::: plain
Imagine a whiteboard menu in a cafe. The manual way: whenever the price of tea changes, you walk to the board, find the line, rub it out and write the new price. With React, you maintain the price list, and a helper redraws the board from it every time. You never touch the board directly.
:::

::: figure flow The React idea: the screen is a function of the data
Data (state) | what the app knows -> *Component | a function that describes the screen -> UI | what the user sees -> Event | click, type, submit -> Data (state) | updated, so the screen is redrawn
:::

React is a library for building UIs from **components**. It does not decide how you route pages or talk to servers, so you add other tools for that. Vue (the next module) and Angular, Svelte and Solid share the same core idea. If you understand one, the others come quickly.

## Components

A **component** is a reusable piece of UI, written as a JavaScript function that returns a description of what to show. You build apps by nesting small components inside larger ones.

::: figure tree A screen as a tree of components
App
  Header
    Logo
    NavMenu
  ProductList
    ProductCard
    ProductCard
    ProductCard
  Footer
:::

Think of a web shop page. `ProductCard` is written **once** and used for every product. Fix a bug or restyle it in one place, and every card changes.

## JSX

React components return **JSX**, a syntax that looks like HTML inside JavaScript.

```jsx
function Welcome() {
  const name = "Ada";
  return (
    <section className="welcome">
      <h1>Hello, {name}!</h1>
      <p>Today is {new Date().toDateString()}.</p>
    </section>
  );
}
```

JSX is not HTML. A build tool converts it to ordinary JavaScript function calls. The differences you must remember:

| In HTML | In JSX | Why |
|---|---|---|
| `class="x"` | `className="x"` | `class` is a reserved word in JavaScript |
| `for="id"` | `htmlFor="id"` | Same reason |
| `<br>`, `<img ...>` | `<br />`, `<img ... />` | Every tag must be closed |
| `style="color: red"` | `style={{ color: "red" }}` | Style is a JavaScript object |
| `onclick="..."` | `onClick={handler}` | camelCase names, and you pass a function |
| Several top-level tags | Wrap in one parent, or `<>...</>` | A component returns a single root |

Curly braces `{ }` mean "JavaScript goes here". Any **expression** works inside them: a variable, a calculation, a function call or a ternary. Statements such as `if` or `for` do not.

::: pitfall Components start with a capital letter
`<Welcome />` is a component. `<welcome />` is treated as an HTML tag that does not exist. Always name components in PascalCase.
:::

## Props: passing data down

**Props** (properties) are the inputs to a component, like function arguments. A parent passes them as attributes, and the child receives them as an object.

```jsx
function ProductCard({ name, price, inStock }) {
  return (
    <article className="card">
      <h2>{name}</h2>
      <p>${price.toFixed(2)}</p>
      {inStock ? <button>Add to cart</button> : <p>Sold out</p>}
    </article>
  );
}

function Shop() {
  return (
    <main>
      <ProductCard name="Notebook" price={4.5} inStock={true} />
      <ProductCard name="Pen" price={1.2} inStock={false} />
    </main>
  );
}
```

Strings are passed in quotes. Everything else (numbers, booleans, objects, functions) goes in braces.

::: best Props are read-only
A component must never change its own props. Data flows **one way**: from parent down to child. If a child needs to ask for a change, the parent passes it a function (a callback prop) to call. This one-way flow makes React apps predictable.
:::

## State: data that changes

Props come from outside. **State** is data a component owns and can change over time. When state changes, React **re-renders** the component: it calls the function again with the new values and updates the screen.

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

`useState(0)` returns a pair: the current value and a function to change it. Notice you never write `count = count + 1`. Changing the variable directly does nothing, because React would not know. You must call the setter.

::: stepper What happens when you click
1. **The click handler runs.** `setCount(count + 1)` is called. If `count` was 0, it asks for 1.
2. **React schedules a re-render.** It remembers the new value of `count`.
3. **React calls `Counter()` again.** This time `useState` returns 1, so the JSX describes "You clicked 1 times".
4. **React compares the new description with the old one.** It sees only the text changed.
5. **React updates just that text in the real DOM.** The rest of the page is untouched, which is why it is fast.
:::

### Update state without mutating it

For objects and arrays, create a **new** value instead of changing the old one. React detects changes by checking whether the value is a different object.

```jsx
const [todos, setTodos] = useState([]);

// add: a new array with the old items plus one more
setTodos([...todos, { id: 1, text: "Learn React", done: false }]);

// remove: filter makes a new array
setTodos(todos.filter((t) => t.id !== 1));

// change one item: map makes a new array, and the changed item is a new object
setTodos(todos.map((t) => (t.id === 1 ? { ...t, done: !t.done } : t)));
```

Never use `todos.push(...)`, `todos[0].done = true` or `todos.sort()` on state. They change the existing object in place, so React sees nothing new.

::: challenge toggle Update a list immutably
React state updates must create new arrays and objects. Write `toggleTodo(todos, id)` which returns a **new** array in which the todo with that `id` has its `done` flag flipped. Other todos stay the same. The original array and its objects must not be changed.

Hint: Use `todos.map(...)`. For the matching todo return `{ ...todo, done: !todo.done }`, and for the others return the todo unchanged.
Hint: `todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))`
```js starter
function toggleTodo(todos, id) {
  // your code here
}
```
```js tests
const base = () => [{ id: 1, text: 'a', done: false }, { id: 2, text: 'b', done: true }];
test('flips the matching todo', () => assert.equal(toggleTodo(base(), 1)[0].done, true));
test('flips back', () => assert.equal(toggleTodo(base(), 2)[1].done, false));
test('others unchanged', () => assert.deepEqual(toggleTodo(base(), 1)[1], { id: 2, text: 'b', done: true }));
test('returns a new array', () => { const a = base(); assert(toggleTodo(a, 1) !== a, 'must return a new array'); });
test('does not mutate', () => { const a = base(); toggleTodo(a, 1); assert.equal(a[0].done, false); });
test('unknown id', () => assert.deepEqual(toggleTodo(base(), 99), base()));
```
```js solution
function toggleTodo(todos, id) {
  return todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}
```
:::

::: quiz check Checkpoint: components, props and state
?  How does a parent give data to a child component?
- By editing the child's variables
- *Through props
- Through global variables only
- With `document.querySelector`
> Props are the inputs to a component. Data flows down from the parent.

?  Why does `count = count + 1` not update the screen?
- Because count is a constant
- *React does not know the value changed. You must call the setter from `useState`
- Because JSX is not JavaScript
- It does, but slowly
> Calling the setter tells React to re-render with the new value.

?tf In JSX you write `class="card"` to give an element a CSS class. | false
> JSX uses `className` because `class` is a reserved word in JavaScript.
:::

## Lists, keys and conditions

Render a list by mapping an array to JSX. Each item needs a stable, unique **`key`** so that React can tell the items apart when the list changes.

```jsx
function TodoList({ todos }) {
  if (todos.length === 0) {
    return <p>Nothing to do. Enjoy the day.</p>;     // conditional rendering
  }
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id} className={todo.done ? "done" : ""}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}
```

Patterns for showing things conditionally:

| Pattern | Use for |
|---|---|
| `if (...) return <A />;` | Showing a completely different result (loading, empty, error) |
| `cond ? <A /> : <B />` | Choosing between two things inside JSX |
| `cond && <A />` | Showing something or nothing |

::: pitfall Keys
Use a unique id from your data as the key. Do not use the array index when items can be added, removed or reordered, because React then mixes up which item is which (state and input text jump to the wrong rows). And beware: `count && <A />` renders a literal `0` when `count` is 0. Write `count > 0 && <A />`.
:::

## Forms: controlled inputs

In a **controlled input**, React state is the single source of truth for what is in the box.

```jsx
function AddTodo({ onAdd }) {
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="todo">New task</label>
      <input id="todo" value={text} onChange={(e) => setText(e.target.value)} />
      <button>Add</button>
    </form>
  );
}
```

Every keystroke calls `onChange`, which updates state, which re-renders the input with the new value. It feels like extra work, but you can validate, format or disable the button at any moment because you always know the value.

## Lifting state up

When two components need the same data, move the state to their **closest common parent** and pass it down. The children use props to read it and callbacks to request changes.

::: figure sequence Lifting state: the parent owns the todos
App | AddTodo | TodoList
AddTodo -> App: onAdd("Buy milk") callback
App -> App: setTodos([...todos, newTodo])
App --> TodoList: renders again with todos as a prop
App --> AddTodo: renders again with the cleared form
:::

```jsx
function App() {
  const [todos, setTodos] = useState([]);

  function addTodo(text) {
    setTodos([...todos, { id: Date.now(), text, done: false }]);
  }

  return (
    <>
      <AddTodo onAdd={addTodo} />
      <TodoList todos={todos} />
    </>
  );
}
```

## Effects: talking to the outside world

Rendering must be a pure calculation: the same props and state always give the same JSX. Anything else is a **side effect**: fetching data, starting a timer, changing the page title, subscribing to an event. These belong in `useEffect`, which runs **after** the component has appeared on screen.

```jsx
import { useState, useEffect } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        if (!cancelled) setUser(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    }
    load();

    return () => { cancelled = true; };   // cleanup when userId changes or the component leaves
  }, [userId]);                           // the dependency array

  if (error) return <p role="alert">Could not load: {error}</p>;
  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
```

The **dependency array** at the end controls when the effect runs again:

| Array | The effect runs |
|---|---|
| `[]` | Once, after the first render |
| `[userId]` | After the first render, and whenever `userId` changes |
| none at all | After every render (rarely what you want) |

::: pitfall Effects that run forever
Updating state inside an effect with no dependency array creates an endless loop: the state changes, so it re-renders, so the effect runs, and it changes state again. Always list what the effect uses. Also: if you only need to calculate something from props or state, do it during rendering, not in an effect.
:::

Three states appear in nearly every data-loading component: **loading**, **error** and **success**. Always design all three. Users meet the first two more often than developers expect.

## Reducers and custom hooks

When a component has many related state changes, a **reducer** collects all the rules in one pure function: `(state, action) => newState`. It is just JavaScript, which makes it easy to test.

```jsx
import { useReducer } from "react";

function todoReducer(state, action) {
  switch (action.type) {
    case "add":
      return [...state, { id: action.id, text: action.text, done: false }];
    case "toggle":
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "remove":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

function App() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  return <button onClick={() => dispatch({ type: "add", id: 1, text: "Hi" })}>Add</button>;
}
```

::: challenge reducer Write a cart reducer
Write `cartReducer(state, action)`. State is an array of `{ id, qty }`. Support these actions:
- `{ type: 'add', id }`: if the item is in the cart increase its `qty` by 1, otherwise add `{ id, qty: 1 }`.
- `{ type: 'remove', id }`: remove the item completely.
- `{ type: 'clear' }`: return an empty array.
For an unknown action return the state unchanged. Never modify the old state.

Hint: Use `state.some(...)` or `find` to check whether the item exists, then `map` or spread to build the new array.
Hint: For `add` when it exists: `state.map((i) => (i.id === action.id ? { ...i, qty: i.qty + 1 } : i))`.
```js starter
function cartReducer(state, action) {
  // your code here
}
```
```js tests
test('adds a new item', () => assert.deepEqual(cartReducer([], { type: 'add', id: 'a' }), [{ id: 'a', qty: 1 }]));
test('increases quantity', () => assert.deepEqual(cartReducer([{ id: 'a', qty: 1 }], { type: 'add', id: 'a' }), [{ id: 'a', qty: 2 }]));
test('adds a second kind', () => assert.equal(cartReducer([{ id: 'a', qty: 1 }], { type: 'add', id: 'b' }).length, 2));
test('removes', () => assert.deepEqual(cartReducer([{ id: 'a', qty: 3 }, { id: 'b', qty: 1 }], { type: 'remove', id: 'a' }), [{ id: 'b', qty: 1 }]));
test('clears', () => assert.deepEqual(cartReducer([{ id: 'a', qty: 3 }], { type: 'clear' }), []));
test('unknown action', () => { const s = [{ id: 'a', qty: 1 }]; assert.equal(cartReducer(s, { type: 'zzz' }), s); });
test('does not mutate', () => { const s = [{ id: 'a', qty: 1 }]; cartReducer(s, { type: 'add', id: 'a' }); assert.equal(s[0].qty, 1); });
```
```js solution
function cartReducer(state, action) {
  switch (action.type) {
    case 'add':
      if (state.some((i) => i.id === action.id)) {
        return state.map((i) => (i.id === action.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...state, { id: action.id, qty: 1 }];
    case 'remove':
      return state.filter((i) => i.id !== action.id);
    case 'clear':
      return [];
    default:
      return state;
  }
}
```
:::

A **custom hook** is a function whose name starts with `use` and that calls other hooks. It lets you share stateful logic between components.

```jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

// use it exactly like useState, but the value survives a reload
const [theme, setTheme] = useLocalStorage("theme", "light");
```

::: note The rules of hooks
Call hooks only at the top level of a component or another hook: never inside `if`, loops or nested functions. React identifies each hook by the order of the calls, so the order must be the same every render.
:::

## Starting a real project

You do not set up React by hand. Use **Vite**, a fast build tool:

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

The dev server shows your app at `http://localhost:5173` and updates instantly as you save. Source files live in `src/`, and `src/main.jsx` mounts your `App` component into the page.

What to learn after the basics:

| Need | Common choice |
|---|---|
| Multiple pages | React Router |
| Data fetching and caching | TanStack Query |
| Global state shared widely | Context, Zustand or Redux Toolkit |
| Full framework with server rendering | Next.js |
| Types | TypeScript |
| Testing | Vitest and React Testing Library |

::: lab Lab: build a notes app
Create a Vite React project and build a small notes app.
1. Create components `App`, `NoteForm`, `NoteList` and `NoteItem`. Sketch the component tree on paper first.
2. Keep the notes in state in `App`, using `useReducer` and the pure reducer idea from the challenge. Actions: add, delete, toggle pinned.
3. `NoteForm` is a controlled form with a title and text, and validates that the title is not empty.
4. `NoteList` renders items with proper keys, and shows a friendly message when empty.
5. Persist the notes with the `useLocalStorage` hook above.
6. Add a search box that filters the displayed notes **without** changing the stored ones (calculate the filtered list while rendering).
7. Load a few starter notes from a JSON file or an API with `useEffect`, showing loading and error states.
8. Make sure everything works by keyboard only, every input has a label and the layout fits a phone. Write the reducer tests as plain assertions.
:::

::: pitfall Common React mistakes
- **Mutating state** (`push`, assigning to properties). Always create new arrays and objects.
- **Missing `key`** on list items, or using the index as a key in dynamic lists.
- **Calling the handler instead of passing it**: `onClick={doIt()}` runs immediately. Write `onClick={doIt}` or `onClick={() => doIt(5)}`.
- **Fetching data in the render body** instead of in `useEffect`.
- **Forgetting the dependency array**, creating infinite loops.
- **Storing derived data in state.** If you can calculate it from other state (a filtered list, a total), calculate it during render.
- **Putting all state at the top** or **duplicating state** in several places. Keep state as low as possible, and lift it only as far as needed.
:::

::: recap
- React describes the UI as a function of data. You change state, and React updates the screen.
- A component is a function returning JSX. Names are capitalised, and there is one root.
- Props flow down and are read-only. Callbacks flow up.
- `useState` holds changing data. Never mutate it: create new arrays and objects.
- Lists need stable `key`s. Conditions use `if`, ternaries and `&&`.
- Controlled inputs keep the value in state.
- `useEffect` handles side effects. Its dependency array decides when it runs, and its cleanup undoes it.
- Reducers and custom hooks organise growing logic. Start projects with Vite.
:::

::: quiz test Module test: React
?  What is JSX?
- A new programming language that replaces JavaScript
- *A syntax extension that lets you write HTML-like markup inside JavaScript
- A CSS framework
- A database format
> JSX is converted by a build tool into normal JavaScript calls.

?  What is the difference between props and state?
- There is none
- *Props are inputs given by the parent. State is data a component owns and changes
- Props can be changed by the child, state cannot
- State is only for forms
> Props flow down and are read-only. State belongs to the component and triggers re-rendering when it changes.

?  What will happen after `const [n, setN] = useState(0); setN(5);`?
- `n` is immediately 5 in the same function call
- *React re-renders, and on the next render `n` is 5
- Nothing, because setN needs a second argument
- The page reloads
> State updates are applied on the next render. The `n` in the current function call does not change.

?  Which code correctly adds an item to an array held in state?
- `todos.push(item)`
- `todos[todos.length] = item`
- *`setTodos([...todos, item])`
- `todos = todos + item`
> It creates a new array. Mutating the old one leaves React unaware of the change.

?  What does the dependency array `[]` mean in `useEffect(fn, [])`?
- Run after every render
- *Run once, after the first render
- Never run
- Run before rendering
> An empty array means the effect depends on nothing, so it only runs once (plus cleanup on unmount).

?  Why do list items need a `key`?
- To style them
- *So React can identify which items changed, were added or removed
- To sort them
- It is only a convention with no effect
> Stable keys let React keep the right component state attached to the right item.

?  What is wrong with `<button onClick={handleClick()}>`?
- Nothing
- *The function is called during rendering instead of when the button is clicked
- You must use `onclick`
- Buttons cannot have handlers
> Pass the function itself: `onClick={handleClick}`. Adding parentheses calls it immediately.

?tf A React component's props can be changed by the component that receives them. | false
> Props are read-only. Only the owner of the data (the parent) may change it, through state.

?tf Hooks like `useState` may be called inside an `if` statement. | false
> Hooks must be called in the same order on every render, so never inside conditions or loops.

?short Which hook runs side effects, such as fetching data, after rendering? Type its name. | useEffect
> `useEffect` runs after the component appears on screen and can clean up after itself.

?multi Which of these are side effects that belong in `useEffect`? Select all that apply.
- *Fetching data from an API
- *Starting a timer with `setInterval`
- *Subscribing to a window event
- Calculating a total from props
> A total can be computed during render. The other three affect things outside the component and belong in effects.

?order Put these steps in the order that React performs them after a click that calls a setter.
1. The setter is called with a new value
2. React calls the component function again
3. React compares the new JSX with the old
4. React updates only the changed parts of the DOM
> Re-render, diff, and then apply the minimal updates.
:::
