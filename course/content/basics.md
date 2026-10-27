---
id: basics
number: 5
title: Programming Fundamentals
track: Foundations
duration: 180 min
level: Beginner
summary: Values, variables, decisions, loops, collections, functions and errors. The ideas behind every program, shown side by side in seven languages.
---

::: objectives
- Store and combine values using variables, numbers, text and booleans.
- Make decisions with `if` and comparison operators.
- Repeat work with `for` and `while` loops.
- Group data in lists and key-value collections.
- Write functions that take inputs and return results.
- Handle errors without crashing, and trace code by hand to find bugs.
- Solve small problems by decomposing them, in the language you chose.
:::

::: prereq
Introduction to Programming (variables and the three building blocks) and Choosing Your Programming Language. Pick your language in the sidebar so the tabs show it.
:::

::: note How to use this module
Every idea is shown in seven languages. Read the tab for your chosen language first, then glance at one other to see what stays the same. Java, Go and C# samples show only the lines you would put inside `main`. Java samples that use lists or maps need `import java.util.*;` at the top of the file, and Go samples that use `strings` need `import "strings"`. The coding challenges at the end of each section are in JavaScript, because they run right here in your browser. The logic transfers directly to your own language.
:::

## 1. Values and types

Everything a program works with is a **value**, and every value has a **type**: what kind of thing it is. The basic types are almost identical in every language.

| Type | What it holds | Examples |
|---|---|---|
| Integer | Whole numbers | `0`, `42`, `-7` |
| Decimal (float) | Numbers with a fractional part | `3.14`, `-0.5` |
| String | Text, written in quotes | `"hello"`, `"42"` |
| Boolean | Exactly one of two values: true or false | `true`, `false` |
| Nothing | "No value here" | `null`, `None`, `nil` |

::: pitfall The text "42" is not the number 42
`"42"` is two characters of text. `42` is a number. Adding numbers gives `42 + 1 = 43`. Adding text joins it: in JavaScript, `"42" + 1` gives `"421"`. If a program gives surprising results, check the types first.
:::

### Arithmetic

The usual operators work as you expect: `+ - * /`. Two extras are worth learning now.

- `%` is the **remainder** (modulo): `10 % 3` is `1`, because 3 goes into 10 three times with 1 left over. It is how you test whether a number is even (`n % 2 == 0`) or wrap around a clock.
- **Integer division.** In many languages, dividing two integers throws away the fractional part: `10 / 3` is `3`, not `3.333`. JavaScript, Python (`/`), PHP and Ruby have rules of their own, so we ask each for the whole-number quotient explicitly.

::: code Quotient and remainder of 10 divided by 3
```javascript
console.log(Math.floor(10 / 3), 10 % 3);
```
```python
print(10 // 3, 10 % 3)
```
```java
System.out.println(10 / 3 + " " + 10 % 3);
```
```csharp
Console.WriteLine($"{10 / 3} {10 % 3}");
```
```php
<?php
echo intdiv(10, 3) . " " . (10 % 3) . "\n";
```
```go
fmt.Println(10/3, 10%3)
```
```ruby
puts "#{10 / 3} #{10 % 3}"
```
```output
3 1
```
:::

::: learn Precision warning
Computers store decimals in binary, so `0.1 + 0.2` is not exactly `0.3` in any language. It is `0.30000000000000004`. For money, store whole cents as integers, or use a decimal type. You will meet this again in the Data module.
:::

### Working with strings

Text is so common that every language gives you many tools to handle it. These two are in every program: changing case and finding the length.

::: code Upper-case and length
```javascript
const word = "hello";
console.log(word.toUpperCase(), word.length);
```
```python
word = "hello"
print(word.upper(), len(word))
```
```java
String word = "hello";
System.out.println(word.toUpperCase() + " " + word.length());
```
```csharp
string word = "hello";
Console.WriteLine($"{word.ToUpper()} {word.Length}");
```
```php
<?php
$word = "hello";
echo strtoupper($word) . " " . strlen($word) . "\n";
```
```go
word := "hello"
fmt.Println(strings.ToUpper(word), len(word))
```
```ruby
word = "hello"
puts "#{word.upcase} #{word.length}"
```
```output
HELLO 5
```
:::

Notice that some languages call functions on the value (`word.upper()`), and others pass the value in (`strtoupper($word)`, `len(word)`). Both do the same job. A function attached to a value is called a [[Method|method]].

