---
id: data
number: 14
title: Working with Data
track: Back end
duration: 190 min
level: Intermediate
summary: Collect, clean, summarise and chart data. The universal ideas, then practical pandas, matplotlib and seaborn in Python and the same moves in other languages.
---

::: objectives
- Describe the steps of a data analysis from raw data to a conclusion.
- Read tabular data from CSV and JSON, and explain what "tidy" data is.
- Clean data: missing values, duplicates, wrong types and outliers.
- Group, aggregate, filter, sort and join data, in several languages.
- Calculate and interpret the mean, median and spread.
- Choose an honest chart for a question, and spot a misleading one.
:::

::: prereq
Programming Fundamentals (loops, lists, dictionaries). The tab examples run in seven languages, and the pandas sections use Python, which is the most common language for data work. If you have not learned Python, read those examples as pseudocode and use the JavaScript challenges to practise.
:::

## Why data skills matter

Every application produces data: sign-ups, orders, clicks, errors, sensor readings. Someone has to turn that into answers. Which feature do people use? Why did sales dip in March? Is the new page faster? Full stack developers are often that someone, because they built the system that holds the data.

Data work follows the same loop almost every time.

::: figure flow The data analysis workflow
Ask | a clear question -> Collect | files, databases, APIs -> *Clean | fix gaps and errors -> Explore | summaries and charts -> Conclude | and communicate
:::

::: note Most of the time goes into cleaning
Surveys of data professionals repeatedly report that they spend more time preparing data than analysing it. Real data is messy, so cleaning is not a chore before the real work. It *is* the work.
:::

## Data formats

**CSV** (comma-separated values) is a plain text table: one row per line, values separated by commas, and the first line holds the column names. It is simple, universal and opens in any spreadsheet.

```text
student,class,score,passed
Ada,A,80,yes
Tunde,B,70,yes
Zainab,B,65,no
```

**JSON** is better for nested data, as returned by most APIs:

```json
[
  { "student": "Ada", "class": "A", "scores": { "math": 80, "english": 91 } },
  { "student": "Tunde", "class": "B", "scores": { "math": 70, "english": 64 } }
]
```

### Tidy data

Analysis tools like data in a consistent shape, called **tidy data**:
- each **column** is one variable (score, class),
- each **row** is one observation (one student),
- each **table** is about one kind of thing.

A table with columns `math_2023`, `math_2024` and `math_2025` is *not* tidy: the year is hiding in the column names. A tidy version has the columns `student`, `year` and `math`, and three rows per student.

## The core moves, in many languages

Whatever the tool, almost all analysis is built from four moves.

| Move | Question it answers | SQL word |
|---|---|---|
| **Filter** | Which rows do I care about? | `WHERE` |
| **Sort** | In what order? | `ORDER BY` |
| **Group and aggregate** | What is the total, average or count for each category? | `GROUP BY` |
| **Join** | How do I combine two tables? | `JOIN` |

Here is the most important one, **group and aggregate**, written in seven languages. The data is six students, each with a class and a score. The task is to print the average score for each class, in alphabetical order. Notice that the thinking is identical: collect scores under each class, then divide the sum by the count.

