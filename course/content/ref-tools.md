---
id: ref-tools
number: 103
title: Developer Tools Cheat Sheet
track: Reference
duration: Reference
level: All levels
summary: Commands for npm, Python and pip, Docker, Docker Compose, curl, SSH, databases, Vim and nano, all in one searchable page.
kind: reference
---

::: note
These are the tools you will meet in nearly every project. Each table lists the commands in the order you usually need them. Replace anything in angle brackets with your own value.
:::

## Node.js and npm

::: cheat Node and npm
cols: Task ;; Command ;; Notes
code: 2
Check the Node version ;; node --version ;; Use a version manager such as nvm for several versions
Run a JavaScript file ;; node app.js ;; Runs outside the browser
Start an interactive prompt ;; node ;; Press Ctrl+D to leave
Create a package.json ;; npm init -y ;; Accepts all the defaults
Install all the dependencies ;; npm install ;; Reads package.json. Also written npm i
Install a package ;; npm install express ;; Adds it to dependencies
Install a package for development only ;; npm install --save-dev jest ;; Tools such as test runners and linters
Install an exact version ;; npm install express@4.19.2 ;; Pins the version
Install a package everywhere on your computer ;; npm install -g <package> ;; Command-line tools only
Install exactly what the lock file says ;; npm ci ;; Faster and stricter. Use in CI and Docker
Remove a package ;; npm uninstall <package> ;; Updates package.json
Run a script from package.json ;; npm run <script> ;; For example npm run build
Run the start script ;; npm start ;; Shortcut for npm run start
Run the tests ;; npm test ;; Shortcut for npm run test
Show outdated packages ;; npm outdated ;; Current, wanted and latest versions
Update packages within allowed versions ;; npm update ;; Respects the version ranges
Check for known security problems ;; npm audit ;; Reports vulnerable dependencies
Fix security problems automatically ;; npm audit fix ;; Review the changes it makes
List installed packages ;; npm ls --depth=0 ;; Top-level packages only
Run a package without installing it ;; npx <package> ;; Downloads and runs it once
Create a project with Vite ;; npm create vite@latest ;; Choose React, Vue or plain JavaScript
Show a package's information ;; npm view <package> ;; Versions, licence and links
Clear the npm cache ;; npm cache clean --force ;; A last resort when installs misbehave
:::

::: cheat package.json fields
cols: Field ;; What it is ;; Example
code: 3
name ;; The package name (lower case, no spaces) ;; "name": "my-app"
version ;; Three numbers: major, minor, patch ;; "version": "1.0.0"
scripts ;; Named commands you run with npm run ;; "scripts": { "start": "node server.js" }
dependencies ;; Packages needed to run the app ;; "dependencies": { "express": "^4.19.2" }
devDependencies ;; Packages needed only to build and test ;; "devDependencies": { "jest": "^29.0.0" }
main ;; The file that is loaded when others import the package ;; "main": "index.js"
type ;; Use "module" for import and export syntax ;; "type": "module"
engines ;; The Node versions the project supports ;; "engines": { "node": ">=20" }
:::

::: cheat Version ranges
cols: Written as ;; Allows ;; Means
code: 1
^1.4.2 ;; 1.4.2 up to, but not including, 2.0.0 ;; New features and fixes, but no breaking changes
~1.4.2 ;; 1.4.2 up to, but not including, 1.5.0 ;; Fixes only
1.4.2 ;; Exactly 1.4.2 ;; Pinned
>=1.4.2 ;; 1.4.2 or anything newer ;; Risky, can include breaking changes
* ;; Any version ;; Avoid
:::

## Python and pip

::: cheat Python
cols: Task ;; macOS and Linux ;; Windows
code: 2,3
Check the Python version ;; python3 --version ;; python --version
Run a script ;; python3 app.py ;; python app.py
Start the interactive prompt ;; python3 ;; python
Create a virtual environment ;; python3 -m venv .venv ;; python -m venv .venv
Activate it ;; source .venv/bin/activate ;; .venv\Scripts\Activate.ps1
Leave the virtual environment ;; deactivate ;; deactivate
Install a package ;; pip install requests ;; pip install requests
Install from a requirements file ;; pip install -r requirements.txt ;; pip install -r requirements.txt
Save the installed packages ;; pip freeze > requirements.txt ;; pip freeze > requirements.txt
List installed packages ;; pip list ;; pip list
Show information about a package ;; pip show <package> ;; pip show <package>
Uninstall a package ;; pip uninstall <package> ;; pip uninstall <package>
Run a module as a script ;; python3 -m http.server 8000 ;; python -m http.server 8000
Run the tests ;; python3 -m pytest ;; python -m pytest
Run a one-line program ;; python3 -c "print(2 + 2)" ;; python -c "print(2 + 2)"
Format JSON from a pipe ;; echo '{"a":1}' | python3 -m json.tool ;; echo '{"a":1}' | python -m json.tool
:::

## Docker

