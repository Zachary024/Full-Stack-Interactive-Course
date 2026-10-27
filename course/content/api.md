---
id: api
number: 15
title: API Design and Real-Time Communication
track: Back end
duration: 190 min
level: Intermediate
summary: Design clean REST APIs, document them with OpenAPI and Swagger, consume them with fetch and Axios, and add real-time features with WebSockets.
---

::: objectives
- Explain what an API is and what makes a REST API well designed.
- Choose URLs, methods and status codes for a resource.
- Add pagination, filtering, versioning and consistent error responses.
- Document an API with OpenAPI and explore it with Swagger UI.
- Call an API from code with `fetch` and Axios, and handle failures.
- Explain WebSockets and when to use them instead of normal requests.
:::

::: prereq
Back-End Development and Advanced JavaScript (promises and `async`/`await`).
:::

## What is an API?

An [[API|API]] (Application Programming Interface) is a **contract** that lets one program talk to another. A restaurant menu is a good model: it lists what you may ask for and what you will get, and you do not need to know how the kitchen works. In web development, "API" usually means a **web API**: a server that offers data and actions over HTTP, usually as JSON.

Your own front end will call your back-end API. Other developers may call it too, and so might phone apps and partner companies. That is why API design matters: **once other people depend on your API, you cannot change it freely.**

## REST: designing around resources

**REST** is a style for web APIs built around **resources** (things, such as users, orders and lessons) and the standard HTTP methods. The rules of thumb:

1. **URLs name things (nouns), not actions.** `/api/orders`, not `/api/getOrders`.
2. **The method says what to do.** GET reads, POST creates, PUT or PATCH changes, DELETE removes.
3. **Use plural nouns and nesting for relationships.** `/api/users/42/orders`.
4. **Use proper status codes** and send JSON.
5. **Be stateless.** Each request carries everything the server needs (such as a token). The server does not remember you between requests.

| Action | Request | Success response |
|---|---|---|
| List orders | `GET /api/orders` | `200` with an array |
| Read one | `GET /api/orders/42` | `200` with the order, or `404` |
| Create | `POST /api/orders` with a JSON body | `201` with the new order, and a `Location` header |
| Replace | `PUT /api/orders/42` with the full order | `200` |
| Change part | `PATCH /api/orders/42` with only the changed fields | `200` |
| Delete | `DELETE /api/orders/42` | `204` with no body |

::: figure sequence A complete CRUD conversation
Client | API
Client -> API: POST /api/todos {"title": "Milk"}
API --> Client: 201 Created {"id": 7, "title": "Milk"}
Client -> API: GET /api/todos/7
API --> Client: 200 OK {"id": 7, "done": false}
Client -> API: PATCH /api/todos/7 {"done": true}
API --> Client: 200 OK {"id": 7, "done": true}
Client -> API: DELETE /api/todos/7
API --> Client: 204 No Content
:::

### Safe and idempotent methods

An **[[Idempotent]]** operation gives the same result no matter how many times you repeat it. This matters, because networks fail and clients retry.

| Method | Safe (changes nothing) | Idempotent |
|---|---|---|
| GET | Yes | Yes |
| PUT | No | Yes (setting the same value twice leaves it set) |
| DELETE | No | Yes (deleting twice leaves it deleted) |
| POST | No | **No** (two identical POSTs create two things) |

::: pitfall Do not change data with GET
Browsers, caches and search crawlers freely call GET URLs, and prefetch links. A URL like `GET /api/deleteUser?id=5` can be triggered by a crawler or an image tag. Use `DELETE` or `POST`.
:::

::: best Good API design, quickly
- Consistent names (`created_at` everywhere, not sometimes `createdAt`).
- Always return JSON, including for errors.
- Never return more than the client needs. In particular, never return password hashes.
- Keep responses predictable: a list endpoint returns an array or a standard envelope, not sometimes one and sometimes the other.
- Prefer adding fields to changing or removing them. New fields do not break old clients.
:::

## Pagination, filtering and sorting

