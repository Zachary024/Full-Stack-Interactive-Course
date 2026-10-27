# Going live: publish, install, run and maintain the course

This guide takes you from the folder on your computer to a public website with your own domain that people can
install like an app. Read section 1, pick one hosting path in section 3, then work down the checklist in section 14.

Prices and free-tier limits below were checked in October 2026. Hosting companies change them, so look at the
pricing page before you pay.

---

## 1. What you are publishing

| Piece | What it is | Where it lives |
|---|---|---|
| The website | Static lessons, quizzes, challenges, projects, cheat sheets (`index.html`, `css/`, `js/`, `modules/`, `vendor/`) | Served by the Node server |
| The API | Accounts, progress sync, forum, grades (`backend/`, Express) | Same Node server, under `/api` |
| The database | Users, progress, forum, quiz attempts (PostgreSQL) | A separate database service |
| The installable app | The same website, installed from the browser (a PWA: manifest + service worker) | Nothing extra to host |
| The single-file edition | `offline/course-offline.html`, a download that works with no internet and no account | Served at `/offline/course-offline.html` |
| Store apps (optional) | Android and iOS wrappers | Sections 9 and 10 |

"Make it a web app people can download" is covered by the PWA. Once the site is on HTTPS, Chrome, Edge and
Samsung Internet on Android and desktop offer an Install button, and the course keeps working offline. On iPhone
and iPad people use Share, then Add to Home Screen. I checked the manifest in Chromium: it reports **no
installability errors**, the service worker registers, and the lessons load with the network switched off.

You do **not** need an app store to let people install it. Stores are optional extras.

---

## 2. What you need before you start

1. A **GitHub account** (free) to hold the code. Render and most hosts deploy from it.
2. A **domain name** (for example `learn.yourname.com`), bought from any registrar. About a few dollars to a
   little more than ten dollars a year depending on the ending. You can also start on the free address the host gives you.
3. **Git** on your computer: <https://git-scm.com/downloads>.
4. A payment card for the host (not for the free demo).
5. About 1 hour for the first launch.

---

## 3. Choose a hosting path

| | Path A: Render (recommended) | Path B: Your own server (VPS + Docker) | Path C: Free demo |
|---|---|---|---|
| Effort | Lowest. Click-through setup, automatic HTTPS, deploys on every `git push` | Medium. You manage a Linux server | Lowest |
| Always on | Yes on the paid plan | Yes | **No.** Sleeps after 15 minutes; first visit then takes about a minute |
| Data safe | Yes with the paid database | Yes, if you keep backups (section 8) | **No.** The free database expires after 30 days and is deleted 14 days later |
| Cost | Web service from about 7 USD a month, plus a small paid database | A small VPS, usually about 5 to 10 USD a month | 0 |
| Use for | A real launch | A real launch with more control | Showing it to friends, testing the steps |

Why not just use the free tier for launch: Render's own docs state that free web services spin down after 15 minutes
without traffic, lose local files, and that **free Postgres databases expire 30 days after creation**, with deletion
after a 14-day grace period. Real learners would lose their accounts. The repository's `render.yaml` therefore uses
paid, non-expiring plans, and `render.demo.yaml` is the free demo.

A cheaper "real" option: run the web service on Render's paid plan and keep the database on **Neon** (free
PostgreSQL, 1 GB per project, no time limit, sleeps after 5 minutes of inactivity and wakes on the next query).
See section 3A, step 6.

---

## 3A. Path A: Render, step by step

### 1. Put the code on GitHub

```bash
cd course                       # the folder that contains README.md and backend/
git init
git add .
git commit -m "Full stack course"
# on github.com: New repository (private is fine), then:
git branch -M main
git remote add origin https://github.com/YOUR-NAME/YOUR-REPO.git
git push -u origin main
```

`.gitignore` already keeps `.env` and `node_modules` out. **Never commit a file with real passwords.**

### 2. Create the services

1. Sign up at <https://render.com> and connect your GitHub account.
2. **New**, then **Blueprint**, pick your repository. Render reads `render.yaml` and proposes a web service
   (`fullstack-course`, Starter plan) and a PostgreSQL database (`course-db`).
3. It asks for `PUBLIC_URL`. Enter the address you will use, for example `https://learn.yourname.com`
   (use the `https://xxxx.onrender.com` address for now if you have no domain yet; you can edit it later).
4. Click **Apply**. The first build takes a few minutes.

`JWT_SECRET` is generated for you, and `DATABASE_URL` is wired to the database automatically.

