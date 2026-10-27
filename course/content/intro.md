---
id: intro
number: 2
title: Introduction to Programming and Web Development
track: Getting started
duration: 75 min
level: Beginner
summary: What programming really is, how a computer runs your instructions, how languages differ, and how to set up and run your first program.
---

::: objectives
- Describe what a program is and how a computer follows it.
- Explain the difference between compiled and interpreted languages, and where each of the seven course languages fits.
- Read and write a first program that prints text and uses variables.
- Know the tools every developer uses: a code editor, a terminal and browser developer tools.
- Describe the three building blocks every program is made from: sequence, selection and iteration.
:::

::: prereq
Complete **Start Here** if you have not. No programming knowledge is needed.
:::

## What is programming?

A computer is incredibly fast and incredibly literal. It can do billions of tiny operations every second, but it has no common sense: it will do exactly what you tell it, nothing more and nothing less. **Programming** is the art of writing instructions precise enough that a computer can follow them to solve a problem.

You already know this skill from everyday life. A recipe is a list of precise steps. Directions to a friend's house are a list of precise steps. If a step is missing or ambiguous ("add some flour"), a human guesses. A computer cannot guess, so you must be exact.

::: plain
A program is a recipe, the computer is a very fast cook who has never seen food, and the programming language is the language the recipe is written in. A good programmer writes recipes so clear that the cook never gets confused.
:::

An [[Algorithm|algorithm]] is the idea of the recipe: the steps in plain words, independent of any language. A program is an algorithm written in a particular language. In this course you will learn to think in algorithms first, and then write them in the language you chose.

### Every program does three things

::: figure flow Input, process, output: the shape of almost every program
Input | keyboard, file, network -> *Process | calculate, decide, repeat -> Output | screen, file, network
:::

A calculator takes numbers (input), adds them (process) and shows the answer (output). A website takes a search phrase (input), looks it up (process) and shows results (output). Whenever you feel lost in a big program, ask yourself: what goes in, what is done with it, what comes out?

## How does a computer run your code?

Computers only understand **machine code**: long strings of ones and zeros. Nobody wants to write that, so we write in a human-readable language and use a tool to translate it. There are two main approaches.

::: figure flow A compiler translates everything first, then you run the result
Source code | what you write -> *Compiler | translates the whole program -> Machine code | a ready-to-run file -> Computer | runs it
:::

::: figure flow An interpreter reads and runs your code as it goes
Source code | what you write -> *Interpreter | reads one statement at a time -> Computer | does it immediately
:::

| Language | How it runs | In practice |
|---|---|---|
| JavaScript | Interpreted, with just-in-time compilation | Runs in the browser, or on a server with Node.js |
| Python | Interpreted | `python file.py` |
| Java | Compiled to bytecode, run on the Java Virtual Machine | `javac` then `java`, or just `java File.java` |
| C# | Compiled to bytecode, run by the .NET runtime | `dotnet run` |
| PHP | Interpreted on the server | `php file.php`, or served by a web server |
| Go | Compiled to a native program | `go run main.go`, or `go build` |
| Ruby | Interpreted | `ruby file.rb` |

::: note Why this matters to you
Compiled languages check many mistakes before the program starts, and usually run faster. Interpreted languages let you try things immediately, which is great for learning. Neither is "better". They are different tools.
:::

## Your first program

The traditional first program prints the words "Hello, world!". It is tiny, but it proves your whole set-up works. Use the tabs to see the same program in each language. Notice how much they have in common, and how they differ.

::: code Hello, world
```javascript
console.log("Hello, world!");
```
```python
print("Hello, world!")
```
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
```
```csharp
using System;

