---
id: start
number: 1
title: Start Here: How to Learn to Code
track: Getting started
duration: 40 min
level: Beginner
summary: How this course works, how to study so that things stick, how to read errors, and how to get unstuck. Ten minutes here will save you weeks later.
---

::: objectives
- Explain how each lesson in this course is organised and what to do at every stage.
- Use four proven study techniques: active recall, spaced repetition, typing code yourself and deliberate practice.
- Read an error message and find the useful line in it.
- Follow a repeatable method when you are stuck, and know when and how to ask for help.
- Pick a realistic weekly study plan.
:::

::: prereq
Nothing. You do not need to know anything about programming. You need a computer or phone with a modern browser, and curiosity.
:::

## What full stack development is

A **full stack developer** can build every layer of a web application: the part people see, the part that runs on a server, and the database that remembers things. "Stack" means a pile of layers that sit on top of each other.

::: figure layers The three layers of a typical web application. Each layer has its own job.
*Front end (the client) | What the user sees and clicks: pages, buttons, forms. Runs in the browser.
Back end (the server) | The rules and logic: who may log in, how to calculate a price. Runs on a computer you control.
Database | Long-term memory: users, orders, messages. Stays saved when the server restarts.
:::

You will learn all three layers, plus the tools that connect them. You do not need to master everything on day one. Nobody does. You build skills one small layer at a time.

::: plain
Think of a restaurant. The **front end** is the dining room and menu. The **back end** is the kitchen, where the actual work happens. The **database** is the pantry and the order book. Customers never walk into the kitchen, and the kitchen never serves tables. They talk through waiters, which in our world are [[API|APIs]].
:::

## How this course works

Every module follows the same shape, so you always know what to do next.

::: stepper How a lesson flows
1. **Read the objectives.** They tell you what you will be able to do at the end. Skim the "Before you start" box to check you have the background.
2. **Read in small pieces.** Each section explains one idea in plain words first, then shows it in code. Underlined terms open a short definition when you tap or hover over them.
3. **Run the code.** Use the live editors and the language tabs. Change a value, predict what will happen, then run it. Curiosity is a skill.
4. **Answer the checkpoints.** After a big idea you get a short quiz with instant feedback and an explanation for every answer. These do not count toward completion. They are practice.
5. **Solve the coding challenges.** Write the code yourself. Tests tell you exactly what passes and what does not. Hints are there when you need them.
6. **Take the module test.** Eight questions. Score 70% or more and the module is marked complete. Missed something? The explanations tell you what to review, and you can retake it.
:::

### Choosing your programming language

Many ideas in programming are the same in every language: variables, decisions, loops, functions, data structures. This course teaches those ideas using **seven languages side by side**: JavaScript, Python, Java, C#, PHP, Go and Ruby. Wherever code is shown in several languages, you will see tabs. Pick one in the sidebar (**Code examples in**) and every code sample switches to it for the whole course.

Not sure which to choose? The **Languages** module has a short questionnaire. It recommends a language from your goals, and it will refine its advice as your quiz scores come in. You can switch at any time, and you can read the other tabs to see how they differ. Comparing languages is one of the fastest ways to understand programming itself.

::: note Web pages need JavaScript
Whatever language you pick, browsers only run JavaScript for the interactive part of a page. So the front-end modules (HTML, CSS, JavaScript, React, Vue) use JavaScript for everyone. The back-end modules let you choose your language.
:::

## Study methods that actually work

Most beginners watch or read a lot, feel like they understand, and then freeze in front of an empty editor. Understanding something while you read it is easy. Being able to produce it yourself is what you want. These four habits close that gap.

### 1. Active recall: test yourself instead of re-reading

Re-reading feels productive but teaches little. Pulling an answer out of your memory is hard, and that effort is what builds memory. That is why this course is full of quizzes and challenges. Treat a wrong answer as a gift: it shows exactly what to fix.

::: learn Cover and recall
At the end of each section, close the page or look away and say out loud what you just learned. Then check. If you cannot explain it to an imaginary friend, you do not know it yet. That is fine, and it is useful information.
:::

### 2. Spaced repetition: come back at growing intervals

Memories fade quickly at first and then slowly. If you review something just as you are about to forget it, the memory lasts much longer. A simple schedule: review after one day, then three days, then a week, then a month. Retaking a module test after a few days is a perfect review.

