---
id: advanced
number: 17
title: Software Engineering Practice
track: Engineering practice
duration: 220 min
level: Advanced
summary: Object-oriented design, concurrency, testing, algorithms and complexity, clean code and packaging. Taught with the same ideas in many languages.
---

::: objectives
- Model a problem with classes, inheritance, interfaces and polymorphism, and know when to prefer composition.
- Explain concurrency, parallelism, race conditions and deadlocks, and use each language's tools safely.
- Write unit tests, apply test-driven development and design testable code.
- Estimate how an algorithm scales using Big-O notation.
- Write clean, readable code, and refactor with confidence.
- Package and share code with each language's package manager.
:::

::: prereq
Programming Fundamentals and a working knowledge of at least one language from the course. The examples show seven languages side by side, so use the tabs to read the one you are learning. Ideas matter more than syntax here.
:::

## From scripts to software

A script of fifty lines needs little structure. A system of fifty thousand lines, changed by ten people over five years, is a different animal. The skills in this module are what keep it understandable, changeable and correct: **modelling** with objects, handling **many things at once**, **proving** it works with tests, keeping it **fast enough**, and keeping it **clean**.

::: note This module is language-neutral on purpose
Object-oriented design, concurrency, testing and complexity are not tied to Python, Java or JavaScript. Learn the idea once, and then look up the syntax in whichever language you use. Where the languages differ in an interesting way, the module points it out.
:::

## Object-oriented design

### Classes, objects and encapsulation

A **class** bundles **data** (fields) with the **behaviour** (methods) that works on it. **[[Encapsulation]]** means hiding the internals and exposing a small, safe interface: a bank account lets you `deposit`, but you cannot directly set its balance to a million.

### Inheritance and polymorphism

[[Inheritance]] lets one class build on another: a `Dog` *is an* `Animal` and gets its fields and methods, and may change some. [[Polymorphism]] ("many forms") is the payoff: code can treat different kinds of object uniformly, and each one responds in its own way.

::: figure tree An inheritance hierarchy
Animal (name, speak)
  Dog (speak: Woof)
  Cat (speak: Meow)
  Bird (speak: Tweet)
:::

The loop below does not know or care which animal it is dealing with, and calls `speak()` on each. The right version runs. That is polymorphism.

::: code Polymorphism: one call, different behaviours
```javascript
class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name + " makes a sound"; }
}
class Dog extends Animal {
  speak() { return this.name + " says Woof"; }
}
class Cat extends Animal {
  speak() { return this.name + " says Meow"; }
}

for (const a of [new Dog("Rex"), new Cat("Tom")]) {
  console.log(a.speak());
}
```
```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return self.name + " makes a sound"


class Dog(Animal):
    def speak(self):
        return self.name + " says Woof"


class Cat(Animal):
    def speak(self):
        return self.name + " says Meow"


for a in [Dog("Rex"), Cat("Tom")]:
    print(a.speak())
```
```java
public class Main {
    static class Animal {
        String name;
        Animal(String name) { this.name = name; }
        String speak() { return name + " makes a sound"; }
    }
    static class Dog extends Animal {
        Dog(String name) { super(name); }
        @Override String speak() { return name + " says Woof"; }
    }
    static class Cat extends Animal {
        Cat(String name) { super(name); }
        @Override String speak() { return name + " says Meow"; }
    }

    public static void main(String[] args) {
        Animal[] animals = { new Dog("Rex"), new Cat("Tom") };
        for (Animal a : animals) {
            System.out.println(a.speak());
        }
    }
}
```
```csharp
Animal[] animals = { new Dog("Rex"), new Cat("Tom") };
foreach (var a in animals)
{
    Console.WriteLine(a.Speak());
}

class Animal
{
    public string Name;
    public Animal(string name) { Name = name; }
    public virtual string Speak() => Name + " makes a sound";
}
class Dog : Animal
{
    public Dog(string name) : base(name) { }
    public override string Speak() => Name + " says Woof";
}
class Cat : Animal
{
    public Cat(string name) : base(name) { }
    public override string Speak() => Name + " says Meow";
}
```
```php
<?php
class Animal {
    public function __construct(protected string $name) {}
    public function speak(): string { return $this->name . " makes a sound"; }
}
class Dog extends Animal {
    public function speak(): string { return $this->name . " says Woof"; }
}
class Cat extends Animal {
    public function speak(): string { return $this->name . " says Meow"; }
}

foreach ([new Dog("Rex"), new Cat("Tom")] as $a) {
    echo $a->speak() . "\n";
}
```
```go
package main

import "fmt"

// Go has no inheritance. Types satisfy an interface just by having the method.
type Speaker interface {
	Speak() string
}

type Dog struct{ Name string }
type Cat struct{ Name string }

func (d Dog) Speak() string { return d.Name + " says Woof" }
func (c Cat) Speak() string { return c.Name + " says Meow" }

func main() {
	for _, a := range []Speaker{Dog{"Rex"}, Cat{"Tom"}} {
		fmt.Println(a.Speak())
	}
}
```
```ruby
class Animal
  def initialize(name)
    @name = name
  end

  def speak
    "#{@name} makes a sound"
  end
end

class Dog < Animal
  def speak
    "#{@name} says Woof"
  end
end

class Cat < Animal
  def speak
    "#{@name} says Meow"
  end
end

[Dog.new("Rex"), Cat.new("Tom")].each { |a| puts a.speak }
```
```output
Rex says Woof
Tom says Meow
```
:::

