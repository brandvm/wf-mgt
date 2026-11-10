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
| FAQs | CMS → FAQs: edit Question and Answer; tick Show on Home / Show on Contact / Show on FAQs page (then pick a Topic for its filter tab), or pick a Location, to choose where it appears; Order sets the position. | All questions start closed and only one opens at a time (faq module). Every item needs an Answer or its question won't open. |

## Integrations

| Service | What it does | Where it's configured | Vault entry |
| --- | --- | --- | --- |
| | | | |

## Changes log

Changes made during the build that differ from the approved design, and
who approved them.

- <Date> · <change> · <approved by>

## Redirect map

Every old URL → its closest new page, from the crawl saved in discovery.

| Old URL | New URL | Status |
| --- | --- | --- |
| `/services/used-office-furniture-buyers` | `/services/office-furniture-liquidation` | 301, decided (cms-plan) |
| `/offers` | `/contact-us` | 301, decided |
| `/testimonials` | `/about-us` | 301, live's existing redirect |
| `/our-services` | none: rebuilt as a services hub at the same URL | decided |
| `/auctions` | `/case-studies` | 301, decided |
| `/auctions/ingram-micro` | `/case-studies` | 301, decided |
| `/faq` | `/faqs` | 301, decided |
| `/thank-you` | none: kept as a noindex page until HubSpot/GTM are checked | decided |

Unchanged URLs (no redirect): `/`, `/about-us`, `/contact-us`, `/blog`,
every `/blog/<slug>`, 16 `/services/<slug>`, 10 `/service-areas/<slug>`.
`/privacy-policy` is rebuilt, not redirected. Live's other existing 301s
come from the person's export. Source: SEO-PLAN.md (2026-11-09 crawl);
import file `docs/seo/redirects.csv` (proposed rows included).

## Known issues

### Fix before launch

- <issue> · <owner>

### Fix after launch

- <issue> · <owner>
