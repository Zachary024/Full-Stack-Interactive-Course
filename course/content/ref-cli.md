---
id: ref-cli
number: 101
title: Command Line Cheat Sheet
track: Reference
duration: Reference
level: All levels
summary: Every command-line task a developer meets, side by side for macOS and Linux (bash, zsh) and Windows (PowerShell). Filter, copy and reuse.
kind: reference
---

::: note
**How to use this page.** Type in the filter box to search every table at once. Press **Copy** next to a command to put it on your clipboard. The left command column is for macOS and Linux (Bash or Zsh), and the right one is for Windows PowerShell. Words in angle brackets, such as `<file>`, are placeholders for your own values. Commands marked with a dash do not have a simple equivalent.
:::

::: tip
Stuck inside a command that will not stop? Press **Ctrl+C**. Not sure what a command does? Run `man <command>` (macOS and Linux) or `Get-Help <command>` (PowerShell), or add `--help` after the command.
:::

## Moving around and managing files

::: cheat Navigation
cols: Task ;; macOS and Linux ;; Windows PowerShell
code: 2,3
Show the current folder ;; pwd ;; Get-Location
List files ;; ls ;; Get-ChildItem
List with details and sizes ;; ls -lh ;; Get-ChildItem | Format-List
List including hidden files ;; ls -la ;; Get-ChildItem -Force
List files newest first ;; ls -lt ;; Get-ChildItem | Sort-Object LastWriteTime -Descending
Go into a folder ;; cd <folder> ;; Set-Location <folder>
Go up one folder ;; cd .. ;; Set-Location ..
Go to your home folder ;; cd ~ ;; Set-Location ~
Go back to the previous folder ;; cd - ;; Set-Location -
Show a folder tree ;; tree -L 2 ;; tree /F
Clear the screen ;; clear ;; Clear-Host
:::

::: cheat Creating, copying, moving and deleting
cols: Task ;; macOS and Linux ;; Windows PowerShell
code: 2,3
Make a folder ;; mkdir <folder> ;; New-Item -ItemType Directory <folder>
Make nested folders ;; mkdir -p a/b/c ;; New-Item -ItemType Directory -Force a/b/c
Create an empty file ;; touch <file> ;; New-Item <file>
Copy a file ;; cp <file> <copy> ;; Copy-Item <file> <copy>
Copy a folder and its contents ;; cp -r <folder> <copy> ;; Copy-Item <folder> <copy> -Recurse
Move or rename ;; mv <old> <new> ;; Move-Item <old> <new>
Delete a file ;; rm <file> ;; Remove-Item <file>
Delete a folder and everything in it ;; rm -r <folder> ;; Remove-Item <folder> -Recurse
Ask before each deletion ;; rm -i <file> ;; Remove-Item <file> -Confirm
Delete an empty folder ;; rmdir <folder> ;; Remove-Item <folder>
Create a link to a file ;; ln -s <target> <link> ;; New-Item -ItemType SymbolicLink -Path <link> -Target <target>
Show a file's type ;; file <file> ;; (Get-Item <file>).Extension
Show disk space used ;; du -sh <folder> ;; (Get-ChildItem <folder> -Recurse | Measure-Object Length -Sum).Sum
Show free disk space ;; df -h ;; Get-PSDrive -PSProvider FileSystem
:::

::: pitfall
`rm` and `Remove-Item` do not use a recycle bin. A deleted file is gone. Never run `rm -rf` with a path you have not read twice, and never paste it from a stranger.
:::

## Reading and searching files

::: cheat Viewing files
cols: Task ;; macOS and Linux ;; Windows PowerShell
code: 2,3
Print a whole file ;; cat <file> ;; Get-Content <file>
Page through a long file ;; less <file> ;; Get-Content <file> | more
First 10 lines ;; head <file> ;; Get-Content <file> -TotalCount 10
First 25 lines ;; head -n 25 <file> ;; Get-Content <file> -TotalCount 25
Last 10 lines ;; tail <file> ;; Get-Content <file> -Tail 10
Follow a log file as it grows ;; tail -f <file> ;; Get-Content <file> -Wait -Tail 10
Count lines, words and bytes ;; wc <file> ;; Get-Content <file> | Measure-Object -Line -Word -Character
Count lines only ;; wc -l <file> ;; (Get-Content <file>).Count
Show file with line numbers ;; cat -n <file> ;; Get-Content <file> | ForEach-Object { $i++; "$i $_" }
Compare two files ;; diff <a> <b> ;; Compare-Object (Get-Content <a>) (Get-Content <b>)
Show file size and date ;; stat <file> ;; Get-Item <file> | Format-List *
:::

