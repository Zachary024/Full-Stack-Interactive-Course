#!/usr/bin/env python3
"""Compile content/*.md into modules/*.html (+ glossary + js/modules-data.js).

Run:  python3 build-content.py
Authoring guide: see content/README.md
"""
import hashlib
import html
import json
import pathlib
import random
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent / 'tools'))
import diagrams  # noqa: E402

ROOT = pathlib.Path(__file__).parent
SRC, OUT = ROOT / 'content', ROOT / 'modules'
BUILD = ROOT / 'build'

LANG_ALIAS = {'js': 'javascript', 'ts': 'typescript', 'py': 'python', 'cs': 'csharp', 'c#': 'csharp',
              'sh': 'bash', 'shell': 'bash', 'rb': 'ruby', 'kt': 'kotlin', 'golang': 'go', 'yml': 'yaml',
              'node': 'javascript'}
LANG_LABEL = {'javascript': 'JavaScript', 'typescript': 'TypeScript', 'python': 'Python', 'java': 'Java',
              'csharp': 'C#', 'php': 'PHP', 'go': 'Go', 'ruby': 'Ruby', 'rust': 'Rust', 'kotlin': 'Kotlin',
              'swift': 'Swift', 'bash': 'Shell', 'sql': 'SQL', 'html': 'HTML', 'css': 'CSS', 'json': 'JSON',
              'yaml': 'YAML', 'text': 'Text', 'output': 'Output', 'jsx': 'JSX', 'vue': 'Vue', 'toml': 'TOML',
              'dockerfile': 'Dockerfile', 'http': 'HTTP'}
CALLOUTS = {'tip': 'Tip', 'pitfall': 'Common mistake', 'note': 'Note', 'plain': 'In plain English',
            'learn': 'Learning tip', 'best': 'Best practice', 'try': 'Try it yourself'}

GLOSSARY = {}      # key (lower) -> (display, definition)
GLOSS_ORDER = []
AUTO_TERMS = []
CUR_USED = set()
USED_TERMS = set()
STATS = {}
CHALLENGES = []    # for tools/check-challenges.js
SNIPPETS = []      # for tools/check-snippets.py
SQLCHECKS = []
ERRORS = []


class Ctx:
    def __init__(self, mid):
        self.mid = mid
        self.slugs = {}
        self.fig = 0
        self.check_n = 0
        self.test_n = 0
        self.toc = []
        self.ch = 0
        self.projects = []


def err(msg):
    ERRORS.append(msg)
    print('ERROR:', msg, file=sys.stderr)


def esc(s):
    return html.escape(s, quote=True)


def slug(s):
    s = re.sub(r'<[^>]+>', '', s)
    s = re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
    return s or 'section'


def norm_lang(l):
    l = (l or 'text').lower()
    return LANG_ALIAS.get(l, l)


# ---------------------------------------------------------------- inline
def term_sub(m):
    key = m.group(1).strip()
    shown = (m.group(2) or key).strip()
    ent = GLOSSARY.get(key.lower())
    if not ent:
        err(f'glossary term not found: [[{key}]]')
        return html.escape(shown, quote=False)
    USED_TERMS.add(key.lower())
    CUR_USED.add(key.lower())
    return (f'<button type="button" class="term" data-term="{esc(ent[0])}" '
            f'data-def="{esc(ent[1])}">{html.escape(shown, quote=False)}</button>')


def inline(s):
    codes = []

    def keep(m):
        codes.append(m.group(1))
        return f'\x00{len(codes) - 1}\x00'
    s = re.sub(r'`([^`]+)`', keep, s)
    s = html.escape(s, quote=False)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![\w*])\*(?![\s*])(.+?)(?<![\s*])\*(?![\w*])', r'<em>\1</em>', s)

    def link(m):
        href = m.group(2)
        if href.startswith('#'):
            return f'<a href="{esc(href)}">{m.group(1)}</a>'
        return f'<a href="{esc(href)}" target="_blank" rel="noopener noreferrer">{m.group(1)}</a>'
    s = re.sub(r'\[([^\]]+)\]\((https?://[^)\s]+|#[\w/-]+)\)', link, s)
    s = re.sub(r'\[\[([^\]|]+)(?:\|([^\]]+))?\]\]', term_sub, s)
    s = re.sub(r'\x00(\d+)\x00', lambda m: '<code class="inline">' + html.escape(codes[int(m.group(1))], quote=False) + '</code>', s)
    return s


AUTO_SKIP = set("""type state test method object function variable index hook grid scope template class module event header route
branch merge parameter argument constant condition string array null boolean syntax library query request response client server
token bug cloud pipeline component framework schema iteration thread mock hash salt key
block comment property process pipe port flag table row column record set tree graph queue stack path root script cursor region alert metric
build release fork clone remote tag diff binary reference literal operator statement expression packet origin proxy socket protocol certificate
secret payload validation controller instance interface constructor iterator unicode backup lock daemon shell editor extension debugger regression
fixture stub assertion coverage profiling mentor portfolio prototype field view trigger collection bucket volume runner artifact docs sprint
backlog ticket alias archive blame formatter mode mean median outlier correlation histogram canvas cascade viewport selector lifecycle ref
abstraction coupling cohesion singleton factory availability scalability timeout logging uptime incident monitoring prototype tuple dictionary
integer float closure decorator generics literal enum mutation namespace pointer reference serialization validation sanitization""".split())
AUTO_MAX = 8