Console.WriteLine("Hello, world!");
```
```php
<?php
echo "Hello, world!\n";
```
```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, world!")
}
```
```ruby
puts "Hello, world!"
```
```output
Hello, world!
```
:::

Python, Ruby, PHP and JavaScript need only one line. Java and Go need a little structure around it: Java puts everything inside a **class** with a `main` method, and Go puts it in a `main` function inside a `main` package. That structure is called [[Boilerplate|boilerplate]]. It is the entry point where the program starts. You will understand each word of it by the end of the Basics module, so for now copy it as is.

::: note About the examples that follow
To save space, from here on the Java, Go and C# samples show only the interesting lines. Imagine them placed inside `main`. The Python, JavaScript, PHP and Ruby samples run as they are.
:::

### Where to run the code

You have two options, and you should use both.

1. **In this course.** The live editors let you run JavaScript right here with nothing to install. Other languages are shown for reading and comparison.
2. **On your own computer.** To run Python, Java, C#, PHP, Go or Ruby you install the language once. Use the official download page of your chosen language, then follow the table below.

| Language | Run a file called `hello` |
|---|---|
| JavaScript | `node hello.js` (needs Node.js) |
| Python | `python3 hello.py` |
| Java | `java Hello.java` (Java 11 or newer) |
| C# | `dotnet run` inside a project created with `dotnet new console` |
| PHP | `php hello.php` |
| Go | `go run hello.go` |
| Ruby | `ruby hello.rb` |

::: playground js Run your first program in the browser
This is real JavaScript running in your browser. Change the message, press Run, and watch the output.
```js
console.log("Hello, world!");
console.log("My name is ...");
```
:::

## Variables: naming a value

Programs constantly remember things: a user's name, a score, the price of an item. A **variable** is a name attached to a value so you can use it again.

::: plain
A variable is a labelled box. The label is the variable's name. The thing inside is its value. You can open the box, read the value, or replace the value with a new one.
:::

::: code A variable holds a value, and we print it
```javascript
const name = "Ada";
const age = 36;
console.log(`${name} is ${age} years old`);
```
```python
name = "Ada"
age = 36
print(f"{name} is {age} years old")
```
```java
String name = "Ada";
int age = 36;
System.out.println(name + " is " + age + " years old");
```
```csharp
string name = "Ada";
int age = 36;
Console.WriteLine($"{name} is {age} years old");
```
```php
<?php
$name = "Ada";
$age = 36;
echo "$name is $age years old\n";
```
```go
name := "Ada"
age := 36
fmt.Println(name, "is", age, "years old")
```
```ruby
name = "Ada"
age = 36
puts "#{name} is #{age} years old"
```
```output
Ada is 36 years old
```
:::

Spot the differences, because they teach you something deep about languages:

- **Python, Ruby, JavaScript, PHP and Go** work out the type of a value for you. **Java and C#** make you state it (`String`, `int`). Stating the type is called *static typing*: the language checks types before the program runs.
- PHP puts a dollar sign before every variable name.
- Each language has its own way of putting values inside text. This is called *string interpolation*.

### The names you can choose

Use clear names. `age` is better than `a`. `totalPrice` is better than `tp`. Programs are read far more often than they are written, and the reader is often you in six months.

::: best Naming conventions
- Start with a letter. Use letters, digits and underscores. No spaces.
- JavaScript, Java, C# and Go usually write `camelCase` (`totalPrice`). Python and Ruby usually write `snake_case` (`total_price`).
- Names are case-sensitive: `Age` and `age` are different variables.
- Pick names that say what the value means, not how it is stored.
:::

## The three building blocks of every program

Every program, from a calculator to a social network, is built from just three ideas.

::: figure svg Sequence, selection and iteration
<svg class="fg" viewBox="0 0 760 250" role="img" aria-label="Three small flow diagrams. Sequence: step A then step B then step C. Selection: a question with a yes path and a no path. Iteration: a step that loops back while a condition holds." style="max-width:760px;min-width:547px" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="ah-i1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="fg-head"/></marker></defs>
<text x="85" y="22" text-anchor="middle" class="fg-title">Sequence</text>
<rect x="30" y="40" width="110" height="38" rx="8" class="fg-box"/><text x="85" y="64" text-anchor="middle" class="fg-title">Step A</text>
<line x1="85" y1="80" x2="85" y2="106" class="fg-line" marker-end="url(#ah-i1)"/>
<rect x="30" y="110" width="110" height="38" rx="8" class="fg-box"/><text x="85" y="134" text-anchor="middle" class="fg-title">Step B</text>
<line x1="85" y1="150" x2="85" y2="176" class="fg-line" marker-end="url(#ah-i1)"/>
<rect x="30" y="180" width="110" height="38" rx="8" class="fg-box"/><text x="85" y="204" text-anchor="middle" class="fg-title">Step C</text>
<text x="380" y="22" text-anchor="middle" class="fg-title">Selection</text>
<rect x="310" y="40" width="140" height="42" rx="8" class="fg-box fg-accent"/><text x="380" y="66" text-anchor="middle" class="fg-title">Is it raining?</text>
<line x1="340" y1="84" x2="300" y2="140" class="fg-line" marker-end="url(#ah-i1)"/><text x="296" y="116" text-anchor="end" class="fg-sub">yes</text>
<line x1="420" y1="84" x2="460" y2="140" class="fg-line" marker-end="url(#ah-i1)"/><text x="464" y="116" class="fg-sub">no</text>
<rect x="240" y="144" width="120" height="38" rx="8" class="fg-box"/><text x="300" y="168" text-anchor="middle" class="fg-title">Take umbrella</text>
<rect x="400" y="144" width="120" height="38" rx="8" class="fg-box"/><text x="460" y="168" text-anchor="middle" class="fg-title">Wear sunglasses</text>
<text x="650" y="22" text-anchor="middle" class="fg-title">Iteration</text>
<rect x="595" y="40" width="110" height="42" rx="8" class="fg-box fg-accent"/><text x="650" y="58" text-anchor="middle" class="fg-title">More pages</text><text x="650" y="74" text-anchor="middle" class="fg-title">to read?</text>
<line x1="650" y1="84" x2="650" y2="130" class="fg-line" marker-end="url(#ah-i1)"/><text x="660" y="112" class="fg-sub">yes</text>
<rect x="595" y="134" width="110" height="38" rx="8" class="fg-box"/><text x="650" y="158" text-anchor="middle" class="fg-title">Read a page</text>
<path d="M595 153 H570 V61 H591" class="fg-line" fill="none" marker-end="url(#ah-i1)"/>
<text x="650" y="204" text-anchor="middle" class="fg-sub">no: stop looping</text>
</svg>
:::

- **Sequence**: do things one after another, in order.
- **Selection**: choose a path based on a condition (`if` this, do that, `else` do something else).
- **Iteration**: repeat something (a loop) until a condition tells you to stop.

The next module teaches how to write each of these in all seven languages. For now just notice them in the world around you. Making tea is a sequence. "If the water is boiling, pour it" is selection. "Stir until the sugar dissolves" is iteration.

## The developer's toolbox

You do not need to buy anything. These tools are free.

::: cards
- **A code editor** | A text editor made for code. Visual Studio Code is free, popular and supports every language in this course. It colours your code and flags mistakes.
- **A terminal** | The command line. You type commands to run programs, install libraries and use Git. It looks old-fashioned, but it is the fastest way to control a computer.
- **A browser with developer tools** | Press F12 in your browser. The Console tab runs JavaScript and shows errors. The Elements tab shows the live page. You will use it constantly.
- **Git** | Records every version of your code so that you can undo mistakes and collaborate. Covered in the DevOps module.
:::

::: learn Learn five terminal commands first
`pwd` shows where you are. `ls` (or `dir` on Windows) lists files. `cd name` enters a folder and `cd ..` goes up. `mkdir name` makes a folder. That is enough to begin. You will pick up the rest naturally.
:::

## Reading code and thinking like a programmer

Programmers spend more time reading and fixing code than writing new code. Three mental habits will speed you up.

1. **Decompose.** Break a big problem into small ones. "Build a login page" becomes: draw a form, check the password, remember the user, show an error.
2. **Trace.** Run the program in your head, line by line, writing down the value of each variable. This is the most reliable way to find out what code really does.
3. **Test small.** Write a few lines, run them, see that they work, then write a few more.

::: try Trace this program
Work out the output on paper before you run it. Then paste it into the editor below and check.
:::

::: playground js Trace the values
```js
let score = 10;
score = score + 5;
score = score * 2;
console.log(score);
```
:::

::: pitfall Common beginner mistakes
- **Forgetting that order matters.** Computers run statements from top to bottom. A variable must exist before you use it.
- **Confusing `=` with "equals".** In programming `=` means "store this value in this variable". Comparing two values uses `==` or `===` (you will see this in the Basics module).
- **Not saving the file** before running it. If your changes seem to have no effect, save first.
- **Typing smart quotes.** If you copy code from a word processor, curly quotes break it. Use straight quotes `"`.
:::

