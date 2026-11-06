# Gotchas

A running log of things that cost time on this project. Agents read it at
the start of every session and add to it when they hit something new (see
the Session protocol in `AGENTS.md`). Never delete an entry — update its
`Status` instead.

Lessons from earlier builds are in the skill, not here:
`.claude/skills/webflow-build/lessons/` (one file per area). Read the file
for the area you work in. Entries tagged `Scope: template-candidate` are
collected from client repos into those files.

## Entry format

```md
### YYYY-MM-DD · Short title
- Area: designer | css | loader | release | mcp | ci | js | perf
- Scope: project | template-candidate
- Symptom: what was observed
- Cause: why it happened
- Fix: what was done, or the workaround
- Status: open | fixed <sha> | upstreamed wf-template <sha>
- Found by: claude | codex | human
```

## This project

### 2026-11-05 · Before/after slider selects the photo (blue) on press
- Area: js
- Scope: template-candidate
- Symptom: pressing or double-clicking the compare slider tinted the before photo blue (browser selection) or started a native image drag, instead of moving the handle.
- Cause: the compare module's pointerdown didn't preventDefault, and the `<img>`s still took pointer events, so the browser treated the press as select/drag on the image.
- Fix (prototype, carries into the repo port): `e.preventDefault()` on pointerdown plus a `dragstart` block in `compare.ts`; Compare Img `pointer-events: none` (Designer); repo-css `designer-cant` rule for `user-select: none` and `-webkit-tap-highlight-color` on `.compare`. Also added a one-time nudge and a "Drag to compare" hint (`.is-touched` js-state).
- Status: open (fixed in the prototype; port with the compare module)
- Found by: human

### 2026-11-05 · Porting the 2026 nav from the mgt-live sandbox
- Area: css
- Scope: project
- Symptom: after renaming the sandbox's `n26-` classes (N26 \| Nav W, N26 \| Button, N26 \| Icon, N26 \| Nav Drop Link) to this site's names, the mega menu links wouldn't wrap and two rules read undefined `--light` / `--brand`; separately, every open/active state was missing.
- Cause: mgt-live's published CSS also holds the live site's own `.g-nav-w`, `.button`, `.icon` and `.nav-drop-link` rules (the old nav), which the rename made match; and state combos (`is-open`, `is-active`, `is-before`, `is-fixed`, `is-hidden`) are added by the nav module, so they never appear in the published markup a class filter reads.
- Fix: take only the `n26-` rules for renamed classes, and allow the module's state classes explicitly. Also: mgt-live's nav.ts switches to the menu below 1280px while its CSS does at 991px; the port uses 991 in both. The nav needs five new Colors (White 24/64, Black 8/12/16) and six Colors Semantic variables (prototype `proposed.css` P5) before it can be built here.
- Status: open (prototype done; Webflow build pending)
- Found by: claude

<!-- Add new entries here, newest first. -->

### 2026-11-05 · The prototype snapshot didn't describe Webflow
- Area: mcp
- Scope: template-candidate
- Symptom: `prototype/webflow-snapshot/variables.json` (and so the generated `tokens.css`) held the Figma palette and type scale, while Webflow still had the starter's variables (Brand/Ink, Paper/Ink tints, sizes 12–96). The class plan (`pnpm wf:styles`) and the proposed-changes file both assumed variables that didn't exist.
- Cause: the snapshot was edited to the target tokens during the prototype instead of keeping it as "what Webflow has" and putting changes in `proposed.css`.
- Fix: before the first Webflow write, diff the snapshot against Webflow (`get_variable_collections` + `get_variables` with all modes). Here the whole system was migrated as batch 1 by renaming starter variables (ids kept) and creating the rest; see `docs/handoff/webflow/webflow-build-state.md`.
- Status: open (batch 1 in progress)
- Found by: claude

### 2026-11-06 · pnpm test fails in a client repo made from template 0.19.0
- Area: ci
- Scope: template-candidate
- Symptom: right after `pnpm new-project`, `pnpm test` (and so CI and the staging deploy) failed: 3 tests in `bench.check.mjs` and 4 in `progress.check.mjs`.
- Cause: the pack and contract tests run `scripts/pack.mjs` and `scripts/check-template.mjs`, which new-project removes as template only; the seed test expects `progress.json` to be empty; and the progress tests copied the repo's own `progress.json`, which in a project already has a new-build plan running.
- Fix: those four tests skip when `scripts/pack.mjs` is absent (a client repo); the progress test repo is seeded with `serialize(empty())` instead of the project's file.
- Status: open (fixed here; upstream to wf-template)
- Found by: claude

