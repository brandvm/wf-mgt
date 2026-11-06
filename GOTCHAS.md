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