### 3. Check it works

Open `https://YOUR-SERVICE.onrender.com/api/health`. You should see `{"status":"ok", ...}`. Then open the home
page, register an account, finish a quiz, sign out and sign in again. If your progress is still there, the
database is connected.

### 4. Add your domain

1. In the web service, **Settings**, **Custom Domains**, **Add**. Enter `learn.yourname.com`.
2. Render shows the DNS record to create. At your registrar's DNS page add exactly that record (normally a
   `CNAME` for a subdomain such as `learn`, or the records Render lists for a bare domain like `yourname.com`).
3. Wait from a few minutes up to a few hours, then click **Verify**. Render issues the HTTPS certificate on its
   own and renews it.
4. Set `PUBLIC_URL` to the final `https://...` address (Environment tab) and redeploy.
5. Tell the world the address starts with `https://`. Installing the app only works on HTTPS.

### 5. Make yourself the administrator

New accounts are students. Register in the app first, then promote your account (use a terminal on your
own computer):

```bash
cd course/backend
npm install
PGSSL=true DATABASE_URL="PASTE-THE-EXTERNAL-DATABASE-URL" npm run make-admin -- you@example.com admin
```

The **External Database URL** is on the database's page in the Render dashboard. If the connection is refused,
add your computer's IP address in the database's access-control settings. Roles are `student`, `instructor`
and `admin`. Admins and instructors can read `/api/admin/stats` and delete forum posts.

### 6. Optional: keep the database on Neon instead

1. Create a project at <https://neon.com>, copy the connection string (it ends with `?sslmode=require`).
2. In `render.yaml` delete the whole `databases:` block and the `fromDatabase` lines, and add
   `- key: DATABASE_URL` with `sync: false` so you paste the Neon string in the dashboard.
3. Neon's free plan can pause between visits, so the first request after a quiet period is a little slower.
   Paid Neon removes the pause.

### What it costs on Render

A Starter web service is about 7 USD a month (always on). The Hobby workspace itself is free. A paid Postgres
database is a few dollars a month more; see <https://render.com/pricing> for today's number.

---

## 3B. Path B: your own server (any VPS, AWS Lightsail, DigitalOcean, Hetzner and so on)

1. Create an Ubuntu 22.04 or 24.04 server. Point your domain's **A record** at the server's IP address.
2. Log in and install Docker: <https://docs.docker.com/engine/install/ubuntu/>.
3. Open only the web ports:
   ```bash
   sudo ufw allow OpenSSH && sudo ufw allow 80 && sudo ufw allow 443 && sudo ufw enable
   ```
4. Get the code and configure it:
   ```bash
   git clone https://github.com/YOUR-NAME/YOUR-REPO.git course && cd course
   cp .env.example .env
   nano .env      # set JWT_SECRET (run: openssl rand -hex 32), DB_PASSWORD, DOMAIN and PUBLIC_URL
   ```
5. Start everything (app, PostgreSQL, Caddy for automatic HTTPS):
   ```bash
   docker compose up -d --build
   docker compose logs -f app
   ```
6. Visit `https://your-domain`. Caddy gets the certificate by itself.
7. Make yourself admin after registering:
   ```bash
   docker compose exec app node backend/scripts/make-admin.js you@example.com admin
   ```
8. Update later with `git pull && docker compose up -d --build`.

Keep the server patched (`sudo apt update && sudo apt upgrade` every few weeks), use SSH keys instead of a
password, and never open port 5432 to the internet. The compose file does not publish it.

---

## 3C. Path C: free demo

Create the Blueprint from `render.demo.yaml` instead of `render.yaml` (pick the file when Render asks, or rename
it). It works the same, sleeps when idle, and the database vanishes after the limits above. Fine for a preview,
not for learners.

---

## 4. After launch: the five-minute check

1. `https://your-domain/api/health` returns `ok`.
2. Register, take a quiz, sign out, sign in: progress is kept.
3. Lighthouse in Chrome DevTools (Lighthouse tab, "Progressive Web App" and "Best practices") has no red items.
   DevTools, Application, **Manifest** shows no errors and the service worker is "activated".
4. Turn on airplane mode, reload: the lessons still open.
5. Open <https://your-domain/robots.txt> and `/sitemap.xml`.
6. Paste your address into WhatsApp, LinkedIn or X to see the preview card (title and image come from the page).
7. Open it on a real phone and install it (section 5).

---

## 5. How learners install it