::: cheat Docker images and containers
cols: Task ;; Command ;; Notes
code: 2
Check Docker is working ;; docker --version ;; Docker Desktop or Engine must be running
Run a container ;; docker run hello-world ;; Downloads the image if needed
Run in the background with a port ;; docker run -d -p 3000:3000 <image> ;; Host port, then container port
Give the container a name ;; docker run -d --name web <image> ;; Easier than the generated ID
Run and remove when it stops ;; docker run --rm <image> ;; Keeps your machine tidy
Open a shell inside an image ;; docker run -it <image> sh ;; Use bash if the image has it
Pass an environment variable ;; docker run -e NODE_ENV=production <image> ;; Repeat -e for more
Mount a folder from your computer ;; docker run -v "$(pwd)":/app <image> ;; Changes appear on both sides
List running containers ;; docker ps ;; Add -a to include stopped ones
Stop a container ;; docker stop <name> ;; Waits politely, then forces
Start a stopped container ;; docker start <name> ;; Keeps its data
Remove a container ;; docker rm <name> ;; Add -f for a running one
View a container's logs ;; docker logs <name> ;; Add -f to follow
Run a command in a running container ;; docker exec -it <name> sh ;; Open a shell inside it
Show container details ;; docker inspect <name> ;; Long JSON about settings and networks
Show resource use ;; docker stats ;; Live CPU and memory
List images ;; docker images ;; Shows the sizes
Build an image from a Dockerfile ;; docker build -t myapp . ;; The dot is the folder to build from
Build with a version tag ;; docker build -t myapp:1.0 . ;; Name:tag
Download an image ;; docker pull <image> ;; Without running it
Upload an image ;; docker push <user>/<image> ;; You must be logged in
Log in to a registry ;; docker login ;; Docker Hub by default
Delete an image ;; docker rmi <image> ;; Containers using it must go first
Clean up unused things ;; docker system prune ;; Removes stopped containers and unused data
:::

::: cheat Dockerfile instructions
cols: Instruction ;; Purpose ;; Example
code: 3
FROM ;; Choose the starting image ;; FROM node:20-alpine
WORKDIR ;; Set the working folder inside the image ;; WORKDIR /app
COPY ;; Copy files in from your computer ;; COPY package*.json ./
RUN ;; Run a command while building ;; RUN npm ci --omit=dev
ENV ;; Set an environment variable ;; ENV NODE_ENV=production
EXPOSE ;; Document the port the app uses ;; EXPOSE 3000
USER ;; Run as a different user ;; USER node
CMD ;; The command that starts the container ;; CMD ["node", "server.js"]
ENTRYPOINT ;; A fixed command that CMD adds arguments to ;; ENTRYPOINT ["python"]
ARG ;; A value you can give at build time ;; ARG VERSION=1.0
HEALTHCHECK ;; How Docker tests that the app is healthy ;; HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1
:::

::: cheat Docker Compose
cols: Task ;; Command ;; Notes
code: 2
Start all services ;; docker compose up ;; Reads docker-compose.yml
Start in the background ;; docker compose up -d ;; Detached
Rebuild the images and start ;; docker compose up --build ;; After changing a Dockerfile
Stop and remove everything ;; docker compose down ;; Add -v to delete the volumes too
Show the services ;; docker compose ps ;; Status of each
Follow the logs ;; docker compose logs -f ;; Add a service name for one
Run a command in a service ;; docker compose exec <service> sh ;; Open a shell
Run a one-off command ;; docker compose run --rm <service> <command> ;; A fresh container
Restart a service ;; docker compose restart <service> ;; Without rebuilding
Check the file for mistakes ;; docker compose config ;; Prints the final merged file
:::

## curl, SSH and databases

::: cheat curl
cols: Task ;; Command ;; Notes
code: 2
Fetch a URL ;; curl https://example.com ;; Prints the response body
Show headers and body ;; curl -i <url> ;; Status line, headers, then the body
Show only headers ;; curl -I <url> ;; Sends a HEAD request
Show everything that happens ;; curl -v <url> ;; Great for debugging
Be quiet but show errors ;; curl -sS <url> ;; Hides the progress bar
Follow redirects ;; curl -L <url> ;; Needed for many short links
Save to a file ;; curl -o file.html <url> ;; Use -O to keep the remote name
Use another method ;; curl -X DELETE <url> ;; GET is the default
Send a header ;; curl -H "Authorization: Bearer <token>" <url> ;; Repeat -H for more
Send JSON ;; curl -X POST -H "Content-Type: application/json" -d '{"name":"Ada"}' <url> ;; The -d sets the body
Send a form ;; curl -d "name=Ada&age=30" <url> ;; URL-encoded
Upload a file ;; curl -F "file=@photo.png" <url> ;; Multipart form
Send a cookie ;; curl -b "session=abc" <url> ;; Use -c to save cookies
Use basic authentication ;; curl -u user:password <url> ;; Avoid for real passwords
Limit the time ;; curl --max-time 10 <url> ;; Seconds
Print only the status code ;; curl -s -o /dev/null -w "%{http_code}" <url> ;; Good for scripts
Time a request ;; curl -w "%{time_total}\n" -o /dev/null -s <url> ;; Total seconds
:::