def autolink(h, ctx):
    """Link the first plain-text occurrence of glossary terms (a few per module) so beginners get definitions on tap."""
    if not hasattr(ctx, 'auto'):
        ctx.auto = set()
    parts = re.split(r'(<[^>]+>)', h)
    depth = 0
    for i, part in enumerate(parts):
        if part.startswith('<'):
            tag = part.lower()
            if re.match(r'<(button|code|a)\b', tag):
                depth += 1
            elif re.match(r'</(button|code|a)>', tag):
                depth = max(0, depth - 1)
            continue
        if depth or len(ctx.auto) >= AUTO_MAX or not part.strip():
            continue
        stash = []
        for term, ent in AUTO_TERMS:
            key = term.lower()
            if key in ctx.auto or key in CUR_USED:
                continue
            m = re.search(r'(?<![\w-])(' + re.escape(term) + r')(?![\w-])', part, re.I)
            if m:
                ctx.auto.add(key)
                btn = (f'<button type="button" class="term" data-term="{esc(ent[0])}" '
                       f'data-def="{esc(ent[1])}">{m.group(1)}</button>')
                stash.append(btn)
                part = part[:m.start()] + '\x00%d\x00' % (len(stash) - 1) + part[m.end():]
                USED_TERMS.add(key)
                if len(ctx.auto) >= AUTO_MAX:
                    break
        parts[i] = re.sub(r'\x00(\d+)\x00', lambda mm: stash[int(mm.group(1))], part)
    return ''.join(parts)


# ---------------------------------------------------------------- blocks
FENCE = re.compile(r'^```\s*([^\s`]*)\s*(.*)$')
DIRECTIVE = re.compile(r'^:::\s*([\w-]+)\s*(.*)$')


def split_directive(lines, i):
    """lines[i] is '::: name args'. Return (name, args, inner_lines, next_i)."""
    m = DIRECTIVE.match(lines[i])
    name, args = m.group(1), m.group(2).strip()
    inner, j, infence = [], i + 1, False
    while j < len(lines):
        l = lines[j]
        if l.startswith('```'):
            if infence:
                if l.strip() == '```':
                    infence = False
            else:
                infence = True
        if not infence and l.strip() == ':::':
            return name, args, inner, j + 1
        inner.append(l)
        j += 1
    err(f'unterminated directive "{name}" starting at line {i + 1}')
    return name, args, inner, j


def read_fences(lines):
    """Return (prose_lines, [fence dict])."""
    prose, fences, i = [], [], 0
    while i < len(lines):
        m = FENCE.match(lines[i])
        if m and lines[i].startswith('```') and m.group(1):
            body, i = [], i + 1
            while i < len(lines) and lines[i].rstrip() != '```':
                body.append(lines[i]); i += 1
            i += 1
            flags = m.group(2).split()
            fences.append(dict(lang=norm_lang(m.group(1)), flags=flags, code='\n'.join(body)))
        else:
            prose.append(lines[i]); i += 1
    return prose, fences


def code_pre(lang, code, flags=()):
    label = LANG_LABEL.get(lang, lang)
    cls = 'code-block output' if lang == 'output' else 'code-block'
    return (f'<pre class="{cls}" data-lang="{esc(lang)}"><span class="lang-tag">{esc(label)}</span>'
            f'{html.escape(code, quote=False)}</pre>')


def raw_script(part, text, kind='text/plain'):
    safe = text.replace('</script', '<\\/script')
    return f'<script type="{kind}" data-part="{part}">{safe}</script>'


def parse_blocks(lines, ctx):
    out, i = [], 0
    n = len(lines)
    while i < n:
        line = lines[i]
        if not line.strip():
            i += 1; continue
        # fenced code
        m = FENCE.match(line)
        if line.startswith('```') and m:
            lang = norm_lang(m.group(1) or 'text')
            flags = m.group(2).split()
            body, i = [], i + 1
            while i < n and lines[i].rstrip() != '```':
                body.append(lines[i]); i += 1
            i += 1
            code = '\n'.join(body)
            # an output fence directly after a run fence is handled by the snippet checker
            SNIPPETS.append(dict(module=ctx.mid, lang=lang, flags=flags, code=code, group=None))
            out.append(code_pre(lang, code, flags))
            continue
        if DIRECTIVE.match(line):
            name, args, inner, i = split_directive(lines, i)
            out.append(directive(name, args, inner, ctx))
            continue
        h = re.match(r'^(#{2,4})\s+(.*)$', line)
        if h:
            level, text = len(h.group(1)), h.group(2).strip()
            base = slug(text)
            k = ctx.slugs.get(base, 0)
            ctx.slugs[base] = k + 1
            hid = base if k == 0 else f'{base}-{k + 1}'
            if level == 2:
                ctx.toc.append((hid, re.sub(r'<[^>]+>', '', text)))
            out.append(f'<h{level} id="{hid}">{inline(text)}</h{level}>')
            i += 1; continue
        if re.match(r'^---+\s*$', line):
            out.append('<hr>'); i += 1; continue
        if line.startswith('|') and i + 1 < n and re.match(r'^\|[\s:|-]+\|?\s*$', lines[i + 1]):
            rows, i0 = [], i
            while i < n and lines[i].startswith('|'):
                rows.append(lines[i]); i += 1
            out.append(table(rows)); continue
        if re.match(r'^\s*([-*]|\d+\.)\s+', line):
            blk = []
            while i < n and (re.match(r'^\s*([-*]|\d+\.)\s+', lines[i]) or (lines[i].startswith('  ') and lines[i].strip() and blk)):
                blk.append(lines[i]); i += 1
            out.append(list_html(blk)); continue
        if line.startswith('>'):
            blk = []
            while i < n and lines[i].startswith('>'):
                blk.append(lines[i][1:].strip()); i += 1
            out.append('<blockquote>' + inline(' '.join(blk)) + '</blockquote>'); continue
        para = []
        while i < n and lines[i].strip() and not (FENCE.match(lines[i]) and lines[i].startswith('```')) \
                and not DIRECTIVE.match(lines[i]) and not re.match(r'^#{2,4}\s', lines[i]) \
                and not re.match(r'^\s*([-*]|\d+\.)\s+', lines[i]) and not lines[i].startswith('|') \
                and not lines[i].startswith('>'):
            para.append(lines[i].strip()); i += 1
        if not para:
            err(f'[{ctx.mid}] cannot parse line: {line[:60]}')
            i += 1; continue
        out.append('<p>' + autolink(inline(' '.join(para)), ctx) + '</p>')
    return '\n'.join(out)


