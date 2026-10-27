# Programming concepts
Abstraction :: Hiding the messy details behind a simple name or interface so you can use something without knowing how it works inside. You drive a car without understanding the engine.
Abstract class :: A class that is meant to be inherited from, not used directly. It defines what subclasses must provide.
Anonymous function | Lambda :: A function with no name, usually written inline and passed to another function, such as x => x * 2.
Arrow function :: A short way to write a function in JavaScript using =>, for example (a, b) => a + b.
Assignment :: Storing a value in a variable, usually with the = sign. In score = 10, the value 10 is assigned to score.
Binary :: A number system with only two digits, 0 and 1. Computers store all data as binary.
Bit | Byte :: A bit is a single 0 or 1. A byte is eight bits, enough to store one letter or a number up to 255.
Block :: A group of statements treated as one unit, usually wrapped in curly braces or marked by indentation, such as the body of an if or a loop.
Bytecode :: A compact, low-level set of instructions produced from your code and run by a virtual machine. Java and Python both use bytecode.
Call stack :: The list of functions that are currently running, with the newest on top. When a function returns, it is removed from the stack.
Casting | Type conversion :: Changing a value from one type to another, for example turning the text "42" into the number 42.
Closure :: A function that remembers the variables from the place where it was created, even after that place has finished running.
Comment :: A note in source code that the computer ignores. Comments explain why the code does something.
Concatenation :: Joining pieces of text end to end, so "Hello, " and "Ada" become "Hello, Ada".
Constructor :: A special method that runs when an object is created and sets up its starting data.
Control flow :: The order in which a program's instructions run, shaped by conditions, loops and function calls.
Coroutine :: A function that can pause in the middle, let other work run, and resume later. Async functions are built on this idea.
Currying :: Turning a function that takes several arguments into a chain of functions that each take one.
Data structure :: A way of organising data so it can be used efficiently, such as an array, a queue or a tree.
Dead code :: Code that can never run, or whose result is never used. It should be deleted.
Deadlock :: A situation where two or more tasks each wait for the other to release something, so none of them can ever continue.
Declarative | Imperative :: Declarative code says what result you want, such as SQL. Imperative code spells out the steps to get there, such as a loop.
Decorator :: A wrapper that adds behaviour to a function or class without changing its code, written with an @ sign in Python and some other languages.
Destructuring :: Unpacking values from an array or object into separate variables in one line, such as const [a, b] = list.
Dictionary | Map | Hash map :: A collection of key-value pairs where you look up a value by its key, such as a phone book that maps names to numbers.
Dynamic typing :: A system where a variable can hold any type and types are checked while the program runs. JavaScript, Python and Ruby work this way.
Enum | Enumeration :: A fixed list of named choices, such as the days of the week or the order statuses pending, shipped and delivered.
Escape character :: A character, usually a backslash, that changes the meaning of the next character. In "She said \"hi\"" the backslash lets the quote stay inside the text.
Event loop :: The mechanism that lets JavaScript do one thing at a time yet handle many tasks by picking up finished work from a queue.
Expression :: A piece of code that produces a value, such as 2 + 3 or price * quantity.
Floating-point number | Float :: A number with a decimal point. Computers store floats in binary, so some, like 0.1, are only approximations.
Functional programming :: A style that builds programs from small, pure functions and avoids changing data.
Generics :: A way to write code that works with many types while keeping type safety, such as a list of strings or a list of numbers.
Getter and setter :: Methods that read or change a property while letting the object control what is allowed.
Higher-order function :: A function that takes another function as an argument or returns one. map and filter are examples.
Hoisting :: JavaScript's behaviour of treating declarations as if they were moved to the top of their scope before the code runs.
Infinite loop :: A loop whose condition never becomes false, so the program never moves on.
Instance :: One actual object created from a class. Dog is the class, and your pet Rex is an instance.
Integer :: A whole number with no decimal part, such as 7 or -3.
Interface :: A list of methods that a class promises to provide, without saying how they work.
Iterator :: An object that hands out the items of a collection one at a time.
Linked list :: A chain of items where each one points to the next. Easy to insert into, slower to search than an array.
Literal :: A value written directly in code, such as 42, "hello" or true.
Magic number :: An unexplained number in code. Give it a named constant so the meaning is clear.
Memoization :: Saving the result of a function call so the same call later returns instantly instead of repeating the work.
Memory leak :: Memory that a program keeps using even though it no longer needs it, so usage grows until the program slows down or crashes.
Mixin :: A bundle of methods that can be added to several classes without a parent-child relationship.
Mutable | Mutation :: Mutable data can be changed after it is created. Changing it is called mutation.
Namespace :: A named container that keeps names from clashing, so two libraries can both have a function called parse.
Object-oriented programming | OOP :: A style that organises code into objects that bundle data with the functions that work on it.
Off-by-one error :: A bug where a loop runs one time too many or too few, often by confusing less-than with less-than-or-equal.
Operator :: A symbol that does something with values, such as +, ==, && or %.
Overloading :: Giving several functions or methods the same name but different parameters. Some languages allow it, others do not.
Overriding :: Replacing a method inherited from a parent class with your own version in the child class.
Pass by reference | Pass by value :: By value gives a function its own copy of the data. By reference gives it a link to the original, so changes affect the original.
Pointer :: A value that holds the memory address of another value. Used directly in C and Go, hidden in most other languages.
Process :: A program that is currently running, with its own memory. A computer runs many processes at once.
Property :: A named piece of data that belongs to an object, such as the name of a user.
Pure function :: A function that always returns the same output for the same input and changes nothing outside itself.
Queue :: A collection where the first item added is the first one removed, like a line at a shop.
Race condition :: A bug where the result depends on which of two tasks happens to finish first.
Reference :: A link to a value stored elsewhere, rather than a copy of it.
Return value :: The result a function hands back to the code that called it.
Set :: A collection of unique values with no duplicates and, usually, no fixed order.
Shadowing :: Declaring a variable with the same name as one in an outer scope, which hides the outer one inside the inner scope.
Short-circuit evaluation :: Stopping early when the answer is already known. In a && b, if a is false, b is never checked.
Side effect :: Anything a function does besides returning a value, such as printing, changing a global variable or writing a file.
Stack | Stack data structure :: A collection where the last item added is the first removed, like a pile of plates.
Stack overflow error :: An error caused by too many nested function calls, usually from recursion that never stops.
Statement :: A single instruction, such as declaring a variable or an if. Statements do things, expressions produce values.
Template literal | String interpolation :: A string that can embed values, such as `Hello, ${name}` in JavaScript or f"Hello, {name}" in Python.
Ternary operator :: A one-line if-else that produces a value, written condition ? a : b in many languages.
Time complexity | Big O :: A way to describe how the running time of an algorithm grows as the input grows. O(n) means time grows in step with the input.
Tree :: A data structure of nodes with a single root and branches, like a family tree or a folder structure.
Truthy and falsy :: In some languages, values that act as true or false inside a condition. In JavaScript 0, an empty string and null are falsy.
Tuple :: A fixed-size, ordered group of values that cannot be changed, such as the coordinates (4, 7).
Undefined :: In JavaScript, the value of a variable that has been declared but not given a value.
Unicode | UTF-8 :: A standard that gives every character in every language a number. UTF-8 is the common way of storing those numbers as bytes.
Sorting algorithm :: A procedure for putting items in order, such as bubble sort or merge sort.
Binary search :: A fast way to find an item in a sorted list by repeatedly checking the middle and discarding half of what is left.
Graph :: A data structure of nodes joined by links, used for maps, networks and social connections.
Lazy evaluation :: Delaying work until its result is actually needed.
Lock | Mutex :: A tool that lets only one task use a shared resource at a time, preventing race conditions.