::: code Average score per class
```javascript
const classes = ["A", "B", "A", "B", "B", "C"];
const scores = [80, 70, 90, 75, 65, 60];

const groups = {};
classes.forEach((c, i) => {
  if (!groups[c]) groups[c] = [];
  groups[c].push(scores[i]);
});

for (const c of Object.keys(groups).sort()) {
  const list = groups[c];
  const sum = list.reduce((a, b) => a + b, 0);
  console.log(c + " " + sum / list.length);
}
```
```python
classes = ["A", "B", "A", "B", "B", "C"]
scores = [80, 70, 90, 75, 65, 60]

groups = {}
for c, s in zip(classes, scores):
    groups.setdefault(c, []).append(s)

for c in sorted(groups):
    print(c, sum(groups[c]) // len(groups[c]))
```
```java
import java.util.*;

String[] classes = {"A", "B", "A", "B", "B", "C"};
int[] scores = {80, 70, 90, 75, 65, 60};

Map<String, List<Integer>> groups = new TreeMap<>();
for (int i = 0; i < classes.length; i++) {
    groups.computeIfAbsent(classes[i], k -> new ArrayList<>()).add(scores[i]);
}
for (Map.Entry<String, List<Integer>> e : groups.entrySet()) {
    int sum = 0;
    for (int s : e.getValue()) sum += s;
    System.out.println(e.getKey() + " " + sum / e.getValue().size());
}
```
```csharp
using System.Linq;

var rows = new[] { ("A", 80), ("B", 70), ("A", 90), ("B", 75), ("B", 65), ("C", 60) };

foreach (var g in rows.GroupBy(r => r.Item1).OrderBy(g => g.Key))
{
    Console.WriteLine(g.Key + " " + (int)g.Average(r => r.Item2));
}
```
```php
<?php
$classes = ["A", "B", "A", "B", "B", "C"];
$scores = [80, 70, 90, 75, 65, 60];

$groups = [];
foreach ($classes as $i => $c) {
    $groups[$c][] = $scores[$i];
}
ksort($groups);
foreach ($groups as $c => $list) {
    echo $c . " " . intdiv(array_sum($list), count($list)) . "\n";
}
```
```go
classes := []string{"A", "B", "A", "B", "B", "C"}
scores := []int{80, 70, 90, 75, 65, 60}

groups := map[string][]int{}
for i, c := range classes {
    groups[c] = append(groups[c], scores[i])
}
keys := []string{}
for c := range groups {
    keys = append(keys, c)
}
sort.Strings(keys)
for _, c := range keys {
    sum := 0
    for _, s := range groups[c] {
        sum += s
    }
    fmt.Println(c, sum/len(groups[c]))
}
```
```ruby
classes = ["A", "B", "A", "B", "B", "C"]
scores = [80, 70, 90, 75, 65, 60]

groups = classes.zip(scores).group_by(&:first)
groups.sort.each do |c, pairs|
  list = pairs.map(&:last)
  puts "#{c} #{list.sum / list.size}"
end
```
```output
A 85
B 70
C 60
```
:::

