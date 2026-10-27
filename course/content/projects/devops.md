::: project ship-it Containerise, test and deploy
Time: 4-6 hours
Level: Intermediate
Skills: Docker, Compose, continuous integration, environment configuration, deployment, monitoring

Take one of your own applications (the bookmarks API is ideal) and give it a professional delivery process. Every push runs the tests automatically, builds a container image, and the app ends up running on the internet with a health check you can monitor. Anyone should be able to start your project with one command.

Requirements:
- A `Dockerfile` that uses a specific base image tag, copies dependency files first so layers are cached, installs only production dependencies, runs as a non-root user and starts the app with a clear command.
- A `.dockerignore` that keeps `node_modules`, `.git` and secret files out of the image.
- A `docker-compose.yml` that starts the app and a database (or any second service) with a named volume for data, a published port and the settings read from an environment file.
- A `.env.example` listing every setting with safe sample values. The real `.env` is in `.gitignore`.
- A `/health` endpoint, and a `HEALTHCHECK` (or a Compose health check) that uses it.
- A GitHub Actions workflow that runs on every push and pull request: install dependencies, run the tests and build the image. A failing test must stop the pipeline.
- The workflow caches dependencies, and you can show the time saved on a second run.
- The application is deployed to a free or low-cost host (for example Render, Fly.io or a small virtual server) with its settings stored as the host's secrets, and it runs over HTTPS.
- The README has a section titled "Run it" with the exact commands for local development, for Docker and for the live site, with the live URL.
- Simulate a failure on purpose (a broken test, then a bad configuration value) and record what the pipeline and the health check showed. Roll back to a working version.

Steps:
1. Write the `Dockerfile`, build it and run it locally. Confirm that `/health` answers.
2. Write the Compose file and bring the whole stack up with `docker compose up`.
3. Create the workflow file, push it and watch the first run. Fix whatever fails.
4. Choose a host, create the service and add the secrets in its dashboard, not in the code.
5. Deploy and open the live URL. Check HTTPS and the health endpoint.
6. Break something on purpose, observe, then roll back.
7. Finish the README, and ask a friend to follow it from scratch.

Starter:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
USER node
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "server.js"]
```
```yaml
name: ci
on:
  push:
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
      - run: npm test
      - run: docker build -t my-app .
```

Hints:
- If the container cannot be reached, make sure the app listens on `0.0.0.0` and not only on `localhost`, and that the port is published.
- Order the `Dockerfile` so that things that change least come first. Copying `package.json` before the source makes rebuilds fast.
- Read the failing job's log from the top. The first red line is usually the real cause.
- Never print secrets in logs. If you commit one by accident, change it at once, because deleting the commit is not enough.

Stretch:
- Add a deploy job that runs only on the main branch after the tests pass.
- Add an uptime monitor with an alert to your email.
- Add a second environment (staging) and promote the same image to production.

Deliver:
- The repository with the files above.
- The live URL, and a screenshot of a green pipeline run and of the failed run.
- Your short write-up of the failure drill.

Rubric:
- Containers | The image is small, secure (non-root, no secrets) and rebuilds quickly, and Compose starts everything with one command.
- Automation | The pipeline tests every change, fails when tests fail and uses caching.
- Operations | The live app has HTTPS and a health check, and the settings come from secrets.
- Documentation | A newcomer can run the project locally and understand how it is deployed, using only the README.
:::
