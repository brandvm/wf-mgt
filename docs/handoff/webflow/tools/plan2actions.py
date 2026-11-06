"""Turn styles-plan.json entries into data_style_tool actions.

usage: python3 plan2actions.py <plan> <variable-ids.json> <sel.json> <out-dir>
Writes create.json (one create per class, main/no-state props), updates.json
(breakpoint/state rules), modes.json, notes.json (what was dropped and why).
"""
import json, re, sys

plan, ids, sel, out = sys.argv[1:5]
P = json.load(open(plan))
V = json.load(open(ids))
S = json.load(open(sel))

SEM = V["collections"]["semantic"]
STY = V["collections"]["styles"]
MODES = V["modes"]
NAV = MODES["colors_semantic_nav"]
NAV_OPEN = MODES["colors_semantic_nav_open"]

varmap = {}
for coll, d in V["variables"].items():
    base = coll.split(" (")[0]
    for name, vid in d.items():
        varmap[f"{base}/{name}"] = vid

notes, missing = [], set()


def css_name(key):
    coll, *path = key.split("/")
    slug = lambda s: re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return f"--_{slug(coll)}---" + "--".join(slug(p) for p in path)


cssmap = {css_name(k): k for k in varmap}

# The plan leaves out any property whose variable was missing from the
# snapshot it was built from, and lists it in checkFirst instead. Put those
# back when the variable exists in Webflow now; report the rest.
BP = {"Tablet": "medium", "Mobile Landscape": "small", "Mobile": "tiny"}
CF = re.compile(r"^(?P<sel>\.[\w.-]+?)(?::(?P<state>[a-z-]+))?(?: @(?P<bp>[\w ]+?))?: (?P<prop>[a-z-]+) reads (?P<var>--[\w-]+),")
restored = {}
for msg in P.get("checkFirst", []):
    m = CF.match(msg)
    if not m:
        notes.append(f"checkFirst not parsed: {msg}")
        continue
    key = (m["sel"], BP.get(m["bp"], "main") if m["bp"] else "main", m["state"] or "")
    if m["var"] in cssmap:
        restored.setdefault(key, []).append({"property": m["prop"], "variable": cssmap[m["var"]]})
    else:
        notes.append(f"{m['sel']}: {m['prop']} reads {m['var']}, not a Webflow variable (repo CSS or JS)")


def vid(name):
    if name in varmap:
        return varmap[name]
    missing.add(name)
    return None


def split_list(v):
    return [p.strip() for p in v.split(",")]


def expand(prop, value=None, variable=None, sel=""):
    """Return a list of API property dicts for one CSS declaration."""
    if variable:
        if prop == "row-gap":
            prop = "grid-row-gap"
        if prop == "column-gap":
            prop = "grid-column-gap"
        if prop in ("outline-width", "accent-color"):
            # The style API refuses variables on these (lessons/mcp.md, GOTCHAS).
            notes.append(f"{sel}: {prop} variable {variable} -> needs a literal")
            return []
        return [{"property_name": prop, "variable_as_value": vid(variable)}]
    v = value
    if prop == "transition":
        props, durs, eases = [], [], []
        for part in split_list(v):
            bits = part.split()
            props.append(bits[0])
            d = next((b for b in bits[1:] if re.match(r"^[\d.]+m?s$", b)), "0s")
            durs.append("0" + d if d.startswith(".") else d)
            eases.append(next((b for b in bits[1:] if not re.match(r"^[\d.]+m?s$", b)), "ease"))
        return [
            {"property_name": "transition-property", "property_value": ", ".join(props)},
            {"property_name": "transition-duration", "property_value": ", ".join(durs)},
            {"property_name": "transition-timing-function", "property_value": ", ".join(eases)},
        ]
    if prop in ("border", "border-top", "border-right", "border-bottom", "border-left"):
        sides = ["top", "right", "bottom", "left"] if prop == "border" else [prop.split("-")[1]]
        if v.split()[0] in ("0", "0px", "none"):
            r = []
            for side in sides:
                r += [{"property_name": f"border-{side}-width", "property_value": "0px"},
                      {"property_name": f"border-{side}-style", "property_value": "none"}]
            return r
        m = re.match(r"^(\S+)\s+(solid|dashed|dotted|double)\s+(.+)$", v)
        if m:
            r = []
            for side in sides:
                r += [{"property_name": f"border-{side}-width", "property_value": m[1]},
                      {"property_name": f"border-{side}-style", "property_value": m[2]},
                      {"property_name": f"border-{side}-color", "property_value": m[3]}]
            return r
    if prop == "flex":
        parts = {"none": ["0", "0", "auto"], "auto": ["1", "1", "auto"], "1": ["1", "1", "0%"]}.get(v) or v.split()
        if len(parts) == 3:
            basis = "0%" if parts[2] == "0" else parts[2]
            return [{"property_name": "flex-grow", "property_value": parts[0]},
                    {"property_name": "flex-shrink", "property_value": parts[1]},
                    {"property_name": "flex-basis", "property_value": basis}]
    if prop == "background-image" and 'url("/' in v:
        notes.append(f"{sel}: background-image {v} is a prototype file; upload it as an asset and set it in the Designer")
        return []
    if prop == "list-style" and v == "none":
        return [{"property_name": "list-style-type", "property_value": "none"}]
    if prop == "clip":
        notes.append(f"{sel}: clip dropped (no Designer property; position/size/overflow already hide it)")
        return []
    if prop.startswith("-webkit-"):
        notes.append(f"{sel}: {prop} dropped (repo CSS)")
        return []
    if re.match(r"^\.?\d", v):
        v = "0" + v if v.startswith(".") else v
    v = re.sub(r"(?<![\d])\.(\d)", r"0.\1", v)
    return [{"property_name": prop, "property_value": v}]