::: figure svg Positions in a string start at zero
<svg class="fg" viewBox="0 0 520 150" role="img" aria-label="The word hello with each letter in a box. Positions 0 to 4 are shown beneath the letters. Position 0 holds h and position 4 holds o." style="max-width:520px;min-width:374px" xmlns="http://www.w3.org/2000/svg">
<g class="fg-code">
<rect x="60" y="30" width="70" height="60" rx="8" class="fg-box fg-accent"/><text x="95" y="70" text-anchor="middle" class="fg-code">h</text>
<rect x="140" y="30" width="70" height="60" rx="8" class="fg-box"/><text x="175" y="70" text-anchor="middle" class="fg-code">e</text>
<rect x="220" y="30" width="70" height="60" rx="8" class="fg-box"/><text x="255" y="70" text-anchor="middle" class="fg-code">l</text>
<rect x="300" y="30" width="70" height="60" rx="8" class="fg-box"/><text x="335" y="70" text-anchor="middle" class="fg-code">l</text>
<rect x="380" y="30" width="70" height="60" rx="8" class="fg-box fg-accent"/><text x="415" y="70" text-anchor="middle" class="fg-code">o</text>
</g>
<text x="95" y="115" text-anchor="middle" class="fg-title">0</text><text x="175" y="115" text-anchor="middle" class="fg-title">1</text><text x="255" y="115" text-anchor="middle" class="fg-title">2</text><text x="335" y="115" text-anchor="middle" class="fg-title">3</text><text x="415" y="115" text-anchor="middle" class="fg-title">4</text>
<text x="255" y="142" text-anchor="middle" class="fg-sub">index: the first character is at 0, the last is at length minus 1</text>
</svg>
:::

Almost every language starts counting positions at **zero**. In "hello", `h` is at index 0 and `o` is at index 4, although the length is 5. Forgetting this causes the famous "off-by-one" bug.

::: playground js Experiment with strings and numbers
Predict each result before you run it. Then change the values.
```js
const word = "hello";
console.log(word[0]);               // first letter
console.log(word[word.length - 1]); // last letter
console.log("Hi " + "there");       // joining text
console.log("5" + 1, 5 + 1);        // text versus number
console.log(17 % 5);                // remainder
```
:::

::: challenge celsius Convert Celsius to Fahrenheit
Write `toFahrenheit(c)` that converts a temperature using the formula **F = C x 9 / 5 + 32**.

Hint: In code, multiplication is `*` and division is `/`.
Hint: Write the formula as one line: `return c * 9 / 5 + 32;`
```js starter
function toFahrenheit(c) {
  // your code here
}
```
```js tests
test('freezing point', () => assert.equal(toFahrenheit(0), 32));
test('boiling point', () => assert.equal(toFahrenheit(100), 212));
test('body temperature', () => assert.equal(toFahrenheit(37), 98.6));
test('negative', () => assert.equal(toFahrenheit(-40), -40));
```
```js solution
function toFahrenheit(c) {
  return c * 9 / 5 + 32;
}
```
:::

::: quiz check Checkpoint: values and types
?  What is `17 % 5`?
- 3
- 3.4
- *2
- 12
> 5 goes into 17 three times (15), and 2 is left over. `%` gives the remainder.

?tf In most languages the first character of a string is at index 1. | false
> Positions start at 0. This is true in JavaScript, Python, Java, C#, PHP, Go and Ruby (though Go indexes bytes).

?  In JavaScript, what is `"3" + 4`?
- 7
- *"34"
- An error
- "7"
> When one side of `+` is text, JavaScript joins instead of adding, so the result is the text "34".
:::

## 2. Variables in depth

A variable is a name for a value. Giving it a value for the first time is called **declaring** or **assigning**. You can then read it, or give it a new value.

::: figure svg A variable is a labelled box
<svg class="fg" viewBox="0 0 560 170" role="img" aria-label="A box labelled score holds the value 10. An arrow shows that after score = score + 5 the box holds 15." style="max-width:560px;min-width:403px" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="ah-b1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="fg-head"/></marker></defs>
<text x="90" y="24" text-anchor="middle" class="fg-title">score</text>
<rect x="30" y="34" width="120" height="70" rx="10" class="fg-box fg-accent"/><text x="90" y="80" text-anchor="middle" class="fg-code">10</text>
<text x="90" y="128" text-anchor="middle" class="fg-sub">after: score = 10</text>
<line x1="170" y1="70" x2="370" y2="70" class="fg-line" marker-end="url(#ah-b1)"/>
<text x="270" y="58" text-anchor="middle" class="fg-msg">score = score + 5</text>
<text x="450" y="24" text-anchor="middle" class="fg-title">score</text>
<rect x="390" y="34" width="120" height="70" rx="10" class="fg-box fg-c2"/><text x="450" y="80" text-anchor="middle" class="fg-code">15</text>
<text x="450" y="128" text-anchor="middle" class="fg-sub">the old value is replaced</text>
</svg>
:::

### Constants

Some values should never change, like the number of days in a week or a tax rate. Most languages let you declare a **constant**, and the language will stop you if you try to change it. JavaScript uses `const`, Java and Go use `final` and `const`, C# uses `const`, Python and Ruby use an ALL_CAPS naming convention, and PHP uses `const` or `define`. Prefer constants whenever a value does not need to change: it tells the reader, and protects you from accidents.

### Scope: where a name can be seen