::: cheat Finding things
cols: Task ;; macOS and Linux ;; Windows PowerShell
code: 2,3
Find files by name ;; find . -name "*.js" ;; Get-ChildItem -Recurse -Filter *.js
Find folders by name ;; find . -type d -name "src" ;; Get-ChildItem -Recurse -Directory -Filter src
Find files changed in the last day ;; find . -mtime -1 ;; Get-ChildItem -Recurse | Where-Object LastWriteTime -gt (Get-Date).AddDays(-1)
Find files bigger than 10 MB ;; find . -size +10M ;; Get-ChildItem -Recurse | Where-Object Length -gt 10MB
Search for text in a file ;; grep "error" <file> ;; Select-String "error" <file>
Search ignoring case ;; grep -i "error" <file> ;; Select-String "error" <file>
Search a whole folder ;; grep -r "TODO" . ;; Select-String "TODO" -Path *.* -Recurse
Show line numbers of matches ;; grep -n "error" <file> ;; Select-String "error" <file>
Show only the names of files that match ;; grep -rl "TODO" . ;; Select-String "TODO" -Path *.* -Recurse | Select-Object -Unique Path
Show lines that do NOT match ;; grep -v "debug" <file> ;; Select-String "debug" <file> -NotMatch
Count the matches ;; grep -c "error" <file> ;; (Select-String "error" <file>).Count
Show lines around each match ;; grep -C 2 "error" <file> ;; Select-String "error" <file> -Context 2
Find where a command lives ;; which <command> ;; Get-Command <command>
Show what a command is ;; type <command> ;; Get-Command <command> | Format-List
:::

## Pipes, redirection and chaining

::: plain
A **pipe** (`|`) feeds the output of one command into the next, like water through connected pipes. **Redirection** sends output to a file instead of the screen. Together they let you build powerful tools out of small commands.
:::

::: cheat Combining commands
cols: Syntax ;; What it does ;; Example
code: 1,3
cmd1 | cmd2 ;; Send the output of cmd1 into cmd2 ;; ls | grep ".txt"
cmd > file ;; Write output to a file, replacing it ;; ls > files.txt
cmd >> file ;; Append output to the end of a file ;; echo "done" >> log.txt
cmd < file ;; Use a file as the input of a command ;; sort < names.txt
cmd 2> file ;; Write only the error messages to a file ;; npm test 2> errors.txt
cmd > file 2>&1 ;; Write normal output and errors to the same file ;; npm test > all.txt 2>&1
cmd > /dev/null ;; Throw the output away ;; npm install > /dev/null
cmd1 && cmd2 ;; Run cmd2 only if cmd1 succeeded ;; mkdir out && cd out
cmd1 || cmd2 ;; Run cmd2 only if cmd1 failed ;; cd out || echo "no such folder"
cmd1 ; cmd2 ;; Run cmd2 after cmd1, whatever happens ;; clear ; ls
cmd & ;; Run a command in the background ;; node server.js &
$(cmd) ;; Use the output of a command inside another ;; echo "Today is $(date)"
cmd | tee file ;; Show the output and also save it to a file ;; npm test | tee results.txt
cmd | xargs cmd2 ;; Turn lines of output into arguments for another command ;; find . -name "*.log" | xargs rm
!! ;; Repeat the previous command ;; sudo !!
$? ;; The exit code of the last command (0 means success) ;; ls missing ; echo $?
:::

::: cheat Text processing
cols: Task ;; macOS and Linux ;; Windows PowerShell
code: 2,3
Sort lines ;; sort <file> ;; Get-Content <file> | Sort-Object
Sort numbers ;; sort -n <file> ;; Get-Content <file> | Sort-Object { [int]$_ }
Remove duplicate lines (sorted) ;; sort <file> | uniq ;; Get-Content <file> | Sort-Object -Unique
Count how many times each line appears ;; sort <file> | uniq -c ;; Get-Content <file> | Group-Object | Select-Object Count, Name
Show one column of a table ;; awk '{print $2}' <file> ;; Get-Content <file> | ForEach-Object { ($_ -split '\s+')[1] }
Split on a character and take a field ;; cut -d, -f2 <file> ;; Import-Csv <file> | Select-Object -ExpandProperty <column>
Replace text in the output ;; sed 's/old/new/g' <file> ;; (Get-Content <file>) -replace 'old','new'
Replace text inside a file ;; sed -i 's/old/new/g' <file> ;; (Get-Content <file>) -replace 'old','new' | Set-Content <file>
Change upper case to lower case ;; tr 'A-Z' 'a-z' < <file> ;; (Get-Content <file>).ToLower()
Join lines with a comma ;; paste -sd, <file> ;; (Get-Content <file>) -join ','
Show unique values from a column ;; cut -d, -f1 <file> | sort -u ;; Import-Csv <file> | Select-Object -Unique <column>
Pretty-print JSON ;; cat <file> | python3 -m json.tool ;; Get-Content <file> | ConvertFrom-Json | ConvertTo-Json -Depth 10
Read one value from JSON ;; jq '.name' <file> ;; (Get-Content <file> | ConvertFrom-Json).name
Show a date ;; date ;; Get-Date
Show a date in a format ;; date +%Y-%m-%d ;; Get-Date -Format yyyy-MM-dd
Print text ;; echo "hello" ;; Write-Output "hello"
:::

