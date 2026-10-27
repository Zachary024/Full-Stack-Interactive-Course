---
id: ref-syntax
number: 106
title: Language Syntax Comparison
track: Reference
duration: Reference
level: All levels
summary: The same twenty everyday tasks written in JavaScript, Python, Java, C#, PHP, Go and Ruby, so you can see what is common and what is different.
kind: reference
---

::: note
Once you can program in one language, learning the next is mostly learning a new spelling of the same ideas. This page shows twenty everyday tasks in all seven course languages. Use it to translate what you know, to pick a language by comparing how it reads, or to remind yourself of a detail. Snippets are fragments, so lines such as imports and the main function are shown separately.
:::

::: tip
Notice what stays the same in every language: variables, conditions, loops, functions, collections and errors. The names and punctuation change. The thinking does not.
:::

## Basics

::: cheat Print a line of text
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; console.log("Hello"); ;; In a browser, appears in the developer console
Python ;; print("Hello") ;; Adds a new line automatically
Java ;; System.out.println("Hello"); ;; Must be inside a method
C# ;; Console.WriteLine("Hello"); ;; Needs using System at the top
PHP ;; echo "Hello\n"; ;; Needs the new line added yourself
Go ;; fmt.Println("Hello") ;; Needs the fmt package imported
Ruby ;; puts "Hello" ;; Adds a new line automatically
:::

::: cheat Comments
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; // one line   /* many lines */ ;; Same as Java, C# and Go
Python ;; # one line ;; Triple quotes are used for documentation strings
Java ;; // one line   /* many lines */ ;; Also /** */ for Javadoc
C# ;; // one line   /* many lines */ ;; Also /// for documentation
PHP ;; // one line   # also one line   /* many lines */ ;; Both // and # work
Go ;; // one line   /* many lines */ ;; Comments before a function document it
Ruby ;; # one line ;; =begin and =end for many lines
:::

::: cheat Variables and constants
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; let count = 1; const PI = 3.14; ;; Use const by default. Avoid var
Python ;; count = 1 ;; No keyword. Constants are written in capitals by convention
Java ;; int count = 1; final double PI = 3.14; ;; final means it cannot change
C# ;; int count = 1; const double Pi = 3.14; ;; var count = 1; lets the compiler infer the type
PHP ;; $count = 1; const PI = 3.14; ;; Variables start with a dollar sign
Go ;; count := 1 ;; const Pi = 3.14 for constants. var count int = 1 is the long form
Ruby ;; count = 1 ;; Constants start with a capital letter: PI = 3.14
:::

::: cheat Basic types
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; 42 3.14 "text" true null undefined ;; Only one number type, plus BigInt for huge integers
Python ;; 42 3.14 "text" True None ;; int, float, str, bool and NoneType
Java ;; int long double String boolean ;; Primitive types are lower case. String is a class
C# ;; int long double string bool ;; All are aliases of .NET types
PHP ;; 42 3.14 "text" true null ;; Types are decided at run time
Go ;; int float64 string bool ;; The zero values are 0, 0.0, "" and false
Ruby ;; 42 3.14 "text" true nil ;; Everything is an object
:::

::: cheat Convert text to a number
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; Number("42") ;; Gives NaN when it fails. parseInt("42", 10) also works
Python ;; int("42") ;; Raises ValueError when it fails
Java ;; Integer.parseInt("42") ;; Throws NumberFormatException
C# ;; int.Parse("42") ;; int.TryParse is safer for user input
PHP ;; (int) "42" ;; Also intval("42")
Go ;; n, err := strconv.Atoi("42") ;; Always check err
Ruby ;; "42".to_i ;; Gives 0 when it fails. Use Integer("42") to raise an error
:::

## Strings

::: cheat Insert values into text
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; `Hello, ${name}` ;; Template literal with backticks
Python ;; f"Hello, {name}" ;; f-string
Java ;; "Hello, " + name ;; Also String.format("Hello, %s", name)
C# ;; $"Hello, {name}" ;; Interpolated string
PHP ;; "Hello, $name" ;; Only in double quotes
Go ;; fmt.Sprintf("Hello, %s", name) ;; Sprintf returns the text
Ruby ;; "Hello, #{name}" ;; Only in double quotes
:::

