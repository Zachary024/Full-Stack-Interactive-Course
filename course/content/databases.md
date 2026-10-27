---
id: databases
number: 13
title: Databases: SQL and NoSQL
track: Back end
duration: 210 min
level: Intermediate
summary: Tables, keys and relationships. Query data with SQL in a live sandbox, design a schema, understand indexes and transactions, and compare relational with document databases.
---

::: objectives
- Explain why applications use a database instead of files or variables.
- Describe tables, rows, columns, primary keys and foreign keys.
- Write SQL to read, filter, sort, group, join, insert, update and delete data.
- Design a simple schema and explain normalization, indexes and transactions.
- Query a database from code safely, and explain SQL injection.
- Compare relational (SQL) and document (NoSQL) databases and choose between them.
:::

::: prereq
Back-End Development, and Programming Fundamentals. Everything in the SQL sections runs in your browser, so you need to install nothing.
:::

## Why a database?

A variable disappears when the program stops. A text file survives, but it is slow to search, easy to corrupt when two programs write at once, and has no rules. A [[Database|database]] is software that stores data **safely and permanently**, finds it **quickly** even among millions of records, lets many users work **at the same time**, and can **enforce rules** (an email must be unique, an order must belong to a real customer).

::: plain
A database is a very organised, very fast filing room with a strict clerk. You ask the clerk questions ("all orders from Ada last month"), and the clerk finds the answer without you having to open every drawer. The clerk also refuses to file anything that breaks the rules.
:::

There are two main families.

| | Relational (SQL) | Document (NoSQL) |
|---|---|---|
| Data shape | Tables of rows and columns | Collections of JSON-like documents |
| Structure | Fixed schema, defined up front | Flexible. Documents can differ |
| Relationships | Joins across tables | Often nested inside the document |
| Examples | PostgreSQL, MySQL, SQLite, SQL Server | MongoDB, Firestore, DynamoDB |
| Strong at | Consistency, reporting, complex queries | Flexible, nested, fast-changing data |

When you do not know which to pick, choose **PostgreSQL**. It is reliable, widely supported, and can even store JSON.

## The relational model

A relational database stores data in **tables**. A table has **columns** (the fields, each with a type) and **rows** (one record per row).

::: figure svg Four tables linked by keys
<svg class="fg" viewBox="0 0 800 220" role="img" aria-label="Entity relationship diagram. customers have many orders. orders have many order_items. products appear in many order_items." style="max-width:800px;min-width:520px" xmlns="http://www.w3.org/2000/svg">
<rect x="10" y="40" width="165" height="130" rx="8" class="fg-box"/><rect x="10" y="40" width="165" height="30" rx="8" class="fg-box fg-accent"/><text x="92" y="60" text-anchor="middle" class="fg-title">customers</text><text x="22" y="94" class="fg-code" style="font-size:13px">id (PK)</text><text x="22" y="116" class="fg-code" style="font-size:13px">name</text><text x="22" y="138" class="fg-code" style="font-size:13px">city</text><text x="22" y="160" class="fg-code" style="font-size:13px">joined</text>
<rect x="215" y="40" width="165" height="130" rx="8" class="fg-box"/><rect x="215" y="40" width="165" height="30" rx="8" class="fg-box fg-accent"/><text x="297" y="60" text-anchor="middle" class="fg-title">orders</text><text x="227" y="94" class="fg-code" style="font-size:13px">id (PK)</text><text x="227" y="116" class="fg-code" style="font-size:13px">customer_id (FK)</text><text x="227" y="138" class="fg-code" style="font-size:13px">ordered_on</text><text x="227" y="160" class="fg-code" style="font-size:13px">status</text>
<rect x="420" y="40" width="165" height="130" rx="8" class="fg-box"/><rect x="420" y="40" width="165" height="30" rx="8" class="fg-box fg-accent"/><text x="502" y="60" text-anchor="middle" class="fg-title">order_items</text><text x="432" y="94" class="fg-code" style="font-size:13px">order_id (FK)</text><text x="432" y="116" class="fg-code" style="font-size:13px">product_id (FK)</text><text x="432" y="138" class="fg-code" style="font-size:13px">quantity</text>
<rect x="625" y="40" width="165" height="130" rx="8" class="fg-box"/><rect x="625" y="40" width="165" height="30" rx="8" class="fg-box fg-accent"/><text x="707" y="60" text-anchor="middle" class="fg-title">products</text><text x="637" y="94" class="fg-code" style="font-size:13px">id (PK)</text><text x="637" y="116" class="fg-code" style="font-size:13px">name</text><text x="637" y="138" class="fg-code" style="font-size:13px">category</text><text x="637" y="160" class="fg-code" style="font-size:13px">price</text>
<line x1="175" y1="105" x2="215" y2="105" class="fg-line"/><text x="179" y="98" class="fg-msg">1</text><text x="203" y="98" class="fg-msg">N</text>
<line x1="380" y1="105" x2="420" y2="105" class="fg-line"/><text x="384" y="98" class="fg-msg">1</text><text x="408" y="98" class="fg-msg">N</text>
<line x1="585" y1="105" x2="625" y2="105" class="fg-line"/><text x="589" y="98" class="fg-msg">N</text><text x="613" y="98" class="fg-msg">1</text>
<text x="400" y="200" text-anchor="middle" class="fg-sub">PK = primary key. FK = foreign key. order_items links orders and products</text>
</svg>
:::