::: figure svg How memory fades, and how reviews flatten the curve
<svg class="fg" viewBox="0 0 640 260" role="img" aria-label="Memory strength falls steeply after learning, but each review makes the curve flatter" style="max-width:640px;min-width:460px" xmlns="http://www.w3.org/2000/svg">
<line x1="50" y1="210" x2="620" y2="210" class="fg-line"/><line x1="50" y1="20" x2="50" y2="210" class="fg-line"/>
<text x="335" y="244" text-anchor="middle" class="fg-sub">Time since you first learned it</text>
<text x="18" y="115" text-anchor="middle" class="fg-sub" transform="rotate(-90 18 115)">What you remember</text>
<path d="M50 30 C 90 120, 130 170, 200 190" class="fg-line fg-dash" fill="none"/>
<path d="M50 30 C 80 90, 110 120, 140 128 L 140 60 C 170 100, 210 128, 270 138 L 270 55 C 320 90, 380 118, 470 128 L 470 50 C 520 78, 570 100, 615 108" class="fg-line" fill="none" stroke="var(--accent)" style="stroke:var(--accent);stroke-width:2.4"/>
<circle cx="140" cy="94" r="5" class="fg-c1 fg-bar"/><circle cx="270" cy="96" r="5" class="fg-c1 fg-bar"/><circle cx="470" cy="89" r="5" class="fg-c1 fg-bar"/>
<text x="140" y="148" text-anchor="middle" class="fg-sub">Review 1</text><text x="270" y="158" text-anchor="middle" class="fg-sub">Review 2</text><text x="470" y="148" text-anchor="middle" class="fg-sub">Review 3</text>
<text x="205" y="206" class="fg-sub">Without review (dashed)</text>
</svg>
:::

### 3. Type the code yourself

Copy and paste teaches your clipboard, not your brain. When you type code, your hands and eyes slow down enough to notice the details: the brackets, the colons, the capital letters. You will make mistakes. Fixing them is where the learning is. The live editors in this course are there for exactly this.

### 4. Deliberate practice: work just beyond your comfort zone

If an exercise feels easy, move on. If it feels impossible, break it into smaller steps or take a hint. The sweet spot is the feeling of "I almost have it." Aim to spend most of your time there.

::: learn The 20-minute rule
When you are stuck, struggle on your own for about 20 minutes before looking at hints or asking for help. Less than that and you rob yourself of the learning. Much more and you waste time. Write down what you tried: it is also the best thing to include when you ask for help.
:::

## Reading error messages without panic

Errors are not a sign that you are bad at programming. Professional developers see errors every hour. An error message is the computer telling you exactly where it got confused. Your job is to read it calmly.

::: stepper How to read an error message
1. **Do not panic and do not skim past it.** Take a breath. The message is trying to help you.
2. **Find the error type and the message.** It is usually the last line, for example `ReferenceError: total is not defined` or `NameError: name 'total' is not defined`. It says what went wrong in plain words.
3. **Find the file and line number.** Most errors tell you where. Go to that line. The real mistake is often on that line or the one just above it.
4. **Read the line as if you were the computer.** Is a name misspelled? A bracket missing? A quote not closed? The computer does exactly what you wrote, never what you meant.
5. **Change one thing, then run again.** If you change five things at once you will not know which one fixed it, or which one broke something else.
:::

Here is a real example. Try running it, read the error, then fix it by changing `totl` to `total`.

::: playground js Your first error
```js
let total = 10 + 5;
console.log(totl);
```
:::

::: pitfall Mistakes every beginner makes
- **Typos in names.** `userName` and `username` are different names to a computer.
- **Missing closing brackets or quotes.** Every `(`, `{`, `[` and `"` needs a partner.
- **Changing many things at once** when debugging.
- **Skipping the error message** and guessing instead.
- **Comparing yourself to experienced developers.** They have years of practice behind them. Compare yourself with last month's you.
:::

## When you are stuck: a method

1. **Explain the problem out loud**, line by line, to a friend or even a rubber duck. This is called [[Rubber duck debugging|rubber duck debugging]] and it works surprisingly often because explaining forces you to look at what the code really says.
2. **Shrink the problem.** Delete code until the bug disappears. The last thing you deleted is the culprit.
3. **Print things.** Use `console.log` (or `print`) to see the value of a variable at different points. Do not guess what the value is. Look.
4. **Search with the exact error text.** Put the error type and message in a search engine, without your own variable names.
5. **Ask for help the right way.** Say what you were trying to do, what you expected, what happened instead (paste the exact error), and what you have already tried. A good question often answers itself while you write it.

## A realistic study plan

Consistency beats intensity. Thirty minutes every day teaches more than one eight-hour Saturday. Pick a plan you can keep up for months, not days.

| Plan | Time per week | What it looks like | Approximate pace |
|---|---|---|---|
| Light | 3 to 4 hours | 30 to 45 minutes on most days | One module every 1 to 2 weeks |
| Steady | 6 to 8 hours | 1 hour a day, with a longer weekend session | One module per week |
| Intensive | 15 or more hours | Full-time study with project work | Complete the course in about 2 months |

::: best A good session
Warm up with a 5-minute review of yesterday (retake a checkpoint). Learn something new for 25 minutes. Take a 5-minute break away from the screen. Spend 25 minutes on exercises. Finish by writing down in your notes (use the notes button at the top) what you learned and one question you still have. That is the [[Pomodoro technique]] combined with active recall.
:::

### Use the tools in this course