::: cheat Common string operations: length
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; text.length ;; A property, with no brackets
Python ;; len(text) ;; A built-in function
Java ;; text.length() ;; A method
C# ;; text.Length ;; A property
PHP ;; strlen($text) ;; Counts bytes. Use mb_strlen for Unicode
Go ;; len(text) ;; Counts bytes, not characters
Ruby ;; text.length ;; Also text.size
:::

::: cheat Common string operations: upper case
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; text.toUpperCase() ;; Returns a new string
Python ;; text.upper() ;; Returns a new string
Java ;; text.toUpperCase() ;; Returns a new string
C# ;; text.ToUpper() ;; Returns a new string
PHP ;; strtoupper($text) ;; Function, not a method
Go ;; strings.ToUpper(text) ;; Needs the strings package
Ruby ;; text.upcase ;; Returns a new string
:::

::: cheat Common string operations: contains
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; text.includes("cat") ;; Returns true or false
Python ;; "cat" in text ;; Reads like English
Java ;; text.contains("cat") ;; Returns a boolean
C# ;; text.Contains("cat") ;; Returns a bool
PHP ;; str_contains($text, "cat") ;; PHP 8 and later
Go ;; strings.Contains(text, "cat") ;; Needs the strings package
Ruby ;; text.include?("cat") ;; Question marks mean "returns true or false"
:::

::: cheat Split text into pieces
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; text.split(",") ;; Returns an array
Python ;; text.split(",") ;; Returns a list
Java ;; text.split(",") ;; Returns an array. The argument is a regular expression
C# ;; text.Split(',') ;; Returns an array
PHP ;; explode(",", $text) ;; Returns an array
Go ;; strings.Split(text, ",") ;; Returns a slice
Ruby ;; text.split(",") ;; Returns an array
:::

## Decisions and loops

::: cheat If, else if, else
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; if (n > 0) { ... } else if (n < 0) { ... } else { ... } ;; Use === for equality, not ==
Python ;; if n > 0: ... elif n < 0: ... else: ... ;; Indentation is the block. The colon is required
Java ;; if (n > 0) { ... } else if (n < 0) { ... } else { ... } ;; Use .equals() to compare strings
C# ;; if (n > 0) { ... } else if (n < 0) { ... } else { ... } ;; The condition must be a bool
PHP ;; if ($n > 0) { ... } elseif ($n < 0) { ... } else { ... } ;; Both elseif and else if work
Go ;; if n > 0 { ... } else if n < 0 { ... } else { ... } ;; No brackets round the condition. Braces are required
Ruby ;; if n > 0 ... elsif n < 0 ... else ... end ;; Spelled elsif. Ends with end
:::

::: cheat Logical operators
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; a && b   a || b   !a ;; Short-circuit evaluation
Python ;; a and b   a or b   not a ;; Words, not symbols
Java ;; a && b   a || b   !a ;; Short-circuit evaluation
C# ;; a && b   a || b   !a ;; Short-circuit evaluation
PHP ;; $a && $b   $a || $b   !$a ;; Also and, or and not with lower precedence
Go ;; a && b   a || b   !a ;; Short-circuit evaluation
Ruby ;; a && b   a || b   !a ;; Also and, or and not with lower precedence
:::

::: cheat Count from 0 to 4
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; for (let i = 0; i < 5; i++) { console.log(i); } ;; Classic three-part loop
Python ;; for i in range(5): print(i) ;; range(5) gives 0 to 4
Java ;; for (int i = 0; i < 5; i++) { System.out.println(i); } ;; Classic three-part loop
C# ;; for (int i = 0; i < 5; i++) { Console.WriteLine(i); } ;; Classic three-part loop
PHP ;; for ($i = 0; $i < 5; $i++) { echo $i; } ;; Classic three-part loop
Go ;; for i := 0; i < 5; i++ { fmt.Println(i) } ;; The only loop keyword is for
Ruby ;; 5.times { |i| puts i } ;; Also (0..4).each
:::