### 2026-11-06 · Staging ran the template's bundle: the loader was never re-pasted
- Area: loader
- Scope: template-candidate
- Symptom: on wf-mgt.webflow.io the page loaded `brandvm.github.io/wf-template/index.js` and `wf-template/styles.css`; none of this repo's modules ran, although batch 9 was on staging.
- Cause: the site was duplicated from the starter with the template's head code and G | Components Embeds; `pnpm new-project` updates `loader.html` in the repo but nothing re-pastes it into Webflow.
- Fix: re-paste the four pieces from `loader.html` (MANUAL-TODO D, done by the person). The head and footer code can be written through the MCP (`data_scripts_tool › set_site_freeform_code`, read back with `get_site_freeform_code`); the canvas Embeds likely through `data_element_settings_tool › set_settings` key `code` (untested). Claude first called this a manual step without checking the tools. Only the publish needs the person (Brand Vision hook). Upstream: new-project should print a "re-paste the loader" step, and `pnpm wf:install` (or the staging check) should fail when the published `SITE` differs from the repo.
- Status: fixed (re-pasted and verified on staging 2026-11-06)
- Found by: claude

### 2026-11-06 · Nested sg:start markers cut a style guide specimen short
- Area: designer
- Scope: template-candidate
- Symptom: the generated style guide's Why Split specimen had 27 opening and 25 closing divs, and the Reason List row was missing; importing it would have nested every later Components row inside it.
- Cause: on the Home page a `sg:start` block (Reason List) sat inside another (Why Split). `gen-style-guide.mjs` pairs each start with the next `sg:end`, so Why Split ended at Reason List's end marker. `check:style-guide` still passed.
- Fix: removed the inner markers (the outer specimen still applies the Reason List classes) and regenerated. Upstream: the generator should support nesting or fail on it, and the check should count tags per specimen.
- Status: fixed here; upstream to wf-template
- Found by: claude

### 2026-11-06 · A bare `<li>` rejects the whole WHTML call
- Area: mcp
- Scope: template-candidate
- Symptom: a five-row import failed with "List Item can only be placed in a List" and inserted nothing.
- Cause: the Step Card specimen was a lone `<li>`; the importer validates list items against a List parent and fails the whole call, not just that action.
- Fix: wrap specimens in their list (`<ol class="step-grid">`). After any refused call, read the parent back before resending: here it showed an earlier batch had also never been sent.
- Status: fixed
- Found by: claude

