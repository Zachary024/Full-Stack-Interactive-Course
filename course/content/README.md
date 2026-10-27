# Authoring guide

Each lesson is `content/<id>.md`. `python3 build-content.py` compiles everything and **exits with an error** on any
mistake (unknown glossary term, missing explanation, broken fence...). Run it after every change.

## Front matter
```
---
id: js-fund
title: JavaScript: Making Pages Interactive
number: 8
track: Foundations
duration: 90 min
level: Beginner
summary: One sentence for the overview card.
---
```

## Directives
A directive is `::: name arguments` ... `:::`. Nesting is not supported.

| Directive | Use |
|---|---|
| `objectives`, `prereq`, `recap` | bullet lists at the start and end of a lesson |
| `tip`, `pitfall`, `note`, `best` | coloured call-outs |
| `plain` | "In plain words": an everyday-language restatement of a hard idea |
| `learn` | study guidance (how to practise this topic) |
| `try` | a small hands-on task |
| `code Title` | one fence per language (`js`, `py`, `java`, `cs`, `php`, `go`, `ruby`), optional last fence ` ```output `. A `run` flag makes `check-snippets.py` execute it; `nocheck` skips it |
| `figure kind Caption` | `flow`, `sequence`, `layers`, `tree`, `anatomy`, `blocks`, `boxmodel` or raw `svg` |
| `stepper Title` | numbered list `1. **Bold title.** text` |
| `playground html|js Title` | editable and runnable; one fence per part (html, css, js) |
| `challenge name Title` | auto-checked JS task. Fences ` ```js starter`, ` ```js tests`, ` ```js solution`; `Hint: ...` lines. The id becomes `<module>.<name>` |
| `sqlplay Title` | SQL sandbox: ` ```sql schema` and ` ```sql starter` |
| `sqlchallenge name Title` | fences `schema`, `starter`, `solution` and `Hint:` lines |
| `quiz check|test Title` | see below |
| `demo name`, `lab Title`, `cards` | interactive demos, multi-step labs, card grids (`- **Title** | text`) |

### Figures
* `flow`: `A | sub -> *B | sub` (`*` highlights a box)
* `sequence`: header `A | B | C`, then `A -> B: message`
* `layers`: `*Name | text` lines
* `tree`: indented list, 2 spaces per level
* `anatomy`: `text | label ; text | label`
* `blocks`: `Title | text ; Title | text` (text wraps automatically; every part needs a `|`, avoid `;` inside the text)

### Quizzes
```
::: quiz test Module test: Title
? Which keyword declares a constant?
- var
- *const
- let
> const cannot be reassigned. Explanation is required for every question.

?tf The browser runs server code. | false
> explanation
?short What does HTML stand for? | hypertext markup language
> explanation
?multi ...      (several "*" options)
?order ...      (numbered list in the correct order)
:::
```
A `test` has the module id and decides completion (pass mark 70%); `check` quizzes give instant feedback and are
numbered `<module>-c1`, `-c2`...

## Projects
`content/projects/<module id>.md` is appended to that module under "Module project". The file starts directly with
`::: project <id> <Title>`. The body has `Time:`, `Skills:`, `Level:`, a short brief, then `Requirements:` (at least 4),
`Steps:` (at least 3, numbered), `Stretch:`, `Hints:`, `Deliver:`, `Rubric:` (`criterion | what good looks like`) and
`Starter:` (code fences, one per language; a language may appear once). Use backticks for code; raw HTML is not interpreted.

## Reference pages
Add `kind: reference` to the front matter (use a number of 100 or more) and the page appears under "Reference library"
instead of the numbered course, and does not count towards progress. Tables use `::: cheat Title`:
```
::: cheat Navigation
cols: Task ;; macOS and Linux ;; Windows PowerShell
code: 2,3
Show the current folder ;; pwd ;; Get-Location
:::
```
`code: 1,3` makes those columns code with a copy button; `kbd: 2,3` draws keys (`Ctrl+Shift+P`, alternatives with
` or `, chords with ` then `, key names `Plus`, `Minus`, `Backtick`, `Period`, `Comma`, `Slash`, `Backslash`,
`BracketLeft`, `BracketRight`). Rows are separated by ` ;; `, so never put that inside a cell. Put `<` only in code columns.
Reference snippets are fragments and are not run by `check-snippets.py`.

## Glossary
`content/glossary*.md` (several files, one namespace; duplicates fail the build): `Term | alias :: definition`,
under a `# Category` heading per group. In prose write `[[term]]` or `[[term|shown text]]` (never inside code).
The first plain mention of a few terms per lesson is linked automatically.

## Tips for writing for beginners
Define a term the first time it appears. Show the smallest example that works, then a realistic one. Say what the
output will be. Explain every wrong answer in a quiz. Avoid emoji and jargon. Keep sentences short.
