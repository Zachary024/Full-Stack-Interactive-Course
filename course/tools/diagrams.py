"""SVG diagram generator used by build-content.py.

Every diagram is emitted as inline SVG that uses CSS classes (fg-*) so it follows
the light/dark theme. Kinds: flow, sequence, layers, tree, anatomy, blocks, boxmodel.
"""
import html

CW_TITLE = 8.4     # approx. px per char, 14px semibold
CW_SUB = 6.9       # approx. px per char, 12px
CW_MONO = 8.0      # approx. px per char, 13px monospace


def esc(s):
    return html.escape(s, quote=True)


def _svg(w, h, body, uid, label):
    return (f'<svg class="fg" viewBox="0 0 {w:.0f} {h:.0f}" role="img" aria-label="{esc(label)}" '
            f'style="max-width:{w:.0f}px;min-width:{min(w, max(320, w * 0.72)):.0f}px" '
            f'xmlns="http://www.w3.org/2000/svg"><defs>'
            f'<marker id="ah-{uid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
            f'<path d="M0 0L10 5L0 10z" class="fg-head"/></marker></defs>{body}</svg>')


def _parse_item(raw):
    raw = raw.strip()
    accent = raw.startswith('*')
    if accent:
        raw = raw[1:].strip()
    if '|' in raw:
        t, s = [p.strip() for p in raw.split('|', 1)]
    else:
        t, s = raw, ''
    return t, s, accent


def _box(x, y, w, h, title, sub, accent, extra_cls=''):
    cls = 'fg-box fg-accent' if accent else 'fg-box'
    out = f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="9" class="{cls} {extra_cls}"/>'
    if sub:
        out += f'<text x="{x + w / 2:.1f}" y="{y + h / 2 - 5:.1f}" text-anchor="middle" class="fg-title">{esc(title)}</text>'
        out += f'<text x="{x + w / 2:.1f}" y="{y + h / 2 + 14:.1f}" text-anchor="middle" class="fg-sub">{esc(sub)}</text>'
    else:
        out += f'<text x="{x + w / 2:.1f}" y="{y + h / 2 + 5:.1f}" text-anchor="middle" class="fg-title">{esc(title)}</text>'
    return out


def flow(spec, uid, label):
    items = [_parse_item(x) for x in spec.split('->')]
    boxes = []
    for t, s, a in items:
        w = max(116, max(len(t) * CW_TITLE, len(s) * CW_SUB) + 34)
        boxes.append(dict(t=t, s=s, a=a, w=w, h=66 if s else 52))
    max_w, gap, row_gap = 840, 46, 46
    rows, cur, cur_w = [], [], 0
    for b in boxes:
        add = b['w'] + (gap if cur else 0)
        if cur and cur_w + add > max_w:
            rows.append(cur); cur, cur_w = [], 0; add = b['w']
        cur.append(b); cur_w += add
    rows.append(cur)
    row_w = [sum(b['w'] for b in r) + gap * (len(r) - 1) for r in rows]
    W = max(row_w) + 24
    body, y, prev_last = '', 12, None
    for ri, r in enumerate(rows):
        rh = max(b['h'] for b in r)
        x = (W - row_w[ri]) / 2
        first = None
        for bi, b in enumerate(r):
            by = y + (rh - b['h']) / 2
            body += _box(x, by, b['w'], b['h'], b['t'], b['s'], b['a'])
            b['cx'], b['top'], b['bot'], b['x'] = x + b['w'] / 2, by, by + b['h'], x
            if bi > 0:
                p = r[bi - 1]
                body += f'<line x1="{p["x"] + p["w"] + 3:.1f}" y1="{y + rh / 2:.1f}" x2="{x - 3:.1f}" y2="{y + rh / 2:.1f}" class="fg-line" marker-end="url(#ah-{uid})"/>'
            x += b['w'] + gap
        if prev_last is not None:
            f = r[0]; mid = y - row_gap / 2
            body += (f'<path d="M{prev_last["cx"]:.1f} {prev_last["bot"] + 3:.1f} V{mid:.1f} H{f["cx"]:.1f} V{f["top"] - 3:.1f}" '
                     f'class="fg-line" fill="none" marker-end="url(#ah-{uid})"/>')
        prev_last = r[-1]
        y += rh + row_gap
    H = y - row_gap + 12
    return _svg(W, H, body, uid, label)


