---
id: web
number: 3
title: How the Web Works
track: Getting started
duration: 70 min
level: Beginner
summary: What really happens between typing an address and seeing a page: URLs, DNS, HTTP requests and responses, status codes, HTTPS and cookies.
---

::: objectives
- Explain the client-server model with an everyday analogy.
- Break a URL into scheme, host, port, path, query and fragment.
- Describe each step that happens when you open a web page.
- Read an HTTP request and response, choose the right method, and interpret status codes.
- Explain why HTTPS matters and what cookies are for.
:::

::: prereq
Introduction to Programming. You should know what a program and a variable are.
:::

## Clients and servers

The web is a conversation between two kinds of computers. A **client** asks for something. A **server** listens for requests and answers them. Your browser is a client. The computer that stores a website's pages and data is a server.

::: figure flow The client sends a request. The server sends back a response.
*Client | your browser or app -> Request | "Please send me /home" -> Server | a computer that waits for requests -> Response | the page, data or an error
:::

::: plain
A restaurant again: you (the client) tell the waiter what you want (request). The kitchen (server) prepares it and the waiter brings it back (response). You never walk into the kitchen. You only see the menu and the plate.
:::

A server is just a normal computer that is always on and connected to the internet, running a program that listens for requests. While you build and test, your own laptop can be the server. It is then reached with the special name **localhost**.

## Anatomy of a URL

Every resource on the web has an address called a URL. It is made of parts, and each part has a job.

::: figure anatomy The parts of a URL
https:// | scheme ; www.shop.com | host ; :443 | port ; /products/shoes | path ; ?color=red&size=9 | query ; #reviews | fragment
:::

| Part | Example | What it means |
|---|---|---|
| Scheme | `https://` | The rules (protocol) used to talk: `http` or encrypted `https` |
| Host | `www.shop.com` | Which server to contact. A [[Domain name|domain name]] |
| Port | `:443` | Which door on that server. Usually hidden: 80 for HTTP, 443 for HTTPS |
| Path | `/products/shoes` | Which resource on the server you want |
| Query | `?color=red&size=9` | Extra options, as name=value pairs joined with `&` |
| Fragment | `#reviews` | A spot inside the page. It is never sent to the server |

Try pulling a URL apart with code. JavaScript has a built-in `URL` tool that does what you just did by eye.

::: playground js Parse a URL
Change the address and run it. Add another query value and see how `searchParams` changes.
```js
const url = new URL("https://www.shop.com:8443/products/shoes?color=red&size=9#reviews");
console.log("scheme:", url.protocol);
console.log("host:", url.hostname);
console.log("port:", url.port);
console.log("path:", url.pathname);
console.log("query:", url.search);
console.log("color =", url.searchParams.get("color"));
console.log("fragment:", url.hash);
```
:::

## From name to address: DNS

Computers find each other with numeric addresses called IP addresses, like `93.184.216.34`. People prefer names. The **Domain Name System** ([[DNS]]) is the internet's phone book: it converts `shop.com` into the right IP address.

::: figure sequence Looking up a name with DNS
Browser | DNS resolver | Web server
Browser -> DNS resolver: Where is shop.com?
DNS resolver --> Browser: 93.184.216.34
Browser -> Web server: GET /products (to that address)
Web server --> Browser: 200 OK + page
:::

Results are remembered ([[Cache|cached]]) for a while, so repeated visits skip the lookup.

## What happens when you open a page

This is a classic interview question, and understanding it ties together everything in this course. Step through it.

::: stepper From address bar to pixels
1. **You type or click a URL.** The browser splits it into scheme, host, path and so on.
2. **DNS lookup.** The browser asks for the IP address of the host, unless it remembers it.
3. **Connect and secure.** The browser opens a connection to the server. For HTTPS it also agrees on encryption keys, called the TLS handshake.
4. **Send an HTTP request.** For example `GET /products/shoes`, with headers such as which language you prefer.
5. **The server works.** It may read files, ask a database for data, run your back-end code, and build a response.
6. **The server sends a response.** A status code (such as 200) plus headers plus the body, usually HTML.
7. **The browser builds the page.** It reads the HTML, discovers it needs CSS, images and JavaScript, and requests those too. Then it lays everything out and paints it on screen.
8. **JavaScript makes it interactive.** It listens for clicks and may request more data without reloading the page.
:::

## HTTP: the language of requests and responses

**HTTP** is the set of rules browsers and servers follow when they talk. It is plain text, which makes it easy to read. A request looks like this:

```http
GET /products/shoes?color=red HTTP/1.1
Host: www.shop.com
Accept: text/html
User-Agent: Mozilla/5.0
```

