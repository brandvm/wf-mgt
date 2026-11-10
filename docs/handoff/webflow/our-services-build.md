# Services hub — `/our-services`

2026-11-09, side session. Page **Our Services** `6af29f9ea434a527628072d0`
(slug `our-services`, the live site's URL, so no redirect: SEO-PLAN
decision 4). Published to webflow.io at the person's request; nothing committed.

## Layout (the person's choice)

First proposal (four stacked category sections, 4-column cards) was built,
then the person asked for **a sidebar filter, with a section header and a 2 × 2
grid per category on the right**. Built that way:

1. Page hero (Section › Is Page Hero, S Bg Overlay › Is Side Gradient,
   photo = Home's office-furniture services image `6af23779d3ec45577200b5d9`):
   chip, H1 "Commercial liquidation & clearance services", the preview
   site's two intro paragraphs, Button Row › Is Loose (Phone Button
   647-496-6362, Arrow Link "Get a Quote" → /contact-us).
2. `#services` (Section › Is Surface): Side Layout (see Open: the sidebar
   was redesigned). Left, sticky (Why Split Head): chip, line, Side Filter with 5 DOM buttons (`data-filter`: all / office-furniture /
   warehouse-commercial / it-equipment / sustainability-esg; first is
   Segmented Tab › Is Active). Right: Hub List `data-filter-list`, four Hub
   Groups (`id` + `data-category` = the category slug) each holding Hub
   Group Head (H2 D3 + intro, static copy from Service Categories) and a
   Services Collection List (Card List W › Card Grid › Is Two) of Article
   Cards: Hero Image, Name (H3 D5), Card Summary, "View service".
   Filtering is the existing `filter-tabs` module: no new JS.
3. Locations and CTA Banner component instances.

## How it was built

`create_page` with `duplicateOf` Home: the copy keeps Home's four
**Designer-made** Services lists with their Category filters and Order sort
(read back: `filters: category equals <id>`, `sort: order ascending`) and
the rows' Current Service link, so no Designer step was needed. Each row
template was turned into an Article Card through the API; Home's other
sections were removed.

New classes: Card Grid › Is Two, Hub List, Hub Group (width only; sets no
display, so `[hidden]` hides it), Hub Group Head. Prototype:
`prototype/our-services/index.html`, CSS in `src/css/new-classes.css`,
`CLASSES.md` › Services hub.

SEO: title "Our Services | Michaels Global Trading", description (158)
"Office furniture, warehouse, IT equipment and sustainable reuse services
across Canada: liquidation, removal and decommissioning from Michaels Global
Trading.", OG copies both. JSON-LD (CollectionPage + ItemList + Breadcrumb)
left to the SEO session.

## Open

- Published to webflow.io 2026-11-09 (the person asked) and checked at
  1440 / 991 / 767 / 390: 16 cards, every href `/services/<slug>`, images
  load, filter shows one group per tab, no horizontal overflow, title /
  description / og:title right, one H1. The builder's `set_text` on the
  tabs' TextBlocks didn't stick (published "This is some text inside of a
  div block."): set on the String nodes instead, republished.
- Hero phone link published as `tel:835:6474966362` (set_link phone with `tel:…`); set to the bare `+16474966362` and read back; published, staging serves `tel:+16474966362`.
- At 1440 the 15em sidebar wrapped two tab labels onto two centred lines;
  the person asked for a new sidebar design (2026-11-09). The hub now has
  its own classes instead of the FAQs page's Why Split › Is Sidebar /
  Segmented › Is Vertical: **Side Layout** (17.5em = 280px column + groups,
  one column ≤991), **Side Filter** (white panel, wraps into a row ≤991),
  **Side Filter Tab** (DOM button, left-aligned label + **Side Filter Count**
  pill, Bg/Tint hover, Form/Focus ring on focus-visible; **Is Active** navy,
  toggled by filter-tabs). Published 2026-11-09 and checked at 1440 / 991 / 767 / 390: rows on one line (43.5px) at 1440, pills from 991, filter works, photos load, no overflow. Renamed
  Hub … → **Side Layout / Side Filter / Side Filter Tab / Side Filter Count**
  (`rename_style`, ids kept) because /faqs reuses them (FAQs session).
  No `data-filter-count` here: the hub's list items are the 4 groups, so the
  module would count groups, not services; counts stay static (16 / 4).
- Nav/footer "Services" links: URL links to `/our-services` already
  (components-build.md › 5); switch to a page link if wanted.
- No style guide rows yet for Hub List / Hub Group Head / Card Grid › Is Two.
