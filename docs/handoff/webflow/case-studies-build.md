# Case Studies build — collection, items, template, listing

2026-11-09, side session (started by the main session). Site
`6aecfdb66cfe7667efc6d078` through `webflow-michaels-global-trading` only
(`list_sites`: one site). Plan: `cms-plan.md` › 5. Case Studies.

**Decision 2026-11-09 (the person): "SNC-Lavalin only".** The SNC-Lavalin
item was published with `publish_collection_items` (read back:
`isDraft: false`, `lastPublished` 2026-11-10T02:17:17Z). Toys“R”Us, Moneris
and WilsonHCG stay drafts. **The site publish to webflow.io is on hold**
(the Blog session's CSV import is in progress); the main session publishes
once that is done. Until then the template, the listing and the new
collection aren't on staging. Nothing committed.

**MANUAL-TODO P and Q done 2026-11-09** (Designer in Chrome Browser 2,
after Blog's import; tab closed). Listing: featured list `9a7f57ae-…99e4`
(Featured is on, Project Date newest first, limit 1) and grid
`c3f156e3-…dede` (Project Date newest first) are Designer-made lists with
the cards moved in; both card links = Current Case Study. Template: Stat
Band Items 2–4 and the two Story Photo wrappers are Designer-made Divs with
"… is set" conditions. No `data-manual-todo` markers left on either page.
Hero Image has no condition (absolute background): fill it before
publishing an item.

## Sources

- Layout: the prototype `prototype/case-study-snc-lavalin/` and
  `prototype/case-studies-5/`, which match the person's Figma frames
  **1725:17805** (case study template) and **1734:595** (listing), file
  `mRsQ8WQJeWKEm3N7J0OmCN` (checked with a screenshot 2026-11-09: same
  sections and copy).
- Content: the live site (mgt-live, read-only server) has **no case studies**
  — its collections are Customers (logos only), FAQs, Blogs, Auctions,
  Service Areas, Testimonials, Blog Categories/Tags, Sub-Services; no case
  study pages either. The only full case study is SNC-Lavalin in the
  prototype. The services preview site
  (`mgt-office-liquidation-preview…chatgpt.site/services/<slug>/`) has a
  "Client projects and results" carousel with **4** case cards (category,
  one stat, a 2–3 line summary): SNC-Lavalin, Toys“R”Us, Moneris, WilsonHCG.
  Its images are shared decorative layers, not per-case photos.

## Collection

**Case Studies** `6af2794c982e680f792fc90e`, slug `case-studies`
(template `/case-studies/<slug>`). 27 custom fields + Name/Slug, every one
with help text, in 6 field groups (order below the table; read back). The
Group column is the first grouping, kept for the ids:

| Group | Field | Type | Id |
| --- | --- | --- | --- |
| — | Name (client) | PlainText | `c6caef6d6608613d221995dc6ab565b3` |
| — | Slug | | `201bd859fc97f566740c4fbeee6cb47e` |
| Lists and filters | Project Type (required) | PlainText | `311da92560361485fa8c0ff129a08165` |
| | Service Category | Reference → Service Categories | `a35075512387153cee601428fac460e1` |
| | Industry | Option | `a1399471cfe472087202ae165319ddbc` |
| | Project Date | DateTime | `7d024942767eb95c469b5e04a437498e` |
| | Featured | Switch | `a96ed2608e28fa39eb9ab10d249e4b37` |
| | Headline | PlainText | `a59584c14029e78e362b37d519b43e50` |
| Hero | Summary (required) | PlainText | `b81249914f7d786b32e297cdd36cf38d` |
| | Hero Image | Image | `ef5e76a72f469733101fbc2dabb18b3b` |
| | Timeline | PlainText | `54c81e92d49ce9c73de0d26def56695c` |
| | Scope | PlainText | `bf689c06f45f7be9d5e5b775aab80475` |
| | Services Provided | MultiReference → Services | `e1f7d5693d097d8c7f2ab811962fd626` |
| Project stats | Stat 1 Value / Label | PlainText | `2ed5f6efc8c9a7a91eb4903120545676` / `d26450c9ff6e7a5bc1465cee7ff05d80` |
| | Stat 2 Value / Label | PlainText | `684fbae43c8c939e7ea770359a3dd122` / `973210f385cfdd519333c46784427bd1` |
| | Stat 3 Value / Label | PlainText | `8cad50ccacdfe5e93b8c7f7e954ae749` / `faca595aef27d358c1fef757b9d0392f` |
| | Stat 4 Value / Label | PlainText | `6aac13919df4a668667e86f30dd5d01a` / `7443d8b8dd2dfbdb483db00d7eb3e9cc` |
| Story | Challenge | RichText | `838e321c393c467963992a60889d3130` |
| | Challenge Image | Image | `7112ad98cf3b8a73fd9808079fd16b15` |
| | Approach | RichText | `2f7e8cd70a52bf6f4cfd102d6b741663` |
| | Execution (H3 allowed) | RichText | `bc60adc8205eb327e920d920a5b3fdaa` |
| | Execution Image | Image | `029c67be0fbffefb3f821d443fa85a19` |
| | Outcome | RichText | `e546ae73d3ef53568a7d2d371ba26fc5` |
| SEO | SEO Title / Meta Description | PlainText | `7847d36e1bdc3d84059056b4927b3c88` / `9f043b6664e6ef5975ccfe02d85a7b2b` |

Industry options (placeholders until the person agrees the list, open
decision 4): Engineering & construction `b6f6ff9741e32f85d461ca7489f18ee5`,
Retail `007f142670d7e2df92c68a7c34fee55f`, Financial services
`02268ac874e81ea3238b0f9e1c502fac`, Professional services
`7be7b146da26a035e4b77aeecc583ae2`.

Differences from the plan's field list, and why:
- **Stats are plain text, not Number + prefix/suffix.** The design has
  "$0", ">60%", "~6" and "On-site"; the count-up module keeps text around
  the first number, so "$0" and ">60%" still count. 8 fields instead of 16.
- **One Hero Image** serves the hero and the cards (the prototype uses the
  same photo for both); no separate Card Image.
- **Challenge Image / Execution Image** added for the two story photos.
- **Services Provided** is a multi-reference to the 16 Services, as planned.
  The tags therefore read the service names ("Office Furniture
  Liquidation") rather than the prototype's free labels ("Furniture
  sales", "Auction management"). They don't link (the prototype's don't).
- The four section eyebrows/H2s ("The challenge / What they needed", …) are
  static on the template.

**Field groups** (re-ordered 2026-11-09 to the person's rule — SEO first,
then page order, then off-page settings — and read back): SEO · Hero
(Project Type, Summary, Hero Image, Timeline, Services Provided) · Project
stats · Story · Sidebar (Scope) · Lists and filters ("Not on this page: …":
Headline, Service Category, Industry, Project Date, Featured).

**Content order** (the person, 2026-11-09): per field, 1) the preview site,
2) Figma, 3) the live site. Sources used:
- SNC-Lavalin — Summary and Stat 1 (`$0` Client decommissioning cost):
  preview site's case card. Everything else (Project Type is the same in
  both; Headline, Stats 2–4, Timeline, Scope, the four story sections,
  photos, alt text): Figma 1725:17805 / 1734:595 via the prototype, since
  the preview has no case study page. SEO Title / Meta Description written
  by Claude (no source has them).
