---
id: vue
number: 11
title: Vue: The Progressive Framework
track: Front-end frameworks
duration: 150 min
level: Intermediate
summary: Single-file components, reactivity with ref and computed, directives, props and events, and how Vue compares with React.
---

::: objectives
- Describe how Vue's reactivity system keeps the page in sync with your data.
- Write single-file components with `<script setup>`, a template and scoped styles.
- Use `ref`, `computed` and `watch` correctly.
- Apply directives: `v-if`, `v-for`, `v-model`, `v-bind` and `v-on`.
- Pass data down with props and send messages up with emitted events.
- Compare Vue and React so you can pick one deliberately.
:::

::: prereq
Advanced JavaScript, and ideally the React module. Vue solves the same problem as React with a different feel, and the comparisons in this module build on what you already learned.
:::

## What is Vue?

**Vue** is a framework for building user interfaces. Like React, you describe the page as a function of your data and the framework updates the DOM. Unlike React, Vue notices **automatically** when your data changes, and it uses an HTML-like template syntax. Many beginners find Vue's learning curve gentler because familiar HTML, CSS and JavaScript each have their own clearly separated place.

::: figure flow How Vue keeps the page in sync
Reactive data | ref(0), reactive({}) -> *Vue tracks | which template parts read the data -> Data changes | count.value++ -> Only affected DOM updates | automatically
:::

::: plain
Think of a spreadsheet. If cell C1 is `=A1+B1`, you never tell C1 to recalculate. When you change A1 the spreadsheet knows which cells depend on it and updates them. Vue does that for your web page: the template is full of formulas, and changing a piece of data updates exactly the parts that use it.
:::

## Single-file components

Vue components live in `.vue` files with three sections. Each section has its own job.

::: figure blocks Anatomy of a single-file component
template | The HTML structure of the component ; script setup | The JavaScript: data and functions ; style scoped | The CSS, applied only to this component
:::

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);

function increment() {
  count.value++;
}
</script>

<template>
  <button @click="increment">You clicked {{ count }} times</button>
</template>

<style scoped>
button {
  padding: 8px 16px;
  border-radius: 8px;
}
</style>
```

Everything declared in `<script setup>` is automatically available in the template. Double curly braces `{{ }}` print the value of a JavaScript expression. `scoped` styles only affect this component, which prevents accidental clashes.

## Reactivity: `ref` and `computed`

### `ref`

A `ref` wraps a value in a **reactive** container. Read and write it through `.value` in JavaScript. In the template, Vue unwraps it for you, so you write just `count`.

```js
const name = ref("Ada");
name.value = "Grace";     // the page updates by itself
```

For an object with many properties, `reactive({ ... })` makes every property reactive, with no `.value`. Many developers simply use `ref` for everything, which keeps one consistent rule.

### `computed`

A **computed** value is derived from other reactive data. Vue caches it, and recalculates only when what it depends on changes. It is the right tool for anything you can calculate from other data.

```js
const price = ref(20);
const quantity = ref(3);
const total = computed(() => price.value * quantity.value);   // 60, always up to date
```

### `watch`

Use `watch` to run a **side effect** when data changes: saving to the server, logging, calling an API.

```js
watch(searchText, async (newValue, oldValue) => {
  results.value = await searchApi(newValue);
});
```

::: best computed or watch?
If you want a **new value** derived from other data, use `computed`. If you want to **do something** (a request, saving, logging) when data changes, use `watch`. Beginners often reach for `watch` and then set another ref inside it. That is almost always a sign that a `computed` was the right choice.
:::

To see the principle behind this magic, you will build a tiny reactive reference yourself.

::: challenge ref Build your own reactive ref
Write `createRef(initial)`. It returns an object with:
- a `value` property that reads and writes the current value, and
- a `watch(callback)` method that registers a callback. Whenever `value` is **set to a different value**, call every registered callback with `(newValue, oldValue)`. Setting the same value again must not call anything.

Hint: Keep `let current = initial` and an array `listeners` in the function. Define `value` with `get` and `set` in the returned object.
Hint: In `set value(v)`, return early if `v === current`. Otherwise save `old = current`, update `current`, and call each listener.
```js starter
function createRef(initial) {
  // your code here
}
```
```js tests
test('reads the initial value', () => assert.equal(createRef(5).value, 5));
test('writes a new value', () => { const r = createRef(1); r.value = 2; assert.equal(r.value, 2); });
test('calls watchers with new and old', () => {
  const r = createRef(1); const seen = [];
  r.watch((n, o) => seen.push([n, o]));
  r.value = 7;
  assert.deepEqual(seen, [[7, 1]]);
});
test('same value does not trigger', () => {
  const r = createRef(1); let calls = 0;
  r.watch(() => calls++);
  r.value = 1;
  assert.equal(calls, 0);
});
test('several watchers', () => {
  const r = createRef('a'); let n = 0;
  r.watch(() => n++); r.watch(() => n++);
  r.value = 'b';
  assert.equal(n, 2);
});
```
```js solution
function createRef(initial) {
  let current = initial;
  const listeners = [];
  return {
    get value() { return current; },
    set value(v) {
      if (v === current) return;
      const old = current;
      current = v;
      listeners.forEach((fn) => fn(v, old));
    },
    watch(fn) { listeners.push(fn); },
  };
}
```
:::

## Template directives

**Directives** are special attributes starting with `v-`. They are Vue's template vocabulary.

| Directive | Shorthand | Purpose | Example |
|---|---|---|---|
| `v-bind` | `:` | Bind an attribute to data | `<img :src="user.avatar" :alt="user.name">` |
| `v-on` | `@` | Listen to an event | `<button @click="save">` |
| `v-model` | | Two-way binding for form inputs | `<input v-model="name">` |
| `v-if` / `v-else` | | Add or remove from the DOM | `<p v-if="loading">Loading</p>` |
| `v-show` | | Toggle CSS `display` (the element stays in the DOM) | `<div v-show="open">` |
| `v-for` | | Repeat an element | `<li v-for="t in todos" :key="t.id">` |

```vue
<script setup>
import { ref, computed } from "vue";

