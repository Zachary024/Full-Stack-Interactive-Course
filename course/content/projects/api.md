::: project api-docs Document and harden your API
Time: 4-5 hours
Level: Intermediate
Skills: API design, pagination, filtering, versioning, OpenAPI, rate limiting, real-time updates

Take the bookmarks API from the back-end module and make it ready for other developers to use. You will add pagination and filtering, version the paths, protect it from abuse, describe it in an OpenAPI file with a live documentation page, and add one real-time feature.

Requirements:
- All routes are served under `/api/v1`, and the old routes redirect or return a clear message.
- `GET /api/v1/bookmarks` supports `page` and `limit` (with a maximum of 50), `sort` and `order`, and `tag`. The response contains `data`, plus `meta` with `page`, `limit`, `total` and `pages`. Invalid values return 400 and explain what was wrong.
- Responses to `GET` requests include an `ETag`, and a request with a matching `If-None-Match` returns 304 with no body.
- A rate limiter allows at most 60 requests per minute for each client address, returns 429 with a `Retry-After` header when exceeded, and sends `X-RateLimit-Remaining` on every response.
- An `openapi.yaml` file describes every endpoint, its parameters, request bodies, response bodies and error shapes. It validates with an OpenAPI linter, and `/docs` serves it using Swagger UI or Redoc.
- A consistent error format is documented once and reused in every response.
- Idempotency: `PUT` and `DELETE` are safe to repeat, and you have a test that repeats them and shows the result is the same.
- One real-time feature: a WebSocket or Server-Sent Events endpoint that pushes a message to connected clients when a bookmark is created.
- A small client page (or script) that lists bookmarks with a Next button and shows live additions without refreshing.

Steps:
1. Write the OpenAPI file first for the endpoints you already have, then add the new parameters.
2. Mount the routes under `/api/v1` and add the pagination logic. Write down the edge cases (page 0, limit 1000, page beyond the last).
3. Add ETag support and test it with `curl -i` and the `If-None-Match` header.
4. Implement the rate limiter, and test it with a quick loop of requests.
5. Serve the documentation page, and try each endpoint from the page itself.
6. Add the real-time feature and the client page.
7. Run a linter over the OpenAPI file and fix the warnings.

Starter:
```yaml
openapi: 3.0.3
info:
  title: Bookmarks API
  version: 1.0.0
servers:
  - url: http://localhost:3000/api/v1
paths:
  /bookmarks:
    get:
      summary: List bookmarks
      parameters:
        - in: query
          name: page
          schema: { type: integer, minimum: 1, default: 1 }
        # TODO: limit, sort, order, tag
      responses:
        "200":
          description: A page of bookmarks
          # TODO: schema with data and meta
        "400":
          $ref: "#/components/responses/BadRequest"
components:
  responses:
    BadRequest:
      description: The request was invalid
      content:
        application/json:
          schema:
            type: object
            properties:
              error: { type: string }
              details: { type: array, items: { type: string } }
```

Hints:
- Compute `pages` with `Math.ceil(total / limit)` and use `slice((page - 1) * limit, page * limit)` for an in-memory store.
- A simple rate limiter keeps a `Map` of address to a count and a window start time. Reset the window when it ends.
- Keep the OpenAPI examples realistic. They are what people copy.
- For Server-Sent Events, set the `Content-Type` to `text/event-stream` and write lines that start with `data:` and end with a blank line.

Stretch:
- Add cursor-based pagination and explain when it is better than page numbers.
- Generate a client with an OpenAPI code generator and use it from your client page.
- Add an API key check on write requests, and document it in the security section of the file.

Deliver:
- The updated API, `openapi.yaml` and the client page.
- A short log showing a 304 response, a 429 response and a live update arriving.

Rubric:
- Design | Paths, parameters and responses are consistent, predictable and versioned.
- Documentation | The OpenAPI file is valid, complete and matches the real behaviour of the API.
- Protection | The rate limiter and input limits behave as documented, with the right status codes and headers.
- Real-time | Clients receive updates without polling, and disconnected clients are cleaned up.
:::