Two kinds of key make the model work:

- A **[[Primary key]]** uniquely identifies each row in its table (`customers.id`). No two rows share it, and it never changes.
- A **[[Foreign key]]** is a column that stores the primary key of a row in *another* table (`orders.customer_id`). It creates the relationship, and the database refuses an order for a customer that does not exist.

Instead of copying Ada's name and city into every one of her orders (and having to fix every copy when she moves), you store her once, and orders point at her. That separation is the heart of relational design.

## SQL: asking questions

**SQL** (Structured Query Language) is the standard language for relational databases. You describe **what** you want, and the database works out **how** to get it. Every SQL query is built from a few clauses, in a fixed order.

::: figure blocks The anatomy of a SELECT query
SELECT name, price | which columns ; FROM products | which table ; WHERE price < 10 | which rows ; ORDER BY price | in what order ; LIMIT 5 | how many
:::

The sandboxes in this module have a small online-shop database: `customers`, `products`, `orders` and `order_items`. Open "Show the tables" to see the data. Everything runs in your browser.

::: sqlplay Your first SELECT
Run the query. Then change the columns, add `WHERE category = 'Electronics'`, or sort with `ORDER BY price DESC`.
```sql schema
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT, joined TEXT);
INSERT INTO customers VALUES (1,'Ada','Lagos','2024-01-15'),(2,'Tunde','Abuja','2024-02-20'),(3,'Chidi','Lagos','2024-03-05'),(4,'Amina','Kano','2024-03-18'),(5,'Zainab','Abuja','2024-04-02');
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT, price REAL NOT NULL, stock INTEGER);
INSERT INTO products VALUES (1,'Notebook','Stationery',4.5,120),(2,'Pen','Stationery',1.2,300),(3,'Backpack','Bags',35.0,40),(4,'Headphones','Electronics',59.9,25),(5,'Keyboard','Electronics',45.0,0),(6,'Desk lamp','Home',22.5,15);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER REFERENCES customers(id), ordered_on TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,'2024-05-01','shipped'),(2,1,'2024-05-20','pending'),(3,2,'2024-05-21','shipped'),(4,3,'2024-06-02','cancelled'),(5,4,'2024-06-10','shipped');
CREATE TABLE order_items (order_id INTEGER, product_id INTEGER, quantity INTEGER);
INSERT INTO order_items VALUES (1,1,2),(1,2,5),(2,4,1),(3,3,1),(3,1,1),(4,5,1),(5,6,2),(5,2,10);
```
```sql starter
SELECT name, category, price
FROM products;
```
:::

### Filtering with WHERE

`WHERE` keeps only rows for which a condition is true. Combine conditions with `AND`, `OR` and `NOT`.

| Operator | Meaning | Example |
|---|---|---|
| `=`, `<>`, `<`, `>`, `<=`, `>=` | Compare | `price >= 20` |
| `AND`, `OR`, `NOT` | Combine | `city = 'Lagos' AND joined > '2024-02-01'` |
| `IN (...)` | One of a list | `category IN ('Bags','Home')` |
| `BETWEEN a AND b` | In a range | `price BETWEEN 10 AND 50` |
| `LIKE` | Pattern. `%` means anything | `name LIKE 'D%'` |
| `IS NULL` | Missing value | `stock IS NULL` |