const todos = ref([
  { id: 1, text: "Learn Vue", done: true },
  { id: 2, text: "Build an app", done: false },
]);
const newText = ref("");
const remaining = computed(() => todos.value.filter((t) => !t.done).length);

function addTodo() {
  const text = newText.value.trim();
  if (!text) return;
  todos.value.push({ id: Date.now(), text, done: false });
  newText.value = "";
}
</script>

<template>
  <form @submit.prevent="addTodo">
    <label for="new">New task</label>
    <input id="new" v-model="newText" />
    <button>Add</button>
  </form>

  <p>{{ remaining }} tasks left</p>

  <ul v-if="todos.length">
    <li v-for="todo in todos" :key="todo.id">
      <label>
        <input type="checkbox" v-model="todo.done" />
        <span :class="{ done: todo.done }">{{ todo.text }}</span>
      </label>
    </li>
  </ul>
  <p v-else>Nothing to do.</p>
</template>
```

Study this example. Everything in it is a directive from the table, plus `.prevent`, a **modifier** that calls `preventDefault()` for you. Notice `todos.value.push(...)`: unlike in React, **mutating is fine** in Vue, because Vue's reactivity system sees it.

::: pitfall Common template mistakes
- **Forgetting `:key` in `v-for`**, or using the index as a key in lists that change.
- **Writing `value="x"` instead of `:value="x"`**. Without the colon the attribute is the literal text `x`.
- **Using `v-if` and `v-for` on the same element.** Put the condition on a wrapper, or filter in a `computed`.
- **Forgetting `.value`** in `<script>` (but not in the template).
- **Putting heavy logic in the template.** Move it to a `computed` so it is cached and readable.
:::

::: quiz check Checkpoint: Vue basics
?  How do you read and change a `ref` named `count` inside `<script setup>`?
- `count`
- *`count.value`
- `count()`
- `this.count`
> In JavaScript you access a ref with `.value`. In the template Vue unwraps it automatically.

?  Which tool should you use to derive `total` from `price` and `quantity`?
- `watch`
- A plain function that you call by hand every time
- *`computed`
- `v-show`
> Computed values are derived, cached, and recalculated only when their dependencies change.

?tf In Vue, `todos.value.push(item)` does not trigger an update, so you must copy the array like in React. | false
> Vue's reactivity tracks mutations, so pushing to a reactive array updates the page.
:::

## Components, props and events

A real app is made of many components. The data rules are the same as in React:

- **Props** pass data **down** from parent to child. They are read-only for the child.
- **Events** send messages **up** from child to parent.

::: figure sequence Props down, events up
Parent | Child
Parent -> Child: prop: :title="product.name"
Child -> Parent: emit('add', product.id)
Parent -> Parent: updates the cart state
Parent --> Child: new props flow down
:::

```vue
<!-- ProductCard.vue -->
<script setup>
const props = defineProps({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
});
const emit = defineEmits(["add"]);
</script>

