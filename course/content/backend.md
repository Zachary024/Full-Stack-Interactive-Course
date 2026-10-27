---
id: backend
number: 12
title: Back-End Development
track: Back end
duration: 190 min
level: Intermediate
summary: What a server does, routes and middleware, building a JSON API with Express, validation, errors and structure. The same ideas shown in seven languages.
---

::: objectives
- Explain what a back end is for and trace one request through a server.
- Build routes that read parameters, query strings and JSON bodies.
- Explain middleware and write your own.
- Validate input and return correct status codes and helpful errors.
- Organise a project into routes, controllers and services, and keep secrets in environment variables.
- Recognise the same server written in JavaScript, Python, Java, C#, PHP, Go and Ruby, and choose a language for your back end.
:::

::: prereq
How the Web Works (HTTP, status codes, JSON), Programming Fundamentals and Advanced JavaScript. You do not need a database yet, because we use in-memory data first.
:::

## What is a back end for?

The front end runs in the visitor's browser, which is **not** a safe or capable place for everything. You cannot trust it (anyone can edit the code in their own browser) and it cannot share data between users. The [[Back end|back end]] is a program running on a [[Server|server]] you control. It does the work that must be shared, trusted or secret:

- **Storing and retrieving data** in a database, shared by every user.
- **Authentication and permissions**: deciding who you are and what you may do.
- **Business rules**: charging the right price, checking stock, validating input.
- **Talking to other services**: payment providers, email, maps.
- **Keeping secrets**: API keys and passwords never go to the browser.

::: plain
A restaurant has a dining room (the front end) and a kitchen (the back end). The menu and the table are what customers see. Orders go through a hatch to the kitchen, where the real work is done and the recipes stay secret. Customers do not walk into the kitchen, and a good kitchen does not trust that every order slip is sensible.
:::

## The life of a request

::: figure sequence One request through a back end
Browser | Server | Database
Browser -> Server: POST /api/todos with JSON
Server -> Server: middleware: parse JSON, check login
Server -> Server: validate the data
Server -> Database: INSERT the new todo
Database --> Server: the saved row
Server --> Browser: 201 Created and JSON
:::

At every step something can go wrong (bad JSON, not logged in, invalid data, database down), and each failure should become a clear, correct HTTP response. Good back-end work is mostly about handling those paths properly.

## Your first server

Here is the smallest useful web server in each of seven languages. Do not try to memorise any of them. Compare them: every one **listens on a port**, **maps a path to a function**, and **returns JSON**. The idea is the same everywhere.

::: code A server with one endpoint: GET /api/hello
```javascript
// npm install express
const express = require("express");
const app = express();

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello" });
});

app.listen(3000, () => console.log("Listening on port 3000"));
```
```python
# pip install flask
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/hello")
def hello():
    return jsonify(message="Hello")

if __name__ == "__main__":
    app.run(port=3000)
```
```java
import com.sun.net.httpserver.HttpServer;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(3000), 0);
        server.createContext("/api/hello", exchange -> {
            byte[] body = "{\"message\":\"Hello\"}".getBytes();
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, body.length);
            try (OutputStream out = exchange.getResponseBody()) {
                out.write(body);
            }
        });
        server.start();
    }
}
```
```csharp
// ASP.NET Core minimal API
var app = WebApplication.CreateBuilder(args).Build();

app.MapGet("/api/hello", () => new { message = "Hello" });

app.Run("http://localhost:3000");
```
```php
<?php
// Save as index.php and run: php -S localhost:3000 index.php
if ($_SERVER["REQUEST_URI"] === "/api/hello") {
    header("Content-Type: application/json");
    echo json_encode(["message" => "Hello"]);
} else {
    http_response_code(404);
}
```
```go
package main

import (
	"encoding/json"
	"net/http"
)

func main() {
	http.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Hello"})
	})
	http.ListenAndServe(":3000", nil)
}
```
```ruby
# gem install sinatra
require "sinatra"
require "json"

set :port, 3000

get "/api/hello" do
  content_type :json
  { message: "Hello" }.to_json
end
```
:::

Open `http://localhost:3000/api/hello` in your browser, or in a terminal run `curl http://localhost:3000/api/hello`. You should see `{"message":"Hello"}`.