def list_html(blk):
    items = []  # (indent, ordered, text)
    for l in blk:
        m = re.match(r'^(\s*)([-*]|\d+\.)\s+(.*)$', l)
        if m:
            items.append([len(m.group(1)), m.group(2)[0].isdigit(), m.group(3)])
        else:
            items[-1][2] += ' ' + l.strip()

    def build(idx, indent):
        ordered = items[idx][1]
        tag = 'ol' if ordered else 'ul'
        s = f'<{tag}>'
        while idx < len(items) and items[idx][0] >= indent:
            if items[idx][0] > indent:
                # nested list belongs to previous li; handled below
                break
            s += '<li>' + inline(items[idx][2])
            idx += 1
            if idx < len(items) and items[idx][0] > indent:
                sub, idx = build(idx, items[idx][0])
                s += sub
            s += '</li>'
        return s + f'</{tag}>', idx
    s, _ = build(0, items[0][0])
    return s


def table(rows):
    def cells(r):
        r = r.strip()
        r = r[1:] if r.startswith('|') else r
        r = r[:-1] if r.endswith('|') else r
        return [c.strip() for c in re.split(r'(?<!\\)\|', r)]
    head = cells(rows[0])
    body = [cells(r) for r in rows[2:]]
    s = '<div class="table-wrap"><table><thead><tr>' + ''.join(f'<th scope="col">{inline(c)}</th>' for c in head) + '</tr></thead><tbody>'
    for r in body:
        s += '<tr>' + ''.join(f'<td>{inline(c.replace(chr(92) + "|", "|"))}</td>' for c in r) + '</tr>'
    return s + '</tbody></table></div>'


# ---------------------------------------------------------------- directives
def directive(name, args, inner, ctx):
    if name in CALLOUTS:
        title = args or CALLOUTS[name]
        return (f'<aside class="callout callout-{name}"><div class="callout-title">{inline(title)}</div>'
                f'<div class="callout-body">{parse_blocks(inner, ctx)}</div></aside>')
    if name == 'objectives':
        return (f'<section class="objectives" aria-label="Learning objectives"><div class="box-title">{inline(args or "What you will learn")}</div>'
                f'{parse_blocks(inner, ctx)}</section>')
    if name == 'prereq':
        return (f'<section class="prereq" aria-label="Prerequisites"><div class="box-title">{inline(args or "Before you start")}</div>'
                f'{parse_blocks(inner, ctx)}</section>')
    if name == 'recap':
        return (f'<section class="recap" aria-label="Recap"><div class="box-title">{inline(args or "Key takeaways")}</div>'
                f'{parse_blocks(inner, ctx)}</section>')
    if name == 'code':
        return code_group(args, inner, ctx)
    if name == 'figure':
        return figure(args, inner, ctx)
    if name == 'stepper':
        return stepper(args, inner, ctx)
    if name == 'playground':
        return playground(args, inner, ctx)
    if name == 'challenge':
        return challenge(args, inner, ctx)
    if name == 'sqlplay':
        return sqlplay(args, inner, ctx)
    if name == 'sqlchallenge':
        return sqlchallenge(args, inner, ctx)
    if name == 'quiz':
        return quiz(args, inner, ctx)
    if name == 'demo':
        return f'<div class="demo-mount" data-demo="{esc(args.strip())}"></div>'
    if name == 'lab':
        return lab(args, inner, ctx)
    if name == 'cards':
        return cards(inner, ctx)
    if name == 'project':
        return project(args, inner, ctx)
    if name == 'cheat':
        return cheat(args, inner, ctx)
    err(f'[{ctx.mid}] unknown directive: {name}')
    return ''


def cards(inner, ctx):
    """Each '- **Title** | text' list item becomes a card."""
    out = '<div class="card-grid">'
    for l in inner:
        m = re.match(r'^-\s+(.*?)\s*\|\s*(.*)$', l)
        if m:
            out += f'<div class="mini-card"><div class="mini-title">{inline(m.group(1))}</div><p>{inline(m.group(2))}</p></div>'
    return out + '</div>'


def code_group(title, inner, ctx):
    prose, fences = read_fences(inner)
    outputs = [f for f in fences if f['lang'] == 'output']
    tabs = [f for f in fences if f['lang'] != 'output']
    out_code = outputs[0]['code'] if outputs else None
    gid = len(SNIPPETS)
    for f in tabs:
        SNIPPETS.append(dict(module=ctx.mid, lang=f['lang'], flags=f['flags'], code=f['code'], expected=out_code, group=gid))
    langs = [f['lang'] for f in tabs]
    if len(set(langs)) != len(langs):
        err(f'[{ctx.mid}] duplicate language in code group "{title}"')
    s = f'<div class="code-tabs" data-title="{esc(title)}">'
    if title:
        s += f'<div class="code-tabs-title">{inline(title)}</div>'
    for f in tabs:
        s += code_pre(f['lang'], f['code'])
    if out_code is not None:
        s += code_pre('output', out_code)
    note = '\n'.join(prose).strip()
    if note:
        s += f'<div class="code-note">{parse_blocks(prose, ctx)}</div>'
    return s + '</div>'


