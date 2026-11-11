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

2026-11-10 (later) — **Client video feedback implemented and published to webflow.io.** Every primary (yellow) quote button sheens while on screen (cta-loop), and hovers are stronger (lift, shadow, arrow nudge, arrow-link circle fills navy, phone ring and wiggle, underline draw), reduced motion respected. Home's hero and Top Canadian Liquidation Company paragraphs have Learn more / Show less dropdowns (expand module) with the live site's hidden text. The Services and Service Areas templates use the Contact HubSpot form: its radio questions are dropdowns, every field except the textarea pairs in two columns (Form Columns auto-fit 16em), and the reserved height (Form Embed, + Is Contact on Contact) was cut to match: 702px instead of 1046 in the service hero at 1440. Services template order: hero, overview, case studies, what we handle, before/after (with Arman's three check points on 12 services and the button "Plan your project"), process, cost, locations, FAQs, CTA; the estimate note, scope photo pill and cost note are removed. Case studies are a **Case Studies** component (Sections group; props Heading, Intro) on Home and both templates: Featured is on, Project Date newest first (Moneris, Toys“R”Us, WilsonHCG, SNC-Lavalin). Waiting on Bianca's content for About Us and other pages and the client's new images.

2026-11-10 — **Privacy Policy built and published to webflow.io** (`/privacy-policy`, page `6af3327aa8d35aeae21df7c9`, duplicated from FAQs): dark page hero, then the live site's policy text in Max Width Text › Rich Body + Is Article (plain headings, paragraphs and lists, editable in the Designer; not a CMS rich text), CTA Banner. The footer link and the quote-form note on the Services and Service Areas templates point to it; the staging link crawl (51 pages) finds no broken or `#` links. Rich Body ul/ol got `padding-left: 1.3333em` so bullets sit inside the text column (blog posts and service pages too). Text changes from live, for the client to confirm: the empty "Type of website: Business" line dropped, "Ontario Inc.." fixed, the run-on "Browser encryption, third party trusted software While…" rewritten as a sentence, the cookie list merged into three items. The officer's phone stays (647) 821-9961 as on live.

2026-11-09 (night) — **FAQs page built and published to webflow.io** (`/faqs`, page `6af29b6d4dd2addd044071ca`): hero, CMS FAQ list with the shared Side Filter topic sidebar (counts), CTA Banner; checked at 1440/991/767/375 (10 questions, one open at a time, filters 2/5/1/2). Topic filtering for the two-word topics needs the uncommitted `filter-tabs.ts` change pushed. Two questions (move-out date, unsellable furniture) are drafts waiting for the client's answers. Figma compare 05 filled.

2026-11-09 — **About Us (`/about-us`, page `6af29af4b6d39bded3d833be`) built,
published to webflow.io and checked.** Hero, client logos (Logo Marquee
instance), Our story, Values, Our services, Why choose (Home's Why Split
accordion, per the 2026-11-09 decision; the prototype was changed to match),
then the Locations and CTA Banner instances. Staging vs prototype at 1440 /
991 / 767 / 375: the hero matches; the rest differs only by the 4px-grid
rounding (2–4px) and the shared components. No console errors, the nav and
footer "About Us" links resolve. Figma "2026 Compare" › 03 has the staging
tiles. Notes: `webflow/about-build.md`.

2026-11-06 (later) — **Batch 11: the Home page is built in Webflow** (all 10
sections before Locations and CTA Banner, read back and matched against the
prototype; not published). Icons are Icon Size instances (Phosphor) and the
Secondary buttons are a Button link holding a Button Color instance; see
Decisions and `webflow/webflow-build-state.md` › Batch 11.
Staging check done; Chip and Button Color › Secondary were still the
starter's styles and are now the prototype's (with the person's OK), and
the check/reason icon images got sizing classes. Republished and
re-checked: Home matches the prototype at all four widths.

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
- 2026-11-07 · The Brand Vision `bv` plugin (bv-toolkit, with the hook that
  blocked `publish_site`) was removed from this machine by the person.
  Claude may now publish, **to the webflow.io subdomain only and only when
  the person asks for that publish**; custom domains stay the person's step.
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

Full plan, open decisions and build order: `webflow/cms-plan.md`
(2026-11-09, waiting for the person's review). Collections: Service
Categories, Services, Service Areas, FAQs, Case Studies, Blog Categories,
Blog Posts. None exist in Webflow yet.

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
- 2026-11-06 · Icons in Webflow are Icon / Icon Size component instances (Phosphor), never hand-built `i.ph` or inline SVG; Figma SVG icons are mapped to the nearest Phosphor icon. Exception: the FAQ/reason plus/minus stays SVG (repo CSS animates its bar). Icon Size got a 14px variant. Chosen by the person.
- 2026-11-06 · Secondary buttons: a Button link (`a.button`) holding a Button Color instance set to Secondary (C | Button can't take the variant through the API). Chosen by the person.
- 2026-11-07 · FAQs are a vertical list (one column at every width) instead of the 3 / 2 / 1-column card grid; Faq Trigger's min-height (3.84em, there to line cards up across columns) removed. Applies to every FAQ list (Home, FAQs, Contact Us, Toronto). Asked by the person; prototype and Webflow changed together.
- 2026-11-09 · Size and spacing values in Webflow classes are on the 4px grid (rendered px, rounded to the nearest 4, ties to 8); font sizes keep the type scale. Asked by the person; 194 values changed, listed in `webflow/grid-4px-rounding.md`. The prototype CSS was not changed.
- 2026-11-09 · Every "Why choose MGT" section uses Home's split accordion (the Service Areas template's card grid was replaced; intro, reason 1 and closing stay bound to the CMS). Asked by the person.
- 2026-11-09 · Every FAQ section (Home, Services template, Service Areas template, Contact) is left/right: the heading block on the left (Why Split › Why Split Head, sticky, button row left-aligned), the FAQ list on the right; one column from 991 down. Reuses the Why Split classes so both sections share one layout. Asked by the person. The prototype still shows the centred heading.
- 2026-11-09 · Interaction motion: items 1–21 and 23–24 of `webflow/motion-plan.md` built (the yellow heading highlight, 22, left out). Headings use 11 (line-by-line H1/H2 inside the one-after-another heading group). Scroll entrances replace the scrubbed section fade and pick their elements by class (`src/modules/reveal.ts` TARGETS; `data-reveal` overrides, `data-reveal="off"` opts out). Asked by the person.
- 2026-11-09 · FAQs page (`/faqs`): white section, heading left-aligned on top (Section Head), then Side Layout: a sticky Side Filter (rows of Side Filter Tab with a Side Filter Count each, filled live by filter-tabs; wraps into a row from 991 down) beside the CMS FAQ list. Same sidebar classes as the services hub `/our-services`. Asked by the person instead of the prototype's centred segmented tabs. The list is the FAQs collection filtered by the new switch **Show on FAQs page**, sorted by Order; Topic is bound to `data-category` for the filter-tabs module.
- 2026-11-10 · Breadcrumb (case study and blog post templates) redesigned as option A: first child of the hero S Wrapper (not absolute), 14px, Text/Secondary links and Text/Primary current item, Icon Size `ph ph-caret-right` separators in Breadcrumb Sep (aria-hidden), links are page links. Section › Is Case Hero padding-top = Layout › Calc › Nav Height + 1.875em (≈30px under the nav), content starts at the top (justify flex-start); Breadcrumb margin-bottom Spacing/32. Blog posts show Home › Blog (the long title stays in the H1). Asked by the person. The style guide's breadcrumb specimen still has "/" text separators.
- 2026-11-10 · Hero overlays darkened for WCAG contrast on image heroes: S Bg Overlay › Is Side Gradient 0.84 → 0.36 left to right on desktop, a flat ~0.76 navy from 991 down; Is Hero Gradient (Home) gets a top-to-bottom navy overlay from 991 down (its heading sat on the clear top of the photo: 1.4:1 before, 7.1:1 after). Measured on staging against the image pixels behind each text box at 375 / 768 / 991 / 1440 on 12 pages: every text ≥ 4.5:1 (large ≥ 3:1). Asked by the person.
- 2026-11-10 · The Dev / Staging switcher pill removed from the bundle (environment-switcher module and its tests); the loader's `?wfc-dev=1` flag still loads the local bundle. Asked by the person.
- 2026-11-10 · Container 1280px everywhere: Layout › Container/Max Width 77.5em → 80em (all modes) and Section/Padding H desktop 6.25em → 5em (80px side margins, as the Figma nav and heroes). Tablet/mobile padding unchanged. Checked at 1440 / 991 / 375: every page's S Wrapper is 1280 wide at x 80 on desktop. The prototype's tokens.css still has 77.5em / 6.25em. Asked by the person.
- 2026-11-10 · New combo S Wrapper › Is Fill (flex 1 1 auto, justify space-between) on the case study and blog post hero wrappers: the wrapper fills the min-height, breadcrumb at the top, hero content at the bottom, no empty band below. Page heroes (one centred block) and the quote / home heroes had no spare space and are unchanged. Asked by the person.
- 2026-11-10 · Nav › Services mega menu: each category heading links to the first service in its column (office-furniture-liquidation, warehouse-liquidation-services, it-equipment-liquidation, sustainable-office-decommissioning), as static URLs, also on the 404 page's static nav copy. If a column's first service changes (Order), update its heading link. Asked by the person.
- 2026-11-10 · The 10 placeholder case studies got varied Stat 1 values ($48k, 11, 320, 95%, $120k, 14, 850, 98%, 6, $75k) so the Home carousel count-up shows; SNC-Lavalin keeps its real $0. count-up reads the first number in the text, so avoid thousands separators (1,200 counts to 1).
- 2026-11-10 · FAQ content rule (the person's): service FAQs come from the preview site (mgt-office-liquidation-preview…chatgpt.site), every other FAQ from the live site's CMS; no FAQ is shown without an answer. Checked: all 124 service FAQs already match the preview word for word; 57 live FAQs were ported (6 each for Ottawa, Mississauga, Markham, Oakville, Burlington, Montreal, Brampton, Vaughan, 8 for United States, plus the live Home FAQ "What strategies can we employ to reduce the environmental footprint…", `faqs-q13`). Home and Contact now use CMS lists (Show on Home: faqs-q1–q8 + q13; Show on Contact: faqs-q1, q2, q4, q8, q10) instead of static items, 13 of which said "Answer to come". Seven Figma-only questions with no answer on the preview or live site stay drafts: contact-q1–q6 (q1 has an answer written for the prototype, not from live; q6 "Which locations do you serve?" was unpublished for the same reason) and faqs-q11/q12. They need the client's answers. Checked on staging: 17 pages, every FAQ shown has an answer.
- 2026-11-10 · "Have a space to clear?" CTA sticky on the case study and blog post templates (desktop): Aside Card › Is Dark is `position: sticky` at the same top as Article Aside › Is Sticky (static from 991 down); Article Aside now stretches to the layout height (align-self stretch) so the card has room to stick, Is Sticky keeps align-self flex-start for the blog. The case study Stat Band numbers carry `data-count` (count-up; text values like "On-site" stay as they are). Asked by the person.
- 2026-11-10 · Case studies are one component, **Case Studies** (heading and intro as props), on Home, the Services template (after the overview) and the Service Areas template (after before/after); its list is the Case Studies collection, Featured is on, Project Date newest first. Untick Featured to hide a case study. Asked by the person.
- 2026-11-10 · Quote forms (HubSpot, Services / Service Areas templates and Contact): radio questions shown as dropdowns; every field except the textarea in a two-column grid. Asked by the person.
- 2026-11-10 · Primary (yellow) buttons loop a subtle sheen every ~6s while on screen (cta-loop module; paused on hover; off with reduced motion). Asked by the person.
- 2026-11-10 · Services before/after: three Results Points fields (Arman's preview checklist; empty points hidden by repo CSS); the button reads "Plan your project" on every service (the collection is at Webflow's 60-field limit, so the preview's "Plan your office clearance" on Office Furniture Liquidation couldn't get its own field).
- 2026-11-10 · Case studies: Toys“R”Us, Moneris and WilsonHCG filled from the client's approved case study document (challenge, solution, execution with a sub-heading, results, timeline, scope, four stats each) and published; SNC-Lavalin already matched the document. The document repeats the sub-heading "Eliminating Unnecessary Handling and Storage" on all four, and it was kept as written. The case study template hides the hero Project timeline, the sidebar Scope and Timeline rows and the challenge section when those fields are empty (conditional visibility, set in the Designer).
- 2026-11-11 · Home hero is the live site's slideshow: three background photos crossfade behind the unchanged text and buttons, in live's order (office team = the existing hero image, MGT warehouse `home-hero-warehouse.webp`, stockroom `home-hero-stockroom.webp`; the last two are live's own 2240×1680 WebP files, uploaded as they are, no re-encode). Timing copied from live's CSS keyframes (`hs`, in mgt-live's bundle): 12s loop, 1s ease-in-out crossfade, first change 3s after load, then every 4s; autoplay, no arrows, dots or hover pause, the same at every width. In Webflow: the three images sit in the hero's S Bg with `data-hero-slide` and the new combo S Bg Media › Is Slide (opacity 0, opacity transition 1000ms ease-in-out); the first also has Is Slide › Is Active (opacity 1), so it is the first paint without JS, and keeps eager + `fetchpriority="high"`; slides 2–3 are lazy and have Is Slide › Is Over (absolute, over the first). **Slide 1 is a custom `img` element, not a Webflow Image**: its `src`, `srcset` (Webflow's own variants of `hero.webp`) and `sizes="100vw"` are custom attributes, because Webflow published the Image with `sizes="… 239px"` (a blurry 500px file on desktop; GOTCHAS 2026-11-11). To change the first photo, upload the new one and edit those attributes (or ask Claude). `src/modules/hero-slides.ts` only moves `is-active`; no repo CSS. Unlike live: stays on the first photo under reduced motion, pauses while the tab is hidden or the hero is off screen, and waits for the next photo to load before fading. The overlay (Is Hero Gradient) is unchanged; white text measured against the brightest pixel behind it on each slide at 1440 / 991 / 767 / 375: 6.3:1 or better. To add a slide: an Image with S Bg Media › Is Slide › Is Over, `data-hero-slide`, `data-parallax` and `loading="lazy"` in S Bg, before the overlay. The prototype still has one image. Asked by the person. Pushed (4ac558a) and published to webflow.io 2026-11-11; checked there at 1440 / 991 / 767 / 375: changes at 3s / 7s / 11s, no console errors, slide 1 loads the 1600 / 1080 / 800 variants. Slides 2–3 have no Webflow variants yet (API uploads), so every width loads the full 340 / 460 KB file, lazily.
- <Date> · <decision and why.>

## Open decisions

| Item | Now | Options |
| --- | --- | --- |
| | | |

## Stand-in assets and placeholders

- 2026-11-10 · **Case study hero photos** for Toys“R”Us, Moneris and WilsonHCG are stand-ins taken from the Warehouse Decommissioning, Office Furniture Decommissioning and IT Asset Disposition service heroes. Replace with real project photos when the client has them (the content zip only had an SNC-Lavalin logo).
- <Images, copy and `#` links still to replace, with an owner.>
- 2026-11-10 · **10 placeholder case studies** (CMS › Case Studies, slugs `placeholder-case-study-01` … `-10`, all copies of SNC-Lavalin, SEO title starts `[PLACEHOLDER]`), published so the Home carousel has enough slides. Delete (or replace with real projects) before launch. Asked by the person. **Deleted 2026-11-10** at the person's request; the four real case studies remain (Home carousel now has 4 slides).