::: pitfall NULL is not a value
`NULL` means "unknown or missing". Comparing with it never works the way you expect: `stock = NULL` is never true. Always write `stock IS NULL` or `IS NOT NULL`.
:::

::: sqlchallenge cheap Find the cheap products
List the `name` and `price` of every product that costs **less than 10**, with the cheapest first.

Hint: Use `WHERE price < 10`.
Hint: Add `ORDER BY price` at the end. Ascending order is the default.
```sql schema
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT, price REAL NOT NULL, stock INTEGER);
INSERT INTO products VALUES (1,'Notebook','Stationery',4.5,120),(2,'Pen','Stationery',1.2,300),(3,'Backpack','Bags',35.0,40),(4,'Headphones','Electronics',59.9,25),(5,'Keyboard','Electronics',45.0,0),(6,'Desk lamp','Home',22.5,15);
```
```sql starter
SELECT name, price
FROM products;
```
```sql solution
SELECT name, price FROM products WHERE price < 10 ORDER BY price;
```
:::

::: sqlchallenge lagos Customers in Lagos
List only the `name` of customers whose `city` is Lagos, in alphabetical order.

Hint: Text values go in single quotes: `city = 'Lagos'`.
Hint: Finish with `ORDER BY name`.
```sql schema
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT, joined TEXT);
INSERT INTO customers VALUES (1,'Ada','Lagos','2024-01-15'),(2,'Tunde','Abuja','2024-02-20'),(3,'Chidi','Lagos','2024-03-05'),(4,'Amina','Kano','2024-03-18'),(5,'Zainab','Abuja','2024-04-02');
```
```sql starter
SELECT name
FROM customers;
```
```sql solution
SELECT name FROM customers WHERE city = 'Lagos' ORDER BY name;
```
:::

::: quiz check Checkpoint: tables and basic queries
?  What is the role of a foreign key?
- It uniquely identifies a row in its own table
- *It stores the primary key of a row in another table, creating a relationship
- It encrypts a column
- It speeds up every query
> A foreign key such as `orders.customer_id` points at `customers.id`, and the database enforces that the target exists.

?  Which query returns the names of products that cost at least 20?
- `SELECT name FROM products WHERE price => 20;`
- *`SELECT name FROM products WHERE price >= 20;`
- `SELECT name WHERE price >= 20;`
- `FIND name IN products WHERE price >= 20;`
> The operator is `>=`, and the table needs a `FROM` clause.

?tf `WHERE stock = NULL` finds the rows where stock is missing. | false
> Nothing equals NULL. Use `IS NULL`.
:::

## Summarising data: aggregates and GROUP BY

**Aggregate functions** collapse many rows into one value: `COUNT`, `SUM`, `AVG`, `MIN` and `MAX`. With `GROUP BY` you compute one result per group.

```sql
SELECT category, COUNT(*) AS products, ROUND(AVG(price), 2) AS avg_price
FROM products
GROUP BY category
ORDER BY avg_price DESC;
```

Read it as: "Put the products into groups by category. For each group, count them and average the price."

- `WHERE` filters **rows before** grouping.
- `HAVING` filters **groups after** aggregating (for example `HAVING COUNT(*) > 1`).
- `AS` gives a column a friendly name.

::: sqlplay Group and count
Try `SUM(stock)`, `MIN(price)` or `MAX(price)`. Add `HAVING COUNT(*) > 1` to see only categories with more than one product.
```sql schema
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT, joined TEXT);
INSERT INTO customers VALUES (1,'Ada','Lagos','2024-01-15'),(2,'Tunde','Abuja','2024-02-20'),(3,'Chidi','Lagos','2024-03-05'),(4,'Amina','Kano','2024-03-18'),(5,'Zainab','Abuja','2024-04-02');
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT, price REAL NOT NULL, stock INTEGER);
INSERT INTO products VALUES (1,'Notebook','Stationery',4.5,120),(2,'Pen','Stationery',1.2,300),(3,'Backpack','Bags',35.0,40),(4,'Headphones','Electronics',59.9,25),(5,'Keyboard','Electronics',45.0,0),(6,'Desk lamp','Home',22.5,15);
```
```sql starter
SELECT city, COUNT(*) AS customers
FROM customers
GROUP BY city
ORDER BY customers DESC;
```
:::

::: sqlchallenge bycat Average price per category
For each product `category`, return the category, the number of products as `n`, and the average price rounded to two decimals as `avg_price`. Order the result by category.

