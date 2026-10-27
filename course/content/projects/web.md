::: project trace-a-request Trace a web request with your own eyes
Time: 60-90 min
Level: Beginner
Skills: HTTP, DNS, browser developer tools, front end versus back end

You have read how a request travels from a browser to a server and back. Now prove it. In this project you will use your browser's developer tools to watch real websites work, then write a short report that explains what you saw. No code is needed, only careful observation and clear writing.

Requirements:
- Choose three different websites: one simple (a blog or documentation page), one busy (a news or shopping site) and one web application you can log in to.
- For each site, open the Network tab, reload the page and record the address, the status code of the first request, the number of requests and the total size transferred.
- For each site, find one HTML, one CSS, one JavaScript and one image request, and note the Content-Type header of each.
- Find one request that was answered from the cache or with a 304 status, and explain in your own words why the browser did not download the whole file again.
- Find one request that is not part of the page itself, such as analytics or an advertisement, and say which company probably runs it.
- Draw a labelled diagram for one site that shows the browser, DNS lookup, the connection, the request and the response.
- Write three sentences for each site explaining which parts of the page are front end and which clearly come from a back end.
- Finish with a paragraph that compares the three sites and says what surprised you.

Steps:
1. Open the developer tools (press F12, or see the Reference library for shortcuts) and switch to the Network tab. Tick "Disable cache" for the first reload, then untick it for the second to compare.
2. Reload the first site and sort the list by type. Click one request at a time and read its Headers tab.
3. Copy your findings into the report template below as you go, so nothing gets lost.
4. Use the Timing tab on one request to find how long the browser waited for the first byte.
5. Draw the diagram on paper or in any drawing tool, then take a photo or export it.
6. Read the report out loud once. If a sentence does not make sense to you, rewrite it.

Starter:
```text
REPORT: how three websites work

Site 1: <address>
  First request status: <code>
  Requests: <number>   Transferred: <size>
  HTML: <url> (Content-Type: ...)
  CSS: <url> (Content-Type: ...)
  JavaScript: <url> (Content-Type: ...)
  Image: <url> (Content-Type: ...)
  Front end: ...
  Back end: ...

Site 2: ...
Site 3: ...

Cached or 304 request: ...
Third-party request: ...
Comparison and surprises: ...
```

Hints:
- If the Network tab is empty, keep it open and reload the page.
- Filter by Doc, CSS, JS or Img with the buttons above the list.
- A status of 200 means success, 304 means "not modified, use your copy", and 404 means not found.
- The Response tab shows what the server sent. If it is readable HTML, the server built the page. If it is JSON, the page is probably built by JavaScript in your browser.

Stretch:
- Repeat the exercise on a phone-sized screen using device emulation and compare how many requests the page makes.
- Use the command line tool curl with the -I flag to fetch only the response headers of one site and compare them with what the browser shows.
- Find a request that failed (a red line) and explain why it failed.

Deliver:
- A single document (text, Markdown or PDF) with the filled-in report.
- Your hand-drawn or digital diagram.
- Optional: a link to where you published it, for example a GitHub repository or a gist.

Rubric:
- Accuracy | Status codes, sizes and headers match what the Network tab shows, and nothing is guessed.
- Understanding | Explanations use the right words (request, response, header, cache) and show why things happen, not only what.
- Diagram | The diagram shows every step from typing the address to the page appearing, in the correct order.
- Comparison | The closing paragraph draws a real conclusion from the three sites.
:::
