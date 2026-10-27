---
id: languages
number: 4
title: Choosing Your Programming Language
track: Getting started
duration: 50 min
level: Beginner
summary: A tour of ten popular languages, what each is good at, how they differ, and a questionnaire that recommends one for you. Your quiz results sharpen the advice as you go.
---

::: objectives
- Explain why there are many programming languages and why that is not a problem.
- Describe what JavaScript, TypeScript, Python, Java, C#, PHP, Go, Ruby, Rust and Kotlin are best known for.
- Compare languages on typing, how they run, and how readable they are.
- Choose a first language with confidence, and know that switching later is normal.
:::

::: prereq
Introduction to Programming. You should have seen the Hello, world program in several languages.
:::

## Why so many languages?

There is no single best programming language, just as there is no single best vehicle. A bicycle, a truck and a sports car are all good at different jobs. Languages are designed with different goals: easy to read, very fast, safe against mistakes, good for the web, good for data, and so on.

The good news for a beginner: **the core ideas are the same in all of them**. Once you understand variables, decisions, loops, functions and data structures in one language, you are 80 percent of the way to understanding them in any other. Professional developers routinely learn a new language in a few weeks. So choose something reasonable, start, and do not worry about choosing perfectly.

::: plain
Languages are like spoken languages from the same family. Spanish, Italian and Portuguese share most of their grammar. Learn one well and the next one feels familiar. The ideas are the grammar. The syntax is the vocabulary.
:::

## Meet the languages

::: cards
- **JavaScript** | The language of the browser. Every web page that reacts to you uses it. With Node.js it also runs servers. Flexible and everywhere.
- **TypeScript** | JavaScript plus a type system that catches mistakes while you type. Loved on large web projects. Learn JavaScript first.
- **Python** | Famous for readable, almost English-like code. The leading language for data science, AI, automation and teaching. Also popular for web back ends.
- **Java** | A mature, strict language that runs on billions of devices. Dominates large company systems and Android history. Plenty of jobs.
- **C#** | Microsoft's modern language, similar in spirit to Java but with very clean features. The main language of the Unity game engine and common in business software.
- **PHP** | Built for the web server. Powers a huge share of websites, including WordPress. Modern PHP is much nicer than its reputation.
- **Go** | Created at Google for simple, fast, reliable network services. Small language, quick to learn, compiles to a single program.
- **Ruby** | Designed for programmer happiness. Elegant and expressive. Ruby on Rails made it a favourite of start-ups.
- **Rust** | Fast like C but safe from whole classes of memory bugs. Powerful, with a steep learning curve. Best as a later language.
- **Kotlin** | A concise, modern language on the Java platform. Google's preferred language for Android apps.
:::

### What is each best for?

::: figure layers Matching goals to languages. Most goals have more than one good answer.
*Websites and web apps | JavaScript, TypeScript, PHP, Ruby, Python
Data science, AI and automation | Python (clear leader), plus R and Julia outside this course
Mobile apps | Kotlin (Android), Swift (iPhone), JavaScript with React Native
Games | C# with Unity, C++ with Unreal, JavaScript in the browser
Business and enterprise back ends | Java, C#, Kotlin, Go
Fast tools and infrastructure | Go, Rust
:::

## The same task in seven languages

Reading the same small program in different languages is the best way to see what is shared and what is different. The task: add the numbers from 1 to `n`, then print the total for n = 10.

::: code Sum of 1 to n
```javascript
function sumTo(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}
console.log(sumTo(10));
```
```python
def sum_to(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total

print(sum_to(10))
```
```java
public class Main {
    static int sumTo(int n) {
        int total = 0;
        for (int i = 1; i <= n; i++) {
            total += i;
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println(sumTo(10));
    }
}
```
```csharp
using System;

Console.WriteLine(SumTo(10));

static int SumTo(int n)
{
    int total = 0;
    for (int i = 1; i <= n; i++)
    {
        total += i;
    }
    return total;
}
```
```php
<?php
function sumTo($n) {
    $total = 0;
    for ($i = 1; $i <= $n; $i++) {
        $total += $i;
    }
    return $total;
}
echo sumTo(10) . "\n";
```
```go
package main

import "fmt"

func sumTo(n int) int {
    total := 0
    for i := 1; i <= n; i++ {
        total += i
    }
    return total
}

func main() {
    fmt.Println(sumTo(10))
}
```
```ruby
def sum_to(n)
  total = 0
  (1..n).each do |i|
    total += i
  end
  total
end

puts sum_to(10)
```
```output
55
```
:::

What to notice:

- **Structure.** Python uses indentation to show what belongs inside the loop. Most others use curly braces `{ }`. Ruby uses the word `end`.
- **Types.** Java, C# and Go write the type (`int`) next to values. JavaScript, Python, PHP and Ruby do not.
- **Loops.** The `for` loop is nearly identical in JavaScript, Java, C#, PHP and Go. Python and Ruby loop over a range instead.
- **Returning a value.** Ruby returns the last value automatically. The others use `return`.

## Key differences between languages

### Typing: when are types checked?

