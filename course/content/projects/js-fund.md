::: project todo-app A to-do list that remembers
Time: 3-4 hours
Level: Beginner
Skills: DOM, events, arrays and objects, functions, localStorage

Build a to-do list in the browser with plain JavaScript. It must feel like a real app: you can add, complete and delete tasks, filter them, and when you close the tab and come back your tasks are still there.

Requirements:
- A form with a labelled text input and an Add button. Pressing Enter in the field also adds the task.
- Empty or whitespace-only tasks are rejected with a visible message (not an alert box).
- Each task shows its text, a checkbox to mark it done (with a line through completed text) and a button to delete it.
- Tasks are stored in an array of objects, each with an id, text and done flag. The page is drawn from this array by a single `render()` function.
- Three filter buttons (All, Active, Done) show the matching tasks, and the current filter is clear to the user.
- A counter shows how many tasks are still active, for example "3 items left".
- A "Clear completed" button removes all done tasks.
- Tasks and the chosen filter are saved in `localStorage` and restored when the page loads. Corrupt saved data must not break the page.
- An empty state message is shown when there is nothing to display.
- Every control works with the keyboard and has an accessible name. Text typed by users is never inserted with `innerHTML`.

Steps:
1. Build the static HTML and make sure you can read it in the browser.
2. Create the `tasks` array and a `render()` function that rebuilds the list from it.
3. Add the form submit handler and make adding work.
4. Use event delegation on the list to handle the checkbox and delete clicks.
5. Add the filters and the counter inside `render()`.
6. Add `save()` and `load()` with `JSON.stringify` and `JSON.parse` inside a try and catch.
7. Test the odd cases: empty input, a very long task, a task containing angle brackets, and clearing storage.

Starter:
```html
<main>
  <h1>To-do</h1>
  <form id="form">
    <label for="newTask">New task</label>
    <input id="newTask" autocomplete="off">
    <button>Add</button>
    <p id="msg" role="alert"></p>
  </form>
  <ul id="list"></ul>
  <p id="count"></p>
</main>
<script src="app.js"></script>
```
```javascript
const STORAGE_KEY = "todo-v1";
let tasks = load();
let filter = "all";

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  // TODO: build the list, apply the filter, update the counter
}

// TODO: submit handler, list click handler, filter buttons
render();
```

Hints:
- Create elements with `document.createElement` and set `textContent`, which keeps user text safe.
- Give each task an id with `Date.now()` and find tasks by id, not by their position in the list.
- Call `save()` at the end of every function that changes `tasks`.
- To check whether event delegation works, click the checkbox of a task that was added after the page loaded.

Stretch:
- Let users edit a task by double-clicking it.
- Add drag and drop (or up and down buttons) to reorder tasks.
- Add due dates and sort by them.

Deliver:
- The HTML, CSS and JavaScript files.
- A short list of the edge cases you tested and what happened.

Rubric:
- Functionality | Every requirement works, including persistence after a reload.
- Code design | State lives in one array and the screen is always drawn from it, with no duplicate sources of truth.
- Safety | User text never goes through innerHTML, and bad saved data is handled.
- Usability | The app is fully keyboard-operable, gives clear feedback and works on a phone.
:::