::: learn Which back-end language should I pick?
They all work. Pick by your goals.
- **JavaScript/TypeScript (Node.js):** one language across front and back end. A very large ecosystem.
- **Python:** very readable, excellent for data work and AI. Strong with Django, Flask and FastAPI.
- **Java and C#:** the enterprise standard. Fast, strictly typed, large frameworks (Spring, ASP.NET).
- **PHP:** powers a huge share of existing sites (WordPress, Laravel). Quick to deploy.
- **Go:** simple, very fast, great for cloud services.
- **Ruby:** developer happiness and rapid prototyping (Rails).
This course builds its examples in Express, because you already know JavaScript.
:::

## Express in depth

Express is the most popular Node.js [[Express|web framework]]. Learn it and you understand most back ends, because the ideas (routes, middleware, handlers) appear in every framework.

### Routes and parameters

A **route** combines an HTTP method and a path pattern with a handler function.

```js
const express = require("express");
const app = express();
app.use(express.json());                    // middleware: parse JSON bodies

const todos = [{ id: 1, title: "Learn Express", done: false }];

// READ all, with an optional filter from the query string: /api/todos?done=true
app.get("/api/todos", (req, res) => {
  const { done } = req.query;
  const list = done === undefined ? todos : todos.filter((t) => String(t.done) === done);
  res.json(list);
});

// READ one, using a path parameter: /api/todos/1
app.get("/api/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  res.json(todo);
});

// CREATE, with a JSON body
app.post("/api/todos", (req, res) => {
  const { title } = req.body;
  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "title is required" });
  }
  const todo = { id: Date.now(), title: title.trim(), done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

// UPDATE and DELETE follow the same pattern
app.delete("/api/todos/:id", (req, res) => {
  const index = todos.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Todo not found" });
  todos.splice(index, 1);
  res.status(204).end();
});

app.listen(3000);
```

Three places carry data **in** to a handler:

| Where | Looks like | Read with | Use for |
|---|---|---|---|
| Path parameter | `/todos/42` | `req.params.id` | Identifying one resource |
| Query string | `/todos?done=true&page=2` | `req.query` | Filtering, sorting, paging |
| Body | JSON in a POST or PUT | `req.body` | Creating or updating data |

::: pitfall Everything from a request is text, and untrusted
`req.params.id` is the **string** `"42"`, so convert it with `Number()` and check the result. Never trust anything from a client: check types, lengths and ranges every time. Attackers send what you do not expect.
:::

### Use the right status code

| Situation | Status |
|---|---|
| Success, with data | `200 OK` |
| Created something | `201 Created` |
| Success, nothing to return | `204 No Content` |
| Client sent bad data | `400 Bad Request` (or `422` for failed validation) |
| Not logged in | `401 Unauthorized` |
| Logged in, but not allowed | `403 Forbidden` |
| Does not exist | `404 Not Found` |
| Conflict, such as a duplicate email | `409 Conflict` |
| Our bug | `500 Internal Server Error` |

### Middleware

**Middleware** are functions that run **between** the request arriving and your final handler. Each one receives `(req, res, next)`. It can read or change the request, send a response and stop, or call `next()` to pass control along the line.

::: figure flow Middleware forms a pipeline
Request | arrives -> logger | prints the method and path -> *express.json | parses the body -> auth check | rejects if not signed in -> Route handler | does the real work -> Response | sent to the client
:::

```js
function requestLogger(req, res, next) {
  console.log(req.method, req.url);
  next();                                  // continue to the next middleware
}

function requireLogin(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Please sign in" });   // stop here
  }
  next();
}

app.use(requestLogger);                              // runs for every request
app.get("/api/profile", requireLogin, (req, res) => {   // runs only for this route
  res.json({ name: "Ada" });
});
```

To really understand middleware, build the machinery yourself.

::: challenge pipeline Build a middleware pipeline
Write `runPipeline(middlewares, req)`. It creates a response object `res = { status: 200, body: null }`, runs the middleware functions **in order**, and returns `res`. Each middleware is called as `fn(req, res, next)`. The next middleware only runs if the current one calls `next()`. If a middleware does not call `next()`, the chain stops there.

