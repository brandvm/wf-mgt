# Webflow build state — where the build stopped

Last updated 2026-11-05 (end of session). Read this before any Webflow write.
Site: Michaels Global Trading, `6aecfdb66cfe7667efc6d078` (the only site the
`webflow-michaels-global-trading` connection reaches — checked 2026-11-05).
Staging: michaels-global-trading.webflow.io (not published yet: 404).
Nothing in Webflow has been published by this work.

## The plan (agreed with the person, one go-ahead per batch)

The person asked to build the style guide in Webflow. The style guide skill
requires variables, tag styles, classes and the repo bundle first, so the
build runs in this order:

| # | Batch | State |
| --- | --- | --- |
| 1 | **Variables**: bring every collection to the prototype (`prototype/webflow-snapshot/variables.json` + `prototype/src/css/proposed.css` P5) | **in progress** — see below |
| 2 | Tag styles: P1 (H1–H6 and D0–D6 colour → Colors Semantic › Text/Accent) | not started |
| 3 | Existing classes: P2 (G \| Nav, G \| Nav W — the 2026 nav), P3 (Section Is Hero padding), P4 (G \| Footer W) | not started |
| 4–8 | 361 new classes from `prototype/src/css/new-classes.css`, ~70 per batch. Plan: `pnpm wf:styles` → `.webflow-build/styles/styles-plan.json`. Skip `.w-inline-block` (Webflow's own) | not started |
| 9 | Repo port: modules + 35 repo-css rules from the prototype; `pnpm add gsap lenis`; commit/push needs the person's OK | not started |
| 10 | Style guide page `/design/style-guide` (page id `6aecfdb66cfe7667efc6d075`): rebuild from `prototype/design/style-guide/index.html`; replace the starter's Sg swatch/bar/radius combos with this site's | not started |

Batch 1 was approved with its real scope ("bring every collection up to the
prototype": ~150 creates, ~300 updates, ~30 removals). Batches 2–10 each
still need their own go-ahead.

## Why batch 1 is big

Webflow still held the **starter's** variable system (Brand/Ink #111111,
Brand/Accent #2f5bff, Paper/Ink tints, sizes 12–96…). The prototype's
`webflow-snapshot/variables.json` had been edited to the Figma tokens and
never written to Webflow, so the snapshot did not describe Webflow. (GOTCHAS
2026-11-05.) Approach: rename starter variables where a match exists (keeps
ids, so every class binding follows), create the rest, set every mode, remove
starter leftovers last.

## Batch 1 — done (all results checked: names clean, values as sent)

**Colors** (collection `Colors`)
- Renamed (ids kept): Brand/Accent → Brand/Navy `#002e75`; Brand/Ink →
  Text/Ink `#00183d`; Brand/Paper → Base/White; Ink Tint 4/12/24 → Black Tint
  8/12/16 (`#00000014/1f/29`); Paper Tint 12/24/64 → White Tint 12/24/64;
  Paper Tint 48 → White Tint/White 16 `#ffffff29`.
- Created: Brand/Navy 900, Navy 800, Yellow, Orange; Text/Label, Text/Muted;
  Bg/Surface, Bg/Tint, Bg/Field; Border/Default; State/Yellow Hover, Navy
  Hover, Focus; White Tint/White 8; Navy Tint/Navy 12, 16.
- Unchanged: Ink Tint 48/64, Status ×6.

**Colors Semantic** (modes Base, Dark)
- Re-pointed in both modes: Background/Page (Dark → Navy 900), Surface,
  Text/Secondary, Text/Accent (Dark → White), Border/Subtle, Button/Background,
  Text, Background Hover, Form/Focus, Link/Hover (→ State/Navy Hover).
  Background/Overlay, Text/Primary, Status ×3 were already right after the
  renames.
- Created (8 from the prototype): Background/Tint, Background/Field,
  Text/Label, Border/Active, Icon Circle/Background, Icon Circle/Icon,
  Chip/Border, Form/Focus Ring — with their Dark values.
- Created (P5, 7): Background/Nav, Background/Brand, Icon Circle/Background
  Soft (Black 8), Background Strong (Black 16), Button/Light Background
  (White), Light Text (Navy), Light Hover (Bg/Tint). Dark = Base for these.

**Typography Scale**
- Renamed: Size/20→22, 32→36, 48→45, 64→52, 80→60, 96→11 (values set);
  Line Height Tight→110, Snug→128 (1.28), Normal→150; Letter Spacing
  Tight→Minus 2, Normal→None, Wide→Plus 8.
- Created: Size/13, 15; Line Height 100, 106, 118, 120, 140, 160, 164, Auto
  (1.31); Letter Spacing Minus 4, Minus 3, Minus 1.8, Minus 1, Plus 6.
  (Minus 1 came back as "Minus 1-9" and was renamed; css name now
  `--_typography-scale---letter-spacing--minus-1`.)

**Typography Role** (12 existing roles; modes Base, Tablet, Mobile
Landscape, Mobile — every role variable holds its own value in every mode)
- Size/* for all 12 roles: set in all 4 modes.
- Weight: Display/H1/H2 → Medium, H4/H5/H6/Label → Semibold, all 4 modes.
- Line Height: Display 106, H1 118, H2 120, H3 120 (all 4 modes); Body →
  164 in Base and Tablet **only so far**.

## Batch 1 — still to do, in this order

1. **Send `pending-role-updates.json`** (this folder): 46 role updates —
   Line Height Body (Mobile Landscape, Mobile), Body Large and Label (all
   modes), and Letter Spacing Display/H1/H2/H3/H4/H5/H6/Body/Body Small (all
   modes). It is a ready `actions` array for `data_variable_tool`
   (siteId above, pageId = the style guide page id).
2. **Create the 8 new roles × 5 variables (40)** in Typography Role: Stat,
   Body XS, Link, Chip, Tab, Caption, Form Label, Form Input. Targets per mode
   are in `prototype/webflow-snapshot/variables.json` (collection
   "Typography Role", key `alias`). Only Size/Stat differs by mode (Base 40,
   Tablet 40, Mobile Landscape 36, Mobile 36); for the others Base is enough,
   but the existing roles hold explicit values in all four modes — match
   that for consistency. Check every create result's `name` for a suffix.
3. **Typography Styles**: create the 8 modes (Stat, Body XS, Link, Chip,
   Tab, Caption, Form Label, Form Input) with `create_variable_mode`
   **without `breakpoint_id`** (lessons/mcp.md 2026-10-30), then set the 5
   style variables (Family, Size, Weight, Line Height, Letter Spacing) in
   each new mode to the matching role variable. The 12 existing modes already
   point at the right roles.
4. **Layout** (modes Base/Tablet/Mobile Landscape/Mobile): set values to the
   snapshot — Section/Padding V 6.875/6/5/4em, Padding H 6.25/3/2/1.25em,
   Container/Max Width 77.5em (all), Content/Gap 3/2.5/2/1.5em (unchanged),
   Nav/Height 5.3125/4.5/4/4em, Nav/Padding H 5/3/2/1.25em, Button/Height
   2.75em (all); create Card/Padding 2em and Grid/Gap 1.5em (all modes).
5. **Spacing**: create 20 (1.25em), 72 (4.5), 80 (5), 100 (6.25), 110
   (6.875). **Radius**: rename 8 → Small (0.5em, same), 4 → Field (0.375em);
   create Medium 0.75em, Card 1em, Panel 1.5em.
6. **Remove starter leftovers only after nothing uses them**: Spacing
   Hairline, 2, 96, 128; Radius 2. The starter style guide's Sg Bar / Sg
   Radius combos use some — those combos are replaced in batch 10, so leave
   these until then.
7. **Verify**: re-read every collection with all modes and compare with the
   snapshot name by name and value by value. Once staging is published, run
   `pnpm check:drift` in the prototype (snapshot vs what staging serves).
   No breakpoint links are needed: Typography Role and Layout already have
   their Tablet / Mobile Landscape / Mobile modes linked.

Known follow-up for batch 3: the nav (P2) sets ~40 Colors Semantic values on
G | Nav W and another set on Is Open. In Webflow that means a Colors Semantic
mode per state ("Nav", "Nav Open") applied to those classes with
`set_style_variable_mode` — the modes must be created (no breakpoint) and
given values first.

## How to continue in a new session

1. Read `AGENTS.md`, `GOTCHAS.md`, this file, `HANDOFF.md`.
2. Webflow MCP: call `webflow_guide_tool` first (new session id — the old
   one doesn't carry over), then `list_sites` and confirm the only site is
   `6aecfdb66cfe7667efc6d078`.
3. IDs: `variable-ids.json` in this folder (collections, modes, every
   variable touched so far). Re-read a collection rather than trusting it if
   anything looks off; concurrent Designer edits don't change variable ids.
4. Tell the person to reload the Designer after each batch; nothing is
   published until they ask.
