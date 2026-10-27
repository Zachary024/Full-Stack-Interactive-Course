---
id: devops
number: 18
title: DevOps: Git, CI/CD, Docker and Deployment
track: Engineering practice
duration: 210 min
level: Intermediate
summary: Version control with Git and GitHub, automated testing and delivery, containers, putting an app on the internet with a domain and HTTPS, and watching it once it is live.
---

::: objectives
- Use Git to save history, branch, merge and collaborate through pull requests.
- Explain continuous integration and continuous delivery, and write a GitHub Actions workflow.
- Package an application in a Docker container and run several services with Docker Compose.
- Compare deployment options and put an app online with a domain name and HTTPS.
- Configure an app with environment variables, the way production expects.
- Monitor an app with logs, metrics and health checks, and respond calmly when something breaks.
:::

::: prereq
Back-End Development and the command line (the Getting Started module). You should have Git installed. If not, install it from git-scm.com now.
:::

## What DevOps is

Writing software is half the job. The other half is getting it **to users, safely and repeatedly**, and keeping it running. **[[DevOps]]** is the set of practices and tools that join development ("Dev") and operations ("Ops") so that releasing becomes a boring, automated, low-risk routine rather than a stressful weekend event.

::: figure flow The DevOps loop
Plan | what to build -> Code | in Git -> *Build and test | automatically -> Deploy | to servers -> Monitor | and learn -> Plan | the next change
:::

## Git: a time machine for your code

**[[Git]]** is a version control system. It records the history of your project as a series of **commits**: snapshots, each with a message saying why it changed. You can see who changed what and when, go back to any earlier state, and let many people work at the same time without overwriting one another.

::: plain
Imagine writing an essay and, every time you reach a good point, saving a numbered copy with a note: "added introduction", "fixed conclusion". Git does this efficiently, for a whole folder, and lets two writers work on different copies and then combine their changes.
:::

### The three areas

Files move through three areas. Understanding this removes most of the mystery of Git.

::: figure flow Where your changes live
Working directory | files you edit -> git add -> *Staging area | what the next commit will contain -> git commit -> Local repository | your history -> git push -> Remote | GitHub, shared with the team
:::

### Everyday commands

| Command | What it does |
|---|---|
| `git init` | Start tracking the current folder |
| `git clone <url>` | Copy an existing repository, including its whole history |
| `git status` | What changed? What is staged? **Run this constantly** |
| `git add <file>` | Stage a change for the next commit |
| `git commit -m "message"` | Save the staged changes as a commit |
| `git log --oneline` | Show the history |
| `git diff` | Show exactly what changed |
| `git switch -c <branch>` | Create and move to a new branch |
| `git merge <branch>` | Combine another branch into the current one |
| `git pull` / `git push` | Download / upload commits |
| `git restore <file>` | Throw away uncommitted changes to a file |

```bash
git init
git add .
git commit -m "Add the first version of the to-do page"
git remote add origin https://github.com/you/todo.git
git push -u origin main
```

::: best Write commit messages for your future self
Commit small, focused changes often. Write the message as a short instruction in the imperative: "Add password check to the sign-up form", not "stuff" or "fixed it". Your future self (and teammates) will use `git log` to understand why code is the way it is.
:::

### Branches and pull requests

A **branch** is an independent line of work. The **main** branch always holds working code. You create a branch for each feature or fix, work freely there, and **merge** it back when it is finished and reviewed.

::: figure svg Branching and merging
<svg class="fg" viewBox="0 0 700 190" role="img" aria-label="Commit graph. The main branch has commits A, B, E and a merge commit M. A feature branch leaves at B with commits C and D and merges back into M." style="max-width:700px;min-width:520px" xmlns="http://www.w3.org/2000/svg">
<line x1="60" y1="50" x2="640" y2="50" class="fg-line"/>
<path d="M200 50 C 230 50, 240 130, 280 130 L 420 130 C 470 130, 470 50, 500 50" fill="none" class="fg-line"/>
<circle cx="60" cy="50" r="14" class="fg-box fg-accent"/><text x="60" y="55" text-anchor="middle" class="fg-title">A</text>
<circle cx="200" cy="50" r="14" class="fg-box fg-accent"/><text x="200" y="55" text-anchor="middle" class="fg-title">B</text>
<circle cx="340" cy="130" r="14" class="fg-box"/><text x="340" y="135" text-anchor="middle" class="fg-title">C</text>
<circle cx="420" cy="130" r="14" class="fg-box"/><text x="420" y="135" text-anchor="middle" class="fg-title">D</text>
<circle cx="340" cy="50" r="14" class="fg-box fg-accent"/><text x="340" y="55" text-anchor="middle" class="fg-title">E</text>
<circle cx="500" cy="50" r="14" class="fg-box fg-accent"/><text x="500" y="55" text-anchor="middle" class="fg-title">M</text>
<circle cx="630" cy="50" r="0" class="fg-box"/>
<text x="600" y="30" text-anchor="middle" class="fg-msg">main</text>
<text x="380" y="165" text-anchor="middle" class="fg-msg">feature/login</text>
<text x="500" y="82" text-anchor="middle" class="fg-sub">merge commit</text>
</svg>
:::