Variables created inside a function or a block of braces usually exist only there. This is called **scope**. It stops different parts of a program from accidentally trampling each other's names.

::: plain
A variable declared inside a function is like a note on a whiteboard inside a meeting room. People in the room can read it, and when the meeting ends the board is wiped. Variables declared outside everything are like notices in the hallway: everyone sees them, but then everyone can also mess with them. Keep notices to a minimum.
:::

### Tracing: running code by hand

When code does not do what you expect, the most reliable technique is a **trace table**. Write a column for each variable and update it after every line, exactly as the computer would.

```js
let a = 3;
let b = 4;
a = a + b;
b = a - b;
a = a - b;
```

| After line | `a` | `b` |
|---|---|---|
| `let a = 3` | 3 | not yet created |
| `let b = 4` | 3 | 4 |
| `a = a + b` | 7 | 4 |
| `b = a - b` | 7 | 3 |
| `a = a - b` | 4 | 3 |

The code swaps the values of `a` and `b` without a third variable. Without the trace table it is hard to see. With it, it is easy. Tracing is not a beginner trick. Professionals do it too.

::: learn Predict, run, compare
Before running any code in this course, say out loud what you expect it to print. Then run it. If your prediction was wrong, work out why. That moment of surprise is when the brain updates its model, and it is worth more than ten correct guesses.
:::

## 3. Making decisions

A program needs to react to different situations. A **condition** is something that is true or false, and `if` runs a block of code only when the condition is true.

::: figure flow Decisions pick a path
Is score >= 50? | the condition -> *Yes: print Pass | the if block -> Done | the program continues
:::

### Comparison and logical operators

| Idea | Symbol in most languages | Example |
|---|---|---|
| Equal | `==` (JavaScript prefers `===`) | `age == 18` |
| Not equal | `!=` (JavaScript prefers `!==`) | `age != 18` |
| Greater, less | `>  <  >=  <=` | `score >= 50` |
| And | `&&` (Python and Ruby also accept `and`) | `age >= 18 && hasId` |
| Or | `\|\|` (Python and Ruby also accept `or`) | `isAdmin \|\| isOwner` |
| Not | `!` (Python writes `not`) | `!isBanned` |

::: pitfall One equals sign or two
`score = 50` **stores** 50 in `score`. `score == 50` **asks** whether it already is 50. Mixing them up is one of the most common bugs. In JavaScript, always compare with three equals signs (`===`), which also checks the type, so that `"5" === 5` is false.
:::

::: code if, else if, else: turn a score into a grade
```javascript
const score = 85;
if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else if (score >= 70) {
  console.log("C");
} else {
  console.log("Try again");
}
```
```python
score = 85
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
else:
    print("Try again")
```
```java
int score = 85;
if (score >= 90) {
    System.out.println("A");
} else if (score >= 80) {
    System.out.println("B");
} else if (score >= 70) {
    System.out.println("C");
} else {
    System.out.println("Try again");
}
```
```csharp
int score = 85;
if (score >= 90)
{
    Console.WriteLine("A");
}
else if (score >= 80)
{
    Console.WriteLine("B");
}
else if (score >= 70)
{
    Console.WriteLine("C");
}
else
{
    Console.WriteLine("Try again");
}
```
```php
<?php
$score = 85;
if ($score >= 90) {
    echo "A\n";
} elseif ($score >= 80) {
    echo "B\n";
} elseif ($score >= 70) {
    echo "C\n";
} else {
    echo "Try again\n";
}
```
```go
score := 85
if score >= 90 {
    fmt.Println("A")
} else if score >= 80 {
    fmt.Println("B")
} else if score >= 70 {
    fmt.Println("C")
} else {
    fmt.Println("Try again")
}
```
```ruby
score = 85
if score >= 90
  puts "A"
elsif score >= 80
  puts "B"
elsif score >= 70
  puts "C"
else
  puts "Try again"
end
```
```output
B
```
:::

The conditions are checked from top to bottom, and the **first** one that is true wins. That is why the order matters. If we had tested `score >= 70` first, a score of 95 would get a "C".

::: challenge fizzbuzz FizzBuzz for a single number
The classic interview warm-up. Write `fizzBuzz(n)`: if `n` is divisible by both 3 and 5, return `"FizzBuzz"`. If only by 3, return `"Fizz"`. If only by 5, return `"Buzz"`. Otherwise return the number itself.

Hint: `n % 3 === 0` is true when `n` is divisible by 3.
Hint: Check the "both" case first, otherwise 15 would match the "divisible by 3" test and return "Fizz".
```js starter
function fizzBuzz(n) {
  // your code here
}
```
```js tests
test('15 is FizzBuzz', () => assert.equal(fizzBuzz(15), 'FizzBuzz'));
test('30 is FizzBuzz', () => assert.equal(fizzBuzz(30), 'FizzBuzz'));
test('9 is Fizz', () => assert.equal(fizzBuzz(9), 'Fizz'));
test('10 is Buzz', () => assert.equal(fizzBuzz(10), 'Buzz'));
test('7 is 7', () => assert.equal(fizzBuzz(7), 7));
```
```js solution
function fizzBuzz(n) {
  if (n % 3 === 0 && n % 5 === 0) return 'FizzBuzz';
  if (n % 3 === 0) return 'Fizz';
  if (n % 5 === 0) return 'Buzz';
  return n;
}
```
:::

