# Full Stack Development: an interactive course for absolute beginners

20 modules and 6 reference pages, about 97,000 words, 326 quiz questions, 48 auto-checked coding challenges,
16 hands-on projects, 61 diagrams, 29 runnable playgrounds and 15 labs. Beginners **choose a programming language** (JavaScript, Python, Java,
C#, PHP, Go or Ruby) and every code example switches to it, or let the course **recommend one** from their
quiz results. Guides for TypeScript, Rust and Kotlin are included too.

## What a learner gets
* **Plain-English lessons** with objectives, prerequisites, "in plain words" boxes, tips, common pitfalls, best practices and a recap.
* **Illustrations**: flow diagrams, sequence diagrams, layer stacks, trees, the CSS box model, ER and Git diagrams (all SVG).
* **Assessment at every level**: checkpoints with instant feedback inside lessons; a graded test per module (pass mark 70%, mcq, true/false, short answer, multi-select, ordering); auto-graded coding challenges (JavaScript and SQL) that run in the browser, give hints, and reveal a solution only after two failed tries; labs; and a 31-question final exam that unlocks a printable certificate.
* **Playgrounds**: edit and run HTML/CSS/JavaScript, and a real SQL database (SQLite compiled to WebAssembly) with no install.
* **Learning guide** (module 1): how to study, how to debug, how to ask for help.
* **Projects** (`#projects`): one after every major module (16 in all). Each has a brief, a requirements checklist, a build order, hints, stretch goals, a hand-in list and a rubric. A project can be finished only when every requirement is ticked, and the learner may attach a link to the work and write a short reflection.
* **Progress dashboard** (`#progress`): a weighted overall score (lessons 35%, coding challenges 20%, projects 30%, final exam 15%), a streak counter, a weekly goal, a 16-week activity heat map, an average test score, an estimate of the time left, a per-module table, 11 milestone badges, a "what to do next" list, and JSON export and import (import merges and never deletes). It syncs when signed in.
* **Reference library** (`#reference`): a filterable command-line cheat sheet (macOS/Linux and PowerShell side by side), Git and GitHub, developer tools (npm, pip, Docker, curl, SSH, database shells, nano, Vim), keyboard shortcuts for Windows, macOS, Linux, VS Code, browsers, DevTools and the terminal, look-up tables (HTTP, ports, chmod, regex, CSS, SQL, Big O, number systems) and a seven-language syntax comparison. Command cells have copy buttons and shortcuts are drawn as keys.
* **Glossary** of 626 terms in 10 topic groups, with a filter and tap-to-define in the text.
* Search, bookmarks, notes, highlights, discussion forum, accounts and profile, a single dark theme, a back-to-top button, offline use.

## Modules
| Track | Modules |
|---|---|
| Getting started | 01 Start Here, 02 Intro to Programming and Web Development, 03 How the Web Works, 04 Choosing Your Language |
| Foundations | 05 Programming Fundamentals, 06 HTML, 07 CSS, 08 JavaScript, 09 Advanced JavaScript |
| Front-end frameworks | 10 React, 11 Vue |
| Back end | 12 Back-End Development, 13 Databases (SQL and NoSQL), 14 Data Manipulation and Visualisation, 15 API Development, 16 Authentication and Security |
| Engineering practice | 17 Advanced Programming (OOP, concurrency, testing, packaging), 18 DevOps and Deployment, 19 Capstone Project, 20 Final Exam |

## Run it
```bash
cd backend && npm install && npm start     # http://localhost:3000
```
Without `DATABASE_URL` it uses an in-memory Postgres (pg-mem): fine for development, data is lost on restart.
With PostgreSQL: `DATABASE_URL=postgres://user:pass@host/db JWT_SECRET=... npm start` (`backend/schema.sql` is applied automatically).

## Three ways to use it
| Edition | How | Notes |
|---|---|---|
| Hosted web app | deploy (below) | accounts and sync, forum, installable PWA; the Service Worker caches every lesson, script and the SQL engine |
| Standalone offline file | `python3 build-offline.py` -> `offline/course-offline.html` | one 2 MB file, double-click, no server or internet; everything including the SQL sandbox works; local profile and forum |
| Mobile app (iOS/Android) | `cd mobile && npm i && npm run sync-offline && npx expo start` | React Native (Expo) WebView: hosted course online, bundled copy offline. Set `COURSE_URL` in `mobile/App.js` |

## Editing the course
Lessons are Markdown in `content/*.md` (see `content/README.md` for the authoring format). After editing:
```bash
python3 build-content.py        # compiles content/ -> modules/*.html, js/modules-data.js (stops on any error)
node tools/check-challenges.js  # every JS challenge: solution passes all tests, starter fails
node tools/check-sql.js         # every SQL sandbox and challenge
python3 tools/check-snippets.py # compiles/runs each language tab (needs node, python3, javac, gcc, php, ruby, go)
python3 build-offline.py        # refresh the single-file edition
```

## Structure
```
index.html  css/style.css  js/ (app, quiz, widgets, languages, highlight, runner, modules-data)  modules/*.html  vendor/sql/  sw.js  manifest.json
content/    Markdown source of all lessons and the glossary
tools/      diagram generator and the content checkers      build-content.py  build-offline.py
backend/    server.js db.js auth.js routes/api.js schema.sql test/
tests/e2e.js  Playwright end-to-end test (register, pass a module test, sync, final exam, certificate)
offline/    generated single-file edition       mobile/  Expo app
Dockerfile docker-compose.yml Caddyfile render.yaml Procfile .github/workflows/ci.yml
```

## How the code runner stays safe
Learner code runs in a Web Worker served from `js/runner.js`, which has its own Content-Security-Policy, a time limit,
and no access to the page, cookies or storage. The rest of the site keeps a strict CSP without `unsafe-eval`.
The single-file edition uses a Blob worker instead.

## API (Express, JWT auth, bcrypt, helmet, rate-limited auth)
`POST /api/auth/register|login` · `GET|PUT|DELETE /api/me` · `GET|PUT /api/sync` (progress, bookmarks, notes, highlights, plus language choice, solved challenges and best scores in `learner_data`)
· `POST /api/quizzes/:module/attempts` · `GET /api/grades` · `GET /api/admin/stats` (admin/instructor RBAC)
· `GET|POST /api/forum`, `GET /api/forum/:id`, `DELETE /api/forum/:id` (staff) · `GET /api/health`

## Deploy (with domain and HTTPS)
The full walkthrough is in **`docs/GO_LIVE.md`**: choosing a host, domain and HTTPS, making an admin, installing the app on phones and computers, updating, backups, security, legal pages, monitoring and app stores.

Quick versions:
* **Render** (recommended): push to GitHub, New > Blueprint, pick the repo. `render.yaml` creates an always-on web service and a paid PostgreSQL database that does not expire. `render.demo.yaml` is a free demo only (sleeps when idle; its database expires after 30 days).
* **Your own server**: install Docker, copy `.env.example` to `.env` (set `JWT_SECRET`, `DB_PASSWORD`, `DOMAIN`, `PUBLIC_URL`), point the domain's A record at the server, then `docker compose up -d --build`. Caddy gets and renews the HTTPS certificate.
* **Heroku**: `heroku create && heroku addons:create heroku-postgresql && heroku config:set JWT_SECRET=$(openssl rand -hex 32) PGSSL=true PUBLIC_URL=https://your-domain && git push heroku main`.
* **Admin account**: register in the app, then `cd backend && DATABASE_URL=... npm run make-admin -- you@example.com admin`.
* Vercel and Netlify suit static hosting only; the Express API needs a server host.

## Known limits
Nothing has been deployed for you (no domain or certificate). C# examples cannot be compiled in the build environment and were reviewed by eye; the other six languages are compiled or run by `tools/check-snippets.py`. HTML/CSS are taught with quizzes, playgrounds and labs rather than auto-graded challenges. The mobile app is a thin wrapper and has not been run on a device.
