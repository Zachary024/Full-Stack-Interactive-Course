---
id: auth
number: 16
title: Authentication and Security
track: Back end
duration: 200 min
level: Intermediate
summary: Passwords, sessions, JWT, roles and permissions, and the web attacks every developer must know: XSS, CSRF, injection and broken access control.
---

::: objectives
- Explain the difference between authentication and authorisation.
- Store passwords safely with salted, slow hashing.
- Compare sessions and JSON Web Tokens, and choose between them.
- Implement role-based access control and avoid broken access control.
- Describe and prevent XSS, CSRF and injection attacks.
- Apply a practical security checklist: HTTPS, headers, secrets, rate limits and logging.
:::

::: prereq
Back-End Development and Databases. You should know how a request becomes a response, what middleware is, and how to use parameterised queries.
:::

## Think like an attacker

Sooner or later, someone will try to break your application: for fun, for money, or by running an automated scanner that tries millions of sites. Security is not a feature you add at the end. It is a habit of asking, at each step, **"what if the person on the other side is hostile?"**

Three principles will guide almost every decision in this module.

1. **Never trust the client.** The browser, the form and the request are all under the visitor's control. Check everything on the server.
2. **Defence in depth.** Assume that any single protection can fail, and layer several.
3. **Least privilege.** Give every user and every program only the access it needs, and nothing more.

## Authentication and authorisation

These two words sound alike but answer different questions.

::: figure blocks Two different questions
Authentication | Who are you?
Login, password, token
Result: an identity ; Authorisation | What may you do?
Roles, permissions, ownership
Result: allow or deny
:::

- **[[Authentication]]** proves **who** someone is: a password, a fingerprint, a code from a phone.
- **[[Authorization|Authorisation]]** decides **what** that person may do. A signed-in student may read lessons but may not delete other people's accounts.

::: plain
At an office building the receptionist checks your ID and gives you a badge (authentication). The badge then opens some doors but not others (authorisation). Being let into the building does not mean you can enter the server room.
:::

The status codes follow the same split: **401** means "I do not know who you are", and **403** means "I know who you are and the answer is no".

## Storing passwords

When someone registers, you must store something that lets you check their password later. The rule is simple: **never store the password itself.**

| Approach | If your database leaks | Verdict |
|---|---|---|
| Plain text | Every password is exposed, and users reuse passwords elsewhere | Never |
| Encrypted | The key often leaks with the database | Wrong tool |
| Fast hash (MD5, SHA-1, plain SHA-256) | Attackers test billions of guesses per second | Not safe for passwords |
| **Slow, salted hash** (bcrypt, scrypt, Argon2) | Each guess is deliberately costly, and every user has a unique salt | **Correct** |

A [[Hash|hash]] is a one-way fingerprint: easy to compute, practically impossible to reverse. A [[Salt|salt]] is random data added to each password before hashing, so that identical passwords produce different hashes, and precomputed tables become useless. Libraries such as [[Bcrypt|bcrypt]] handle the salt and the slowness for you.

::: figure flow Registration and login with hashing
Register | user sends a password -> *Hash with salt | bcrypt(password) -> Store | only the hash goes in the database -> Login | hash the attempt and compare
:::

Every language has a trusted bcrypt-style library. The pattern is the same: **hash on registration, verify on login.**