def figure(args, inner, ctx):
    parts = args.split(None, 1)
    kind = parts[0]
    caption = parts[1] if len(parts) > 1 else ''
    ctx.fig += 1
    uid = f'{ctx.mid}{ctx.fig}'
    spec = '\n'.join(inner)
    STATS['figures'] = STATS.get('figures', 0) + 1
    try:
        if kind == 'svg':
            svg = spec
        elif kind in ('flow', 'anatomy', 'blocks'):
            svg = diagrams.render(kind, ' '.join(l.strip() for l in inner if l.strip()), uid, caption)
        else:
            svg = diagrams.render(kind, spec, uid, caption)
    except Exception as e:  # noqa
        err(f'[{ctx.mid}] figure {ctx.fig} ({kind}): {e}')
        svg = ''
    return (f'<figure class="figure"><div class="fig-body">{svg}</div>'
            f'<figcaption><span class="fig-n">Figure {ctx.fig}.</span> {inline(caption)}</figcaption></figure>')


def stepper(title, inner, ctx):
    items = []
    for l in inner:
        m = re.match(r'^\d+\.\s+(.*)$', l)
        if m:
            items.append(m.group(1))
        elif items and l.strip():
            items[-1] += ' ' + l.strip()
    s = f'<div class="stepper" data-title="{esc(title)}"><ol class="stepper-list">'
    for it in items:
        m = re.match(r'^\*\*(.+?)\*\*\s*(.*)$', it)
        if m:
            s += f'<li><strong>{inline(m.group(1))}</strong> <span>{inline(m.group(2))}</span></li>'
        else:
            s += f'<li>{inline(it)}</li>'
    return s + '</ol></div>'


def playground(args, inner, ctx):
    parts = args.split(None, 1)
    kind = parts[0]
    title = parts[1] if len(parts) > 1 else 'Try it'
    prose, fences = read_fences(inner)
    s = f'<div class="playground" data-kind="{esc(kind)}" data-title="{esc(title)}">'
    intro = '\n'.join(prose).strip()
    if intro:
        s += f'<div class="pg-intro">{parse_blocks(prose, ctx)}</div>'
    for f in fences:
        part = {'javascript': 'js', 'html': 'html', 'css': 'css'}.get(f['lang'], f['lang'])
        s += raw_script(part, f['code'])
        if f['lang'] == 'javascript' and kind == 'js':
            SNIPPETS.append(dict(module=ctx.mid, lang='javascript', flags=['syntax'], code=f['code'], group=None))
    STATS['playgrounds'] = STATS.get('playgrounds', 0) + 1
    return s + '</div>'


def hints_from(prose):
    hints, rest = [], []
    for l in prose:
        m = re.match(r'^Hint\s*\d*:\s*(.*)$', l)
        if m:
            hints.append(m.group(1))
        else:
            rest.append(l)
    return hints, rest


def challenge(args, inner, ctx):
    parts = args.split(None, 1)
    cid, title = parts[0], (parts[1] if len(parts) > 1 else parts[0])
    prose, fences = read_fences(inner)
    hints, rest = hints_from(prose)
    d = {f['flags'][0] if f['flags'] else '': f['code'] for f in fences}
    for need in ('starter', 'tests', 'solution'):
        if need not in d:
            err(f'[{ctx.mid}] challenge {cid} missing {need}')
            d.setdefault(need, '')
    full_id = f'{ctx.mid}.{cid}'
    ctx.ch += 1
    CHALLENGES.append(dict(id=full_id, starter=d['starter'], tests=d['tests'], solution=d['solution']))
    STATS['challenges'] = STATS.get('challenges', 0) + 1
    s = f'<div class="challenge" data-id="{esc(full_id)}" data-title="{esc(title)}">'
    s += f'<div class="challenge-head"><span class="badge">Coding challenge</span><h3>{inline(title)}</h3></div>'
    s += f'<div class="challenge-body">{parse_blocks(rest, ctx)}</div>'
    s += raw_script('starter', d['starter']) + raw_script('tests', d['tests']) + raw_script('solution', d['solution'])
    for h in hints:
        s += f'<div class="hint-text" hidden>{inline(h)}</div>'
    return s + '</div>'


def sqlplay(args, inner, ctx):
    prose, fences = read_fences(inner)
    d = {f['flags'][0] if f['flags'] else 'starter': f['code'] for f in fences}
    schema, starter = d.get('schema', ''), d.get('starter', '')
    SQLCHECKS.append(dict(id=f'{ctx.mid}.play', schema=schema, starter=starter, solution=starter, kind='play'))
    STATS['playgrounds'] = STATS.get('playgrounds', 0) + 1
    intro = parse_blocks(prose, ctx) if '\n'.join(prose).strip() else ''
    return (f'<div class="sqlplay" data-title="{esc(args or "SQL playground")}">'
            f'{"<div class=pg-intro>" + intro + "</div>" if intro else ""}'
            f'{raw_script("schema", schema)}{raw_script("starter", starter)}</div>')


def sqlchallenge(args, inner, ctx):
    parts = args.split(None, 1)
    cid, title = parts[0], parts[1] if len(parts) > 1 else parts[0]
    prose, fences = read_fences(inner)
    hints, rest = hints_from(prose)
    d = {f['flags'][0] if f['flags'] else '': f['code'] for f in fences}
    full_id = f'{ctx.mid}.{cid}'
    ctx.ch += 1
    SQLCHECKS.append(dict(id=full_id, schema=d.get('schema', ''), starter=d.get('starter', ''), solution=d.get('solution', ''), kind='challenge'))
    STATS['challenges'] = STATS.get('challenges', 0) + 1
    s = f'<div class="challenge sql-challenge" data-id="{esc(full_id)}" data-title="{esc(title)}">'
    s += f'<div class="challenge-head"><span class="badge">SQL challenge</span><h3>{inline(title)}</h3></div>'
    s += f'<div class="challenge-body">{parse_blocks(rest, ctx)}</div>'
    s += raw_script('schema', d.get('schema', '')) + raw_script('starter', d.get('starter', '')) + raw_script('solution', d.get('solution', ''))
    for h in hints:
        s += f'<div class="hint-text" hidden>{inline(h)}</div>'
    return s + '</div>'


