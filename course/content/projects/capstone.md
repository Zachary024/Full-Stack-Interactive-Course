::: project release Release your capstone like a professional
Time: 6-8 hours
Level: Advanced
Skills: polishing, documentation, deployment, presenting your work, reflection

Your capstone application is built. This final project is about everything that turns working code into work you can show an employer or client: a clean repository, honest documentation, a live demo, and a clear explanation of what you made and what you learned. Treat it as a launch.

Requirements:
- The repository has a descriptive name, a one-line description, topics and a licence file.
- The README contains: what the app does, a screenshot or short animation, the technologies used, the features, how to run it locally in under five commands, the environment variables, how to run the tests, and the live link.
- An architecture section with one diagram showing the browser, the API, the database and any outside services, plus a paragraph on why you chose each.
- Tests run with one command, and the README shows the result. At least one test covers a failure, not only success.
- A security checklist is completed and added to the repository: passwords hashed, secrets outside the code, input validated, authentication and authorisation tested, dependencies audited (for example with `npm audit`) and HTTPS in use.
- The accessibility of the main pages is checked with the keyboard and an automated tool, and the findings are written down and fixed.
- The app is deployed, with a health check, and you can show it running from a device that is not your computer.
- A changelog or release notes for version 1.0.0, and a Git tag with that number.
- Record a demonstration of two to three minutes that shows the main user journey, and explains one technical decision you are proud of and one you would change.
- Write a one-page retrospective: what you planned, what you built, what went wrong, what you learned and what you would do next.

Steps:
1. Clean the repository: remove dead code, unused files and commented-out experiments, and check that no secret is in the history.
2. Write the README as if for a stranger, then ask someone to follow it and fix every place they get stuck.
3. Run the tests, the audit and the accessibility checks, and fix the issues.
4. Deploy the final version, and test the live site from your phone.
5. Tag the release and write the release notes.
6. Record the demonstration and write the retrospective.
7. Add the project to your portfolio, with a link to the live app and the code.

Starter:
```text
README outline

# Project name
One sentence: what it does and who it is for.

![screenshot](docs/screenshot.png)

## Live demo
<link>

## Features
- ...

## Built with
- ...

## Run it locally
1. git clone ...
2. cd ...
3. cp .env.example .env
4. npm install
5. npm start

## Tests
npm test

## Architecture
<diagram and a paragraph for each part>

## Security
<checklist>

## What I learned
<three honest points>
```

Hints:
- To find a secret you committed by mistake, search the history with `git log -p -S "the-secret"`. If you find one, change the secret first, then clean the history.
- A good screenshot shows the app with realistic data, not an empty page.
- Practise your demonstration once before recording and keep to the main journey.
- Being specific is more convincing than being impressive: "reduced load time from 4 s to 1.2 s by adding an index" beats "optimised performance".

Stretch:
- Write a short blog post about the project, covering one problem and how you solved it.
- Ask a friend to open an issue and fix it in a pull request to practise collaboration.
- Add continuous deployment, so a tag on the main branch publishes automatically.

Deliver:
- The repository link, the live link and the tagged release.
- The demonstration recording and the retrospective.

Rubric:
- Presentation | The repository and README make the project understandable and runnable in minutes.
- Quality | Tests, security checks and accessibility checks are done, documented and acted upon.
- Delivery | The app is deployed, monitored, versioned and released with notes.
- Reflection | The demonstration and the retrospective show clear thinking about decisions, mistakes and next steps.
:::