A list endpoint that returns a million rows will crash somebody's phone. Always **paginate**, and let clients **filter** and **sort** through the query string.

```text
GET /api/orders?status=shipped&sort=-created_at&page=2&limit=20
```

A typical paginated response:

```json
{
  "data": [ { "id": 21, "status": "shipped" } ],
  "page": 2,
  "pageSize": 20,
  "total": 134,
  "totalPages": 7
}
```

| Style | How | Good for |
|---|---|---|
| Page and size | `?page=3&limit=20` | Simple lists with page numbers |
| Cursor | `?after=<id of the last item>` | Large or constantly changing data (feeds), because pages never skip or repeat |

Two small challenges: build the query string, and compute a page.

::: challenge buildurl Build a URL with a query string
Write `buildUrl(base, params)`. It appends the parameters to `base` as a correctly **encoded** query string. Skip parameters whose value is `undefined` or `null`. Convert values to text. If no parameters remain, return `base` unchanged.

Hint: `new URLSearchParams()` handles the encoding. Use `.append(key, String(value))` and `.toString()`.
Hint: Loop with `Object.entries(params)`.
```js starter
function buildUrl(base, params) {
  // your code here
}
```
```js tests
test('adds parameters', () => assert.equal(buildUrl('/api/todos', { done: true, page: 2 }), '/api/todos?done=true&page=2'));
test('encodes values', () => assert.equal(buildUrl('/search', { q: 'a b&c' }), '/search?q=a+b%26c'));
test('skips undefined and null', () => assert.equal(buildUrl('/x', { a: 1, b: undefined, c: null }), '/x?a=1'));
test('no parameters', () => assert.equal(buildUrl('/x', {}), '/x'));
test('only skipped parameters', () => assert.equal(buildUrl('/x', { a: undefined }), '/x'));
test('keeps zero and false', () => assert.equal(buildUrl('/x', { n: 0, f: false }), '/x?n=0&f=false'));
```
```js solution
function buildUrl(base, params) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params || {})) {
    if (v !== undefined && v !== null) q.append(k, String(v));
  }
  const s = q.toString();
  return s ? base + '?' + s : base;
}
```
:::

::: challenge paginate Paginate a list
Write `paginate(items, page, pageSize)` returning an object `{ data, page, pageSize, total, totalPages }`. `data` is the slice of items for that page (pages start at 1). `total` is the number of items, and `totalPages` is how many pages there are (0 for an empty list). A page below 1 (or not a number) counts as page 1. A page past the end gives an empty `data`.

Hint: The first item of page `p` is at index `(p - 1) * pageSize`. Use `items.slice(start, start + pageSize)`.
Hint: `totalPages` is `Math.ceil(items.length / pageSize)`.
```js starter
function paginate(items, page, pageSize) {
  // your code here
}
```
```js tests
const items = Array.from({ length: 25 }, (_, i) => i + 1);
test('first page', () => assert.deepEqual(paginate(items, 1, 10), { data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], page: 1, pageSize: 10, total: 25, totalPages: 3 }));
test('second page', () => assert.deepEqual(paginate(items, 2, 10).data, [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]));
test('last page is shorter', () => assert.deepEqual(paginate(items, 3, 10).data, [21, 22, 23, 24, 25]));
test('past the end', () => assert.deepEqual(paginate(items, 4, 10).data, []));
test('page below one means one', () => assert.equal(paginate(items, 0, 10).page, 1));
test('empty list', () => assert.deepEqual(paginate([], 1, 10), { data: [], page: 1, pageSize: 10, total: 0, totalPages: 0 }));
```
```js solution
function paginate(items, page, pageSize) {
  const p = Math.max(1, Math.floor(page) || 1);
  const start = (p - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    page: p,
    pageSize,
    total: items.length,
    totalPages: Math.ceil(items.length / pageSize),
  };
}
```
:::

## Errors that help

When something fails, a good API tells the client **what** went wrong in a form a program can read, plus a message a person can read. Use one consistent shape for every error.

