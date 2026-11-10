# Locations build — Service Areas collection and template

2026-11-09, side session for the person (the Services / Service Categories /
FAQs session runs in parallel). Site `6aecfdb66cfe7667efc6d078` through
`webflow-michaels-global-trading` only (checked with `list_sites`: one site).
Plan: `cms-plan.md` › 3. Service Areas. Design: Figma "04 · Location Page
(Toronto template)", built as `prototype/location-toronto/`.

**Nothing is published.** Items are drafts. Nothing committed.

## Collection

**Service Areas** `6af235b45555cd060b07c5f3`, slug `service-areas` (item
pages at `/service-areas/<slug>`, the live slugs). 33 fields of 60, in 8
field groups (asked by the person; see GOTCHAS 2026-11-09).

| Group | Field (slug) | Type | Field id |
| --- | --- | --- | --- |
| — | Name (`name`) | Plain text | `ddac69f06de1c230d1cc05e92bae231f` |
| — | Slug (`slug`) | | `5d65bddde96cd7d69897349ad263581f` |
| Core | Region (`region`) | Option: Canada `71de7e0db571883d1258de0aef960b0a`, United States `a37a405e4baa188faa07fce70b2597ad` | `76e78507a8dc392891d5fbd6194bf272` |
| Core | Order (`order`) | Number (integer) | `7040006435faecad9047d8b1d9315754` |
| Hero | Eyebrow (`eyebrow`) | Plain text | `a73e5ad015cce9481c1c97efc0fe9323` |
| Hero | H1 (`h1`) | Plain text | `3290adb2fc8f156ea6b2d2635fddd791` |
| Hero | Subheading (`subheading`) | Plain text | `eff382bee46a26ddd3f16d7d60483926` |
| Hero | Point 1 (`point-1`) | Plain text | `03b3182231b0dc7b75215f1d23004fd6` |
| Hero | Point 2 (`point-2`) | Plain text | `945e56f0bb5923f1a0a183344a808598` |
| Hero | Form heading (`form-heading`) | Plain text | `4f109fe8bc321f51656af44591830654` |
| Hero | Hero image (`hero-image`) | Image (decorative, alt empty) | `1e7decc2fc2cab04c77b388c294edad3` |
| Our Services | Office title / intro (`office-title`, `office-intro`) | Plain text / Rich text | `7a3ef40a90022f299a6bde5564b54e88` / `e74e7309d70cba68124d67bcd5b84f1c` |
| Our Services | Warehouse title / intro | Plain text / Rich text | `33e9c9496bdb2aac72196151d18527c9` / `eda57dad294956e3deba139db3816b3c` |
| Our Services | IT title / intro | Plain text / Rich text | `5531e96cc03ea44e82c99aa0facf1214` / `8bcddb286bb8240030fbad20a6311253` |
| Our Services | ESG title / intro | Plain text / Rich text | `317e8918d4676ad068c2dd7921b965ba` / `ba48e173c76dd71270a762a6c99f31ec` |
| Overview & before/after | Overview H2 (`overview-h2`) | Plain text | `c18671318e79046345e095335a3db7ac` |
| Overview & before/after | Overview lead (`overview-lead`) | Plain text | `b71180de058fc5106b72c30a6178b1ac` |
| Overview & before/after | Overview body (`overview-body`) | Rich text | `65998e1378ac22868511948b9f1070fe` |
| Overview & before/after | Before/after text (`before-after-text`) | Plain text | `113fc354161a725084365b30faf6910f` |
| Why choose | Why choose intro / Reason 1 text / Why choose closing | Plain text | `70598338a3b5583c232e993ab6c36648` / `19254f101309cdf10061f1da95294d51` / `e50a74c2393739f0ff2a67c4457246e5` |
| How it works | Step 1 text / Step 3 text | Plain text | `898433227237459da024f7f056158d2a` / `6b24a7b15b794c863ff8288f611b3a8b` |
| Pricing & resources | Pricing heading / Pricing intro / Resources title / Resources intro | Plain text | `386c959c6e4a835d241af82a5d930fba` / `40257152dc6d3d83a0b4a1602c9422cf` / `eded2f85abde5210b5379fe7e7887df0` / `2ad0a55d37aed8302f6e966bcf74a957` |
| SEO | SEO title / Meta description | Plain text | `e3fa5366a221025d33ce73d5627c3e24` / `0885568c0241c92355da93513be2a06b` |