TYPO = re.compile(r"--_typography-role---[a-z-]+?--([a-z0-9-]+)\)")
ROLE_MODE = {re.sub(r"[^a-z0-9]+", "-", k.lower()): k for k in MODES["typography_styles"] if k != "Base"}


def byhand(h, sel):
    """Return (props, mode) for a by-hand item."""
    p, v = h["property"], h["value"]
    m = re.match(r"^(\S+) (solid|dashed|dotted) ⟨(.+)⟩$", v)
    if m and p.startswith("border"):
        sides = ["top", "right", "bottom", "left"] if p == "border" else [p.split("-")[1]]
        r = []
        for s in sides:
            r += [{"property_name": f"border-{s}-width", "property_value": m[1]},
                  {"property_name": f"border-{s}-style", "property_value": m[2]},
                  {"property_name": f"border-{s}-color", "variable_as_value": vid(m[3])}]
        return r, None
    # calc(var + x) can't be stored; bind to its computed Layout variable
    # (GOTCHAS / lessons: one Size variable per calc, a value per mode).
    m = re.match(r"^calc\(⟨Layout/Nav/Height⟩ \+ (.+)\)$", v)
    if m:
        part = re.sub(r"⟨Spacing/(\d+)⟩", r"Spacing \1", m[1])
        return [{"property_name": p, "variable_as_value": vid(f"Layout/Calc/Nav Height + {part}")}], None
    if p.startswith("--_typography-styles---"):
        role = TYPO.search(v).group(1)
        return [], ("typo", ROLE_MODE[role])
    if p.startswith("--_colors-semantic---"):
        return [], ("sem", None)
    notes.append(f"{sel}: by hand {p}: {v} (not handled)")
    return [], None


def dedupe(props):
    """Later declarations win, as in CSS (e.g. `border: 0` then `border-top`)."""
    last = {p["property_name"]: p for p in props}
    return [p for i, p in enumerate(props) if last[p["property_name"]] is p]


creates, updates, modes = [], [], []
for i in S:
    c = P["classes"][i]
    names = c["names"]
    name, parents = names[-1], names[:-1]
    sel = c["selector"]
    base_props, rule_updates, cmode = [], [], {}
    rules = [dict(r) for r in c["rules"]]
    have = {(r["breakpoint"], r["state"]) for r in rules}
    for (s, bp, st), extra in restored.items():
        if s == sel and (bp, st) not in have:
            rules.append({"breakpoint": bp, "state": st, "connector": [], "byHand": []})
    for r in rules:
        props = []
        for d in r["connector"] + restored.get((sel, r["breakpoint"], r["state"]), []):
            props += expand(d["property"], d.get("value"), d.get("variable"), sel)
        for h in r["byHand"]:
            bp, mode = byhand(h, sel)
            props += bp
            if mode:
                kind, val = mode
                if kind == "sem":
                    decl = {x["property"]: x["value"] for x in r["byHand"]}
                    nav_bg = decl.get("--_colors-semantic---background--nav", "")
                    light = "text--ink" in decl.get("--_colors-semantic---text--primary", "")
                    # The prototype's semantic blocks are the nav bar (navy
                    # Background/Nav), the open nav (white), a dark section
                    # (white text) or a light card reset inside one (ink text).
                    if nav_bg:
                        val = NAV_OPEN if "base--white" in nav_bg else NAV
                    else:
                        val = "base" if light else MODES["colors_semantic_dark"]
                    cmode[(r["breakpoint"], r["state"], SEM)] = val
                else:
                    cmode[(r["breakpoint"], r["state"], STY)] = MODES["typography_styles"][val]
        props = dedupe(props)
        if r["breakpoint"] == "main" and r["state"] == "":
            base_props += props
        elif props:
            u = {"style_name": name, "properties": props}
            if parents:
                u["parent_style_names"] = parents
            if r["breakpoint"] != "main":
                u["breakpoint_id"] = r["breakpoint"]
            if r["state"]:
                u["pseudo"] = {"pressed": "active"}.get(r["state"], r["state"])
            rule_updates.append(u)
    cr = {"name": name, "properties": base_props}
    if parents:
        cr["parent_style_names"] = parents
    creates.append({"label": sel, "create_style": cr})
    updates += [{"label": f"{sel} {u.get('breakpoint_id','main')}:{u.get('pseudo','')}", "update_style": u} for u in rule_updates]
    for (bp, st, coll), mid in cmode.items():
        m = {"style_name": name, "variable_collection_id": coll, "mode_id": mid}
        if parents:
            m["parent_style_names"] = parents
        modes.append({"label": f"{sel} mode", "set_style_variable_mode": m})

for n in ("create", "updates", "modes"):
    json.dump(locals()[{"create": "creates"}.get(n, n)], open(f"{out}/{n}.json", "w"), ensure_ascii=False)
json.dump({"notes": notes, "missing_variables": sorted(missing)}, open(f"{out}/notes.json", "w"), indent=1, ensure_ascii=False)
print(len(creates), "creates,", len(updates), "updates,", len(modes), "modes")
print(json.dumps({"notes": notes, "missing": sorted(missing)}, indent=1, ensure_ascii=False))
