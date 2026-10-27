# Back end and APIs
API gateway :: A single entry point that receives all client requests and forwards them to the right service, often handling authentication and rate limits too.
API key :: A secret string that identifies the application calling an API. Treat it like a password.
API versioning :: Keeping old and new forms of an API side by side, for example /v1/users and /v2/users, so existing clients do not break.
Background job | Worker :: A task run outside the request, such as sending an email, so the user does not have to wait.
Business logic :: The rules that make an application do its real job, such as how a discount is calculated, as opposed to technical plumbing.
Circuit breaker :: A safety switch that stops calling a failing service for a while so the failure does not spread.
Content-Type :: A header that says what kind of data a request or response contains, such as application/json. Also called the MIME type.
Controller :: The part of an application that receives a request, calls the right logic and returns a response.
Cron job :: A task scheduled to run automatically at set times, such as every night at 2 a.m.
CDN | Content delivery network :: A network of servers around the world that keep copies of your files so users download them from a nearby location.
Django :: A full-featured Python web framework that includes an ORM, an admin area and authentication.
Event-driven architecture :: A design where parts of a system react to events, such as order placed, instead of calling each other directly.
Exponential backoff :: Retrying a failed request after waiting longer each time, for example 1, 2, 4 and 8 seconds.
Flask :: A small Python web framework that gives you routing and leaves the rest to you.
GraphQL :: A way of building APIs where the client asks for exactly the fields it needs in a single request.
gRPC :: A fast way for services to call each other using compact binary messages.
HTTP method | Verb :: The action in a request: GET reads, POST creates, PUT replaces, PATCH changes part, DELETE removes.
HTTP status code :: A three-digit number in a response: 2xx means success, 3xx redirect, 4xx the client made a mistake and 5xx the server failed.
Laravel :: A popular PHP framework with routing, an ORM and many built-in tools.
Logging | Log level :: Recording what an application does. Levels such as debug, info, warning and error let you filter by importance.
Long polling :: A way to get near real-time updates by keeping a request open until the server has something to say.
Message queue :: A waiting line for messages between services so a slow consumer does not hold up the sender. RabbitMQ and SQS are examples.
Microservices :: An architecture that splits an application into many small services, each with one job, that talk over the network.
Monolith :: An application built and deployed as one unit. Simple to start with, harder to scale in parts.
OpenAPI | Swagger :: A standard file format for describing a REST API, from which documentation and client code can be generated.
Path parameter :: A variable part of a URL, such as the 42 in /users/42.
Payload :: The data carried by a request or response, usually the body.
Pub/sub | Publish and subscribe :: A pattern where senders publish messages to a topic and any number of subscribers receive them.
Query string :: The part of a URL after the question mark that carries options, such as ?page=2&sort=price.
Request body :: The data sent along with a POST, PUT or PATCH request, commonly as JSON.
Reverse proxy | Nginx :: A server that sits in front of your application, receives requests and passes them on. Nginx is the best known.
Ruby on Rails | Rails :: A Ruby web framework known for convention over configuration.
Sanitization :: Cleaning input so dangerous characters cannot cause harm, for example removing script tags from comments.
Scalability :: How well a system keeps working as the number of users grows.
Serialization :: Turning an object in memory into text or bytes, such as JSON, so it can be stored or sent. Reading it back is deserialization.
Serverless :: A way of running code where the provider handles the servers and you pay only while your function runs.
Server-sent events :: A browser feature that lets a server push a stream of updates to a page over one HTTP connection.
Spring Boot :: A popular Java framework for building web applications and APIs quickly.
Stateless :: A server that keeps no memory of earlier requests, so any server can answer any request.
Template engine :: A tool that fills an HTML template with data on the server, such as Jinja, Razor or EJS.
Timeout :: A limit on how long to wait for something before giving up.
Validation :: Checking that incoming data is correct, such as an email that looks like an email, before using it.
Webhook :: A message that one service sends to a URL of yours when something happens, such as a payment succeeding.
Horizontal scaling | Vertical scaling :: Horizontal means adding more machines. Vertical means making one machine bigger.
Environment (development, staging, production) :: A separate copy of your application for a purpose: building, final testing, or real users.
ASP.NET :: Microsoft's framework for building web applications and APIs with C#.

