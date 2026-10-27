# Tools and workflow
Absolute path | Relative path :: An absolute path starts from the root of the disk, such as /home/ada/app. A relative path starts from where you are now, such as ./app.
Agile | Scrum | Sprint :: A way of working in short cycles. A sprint is one cycle, often two weeks, after which the team reviews what it built.
Alias :: A short name you give to a longer command, such as gs for git status.
Archive | tar | zip :: A single file that holds many files, usually compressed to save space.
Backlog :: The ordered list of work a team plans to do.
Bash | Zsh | Shell :: A shell is the program that reads the commands you type in a terminal. Bash and Zsh are the common ones on Linux and macOS.
Blame :: A Git command that shows who last changed each line of a file and in which commit.
Build tool :: A program that turns source code into something you can run or deploy, such as Vite, Maven or Gradle.
Changelog :: A file that lists what changed in each version of a project.
Cherry-pick :: Copying one specific commit from one branch onto another.
Clone :: Downloading a full copy of a repository, with its history, to your computer.
Code review :: Having another person read your changes and give feedback before they are merged.
Daemon :: A program that runs in the background without a window, such as a web server.
Debugger :: A tool that lets you pause a running program, step through it line by line and inspect variables.
Detached HEAD :: A Git state where you have checked out a commit directly instead of a branch, so new commits belong to no branch.
Diff :: A comparison that shows exactly which lines were added, removed or changed between two versions.
Dotfile | Hidden file :: A file whose name starts with a dot, such as .gitignore. Hidden by default in most file listings.
Editor | IDE | VS Code :: A text editor is for writing code. An IDE, an integrated development environment, adds debugging, testing and tools. VS Code is a popular editor with extensions.
Exit code :: A number a command returns when it ends. 0 means success and any other number means an error.
Extension | Plugin :: An add-on that gives an editor or tool new features.
Fast-forward :: A merge where the target branch has no new commits, so Git just moves its pointer forward with no merge commit.
Flag | Option :: A setting you add to a command, such as -l or --help, to change how it behaves.
Fork :: Your own copy of someone else's repository, on GitHub, where you can make changes and offer them back through a pull request.
Formatter | Prettier :: A tool that rewrites your code in one consistent style automatically.
Git remote :: A copy of the repository hosted elsewhere. By convention the one you cloned from is called origin.
.gitignore :: A file listing the names and patterns that Git must not track, such as node_modules and secret files.
Glob | Wildcard :: A pattern that matches many file names, for example * for anything and ? for one character, as in *.txt.
HEAD :: Git's pointer to the commit or branch you are currently on.
Hot reload | Live reload :: A development feature that updates the browser automatically when you save a file.
Home directory :: Your personal folder, written as ~ in most shells.
Issue tracker | Ticket :: A list of bugs and tasks for a project, where each item is called an issue or ticket.
Kanban :: A board with columns such as To do, Doing and Done that shows the status of every task.
License | MIT License :: A document that says what others may do with your code. The MIT License is short and allows almost any use.
Lock file :: A file such as package-lock.json that records the exact version of every dependency, so every install gives the same result.
Markdown :: A simple way to format text using symbols like # for headings and * for lists. Used for README files.
Merge conflict :: What happens when two branches changed the same lines and Git cannot decide which version to keep, so you must choose.
MVP | Minimum viable product :: The smallest version of a product that is useful enough to test with real users.
node_modules :: The folder where npm puts the packages your project depends on. It is never committed to Git.
npm :: The package manager that comes with Node.js.
pip :: The package installer for Python.
PATH :: A list of folders the shell searches for programs. If a command is not found, its folder is probably missing from PATH.
Pipe :: The | symbol, which sends the output of one command into the input of the next, as in ls | grep txt.
PowerShell :: Microsoft's shell for Windows, which passes objects between commands instead of plain text.
Rebase :: Replaying your commits on top of another branch to create a straight, tidy history.
README :: The first file people read in a project, explaining what it is and how to run it.
Redirect :: Sending a command's output to a file instead of the screen, using > to overwrite or >> to append.
Root directory :: The top of the file system, written /, or a drive such as C:\ on Windows.
Script | Shell script :: A text file of commands that the shell runs in order.
Semantic versioning | SemVer :: A version scheme of MAJOR.MINOR.PATCH. Increase the major number for breaking changes, minor for new features and patch for fixes.
Staging area :: The place in Git where you collect the changes you want to include in the next commit, filled with git add.
Stash :: A Git feature that puts your unfinished changes aside so you can switch branch, and brings them back later.
stdin | stdout | stderr :: The three standard streams of a program: input, normal output and error output.
Superuser | root | sudo :: The all-powerful administrator account. sudo runs a single command with that power.
Symlink | Symbolic link :: A file that points to another file or folder, like a shortcut.
Tag (Git) :: A permanent label on a commit, usually used to mark a release such as v1.0.0.
Terminal emulator :: The window application that runs a shell, such as Windows Terminal, iTerm or GNOME Terminal.
Text editor :: A program for writing plain text and code, such as Notepad, nano, Vim or VS Code.
User story :: A short description of a feature from the user's point of view: As a learner, I want to save my progress so that I can continue later.
Working directory :: The folder a terminal or program is currently in. pwd shows it.
Process ID | PID :: The number the operating system gives each running process. You use it to stop a process.
Environment (shell) :: The set of variables, such as PATH and HOME, available to every program the shell starts.
Breakpoint (debugger) :: A marker on a line of code where the debugger pauses so you can inspect the program.
Watch mode :: Running a tool so it re-runs automatically every time you save a file.
Trunk-based development :: A workflow in which everyone merges small changes into one main branch often, instead of keeping long-lived branches.