## Check your understanding

::: quiz check Checkpoint: programs and languages
?  In "input, process, output", which part is a user typing their name into a form?
- Process
- Output
- *Input
- Compile
> Anything that goes into a program from the outside, such as typing, files or network data, is input.

?tf A compiler translates your whole program before it runs, while an interpreter runs it as it reads it. | true
> That is the key difference. Many modern languages blur the line, but the idea is a good starting point.
:::

::: quiz check Checkpoint: variables
?  After running `score = 10` then `score = score + 5`, what does `score` hold?
- 10
- *15
- 5
- "score + 5"
> The right side is worked out first using the old value (10 + 5 = 15) and the result is stored back in `score`.

?short A named box that holds a value is called a ______. | variable
> A variable is a name attached to a value. You can read it and change it.
:::

::: recap
- A program is a precise list of instructions. An algorithm is the idea, the program is its expression in a language.
- Compilers translate everything first. Interpreters run code as they read it.
- The same program looks different in each language, but the ideas are shared.
- A variable is a named value. Choose clear names.
- All programs are built from sequence, selection and iteration.
- The tools you need are a code editor, a terminal and browser developer tools.
:::

::: quiz test Module test: Introduction
?  What is an algorithm?
- A type of computer chip
- *A step-by-step method for solving a problem
- A programming language
- A kind of error
> An algorithm is the idea of the solution, independent of language. A program expresses it in code.