```json
{
  "error": {
    "code": "validation_failed",
    "message": "The request body is invalid",
    "details": [
      { "field": "email", "message": "email is invalid" }
    ]
  }
}
```

Use the status code for the category (`400`, `401`, `403`, `404`, `409`, `429`, `500`) and the `code` for the specific reason, so clients can show different messages without parsing sentences.

## Protecting an API

| Concern | What to do |
|---|---|
| Who is calling? | Authentication, such as tokens or API keys (see the Security module) |
| May they do this? | Authorisation checks on every endpoint |
| Abuse and overload | **Rate limiting**: allow only N requests per time window per client, otherwise answer `429 Too Many Requests` |
| Bad data | Validate everything. Set a maximum body size |
| Eavesdropping | HTTPS only |
| Browser access from other sites | Configure CORS carefully |

Rate limiting is easier to understand once you have built one.

::: challenge ratelimiter Build a rate limiter
Write `createRateLimiter(limit, windowMs)` that returns a function `allow(key, now)`. `key` identifies the client (an IP address or user id), and `now` is the current time in milliseconds (passed in, so that the code is easy to test). Use a **fixed window**: the first request for a key starts a window that lasts `windowMs`. Inside the window, the first `limit` requests return `true` and later ones `false`. Once the window has ended, the next request starts a fresh window. Each key is counted separately.

Hint: Store `{ start, count }` for each key in a `Map`.
Hint: If there is no entry, or `now - entry.start >= windowMs`, begin a new entry `{ start: now, count: 0 }`. Then refuse if `count >= limit`, otherwise increment and allow.
```js starter
function createRateLimiter(limit, windowMs) {
  // your code here
}
```
```js tests
test('allows up to the limit', () => { const a = createRateLimiter(2, 1000); assert.equal(a('x', 0), true); assert.equal(a('x', 10), true); });
test('blocks beyond the limit', () => { const a = createRateLimiter(2, 1000); a('x', 0); a('x', 10); assert.equal(a('x', 20), false); });
test('keys are separate', () => { const a = createRateLimiter(1, 1000); a('x', 0); assert.equal(a('y', 5), true); });
test('window resets', () => { const a = createRateLimiter(1, 1000); a('x', 0); assert.equal(a('x', 500), false); assert.equal(a('x', 1000), true); });
test('blocked requests do not extend the window', () => { const a = createRateLimiter(1, 1000); a('x', 0); a('x', 900); assert.equal(a('x', 1000), true); });
```
```js solution
function createRateLimiter(limit, windowMs) {
  const hits = new Map();
  return function allow(key, now) {
    let entry = hits.get(key);
    if (!entry || now - entry.start >= windowMs) {
      entry = { start: now, count: 0 };
      hits.set(key, entry);
    }
    if (entry.count >= limit) return false;
    entry.count++;
    return true;
  };
}
```
:::

::: quiz check Checkpoint: REST design
?  Which URL follows REST conventions for listing a user's orders?
- `GET /api/getUserOrders?id=42`
- *`GET /api/users/42/orders`
- `POST /api/listOrders`
- `GET /api/users/42/doOrders`
> URLs are nouns that show the relationships. The method carries the action.

?  Which status code should `DELETE /api/todos/7` return on success, with nothing left to show?
- 200 with a long message
- 201
- *204
- 404
> `204 No Content` means that it worked and there is no body.

?  Why is `POST` not idempotent?
- It is encrypted
- *Repeating the same request creates another resource each time
- It is slower
- It cannot carry a body
> Two identical POSTs create two resources, so blind retries are risky.

?tf An API that returns a million rows from `GET /api/orders` is fine, because the client can ignore the extra rows. | false
> Always paginate. Large responses waste bandwidth, memory and time.
:::

## Documenting an API: OpenAPI and Swagger

An API without documentation is a locked door. **OpenAPI** is the standard, machine-readable format to describe an API: its paths, methods, parameters, bodies and responses. **Swagger UI** reads an OpenAPI file and turns it into an interactive web page where people can read the docs and **try** each endpoint.