::: quiz check Checkpoint: decisions
?  Which expression is true when `age` is at least 13 and less than 20?
- `age > 13 || age < 20`
- *`age >= 13 && age < 20`
- `age = 13 && age = 20`
- `age >= 13 || age <= 20`
> "And" requires both parts to be true. With "or", every number would qualify. A single `=` assigns instead of comparing.

?  With the grade code above, what would a score of 95 print if the `score >= 70` check came first?
- A
- *C
- B
- Try again
> The first true condition wins. 95 is at least 70, so "C" would be printed and the other branches are skipped.
:::

## 4. Repeating work with loops

Imagine printing the numbers from 1 to 1000 by hand. A **loop** repeats a block of code. There are two main kinds.

- A **`for` loop** when you know how many times to repeat, or you want to go through a collection.
- A **`while` loop** when you repeat until something changes.

::: figure flow Anatomy of a counting loop
Start: i = 1 | initialise -> *Is i <= 5? | the test -> Run the body | print i -> Add 1 to i | then test again
:::

::: code A for loop that prints 1 to 5
```javascript
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
```
```python
for i in range(1, 6):
    print(i)
```
```java
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
```
```csharp
for (int i = 1; i <= 5; i++)
{
    Console.WriteLine(i);
}
```
```php
<?php
for ($i = 1; $i <= 5; $i++) {
    echo $i . "\n";
}
```
```go
for i := 1; i <= 5; i++ {
    fmt.Println(i)
}
```
```ruby
(1..5).each do |i|
  puts i
end
```
```output
1
2
3
4
5
```
:::

In the C-style loop `for (let i = 1; i <= 5; i++)` there are three parts separated by semicolons: **start** (`let i = 1`), **keep going while** (`i <= 5`) and **after each pass** (`i++`, which means "add one to i"). Python's `range(1, 6)` stops *before* 6, which is a common surprise. Ruby's `1..5` includes 5.

### The while loop

::: code A while loop: halve a number until it is below 1
```javascript
let n = 20;
let steps = 0;
while (n >= 1) {
  n = n / 2;
  steps++;
}
console.log(steps);
```
```python
n = 20
steps = 0
while n >= 1:
    n = n / 2
    steps += 1
print(steps)
```
```java
double n = 20;
int steps = 0;
while (n >= 1) {
    n = n / 2;
    steps++;
}
System.out.println(steps);
```
```csharp
double n = 20;
int steps = 0;
while (n >= 1)
{
    n = n / 2;
    steps++;
}
Console.WriteLine(steps);
```
```php
<?php
$n = 20;
$steps = 0;
while ($n >= 1) {
    $n = $n / 2;
    $steps++;
}
echo $steps . "\n";
```
```go
n := 20.0
steps := 0
for n >= 1 {
    n = n / 2
    steps++
}
fmt.Println(steps)
```
```ruby
n = 20.0
steps = 0
while n >= 1
  n /= 2
  steps += 1
end
puts steps
```
```output
5
```
:::

Go has only one loop keyword, `for`, and it does the job of `while` as well. Let us trace the loop above: n goes 20, 10, 5, 2.5, 1.25, 0.625. That is five halvings, and the loop stops when n is below 1.

::: pitfall The infinite loop
If the condition never becomes false, the loop never ends and your program freezes. In the loop above, if you forgot the line `n = n / 2`, `n` would stay at 20 forever. Whenever you write a `while`, ask: *what changes each time round so that it eventually stops?* The code runner in this course stops anything that runs for more than four seconds.
:::

::: pitfall Off-by-one errors
Does the loop run from 0 to 4, or 1 to 5? Is the last number included? When something is "one too many" or "one too few", you have an off-by-one error. The cure is to trace the first and last pass by hand.
:::

### Loops and collections together

The real power of a loop is going through every item in a collection, which comes next. First, practise with numbers.

::: challenge sumrange Add up the numbers from 1 to n
Write `sumTo(n)` that returns 1 + 2 + ... + n using a loop. For example `sumTo(4)` is 10.

Hint: Create a variable `total` that starts at 0.
Hint: Loop from 1 to n and add the loop variable to `total` each time. Return `total` after the loop.
```js starter
function sumTo(n) {
  // your code here
}
```
```js tests
test('sumTo(1)', () => assert.equal(sumTo(1), 1));
test('sumTo(4)', () => assert.equal(sumTo(4), 10));
test('sumTo(10)', () => assert.equal(sumTo(10), 55));
test('sumTo(100)', () => assert.equal(sumTo(100), 5050));
test('sumTo(0)', () => assert.equal(sumTo(0), 0));
```
```js solution
function sumTo(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}
```
:::