- Toys“R”Us, Moneris, WilsonHCG — Project Type, Summary, Stat 1: preview
  site's case cards. Figma has only SNC-Lavalin; the live site has no case
  studies (checked through the read-only MCP: no collection, no pages). The
  rest is empty or `[PLACEHOLDER]`. SEO fields written by Claude.
- Slugs: no live case study URLs exist, so the slugs follow the preview's
  `data-case-id`s (`snc-lavalin`, `toys-r-us`, `moneris`, `wilsonhcg`).
- Service Category, Industry and Services Provided: Claude's mapping (no
  source states them).

## Items (drafts, read back field by field 2026-11-09: all match)

| Item | Id | Content |
| --- | --- | --- |
| SNC-Lavalin `snc-lavalin` | `6af279d05b24d1dab6ebe1be` | Full (summary and Stat 1 from the preview, the rest from Figma/prototype; Figma's 11 floors / 9 months / On-site are Stats 2–4): 4 stats, timeline, scope, 4 rich sections, 3 images (copied to the CMS CDN from the site's assets), Project Date 2022-09-15, Featured on, SEO |
| Toys“R”Us `toys-r-us` | `6af279d05b24d1dab6ebe1c0` | Card only (preview site): Project Type, Summary, Stat 1 (>60%), category, industry, services, SEO; body sections `[PLACEHOLDER] Full case study to come.`; no images, timeline, scope, date, headline. Featured on |
| Moneris `moneris` | `6af279d05b24d1dab6ebe1c2` | Same as above (Stat 1 ~6 Weeks to complete). Featured off |
| WilsonHCG `wilsonhcg` | `6af279d05b24d1dab6ebe1c4` | Same as above (Stat 1 100 Laptops donated). Featured on |