```yaml
openapi: 3.0.3
info:
  title: Todo API
  version: 1.0.0
paths:
  /api/todos:
    get:
      summary: List todos
      parameters:
        - name: done
          in: query
          schema: { type: boolean }
      responses:
        "200":
          description: A list of todos
          content:
            application/json:
              schema:
                type: array
                items: { $ref: "#/components/schemas/Todo" }
    post:
      summary: Create a todo
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [title]
              properties:
                title: { type: string, maxLength: 200 }
      responses:
        "201": { description: Created }
        "400": { description: Validation failed }
components:
  schemas:
    Todo:
      type: object
      properties:
        id: { type: integer }
        title: { type: string }
        done: { type: boolean }
```

In Express you can serve the interactive documentation from the same file:

```js
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const spec = YAML.load("./openapi.yaml");
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spec));
```

Now visiting `/api/docs` shows every endpoint with a "Try it out" button. Many tools can also generate **client code** and **tests** from the same file, so one document drives the docs, the validation and the SDKs.

## Calling APIs from code

You met `fetch`. The pattern never changes: build the URL, send the request, **check the status**, parse the body, handle failure. Here it is in seven languages, so that you can see it is just HTTP.

::: code GET a JSON resource and print the status and body
```javascript
async function getTodo(id) {
  const response = await fetch("https://api.example.com/todos/" + id);
  console.log(response.status);
  if (!response.ok) throw new Error("HTTP " + response.status);
  return response.json();
}
```
```python
import requests  # pip install requests

response = requests.get("https://api.example.com/todos/1", timeout=10)
print(response.status_code)
response.raise_for_status()
todo = response.json()
```
```java
import java.net.URI;
import java.net.http.*;

try {
    HttpClient client = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.example.com/todos/1")).build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println(response.statusCode());
    System.out.println(response.body());
} catch (Exception e) {
    System.out.println("Request failed: " + e.getMessage());
}
```
```csharp
using var client = new HttpClient();
var response = await client.GetAsync("https://api.example.com/todos/1");
Console.WriteLine((int)response.StatusCode);
response.EnsureSuccessStatusCode();
string body = await response.Content.ReadAsStringAsync();
```
```php
<?php
$context = stream_context_create(["http" => ["timeout" => 10]]);
$body = file_get_contents("https://api.example.com/todos/1", false, $context);
$todo = json_decode($body, true);
echo $http_response_header[0] . "\n";
```
```go
resp, err := http.Get("https://api.example.com/todos/1")
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)
fmt.Println(resp.StatusCode, string(body))
```
```ruby
require "net/http"
require "json"

uri = URI("https://api.example.com/todos/1")
response = Net::HTTP.get_response(uri)
puts response.code
todo = JSON.parse(response.body)
```
:::

### fetch or Axios?

**Axios** is a popular library that wraps HTTP calls with a friendlier interface.

```js
import axios from "axios";

const api = axios.create({ baseURL: "/api", timeout: 8000 });

// runs before every request: add the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

try {
  const { data } = await api.post("/todos", { title: "Milk" });   // JSON is automatic
  console.log(data);
} catch (error) {
  if (error.response) console.log("Server said", error.response.status, error.response.data);
  else console.log("No response (network?)", error.message);
}
```

| | `fetch` | Axios |
|---|---|---|
| Built in | Yes, in browsers and Node 18+ | Install it (`npm install axios`) |
| HTTP errors (404, 500) | Resolve normally. Check `response.ok` | **Throws** automatically |
| JSON body | Call `response.json()` and `JSON.stringify` | Automatic |
| Timeouts, interceptors, base URL | Write them yourself | Built in |
| Size | Zero | A small dependency |

Both are fine. A good habit is to write **one small wrapper** that your whole front end uses, so that headers, error handling and timeouts live in one place, whichever library is underneath.

## WebSockets: real-time communication

With normal HTTP, the client asks and the server answers, and the server can never speak first. That is awkward for chat, live scores, notifications, collaborative editing and dashboards. A **[[WebSocket]]** is a **long-lived two-way connection**: once opened, either side can send messages whenever it likes.