Notice that the languages with built-in **grouping tools** (C# `GroupBy`, Ruby `group_by`) are shortest, and the pandas library you will meet next makes it a single line. Understanding the manual version is what lets you understand the shortcut.

::: figure svg The result as a bar chart
<svg class="fg" viewBox="0 0 520 250" role="img" aria-label="Bar chart of average score per class. Class A is 85, class B is 70, class C is 60. The vertical axis starts at zero." style="max-width:520px;min-width:360px" xmlns="http://www.w3.org/2000/svg">
<line x1="60" y1="20" x2="60" y2="200" class="fg-line"/><line x1="60" y1="200" x2="490" y2="200" class="fg-line"/>
<line x1="60" y1="110" x2="490" y2="110" class="fg-line fg-dash"/><line x1="60" y1="20" x2="490" y2="20" class="fg-line fg-dash"/>
<text x="52" y="204" text-anchor="end" class="fg-sub">0</text><text x="52" y="114" text-anchor="end" class="fg-sub">50</text><text x="52" y="24" text-anchor="end" class="fg-sub">100</text>
<rect x="100" y="47" width="80" height="153" rx="4" class="fg-box fg-accent"/><text x="140" y="40" text-anchor="middle" class="fg-title">85</text><text x="140" y="222" text-anchor="middle" class="fg-msg">Class A</text>
<rect x="250" y="74" width="80" height="126" rx="4" class="fg-box fg-accent"/><text x="290" y="67" text-anchor="middle" class="fg-title">70</text><text x="290" y="222" text-anchor="middle" class="fg-msg">Class B</text>
<rect x="400" y="92" width="80" height="108" rx="4" class="fg-box fg-accent"/><text x="440" y="85" text-anchor="middle" class="fg-title">60</text><text x="440" y="222" text-anchor="middle" class="fg-msg">Class C</text>
<text x="275" y="244" text-anchor="middle" class="fg-sub">Average score per class. The axis starts at zero, so bar heights are honest</text>
</svg>
:::

::: challenge groupavg Group and average
Write `groupAverage(rows, key, valueKey)`. `rows` is an array of objects. Return an **object** that maps each distinct value of `key` to the **average** of `valueKey` for those rows. For example, with `[{ c: 'A', s: 80 }, { c: 'B', s: 70 }, { c: 'A', s: 90 }]`, `groupAverage(rows, 'c', 's')` gives `{ A: 85, B: 70 }`.

Hint: Build two objects as you loop: one with the running sum per group, and one with the count per group. Then divide.
Hint: `sums[k] = (sums[k] || 0) + row[valueKey]` and `counts[k] = (counts[k] || 0) + 1`.
```js starter
function groupAverage(rows, key, valueKey) {
  // your code here
}
```
```js tests
const rows = [{ c: 'A', s: 80 }, { c: 'B', s: 70 }, { c: 'A', s: 90 }, { c: 'B', s: 75 }, { c: 'B', s: 65 }];
test('averages per group', () => assert.deepEqual(groupAverage(rows, 'c', 's'), { A: 85, B: 70 }));
test('single group', () => assert.deepEqual(groupAverage([{ c: 'X', s: 10 }], 'c', 's'), { X: 10 }));
test('empty input', () => assert.deepEqual(groupAverage([], 'c', 's'), {}));
test('other keys', () => assert.deepEqual(groupAverage([{ city: 'Lagos', age: 30 }, { city: 'Lagos', age: 40 }], 'city', 'age'), { Lagos: 35 }));
test('non-whole averages', () => assert.deepEqual(groupAverage([{ g: 'a', v: 1 }, { g: 'a', v: 2 }], 'g', 'v'), { a: 1.5 }));
```
```js solution
function groupAverage(rows, key, valueKey) {
  const sums = {}, counts = {};
  for (const row of rows) {
    const k = row[key];
    sums[k] = (sums[k] || 0) + row[valueKey];
    counts[k] = (counts[k] || 0) + 1;
  }
  const result = {};
  for (const k of Object.keys(sums)) result[k] = sums[k] / counts[k];
  return result;
}
```
:::

::: quiz check Checkpoint: data basics
?  In tidy data, what does each ROW represent?
- A variable
- *One observation, such as one student or one order
- A whole table
- A chart
> Each column is a variable, each row is an observation.

?  Which SQL clause performs the "group and aggregate" move?
- `WHERE`
- `JOIN`
- *`GROUP BY`
- `LIMIT`
> `GROUP BY` forms the groups, and aggregates such as `AVG` summarise each one.

?tf Data analysts usually spend more time cleaning data than building charts. | true
> Real data is messy, and preparing it is the largest part of most projects.
:::

## Reading and cleaning data

Real data has problems. The most common ones are in the table below, along with the usual treatment. Good analysts always **look** before they calculate.

| Problem | Example | Common treatment |
|---|---|---|
| Missing values | Blank age, `N/A`, `null` | Remove the row, fill with a sensible value (median, "Unknown"), or leave it out of the calculation |
| Duplicates | The same order twice | Remove duplicates by a key (such as `id`) |
| Wrong type | The number `"36"` stored as text | Convert the type |
| Inconsistent labels | `Lagos`, `lagos`, ` LAGOS ` | Trim whitespace and normalise the case |
| Outliers | An age of 999 | Investigate: a typo, or a real extreme? Do not delete without a reason |
| Impossible values | A negative quantity | Fix at the source, or exclude and report it |

::: best Never overwrite your raw data
Keep the original file untouched. Do all cleaning in a script that reads the raw data and writes a cleaned copy. Then your work is **repeatable**, and you can check what you changed and why.
:::

::: challenge parsecsv Parse a CSV file
Write `parseCsv(text)`. The first line holds the column names. Return an **array of objects**, one per data line. Values that look like numbers (`"36"`) must become numbers. All other values stay as text. Ignore blank lines. An empty text returns `[]`. (No quoted commas to worry about in this task.)

Hint: `text.split('\n')`, `trim` each line and `filter` out the empty ones. The first line is the header.
Hint: Convert with `v !== '' && !isNaN(Number(v)) ? Number(v) : v`.
```js starter
function parseCsv(text) {
  // your code here
}
```
```js tests
test('parses rows', () => assert.deepEqual(parseCsv('name,age\nAda,36\nTunde,29\n'), [{ name: 'Ada', age: 36 }, { name: 'Tunde', age: 29 }]));
test('text stays text', () => assert.deepEqual(parseCsv('a,b\nx,y'), [{ a: 'x', b: 'y' }]));
test('decimals', () => assert.deepEqual(parseCsv('item,price\nPen,1.5'), [{ item: 'Pen', price: 1.5 }]));
test('ignores blank lines', () => assert.equal(parseCsv('a\n1\n\n2\n\n').length, 2));
test('empty text', () => assert.deepEqual(parseCsv(''), []));
test('header only', () => assert.deepEqual(parseCsv('a,b'), []));
```
```js solution
function parseCsv(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l !== '');
  if (lines.length === 0) return [];
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    const row = {};
    headers.forEach((h, i) => {
      const v = cells[i];
      row[h] = v !== '' && v !== undefined && !isNaN(Number(v)) ? Number(v) : v;
    });
    return row;
  });
}
```
:::

::: challenge dedupe Remove duplicate records
Write `dedupe(rows, key)`. Return a **new** array that keeps only the **first** row for each distinct value of `key`, preserving the original order.

Hint: Keep a `Set` of the keys you have already seen.
Hint: `rows.filter((r) => { if (seen.has(r[key])) return false; seen.add(r[key]); return true; })`
```js starter
function dedupe(rows, key) {
  // your code here
}
```
```js tests
const rows = [{ id: 1, v: 'a' }, { id: 2, v: 'b' }, { id: 1, v: 'c' }, { id: 3, v: 'd' }, { id: 2, v: 'e' }];
test('keeps first of each', () => assert.deepEqual(dedupe(rows, 'id'), [{ id: 1, v: 'a' }, { id: 2, v: 'b' }, { id: 3, v: 'd' }]));
test('no duplicates', () => assert.deepEqual(dedupe([{ id: 1 }, { id: 2 }], 'id'), [{ id: 1 }, { id: 2 }]));
test('empty', () => assert.deepEqual(dedupe([], 'id'), []));
test('does not change the input', () => { const a = rows.slice(); dedupe(a, 'id'); assert.equal(a.length, 5); });
```
```js solution
function dedupe(rows, key) {
  const seen = new Set();
  return rows.filter((r) => {
    if (seen.has(r[key])) return false;
    seen.add(r[key]);
    return true;
  });
}
```
:::

## pandas: a spreadsheet in code

Python's **pandas** library is the standard tool for tabular data. Its main object is the **DataFrame**: a table with labelled columns. You will meet it in many jobs, and its ideas (and many of its method names) are copied by libraries in other languages. These examples are complete and verified: copy them into a file, install with `pip install pandas matplotlib seaborn`, and run them.

::: code Load and summarise a table
```python
import pandas as pd
from io import StringIO

csv = """student,class,score,passed
Ada,A,80,yes
Tunde,B,70,yes
Chidi,A,90,yes
Amina,B,75,yes
Zainab,B,65,no
Ife,C,60,no
"""
df = pd.read_csv(StringIO(csv))
print(df.head(3))
print()
print(df["score"].describe())
```
```output
  student class  score passed
0     Ada     A     80    yes
1   Tunde     B     70    yes
2   Chidi     A     90    yes

count     6.000000
mean     73.333333
std      10.801234
min      60.000000
25%      66.250000
50%      72.500000
75%      78.750000
max      90.000000
Name: score, dtype: float64
```
:::

(In real work you would write `pd.read_csv("scores.csv")`. The `StringIO` part simply lets this example be self-contained.) `describe()` gives you the count, mean, spread and quartiles of a column in one call, and is the first thing to run on any new column.

::: code Filter, group, derive and sort
```python
import pandas as pd
from io import StringIO

csv = """student,class,score,passed
Ada,A,80,yes
Tunde,B,70,yes
Chidi,A,90,yes
Amina,B,75,yes
Zainab,B,65,no
Ife,C,60,no
"""
df = pd.read_csv(StringIO(csv))

high = df[df["score"] >= 75]                       # filter rows
print(high[["student", "score"]])
print()
print(df.groupby("class")["score"].mean())         # group and aggregate
print()
df["grade"] = df["score"].apply(lambda s: "A" if s >= 80 else "B" if s >= 70 else "C")   # new column
print(df.sort_values("score", ascending=False)[["student", "grade"]].head(3))
```
```output
  student  score
0     Ada     80
2   Chidi     90
3   Amina     75

class
A    85.0
B    70.0
C    60.0
Name: score, dtype: float64

  student grade
2   Chidi     A
0     Ada     A
3   Amina     B
```
:::

Each line is a move from the table above: a **filter** (`df[df["score"] >= 75]`), a **group and aggregate**, a **new column**, and a **sort**. The `groupby` line replaces the whole loop you wrote by hand a moment ago.

### Missing data in pandas

::: code Find and fix missing values
```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "name": ["Ada", "Tunde", "Chidi", "Amina"],
    "age": [36, np.nan, 29, 41],
    "city": ["Lagos", "Abuja", None, "Kano"],
})
print(df.isna().sum())
print()
clean = df.fillna({"age": df["age"].median(), "city": "Unknown"})
print(clean)
print()
print(df.dropna())
```
```output
name    0
age     1
city    1
dtype: int64

    name   age     city
0    Ada  36.0    Lagos
1  Tunde  36.0    Abuja
2  Chidi  29.0  Unknown
3  Amina  41.0     Kano

    name   age   city
0    Ada  36.0  Lagos
3  Amina  41.0   Kano
```
:::

Three tools you will use constantly: `isna().sum()` counts the gaps in each column, `fillna(...)` replaces them, and `dropna()` removes any row with a gap. Filling and dropping are **choices that change your results**, so make them deliberately and write down which you picked.

::: plain
Imagine surveying ten people about their age, and two people leave it blank. Dropping the two would leave you with eight answers. Filling the blanks with the average would keep all ten, but you have invented two numbers. Neither choice is "right", and you must tell your readers what you did.
:::

## Statistics you actually need

You do not need a maths degree. These four ideas cover most everyday analysis.

| Measure | What it tells you | Watch out |
|---|---|---|
| **Mean** (average) | The sum divided by the count | Dragged around by extreme values |
| **Median** | The middle value when sorted | Not affected by extremes, so better for salaries, prices and response times |
| **Mode** | The most common value | Useful for categories |
| **Standard deviation** | How spread out values are around the mean | A small number means that values cluster together |

Consider the salaries 30, 32, 35, 38 and 900 (in thousands). The mean is 207, which describes nobody. The median is 35, which describes the typical person. Always look at the median as well as the mean.

::: challenge median Find the median
Write `median(numbers)`. Return the middle value of the sorted numbers. For an even number of values, return the **average of the two middle ones**. For an empty array return `null`. Do **not** change the array that was passed in.

Hint: Copy first (`[...numbers]`), because `sort` changes an array in place. Use a compare function: `(a, b) => a - b`.
Hint: With `mid = Math.floor(n / 2)`, an odd count has its median at `sorted[mid]`. An even count averages `sorted[mid - 1]` and `sorted[mid]`.
```js starter
function median(numbers) {
  // your code here
}
```
```js tests
test('odd count', () => assert.equal(median([3, 1, 2]), 2));
test('even count', () => assert.equal(median([4, 1, 3, 2]), 2.5));
test('unsorted with a big outlier', () => assert.equal(median([900, 30, 35, 32, 38]), 35));
test('single value', () => assert.equal(median([7]), 7));
test('empty', () => assert.equal(median([]), null));
test('numeric, not alphabetic, order', () => assert.equal(median([10, 9, 100]), 10));
test('does not mutate', () => { const a = [3, 1, 2]; median(a); assert.deepEqual(a, [3, 1, 2]); });
```
```js solution
function median(numbers) {
  if (numbers.length === 0) return null;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
```
:::

## SQL is a data tool too

Everything above has a SQL equivalent, and a lot of data analysis happens directly in the database. This sandbox holds monthly sales. Try to answer: which region sold the most? Which month was the best?

::: sqlplay Sales analysis
Change `SUM` to `AVG`, group by `month` instead of `region`, or filter with `WHERE product = 'Laptop'`.
```sql schema
CREATE TABLE sales (id INTEGER PRIMARY KEY, month TEXT, region TEXT, product TEXT, units INTEGER, revenue REAL);
INSERT INTO sales (month, region, product, units, revenue) VALUES
('Jan','North','Laptop',5,4000),('Jan','South','Laptop',3,2400),('Jan','North','Phone',10,5000),
('Feb','North','Laptop',6,4800),('Feb','South','Phone',8,4000),('Feb','South','Laptop',4,3200),
('Mar','North','Phone',12,6000),('Mar','South','Laptop',7,5600),('Mar','North','Laptop',2,1600);
```
```sql starter
SELECT region, SUM(revenue) AS total_revenue, SUM(units) AS units
FROM sales
GROUP BY region
ORDER BY total_revenue DESC;
```
:::

## Visualisation

A chart is a **question answered visually**. Pick the chart that fits the question, rather than the one that looks most impressive.

| Question | Chart | Example |
|---|---|---|
| How do categories compare? | **Bar chart** | Average score per class |
| How does something change over time? | **Line chart** | Daily sign-ups |
| How are values distributed? | **Histogram** or **box plot** | How long do users stay? |
| Are two numbers related? | **Scatter plot** | Hours studied against score |
| What share does each part have? | **Bar chart** (pies only for 2 to 4 slices) | Traffic sources |

In Python the standard libraries are **matplotlib** (flexible, detailed control) and **seaborn** (built on matplotlib, with attractive statistical charts in one line).

```python
import matplotlib
matplotlib.use("Agg")          # draw to a file, with no window (useful on servers)
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

df = pd.DataFrame({
    "class": ["A", "B", "A", "B", "B", "C"],
    "score": [80, 70, 90, 75, 65, 60],
})

# matplotlib: a bar chart of the average per class
averages = df.groupby("class")["score"].mean()
fig, ax = plt.subplots(figsize=(5, 3))
ax.bar(averages.index, averages.values)
ax.set_title("Average score per class")
ax.set_xlabel("Class")
ax.set_ylabel("Score")
ax.set_ylim(0, 100)            # start at zero
fig.tight_layout()
fig.savefig("averages.png")

# seaborn: the same idea, with less code
sns.barplot(data=df, x="class", y="score", estimator="mean", errorbar=None)
plt.savefig("averages-seaborn.png")
```

Always label the axes and give the chart a title, because a chart that needs explaining out loud has failed.

::: pitfall Charts can lie
- **A truncated axis.** Starting a bar chart at 60 instead of 0 makes a difference of 5 look like a difference of 500%. Bars must start at zero.
- **Too many colours or slices.** If the reader needs a legend decoder ring, simplify.
- **Missing context.** "Sales doubled" from 2 to 4 units is not news.
- **Correlation is not causation.** Ice-cream sales and drownings rise together because of summer, not because one causes the other.
- **Cherry-picking** a time range that supports your story.
- **Colour alone** to carry meaning, which excludes colour-blind readers. Add labels or patterns.
:::

::: lab Lab: analyse a real dataset
Pick a free CSV: for example, your country's open data portal, a Kaggle starter dataset, or export your own bank or phone-usage data (remove anything private).
1. Write down three questions you want the data to answer before you look.
2. Load the file (`pandas.read_csv`, or the JavaScript `parseCsv` from the challenge). Print the first rows, the column types and `describe()`.
3. List every cleaning problem you find: missing values, duplicates, wrong types and inconsistent labels. Fix each in a script, and keep the raw file untouched.
4. Answer each question with a filter, group-and-aggregate or sort. Print the result as a small table.
5. Compute the mean **and** the median of an important column. If they differ a lot, find out why.
6. Make two charts that fit your questions, with titles and labelled axes. Check that your bar charts start at zero.
7. Write five sentences for a non-technical reader: the question, what you did to the data, what you found, one caveat, and one next step.
8. Stretch goal: load the data into a SQLite table and reproduce one result with SQL.
:::

::: pitfall Common data mistakes
- **Not looking at the data first.** Print `head()` and `describe()` before any calculation.
- **Silently dropping rows.** Report how many rows each step removed.
- **Using the mean on skewed data.** Check the median.
- **Mixing types**, such as numbers stored as text sorting as `"10" < "9"`.
- **Editing the raw file by hand.** It makes the analysis unrepeatable.
- **Reporting numbers without sample size.** An average of three people is not a trend.
- **Leaking private data** (names, emails, phone numbers) into a shared notebook or chart.
:::

::: recap
- Analysis is a loop: ask, collect, clean, explore, conclude. Cleaning is the biggest part.
- CSV is simple tabular text, and JSON handles nesting. Tidy data has one variable per column and one observation per row.
- The core moves are filter, sort, group and aggregate, and join. They exist in every language and in SQL.
- pandas gives you DataFrames, `groupby`, `fillna`, `dropna` and `describe` in a few lines.
- Report the median as well as the mean, and say how you handled missing values.
- Choose a chart for the question, start bars at zero, label everything, and beware of misleading axes.
:::

::: quiz test Module test: Working with data
?  What is the median of 2, 9, 4, 100, 5?
- 24
- 9
- *5
- 4
> Sorted: 2, 4, 5, 9, 100. The middle value is 5. The mean (24) is pulled up by the outlier.

?  Which pandas call returns the count of missing values in each column?
- `df.count()`
- *`df.isna().sum()`
- `df.dropna()`
- `df.describe()`
> `isna()` marks missing values, and `sum()` counts them for each column.

?  Which chart is the best choice to show how daily sign-ups changed over a month?
- Pie chart
- *Line chart
- Histogram
- Scatter plot of unrelated values
> A line chart shows change over time.

?  A bar chart's y-axis starts at 60 instead of 0. What is the problem?
- Nothing. It is just a style choice
- *Bar heights exaggerate small differences
- The bars will be too thin
- The chart will not render
> Bars encode value by length, so a truncated axis misleads.

?  Which of these is a sensible way to handle a duplicate order row?
- Keep both because more data is better
- *Remove duplicates by a key such as the order id
- Rename one of them
- Delete the whole file
> Duplicates inflate totals. A key identifies them.

?  Which SQL query corresponds to `df.groupby("class")["score"].mean()`?
- `SELECT class, score FROM df`
- *`SELECT class, AVG(score) FROM df GROUP BY class`
- `SELECT AVG(class) FROM df`
- `ORDER BY class`
> Group on the category and apply an aggregate to the value column.

?  Why should you keep the raw data file unchanged?
- To save disk space
- *So that the cleaning is repeatable and checkable
- Because CSV files cannot be edited
- It does not matter
> A script that goes from raw to clean documents every change you made.

?tf The mean is always the best single number to describe a typical value. | false
> With skewed data and outliers, the median describes a typical value better.

?tf Correlation proves that one thing causes another. | false
> Two things can move together because of a third factor, or by chance.

?short Which library built on matplotlib gives attractive statistical charts in one line? Type its name. | seaborn
> seaborn makes common statistical plots with little code, and matplotlib draws them.

?multi Which of these are common data-cleaning tasks? Select all that apply.
- *Handling missing values
- *Removing duplicates
- *Converting text to numbers
- Changing the raw data file by hand
> Clean in a repeatable script. Hand-editing the raw file hides what you changed.
:::