?  Which language is compiled to native machine code in this course's list?
- Python
- Ruby
- *Go
- PHP
> Go compiles straight to a native program. Python, Ruby and PHP are interpreted. Java and C# compile to bytecode that a runtime executes.

?  Why do Java and Go examples need extra lines (`class Main`, `package main`) that Python does not?
- Python is a slower language
- *They need a defined entry point and structure, which Python and Ruby leave out for small scripts
- Java and Go cannot print text
- It is only decoration
> Java and Go require code to live inside a defined structure with a main entry point. Scripting languages let you start with a single line.

?  What is the main purpose of a variable?
- To make the program run faster
- To draw pictures
- *To give a name to a value so it can be reused
- To stop the program
> A variable names a value, like a labelled box, so you can use and update it later.

?  What does this print? `let n = 2; n = n * 3; console.log(n);`
- 2
- 3
- 23
- *6
> n starts at 2. The second line multiplies by 3 and stores 6 back in n.

?tf In programming, the single `=` sign means "is equal to" when comparing two values. | false
> A single `=` assigns a value to a variable. Comparison uses `==` or `===`, depending on the language.

?multi Which are the three basic building blocks of programs? Select all that apply.
- *Sequence
- *Selection
- *Iteration
- Decoration
> Every program is built by combining doing steps in order, choosing between paths and repeating steps.

?order Put these in the order they happen for a compiled program.
1. Write the source code
2. Run the compiler
3. Get a ready-to-run program
4. Run the program
> You write code, the compiler translates it, you get an executable, and then you run it.
:::