Why these and not others: only what differs per area on the live site and
in the Figma frame. The live CMS (read-only server, site
`658c5919dffd45bc022c9153`, collection `65b96bae53fc6d4a10dbe2dc`) varies
reasons 2–6 and steps 2/4 not at all (one wording difference in Ottawa's
reason 6), so they stay static on the template. Live fields with no place in
the new design were **not** carried over: Hero paragraph, Hero CTA title and
subtitle, Authority "more content", Testimonials intro, "Show areas we serve"
and "Show homepage FAQs" switches, before/after images (empty on live). They
stay on the live site if the person wants them back.

## Items (10, all draft, read back field by field: 0 differences)

| Order | Name | Slug | Item id |
| --- | --- | --- | --- |
| 1 | Toronto | toronto | `6af2364f008757e51c6ddf32` |
| 2 | Mississauga | mississauga | `6af2364f008757e51c6ddf34` |
| 3 | Vaughan | vaughan | `6af2364f008757e51c6ddf36` |
| 4 | Brampton | brampton | `6af23680dd8dcf62e8deb856` |
| 5 | Markham | markham | `6af23680dd8dcf62e8deb858` |
| 6 | Oakville | oakville | `6af23680dd8dcf62e8deb85a` |
| 7 | Burlington | burlington | `6af236bd9e6a408b624b9d65` |
| 8 | Ottawa | ottawa | `6af236bd9e6a408b624b9d67` |
| 9 | Montreal | montreal | `6af236bd9e6a408b624b9d69` |
| 10 | United States | united-states | `6af236bd9e6a408b624b9d6b` |

Content source: the live CMS items, mapped field for field (H1, subheading,
4 category titles and intros, overview H2/H3/body, before/after proof and
project lines joined, why-choose intro/reason 1/closing, steps 1 and 3,
resources, SEO). Live absolute links in the intros were made relative
(`/services/<slug>`, the same slugs).

**Draft copy for the person to review** (not on the live site, adapted from
the Toronto prototype):
- Eyebrow: "Office liquidation · <City> & the GTA"; Ottawa "· Ottawa &
  Eastern Ontario", Montreal "· Montreal & Quebec", US "· United States".