Hint: Keep an index `i`. `next` takes `middlewares[i++]` and, if it exists, calls it with `(req, res, next)`.
Hint: Define `next` as a function that calls itself recursively through the middleware, and call `next()` once to start.
```js starter
function runPipeline(middlewares, req) {
  // your code here
}
```
```js tests
test('returns the default response', () => assert.deepEqual(runPipeline([], {}), { status: 200, body: null }));
test('runs in order', () => {
  const order = [];
  runPipeline([(q, s, n) => { order.push('a'); n(); }, (q, s, n) => { order.push('b'); n(); }], {});
  assert.deepEqual(order, ['a', 'b']);
});
test('stops when next is not called', () => {
  const order = [];
  runPipeline([(q, s, n) => { order.push('a'); }, (q, s, n) => { order.push('b'); n(); }], {});
  assert.deepEqual(order, ['a']);
});
test('middleware can set the response', () => {
  const res = runPipeline([(q, s, n) => { s.status = 401; s.body = 'no'; }], {});
  assert.deepEqual(res, { status: 401, body: 'no' });
});
test('middleware can change the request for later ones', () => {
  const res = runPipeline([(q, s, n) => { q.user = 'ada'; n(); }, (q, s, n) => { s.body = 'hi ' + q.user; n(); }], {});
  assert.equal(res.body, 'hi ada');
});
```
```js solution
function runPipeline(middlewares, req) {
  const res = { status: 200, body: null };
  let i = 0;
  function next() {
    const fn = middlewares[i++];
    if (fn) fn(req, res, next);
  }
  next();
  return res;
}
```
:::

::: challenge route Match a route pattern
Frameworks turn patterns like `/users/:id` into a lookup. Write `matchRoute(pattern, path)`. If the path fits the pattern, return an object of the parameters (for example `{ id: "42" }`, values as strings). If it does not fit, return `null`. A pattern with no parameters returns `{}` on a match. Ignore leading and trailing slashes.

Hint: Split both strings on `/` and remove empty parts with `.filter(Boolean)`. Different lengths means no match.
Hint: Loop through the segments. A segment starting with `:` captures the value. Otherwise the text must be exactly equal.
```js starter
function matchRoute(pattern, path) {
  // your code here
}
```
```js tests
test('captures a parameter', () => assert.deepEqual(matchRoute('/users/:id', '/users/42'), { id: '42' }));
test('several parameters', () => assert.deepEqual(matchRoute('/users/:uid/posts/:pid', '/users/7/posts/9'), { uid: '7', pid: '9' }));
test('static route', () => assert.deepEqual(matchRoute('/about', '/about'), {}));
test('wrong static part', () => assert.equal(matchRoute('/users/:id', '/people/42'), null));
test('different length', () => assert.equal(matchRoute('/users/:id', '/users/42/extra'), null));
test('trailing slash is ignored', () => assert.deepEqual(matchRoute('/users/:id', '/users/42/'), { id: '42' }));
```
```js solution
function matchRoute(pattern, path) {
  const p = pattern.split('/').filter(Boolean);
  const s = path.split('/').filter(Boolean);
  if (p.length !== s.length) return null;
  const params = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = s[i];
    else if (p[i] !== s[i]) return null;
  }
  return params;
}
```
:::

::: quiz check Checkpoint: servers and Express
?  Which request part would you use to identify ONE resource, as in `/api/todos/42`?
- The query string
- *A path parameter
- A cookie
- The HTTP version
> Path parameters identify a specific resource. Query strings are better for filtering and paging.

?  A handler is given `req.params.id`. What type is it?
- A number
- A boolean
- *A string
- An object
> Everything in a URL is text. Convert it with `Number()` and validate it.

?  What happens if a middleware neither calls `next()` nor sends a response?
- The next middleware runs anyway
- *The request hangs until the client times out
- Express sends a 404 for you
- Express restarts
> Nothing finishes the request, so the client waits.

?tf Because the front end already validates a form, the server does not need to check the data again. | false
> Anyone can bypass the front end and send requests directly. The server must always validate.
:::

## Validation and error handling

The server's first rule is: **never trust input**. Check that the data has the shape and the values you expect before using it, and reply with specific, helpful errors.

```js
function validateTodo(body) {
  const errors = [];
  if (typeof body.title !== "string" || body.title.trim() === "") {
    errors.push("title is required");
  } else if (body.title.length > 200) {
    errors.push("title must be at most 200 characters");
  }
  return errors;
}

app.post("/api/todos", (req, res) => {
  const errors = validateTodo(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  // ...save the todo
});
```

For real projects use a validation library (Zod, Joi, express-validator) instead of hand-writing every rule.