# Databases and data
ACID :: Four guarantees of a reliable transaction: Atomic, Consistent, Isolated and Durable.
Backup :: A saved copy of data that lets you restore it after a failure or mistake.
Big data :: Data so large or fast-moving that ordinary tools cannot handle it on one computer.
CAP theorem :: The rule that a distributed database cannot fully provide consistency, availability and partition tolerance all at once.
Collection :: In MongoDB, a group of documents, similar to a table in SQL.
Column | Field :: One named piece of data in a table, such as email. Every row has a value for each column.
Composite key :: A primary key made of two or more columns together.
Connection pool :: A set of ready-made database connections that requests borrow and return, which is faster than opening a new one each time.
Constraint :: A rule the database enforces, such as NOT NULL, UNIQUE or a foreign key.
Correlation :: A measure of how closely two sets of numbers move together, from -1 to 1. It does not prove that one causes the other.
CSV :: Comma-separated values: a plain-text table where each line is a row and commas separate the columns.
Data cleaning :: Fixing or removing wrong, duplicate or missing data before analysis.
Data type :: The kind of value a column or variable holds, such as integer, text, date or boolean.
Data warehouse :: A large database built for analysis and reporting rather than for running an application.
DataFrame :: A table of data in memory with named columns, the main object in pandas.
Database index :: A structure that lets the database find rows quickly without reading the whole table, like the index of a book.
Denormalization :: Deliberately repeating data to make reads faster, at the cost of more complicated updates.
Document database :: A database that stores flexible JSON-like documents instead of rows. MongoDB is an example.
Entity-relationship diagram | ER diagram :: A drawing of tables and how they relate to each other.
ETL :: Extract, Transform, Load: pulling data from a source, reshaping it and storing it somewhere else.
Eventual consistency :: A promise that all copies of the data will agree after a short delay, not instantly.
Histogram :: A bar chart showing how many values fall into each range.
Many-to-many relationship :: A link where each record on one side can relate to many on the other, such as students and courses. It needs a joining table.
Matplotlib :: The standard Python library for drawing charts.
Mean | Median | Mode :: Three kinds of average: the sum divided by the count, the middle value, and the most common value.
Missing data | NaN :: Values that are absent. In pandas they appear as NaN, short for not a number.
MySQL :: A widely used open-source relational database.
NumPy :: A Python library for fast calculations on arrays of numbers.
One-to-many relationship :: A link where one record relates to many others, such as one customer with many orders.
Outlier :: A value far away from the rest, which may be an error or something interesting.
Pandas :: A Python library for loading, cleaning and analysing tables of data.
PostgreSQL | Postgres :: A powerful open-source relational database, known for reliability and advanced features.
Prepared statement | Parameterized query :: A query written with placeholders for values, which are sent separately so they can never be run as code. The main defence against SQL injection.
Redis :: A very fast in-memory database often used for caching and queues.
Replication :: Keeping copies of a database on several servers, for safety and faster reads.
Row | Record :: One entry in a table, such as one customer.
Seaborn :: A Python library built on Matplotlib that makes statistical charts easier.
Seed data :: Starting data loaded into a new database so the application has something to show.
Sharding :: Splitting a large database across several servers, each holding part of the data.
SQLite :: A small database stored in a single file, used in phones, browsers and small apps.
Stored procedure :: A saved piece of SQL logic kept inside the database and run by name.
Table :: A collection of rows and columns in a relational database, such as customers or orders.
Trigger :: Code that the database runs automatically when a row is inserted, updated or deleted.
View :: A saved query that you can use like a table.
XML :: A text format that describes data with nested tags, older than JSON and still common in enterprise systems.
Schema-less :: A database that does not force every record to have the same fields.
Group by :: An SQL clause that puts rows with the same value together so you can summarise each group, for example total sales per city.

