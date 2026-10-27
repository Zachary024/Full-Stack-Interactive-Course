/* Tiny, dependency-free syntax highlighter (works offline).
   Window.Highlight.highlight(code, lang) -> HTML string using .tk-* classes.
   Languages: javascript typescript jsx vue html css python java csharp php go ruby rust kotlin swift
              sql bash yaml dockerfile toml json http */
(function () {
  'use strict';
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var kw = function (s) { return '\\b(?:' + s.trim().split(/\s+/).join('|') + ')\\b'; };

  var NUM = '\\b0[xX][0-9a-fA-F_]+\\b|\\b\\d[\\d_]*(?:\\.\\d+)?(?:[eE][+-]?\\d+)?[fFdDlLuUmM]*\\b';
  var DQ = '"(?:\\\\.|[^"\\\\\\n])*"';
  var SQ = "'(?:\\\\.|[^'\\\\\\n])*'";
  var BT = '`(?:\\\\.|[^`\\\\])*`';
  var CCOM = '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/';
  var FN = '\\b[A-Za-z_$][\\w$]*(?=\\()';
  var TYPE = '\\b[A-Z][A-Za-z0-9_]*\\b';

  var JS_KW = 'async await break case catch class const continue default delete do else export extends finally for from function if import in instanceof let new null of return static super switch this throw try typeof undefined var void while yield true false get set';
  var TS_KW = JS_KW + ' interface type enum implements readonly private public protected abstract as keyof namespace declare unknown never any string number boolean';
  var jsRules = [['c', CCOM], ['s', DQ + '|' + SQ + '|' + BT], ['n', NUM], ['k', kw(JS_KW)], ['f', FN]];
  var htmlRules = [['c', '<!--[\\s\\S]*?-->'], ['t', '<\\/?[A-Za-z][\\w.:-]*|\\/?>'], ['a', '\\b[\\w:@.-]+(?==)'], ['s', DQ + '|' + SQ]];

  var L = {
    javascript: jsRules,
    typescript: [['c', CCOM], ['s', DQ + '|' + SQ + '|' + BT], ['n', NUM], ['k', kw(TS_KW)], ['f', FN], ['y', TYPE]],
    jsx: [['c', '<!--[\\s\\S]*?-->|' + CCOM], ['s', DQ + '|' + SQ + '|' + BT], ['t', '<\\/?[A-Za-z][\\w.:-]*|\\/?>'], ['n', NUM], ['k', kw(JS_KW)], ['f', FN]],
    vue: [['c', '<!--[\\s\\S]*?-->|' + CCOM], ['s', DQ + '|' + SQ + '|' + BT], ['t', '<\\/?[A-Za-z][\\w.:-]*|\\/?>'], ['a', '\\b[v:@#][\\w:.-]*(?==)'], ['n', NUM], ['k', kw(JS_KW)], ['f', FN]],
    html: htmlRules,
    css: [['c', '\\/\\*[\\s\\S]*?\\*\\/'], ['s', DQ + '|' + SQ], ['k', '@[\\w-]+'], ['a', '[\\w-]+(?=\\s*:\\s*[^;{}]*[;}])'], ['n', '#[0-9a-fA-F]{3,8}\\b|-?\\b\\d*\\.?\\d+(?:px|rem|em|%|vh|vw|fr|ms|s|deg)?']],
    python: [['c', '#[^\\n]*'], ['s', '(?:[rbfRBF]{1,2})?(?:"""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\'|"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\')'], ['a', '@[\\w.]+'], ['n', NUM],
      ['k', kw('and as assert async await break class continue def del elif else except finally for from global if import in is lambda None nonlocal not or pass raise return try while with yield True False self')], ['f', '\\b[A-Za-z_]\\w*(?=\\()']],
    java: [['c', CCOM], ['s', '"""[\\s\\S]*?"""|' + DQ + '|' + SQ], ['a', '@\\w+'], ['n', NUM],
      ['k', kw('abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for if implements import instanceof int interface long new null package private protected public return short static super switch synchronized this throw throws try var void volatile while true false record')], ['f', FN], ['y', TYPE]],
    csharp: [['c', CCOM], ['s', '@"(?:""|[^"])*"|\\$"(?:\\\\.|[^"\\\\\\n])*"|' + DQ + '|' + SQ], ['a', '\\[[A-Z]\\w*(?:\\([^)\\n]*\\))?\\]'], ['n', NUM],
      ['k', kw('abstract as async await base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach get if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly record ref return sealed set short sizeof static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using var virtual void volatile while yield')], ['f', FN], ['y', TYPE]],
    php: [['c', '\\/\\/[^\\n]*|#(?!\\[)[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/'], ['s', DQ + '|' + SQ], ['k', '<\\?php|\\?>'], ['a', '\\$[A-Za-z_]\\w*'], ['n', NUM],
      ['k', kw('abstract and array as break callable case catch class clone const continue declare default die do echo else elseif empty enddeclare endfor endforeach endif endswitch endwhile extends final finally fn for foreach function global if implements include include_once instanceof interface isset list match namespace new null or print private protected public readonly require require_once return static switch throw trait try unset use var while yield true false')], ['f', FN], ['y', TYPE]],
    go: [['c', CCOM], ['s', BT + '|' + DQ + "|'(?:\\\\.|[^'\\\\\\n])'"], ['n', NUM],
      ['k', kw('break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var nil true false iota')], ['f', FN], ['y', '\\b(?:string|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|float32|float64|bool|byte|rune|error|any)\\b|' + TYPE]],
    ruby: [['c', '#[^\\n]*'], ['s', DQ + '|' + SQ], ['a', ':[A-Za-z_]\\w*[?!]?|@{1,2}[A-Za-z_]\\w*|\\$\\w+'], ['n', NUM],
      ['k', kw('alias and begin break case class def defined\\? do else elsif end ensure false for if in module next nil not or redo rescue retry return self super then true undef unless until when while yield puts require attr_accessor attr_reader attr_writer lambda proc')], ['f', '\\b[a-z_]\\w*[?!]?(?=\\()'], ['y', TYPE]],
    rust: [['c', CCOM], ['s', DQ + "|'(?:\\\\.|[^'\\\\\\n])'"], ['a', '#!?\\[[^\\]\\n]*\\]|\\b\\w+!(?=[(\\[{])'], ['n', NUM],
      ['k', kw('as async await break const continue crate dyn else enum extern false fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait true type unsafe use where while')], ['f', FN], ['y', TYPE + '|\\b(?:i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str)\\b']],
    kotlin: [['c', CCOM], ['s', '"""[\\s\\S]*?"""|' + DQ + '|' + SQ], ['a', '@\\w+'], ['n', NUM],
      ['k', kw('abstract as break by catch class companion const constructor continue data do else enum false final finally for fun if import in infix init inline interface internal is it lateinit null object open operator out override package private protected public return sealed super suspend this throw true try typealias val var vararg when where while')], ['f', FN], ['y', TYPE]],
    swift: [['c', CCOM], ['s', DQ], ['a', '@\\w+'], ['n', NUM],
      ['k', kw('as break case catch class continue default defer do else enum extension false for func guard if import in init let nil private public return self static struct super switch throw throws true try var while')], ['f', FN], ['y', TYPE]],
    sql: [['c', '--[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/'], ['s', "'(?:''|[^'])*'"], ['n', NUM],
      ['k', '(?:(?<![\\w$])(?:' + 'select from where join left right inner outer full cross on group by having order insert into values update set delete create table drop alter add column primary key foreign not null unique default references serial varchar text integer int boolean timestamp date now count sum avg min max as and or in is like between exists case when then else end limit offset distinct index union all asc desc begin commit rollback autoincrement check'.split(' ').join('|') + ')(?![\\w$]))'], ['f', '\\b[A-Za-z_]\\w*(?=\\()']],
    bash: [['c', '#[^\\n]*'], ['s', DQ + '|' + SQ], ['a', '\\B--?[A-Za-z][\\w-]*|\\$\\{?\\w+\\}?'], ['k', kw('git pip npm npx node docker python python3 source cd ls mkdir touch cat echo export curl heroku aws sudo apt pytest java javac dotnet go cargo ruby gem bundle php composer')]],
    yaml: [['c', '#[^\\n]*'], ['a', '^[ \\t-]*[\\w.\\/"-]+(?=:)'], ['s', DQ + '|' + SQ], ['n', NUM], ['k', kw('true false null')]],
    dockerfile: [['c', '#[^\\n]*'], ['s', DQ], ['k', '^(?:FROM|RUN|COPY|CMD|WORKDIR|ENV|EXPOSE|ENTRYPOINT|ARG|USER|ADD)\\b']],
    toml: [['c', '#[^\\n]*'], ['k', '^\\[[^\\]\\n]+\\]'], ['a', '^[\\w.-]+(?=\\s*=)'], ['s', DQ], ['n', NUM]],
    json: [['a', '"(?:\\\\.|[^"\\\\\\n])*"(?=\\s*:)'], ['s', DQ], ['n', '-?\\b\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\b'], ['k', kw('true false null')]],
    http: [['k', '^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\\b|^HTTP\\/[\\d.]+'], ['a', '^[A-Za-z-]+(?=:)'], ['s', DQ], ['n', '\\b\\d{3}\\b']]
  };

  var NAMES = { javascript: 'JavaScript', typescript: 'TypeScript', python: 'Python', java: 'Java', csharp: 'C#', php: 'PHP', go: 'Go', ruby: 'Ruby', rust: 'Rust', kotlin: 'Kotlin', swift: 'Swift', bash: 'Shell', sql: 'SQL', html: 'HTML', css: 'CSS', json: 'JSON', yaml: 'YAML', text: 'Text', output: 'Output', jsx: 'JSX', vue: 'Vue', toml: 'TOML', dockerfile: 'Dockerfile', http: 'HTTP' };
  var compiled = {};

  function highlight(code, lang) {
    var rules = L[lang];
    if (!rules) return esc(code);
    var re = compiled[lang];
    if (re === undefined) {
      try { re = compiled[lang] = new RegExp(rules.map(function (r) { return '(' + r[1] + ')'; }).join('|'), 'gm'); }
      catch (e) { console.warn('highlight rule error for', lang, e); re = compiled[lang] = null; }
    }
    if (!re) return esc(code);
    re.lastIndex = 0;
    var out = '', last = 0, m;
    while ((m = re.exec(code))) {
      if (!m[0]) { re.lastIndex++; continue; }
      var idx = 1; while (idx < m.length && m[idx] === undefined) idx++;
      out += esc(code.slice(last, m.index)) + '<span class="tk-' + rules[idx - 1][0] + '">' + esc(m[0]) + '</span>';
      last = re.lastIndex;
    }
    return out + esc(code.slice(last));
  }
  window.Highlight = { highlight: highlight, names: NAMES, esc: esc, has: function (l) { return !!L[l]; } };
})();