def lab(title, inner, ctx):
    steps, goals = [], []
    cur = None
    intro = []
    for l in inner:
        m = re.match(r'^\d+\.\s+(.*)$', l)
        if m:
            cur = m.group(1); steps.append(cur)
        elif cur is not None and l.strip() and not l.startswith('-'):
            steps[-1] += ' ' + l.strip()
        elif l.strip() and cur is None:
            intro.append(l)
    s = f'<section class="lab-box"><h3>{inline(title)}</h3>'
    if intro:
        s += parse_blocks(intro, ctx)
    s += '<ol class="lab-steps">' + ''.join(f'<li>{inline(x)}</li>' for x in steps) + '</ol>'
    s += '<div class="lab-foot">Mark the lab complete from the module page when you have finished the steps.</div></section>'
    STATS['labs'] = STATS.get('labs', 0) + 1
    return s


# ---------------------------------------------------------------- projects
PROJECTS = []   # for js/modules-data.js and the Projects page
PJ_SECTIONS = {'requirements', 'steps', 'stretch', 'hints', 'deliver', 'rubric', 'starter'}


def _bullets(lines):
    items = []
    for l in lines:
        m = re.match(r'^\s*(?:[-*]|\d+\.)\s+(.*)$', l)
        if m:
            items.append(m.group(1).strip())
        elif l.strip() and items:
            items[-1] += ' ' + l.strip()
    return items


def project(args, inner, ctx):
    """::: project <id> <Title>   then Time:/Skills: lines, a brief, and Requirements:/Steps:/Stretch:/Hints:/Deliver:/Rubric:/Starter: sections."""
    parts = args.split(None, 1)
    if len(parts) < 2:
        err(f'[{ctx.mid}] project needs an id and a title')
        return ''
    pid, title = parts
    full = f'{ctx.mid}.{pid}'
    meta, brief, sec, cur = {}, [], {k: [] for k in PJ_SECTIONS}, None
    in_fence = False
    for l in inner:
        if l.startswith('```'):
            in_fence = not in_fence
        if not in_fence and not l.startswith('```'):
            m = re.match(r'^(Time|Skills|Level):\s*(.*)$', l)
            if m:
                meta[m.group(1).lower()] = m.group(2).strip(); continue
            m = re.match(r'^([A-Za-z]+):\s*$', l)
            if m and m.group(1).lower() in PJ_SECTIONS:
                cur = m.group(1).lower(); continue
        (sec[cur] if cur else brief).append(l)
    reqs, steps, stretch = _bullets(sec['requirements']), _bullets(sec['steps']), _bullets(sec['stretch'])
    hints, deliver = _bullets(sec['hints']), _bullets(sec['deliver'])
    rubric = []
    for r in _bullets(sec['rubric']):
        a, _, b = r.partition('|')
        if not b:
            err(f'[{ctx.mid}] project {pid}: rubric lines need "Criterion | what good looks like"')
        rubric.append((a.strip(), b.strip()))
    if len(reqs) < 4:
        err(f'[{ctx.mid}] project {pid}: needs at least 4 requirements')
    if len(steps) < 3:
        err(f'[{ctx.mid}] project {pid}: needs at least 3 steps')
    if not rubric:
        err(f'[{ctx.mid}] project {pid}: needs a rubric')
    PROJECTS.append(dict(id=full, mod=ctx.mid, title=title, time=meta.get('time', ''), skills=meta.get('skills', ''), reqs=len(reqs), stretch=len(stretch)))
    ctx.projects.append(full)
    STATS['projects'] = STATS.get('projects', 0) + 1

    s = (f'<section class="project" data-id="{esc(full)}" data-req="{len(reqs)}" data-stretch="{len(stretch)}" aria-labelledby="pj-{esc(full)}">'
         f'<div class="pj-head"><span class="badge">Project</span><h3 id="pj-{esc(full)}">{inline(title)}</h3>'
         f'<div class="pj-meta">{"<span>" + esc(meta["time"]) + "</span>" if meta.get("time") else ""}'
         f'{"<span>" + esc(meta["level"]) + "</span>" if meta.get("level") else ""}'
         f'{"<span>Skills: " + inline(meta["skills"]) + "</span>" if meta.get("skills") else ""}</div></div>'
         f'<div class="pj-body"><div class="pj-brief">{parse_blocks(brief, ctx)}</div>')
    s += '<h4>Requirements</h4><p class="pj-help">Tick each one when your project does it. All of them are needed to finish.</p><ul class="pj-checks">'
    for i, r in enumerate(reqs):
        s += f'<li><label><input type="checkbox" data-k="r{i}"><span>{inline(r)}</span></label></li>'
    s += '</ul>'
    s += '<h4>Build it in stages</h4><ol class="pj-steps">' + ''.join(f'<li>{inline(x)}</li>' for x in steps) + '</ol>'
    if sec['starter'] and any(x.strip() for x in sec['starter']):
        s += '<h4>Starter code</h4>' + code_group('', sec['starter'], ctx)
    if hints:
        s += '<details class="pj-hints"><summary>Stuck? Open the hints</summary><ul>' + ''.join(f'<li>{inline(x)}</li>' for x in hints) + '</ul></details>'
    if stretch:
        s += '<h4>Stretch goals <span class="pj-opt">optional</span></h4><ul class="pj-checks pj-stretch">'
        for i, r in enumerate(stretch):
            s += f'<li><label><input type="checkbox" data-k="s{i}"><span>{inline(r)}</span></label></li>'
        s += '</ul>'
    if rubric:
        s += ('<h4>Review it against this rubric</h4><div class="table-wrap"><table><thead><tr><th scope="col">Criterion</th><th scope="col">What good looks like</th></tr></thead><tbody>'
              + ''.join(f'<tr><td><strong>{inline(a)}</strong></td><td>{inline(b)}</td></tr>' for a, b in rubric) + '</tbody></table></div>'
              '<ul class="pj-checks"><li><label><input type="checkbox" data-k="rubric"><span>I reviewed my project against the rubric and fixed what fell short.</span></label></li></ul>')
    if deliver:
        s += '<h4>What to hand in</h4><ul>' + ''.join(f'<li>{inline(x)}</li>' for x in deliver) + '</ul>'
    s += ('<div class="pj-foot"><div class="pj-progress"><div class="progress-bar" aria-hidden="true"><div class="fill"></div></div>'
          '<span class="pj-count" role="status"></span></div>'
          '<div class="pj-fields"><div class="form-row"><label class="label" for="pjl-' + esc(full) + '">Link to your work (optional)</label>'
          '<input class="field" id="pjl-' + esc(full) + '" type="url" inputmode="url" placeholder="https://github.com/you/project" autocomplete="off"></div>'
          '<div class="form-row"><label class="label" for="pjn-' + esc(full) + '">What did you learn? What would you do differently?</label>'
          '<textarea class="field" id="pjn-' + esc(full) + '" rows="3" maxlength="2000"></textarea></div></div>'
          '<div class="actions"><button type="button" class="btn btn-primary" data-a="finish" disabled>Mark project complete</button>'
          '<button type="button" class="btn btn-secondary" data-a="reopen" hidden>Reopen project</button></div></div>')
    return s + '</div></section>'