Notice Go's tab. Go deliberately has no inheritance: a type satisfies an interface simply by having the right methods. It is a good reminder that polymorphism is the idea, and inheritance is just one way to get it.

### Prefer composition to inheritance

Deep inheritance trees become rigid: changing the base class risks breaking every child. A common rule is **"has a" over "is a"**. Instead of `class Car extends Engine`, give a `Car` an `Engine`. Build behaviour out of small parts you can swap.

### SOLID principles

Five guidelines for classes that stay easy to change.

| Letter | Principle | In plain words |
|---|---|---|
| **S** | Single responsibility | A class should have one reason to change |
| **O** | Open/closed | Add behaviour by adding code, not by editing working code |
| **L** | Liskov substitution | A child must be usable anywhere its parent is expected |
| **I** | Interface segregation | Several small interfaces are better than one giant one |
| **D** | Dependency inversion | Depend on abstractions (an interface), not on concrete details |

The last one makes testing possible: a `OrderService` that receives a `PaymentGateway` interface can be given a fake gateway in tests, with no real money.

::: pitfall Over-engineering
Beginners who learn design patterns want to use all of them. Start with the simplest thing that works. Introduce a class hierarchy, an interface or a pattern when you feel real pain: duplicated code, or a change that touches ten files. Three similar lines of code are often better than a premature abstraction.
:::

::: challenge memoize Memoise a function
**Memoisation** caches the results of a function so that repeated calls with the same arguments return instantly. Write `memoize(fn)`, returning a new function that calls `fn` only the first time it sees a given set of arguments, and remembers the result. Use `JSON.stringify(args)` as the cache key.

Hint: Create a `Map` outside the returned function. Inside, build `const key = JSON.stringify(args)`.
Hint: Use `cache.has(key)` rather than checking the value, so that results like `0` or `undefined` are cached too.
```js starter
function memoize(fn) {
  // your code here
}
```
```js tests
test('returns the same results', () => { const f = memoize((a, b) => a + b); assert.equal(f(2, 3), 5); assert.equal(f(2, 3), 5); });
test('calls the function once per argument set', () => { let calls = 0; const f = memoize((n) => { calls++; return n * 2; }); f(4); f(4); f(4); assert.equal(calls, 1); });
test('different arguments are different entries', () => { let calls = 0; const f = memoize((n) => { calls++; return n; }); f(1); f(2); assert.equal(calls, 2); });
test('caches falsy results', () => { let calls = 0; const f = memoize(() => { calls++; return 0; }); f(); f(); assert.equal(calls, 1); });
test('speeds up recursion', () => { const fib = memoize((n) => (n < 2 ? n : fib(n - 1) + fib(n - 2))); assert.equal(fib(40), 102334155); });
```
```js solution
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```
:::

::: quiz check Checkpoint: object-oriented design
?  What is polymorphism?
- Hiding data inside a class
- *Treating different kinds of object uniformly, each responding in its own way
- Copying a class
- Running code in parallel
> A loop can call `speak()` on any animal, and the right version runs.

?  Which is the better design guideline?
- Always use deep inheritance trees
- *Prefer composition ("has a") over inheritance ("is a") when behaviour should be swappable
- Put everything in one class
- Avoid interfaces
> Composition is more flexible than rigid inheritance hierarchies.