::: code Hash a password, then verify it
```javascript
// npm install bcrypt
const bcrypt = require("bcrypt");

async function register(password) {
  return bcrypt.hash(password, 12);              // the 12 is the cost
}

async function login(password, storedHash) {
  return bcrypt.compare(password, storedHash);   // true or false
}
```
```python
# pip install bcrypt
import bcrypt

def register(password: str) -> bytes:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))

def login(password: str, stored_hash: bytes) -> bool:
    return bcrypt.checkpw(password.encode(), stored_hash)
```
```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
String stored = encoder.encode(password);
boolean ok = encoder.matches(attempt, stored);
```
```csharp
// dotnet add package BCrypt.Net-Next
string stored = BCrypt.Net.BCrypt.HashPassword(password, 12);
bool ok = BCrypt.Net.BCrypt.Verify(attempt, stored);
```
```php
<?php
$stored = password_hash($password, PASSWORD_BCRYPT, ["cost" => 12]);
$ok = password_verify($attempt, $stored);
```
```go nocheck
import "golang.org/x/crypto/bcrypt"

stored, err := bcrypt.GenerateFromPassword([]byte(password), 12)
ok := bcrypt.CompareHashAndPassword(stored, []byte(attempt)) == nil
```
```ruby
# gem install bcrypt
require "bcrypt"

stored = BCrypt::Password.create(password, cost: 12)
ok = BCrypt::Password.new(stored) == attempt
```
:::

### What makes a good password policy?

Modern guidance (from NIST, the US standards body) is perhaps surprising: **length matters more than weird symbols.** Forcing "one capital, one number, one symbol" produces `Password1!`, which is weak. Better rules: require at least 12 characters, allow long passphrases and spaces, block known-breached and common passwords, and never force periodic changes. Offer a password manager and two-factor authentication instead.

::: challenge password Check a password against a policy
Write `checkPassword(password, username)` that returns an **array of problems** (empty if the password is acceptable). Report these, in this order:
1. `"too short"` if it has fewer than 12 characters.
2. `"too common"` if, ignoring case, it equals one of: `password`, `123456`, `qwerty`, `letmein`, `password123`, `iloveyou`.
3. `"contains username"` if `username` is not empty and the password, ignoring case, contains the username.

Hint: Compare lowercased copies: `password.toLowerCase()`.
Hint: Push each problem into an array as you check, and return the array at the end.
```js starter
function checkPassword(password, username) {
  // your code here
}
```
```js tests
test('a good passphrase', () => assert.deepEqual(checkPassword('correct horse battery staple', 'ada'), []));
test('too short', () => assert.deepEqual(checkPassword('Ab1!', 'ada'), ['too short']));
test('too common', () => assert.deepEqual(checkPassword('PASSWORD123', 'ada'), ['too short', 'too common']));
test('too common but long enough', () => assert.deepEqual(checkPassword('123456', ''), ['too short', 'too common']));
test('contains username', () => assert.deepEqual(checkPassword('my-ADA-secret-phrase', 'ada'), ['contains username']));
test('empty username is ignored', () => assert.deepEqual(checkPassword('a perfectly fine passphrase', ''), []));
```
```js solution
function checkPassword(password, username) {
  const problems = [];
  const lower = password.toLowerCase();
  if (password.length < 12) problems.push('too short');
  if (['password', '123456', 'qwerty', 'letmein', 'password123', 'iloveyou'].includes(lower)) problems.push('too common');
  if (username && lower.includes(username.toLowerCase())) problems.push('contains username');
  return problems;
}
```
:::

::: quiz check Checkpoint: authentication basics
?  What is the difference between authentication and authorisation?
- They are the same
- *Authentication proves who you are. Authorisation decides what you may do
- Authentication is for servers, authorisation for browsers
- Authorisation happens before authentication
> You must know who someone is before deciding what they may do.

?  Which is the correct way to store a password?
- Plain text in the database
- Encrypted with a key stored next to it
- *As a salted hash from a slow algorithm such as bcrypt
- Hashed with MD5
> Slow, salted hashes make stolen databases hard to crack. Fast hashes can be guessed billions of times a second.

?tf Hashing a password and encrypting a password are the same thing. | false
> Encryption can be reversed with a key. Hashing is one-way, and that is exactly what you want.
:::

## Sessions and tokens

HTTP has no memory, so after login the server needs a way to recognise the same person on later requests. There are two main approaches.

### Sessions (stateful)