# Networking and the internet
Bandwidth :: How much data a connection can carry per second.
Certificate | SSL certificate :: A digital document that proves a website is who it claims to be and enables HTTPS.
Firewall :: Software or hardware that blocks unwanted network traffic according to rules.
FTP :: An older protocol for transferring files between computers.
Hostname :: The name of a machine on a network, such as www.example.com.
HTTP/2 :: A newer version of HTTP that sends many requests over one connection, making pages load faster.
IP address | IPv4 | IPv6 :: A number that identifies a device on a network. IPv4 looks like 192.168.1.10. IPv6 is longer and has many more addresses.
Let's Encrypt :: A free service that issues HTTPS certificates automatically.
NAT :: A router feature that lets many devices in a home share one public IP address.
Packet :: A small chunk of data sent across a network. Big files are split into many packets and reassembled at the other end.
Peer-to-peer :: A network where computers talk directly to each other instead of through a central server.
Ping :: A tool that sends a tiny message to another machine to check that it is reachable and how long the round trip takes.
Port :: A numbered door on a machine. Web servers listen on 80 for HTTP and 443 for HTTPS.
Protocol :: An agreed set of rules for communicating, such as HTTP, SMTP or TCP.
Proxy :: A server that makes requests on behalf of another computer.
Same-origin policy :: A browser rule that stops a page from reading data from a different origin (scheme, domain and port) unless that site allows it.
Socket :: One end of a two-way connection between programs, over a network or on the same machine.
SSH :: A secure way of logging in to and running commands on a remote machine.
Subdomain :: A prefix added to a domain, such as blog in blog.example.com.
TCP :: A reliable protocol that makes sure all packets arrive, in order. Web pages use it.
Throughput :: How much data actually gets through in a given time, often lower than the bandwidth.
TLD | Top-level domain :: The last part of a domain name, such as .com, .org or .ng.
UDP :: A fast protocol that does not check that packets arrive. Used for video calls and games.
VPN :: A service that encrypts your traffic and sends it through another server, hiding it from the local network.
DNS record | A record :: An entry in DNS. An A record maps a domain name to an IP address, a CNAME maps one name to another.
Origin :: The combination of scheme, domain and port of a page, for example https://example.com:443.
TLS handshake :: The opening exchange in which a browser and server agree on keys to encrypt their connection.

# Security
Access token | Refresh token :: An access token proves who you are for a short time. A refresh token is a longer-lived one used to get a new access token.
Audit log :: A permanent record of who did what and when, used to investigate problems.
Base64 :: A way of writing binary data as plain text. It is encoding, not encryption, and anyone can decode it.
Brute-force attack :: Trying every possible password or key until one works.
Checksum :: A short value calculated from data to detect whether it was changed or damaged.
Content Security Policy | CSP :: A header that tells the browser which sources of scripts and styles it may trust, limiting the damage of XSS.
Data breach :: An incident in which private data is exposed to people who should not have it.
Defence in depth :: Using several layers of protection so that if one fails the others still hold.
DDoS :: A distributed denial-of-service attack: flooding a site with traffic from many machines so real users cannot get in.
Digital signature :: A value created with a private key that proves who sent a message and that it was not changed.
Exploit :: A way of taking advantage of a vulnerability.
GDPR :: A European law on personal data that gives people rights over how their data is collected and used.
HSTS :: A header that tells browsers to always use HTTPS for your site.
HttpOnly cookie :: A cookie that JavaScript cannot read, which protects session cookies from theft through XSS.
Input validation :: Checking everything that comes from users before trusting it. Never trust input.
Malware :: Software designed to harm, spy on or take over a computer.
Man-in-the-middle attack :: An attacker secretly sitting between two parties, reading or changing what they send.
OAuth :: A standard that lets you grant an app limited access to your account on another service without sharing your password.
OWASP :: A non-profit that publishes widely used guides to web security, including the Top 10 list of common risks.
Passkey :: A modern replacement for passwords that uses a key pair stored on your device and unlocked with a fingerprint or face.
Penetration testing :: Hiring someone to attack your system, with permission, to find weaknesses before real attackers do.
Personally identifiable information | PII :: Data that can identify a person, such as a name, email, phone number or address.
Phishing :: Fake emails or sites that trick people into giving away passwords or money.
Public-key cryptography | Asymmetric encryption :: Encryption with two linked keys: a public key anyone can use to lock a message, and a private key only the owner has to unlock it.
SameSite cookie :: A cookie setting that stops the browser sending the cookie with requests started from other sites, which defends against CSRF.
Secrets management :: Storing passwords, API keys and certificates safely, outside your code, in environment variables or a vault.
Single sign-on | SSO :: Logging in once to use several services.
Social engineering :: Manipulating people, rather than computers, to get access or information.
Symmetric encryption :: Encryption where the same key locks and unlocks the data.
Vulnerability :: A weakness in a system that an attacker could use.
Zero-day :: A vulnerability that is being exploited before the maker has had a chance to fix it.
Password manager :: A program that creates and stores strong, unique passwords for every site, so you only remember one.
OpenID Connect :: A layer on top of OAuth that lets an app learn who the user is.