Hint: `SELECT category, COUNT(*) AS n, ROUND(AVG(price), 2) AS avg_price`.
Hint: Add `GROUP BY category` and then `ORDER BY category`.
```sql schema
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT, price REAL NOT NULL, stock INTEGER);
INSERT INTO products VALUES (1,'Notebook','Stationery',4.5,120),(2,'Pen','Stationery',1.2,300),(3,'Backpack','Bags',35.0,40),(4,'Headphones','Electronics',59.9,25),(5,'Keyboard','Electronics',45.0,0),(6,'Desk lamp','Home',22.5,15);
```
```sql starter
SELECT category
FROM products;
```
```sql solution
SELECT category, COUNT(*) AS n, ROUND(AVG(price), 2) AS avg_price FROM products GROUP BY category ORDER BY category;
```
:::

## Joins: combining tables

Data is split across tables, so you recombine it with a **JOIN**. You tell SQL which columns match: usually a foreign key against the primary key it points to.

```sql
SELECT customers.name, orders.id, orders.status
FROM orders
JOIN customers ON orders.customer_id = customers.id;
```

For every order, SQL finds the customer with the matching `id` and puts their columns on the same row.

| Join | Keeps |
|---|---|
| `INNER JOIN` (or just `JOIN`) | Only rows with a match on **both** sides |
| `LEFT JOIN` | **All** rows from the left table, with `NULL` where the right has no match |
| `RIGHT JOIN` / `FULL JOIN` | The mirror image, or both sides (not in SQLite) |

::: stepper How a JOIN is worked out
1. **Start with the left table.** `FROM orders` provides five rows.
2. **For each row, look at the join condition.** `ON orders.customer_id = customers.id`.
3. **Find the matching rows on the other side.** Order 1 has `customer_id = 1`, which matches Ada.
4. **Combine them into one wider row.** Order columns, then customer columns.
5. **With a plain JOIN, drop rows with no match. With a LEFT JOIN, keep them with NULLs.**
6. **Then apply WHERE, GROUP BY, and the rest** to the combined rows.
:::

::: sqlplay Join the tables
Short names (aliases) after table names such as `orders o` save typing. Change `JOIN` to `LEFT JOIN` on customers to find out who has never ordered. Look for NULL.
```sql schema
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT, joined TEXT);
INSERT INTO customers VALUES (1,'Ada','Lagos','2024-01-15'),(2,'Tunde','Abuja','2024-02-20'),(3,'Chidi','Lagos','2024-03-05'),(4,'Amina','Kano','2024-03-18'),(5,'Zainab','Abuja','2024-04-02');
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT, price REAL NOT NULL, stock INTEGER);
INSERT INTO products VALUES (1,'Notebook','Stationery',4.5,120),(2,'Pen','Stationery',1.2,300),(3,'Backpack','Bags',35.0,40),(4,'Headphones','Electronics',59.9,25),(5,'Keyboard','Electronics',45.0,0),(6,'Desk lamp','Home',22.5,15);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER REFERENCES customers(id), ordered_on TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,'2024-05-01','shipped'),(2,1,'2024-05-20','pending'),(3,2,'2024-05-21','shipped'),(4,3,'2024-06-02','cancelled'),(5,4,'2024-06-10','shipped');
CREATE TABLE order_items (order_id INTEGER, product_id INTEGER, quantity INTEGER);
INSERT INTO order_items VALUES (1,1,2),(1,2,5),(2,4,1),(3,3,1),(3,1,1),(4,5,1),(5,6,2),(5,2,10);
```
```sql starter
SELECT o.id AS order_id, c.name AS customer, o.status
FROM orders o
JOIN customers c ON o.customer_id = c.id;
```
:::

::: sqlchallenge join Who has shipped orders?
Return the customer's `name` and the order `id` for every order whose status is `shipped`. Sort by the order id. (The two columns can keep their original names.)

Hint: Join `customers` and `orders` with `ON orders.customer_id = customers.id`.
Hint: Filter with `WHERE orders.status = 'shipped'` and then `ORDER BY orders.id`.
```sql schema
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT, joined TEXT);
INSERT INTO customers VALUES (1,'Ada','Lagos','2024-01-15'),(2,'Tunde','Abuja','2024-02-20'),(3,'Chidi','Lagos','2024-03-05'),(4,'Amina','Kano','2024-03-18'),(5,'Zainab','Abuja','2024-04-02');
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER REFERENCES customers(id), ordered_on TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,'2024-05-01','shipped'),(2,1,'2024-05-20','pending'),(3,2,'2024-05-21','shipped'),(4,3,'2024-06-02','cancelled'),(5,4,'2024-06-10','shipped');
```
```sql starter
SELECT c.name, o.id
FROM customers c, orders o;
```
```sql solution
SELECT c.name, o.id FROM customers c JOIN orders o ON o.customer_id = c.id WHERE o.status = 'shipped' ORDER BY o.id;
```
:::

