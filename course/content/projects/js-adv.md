::: project profile-finder GitHub profile finder
Time: 3-4 hours
Level: Intermediate
Skills: fetch, promises and async/await, error handling, modules, debouncing

Build a small search tool that looks up a GitHub user and shows their avatar, name, bio, follower count and most recent repositories. It uses the public GitHub API, which needs no key. The goal is to handle everything that can go wrong with a network request: loading, success, not found, rate limiting and no connection.

Requirements:
- A labelled search field and button. Submitting with Enter works, and empty input is rejected with a message.
- The data is fetched from `https://api.github.com/users/<name>` and the repositories from the `repos_url` in that response, using `fetch` with `async` and `await`.
- The interface has four visible states: idle, loading (with a text or spinner and `aria-busy`), success and error. Only one is shown at a time.
- A 404 shows "No user found for ...", a 403 or 429 explains that the rate limit has been reached, and a network failure shows a retry button.
- Check `response.ok` before reading the body. A failed request must never be shown as a success.
- Starting a new search cancels the previous request with `AbortController`, so an old slow answer can never overwrite a newer one.
- The code is split into at least two ES modules (for example `api.js` for network calls and `ui.js` for drawing), with exports and imports.
- Show the five most recently updated repositories, each with its name as a link, language and star count. All text from the API is inserted with `textContent` or a safe template, never raw HTML.
- Remember the last successful search in `localStorage` and load it when the page opens.

Steps:
1. Sketch the four states on paper and decide what the page looks like in each.
2. Write `api.js` with a `getUser(name, signal)` function that throws a custom error carrying the status code.
3. Write `ui.js` with `showLoading`, `showUser`, `showError` and `showIdle`.
4. Wire them together in `main.js`, with a `try`, `catch` and `finally` around the request.
5. Add the `AbortController` and test it by searching two names quickly one after the other.
6. Test the failures: a made-up user name, turning off the network in the developer tools, and (if you can) the rate limit.

Starter:
```javascript nocheck
// api.js
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function getUser(name, signal) {
  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(name)}`, { signal });
  if (!res.ok) {
    throw new ApiError("Request failed", res.status);
  }
  return res.json();
}

// TODO: getRepos(url, signal)

// ------------------------------------------------------------
// main.js (a second file)
import { getUser, ApiError } from "./api.js";

let controller = null;

async function search(name) {
  if (controller) controller.abort();
  controller = new AbortController();
  try {
    // TODO: show loading, call getUser, show the result
  } catch (err) {
    if (err.name === "AbortError") return; // a newer search replaced this one
    // TODO: show the right error message
  }
}
```

Hints:
- ES modules need `type="module"` on the script tag and must be served over http, not opened from the file system. Use a tiny local server.
- `encodeURIComponent` protects the URL if the user types strange characters.
- An aborted request rejects with an error named `AbortError`. That is not a real failure and should not show an error message.
- `finally` is a good place to turn off the loading state.

Stretch:
- Debounce the input so it searches 400 milliseconds after the user stops typing.
- Cache results in a `Map` so a repeat search is instant.
- Add keyboard focus management: after a search, move focus to the results heading.

Deliver:
- The project folder with the modules and HTML file.
- A table of the failure cases you tested and what the page showed.

Rubric:
- Error handling | Every failure path gives a clear message, and failed requests are never treated as success.
- Async correctness | Cancelled requests are ignored, and the loading state always turns off.
- Structure | Network code and drawing code are separate modules with small, named functions.
- Security | API data is never inserted as HTML, and user input is encoded in the URL.
:::
