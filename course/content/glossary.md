# Programming concepts
Algorithm :: A step-by-step procedure for solving a problem. A recipe is an algorithm for cooking.
Argument | Arguments :: The actual value you give to a function when you call it, such as the 5 in square(5).
Array | List :: An ordered collection of values stored under one name, such as a list of names. Each item has a position called an index, starting at 0.
Asynchronous | Async :: Code that starts a slow task, such as a network request, and carries on with other work instead of waiting. The result arrives later.
Boolean :: A value that is either true or false.
Bug :: A mistake in a program that makes it behave in a way you did not intend.
Callback :: A function you pass to another function so it can be called later, for example when a task finishes.
Class :: A blueprint for creating objects. It describes what data an object holds and what it can do.
Compiler :: A program that translates your whole source code into machine code before it runs.
Compiler error :: A message from the compiler telling you your code breaks the language's rules.
Concurrency :: Making progress on several tasks during the same period of time, even if they do not run at the same instant.
Condition :: A test that is true or false, used by an if statement to decide what to do.
Constant :: A named value that is not supposed to change after you set it.
Debugging :: Finding and fixing bugs. Good debugging means forming a guess, testing it, and narrowing down the cause.
Encapsulation :: Keeping an object's data private and exposing only safe ways to use it.
Event :: Something that happens that code can react to, such as a click, a key press or a page load.
Exception | Error :: A signal that something went wrong while a program was running. Programs can catch exceptions and recover.
Function :: A named, reusable block of code that performs one task. It can take inputs and give back a result.
Garbage collection :: Automatic cleanup of memory that a program no longer uses.
Immutable :: Cannot be changed after it is created. To change it, you make a new copy.
Index :: Two meanings. First, an item's position in a list, starting from 0. Second, a database structure that makes searches faster.
Inheritance :: When one class reuses and extends the features of another class.
Interpreter :: A program that reads your source code and runs it line by line, without a separate compile step.
Iteration | Loop :: Repeating a block of code several times.
Key-value pair :: A name (key) linked to a value, like a dictionary entry.
Loop variable :: A variable that changes on each pass through a loop.
Method :: A function that belongs to an object or class.
Module :: A file or unit of code that groups related functions and can be imported by other code.
Null | None | nil :: A special value meaning there is no value.
Object :: A bundle of related data and behaviour kept together, such as a user with a name, an email and the ability to log in.
Parameter :: The named placeholder in a function definition that receives an argument, such as x in square(x).
Polymorphism :: Different kinds of objects responding to the same method call in their own way.
Promise :: A JavaScript object that stands for a result that will arrive later, either a success value or an error.
Recursion :: A function that solves a problem by calling itself on a smaller version of the same problem.
Refactoring :: Improving the structure of code without changing what it does.
Regular expression | Regex :: A compact pattern for searching and matching text.
Runtime :: The period when a program is running, or the software environment that runs it.
Scope :: The part of a program where a variable can be seen and used.
Stack trace :: The list of function calls that led to an error, printed to help you find where it happened.
State :: The data that describes how an application looks and behaves right now, such as the items in a shopping cart.
String :: Text in a program, written inside quotation marks.
Syntax :: The grammar rules of a programming language. A syntax error means the code breaks those rules.
Thread :: One path of execution inside a program. Several threads can run at the same time.
Thread safety :: Code that behaves correctly even when several threads use it at the same time.
Type :: The kind of value something is, such as a number, text or true/false.
Type system | Static typing :: Rules about what types values may have. With static typing the types are checked before the program runs.
Variable :: A named box that holds a value you can use and change later.

# Web and front end
Accessibility | a11y :: Designing software so that people with disabilities, for example blind or motor-impaired users, can use it.
Browser :: A program, such as Chrome, Firefox or Safari, that downloads web pages and displays them.
Component :: A reusable piece of a user interface, such as a button or a product card, defined once and used many times.
Cookie :: A small piece of data a website asks your browser to store and send back with future requests.
CSS | Cascading Style Sheets :: The language that controls how HTML looks: colours, fonts, spacing and layout.
DOM | Document Object Model :: The browser's live, tree-shaped representation of a web page that JavaScript can read and change.
Flexbox :: A CSS layout system for arranging items in a row or a column.
Front end | Frontend | Client side :: The part of an application that users see and interact with in their browser or app.
Grid | CSS Grid :: A CSS layout system for arranging items in rows and columns at once.
Hook :: A React function, such as useState, that lets a component remember data and react to changes.
HTML | HyperText Markup Language :: The language that describes the structure and content of a web page with tags.
JavaScript :: The programming language of the web. It runs in every browser and, with Node.js, on servers.
Props :: Inputs that a parent component passes to a child component.
React :: A JavaScript library for building user interfaces from components.
Reactive :: Updating the screen automatically whenever the underlying data changes.
Responsive design :: Building pages that adapt their layout to any screen size, from phones to wide monitors.
Semantic HTML :: Using HTML tags that describe the meaning of content, such as nav or article, instead of generic boxes.
Single-page application | SPA :: A website that loads once and then updates the page with JavaScript instead of loading new pages.
Template :: A page layout with placeholders that are filled with real data when the page is built.
UI | User interface :: Everything a person sees and touches when using software.
UX | User experience :: How easy and pleasant software is to use.
Virtual DOM :: A lightweight copy of the page that React compares with the new version to update only what changed.