On GitHub, you propose merging a branch with a **[[Pull request|pull request]]** (PR). It shows the changes, lets teammates comment and approve, and runs automated checks before anything reaches `main`.

```bash
git switch -c feature/login          # start a branch
# ...edit files...
git add .
git commit -m "Add the login form"
git push -u origin feature/login     # then open a pull request on GitHub
```

### Merge conflicts

If two people change the same lines, Git cannot decide which to keep, and marks the file:

```text
<<<<<<< HEAD
<h1>Welcome back</h1>
=======
<h1>Hello again</h1>
>>>>>>> feature/login
```

Do not panic. Edit the file to what it should say, delete the three marker lines, then `git add` the file and `git commit`. Frequent small merges and talking to your team keep conflicts rare and small.

::: pitfall Git mistakes to avoid
- **Committing secrets** (`.env`, keys, passwords). Use a `.gitignore`, and if a secret leaked, **rotate it**: deleting the commit is not enough, since it lives in history and on clones.
- **Committing `node_modules`, build output or large binaries.** Ignore them.
- **Working on `main` directly** in a team.
- **Huge commits** that mix unrelated changes.
- **`git push --force`** on a shared branch. It rewrites other people's history.
- **Never committing**, and then losing a day of work.
:::

::: challenge semver Compare version numbers
Package versions look like `1.10.2` (major.minor.patch). Write `compareVersions(a, b)` returning `-1` if `a` is older than `b`, `1` if `a` is newer, and `0` if they are the same. Compare each part as a **number** (so `1.10.0` is newer than `1.9.9`). A missing part counts as 0, so `1.2` equals `1.2.0`.

Hint: Split both on `.` and convert the parts with `Number`. Loop up to the longer length.
Hint: `const x = pa[i] || 0, y = pb[i] || 0; if (x !== y) return x < y ? -1 : 1;`
```js starter
function compareVersions(a, b) {
  // your code here
}
```
```js tests
test('equal', () => assert.equal(compareVersions('1.2.3', '1.2.3'), 0));
test('older', () => assert.equal(compareVersions('1.2.3', '1.2.4'), -1));
test('newer major', () => assert.equal(compareVersions('2.0.0', '1.9.9'), 1));
test('numeric not alphabetic', () => assert.equal(compareVersions('1.10.0', '1.9.0'), 1));
test('missing parts are zero', () => assert.equal(compareVersions('1.2', '1.2.0'), 0));
test('different lengths', () => assert.equal(compareVersions('1.2', '1.2.1'), -1));
```
```js solution
function compareVersions(a, b) {
  const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
  const n = Math.max(pa.length, pb.length);
  for (let i = 0; i < n; i++) {
    const x = pa[i] || 0, y = pb[i] || 0;
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}
```
:::

::: quiz check Checkpoint: Git
?  What does `git add` do?
- Saves a commit
- *Puts changes in the staging area for the next commit
- Uploads to GitHub
- Creates a branch
> Staging selects what the next commit will contain.

?  You accidentally committed a file that contained an API key and pushed it. What is the right response?
- Delete the file and the problem is solved
- *Revoke or rotate the key, then remove it from the code
- Rename the file
- Ignore it, because the repository is small
> Anyone who cloned or saw the history has the key. A leaked secret must be replaced.

?tf Branches let you work on a feature without disturbing the stable main branch. | true
> That is their purpose. You merge when the work is ready and reviewed.
:::

## Continuous integration and delivery

**[[CI/CD|Continuous integration (CI)]]** means that every time someone pushes code, a server automatically builds the project and runs all the tests. Broken code is caught in minutes, while the change is still small and fresh in the author's mind. **Continuous delivery (CD)** goes further: code that passes the tests is automatically packaged, and deployed (or ready to deploy with one click).