def sequence(spec, uid, label):
    lines = [l.strip() for l in spec.strip().splitlines() if l.strip()]
    parts = [p.strip() for p in lines[0].split('|')]
    msgs = []
    for l in lines[1:]:
        import re
        m = re.match(r'^(.+?)\s*(-->|->)\s*(.+?)\s*:\s*(.+)$', l)
        if not m:
            raise ValueError('bad sequence line: ' + l)
        msgs.append((m.group(1).strip(), m.group(3).strip(), m.group(2) == '-->', m.group(4).strip()))
    longest = max(len(m[3]) for m in msgs)
    spacing = max(210, min(320, longest * 6.9 + 50))
    W = spacing * len(parts)
    xs = {p: spacing * (i + .5) for i, p in enumerate(parts)}
    top, step = 14, 50
    H = top + 40 + 30 + step * len(msgs) + 10
    body = ''
    for p in parts:
        w = max(110, len(p) * CW_TITLE + 30)
        body += f'<line x1="{xs[p]:.1f}" y1="{top + 40}" x2="{xs[p]:.1f}" y2="{H - 6:.1f}" class="fg-life"/>'
        body += _box(xs[p] - w / 2, top, w, 38, p, '', True)
    y = top + 40 + 40
    for a, b, dashed, text in msgs:
        x1, x2 = xs[a], xs[b]
        d = 1 if x2 > x1 else -1
        body += (f'<line x1="{x1 + d * 4:.1f}" y1="{y}" x2="{x2 - d * 4:.1f}" y2="{y}" class="fg-line{" fg-dash" if dashed else ""}" marker-end="url(#ah-{uid})"/>')
        body += f'<text x="{(x1 + x2) / 2:.1f}" y="{y - 8}" text-anchor="middle" class="fg-msg">{esc(text)}</text>'
        y += step
    return _svg(W, H, body, uid, label)


def layers(spec, uid, label):
    """Stacked rows as a real list (reflows on any screen width, readable by screen readers)."""
    rows = [_parse_item(l) for l in spec.strip().splitlines() if l.strip()]
    items = ''.join(f'<li class="fgl-row{" fgl-accent" if a else ""}"><strong class="fgl-t">{esc(t)}</strong>'
                    f'<span class="fgl-s">{esc(s)}</span></li>' for t, s, a in rows)
    return f'<ul class="fg-layers" aria-label="{esc(label)}">{items}</ul>'


def tree(spec, uid, label):
    nodes = []
    for l in spec.rstrip().splitlines():
        if not l.strip():
            continue
        depth = (len(l) - len(l.lstrip(' '))) // 2
        t, s, a = _parse_item(l.strip())
        nodes.append(dict(t=t, a=a, d=depth, kids=[]))
    stack = []
    for n in nodes:
        while stack and stack[-1]['d'] >= n['d']:
            stack.pop()
        if stack:
            stack[-1]['kids'].append(n)
        stack.append(n)
    root = nodes[0]
    counter = [0]
    unit = max(len(n['t']) for n in nodes[1:] or nodes) * CW_MONO + 40

    def place(n):
        if not n['kids']:
            n['x'] = counter[0] * unit + unit / 2; counter[0] += 1
        else:
            for k in n['kids']:
                place(k)
            n['x'] = (n['kids'][0]['x'] + n['kids'][-1]['x']) / 2
    place(root)
    W = max(counter[0], 1) * unit
    maxd = max(n['d'] for n in nodes)
    lh, bh = 66, 34
    body = ''

    def draw(n):
        nonlocal body
        y = 10 + n['d'] * lh
        w = len(n['t']) * CW_MONO + 24
        for k in n['kids']:
            ky = 10 + k['d'] * lh
            mid = y + bh + (ky - y - bh) / 2
            body += f'<path d="M{n["x"]:.1f} {y + bh} V{mid:.1f} H{k["x"]:.1f} V{ky}" class="fg-line" fill="none"/>'
        for k in n['kids']:
            draw(k)
        cls = 'fg-box fg-accent' if n['a'] else 'fg-box'
        body += f'<rect x="{n["x"] - w / 2:.1f}" y="{y}" width="{w:.1f}" height="{bh}" rx="7" class="{cls}"/>'
        body += f'<text x="{n["x"]:.1f}" y="{y + bh / 2 + 4.5}" text-anchor="middle" class="fg-mono">{esc(n["t"])}</text>'
    draw(root)
    return _svg(W, 10 + maxd * lh + bh + 10, body, uid, label)