::: quiz check Checkpoint: loops
?  How many times does `for (let i = 0; i < 3; i++)` run its body?
- 2
- *3
- 4
- Forever
> i takes the values 0, 1 and 2. When i becomes 3 the test `i < 3` is false and the loop stops.

?  What is the main risk of a `while` loop?
- It cannot repeat code
- It only works with numbers
- *The condition might never become false, giving an infinite loop
- It is always slower
> Make sure something inside the loop eventually makes the condition false.
:::

## 5. Collections: lists and dictionaries

Real programs handle many values: a list of products, a set of settings. A **list** (also called an array) keeps values in order, and you reach them by position. A **dictionary** (also called a map, hash or associative array) keeps pairs of a **key** and a **value**, and you reach values by key.

::: figure flow Two ways to organise data
*List | ordered, reached by position: colors[0] -> Dictionary | labelled, reached by key: ages["Ada"]
:::

::: code A list: create, append, read
```javascript
const colors = ["red", "green", "blue"];
colors.push("yellow");
console.log(colors.length, colors[0], colors[colors.length - 1]);
```
```python
colors = ["red", "green", "blue"]
colors.append("yellow")
print(len(colors), colors[0], colors[-1])
```
```java
List<String> colors = new ArrayList<>(List.of("red", "green", "blue"));
colors.add("yellow");
System.out.println(colors.size() + " " + colors.get(0) + " " + colors.get(colors.size() - 1));
```
```csharp
var colors = new List<string> { "red", "green", "blue" };
colors.Add("yellow");
Console.WriteLine(colors.Count + " " + colors[0] + " " + colors[^1]);
```
```php
<?php
$colors = ["red", "green", "blue"];
$colors[] = "yellow";
echo count($colors) . " " . $colors[0] . " " . end($colors) . "\n";
```
```go
colors := []string{"red", "green", "blue"}
colors = append(colors, "yellow")
fmt.Println(len(colors), colors[0], colors[len(colors)-1])
```
```ruby
colors = %w[red green blue]
colors << "yellow"
puts "#{colors.length} #{colors.first} #{colors.last}"
```
```output
4 red yellow
```
:::

::: code A dictionary: store and look up by key
```javascript
const ages = { Ada: 36, Linus: 54 };
console.log(ages["Ada"], Object.keys(ages).length);
```
```python
ages = {"Ada": 36, "Linus": 54}
print(ages["Ada"], len(ages))
```
```java
Map<String, Integer> ages = new HashMap<>();
ages.put("Ada", 36);
ages.put("Linus", 54);
System.out.println(ages.get("Ada") + " " + ages.size());
```
```csharp
var ages = new Dictionary<string, int> { { "Ada", 36 }, { "Linus", 54 } };
Console.WriteLine(ages["Ada"] + " " + ages.Count);
```
```php
<?php
$ages = ["Ada" => 36, "Linus" => 54];
echo $ages["Ada"] . " " . count($ages) . "\n";
```
```go
ages := map[string]int{"Ada": 36, "Linus": 54}
fmt.Println(ages["Ada"], len(ages))
```
```ruby
ages = { "Ada" => 36, "Linus" => 54 }
puts "#{ages["Ada"]} #{ages.size}"
```
```output
36 2
```
:::

### Going through a list

Loops and lists belong together. To total a list of prices, you create a running total and add each item to it.

::: stepper Totalling a list, one pass at a time
1. **Start.** We have `prices = [4, 7, 2]` and `total = 0`.
2. **First item.** Look at `4`. Add it: `total = 0 + 4 = 4`.
3. **Second item.** Look at `7`. Add it: `total = 4 + 7 = 11`.
4. **Third item.** Look at `2`. Add it: `total = 11 + 2 = 13`.
5. **No items left.** The loop ends and `total` holds `13`. This "running total" pattern appears in almost every program.
:::

::: playground js Loop over a list
Change the prices, add a few, and watch the total. Then try changing the code to find the largest price instead.
```js
const prices = [4, 7, 2];
let total = 0;
for (const price of prices) {
  total += price;
}
console.log("Total:", total);
console.log("Average:", total / prices.length);
```
:::

::: challenge largest Find the biggest number in a list
Write `largest(numbers)` that returns the biggest number in an array, **using a loop** (do not use `Math.max`). You may assume the array has at least one number.

Hint: Start by assuming the first number is the largest so far.
Hint: Loop through the rest. Whenever you find a number bigger than your current largest, replace it.
```js starter
function largest(numbers) {
  // your code here
}
```
```js tests
test('simple list', () => assert.equal(largest([3, 9, 2]), 9));
test('largest first', () => assert.equal(largest([10, 4, 6]), 10));
test('negative numbers', () => assert.equal(largest([-5, -2, -9]), -2));
test('single number', () => assert.equal(largest([7]), 7));
```
```js solution
function largest(numbers) {
  let best = numbers[0];
  for (const n of numbers) {
    if (n > best) best = n;
  }
  return best;
}
```
:::