# ---------------------------------------------------------------- cheat sheets
def cheat(args, inner, ctx):
    """::: cheat <Title>
    cols: Command ;; What it does ;; Example        (header; first line)
    code: 1,3      (optional: columns shown as code with a copy button, 1-based)
    kbd: 2,3       (optional: columns that hold keyboard shortcuts)
    then one row per line, cells separated by ' ;; '."""
    cols, code_cols, kbd_cols, rows = [], set(), set(), []
    for l in inner:
        if not l.strip():
            continue
        m = re.match(r'^(cols|code|kbd):\s*(.*)$', l)
        if m:
            if m.group(1) == 'cols':
                cols = [c.strip() for c in m.group(2).split(';;')]
            else:
                tgt = code_cols if m.group(1) == 'code' else kbd_cols
                tgt.update(int(x) - 1 for x in m.group(2).split(',') if x.strip())
            continue
        cells = [c.strip() for c in l.split(' ;; ')]
        rows.append(cells)
    if not cols:
        err(f'[{ctx.mid}] cheat "{args}": missing cols: line')
        return ''
    for r in rows:
        if len(r) != len(cols):
            err(f'[{ctx.mid}] cheat "{args}": row has {len(r)} cells, expected {len(cols)}: {r[0][:40]}')
    STATS['cheat_rows'] = STATS.get('cheat_rows', 0) + len(rows)

    def kbd_html(t):
        parts = re.split(r'\s+(or|to|then)\s+', t)
        out = []
        for i, a in enumerate(parts):
            if i % 2:
                out.append(f'<span class="or">{a}</span>')
                continue
            keys = [k.strip() for k in re.split(r'(?<!\+)\+(?!\+|$)', a) if k.strip()]
            out.append('<span class="keys">' + '<span class="plus">+</span>'.join(f'<kbd>{html.escape(k, quote=False)}</kbd>' for k in keys) + '</span>')
        return ' '.join(out)

    s = (f'<h3 class="cheat-title">{inline(args)}</h3>' if args else '') + f'<div class="cheat" data-title="{esc(args)}"><div class="table-wrap"><table><thead><tr>' + ''.join(f'<th scope="col">{inline(c)}</th>' for c in cols) + '</tr></thead><tbody>'
    for r in rows:
        s += '<tr>'
        for i, c in enumerate(r):
            lab = f' data-label="{esc(re.sub(chr(60) + "[^>]*>", "", cols[i]))}"'
            if i in code_cols and c and c != '-':
                s += f'<td class="cs-code"{lab}><button type="button" class="cs-copy" aria-label="Copy command" data-copy="{esc(c)}"><span>Copy</span></button><code class="cs-cmd">{html.escape(c, quote=False)}</code></td>'
            elif i in kbd_cols and c and c != '-':
                s += f'<td class="cs-kbd"{lab}>{kbd_html(c)}</td>'
            else:
                s += f'<td{lab}>{inline(c)}</td>'
        s += '</tr>'
    return s + '</tbody></table></div></div>'


# ---------------------------------------------------------------- quiz
def seeded_perm(n, seed, keep_identity_out=False):
    r = random.Random(int(hashlib.sha1(seed.encode()).hexdigest()[:12], 16))
    for _ in range(20):
        p = list(range(n)); r.shuffle(p)
        if not keep_identity_out or p != list(range(n)):
            return p
    return list(range(n))


FIXED_ORDER = re.compile(r'\b(all of the above|both|neither|none of the|above)\b', re.I)


