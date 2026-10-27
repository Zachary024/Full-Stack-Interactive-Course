/* Language catalogue + recommendation logic (shared by the language guide, the finder and the overview page). */
(function () {
  'use strict';
  // d: difficulty for a complete beginner, 1 (gentle) - 5 (steep)
  var DATA = {
    python: { name: 'Python', d: 1, tag: 'Readable, general purpose', tags: { data: 5, scripts: 5, web: 3, enterprise: 3, apps: 1, games: 2, systems: 1, easy: 5, jobs: 4 },
      good: 'Data analysis, AI and machine learning, automation, scripting, back-end web services, teaching.',
      watch: 'Slower than compiled languages; not used for phone apps or in-browser interfaces.',
      first: 'Reads almost like English and needs very little set-up, so you can focus on ideas instead of syntax.' },
    javascript: { name: 'JavaScript', d: 2, tag: 'The language of the browser', tags: { web: 5, apps: 3, scripts: 3, data: 2, enterprise: 3, games: 3, systems: 1, easy: 4, jobs: 5 },
      good: 'Interactive websites, full-stack web apps (with Node.js), browser games, cross-platform apps.',
      watch: 'Quirky type rules and a very large ecosystem that can overwhelm beginners.',
      first: 'It runs in every browser, so you can see results instantly with nothing to install, and it covers both front end and back end.' },
    typescript: { name: 'TypeScript', d: 3, tag: 'JavaScript with a safety net', tags: { web: 5, apps: 3, scripts: 2, data: 1, enterprise: 4, games: 2, systems: 1, easy: 3, jobs: 5 },
      good: 'Large web applications and teams that want the editor to catch mistakes before the code runs.',
      watch: 'You need to understand JavaScript first; adds a compile step and extra concepts.',
      first: 'Best as a second step: learn JavaScript, then add types.' },
    java: { name: 'Java', d: 3, tag: 'Enterprise workhorse', tags: { enterprise: 5, apps: 4, web: 3, data: 3, scripts: 2, games: 3, systems: 2, easy: 2, jobs: 5 },
      good: 'Large business back ends, Android apps (alongside Kotlin), banking and enterprise systems.',
      watch: 'Verbose; you meet classes and types on day one.',
      first: 'Strict structure teaches good habits and the job market is huge, but the first weeks are heavier.' },
    csharp: { name: 'C#', d: 3, tag: 'Modern, versatile, Microsoft ecosystem', tags: { enterprise: 5, games: 5, web: 3, apps: 3, data: 2, scripts: 2, systems: 2, easy: 3, jobs: 4 },
      good: 'Game development with Unity, Windows and business software, ASP.NET web back ends.',
      watch: 'Tooling is smoothest with Visual Studio or VS Code plus the .NET SDK.',
      first: 'Clean modern syntax and superb tooling; the best path into Unity game development.' },
    php: { name: 'PHP', d: 2, tag: 'Powers a large share of the web', tags: { web: 5, enterprise: 2, scripts: 3, data: 1, apps: 1, games: 1, systems: 1, easy: 3, jobs: 3 },
      good: 'Server-side websites, WordPress and content sites, quick back-end APIs.',
      watch: 'Older code online is inconsistent; modern PHP (8+) is much cleaner.',
      first: 'Very quick to get a dynamic page running on cheap hosting.' },
    go: { name: 'Go', d: 3, tag: 'Simple, fast, built for the cloud', tags: { systems: 4, enterprise: 4, web: 4, scripts: 3, data: 1, apps: 1, games: 1, easy: 3, jobs: 4 },
      good: 'Cloud services, command-line tools, high-performance APIs, DevOps tooling.',
      watch: 'Deliberately minimal; fewer built-in conveniences than Python or Ruby.',
      first: 'A small language you can learn completely; compiles to a single fast program.' },
    ruby: { name: 'Ruby', d: 2, tag: 'Optimised for developer happiness', tags: { web: 4, scripts: 4, enterprise: 2, data: 1, apps: 1, games: 1, systems: 1, easy: 5, jobs: 2 },
      good: 'Web applications with Rails, start-ups and prototypes, scripting.',
      watch: 'Smaller job market than Python or JavaScript today.',
      first: 'Expressive, friendly syntax that reads naturally and makes object-oriented ideas clear.' },
    rust: { name: 'Rust', d: 5, tag: 'Fast and memory-safe', tags: { systems: 5, enterprise: 2, web: 2, scripts: 2, data: 1, apps: 1, games: 3, easy: 1, jobs: 3 },
      good: 'Systems programming, game engines, WebAssembly, performance-critical services.',
      watch: 'Steepest learning curve in this list; best after you know another language.',
      first: 'Not recommended as a very first language, but excellent later.' },
    kotlin: { name: 'Kotlin', d: 3, tag: 'Modern Java alternative, Android first', tags: { apps: 5, enterprise: 3, web: 2, scripts: 2, data: 1, games: 1, systems: 1, easy: 3, jobs: 4 },
      good: 'Android apps, server-side services on the JVM, multiplatform mobile.',
      watch: 'Smaller community than Java; best set-up is Android Studio or IntelliJ.',
      first: 'Concise and safe; the recommended way to build Android apps.' }
  };
  var ORDER = ['javascript', 'python', 'java', 'csharp', 'php', 'go', 'ruby'];     // languages shown in code tabs
  var GOALS = [
    ['web', 'Build websites and web apps'], ['data', 'Work with data, AI or science'], ['apps', 'Make mobile apps'],
    ['games', 'Create games'], ['scripts', 'Automate tasks and write scripts'], ['enterprise', 'Build business or back-end systems'],
    ['systems', 'Low-level, high-performance software']
  ];
  var EXPERIENCE = [['none', 'No experience at all'], ['some', 'I have written a little code'], ['comfortable', 'I am comfortable in another language']];
  var STYLE = [['easy', 'Gentle and easy to read'], ['jobs', 'Whatever has the most jobs'], ['either', 'No preference']];

  // quiz-score signals: module id -> languages that benefit from strength there
  function recommend(a, scores) {
    a = a || {};
    var out = [];
    Object.keys(DATA).forEach(function (k) {
      var L = DATA[k], s = 0, why = [];
      if (a.goal) { var g = L.tags[a.goal] || 0; s += g * 3; if (g >= 4) why.push('strong fit for "' + goalName(a.goal) + '"'); }
      if (a.style === 'easy') { s += L.tags.easy * 2; if (L.tags.easy >= 4) why.push('easy to read and learn'); }
      if (a.style === 'jobs') { s += L.tags.jobs * 2; if (L.tags.jobs >= 4) why.push('large job market'); }
      if (a.exp === 'none') { s += (6 - L.d) * 2; if (L.d <= 2) why.push('gentle for a first language'); }
      else if (a.exp === 'some') { s += (6 - L.d); }
      else if (a.exp === 'comfortable') { s += L.d; }
      // progress signal: struggling with the basics -> favour gentler languages; doing well -> neutral
      if (scores && typeof scores.basics === 'number') {
        if (scores.basics < 70) s += (6 - L.d) * 2;
        else if (scores.basics >= 90 && L.d >= 3) { s += 2; why.push('you are scoring well, so you can handle a stricter language'); }
      }
      out.push({ id: k, score: s, why: why });
    });
    out.sort(function (x, y) { return y.score - x.score; });
    return out;
  }
  function goalName(id) { var g = GOALS.filter(function (x) { return x[0] === id; })[0]; return g ? g[1].toLowerCase() : id; }

  window.Languages = { DATA: DATA, ORDER: ORDER, GOALS: GOALS, EXPERIENCE: EXPERIENCE, STYLE: STYLE, recommend: recommend, name: function (id) { return DATA[id] ? DATA[id].name : id; } };
})();
