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
- Update 2026-11-09: the footer logo (Footer Logo Img: width 16em, height auto, an API-uploaded SVG) had the same 0-height box on staging. Fixed with `aspect-ratio: 256 / 55` on the class, which gives the image a height before it loads. Use `aspect-ratio` on any image class that sets only a width.
- Found by: claude

### 2026-11-07 · A publish from an old Designer tab left the API's style changes off staging
- Area: mcp
- Scope: template-candidate
- Symptom: after Claude changed Faq Grid and Faq Trigger through the API (read back fine), the person published and staging still served the old 3-column CSS; earlier API changes (Chip, Button Icon) were on staging.
- Cause: most likely the publish came from a Designer tab opened before the API writes, which publishes the state it has loaded.
- Fix: reload the Designer before publishing after API style changes, or publish through the API (`publish_site` with `publishToWebflowSubdomain: true`). Check the published stylesheet for the changed rule after every publish.
- Status: fixed (published through the API 2026-11-07)
- Found by: claude


### 2026-11-09 · CMS field groups can be written through the API
- Area: mcp
- Scope: template-candidate
- Symptom: the person asked for every collection's fields to be grouped in the CMS editor ("in webflow we can group cms fields now"). The build notes and lessons had no step for it.
- Cause: field groups are new in Webflow; the skill predates them.
- Fix: `data_cms_tool › update_collection_field_groups` with the full ordered list of `{displayName, description?, fieldIds}` (ids from `get_collection_field_groups › groupableCollectionFields`; Name and Slug can't be grouped). The write's own response doesn't show the groups: read back with `get_collection_field_groups › collectionFieldGroups`. Group by page section (Core, Hero, …, SEO). Done on Service Areas (8 groups); every new collection should get its groups in the same batch as its fields.
- Status: worked (Service Areas, 2026-11-09)
- Found by: human + claude

### 2026-11-09 · HubSpot's v2 embed always renders in an iframe; style it from inside
- Area: js
- Scope: template-candidate
- Symptom: the live Contact form (legacy HubSpot form, theme "round", reCAPTCHA and a file upload on) rendered into `iframe.hs-form-iframe` with `hbspt.forms.create`, also with `css: ''`; repo CSS on the page can't reach it. Then, once restyled, the iframe stayed at 150px / an early height, and wheel scrolling over it skipped Lenis.
- Cause: v2 renders forms in an iframe unless the form is set to raw HTML in HubSpot (a paid setting that would also unstyle the live site's form). The iframe has no `src`, so it is same-origin. Webflow's base (`html { height: 100% }`, `body { min-height: 100% }`) tied the content to the frame height; a ResizeObserver (the page's or the frame's own) never fired for the frame's elements; HubSpot rewrites the iframe height after re-renders; wheel events in a frame never reach the page's Lenis. The submissions API was no alternative: captcha and file upload.
- Fix: `src/modules/hubspot-form.ts`: in `onFormReady`, remove HubSpot's `<style>`s, copy the page's stylesheets in, set the frame's body font size from the page's (the fluid scaling reads 100vw), add the site's Webflow classes to HubSpot's elements (re-added by a MutationObserver from the frame's realm), html `height: auto` + body `min-height: 0`, fit the iframe on DOM mutations / stylesheet loads / resize with `height … !important`, forward wheel to Lenis, move the Designer's `[data-hubspot-submit]` button in and click HubSpot's hidden submit. `instanceof HTMLElement` is false for the frame's nodes (other realm). The hidden Browser pane throttles rAF, so check this in headless Playwright, not there.
- Status: worked (prototype; staging after the next publish)
- Found by: claude

### 2026-11-09 · A class with `display` beats the `hidden` attribute: all four tab panels showed at once
- Area: designer
- Scope: template-candidate
- Symptom: on the Service Areas template (4 tab panels, the first prototype page with more than one) every panel showed side by side; the tabs module had set `hidden` on panels 2–4 and they still computed `display: flex`.
- Cause: `.services-panel { display: flex }` outranks the browser's `[hidden] { display: none }`. Home had one panel, so nobody saw it. `faq.ts` relies on `hidden` too and works only because Faq Panel sets no display.
- Fix (person's rule: first-paint state in Designer styles): Services Panel `display: none`, new combo Services Panel › Is Active `display: flex` on the open panel in the markup (template, Home, style guide), and `tabs.ts` toggles `is-active` on panels as well as `hidden`. FAQ panels on the template now carry `hidden` in the markup so they don't flash open before the script. Any class that sets `display` on an element a module hides with `hidden` needs the same treatment.
- Status: fixed in Webflow; `src/modules/tabs.ts` + `dist/` rebuilt, not committed yet
- Update 2026-11-09: pushed in 62726ed and published. Side effect on Home: its Services tabs have 4 tabs but only 1 panel (prototype too), so clicking tabs 2–4 now hides the only panel and the section goes blank; before, the class kept that panel showing whatever tab was clicked. Home needs one panel per tab (CMS lists as on the Service Areas template).
- Found by: human

### 2026-11-09 · Collection List writes: a Reference filter is refused; text Spans can't bind, DOM spans can
- Area: mcp
- Scope: template-candidate
- Symptom: `filters` `[{fieldSlug:"category",operator:"equals",value:"<item id>"}]` failed with "[Conflict] … component map" on four fresh body-level lists (an object value is rejected as "requires a string or binding value", so the string is the right shape); `source` and `sort` on the same lists took. A text Span from the importer (`0<span>1</span>`) refused a `text` binding ("not applicable"); a DOM `span` built with `data_element_builder` took a Number binding. `set_attributes` (`hidden`, `data-faq`) worked on imported blocks inside the page shell's slot, unlike the form labels in GOTCHAS 2026-11-06.
- Cause: unknown, Webflow-side; the referenced items were drafts, which may matter.
- Fix: Reference filters are a Designer step (MANUAL-TODO G). For a "01"-style number, a static "0" plus a DOM span bound to an integer Order (works while Order < 10). Hide a list's default Empty State with `set_visibility false`, never remove it (lessons: removing it deletes the list).
- Update 2026-11-09: the Designer refused the filter on those lists too; they were rebuilt in the Designer (next entry), so the filter is not an API-only limit.
- Status: worked around
- Found by: claude

### 2026-11-09 · Collection Lists built through the API refuse filters, in the Designer too
- Area: mcp
- Scope: template-candidate
- Symptom: every Collection List made with `data_element_builder` (at body level, then moved into G \| Page W's slot) refused a filter: the API's "[Conflict] … component map" (GOTCHAS 2026-11-09 above), and the same "[Conflict] The operation could not be applied to the component map" toast when clicking Add filter in the Designer, after a reload as well. Source, sort and the row link (Collection page › Current Service) still took. A Collection List added in the Designer at the same place took filters at once. The importer had also left a custom attribute `href = #` on every imported link, which would override a Collection page link.
- Cause: unknown, Webflow-side; the API-built list carries something the Designer's filter write can't apply.
- Fix: in the Designer, add a Collection List (select the parent and add it, or it nests in the selected list and fails), set source, filter and sort there; then through the API move the item content into the new Collection Item, `set_style` the list class, hide the empty state, remove the old list. Moves keep bindings and link settings. Remove the `href` custom attribute on imported links. Done for the Service Areas template (4 Services + FAQs) and Home (4 Services). The Designer hides draft items, so these lists show "No items" there until items are published.
- Status: worked around
- Found by: claude

### 2026-11-09 · Rich-text child styles can't be created through the API; conditional visibility can't bind an Image field
- Area: mcp
- Scope: template-candidate
- Symptom: on the Services template, `create_style` with name `p` and `parent_style_names: ["Rich Body"]` made a combo class `.rich-body.p`, not the nested `.rich-body p`; `update_style` with the same names failed ("Style \"Rich Body > p\" not found"). `set_visibility` with a CMS binding to an Image field (Before Image) failed: "Incompatible binding … cannot bind to target".
- Cause: nested rich-text styles are created by the Designer only (the API can update them afterwards, lessons/mcp.md 2026-10-28); visibility binds only boolean sources.
- Fix: both are Designer steps (MANUAL-TODO I and J). Keep a `data-condition="<rule>"` attribute on each wrapper during the build so the Designer step is easy to find, and a single-image figure next to the slider for items with no Before Image. `text-wrap: balance` is accepted by `update_style` (D0–D6, read back).
- Status: worked around 2026-11-09 (I and J done in the Designer; see the next entry)
- Found by: claude

### 2026-11-09 · Imported elements refuse conditional visibility in the Designer; bound rich text children can't be styled; Designer-made list wrappers shrink
- Area: designer
- Scope: template-candidate
- Symptom: on the Services template (built in G \| Page W's slot with the WHTML importer), Settings › Visibility › Create conditional on an imported div showed "[Conflict] The operation could not be applied to the component map". A CMS-bound Rich Text's paragraphs can't be selected, so its child styles can't be made on it. The Designer-made FAQs Collection List rendered 735px wide inside a 1240px column (same on staging for Toronto's FAQ list).
- Cause: the same component-map conflict as API-built Collection Lists (entry above): elements created through the API in the slot refuse some Designer writes. The Collection List Wrapper has no class, so it shrinks inside a flex column with `align-items: flex-start` (S Wrapper).
- Fix: add a Box in the Designer, set its condition there (it takes it), then through the API move it into place, `set_style` / `set_attributes` it as the old wrapper, move the content in and remove the old wrapper. For rich-text child styles, add a temporary unbound Rich Text with the class, select its p / ul / ol / li / a and choose the tag in the selector with the keyboard (Down, Enter; a click on the menu item often doesn't take), tick "Nest selector inside of <class>", set a property, then delete the temporary element; later edits work through `update_style` with `parent_style_names`. Give Designer-made list wrappers a class with `width: 100%` (Faq List W). Also: an API call with another page's `pageId` switches the open Designer to that page.
- Status: worked around (Services template); Toronto's FAQ list wrapper still unclassed
- Found by: claude

### 2026-11-09 · A form's classes land on the w-form wrapper, not the `<form>`
- Area: designer
- Scope: template-candidate
- Symptom: the Services hero quote form was 62px shorter on staging than in the prototype: no gap between the fields, Add details, the button and the note.
- Cause: the importer (and Webflow's Form Block) puts the class list on the `div.w-form` wrapper; the inner `<form>` gets no class. Quote Form's `display: flex; flex-direction: column; row-gap` laid out the wrapper (form + hidden success/error), not the form's children. The prototype has the classes on the `<form>`.
- Fix: put the layout class on the Form Form element (`set_style` on the `FormForm` child) and keep only Form on the wrapper. Done on the Services Template; Toronto's quote form still has it on the wrapper. Check every imported form for this.
- Status: fixed on the Services Template; Toronto open
- Found by: claude

### 2026-11-09 · A grid class without explicit columns/rows shows 2 × 2 in the Designer
- Area: mcp
- Scope: template-candidate
- Symptom: the Designer canvas didn't match staging in places, e.g. the quote form's full-width submit button (Button › Is Full) sat at half width in the Designer and full width on staging.
- Cause: classes written through the API with `display: grid` and no `grid-template-columns` / `grid-template-rows`. The published CSS has no template, so the browser uses one implicit track; the Designer fills an unset template with its own default of 2 columns × 2 rows. Spotted by the person. Nine classes had it: Button › Is Full (both), and rows only on Nav Mega Stats, Nav Mega Grid (and its Is Split / Is Resources), Nav Mega Links › Is Two Col, Nav Posts, Choice Group, Form Columns.
- Fix: set the value the browser already uses, so staging doesn't change: `grid-template-rows: auto` on all, plus `grid-template-columns: auto` on Is Full. Read back from a full `get_styles` (all breakpoints, combos merged with their parent): none left. Whenever a class gets `display: grid` through the API, write both templates in the same call. To audit: every selector whose effective display is grid at a breakpoint (own + parent class, cascading down the breakpoints) must have both templates.
- Status: fixed (published 2026-11-09; the live stylesheet has both templates on all seven rules)
- Found by: human

### 2026-11-09 · Clicking a component in the Components panel inserts an instance
- Area: designer
- Scope: template-candidate
- Symptom: to edit the Locations component, Claude clicked its row in the Components panel; a new Locations instance appeared at the end of Home's Body, after G | Page W.
- Cause: a click on a panel row inserts the component into the page; editing is the row's hover icon (Edit component), or double-clicking an instance on the canvas.
- Fix: undone with cmd+z (Body back to G | Components and G | Page W). Open a component definition with the row's Edit icon only.
- Status: fixed
- Found by: claude

### 2026-11-09 · Locations tags from the CMS: a list in a component needs the Designer for sort, binding and link
- Area: mcp
- Scope: template-candidate
- Symptom: the Locations component's Collection List built with `data_element_builder` (`scope_component_id`) took its source, but the API refused sort ("No source connected", right after the source took) and the Designer refused it too ("[Conflict] … component map").
- Cause: the same API-built-list conflict as the page lists (entries above), inside a component definition.
- Fix: add the Collection List in the Designer inside the component (open it with the Components panel row's Edit icon), set source and sort there, then move the item content in through the API (`move_element` with `scope_component_id`), class it, hide the empty state, remove the old list. Field binding (Link Text → Name) and the link work in the Designer on either list; in a list the link is the Link dot › Connect › Service Areas › **URL Path** (not Type › Collection page), and both survive the move.
- Status: worked around
- Found by: claude

### 2026-11-09 · Collection List sort refused on brand-new lists, even at body level
- Area: mcp
- Scope: project
- Symptom: on the new Case Studies page, `filters` (`featured` `isOn`) and then `sort` (`project-date` descending) on two fresh body-level Collection Lists, and `sort` on a list rebuilt for the purpose, all failed with "[Conflict] … component map". `source` and the nested lists' `limit` took. (`equals` on a Switch is rejected with a clear message: use `isOn`.)
- Cause: the API-built-list conflict in the entries above; on this day it also hit `sort`, which had taken on the Service Areas and Home lists.
- Fix: build the item content and bindings in the API lists, move them into place, and leave source/filter/sort to Designer-made lists (MANUAL-TODO P), as for E/G/H. Nested lists sourced from a multi-reference (`{"collectionId", "fieldId"}`) took source and `limit` on the Case Studies template; the item context reads the referenced collection (`get_bindable_sources` lists its fields).
- Status: worked around
- Found by: claude

### 2026-11-09 · Blog build: CSV import, nested heading modes, pagination and list filters
- Area: mcp
- Scope: template-candidate
- Symptom: (1) the Designer's CSV import preview said the Category reference "does not exist" for every row, and dropped `loading="lazy"` from all 246 rich-text images (`loading="auto"`); items arrived staged, not draft. (2) Inserting a Button Color instance into a Collection List's pagination Next failed: "Components are not allowed in Pagination"; `set_text` on Pagination's text blocks fails too. (3) On a template page, a Designer-made list filter "Blog Post is not Current Blog Post" reads back as `filters: []` through the API, while other filters (Switch `isOn`) read back.
- Cause: (1) the preview matches by name, the import by slug; the import rewrites rich-text images. (2) Pagination is a closed Webflow structure. (3) The API has no shape for "current item" filters.
- Fix: (1) a Category column of category slugs works; set `isDraft: true` afterwards (`update_collection_items` with `fieldData: {}` is accepted; the response echoes every body, so it lands in a file); lazy loading would need every body written through the API. (2) give PaginationNext its own class (Load More) and WHTML-import the label div into it, hide PaginationPrevious. (3) check "exclude current item" on staging, not through the API. Also: for rich-text heading sizes, nest the tag selector in the class and set its **Typography Styles variable mode** (H2 → H4 mode) in the Designer instead of font-size properties; margins can then be set through the API with `parent_style_names`.
- Status: worked around (Blog page and Blog Posts Template, 2026-11-09)
- Update 2026-11-09 (Finsweet List filter, checked against the 2.7.1 source after the person said it wasn't right): (a) the WHTML importer had dropped `fs-list-field` from the card chip (lessons: "WHTML drops fs-* attributes"), so every category would have filtered to nothing: set it with `set_attributes` after the import and read it back. (b) An "All" built as `fs-list-element="clear"` never gets or loses the active class: Finsweet toggles it only on radio/checkbox labels (`closest('.w-radio, .w-checkbox, label')`). Make All a radio in the same group with `value=""`, `fs-list-value=""` and `checked`. (c) The default active class is `is-list-active`; to use a Designer combo (Is Active) put `fs-list-activeclass="is-active"` on each radio. Radios use the `equal` operator, so `fs-list-value` must match the bound CMS text exactly. Load more needs nothing else: `fs-list-load="more"` on the list fetches all pages, filters across them and uses Webflow's pagination Next.
- Update 2026-11-09 (dates): imported Published Dates at `T00:00:00Z` displayed one day early on staging, since the site time zone is America/Toronto (the live site showed the right day). Fixed by rewriting every date at `T12:00:00Z` and republishing the items. Also: the live CMS held 5 posts dated in the future that live had never published (scheduled content); importing "everything not draft" published them. Check `lastPublished` on the source items, not only `isDraft`.
- Found by: human + claude

### 2026-11-09 · A component used on the 404 page can't hold a Collection List
- Area: designer
- Scope: template-candidate
- Symptom: adding a Collection List to G | Nav W (to make the mega menu CMS-driven) failed in the Designer: "Sorry, you can't add a Collection List to a Component that's used on 404 page." The page shell (G | Page W, which holds the nav) is on the 404 utility page, where Webflow allows no CMS.
- Cause: platform limit on utility pages.
- Fix (person's choice): on the 404 page, unlink the G | Page W instance, then the G | Nav W instance inside it (right-click › Unlink instance; Page W's nested instances stay linked otherwise). The 404 keeps a static copy of the shell and nav that won't follow later edits. The nav component then took the lists: Services (4 lists, Category = each category and Show in Nav on, sort Order), Service Areas (sort Order), Resources (Blog Posts, Published Date newest first, limit 2). Built one Services list in the Designer, moved the static row in through the API, bound Name / URL Path, then copied that list (cmd+c) into the other three columns (select the column, cmd+v) and changed only the Category filter value: bindings travel with the copy. Inside a list, a link is the Link dot › Connect › <collection> › URL Path.
- Status: worked around (404 nav is a static copy; update it by hand if the nav changes)
- Found by: claude

### 2026-11-09 · Select options through the API: one WHTML action per `<option>`
- Area: mcp
- Scope: template-candidate
- Symptom: importing five `<option>`s into a DOM `select` (Case Studies filter bar) in one WHTML action failed: "Expected single root element but found 5 elements"; wrapping them in a div isn't valid inside a select.
- Cause: the importer takes exactly one root element per action.
- Fix: build the form controls as DOM elements with `data_element_builder` (`select` with `id`, `name`, `fs-list-field` / `fs-list-element` set at creation, which sticks inside the page shell's slot), then append each `<option value="…">Text</option>` in its own WHTML action (5 per call). The option arrives as a DOM `option` with its `value` kept and an `&` split into three strings (renders fine). Label text: append `<span>Service:</span>` into the DOM label span.
- Status: worked (Case Studies filter bar)
- Found by: claude

### 2026-11-09 · Adding a combo class to an element that already has one makes a new three-class combo
- Area: designer
- Scope: template-candidate
- Symptom: the Toronto overview logo strip (Logo Strip + Is Ruled) needed the existing Logo Strip › Is Small combo; typing "Is Small" in the Designer would have created `.logo-strip.is-ruled.is-small`, an empty new combo, not reused `.logo-strip.is-small`.
- Cause: Webflow combos are the full class chain.
- Fix: create the three-class combo with the same values (`create_style` with `parent_style_names: ["Logo Strip", "Is Ruled"]`), then pick it in the Designer selector (it shows under Existing Combo Classes). Better: size with a property the parent can carry (here the wrapper's font-size drives the logo's em height), so one combo per chain is enough.
- Status: worked around
- Found by: claude

### 2026-11-09 · Double and missing focus rings on wrapped controls; selects replaced by a custom dropdown
- Area: css
- Scope: template-candidate
- Symptom: the person saw the native select's square navy ring inside the rounded Filter Pill (Case Studies). A Playwright audit (Tab and mouse click, 1440 and 375, Home, Case Studies, Blog, Services and Service Areas templates, Contact) found more: Form Input showed its Active border plus a Form/Focus outline 3px away (two indicators, on click too); HubSpot radios showed their own ring inside Choice's Focus Within ring; the Blog topic radios are `sr-only`, so their ring was invisible (keyboard focus not shown at all); the Services Panel (`tabindex="0"`) ring was clipped by Services Card's `overflow: hidden`.
- Cause: the repo's §07 fallback `:focus-visible` ring lands on whichever element has focus, also one drawn by its wrapper; a `<select>` matches `:focus-visible` on a mouse click; the Designer has Focus Within but no keyboard-only state for a parent.
- Fix: Designer: Form Input Focus and Focus Visible = Border/Active border + one 3px Form/Focus Ring outline at offset 0. Filter Pill, Choice and Segmented Tab carry the ring's colour, width and offset with `outline-style: none`, and a repo `designer-cant` rule (`:has(:focus-visible)`) only switches the style to solid, so the colour stays a Designer variable and the repo reads no variable name. The inner control's Focus Visible is outline none (Filter Pill Select, Radio Input). Services Panel Focus Visible is inset (-0.125em). Native selects are replaced by `src/modules/custom-select.ts` (button + listbox, `data-custom-select` on Filter Pill or Select W; the native select stays behind it for submission and Finsweet). Its look is Designer classes: Select List (+ Is Open), Select Option (+ Is Active, Is Selected), Filter Pill › Is Open, Form Input › Is Error for an empty required select on submit.
- Also: `update_style` refuses custom properties ("Invalid style property --color-accent"), so the fallback ring colour can't be bound to Form/Focus through the API. In the module: `select.checkValidity()` fires `invalid` (use `validity.valid`); Webflow's `label { font-weight: bold }` reaches a list inside a pill label (Select List sets weight 400 and the Form Input type mode); a click inside a `<label>` activates its select (preventDefault on the list's click); the list needs `data-lenis-prevent` to scroll under Lenis.
- Status: fixed d63a74f, published to webflow.io and checked there 2026-11-09 (Playwright: focus audit at 1440 / 375; Case Studies filter and sort through the dropdown; required-select error on the Services form). Open: Select List / Select Option have no style guide specimen yet, so "Clean up unused styles" would delete them.
- Found by: human + claude

### 2026-11-09 · Copy/paste between pages: switch pages inside the Designer, never reload
- Area: designer
- Scope: template-candidate
- Symptom: copying Home's Why Split block, loading the Service Areas template by URL and pasting gave "For pasting cross-site we had to drop some custom fonts. Renamed 18 classes in order to avoid conflicts" — the paste brought duplicate, renamed classes.
- Cause: a reloaded Designer treats the clipboard as coming from another site.
- Fix: undo (the renamed classes went with it; checked the style list), then copy, switch page through the Pages panel and paste: classes, attributes (`data-faq…`), DOM buttons and images all came through intact. Re-bind CMS fields on the pasted copy (`set_settings` text binding) and change static text with `set_text` on the String nodes.
- Status: worked around
- Found by: claude

### 2026-11-09 · The marquee paused for good when one logo set was wider than its strip
- Area: js
- Scope: template-candidate
- Symptom: on /case-studies the logo marquee stopped after scrolling back up from the bottom; Home kept moving.
- Cause: `marquee.ts` paused rows its IntersectionObserver reported off screen, and it observed the moving row. In the narrower Case Studies column one set (~1350px) was wider than the row (1240px), so the transformed row could slide entirely out of its own box, read as not intersecting and never restart.
- Fix: observe the clipping wrapper (`row.parentElement`) instead of the row. Tested on staging with the local bundle swapped in.
- Status: fixed in src (pending push)
- Found by: human

### 2026-11-09 · `create_asset` with an existing file's hash returns that asset, under its old name
- Area: mcp
- Scope: template-candidate
- Symptom: uploading `factor-replies.svg` for About Us, `create_asset` answered with asset `6af237d1…` named `price-timing.svg`, created hours earlier, and upload details for that old key; the other five new icons got fresh ids.
- Cause: Webflow deduplicates assets by MD5: an identical file (here the same clock icon under another name) maps to the existing asset.
- Fix: check the returned `id` / `originalFileName` against the name sent; when it is an older asset, skip the S3 POST and use that id. Nothing is wrong with the asset; only its display name differs.
- Status: worked around (About Us, 2026-11-09)
- Found by: claude

### 2026-11-09 · FAQs page: option-field filter keys, builder text in children, variable ids in create_style
- Area: mcp
- Scope: template-candidate
- Symptom: (1) binding the FAQs Topic option to `data-category` on a Collection Item gives the option's name ("IT & data", "Furniture value"); `filter-tabs.ts` split it on spaces, so the `it-data` / `furniture-value` tabs matched nothing. (2) `data_element_builder` ignored `set_text` on TextBlock children of a nested schema (they kept "This is some text inside of a div block."). (3) `create_style` with `variable_as_value: "2d3c…"` failed with "An internal error occurred"; the same call with `"variable-2d3c…"` (the id as `query_styles` prints it) worked.
- Cause: (1) Webflow binds an Option field as its display name; (2) and (3) API quirks.
- Fix: (1) `filter-tabs.ts` also compares the slug of the whole value (`IT & data` → `it-data`), so tab keys stay slugs. A custom attribute bound to an Option field works on a Designer-made Collection Item through `set_settings` key `attributes` with `value_binding`. (2) After a build, read the String children back and `set_text` them (it is ignored on a top-level TextBlock too, seen again 2026-11-09). (3) Pass variable ids with their `variable-` prefix.
- Status: fixed in src (filter-tabs.ts + dist/, not committed); staging was checked with the local bundle swapped in
- Found by: claude

### 2026-11-09 · A GSAP `scale` tween on a parallax image jitters: both write `transform`
- Area: js
- Scope: template-candidate
- Symptom: in the motion preview, the photo reveal (zoom 1.12 → 1) and the hero photo settle looked glitchy; spotted by the person.
- Cause: GSAP's `scale` is part of the `transform` it writes inline; `parallax.ts` rewrites the same image's inline `transform` on every scroll frame, so each overwrote the other.
- Fix: run the zoom on the CSS `scale` property, which composes with `transform`: `img.style.scale = 'var(--reveal-scale, 1)'` and tween `--reveal-scale` with GSAP (or WAAPI on `scale`). Rule: only parallax.ts writes `transform` on a `[data-parallax]` image. Prototype `design/motion/reveal.ts`; port target `src/modules/reveal.ts`.
- Status: fixed in the preview (not built yet)
- Found by: human

### 2026-11-09 · CMS field tokens: refused in jsonLdSchema and OG image, accepted in page head code
- Area: mcp
- Scope: template-candidate
- Symptom: porting the live site's CMS-bound schema, `bulk_update_pages_schema_markup` on a collection template refused a JSON-LD string holding `{{wf {"path":"slug",…\} }}` tokens ("The provided schema markup must be valid JSON"), with or without a `<script>` wrapper. `update_page_settings` refused a field token as `openGraph.imageUrl` ("should match pattern ^https?://").
- Cause: the schema endpoint parses the value as JSON; the OG image field takes a URL or asset id only. The live site's bound schema was entered in the Designer (`rawJsonLdSchema`).
- Fix: CMS-bound JSON-LD goes in the template's head code through `set_page_freeform_code`, with the tokens written the way the Designer stores them: `{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}` (read back identical). Bind single-line fields only; check the rendered JSON on one published item per template. Static pages take a plain JSON object through `bulk_update_pages_schema_markup`. Binding an image field as the OG image is a Designer step (MANUAL-TODO U).
- Status: worked around (Services, Service Areas, Blog Posts, Case Studies templates; rendering not yet checked on staging)
- Found by: claude

### 2026-11-09 · Phone links built by the importer keep a stale `href` attribute
- Area: mcp
- Scope: template-candidate
- Symptom: changing the phone number, every imported Phone Button / D3 phone link still carried a custom attribute `href="tel:6473170860"` next to its link setting, which would override the new `set_link` value in the published HTML (as with the `href = #` on imported links, GOTCHAS 2026-11-09).
- Cause: the WHTML importer copies `href` into a custom attribute as well as the link setting.
- Fix: `set_link` with `linkType: phone` and the **bare number** (`+16474966362`): Webflow adds `tel:` itself, and a value written as `tel:6474966362` published as `href="tel:835:6474966362"` (broken; caught by the About session). Then `remove_attribute ["href"]`, query `attribute_name: href` to confirm none is left, and after the publish `curl` a page for `tel:` hrefs. Search a page with `element_filter.text` for the old number to find the String nodes; `set_text` works on them.
- Status: fixed on every page except About Us and FAQs (their sessions told)
- Found by: claude


### 2026-11-09 · A phone link set to "tel:…" publishes as `tel:835:…`
- Area: mcp
- Scope: template-candidate
- Symptom: after `set_link` `linkType: phone`, link `tel:6474966362`, staging published `href="tel:835:6474966362"` (broken) on About Us, Home, the CTA Banner and G | Footer W; the read-back showed `tel:6474966362`, so nothing looked wrong before the publish.
- Cause: a phone link adds `tel:` itself; a value that already starts with `tel:` gets mangled on publish.
- Fix: pass the bare number, `+16474966362` (publishes `tel:+16474966362`, as the nav's links do); check the published HTML for `tel:835`. About Us fixed and republished; components and other pages passed to the SEO session.
- Status: fixed everywhere (the SEO session reset 28 links; published to webflow.io, Home / About / Contact checked: all `tel:+16474966362`)
- Found by: claude

### 2026-11-09 · Duplicating a page keeps its Designer-made filtered lists; the importer can make a case-variant duplicate combo
- Area: mcp
- Scope: template-candidate
- Symptom: (1) the services hub needed four Services lists filtered by Category, which API-built lists refuse (entries above). (2) WHTML `class="arrow-link is-small is-end"` produced a new empty combo named `is-end` beside the existing `Is End` (same selector, no properties), so the arrows lost `margin-top: auto`.
- Cause: (1) `create_page` with `duplicateOf` copies elements with their list settings. (2) the importer matched the class list by name, not by selector, for a three-class chain.
- Fix: (1) duplicate a page that already has the lists you need (Home), then move and restyle them through the API: filters, sort and item links survive. (2) after an import, `query_styles` the combos you used; `set_style` to the existing name, then remove the duplicate (here it couldn't be removed yet: something else uses `is-end`).
- Status: worked (Our Services, 2026-11-09)
- Found by: claude

### 2026-11-09 · Testing an unpublished bundle on staging: answer the bundle requests from dist/
- Area: ci
- Scope: template-candidate
- Symptom: the loader's dev mode (`?wfc-dev=1`) is pinned to http://localhost:3000; the Browser pane's dev server came up on 3001 (3000 reported busy), and `pnpm dev` started from the workspace root with `--dir wf-mgt` failed with ERR_PNPM_BAD_PM_VERSION (corepack runs the global pnpm 12 against the repo's pinned 11).
- Cause: launch configs run from the workspace root; dev mode has one fixed origin.
- Fix: test with headless Playwright instead: `page.route(/brandvm\.github\.io\/wf-mgt\/(.+)/)` fulfilled from `wf-mgt/dist/<file>` after `pnpm build`. It also avoids the hidden Browser pane's frame throttling (transitions sat at time 0 there). A launch config for `pnpm dev` needs `"cwd": "wf-mgt"`.
- Status: worked around
- Found by: claude

### 2026-11-10 · Setting a Block's text through `set_settings` deletes its child elements
- Area: mcp
- Scope: template-candidate
- Symptom: making the Home carousel CMS-driven, the chip (`div.chip`) needed a static "Case study · " plus a span bound to Project Type. After the span was added and bound, a second `set_settings` `text` write on the chip (to change the prefix) left only the String: the bound span was gone. Also: `data_element_builder` refused a CMS binding at creation ("Element is not inside a CMS context") for a span inside a Collection Item, and `set_text` refused the Block ("doesn't support text"); a trailing normal space in the static text is trimmed on publish.
- Cause: the Block's `text` setting replaces all its children.
- Fix: write the Block's static text first (end it with a no-break space, U+00A0, so it isn't trimmed), then build the DOM span empty and bind it with a separate `set_settings` call. Read the children back after any `text` write. Separately: a carousel built from only 3 static slides looked jumpy because `carousel.ts` re-orders slides on every move and with 3 the moved slide is on screen; with 11 CMS slides, Playwright saw no on-screen jumps (only off-screen slides move).
- Status: worked (Home carousel, published 2026-11-10)
- Update 2026-11-10: the placeholders were deleted and the 4 real case studies jumped again (1 on-screen jump per Next). `carousel.ts` now repeats the slide set until there are at least 8 (`data-carousel-copy`, `aria-hidden`, links out of the tab order); Playwright on staging with the local bundle: 0 jumps at 1440 and 390.
- Found by: claude

### 2026-11-10 · A section holding a Collection List can only become a component in the Designer; a collection stops at 60 fields
- Area: mcp
- Scope: template-candidate
- Symptom: (1) `transform_element_to_component` on Home's case studies section refused: "this element contains a Collection List bound to a CMS collection … Components can't hold a live CMS binding". (2) `create_collection_static_field` for a fifth new Services field failed: "Can not have more than 60 custom fields".
- Cause: (1) an API-side guard; the Designer allows it (Locations already holds a list). (2) Webflow's per-collection field limit.
- Fix: (1) select the section in the Navigator, right-click › Create component, untick "Create N properties" (it makes one per text), then add only the props you want through the API (`create_prop` textContent, multiline keeps a `<br>`) and bind them with `set_settings` key `text` + `scope_component_id`. The list's source, filter and sort survive, and the instance works on CMS template pages. (2) count fields before planning new ones; the Results button label became a fixed template text. Optional bound text lists hide empty items with a repo `:has(.w-dyn-bind-empty)` rule (`data-hide-empty`) instead of one Designer condition per item.
- Status: worked (Case Studies component on Home, Services and Service Areas templates)
- Found by: claude

### 2026-11-10 · Inside HubSpot's iframe, Webflow breakpoints read the iframe's width
- Area: designer
- Scope: template-candidate
- Symptom: Form Columns set to 2 columns with a 1-column style at the 767 breakpoint showed 1 column in the 576px-wide service hero form on a 1440 screen.
- Cause: hubspot-form copies the page's stylesheets into the form's iframe, so every media query there tests the iframe's viewport (576px), not the page's.
- Fix: classes used inside the iframe size by their own width, not breakpoints: Form Columns is `repeat(auto-fit, minmax(min(100%, 16em), 1fr))` (2 columns in the hero and on Contact, 1 on phones). Two more lessons from the same change: `:has()` can't nest, and one invalid selector in a list drops the whole rule (split such rules); an IntersectionObserver only sees targets in its own window, so observe iframe elements with the frame's own `IntersectionObserver` (cta-loop). Form Embed's reserved min-height must be re-measured whenever the form's layout changes (now 43.75 / 37.25 / 42.75 / 66.25em, Is Contact 66.5 / 84.75em).
- Status: fixed (published 2026-11-10)
- Found by: claude

### 2026-11-11 · The live Home "slideshow" was not in Webflow: CSS keyframes plus images injected by the bundle
- Area: js
- Scope: template-candidate
- Symptom: asked for "the same slideshow as the current site", the live Home HTML showed one hero image, no Webflow slider, no interaction (`data-w-id`), and a MutationObserver on the hero saw nothing change, yet the photo changed every few seconds.
- Cause: the old repo's bundle (`brandvm/mgt-live`) adds two more `<img class="hero-slide">` at load and its stylesheet crossfades them with `@keyframes hs` and per-image `animation-delay`. Nothing in the markup or the Designer shows it.
- Fix: to find how something on a live site moves, read `document.getAnimations()` on the element (it gave the keyframe name, duration and delays at once), then grep the site's custom bundle and stylesheet for that name. Rebuilt here with the slides in the markup, the states as Designer combos (S Bg Media › Is Slide, › Is Active) and `hero-slides.ts` moving one class. To test Webflow changes that are staged but not published, the Playwright run rewrote the staging HTML in `page.route` (the two extra images and the two combo rules) next to the local-bundle swap (GOTCHAS 2026-11-09); re-check on staging after the publish. Also: `query_elements` with `return_parent: "parent"` returned no match for an element a plain query found; query the parent's class with `children_depth` instead.
- Status: worked (staged; check on staging after the next publish and push)
- Found by: claude