::: cheat SSH and remote files
cols: Task ;; Command ;; Notes
code: 2
Create a key pair ;; ssh-keygen -t ed25519 -C "you@example.com" ;; Press Enter to accept the defaults
Show your public key ;; cat ~/.ssh/id_ed25519.pub ;; Safe to share. Never share the one without .pub
Connect to a server ;; ssh <user>@<host> ;; Exit with exit or Ctrl+D
Connect on another port ;; ssh -p 2222 <user>@<host> ;; Default is 22
Use a particular key ;; ssh -i ~/.ssh/<key> <user>@<host> ;; Path to the private key
Run one command remotely ;; ssh <user>@<host> "ls -la" ;; Prints the result locally
Copy a file to a server ;; scp <file> <user>@<host>:<path> ;; Upload
Copy a file from a server ;; scp <user>@<host>:<path> <file> ;; Download
Sync a folder efficiently ;; rsync -avz <folder>/ <user>@<host>:<path> ;; Sends only what changed
Forward a port ;; ssh -L 8080:localhost:3000 <user>@<host> ;; Open localhost:8080 to reach the server's 3000
Make the key file private ;; chmod 600 ~/.ssh/<key> ;; SSH refuses keys that others can read
Test your GitHub connection ;; ssh -T git@github.com ;; Greets you by name when it works
:::

::: cheat PostgreSQL (psql) and SQLite
cols: Task ;; Command ;; Notes
code: 2
Connect to a database ;; psql -U <user> -d <database> ;; Add -h <host> for another computer
Connect with a connection string ;; psql "postgres://user:pass@host:5432/db" ;; The format of DATABASE_URL
List databases ;; \l ;; Inside psql
List tables ;; \dt ;; Inside psql
Describe a table ;; \d <table> ;; Columns, types and indexes
Switch database ;; \c <database> ;; Inside psql
Run a script file ;; psql -d <database> -f schema.sql ;; From the shell
Toggle expanded output ;; \x ;; Easier to read wide rows
Quit psql ;; \q ;; Or Ctrl+D
Create a database ;; createdb <name> ;; From the shell
Back up a database ;; pg_dump <database> > backup.sql ;; A plain SQL file
Restore a backup ;; psql <database> < backup.sql ;; Replays the SQL
Open a SQLite file ;; sqlite3 data.db ;; Creates it if missing
List SQLite tables ;; .tables ;; Inside sqlite3
Show SQLite columns ;; .schema <table> ;; Shows the CREATE statement
Show column headings in SQLite ;; .headers on ;; Then .mode column
Leave sqlite3 ;; .quit ;; Or Ctrl+D
Start MongoDB shell ;; mongosh <connection-string> ;; Connects to a MongoDB server
:::

## Text editors in the terminal

::: note
Open nano with `nano <file>`. Its shortcuts are listed at the bottom of its own screen. The caret sign (^) there means the Ctrl key.
:::

::: cheat nano (the beginner's editor)
cols: Task ;; Shortcut ;; Notes
kbd: 2
Save ;; Ctrl+O ;; Then press Enter to confirm the name
Exit ;; Ctrl+X ;; Asks to save if there are changes
Cut the current line ;; Ctrl+K ;; Fills the clipboard
Paste ;; Ctrl+U ;; Pastes what you cut
Search ;; Ctrl+W ;; Press again for the next match
Go to a line number ;; Ctrl+Shift+Minus ;; Or Alt+G on some versions
Undo ;; Alt+U ;; On macOS use Option+U
Show the line numbers ;; Alt+Shift+3 ;; Toggles
Copy the current line ;; Alt+6 ;; Then paste with Ctrl+U
:::

::: cheat Vim essentials
cols: Task ;; Keys ;; Notes
code: 2
Open a file ;; vim <file> ;; Type this in the shell
Enter insert mode (start typing) ;; i ;; Press Esc to return to normal mode
Go back to normal mode ;; Esc ;; Everything below is typed in normal mode
Save ;; :w ;; Then press Enter
Save and quit ;; :wq ;; Or ZZ
Quit without saving ;; :q! ;; The escape hatch
Move left, down, up, right ;; h j k l ;; Arrow keys also work
Jump to the start of a line ;; 0 ;; And $ jumps to the end
Jump to the top of the file ;; gg ;; And G jumps to the bottom
Jump forward one word ;; w ;; And b jumps back
Delete a line ;; dd ;; Also copies it
Copy a line ;; yy ;; Yank
Paste below ;; p ;; P pastes above
Undo ;; u ;; Ctrl+R redoes
Search ;; /text ;; Press n for the next match
Replace everywhere ;; :%s/old/new/g ;; Add c to confirm each one
Show line numbers ;; :set number ;; Turn off with :set nonumber
:::

::: tip
If you open Vim by accident and cannot leave, press **Esc**, then type `:q!` and press **Enter**. It is the most famous trap in computing, and now you know the way out.
:::