<template>
  <article class="card">
    <h2>{{ props.name }}</h2>
    <p>${{ props.price.toFixed(2) }}</p>
    <button @click="emit('add', props.name)">Add to cart</button>
  </article>
</template>
```

```vue
<!-- App.vue -->
<script setup>
import { ref } from "vue";
import ProductCard from "./ProductCard.vue";

const cart = ref([]);
</script>

<template>
  <ProductCard name="Notebook" :price="4.5" @add="(n) => cart.push(n)" />
  <p>Items in cart: {{ cart.length }}</p>
</template>
```

### Slots

A **slot** lets the parent put its own content inside a child component, which is useful for generic building blocks such as cards, dialogs and layouts.

```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <header><slot name="title">Default title</slot></header>
    <slot />   <!-- the main content goes here -->
  </div>
</template>

<!-- usage -->
<Card>
  <template #title>Welcome</template>
  <p>This paragraph fills the default slot.</p>
</Card>
```

## Lifecycle and loading data

Components have a lifecycle: they are created, mounted onto the page, updated and finally removed. Hooks let you run code at those moments. The most used is `onMounted`, perfect for the first data fetch.

```vue
<script setup>
import { ref, onMounted } from "vue";

const users = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const res = await fetch("/api/users");
    if (!res.ok) throw new Error("HTTP " + res.status);
    users.value = await res.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <p v-if="loading">Loading...</p>
  <p v-else-if="error" role="alert">Could not load: {{ error }}</p>
  <ul v-else>
    <li v-for="u in users" :key="u.id">{{ u.name }}</li>
  </ul>
</template>
```

As with React, always design the loading, error and success states.

### Reusable logic: composables

The Vue equivalent of a React custom hook is a **composable**: a function (named `useSomething`) that uses reactivity and returns what a component needs.

```js
// useCounter.js
import { ref, computed } from "vue";