| Device | How |
|---|---|
| Android (Chrome, Edge, Samsung Internet) | Tap **Install** in the top bar of the course, or the browser menu, **Install app** |
| Windows, macOS, Linux (Chrome or Edge) | Click the install icon at the right end of the address bar, or the **Install** button in the course |
| iPhone and iPad (Safari) | Tap **Share**, then **Add to Home Screen** |
| Any device, no install | Download the single-file edition from the home page, "Offline ready" card; open it in any browser |

The home page tells people about all of these. The installed app opens without browser bars, has the shortcut
menu entries (My progress, Projects, Cheat sheets) and keeps working offline.

---

## 6. Updating the course safely

The normal loop:

```bash
# 1. edit lessons in content/*.md  (or css/, js/)
python3 build-content.py            # compiles lessons; stops on any error
node tools/check-challenges.js      # every challenge solution still passes
node tools/check-sql.js
cd backend && npm test && cd ..     # API smoke tests
```

Before you publish a change that touches the website files, **raise the cache version** in `sw.js`
(`const VERSION = 'v10'` to `'v11'`). Installed apps check for a new service worker when they open; a new
version number makes every device fetch the new lessons instead of showing old cached ones. Then:

```bash
python3 build-offline.py            # refresh the downloadable single-file edition
git add -A && git commit -m "Describe the change" && git push
```

Render redeploys by itself after the push (about 2 to 5 minutes). On your own server run
`git pull && docker compose up -d --build`.

Good habits: work on a branch (`git switch -c new-lesson`), open a pull request, let the GitHub Actions workflow
(`.github/workflows/ci.yml`) run the checks, then merge. Tag releases (`git tag v1.1 && git push --tags`) so you can roll back.

Rolling back: in Render, **Deploys**, pick an earlier deploy, **Rollback**. On a server, `git checkout <tag>` and
rebuild. The database is not changed by a code rollback.

Database changes: `backend/schema.sql` runs on every start and only uses `CREATE TABLE IF NOT EXISTS`. If you add a
column later, add an `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...` line there; do not rename or drop columns on a
live database without a backup (section 8).

---

## 7. Managing people and content

**Honest note:** the app has no admin screen yet. Managing people is done with a few commands, shown here. A small
admin page (user list, forum moderation, class statistics, delete account) is a sensible next feature; ask me to
build it when you are ready.

* **Roles:** `student` (default), `instructor`, `admin`. Change with the `make-admin` command in sections 3A and 3B.
* **Sign in from a terminal** to get a token (replace the address and credentials):
  ```bash
  curl -s -X POST https://your-domain/api/auth/login -H 'Content-Type: application/json' \
       -d '{"email":"you@example.com","password":"YOUR-PASSWORD"}'
  # copy the "token" value, then:
  TOKEN=paste-token-here
  ```
* **Class overview** (admin or instructor): `curl -s https://your-domain/api/admin/stats -H "Authorization: Bearer $TOKEN"`
  returns total users, quiz attempts and the average score.
* **Forum moderation** (admin or instructor): find the post number in the forum URL or the database, then
  `curl -s -X DELETE https://your-domain/api/forum/POST-ID -H "Authorization: Bearer $TOKEN"`. Replies go with the post.
  There is no automatic spam filter, so watch the forum in the first weeks.
* **A learner wants their data deleted:** the API supports it (`DELETE /api/me` with their own token), but there is no
  button for it yet. Do it for them in the database: `DELETE FROM users WHERE lower(email) = lower('them@example.com');`
  Their progress, notes, attempts and forum posts are removed with the account (foreign keys cascade).
* **Looking at the database:** any host gives you a connection string. Use `psql "CONNECTION-STRING"` or a GUI such as
  DBeaver or TablePlus. Tables are defined in `backend/schema.sql`.

---

## 8. Backups and recovery

Your learners' accounts and progress live only in PostgreSQL. Treat backups as part of launch, not an extra.

**Render / any external database** (install the PostgreSQL client tools on your computer):

```bash
pg_dump "CONNECTION-STRING" | gzip > course-$(date +%F).sql.gz
# restore into an empty database:
gunzip -c course-2026-11-01.sql.gz | psql "CONNECTION-STRING"
```

**Docker on your own server:**

```bash
docker compose exec -T db pg_dump -U course course | gzip > ~/backups/course-$(date +%F).sql.gz
# restore:
gunzip -c ~/backups/course-2026-11-01.sql.gz | docker compose exec -T db psql -U course course
```

Run it every night with cron (`crontab -e`):