A **type** says what kind of value something is: a whole number, text, a list. In **dynamically typed** languages (Python, JavaScript, PHP, Ruby) a variable can hold any type, and mistakes show up when that line runs. In **statically typed** languages (Java, C#, Go, Rust, Kotlin, TypeScript) every variable has a fixed type, and the compiler refuses to build the program if you mix them up.

::: code A type mistake
```python
age = 36
age = "thirty-six"   # allowed: Python lets the variable change type
print(age)
```
```java nocheck
int age = 36;
age = "thirty-six";   // compile error: String cannot be converted to int
```
:::

::: note Which is better?
Dynamic typing is quicker to write and great for learning and small programs. Static typing catches a whole category of bugs before the program ever runs, which matters more as programs grow. Many languages are moving toward both: Python has optional type hints, and TypeScript adds types to JavaScript.
:::

### How readable are they?

| Language | Typing | Runs as | First-week feel |
|---|---|---|---|
| Python | Dynamic | Interpreted | Gentlest. Short, clean code |
| Ruby | Dynamic | Interpreted | Very friendly and expressive |
| JavaScript | Dynamic | Interpreted in browser or Node.js | Friendly, but with some odd rules |
| PHP | Dynamic | Interpreted on server | Easy to start, some inconsistent names |
| Go | Static | Compiled | Small and strict. Few concepts |
| C# | Static | Compiled to bytecode | Structured. Good tooling |
| Java | Static | Compiled to bytecode | Verbose. Strong structure |
| Kotlin | Static | Compiled to bytecode | Concise and safe |
| TypeScript | Static (on top of JS) | Compiled to JavaScript | Needs JavaScript knowledge first |
| Rust | Static | Compiled | Hardest. Rewards patience |

## Find your language

Answer three quick questions. The recommendation uses your answers, and once you start taking module tests, your scores adjust it: if the Basics test is hard for you, gentler languages move up the list. You can retake this any time and switch languages with the selector in the sidebar.

::: demo finder
:::

## How to choose, honestly

1. **Start from a goal.** "I want to build websites" and "I want to analyse data" point to different answers.
2. **If you have no goal yet, pick Python or JavaScript.** Both are friendly, widely used, and have huge communities and free learning material.
3. **Use what your school, job or friends use.** Having someone to ask is worth more than a theoretically better language.
4. **Do not switch in the first month.** Beginners who hop between languages never get past the basics.
5. **Plan to learn a second language later.** It will take a fraction of the time and make you a stronger developer.

::: learn Compare languages as a study technique
Once a concept makes sense in your language, flip the tab and read it in another. Ask: what is the same? What changed? Seeing the same idea in two forms is a powerful way to separate the idea from the syntax.
:::

::: pitfall Common mistakes when choosing
- **Searching for the perfect language.** There is none. A good-enough choice you stick with beats a perfect choice you never start.
- **Judging by speed benchmarks.** For a beginner, how quickly you can learn matters far more than how fast the program runs.
- **Believing you can only know one.** Most professionals use several languages every week.
- **Thinking one language is "for real programmers".** Every language here is used professionally.
:::

## Check your understanding

::: quiz check Checkpoint: the languages
?  Which language is the main choice for making web pages interactive in the browser?
- Go
- *JavaScript
- Java
- Rust
> Browsers run JavaScript. Other languages can reach the browser only by compiling to JavaScript or WebAssembly.

?  Which pair is best known for data science and Android development, in that order?
- Ruby and PHP
- *Python and Kotlin
- Go and Java
- C# and Rust
> Python leads in data and AI. Kotlin is Google's preferred language for Android.
:::

::: quiz check Checkpoint: typing
?tf In a statically typed language, the compiler can reject a program that puts text into an integer variable. | true
> Static typing checks types before the program runs, catching this type of mistake early.

?  Which of these is dynamically typed?
- Java
- C#
- *Ruby
- Go
> Ruby, Python, JavaScript and PHP are dynamically typed. Java, C#, Go, Rust and Kotlin are statically typed.
:::

::: recap
- There is no best language. The core ideas are shared, so your first choice matters less than starting.
- JavaScript runs everywhere on the web. Python is gentle and leads in data. Java and C# lead in business systems. PHP, Ruby and Go are strong on the server. Rust and Kotlin are powerful later languages.
- Static typing catches type mistakes early. Dynamic typing is quicker to write.
- Use the finder, pick one, and stay with it for at least a month.
:::

::: quiz test Module test: Choosing a Language
?  Why is the first language you choose less important than it might seem?
- Because only one language is ever used
- *Because the core programming ideas transfer between languages
- Because all languages are identical
- Because languages never change
> Variables, loops, functions and data structures appear everywhere. Learning a second language is much faster than the first.

?  Which language is the main language of the Unity game engine?
- PHP
- Ruby
- *C#
- Go
> Unity games are scripted in C#.

?  Which language adds a type system on top of JavaScript?
- Kotlin
- *TypeScript
- Rust
- PHP
> TypeScript compiles to plain JavaScript but checks types while you write.

?  What does Python use to show which lines belong inside a loop?
- Curly braces
- The word end
- *Indentation
- Semicolons
> Python's blocks are defined by indentation, which is part of why the code looks tidy.

?tf Dynamic typing means a variable cannot hold any value. | false
> Dynamic typing means a variable can hold any type. The checks happen as the program runs.

?short Which language did Google create for simple, fast network services? Answer with its two-letter name. | go
> Go was designed at Google for reliable, concurrent network software.

?multi Which of these are statically typed? Select all that apply.
- *Java
- *Go
- *Rust
- Ruby
> Java, Go and Rust require types known at compile time. Ruby is dynamic.

?order Order these sensible steps for choosing a language.
1. Decide what you want to build
2. Take the questionnaire or compare profiles
3. Pick one and commit for a month
4. Consider a second language later
> Start from a goal, get a recommendation, commit, then expand.
:::