export function useCounter(start = 0) {
  const count = ref(start);
  const double = computed(() => count.value * 2);
  const increment = () => count.value++;
  return { count, double, increment };
}
```

## Routing and state management

Official companions cover the rest of a real app:

| Need | Vue's answer |
|---|---|
| Pages without reloads | **Vue Router** (routes map URLs to components) |
| Shared state | **Pinia**, the official store |
| Project tooling | **Vite** (`npm create vue@latest`) |
| Full-stack and server rendering | **Nuxt** |
| Testing | Vitest and Vue Test Utils |

## Vue or React?

Both are excellent, widely used and in demand. The choice is mostly about preference and the job market in your area.

| | Vue | React |
|---|---|---|
| Template style | HTML-like templates with directives | JSX: JavaScript with markup inside |
| State changes | Mutate reactive data directly | Replace state with new values |
| Reactivity | Automatic dependency tracking | Re-runs the component and compares output |
| Official extras | Router and Pinia, maintained by the Vue team | Community choices (React Router, Redux, and others) |
| Learning curve | Gentler start | A smaller core, but more decisions |
| Ecosystem and jobs | Large, strong in parts of Europe and Asia | The largest, strong everywhere |

::: learn Do not marry a framework
The concepts you learned (components, props down and events up, state, effects, lists and keys, loading and error states) are identical across all modern frameworks. Learning a second one takes days, not months. Choose one for your first project and go deep.
:::

::: lab Lab: a recipe finder in Vue
Create a Vue project with `npm create vue@latest` (choose Vue Router and Pinia if asked) and build a small recipe app.
1. Create `RecipeCard.vue` with `name`, `time` and `tags` props, and an `add-favourite` event.
2. In `App.vue`, keep a list of recipes in a `ref` (hard-code six to start).
3. Add a search input with `v-model` and a `computed` that returns the filtered list.
4. Add a tag filter (a row of buttons that toggle `active`). Combine it with the text filter in the same `computed`.
5. Show a count ("5 recipes") and an empty-state message with `v-if`/`v-else`.
6. Keep favourites in a `ref` and save them to `localStorage` using a `watch`. Wrap this in a `useFavourites` composable.
7. Replace the hard-coded list with a `fetch` in `onMounted` from a JSON file or an API, with loading and error states.
8. Add a second page for recipe details with Vue Router, and make sure that every control works by keyboard.
:::

::: pitfall Common Vue mistakes
- **Replacing a reactive object** with a plain one and losing reactivity. Prefer `ref`, and assign through `.value`.
- **Destructuring a reactive object** (`const { count } = state`) which makes `count` a plain, non-reactive number. Use `toRefs` or keep the object.
- **Mutating a prop** inside the child. Emit an event instead.
- **Using `watch` where a `computed` belongs.**
- **Not cleaning up** timers and listeners when a component unmounts (use `onUnmounted`).
:::

::: recap
- Vue tracks which parts of the template use which data, and updates exactly those parts.
- A single-file component has a template, a script and scoped styles.
- `ref` holds reactive values (`.value` in JavaScript). `computed` derives values. `watch` runs side effects.
- Directives (`v-if`, `v-for`, `v-model`, `v-bind`/`:`, `v-on`/`@`) are the template vocabulary.
- Props flow down, emitted events flow up, and slots let parents supply content.
- Composables share reactive logic. Vue Router and Pinia cover routing and global state.
- The ideas transfer between frameworks, so pick one and go deep.
:::

::: quiz test Module test: Vue
?  What does the `@` symbol mean in `<button @click="save">`?
- Mention a user
- *It is shorthand for `v-on`, listening to an event
- It binds an attribute
- It imports a file
> `@click` is the same as `v-on:click`.

?  Which directive removes an element from the DOM when its condition is false?
- `v-show`
- *`v-if`
- `v-bind`
- `v-model`
> `v-if` adds or removes the element. `v-show` merely hides it with CSS.

?  What is `v-model` used for?
- Importing a model class
- *Two-way binding between a form input and data
- Styling
- Routing
> The input shows the data and updates it as the user types.

?  A child component wants to tell its parent that a button was clicked. What should it do?
- Change the prop directly
- *Emit an event with `emit`
- Use `document.querySelector` on the parent
- Nothing is possible
> Props flow down and events flow up.

?  What is the purpose of `:key` on a `v-for` element?
- To make it unique in CSS
- *To help Vue identify items when the list changes
- To encrypt the item
- It is required for styling
> Stable keys let Vue reuse and reorder elements correctly.

?  What is the output? `const a = ref(2); const b = computed(() => a.value * 3); a.value = 5; console.log(b.value);`
- 6
- *15
- 5
- undefined
> The computed value recalculates when its dependency changes: 5 times 3 is 15.

?  Which lifecycle hook is a good place for the first data fetch?
- `onUnmounted`
- *`onMounted`
- `computed`
- `defineProps`
> `onMounted` runs after the component first appears on the page.

?tf In Vue it is fine to mutate an array held in a `ref` with `push`. | true
> Vue's reactivity system detects mutations, unlike React where you replace the value.

?tf Writing `<img src="user.avatar">` binds the image to the `user.avatar` variable. | false
> Without a colon the attribute is the literal text. You need `:src="user.avatar"`.

?short What is the name of the official state management library for Vue? | Pinia
> Pinia is the official store, replacing the older Vuex.

?multi Which of these are true about `<style scoped>`? Select all that apply.
- *Styles apply only to this component
- *It helps avoid accidental style clashes
- *It is written inside the `.vue` file
- It makes every style global
> Scoped styles are local to the component by design.
:::