?tf Go supports polymorphism even though it has no class inheritance. | true
> Go uses interfaces. Any type with the right methods satisfies the interface.
:::

## Concurrency

Computers do many things at once: serve thousands of users, download files while you type, run animations while waiting for a database. **Concurrency** means structuring a program to handle many tasks that overlap in time. **Parallelism** means actually running them at the same instant on several CPU cores. You can have concurrency without parallelism (one cook switching between pots) and parallelism needs concurrency to be useful (many cooks).

| Model | How it works | Where you meet it |
|---|---|---|
| **Event loop and async/await** | One thread, switching whenever a task waits for I/O | JavaScript, Python `asyncio`, C#, Rust |
| **Threads** | Several lines of execution sharing memory | Java, C#, Python (with limits), Ruby |
| **Lightweight tasks** | Cheap, runtime-managed tasks | Go goroutines, Kotlin coroutines |
| **Processes** | Separate programs with separate memory | Everywhere. Safest isolation |
| **Queues and workers** | Jobs placed in a queue for background workers | Email sending, video encoding, reports |

Here is the same job in each: square the numbers 1 to 4 in separate workers, then add the results. The answer is 1 + 4 + 9 + 16 = 30.

::: code Do four jobs concurrently, then combine the results
```javascript
const square = (n) => new Promise((resolve) => setTimeout(() => resolve(n * n), 10));

Promise.all([1, 2, 3, 4].map(square)).then((results) => {
  console.log(results.reduce((a, b) => a + b, 0));
});
```
```python
from concurrent.futures import ThreadPoolExecutor


def square(n):
    return n * n


with ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(square, [1, 2, 3, 4]))
print(sum(results))
```
```java
import java.util.*;
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(4);
        List<Future<Integer>> futures = new ArrayList<>();
        for (int n = 1; n <= 4; n++) {
            final int x = n;
            futures.add(pool.submit(() -> x * x));
        }
        int total = 0;
        for (Future<Integer> f : futures) total += f.get();
        pool.shutdown();
        System.out.println(total);
    }
}
```
```csharp
using System.Linq;
using System.Threading.Tasks;

var tasks = Enumerable.Range(1, 4).Select(n => Task.Run(() => n * n));
int[] results = await Task.WhenAll(tasks);
Console.WriteLine(results.Sum());
```
```go
package main

import (
	"fmt"
	"sync"
)

func main() {
	results := make([]int, 4)
	var wg sync.WaitGroup
	for i := 0; i < 4; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			n := i + 1
			results[i] = n * n
		}(i)
	}
	wg.Wait()
	total := 0
	for _, r := range results {
		total += r
	}
	fmt.Println(total)
}
```
```ruby
threads = [1, 2, 3, 4].map { |n| Thread.new { n * n } }
puts threads.map(&:value).sum
```
```output
30
```
:::

PHP is absent from the tabs on purpose: classic PHP runs each request in its own short-lived process, so web code rarely needs threads. PHP uses queues, background workers, or event-loop libraries when it does.

### The dangers of shared memory

When several threads change the **same data**, the order of their steps can corrupt it. Take a counter incremented by two threads. Each increment is really three steps: read, add one, write.

::: figure sequence A race condition: two threads lose an update
Thread A | Counter | Thread B
Thread A -> Counter: read: 5
Thread B -> Counter: read: 5
Thread A -> Counter: write: 6
Thread B -> Counter: write: 6
:::

Two increments happened but the counter shows 6, not 7. That is a **race condition**, and it is one of the hardest bugs to find, because it appears only occasionally.

| Problem | What happens | Remedy |
|---|---|---|
| **Race condition** | Result depends on unlucky timing | Locks (mutexes), atomic operations, or avoid shared mutable data |
| **Deadlock** | Two tasks each wait for a lock the other holds, and both wait forever | Always take locks in the same order, hold them briefly, use timeouts |
| **Starvation** | A task never gets its turn | Fair scheduling and queues |

