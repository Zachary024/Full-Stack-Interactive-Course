::: project habit-tracker Habit tracker in React
Time: 4-5 hours
Level: Intermediate
Skills: components, props, state, effects, lists and keys, lifting state

Build a habit tracker. Users add habits such as "Read 20 pages" and tick off each day of the current week. The app shows the current streak for every habit and remembers everything between visits. It is small enough to finish in an afternoon and uses every core idea from this module.

Requirements:
- The app is built with at least four components: `App`, `AddHabitForm`, `HabitList` and `HabitRow`. Each has a single clear job.
- All habits live in one `useState` array in `App`. Child components receive data and callbacks through props and never change the array directly.
- Each habit is an object with an id, name and an array of date strings for the days it was completed.
- `HabitRow` shows seven buttons, one for each day of the current week. Clicking a day toggles it, and the button's `aria-pressed` and visible style reflect the state.
- Each habit shows its current streak (consecutive days up to today) and the total number done this week. These are calculated from the data and never stored.
- Users can add a habit with a controlled form input, reject empty names and duplicates (ignoring case), and delete a habit.
- Lists use stable `key` props based on the habit id, not the array index.
- A `useEffect` saves the habits to `localStorage` whenever they change, and the initial state is loaded lazily from storage.
- A summary at the top says how many habits were completed today, for example "2 of 4 done today".
- No state mutation anywhere: updates use `map`, `filter` and spread syntax.

Steps:
1. Create the project with Vite (`npm create vite@latest`) and choose the React template.
2. Design the data: write one example habit object and decide the date format (use `YYYY-MM-DD`).
3. Build `HabitRow` with fake data and no interactivity, so you can see the layout.
4. Add the state to `App` and pass the toggle callback down. Make the day buttons work.
5. Write a pure `streak(dates, today)` function in its own file and test it by hand with a few arrays.
6. Add the form, delete, the summary, and finally persistence with `useEffect`.
7. Open the React developer tools, and confirm that typing in the form does not re-render the rows unnecessarily.

Starter:
```jsx nocheck
import { useState, useEffect } from "react";

function loadHabits() {
  try {
    return JSON.parse(localStorage.getItem("habits")) ?? [];
  } catch {
    return [];
  }
}

export default function App() {
  const [habits, setHabits] = useState(loadHabits);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  function toggleDay(id, date) {
    // TODO: return a NEW array where the matching habit has the date added or removed
  }

  return (
    <main>
      <h1>Habits</h1>
      {/* TODO: summary, AddHabitForm, HabitList */}
    </main>
  );
}
```
```javascript nocheck
// streak.js
// Count consecutive completed days ending today (or yesterday, if today is not done yet).
export function streak(dates, today = new Date()) {
  // TODO
  return 0;
}
```

Hints:
- Use `toISOString().slice(0, 10)` to turn a date into a `YYYY-MM-DD` string. Be aware that it uses UTC, so for local dates build the string from `getFullYear`, `getMonth` and `getDate`.
- To toggle a value in an array without changing it: check `includes`, then return either `filter` or `[...old, value]`.
- If a click does nothing, check that you returned the new array from the `map` callback.
- Keep derived values (streaks, totals) out of state. Calculate them while rendering.

Stretch:
- Add a custom hook `useLocalStorage(key, initial)` and use it instead of the manual effect.
- Add a chart of the last 28 days for each habit.
- Let users choose which days of the week a habit applies to.

Deliver:
- The project folder (without `node_modules`) or a link to the repository.
- A short note describing which component owns which piece of state and why.

Rubric:
- Component design | Components are small, props flow down, events flow up and state lives in the right place.
- Correct React | No direct mutation, stable keys, effects with the right dependencies and lazy initial state.
- Behaviour | Streaks and totals are correct, including the edge cases of an empty list and a gap in the days.
- Usability | The app is keyboard accessible, buttons announce their pressed state and the layout works on a phone.
:::
