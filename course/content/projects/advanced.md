::: project cart-refactor Test and refactor a shopping cart
Time: 3-4 hours
Level: Intermediate
Skills: unit testing, refactoring, clean code, complexity, Git workflow

You inherit working but messy code that calculates the total of a shopping cart. Nobody dares to touch it because there are no tests. Your job is the one every professional developer meets: write tests that pin down the current behaviour, then clean up the code safely, then add a feature. Work on a branch and commit often.

Requirements:
- Create a Git repository. Work on a branch named `refactor-cart`, with at least six commits whose messages say what changed and why.
- Before you change any logic, write at least ten tests that describe what the existing code does, including empty carts, quantities of zero, unknown coupon codes and rounding.
- Refactor the function into small, well-named functions (for example `subtotal`, `discount`, `shipping` and `tax`) with no change in behaviour. All the tests must stay green after every step.
- Remove magic numbers by naming them as constants, and remove repeated code.
- Use clear names, and keep each function short enough to read without scrolling.
- Do not mutate the input. Show a test that the cart is unchanged after a calculation.
- Add one new feature using test-driven development: write a failing test first, then make it pass. The feature is a "buy 3, get the cheapest free" rule.
- Add input checks that throw a clear error for negative prices or quantities, with tests.
- Write down the time complexity of your final function in Big O notation, and one sentence explaining why.
- Open a pull request (or write the description you would use) with a summary, the risks and how you tested.

Steps:
1. Copy the starter, run it by hand with three carts and write down the results.
2. Turn those results into tests. Add edge cases until you feel safe.
3. Refactor one small thing at a time. Run the tests after each change and commit when they pass.
4. Add the validation, then the new feature with a failing test first.
5. Analyse the complexity, and tidy the final version.
6. Write the pull request description.

Starter:
```javascript
// cart.js: works, but nobody understands it
function t(c, k) {
  var x = 0;
  for (var i = 0; i < c.length; i++) {
    x = x + c[i].price * c[i].qty;
  }
  if (k == "SAVE10") { x = x - x * 0.1; }
  else if (k == "SAVE20") { x = x - x * 0.2; }
  if (x < 50) { x = x + 4.99; }
  x = x + x * 0.075;
  return Math.round(x * 100) / 100;
}

module.exports = { t };
```
```python
# cart.py: works, but nobody understands it
def t(c, k):
    x = 0
    for i in range(len(c)):
        x = x + c[i]["price"] * c[i]["qty"]
    if k == "SAVE10":
        x = x - x * 0.1
    elif k == "SAVE20":
        x = x - x * 0.2
    if x < 50:
        x = x + 4.99
    x = x + x * 0.075
    return round(x, 2)
```

Hints:
- Characterisation tests record what the code does now, even if you think it is odd. Fix bugs later, on purpose, in separate commits.
- When a test fails after a refactor, undo the last change and make a smaller one.
- Floating-point arithmetic can surprise you with money. Compare with a tolerance, or work in whole cents.
- Name a function by what it returns (`subtotal`) and a variable by what it holds (`shippingCost`).

Stretch:
- Convert the money calculation to integer cents and show why it is safer.
- Add a coverage report and aim for 100% of lines.
- Add a lint rule set and a pre-commit hook that runs the tests.

Deliver:
- The repository with its history, or an export of the log.
- The test file and the pull request description.

Rubric:
- Safety net | Tests describe the original behaviour thoroughly, and they pass after every refactoring step.
- Clean code | Names, function size and structure make the code understandable without comments.
- Discipline | Commits are small and well described, and the new feature starts with a failing test.
- Analysis | The Big O claim is correct and explained, and the pull request clearly states risks.
:::