### 2026-11-06 · Attributes can't be written inside the page shell's slot; the importer empties form buttons
- Area: mcp
- Scope: template-candidate
- Symptom: on the style guide (content in G | Page W's slot), `set_attributes` failed on every form label and input ("Tool set_attributes failed" / "MPS rejected update … [Conflict] … component map"), also alone and on retry; `move_element`, `remove_element`, `set_link` and `set_style` worked. Imported `<form>`s lost every label `for`, radio `value` and select `<option>`, all inputs got one id (`field`), selects were renamed "Field", and `<button type="submit">` became an empty Form Button (its children dropped). `data_element_builder` refused the `attributes` and `textContent` settings on DOM elements, and refused `set_style` with two classes when the combo doesn't exist yet.
- Cause: attribute writes go through the component map of the instance that owns the slot; the importer maps form controls to Webflow form elements with their own settings.
- Fix: for the submit, move in a DOM `button` holding a Button Color instance. For plain controls, `data_element_builder` with `set_attributes` (the schema field, not `settings`), then the importer for `<span>`/`<option>` text appended into them. Label `for`, field ids, radio values and select options are a Designer step (MANUAL-TODO C). The real Contact and Toronto forms sit in the same slot, so expect the same.
- Status: open (manual step C)
- Found by: claude

### 2026-11-06 · The style guide came out of a stale snapshot
- Area: mcp
- Scope: template-candidate
- Symptom: the regenerated style guide's Overview said Colors Semantic had 22 variables and 2 modes and Colors 29; Webflow had 30 / 4 modes and 34 after batches 1–7. The Colors and Themes sections were missing the nav colours, Nav / Nav Open modes and Layout calc variables.
- Cause: `pnpm style-guide` reads `prototype/webflow-snapshot/variables.json`, which was taken before the variable batches and never refreshed.
- Fix: before generating the style guide for Webflow, rebuild the snapshot from Webflow (`get_variables` with all modes per collection, converted to the snapshot format; leftovers slated for deletion left out), then `pnpm style-guide` and `pnpm check:style-guide`. New colours need their Sg Swatch Color combos created first.
- Status: fixed (snapshot refreshed 2026-11-06)
- Found by: claude

### 2026-11-06 · The class plan silently leaves out properties listed in checkFirst
- Area: mcp
- Scope: template-candidate
- Symptom: classes built from `styles-plan.json` were missing their background or hover colour (Nav Bg, Nav Caret, Nav Toggle, Nav Link hover, Nav Mega Cta, Nav Menu on Tablet, Button Color Is Light, Icon Circle Is Button: 11 properties). Nothing in a class's `rules` said so.
- Cause: `pnpm wf:styles` drops any declaration whose variable isn't in `webflow-snapshot/variables.json` and only mentions it in the plan's top-level `checkFirst` list. Here the snapshot predated batch 1, which created those variables.
- Fix: before building classes, read `checkFirst`; put back each property whose variable exists in Webflow now. `docs/handoff/webflow/tools/plan2actions.py` does it and reports the rest (JS variables like `--compare` → repo CSS). Better upstream: re-run `wf:styles` from a fresh snapshot after the variables batch, or have it keep the property with a warning.
- Status: open (worked around here; upstream to wf-template)
- Found by: claude

### 2026-11-06 · Repo CSS reads five Webflow variable names (approved)
- Area: css
- Scope: project
- Symptom: none yet. This is a watch list. `src/styles.css` §05 (Michaels Global Trading components) reads `--_colors---brand--navy`, `--_colors---base--white`, `--_colors---brand--yellow`, `--_colors---navy-tint--navy-16` and `--_spacing---24` for the open services tab, the open FAQ/reason accordions and the Contact step line.
- Cause: those states are attribute or descendant selectors (`[aria-expanded="true"] .faq-icon`) the Designer can't express. The person chose variables over literal colours on 2026-11-06 (AGENTS.md rule 4), so the rules follow colour changes.
- Fix: **renaming any of these five in Webflow (Colors › Brand/Navy, Base/White, Brand/Yellow, Navy Tint/Navy 16, Spacing › 24) silently breaks those rules**, because Webflow rewrites its own references and never this bundle's. After a rename, update `src/styles.css`, then `pnpm build` and push.
- Status: open (watch list)
- Found by: claude

### 2026-11-06 · background-position without a background image is dropped; accent-color takes no variable
- Area: mcp
- Scope: template-candidate
- Symptom: Form Input Is Select's `background-position` was echoed back by `create_style`, but a later `get_styles` didn't have it. Retrying as `calc(100% - 1em) 50%` was echoed and dropped the same way. Separately, `create_style` with `accent-color` bound to a colour variable failed the whole action ("Property accent-color does not support setting a variable of type color").
- Cause: Webflow stores background position per background-image layer; with no image (the chevron is a prototype file, not an asset) there is no layer to hold it. The style API only takes variables on some properties (as with `outline-width` and `row-gap`).
- Fix: the position goes in the same Designer step as the image (MANUAL-TODO A). Radio Input's `accent-color` is set to the literal `#002e75` (Brand/Navy). `tools/plan2actions.py` now flags variable `accent-color` and local `url("/…")` images. Lesson: the write response is not proof; only a later read is.
- Update 2026-11-06: not a manual step after all. Uploaded both chevrons through `data_assets_tool › create_asset` + the S3 POST, set `background-image: url("<CDN url>")` with `update_style`, then the position as longhands: `background-position-x: calc(100% - 1em)` and `background-position-y: 50%` were kept. The shorthand `background-position` was still dropped even with the image on the class, so always write the longhands. Claude first listed it as manual without trying the upload.
- Update 2026-11-06 (later): the person chose the site's Phosphor icon over the SVG files. A `<select>` can't hold children, so each select now sits in Select W (`position: relative`) with a Select Icon (absolute, `pointer-events: none`) holding Icon (Is Size 14) › `i.icon-glyph` + custom `class` attribute `ph ph-caret-down`; Is Pill for the filter pills. The background properties were removed from both classes. Inside the page shell's slot, `data_element_builder` with `set_attributes` at creation is what sets the Phosphor class and `aria-hidden` (a later `set_attributes` fails there); `move_element` then puts the select in the wrapper.
- Update 2026-11-06 (later still): the hand-built Icon › Icon Glyph elements were replaced by **Icon Size component instances** (prop Icon `ph ph-caret-down`; a new **14px** variant, 0.875em, for the form selects; 16px for the pills). Claude built the icons by hand without checking the component list first: before building any icon, use Icon (colour variants) or Icon Size (size variants) and set the Icon prop. Insert with `insert_component_instance`; a variant prop takes the variant id as a `string` value. The nav's 56 icons (G \| Nav W) are still hand-built.
- Status: fixed (Icon Size instances on the style guide, read back; the two chevron assets deleted 2026-11-06)
- Found by: claude

### 2026-11-06 · A light card inside a dark section needs the Base mode, not Dark
- Area: designer
- Scope: template-candidate
- Symptom: the converter mapped Quote Card's Colors Semantic overrides to the Dark mode, which would have made the white quote card dark inside the dark Toronto hero.
- Cause: in the prototype, Quote Card re-declares the light values (white page, ink text, navy accent) to reset inside a dark parent. "Has semantic overrides" was treated as "is dark".
- Fix: choose the mode from what the overrides say: navy Background/Nav → Nav, white Background/Nav → Nav Open, ink Text/Primary → Base, white Text/Primary → Dark. Quote Card is set to `base`. The API accepts `mode_id: "base"` on `set_style_variable_mode`, although variable updates refuse it.
- Status: fixed
- Found by: claude

### 2026-11-06 · "Moved to a new site" was the same site renamed
- Area: mcp
- Scope: project
- Symptom: the build-state note said the build had moved to a new site (wf-mgt.webflow.io), that batch 1 didn't apply to it and had to be redone, and AGENTS.md held a site-ID placeholder.
- Cause: the Webflow site's short name was changed to `wf-mgt` (so its staging URL changed); the site ID `6aecfdb66cfe7667efc6d078` and every variable id stayed the same.
- Fix: before redoing work after a "new site" note, `list_sites` and compare the id, then read one collection against `variable-ids.json`. Here all ids matched and batch 1 continued; AGENTS.md now has the id.
- Status: fixed
- Found by: claude

### 2026-11-06 · The nav's filled phone icon won't render: only the regular Phosphor weight is bundled
- Area: css
- Scope: project
- Symptom: G | Nav W's phone icons use `ph-fill ph-phone`; the repo's `src/phosphor.css` (`pnpm phosphor`, default regular) has no `ph-fill` rules, so on staging those icons show nothing. The prototype loads regular and fill from a CDN, so it looked fine there.
- Cause: the prototype and the bundle load different Phosphor weights.
- Fix: either `pnpm phosphor regular fill` (adds the fill font to the bundle) or switch the nav to `ph ph-phone` (regular, as on Home). For the nav session to decide; check on staging after the next publish.
- Status: open
- Found by: claude

### 2026-11-06 · More than ~50 actions in one MCP call hit 429 Too Many Requests
- Area: mcp
- Scope: template-candidate
- Symptom: a 58-action `data_element_tool` call (moves, removes, a query) succeeded for the first 50 and returned `429 too_many_requests` for the last 8; nothing was rolled back.
- Cause: Webflow API rate limit, counted per action.
- Fix: keep calls under ~50 actions, read the result per action, and resend only the failed ones (they succeeded on the retry a minute later).
- Status: worked around
- Found by: claude

### 2026-11-06 · Building a page in a slot: placeholders, then builder images, instances and DOM buttons
- Area: mcp
- Scope: template-candidate
- Symptom: inside G | Page W's slot, `set_attributes` on imported elements fails, imported `<img>` lose their asset and attributes, `<button>` becomes a Link, and icons should be component instances, so a plain WHTML import of a prototype section can't be finished afterwards.
- Cause: the limits listed in lessons/mcp.md (importer, slot, attributes).
- Fix: import each section with an empty `div[data-todo="<kind>-<n>"]` wherever an image, icon, component button or `<button>` goes; find them with `query_elements` `attribute_name: data-todo`; build next to each placeholder: Images with `data_element_builder` (asset, class and attributes at creation all stick in the slot), `insert_component_instance` "before" the placeholder (then set props; a variant is its id as a string), DOM buttons with their attributes at creation and the placeholder's children moved in (instances move too); then remove the placeholders. Bare `data-*` attributes need a value, including one at the end of a tag. Used for the whole Home page (batch 11); scripts in `docs/handoff/webflow/tools/page-build/`, steps in `webflow-build-state.md` › Batch 11.
- Status: worked (Home page)
- Found by: claude

### 2026-11-06 · An image without a class or size lazy-loads at 0×0 and never shows
- Area: mcp
- Scope: template-candidate
- Symptom: on staging the Home check and reason icons (SVG images with no class) were invisible: `loading="lazy"`, `naturalWidth` 0, 0×0 box, never requested.
- Cause: Webflow publishes images without `width`/`height` (it takes them from the asset, and API-uploaded assets have none), and a 0×0 lazy image never intersects the viewport. The prototype had `width`/`height` attributes. `data_element_builder` refuses `width` as an attribute ("reserved attribute name"), and the refused builds still left 10 class-less images behind.
- Fix: give every image a class with its size (Check Chip Icon 14px, Icon Tile Img 26px), in Webflow and the prototype. After a refused build, query the page for strays and remove them.
- Status: fixed (Home, republished and checked 2026-11-06)
- Found by: claude