::: figure sequence How a WebSocket works
Browser | Server
Browser -> Server: HTTP request with Upgrade: websocket
Server --> Browser: 101 Switching Protocols
Browser -> Server: message: "hello"
Server --> Browser: message: "welcome, Ada"
Server --> Browser: message: "new message from Tunde"
Browser -> Server: close
:::

The client (built into every browser):

```js
const socket = new WebSocket("wss://example.com/chat");     // wss = WebSocket over TLS

socket.addEventListener("open", () => {
  socket.send(JSON.stringify({ type: "join", room: "general" }));
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  console.log("Received:", message);
});

socket.addEventListener("close", () => console.log("Disconnected. Reconnect with a delay."));
```

A very small server with the popular `ws` library for Node:

```js
const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket) => {
  socket.on("message", (data) => {
    // broadcast to everyone connected
    for (const client of wss.clients) {
      if (client.readyState === 1) client.send(data.toString());
    }
  });
});
```

Servers like this keep a registry of who is connected, and often of **rooms** (a chat channel, a game lobby). Build the heart of that registry yourself.

::: challenge hub Build a message hub
Write `createHub()` that returns an object with:
- `subscribe(room, callback)`: registers `callback` for messages in `room`, and returns an **unsubscribe function**.
- `publish(room, message)`: calls every subscriber of that room with `message`, and returns **how many** subscribers received it (0 if there are none).
Messages in one room must never reach another room. After unsubscribing, a callback receives nothing more.

Hint: Keep a `Map` from room name to a `Set` of callbacks.
Hint: The unsubscribe function simply deletes the callback from the room's `Set`.
```js starter
function createHub() {
  // your code here
}
```
```js tests
test('delivers to a subscriber', () => { const h = createHub(); const got = []; h.subscribe('a', (m) => got.push(m)); h.publish('a', 'hi'); assert.deepEqual(got, ['hi']); });
test('returns the number of receivers', () => { const h = createHub(); h.subscribe('a', () => {}); h.subscribe('a', () => {}); assert.equal(h.publish('a', 1), 2); });
test('empty room returns zero', () => assert.equal(createHub().publish('nobody', 'x'), 0));
test('rooms are separate', () => { const h = createHub(); const got = []; h.subscribe('a', (m) => got.push(m)); h.publish('b', 'no'); assert.deepEqual(got, []); });
test('unsubscribe works', () => { const h = createHub(); const got = []; const off = h.subscribe('a', (m) => got.push(m)); off(); h.publish('a', 'x'); assert.deepEqual(got, []); assert.equal(h.publish('a', 'x'), 0); });
```
```js solution
function createHub() {
  const rooms = new Map();
  return {
    subscribe(room, callback) {
      if (!rooms.has(room)) rooms.set(room, new Set());
      rooms.get(room).add(callback);
      return () => { rooms.get(room).delete(callback); };
    },
    publish(room, message) {
      const subs = rooms.get(room);
      if (!subs) return 0;
      for (const cb of [...subs]) cb(message);
      return subs.size;
    },
  };
}
```
:::

### Choosing the right real-time tool

| Technique | How it works | Use for |
|---|---|---|
| **Polling** | The client asks every few seconds | Simple, rarely changing data |
| **Server-Sent Events (SSE)** | A one-way stream from server to client over HTTP | Notifications, live feeds, progress bars |
| **WebSockets** | A two-way persistent connection | Chat, games, collaboration, trading screens |
| **Push services** | Messages through a third party (Firebase, APNs) | Mobile notifications, even when the app is closed |

::: pitfall Real-time pitfalls
- **No reconnection.** Connections drop on trains and in lifts. Reconnect automatically with a growing delay.
- **Trusting the socket.** Authenticate the connection (for example, a token in the first message), and validate every message as you would an HTTP body.
- **Broadcasting everything to everyone.** Use rooms and permission checks.
- **Memory leaks** from never removing closed connections.
- **Using WebSockets when polling would do.** Persistent connections cost memory and complicate scaling.
:::