```
15 2 * * * cd /home/ubuntu/course && docker compose exec -T db pg_dump -U course course | gzip > /home/ubuntu/backups/course-$(date +\%F).sql.gz
```

Copy the files off the server (another cloud bucket or your own computer). A backup on the same disk is not a backup.
Also check what automatic backups your database plan includes, and **test one restore** before you need it.
Learners also have a safety net: the Progress page can export their progress as a file and import it back.

---

## 9. Security checklist

Already in place: passwords hashed with bcrypt, signed tokens, helmet security headers (including HSTS over HTTPS),
a rate limit on sign-in routes, JSON size limit, and a server that serves only the public front-end folders (not
the source or `.env`; the smoke test checks this). Things for you to do:

- [ ] `JWT_SECRET` is long and random, set only in the host's environment settings. Changing it logs everyone out.
- [ ] The database password is strong and the database is **not** open to the whole internet.
- [ ] `PUBLIC_URL` and, if you want, `CORS_ORIGIN=https://your-domain` are set.
- [ ] `.env` is never committed. If a secret ever reaches GitHub, change it immediately.
- [ ] Turn on GitHub **Dependabot alerts** and run `cd backend && npm audit` now and then.
- [ ] Use two-factor sign-in on GitHub, your host, your registrar and your email.
- [ ] Keep Docker images and the server updated.

Known limits you should plan around:

* **No "forgot password" or email verification yet.** A learner who forgets a password cannot recover the account (you can only delete it and let them register again).
  Fix: add an email provider (for example Resend, Postmark or SES) and a reset-token endpoint. Ask me to build it.
  Note that Render's free tier blocks outgoing mail ports, so use a provider with an HTTPS API.
* The sign-in token is kept in the browser's local storage, which is simple and works offline, but a cross-site
  scripting bug would expose it. The lessons escape user content, but review any change that inserts HTML.
* Rate limiting is per IP address. That is fine for a course; add a CDN such as Cloudflare in front if you are attacked.

---

## 10. Legal and privacy (do this before promoting it)

You collect names, email addresses, progress, notes and forum posts, and use the browser's local storage. Publish:

1. **Privacy policy:** what you collect, why, who can see it (you and the host), how long you keep it, how to delete
   an account, a contact email.
2. **Terms of use:** acceptable use of the forum, no cheating on certificates, your right to remove content.
3. **Cookies and storage notice:** the course uses local storage for sign-in, progress and notes, not tracking cookies.
   If you add analytics or ads later, update this.