::: best The safest concurrency is no shared mutable state
Prefer to **pass messages** or **return results** rather than modify shared variables (Go's proverb: "Do not communicate by sharing memory. Share memory by communicating"). Make data immutable where possible. When you must share, protect it with a lock, and keep the locked section tiny. JavaScript's single-threaded model avoids most races: code between two `await`s cannot be interrupted.
:::

::: quiz check Checkpoint: concurrency
?  What is a race condition?
- Two programs competing for the fastest speed
- *A bug in which the result depends on the timing of operations on shared data
- A very fast loop
- A deadlock
> Interleaved steps can overwrite each other's changes, in ways that show up only occasionally.

?  Which describes concurrency, as distinct from parallelism?
- Several cores running at exactly the same time
- *Structuring a program so that many tasks overlap in time, even on one core
- Using a single task
- A synonym for threads
> Concurrency is about structure. Parallelism is about simultaneous execution.

?  What is the best first strategy for avoiding concurrency bugs?
- Add more locks everywhere
- *Avoid shared mutable state by passing messages or returning results
- Use bigger threads
- Remove all tests
> If tasks do not share changing data, there is nothing to race over.
:::

## Testing

You already test: you run the program and see whether it works. **Automated tests** do that checking for you in milliseconds, every time you change the code, and forever. They are what lets a team change old code without fear.

::: figure layers The testing pyramid: many small tests, few large ones
*End-to-end tests | A real browser clicks through the whole app. Slow, few
Integration tests | Several parts together, for example the API and a test database. Moderate
Unit tests | One function or class alone. Very fast, very many
:::

### Anatomy of a unit test

Every test follows **Arrange, Act, Assert**: set up the situation, do the thing, and check the result. Here is the same trivial test in each language's most common framework.

::: code A unit test in each ecosystem
```javascript
// Vitest or Jest
import { add } from "./math.js";

test("adds two numbers", () => {
  expect(add(2, 3)).toBe(5);
});

test("handles negatives", () => {
  expect(add(-1, 1)).toBe(0);
});
```
```python
# pytest
from mathlib import add


def test_adds_two_numbers():
    assert add(2, 3) == 5


def test_handles_negatives():
    assert add(-1, 1) == 0
```
```java nocheck
// JUnit 5
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class MathTest {
    @Test
    void addsTwoNumbers() {
        assertEquals(5, Math2.add(2, 3));
    }
}
```
```csharp nocheck
// xUnit
public class MathTests
{
    [Fact]
    public void AddsTwoNumbers()
    {
        Assert.Equal(5, Calculator.Add(2, 3));
    }
}
```
```php nocheck
<?php
// PHPUnit
use PHPUnit\Framework\TestCase;

final class MathTest extends TestCase
{
    public function testAddsTwoNumbers(): void
    {
        $this->assertSame(5, add(2, 3));
    }
}
```
```go nocheck
// Go's built-in testing package. File name ends in _test.go
package mathlib

import "testing"

func TestAdd(t *testing.T) {
	if got := Add(2, 3); got != 5 {
		t.Errorf("Add(2, 3) = %d, want 5", got)
	}
}
```
```ruby nocheck
# Minitest
require "minitest/autorun"

class MathTest < Minitest::Test
  def test_adds_two_numbers
    assert_equal 5, add(2, 3)
  end
end
```
:::

### What makes a good test?

- **Fast and independent.** Tests must not depend on each other or on their order.
- **One idea per test**, with a name that reads like a sentence: `rejects_negative_deposit`.
- **Test behaviour, not implementation.** If a harmless refactor breaks a test, the test was too tied to the details.
- **Cover the edges.** Empty input, one item, the maximum, negative numbers, the wrong type.
- **Use fakes (mocks) for slow or risky dependencies**, such as the network, the clock and payment providers.

::: plain
A test suite is a smoke alarm for your code. You do not install one because you expect a fire today. You install it so that when something does go wrong, you find out in seconds, not after the whole house is gone.
:::

### Test-driven development

**TDD** reverses the order: write a **failing** test first, then the smallest code to make it pass, then clean up.

::: figure flow Red, green, refactor
Red | write a test that fails -> *Green | write the least code to pass -> Refactor | clean up, with the tests as a safety net -> Repeat | for the next behaviour
:::

You have been doing TDD all course long: every coding challenge gave you tests first. Designing code that is easy to test tends to produce **better design** anyway: small functions with clear inputs and outputs, and dependencies passed in, not hidden inside.

## Algorithms and complexity

Two programs can give the same answer and differ enormously in speed once the data grows. **Big-O notation** describes how the work grows as the input size *n* grows, ignoring constants.

| Big-O | Name | Example | 1,000 items | 1,000,000 items |
|---|---|---|---|---|
| O(1) | Constant | Look up in a map or array by index | 1 step | 1 step |
| O(log n) | Logarithmic | Binary search in a sorted array | about 10 steps | about 20 steps |
| O(n) | Linear | Scan a list once | 1,000 | 1,000,000 |
| O(n log n) | Linearithmic | Good sorting algorithms | about 10,000 | about 20,000,000 |
| O(n²) | Quadratic | Compare every pair (nested loops) | 1,000,000 | one trillion |

The jump from O(n) to O(n²) is why a page that works with 100 test rows freezes with 100,000 real ones. A very common beginner fix is to replace a nested loop with a **map or set lookup**, which turns O(n²) into O(n).

**Binary search** is the classic O(log n) idea: in a sorted list, look at the middle element. If it is too big, discard the upper half. If too small, discard the lower half. Repeat. A million items need only about twenty looks.

::: challenge bsearch Binary search
Write `binarySearch(sorted, target)`. `sorted` is an array of numbers in ascending order. Return the **index** of `target`, or **-1** if it is not there. Use the halving method (not `indexOf`, which is O(n)).

Hint: Keep `low = 0` and `high = sorted.length - 1`. While `low <= high`, take `mid = Math.floor((low + high) / 2)`.
Hint: If `sorted[mid]` is the target, return `mid`. If it is smaller, set `low = mid + 1`. Otherwise set `high = mid - 1`.
```js starter
function binarySearch(sorted, target) {
  // your code here
}
```
```js tests
const a = [1, 3, 5, 7, 9, 11, 13];
test('finds a middle item', () => assert.equal(binarySearch(a, 7), 3));
test('finds the first', () => assert.equal(binarySearch(a, 1), 0));
test('finds the last', () => assert.equal(binarySearch(a, 13), 6));
test('missing item', () => assert.equal(binarySearch(a, 6), -1));
test('empty array', () => assert.equal(binarySearch([], 5), -1));
test('single item found', () => assert.equal(binarySearch([4], 4), 0));
test('large array is fast', () => {
  const big = Array.from({ length: 1000000 }, (_, i) => i * 2);
  let steps = 0;
  const probe = new Proxy(big, { get(t, k) { if (typeof k === 'string' && /^\d+$/.test(k)) steps++; return t[k]; } });
  assert.equal(binarySearch(probe, 999998), 499999);
  assert(steps < 60, 'too many steps: ' + steps);
});
```
```js solution
function binarySearch(sorted, target) {
  let low = 0, high = sorted.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
```
:::

::: challenge lru Build an LRU cache
A **least-recently-used (LRU) cache** keeps at most `capacity` entries. When it is full and a new key arrives, it throws out the entry that was used **longest ago**. Write a class `LRUCache` with a constructor taking the capacity, a `get(key)` method that returns the value or `undefined` (and counts as a "use"), and a `put(key, value)` method that stores a value (and counts as a "use"). Updating an existing key never causes an eviction.

Hint: A JavaScript `Map` remembers insertion order. To mark a key as most recent, delete it and set it again.
Hint: The oldest key is `map.keys().next().value`.
```js starter
class LRUCache {
  // your code here
}
```
```js tests
test('stores and reads', () => { const c = new LRUCache(2); c.put('a', 1); assert.equal(c.get('a'), 1); });
test('missing key', () => assert.equal(new LRUCache(2).get('zzz'), undefined));
test('evicts the oldest', () => { const c = new LRUCache(2); c.put('a', 1); c.put('b', 2); c.put('c', 3); assert.equal(c.get('a'), undefined); assert.equal(c.get('c'), 3); });
test('get refreshes a key', () => { const c = new LRUCache(2); c.put('a', 1); c.put('b', 2); c.get('a'); c.put('c', 3); assert.equal(c.get('b'), undefined); assert.equal(c.get('a'), 1); });
test('updating does not evict', () => { const c = new LRUCache(2); c.put('a', 1); c.put('b', 2); c.put('a', 9); assert.equal(c.get('a'), 9); assert.equal(c.get('b'), 2); });
test('capacity of one', () => { const c = new LRUCache(1); c.put('a', 1); c.put('b', 2); assert.equal(c.get('a'), undefined); assert.equal(c.get('b'), 2); });
```
```js solution
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return undefined;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) this.map.delete(this.map.keys().next().value);
    this.map.set(key, value);
  }
}
```
:::

## Clean code and refactoring

Code is read far more often than it is written, often by you, six months later. **Clean code** is code that a stranger can understand and safely change.

| Habit | Why |
|---|---|
| **Name things for what they mean.** `daysUntilExpiry`, not `d` or `data2` | The name is the cheapest documentation |
| **Small functions that do one thing** | Easy to name, test and reuse |
| **No magic numbers.** `const MAX_ATTEMPTS = 5` | The reader learns what the 5 means |
| **Avoid deep nesting.** Return early on bad cases | Flat code is easier to follow |
| **Do not repeat yourself (DRY)**, but do not over-abstract either | Duplication spreads bugs |
| **Keep it simple (KISS) and build only what you need (YAGNI)** | Unused flexibility is a cost |
| **Comment the *why*, not the *what*** | The code shows what. Only you know why |
| **Consistent formatting, enforced by a tool** (Prettier, Black, gofmt) | Ends style arguments |

**[[Refactoring]]** is improving the structure of code without changing what it does. The safety net is your tests: refactor in small steps and run them after each step. Signs that code needs it ("code smells"): a function longer than a screen, copy-pasted blocks, a function with six parameters, a class that knows about everything, comments explaining confusing code that should be rewritten instead.

Compare the same logic before and after:

```js
// Before: nested, unclear
function f(u) {
  if (u) {
    if (u.age >= 18) {
      if (u.verified) {
        return true;
      }
    }
  }
  return false;
}

// After: early return, clear names
function canBuyAlcohol(user) {
  if (!user) return false;
  if (user.age < 18) return false;
  return user.verified;
}
```

### Code review

A second pair of eyes catches bugs and spreads knowledge. As an **author**: keep changes small, explain the why, and review your own diff first. As a **reviewer**: be kind and specific, ask questions rather than issuing orders, and separate "must fix" from "nice to have". Review the code, never the person.

## Packaging and dependencies

Your code will use other people's code (**dependencies**), and others will use yours. Every ecosystem has a **package manager** and a **manifest file** that lists the dependencies and their versions.

| Language | Package manager | Manifest and lock file | Registry |
|---|---|---|---|
| JavaScript / TypeScript | npm, pnpm, yarn | `package.json`, `package-lock.json` | npm |
| Python | pip, uv, poetry | `pyproject.toml`, `requirements.txt` | PyPI |
| Java | Maven, Gradle | `pom.xml`, `build.gradle` | Maven Central |
| C# | NuGet (via `dotnet`) | `.csproj` | NuGet |
| PHP | Composer | `composer.json`, `composer.lock` | Packagist |
| Go | Go modules | `go.mod`, `go.sum` | Any Git host |
| Ruby | Bundler | `Gemfile`, `Gemfile.lock` | RubyGems |

Good habits, whatever the language:

- **Commit the lock file**, so that every machine installs exactly the same versions.
- **Pin and update deliberately.** Semantic versioning (`MAJOR.MINOR.PATCH`) says that a major bump may break your code, a minor adds features, and a patch fixes bugs.
- **Isolate environments** (Python virtual environments, `node_modules` per project) so that projects never fight over versions.
- **Audit dependencies** (`npm audit`, `pip-audit`, Dependabot), and prefer fewer, well-maintained ones. Every dependency is code you trust but did not write.
- **Publish carefully.** Add a licence, a README with an example, a version number and a changelog.

::: pitfall Common engineering mistakes
- **Premature optimisation.** Make it correct and clear, then measure, and optimise only the real bottleneck.
- **No tests around the scary code**, which then nobody dares to touch.
- **Testing only the happy path.**
- **Sharing mutable state between threads** without protection.
- **Deep inheritance trees** where composition would do.
- **Giant functions and classes** that do everything.
- **Copy-pasting code** instead of extracting a function.
- **Unpinned dependencies**, so that "it worked yesterday" builds break.
- **Not reading error messages** and stack traces from the top.
:::

::: lab Lab: refactor and test a messy module
You are given a messy function and asked to make it safe to change. Write it yourself, or take any old project of yours.
1. Write a 40-line function `processOrders(orders)` in your language that mixes validation, price calculation (with a discount rule and tax), and formatting a receipt, using nested `if`s, magic numbers and one-letter names.
2. Before changing anything, write **characterisation tests** that capture its current behaviour, including at least six edge cases (empty list, negative quantity, discount threshold, rounding).
3. Refactor in small steps, running the tests after each: rename variables, extract `validateOrder`, `calculateTotal` and `formatReceipt`, replace the magic numbers with named constants, and flatten the nesting with early returns.
4. Introduce a `Discount` interface (or function type) with two implementations and select one by customer type. Explain which SOLID principle you applied.
5. Replace a real dependency (the clock, or a payment call) with an injected fake, and write a test that uses it.
6. Measure: generate 100,000 orders and time the function. If something is O(n²), find it and fix it with a map or set.
7. Run your language's formatter and linter, and fix everything they report.
8. Write a short README with how to install, run the tests and use the code. Add the dependency list in the right manifest.
9. Stretch goal: wrap the work in a pull request description that explains what changed and why, and ask a classmate to review it.
:::

::: recap
- Classes bundle data with behaviour. Encapsulation hides the details, and polymorphism lets code treat different objects uniformly.
- Prefer composition to deep inheritance. SOLID gives five guidelines for changeable classes.
- Concurrency structures overlapping tasks, and parallelism runs them simultaneously. Shared mutable state causes race conditions and deadlocks, so avoid sharing where you can.
- Automated tests (arrange, act, assert) are a safety net. The pyramid favours many fast unit tests, and TDD is red, green, refactor.
- Big-O describes how work grows with input size. Maps and sets, and binary search, are everyday speed-ups.
- Clean code has clear names, small functions and flat structure. Refactor under test.
- Every ecosystem has a package manager and a lock file. Commit the lock file, audit dependencies, and keep them few.
:::

::: quiz test Module test: Software engineering practice
?  Which principle says that a class should have only one reason to change?
- Open/closed
- *Single responsibility
- Liskov substitution
- Dependency inversion
> The "S" in SOLID: do one job, so that changes in one area do not break another.

?  In what order does test-driven development proceed?
- Write code, write tests, refactor
- *Write a failing test, make it pass with minimal code, refactor
- Refactor, test, release
- Test everything at the end
> Red, green, refactor.

?  What is the time complexity of finding a value in a sorted array of one million items with binary search?
- O(n)
- O(n squared)
- *O(log n)
- O(1)
> Each step halves the remaining items: about twenty steps for a million.

?  Which change usually turns an O(n squared) "find duplicates" nested loop into O(n)?
- Using a bigger computer
- *Using a set or map to remember what has been seen
- Adding more nested loops
- Sorting twice
> Set lookups are about constant time, so one pass is enough.

?  Two threads each wait for a lock held by the other, so neither can continue. What is this called?
- A race condition
- *A deadlock
- A memory leak
- A cache miss
> Deadlock is a circular wait. Take locks in a consistent order to prevent it.

?  What is the main purpose of a lock file such as `package-lock.json`?
- To keep the project secret
- *To record the exact dependency versions so that installs are reproducible
- To speed up the code
- To store passwords
> Everyone, including the build server, installs the same versions.

?  What is a good reason to inject a dependency (such as a payment gateway) into a class instead of creating it inside?
- It makes the class shorter
- *You can substitute a fake in tests
- It is required by all languages
- It makes the code run in parallel
> Passing dependencies in makes the class testable and flexible.

?tf Refactoring means changing code so that it does something new. | false
> Refactoring changes the structure without changing behaviour. Tests prove that behaviour stayed the same.

?tf Comments should mostly explain WHY code does something rather than restate WHAT it does. | true
> Good names show what. Comments earn their place by explaining intent and surprises.

?short What is the three-letter abbreviation for writing a failing test before the code that satisfies it? | TDD
> Test-driven development: red, green, refactor.

?multi Which of these are sensible clean-code habits? Select all that apply.
- *Give variables meaningful names
- *Replace magic numbers with named constants
- *Return early to avoid deep nesting
- Write one very long function to keep everything together
> Short, well-named, flat functions are the heart of readable code.

?order Put these Big-O classes in order from FASTEST to SLOWEST growth.
1. O(1)
2. O(log n)
3. O(n)
4. O(n squared)
> Constant is best, then logarithmic, then linear. Quadratic grows fastest of these.
:::