::: sqlchallenge noorders Customers who never ordered
Return the `name` of every customer who has **no orders at all**.

Hint: A `LEFT JOIN` keeps customers without orders, filling the order columns with NULL.
Hint: `... LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL`
```sql schema
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT, joined TEXT);
INSERT INTO customers VALUES (1,'Ada','Lagos','2024-01-15'),(2,'Tunde','Abuja','2024-02-20'),(3,'Chidi','Lagos','2024-03-05'),(4,'Amina','Kano','2024-03-18'),(5,'Zainab','Abuja','2024-04-02');
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER REFERENCES customers(id), ordered_on TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,'2024-05-01','shipped'),(2,1,'2024-05-20','pending'),(3,2,'2024-05-21','shipped'),(4,3,'2024-06-02','cancelled'),(5,4,'2024-06-10','shipped');
```
```sql starter
SELECT name
FROM customers;
```
```sql solution
SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;
```
:::

::: sqlchallenge revenue Order totals
For each order that is **not cancelled**, return the order `id` and its total value as `total`, which is the sum of `price * quantity` over its items. Sort by order id. You need to join three tables.

Hint: Join `orders`, `order_items` and `products`. The items table holds `order_id` and `product_id`.
Hint: `SUM(p.price * i.quantity) AS total`, `WHERE o.status <> 'cancelled'`, `GROUP BY o.id`.
```sql schema
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT, price REAL NOT NULL, stock INTEGER);
INSERT INTO products VALUES (1,'Notebook','Stationery',4.5,120),(2,'Pen','Stationery',1.2,300),(3,'Backpack','Bags',35.0,40),(4,'Headphones','Electronics',59.9,25),(5,'Keyboard','Electronics',45.0,0),(6,'Desk lamp','Home',22.5,15);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, ordered_on TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,'2024-05-01','shipped'),(2,1,'2024-05-20','pending'),(3,2,'2024-05-21','shipped'),(4,3,'2024-06-02','cancelled'),(5,4,'2024-06-10','shipped');
CREATE TABLE order_items (order_id INTEGER, product_id INTEGER, quantity INTEGER);
INSERT INTO order_items VALUES (1,1,2),(1,2,5),(2,4,1),(3,3,1),(3,1,1),(4,5,1),(5,6,2),(5,2,10);
```
```sql starter
SELECT id
FROM orders;
```
```sql solution
SELECT o.id, SUM(p.price * i.quantity) AS total FROM orders o JOIN order_items i ON i.order_id = o.id JOIN products p ON p.id = i.product_id WHERE o.status <> 'cancelled' GROUP BY o.id ORDER BY o.id;
```
:::

::: quiz check Checkpoint: grouping and joins
?  Which clause filters groups after aggregation?
- `WHERE`
- *`HAVING`
- `ORDER BY`
- `LIMIT`
> `WHERE` filters rows before grouping. `HAVING` filters the groups produced.

?  You want every customer, including those with no orders. Which join do you need?
- `INNER JOIN` from customers to orders
- *`LEFT JOIN` from customers to orders
- `CROSS JOIN`
- No join, just `WHERE`
> LEFT JOIN keeps all rows from the left table and fills missing matches with NULL.

?short Which aggregate function counts rows? Type its name. | COUNT
> `COUNT(*)` counts rows. `SUM`, `AVG`, `MIN` and `MAX` work on values.
:::

## Changing data

Four statements cover everything: `SELECT` (read), `INSERT` (create), `UPDATE` (change) and `DELETE` (remove). Together they are **CRUD**.

```sql
INSERT INTO customers (name, city, joined) VALUES ('Ife', 'Lagos', '2024-07-01');

UPDATE products SET price = 5.0 WHERE name = 'Notebook';

DELETE FROM orders WHERE status = 'cancelled';
```

