# Webflow build state — where the build stopped

> **2026-11-06 — same site, renamed.** The MCP still reaches only
> `6aecfdb66cfe7667efc6d078`; its short name is now `wf-mgt` (staging
> `wf-mgt.webflow.io`). Every collection, mode and variable id below was
> still there, so batch 1 continued on it rather than being redone.

Last updated 2026-11-06 (batches 1–9 finished and on staging; manual steps A and B done (Phosphor caret in Select W); element building running in a separate session). Read this before any Webflow write.
Site: Michaels Global Trading, `6aecfdb66cfe7667efc6d078` (the only site the
`webflow-michaels-global-trading` connection reaches — checked 2026-11-05).
Staging: wf-mgt.webflow.io.
Nothing in Webflow has been published by this work.

## The plan (agreed with the person, one go-ahead per batch)

The person asked to build the style guide in Webflow. The style guide skill
requires variables, tag styles, classes and the repo bundle first, so the
build runs in this order:

| # | Batch | State |
| --- | --- | --- |
| 1 | **Variables**: bring every collection to the prototype (`prototype/webflow-snapshot/variables.json` + `prototype/src/css/proposed.css` P5) | **done 2026-11-06** (leftover removal waits for batch 10) |
| 2 | Tag styles: P1 (H1–H6 and D0–D6 colour → Colors Semantic › Text/Accent) | **done 2026-11-06** |
| 3 | Existing classes: P2 (G \| Nav, G \| Nav W — the 2026 nav), P3 (Section Is Hero padding), P4 (G \| Footer W) | **done 2026-11-06** |
| 4–8 | 361 new classes from `prototype/src/css/new-classes.css`, ~70 per batch. Plan: `pnpm wf:styles` → `.webflow-build/styles/styles-plan.json`. Skip `.w-inline-block` (Webflow's own) | **batch 4 done 2026-11-06** (82 styles: shared + nav); **batch 5 done 2026-11-06** (80 styles: Home, hero → case cards); **batch 6 done 2026-11-06** (71 styles: reasons → footer); **batch 7 done 2026-11-06** (68 styles: About, Toronto quote, Contact); **batch 8 done 2026-11-06** (59 styles: case study + listing). **All done: 360/361** |
| 9 | Repo port: modules + 35 repo-css rules from the prototype; `pnpm add gsap lenis`; commit/push needs the person's OK | **done 2026-11-06** (be8e640, staging deployed) |
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

## Batch 1 — finished 2026-11-06

- Typography Role: the 44 remaining line-height / letter-spacing updates
  (Body Large, Label, Display–H6, Body, Body Small), all modes.
- Typography Role: 8 new roles × 5 variables (Stat, Body XS, Link, Chip,
  Tab, Caption, Form Label, Form Input), Base values aliased to Typography
  Scale; other modes fall back to Base, except Size/Stat which holds
  40/40/36/36 explicitly. No name came back suffixed.
- Typography Styles: 8 new modes (created **without** `breakpoint_id`), each
  pointing Family/Size/Weight/Line Height/Letter Spacing at its role.
- Layout: Padding V 6.875em, Padding H 6.25em, Nav/Height 5.3125em, Nav/Padding
  H 5em (Base; other modes already right); Max Width 77.5em and Button/Height
  2.75em in all modes; created Card/Padding 2em and Grid/Gap 1.5em.
- Spacing: created 20, 72, 80, 100, 110. Radius: 8 → Small, 4 → Field
  (0.375em), created Medium 0.75em, Card 1em, Panel 1.5em.
- **Verified** by re-reading every collection with all modes: names and
  values match the snapshot (+ P5). Ids in `variable-ids.json`.

Still open from batch 1:
- Remove starter leftovers once nothing uses them: Spacing Hairline, 2, 96,
  128; Radius 2 (the starter style guide's Sg Bar / Sg Radius combos use
  some — replaced in batch 10). Colors Semantic `Link/Hover` is not in the
  snapshot but is kept (re-pointed to State/Navy Hover).
- After the first publish: `pnpm check:drift` in the prototype.

## Batch 2 — finished 2026-11-06

`color` → Colors Semantic › Text/Accent on the h1–h6 tag styles and the D0–D6
classes (13 styles, base breakpoint). The tag styles already had properties,
so no manual step was needed. Read back: all 13 hold the binding, none has a
breakpoint override. Headings now resolve to Brand/Navy on light and White
inside anything using the Colors Semantic Dark mode (e.g. Section Is Dark).

## Batch 3 — finished 2026-11-06

The person said "continue" on 2026-11-06 after a session was interrupted
partway through batch 3. That session had created the Colors Semantic modes
**Nav** and **Nav Open** (no breakpoint) but had set no values and written
no styles. This session finished the batch:

- **Nav mode** (the navy bar, P2): 19 values that differ from Base —
  Background Page → Navy 900, Surface and Tint → Navy 800, Overlay → Ink 64,
  Nav → Brand/Navy; Text Primary and Accent → White, Secondary and Label →
  White 64; Border Subtle → White 16; Focus Ring → White 24; Link Hover →
  Yellow; Status ×3 → On Dark; Icon Circle Background and Strong → White 16,
  Soft → White 8; Chip Border → White 12.
- **Nav Open mode** (the white panel): 5 values that differ from Base —
  Button Light Background → Navy, Light Text → White, Light Hover → Navy
  Hover; Icon Circle Background → Black 12, Icon → Navy.
- Not created: the 8 variables the prototype's nav blocks set but no class
  reads (Background/Accent, Button/Secondary Text/Background/Hover,
  Chip/Background, Form/Background, Border Focus, Control Border). They came
  from mgt-live.
- **G | Nav**: flex, align center, max width 80em, height 100%, margin
  auto left/right.
- **G | Nav W**: color → Text/Primary, transition transform 0.3s ease,
  Colors Semantic mode → Nav. (Already absolute, full width, nav height and
  padding.)
- **Section Is Hero** (P3): padding left/right/bottom → Spacing/80; Tablet
  (medium) → Section Padding H / Padding V.
- **G | Footer W** (P4): Colors Semantic mode → Dark; background → Colors ›
  Brand/Navy 800; padding top 5.25em, bottom 2.5em; overflow hidden.
- **Verified**: every value and mode read back as sent.

Left for later batches:
- Apply **Nav Open** to G | Nav W Is Open, Nav Mega W and Nav Menu Is Open
  when those classes are created (batches 4–8), and **Nav** to Nav Mega CTA.
- The footer uses the stock Dark mode, so Background/Page reads Navy 900
  inside it. P4 overrode that to Navy 800. Only the footer background needs
  Navy 800, and it is set on the class. If a footer child reads
  Background/Page and looks wrong, add a "Footer" mode.

Update from batch 4: Nav Open is now on G | Nav W Is Open, Nav Mega W and
Nav Menu Is Open, and Nav is on Nav Mega Cta.

## Batch 4 — finished 2026-11-06

The person said "Start batch 4". It covers shared components and the whole
nav: plan indices in `tools/batch-4.json`, which are 51 classes (0–51 except
`.w-inline-block`) and 31 combos (button, icon, phone button, badge, arrow
link and button row variants; every G | Nav W, Nav Caret, Nav Logo, Nav
Mega and Nav Menu/Overlay state). That makes 82 styles, 55 breakpoint or
state updates and 10 variable modes.

- Made with `tools/plan2actions.py` (plan → API actions) and checked with
  `tools/verify.py` against a full `get_styles` read-back. **0 differences**
  on every base property, breakpoint, hover/pressed/focus-visible state and
  mode. A planted wrong value was caught, so the check isn't vacuous.
- How the converter writes what the API can't take directly:
  `row-gap`/`column-gap` → `grid-*-gap`; `transition` → the three
  longhands; `flex: none` → grow/shrink/basis; `border: 1px solid var` →
  per-side width/style/colour with the colour bound; pressed → `active`.
  `--_typography-styles---*` on a class → its Typography Styles mode (Link,
  Body XS); the `--_colors-semantic---*` blocks → the Nav or Nav Open
  mode.
- The plan had **left out 11 properties** (its `checkFirst` list): every
  property whose variable wasn't in the old snapshot, e.g. Nav Bg
  background, Nav Link hover colour, Nav Toggle, Button Color Is Light. The
  variables exist now, so they were added. The converter now puts
  `checkFirst` properties back on its own and reports the ones that read
  JS variables (`--compare`, `--logo-strip-fade`). See GOTCHAS 2026-11-06.
- Dropped, nothing to do: `clip` on Sr Only (no Designer property; the
  class still hides with size, overflow and position).
- Left for batch 9 (already in the plan's `repoCss`): line clamp on Nav
  Post Title/Excerpt, Nav Mega Col first/last child, the
  `[data-wf-focus-visible]` focus rings, `.g-nav-w.is-instant`,
  `html.is-nav-open`. Several of those rules read Webflow variable names
  (`--_colors-semantic---form--focus`, `--_colors---brand--navy`). AGENTS.md
  rule 4 needs the person's approval for that, so ask in batch 9.
- Not on any page yet: the classes exist but no element uses them. The nav
  markup is built later (component), so "Clean up unused styles" must not
  be run until then.

## How to run batches 5–8

```bash
# from wf-mgt/, after `pnpm wf:styles` in the prototype if the CSS changed
python3 -I docs/handoff/webflow/tools/plan2actions.py \
  .webflow-build/styles/styles-plan.json docs/handoff/webflow/variable-ids.json \
  docs/handoff/webflow/tools/batch-5.json <out-dir>
```

`batch-N.json` is a list of plan indices; put combos after their parents.
Send `create.json` in calls of ~15, then `updates.json`, then `modes.json`.
Read back with `get_styles` (all, `include_properties`, breakpoints
medium/small/tiny/xl, base pseudos hover/active/focus-visible). Save the
result to a file and run `verify.py <readback> create.json <updates + modes
as updates>`, as batch 4 did.

## Batch 5 — finished 2026-11-06

The person said "Start batch 5". This batch is plan indices 52–117 (hero,
glass card, stat row, logo strip, Our Services card/tabs/panel/rows,
overview and stat tiles, trusted bar, head rows, split, before/after
compare, carousel, case card, card grid). It adds 14 combos: Section Is
Surface / Is Compact / Is Ruled, S Bg Overlay Is Hero Gradient, Glass Card
Is Hero / Is Stat, Logo Strip Is Ruled, Logo Strip Img Is Small, Services
Tab Is Active, Compare Tag Is After, Carousel Arrow Is Prev, Case Card Is
Dimmed, Head Row Is Top, Stat Accent Is Tall. Selection:
`tools/batch-5.json`.

- 80 styles, 40 breakpoint/state updates, 2 modes (Body XS on Services Tab
  and More Link). **0 differences** against a full read-back. Batch 4
  re-checked in the same read-back: still 0 differences.
- The converter now also splits literal border shorthands
  (`1px solid rgba(…)`, `border: 0`) into per-side longhands and expands
  every `flex` shorthand (`1 1 0` → grow 1, shrink 1, basis 0%).
- The API accepted `backdrop-filter`, `touch-action`, `scroll-snap-type`,
  `scroll-snap-align`, `scrollbar-width`, `aspect-ratio`, multi-layer
  `background-image` gradients, `calc()` without variables, and the
  `mask-size/position/repeat` longhands on Logo Strip Is Ruled. Check the
  masks on the published CSS: they were stored, but the Designer has no
  mask panel.

Left for batch 9 (repo CSS). These are **not** in the plan's `repoCss`
because the plan reported them only in `checkFirst`, so add them by hand:
- `.compare-line, .compare-handle, .compare-hint { left: var(--compare, 50%); }`
  (the classes hold `left: 50%` as the canvas fallback; compare.ts sets
  `--compare`).
- `.logo-strip.is-ruled { mask-image: var(--logo-strip-fade), linear-gradient(#000, #000); }`
  (only the `-webkit-` version is in `repoCss`).
- `.logo-strip` on mobile landscape (≤767px): `--logo-strip-fade:
  linear-gradient(to right, transparent, #000 20%, #000 80%, transparent)`.
  `repoCss` has only the desktop 12%/88% value.

## Batch 6 — finished 2026-11-06

The person said "Start batch 6". This batch is plan indices 118–177 (reason
card, icon tile, note plate, check chips, why-split and the reason
accordion, step grid, article cards, FAQ, locations, tag list, CTA banner,
footer CTA and the footer). It adds 11 combos: Step Number Is Accent /
Is Small, Icon Tile Is Small / Is Accent / Is Glass, Button Is Full, Note
Plate Is Boxed, S Wrapper Is Loose, Chip Is Small / Is Highlight, Locations
Text Is Narrow. Selection: `tools/batch-6.json`.

- 71 styles, 25 breakpoint/state updates, 3 modes. **0 differences**
  against a full read-back. Batches 4 and 5 re-checked in the same
  read-back: still 0.
- Modes: Faq Question → Typography Styles **H6**; Footer Link → **Link**;
  Cta Banner → Colors Semantic **Dark**. Its eight overrides in the
  prototype (tint White 12, text White, border/icon circle/chip White 16)
  are exactly Dark's values.
- Converter fixes: role names with digits (`h6`) now map, and every
  Typography Styles mode is recognised, not just Link and Body XS.
  Semantic blocks without a Background/Nav value now map to Dark instead of
  Nav. `list-style: none` → `list-style-type`. Batches 4–5 regenerate
  unchanged.
- Repo CSS for these classes is already in the plan's `repoCss`
  (`[aria-expanded="true"]` icon states for the FAQ and reason accordions).

## Batch 7 — finished 2026-11-06

The person said "Start batch 7". This batch is plan indices 178–237 (About:
page hero copy, story, stat cards, values panel, photo caption; service
cards; Toronto: quote hero, check list, quote card and form; Contact:
segmented tabs, contact row, radio group, call/details/next cards). It adds
8 combos: Form Field Is Full, Form Input Is Select, Section Is Page Hero /
Is Quote Hero, S Bg Overlay Is Side Gradient, Service Card Is Dark,
Segmented Tab Is Active, Detail Row Is Last. Selection:
`tools/batch-7.json`.

- 68 styles, 25 breakpoint/state updates, 6 modes. Read-back: **0
  differences except one, which is a manual step** (below). Batches 4–6
  re-checked: still 0.
- **4 new Layout variables** for the hero calc values the style API can't
  store, each with a value per breakpoint mode, worked out from Nav/Height
  (5.3125 / 4.5 / 4 / 4em) as the lesson describes:
  `Calc/Nav Height + 26.25em` and `Calc/Nav Height + Spacing 80` (Page Hero
  min-height / padding-top), and `Calc/Nav Height + 42.5em` and `Calc/Nav
  Height + Spacing 48` (Quote Hero). Ids are in `variable-ids.json`. They are
  copies, not formulas: **if Nav/Height or Spacing 80/48 changes, update
  them**.
- Modes: Quote Card → Colors Semantic **Base**. It is a light card inside
  the dark hero, so it resets to light (GOTCHAS 2026-11-06). Call Card and
  Service Card Is Dark → **Dark**. Typography: Photo Caption Text → H6,
  Form More Label → Form Label, Radio Label → Body XS.
- Radio Input `accent-color` = literal `#002e75` (the API refuses a
  variable there).
- **Manual step A** (MANUAL-TODO): the select chevron. First done as a
  background image (asset `6aee39671b9feb858153bf50`), then replaced on
  2026-11-06 by the Phosphor icon: new classes Select W (position relative),
  Select Icon (absolute, top/bottom 0, right Spacing/12, Colors Text/Label,
  pointer-events none) and Select Icon › Is Pill (right 0, Brand/Navy); the
  icon is Icon (Is Size 14 on forms) › Icon Glyph `i` with `class="ph
  ph-caret-down"`. Background properties removed from Is Select and Filter
  Pill Select. All 8 selects on the style guide wrapped and read back.
  Then the hand-built icon became an **Icon Size** instance (Icon prop
  `ph ph-caret-down`) in each Select Icon: variant **14px** (new,
  `be343e17-9894-2cac-5a01-9e068a36439f`, font-size 0.875em, ordered after
  12px) on the 5 form selects, 16px (base) on the 3 pills; read back.
- Converter: local `url("/…")` images and variable `accent-color` are
  reported; `calc(Nav Height + x)` binds to its Calc variable; duplicate
  longhands are removed with the last value winning (Form More: `border: 0`
  then `border-top`). The semantic-mode choice reads the text colour.
  Batches 4–6 regenerate unchanged.

## Batch 8 — finished 2026-11-06 (all class batches done)

The person said "start batch 8". This batch is every plan entry not yet
built: indices 238–283 (case study page: case hero grid, detail block, tag
wrap, breadcrumb, stat band, article layout, story blocks/panels, aside
cards, trust card; Case Studies listing: listing intro, figures band,
trusted strip, filter bar/pills, featured case, case meta, mini stats, case
card stat) plus the last 13 combos. Selection: `tools/batch-8.json`.

- 59 styles, 23 breakpoint/state updates, 3 modes (Filter Pill Label →
  Body XS, Filter Pill Select → Link, Aside Card Is Dark → Dark). **0
  differences**. Batches 4–7 re-checked in the same read-back: 0.
- **Batches 4–8 together: 360 of the plan's 361 classes**, all verified.
  The missing one is `.w-inline-block` (Webflow's own; skipped on purpose).
  The site now has 521 styles.
- 2 more computed Layout variables: `Calc/Nav Height + 1.875em`
  (Breadcrumb top) and `Calc/Nav Height + 35em` (Case Hero min-height).
  Case Hero padding-top reuses `Calc/Nav Height + Spacing 80`. That makes 6
  Calc variables, all derived from Nav/Height. Ids are in
  `variable-ids.json`.
- Story Panel Is Outcome: 6px yellow left border (converter now handles any
  width with a variable colour).
- `appearance: none` was accepted on Filter Pill Select (`repoCss` adds
  `-webkit-appearance`).
- **Manual step B**: the filter pill chevron, same change with Is Pill
  (both chevron assets were deleted afterwards).

## Building elements (in progress in a separate session)

On 2026-11-06 the person asked for a second session to start building the
page shell, the Nav and Footer components and other global elements from
the prototype markup while batch 8 ran. That session places elements only
and creates no classes. Its notes are in
`webflow/components-build.md`. Review that file before page building.

## Batch 9 — repo port, done 2026-11-06 (commit be8e640, on staging)

The person said "Start batch 9", and approved the repo-css rules that
read Webflow variable names (variables, not literal colours).

- `pnpm add gsap@3.15.1 lenis@1.3.27` (the prototype's exact versions).
- **11 modules copied unchanged** from `prototype/src/modules/` into
  `src/modules/`: carousel, compare, count-up, faq, filter-tabs, marquee,
  nav, parallax, scroll-fx, smooth-scroll, tabs. Plus `year.ts` (was
  inline in the prototype's `main.ts`). `src/index.ts` runs them in the
  prototype's order (smooth-scroll first; count-up after carousel;
  scroll-fx last). `style-guide-nav` is not ported, because Webflow's own
  Current state does that job.
- **Repo CSS** (`src/styles.css`): Lenis's own CSS and `html.is-nav-open`
  in §04, and a "Michaels Global Trading components" block at the end of
  §05. The block is the prototype's repo-css block as is: nav
  `.is-instant`, line clamps, `-webkit-` prefixes, open-state colours for
  services tab / FAQ / reasons, compare (`--compare`, Is Touched,
  user-select), carousel scrollbar, logo strip masks (with the mobile fade
  and unprefixed ruled mask the plan missed), next-step line. Every group
  is tagged.
- **Moved to Webflow instead of code** (Designer first): Nav Mega Col
  `:first-child` / `:last-child` (the Designer's First/Last Child states)
  and `appearance: none` on Form Input Is Select. Not ported: the six
  `[data-wf-focus-visible]` focus rings, because Webflow publishes that
  selector itself for every Focus-Visible state set in batch 4.
- The prototype tagged the select-arrow rule `override-webflow`. It isn't
  one: only `-webkit-appearance` stays in code (`designer-cant`), and the
  unprefixed property is on the Webflow classes.
- Checks: `pnpm check` ✓, `pnpm build` ✓ (`dist/index.js` 158 kB minified,
  60 kB gzipped; it was 6.7 kB, and GSAP + ScrollTrigger + Lenis account
  for nearly all of it), `pnpm test` ✓ (Playwright passed; 47 Node checks
  passed, 10 template-only skipped).
- **Not verified in a browser yet**: no Webflow page has the markup. The
  modules no-op without their `data-*` hooks, so they show behaviour once
  the components session places the Nav/Footer and pages are built. Check
  then on staging after the push.
- Open: `--nav-h` in §01 (anchor scroll offset) is still the template
  default. It should follow Nav/Height (5.3125/4.5/4/4em); set it when the
  nav is on a page.
- **Committed and pushed** on 2026-11-06 with the person's OK (be8e640). CI passed and staging serves bundle hash `a018dcb0a14b`. (AGENTS.md: `dist/` is
  committed with `src/`; a push deploys staging bundles). No
  `loader.html` change, so nothing to re-paste.

## Batch 10 — the style guide page (in progress, started 2026-11-06)

The person said "Start batch 10". Rebuild `/design/style-guide` (page
`6aecfdb66cfe7667efc6d075`) from `prototype/design/style-guide/index.html`
with the webflow-style-guide skill; then remove the starter leftovers
(Spacing Hairline/2/96/128, Radius 2) once nothing uses them. The
components session was asked to leave this page alone (Nav/Footer on Home
only).

**Step 1 — classes, done and read back (37 styles, 0 differences):**
- Six type classes on the Body S pattern (the five Typography Styles
  variables + the role's mode): Stat, Body XS, Button Text (Button mode),
  Link Text, Tab Text (+ `text-transform: uppercase`), Caption.
- 31 Sg variable combos the starter didn't have: Sg Swatch Color + Is
  Brand Navy / Navy 900 / Navy 800 / Yellow / Orange, Text Ink / Label /
  Muted, Base White, Bg Surface / Tint / Field, Border Default, State Yellow
  Hover / Navy Hover / Focus, White Tint White 8/12/16, Navy Tint Navy
  12/16; Sg Bar + Is 20/72/80/100/110; Sg Radius + Is Field / Small /
  Medium / Card / Panel (four corner longhands each).
- Not created: `.faq-icon-bar` (a class on an SVG `<path>` inside an
  Embed, styled by repo CSS, no Webflow class needed) and `.is-nav-open`
  (set on `<html>` by the nav module).

- For the components session, five empty two-class combos (read back):
  Caption / Body S / Label Text + Text Secondary, Body L + Footer Cta
  Text, Label Text + Footer Label. Empty on purpose: the element publishes
  both class names, so the globals' colour, width and opacity still apply.
  Check the footer CTA width and label opacity on staging.

**Snapshot refreshed (2026-11-06):** `prototype/webflow-snapshot/variables.json`
was rebuilt from Webflow (all collections, all modes; the starter leftovers
left out), so the generated page now has 34 colours, the Nav / Nav Open
modes and the Layout calc variables. The old snapshot and page are backed
up in the session scratchpad. `pnpm style-guide` and `pnpm
check:style-guide` pass. Five more swatch combos were created for it (Sg
Swatch Color + Is Black Tint Black 8/12/16, Is White Tint White 24/64),
read back.

**Step 2 done (2026-11-06):** all 10 sections rebuilt, each imported
before the starter's, read back with a script (every element's class list
and text identical to the source), the starter's removed and its sidebar
link re-pointed:

| # | Section | New element id |
| --- | --- | --- |
| 1 | Overview | `42d25cc6-264a-865a-9817-be7d9db73b6f` |
| 2 | Colors | `a2aa325a-fdd3-da36-bc04-7f6fa0e706d6` |
| 3 | Themes | `36de8495-edef-7fa7-50e8-de8b0d241349` |
| 4 | Typography | `8951555b-f8b6-6bff-c70f-574e61a2408f` |
| 5 | Utilities | `5c746aed-da7a-5c6f-7ab3-fd6697137bee` |
| 6 | Spacing | `1fda9854-b9cd-4906-0e42-5095f11851de` |
| 7 | Buttons | `7f02229e-673e-2405-b3ec-349566e91783` |
| 8 | Forms | `7d386042-83ce-d157-88b4-b959400a0589` |
| 9 | Components | `cd6c4803-c6ee-f927-0e7d-6c0b5663c0f2` |
| 10 | Other classes | `58f7f8ac-21f5-9fbf-fad2-ea34bf1332d5` |

- Buttons: the Primary and Secondary rows hold the starter's **Button
  Color** instances (moved in; base and Secondary variant), not static
  copies. The Small row is still a static copy that looks like the default
  size (no Small instance existed). The accordion `<button>` came in as a
  Link with `type="button"`; `inert` was dropped on every Sg Demo.
- Other classes: 77 tiles. Left out on purpose: `.is-nav-open`,
  `.g-nav-w.is-instant`, `.compare.is-touched` (JS/repo-CSS states, would
  have been created as empty Webflow classes). Only in the starter's
  version: S Bg, S Bg Media, S Bg Overlay (they come back with the
  Components hero specimens) and Sg Preview / Sg Preview Screen (page
  previews, unused here).
- A 19 KB single action worked. Scoped queries inside the shell slot
  return nothing; read back by `element_id` with `children_depth: -1`.
- Forms (the person chose form blocks, filter bar as plain elements):
  Form, Select and Textarea rows and the Contact Form are Webflow form
  blocks (`.form` on the wrapper, `.form-stack` combo on the contact one).
  The importer gave every input the same id (`field`, `field-2`, `radio`;
  the repo's unique-form-ids module renames duplicates at runtime),
  dropped every label `for`, the radio `value`s and the select options,
  renamed the selects to "Field", and turned the submit `<button>` into an
  empty Form Button: it was replaced by the starter's DOM `button.button`
  holding a Button Color instance (label "Submit", not "Request my office
  assessment"). `set_attributes` inside the shell slot fails (MANUAL-TODO
  C). The Filter Bar is plain DOM (`form.filter-bar` › `.filter-group` ›
  `label.filter-pill` › span + select › option), built with
  `data_element_builder` plus the importer for the spans and options; it
  has no `.form` class (that only sets `margin-bottom: 0`). The importer
  also created a combo `.form._w-form` ("w-form", `margin-bottom: 0`);
  left for Clean up unused styles.
- Components: 41 rows, each read back against the source (row by row:
  identical classes and text; `&` comes back as its own text node). The
  starter's 19 instances were moved in: Section Head, 14 Icon / Icon Size,
  2 C | Button, C | Icon Button, C | Video. 45 images uploaded as assets
  (`data_assets_tool › create_asset` + curl to S3, 201 each, every file
  served at its exact size; `cta-team.webp` reused from the nav/footer
  session) and all 61 Image elements bound with `set_image_asset` (works
  inside the slot) and read back. Quote Card's submit was rebuilt as a DOM
  `button.button.is-full` (the importer empties form `<button>`s); its
  "Add company details" button came in as a Link. Values Panel, Featured
  Case and Trusted Bar hold static Secondary-styled buttons that render as
  Primary (their `w-variant` token was stripped). Step Card is wrapped in
  `ol.step-grid` (a bare `<li>` rejects the whole import call).
- The prototype's Why Split specimen was cut two divs short and the Reason
  List row was missing: nested `sg:start` markers on the Home page (Reason
  List inside Why Split). The inner markers were removed from
  `prototype/index.html` (comments only; backup in the session scratchpad),
  the page regenerated, `check:style-guide` passes.
- Starter leftovers removed: Sg Bar Is Hairline / Is 2 / Is 96 / Is 128 and
  Sg Radius Is 2 (the only users, verified on a full style read-back at all
  breakpoints), then the variables Spacing Hairline, 2, 96, 128 and Radius
  2 (no aliases). Spacing now has 14, Radius 7.
- **Staging check (published by the person 2026-11-06 15:16 UTC):**
  - Every class in the published site CSS is on the page, and every combo
    sits on one element, except: Webflow's own `gm-style-iw` and
    `wf-layout-layout`; `sg-preview` / `sg-preview-screen` (page previews,
    unused here); five importer combos `._w-form`, `._w-button`,
    `._w-input` (×2), `._w-select` (selectors that can't match); and 12
    starter Sg combos (Brand Accent/Ink/Paper, Ink Tint 4/12/24, Paper Tint
    12/24/48/64 swatches, Sg Radius Is 4/8). All of these are meant to go
    in Clean up unused styles.
  - All 67 images load; the only `data-manual-todo` marker is C.
  - `<meta name="robots" content="noindex, nofollow">` is already in the
    page head (from the starter).
  - **Not verified:** the sidebar highlight (`w--current`). The browser
    pane was hidden, where requestAnimationFrame never fires, so
    webflow.js's section tracking can't run there; the markup is right
    (each link points at its section, ids published). Check by eye.
  - **Found:** the installed loader is the template's. The published page
    has `SITE = "wf-template"` in the head code and the 2a Embed links
    `brandvm.github.io/wf-template/styles.css`, so staging runs the
    template's bundle, not this repo's (none of the batch 9 modules).
    MANUAL-TODO D.
- **Loader re-pasted (MANUAL-TODO D, 15:33 UTC):** head and footer code
  read back through `get_site_freeform_code` and match `loader.html`; the
  page loads `brandvm.github.io/wf-mgt/index.js` and `styles.css`, Lenis
  starts (`html.lenis`), no console errors, repo CSS applies (the open
  accordion icon is navy). The modules on real pages are still to check
  once pages exist.
- **Next:** the person checks the sidebar highlight by eye; then Clean up
  unused styles (it should remove only the 23 styles listed above).
- Tools in the session scratchpad: `sg/prep.py` (split, strip tokens),
  `sg/cmp.py` (read-back vs source), `sg/split.py`.

**Step 2 — markup, waiting on the Designer** (the Designer MCP app must be
open in the Designer tab). Section by section from the generated page,
with `w-variant-*` and `ph`/`ph-*` tokens stripped, `before` the starter's
sections in the shell's slot; then remove the starter sections, re-point
the sidebar links (set_link, page section), and use component instances
for component rows.

## How to continue in a new session

1. Read `AGENTS.md`, `GOTCHAS.md`, this file, `HANDOFF.md`.
2. Webflow MCP: call `webflow_guide_tool` first (new session id — the old
   one doesn't carry over), then `list_sites` and confirm the only site is
   `6aecfdb66cfe7667efc6d078` (short name `wf-mgt`).
3. IDs: `variable-ids.json` in this folder (collections, modes, every
   variable touched so far). Re-read a collection rather than trusting it if
   anything looks off; concurrent Designer edits don't change variable ids.
4. Tell the person to reload the Designer after each batch; nothing is
   published until they ask.