# DevOps and cloud
Artifact :: A file produced by a build, such as a compiled program or a Docker image, stored so it can be deployed.
Autoscaling :: Automatically adding or removing servers as demand rises and falls.
AWS :: Amazon Web Services, the largest cloud provider.
Azure :: Microsoft's cloud platform.
Blue-green deployment :: Running two identical environments, switching users from the old one (blue) to the new one (green) when it is ready, and switching back if something goes wrong.
Bucket | Object storage | S3 :: A cloud service for storing files such as images and backups. S3 is Amazon's version.
Canary release :: Releasing a change to a small group of users first and watching for problems before giving it to everyone.
Container registry | Docker Hub :: A place to store and share container images. Docker Hub is the public default.
Docker Compose :: A tool that starts several containers together from one file, such as an app, a database and a cache.
Dockerfile :: A text file of instructions for building a Docker image.
Feature flag :: A switch that turns a feature on or off without redeploying, so unfinished work can ship hidden.
GitHub Actions :: GitHub's built-in system for running automated workflows, such as tests, on every push.
Google Cloud :: Google's cloud platform.
Health check :: A simple endpoint, often /health, that tells a platform whether the application is working.
IaaS | PaaS | SaaS :: Three levels of cloud service. IaaS rents raw servers, PaaS runs your code for you, and SaaS is finished software such as email.
Incident | Postmortem :: An incident is an outage or serious problem. A postmortem is the write-up afterwards about what happened and how to prevent it.
Infrastructure as code | IaC :: Describing servers and networks in files that can be versioned and re-run, instead of clicking in a dashboard. Terraform is an example.
Kubernetes | K8s :: A system that runs and manages many containers across many machines.
Metric :: A number measured over time, such as requests per second or memory used.
Monitoring | Observability :: Watching a running system through metrics, logs and traces so you can see how it behaves and why it fails.
Orchestration :: Automatically starting, stopping, connecting and healing many containers or services.
Port mapping :: Connecting a port on your computer to a port inside a container, such as -p 3000:3000.
Region | Availability zone :: A region is a geographic location of cloud data centres. A zone is one separate data centre within it.
Rollback :: Going back to the previous working version after a bad release.
Runner :: The machine that executes the steps of a CI job.
SLA | SLO :: A service level agreement is a promise to customers about uptime. A service level objective is the internal target.
Tracing | Distributed tracing :: Following one request as it passes through many services to find where time is spent.
Twelve-factor app :: A set of twelve guidelines for building apps that are easy to deploy and scale, such as keeping configuration in the environment.
Uptime :: The share of time that a service is working, such as 99.9 percent.
Virtual machine | VM :: A complete computer simulated by software, with its own operating system. Heavier than a container.
Volume (Docker) :: Storage that lives outside a container so data survives when the container is removed.
Zero-downtime deployment :: Releasing a new version without users noticing any interruption.
Heroku :: An early and still popular platform for deploying apps with a simple git push.
Build pipeline :: The automated sequence from code change to a built, tested and released product.

# Testing and quality
Acceptance test :: A test that checks the software does what the user actually asked for.
Assertion :: A statement in a test that must be true, such as expecting add(2, 3) to equal 5. If it is false, the test fails.
Benchmark :: A test that measures how fast code runs.
Boundary value :: A value at the edge of what is allowed, such as 0, 1 and 100 for a score from 1 to 100. Bugs often hide there.
Code coverage :: The percentage of your code that runs during tests.
Code smell :: A hint in the code, such as a very long function, that something deserves redesign. It is not a bug.
Edge case :: An unusual situation your code must still handle, such as an empty list or a very long name.
End-to-end test | E2E :: A test that drives the whole application the way a user does, usually through a real browser.
Fixture :: Fixed starting data or setup used by tests so each one begins from a known state.
Flaky test :: A test that sometimes passes and sometimes fails without any change in the code.
Integration test :: A test that checks that several parts, such as the API and the database, work together.
Jest | pytest | JUnit :: Popular test frameworks for JavaScript, Python and Java.
Load testing :: Simulating many users at once to see how a system copes.
Profiling | Profiler :: Measuring where a program spends its time or memory, so you improve the real bottleneck.
Regression :: A bug in something that used to work, usually caused by a new change. Regression tests guard against it.
Smoke test :: A quick check that the most important functions work at all, run after each deployment.
Static analysis :: Examining code for problems without running it.
Stub :: A simple stand-in that returns fixed answers, used in a test instead of a real service.
Test case :: One scenario with a given input and an expected result.
Test runner :: A tool that finds and runs your tests and reports which passed.
Test suite :: A collection of tests.
Test-driven development | TDD :: Writing a failing test first, then the code that makes it pass, then tidying up.
Type checking | Type checker :: Checking that values are used according to their types, before running the program.

