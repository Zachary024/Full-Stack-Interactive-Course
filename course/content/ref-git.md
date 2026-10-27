---
id: ref-git
number: 102
title: Git and GitHub Cheat Sheet
track: Reference
duration: Reference
level: All levels
summary: Every Git command you will use, grouped by what you are trying to do, with fixes for the most common mistakes.
kind: reference
---

::: note
Git keeps a history of your project as a series of snapshots called commits. Nearly everything below is one of three ideas: **record** changes (add, commit), **move around** history (branch, switch, merge) or **share** (push, pull). Replace placeholders in angle brackets with your own values.
:::

## Setting up

::: cheat First-time setup
cols: Task ;; Command ;; Notes
code: 2
Set your name ;; git config --global user.name "Your Name" ;; Appears on every commit you make
Set your email ;; git config --global user.email "you@example.com" ;; Use the same email as your GitHub account
Use main as the default branch ;; git config --global init.defaultBranch main ;; New repositories start with main
Set your editor ;; git config --global core.editor "code --wait" ;; Opens VS Code for commit messages
Make pulls rebase by default ;; git config --global pull.rebase false ;; false means merge, true means rebase
Show all your settings ;; git config --list ;; Add --show-origin to see which file each came from
Create a short alias ;; git config --global alias.st status ;; Then git st works
Start a new repository here ;; git init ;; Creates a hidden .git folder
Copy a repository from GitHub ;; git clone <url> ;; Downloads the files and the whole history
Clone into a specific folder ;; git clone <url> <folder> ;; Names the folder yourself
Clone only the latest snapshot ;; git clone --depth 1 <url> ;; Faster for big projects when you do not need history
:::

## The everyday cycle

::: cheat Record changes
cols: Task ;; Command ;; Notes
code: 2
See what has changed ;; git status ;; Run this often. It tells you what to do next
Short status ;; git status -s ;; M modified, A added, ?? untracked
Stage one file ;; git add <file> ;; Choose what goes into the next commit
Stage everything ;; git add . ;; Stages new, changed and deleted files in this folder
Stage parts of a file ;; git add -p ;; Choose chunk by chunk
Commit what is staged ;; git commit -m "Add login form" ;; Write the message in the present tense
Stage tracked files and commit ;; git commit -am "Fix typo" ;; Does not include new files
Change the last commit message ;; git commit --amend -m "New message" ;; Only if you have not pushed it
Add forgotten files to the last commit ;; git commit --amend --no-edit ;; Stage the files first
See unstaged changes ;; git diff ;; Compares working files with the staging area
See staged changes ;; git diff --staged ;; What the next commit will contain
Delete a file and stage the deletion ;; git rm <file> ;; Removes it from disk and from Git
Stop tracking a file but keep it ;; git rm --cached <file> ;; Use after adding it to .gitignore
Rename or move a file ;; git mv <old> <new> ;; Git records it as a rename
:::

::: cheat Look at history
cols: Task ;; Command ;; Notes
code: 2
List commits ;; git log ;; Press q to quit
One line per commit ;; git log --oneline ;; Short ID and message
Draw the branches ;; git log --oneline --graph --all ;; A map of your history
Show one commit ;; git show <commit> ;; The message and the changes
History of one file ;; git log --follow -p <file> ;; Includes renames
Who changed each line ;; git blame <file> ;; Find out when and why a line appeared
Search commit messages ;; git log --grep="login" ;; Finds matching messages
Search for code that was added or removed ;; git log -S"functionName" ;; Finds when a string appeared or vanished
Commits by one person ;; git log --author="Ada" ;; Matches name or email
Commits since a date ;; git log --since="2 weeks ago" ;; Understands natural dates
Compare two branches ;; git diff main..feature ;; What feature has that main does not
Find the commit that broke something ;; git bisect start ;; Then mark commits good or bad. Git finds the culprit
:::

::: tip
Write commit messages in the present tense and make each one a single logical change: "Add password validation", not "stuff" or "fixes and other things". Your future self will search these messages.
:::

## Branches and merging

::: cheat Branches
cols: Task ;; Command ;; Notes
code: 2
List branches ;; git branch ;; The current branch has a star
List including remote branches ;; git branch -a ;; Remote ones start with remotes/
Create a branch ;; git branch <name> ;; Does not switch to it
Switch to a branch ;; git switch <name> ;; Older form: git checkout <name>
Create and switch ;; git switch -c <name> ;; The usual way to start new work
Rename the current branch ;; git branch -m <new-name> ;; Use -M to force
Delete a merged branch ;; git branch -d <name> ;; Safe: refuses if not merged
Delete a branch regardless ;; git branch -D <name> ;; You may lose commits
Merge a branch into the current one ;; git merge <name> ;; Run it on the branch that should receive the changes
Merge and always create a merge commit ;; git merge --no-ff <name> ;; Keeps the branch visible in the history
Cancel a merge in progress ;; git merge --abort ;; Go back to before the merge
Replay your commits on top of another branch ;; git rebase main ;; Makes a straight history. Never rebase shared branches
Copy one commit to the current branch ;; git cherry-pick <commit> ;; Useful for pulling in a single fix
Put unfinished work aside ;; git stash ;; Your working folder becomes clean
Bring stashed work back ;; git stash pop ;; Applies and removes the stash
List your stashes ;; git stash list ;; Each has a number
:::