def anatomy(spec, uid, label):
    segs = []
    for part in spec.split(';'):
        t, lab = [p.strip() for p in part.split('|', 1)]
        segs.append((t, lab))
    cw = 12.0
    x = 20.0
    pos = []
    for t, lab in segs:
        w = len(t) * cw
        pos.append((x, w, t, lab))
        x += w
    W = x + 20
    body = ''
    colors = ['fg-c1', 'fg-c2', 'fg-c3', 'fg-c4']
    for i, (x0, w, t, lab) in enumerate(pos):
        body += f'<text x="{x0:.1f}" y="44" class="fg-code" textLength="{w:.1f}" lengthAdjust="spacing" xml:space="preserve">{esc(t)}</text>'
        body += f'<rect x="{x0 + 1:.1f}" y="54" width="{w - 2:.1f}" height="5" rx="2.5" class="fg-bar {colors[i % 4]}"/>'
        ly = 96 + (i % 2) * 34
        cx = x0 + w / 2
        body += f'<line x1="{cx:.1f}" y1="62" x2="{cx:.1f}" y2="{ly - 14}" class="fg-line"/>'
        body += f'<text x="{cx:.1f}" y="{ly}" text-anchor="middle" class="fg-title">{esc(lab)}</text>'
    return _svg(W, 150, body, uid, label)


def blocks(spec, uid, label):
    cols = []
    for part in spec.split(';'):
        if not part.strip():
            continue
        t, b = [p.strip() for p in part.split('|', 1)]
        import textwrap
        b = '\\n'.join(textwrap.wrap(b, 28)) or b
        cols.append((t, b))
    gap = 10
    ws = [max(len(t) * CW_TITLE, max(len(l) for l in b.split('\\n')) * CW_MONO) + 36 for t, b in cols]
    W = sum(ws) + gap * (len(cols) - 1) + 12
    x = 6
    body = ''
    cls = ['fg-c1', 'fg-c2', 'fg-c3', 'fg-c4']
    maxlines = max(len(b.split('\\n')) for t, b in cols)
    h = 44 + maxlines * 20 + 14
    for i, ((t, b), w) in enumerate(zip(cols, ws)):
        body += f'<rect x="{x:.1f}" y="8" width="{w:.1f}" height="{h}" rx="9" class="fg-box {cls[i % 4]}"/>'
        body += f'<text x="{x + 16:.1f}" y="34" class="fg-title">{esc(t)}</text>'
        for li, line in enumerate(b.split('\\n')):
            body += f'<text x="{x + 16:.1f}" y="{62 + li * 20}" class="fg-mono-s" xml:space="preserve">{esc(line)}</text>'
        x += w + gap
    return _svg(W, h + 16, body, uid, label)


def boxmodel(spec, uid, label):
    body = (
        '<rect x="10" y="10" width="440" height="270" rx="10" class="fg-box fg-c3"/>'
        '<text x="30" y="36" class="fg-title">margin</text>'
        '<rect x="60" y="52" width="340" height="206" rx="8" class="fg-box fg-c4"/>'
        '<text x="78" y="78" class="fg-title">border</text>'
        '<rect x="104" y="92" width="252" height="130" rx="6" class="fg-box fg-c2"/>'
        '<text x="120" y="116" class="fg-title">padding</text>'
        '<rect x="156" y="130" width="148" height="62" rx="5" class="fg-box fg-accent"/>'
        '<text x="230" y="166" text-anchor="middle" class="fg-title">content</text>'
        '<text x="230" y="30" text-anchor="middle" class="fg-sub">space outside the element</text>'
        '<text x="230" y="250" text-anchor="middle" class="fg-sub">the visible edge</text>'
        '<text x="230" y="214" text-anchor="middle" class="fg-sub">space inside, around content</text>')
    return _svg(460, 292, body, uid, label)


KINDS = dict(flow=flow, sequence=sequence, layers=layers, tree=tree, anatomy=anatomy, blocks=blocks, boxmodel=boxmodel)


def render(kind, spec, uid, label):
    if kind not in KINDS:
        raise ValueError('unknown diagram kind: ' + kind)
    return KINDS[kind](spec, uid, label)
