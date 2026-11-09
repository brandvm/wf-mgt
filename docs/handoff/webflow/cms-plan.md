# CMS plan

Drafted 2026-11-09 for the person's review. Nothing is created in Webflow
yet: the site has no collections (`get_collection_list` 2026-11-09). Each
batch below needs its own go-ahead, like the style batches.

Sources: the prototype pages (repeated cards, the Toronto page as the
location template, the SNC-Lavalin page as the case study template), the
FAQs row already in `HANDOFF.md`, and the live site's sitemap
(michaelsglobaltrading.com, 2026-11-09): **243** `/blog/*`, **17**
`/services/*`, **10** `/service-areas/*`, **1** `/auctions/*`. Live slugs
are kept wherever a page carries over, so no redirect is needed for them.

## Collections

**Built so far (2026-11-09, read back):**
- Service Categories `6af2372f8780ca9c7a5858c4` (slug `service-categories`): Heading, Intro, Icon, Order; field group "Tab and section". No items yet.
- Services `6af2373f98c178f838fc032c` (slug `services`): 59 fields with option a (no OG image; one Item Icons field, comma-separated Phosphor classes), every custom field with help text, in 8 field groups by template section. No items yet.
- Service Areas `6af235b45555cd060b07c5f3`: the parallel locations session (`locations-build.md`).
- **Items imported 2026-11-09 (all drafts, read back by count):** Service Categories 4 (Office Furniture `6af23a4c071617a4bd372739`, Warehouse & Commercial `…273b`, IT Equipment & Electronics `…273d`, Sustainability & ESG `…273f`); Services 16 from the preview site (images copied to Webflow's CDN by URL; slug → id map in the session scratchpad and below); FAQs `6af23a559e6a408b624c5d08` (slug `faqs-items`, Name shown as Question; fields Answer rich text, Service, Location, Show on Home, Show on Contact, Topic, Order; groups Answer / Where it shows) with 124 service FAQs, slugs `<service-slug>-q<n>`, Order = position on the page.
- Contact FAQs 2026-11-09: 6 drafts, slugs `contact-q1`…`q6`, Show on Contact on, Order 1–6 (from `prototype/contact-us/`). Only q1 has a real answer; q2–q6 read `[PLACEHOLDER] Answer to come.` and need the client's copy. The Contact Collection List itself is MANUAL-TODO F (the contact session).
- Services notes: Name is the page H1, which differs from the preview's listing name on 4 (Office Furniture Removal vs "… Services", Relocation vs "… Services", Warehouse Liquidation vs "… Services", Landfill Diversion For Office Cleanouts vs Landfill Diversion Services). 9 services have no before/after pair on the preview, only one outcome image: it is in After Image with Before Image empty, so the template shows the compare slider only when Before Image is set (conditional visibility, Designer step). Item Icons is empty on all 16: the preview uses Figma SVGs, which still need mapping to Phosphor classes. The preview's CTA button labels vary per service but have no field (fixed on the template).

**Rule (the person, 2026-11-09):** every element's first-paint state is a Designer class (closed panels, active first tab, reveal start state, reserved size for injected embeds), so nothing flashes before the bundle runs; JS only changes state.

**Rule (the person, 2026-11-09):** every collection's fields are organized in field groups, one per template section in page order, each with a short description (`update_collection_field_groups`; Name and Slug can't be grouped), and every field gets help text for editors.


### 1. Service Categories (4)

The four groups: Office Furniture, Warehouse & Commercial, IT Equipment &
Electronics, Sustainability & ESG.