def parse_quiz(lines, qid):
    qs, cur = [], None

    def finish():
        nonlocal cur
        if cur is None:
            return
        k = cur['t']
        if k == 'mcq':
            stars = [i for i, (_, c) in enumerate(cur['opts']) if c]
            if len(stars) != 1:
                err(f'{qid}: mcq needs exactly one correct option: {cur["q"][:50]}')
                stars = stars or [0]
            texts = [t for t, _ in cur['opts']]
            if any(FIXED_ORDER.search(t) for t in texts):
                perm = list(range(len(texts)))
            else:
                perm = seeded_perm(len(texts), qid + cur['q'])
            q = dict(t='mcq', q=inline_q(cur['q']), o=[inline_q(texts[p]) for p in perm], a=perm.index(stars[0]))
        elif k == 'multi':
            texts = [t for t, _ in cur['opts']]
            perm = seeded_perm(len(texts), qid + cur['q'])
            ans = [perm.index(i) for i, (_, c) in enumerate(cur['opts']) if c]
            if len(ans) < 2:
                err(f'{qid}: multi needs 2+ correct: {cur["q"][:50]}')
            q = dict(t='multi', q=inline_q(cur['q']), o=[inline_q(texts[p]) for p in perm], a=sorted(ans))
        elif k == 'tf':
            q = dict(t='tf', q=inline_q(cur['q']), a=cur['ans'])
        elif k == 'short':
            q = dict(t='short', q=inline_q(cur['q']), a=cur['ans'])
        elif k == 'order':
            items = cur['items']
            perm = seeded_perm(len(items), qid + cur['q'], True)
            q = dict(t='order', q=inline_q(cur['q']), o=[inline_q(items[p]) for p in perm],
                     a=[perm.index(i) for i in range(len(items))])
        q['why'] = inline_q(cur['why'].strip()) if cur['why'].strip() else ''
        if not q['why']:
            err(f'{qid}: question without explanation: {cur["q"][:50]}')
        qs.append(q)
        cur = None

    for raw in lines:
        s = raw.rstrip()
        if not s.strip():
            continue
        if s.startswith('?'):
            finish()
            m = re.match(r'^\?(tf|short|multi|order)?\s*(.*)$', s)
            kind = m.group(1) or 'mcq'
            text = m.group(2)
            cur = dict(t=kind, q=text, opts=[], items=[], why='', ans=None)
            if kind == 'tf':
                if '|' not in text:
                    err(f'{qid}: tf needs "question | true/false"')
                    continue
                q, a = text.rsplit('|', 1)
                cur['q'], cur['ans'] = q.strip(), a.strip().lower() == 'true'
            elif kind == 'short':
                if '|' not in text:
                    err(f'{qid}: short needs "question | answer; alt"')
                    continue
                q, a = text.rsplit('|', 1)
                cur['q'], cur['ans'] = q.strip(), [x.strip() for x in a.split(';') if x.strip()]
        elif cur is None:
            err(f'{qid}: stray line in quiz: {s[:40]}')
        elif s.startswith('- '):
            t = s[2:].strip()
            correct = t.startswith('*')
            cur['opts'].append((t[1:].strip() if correct else t, correct))
        elif re.match(r'^\d+\.\s', s):
            cur['items'].append(re.sub(r'^\d+\.\s+', '', s).strip())
        elif s.startswith('>'):
            cur['why'] += ' ' + s[1:].strip()
        else:
            cur['q'] += ' ' + s.strip()
    finish()
    return qs


def inline_q(s):
    """Inline formatting for quiz text (code + emphasis only; no glossary)."""
    codes = []
    s = re.sub(r'`([^`]+)`', lambda m: (codes.append(m.group(1)), f'\x00{len(codes) - 1}\x00')[1], s)
    s = html.escape(s, quote=False)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    return re.sub(r'\x00(\d+)\x00', lambda m: '<code class="inline">' + html.escape(codes[int(m.group(1))], quote=False) + '</code>', s)


def quiz(args, inner, ctx):
    parts = args.split(None, 1)
    kind = parts[0]
    title = parts[1] if len(parts) > 1 else ('Module test' if kind == 'test' else 'Checkpoint')
    if kind == 'test':
        qid = ctx.mid
    else:
        ctx.check_n += 1
        qid = f'{ctx.mid}-c{ctx.check_n}'
    qs = parse_quiz(inner, qid)
    STATS['questions'] = STATS.get('questions', 0) + len(qs)
    STATS.setdefault('by_module', {}).setdefault(ctx.mid, 0)
    STATS['by_module'][ctx.mid] += len(qs)
    data = json.dumps(dict(id=qid, kind=kind, title=title, questions=qs), ensure_ascii=False).replace('</', '<\\/')
    return (f'<div class="quiz-mount" data-id="{qid}" data-kind="{kind}" data-title="{esc(title)}" data-count="{len(qs)}">'
            f'<script type="application/json" class="quiz-data">{data}</script></div>')


# ---------------------------------------------------------------- files
def parse_front(text):
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', text, re.S)
    if not m:
        raise ValueError('missing front matter')
    meta = {}
    for l in m.group(1).splitlines():
        if ':' in l:
            k, v = l.split(':', 1)
            meta[k.strip()] = v.strip()
    return meta, m.group(2)


GLOSS_CAT = {}    # display term -> category
CAT_ORDER = []


def load_glossary():
    """Lines: '# Category' starts a group; 'Term | alias :: definition'."""
    cat = 'General'
    lines = []
    for p in sorted(SRC.glob('glossary*.md')):
        lines += p.read_text(encoding='utf8').splitlines()
    for l in lines:
        if l.startswith('# '):
            cat = l[2:].strip()
            continue
        if '::' not in l:
            continue
        names, d = l.split('::', 1)
        names = [n.strip() for n in names.split('|') if n.strip()]
        ent = (names[0], d.strip())
        for n in names:
            if n.lower() in GLOSSARY:
                err(f'glossary: duplicate term or alias "{n}"')
            GLOSSARY[n.lower()] = ent
        GLOSS_ORDER.append(ent)
        GLOSS_CAT[ent[0]] = cat
        if cat not in CAT_ORDER:
            CAT_ORDER.append(cat)


