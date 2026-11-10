"""Blog pages (prototype/blog/index.html and the post template page) into
import markup per section; svc-prep.py adapted: card grids keep one card,
the filter tabs become one placeholder (built as a DOM form for Finsweet
List), the Load more button is left to the list's pagination.

usage: svc-prep.py <prototype page> <out dir> <assets.json {displayName: {id}}>

Placeholders (empty divs with data-todo="<kind>-<n>"), resolved after the
WHTML import:
  icon   <div class="icon[ w-variant-…]"><i class="icon-glyph ph …"> → Icon Size instance (Icon prop, Variant)
  btn    a.button's inside → Button Color instance (Label, Icon, Variant)
  img    <img> → Image built with the element builder (class, attributes); data-field = CMS image to bind
  rich   a Rich Text element (class list, data-field = CMS rich text to bind)
  button <button> → DOM button with its attributes, the placeholder's children moved in
data-field / data-condition attributes stay on the imported elements so the
binding step can find them (query_elements attribute_name data-field); remove
them when bound. Only the first FAQ item is kept: it becomes the FAQs list's
item. Writes sec-<i>.html and todo.json.
"""
import json, re, sys

PROTO, OUT = sys.argv[1], sys.argv[2]
ASSETS = json.load(open(sys.argv[3]))
VARIANT_NAMES = {'d345939b-019f-e2df-81ad-4ea069bff178': '12px', 'be343e17-9894-2cac-5a01-9e068a36439f': '14px',
                 'd9b45e0b-d9ad-95e4-d5c6-8074032e905f': '20px', '7bce87e3-ab9e-6f63-a957-78d54b4abbad': '24px'}

src = open(PROTO).read()
main = re.search(r'<main[^>]*>(.*)</main>', src, re.S).group(1)

todo = []
def add(kind, **kw):
    todo.append(dict(kind=kind, n=len(todo), **kw))
    return f'{kind}-{len(todo) - 1}'

def attrs_of(tag):
    a = dict(re.findall(r'([a-zA-Z:-]+)="([^"]*)"', tag))
    for b in re.findall(r'\s(data-[a-z-]+)(?=[\s>])(?!=)', tag):
        a.setdefault(b, 'true')
    return a

def div_end(html, start, tag='div'):
    """Index just after the closing tag of the element that opens at start."""
    depth = 0
    for m in re.finditer(r'<(/?)%s\b[^>]*>' % tag, html[start:]):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return start + m.end()

# Card grids: keep the first card only; it becomes the Collection Item's content.
pos = 0
while True:
    g = main.find('<div class="card-grid"', pos)
    if g < 0:
        break
    first = main.index('<a class="article-card"', g)
    first_end = div_end(main, first, 'a')
    grid_end = div_end(main, g)
    main = main[:first_end] + '\n</div>' + main[grid_end:]
    pos = g + 1
# Segmented filter tabs -> one placeholder (built as a DOM form for Finsweet List)
seg = main.find('<div class="segmented')
if seg >= 0:
    main = main[:seg] + f'<div data-todo="{add("filters")}"></div>' + main[div_end(main, seg):]
# The listing's Load more button is the Collection List's pagination (Designer)
main = re.sub(r'<div class="button-row is-center">\s*<a class="button" href="#" data-fs="[^"]*">.*?</a>\s*</div>', '', main, flags=re.S)
# data-fs notes: the card chip carries the Finsweet field; the rest are notes for the list
main = main.replace(' data-fs="fs-list-field=category"', ' fs-list-field="category"')
main = re.sub(r' data-fs="[^"]*"', '', main)
main = re.sub(r' data-category="[^"]*"', '', main)
main = main.replace(' data-filter-keep', '').replace(' data-filter-list', '')
# <span data-field> inside the featured meta line -> DOM spans built later
# a.button: the whole inside becomes one Button Color instance
def repl_abutton(m):
    a_open, inner = m.group(1), m.group(2)
    label = re.search(r'<div class="button-content"><div>([^<]+)</div>', inner).group(1)
    variant = 'secondary' if 'w-variant-e13de0db' in inner else 'primary'
    return f'{a_open}<div data-todo="{add("btn", label=label, variant=variant, icon="ph ph-caret-right")}"></div></a>'