::: stepper A change's journey from laptop to users
1. **You commit on a branch and push.** The code reaches GitHub.
2. **You open a pull request.** This triggers the CI workflow.
3. **CI builds and tests.** It installs dependencies, runs the linter and the tests on a clean machine. Red means broken, so fix it and push again.
4. **A teammate reviews.** They read the diff and comment or approve.
5. **You merge into `main`.** CI runs once more on the combined result.
6. **CD deploys.** The workflow builds a container or a bundle and rolls it out to staging or production.
7. **Monitoring watches.** If errors jump, you roll back to the previous version.
:::

On GitHub, a **workflow** is a YAML file in `.github/workflows/`. This one tests a Node.js project on every push and pull request:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
```

Reading it: **when** to run (`on`), **where** (`runs-on`), and **what steps**. `actions/checkout` fetches your code, and `run` lines are ordinary shell commands. The same shape works for every language: swap the setup step (`setup-python`, `setup-java`, `setup-dotnet`, `setup-go`, `ruby/setup-ruby`, `shivammathur/setup-php`) and the test command (`pytest`, `mvn test`, `dotnet test`, `go test ./...`, `bundle exec rspec`, `vendor/bin/phpunit`).

::: best Keep the main branch green
Treat a failing CI run as the top priority. Protect `main` on GitHub so that a pull request cannot be merged until the checks pass and someone has approved. Make CI fast (under ten minutes), and keep secrets in the platform's **secrets** store, never in the YAML.
:::

## Containers and Docker

"It works on my machine" is the classic deployment headache: different operating system, different version of the runtime, a missing library. A **container** packages your application together with everything it needs (runtime, libraries, configuration) into one unit that runs identically anywhere.

A **[[Docker image|Docker image]]** is the read-only template. A **[[Container|container]]** is a running instance of it. A **Dockerfile** is the recipe for building an image.

::: figure layers Container layers
*Your application code | COPY . .
Dependencies | npm ci
Runtime | node 20 on a small Linux base
Host machine | Shares the kernel. Starts in seconds
:::

```dockerfile
FROM node:20-alpine
WORKDIR /app

# copy the dependency files first, so that Docker can cache this layer
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
ENV NODE_ENV=production
EXPOSE 3000
USER node
CMD ["node", "server.js"]
```

```bash
docker build -t my-api .                       # build an image
docker run -p 3000:3000 --env-file .env my-api # run it, mapping the port
docker ps                                      # list running containers
docker logs <container>                        # read its output
docker stop <container>
```

The same idea applies to every language. Only the base image and the start command change.

| Language | Typical base image | Start command |
|---|---|---|
| Node.js | `node:20-alpine` | `node server.js` |
| Python | `python:3.12-slim` | `gunicorn app:app` |
| Java | `eclipse-temurin:21-jre` | `java -jar app.jar` |
| C# | `mcr.microsoft.com/dotnet/aspnet:8.0` | `dotnet App.dll` |
| PHP | `php:8.3-apache` | (Apache starts it) |
| Go | `scratch` or `alpine` (a compiled binary) | `./server` |
| Ruby | `ruby:3.3-slim` | `bundle exec puma` |

### Docker Compose: several services together

Real apps need more than one container: the API, a database, perhaps a cache. **Compose** describes them in one file.

```yaml
services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://app:secret@db:5432/app
      JWT_SECRET: ${JWT_SECRET}
    depends_on: [db]
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: app
    volumes:
      - dbdata:/var/lib/postgresql/data
volumes:
  dbdata:
```

`docker compose up` starts both. Containers find each other **by service name** (`db`), and the **volume** keeps the database files when the container is replaced. (This course's own project includes a `Dockerfile` and a `docker-compose.yml` you can study.)

::: pitfall Container mistakes
- **Running as root.** Add `USER node` (or the equivalent).
- **Putting secrets in the image.** Anyone with the image can read them. Pass them as environment variables at run time.
- **Forgetting a volume** for a database. The data disappears with the container.
- **Giant images.** Use slim or alpine bases, multi-stage builds and a `.dockerignore`.
- **Using the `latest` tag** in production. Pin versions.
:::

## Configuration for production

Follow the **twelve-factor** idea: the same code runs in every environment, and **configuration lives in the environment**.

| Setting | Development | Production |
|---|---|---|
| `NODE_ENV` | `development` | `production` |
| `DATABASE_URL` | local database | managed database |
| `JWT_SECRET` | any test value | long random value, in a secrets manager |
| `LOG_LEVEL` | `debug` | `info` |
| `CORS_ORIGIN` | `http://localhost:5173` | `https://app.example.com` |