::: pitfall The most expensive missing word in SQL
`UPDATE products SET price = 5.0;` with no `WHERE` changes **every row**. `DELETE FROM orders;` deletes them all. Write the `WHERE` first, run it as a `SELECT` to see which rows it matches, and only then turn it into an `UPDATE` or `DELETE`. In production, back up before bulk changes.
:::

::: sqlplay Safe editing sandbox
Make a mistake here and nothing is lost: "Reset data" restores the tables. Run an UPDATE, and then a SELECT, to check it.
```sql schema
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT, price REAL NOT NULL, stock INTEGER);
INSERT INTO products VALUES (1,'Notebook','Stationery',4.5,120),(2,'Pen','Stationery',1.2,300),(3,'Backpack','Bags',35.0,40),(4,'Headphones','Electronics',59.9,25),(5,'Keyboard','Electronics',45.0,0),(6,'Desk lamp','Home',22.5,15);
```
```sql starter
UPDATE products SET price = price * 1.1 WHERE category = 'Electronics';
SELECT name, price FROM products WHERE category = 'Electronics';
```
:::

## Designing a good schema

### Constraints

Constraints are rules the database enforces for you, whatever the application does.

```sql
CREATE TABLE users (
  id         INTEGER PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TEXT NOT NULL
);
```

`NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`, `PRIMARY KEY` and `FOREIGN KEY` catch bugs and bad data close to the source.

### Normalization

**Normalization** means organising data so that each fact is stored **once**. Consider an orders table that repeats everything:

| order_id | customer_name | customer_city | product | price |
|---|---|---|---|---|
| 1 | Ada | Lagos | Notebook | 4.50 |
| 2 | Ada | Lagos | Headphones | 59.90 |
| 3 | Ada | Abuja | Pen | 1.20 |

Row 3 says Ada lives in Abuja while the other rows say Lagos. Which is right? Repeated data **drifts apart**. The remedy is the design you have been using: a `customers` table, a `products` table, and an `orders` table holding only keys.

Rules of thumb:
1. Every table is about **one thing** (customers, orders, products).
2. Every column holds **one value** (not a comma-separated list).
3. Every non-key column describes **the key**, and nothing else.
4. A **many-to-many** relationship (orders and products) needs a **junction table** (`order_items`).

### Indexes

Without help, finding `WHERE email = 'ada@x.com'` means reading every row. An **[[Index|index]]** is a sorted lookup structure, like the index at the back of a book, that lets the database jump straight to the matching rows.

```sql
CREATE INDEX idx_orders_customer ON orders (customer_id);
```

Index columns you filter, join and sort by often (foreign keys are the usual candidates). But indexes take space and slow down writes, so do not index everything.

::: figure flow Finding a row with and without an index
Without an index | read every row: slow on big tables -> Add an index | CREATE INDEX on the column -> *With an index | jump straight to the match: fast
:::

### Transactions

A **transaction** groups several changes into one all-or-nothing unit. Transferring 100 from account A to account B is two updates. If the server crashes between them, money vanishes.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;      -- or ROLLBACK; to cancel everything
```

Transactions give databases the **ACID** guarantees: **A**tomic (all or nothing), **C**onsistent (rules always hold), **I**solated (concurrent users do not see half-finished work) and **D**urable (once committed, it survives a crash).

::: quiz check Checkpoint: design
?  Why is it a problem to store the customer's city in every order row?
- It uses too many colours
- *The copies can disagree, and an update must find them all
- SQL does not allow text columns in orders
- It makes the primary key longer
> Each fact should be stored once. Duplicates drift apart.

?  What is the purpose of an index?
- To enforce a foreign key
- *To make lookups, joins and sorting on a column faster
- To encrypt data
- To remove duplicates
> An index is a sorted structure that avoids scanning every row.

?  What does a transaction guarantee?
- That queries are always fast
- *That a group of changes either all happen or none do
- That data is encrypted
- That two users never connect at once
> It makes multi-step changes atomic, so that failures never leave half-finished data.
:::

## Using a database from code

Applications send SQL to the database through a **driver** or library. There is one rule that matters above all the others.

::: pitfall SQL injection: never build queries by joining strings
This code is dangerous:
```js
// NEVER do this
const sql = "SELECT * FROM users WHERE email = '" + email + "'";
```
If a visitor types `' OR '1'='1` as their email, the query becomes `... WHERE email = '' OR '1'='1'`, which matches **every user**. Worse input can delete tables or steal data. This is [[SQL injection]], one of the most damaging and most common vulnerabilities.
:::

The cure is **parameterised queries** (also called prepared statements). You send the SQL **with placeholders**, and the values **separately**. The database never treats the values as SQL, whatever they contain. Every language has this feature.

::: code Safe, parameterised queries
```javascript
// npm install pg
async function findUser(pool, email) {
  const result = await pool.query("SELECT id, name FROM users WHERE email = $1", [email]);
  return result.rows[0];
}
```
```python
import sqlite3

