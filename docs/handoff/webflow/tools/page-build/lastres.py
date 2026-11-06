"""Print the latest MCP tool result (from this session's transcript) that
contains a marker, as parsed JSON objects.

usage: TRANSCRIPT=<session .jsonl> lastres.py <marker> [todo-map]
  todo-map: print {data-todo value: element id} for placeholder queries.
"""
import json, os, sys

T = os.environ['TRANSCRIPT']  # the Claude Code session's .jsonl
marker = sys.argv[1]

def texts(o):
    if isinstance(o, dict):
        if o.get('type') == 'tool_result':
            c = o.get('content')
            if isinstance(c, str):
                yield c
            elif isinstance(c, list):
                yield ''.join(x['text'] for x in c if isinstance(x, dict) and x.get('type') == 'text')
        for v in o.values():
            yield from texts(v)
    elif isinstance(o, list):
        for v in o:
            yield from texts(v)

found = None
for line in open(T):
    if marker not in line and marker.replace('"', '\\"') not in line:
        continue
    for t in texts(json.loads(line)):
        if marker in t and t.lstrip().startswith(("{\"label\"", "[{\"build_label\"", "[{\"label\"")):
            found = t
objs, dec, i = [], json.JSONDecoder(), 0
while found and i < len(found):
    while i < len(found) and found[i] in ' \n':
        i += 1
    if i >= len(found):
        break
    try:
        o, i = dec.raw_decode(found, i)
        objs.append(o)
    except json.JSONDecodeError:
        j = found.find('{', i + 1)
        if j < 0:
            break
        i = j

if len(sys.argv) > 2 and sys.argv[2] == 'todo-map':
    m = {}
    def walk(o):
        if isinstance(o, dict):
            a = o.get('attributes') or {}
            if 'data-todo' in a:
                m[a['data-todo']] = o['id']['element']
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(objs)
    print(json.dumps(m))
else:
    print(json.dumps(objs))
