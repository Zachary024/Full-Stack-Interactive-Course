::: project notes-app Notes app in Vue
Time: 4-5 hours
Level: Intermediate
Skills: single-file components, reactivity, v-model, computed values, props and emits, routing

Build a notes application in Vue. Users can create notes with a title, body and colour tag, search them as they type, pin the important ones, and open a single note on its own page with its own address. It teaches the Vue way of thinking: declare what the screen should look like for the current data, and let the framework keep it up to date.

Requirements:
- Built with Vite and Vue 3 using the Composition API and `<script setup>` single-file components.
- At least four components: `App`, `NoteList`, `NoteCard` and `NoteEditor`. Data goes down through props and changes come back up through emitted events.
- Notes are stored in a `ref` array (or a small store). Each note has an id, title, body, colour, pinned flag and updated time.
- `NoteEditor` uses `v-model` for the title and body, validates that the title is not empty, and can create or edit a note.
- A search box filters the notes by title and body as the user types, using a `computed` value. Pinned notes always appear first in the filtered list.
- A count shows "N notes" or "No notes match" using `v-if` and `v-else`.
- Colour tags are chosen from a fixed list, and the card style changes with a bound class.
- Vue Router provides two routes: the list at `/` and a single note at `/notes/:id`. An unknown id shows a friendly not-found view.
- Notes are saved to `localStorage` using a `watch` with `deep: true`, and loaded at start-up.
- Deleting a note asks for confirmation inside the page (a small dialog or a two-step button), not with `alert`.

Steps:
1. Create the app with `npm create vue@latest`, and select Vue Router.
2. Define the note shape and write the sample data by hand to see the layout.
3. Build `NoteCard` with props only and render it from `NoteList` using `v-for` with a key.
4. Build the editor with `v-model` and emit a `save` event. Handle it in `App`.
5. Add the computed filtered list, the search field and pinning.
6. Add routing, then persistence with `watch`.
7. Try the not-found route and a reload on `/notes/3` to check that the page survives a refresh.

Starter:
```vue nocheck
<script setup>
import { ref, computed, watch } from "vue";

const notes = ref(JSON.parse(localStorage.getItem("notes") || "[]"));
const query = ref("");

const visible = computed(() => {
  const q = query.value.trim().toLowerCase();
  // TODO: filter by title and body, then put pinned notes first
  return notes.value;
});

watch(notes, (value) => {
  localStorage.setItem("notes", JSON.stringify(value));
}, { deep: true });
</script>

<template>
  <main>
    <h1>Notes</h1>
    <label for="q">Search</label>
    <input id="q" v-model="query" type="search" />
    <p v-if="visible.length === 0">No notes match.</p>
    <!-- TODO: NoteList and NoteEditor -->
  </main>
</template>
```

Hints:
- Create ids with `crypto.randomUUID()` or `Date.now()`.
- To avoid changing a prop, copy the note into a local `ref` inside the editor and emit the edited copy on save.
- Sort a copy: `[...list].sort(...)`, because sorting a reactive array in place changes the original.
- Use `useRoute()` to read `route.params.id`, and `router.push` to navigate after saving.

Stretch:
- Add tags and filter by tag.
- Add a dark theme toggle that remembers its setting.
- Move the notes into a Pinia store and compare how the components change.

Deliver:
- The project folder (without `node_modules`) or a link to the repository.
- A paragraph explaining one thing that is easier in Vue than in plain JavaScript, and one thing that is not.

Rubric:
- Component design | Props down and events up are respected, and no child changes its parent's data directly.
- Reactivity | Derived data uses computed, side effects use watch and nothing is duplicated in state.
- Routing | Both routes work, including a direct visit or reload, and bad ids are handled.
- Polish | Validation messages, confirmation before delete and a layout that suits phones and desktops.
:::