The server creates a **session**: a record stored on the server (in memory, a database or Redis) with a random, unguessable id. It sends the id to the browser in a **cookie**. On each request the browser sends the cookie back, and the server looks the session up.

::: figure sequence Session-based login
Browser | Server | Session store
Browser -> Server: POST /login with email and password
Server -> Server: verify the password hash
Server -> Session store: create session abc123 for user 42
Server --> Browser: Set-Cookie: sid=abc123 (HttpOnly, Secure)
Browser -> Server: GET /profile with Cookie sid=abc123
Server -> Session store: who is abc123?
Session store --> Server: user 42
Server --> Browser: 200 OK with the profile
:::

The server stays in control: it can end any session at once (log out, a stolen device, a banned user). The cost is that it must store and look up sessions, which adds complexity when you run several servers.

Build the heart of a session store yourself, with expiry.

::: challenge sessions Build a session store
Write `createSessionStore(ttlMs, makeId)` returning an object with:
- `create(userId, now)`: makes a new session that expires at `now + ttlMs`, using `makeId()` to get its id, and returns the id.
- `get(id, now)`: returns the `userId` if the session exists and has **not** expired, otherwise `null`. A session is expired when `now >= expiry`. Remove expired sessions when you find them.
- `destroy(id)`: deletes the session (log out).
(The time is passed in so that the code is easy to test. In real code ids come from a cryptographic random generator.)

Hint: Use a `Map` from id to `{ userId, expires }`.
Hint: In `get`, check `now >= session.expires` before returning the user.
```js starter
function createSessionStore(ttlMs, makeId) {
  // your code here
}
```
```js tests
let n = 0;
const ids = () => 's' + (++n);
test('create then get', () => { const s = createSessionStore(1000, ids); const id = s.create('ada', 0); assert.equal(s.get(id, 500), 'ada'); });
test('expires at the deadline', () => { const s = createSessionStore(1000, ids); const id = s.create('ada', 0); assert.equal(s.get(id, 1000), null); });
test('unknown id', () => assert.equal(createSessionStore(1000, ids).get('nope', 0), null));
test('destroy logs out', () => { const s = createSessionStore(1000, ids); const id = s.create('ada', 0); s.destroy(id); assert.equal(s.get(id, 1), null); });
test('sessions are independent', () => { const s = createSessionStore(1000, ids); const a = s.create('ada', 0); const b = s.create('tim', 0); s.destroy(a); assert.equal(s.get(b, 1), 'tim'); });
test('uses the id generator', () => { const s = createSessionStore(10, () => 'fixed'); assert.equal(s.create('x', 0), 'fixed'); });
```
```js solution
function createSessionStore(ttlMs, makeId) {
  const sessions = new Map();
  return {
    create(userId, now) {
      const id = makeId();
      sessions.set(id, { userId, expires: now + ttlMs });
      return id;
    },
    get(id, now) {
      const s = sessions.get(id);
      if (!s) return null;
      if (now >= s.expires) { sessions.delete(id); return null; }
      return s.userId;
    },
    destroy(id) { sessions.delete(id); },
  };
}
```
:::

### JSON Web Tokens (stateless)

A **[[JWT]]** is a signed piece of text that carries the user's identity, so the server needs no lookup. The server signs it with a secret key at login. Later, it simply **verifies the signature**.

A JWT has three parts, separated by dots: `header.payload.signature`.

::: figure blocks The three parts of a JWT
Header | algorithm and token type: {"alg":"HS256"} ; Payload | claims: user id, role, expiry: {"sub":"42","role":"student","exp":1767225600} ; Signature | HMAC of header and payload with the server's secret
:::

The header and payload are only **encoded** (Base64), not encrypted. Anyone can read them. The signature merely proves that nobody **changed** them. Try it: edit the payload below and watch the signature stop matching.

::: demo jwt
:::