- Point 1 / Point 2: the Toronto prototype's two check items, same for all.
- Form heading: "Plan your <City> clearout." (US: "Plan your US clearout.")
- Pricing heading "What does office liquidation cost in <City>?" (US: "in
  the US?"); pricing intro: the prototype's, same for all.
- Hero image: the Figma/prototype hero (`about-hero.webp`) for the nine
  Canadian areas; the live US image (re-uploaded, `location-hero-us.webp`)
  for United States. The live site used one stock photo for all nine.

## Template page

"Service Areas Template" `6af235b45555cd060b07c619` (`/service-areas/<slug>`).
Body: G | Components, then G | Page W with, in its G | Main slot: the 10
prototype sections, then the Locations and CTA Banner instances (as on Home).
Built like Home (Batch 11): To Slot instance put in the slot by
`data_component_builder › insert_in_slot`, unlinked to a plain div (no person
needed), sections imported before it with `div[data-todo]` placeholders,
then 34 images (`data_element_builder`, class + loading/parallax attributes),
12 DOM buttons (tabs, FAQ triggers, form more / submit), 34 Icon Size and 6
Button Color instances with props, 86 placeholders and the To Slot div
removed. Read back against the import markup (`tools/page-build/cmp.py`):
every section matches except the known artefacts (ListItem, `viewBox`
case, `loading="eager"` added on the four above-the-fold images).

Section roots: hero `#top` `d2d92fcc-…f561`, logo strip `62841d03-…1f68`,
services `#services` `54375c68-…1fa1`, overview `#about` `e22e81fa-…eee7`,
before/after `6a3a8a18-…37bb`, why choose `43a657d8-…ffc8`, how it works
`8e5e93ee-…52c6`, pricing `bf5c36d7-…1f5c`, resources `53c8b67f-…80c2`,
FAQs `70849bf9-…258b`.

Bound (23 text, 1 image, 5 rich text): every field above except Name, Slug,
Region and Order (used by lists). The four category intros and the overview
body are Rich Text elements (classes Body S + Text Primary / Text Secondary)
that replaced the imported paragraphs. Page SEO: title and description are
the `seo-title` / `meta-description` tokens; Open Graph copies them.

The prototype's Our Services had only the Office panel; the template has all
four (the tabs module pairs the n-th tab with the n-th `[data-tabs-panel]`;
panels 2–4 start `hidden`). New images, uploaded: services-office-furniture-
toronto `6af23779d3ec45577200b5d9`, -warehouse `6af23779893ef4d9d9447457`,
-it `6af2377a4a26907ed7e46547`, -esg `6af2377adabd13da6cf4a133` (the last
three from the live site's category panels, resized to 880 wide), check-hero
`6af237d06c7512a773d0bcc2`, price-volume / -access / -timing
`6af237d1f6e50c371d7f91f3` / `6af237d1f6e50c371d7f90d9` /
`6af237d1fdb2c76761dce69c`, location-hero-us `6af2360102358f1075c174e2`.

Prototype (`prototype/location-toronto/` only): `data-collection` /
`data-field` markers on the 28 bound elements, the three missing panels
(images in `location-toronto/images/`), and class `icon-tile-img` on the
pricing icons (they had none, the 0×0 lazy-image gotcha). Backup of the
original in the session scratchpad.

## Update 2026-11-09 (later): publish, check, lists, first-paint states

- Toronto set to non-draft and the site published to webflow.io (person's
  go-ahead). `/service-areas/toronto` serves the bound title, H1, meta
  description; field ids and names on the quote form survived; labels
  publish `for=""` (MANUAL-TODO C).
- Compared with `/location-toronto` at 1440 / 820 / 667 / 390 (scratchpad
  config pointing the two base URLs at each page): before/after, why
  choose, how it works, pricing, resources match; overview differs by the
  marquee's 5px image rounding. Two real differences, both fixed with the
  person's OK: **all four tab panels showed at once** (Services Panel's
  `display: flex` beat `hidden`; now display none + new combo Services
  Panel › Is Active on the open panel, on this template, Home and the style
  guide, and `tabs.ts` toggles `is-active`), and **the quote form was 76px
  taller** (Label and Form Input still had the starter's styles; now the
  prototype's: Typography Styles modes Form Label / Form Input with the
  five typography variables, input height 3.3333em, padding 0.9167em,
  Background/Field, Text/Primary, focus Border/Active, placeholder
  Text/Secondary; Is Textarea min-height 5.5833em). The compare script
  missed the panel bug (hidden panels are skipped by size).
- First-paint states (the person's rule): FAQ panels carry `hidden` in the
  markup; tab panels as above; S Bg Media gets `transform: scale(1.09)`,
  the parallax module's starting scale, so heroes no longer zoom in ~0.6s
  after load (load film). Prototype mirrored in `new-classes.css`,
  `index.html`, `design/style-guide/index.html`, `src/modules/tabs.ts`.
- **Our Services and FAQs are Collection Lists now** (Services, Service
  Categories and FAQs exist, items still drafts): four Services lists
  (source Services, sort Order) with Service List on the list, the first
  static row moved into the item and bound (name, Card Summary, number =
  static "0" + DOM span bound to Order); FAQs list (source FAQs, sort
  Order, Faq Grid + `data-faq="single"`), item = the static Faq Item with
  its question bound to Question and a Rich Text (Faq Answer) bound to
  Answer, panel `hidden`. Empty states hidden with `set_visibility`. The
  Category filters, the FAQ "Location = current" filter and the row links
  are **MANUAL-TODO E and G** (marker above the FAQs). Office tab count 5 → 4
  (4 services per category).

## Update 2026-11-09 (later still): Home's Our Services as four CMS panels

Asked by the person ("Yes, build them"), the same build as the template's.

- Prototype `index.html` (backup in this session's scratchpad): 4 panels, office
  Is Active, warehouse/IT/ESG `hidden` without Is Active; heading and intro from
  Service Categories; the template's 4 category photos; rows marked
  `data-collection="Services"` / `data-field` (Name, Card Summary, Order); tab
  counts 4/4/4/4. Checked at 1440 and 390, scripts off and on: page height equal
  (10646 / 16022) and each tab shows only its panel.
- Webflow Home (`6aecfdb66cfe7667efc6d073`), Services Card `00839ffc-…4dd`:
  panels Office `…4dc` (Services Panel + Is Active), Warehouse
  `75096df6-…8a2b`, IT `f1a6d2bd-…544e`, ESG `4d9c4f1b-…98f9` (Services Panel,
  `hidden`). Each has a static heading, intro and image, then a Services
  Collection List sorted by Order (wrappers `85045bad-…a9fd`, `404428da-…bc7a`,
  `641c5a63-…c891`, `bb706e51-…3fb5`; lists styled Service List; empty states
  hidden). Rows: "0" + DOM span bound to Order, Link Text → Name, Body XS →
  Card Summary. Built at body level, then moved into the slot. The old static
  list (row 5) and the placeholders are removed.
- Category filter and row link: MANUAL-TODO G (Home added), marker Caption
  `data-manual-todo="G"` above the Office list (`66f4de0b-…2a20`). Until done,
  every tab lists all services. Read back 2026-11-09; not published.

## Update 2026-11-09 (latest): manual steps E and G done in the Designer

The person asked Claude to do the manual steps in their Chrome. The API-built
Collection Lists refused filters in the Designer too (GOTCHAS 2026-11-09), so
each was rebuilt as a Designer-made list and its item content moved in through
the API.

- Template: FAQs list `5ccbb57b-…0556` (Faq Grid, `data-faq="single"`,
  Location = Current Service Area, sort Order). Services lists Office
  `a400b834-…0832`, Warehouse `67c95ccd-…d970`, IT `79094260-…ff7e`, ESG
  `10b04f6b-…8c77` (Service List, Category = its category, sort Order).
- Home: Office `6f9e2142-…deaa`, Warehouse `bc867eea-…37a3`, IT
  `e90a8714-…f93c`, ESG `e89516da-…d6ca`, same settings.
- Every Service Row links to Current Service; the importer's custom attribute
  `href = #` is removed. Empty states hidden. Old lists and both markers removed.
- Checked: API read-back (4 Service Lists per page, no `href` attribute, no
  `data-manual-todo` left) and, after a Designer reload, a filter and a moved
  row's link kept. Not published; the items are drafts, so the lists show
  nothing until they are published.
- Prototype rows now link to `/services/<slug>`; Toronto's "Used Office
  Furniture Buyers" row has no Services item and still links to `#`.

## What is left

1. **MANUAL-TODO E and G** in the Designer (filters, row links), then
   remove the marker.
2. **Publish the other collections' items**: Services, Service Categories
   and FAQs are drafts, so the lists publish empty until the other session
   (or the person) sets them live.
3. **Commit** `src/modules/tabs.ts` and `dist/` (built here, `pnpm check`
   passes); until pushed, staging's tabs show the first panel but don't
   switch. The other session commits.
3a. **Resources** cards are static (Blog Posts collection later).
4. **Locations strip** is a Service Areas Collection List in the Locations component (2026-11-09, MANUAL-TODO K); the **nav** mega menu (Services, Service Areas, Resources) is CMS-driven too (2026-11-09, GOTCHAS "component used on the 404 page")
   in the components; they belong to the components session or a list once
   the person decides (cms-plan open decision 6).
5. **Quote form**: the importer kept the field ids (`tor-name` …) this time;
   check label `for` and field names on the published page (MANUAL-TODO C
   covers the Toronto form). Form submissions go to Webflow's default
   notification address until set.
6. **Publish and check**: a site publish to webflow.io is needed before any
   item can go live (new collection), and Toronto must be set to non-draft
   for its page to exist. Then `pnpm wf:compare /service-areas/toronto` at
   1440 / 820 / 667 / 390 against `/location-toronto` on the prototype.
   Waiting on the person's go-ahead for both.
7. Draft copy above for the person to review.
