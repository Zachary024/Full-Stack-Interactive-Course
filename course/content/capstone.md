---
id: capstone
number: 19
title: Capstone Project
track: Engineering practice
duration: 30 hours (self-paced)
level: Advanced
summary: Plan, build, test, secure, deploy and present a complete full stack application of your own, using the language and stack you chose.
---

::: objectives
- Turn an idea into requirements, a design and a plan with milestones.
- Build a complete full stack application with a front end, an API, a database and authentication.
- Test it, secure it, containerise it and deploy it with a pipeline.
- Document and present the project as a portfolio piece.
- Review your own work against a rubric and decide what to learn next.
:::

::: prereq
The earlier modules. You do not need to have mastered every detail. A capstone is where the details finally stick, because you have to make them work together.
:::

## Why a capstone?

Watching and reading builds recognition. **Building** builds skill. Until you have made decisions, hit confusing errors, and shipped something that real people can open, the knowledge stays fragile. The capstone is the most valuable part of this course, and it becomes the first item of your portfolio.

::: learn How to get unstuck during a long project
- **Shrink the problem.** Make the smallest possible version of the thing that is broken.
- **Read the error from the top**, then search for the exact message in quotes.
- **Explain it to a rubber duck**, or to a friend. Saying it aloud reveals the gap.
- **Use version control** to experiment fearlessly. You can always go back.
- **Set a time limit.** After 30 minutes of being stuck, ask for help, and show what you tried.
- **Take real breaks.** A walk solves more bugs than another hour of staring.
:::

## Step 1: choose a project

Pick **one**. Each is small enough to finish, and large enough to need every layer. Or propose your own, as long as it needs user accounts, stored data and at least one real-time or background feature.

| Project | The idea | Core features |
|---|---|---|
| **Learning tracker** | People log what they study and see progress | Accounts, courses and sessions, streaks, weekly charts, reminders |
| **Local marketplace** | Neighbours list items and message each other | Accounts, listings with photos, search and filters, favourites, a chat or message feature |
| **Community board** | A small forum for one interest | Accounts and roles (member, moderator), posts and comments, moderation, live notifications |
| **Your own idea** | Something you or someone you know actually needs | Agree the scope with a mentor first |

::: best Choose something you care about
You will spend many hours with this project. If it solves a problem you or someone you know really has, you will push through the boring parts. Resist the urge to build "the next big thing". A small, finished, well-made project beats a huge unfinished one every time.
:::

## Step 2: choose your stack

You have seen many languages. Now pick one back-end language and one front-end approach. All of the following are sound choices, and your decision should come from what you want to learn or the jobs you want.

| Back end | Framework | Database | Front end |
|---|---|---|---|
| JavaScript / TypeScript | Express or Fastify | PostgreSQL or MongoDB | React or Vue |
| Python | Flask or FastAPI (or Django) | PostgreSQL | Vue or React |
| Java | Spring Boot | PostgreSQL | React |
| C# | ASP.NET Core | SQL Server or PostgreSQL | React, Vue or Blazor |
| PHP | Laravel | MySQL or PostgreSQL | Vue (Laravel pairs well) |
| Go | Standard library or Gin | PostgreSQL | React or Vue |
| Ruby | Rails | PostgreSQL | Hotwire or React |

If you are unsure, use **JavaScript or TypeScript throughout**: one language to learn, and this course's examples are written to match. Whatever you choose, keep the **same architecture** you have studied.

::: figure layers The architecture of your capstone
*Front end | React or Vue, running in the browser. Calls the API with fetch
API layer | Routes, validation, authentication middleware, error handling
Services | Business rules. No HTTP details
Data access | Parameterised SQL, or an ORM
Database | PostgreSQL or MongoDB, plus migrations
:::

## Step 3: requirements and design

Before writing code, spend an hour on paper. Skipping this is the single most common reason that capstones stall.

### User stories

Write what users need in the form **"As a (role), I want (goal), so that (benefit)."** Then split them into **must have**, **should have** and **nice to have**.

```text
Must:    As a visitor, I want to register and sign in, so that my data is mine.
Must:    As a member, I want to add a study session, so that I can track my time.
Must:    As a member, I want to see this week's totals, so that I stay motivated.
Should:  As a member, I want a daily streak, so that I keep going.
Nice:    As a member, I want to share a weekly summary, so that friends can cheer me on.
```

Build all the **musts** first. Only then touch the rest.

### Design checklist

1. **Screens.** Sketch each page on paper, for phone width first. How does the user move between them?
2. **Data model.** List the entities and the relationships. Draw the tables with primary and foreign keys.
3. **API.** List every endpoint: method, path, who may call it, the request and response, and the errors.
4. **Security.** Who are the roles? What can each do? Where are the ownership checks?
5. **Risks.** What are the two hardest parts? Prototype those first.

