---
id: ref-lookup
number: 105
title: Look-up Tables
track: Reference
duration: Reference
level: All levels
summary: HTTP status codes, headers and methods, ports, regular expressions, chmod, Markdown, CSS layout, SQL, naming conventions, Big O, number systems and more.
kind: reference
---

::: note
This page holds the facts that developers look up again and again. Use the filter box at the top to search every table at once, for example "404", "flex" or "binary".
:::

## HTTP

::: cheat HTTP status codes
cols: Code ;; Name ;; When you see it
100 ;; Continue ;; The server received the start of the request. Keep sending
101 ;; Switching Protocols ;; The connection is upgrading, for example to a WebSocket
200 ;; OK ;; The request worked
201 ;; Created ;; A new thing was created, usually after POST
202 ;; Accepted ;; Received, and will be processed later
204 ;; No Content ;; It worked, and there is nothing to send back, often after DELETE
301 ;; Moved Permanently ;; The address has changed for good. Update your links
302 ;; Found ;; A temporary redirect to another address
304 ;; Not Modified ;; Your cached copy is still good
307 ;; Temporary Redirect ;; Like 302 but the method stays the same
308 ;; Permanent Redirect ;; Like 301 but the method stays the same
400 ;; Bad Request ;; The request is malformed or has invalid data
401 ;; Unauthorized ;; You are not logged in, or the token is missing or invalid
403 ;; Forbidden ;; You are logged in but not allowed to do this
404 ;; Not Found ;; Nothing exists at this address
405 ;; Method Not Allowed ;; The address exists but not for this method
408 ;; Request Timeout ;; The client took too long to send the request
409 ;; Conflict ;; The request clashes with the current state, such as a duplicate
410 ;; Gone ;; It existed once and was removed on purpose
413 ;; Payload Too Large ;; The request body is bigger than the server accepts
415 ;; Unsupported Media Type ;; The server does not accept this Content-Type
418 ;; I am a teapot ;; A joke status from 1998 that still exists
422 ;; Unprocessable Content ;; The data is well formed but fails validation
429 ;; Too Many Requests ;; You are being rate limited. Look for a Retry-After header
500 ;; Internal Server Error ;; The server crashed or hit a bug
501 ;; Not Implemented ;; The server does not support this feature
502 ;; Bad Gateway ;; A proxy got a bad answer from the server behind it
503 ;; Service Unavailable ;; The server is overloaded or down for maintenance
504 ;; Gateway Timeout ;; A proxy waited too long for the server behind it
:::

::: tip
The first digit tells you who to blame. **2xx** success. **3xx** go somewhere else. **4xx** the client made a mistake. **5xx** the server failed.
:::

::: cheat HTTP methods
cols: Method ;; Purpose ;; Safe ;; Idempotent
GET ;; Read a resource ;; Yes ;; Yes
HEAD ;; Like GET but returns only the headers ;; Yes ;; Yes
POST ;; Create a resource or run an action ;; No ;; No
PUT ;; Replace a resource completely ;; No ;; Yes
PATCH ;; Change part of a resource ;; No ;; Usually not
DELETE ;; Remove a resource ;; No ;; Yes
OPTIONS ;; Ask what the server allows (used by CORS) ;; Yes ;; Yes
:::

::: cheat Common request headers
cols: Header ;; What it carries ;; Example
code: 1,3
Accept ;; The formats the client can read ;; Accept: application/json
Authorization ;; Credentials ;; Authorization: Bearer eyJhbGci...
Content-Type ;; The format of the body being sent ;; Content-Type: application/json
Content-Length ;; The size of the body in bytes ;; Content-Length: 348
Cookie ;; Cookies the browser sends back ;; Cookie: session=abc123
Host ;; The domain being requested ;; Host: example.com
If-None-Match ;; Send the page only if the ETag changed ;; If-None-Match: "33a64df5"
Origin ;; The site making a cross-origin request ;; Origin: https://app.example.com
Referer ;; The page that linked here (the spelling is historic) ;; Referer: https://example.com/
User-Agent ;; The browser or program making the request ;; User-Agent: Mozilla/5.0 ...
:::