::: pitfall Never put secrets in a JWT
The payload is readable by anyone who holds the token. Put an id and a role in there, never a password, and think twice before adding personal data. Always set a short expiry (`exp`), because a stolen token works until it expires, and the server cannot easily cancel one.
:::

```js
const jwt = require("jsonwebtoken");

// at login
const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });

// middleware: runs on each protected request
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);   // checks signature and expiry
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
```

### Which to choose?

| | Sessions | JWT |
|---|---|---|
| State | Stored on the server | Carried by the client |
| Log a user out or ban them now | Easy: delete the session | Hard: wait for expiry, or keep a blocklist |
| Scaling to many servers | Needs a shared store (Redis) | Each server just verifies the signature |
| Best for | Traditional websites and apps with one back end | APIs used by mobile apps, microservices, third parties |
| Typical weakness | CSRF (see below) | Token theft and long lifetimes |

::: best A sensible default
For a website with its own back end, use **server-side sessions** with an `HttpOnly` cookie. For an API used by several clients, use **short-lived JWT access tokens** (about 15 minutes) plus a longer-lived **refresh token** kept in an `HttpOnly` cookie and stored (hashed) on the server so that it can be revoked.
:::

### Cookie flags that matter

| Flag | Effect |
|---|---|
| `HttpOnly` | JavaScript cannot read the cookie, which limits damage from XSS |
| `Secure` | Only sent over HTTPS |
| `SameSite=Lax` or `Strict` | Not sent with most cross-site requests, which blocks most CSRF |
| `Max-Age` / `Expires` | Limits how long it lasts |

```js
res.cookie("sid", sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 8,   // 8 hours
});
```

::: quiz check Checkpoint: sessions and JWT
?  What does a JWT's signature prove?
- That the payload is secret
- *That the header and payload have not been changed since the server signed them
- That the user's password is strong
- That the token is stored on the server
> The payload is readable by anyone. The signature only guarantees integrity.

?  Which cookie flag stops JavaScript from reading a cookie?
- Secure
- SameSite
- *HttpOnly
- Path
> `HttpOnly` hides the cookie from scripts, which limits what an XSS attack can steal.

?  A manager wants to instantly log out a banned user. Which approach makes this easiest?
- Long-lived JWTs
- *Server-side sessions, because you can delete the session
- Storing the token in localStorage
- Encrypting the token
> A server-side session can be removed immediately. A signed JWT stays valid until it expires.
:::

## Authorisation: roles and permissions

Once you know who the user is, you decide what they may do. The most common approach is **[[Role-based access control]]** (RBAC): users have **roles**, and roles have **permissions**.

| Role | Read lessons | Take quizzes | Moderate forum | Manage users |
|---|---|---|---|---|
| student | yes | yes | no | no |
| moderator | yes | yes | yes | no |
| admin | yes | yes | yes | yes |

Check permissions in **middleware**, on the **server**, for **every** endpoint.

```js
function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Sign in first" });
    if (!allowed.includes(req.user.role)) return res.status(403).json({ error: "Not allowed" });
    next();
  };
}

app.delete("/api/users/:id", requireAuth, requireRole("admin"), deleteUser);
```

Hiding a button in the front end is **not** security. It is convenience. A determined user can send the request by hand.

::: challenge can Build a role-based authoriser
Write `createAuthorizer(policy)`. `policy` maps role names to arrays of allowed actions, for example `{ student: ['read'], admin: ['*'] }`. It returns a function `can(user, action)`. A user is `{ roles: [...] }` and may hold several roles. `can` returns `true` if **any** of the user's roles allows the action, either by listing it or by having the wildcard `'*'`. Unknown roles allow nothing, and a missing `roles` array allows nothing.