## Permissions and ownership

::: cheat Permissions (macOS and Linux)
cols: Task ;; Command ;; Meaning
code: 2
Show permissions ;; ls -l ;; The first column looks like -rwxr-xr-- : type, then owner, group and others
Make a file executable ;; chmod +x <file> ;; Allow the file to be run as a program
Remove write access for others ;; chmod o-w <file> ;; o means others, - removes, w is write
Set exact permissions (owner all, others read) ;; chmod 744 <file> ;; 7 is rwx, 4 is r--
Typical permissions for a file ;; chmod 644 <file> ;; Owner can read and write, everyone else can read
Typical permissions for a folder or program ;; chmod 755 <file> ;; Owner can do everything, others can read and run
Keep a secret file private ;; chmod 600 <file> ;; Only the owner can read and write (required for SSH keys)
Change a folder and everything in it ;; chmod -R 755 <folder> ;; Applies the change recursively
Change the owner ;; sudo chown <user> <file> ;; Gives the file to another user
Change owner and group ;; sudo chown <user>:<group> <file> ;; Sets both at once
Run one command as administrator ;; sudo <command> ;; Runs with the power of the root user. Use with care
Show who you are ;; whoami ;; Prints your user name
Show your groups ;; groups ;; Lists the groups you belong to
:::

::: note
Each permission is a number: read is 4, write is 2 and execute is 1. Add them up for each of the three groups (owner, group, others). So 7 is 4+2+1 (everything), 6 is 4+2 (read and write), 5 is 4+1 (read and run), and 4 is read only. The look-up page has a full chmod calculator table.
:::

## Processes and the system

::: cheat Processes
cols: Task ;; macOS and Linux ;; Windows PowerShell
code: 2,3
List running processes ;; ps aux ;; Get-Process
Find a process by name ;; ps aux | grep node ;; Get-Process node
Live view of processes ;; top ;; Get-Process | Sort-Object CPU -Descending | Select-Object -First 10
Stop a process by ID ;; kill <pid> ;; Stop-Process -Id <pid>
Force a process to stop ;; kill -9 <pid> ;; Stop-Process -Id <pid> -Force
Stop processes by name ;; pkill node ;; Stop-Process -Name node
Find what is using a port ;; lsof -i :3000 ;; Get-NetTCPConnection -LocalPort 3000
Run in the background and keep running after you log out ;; nohup <command> & ;; Start-Process <command>
List background jobs ;; jobs ;; Get-Job
Bring a background job to the front ;; fg ;; Receive-Job
Time how long a command takes ;; time <command> ;; Measure-Command { <command> }
Repeat a command every 2 seconds ;; watch -n 2 <command> ;; while ($true) { <command>; Start-Sleep 2 }
Wait a number of seconds ;; sleep 5 ;; Start-Sleep 5
:::