Environment files (`.env`) hold these locally, one `KEY=value` per line:

```text
# .env (never commit this file)
PORT=3000
DATABASE_URL="postgres://app:secret@localhost:5432/app"
JWT_SECRET=change-me
```

::: challenge env Parse a .env file
Write `parseEnv(text)` that turns the text of a `.env` file into an object. Rules: one `KEY=value` per line. **Ignore** blank lines and lines starting with `#`. Trim spaces around the key and the value. Split at the **first** `=` only, so values may contain `=`. If a value is wrapped in matching single or double quotes, remove them. Lines with no `=` are skipped.

Hint: `const i = line.indexOf('=')`, then `key = line.slice(0, i).trim()` and `value = line.slice(i + 1).trim()`.
Hint: Strip quotes with `/^(["'])(.*)\1$/`.
```js starter
function parseEnv(text) {
  // your code here
}
```
```js tests
test('simple pairs', () => assert.deepEqual(parseEnv('PORT=3000\nMODE=dev'), { PORT: '3000', MODE: 'dev' }));
test('ignores comments and blanks', () => assert.deepEqual(parseEnv('# note\n\nA=1\n   \n# more'), { A: '1' }));
test('removes quotes', () => assert.deepEqual(parseEnv('URL="postgres://x"\nNAME=\'Ada\''), { URL: 'postgres://x', NAME: 'Ada' }));
test('equals sign in value', () => assert.deepEqual(parseEnv('TOKEN=abc=def=='), { TOKEN: 'abc=def==' }));
test('trims spaces', () => assert.deepEqual(parseEnv('  KEY =  value  '), { KEY: 'value' }));
test('skips lines without equals', () => assert.deepEqual(parseEnv('oops\nA=1'), { A: '1' }));
test('empty value', () => assert.deepEqual(parseEnv('EMPTY='), { EMPTY: '' }));
```
```js solution
function parseEnv(text) {
  const result = {};
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (line === '' || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    const m = value.match(/^(["'])(.*)\1$/);
    if (m) value = m[2];
    result[key] = value;
  }
  return result;
}
```
:::

## Putting an app on the internet

### Where to host

| Option | Effort | Good for | Notes |
|---|---|---|---|
| **Platform as a Service** (Render, Heroku, Railway, Fly.io) | Low | Most beginners and small apps | Push code, and the platform builds and runs it, with managed databases and HTTPS |
| **Static hosting** (Netlify, Vercel, GitHub Pages, Cloudflare Pages) | Very low | Front ends with no server code | Fast and often free. Needs a separate API |
| **Serverless** (AWS Lambda, Vercel functions) | Medium | Spiky or small workloads | Pay per call. Each function is short-lived |
| **Virtual server** (AWS EC2, DigitalOcean, Hetzner) | High | Full control | You manage updates, security and scaling |
| **Container platforms** (AWS ECS or Fargate, Google Cloud Run, Kubernetes) | Medium to high | Growing, containerised apps | Scale by running more containers |

Start with a PaaS. Move to something heavier only when a real need appears.

### Domain, DNS and HTTPS

1. **Buy a domain name** from a registrar (Namecheap, Cloudflare, your national registry).
2. **Point it at your app** with **DNS records**:

| Record | Purpose | Example |
|---|---|---|
| `A` | Name to an IPv4 address | `example.com` points to `203.0.113.10` |
| `AAAA` | Name to an IPv6 address | |
| `CNAME` | One name is an alias of another | `www.example.com` is an alias of `myapp.onrender.com` |
| `TXT` | Text, used for domain verification and email security | |
| `MX` | Where to deliver email | |