::: lab Lab: build, document and call an API
Take your Todo API from the back-end module and make it a proper, documented, real-time API.
1. Review the endpoints against the REST rules: plural nouns, methods, status codes. Fix anything that does not follow them.
2. Add pagination (`?page=&limit=`) and filtering (`?done=true`), and return the `{ data, page, total, totalPages }` shape.
3. Replace ad hoc errors with the consistent `{ error: { code, message, details } }` shape, with a central error handler.
4. Write `openapi.yaml` describing every endpoint. Serve it with Swagger UI at `/api/docs`, and use "Try it out" to test each endpoint.
5. Add a rate limiter middleware (60 requests a minute per IP) and return `429` with a `Retry-After` header.
6. Write a tiny front-end page that lists the todos with `fetch` (loading and error states) and adds one through a form.
7. Add a WebSocket server, so that when one browser adds a todo, every open browser tab sees it appear without refreshing.
8. Write a short `README` with example `curl` commands for each endpoint.
9. Stretch goal: call your API from a script in a second language from the code tabs.
:::

::: recap
- An API is a contract between programs. Once others depend on it, it is hard to change.
- REST uses nouns for URLs, HTTP methods for actions, correct status codes, JSON, and stateless requests.
- GET, PUT and DELETE are idempotent. POST is not. Never change data with GET.
- Paginate, filter and sort list endpoints. Return errors in one consistent, machine-readable shape.
- Protect APIs with authentication, authorisation, validation, rate limits and HTTPS.
- OpenAPI describes an API, and Swagger UI makes it explorable.
- `fetch` and Axios do the same job. Always handle HTTP errors, network errors and timeouts.
- WebSockets provide a persistent two-way connection for real-time features. Polling and SSE are simpler alternatives.
:::

::: quiz test Module test: APIs
?  Which method should create a new resource?
- GET
- *POST
- DELETE
- HEAD
> POST sends data to create a new resource under a collection.

?  What is the difference between PUT and PATCH?
- No difference
- *PUT replaces the whole resource, and PATCH changes only the fields sent
- PATCH deletes the resource
- PUT is only for files
> PUT supplies a full replacement, and PATCH supplies a partial change.

?  The client sends too many requests. Which response is most appropriate?
- 200
- 401
- *429
- 503
> `429 Too Many Requests` is the standard rate-limit response.

?  What does OpenAPI describe?
- Only the database
- *An API's endpoints, parameters, bodies and responses in a machine-readable format
- The CSS of a website
- How to deploy a server
> It is the standard format that tools such as Swagger UI use to generate docs.

?  With `fetch`, the server responds `404`. What does the promise do?
- Rejects
- *Resolves, with `response.ok` set to false
- Never settles
- Retries
> `fetch` rejects only for network failures. Check `response.ok`.

?  Which technology lets the SERVER push messages to the browser at any time over one persistent two-way connection?
- Polling
- *WebSocket
- A GET request
- A cookie
> A WebSocket keeps the connection open so both sides can send whenever they like.

?  Why is cursor-based pagination better for a constantly changing feed?
- It is shorter to type
- *Pages never skip or repeat items when new ones arrive
- It does not need a database
- It works without HTTP
> A cursor says "after this item", so insertions do not shift the pages.

?tf `GET /api/deleteUser?id=5` is a good, RESTful way to delete a user. | false
> GET must be safe. Use `DELETE /api/users/5`.

?tf A client should automatically reconnect when a WebSocket connection drops. | true
> Connections drop often. Reconnecting with a delay makes real-time features reliable.

?short Which HTTP status code means "Created"? Type the number. | 201
> `201 Created` confirms that a new resource exists.

?multi Which of these belong in a well-designed REST API? Select all that apply.
- *Plural noun URLs such as `/api/orders`
- *Proper status codes
- *Pagination on list endpoints
- Verbs in every URL, like `/api/createOrder`
> REST uses nouns and lets the HTTP method carry the verb.
:::