::: cheat Loop over a list
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; for (const x of items) { console.log(x); } ;; for...of gives values. for...in gives keys
Python ;; for x in items: print(x) ;; Works for any collection
Java ;; for (String x : items) { System.out.println(x); } ;; Enhanced for loop
C# ;; foreach (var x in items) { Console.WriteLine(x); } ;; foreach
PHP ;; foreach ($items as $x) { echo $x; } ;; foreach
Go ;; for _, x := range items { fmt.Println(x) } ;; The underscore ignores the index
Ruby ;; items.each { |x| puts x } ;; Block syntax
:::

::: cheat While loop
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; while (n > 0) { n--; } ;; The condition is checked first
Python ;; while n > 0: n -= 1 ;; There is no n-- in Python
Java ;; while (n > 0) { n--; } ;; The condition is checked first
C# ;; while (n > 0) { n--; } ;; The condition is checked first
PHP ;; while ($n > 0) { $n--; } ;; The condition is checked first
Go ;; for n > 0 { n-- } ;; Go uses for as a while loop
Ruby ;; while n > 0 do n -= 1 end ;; Ruby has no n--
:::

## Functions, collections and objects

::: cheat Define and call a function
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; function add(a, b) { return a + b; } ;; Also const add = (a, b) => a + b;
Python ;; def add(a, b): return a + b ;; Indented body, or on one line for short ones
Java ;; static int add(int a, int b) { return a + b; } ;; Types are required. Lives inside a class
C# ;; static int Add(int a, int b) { return a + b; } ;; Types are required. Method names are PascalCase
PHP ;; function add(int $a, int $b): int { return $a + $b; } ;; Types are optional
Go ;; func add(a int, b int) int { return a + b } ;; Types come after the names
Ruby ;; def add(a, b) a + b end ;; The last value is returned automatically
:::

::: cheat Create a list and add an item
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; const items = [1, 2]; items.push(3); ;; Arrays can grow
Python ;; items = [1, 2]; items.append(3) ;; Called a list
Java ;; List<Integer> items = new ArrayList<>(List.of(1, 2)); items.add(3); ;; Arrays have a fixed size. Use a List instead
C# ;; var items = new List<int> { 1, 2 }; items.Add(3); ;; List<T>
PHP ;; $items = [1, 2]; $items[] = 3; ;; An array that can grow
Go ;; items := []int{1, 2}; items = append(items, 3) ;; A slice. append returns the new slice
Ruby ;; items = [1, 2]; items << 3 ;; Also items.push(3)
:::

::: cheat Dictionary (key and value pairs)
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; const ages = { ada: 36 }; ages["bob"] = 41; ;; Object. Map is the other option
Python ;; ages = {"ada": 36}; ages["bob"] = 41 ;; dict
Java ;; Map<String, Integer> ages = new HashMap<>(); ages.put("ada", 36); ;; HashMap
C# ;; var ages = new Dictionary<string, int> { ["ada"] = 36 }; ;; Dictionary<K, V>
PHP ;; $ages = ["ada" => 36]; $ages["bob"] = 41; ;; Arrays double as dictionaries
Go ;; ages := map[string]int{"ada": 36}; ages["bob"] = 41 ;; map
Ruby ;; ages = { "ada" => 36 }; ages["bob"] = 41 ;; Hash
:::

::: cheat Transform every item in a list (double each number)
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; items.map(x => x * 2) ;; Returns a new array
Python ;; [x * 2 for x in items] ;; List comprehension
Java ;; items.stream().map(x -> x * 2).toList() ;; Streams
C# ;; items.Select(x => x * 2).ToList() ;; LINQ, needs using System.Linq
PHP ;; array_map(fn($x) => $x * 2, $items) ;; Arrow function, PHP 7.4 and later
Go ;; for i, x := range items { items[i] = x * 2 } ;; No built-in map. A loop is normal in Go
Ruby ;; items.map { |x| x * 2 } ;; Returns a new array
:::

