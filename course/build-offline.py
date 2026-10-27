#!/usr/bin/env python3
"""Builds a single-file offline edition: offline/course-offline.html

Inlines CSS, every script, all lesson HTML, the code-runner and the SQL engine (WebAssembly,
base64) so it works by double-clicking the file (file://) with no server and no internet."""
import base64, json, pathlib, re, urllib.parse
root = pathlib.Path(__file__).parent
rd = lambda p: (root / p).read_text(encoding='utf-8')
safe = lambda s: s.replace('</script', '<\\/script')

css = rd('css/style.css')
html = rd('index.html')
mods = {p.stem: p.read_text(encoding='utf-8') for p in (root / 'modules').glob('*.html')}
icon = rd('assets/icon.svg').replace('\n', '')
wasm = base64.b64encode((root / 'vendor/sql/sql-wasm.wasm').read_bytes()).decode()

html = re.sub(r'<link rel="stylesheet"[^>]*>', lambda m: f'<style>{css}</style>', html)
html = re.sub(r'<link rel="manifest"[^>]*>\n?', '', html)
html = re.sub(r'<link rel="apple-touch-icon"[^>]*>\n?', '', html)
html = re.sub(r'<link rel="icon"[^>]*>', lambda m: '<link rel="icon" href="data:image/svg+xml,' + urllib.parse.quote(icon) + '">', html)

data = json.dumps(mods).replace('</', '<\\/')
pre = ('<script>window.__MODULES_HTML__=' + data + ';</script>\n'
       '<script>window.__RUNNER_SRC__=' + json.dumps(rd('js/runner.js')).replace('</', '<\\/') + ';</script>\n'
       '<script>window.__SQL_WASM_B64__="' + wasm + '";</script>\n'
       '<script>' + safe(rd('vendor/sql/sql-wasm.js')) + '</script>\n')
first = True
def inline(m):
    global first
    src = m.group(1)
    out = (pre if first else '') + '<script>' + safe(rd(src)) + '</script>'
    first = False
    return out
html = re.sub(r'<script src="(js/[^"]+)"></script>', inline, html)
assert not re.search(r'<script src=', html), 'unreplaced external script'
out = root / 'offline'
out.mkdir(exist_ok=True)
(out / 'course-offline.html').write_text(html, encoding='utf-8')
print('Wrote', out / 'course-offline.html', f'({len(html)//1024} KB)')