::: cheat System information
cols: Task ;; macOS and Linux ;; Windows PowerShell
code: 2,3
Show the operating system ;; uname -a ;; Get-ComputerInfo | Select-Object OsName, OsVersion
Show memory use ;; free -h ;; Get-CimInstance Win32_OperatingSystem | Select-Object FreePhysicalMemory
Show how long the computer has been on ;; uptime ;; (Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
Show the current date and time ;; date ;; Get-Date
Show your computer name ;; hostname ;; hostname
Show environment variables ;; env ;; Get-ChildItem Env:
Show one environment variable ;; echo $HOME ;; $env:USERPROFILE
Set a variable for this session ;; export NAME=value ;; $env:NAME = "value"
Show the folders searched for commands ;; echo $PATH ;; $env:PATH -split ';'
Add a folder to the PATH for this session ;; export PATH="$PATH:/new/folder" ;; $env:PATH += ";C:\new\folder"
Show the command history ;; history ;; Get-History
Show the version of a tool ;; node --version ;; node --version
Show the Linux or macOS manual for a command ;; man <command> ;; Get-Help <command>
Open the current folder in the file manager ;; open . ;; ii .
:::

## Networking

::: cheat Network commands
cols: Task ;; macOS and Linux ;; Windows PowerShell
code: 2,3
Test that a machine is reachable ;; ping example.com ;; Test-Connection example.com
Download a page and show it ;; curl https://example.com ;; Invoke-WebRequest https://example.com
Show only the response headers ;; curl -I https://example.com ;; (Invoke-WebRequest https://example.com).Headers
Save a download to a file ;; curl -o page.html https://example.com ;; Invoke-WebRequest https://example.com -OutFile page.html
Follow redirects ;; curl -L https://example.com ;; Invoke-WebRequest https://example.com
Send a JSON POST request ;; curl -X POST -H "Content-Type: application/json" -d '{"a":1}' <url> ;; Invoke-RestMethod <url> -Method Post -ContentType application/json -Body '{"a":1}'
Look up a domain name ;; nslookup example.com ;; Resolve-DnsName example.com
Trace the route to a server ;; traceroute example.com ;; Test-NetConnection example.com -TraceRoute
Check whether a port is open ;; nc -zv example.com 443 ;; Test-NetConnection example.com -Port 443
Show your IP addresses ;; ip addr ;; Get-NetIPAddress
Show listening ports ;; ss -tulpn ;; Get-NetTCPConnection -State Listen
Download a file with wget ;; wget <url> ;; Invoke-WebRequest <url> -OutFile <file>
Connect to another computer ;; ssh <user>@<host> ;; ssh <user>@<host>
Copy a file to another computer ;; scp <file> <user>@<host>:<path> ;; scp <file> <user>@<host>:<path>
:::

## Archives, scripting and the shell itself

::: cheat Archives
cols: Task ;; macOS and Linux ;; Windows PowerShell
code: 2,3
Create a zip file ;; zip -r out.zip <folder> ;; Compress-Archive <folder> out.zip
Unzip a file ;; unzip out.zip ;; Expand-Archive out.zip
Create a compressed tar archive ;; tar -czf out.tar.gz <folder> ;; tar -czf out.tar.gz <folder>
Extract a tar archive ;; tar -xzf out.tar.gz ;; tar -xzf out.tar.gz
List what is inside an archive ;; tar -tzf out.tar.gz ;; tar -tzf out.tar.gz
Calculate a file checksum ;; shasum -a 256 <file> ;; Get-FileHash <file>
:::

::: cheat Shell scripting basics
cols: Idea ;; Bash and Zsh ;; PowerShell
code: 2,3
First line of a script ;; #!/usr/bin/env bash ;; (not needed, save as .ps1)
Run a script ;; bash script.sh ;; .\script.ps1
Create a variable ;; name="Ada" ;; $name = "Ada"
Use a variable ;; echo "Hello $name" ;; Write-Output "Hello $name"
Read input from the user ;; read -p "Name: " name ;; $name = Read-Host "Name"
Condition ;; if [ "$a" = "b" ]; then echo yes; fi ;; if ($a -eq "b") { "yes" }
Check that a file exists ;; [ -f <file> ] && echo yes ;; if (Test-Path <file>) { "yes" }
Loop over a list ;; for f in *.txt; do echo $f; done ;; foreach ($f in Get-ChildItem *.txt) { $f.Name }
Count from 1 to 5 ;; for i in 1 2 3 4 5; do echo $i; done ;; 1..5 | ForEach-Object { $_ }
Define a function ;; greet() { echo "Hi $1"; } ;; function greet($n) { "Hi $n" }
Stop on the first error ;; set -e ;; $ErrorActionPreference = "Stop"
Make a short name for a command ;; alias gs="git status" ;; Set-Alias gs Get-Location
Comment ;; # a comment ;; # a comment
:::

## Keyboard shortcuts in the terminal

::: cheat Editing the command line
cols: Task ;; Shortcut ;; Notes
kbd: 2
Stop the running command ;; Ctrl+C ;; Sends an interrupt to the program
Exit the shell ;; Ctrl+D ;; Works when the line is empty
Clear the screen ;; Ctrl+L ;; Same as the clear command
Go to the start of the line ;; Ctrl+A ;; Also Home
Go to the end of the line ;; Ctrl+E ;; Also End
Delete the word before the cursor ;; Ctrl+W ;; Bash and Zsh
Delete from the cursor to the start of the line ;; Ctrl+U ;; Bash and Zsh
Delete from the cursor to the end of the line ;; Ctrl+K ;; Bash and Zsh
Move back one word ;; Alt+B ;; On macOS use Option+B
Move forward one word ;; Alt+F ;; On macOS use Option+F
Search the command history ;; Ctrl+R ;; Type to search, press again for older matches
Previous command ;; Up ;; Press repeatedly to go further back
Complete a name ;; Tab ;; Press twice to list all the options
Pause the running program ;; Ctrl+Z ;; Resume it with fg
Suspend output scrolling ;; Ctrl+S ;; Resume with Ctrl+Q
Paste in the terminal ;; Ctrl+Shift+V ;; On macOS use Command+V
Copy in the terminal ;; Ctrl+Shift+C ;; On macOS use Command+C
:::