::: cheat Common response headers
cols: Header ;; What it does ;; Example
code: 1,3
Cache-Control ;; How long the response can be cached ;; Cache-Control: max-age=3600
Content-Type ;; The format of the body ;; Content-Type: text/html; charset=utf-8
ETag ;; A version label for caching ;; ETag: "33a64df5"
Location ;; Where to go next, for redirects and 201 ;; Location: /users/42
Set-Cookie ;; Ask the browser to store a cookie ;; Set-Cookie: sid=abc; HttpOnly; Secure; SameSite=Lax
Retry-After ;; How many seconds to wait before trying again ;; Retry-After: 30
Access-Control-Allow-Origin ;; Which sites may read the response (CORS) ;; Access-Control-Allow-Origin: https://app.example.com
Content-Security-Policy ;; Which sources of scripts and styles are allowed ;; Content-Security-Policy: default-src 'self'
Strict-Transport-Security ;; Always use HTTPS for this site ;; Strict-Transport-Security: max-age=31536000
X-Content-Type-Options ;; Stop the browser guessing the file type ;; X-Content-Type-Options: nosniff
WWW-Authenticate ;; How to log in, sent with 401 ;; WWW-Authenticate: Bearer
:::

::: cheat Content types
cols: Type ;; Used for ;; File ending
code: 1
text/html ;; Web pages ;; .html
text/css ;; Style sheets ;; .css
text/javascript ;; JavaScript ;; .js
application/json ;; JSON data ;; .json
application/xml ;; XML data ;; .xml
application/pdf ;; PDF documents ;; .pdf
application/x-www-form-urlencoded ;; Simple form submissions ;; (no file)
multipart/form-data ;; Forms that upload files ;; (no file)
image/png ;; PNG images ;; .png
image/jpeg ;; JPEG photographs ;; .jpg
image/svg+xml ;; SVG vector images ;; .svg
text/plain ;; Plain text ;; .txt
:::

## Networking

::: cheat Well-known ports
cols: Port ;; Service ;; Used for
20 and 21 ;; FTP ;; Transferring files (old)
22 ;; SSH ;; Secure remote login and Git over SSH
25 ;; SMTP ;; Sending email between servers
53 ;; DNS ;; Looking up domain names
80 ;; HTTP ;; Web pages
110 ;; POP3 ;; Downloading email
143 ;; IMAP ;; Reading email on a server
443 ;; HTTPS ;; Secure web pages
587 ;; SMTP submission ;; Sending email from an app
3000 ;; Node and React development ;; Common default for local servers
3306 ;; MySQL ;; Database
5173 ;; Vite ;; Development server
5432 ;; PostgreSQL ;; Database
6379 ;; Redis ;; Cache and queue
8000 ;; Python development ;; Django and simple Python servers
8080 ;; Alternative HTTP ;; Proxies and Java servers
27017 ;; MongoDB ;; Database
:::

::: cheat Private IP ranges and special addresses
cols: Address ;; Meaning ;; Notes
code: 1
127.0.0.1 ;; Localhost: this computer ;; Also called the loopback address. The name localhost points here
::1 ;; Localhost in IPv6 ;; The IPv6 version of 127.0.0.1
0.0.0.0 ;; All network interfaces ;; A server bound here is reachable from other machines
192.168.0.0 to 192.168.255.255 ;; Private network ;; Typical home routers
10.0.0.0 to 10.255.255.255 ;; Private network ;; Offices and cloud networks
172.16.0.0 to 172.31.255.255 ;; Private network ;; Docker uses this range
169.254.0.0 to 169.254.255.255 ;; Link-local ;; Assigned when no network is found
:::

## Permissions and file formats

::: cheat chmod numbers
cols: Number ;; Letters ;; Meaning
0 ;; --- ;; No permissions
1 ;; --x ;; Execute only
2 ;; -w- ;; Write only
3 ;; -wx ;; Write and execute
4 ;; r-- ;; Read only
5 ;; r-x ;; Read and execute
6 ;; rw- ;; Read and write
7 ;; rwx ;; Read, write and execute
:::

::: cheat Common chmod values
cols: Value ;; Looks like ;; Typical use
600 ;; rw------- ;; Private files, SSH keys and secrets
644 ;; rw-r--r-- ;; Normal files
664 ;; rw-rw-r-- ;; Files a group can edit
700 ;; rwx------ ;; Private folders and scripts
755 ;; rwxr-xr-x ;; Programs and folders
777 ;; rwxrwxrwx ;; Everyone can do everything. Avoid
:::

