# Build notes

What the build handoff needs (see the skill's `checklists.md` › Build
handoff). Kept current during the build, not written at the end. No
credentials here: name the vault entry instead.

## CMS notes

How to edit what: each collection and its fields, which sections are
conditional on which field, and each component's props.

| Collection / component | How to edit | Notes |
| --- | --- | --- |
| | | |
| Blog Posts | CMS → Blog Posts: Title, SEO Title (under 60 characters), Meta Description (140–160), Thumbnail (with alt text), Excerpt, Body. | Use a curly apostrophe (’) and no straight double quotes in the Title: it is written into the page's structured data, where `'` comes out as `&#39;` and `"` breaks it. |
| FAQs | CMS → FAQs: edit Question and Answer; tick Show on Home / Show on Contact / Show on FAQs page (then pick a Topic for its filter tab), or pick a Location, to choose where it appears; Order sets the position. | All questions start closed and only one opens at a time (faq module). Every item needs an Answer or its question won't open. The FAQs page's structured data is a fixed copy of its list (`docs/seo/schema/faqs.jsonld`): ask for it to be updated when Show on FAQs page items change. |

## Integrations

| Service | What it does | Where it's configured | Vault entry |
| --- | --- | --- | --- |
| | | | |

## Changes log

Changes made during the build that differ from the approved design, and
who approved them.

- <Date> · <change> · <approved by>
- 2026-11-16 · Service area FAQs: 7 per page from the client's final FAQ document, earlier location FAQs removed · client
- 2026-11-16 · Reply time "2–4 hours" / "24 hours" → "one business day" on every page and form message · client
- 2026-11-10 · Privacy Policy ported from live with small wording fixes (see HANDOFF Status 2026-11-10); effective date kept at January 17, 2024 · needs the client's legal OK

## Redirect map

Every old URL → its closest new page, from the crawl saved in discovery.

| Old URL | New URL | Status |
| --- | --- | --- |
| `/services/used-office-furniture-buyers` | `/services/office-furniture-liquidation` | 301, decided (cms-plan) |
| `/offers` | none: rebuilt at the same URL with live's content in the new layout (2026-11-24: quote hero with the HubSpot form, services and industries tabs, process, FAQs, CTA Banner) | decided |
| `/testimonials` | `/about-us` | 301, live's existing redirect |
| `/our-services` | none: rebuilt as a services hub at the same URL | decided |
| `/auctions` | none: rebuilt at the same URL with an Auctions CMS collection (2026-11-24) | decided |
| `/auctions/ingram-micro` | none: Auctions collection item at the same URL (2026-11-24) | decided |
| `/faq` | `/faqs` | 301, decided |
| `/thank-you` | none: kept as a noindex page until HubSpot/GTM are checked | decided |

Unchanged URLs (no redirect): `/`, `/about-us`, `/contact-us`, `/blog`,
every `/blog/<slug>`, 16 `/services/<slug>`, 10 `/service-areas/<slug>`.
`/privacy-policy` is rebuilt, not redirected. Source: SEO-PLAN.md
(2026-11-09 crawl).

**Import file `docs/seo/redirects.csv` (96 rules, 2026-11-24):** live's 94
existing 301s (the person's export, `michaels-global-trading-2026-11-24.csv`)
plus `/services/used-office-furniture-buyers` and `/faq` above. Checked
against staging: no source is a page on the new site, every one of the 42
targets loads, and no target is itself a source (no chains). Changes from
live's export:
- 28 chained rules point straight at their final page (e.g.
  `/our-services/liquidation` → `/services/office-furniture-liquidation`
  instead of via `/services/business-asset-liquidation`).
- 4 targets 404 on live and on the new site: `/services/e-waste-removal` and
  `/services/business-asset-e-waste-removal` → `/services/e-waste-recycling`;
  `/services/asset-appraisal` and `/services/certified-business-asset-appraisal`
  → `/our-services` (no appraisal page; About Us links appraisal there too).
- Closer matches than live's generic targets: the 4 donation URLs →
  `/services/office-furniture-donation` (live: office-furniture-removal); 3
  computers/electronics URLs → `/services/it-equipment-liquidation` and
  `/our-services/warehouse-equipment` → `/services/warehouse-liquidation-services`
  (live: office-furniture-liquidation), following live's own newer rules for
  those topics.
- `/get-a-quote`, `/landing` → `/offers` and `/upcoming-auctions` →
  `/auctions` are kept: both pages exist again.

## Known issues

### Fix before launch

- <issue> · <owner>

### Fix after launch

- <issue> · <owner>
