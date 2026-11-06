"""Compare a Webflow read-back with the import markup (sec-N.html), with the
placeholders resolved the way the build resolves them.

usage: cmp.py <marker of the read-back result> <label>=<sec file> ...
Each label is a query label in that result whose first match is the section root.
Prints differences, or OK per section.
"""
import json, re, subprocess, sys
from html.parser import HTMLParser

todo = {f"{t['kind']}-{t['n']}": t for t in json.load(open('todo.json'))}
VOID = {'img', 'br', 'input', 'path', 'circle', 'rect', 'line', 'source', 'meta', 'link', 'hr'}

def slug(name):
    return re.sub(r'\s+', '-', name.strip().lower())

def norm(t):
    return re.sub(r'\s+', ' ', t.replace('\xa0', ' ')).strip()

# ---------- expected, from import markup ----------
class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = {'tag': 'root', 'kids': []}
        self.stack = [self.root]
    def handle_starttag(self, tag, attrs):
        n = {'tag': tag, 'attrs': dict(attrs), 'kids': []}
        self.stack[-1]['kids'].append(n)
        if tag not in VOID:
            self.stack.append(n)
    def handle_startendtag(self, tag, attrs):
        self.stack[-1]['kids'].append({'tag': tag, 'attrs': dict(attrs), 'kids': []})
    def handle_endtag(self, tag):
        if tag in VOID:
            return
        while self.stack[-1]['tag'] != tag:
            self.stack.pop()
        self.stack.pop()
    def handle_data(self, d):
        if d.strip() or (d == '\xa0'):
            self.stack[-1]['kids'].append({'tag': '#text', 'text': d})

def expect(n, out, depth):
    if n['tag'] == '#text':
        out.append((depth, 'text', norm(n['text'])))
        return
    a = dict(n['attrs'])
    if 'data-todo' in a:
        t = todo[a['data-todo']]
        k = t['kind']
        if k == 'img':
            out.append((depth, 'img', ' '.join(t['cls']) + ' asset=' + str(t['asset']) + ' ' +
                        ' '.join(f'{x}={y}' for x, y in sorted(t['attrs'].items()))))
        elif k == 'icon':
            v = {'12px': 'd345939b-019f-e2df-81ad-4ea069bff178', '14px': 'be343e17-9894-2cac-5a01-9e068a36439f'}.get(t['variant'], 'base')
            out.append((depth, 'Icon Size', f"{t['icon']} {v}"))
        elif k == 'btn':
            out.append((depth, 'Button Color', f"{t['label']} {t['icon']} e13de0db-430f-b667-aee3-d545b7e6faea"))
        elif k == 'button':
            attrs = ' '.join(f'{x}={y}' for x, y in sorted(t['attrs'].items()))
            out.append((depth, 'button', ' '.join(t['cls']) + ' | ' + attrs))
            for c in n['kids']:
                expect(c, out, depth + 1)
        return
    cls = a.pop('class', '')
    href = a.pop('href', None)
    attrs = ' '.join(f'{x}={y}' for x, y in sorted(a.items()))
    tag = n['tag']
    out.append((depth, tag, f"{cls} | {attrs}" + (f' | href={href}' if href else '')))
    if tag == 'svg':
        return  # svg content compared by count only
    for c in n['kids']:
        expect(c, out, depth + 1)

# ---------- actual, from read-back ----------
def actual(e, out, depth):
    t = e.get('type')
    if t == 'String':
        out.append((depth, 'text', norm(e.get('textContent', ''))))
        return
    if t == 'ComponentInstance':
        d = e['instanceDetails']
        props = {p['name']: p['value'] for p in d['props']}
        if d['name'] == 'Icon Size':
            out.append((depth, 'Icon Size', f"{props['Icon']} {props['Variant']}"))
        elif d['name'] == 'Button Color':
            out.append((depth, 'Button Color', f"{props['Label']} {props['Icon']} {props['Variant']}"))
        else:
            out.append((depth, d['name'], ''))
        return
    s = e.get('settings', {})
    a = dict(e.get('attributes') or {})
    cls = ' '.join(slug(x) for x in e.get('styleNames', []))
    if t == 'Image':
        out.append((depth, 'img', cls + ' asset=' + str(s.get('assetId')) + ' ' +
                    ' '.join(f'{x}={y}' for x, y in sorted(a.items()))))
        return
    if t == '':
        out.append((depth, 'br', ' | '))
        return
    tag = s.get('tag') or {'Heading': f"h{s.get('headingLevel')}", 'Paragraph': 'p', 'Link': 'a',
                            'Span': 'span', 'LineBreak': 'br'}.get(t, t)
    if t == 'Link':
        tag = 'a'
    href = a.pop('href', None) or (s.get('link') or {}).get('href')
    if tag == 'button':
        out.append((depth, 'button', cls + ' | ' + ' '.join(f'{x}={y}' for x, y in sorted(a.items()))))
    else:
        out.append((depth, tag, f"{cls} | {' '.join(f'{x}={y}' for x, y in sorted(a.items()))}" + (f' | href={href}' if href else '')))
    if tag == 'svg':
        return
    for c in e.get('children', []):
        actual(c, out, depth + 1)

def merge_text(rows):
    res = []
    for r in rows:
        if r[1] == 'text' and res and res[-1][1] == 'text' and res[-1][0] == r[0]:
            res[-1] = (r[0], 'text', norm(res[-1][2] + ' ' + r[2]))
        else:
            res.append(r)
    return [r for r in res if not (r[1] == 'text' and r[2] == '')]

marker = sys.argv[1]
import os
if os.path.exists(marker):
    txt, objs, dec, i = open(marker).read(), [], json.JSONDecoder(), 0
    while i < len(txt):
        j = txt.find('{', i)
        if j < 0:
            break
        try:
            o, i = dec.raw_decode(txt, j)
            objs.append(o)
        except json.JSONDecodeError:
            i = j + 1
else:
    objs = json.loads(subprocess.check_output(['python3', '-I', 'lastres.py', marker]))
matches = {}
for o in objs:
    for q in o.get('result', []):
        for d in (q.get('data') or []):
            if isinstance(d, dict) and d.get('matches'):
                matches[d['label']] = d['matches'][0]
bad = 0
for spec in sys.argv[2:]:
    label, f = spec.split('=')
    p = P(); p.feed(open(f).read())
    exp, act = [], []
    for c in p.root['kids']:
        expect(c, exp, 0)
    actual(matches[label], act, 0)
    exp, act = merge_text(exp), merge_text(act)
    import difflib
    diff = [l for l in difflib.unified_diff([f"{'  '*d}{k} {v}" for d, k, v in exp],
                                            [f"{'  '*d}{k} {v}" for d, k, v in act], 'expected', 'webflow', n=1, lineterm='')]
    print(f'== {label} ({f}): {len(exp)} expected, {len(act)} in Webflow', 'OK' if not diff else f'{len(diff)} diff lines')
    for l in diff[:80]:
        print(l)
    bad += bool(diff)
sys.exit(1 if bad else 0)
