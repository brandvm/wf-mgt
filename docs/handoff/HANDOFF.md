# Michaels Global Trading — design handoff → Webflow build

The brief every build session starts from. Written when the design is
approved (by the designer, or at the end of the prototype phase) and kept
current during the build. Agents read it after `AGENTS.md` and `GOTCHAS.md`.

## Read first

1. `AGENTS.md`, `GOTCHAS.md`, and the skill's `conventions.md`.
2. This file, then `MANUAL-TODO.md` and `BUILD-NOTES.md` in this folder;
   after the build handoff, `REVIEW.md` (feedback rounds until launch) and
   `SEO-PLAN.md`.
3. The approved design: the prototype in `../prototype/` (run by Bench on
   127.0.0.1:5608; not a git repo — back it up before big changes).
4. **Where the Webflow build stopped:** `docs/handoff/webflow/webflow-build-state.md`
   (batch plan, what is done, the exact next steps, and `variable-ids.json`).

## Status

2026-11-06 — **Batch 1 (variables) finished and verified** on
`6aecfdb66cfe7667efc6d078` (the same site, renamed to `wf-mgt`; staging
wf-mgt.webflow.io). Every collection matches the prototype snapshot + P5.
Starter leftovers (Spacing Hairline/2/96/128, Radius 2) stay until the style
guide rebuild. Batch 2 (heading colour → Text/Accent on h1–h6 and D0–D6) done
and verified the same day. Batch 3 (G | Nav, G | Nav W with a new Colors
Semantic "Nav" mode, Section Is Hero padding, G | Footer W on the Dark mode)
done and verified after an interrupted session; a "Nav Open" mode is ready
for the open-state classes. Batch 4 (82 new styles: shared components and
the whole nav, with their breakpoints, states and modes) done and verified
by script against a full read-back. Batch 5 (80 more: the Home page from
the hero to the case cards) done and verified the same way, then batch 6
(71: reasons, steps, articles, FAQ, CTA banner, footer) and batch 7 (68:
About, Toronto quote form, Contact; 4 computed Layout variables for the
hero calc values) and batch 8 (59: case study and Case Studies listing).
**All 360 planned classes are in Webflow and verified.** Manual steps A
and B (the select chevrons) are done: an Icon Size instance (caret-down, new
14px variant) in Select W / Select Icon, no background image. A separate session is
building the page shell, Nav and Footer components (notes in
`webflow/components-build.md`). Batch 9 (repo port: 11 modules, GSAP +
Lenis, the prototype's repo CSS) is done, committed (be8e640) and on staging.
Batch 10 (style guide page) is built: all 10 sections rebuilt from the
prototype and read back, 45 images uploaded and bound, the starter
leftover variables removed. Published to webflow.io by the person and checked:
every class on the page, images load, `noindex` present. The sidebar
highlight still needs a look. The loader was re-pasted (step D) and staging
now runs this repo's bundle. Then Clean up unused styles; manual step C
(form labels) is partly done (Contact Form row left). See
`webflow/webflow-build-state.md`.

2026-11-05 (end of session) — The person confirmed the client approved the
prototype and asked to build the style guide in Webflow. Build order agreed:
variables → tag styles → existing classes → 361 new classes → repo port →
style guide page, one go-ahead per batch. **Batch 1 (variables) is about
70% done**: Colors, Colors Semantic and Typography Scale are finished, and
Typography Role is part-way through. The remaining role updates, 40 new role
variables, 8 text-style modes, Layout/Spacing/Radius, then verification, are
listed step by step in `webflow/webflow-build-state.md`. Nothing is published.

Prototype work this session (in `../prototype/`, approved by the person as it
went):
- Home "Why choose MGT": text-heavy card grid replaced by option B (sticky
  heading column + numbered accordion, faq module). The four options are on
  `/design/why-choose` for the client (delete once reviewed). Toronto still
  has the old card version (open question).
- Before/after slider: no image selection/blue flash on press; one-time
  nudge, arrow icons and a "Drag to compare" hint (compare.ts).
- Scroll motion (`src/modules/scroll-fx.ts`, GSAP ScrollTrigger with scrub,
  like brandvm/mgt-live): every `.s-wrapper` fades up with the scroll (not the
  first screen; `data-reveal="off"` opts out); footer parallax on
  `data-footer-parallax`, G | Footer W `overflow: hidden` (P4).
- Case study counter counts linearly (no easing).
- The 2026 nav ported from the mgt-live sandbox (`/design/mega-menus`):
  mega panel with Services / Service Areas / Resources, mobile menu with
  views, hide on scroll down. Script breakpoint set to 991 (mgt-live's script
  said 1279 while its CSS used 991). Needs proposed variables P5 and the P2
  class changes. Phone number open: nav 647-496-6362 vs site 647-317-0860.
- Home hero "Services" chip removed.
- Logo marquee and image parallax applied on every page that has the markup
  (About, Case Studies, Case Study, Contact, FAQs, Toronto).

## Ground rules for this project

- <Who gives the go-ahead for Webflow writes, and how.>
- <Anything that differs from conventions.md, agreed with the designer.>
- <Which repo or folders are read-only, if any.>

## Pages

| URL | Design source | Webflow page | Notes |
| --- | --- | --- | --- |
| `/` | <prototype file> · <Figma frame link> | Home | |
| `/<page>` | | | |
| `/<collection>/<item>` | | <Collection> template | CMS template |
| `/design/style-guide` | | Style guide (folder `design`) | first page built; excluded from search |
| `/design/media` | | Media (folder `design`) | only when a page plays a video; excluded from search |

Breakpoints: 991 (tablet), 767 (mobile landscape), 479 (mobile). Checked at
<widths>.

## Variables and classes

- Variable changes, as old → new, grouped for approval: <file or list>.
- New classes, with what each is for: <CLASSES.md or list>.
- Approval state: <approved / pending, by whom, when>.

## CMS

| Collection | Fields | Used on |
| --- | --- | --- |
| <Name> | <field (type)…> | <pages, lists, limits and sort> |
| FAQs | Question (Plain text, name), Answer (Plain text, multi-line), Topic (Option: Pricing, Process, IT & data, Furniture value), Show on Home (Switch), Show on Contact (Switch), Location (Reference → Locations, empty for general), Order (Number) | Collection List = `.faq-grid` with `data-faq="single"` (one open at a time), Item = `.faq-item` with `data-faq-item`, trigger `data-faq-trigger` (no `aria-expanded`, all start closed), panel `data-faq-panel`. Home: Show on Home, sort Order. Contact Us: Show on Contact. Location pages: Location = current page. FAQs page: all, plus `data-category` bound to Topic for the filter tabs. Sort by Order ascending. |

## Components to make

| Component | Used on | Props | Behaviour inside |
| --- | --- | --- | --- |
| Nav | every page | — | <modules> |
| Footer | every page | — | — |
| <Name> | | | |

## Modules

| Module | `data-*` hooks | What it does |
| --- | --- | --- |
| <name> | `data-…` | |
| count-up | `data-count` (on the number; reads the parent `data-carousel-slide`'s Is Dimmed) | Counts 0 → the markup value, ease-in-out 1.6s, the first time it is in view; in a carousel, again each time its slide becomes current. Port `prototype/src/modules/count-up.ts` unchanged. |

## Decisions

- 2026-11-05 · Fluid scaling set to the 1440 Figma frame: `--size-container-ideal: 1440`, min 1200px, max 1440px (repo `src/styles.css` §01 and `prototype/src/css/prototype.css`). 1em = 16px at 1440 and above, so type matches Figma; it was 13.7px with the template's 1680.
- 2026-11-05 · Webflow variables migrated from the starter by **renaming** starter variables where a match exists (ids kept, class bindings follow) instead of delete + recreate; starter leftovers are removed only once unused (after the style guide rebuild).
- 2026-11-05 · Home "Why choose MGT" uses option B (accordion), chosen by the person.
- 2026-11-05 · Section fade-up and footer parallax are scroll-scrubbed (GSAP ScrollTrigger), matching the mgt-live site; the fade targets `.s-wrapper` by class on purpose.
- 2026-11-05 · The 2026 nav is ported from the mgt-live sandbox into the prototype, with the menu breakpoint at 991px in both CSS and script.
- <Date> · <decision and why.>

## Open decisions

| Item | Now | Options |
| --- | --- | --- |
| | | |

## Stand-in assets and placeholders

- <Images, copy and `#` links still to replace, with an owner.>