::: note Keep a decision log
In your README, write one line for each significant choice and why you made it ("Chose PostgreSQL because orders have strict relationships"). Employers love this, and it helps you in the final presentation.
:::

### Practise the core logic

Before the full build, test your understanding of the core rules with a small, self-contained service. This is the heart of most capstones: **create, list with filters and pages, update and delete, scoped to the signed-in user, with validation.** Whatever your language, implement the same logic for your own project, and write the same style of tests.

::: challenge service A to-do service with ownership
Write `createTodoService()` returning an object with these methods. Todos belong to a user.
- `create(userId, title)`: trims the title and stores a todo `{ id, userId, title, done: false }`. Ids are numbers starting at 1. If the trimmed title is empty (or not a string), throw `Error("title is required")`. Returns a copy of the todo.
- `list(userId, options)`: returns `{ data, total, totalPages }` for **only that user's** todos, in creation order. `options` may contain `done` (a boolean to filter on), `page` (default 1) and `pageSize` (default 10).
- `toggle(userId, id)`: flips `done` and returns a copy of the todo. Throw `Error("not found")` if the id does not exist, and `Error("forbidden")` if it belongs to another user.
- `remove(userId, id)`: deletes the todo with the same two errors, and returns `true`.

Hint: Keep an array of todos and a counter. Write a small helper `find(userId, id)` that throws the right errors, and reuse it in `toggle` and `remove`.
Hint: For `list`, filter by owner, then by `done` (only if it is a boolean), then slice the page.
```js starter
function createTodoService() {
  // your code here
}
```
```js tests
test('creates a todo', () => { const s = createTodoService(); assert.deepEqual(s.create('u1', '  Milk '), { id: 1, userId: 'u1', title: 'Milk', done: false }); });
test('ids increase', () => { const s = createTodoService(); s.create('u1', 'a'); assert.equal(s.create('u1', 'b').id, 2); });
test('rejects an empty title', () => { const s = createTodoService(); assert.throws(() => s.create('u1', '   ')); });
test('title error message', () => { const s = createTodoService(); let m = ''; try { s.create('u1', ''); } catch (e) { m = e.message; } assert.equal(m, 'title is required'); });
test('lists only own todos', () => { const s = createTodoService(); s.create('u1', 'a'); s.create('u2', 'b'); assert.deepEqual(s.list('u1').data.map((t) => t.title), ['a']); });
test('filters by done', () => { const s = createTodoService(); const t = s.create('u1', 'a'); s.create('u1', 'b'); s.toggle('u1', t.id); assert.deepEqual(s.list('u1', { done: true }).data.map((x) => x.title), ['a']); assert.deepEqual(s.list('u1', { done: false }).data.map((x) => x.title), ['b']); });
test('paginates', () => { const s = createTodoService(); for (let i = 1; i <= 12; i++) s.create('u1', 't' + i); const r = s.list('u1', { page: 2, pageSize: 5 }); assert.deepEqual(r.data.map((t) => t.title), ['t6', 't7', 't8', 't9', 't10']); assert.equal(r.total, 12); assert.equal(r.totalPages, 3); });
test('toggle flips and returns a copy', () => { const s = createTodoService(); const t = s.create('u1', 'a'); const r = s.toggle('u1', t.id); assert.equal(r.done, true); r.done = false; assert.equal(s.toggle('u1', t.id).done, false); });
test('not found', () => { const s = createTodoService(); let m = ''; try { s.toggle('u1', 99); } catch (e) { m = e.message; } assert.equal(m, 'not found'); });
test('forbidden for another user', () => { const s = createTodoService(); const t = s.create('u1', 'a'); let m = ''; try { s.remove('u2', t.id); } catch (e) { m = e.message; } assert.equal(m, 'forbidden'); });
test('remove deletes', () => { const s = createTodoService(); const t = s.create('u1', 'a'); assert.equal(s.remove('u1', t.id), true); assert.equal(s.list('u1').total, 0); });
```
```js solution
function createTodoService() {
  const todos = [];
  let nextId = 1;
  function find(userId, id) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) throw new Error('not found');
    if (todo.userId !== userId) throw new Error('forbidden');
    return todo;
  }
  return {
    create(userId, title) {
      if (typeof title !== 'string' || title.trim() === '') throw new Error('title is required');
      const todo = { id: nextId++, userId, title: title.trim(), done: false };
      todos.push(todo);
      return { ...todo };
    },
    list(userId, options = {}) {
      const { done, page = 1, pageSize = 10 } = options;
      let mine = todos.filter((t) => t.userId === userId);
      if (typeof done === 'boolean') mine = mine.filter((t) => t.done === done);
      const start = (Math.max(1, page) - 1) * pageSize;
      return { data: mine.slice(start, start + pageSize).map((t) => ({ ...t })), total: mine.length, totalPages: Math.ceil(mine.length / pageSize) };
    },
    toggle(userId, id) {
      const todo = find(userId, id);
      todo.done = !todo.done;
      return { ...todo };
    },
    remove(userId, id) {
      const todo = find(userId, id);
      todos.splice(todos.indexOf(todo), 1);
      return true;
    },
  };
}
```
:::