3. **Enable HTTPS.** Modern platforms issue and renew free certificates automatically (Let's Encrypt). On your own server, a web server such as **Caddy** gets and renews certificates by itself, and the project's `Caddyfile` shows how. HTTPS is not optional: browsers mark plain HTTP sites as insecure, and many features refuse to work without it.
4. **Redirect HTTP to HTTPS**, and set environment variables for production.

::: note DNS changes take time
Changes spread across the internet's caches over minutes to hours. If a new record "does not work", wait and re-check with `nslookup example.com` or `dig example.com` before assuming you made a mistake.
:::

### Deployment strategies

| Strategy | How | Trade-off |
|---|---|---|
| **Recreate** | Stop the old version, start the new | Simple, but there is downtime |
| **Rolling** | Replace servers one at a time | No downtime. Two versions run briefly |
| **Blue/green** | Run the new version beside the old, then switch traffic | Instant rollback. Costs double resources briefly |
| **Canary** | Send 5% of users to the new version first | Catches problems early with limited impact |

Whatever the strategy, plan **rollback** before you deploy: how do you return to the last good version in two minutes? Also plan **database migrations** carefully, since a schema change that old code cannot handle makes rollbacks hard. And **back up** the database and test restoring it.

## Monitoring and response

Deploying is not the finish line. Once real users arrive, you need to know how the system is behaving, preferably before the users tell you.

::: figure blocks The three pillars of observability
Logs | A record of events. What happened and when. Search by request id ; Metrics | Numbers over time. Requests per second, error rate and latency ; Traces | One request's journey. Which service was slow, across the whole system
:::

The **four golden signals** to watch for any service:

| Signal | Question |
|---|---|
| **Latency** | How long do requests take? (Look at the slow 5%, not just the average) |
| **Traffic** | How many requests per second? |
| **Errors** | What fraction fail? |
| **Saturation** | How full are CPU, memory, disk and connections? |

A **health check** endpoint lets platforms and monitors ask "are you alive?":

```js
app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");                 // can we reach the database?
    res.json({ status: "ok", uptime: process.uptime() });
  } catch (e) {
    res.status(503).json({ status: "degraded" });
  }
});
```

Use structured logs (JSON), include a request id on every line, and never log passwords or tokens. Set up **uptime checks** (UptimeRobot, Better Stack) and **alerts** that reach a human, and add **error tracking** (Sentry) so exceptions arrive with stack traces. Tools such as Prometheus and Grafana, or a platform's built-in dashboard, display the metrics.

Here is a small log-analysis task of the kind you do during an incident.

::: challenge logs Summarise an access log
Each log line looks like `GET /api/users 200 12ms` (method, path, status, duration). Write `logStats(lines)` taking an array of such lines. Return `{ total, byStatus, avgMs }`: the number of lines, an object counting lines per status code (keys are the status codes), and the average duration in milliseconds rounded to a whole number (0 when there are no lines).

Hint: Split each line on spaces: the status is part 3 and the duration is part 4. Remove the `ms` with `parseInt`.
Hint: `counts[status] = (counts[status] || 0) + 1`, then `Math.round(totalMs / lines.length)`.
```js starter
function logStats(lines) {
  // your code here
}
```
```js tests
const lines = ['GET /api/users 200 12ms', 'POST /api/login 401 30ms', 'GET /api/users 200 18ms', 'GET /missing 404 6ms'];
test('summarises', () => assert.deepEqual(logStats(lines), { total: 4, byStatus: { 200: 2, 401: 1, 404: 1 }, avgMs: 17 }));
test('empty log', () => assert.deepEqual(logStats([]), { total: 0, byStatus: {}, avgMs: 0 }));
test('single line', () => assert.deepEqual(logStats(['GET / 500 100ms']), { total: 1, byStatus: { 500: 1 }, avgMs: 100 }));
test('rounds the average', () => assert.equal(logStats(['A / 200 1ms', 'A / 200 2ms']).avgMs, 2));
```
```js solution
function logStats(lines) {
  const byStatus = {};
  let totalMs = 0;
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    byStatus[parts[2]] = (byStatus[parts[2]] || 0) + 1;
    totalMs += parseInt(parts[3], 10);
  }
  return { total: lines.length, byStatus, avgMs: lines.length ? Math.round(totalMs / lines.length) : 0 };
}
```
:::

### When it breaks

Incidents happen to every team. A calm routine beats heroics.

1. **Acknowledge and communicate.** Tell the team (and users, if needed) that you are on it.
2. **Stop the bleeding first.** Roll back or switch a feature off. Diagnose afterwards.
3. **Find the cause** in the logs, metrics and the most recent change.
4. **Fix, then verify** with the monitoring that the signals are back to normal.
5. **Write a blameless post-mortem.** What happened, why, and what will prevent it? Focus on systems, not on people.

::: lab Lab: ship an app, end to end
Take the API from the previous modules (or any small app) and deliver it professionally.
1. Create a Git repository with a sensible `.gitignore` (`node_modules`, `.env`) and a `README`. Make at least five small, well-described commits.
2. Push it to GitHub. Create a branch, change something, open a pull request and merge it.
3. Add a GitHub Actions workflow that installs dependencies, lints and tests on every push and pull request. Make it fail on purpose, then fix it.
4. Turn on branch protection so that `main` requires the check to pass.
5. Write a `Dockerfile` and a `.dockerignore`. Build the image and run the container locally, passing the configuration through environment variables.
6. Write a `docker-compose.yml` with the API and a PostgreSQL database and a volume. Run `docker compose up` and confirm that the data survives a restart.
7. Deploy it to a PaaS (Render, Railway or Fly.io have free tiers). Set the environment variables in the platform, not in the code.
8. If you own a domain, add a `CNAME` record and enable HTTPS. Confirm the padlock in the browser, and that `http://` redirects to `https://`.
9. Add a `/api/health` endpoint, and an uptime monitor that alerts you by email. Break the deployment on purpose (a wrong environment variable), watch the alert fire, and practise the rollback.
10. Write a short post-mortem of your deliberate failure: what happened, how you noticed, how you fixed it, and what you would automate next.
:::

::: pitfall Common DevOps mistakes
- **Secrets in Git or in images.**
- **Deploying by hand** from a laptop with no record of what changed. Automate.
- **No rollback plan**, and no tested backups.
- **Skipping staging**, and discovering configuration differences in production.
- **Alert fatigue**: alerts for everything mean that people ignore all of them. Alert on symptoms users feel.
- **Logging too little** (cannot debug) or **too much** (cost, and leaked personal data).
- **Running as root, exposing database ports** to the whole internet, or leaving default passwords.
- **Treating the pipeline as someone else's job.** Everyone who writes code owns how it is delivered.
:::

::: recap
- Git records history as commits, with branches for parallel work and pull requests for review. Never commit secrets.
- CI builds and tests every change automatically, and CD delivers passing changes. Keep `main` green.
- Containers package an app with everything it needs. A Dockerfile builds an image, and Compose runs several services together.
- Keep configuration in environment variables, with the same code in every environment.
- A PaaS is the easiest way to deploy. A domain needs DNS records, and HTTPS should always be on.
- Plan for rollback and backups. Watch logs, metrics, and the four golden signals. Add health checks, alerts and error tracking.
- Handle incidents calmly: communicate, stop the damage, fix, verify, and learn without blame.
:::

::: quiz test Module test: DevOps
?  Which Git command shows what has changed and what is staged?
- `git log`
- `git push`
- *`git status`
- `git merge`
> `git status` is the command to run constantly.

?  What is the main benefit of continuous integration?
- It makes code run faster
- *It catches broken changes within minutes by building and testing every push
- It replaces code review
- It writes the tests for you
> Small, frequent, automatically checked changes keep the main branch healthy.

?  What is the relationship between a Docker image and a container?
- They are the same thing
- *An image is the template. A container is a running instance of it
- A container is a file. An image is a program
- Images run only on Linux servers
> You can start many containers from one image.

?  Which DNS record makes `www.example.com` an alias of `myapp.onrender.com`?
- A
- MX
- *CNAME
- TXT
> CNAME maps one name to another name.

?  A bad release causes a spike of errors. What is the best FIRST action?
- Write a long analysis
- *Roll back (or disable the feature), then investigate
- Blame the last person who committed
- Wait to see whether it fixes itself
> Stop the damage first. Diagnose afterwards.

?  Why should secrets be passed as environment variables rather than written into a Docker image?
- Images cannot contain text
- *Anyone who can pull the image can read the secrets inside it
- Environment variables are faster
- It is not important
> Images are shared and cached. Configuration should be supplied at run time.

?  Which of these is part of the "four golden signals"?
- Number of developers
- *Latency
- Lines of code
- Git branches
> Latency, traffic, errors and saturation.

?tf Deleting a commit that contains a leaked password is enough to make the password safe again. | false
> The secret remains in history and on every clone. It must be rotated.

?tf Blue/green deployment allows an instant rollback by switching traffic back. | true
> The old version keeps running until you are sure that the new one is healthy.

?short Which file format do GitHub Actions workflows use? Type the name of the format (four letters). | YAML
> Workflows are YAML files in `.github/workflows/`.

?multi Which of these belong in a production deployment checklist? Select all that apply.
- *HTTPS enabled
- *Backups that have been tested
- *A health check and an alert
- Default admin password left unchanged
> Defaults and untested backups are disasters waiting to happen.

?order Put these steps in the order of a typical CI/CD flow.
1. Push a branch and open a pull request
2. CI builds and tests
3. Review and merge to main
4. CD deploys
5. Monitoring watches the release
> Changes are verified, reviewed, then released and watched.
:::