Hint: Loop over `user.roles` and look up `policy[role]`. A missing policy entry should count as an empty list.
Hint: `(policy[role] || []).some((a) => a === '*' || a === action)`
```js starter
function createAuthorizer(policy) {
  // your code here
}
```
```js tests
const can = createAuthorizer({ student: ['read', 'quiz'], moderator: ['read', 'moderate'], admin: ['*'] });
test('listed action', () => assert.equal(can({ roles: ['student'] }, 'read'), true));
test('unlisted action', () => assert.equal(can({ roles: ['student'] }, 'moderate'), false));
test('wildcard', () => assert.equal(can({ roles: ['admin'] }, 'delete-user'), true));
test('several roles combine', () => assert.equal(can({ roles: ['student', 'moderator'] }, 'moderate'), true));
test('unknown role', () => assert.equal(can({ roles: ['hacker'] }, 'read'), false));
test('no roles', () => assert.equal(can({}, 'read'), false));
```
```js solution
function createAuthorizer(policy) {
  return function can(user, action) {
    const roles = (user && user.roles) || [];
    return roles.some((role) => (policy[role] || []).some((a) => a === '*' || a === action));
  };
}
```
:::

### Broken access control: ownership

The most common serious vulnerability on the web is not about roles at all. It is about **ownership**. Suppose `GET /api/orders/42` returns order 42 to any signed-in user. A customer simply changes `42` to `43` and reads someone else's order. This is called an **IDOR** (insecure direct object reference).

```js
// WRONG: any signed-in user can read any order
app.get("/api/orders/:id", requireAuth, async (req, res) => {
  const order = await db.orders.find(req.params.id);
  res.json(order);
});

// RIGHT: also check that the order belongs to this user (or the user is an admin)
app.get("/api/orders/:id", requireAuth, async (req, res) => {
  const order = await db.orders.find(req.params.id);
  if (!order) return res.status(404).json({ error: "Not found" });
  if (order.userId !== req.user.sub && req.user.role !== "admin") {
    return res.status(403).json({ error: "Not allowed" });
  }
  res.json(order);
});
```

## Attacks every developer must know

### Cross-site scripting (XSS)

**[[XSS]]** happens when an attacker's text ends up in your page **as code**. Suppose a forum shows comments with `innerHTML`. Someone posts `<img src=x onerror="steal(document.cookie)">`, and the script runs in every visitor's browser, with their privileges.

Defences:
- Show user text with `textContent`, or let your framework escape it (React and Vue do so by default). Be very suspicious of `innerHTML`, `dangerouslySetInnerHTML` and `v-html`.
- **Escape** special characters when you must build HTML by hand.
- Set a **Content Security Policy** header that limits where scripts may come from.
- Use `HttpOnly` cookies, so that a successful XSS cannot read the session.

::: challenge escape Escape HTML
Write `escapeHtml(text)`. It converts the five special characters to HTML entities: `&` to `&amp;`, `<` to `&lt;`, `>` to `&gt;`, `"` to `&quot;` and `'` to `&#39;`. Convert non-string input with `String(...)` first.

Hint: Chain `.replace(/&/g, '&amp;')` and so on. Replace `&` **first**, otherwise you will escape the `&` in your own entities.
Hint: A lookup object and `replace(/[&<>"']/g, (c) => map[c])` does it in one pass.
```js starter
function escapeHtml(text) {
  // your code here
}
```
```js tests
test('script tag', () => assert.equal(escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;'));
test('ampersand', () => assert.equal(escapeHtml('Tom & Jerry'), 'Tom &amp; Jerry'));
test('quotes', () => assert.equal(escapeHtml('say "hi" it\'s me'), 'say &quot;hi&quot; it&#39;s me'));
test('no double escaping of the order', () => assert.equal(escapeHtml('<'), '&lt;'));
test('plain text unchanged', () => assert.equal(escapeHtml('hello world'), 'hello world'));
test('numbers', () => assert.equal(escapeHtml(42), '42'));
```
```js solution
function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(text).replace(/[&<>"']/g, (c) => map[c]);
}
```
:::

### Cross-site request forgery (CSRF)