The first line is the **method**, the **path** and the version. The rest are **headers**: extra facts about the request. And the response:

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 5120

<!doctype html>
<html>...the page...</html>
```

The first line has a **status code**. Then come headers, a blank line, and the **body**: the actual content.

### Methods say what you want to do

| Method | Meaning | Example |
|---|---|---|
| `GET` | Read something. Never changes data | Load a product page |
| `POST` | Create something new | Submit a sign-up form |
| `PUT` | Replace something | Update a whole profile |
| `PATCH` | Change part of something | Change only the email |
| `DELETE` | Remove something | Delete a comment |

::: pitfall Do not change data with GET
Browsers, search engines and prefetch tools freely repeat GET requests because they are supposed to be safe. If a link like `/delete-account` used GET, a crawler could delete accounts. Anything that changes data must use POST, PUT, PATCH or DELETE.
:::

### Status codes say how it went

Codes are grouped by their first digit. Learn the groups first, then the common ones.

| Range | Meaning | Common codes |
|---|---|---|
| 1xx | Information | 101 Switching Protocols (used by WebSockets) |
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirect | 301 Moved Permanently, 304 Not Modified |
| 4xx | The client made a mistake | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests |
| 5xx | The server failed | 500 Internal Server Error, 503 Service Unavailable |

::: learn A way to remember
**2** is "fine", **3** is "go somewhere else", **4** is "your fault", **5** is "our fault".
:::

### Sending a request from code

Every language can make HTTP requests. The idea is identical: give a URL, get a response with a status and a body.

::: code Making a GET request
```javascript
const response = await fetch("https://example.com/api/users");
console.log(response.status);
const data = await response.json();
```
```python
import json
from urllib.request import urlopen

with urlopen("https://example.com/api/users") as response:
    print(response.status)
    data = json.loads(response.read())
```
```java
import java.net.URI;
import java.net.http.*;

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder(URI.create("https://example.com/api/users")).build();
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.statusCode());
String body = response.body();
```
```csharp
using var client = new HttpClient();
var response = await client.GetAsync("https://example.com/api/users");
Console.WriteLine((int)response.StatusCode);
string body = await response.Content.ReadAsStringAsync();
```
```php
<?php
$body = file_get_contents("https://example.com/api/users");
$data = json_decode($body, true);
echo $http_response_header[0];
```
```go
resp, err := http.Get("https://example.com/api/users")
if err != nil {
    panic(err)
}
defer resp.Body.Close()
fmt.Println(resp.StatusCode)
```
```ruby
require "net/http"
require "json"

response = Net::HTTP.get_response(URI("https://example.com/api/users"))
puts response.code
data = JSON.parse(response.body)
```
:::

::: note About these samples
They are real, working code, but they need an internet connection and a server at that address, so there is no output to show. The API module builds proper servers and clients.
:::

## HTTPS: keeping conversations private

Plain HTTP travels as readable text. On public Wi-Fi, someone could read or even modify it. **HTTPS** wraps HTTP in encryption ([[SSL|TLS]]), so that:

- **Nobody can read** the traffic in the middle (privacy).
- **Nobody can change** it unnoticed (integrity).
- You know you are **really talking to the right site** (authentication), thanks to a certificate issued by a trusted authority.

Always use HTTPS for anything with passwords or personal data. Today that means everything. Hosting platforms and tools like Caddy give you a free certificate automatically.

## Cookies: remembering you

HTTP has no memory: each request is independent, and the server does not know that two requests came from the same person. A **cookie** is a small piece of text the server asks your browser to store and to send back with every later request to that site. This is how a site keeps you logged in, remembers your cart, or stores your language.

::: figure sequence How a cookie keeps you logged in
Browser | Server
Browser -> Server: POST /login (email and password)
Server --> Browser: 200 OK + Set-Cookie: session=abc123
Browser -> Server: GET /profile (Cookie: session=abc123)
Server --> Browser: 200 OK + your profile
:::

The Authentication module goes deeper into cookies, sessions and tokens.

## Front end and back end, revisited

Now we can be precise. The **front end** is everything that is delivered to the browser and runs there: HTML (structure), CSS (looks) and JavaScript (behaviour). The **back end** is the server program that receives requests, applies rules, talks to the database and builds responses. They communicate over HTTP. You will meet both in depth in later modules.

## Practice

::: challenge host Get the host name from a URL
Write `getHost(url)` that returns only the host name of a URL, for example `"www.shop.com"` for `"https://www.shop.com:8443/a?b=1"`.

Hint: JavaScript has a built-in `URL` class: `new URL(text)`.
Hint: A `URL` object has a `hostname` property.
```js starter
function getHost(url) {
  // your code here
}
```
```js tests
test('plain https', () => assert.equal(getHost('https://example.com/path'), 'example.com'));
test('with port and query', () => assert.equal(getHost('https://www.shop.com:8443/a?b=1'), 'www.shop.com'));
test('http and subdomain', () => assert.equal(getHost('http://blog.site.org/2024/post'), 'blog.site.org'));
```
```js solution
function getHost(url) {
  return new URL(url).hostname;
}
```
:::

::: challenge status Classify an HTTP status code
Write `statusKind(code)` that returns `"success"` for 200 to 299, `"redirect"` for 300 to 399, `"client error"` for 400 to 499, `"server error"` for 500 to 599, and `"other"` for anything else.

Hint: Compare ranges with `>=` and `<`.
Hint: A neat trick is `Math.floor(code / 100)`, which gives the first digit.
```js starter
function statusKind(code) {
  // your code here
}
```
```js tests
test('200 is success', () => assert.equal(statusKind(200), 'success'));
test('204 is success', () => assert.equal(statusKind(204), 'success'));
test('301 is redirect', () => assert.equal(statusKind(301), 'redirect'));
test('404 is client error', () => assert.equal(statusKind(404), 'client error'));
test('500 is server error', () => assert.equal(statusKind(500), 'server error'));
test('101 is other', () => assert.equal(statusKind(101), 'other'));
```
```js solution
function statusKind(code) {
  if (code >= 200 && code < 300) return 'success';
  if (code >= 300 && code < 400) return 'redirect';
  if (code >= 400 && code < 500) return 'client error';
  if (code >= 500 && code < 600) return 'server error';
  return 'other';
}
```
:::

## Check your understanding

::: quiz check Checkpoint: URLs and DNS
?  In `https://shop.com/cart?item=5`, what is `/cart`?
- The scheme
- *The path
- The query
- The port
> The path says which resource on the server you want. The query comes after the question mark.