# Back end and APIs
API | Application Programming Interface :: A set of rules that lets one program ask another program to do something or share data. A restaurant menu is an API: you order from it without knowing how the kitchen works.
Back end | Backend | Server side :: The part of an application that runs on a server: it stores data, applies business rules and answers requests from the front end.
Client :: The program that asks for something, usually a browser or a mobile app. It sends requests to a server.
CRUD :: The four basic data operations: Create, Read, Update and Delete.
Endpoint :: One specific URL of an API that does one job, such as GET /api/users.
Express :: A small, popular framework for building web servers with Node.js.
Header :: Extra information sent with an HTTP request or response, such as the content type or an authorization token.
Idempotent :: An operation that has the same effect whether you do it once or many times.
Middleware :: Code that sits between a request arriving and the final response, doing jobs such as logging or checking login.
MVC | Model-View-Controller :: A way of organising an application into data (model), screens (view) and the logic connecting them (controller).
Node.js :: A program that lets you run JavaScript outside the browser, mostly for servers and tools.
Pagination :: Splitting a long list of results into pages.
Rate limiting :: Restricting how many requests a client may make in a period of time.
Request :: A message from a client to a server asking for something.
Response :: The message a server sends back after a request.
REST | RESTful :: A popular style for designing web APIs around resources and standard HTTP methods such as GET, POST, PUT and DELETE.
Route :: A rule that connects a URL path and method to the code that handles it.
Server :: A computer or program that waits for requests and sends back responses.
Session :: Server-side memory of a logged-in user across several requests, usually linked to a cookie.
WebSocket :: A connection between browser and server that stays open so either side can send messages at any time.

# Databases and data
Aggregate function :: A SQL function, such as COUNT or AVG, that turns many rows into one value.
Database :: An organised store of data that programs can save to and query efficiently.
Foreign key :: A column that refers to the primary key of another table, creating a link between them.
Join :: A SQL operation that combines rows from two tables based on matching values.
JSON | JavaScript Object Notation :: A simple text format for sending structured data between programs. It looks like name and value pairs in curly braces.
Migration :: A versioned change to a database structure, such as adding a column, that can be applied in a repeatable way.
MongoDB :: A popular NoSQL database that stores flexible, JSON-like documents.
Normalization :: Organising database tables so each fact is stored once, which avoids duplicates and contradictions.
NoSQL :: Databases that do not use tables and SQL. Examples: document, key-value and graph databases.
ORM | Object-Relational Mapper :: A tool that lets you work with database rows as ordinary objects in your language instead of writing SQL by hand.
Primary key :: A column whose value uniquely identifies each row in a table.
Query :: A question you ask a database, written in a language such as SQL.
Relational database :: A database that stores data in tables with rows and columns, linked by keys. PostgreSQL and MySQL are examples.
Schema :: The blueprint of a database: which tables, columns and types exist.
SQL | Structured Query Language :: The standard language for asking questions of, and changing data in, relational databases.
Transaction :: A group of database changes that either all succeed or all fail together.
YAML :: A human-friendly text format for configuration files that uses indentation.

# Networking and the internet
DNS | Domain Name System :: The internet's phone book. It turns a name like example.com into the numeric address of a server.
Domain name :: The human-friendly address of a website, such as example.com.
HTTP | HyperText Transfer Protocol :: The set of rules browsers and servers use to exchange web pages and data.
HTTPS :: HTTP with encryption, so that others on the network cannot read or change the traffic.
Latency :: The delay between sending a request and starting to receive the answer.
Load balancer :: A server that spreads incoming traffic across several copies of an application.
Localhost :: The name for your own computer when it acts as a server for testing. Its address is 127.0.0.1.
SSL | TLS | Transport Layer Security :: The encryption technology that makes HTTPS secure. SSL is the older name.
URL | Uniform Resource Locator :: The full address of something on the web, such as https://example.com/page.