::: challenge freq Count how often each word appears
Write `wordCounts(words)` that takes an array of words and returns an object (dictionary) mapping each word to how many times it appears. For example `["a","b","a"]` gives `{ a: 2, b: 1 }`.

Hint: Start with an empty object `{}`.
Hint: For each word, if the object already has it, add 1. Otherwise set it to 1. `counts[word] = (counts[word] || 0) + 1` does both.
```js starter
function wordCounts(words) {
  // your code here
}
```
```js tests
test('counts duplicates', () => assert.deepEqual(wordCounts(['a', 'b', 'a']), { a: 2, b: 1 }));
test('empty list', () => assert.deepEqual(wordCounts([]), {}));
test('all same', () => assert.deepEqual(wordCounts(['x', 'x', 'x']), { x: 3 }));
test('mixed', () => assert.deepEqual(wordCounts(['to', 'be', 'or', 'not', 'to', 'be']), { to: 2, be: 2, or: 1, not: 1 }));
```
```js solution
function wordCounts(words) {
  const counts = {};
  for (const word of words) {
    counts[word] = (counts[word] || 0) + 1;
  }
  return counts;
}
```
:::

::: quiz check Checkpoint: collections
?  What does `colors[0]` give for the list `["red", "green", "blue"]`?
- "green"
- "blue"
- An error
- *"red"
> Positions start at 0, so index 0 is the first item.

?  Which structure is best for looking up a person's phone number by their name?
- A list of numbers
- *A dictionary mapping names to numbers
- A single string
- A boolean
> A dictionary stores key-value pairs and looks up a value by its key quickly.

?multi Which of these are true about lists? Select all that apply.
- *They keep their items in order
- *You reach an item by its position
- *Items can usually be added or removed
- They can only store numbers
> Lists keep order, use positions starting at 0, and can grow. They can hold any type of value, including other lists.
:::

## 6. Functions: reusable building blocks

A **function** is a named block of code that does one job. You **define** it once and **call** it as often as you like. Functions are how large programs stay manageable, and they are the most important idea in this module.

A function can take **parameters** (named inputs). When you call it you give **arguments** (the actual values). It can send back a result with `return`.

::: figure flow Calling a function
Arguments | square(7) -> *Function | takes n, computes n times n -> Result | returns 49
:::

::: plain
A function is a vending machine. You put in a coin and press a button (arguments). The machine does something inside (the body). A snack comes out (the return value). You do not need to know how the machine works. You only need to know what goes in and what comes out.
:::

::: code Defining and calling functions
```javascript
function square(n) {
  return n * n;
}

function describe(n) {
  if (n % 2 === 0) {
    return "even";
  }
  return "odd";
}

console.log(square(7));
console.log(describe(7));
```
```python
def square(n):
    return n * n


def describe(n):
    if n % 2 == 0:
        return "even"
    return "odd"


print(square(7))
print(describe(7))
```
```java
public class Main {
    static int square(int n) {
        return n * n;
    }

    static String describe(int n) {
        if (n % 2 == 0) {
            return "even";
        }
        return "odd";
    }

    public static void main(String[] args) {
        System.out.println(square(7));
        System.out.println(describe(7));
    }
}
```
```csharp
using System;

Console.WriteLine(Square(7));
Console.WriteLine(Describe(7));

static int Square(int n)
{
    return n * n;
}

static string Describe(int n)
{
    if (n % 2 == 0)
    {
        return "even";
    }
    return "odd";
}
```
```php
<?php
function square($n) {
    return $n * $n;
}

function describe($n) {
    if ($n % 2 === 0) {
        return "even";
    }
    return "odd";
}

echo square(7) . "\n";
echo describe(7) . "\n";
```
```go
package main

import "fmt"

func square(n int) int {
    return n * n
}

func describe(n int) string {
    if n%2 == 0 {
        return "even"
    }
    return "odd"
}

func main() {
    fmt.Println(square(7))
    fmt.Println(describe(7))
}
```
```ruby
def square(n)
  n * n
end

def describe(n)
  return "even" if n.even?
  "odd"
end

puts square(7)
puts describe(7)
```
```output
49
odd
```
:::

### Why functions matter

- **No repetition.** Write the logic once and call it everywhere. Fix a bug in one place.
- **Names explain intent.** `isEligibleForDiscount(customer)` is clearer than ten lines of conditions.
- **Easy to test.** A small function with clear inputs and outputs can be checked by itself, as the coding challenges here do.

::: best Write small functions
A good function does one thing, has a name that describes it (usually a verb: `calculateTotal`, `sendEmail`), and fits on one screen. If you need the word "and" to describe what it does, split it into two.
:::

### Return versus print