4. Check the data-protection law that applies to you and your learners (in Nigeria, the Nigeria Data Protection Act
   2023 and the regulator's guidance; in the EU and UK, GDPR). A short consult with a lawyer is cheap compared with
   a complaint. I am not a lawyer and this is not legal advice.

Put the pages on a site section or a simple page linked from the footer and from the Profile page. Stores require a
privacy-policy link.

---

## 11. Monitoring and analytics

* **Uptime:** create a free monitor (UptimeRobot, Better Stack) that requests `https://your-domain/api/health`
  every 5 minutes and emails you. This also stops a free-tier service from sleeping, though it is not a substitute
  for a paid plan.
* **Logs:** Render, **Logs** tab; on your server `docker compose logs -f app`.
* **Errors:** optional, add Sentry later.
* **Visitors:** a privacy-friendly option is Plausible or Umami. The site's Content-Security-Policy only allows
  scripts from your own domain, so you must add the analytics domain in `backend/server.js` (`script-src` and
  `connect-src`) when you install one.
* **Alerts to set:** disk space on a VPS, database size (Neon free is 1 GB), and the certificate expiry (automatic
  on Render and Caddy).

---

## 12. Search engines and sharing

Done for you: page title and description, social preview image, canonical link, `robots.txt`, a basic
`sitemap.xml`, and the correct `PUBLIC_URL` filled into the page when it is served.

Limit: the course uses `#` routes (`/#html`), and search engines treat everything after `#` as the same page, so
only the home page is indexed. Learners find the course by name, link or social media, not by searching for
individual lessons. If lesson-level Google traffic matters, the course needs static, separately addressable lesson
pages. That is a rebuild of the delivery layer, not a small tweak.

Add the site to Google Search Console and Bing Webmaster Tools and submit `sitemap.xml` so the home page appears.

---

## 13. Optional: put it in the app stores

You do not need this, and the PWA install already gives people an app icon and offline use. Consider stores only
for discoverability.

**Google Play (practical, one-time cost of 25 USD).** Wrap the live site as a Trusted Web Activity:

1. Go live on HTTPS first and make sure the manifest passes (section 4).
2. Use <https://www.pwabuilder.com> (enter your URL, choose Android) or Google's Bubblewrap command-line tool.
3. It produces an Android App Bundle plus a `assetlinks.json` file. Save that file as
   `well-known/assetlinks.json` in the project; the server publishes it at `/.well-known/assetlinks.json`
   so Android can verify you own the domain. Redeploy.
4. Create a Google Play developer account, upload the bundle, add the privacy-policy link and screenshots.
   Google has quality rules such as installability and a minimum Lighthouse performance score, so run Lighthouse first.

**Apple App Store (99 USD a year).** Apple can reject apps that are only a website in a frame. The PWA install on
iPhone ("Add to Home Screen") costs nothing. If you still want a store listing, the Expo project in `mobile/`
is a starting point, but it has not been run on a device. Before using it: set `COURSE_URL` in `mobile/App.js` to
your live address, change `com.example.fullstackcourse` in `mobile/app.json` to your own identifier, run
`npm run sync-offline`, and build with Expo EAS (<https://docs.expo.dev/build/introduction/>). Expect to add native
features or at least offline reading to satisfy review.

---

## 14. Launch checklist

**Before**
- [ ] `python3 build-content.py`, `node tools/check-challenges.js`, `cd backend && npm test` all pass
- [ ] Course name, contact email and certificate wording are what you want (search the project for "Full Stack Development Course")
- [ ] Replace `course.example.com` placeholders: `.env`, `mobile/App.js`, and `PUBLIC_URL`
- [ ] Privacy policy and terms written and linked
- [ ] Repository on GitHub, `.env` not in it

**Launch**
- [ ] Deploy (Render Blueprint or `docker compose up -d --build`)
- [ ] Custom domain verified, HTTPS padlock showing
- [ ] `PUBLIC_URL` set to the final address
- [ ] Register and promote your admin account
- [ ] Section 4 checks pass, including install on a real Android phone and an iPhone

**Week one**
- [ ] Uptime monitor and email alerts running
- [ ] First nightly backup exists and one restore has been tested
- [ ] Search Console sitemap submitted
- [ ] Watch the forum and the logs; fix what real users hit

**Ongoing**
- [ ] Monthly: dependency updates (`npm audit`, Dependabot pull requests) and a restore test
- [ ] Every content change: bump `sw.js` `VERSION`, rebuild the offline file, push

---

## 15. Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| Build fails on the host with "JWT_SECRET must be set" | Set `JWT_SECRET` in the environment settings (Render's blueprint generates it) |
| Site works but accounts or sync fail | `DATABASE_URL` is wrong or the database is asleep or expired. Check the logs for `[db]` lines. With a managed database also set `PGSSL=true` unless the URL has `?sslmode=require` |
| Log says "using in-memory database" | `DATABASE_URL` is missing; learners' data will be lost on restart. Fix immediately |
| First page load takes a minute | Free web service woke from sleep. Upgrade the plan |
| No Install button | Not on HTTPS, or already installed, or the browser is Safari (use Add to Home Screen). In DevTools, Application, Manifest lists the reason |
| Learners see old lessons after an update | You did not change `VERSION` in `sw.js`. Bump it and redeploy; a hard reload fixes your own browser |
| Link preview shows no image | `PUBLIC_URL` not set, or the platform cached the old preview. Use the platform's debugger to refresh it |
| `502`/`Bad gateway` on your server | The app container stopped: `docker compose logs app`, then `docker compose up -d` |
| Certificate error on your server | The domain's A record does not point at the server yet, or ports 80 and 443 are closed |
| SQL playground or code runner is blank | The Content-Security-Policy was changed. Keep `'wasm-unsafe-eval'` and `worker-src blob:` in `backend/server.js` |
| Cannot connect to the database from your laptop | Add your IP in the database's access settings; use the **external** URL |

---

## 16. Cost summary (typical small launch)

| Item | Cost |
|---|---|
| Domain | a few dollars up to about ten dollars per year |
| Web hosting (Render Starter) or small VPS | about 5 to 10 USD per month |
| Database (Render paid, or Neon free to start) | 0 to a few dollars per month |
| HTTPS certificate | free (automatic) |
| Email for password resets (later) | free tiers cover small courses |
| Google Play (optional) | 25 USD once |
| Apple App Store (optional) | 99 USD per year |

Start with Path A and the domain. Everything else can wait until real learners arrive.
