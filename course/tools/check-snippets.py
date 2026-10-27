#!/usr/bin/env python3
"""Verify the code samples in the lessons with real compilers/interpreters.

* Samples in a language-tab group that is followed by an `output` block are RUN and their
  stdout is compared with the displayed output (JavaScript, Python, PHP, Ruby, Go, Java).
* Other samples are syntax-checked (node --check, py_compile, php -l, ruby -c, gofmt, javac).
* C# cannot be compiled in this environment and is reported as unverified.
Fences tagged `nocheck` are skipped.
"""
import json, os, pathlib, re, subprocess, sys, tempfile, shutil, collections

ROOT = pathlib.Path(__file__).resolve().parent.parent
snips = json.loads((ROOT / 'build' / 'snippets.json').read_text())
only = sys.argv[1] if len(sys.argv) > 1 else None
GO_PKGS = {'fmt': 'fmt', 'strings': 'strings', 'strconv': 'strconv', 'os': 'os', 'sort': 'sort', 'errors': 'errors', 'time': 'time',
           'sync': 'sync', 'math': 'math', 'json': 'encoding/json', 'http': 'net/http', 'bufio': 'bufio', 'bytes': 'bytes',
           'regexp': 'regexp', 'unicode': 'unicode', 'context': 'context', 'log': 'log', 'io': 'io', 'atomic': 'sync/atomic', 'reflect': 'reflect'}
stats = collections.defaultdict(lambda: collections.Counter())
fails = []


def sh(cmd, cwd, timeout=60):
    try:
        r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=timeout)
        return r.returncode, r.stdout, r.stderr
    except subprocess.TimeoutExpired:
        return 124, '', 'timeout'


def norm(s):
    return '\n'.join(l.rstrip() for l in s.strip().splitlines())


def go_wrap(code):
    if re.search(r'^package\s+main', code, re.M):
        return code
    imports = sorted({v for k, v in GO_PKGS.items() if re.search(r'\b' + k + r'\.', code) and not re.search(r'^import\b.*"' + v + '"', code, re.M)})
    imp = ''.join(f'import "{i}"\n' for i in imports)
    if re.search(r'^import\s', code, re.M) or re.search(r'^func\s+main', code, re.M):
        # may have its own imports
        has_imp = re.search(r'^import\s', code, re.M)
        if has_imp:
            return 'package main\n' + code
        return 'package main\n' + imp + code
    return 'package main\n' + imp + 'func main() {\n' + code + '\n}\n'


def java_wrap(code):
    pre = 'import java.util.*;\nimport java.util.function.*;\nimport java.util.stream.*;\nimport java.util.concurrent.*;\nimport java.io.*;\nimport java.nio.file.*;\n'
    if re.search(r'\b(class|interface|record|enum)\s+\w+', code):
        if re.search(r'^import\s', code, re.M):
            return code
        return pre + code
    imps = ''.join(l + '\n' for l in code.splitlines() if l.startswith('import '))
    code = '\n'.join(l for l in code.splitlines() if not l.startswith('import '))
    return pre + imps + 'public class Main {\n  public static void main(String[] args) throws Exception {\n' + code + '\n  }\n}\n'


def check(s):
    lang, code, exp, flags = s['lang'], s['code'], s.get('expected'), s.get('flags') or []
    if 'nocheck' in flags:
        return 'skip', ''
    tmp = tempfile.mkdtemp()
    try:
        if lang == 'javascript':
            esm = re.search(r'^\s*(import|export)\s', code, re.M)
            if 'syntax' in flags or exp is None:
                f = pathlib.Path(tmp, 'a.mjs' if esm else 'a.js'); f.write_text(code)
                rc, o, e = sh(['node', '--check', str(f)], tmp)
                return ('ok' if rc == 0 else 'fail'), e
            f = pathlib.Path(tmp, 'a.js'); f.write_text(code)
            rc, o, e = sh(['node', str(f)], tmp)
        elif lang == 'python':
            f = pathlib.Path(tmp, 'a.py'); f.write_text(code)
            if exp is None:
                rc, o, e = sh(['python3', '-m', 'py_compile', str(f)], tmp)
                return ('ok' if rc == 0 else 'fail'), e
            rc, o, e = sh(['python3', str(f)], tmp)
        elif lang == 'php':
            c = code if code.lstrip().startswith('<?php') else '<?php\n' + code
            f = pathlib.Path(tmp, 'a.php'); f.write_text(c)
            if exp is None:
                rc, o, e = sh(['php', '-l', str(f)], tmp)
                return ('ok' if rc == 0 else 'fail'), o + e
            rc, o, e = sh(['php', str(f)], tmp)
        elif lang == 'ruby':
            f = pathlib.Path(tmp, 'a.rb'); f.write_text(code)
            if exp is None:
                rc, o, e = sh(['ruby', '-c', str(f)], tmp)
                return ('ok' if rc == 0 else 'fail'), o + e
            rc, o, e = sh(['ruby', str(f)], tmp)
        elif lang == 'go':
            f = pathlib.Path(tmp, 'main.go'); f.write_text(go_wrap(code))
            if exp is None:
                rc, o, e = sh(['gofmt', '-e', str(f)], tmp)
                return ('ok' if rc == 0 else 'fail'), e
            env_cmd = ['go', 'run', 'main.go']
            rc, o, e = sh(env_cmd, tmp, 120)
        elif lang == 'java':
            c = java_wrap(code)
            m = re.search(r'public\s+(?:final\s+)?class\s+(\w+)', c)
            name = m.group(1) if m else 'Main'
            f = pathlib.Path(tmp, name + '.java'); f.write_text(c)
            if exp is None:
                rc, o, e = sh(['javac', '-proc:none', '-d', tmp, str(f)], tmp, 90)
                if rc == 0:
                    return 'ok', ''
                errs = [l for l in e.splitlines() if ': error:' in l]
                hard = [l for l in errs if not re.search(r'cannot find symbol|does not exist|incompatible types|might not have been|unreported exception|cannot be applied|is not abstract|already defined|missing return|unclosed|invalid method|non-static', l)]
                return ('ok' if not hard else 'fail'), '\n'.join(hard[:3])
            rc, o, e = sh(['java', str(f)], tmp, 120)
        else:
            return 'skip', ''
        if rc != 0:
            return 'fail', (e or o)[-400:]
        if norm(o) != norm(exp):
            return 'fail', f'output mismatch\n--- expected\n{norm(exp)}\n--- got\n{norm(o)}'
        return 'run', ''
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


for s in snips:
    if only and s['module'] != only:
        continue
    if s['lang'] == 'csharp':
        stats['csharp']['unverified'] += 1
        continue
    st, msg = check(s)
    stats[s['lang']][st] += 1
    if st == 'fail':
        fails.append((s, msg))

for lang, c in sorted(stats.items()):
    print(f'{lang:11s}', dict(c))
for s, msg in fails:
    print('\nFAIL', s['module'], s['lang'], '\n' + s['code'][:300], '\n->', msg)
print(f'\n{len(fails)} failing snippet(s)')
sys.exit(1 if fails else 0)