A beginner mix-up worth clearing up. **Printing** shows text to a human. **Returning** gives a value back to the code that called the function so that it can be used further. `square(7) + 1` only works if `square` returns its result.

::: pitfall A function with no return gives back nothing
If you forget `return`, the function quietly produces `undefined` (JavaScript), `None` (Python), `null` or nothing. If a result is mysteriously empty, check for a missing `return`.
:::

::: challenge palindrome Check for palindromes
A palindrome reads the same forwards and backwards, like "level" or "Racecar". Write `isPalindrome(text)` that returns `true` or `false`, ignoring upper and lower case.

Hint: Make the text lower case first with `text.toLowerCase()`.
Hint: To reverse a string in JavaScript, split it into characters, reverse the array and join it again: `text.split('').reverse().join('')`.
```js starter
function isPalindrome(text) {
  // your code here
}
```
```js tests
test('level', () => assert.equal(isPalindrome('level'), true));
test('Racecar ignores case', () => assert.equal(isPalindrome('Racecar'), true));
test('hello', () => assert.equal(isPalindrome('hello'), false));
test('single letter', () => assert.equal(isPalindrome('a'), true));
test('empty text', () => assert.equal(isPalindrome(''), true));
```
```js solution
function isPalindrome(text) {
  const t = text.toLowerCase();
  return t === t.split('').reverse().join('');
}
```
:::

::: challenge vowels Count the vowels in a text
Write `countVowels(text)` that returns how many of the letters a, e, i, o, u appear in the text, in either case.

Hint: Loop through every character of the text.
Hint: Keep the vowels in a string like `"aeiou"` and use `"aeiou".includes(letter)`. Remember to lower-case each letter first.
```js starter
function countVowels(text) {
  // your code here
}
```
```js tests
test('hello', () => assert.equal(countVowels('hello'), 2));
test('upper case', () => assert.equal(countVowels('AEIOU'), 5));
test('no vowels', () => assert.equal(countVowels('rhythm'), 0));
test('sentence', () => assert.equal(countVowels('Programming is fun'), 5));
test('empty', () => assert.equal(countVowels(''), 0));
```
```js solution
function countVowels(text) {
  let count = 0;
  for (const ch of text.toLowerCase()) {
    if ('aeiou'.includes(ch)) count++;
  }
  return count;
}
```
:::

::: quiz check Checkpoint: functions
?  In `function add(a, b) { return a + b; }`, what are `a` and `b`?
- Arguments
- *Parameters
- Return values
- Loops
> Parameters are the names in the definition. The actual values you pass when calling are the arguments.

?tf A function that prints a result is the same as a function that returns it. | false
> Printing displays text to a person. Returning hands a value back to the calling code, which can use it in other calculations.

?short What keyword sends a result back from a function in JavaScript, Python, Java, C#, PHP and Go? | return
> `return` ends the function and hands a value back to the caller. Ruby also returns the last value automatically.
:::

## 7. When things go wrong: errors

Mistakes happen, and good programs expect them. There are three kinds.

| Kind | When it shows up | Example |
|---|---|---|
| **Syntax error** | Before the program runs. The code breaks the language's grammar | A missing bracket or quote |
| **Runtime error** | While running. The code is valid but an operation fails | Reading a file that does not exist; dividing by zero in some languages |
| **Logic error** | Never reports itself. The program runs but gives the wrong answer | Using `>` when you meant `>=` |

Logic errors are the hardest, because the computer sees nothing wrong. That is why tests and tracing matter.

Runtime errors produce an **exception** (or an error value). If nothing catches it, the program stops with a stack trace. You can **catch** an exception and respond: show a friendly message, try something else, log the problem.

::: code Throwing and catching an error
```javascript
try {
  throw new Error("boom");
} catch (e) {
  console.log("Caught: " + e.message);
}
```
```python
try:
    raise ValueError("boom")
except ValueError as e:
    print("Caught: " + str(e))
```
```java
try {
    throw new IllegalStateException("boom");
} catch (IllegalStateException e) {
    System.out.println("Caught: " + e.getMessage());
}
```
```csharp
try
{
    throw new InvalidOperationException("boom");
}
catch (InvalidOperationException e)
{
    Console.WriteLine("Caught: " + e.Message);
}
```
```php
<?php
try {
    throw new Exception("boom");
} catch (Exception $e) {
    echo "Caught: " . $e->getMessage() . "\n";
}
```
```go
err := errors.New("boom")
if err != nil {
    fmt.Println("Caught: " + err.Error())
}
```
```ruby
begin
  raise "boom"
rescue => e
  puts "Caught: #{e.message}"
end
```
```output
Caught: boom
```
:::

Go does it differently on purpose: functions **return** an error value as a second result, and the caller checks `if err != nil`. There are no exceptions. Both styles solve the same problem.

