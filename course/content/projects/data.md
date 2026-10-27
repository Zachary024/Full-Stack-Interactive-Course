::: project data-story Analyse a dataset and tell its story
Time: 4-5 hours
Level: Intermediate
Skills: loading data, cleaning, summary statistics, grouping, charts, communicating results

Pick a real dataset and turn it into a short, honest report. Good choices are a public CSV about school results, football matches, city temperatures, film ratings or your own spending. Aim for between 200 and 5,000 rows. You can use Python with pandas, JavaScript, a spreadsheet, or SQL, as long as your steps can be repeated.

Requirements:
- Choose a dataset and write down its source, licence and what one row means.
- Load it from a file and print the number of rows and columns, each column's type and the first five rows.
- Find and report the missing values in every column. Decide, for each one, whether to drop, fill or keep it, and write down why.
- Check for duplicates and for impossible values (such as a negative age) and handle them.
- Calculate the mean, median, minimum, maximum and standard deviation for at least two numeric columns, and explain a case where the mean and the median differ.
- Group the data by at least one category and compare the groups with a table.
- Produce at least two charts of different types (for example a histogram and a bar chart or scatter plot). Every chart needs a title, axis labels with units and a readable scale.
- State three findings in plain English, each backed by a number or chart. State one thing the data cannot tell you.
- The analysis runs from a single script or notebook, from the raw file to the final charts, with no manual editing of the data.

Steps:
1. Choose a question first ("Do students who study more score higher?"), then find data that can answer it.
2. Load the raw file and inspect it. Save an untouched copy of the original.
3. Clean the data in code and log every change, for example "dropped 12 rows with no score".
4. Calculate the summary statistics and look for outliers.
5. Group and compare, then draw the charts.
6. Write the findings. Check each claim against the numbers one more time.

Starter:
```python nocheck
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("data.csv")

print(df.shape)
print(df.dtypes)
print(df.head())

# Missing values per column
print(df.isna().sum())

# TODO: clean (drop duplicates, handle missing and impossible values)
# TODO: describe() the numeric columns
# TODO: groupby a category and compare
# TODO: draw two charts and save them with plt.savefig("chart1.png")
```

Hints:
- `df.describe()` gives the main statistics in one call. Compare `mean` with the 50% row (the median).
- A correlation does not show that one thing causes another. Say "is associated with", not "causes".
- Start every chart with a clear question. If you cannot say what it shows in one sentence, simplify it.
- Cleaning is usually the longest part. That is normal.

Stretch:
- Repeat one analysis in SQL and check that you get the same numbers.
- Calculate a correlation between two columns and draw a scatter plot with a trend line.
- Publish the report as a web page with the charts embedded.

Deliver:
- The script or notebook, the cleaned data and the charts.
- A one-page written report with your question, method, three findings and one limitation.

Rubric:
- Data quality | Missing, duplicate and impossible values are found and every decision about them is explained.
- Analysis | Statistics are correct and chosen for the question, and groups are compared fairly.
- Visuals | Charts are the right type, clearly labelled and easy to read in a few seconds.
- Honesty | Claims match the evidence, limits are stated and correlation is not presented as cause.
:::