def build_glossary():
    items = sorted(GLOSS_ORDER, key=lambda e: e[0].lower())
    s = '<dl class="glossary">'
    letter = ''
    for term, d in items:
        L = term[0].upper() if term[0].isalpha() else '#'
        if L != letter:
            letter = L
            s += f'<div class="gl-letter" aria-hidden="true">{L}</div>'
        s += (f'<div class="gl-item" data-cat="{esc(GLOSS_CAT.get(term, "General"))}"><dt id="g-{slug(term)}">{html.escape(term)}</dt>'
              f'<dd>{inline_q(d)}<span class="gl-cat">{html.escape(GLOSS_CAT.get(term, "General"))}</span></dd></div>')
    s += '</dl>'
    (OUT / 'glossary.html').write_text(s, encoding='utf8')


def main():
    OUT.mkdir(exist_ok=True)
    if not sys.argv[1:]:
        keep = {p.stem for p in SRC.glob('*.md') if p.name != 'README.md' and not p.name.startswith('glossary')} | {'glossary'}
        for old in OUT.glob('*.html'):
            if old.stem not in keep:
                old.unlink()
    BUILD.mkdir(exist_ok=True)
    load_glossary()
    global AUTO_TERMS
    AUTO_TERMS = sorted([(e[0], e) for e in GLOSS_ORDER if e[0].lower() not in AUTO_SKIP and len(e[0]) > 2], key=lambda t: -len(t[0]))
    metas = []
    only = sys.argv[1:]
    for p in sorted(SRC.glob('*.md')):
        if p.name.startswith('glossary') or p.name == 'README.md':
            continue
        meta, body = parse_front(p.read_text(encoding='utf8'))
        mid = meta['id']
        if p.stem != mid:
            err(f'{p.name}: id "{mid}" does not match filename')
        ctx = Ctx(mid)
        CUR_USED.clear()
        pj = SRC / 'projects' / f'{mid}.md'          # optional module project, appended after the module test
        if pj.exists():
            body = body.rstrip() + '\n\n## Module project\n\n' + pj.read_text(encoding='utf8').strip() + '\n'
        lines = body.splitlines()
        content = parse_blocks(lines, ctx)
        words = len(re.sub(r'<[^>]+>', ' ', content).split())
        meta['words'] = words
        meta['ch'] = ctx.ch
        meta['pj'] = ctx.projects
        metas.append(meta)
        header = (f'<header class="lesson-head"><div class="lesson-meta"><span>{esc(meta.get("track", ""))}</span>'
                  f'<span>{"Reference" if meta.get("kind") == "reference" else "Module " + esc(meta["number"])}</span><span>{esc(meta.get("duration", ""))}</span><span>{esc(meta.get("level", ""))}</span></div>'
                  f'<h1>{esc(meta["title"])}</h1><p class="lede">{inline(meta.get("summary", ""))}</p></header>')
        (OUT / f'{mid}.html').write_text(header + '\n' + content + '\n', encoding='utf8')
        STATS.setdefault('words', 0)
        STATS['words'] += words
    # unused glossary terms are fine; missing ones raise errors above
    build_glossary()
    metas.sort(key=lambda m: int(m['number']))
    data = [dict(id=m['id'], num=int(m['number']), track=m.get('track', ''), title=m['title'], dur=m.get('duration', ''),
                 level=m.get('level', ''), sum=re.sub(r'\[\[([^\]|]+)(?:\|([^\]]+))?\]\]', lambda x: x.group(2) or x.group(1), m.get('summary', '')).replace('`', ''),
                 words=m['words'], kind=m.get('kind', 'module'), ch=m['ch'], pj=m['pj']) for m in metas]
    (ROOT / 'js' / 'modules-data.js').write_text('/* generated by build-content.py - do not edit */\nvar MODULES = ' + json.dumps(data, indent=1, ensure_ascii=False) + ';\n', encoding='utf8')
    _num = {m['id']: int(m['number']) for m in metas}
    PROJECTS.sort(key=lambda p: _num.get(p['mod'], 999))
    with open(ROOT / 'js' / 'modules-data.js', 'a', encoding='utf8') as f:
        f.write('var COURSE_STATS = ' + json.dumps(dict(questions=STATS.get('questions', 0), challenges=STATS.get('challenges', 0), figures=STATS.get('figures', 0), words=STATS.get('words', 0), projects=STATS.get('projects', 0), terms=len(GLOSS_ORDER), cheats=STATS.get('cheat_rows', 0))) + ';\n')
        f.write('var PROJECTS = ' + json.dumps(PROJECTS, indent=1, ensure_ascii=False) + ';\n')
        f.write('var GLOSS_CATS = ' + json.dumps(CAT_ORDER) + ';\n')
    (BUILD / 'challenges.json').write_text(json.dumps(CHALLENGES), encoding='utf8')
    (BUILD / 'snippets.json').write_text(json.dumps(SNIPPETS), encoding='utf8')
    (BUILD / 'sqlchecks.json').write_text(json.dumps(SQLCHECKS), encoding='utf8')
    print(f'modules: {len(metas)}  words: {STATS.get("words", 0)}  questions: {STATS.get("questions", 0)}  '
          f'challenges: {STATS.get("challenges", 0)}  figures: {STATS.get("figures", 0)}  playgrounds: {STATS.get("playgrounds", 0)}  '
          f'labs: {STATS.get("labs", 0)}  projects: {STATS.get("projects", 0)}  cheat rows: {STATS.get("cheat_rows", 0)}  glossary: {len(GLOSS_ORDER)} (used {len(USED_TERMS)})')
    for k, v in STATS.get('by_module', {}).items():
        print(f'  {k:12s} questions={v}')
    if ERRORS:
        print(f'{len(ERRORS)} error(s)', file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