::: cheat Markdown syntax
cols: You write ;; You get ;; Notes
code: 1
# Heading 1 ;; A large heading ;; Use ## for h2, ### for h3
**bold** ;; Bold text ;; Two stars each side
*italic* ;; Italic text ;; One star each side
`code` ;; Inline code ;; Backticks
[text](https://example.com) ;; A link ;; Text in brackets, address in parentheses
![alt text](image.png) ;; An image ;; Starts with an exclamation mark
- item ;; A bullet list item ;; Also * or +
1. item ;; A numbered list item ;; Numbers can all be 1
> quote ;; A quotation ;; Greater-than sign
--- ;; A horizontal line ;; Three dashes
- [ ] task ;; A task list item ;; Use [x] for done
~~text~~ ;; Crossed-out text ;; Two tildes each side
| a | b | ;; A table row ;; A line of dashes separates the header
:::

## Regular expressions

::: plain
A **regular expression** (regex) is a pattern that describes text. It lets you search, check and replace text by rules, for example "any email address" or "three digits followed by a dash".
:::

::: cheat Regex building blocks
cols: Pattern ;; Matches ;; Example
code: 1,3
. ;; Any one character except a new line ;; c.t matches cat, cot and c9t
\d ;; A digit ;; \d\d matches 42
\D ;; Anything except a digit ;; \D matches a
\w ;; A letter, digit or underscore ;; \w+ matches hello_1
\W ;; Anything except those ;; \W matches a space
\s ;; A space, tab or new line ;; a\sb matches "a b"
\S ;; Anything except whitespace ;; \S+ matches word
[abc] ;; One of the characters a, b or c ;; gr[ae]y matches gray and grey
[a-z] ;; One character in the range ;; [a-z]+ matches hello
[^abc] ;; Any character except a, b or c ;; [^0-9] matches a
^ ;; The start of the text ;; ^Hello matches a line that begins with Hello
$ ;; The end of the text ;; world$ matches a line that ends with world
\b ;; A word boundary ;; \bcat\b matches cat but not cattle
a|b ;; Either a or b ;; cat|dog matches cat or dog
(abc) ;; A group, also remembered ;; (ab)+ matches abab
(?:abc) ;; A group that is not remembered ;; (?:ab)+ matches abab
\1 ;; The text matched by group 1 ;; (\w)\1 matches the double letter in book
\. ;; A real dot (backslash switches the meaning off) ;; 3\.14 matches 3.14
:::

::: cheat Regex quantifiers and flags
cols: Pattern ;; Meaning ;; Example
code: 1,3
* ;; Zero or more ;; ab* matches a, ab and abbb
+ ;; One or more ;; ab+ matches ab and abbb
? ;; Zero or one (optional) ;; colou?r matches color and colour
{3} ;; Exactly 3 ;; \d{3} matches 123
{2,4} ;; Between 2 and 4 ;; \d{2,4} matches 12, 123 and 1234
{2,} ;; 2 or more ;; \d{2,} matches 12 and 12345
*? ;; Zero or more, as few as possible (lazy) ;; <.*?> matches one tag at a time
(?=abc) ;; Followed by abc, without including it ;; \d+(?= dollars) matches 50 in "50 dollars"
(?!abc) ;; Not followed by abc ;; foo(?!bar) matches foo not followed by bar
g ;; Flag: find every match, not just the first ;; /cat/g
i ;; Flag: ignore upper and lower case ;; /cat/i matches Cat
m ;; Flag: ^ and $ work on each line ;; /^a/m
:::

::: cheat Regex recipes
cols: Goal ;; Pattern ;; Warning
code: 2
A simple email check ;; ^[^\s@]+@[^\s@]+\.[^\s@]+$ ;; Only a rough check. The only real test is sending an email
A date like 2026-10-23 ;; ^\d{4}-\d{2}-\d{2}$ ;; Does not check that the date exists
A UK or US style phone number ;; ^\+?[\d\s-]{7,15}$ ;; Phone formats vary by country
A hex colour ;; ^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$ ;; Handles #fff and #ffffff
A URL starting with http or https ;; ^https?://[^\s/$.?#].[^\s]*$ ;; Prefer the URL class in your language
A strong password check ;; ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$ ;; Length matters more than special characters
Spaces at the start or end ;; ^\s+|\s+$ ;; Replace with an empty string to trim
More than one space in a row ;; \s{2,} ;; Replace with a single space
:::

## CSS and SQL quick reference

::: cheat CSS selectors
cols: Selector ;; Selects ;; Example
code: 1,3
p ;; Every p element ;; p { margin: 0 }
.card ;; Elements with class card ;; .card { padding: 1rem }
#top ;; The element with id top ;; #top { position: sticky }
a, b ;; Both a and b ;; h1, h2 { margin: 0 }
a b ;; b anywhere inside a ;; nav a { color: blue }
a > b ;; b directly inside a ;; ul > li { margin: 0 }
a + b ;; b right after a ;; h2 + p { margin-top: 0 }
a ~ b ;; Every b after a at the same level ;; h2 ~ p { color: gray }
[type="email"] ;; Elements with this attribute value ;; input[type="email"] { width: 100% }
a:hover ;; An element while the pointer is over it ;; a:hover { text-decoration: underline }
a:focus-visible ;; A focused element when using the keyboard ;; button:focus-visible { outline: 2px solid }
li:nth-child(2n) ;; Every second child ;; tr:nth-child(2n) { background: #eee }
p:first-child ;; The first child of its parent ;; p:first-child { margin-top: 0 }
p::first-line ;; A pseudo-element: part of an element ;; p::first-line { font-weight: bold }
:not(.x) ;; Everything except .x ;; li:not(.done) { opacity: 1 }
:::

::: cheat Flexbox and Grid properties
cols: Property ;; What it does ;; Common values
code: 1
display: flex ;; Lay the children out in a row or column ;; Set on the parent
flex-direction ;; The main direction ;; row, column
justify-content ;; Spacing along the main direction ;; flex-start, center, space-between, space-around
align-items ;; Alignment across the main direction ;; stretch, center, flex-start, flex-end
flex-wrap ;; Allow items to wrap onto new lines ;; nowrap, wrap
gap ;; Space between items ;; 1rem
flex: 1 ;; Let an item grow to share the free space ;; 1, 0 0 auto
display: grid ;; Lay the children out in rows and columns ;; Set on the parent
grid-template-columns ;; Define the columns ;; repeat(3, 1fr), 200px 1fr
grid-template-areas ;; Name the regions of the layout ;; "header header" "side main"
repeat(auto-fit, minmax(16rem, 1fr)) ;; Responsive columns without media queries ;; Used as the value of grid-template-columns
place-items ;; Align items in both directions ;; center
grid-column ;; Make an item span columns ;; 1 / -1 or span 2
:::

::: cheat CSS units
cols: Unit ;; Relative to ;; Use for
px ;; A fixed pixel ;; Borders and fine details
rem ;; The root font size ;; Font sizes and spacing
em ;; The font size of the parent ;; Spacing that should scale with the text
% ;; The parent's size ;; Widths
vw and vh ;; The width and height of the window ;; Full-screen sections
ch ;; The width of the 0 character ;; Line length, such as max-width: 65ch
fr ;; A share of the free space in a grid ;; Grid columns
:::

::: cheat SQL syntax
cols: Task ;; Syntax ;; Notes
code: 2
Read rows ;; SELECT name, email FROM users; ;; Use * for all columns
Filter rows ;; SELECT * FROM users WHERE age >= 18; ;; Use AND, OR and NOT to combine
Sort ;; SELECT * FROM users ORDER BY name DESC; ;; ASC is the default
Limit the number of rows ;; SELECT * FROM users LIMIT 10 OFFSET 20; ;; For paging
Match a pattern ;; SELECT * FROM users WHERE name LIKE 'A%'; ;; % means any characters
Match a list ;; SELECT * FROM users WHERE id IN (1, 2, 3); ;; A short way to write OR
Check for null ;; SELECT * FROM users WHERE phone IS NULL; ;; Never use = NULL
Remove duplicates ;; SELECT DISTINCT city FROM users; ;; One of each value
Count rows ;; SELECT COUNT(*) FROM users; ;; Also SUM, AVG, MIN and MAX
Group rows ;; SELECT city, COUNT(*) FROM users GROUP BY city; ;; One result per group
Filter groups ;; SELECT city, COUNT(*) FROM users GROUP BY city HAVING COUNT(*) > 5; ;; HAVING works on groups, WHERE on rows
Join tables ;; SELECT u.name, o.total FROM users u JOIN orders o ON o.user_id = u.id; ;; Only rows that match on both sides
Keep rows with no match ;; SELECT u.name FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE o.id IS NULL; ;; Users who never ordered
Insert a row ;; INSERT INTO users (name, email) VALUES ('Ada', 'ada@example.com'); ;; Name the columns
Update rows ;; UPDATE users SET name = 'Ada L.' WHERE id = 1; ;; Always include WHERE
Delete rows ;; DELETE FROM users WHERE id = 1; ;; Always include WHERE
Create a table ;; CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL); ;; Add UNIQUE and CHECK rules
Add a column ;; ALTER TABLE users ADD COLUMN age INTEGER; ;; Changes the structure
Add an index ;; CREATE INDEX idx_users_email ON users (email); ;; Speeds up searches on that column
Remove a table ;; DROP TABLE users; ;; Cannot be undone
Start a transaction ;; BEGIN; ;; Followed by COMMIT or ROLLBACK
Save a transaction ;; COMMIT; ;; Makes the changes permanent
Cancel a transaction ;; ROLLBACK; ;; Undoes the changes
Show the plan of a query ;; EXPLAIN SELECT * FROM users WHERE email = 'a@b.c'; ;; Shows whether an index is used
:::

::: cheat SQL data types
cols: Type ;; Stores ;; Example
code: 1
INTEGER ;; Whole numbers ;; 42
NUMERIC or DECIMAL ;; Exact decimals such as money ;; 19.99
REAL or DOUBLE ;; Approximate decimals ;; 3.14159
TEXT or VARCHAR ;; Text ;; 'hello'
BOOLEAN ;; True or false ;; TRUE
DATE ;; A calendar date ;; '2026-10-23'
TIMESTAMP ;; A date and time ;; '2026-10-23 14:30:00'
JSON or JSONB ;; A JSON document ;; '{"a": 1}'
UUID ;; A unique identifier ;; 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
:::

## Everyday developer vocabulary in tables

::: cheat Naming conventions
cols: Style ;; Looks like ;; Commonly used for
code: 2
camelCase ;; userAccountName ;; Variables and functions in JavaScript, Java, C# and Go
PascalCase ;; UserAccount ;; Classes and components in most languages
snake_case ;; user_account_name ;; Variables and functions in Python, Ruby and Rust, and SQL columns
SCREAMING_SNAKE_CASE ;; MAX_RETRIES ;; Constants and environment variables
kebab-case ;; user-account-name ;; CSS classes, URLs and file names
lowercase ;; useraccount ;; Package names in Go and Java
:::

::: cheat Big O notation (how time grows with the input size n)
cols: Notation ;; Name ;; Example
O(1) ;; Constant ;; Reading an array item by its position, or a hash map lookup
O(log n) ;; Logarithmic ;; Binary search in a sorted list
O(n) ;; Linear ;; Looking through a list once
O(n log n) ;; Linearithmic ;; Good sorting algorithms such as merge sort
O(n squared) ;; Quadratic ;; Two loops inside each other, such as bubble sort
O(2 to the power n) ;; Exponential ;; Trying every subset. Becomes impossible quickly
O(n!) ;; Factorial ;; Trying every ordering
:::

::: cheat Number systems
cols: Decimal ;; Binary ;; Hexadecimal
0 ;; 0000 ;; 0
1 ;; 0001 ;; 1
2 ;; 0010 ;; 2
3 ;; 0011 ;; 3
4 ;; 0100 ;; 4
5 ;; 0101 ;; 5
6 ;; 0110 ;; 6
7 ;; 0111 ;; 7
8 ;; 1000 ;; 8
9 ;; 1001 ;; 9
10 ;; 1010 ;; A
11 ;; 1011 ;; B
12 ;; 1100 ;; C
13 ;; 1101 ;; D
14 ;; 1110 ;; E
15 ;; 1111 ;; F
255 ;; 11111111 ;; FF
:::

::: cheat Data size units
cols: Unit ;; Size ;; Roughly
1 byte ;; 8 bits ;; One letter
1 KB ;; 1,000 bytes (1,024 in KiB) ;; A short email
1 MB ;; 1,000 KB ;; A photograph
1 GB ;; 1,000 MB ;; An hour of video
1 TB ;; 1,000 GB ;; A big hard drive
:::

::: cheat Time and date format codes
cols: Code ;; Meaning ;; Example
code: 1,3
%Y or YYYY ;; Four-digit year ;; 2026
%m or MM ;; Month number ;; 10
%d or DD ;; Day of the month ;; 23
%H or HH ;; Hour (24-hour clock) ;; 14
%M or mm ;; Minutes ;; 30
%S or ss ;; Seconds ;; 05
ISO 8601 ;; The standard way to write date and time ;; 2026-10-23T14:30:00Z
Unix timestamp ;; Seconds since 1 January 1970 ;; 1792764600
:::

::: cheat Escape sequences in strings
cols: Write ;; You get ;; Notes
code: 1
\n ;; A new line ;; Works in most languages
\t ;; A tab ;; Lines text up in columns
\\ ;; A backslash ;; Because a single one starts an escape
\" ;; A double quote inside double quotes ;; Or use single quotes outside
\' ;; A single quote inside single quotes ;; Or use double quotes outside
\u00e9 ;; A Unicode character (here the letter e with an acute accent) ;; The four digits are hexadecimal
:::