::: challenge validate Validate a user sign-up
Write `validateUser(body)`. It returns an **array of error messages** (empty when valid). Check in this order and use these exact messages:
1. `name` must be a non-empty string (after trimming), otherwise `"name is required"`.
2. `email` must be a string that contains an `@` and, after it, a dot (like `a@b.c`), otherwise `"email is invalid"`.
3. `age` is optional. If present it must be a whole number from 0 to 120, otherwise `"age must be an integer between 0 and 120"`.

Hint: `Number.isInteger(x)` checks for a whole number. An age of `undefined` means "not given".
Hint: A simple email check: `typeof e === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)`.
```js starter
function validateUser(body) {
  // your code here
}
```
```js tests
test('valid user', () => assert.deepEqual(validateUser({ name: 'Ada', email: 'ada@x.com', age: 36 }), []));
test('age is optional', () => assert.deepEqual(validateUser({ name: 'Ada', email: 'ada@x.com' }), []));
test('missing name', () => assert.deepEqual(validateUser({ name: '  ', email: 'ada@x.com' }), ['name is required']));
test('bad email', () => assert.deepEqual(validateUser({ name: 'Ada', email: 'nope' }), ['email is invalid']));
test('bad age', () => assert.deepEqual(validateUser({ name: 'Ada', email: 'a@b.co', age: 200 }), ['age must be an integer between 0 and 120']));
test('non-integer age', () => assert.deepEqual(validateUser({ name: 'Ada', email: 'a@b.co', age: 3.5 }), ['age must be an integer between 0 and 120']));
test('several errors in order', () => assert.deepEqual(validateUser({}), ['name is required', 'email is invalid']));
```
```js solution
function validateUser(body) {
  const errors = [];
  if (typeof body.name !== 'string' || body.name.trim() === '') errors.push('name is required');
  if (typeof body.email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) errors.push('email is invalid');
  if (body.age !== undefined && !(Number.isInteger(body.age) && body.age >= 0 && body.age <= 120)) {
    errors.push('age must be an integer between 0 and 120');
  }
  return errors;
}
```
:::

### One place for errors

Express has a special **error-handling middleware** with four parameters. Errors thrown in your routes end up there, so you can answer consistently without repeating code, and without leaking internals to the visitor.

```js
app.use((err, req, res, next) => {
  console.error(err);                       // full details go to YOUR logs
  res.status(500).json({ error: "Something went wrong" });   // a safe message goes to the client
});
```

::: best Log everything, reveal little
Write details (including the stack trace) to your server logs. Send the client only a short, safe message and, for debugging, a request id. Stack traces, SQL and file paths in responses help attackers.
:::

## Structuring a project

A single file is fine for learning. A real project separates concerns, so that each piece can be understood and tested alone.

::: figure tree A typical project layout
my-api
  src
    server.js
    app.js
    routes
      todos.js
      users.js
    controllers
      todoController.js
    services
      todoService.js
    middleware
      auth.js
      errorHandler.js
    db.js
  tests
  .env
  package.json
:::

| Layer | Job | Example |
|---|---|---|
| Route | Match a URL and method to a controller | `router.get("/", listTodos)` |
| Controller | Read the request, call the service, shape the response | `res.json(await todoService.list())` |
| Service | Business rules, with no knowledge of HTTP | "A user may have at most 50 open todos" |
| Data access | Talk to the database | `db.query("SELECT ...")` |

Keeping HTTP details out of services makes the rules easy to test and to reuse, for example from a command-line tool.

### Configuration and secrets

Never write passwords, API keys or secrets in your code or commit them to Git. Put them in **[[Environment variable|environment variables]]**, which are set differently for each machine (your laptop, the test server, production).

```js
require("dotenv").config();               // loads a local .env file during development

const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL is required");
```

Add `.env` to your `.gitignore`, and commit a `.env.example` listing the names (not the values).

### CORS

Browsers block a page from one origin (for example `https://app.example.com`) from reading responses from another (`https://api.example.com`), unless the API says it is allowed. That rule is [[CORS]]. In Express:

```js
const cors = require("cors");
app.use(cors({ origin: "https://app.example.com" }));
```