## Step 4: the plan

Break the work into **milestones** that each leave you with something that **runs**. A suggested six-week plan (adjust it to your pace):

| Week | Milestone | Done when |
|---|---|---|
| 1 | **Skeleton.** Repository, README, folder structure, a running "hello" API and front end, CI running the first test | The page loads and CI is green |
| 2 | **Data and API.** Database schema with migrations, CRUD endpoints for the main entity, validation, error handling | You can use every endpoint with `curl` or the Swagger UI |
| 3 | **Accounts and security.** Registration, login, password hashing, sessions or JWT, roles, ownership checks | A user can only ever see their own data |
| 4 | **Front end.** The key screens, forms with validation, loading and error states, responsive layout, accessible controls | The "must" stories work end to end in a browser, on a phone and on a laptop |
| 5 | **Quality.** Tests for the core rules and key endpoints, linting, security review, performance check, accessibility check | CI runs everything, and you fixed what the reviews found |
| 6 | **Ship.** Docker, deployment, domain and HTTPS if possible, monitoring, demo data, documentation, presentation | A stranger can use the live URL |

::: pitfall Why capstones fail
- **Scope creep**: adding features before the musts work. Write "later" on a list and keep going.
- **Perfecting the first screen** for a week while the rest does not exist. Build thin vertical slices: one feature through every layer, and then the next.
- **Leaving deployment to the last day.** Deploy a "hello world" in week 1, and then redeploy every week.
- **No tests** until the end, so that every change is scary.
- **Working alone and silent.** Show your progress weekly, even if only to a friend.
:::

## Step 5: the definition of done

A project is finished when it meets **all** of these, not when it "mostly works".

::: cards
- **Functionality** | Every "must" user story works, with sensible errors for invalid input and a friendly empty state for lists.
- **Security** | Passwords hashed, input validated, every endpoint authorised, ownership checked, no secrets in Git, HTTPS in production.
- **Quality** | Automated tests for the core logic and API, a green CI pipeline, a linter with no warnings.
- **Experience** | Responsive from 320 px to a large desktop. Keyboard-only usable. Labels on every control. Colour contrast checked.
- **Delivery** | A one-command local start (`docker compose up`), a live deployment, a health endpoint, and environment-based configuration.
- **Documentation** | A README with a screenshot, the features, the architecture, how to run and test it, the API summary and a decision log.
:::

## Step 6: self-assessment rubric

Score yourself honestly from 0 (absent) to 4 (excellent) in each row. Ask a friend or mentor to score you too, and discuss the differences.

| Area | 1 (basic) | 4 (excellent) |
|---|---|---|
| **Requirements** | Features were built ad hoc | Stories written, prioritised and traced to features |
| **Data design** | One flat table | Normalised, keys and constraints, indexes on search columns, migrations |
| **API** | Inconsistent routes | REST conventions, status codes, pagination, a consistent error shape, OpenAPI docs |
| **Security** | Passwords hashed | Ownership checks, rate limits, `helmet`, CORS locked down, tested against an IDOR attempt |
| **Front end** | Works on your laptop | Responsive, accessible, loading and error states everywhere |
| **Testing** | Manual only | Unit and API tests in CI, edge cases covered |
| **DevOps** | Runs locally | Containerised, deployed through a pipeline, monitored, with a rollback plan |
| **Code quality** | Works | Clear names, small functions, no duplication, consistent formatting |
| **Documentation** | A title | A README that lets a stranger run and understand it in ten minutes |
| **Communication** | None | A short demo (three minutes) that tells the story: problem, solution, tech, lessons |

A total of 28 or more out of 40 is a strong portfolio piece. Below 20, pick the two weakest rows and improve them before you show anyone.

## Step 7: present and publish

### The README

The README is the front door of your project. Use this structure:

```text
# Project name
One sentence: what it is and who it is for.

![Screenshot](docs/screenshot.png)   (and the live URL)

## Features
## Tech stack and why
## Architecture (a small diagram)
## Run it locally
   docker compose up   (or the exact commands)
## Run the tests
## API overview (or a link to /api/docs)
## What I learned / what I would do next
```

