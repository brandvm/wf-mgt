"""Compare a get_styles/query_styles read-back with the actions that were sent.

usage: python3 verify.py <readback.json|txt> <create.json> <updates.json> [selectors...]
The read-back can be the raw tool output saved by the harness (JSON array of
{type,text}) or the text itself. Only classes found in the read-back are
checked unless selectors are given.
"""
import json, re, sys

rb_path, cr_path, up_path, *only = sys.argv[1:]
raw = open(rb_path).read()
try:
    arr = json.loads(raw)
    if isinstance(arr, list) and arr and "text" in arr[0]:
        raw = "".join(x["text"] for x in arr)
except Exception:
    pass

styles = []
dec = json.JSONDecoder()
i = 0
while i < len(raw):
    j = raw.find("{", i)
    if j < 0:
        break
    obj, i = dec.raw_decode(raw, j)
    res = obj.get("result", [])
    for r in res:
        styles += r.get("matches", [r]) if isinstance(r, dict) else []

by_sel = {s["selector"]: s for s in styles if "selector" in s}


def norm(p):
    if "variable_as_value" in p:
        return {"id": p["variable_as_value"]}
    return p["property_value"]


def sel_of(name, parents):
    return "." + ".".join(re.sub(r"[^a-z0-9]+", "-", n.lower().replace(" | ", "-")).strip("-") for n in parents + [name])


expect = {}
for a in json.load(open(cr_path)):
    c = a["create_style"]
    expect.setdefault(sel_of(c["name"], c.get("parent_style_names", [])), {})[("base", "")] = {p["property_name"]: norm(p) for p in c["properties"]}
for a in json.load(open(up_path)):
    u = a["update_style"]
    k = (u.get("breakpoint_id", "base"), u.get("pseudo", ""))
    expect.setdefault(sel_of(u["style_name"], u.get("parent_style_names", [])), {}).setdefault(k, {}).update({p["property_name"]: norm(p) for p in u["properties"]})

bad = 0
checked = 0
for sel, rules in expect.items():
    if only and sel not in only:
        continue
    if sel not in by_sel:
        if only:
            print("MISSING", sel); bad += 1
        continue
    checked += 1
    got = by_sel[sel].get("properties", {})
    for (bp, ps), props in rules.items():
        if bp == "base":
            node = got.get("base", {})
        else:
            node = got.get("breakpoints", {}).get(bp, {})
        gp = node.get("pseudos", {}).get(ps, {}) if ps else node.get("properties", {})
        for k, v in props.items():
            if gp.get(k) != v:
                print(f"DIFF {sel} @{bp}:{ps} {k}: sent {v!r} got {gp.get(k)!r}"); bad += 1
print(f"checked {checked} classes, {bad} differences")
