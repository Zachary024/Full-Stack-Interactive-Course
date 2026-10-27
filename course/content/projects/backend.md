::: project bookmarks-api Bookmarks REST API
Time: 4-6 hours
Level: Intermediate
Skills: HTTP routing, REST design, validation, error handling, project structure, testing with curl

Build a JSON API for saving bookmarks: a title, a web address and some tags. The course uses Node and Express for the server, but the core rules (what is a valid bookmark) are the same in every language, so the starter below has the validation function in all seven. Whichever framework you choose, the API must behave the same way.

Requirements:
- These endpoints exist: `GET /bookmarks`, `GET /bookmarks/:id`, `POST /bookmarks`, `PUT /bookmarks/:id`, `DELETE /bookmarks/:id`, and `GET /health`.
- Responses are JSON with the correct status codes: 200 for reads and updates, 201 with a `Location` header for creation, 204 for deletion, 400 for invalid data, 404 for a missing bookmark and 415 for a body that is not JSON.
- A bookmark is valid when: the title is a non-empty string of at most 100 characters, the url starts with `http://` or `https://`, and tags (optional) is a list of at most five non-empty strings. Invalid requests return a list of every problem, not just the first.
- `GET /bookmarks` supports `?tag=` filtering and `?q=` text search over titles, and returns bookmarks newest first.
- Errors always use the same JSON shape, such as `{ "error": "message", "details": [] }`, including for unknown routes and for crashes (a catch-all error handler, with no stack traces in the response).
- The code is split into routes, a validation module and a data store module, not one long file.
- Data is held in memory behind a small store interface, so a database could replace it later without changing the routes.
- Port and any settings come from environment variables, with sensible defaults.
- A file named `requests.http` or a shell script of `curl` commands exercises every endpoint, including the failure cases.

Steps:
1. Write the contract first: for each endpoint, write the method, path, example request, response and status codes in a README.
2. Implement and test `validateBookmark` on its own using the starter, before any web code.
3. Create the store with `list`, `get`, `create`, `update` and `remove` functions.
4. Create the routes one by one, testing each with curl as soon as it exists.
5. Add the error-handling middleware and the not-found handler.
6. Add filtering, searching and sorting.
7. Run every request in your script, and check that every status code matches the contract.

Starter:
```javascript
// Returns an array of error messages. An empty array means the bookmark is valid.
function validateBookmark(b) {
  const errors = [];
  if (typeof b.title !== "string" || b.title.trim() === "") errors.push("title is required");
  // TODO: title length, url must start with http:// or https://, tags rules
  return errors;
}

console.log(validateBookmark({ title: "", url: "ftp://x" }));
```
```python
def validate_bookmark(b):
    """Return a list of error messages. An empty list means the bookmark is valid."""
    errors = []
    if not isinstance(b.get("title"), str) or not b["title"].strip():
        errors.append("title is required")
    # TODO: title length, url must start with http:// or https://, tags rules
    return errors


print(validate_bookmark({"title": "", "url": "ftp://x"}))
```
```java
import java.util.*;

public class Validate {
    static List<String> validateBookmark(String title, String url, List<String> tags) {
        List<String> errors = new ArrayList<>();
        if (title == null || title.trim().isEmpty()) errors.add("title is required");
        // TODO: title length, url must start with http:// or https://, tags rules
        return errors;
    }

    public static void main(String[] args) {
        System.out.println(validateBookmark("", "ftp://x", List.of()));
    }
}
```
```csharp
using System;
using System.Collections.Generic;

class Validate
{
    static List<string> ValidateBookmark(string title, string url, List<string> tags)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(title)) errors.Add("title is required");
        // TODO: title length, url must start with http:// or https://, tags rules
        return errors;
    }

    static void Main()
    {
        Console.WriteLine(string.Join(", ", ValidateBookmark("", "ftp://x", new List<string>())));
    }
}
```
```php
<?php
function validateBookmark(string $title, string $url, array $tags): array {
    $errors = [];
    if (trim($title) === "") $errors[] = "title is required";
    // TODO: title length, url must start with http:// or https://, tags rules
    return $errors;
}

print_r(validateBookmark("", "ftp://x", []));
```
```go
package main

import (
	"fmt"
	"strings"
)

func validateBookmark(title, url string, tags []string) []string {
	var errors []string
	if strings.TrimSpace(title) == "" {
		errors = append(errors, "title is required")
	}
	// TODO: title length, url must start with http:// or https://, tags rules
	return errors
}

func main() {
	fmt.Println(validateBookmark("", "ftp://x", nil))
}
```
```ruby
def validate_bookmark(title, url, tags)
  errors = []
  errors << "title is required" if title.to_s.strip.empty?
  # TODO: title length, url must start with http:// or https://, tags rules
  errors
end

p validate_bookmark("", "ftp://x", [])
```

Hints:
- Express needs `app.use(express.json())` before the routes to read JSON bodies. Without it, `req.body` is undefined.
- Error-handling middleware has four parameters: `(err, req, res, next)`, and goes after all the routes.
- Parse ids with care. `GET /bookmarks/abc` should be a 404 (or 400), never a crash.
- Test the failure cases as carefully as the success cases. They are where real bugs hide.

Stretch:
- Add `PATCH` for partial updates.
- Add request logging middleware that records the method, path, status and duration.
- Replace the in-memory store with SQLite or PostgreSQL without changing the routes.

Deliver:
- The project folder and its README with the endpoint contract.
- The `requests.http` or curl script, and a pasted copy of its output.

Rubric:
- Correct HTTP | Status codes, headers and methods are used as the contract says, for success and failure.
- Validation | All rules are enforced, every problem is reported and nothing invalid reaches the store.
- Structure | Routes, validation and storage are separate, and swapping the store needs no route changes.
- Robustness | Bad JSON, bad ids and unexpected errors return the standard error shape and never crash the server.
:::