# Architecture and design
API-first :: Designing the API contract before building the code behind it or the interface that uses it.
Backward compatibility :: A newer version still working with things built for the older version.
Breaking change :: A change that makes existing users or clients stop working unless they update.
Brownfield | Greenfield :: Greenfield is a brand-new project. Brownfield is work on an existing system with history and constraints.
Cache invalidation :: Deciding when stored copies are out of date and must be thrown away. A famously hard problem.
Client-server model :: The basic design of the web: clients ask for things and servers provide them.
Cohesion :: How closely the parts of a module belong together. High cohesion is good.
Component library :: A shared set of ready-made interface parts, such as buttons and forms.
Coupling :: How much one part of a system depends on another. Low coupling is good.
Dependency injection :: Giving a piece of code the things it needs from outside, instead of letting it create them, which makes it easier to test.
Deprecation :: Marking a feature as outdated, to be removed in a future version.
Design pattern :: A well-known, reusable solution to a common design problem, such as Observer or Factory.
Design system :: A set of rules, components and guidelines that keeps a product's look and behaviour consistent.
DRY :: Don't Repeat Yourself: every piece of knowledge should live in one place.
Factory :: A pattern where a function or class creates objects for you, so callers need not know which exact class is built.
Fault tolerance :: The ability of a system to keep working when part of it fails.
KISS :: Keep It Simple: the simplest solution that works is usually the best.
Layered architecture :: Splitting an application into layers, such as presentation, business logic and data, where each only talks to the one below.
Legacy code :: Old code that is still in use, often with no tests or documentation.
Monorepo :: One repository that holds the code for many projects or services.
Observer pattern :: A pattern where objects subscribe to another object and are told when it changes.
Prototype :: An early, rough version built to test an idea.
Separation of concerns :: Giving each part of a program one clear job, so changes in one place do not break another.
Single point of failure :: One component whose failure takes the whole system down.
Singleton :: A pattern that allows only one instance of a class to exist.
SOLID :: Five object-oriented design principles: single responsibility, open-closed, Liskov substitution, interface segregation and dependency inversion.
Technical debt :: The future cost of shortcuts taken today. Like financial debt, it accrues interest.
Three-tier architecture :: A design with a presentation tier, a logic tier and a data tier.
Trade-off :: Giving up one quality to gain another, such as speed against simplicity.
Wireframe :: A simple sketch of a page's layout that ignores colours and style.
YAGNI :: You Aren't Gonna Need It: do not build a feature until it is really needed.
Availability :: The proportion of time a system is up and able to serve users.

# Learning and habits
Code kata :: A small coding exercise repeated for practice, like a musician's scales.
Deliberate practice :: Practice that targets what you cannot yet do, with feedback, rather than repeating what is easy.
Documentation | Docs :: Written guidance on how to use a tool. Reading the official docs is a core developer skill.
Full stack developer :: A developer who can work on both the front end and the back end of an application.
Growth mindset :: The belief that ability grows with effort, which makes mistakes useful rather than shameful.
Hackathon :: A short event where people build projects together, often in a day or a weekend.
Imposter syndrome :: The feeling that you are not good enough and will be found out, common even among experienced developers.
Junior developer :: A developer early in their career, who works with guidance and learns on the job.
Learning in public :: Sharing what you build and learn through posts, repositories or talks, which creates a record and feedback.
Mentor :: An experienced person who gives advice and feedback on your growth.
Minimal reproducible example | MRE :: The smallest piece of code that still shows your problem, which makes it easy for others to help you.
Pair programming :: Two people working together on one computer, taking turns to write code and review it.
Portfolio :: A collection of your best projects, shown to employers and clients.
Software engineer :: A person who designs, builds, tests and maintains software.
Stack Overflow (website) :: A question-and-answer site for programmers, a common place to find solutions to errors.
Technical interview :: A hiring interview where you solve coding or design problems and explain your thinking.
Timeboxing :: Giving a task a fixed amount of time, then stopping to review progress instead of getting lost.
Tutorial hell :: Getting stuck watching tutorial after tutorial without building anything alone. The way out is projects.
Tech stack :: The set of technologies a product is built with, such as React, Node.js and PostgreSQL.
Cheat sheet :: A short reference page of commands or syntax you look up often.