main = re.sub(r'(<a class="button"[^>]*>)(.*?)</a>', repl_abutton, main, flags=re.S)

# Phosphor icons
def repl_icon(m):
    variant = VARIANT_NAMES.get(m.group(1) or '', '16px')
    name = m.group(2).strip()
    return f'<div data-todo="{add("icon", icon=("ph " + name).strip(), variant=variant)}"></div>'
main = re.sub(r'<div class="icon(?: w-variant-([0-9a-f-]+))?"><i aria-hidden="true" class="icon-glyph ph ?([^"]*)"></i></div>', repl_icon, main)

# Rich text: the element with data-field and HTML content
def repl_rich(m):
    a = attrs_of(m.group(1))
    return f'<div data-todo="{add("rich", cls=a.get("class", "").split(), field=a["data-field"], sample=m.group(2)[:60])}"></div>'
main = re.sub(r'<div (class="rich-body[^"]*" data-field="[^"]+")>(.*?)\n\s*</div>\n(?=\s*<aside)', repl_rich, main, flags=re.S)

# Images
def repl_img(m):
    a = attrs_of(m.group(0))
    name = a['src'].split('/')[-1]
    extra = {k: v for k, v in a.items() if (k.startswith('data-') and k != 'data-field') or k in ('loading', 'fetchpriority')}
    # a bound image is built with a stand-in asset (hero.webp), then bound
    asset = ASSETS.get(name, {}).get('id') or (ASSETS['hero.webp']['id'] if a.get('data-field') else None)
    key = add('img', file=name, asset=asset, field=a.get('data-field'),
              cls=a.get('class', '').split(), alt=a.get('alt', ''), attrs=extra)
    return f'<div data-todo="{key}"></div>'
main = re.sub(r'<img\b[^>]*>', repl_img, main)

# <button> -> placeholder div holding the children
def repl_button(m):
    a = attrs_of('<button' + m.group(1) + '>')
    cls = a.pop('class', '').split()
    return f'<div data-todo="{add("button", cls=cls, attrs=a)}">'
main = re.sub(r'<button\b([^>]*)>', repl_button, main)
main = main.replace('</button>', '</div>')

main = re.sub(r'\s*w-variant-[0-9a-f-]+', '', main)
while re.search(r'(<[a-zA-Z][^>]*?\s)(data-[a-z-]+)(?=[\s>/])(?!=)', main):
    main = re.sub(r'(<[a-zA-Z][^>]*?\s)(data-[a-z-]+)(?=[\s>/])(?!=)', r'\1\2="true"', main)
# the Item Icons value is bound later; keep the attribute with a stand-in
main = re.sub(r'data-item-icons="[^"]*"', 'data-item-icons="bind"', main)
main = main.replace(' data-field="Item Icons (attribute)"', '')

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
            html = re.sub(r'<!--.*?-->', '', main[start:m.end()], flags=re.S)
            secs.append((last_comment.split(':')[0].strip(), re.sub(r'\n\s*', '\n', html).strip()))
    elif tag in VOID or selfclose:
        continue
    else:
        if depth == 0:
            start = m.start()
        depth += 1

for i, (name, html) in enumerate(secs):
    open(f'{OUT}/sec-{i}.html', 'w').write(html)
    print(i, name, len(html), 'bytes', 'todo:', ', '.join(sorted(set(re.findall(r'data-todo="([a-z]+)-', html)))))
json.dump(todo, open(f'{OUT}/todo.json', 'w'), indent=1)
from collections import Counter
print(Counter(t['kind'] for t in todo), 'missing assets:', sorted({t['file'] for t in todo if t['kind'] == 'img' and not t['asset']}))