**[[CSRF]]** tricks a signed-in user's browser into sending a request they did not intend. If you are logged in to `bank.com` (with a cookie) and then visit `evil.com`, a hidden form on that page can submit `POST bank.com/transfer`. The browser dutifully attaches your `bank.com` cookie.

Defences: `SameSite=Lax` or `Strict` cookies (the main modern defence), CSRF tokens in forms, requiring a custom header or `Authorization` header (a different site cannot add one), and checking the `Origin` header.

### Injection

Whenever user input is mixed into a **command or query** (SQL, shell, LDAP, NoSQL), the input can become part of the command. The cure is the same every time: **separate code from data**. Use parameterised queries, never string concatenation (see the Databases module), and never pass user input to a shell.

### The rest of the checklist

| Risk | Defence |
|---|---|
| Brute-force and credential stuffing | Rate-limit login attempts, add delays, offer two-factor authentication |
| Eavesdropping | HTTPS everywhere, with HSTS (an instruction to browsers to always use HTTPS) |
| Leaked secrets | Environment variables, never Git. Rotate if leaked |
| Vulnerable dependencies | `npm audit`, automated update tools, and fewer dependencies |
| Information leaks | Generic login errors ("email or password is wrong"). No stack traces in responses |
| Missing headers | Use `helmet` in Express for sensible defaults |
| Weak error handling | Log details privately and show users a safe message |
| No visibility | Log logins, failures and permission denials, and watch for patterns |

::: best Do not invent your own security
Do not write your own password hashing, token format or session system if a mature library or service does it. Use bcrypt or Argon2, `jsonwebtoken`, `helmet`, and established providers. Security bugs hide in the details, and experts have already found and fixed them.
:::

## Third-party sign-in (OAuth)

"Sign in with Google" uses **OAuth 2.0 / OpenID Connect**. Instead of handling a password, your app redirects the user to Google. Google authenticates them and sends your app a **code**, which your server exchanges for tokens that identify the user. You never see their password.

::: figure sequence Sign in with a provider
Browser | Your app | Provider
Browser -> Your app: Click Sign in with Google
Your app --> Browser: Redirect to the provider
Browser -> Provider: User signs in and approves
Provider --> Browser: Redirect back with a one-time code
Browser -> Your app: Delivers the code
Your app -> Provider: Exchange the code for tokens (server to server)
Provider --> Your app: ID token with the user's identity
Your app --> Browser: Your own session starts
:::

Delegating sign-in is often the safest choice for a small team: fewer passwords to store and protect, with two-factor handled by the provider.

::: pitfall Common security mistakes
- **Trusting the front end** for permission checks.
- **Forgetting ownership checks** (IDOR). Every endpoint that takes an id must check access.
- **Storing JWTs in `localStorage`**, where any XSS can read them. Prefer `HttpOnly` cookies.
- **Telling attackers too much**: "no such user" versus "wrong password" reveals who has an account.
- **Secrets in the repository** or in front-end code.
- **CORS set to `*`** with credentials.
- **Using `innerHTML` with user text.**
- **Long-lived tokens with no way to revoke them.**
- **No rate limiting on login and password-reset endpoints.**
:::

::: lab Lab: add secure authentication to your API
Take your API from the earlier modules and secure it.
1. Create a `users` table with a unique email, a `password_hash` and a `role` that defaults to `student`.
2. Write `POST /api/auth/register`: validate input, run the password policy, hash with bcrypt (cost 12), insert, and return the user **without** the hash. Return `409` for a duplicate email.
3. Write `POST /api/auth/login`: verify the hash and return a JWT that expires in 15 minutes, with the user's id and role. Return the same generic error whether the email or the password is wrong.
4. Add `requireAuth` middleware and use it on the todo endpoints. Add an `owner_id` to todos, and make every query filter by it, so that nobody can read another user's data.
5. Add `requireRole("admin")` to an admin-only endpoint, and write tests that prove a student receives `403`.
6. Add `helmet`, restrict CORS to your front end's origin, and add a rate limiter to the login route (5 attempts per minute).
7. Write a test that tries an IDOR attack: user A requests user B's todo. It must fail with `403` or `404`.
8. Review the checklist table above and write down, for each row, what your project does.
9. Stretch goal: add a refresh token in an `HttpOnly` cookie, and a `POST /api/auth/logout` that revokes it.
:::