| Field | Type | Notes |
| --- | --- | --- |
| Name | Plain text | Tabs and filters: Office Furniture · Warehouse & Commercial · IT Equipment & Electronics · Sustainability & ESG (the Home tab names). Also the nav column heads |
| Slug | | `office-furniture`, `warehouse-commercial`, `it-equipment`, `sustainability-esg` |
| Heading | Plain text | Section titles: Office furniture services · Warehouse and equipment services · IT equipment and electronics · Furniture reuse and recycling (the preview's group headings). Used for the tab panel H3 on Home and the area pages (replaces "Office Furniture Services") and the group titles on `/our-services` |
| Intro | Plain text, multi-line | Tab panel paragraph on Home |
| Icon | Plain text | Phosphor class for the Icon prop, e.g. `ph ph-armchair` |
| Order | Number | |

Used on: Home Services tabs, the Toronto/location Services tabs, the nav
Services mega columns.

### 2. Services (16)

**Template design:** the Figma frame "01 · Service Page (Google Ads
landing) — Approved" (chosen by the person 2026-11-09). **Content:** the
preview site
`mgt-office-liquidation-preview.brandvmarketin315346.chatgpt.site/services/`
(16 service pages, same sections as the Figma frame, new copy for every
service). Where the two differ in wording (e.g. the overview H2 "Furniture
resale and office clearance." in Figma vs "Office furniture liquidation and
clearance" on the preview), the preview's copy is used and the Figma
frame's layout.

16 services, 4 per category. All 16 slugs match live slugs. The live
site's 17th, `used-office-furniture-buyers`, is not in the new content →
301 to `/services/office-furniture-liquidation` (redirect map). The Home
and Toronto Services tabs still list it (Office Furniture shows 5), so they
change to 4 when the tabs become CMS lists.

Template sections, in order, and what each takes from the item (compared
across 4 preview pages: ≠ per service, = the same on every page):

| Section | Per service (fields) | Shared (built on the template) |
| --- | --- | --- |
| Hero + quote form | H1 = Name; Hero intro; Hero point 1, 2; Hero image; Form intro; Form message label ("What furniture do you have?" / "What electronics need removal?") | Eyebrow, the form fields, submit, the phone and Learn More buttons |
| Overview | Overview H2; Overview body (rich text, 2–3 paragraphs with links); optional Situation 1–3 (title + text) and Highlight 1–3 (label, title, text) | The card icons |
| Case studies | — | The same 3 on every page (WilsonHCG, SNC-Lavalin, Toys"R"Us): a curated list from Case Studies |
| Scope ("… we can help with") | Scope H2; Scope intro (rich text, 1–2 paragraphs); Item 1–5 label + icon; Scope image; Scope note (rich text, has a link) | "And more" tile |
| Before / after | Results H2; Results text; Before image; After image | Chip, compare slider |
| How it works | Process H2; Process intro | The 4 steps (identical) |
| Cost | Cost H2; Cost intro; Factor 1–3 title + text | The factor icons |
| Locations | Locations intro | The 10 areas (Service Areas list) |
| FAQs | FAQs intro; the 8 questions come from FAQs (Service = current item) | H2 |
| Closing CTA | Closing H2; Closing text | Image, buttons |

Field list and count:

| Group | Fields | Count |
| --- | --- | --- |
| Core | Name, Slug, Category (ref), Order, Card summary (listing + Home rows), Show in nav (switch) | 6 |
| Hero | Hero intro, Point 1, Point 2, Hero image, Form intro, Form message label | 6 |
| Overview | H2, Body (rich), Situation 1–3 title/text, Highlight 1–3 label/title/text | 17 |
| Scope | H2, Intro (rich), Item 1–5 label, Item 1–5 icon, Image, Note (rich) | 14 |
| Results | H2, Text, Before image, After image | 4 |
| Process, Cost | Process H2, intro; Cost H2, intro, Factor 1–3 title/text | 10 |
| Locations, FAQs, Closing | Locations intro, FAQs intro, Closing H2, Closing text | 4 |
| SEO | SEO title, Meta description, OG image | 3 |
| | | **64** |

Webflow's CMS and Business plans allow **60 fields per collection**
(Name and Slug included), so this is 4 over. Ways to fit (**open decision
8**):
- **a.** Item icons as Phosphor classes in one multi-line field, one class
  per line, read by a small module (−4), and drop OG image (Webflow falls
  back to the page's Open Graph setting) → 59, one spare. *Recommended.*
- **b.** Scope items as a rich-text bulleted list with one shared icon
  (−9). Changes the approved design.
- **c.** Situations and Highlights in their own collection, linked by a
  multi-reference (−15). Nested lists are a Designer step and harder to
  edit.

Optional overview cards: the Situation and Highlight rows sit in plain
wrapper divs with conditional visibility on their first field (Designer
step → MANUAL-TODO).

Used on: the `/services/<slug>` template; the service rows in each
category tab on Home and the area pages (one list per tab panel, filtered
by Category in the Designer); nav mega links (static, see limits); case
study "Services provided"; FAQs (Service reference).

Content source per field: the preview site's pages, read and mapped by
script (they share one markup, so a field map per selector covers all 16).
Images (hero, scope, before/after) come from the preview site's assets or
the person's originals, uploaded to this site.

### 3. Service Areas (10)

**In progress in a parallel session (2026-11-09):** collection, items and
template page; its notes are in `locations-build.md`. Template design:
Figma "04 · Location Page (Toronto template)", built as
`prototype/location-toronto/`.

Live slugs: toronto, mississauga, vaughan, brampton, markham, oakville,
burlington, ottawa, montreal, united-states. The Toronto prototype page
(`/location-toronto`) becomes this collection's template at
`/service-areas/<slug>`.

| Field | Type | Notes |
| --- | --- | --- |
| Name | Plain text | "Toronto" (Locations strip, nav) |
| Slug | | live slug |
| Eyebrow | Plain text | "Office liquidation · Toronto & the GTA" |
| H1 | Plain text | "Toronto Office Liquidation Company" |
| Subheading | Plain text | Hero H2 line |
| Hero points | Plain text ×2 | The two check-list items |
| Form heading | Plain text | "Plan your Toronto clearout." |
| Category intro: Office / Warehouse / IT / ESG | Plain text, multi-line ×4 | Localized tab panel paragraphs (**open decision 3**) |
| Why choose intro | Plain text, multi-line | |
| Pricing heading, Pricing intro | Plain text | "What does office liquidation cost in Toronto?" |
| Hero image | Image | Alt text on the field |
| Region | Option: Canada, United States | |
| Order | Number | Locations strip and nav order |
| SEO title, Meta description | Plain text | |

Static on the template (same for every area): stats tiles, trusted logos,
before/after, the six "why choose" reasons, how it works, pricing cards.

Used on: template, the Locations component's links, nav Service Areas.

### 4. FAQs

As in `HANDOFF.md` › CMS (Question, Answer, Topic, Show on Home, Show on
Contact, Location → Service Areas, Order), plus **Service → Services**:
each service page lists its own 8 questions (≈128 items from the preview
site; the answers run to two paragraphs, so Answer becomes Rich text).
Item count: Home 9, FAQs page 12, Contact 6, Toronto 6 (local questions
with Location = Toronto), services ≈128. The
FAQs page filter (Pricing, Process, IT & data, Furniture value) binds
`data-category` to Topic.

### 5. Case Studies (9 on the listing)

Template from `/case-study-snc-lavalin`, listing from `/case-studies-5`.

| Field | Type | Notes |
| --- | --- | --- |
| Name | Plain text | Client, "SNC-Lavalin" |
| Slug | | `snc-lavalin` |
| Service | Reference → Service Categories | Listing filter "Service" and the eyebrow |
| Project type | Plain text | "Office decommissioning" (eyebrow after "Case study ·") |
| Industry | Option | Listing filter "Industry" (values to agree) |
| Headline | Plain text | Listing card H ("11 floors decommissioned at no cost…") |
| Summary | Plain text, multi-line | Hero lead and Home card text |
| Card image, Hero image | Image | |
| Timeline | Plain text | "January 2022 to September 2022" |
| Scope | Plain text | |
| Services provided | Multi-reference → Services | Tags in the hero and the overview card |
| Stat 1–4 value | Number | Count-up reads the number (`data-count`) |
| Stat 1–4 prefix / suffix | Plain text | "$", "+" |
| Stat 1–4 label | Plain text | "Floors decommissioned" |
| Challenge, Approach, Execution, Outcome | Rich text ×4 | The four body sections, each with its own eyebrow and H2 in the template |
| Featured on Home | Switch | Home carousel |
| Project date | Date | Sort "Newest first" |
| SEO title, Meta description | Plain text | |

Used on: Home carousel (Featured, newest first), listing with Service /
Industry filters and sort (Finsweet List, bundled per
`recipes/finsweet/`), template.

### 6. Blog Posts (243) and Blog Categories

| Field | Type | Notes |
| --- | --- | --- |
| Name | Plain text | Title |
| Slug | | live slug |
| Category | Reference → Blog Categories | Chip ("Liquidation Services", "Office Liquidation") |
| Published date | Date | Card date; sort |
| Thumbnail | Image | Alt on the field |
| Excerpt | Plain text, multi-line | Card and nav post text |
| Body | Rich text | Images written with `loading="lazy"` (lessons/mcp.md) |
| Featured | Switch | Optional pin on Home |
| SEO title, Meta description | Plain text | |

Blog Categories: Name, Slug, Order. A collection rather than an Option so a
category can get its own listing page later; the live site's category list
is still to be read from its CMS export.

Used on: Home and location Resources (3 newest), nav Resources (2 newest),
the blog listing and post template (**open decision 2**: neither is in the
prototype).

## Not CMS

Stats (105+ reviews, 2k+ clients, 13+ years), trusted logos, steps, Home
"why choose" reasons, About values: static, or component props where they
repeat. The live site's **Auctions** collection (1 item) has no place in
the new design: drop it and 301 `/auctions/*` (open decision 5).

## Webflow limits that shape the build

- Collection Lists **inside G | Page W's slot**: build the list at body
  level, write source / filter / sort / limit one key per call, bind, then
  move it into the slot (lessons/mcp.md). "Exclude current item" and
  "field = current item" (Toronto's own FAQs, related case studies) are
  Designer steps → MANUAL-TODO.
- **Nav lists** sit inside G | Nav, a component; a component can't hold a
  live CMS binding except a curated list. Services and Service Areas change
  rarely and stay static in the nav; the 2 newest posts would go stale
  (open decision 6).
- Conditional visibility (e.g. hide Stat 4 when empty) is a Designer step
  on a plain wrapper div.
- Dates publish in one format ("October 19, 2026"); the cards show
  "Oct 19, 2026" → set the format in the Designer.
- Collection Lists publish `role="list"`; the intended role goes in
  `data-aria-role`.

## Open decisions

| # | Question | Recommendation |
| --- | --- | --- |
| 1 | ~~The 17 live service pages have no design.~~ | **Decided 2026-11-09:** Figma "01 · Service Page (Google Ads landing) — Approved" is the template; copy from the preview site; 16 services, slugs kept, `used-office-furniture-buyers` redirected. |
| 2 | Blog listing `/blog` and post template have no design. | Prototype both from the existing article card and case study body styles. |
| 3 | Location pages: localize every service row (17 fields per area) or only the 4 category intros? | Localize the 4 intros; rows use the shared Services Summary. |
| 4 | Case study Industry values; 9 or 6 case studies (the listing count says 9, the prototype shows 6 cards). | Person to supply the list and the content. |
| 5 | Auctions (1 live item). | Drop; 301 to `/our-services` or the item's closest page. |
| 6 | Nav "latest posts" in a component. | Try a curated or sorted list in G \| Nav; if the API refuses, the person sets it in the Designer. |
| 7 | URLs: prototype paths `/case-studies-5`, `/case-study-snc-lavalin`, `/location-toronto`. | `/case-studies`, `/case-studies/<slug>`, `/service-areas/<slug>`. |
| 8 | ~~Services field limit.~~ | **Decided 2026-11-09:** option a, 59 fields. |
| 9 | Category names. Home tabs (prototype, Figma): Office Furniture · Warehouse & Commercial · IT Equipment & Electronics · Sustainability & ESG. The services preview site's hub (`…chatgpt.site/services/`) uses filter chips Office furniture · Warehouse & commercial · IT & electronics · Sustainability & reuse, and group headings Office furniture services · Warehouse and equipment services · IT equipment and electronics · Furniture reuse and recycling. **Decided 2026-11-09:** the Home tab names for tabs and filters (Name), the preview's group headings for section titles (Heading). |
| 10 | ~~Services hub URL.~~ | **Decided 2026-11-09:** keep the live site's `/our-services` (SEO). The preview's `/services/` hub is a content reference only; its design is still to come (no Figma frame seen). |

## Content migration

Services, Service Areas and Blog Posts exist on the live Webflow site
(mgt-live). Claude reads them through the read-only
`webflow-michaels-global-trading-live` MCP server (AGENTS.md › Project
facts; not connected on 2026-11-09: it needs its own sign-in and a session
restart, then `list_sites` to fill in its site ID), maps the fields, and
writes the items here through this site's server. Fallback: the person's CSV
export from the live CMS. Images are re-uploaded as assets of this site,
never hotlinked from the live one. Body copy for services
and areas is rewritten to the new template fields, so those are a content
task, not a copy. Case studies (9) and FAQs (~30) come from the prototype
and the client.

## Build order (one go-ahead per batch)

1. Collections and fields, in reference order: Service Categories →
   Services → Service Areas → Blog Categories → FAQs → Case Studies → Blog
   Posts.
2. Items: categories, services, areas (from the export), FAQs and the
   SNC-Lavalin case study from the prototype.
3. Prototype: the service template page built from the Figma frame (with
   one preview service's copy), then `data-collection` / `data-field`
   markers on every bound element (conventions §11), so the Webflow build
   has a map.
4. Services items: the 16 services and their ≈128 FAQs read from the
   preview site and written through the API.
5. Lists on Home (services tabs, case carousel, resources, FAQs), built at
   body level then moved into the slot.
6. Templates: Services, Service Areas (Toronto), Case Studies, then Blog
   once designed.
7. Blog import (243), then the redirect map in `BUILD-NOTES.md`.