### The three-minute demo

1. **The problem** in one sentence (10 seconds).
2. **Show the app** doing its most important job (90 seconds).
3. **Show one thing under the hood** that you are proud of: a clever query, the test pipeline, the security checks (40 seconds).
4. **What was hard and what you learned** (30 seconds).

Record it as a short video and put the link in the README.

### Your portfolio and next steps

- Pin the capstone (and your best two or three exercises) on your **GitHub profile**, with a short profile README.
- Write a short **blog post** about one problem you solved. Teaching it cements it, and it shows communication skill.
- Practise the **common interview topics**: HTTP and REST, SQL joins, JavaScript async behaviour, how you would secure an endpoint, how you would debug a slow page, and Big-O basics, all of which you studied here.
- Contribute to **open source**. Start with documentation fixes and "good first issue" labels.
- Choose **one** direction to deepen next.

| If you enjoyed... | Go deeper with... |
|---|---|
| Interfaces and user experience | TypeScript, accessibility, design systems, testing with Playwright |
| Servers and data | A second back-end language, PostgreSQL internals, caching with Redis, message queues |
| Infrastructure | Cloud certifications, Kubernetes, Terraform, observability |
| Data | SQL analytics, pandas, machine-learning basics |
| Mobile | React Native or Flutter |
| Building products | Product thinking, user research, payments, analytics |

::: lab Lab: the capstone checklist
Work through this list and tick each item only when you can demonstrate it.
1. A written one-page plan: the problem, the users, five or more user stories, and out-of-scope items.
2. Wireframes of every screen, and the data model drawn with keys.
3. An endpoint list with the roles that may call each one.
4. A repository with a clear structure, a `.gitignore`, a README and at least 30 meaningful commits on feature branches and pull requests.
5. CI running the linter and tests on each push.
6. Registration, login, logout and at least two roles, with ownership checks proven by a test.
7. Pagination, filtering and validation on the main list endpoint.
8. A responsive, keyboard-accessible front end with loading, empty and error states.
9. A Dockerfile and a Compose file, and a deployed version, with the URL in your README.
10. A health check, an uptime alert and a documented rollback.
11. A three-minute demo and a finished self-assessment rubric. Share it with one person and write down their feedback.
:::

::: recap
- A capstone converts knowledge into skill. Choose a project you care about and keep the scope small.
- Pick one stack and keep the architecture you studied: front end, API, services, data access and database.
- Write user stories, sketch the screens, the data and the API before coding.
- Work in weekly milestones that always leave something runnable. Deploy early and often.
- Finish means: working, secure, tested, accessible, deployed and documented.
- Score yourself against the rubric, present with a short demo, and publish it.
:::

::: quiz test Module test: Capstone planning
?  Which is the best way to start a large project?
- Write the whole back end before any front end
- *Write user stories and sketch the screens, data and API, then build a thin working slice
- Start by polishing the colours
- Deploy at the very end
> Planning prevents rework, and thin vertical slices give you something that works early.

?  What does "must have / should have / nice to have" help you do?
- Choose a language
- *Prioritise features so that the essentials are built first
- Write tests
- Name branches
> Prioritisation protects the project against scope creep.

?  Why should you deploy a simple version in the first week?
- Because it is required by GitHub
- *To find deployment and configuration problems early, when they are cheap to fix
- To impress people
- It is not useful
> Late deployment surprises are the most painful ones.

?  A user can read another user's data by changing an id in the URL. Which part of the "definition of done" fails?
- Experience
- *Security
- Documentation
- Delivery
> It is broken access control. Every endpoint needs ownership checks.

?  Which README element helps a stranger the most?
- A long history of the project
- *How to run it locally, with exact commands, plus a screenshot
- A list of every file
- A joke
> The first question is always "how do I see it working?".

?  You have spent three days perfecting the login page, and nothing else exists. What went wrong?
- Nothing, because quality is important
- *The project was not built in thin vertical slices
- The wrong colours
- You used the wrong language
> Build something simple through every layer first, and then improve each part.

?tf A project is finished when it works on your own laptop. | false
> "Done" includes tests, security, accessibility, deployment and documentation.

?tf A decision log in the README (what you chose and why) is useful to employers and to your own presentation. | true
> It demonstrates judgement, which is what employers look for.

?short How many minutes should a good project demo take, according to this module? Type the number. | 3
> A tight three-minute story is easier to watch and shows that you can communicate.

?multi Which of these belong in a capstone's definition of done? Select all that apply.
- *Automated tests running in CI
- *Responsive and keyboard-accessible UI
- *A deployed version and a README
- Every possible nice-to-have feature
> Done is about quality and delivery, not about the longest feature list.
:::