def find_user(conn, email):
    cur = conn.execute("SELECT id, name FROM users WHERE email = ?", (email,))
    return cur.fetchone()
```
```java
import java.sql.*;

String sql = "SELECT id, name FROM users WHERE email = ?";
try (PreparedStatement stmt = conn.prepareStatement(sql)) {
    stmt.setString(1, email);
    try (ResultSet rs = stmt.executeQuery()) {
        if (rs.next()) System.out.println(rs.getString("name"));
    }
}
```
```csharp
using var cmd = new SqlCommand("SELECT Id, Name FROM Users WHERE Email = @email", conn);
cmd.Parameters.AddWithValue("@email", email);
using var reader = cmd.ExecuteReader();
```
```php
<?php
$stmt = $pdo->prepare("SELECT id, name FROM users WHERE email = :email");
$stmt->execute(["email" => $email]);
$user = $stmt->fetch();
```
```go
row := db.QueryRow("SELECT id, name FROM users WHERE email = $1", email)
var id int
var name string
err := row.Scan(&id, &name)
```
```ruby
result = conn.exec_params("SELECT id, name FROM users WHERE email = $1", [email])
user = result.first
```
:::

Many teams use an **[[ORM]]** (Object-Relational Mapper) such as Prisma, Sequelize, SQLAlchemy, Hibernate or Entity Framework. It maps tables to objects in your language and writes the SQL for you, safely. ORMs are convenient, but learn SQL first. When an ORM query is slow or wrong, only SQL knowledge lets you see why.

## Document databases: MongoDB

A document database stores **documents**: JSON-like objects, grouped into **collections** (the rough equivalent of tables). Documents in one collection need not have the same fields, and related data is often **nested inside** the document.

```json
{
  "_id": "665f1c2e",
  "name": "Ada",
  "email": "ada@example.com",
  "address": { "city": "Lagos", "country": "NG" },
  "orders": [
    { "date": "2024-05-01", "items": [{ "product": "Notebook", "qty": 2 }] }
  ]
}
```

MongoDB's queries are themselves JSON-like:

```js
db.users.insertOne({ name: "Ada", city: "Lagos", age: 36 });

db.users.find({ city: "Lagos", age: { $gt: 30 } });          // WHERE city = 'Lagos' AND age > 30

db.users.updateOne({ name: "Ada" }, { $set: { age: 37 } });   // UPDATE ... SET