# Web and front end
Alt text :: A short description of an image placed in the alt attribute, read aloud by screen readers and shown when the image cannot load.
ARIA :: A set of HTML attributes that give extra meaning to assistive technology, for example role and aria-label. Use real HTML elements first and ARIA only when needed.
Attribute :: Extra information inside an HTML tag, written as name="value", such as href in a link.
Box model :: How the browser sizes every element: content, then padding, then border, then margin.
Breakpoint (CSS) :: A screen width at which a layout changes, set with a media query, for example switching from one column to two at 768 pixels.
Bundler :: A tool such as Vite or Webpack that combines many source files into a few optimised files for the browser.
Canvas :: An HTML element you can draw on with JavaScript, used for charts, games and image editing.
Cascade :: The rules the browser uses to decide which CSS wins when several rules apply to the same element.
Client-side rendering :: Building the page in the browser with JavaScript after downloading a mostly empty HTML file.
Core Web Vitals :: Google's measures of how fast, stable and responsive a page feels: loading, layout shift and interaction delay.
Cross-browser compatibility :: Making sure a site works in all the browsers people use, not just your favourite one.
CSS preprocessor | Sass :: A tool that adds variables, nesting and functions to CSS, then compiles to normal CSS. Sass is the best known.
CSS variable | Custom property :: A value you name once and reuse, written --brand-color: blue and used as var(--brand-color).
CSS units :: The measures used in CSS. px is a fixed pixel, rem scales with the root font size, em with the parent font size, % with the parent, vw and vh with the screen.
Debounce :: Waiting until a user stops typing or resizing for a moment before running a function, so it does not run on every keystroke.
Doctype :: The first line of an HTML page, <!doctype html>, that tells the browser to use modern standards.
Event bubbling :: When an event on an inner element, such as a click, travels up through its parents so they can react too.
Event delegation :: Attaching one event listener to a parent instead of one to each child, and checking which child was the target.
Event listener :: A function waiting for something to happen, such as a click or a key press, and run when it does.
Favicon :: The small icon shown in a browser tab next to the page title.
Hydration :: Attaching JavaScript behaviour to HTML that the server already produced, so the page becomes interactive.
IndexedDB :: A database built into the browser for storing large amounts of structured data on the user's device.
JSX :: A syntax used by React that looks like HTML inside JavaScript.
Lazy loading :: Loading images or code only when they are about to be needed, to make the first page load faster.
Local storage | Web storage :: A small key-value store in the browser that keeps text between visits. It holds about 5 MB per site.
Media query :: A CSS rule that applies only when a condition is true, such as the screen being narrower than 600 pixels.
Minification :: Removing spaces, comments and long names from code so the files are smaller and download faster.
Mobile-first :: Designing for small screens first, then adding layout for larger screens.
Pseudo-class :: A keyword added to a selector that targets a special state, such as :hover or :focus.
Progressive web app | PWA :: A website that can be installed, works offline and feels like an app, using a manifest and a service worker.
Polyfill :: Code that adds a modern feature to older browsers that lack it.
Reconciliation :: React's process of comparing the new virtual DOM with the old one to work out the smallest set of real DOM changes.
Selector :: The part of a CSS rule that says which elements to style, such as p, .note or #header.
Server-side rendering | SSR :: Building the full HTML on the server for each request, so users and search engines see content immediately.
Service worker :: A script that runs in the background of a browser, sits between a page and the network, and can serve cached files when offline.
Shadow DOM :: A hidden, separate DOM tree inside an element, used by web components to keep their styles private.
Single-file component :: A Vue file that holds a component's template, script and style together.
Specificity :: How CSS decides between two rules that both match: an id beats a class, and a class beats a tag.
Stacking context :: A group of elements that are layered together with z-index. A child can never rise above something outside its own stacking context.
State management :: Keeping shared data in one organised place so many components can read and update it. Redux, Pinia and Zustand are examples.
Static site generator | SSG :: A tool that builds all pages as plain HTML files ahead of time, so they can be served very quickly.
SVG :: A vector image format written as text. It stays sharp at any size and can be styled with CSS.
Throttle :: Limiting how often a function can run, for example at most once every 200 milliseconds while scrolling.
Transpiler | Babel :: A tool that converts newer code into older code, for example modern JavaScript or TypeScript into JavaScript every browser can run.
TypeScript :: JavaScript with added types that catch many mistakes before the code runs.
Two-way binding :: A link between an input and a variable so that changing either one updates the other.
Viewport :: The visible area of a web page in the browser window.
Viewport meta tag :: A line in the page head that tells phones to use the real screen width, which makes responsive layouts work.
Web component :: A custom, reusable HTML element, created with browser features rather than a framework.
Z-index :: A CSS property that controls which overlapping elements appear in front.
Lifecycle :: The stages a component goes through: created, shown, updated and removed. Frameworks let you run code at each stage.
Router (client-side) :: Code that changes what is shown in a single-page app when the URL changes, without loading a new page.
Responsive images | srcset :: Offering the browser several sizes of an image so it can download the one that fits the screen.
Ref :: In Vue and React, a container that holds a value or points to a DOM element and survives re-renders.