::: cheat Fixing a merge conflict
cols: Step ;; What to do ;; Command
code: 3
1 ;; Run the merge and read which files conflict ;; git status
2 ;; Open each file and find the markers: lines with <<<<<<<, ======= and >>>>>>> ;; (edit the file)
3 ;; Keep the code you want and delete the markers ;; (edit the file)
4 ;; Mark the file as fixed ;; git add <file>
5 ;; Finish the merge ;; git commit
Give up ;; Return to the state before the merge ;; git merge --abort
Take their version of a file ;; Use the other branch's copy ;; git checkout --theirs <file>
Take your version of a file ;; Use the current branch's copy ;; git checkout --ours <file>
:::

## Sharing work

::: cheat Remotes
cols: Task ;; Command ;; Notes
code: 2
List remotes ;; git remote -v ;; Usually one called origin
Add a remote ;; git remote add origin <url> ;; Connect a local repository to GitHub
Change a remote address ;; git remote set-url origin <url> ;; For example after renaming a repository
Download new commits without merging ;; git fetch ;; Safe: changes nothing in your files
Fetch and merge ;; git pull ;; Fetch followed by merge
Fetch and rebase ;; git pull --rebase ;; Keeps a straight history
Upload your branch ;; git push ;; After the first push
Upload a new branch and link it ;; git push -u origin <branch> ;; The -u remembers the link
Delete a remote branch ;; git push origin --delete <branch> ;; After merging
Upload tags ;; git push --tags ;; Tags are not pushed automatically
Safer force push ;; git push --force-with-lease ;; Refuses if someone else pushed. Never plain --force on shared branches
Show a remote's details ;; git remote show origin ;; Branches and tracking info
Remove remote branches that no longer exist ;; git fetch --prune ;; Tidies the list
:::

::: cheat Tags and releases
cols: Task ;; Command ;; Notes
code: 2
List tags ;; git tag ;; Alphabetical
Create a lightweight tag ;; git tag v1.0.0 ;; Just a label on the current commit
Create an annotated tag ;; git tag -a v1.0.0 -m "First release" ;; Stores a message and the author
Tag an older commit ;; git tag v0.9.0 <commit> ;; Add a label to history
Delete a tag ;; git tag -d v1.0.0 ;; Local only
Check out a tag ;; git switch --detach v1.0.0 ;; Look around without changing a branch
:::

## Undoing things

::: pitfall
Before any undo, run `git status` and `git log --oneline` so you know where you are. Commits you have already pushed are shared. Use `git revert` for those, never rewrite them.
:::

::: cheat Undo and recover
cols: I want to ... ;; Command ;; What happens
code: 2
Discard changes in one file ;; git restore <file> ;; Your edits are lost. They cannot be recovered
Unstage a file but keep the edits ;; git restore --staged <file> ;; Reverses git add
Undo the last commit, keep the changes staged ;; git reset --soft HEAD~1 ;; Commit disappears, files stay
Undo the last commit, keep the changes unstaged ;; git reset HEAD~1 ;; Same as --mixed
Undo the last commit and delete the changes ;; git reset --hard HEAD~1 ;; Dangerous. The edits are gone
Throw away all local changes ;; git reset --hard ;; Dangerous. Resets files to the last commit
Remove untracked files ;; git clean -fd ;; Dangerous. Use -n first to preview
Undo a pushed commit safely ;; git revert <commit> ;; Adds a new commit that cancels the old one
Find a commit you lost ;; git reflog ;; A log of everywhere HEAD has been. Commits survive for weeks
Go back to a lost commit ;; git reset --hard <hash-from-reflog> ;; Restores it
Get one file from another commit ;; git restore --source=<commit> <file> ;; Brings back an old version
Remove a file you committed by mistake ;; git rm --cached <file> ;; Then commit and add it to .gitignore
:::

## Ignoring files and good habits

::: cheat .gitignore patterns
cols: Pattern ;; Meaning ;; Example match
code: 1
node_modules/ ;; Ignore a folder anywhere ;; node_modules/express/index.js
*.log ;; Ignore every file ending in .log ;; debug.log
.env ;; Ignore this file name ;; .env
/build ;; Ignore only at the top level ;; build/app.js
!keep.log ;; Do not ignore this file, even if another rule matches ;; keep.log
docs/*.pdf ;; Files directly inside docs ;; docs/guide.pdf
**/temp ;; A folder called temp at any depth ;; a/b/temp
# comment ;; A line that starts with # is ignored ;; (a note to people)
:::

::: cheat GitHub workflow
cols: Step ;; What to do ;; Command or place
code: 3
1 ;; Copy the project to your account ;; Click Fork on GitHub
2 ;; Download your copy ;; git clone <your-fork-url>
3 ;; Create a branch for your change ;; git switch -c fix-typo
4 ;; Make and commit your changes ;; git add . and git commit -m "Fix typo"
5 ;; Upload the branch ;; git push -u origin fix-typo
6 ;; Open a pull request ;; Click Compare and pull request on GitHub
7 ;; Respond to review comments by committing again ;; git commit and git push
8 ;; After it is merged, update your copy ;; git switch main and git pull
9 ;; Delete the finished branch ;; git branch -d fix-typo
:::

::: best
Commit small and often. Pull before you start work and before you push. Never commit passwords, keys or `.env` files, and add a `.gitignore` in your first commit. If you do commit a secret, treat it as stolen: change it immediately.
:::