Services Provided picks (Claude's choice from the preview's wording, for the
person to review): SNC-Lavalin — office-furniture-liquidation,
office-furniture-decommissioning, commercial-asset-liquidation,
office-furniture-removal; Toys“R”Us — warehouse-decommissioning,
industrial-equipment-removal, commercial-asset-liquidation,
office-furniture-removal; Moneris — office-furniture-decommissioning,
office-furniture-removal, data-center-decommissioning,
office-furniture-relocation; WilsonHCG — it-asset-disposition,
it-equipment-liquidation, office-furniture-removal.

Asset `6af279a1edb944c2bbfad7be` (snc-lavalin-wrapping.webp) was uploaded
only so the CMS could copy it; the item now holds its own CMS copy, so the
asset can be deleted (person's OK).

## Template — Case Studies Template `6af2794c982e680f792fc914`

Body: G | Components, G | Page W; in G | Main: sections `#top` (Case Hero),
`#project-stats`, `#case-study` (story + aside), `#trust`, `#locations`
(page markup, the shorter "Locations we serve" heading; tags link to
`/service-areas/<slug>`), then a **CTA Banner** instance. Built with the To
Slot helper + WHTML import with `data-todo` placeholders (as the Services
template), then: 3 Images, 4 Rich Text (Rich Body, each in a Body L div),
1 DOM span (project type in the hero chip), 5 Icon Size instances (14px
`ph-user` / `ph-frame-corners` / `ph-clock-counter-clockwise` for the
overview, `ph-check` in the services checklist, `ph-phone`), 1 Button Color
(Get a Quote, `a.button.is-full` → `/contact-us`).

Bound (settings read back): Name ×4 (breadcrumb, H1, details, overview),
Summary, Timeline ×2, Scope, Project Type (span), Stats 1–4 value + label,
the 4 rich texts, Hero Image (alt empty: background), Challenge Image and
Execution Image (alt = the image field's alt). Two nested Collection Lists
on **Services Provided** (source `{collectionId: Services, fieldId}`,
limit 20): the hero tags (list Tag Wrap › Chip Is Small → Service Name) and
the aside checklist (Aside Services › Aside Service › Aside Service Icon +
Link Text → Service Name); empty states hidden. Page SEO = SEO Title / Meta
Description tokens; Open Graph copies them. No placeholders or
`data-field` markers left. One marker: `data-manual-todo="Q"`.

Not on the template: the prototype's static "Locations" component (this page
has its own heading, as the component's description says).

## Listing — Case Studies `6af27c03c289c1317f0a35e5` (`/case-studies`)

Static page, SEO title "Case Studies | Michaels Global Trading". Section
`#case-studies`: Head Row (chip, H1 D2 "Real projects. / Real results."),
Listing Intro (Figures Band ×4, Trusted Strip with the Logo Strip Img
`client-logos-loop.webp` in `data-marquee`), the **featured list**
(Featured Case: meta chip + "Name · Project Type" spans, Headline, Summary,
Stats 1–3 in Mini Stats, a Button link with a Secondary Button Color
"Read the case study", Featured Case Photo = Challenge Image) and the
**grid list** (Card Grid › Article Card link: Article Card Img = Hero
Image, meta, Name, Summary, Case Card Stat = Stat 1, Arrow Link with Icon
Size caret-right); then a CTA Banner. All bound and read back.

**Filter Bar and Load more (Finsweet List 2.7.1, wired 2026-11-09; the
repo side is Blog's commit 19efbd3).** Built with `data_element_builder`
as DOM elements (attributes at creation), between the Listing Intro and the
featured list:
- `form.filter-bar` `c233caab-…39dd` `[fs-list-element=filters]` ›
  Filter Group › two `label.filter-pill` (`for` cs-service / cs-industry) ›
  Filter Pill Label + Select W › `select.filter-pill-select`
  (`id`, `name`, `fs-list-field=service` / `industry`) + Select Icon ›
  Is Pill (`aria-hidden`, Icon Size `ph-caret-down`).
  Options (DOM `option`s, imported one per WHTML action — the importer
  wants a single root; `value` is kept): Service `""` All services, then
  the 4 Service Category Names exactly; Industry `""` All industries, then
  the 4 Industry option names exactly (selects use the `equal` operator).
- Filter Group › Is Loose › `p.body-xs` with
  `span[fs-list-element=results-count]` ("1", replaced at runtime) +
  " case studies", and a Sort pill: `select#cs-sort[fs-list-element=sort-trigger]`
  with `date-desc` Newest first / `date-asc` Oldest first.
- Grid list `c3f156e3-…dedf` `[fs-list-element=list][fs-list-load=more]`;
  pagination 9 per page (set through the API on the Designer-made list,
  read back `itemsPerPage: 9`); Pagination = Load More Row, Next = Load More
  with "Load more case studies", Previous hidden (as on /blog).
- Each Article Card holds a `div.sr-only[aria-hidden=true]` with
  `span[fs-list-field=service]` → Service Category › Name,
  `span[fs-list-field=industry]` → Industry,
  `span[fs-list-field=date][fs-list-fieldtype=date]` → Project Date.
- The featured card is a separate list, not filtered (as /blog).
- Changed by the Blog session 2026-11-09 (person's request, every article
  card): the grid's Collection Item has class **Card Cell** (cards stretch
  to the row), the card's arrow link is Arrow Link › Is Small › **Is End**
  (pinned to the bottom), Article Card Body grows. The hidden Finsweet
  field div (`Sr Only`, last child of the card) is unaffected.
Not checked in a browser yet: staging needs a site publish first.
Checked 2026-11-09 against Blog's three Finsweet mistakes and the 2.7.1
source: (1) no fs-* attribute went through the importer (all set with the
element builder / `set_attributes` and read back: filters, results-count,
sort-trigger, list + load, 5 × fs-list-field); (2) the selects' "All"
option `value=""` is skipped by Finsweet (a condition with value `""` is
not a valid condition), so it clears that filter — no radio needed; (3)
`fs-list-activeclass` applies to radio/checkbox labels only, so selects
need none. No changes.

## What is left

1. ~~MANUAL-TODO P~~ done 2026-11-09.
2. ~~MANUAL-TODO Q~~ done 2026-11-09.
3. **Content** (person / client): the full stories, photos, timeline, scope,
   stats 2–4, headline and Project Date for Toys“R”Us, Moneris and
   WilsonHCG; the Industry list; the 9 vs 4 case study count (open
   decision 4); review the Services Provided picks.
4. **Publish:** SNC-Lavalin item published 2026-11-09 (the person's
   decision); the site publish to webflow.io is held until Blog's import is
   done (main session). After it, check `/case-studies` and
   `/case-studies/snc-lavalin` on staging (scripts off vs on).
5. After the next site publish: check /case-studies with scripts on —
   Service / Industry filters, Sort, the count, no Load more with < 10
   items, and no console errors.
6. Follow-ups outside this task: the Home case study carousel as a CMS list
   (Featured, newest first); prototype pages with `data-field` markers for this
   collection (not done; the Webflow build followed the prototype markup
   directly).
