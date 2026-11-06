"""Split the prototype Home <main> into import markup per section.

Placeholders (empty divs with data-todo="<kind>-<n>") stand in for what the
WHTML importer can't make: images (built with the element builder so they
keep data-parallax / loading), icons (Icon Size instances), Secondary
buttons (Link + Button Color instance) and <button>s (DOM buttons).
Writes sec-<i>.html per section and todo.json.
"""
import json, re, sys

PROTO = sys.argv[1]
OUT = sys.argv[2]
ASSETS = json.load(open(sys.argv[3]))

src = open(PROTO + '/index.html').read()
main = re.search(r'<main[^>]*>(.*)</main>', src, re.S).group(1)

todo = []
def add(kind, **kw):
    n = len(todo)
    todo.append(dict(kind=kind, n=n, **kw))
    return f'{kind}-{n}'

def attrs_of(tag):
    return dict(re.findall(r'([a-zA-Z:-]+)="([^"]*)"', tag))

# Secondary buttons: a.button > .button-color.w-variant… > … label …
def repl_abutton(m):
    a_open, inner = m.group(1), m.group(2)
    label = re.search(r'<div class="button-content"><div>([^<]+)</div>', inner).group(1)
    variant = 'secondary' if 'w-variant-e13de0db' in inner else 'primary'
    key = add('btn', label=label, variant=variant, icon='ph ph-caret-right')
    return f'{a_open}<div data-todo="{key}"></div></a>'
main = re.sub(r'(<a class="button"[^>]*>)(.*?)</a>', repl_abutton, main, flags=re.S)

# Icons: svg inside a wrapper -> placeholder
CARET_R = 'M6.75 4.5L11.25 9L6.75 13.5'
def icon_for(wrapper_cls, svg):
    if 'faq-icon' in wrapper_cls:
        return None  # stays an SVG (repo CSS hides .faq-icon-bar when open)
    if CARET_R in svg or 'M4.57895 8.7132' in svg:
        return ['ph ph-caret-right']
    if 'M9 7L4 12L9 17' in svg:
        return ['ph ph-caret-left', 'ph ph-caret-right']
    if 'M14 10.9467' in svg:
        return ['ph ph-phone']
    if 'M9.1579 17.4264' in svg:
        return ['ph ph-caret-right']
    if 'M3.5 5.25L7 8.75' in svg:
        return ['ph ph-caret-down']
    if 'services-tab-icon' in wrapper_cls:
        return 'TAB'
    raise SystemExit('unknown svg in ' + wrapper_cls + ': ' + svg[:120])

tab_icons = iter(['ph ph-armchair', 'ph ph-warehouse', 'ph ph-desktop-tower', 'ph ph-leaf'])
def repl_icon(m):
    before, svg = m.group(1), m.group(2)
    opens = re.findall(r'<(?:div|span|a|button)\b[^>]*>', before)
    cls = attrs_of(opens[-1]).get('class', '') if opens else ''
    icons = icon_for(cls, svg)
    if icons is None:
        return m.group(0)
    if icons == 'TAB':
        icons = [next(tab_icons)]
    variant = '12px' if len(icons) == 2 else '16px'
    out = ''.join(f'<div data-todo="{add("icon", icon=i, variant=variant, wrapper=cls)}"></div>' for i in icons)
    return before + out
# every svg, with up to 300 chars of what precedes it to name its wrapper
main = re.sub(r'((?:(?!<svg)[\s\S]){0,300}?)(<svg\b.*?</svg>)', repl_icon, main, flags=re.S)

# Images
def repl_img(m):
    a = attrs_of(m.group(0))
    name = a['src'].split('/')[-1]
    extra = {k: v for k, v in a.items() if k.startswith('data-') or k in ('loading', 'fetchpriority')}
    if 'data-parallax' in m.group(0) and 'data-parallax' not in extra:
        extra['data-parallax'] = 'true'
    for k, v in list(extra.items()):
        if v == '':
            extra[k] = 'true'
    key = add('img', file=name, src=a['src'], asset=ASSETS.get(name, {}).get('id'),
              cls=a.get('class', '').split(), alt=a.get('alt', ''), attrs=extra)
    return f'<div data-todo="{key}"></div>'
main = re.sub(r'<img\b[^>]*>', repl_img, main)

# <button> -> placeholder div holding the children
def repl_button(m):
    a = attrs_of(m.group(1))
    # bare boolean data-* attributes
    for b in re.findall(r'\s(data-[a-z-]+)(?=\s|$)(?!=)', m.group(1)):
        a.setdefault(b, 'true')
    cls = a.pop('class', '').split()
    key = add('button', cls=cls, attrs=a)
    return f'<div data-todo="{key}">'
main = re.sub(r'<button\b([^>]*)>', repl_button, main)
main = main.replace('</button>', '</div>')

# strip variant tokens left anywhere
main = re.sub(r'\s*w-variant-[0-9a-f-]+', '', main)

# Webflow drops attributes without a value: give bare data-* attributes "true"
main = re.sub(r'(<[a-zA-Z][^>]*?\s)(data-[a-z-]+)(?=[\s>/])(?!=)', r'\1\2="true"', main)
while re.search(r'(<[a-zA-Z][^>]*?\s)(data-[a-z-]+)(?=[\s>/])(?!=)', main):
    main = re.sub(r'(<[a-zA-Z][^>]*?\s)(data-[a-z-]+)(?=[\s>/])(?!=)', r'\1\2="true"', main)
# whitespace between inline elements inside running text (only in <p>) is dropped by the importer
for p in set(re.findall(r'<p\b[^>]*>.*?</p>', main, re.S)):
    q = re.sub(r'(</(?:a|span|strong|em|b)>)\s+(<(?:a|span|strong|em|b)\b)', r'\1&nbsp;\2', p)
    if q != p:
        print('nbsp in', q[:80])
        main = main.replace(p, q)

# split into top-level elements by tag depth; name each by the comment before it
VOID = {'img', 'br', 'input', 'meta', 'link', 'source', 'hr', 'path', 'circle', 'rect', 'line'}
secs, depth, start, last_comment = [], 0, None, ''
for m in re.finditer(r'<!--(.*?)-->|<(/?)([a-zA-Z0-9]+)\b[^>]*?(/?)>', main, re.S):
    if m.group(1) is not None:
        if depth == 0:
            last_comment = m.group(1).strip()
        continue
    closing, tag, selfclose = m.group(2), m.group(3).lower(), m.group(4)
    if closing:
        depth -= 1
        if depth == 0:
            html = main[start:m.end()]
            html = re.sub(r'<!--.*?-->', '', html, flags=re.S)
            html = re.sub(r'\n\s*', '\n', html).strip()
            secs.append((last_comment.split('(')[0].strip(), html))
    elif tag in VOID or selfclose:
        continue
    else:
        if depth == 0:
            start = m.start()
        depth += 1

for i, (name, html) in enumerate(secs):
    open(f'{OUT}/sec-{i}.html', 'w').write(html)
    print(i, name, len(html), 'bytes',
          'todo:', ', '.join(sorted(set(re.findall(r'data-todo="([a-z]+)-', html)))))
json.dump(todo, open(f'{OUT}/todo.json', 'w'), indent=1)
from collections import Counter
print(Counter(t['kind'] for t in todo), 'missing assets:', sorted({t['file'] for t in todo if t['kind']=='img' and not t['asset']}))