- **Notes**: the notes button at the top keeps a private note for each lesson.
- **Highlights**: select any text in a lesson and choose Highlight.
- **Bookmarks**: save lessons to return to.
- **Search**: press the slash key to search every lesson.
- **Glossary**: any underlined term opens a definition. The full list is in the sidebar.
- **Progress**: scores and solved challenges are saved. Sign in to keep them across devices.

## Try it yourself: your first challenge

Challenges check your code automatically. Here the goal is only to learn how they work. Write a function `greet` that takes a name and returns the text `Hello, ` followed by the name and an exclamation mark.

::: challenge greet Write a greeting function
A **function** is a named, reusable piece of code. It receives inputs (called parameters) and can send back a result with `return`.

Complete the function so that `greet("Ada")` returns `"Hello, Ada!"`.

Hint: Text values can be joined with `+`. For example `"a" + "b"` gives `"ab"`.
Hint: Use `return` followed by the finished text: `return "Hello, " + name + "!";`
```js starter
function greet(name) {
  // write your code here
}
```
```js tests
test('greets Ada', () => assert.equal(greet('Ada'), 'Hello, Ada!'));
test('greets Grace', () => assert.equal(greet('Grace'), 'Hello, Grace!'));
test('works with any name', () => assert.equal(greet('Linus'), 'Hello, Linus!'));
```
```js solution
function greet(name) {
  return 'Hello, ' + name + '!';
}
```
:::

## Check your understanding

::: quiz check Checkpoint: study methods
?  Which of these is an example of **active recall**?
- Re-reading the lesson three times
- *Closing the lesson and writing down everything you remember, then checking
- Highlighting every sentence in a different colour
- Watching a video at double speed
> Active recall means pulling information out of memory. The effort of retrieving it strengthens the memory far more than passive re-reading or highlighting.

?tf Copying and pasting code from a lesson is just as good for learning as typing it yourself. | false
> Typing forces you to notice details like brackets, spelling and punctuation, and lets you make and fix small mistakes. Pasting skips all of that.
:::

::: quiz check Checkpoint: debugging
?order Put these debugging steps in a sensible order.
1. Read the error message and find the line number
2. Read that line as if you were the computer
3. Change one thing
4. Run the program again
> Read what the computer is telling you, look at the exact line, make one small change so you know what helped, and test. Repeat until fixed.

?short What word describes explaining your code line by line to an object like a toy duck to find a mistake? Answer with one word: rubber ___ debugging. | duck
> Rubber duck debugging works because explaining forces you to examine what the code actually does instead of what you assume it does.
:::

::: recap
- A full stack developer works on the front end, the back end and the database.
- Each lesson goes: objectives, read, run, checkpoint, challenge, module test.
- Study with active recall, spaced repetition, typing code yourself and deliberate practice.
- Read error messages from the bottom: type, message, file, line. Change one thing at a time.
- When stuck, shrink the problem, print values, search the exact error and write a good question.
- Consistency beats intensity. Choose a plan you can keep up.
:::

::: quiz test Module test: Start Here
?  What does the **database** layer of a web application do?
- Displays buttons and forms in the browser
- *Stores data so it is still there after the server restarts
- Translates JavaScript into machine code
- Makes the page look attractive
> The database is the application's long-term memory. Looks are the front end's job, and translation is the job of a compiler or interpreter.

?  A learner finishes a lesson and feels they understood it, but cannot solve the exercise. What is the best next step?
- Read the lesson again from the start
- Skip the exercise because they understood the lesson
- *Try the exercise again from memory, using hints only when stuck
- Quit, because the course is too hard
> Feeling that you understand is not the same as being able to do it. Struggling productively with the exercise, with hints as a safety net, is how skills form.

?  Which line of an error message is usually the most informative to read first?
- The first decorative line
- *The error type and message, plus the file and line number
- The last blank line
- None of them. Error messages are random
> Error messages state the type of problem and where it happened. Reading them carefully is the fastest route to the fix.

?  You changed five things at once and the program now works. What is the problem with this approach?
- There is none. Working code is the goal
- *You do not know which change fixed it, so you have not learned the cause
- It uses too much memory
- It always makes the program slower
> Changing one thing at a time tells you which change mattered. That knowledge is what you reuse on the next bug.

?tf Spaced repetition means reviewing material at gradually increasing intervals. | true
> Reviewing just before you would forget makes memories last. Typical intervals: a day, three days, a week, a month.

?short What should you do before asking for help: struggle on your own for roughly how many minutes? Type a number. | 20
> About twenty minutes of honest effort teaches you the most and gives you details to include in a good question. Less is wasteful, much more is frustrating.

?multi Which of these belong in a good question for help? Select all that apply.
- *What you were trying to do
- *The exact error message
- *What you have already tried
- Only the words "it does not work"
> A useful question explains the goal, the exact error and your attempts. "It does not work" gives nobody anything to go on.

?order Order the steps of a lesson in this course.
1. Read the objectives
2. Run and experiment with the code
3. Answer checkpoint questions
4. Take the module test
> Know the goal, try things hands-on, check yourself with low-stakes questions, then prove it with the module test.
:::
