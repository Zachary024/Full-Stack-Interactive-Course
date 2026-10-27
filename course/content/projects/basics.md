::: project grade-book Build a grade book in the language you chose
Time: 2-3 hours
Level: Beginner
Skills: variables, conditions, loops, lists, functions, error handling

A teacher has a list of exam scores and wants a quick report. You will write a small console program that turns the scores into letter grades, calculates simple statistics, and copes with bad data without crashing. It uses every idea from this module, and the same project works in any language.

Requirements:
- Store at least six scores in a list or array.
- Write a function `letterGrade(score)` that returns A for 90 or more, B for 80 or more, C for 70 or more, D for 60 or more, and F otherwise.
- Write separate functions for the average, the highest score and the lowest score. Do not use a built-in average function.
- Print one line per score in the form `92 -> A`.
- Print the average (rounded to one decimal place), the highest, the lowest and how many scores are passing (60 or more).
- Check every score before using it. A score that is not a number, or is outside 0 to 100, must be reported as invalid and left out of the statistics. The program must not crash.
- Use at least three functions, meaningful variable names and a comment that explains each function.
- Test the program with a list that contains an invalid value and with an empty list. State what it prints in each case.

Steps:
1. Start from the starter code and run it to make sure your setup works.
2. Finish `letterGrade` and test it with the edge values 59, 60, 69, 70, 89, 90 and 100.
3. Write the average, highest and lowest functions and print their results for the sample list.
4. Add the validation. Collect the good scores in a new list, and print a message for each rejected value.
5. Handle the empty list: say "No valid scores" instead of dividing by zero.
6. Read through the code and rename anything that is unclear.

Starter:
```javascript
function letterGrade(score) {
  if (score >= 90) return "A";
  // TODO: B, C and D
  return "F";
}

const scores = [92, 78, 85, 61, 47, 88];
for (const s of scores) {
  console.log(s + " -> " + letterGrade(s));
}
// TODO: validation, average, highest, lowest, passing count
```
```python
def letter_grade(score):
    if score >= 90:
        return "A"
    # TODO: B, C and D
    return "F"


scores = [92, 78, 85, 61, 47, 88]
for s in scores:
    print(s, "->", letter_grade(s))
# TODO: validation, average, highest, lowest, passing count
```
```java
public class GradeBook {
    static String letterGrade(int score) {
        if (score >= 90) return "A";
        // TODO: B, C and D
        return "F";
    }

    public static void main(String[] args) {
        int[] scores = {92, 78, 85, 61, 47, 88};
        for (int s : scores) {
            System.out.println(s + " -> " + letterGrade(s));
        }
        // TODO: validation, average, highest, lowest, passing count
    }
}
```
```csharp
using System;

class GradeBook
{
    static string LetterGrade(int score)
    {
        if (score >= 90) return "A";
        // TODO: B, C and D
        return "F";
    }

    static void Main()
    {
        int[] scores = { 92, 78, 85, 61, 47, 88 };
        foreach (int s in scores)
        {
            Console.WriteLine(s + " -> " + LetterGrade(s));
        }
        // TODO: validation, average, highest, lowest, passing count
    }
}
```
```php
<?php
function letterGrade(int $score): string {
    if ($score >= 90) return "A";
    // TODO: B, C and D
    return "F";
}

$scores = [92, 78, 85, 61, 47, 88];
foreach ($scores as $s) {
    echo $s . " -> " . letterGrade($s) . "\n";
}
// TODO: validation, average, highest, lowest, passing count
```
```go
package main

import "fmt"

func letterGrade(score int) string {
	if score >= 90 {
		return "A"
	}
	// TODO: B, C and D
	return "F"
}

func main() {
	scores := []int{92, 78, 85, 61, 47, 88}
	for _, s := range scores {
		fmt.Println(s, "->", letterGrade(s))
	}
	// TODO: validation, average, highest, lowest, passing count
}
```
```ruby
def letter_grade(score)
  return "A" if score >= 90
  # TODO: B, C and D
  "F"
end

scores = [92, 78, 85, 61, 47, 88]
scores.each { |s| puts "#{s} -> #{letter_grade(s)}" }
# TODO: validation, average, highest, lowest, passing count
```

Hints:
- Check the highest grade first and work down, using else if (or elif, elsif) so only one branch runs.
- To keep the valid scores, start with an empty list and add each good value to it inside a loop.
- Dividing by the length of an empty list is the classic crash. Check the length first.
- In languages with typed lists, treat "not a number" as something you check while reading input. In JavaScript, `Number.isFinite(x)` is useful.

Stretch:
- Read the scores from the command line arguments instead of a fixed list.
- Print a bar of stars for each score, one star per ten points.
- Add the median, and the percentage of students in each letter grade.

Deliver:
- The source file, with comments.
- A short text file listing the output for the normal list, the list with invalid data and the empty list.

Rubric:
- Correctness | Every boundary value (59, 60, 69, 70, 89, 90, 100) gets the right letter and the statistics are correct.
- Robustness | Invalid scores and an empty list never crash the program and produce clear messages.
- Structure | The work is split into small functions with one job each, and no code is repeated.
- Readability | Names say what things mean, comments explain why, and the output is easy to read.
:::