::: pitfall Common back-end mistakes
- **Trusting client input.** Validate every parameter, query value and body.
- **Wrong status codes.** Returning `200` with `{ "error": ... }` breaks clients and monitoring.
- **Not handling errors in async routes.** In Express 4, wrap async handlers or use a library such as `express-async-errors`. (Express 5 handles it for you.)
- **Sending stack traces** to the browser.
- **Secrets in the repository.** If you leaked one, rotate it, because deleting the commit is not enough.
- **Forgetting that the server can have many users at once.** Do not keep one user's data in a global variable.
- **`app.use(cors())` with everything allowed** on an API that uses cookies.
:::

::: lab Lab: build and test a Todo API
Build a REST API with Express, with no database yet.
1. `mkdir todo-api && cd todo-api && npm init -y && npm install express`.
2. Create `server.js` with `GET /api/todos`, `GET /api/todos/:id`, `POST /api/todos`, `PATCH /api/todos/:id` and `DELETE /api/todos/:id`, using the examples above.
3. Add the `validateTodo` function. Return `400` with an `errors` array for bad input and `404` for unknown ids.
4. Add a request logger middleware and a final error-handling middleware.
5. Add a filter: `GET /api/todos?done=true` and a search `?q=milk`.
6. Test each endpoint with `curl`. For example: `curl -X POST localhost:3000/api/todos -H "Content-Type: application/json" -d '{"title":"Milk"}'`. Also test failures: an empty title, a bad id, malformed JSON.
7. Move the code into `routes/`, `controllers/` and `services/` folders.
8. Read the port from `process.env.PORT`, and add a `.env.example`.
9. Stretch goal: write the same server in a second language from the code tabs above, and compare.
:::

::: recap
- The back end does what must be shared, trusted or secret: data, authentication, business rules and secrets.
- A request passes through middleware, validation and a handler before the response goes back.
- Data arrives in the path, the query string or the body. All of it is text, and none of it is trustworthy.
- Use accurate status codes (`201`, `400`, `401`, `403`, `404`, `409`, `500`).
- Middleware is a pipeline of `(req, res, next)` functions, and an error handler gives consistent failures.
- Separate routes, controllers and services. Keep secrets in environment variables.
- Every language offers the same building blocks. Choose by goals and ecosystem.
:::

::: quiz test Module test: Back-end development
?  Why can a back end keep secrets that a front end cannot?
- It uses a stronger language
- *The code runs on a server you control, not in the visitor's browser
- It is faster
- Browsers encrypt secrets
> Anything sent to the browser can be read by the visitor. Server code and its configuration never leave the server.

?  Which status code should an API return after successfully creating a new resource?
- 200
- *201
- 204
- 302
> `201 Created` says that a new resource now exists.

?  A user is signed in but tries to open an admin page. Which status is most accurate?
- 401
- *403
- 404
- 500
> 401 means "not authenticated". 403 means "authenticated, but forbidden".

?  What does this route read? `/api/products?category=books&page=2`
- Path parameters
- *The query string
- The request body
- Cookies
> The part after the question mark is the query string, read with `req.query`.

?  Where should an API key for a payment provider be stored?
- In the JavaScript sent to the browser
- In the code, committed to Git
- *In an environment variable on the server
- In a public README
> Environment variables keep secrets out of your code and can differ for each environment.

?  What is the job of a service layer in a layered back end?
- Reading HTTP headers
- *Business rules, independent of HTTP
- Drawing HTML
- Routing URLs
> Services hold the rules, which makes them reusable and easy to test.

?  Which Express handler signature marks an error-handling middleware?
- `(req, res)`
- `(req, res, next)`
- *`(err, req, res, next)`
- `(error)`
> Four parameters tell Express this function handles errors.

?tf `req.params.id` for the URL `/todos/5` is the number 5. | false
> It is the string `"5"`. Always convert and validate.

?tf It is acceptable to return `200 OK` together with `{ "error": "not found" }`. | false
> Use the proper status code. Clients, caches and monitoring depend on it.

?short Which HTTP status code means "Not Found"? Type the number. | 404
> 404 means that the server cannot find the requested resource.

?multi Which of these belong in a middleware? Select all that apply.
- *Logging each request
- *Parsing a JSON body
- *Checking that a user is signed in
- Storing the final answer to a business calculation
> Middleware handles cross-cutting concerns. The final result belongs in a route handler or service.

?order Put the layers in order from the incoming request to the database.
1. Route
2. Controller
3. Service
4. Data access
> The request enters the route, the controller shapes the HTTP part, the service applies rules, and data access talks to the database.
:::