::: cheat A class with a constructor and a method
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; class Dog { constructor(name) { this.name = name; } bark() { return this.name + " barks"; } } ;; this refers to the object
Python ;; class Dog: def __init__(self, name): self.name = name ;; self is written out in every method
Java ;; class Dog { String name; Dog(String name) { this.name = name; } String bark() { return name + " barks"; } } ;; The constructor has the class name
C# ;; class Dog { public string Name; public Dog(string name) { Name = name; } public string Bark() => Name + " barks"; } ;; Members are private unless marked public
PHP ;; class Dog { function __construct(public string $name) {} function bark() { return $this->name . " barks"; } } ;; Use -> to reach members
Go ;; type Dog struct { Name string }; func (d Dog) Bark() string { return d.Name + " barks" } ;; Go has structs with methods, not classes
Ruby ;; class Dog; def initialize(name); @name = name; end; def bark; "#{@name} barks"; end; end ;; Instance variables start with @
:::

## Errors, nothing and input

::: cheat Handle an error
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; try { risky(); } catch (e) { console.log(e.message); } finally { ... } ;; throw new Error("message") raises one
Python ;; try: risky() except ValueError as e: print(e) ;; raise ValueError("message") raises one
Java ;; try { risky(); } catch (Exception e) { System.out.println(e.getMessage()); } ;; Checked exceptions must be declared or caught
C# ;; try { Risky(); } catch (Exception e) { Console.WriteLine(e.Message); } ;; throw new Exception("message")
PHP ;; try { risky(); } catch (Exception $e) { echo $e->getMessage(); } ;; throw new Exception("message")
Go ;; result, err := risky(); if err != nil { return err } ;; Errors are ordinary return values
Ruby ;; begin risky rescue => e puts e.message end ;; raise "message" raises one
:::

::: cheat Nothing (null)
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; value === null || value === undefined ;; Or value == null. Optional chaining: user?.name
Python ;; value is None ;; Use is, not ==
Java ;; value == null ;; Optional is the modern alternative
C# ;; value == null ;; Also value?.Length and value ?? "default"
PHP ;; $value === null ;; Also isset($value)
Go ;; value == nil ;; Pointers, slices, maps and errors can be nil
Ruby ;; value.nil? ;; Also safe navigation: user&.name
:::

::: cheat Read a line typed by the user
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; const name = prompt("Name?"); ;; Browser only. In Node.js use the readline module
Python ;; name = input("Name? ") ;; Always returns text
Java ;; String name = new Scanner(System.in).nextLine(); ;; Needs import java.util.Scanner
C# ;; string name = Console.ReadLine(); ;; Can be null at the end of the input
PHP ;; $name = trim(fgets(STDIN)); ;; From the command line
Go ;; fmt.Scanln(&name) ;; Reads one word. Use bufio.Scanner for lines
Ruby ;; name = gets.chomp ;; chomp removes the new line
:::

## Structure of a program

::: cheat Import a library
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; import fs from "node:fs"; ;; ES modules. The older form is require("fs")
Python ;; import math ;; Or from math import sqrt
Java ;; import java.util.List; ;; At the top of the file
C# ;; using System.Collections.Generic; ;; At the top of the file
PHP ;; use App\Models\User; ;; Or require "file.php"
Go ;; import "fmt" ;; Unused imports are errors
Ruby ;; require "json" ;; At the top of the file
:::

::: cheat A complete "Hello" program
cols: Language ;; Code ;; Note
code: 2
JavaScript ;; console.log("Hello"); ;; Run with node hello.js
Python ;; print("Hello") ;; Run with python3 hello.py
Java ;; public class Hello { public static void main(String[] args) { System.out.println("Hello"); } } ;; Compile with javac and run with java Hello
C# ;; Console.WriteLine("Hello"); ;; In a .NET project with top-level statements. Run with dotnet run
PHP ;; <?php echo "Hello\n"; ;; Run with php hello.php
Go ;; package main; import "fmt"; func main() { fmt.Println("Hello") } ;; Run with go run hello.go
Ruby ;; puts "Hello" ;; Run with ruby hello.rb
:::