# Security
Authentication :: Proving who you are, usually with a password or a token. Showing your ID at the door.
Authorization :: Deciding what an identified user is allowed to do. Having a ticket that only lets you into certain rooms.
Bcrypt :: A deliberately slow algorithm for hashing passwords so that stolen hashes are very hard to crack.
CORS | Cross-Origin Resource Sharing :: A browser security rule that decides whether a web page may request data from a different website than the one that served it.
CSRF | Cross-Site Request Forgery :: An attack that tricks a logged-in user's browser into sending an unwanted request to a site they trust.
Encryption :: Scrambling data so only someone with the right key can read it.
Hash | Hashing :: A one-way function that turns any input into a fixed-length scrambled string. You cannot turn the result back into the original.
JWT | JSON Web Token :: A signed token that proves who a user is. The server can check the signature without looking anything up.
Principle of least privilege :: Give every user and program only the permissions it needs, and nothing more.
Role-based access control | RBAC :: Giving permissions to roles, such as admin or student, and then assigning users to roles.
Salt :: Random data added to a password before hashing so identical passwords produce different hashes.
SQL injection :: An attack where malicious text is slipped into a database query. It is prevented with parameterised queries.
Token :: A piece of data that stands in for proof of identity, sent with each request.
Two-factor authentication | 2FA :: Requiring a second proof of identity, such as a code from your phone, in addition to a password.
XSS | Cross-Site Scripting :: An attack where harmful scripts are injected into a web page that other users view.

# Tools and workflow
Boilerplate :: Repeated standard code that has to be written but does not express anything new.
Branch :: In Git, an independent line of work. You can experiment on a branch without affecting the main code.
Command line | Terminal | CLI :: A text window where you type commands to control your computer instead of clicking.
Commit :: A saved snapshot of your project in Git, with a message describing what changed.
Dependency :: A library or package that your project needs in order to work.
Environment variable :: A named setting, such as a password or API key, supplied to a program from outside its code.
Framework :: A ready-made structure of code that solves common problems so you can focus on your own application. You fill in the blanks.
Git :: A tool that records the history of your code so you can undo mistakes and collaborate.
GitHub :: A website that hosts Git repositories and adds tools for teamwork.
Library :: A collection of ready-made code you call from your own program for a specific purpose.
Linting | Linter :: Automatic checking of code for style problems and likely mistakes.
Merge :: Combining the changes from one Git branch into another.
Open source :: Software whose code is public so anyone can read, use and improve it.
Package manager :: A tool, such as npm or pip, that downloads and updates libraries for your project.
Pull request :: A request to merge your branch into another one, giving teammates a chance to review the changes first.
Repository | Repo :: A project folder tracked by Git, including its full history.
Version control :: A system for recording changes to files over time so you can recall earlier versions.
Virtual environment :: An isolated folder of installed libraries for one project so it does not interfere with others.

# DevOps and cloud
Cache :: A saved copy of something so it can be reused quickly without fetching or computing it again.
CI/CD | Continuous integration :: Automatically testing every change and, if it passes, deploying it.
Cloud :: Computers owned by a provider such as AWS, Azure or Google Cloud that you rent over the internet instead of buying your own.
Container :: A packaged, isolated environment holding an application and everything it needs to run. Docker creates containers.
Deployment | Deploy :: Putting your application on a server so that other people can use it.
DevOps :: Practices and tools that connect writing software with running it reliably: automation, testing, deployment and monitoring.
Docker :: A tool for building and running containers.
Docker image :: A read-only template that a container is created from.
Pipeline :: A series of automatic steps, such as test, build and deploy, that run whenever you push code.

# Learning and habits
Active recall :: Testing yourself from memory instead of re-reading. It is one of the most effective study techniques.
Pomodoro technique :: A study method: work for 25 focused minutes, then rest for 5.
Rubber duck debugging :: Explaining your code line by line to an object, or a patient friend, to spot the mistake yourself.
Spaced repetition :: Reviewing material at growing intervals, such as after 1 day, 3 days and a week, to remember it for the long term.


# Testing and quality
Test | Unit test :: A small program that checks that one part of your code gives the right answer.
Mock :: A fake stand-in for a real component that lets a test run without it.