db.users.deleteOne({ name: "Ada" });
```

### Choosing between SQL and NoSQL

| Choose relational (SQL) when... | Choose document (NoSQL) when... |
|---|---|
| Data has clear relationships (customers, orders, products) | Data is naturally a self-contained document (a blog post with comments) |
| You need strict rules and multi-row transactions (money, stock) | The shape varies or changes quickly |
| You will report and analyse across the data | You read whole documents far more often than you join |
| You are unsure | You need to scale writes across many machines |

::: learn Other kinds of database
- **Key-value stores** (Redis) are very fast, used for caches, sessions and rate limits.
- **Search engines** (Elasticsearch) are used for full-text search.
- **Graph databases** (Neo4j) are used for highly connected data such as social networks.
- **Time-series databases** (InfluxDB) are used for metrics and sensor data.
Real systems often use several, each for what it does best. Start with one relational database and add others only when you have a clear reason.
:::

::: lab Lab: design a database for a course platform
Design and build the database for a small learning site.
1. List the **entities**: users, courses, lessons, enrolments, quiz attempts. For each, list its fields.
2. Sketch the relationships on paper: a course has many lessons, a user enrols in many courses (and a course has many users), a user has many quiz attempts. Mark every one-to-many and many-to-many.
3. Write the `CREATE TABLE` statements with primary keys, foreign keys, `NOT NULL`, `UNIQUE` (email) and a `CHECK` (role or score between 0 and 100). Use the SQL sandbox, or install SQLite or PostgreSQL.
4. Insert sample data: five users, three courses, ten lessons, and some enrolments and attempts.
5. Write queries that answer: lessons in each course, the courses a user is enrolled in, the average quiz score per course, and users who have never enrolled.
6. Add an index to the column you filter by most, and explain why.
7. Write a transaction that enrols a user and records a payment, so that both happen or neither does.
8. Write the same "find user by email" lookup from code using a parameterised query in your language.
9. Stretch goal: model the same data as MongoDB documents. Which parts did you nest, and why?
:::

::: pitfall Common database mistakes
- **Building SQL with string concatenation.** Use parameters, always.
- **`UPDATE` or `DELETE` without `WHERE`.**
- **Storing lists in one column** ("1,2,3"). Use a related table.
- **No foreign keys or constraints**, then "fixing" the bad data in application code.
- **Storing money in floating-point numbers.** Use integers (cents) or a `DECIMAL` type.
- **Storing passwords in plain text.** Hash them (see the Security module).
- **Forgetting indexes on foreign keys**, and then wondering why joins are slow.
- **`SELECT *` in application code.** Name the columns you need.
- **Treating NoSQL as "no design needed".** A schema still exists, in your code.
:::

::: recap
- A database stores data safely, quickly and with rules. Relational databases use tables linked by keys.
- A primary key identifies a row. A foreign key points at another table's primary key.
- SQL clauses go `SELECT`, `FROM`, `JOIN`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT`.
- Aggregates summarise groups. `WHERE` filters rows and `HAVING` filters groups. LEFT JOIN keeps unmatched rows.
- Always put a `WHERE` on `UPDATE` and `DELETE`.
- Store each fact once (normalization), add indexes where you search, and wrap multi-step changes in transactions.
- Parameterised queries prevent SQL injection.
- Document databases store flexible JSON-like documents. Pick by the shape of your data.
:::

::: quiz test Module test: Databases
?  Which SQL statement adds a new row?
- `ADD`
- *`INSERT`
- `UPDATE`
- `CREATE ROW`
> `INSERT INTO table (...) VALUES (...)` creates a row.

?  What is the result of `SELECT COUNT(*) FROM products WHERE price > 20;` for the sandbox products (prices 4.5, 1.2, 35, 59.9, 45, 22.5)?
- 3
- *4
- 5
- 6
> Four products cost more than 20: Backpack, Headphones, Keyboard and Desk lamp.

?  Which statement is true about primary keys?
- Two rows can share the same primary key
- *Each row's primary key is unique within its table
- A table can have no key at all in a good design
- A primary key must be text
> Uniqueness is the entire point of a primary key.

?  A `LEFT JOIN` from customers to orders returns a customer with no orders. What appears in the order columns?
- The customer's data
- Zero
- *NULL
- The query fails
> Unmatched rows from the right side are filled with NULL.

?  What does `GROUP BY city` with `COUNT(*)` produce?
- One row per customer
- *One row per city, with how many customers it has
- One row in total
- An error
> Groups are formed per distinct city, and the aggregate is calculated for each group.

?  Which approach prevents SQL injection?
- Removing spaces from user input
- Checking input length only
- *Parameterised queries
- Hiding the table names
> Parameters are sent separately from the SQL text, so the database never interprets them as code.

?  Why do many-to-many relationships need a junction table?
- To save disk space
- *A single foreign key column cannot hold many values, so each link is its own row
- SQL requires it for speed
- To add more indexes
> A table like `order_items` stores one row for each order-product pair.

?  Which of these is a sensible reason to choose a document database?
- You need strict multi-table transactions for banking
- *Your data is self-contained, with a flexible shape that changes often
- You want to enforce relationships with foreign keys
- You want to avoid thinking about data structure
> Documents suit flexible, nested, self-contained data. Strong relationships and transactions favour relational databases.

?tf `DELETE FROM orders;` with no WHERE clause deletes only the first row. | false
> Without a condition it affects every row in the table.

?tf An index makes reads faster but can make writes a little slower. | true
> The index has to be updated on every insert, update and delete.

?short Which SQL keyword removes duplicate rows from a result, as in `SELECT ___ city FROM customers`? Type it. | DISTINCT
> `SELECT DISTINCT city FROM customers` returns each city once.

?multi Which of these are ACID properties? Select all that apply.
- *Atomicity
- *Consistency
- *Isolation
- Compression
> ACID stands for atomicity, consistency, isolation and durability.
:::
