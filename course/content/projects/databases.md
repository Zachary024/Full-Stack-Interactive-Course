::: project library-db Design a library database
Time: 3-4 hours
Level: Intermediate
Skills: data modelling, SQL schema, constraints, joins, aggregation, indexes, transactions

A community library tracks books, members and loans on paper and wants a database. You will design the tables, write the schema, load sample data and answer the librarian's questions with SQL. You can use the SQL playground in this course, SQLite, or PostgreSQL.

Requirements:
- Draw an entity-relationship diagram (by hand is fine) showing at least these entities: author, book, member, loan and copy. Mark each relationship as one-to-many or many-to-many.
- A book can have several authors and an author can write several books, so you need a joining table.
- Every table has a primary key. Relationships use foreign keys. Use `NOT NULL`, `UNIQUE` and `CHECK` constraints where they make sense (for example, a unique member email and a due date that is after the loan date).
- The schema is repeatable: a single `schema.sql` file that creates every table, and a separate `seed.sql` that inserts at least 5 authors, 10 books, 6 members and 12 loans (some returned, some not).
- Write and save SQL for each of these questions: books currently on loan and who has them; overdue loans; the three most borrowed books; members who have never borrowed; the number of loans per member, including members with none; and the number of books per author.
- At least one query uses `JOIN`, one uses `LEFT JOIN`, one uses `GROUP BY` with `HAVING`, and one uses a subquery.
- Add at least one index that helps a real query from your list, and show the query plan before and after.
- Show a transaction that lends a copy: it records the loan and marks the copy as unavailable, and it must roll back if either step fails.
- Prove your constraints work by writing three statements that should fail (for example, a duplicate email) and recording the error each gives.

Steps:
1. List the nouns in the librarian's description. They are your candidate tables.
2. Decide for every pair of tables whether the relationship is one-to-many or many-to-many.
3. Draw the diagram, then write `schema.sql` and run it on an empty database.
4. Write `seed.sql` and check the data with a few `SELECT` statements.
5. Write the six queries in a file named `queries.sql`, each with a comment stating the question.
6. Add the index and compare the plans with `EXPLAIN` (or `EXPLAIN QUERY PLAN` in SQLite).
7. Write the transaction and the three failing statements.

Starter:
```sql
CREATE TABLE author (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL
);

CREATE TABLE book (
  id    INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  year  INTEGER CHECK (year > 0)
);

-- TODO: book_author (joining table), member, copy, loan
-- TODO: foreign keys, UNIQUE email, CHECK (due_date > loan_date)

-- Example of the style for a query:
-- Question: which books are on loan right now?
SELECT b.title, m.name
FROM loan l
JOIN copy c ON c.id = l.copy_id
JOIN book b ON b.id = c.book_id
JOIN member m ON m.id = l.member_id
WHERE l.returned_on IS NULL;
```

Hints:
- A copy is one physical item. A book is the title. Two copies of the same book share one book row.
- "Never borrowed" means there is no matching loan, which is a job for `LEFT JOIN ... WHERE loan.id IS NULL`.
- Remember to turn foreign keys on in SQLite with `PRAGMA foreign_keys = ON;`.
- Counting with a `LEFT JOIN`? Count a column from the right-hand table, not `*`, or members with no loans show a count of 1.

Stretch:
- Add a fines table and a query that totals what each member owes.
- Add a view called `overdue_loans` and query it.
- Write the same schema for MongoDB and explain what you would embed and what you would reference.

Deliver:
- The diagram, `schema.sql`, `seed.sql` and `queries.sql`.
- A short note with the query plans, the transaction and the three failed statements with their errors.

Rubric:
- Model | Tables and relationships capture the real world without repeated data, and the joining table is correct.
- Integrity | Keys and constraints stop bad data, and the failed statements prove it.
- Queries | Each query answers its question exactly, handles members and books with no matches and uses the right kind of join.
- Performance and safety | The index is justified by a plan, and the transaction leaves the database consistent when something fails.
:::