::: best Debugging checklist
1. Read the error message and note the file and line.
2. Print the values of the variables near the problem.
3. Check your assumptions: is this variable really a number? Is the list really empty?
4. Trace the code by hand.
5. Simplify: remove everything unrelated until the bug disappears.
:::

## 8. Putting it together: solving problems

Programming is solving problems. When you meet a new one, do not start typing. Follow a simple method.

::: stepper A method for any problem
1. **Understand.** Restate the problem in your own words. What are the inputs? What should the output be? Write two or three examples with the answers you expect.
2. **Plan in plain words.** Write the steps as pseudocode, in ordinary language: "Start with a total of 0. For each price, add it. Return the total."
3. **Break it down.** Split anything complicated into smaller functions you can finish and test one at a time.
4. **Write the smallest working version.** Do one step, run it, check it.
5. **Test with your examples.** Include edge cases: an empty list, zero, a negative number, a single item.
6. **Improve.** Rename things so they are clear. Remove repetition. Only then consider speed.
:::

::: lab Mini-project: grade book
Build a small program in **your chosen language** (run it on your computer, or in JavaScript right here in the playground). It practises everything in this module.
1. Create a list of at least five student scores (numbers from 0 to 100).
2. Write a function `letterGrade(score)` that returns "A" for 90 and above, "B" for 80 to 89, "C" for 70 to 79 and "F" otherwise.
3. Write a function `average(scores)` that returns the mean of a list.
4. Loop over the scores and print each score with its letter grade.
5. Print the average, the highest score and how many students passed (70 or more).
6. Stretch goal: store names and scores together in a dictionary, and print the name of the top student.
7. Stretch goal: wrap the grade conversion in a try/catch so that a score outside 0 to 100 raises and reports an error.
:::

::: pitfall Mistakes to avoid at this stage
- **Copying solutions without understanding them.** After you see a solution, close it and write it again from memory the next day.
- **Writing a lot before running anything.** Run after every few lines.
- **Giving up on a bug after five minutes.** Use the 20-minute rule and the debugging checklist.
- **Skipping the trace.** If you cannot predict what code does, you will not be able to debug it.
:::

::: recap
- Values have types: integers, decimals, strings, booleans. Positions start at 0.
- `=` stores a value. `==` or `===` compares. `%` gives a remainder.
- `if` / `else if` / `else` choose a path. The first true condition wins.
- `for` loops repeat a known number of times or go through a collection. `while` loops repeat until a condition changes. Make sure every loop can end.
- Lists keep order and are read by position. Dictionaries map keys to values.
- Functions take parameters, return results and keep programs organised. Return is not the same as print.
- Errors are normal. Read them, trace, print values, and catch exceptions where it makes sense.
- Solve problems in steps: understand, plan, break down, build small, test, improve.
:::

::: quiz test Module test: Programming Fundamentals
?  What does `"5" + 3` produce in JavaScript?
- 8
- *"53"
- An error
- 3
> One side is text, so JavaScript joins instead of adding. The result is the text "53".

?  Which of these correctly tests whether `n` is even?
- `n / 2 == 0`
- *`n % 2 == 0`
- `n = 2`
- `n % 2 = 0`
> The remainder when dividing an even number by 2 is 0. A single `=` would assign instead of compare.

?  What does this print? `let t = 0; for (let i = 1; i <= 3; i++) { t += i; } console.log(t);`
- 3
- 5
- *6
- 123
> t becomes 1, then 3, then 6. Tracing the loop by hand confirms it.

?  A function has no `return` statement. What does the caller receive in JavaScript?
- 0
- An empty string
- *undefined
- An error
> Without return the function produces no value. JavaScript reports that as undefined, Python as None.

?  Which data structure fits best for storing a user's settings such as `theme` and `language`?
- A list
- *A dictionary (map)
- A single number
- A loop
> Settings are labelled values, which is exactly what key-value dictionaries are for.

?  A program runs without errors but prints the wrong total. What kind of error is it?
- Syntax error
- Runtime error
- *Logic error
- Compiler error
> The program is valid and does not crash, but its logic is wrong. Only tests and tracing find these.

?tf A `while` loop whose condition never becomes false will run forever. | true
> That is an infinite loop. Always make sure something inside the loop changes toward ending it.

?tf The first item of a list is at index 1 in most programming languages. | false
> Counting starts at zero in almost all mainstream languages.

?short What is the remainder of 29 divided by 6? Type the number. | 5
> 6 goes into 29 four times (24), leaving 5.

?multi Which of these are good problem-solving habits? Select all that apply.
- *Write examples of the expected answer before coding
- *Plan the steps in plain words first
- *Run the code after every few lines
- Write the whole program before testing anything
> Small steps with frequent testing catch mistakes while they are still easy to find.

?order Put the problem-solving method in order.
1. Understand the problem and write examples
2. Plan the steps in plain words
3. Write the smallest working version
4. Test with edge cases
5. Improve names and structure
> You cannot solve what you do not understand, and you should only polish code that already works.
:::