?  What is DNS for?
- Encrypting traffic
- Storing web pages
- *Turning a domain name into an IP address
- Running JavaScript
> DNS is the internet's phone book: you give it a name and it returns the address of the server.
:::

::: quiz check Checkpoint: HTTP
?  Which method should be used to submit a new sign-up form?
- GET
- *POST
- DELETE
- HEAD
> POST creates new data on the server. GET must never change data.

?short Which status code means "page not found"? Type the number. | 404
> 404 Not Found is a client error: the path does not exist on the server.
:::

::: recap
- Clients send requests. Servers return responses. Localhost is your own computer acting as a server.
- A URL has scheme, host, port, path, query and fragment.
- DNS turns names into addresses. HTTP carries requests and responses made of a start line, headers and a body.
- Methods say what you want to do. Status codes say how it went: 2xx fine, 3xx redirect, 4xx client error, 5xx server error.
- HTTPS encrypts and protects traffic. Cookies let a server remember a browser between requests.
:::

::: quiz test Module test: How the Web Works
?  Which statement best describes a web server?
- A program that draws web pages on your screen
- *A computer or program that waits for requests and sends back responses
- A type of browser
- A website's design
> The browser draws pages. A server listens and responds.

?  Which part of the URL is never sent to the server?
- The path
- The query
- *The fragment
- The host
> The fragment (after #) is used only by the browser to jump to a spot in the page.

?  A request returns status 503. Whose problem is it most likely?
- The user typed a wrong URL
- *The server, which is currently unavailable
- The user's keyboard
- The DNS only
> 5xx codes mean the server failed to handle a request that was probably fine. 503 means the service is unavailable.

?  Why should deleting data never be done with a GET request?
- GET requests are too slow
- *GET is meant to be safe, and crawlers or browsers may repeat it automatically
- GET cannot carry a path
- GET is only for images
> Tools freely repeat GET requests. If GET deleted things, a crawler could wipe your data.

?tf HTTP keeps a memory of who you are between requests without any extra help. | false
> HTTP is stateless. Cookies, sessions or tokens are added on top to remember users.

?short What is the name of the encrypted version of HTTP? Type the five letters. | https
> HTTPS is HTTP wrapped in TLS encryption.

?multi Which of these does HTTPS provide? Select all that apply.
- *Privacy from eavesdroppers
- *Protection against tampering
- *Proof that you are talking to the real site
- Faster typing
> Encryption gives privacy and integrity, and the certificate gives authentication.

?order Order the events when a page is opened.
1. The browser looks up the IP address with DNS
2. The browser connects to the server
3. The browser sends an HTTP request
4. The server sends a response
5. The browser displays the page
> Name to address, connect, ask, answer, show.
:::