::: recap
- Authentication proves who you are. Authorisation decides what you may do. Never trust the client.
- Store passwords only as salted hashes from slow algorithms (bcrypt, scrypt, Argon2). Prefer long passphrases to complicated rules.
- Sessions keep state on the server and are easy to revoke. JWTs are stateless and signed (not encrypted), and need short lifetimes.
- Use `HttpOnly`, `Secure` and `SameSite` cookie flags.
- RBAC maps users to roles and roles to permissions. Always check on the server, and always check ownership (IDOR).
- XSS is stopped by escaping and CSP, CSRF by `SameSite` and tokens, and injection by separating code from data.
- Add HTTPS, `helmet`, rate limits, safe errors and logging. Use mature libraries and providers.
:::

::: quiz test Module test: Authentication and security
?  A signed-in user requests an admin page and is refused. Which status code is best?
- 400
- 401
- *403
- 404
> The server knows who the user is (so it is not 401), but they are not allowed.

?  Why is a salt added to a password before hashing?
- To make the hash shorter
- *So that identical passwords have different hashes and precomputed tables do not work
- To encrypt the password
- To make logins faster
> A unique salt for every user defeats rainbow tables and shows no pattern between equal passwords.

?  A JWT payload contains `{"sub":"42","role":"student"}`. Who can read it?
- Only the server
- *Anyone who has the token
- Only the user who owns it
- Nobody, because it is encrypted
> The payload is only Base64-encoded. Never put secrets in it.

?  A user changes `/api/orders/42` to `/api/orders/43` and sees someone else's order. What is this vulnerability called?
- XSS
- CSRF
- *Broken access control (IDOR)
- SQL injection
> The server checked that the user was logged in, but not that the order belonged to them.

?  Which defence is the most direct protection against XSS in a page that shows user comments?
- A longer password policy
- *Escaping or using `textContent` for user-supplied text
- Hashing the comments
- Using POST instead of GET
> Treat user text as text, never as markup.

?  What is the main purpose of the `SameSite` cookie attribute?
- Encrypting the cookie
- *Restricting when the cookie is sent with cross-site requests, which helps stop CSRF
- Making the cookie last longer
- Hiding the cookie from JavaScript
> `SameSite=Lax` or `Strict` stops the browser from attaching your cookie to most requests started from other sites.

?  Which login error message is safest?
- "No account with that email"
- "Wrong password for ada@example.com"
- *"Email or password is incorrect"
- The database error text
> A generic message does not reveal which emails have accounts.

?tf Hiding the "Delete user" button from non-admins is enough to protect that action. | false
> Anyone can send the request manually. The server must check the role.

?tf `HttpOnly` cookies cannot be read by JavaScript running on the page. | true
> This limits what an XSS attack can steal.

?short Which kind of attack tricks a signed-in user's browser into submitting an unwanted request, abbreviated to four letters? Type the abbreviation. | CSRF
> Cross-site request forgery abuses the browser's habit of attaching cookies automatically.

?multi Which of these are good practices? Select all that apply.
- *Hash passwords with bcrypt or Argon2
- *Rate-limit login attempts
- *Serve the site over HTTPS
- Store the JWT secret in the front-end code
> Secrets must stay on the server, never in code sent to browsers.

?order Put these steps of a session-based login in order.
1. The user submits email and password
2. The server verifies the password hash
3. The server creates a session and sets a cookie
4. The browser sends the cookie with later requests
> The password is checked, then a session is issued, and the cookie identifies the user afterwards.
:::
