# SEO plan: metadata, Open Graph, canonical and schema

Written before launch (the `webflow-launch` skill › SEO plan) and kept
current until every row is done. The rule is the same as for CSS:
whatever Webflow does natively stays in Webflow (page settings, CMS
bindings); only what it can't do goes into custom code, and that code is
kept in this repo as the source of truth.

## Status

2026-11-09 (later) — **Fixes applied in Webflow (staged, not published)**, person's OK:
- Home: SEO title/description (decision 2), OG "same as SEO", share image.
- Contact Us, About Us, Blog, Case Studies: OG "same as SEO" + share image
  (asset `6af29f6bd2be3d8ec6902905`, `mgt-share-1200x630.jpg`, the Home hero
  cropped); Contact and About meta descriptions now say 647-496-6362.
- Blog Posts template title = `{SEO Title}` only (suffix removed).
- 16 Services items: `seo-title` "<Service> Toronto & Canada | MGT" and
  live's descriptions (two shortened to ≤160). Staged on published items:
  they go live with the next item/site publish.
- Phone 647-496-6362 (link value `+16474966362`; a `tel:` prefix publishes broken, GOTCHAS 2026-11-09) everywhere except About Us and the
  FAQs page (their sessions were told): CTA Banner and G | Footer W
  components, Home, Contact Us, Services, Service Areas, Case Studies and
  Blog Posts templates, style guide. The stale importer `href="tel:…0860"`
  custom attributes on those links were removed. Not checked: CMS rich
  text (FAQ answers etc.) for the old number.
- **Refused by the API:** binding an image field as the OG image on CMS
  templates (`openGraph.imageUrl` must be a URL) → MANUAL-TODO U.
- JSON-LD: Home (Organization/LocalBusiness + WebSite + WebPage + 16
  Service), About, Contact, Blog, Case Studies through the schema API
  (read back). Services, Service Areas, Blog Posts and Case Studies
  templates: CMS-bound JSON-LD in each template's head code (the schema API
  refuses tokens; GOTCHAS 2026-11-09). Source files: `docs/seo/schema/`.
  Live's third contact point (647-821-9961, for `/offers`) was left out.
- hreflang as live: two `<link>`s in Home's head code; the US
  service-area page gets them from a small script in the Service Areas
  template head (live does the same).
- **Checked on staging after the About session's publish (2026-11-09):**
  no `tel:835` or 647-317-0860 left on Home, About, Contact, FAQs, Blog,
  Case Studies, a Service, two Service Areas, SNC-Lavalin, style guide,
  404; titles as set; share image on the static pages; JSON-LD parses on
  every checked page with the CMS fields filled in (e.g. Service name and
  URL, Article image), no HTML entities. Template pages have no `og:image`
  yet (MANUAL-TODO U). `/our-services` (hub session) still had one broken
  phone link; that session was told. Blog posts are drafts, so
  BlogPosting is unchecked (dates, `&#39;`).
- **Earlier note:** needs a publish. Then check the bound
  JSON-LD renders valid JSON on one item per template (dates, `&#39;` in
  3 blog titles with apostrophes), `og:image` on static pages, phone links.
- FAQs (`/faqs`, `6af29b6d4dd2addd044071ca`): FAQPage JSON-LD with the 10
  published Q&As on the page (plain-text answers; `docs/seo/schema/faqs.jsonld`,
  rewrite it when the FAQ list changes), meta description phone → 6362,
  share image. Redirect `/faq` → `/faqs` confirmed.
- New since the comparison: `/faqs` exists (FAQs session) and `/our-services` exists (services hub
  session). FAQs Template publishing is now off.

2026-11-09 — Decisions 1–7 answered by the person (below).

2026-11-09 — **Live vs new comparison done (read only, nothing written to
Webflow).** Sources: `list_pages` / page settings / JSON-LD / head code on
both sites (live through its read-only server), both sitemaps and
robots.txt, and the published HTML of every URL in the live sitemap (280)
plus 68 staging URLs, crawled without a browser. About Us and FAQs were
being built by other sessions during the check: About Us exists (SEO set,
not yet published), FAQs has no page yet. **Every fix below waits for the
person's OK**; the decisions are under "Decisions".

## Headline findings

1. **Home has no SEO settings.** Staging serves `<title>Michaels Global
   Trading</title>`, no meta description, no OG tags. Live ranks on
   "Commercial Liquidation Canada | Office Furniture, IT, and Tech
   Decommissioning".
2. **No JSON-LD anywhere on the new build.** Live has a full graph:
   Organization/LocalBusiness with address, hours, phones, sameAs and 17
   `Service` items on Home; AboutPage, ContactPage, FAQPage (10 Q&As),
   CollectionPage, BlogPosting and BreadcrumbList on the others.
3. **Service pages lost their SEO copy.** All 16 service titles dropped the
   "Toronto & Canada | <keyword>" pattern and the descriptions were
   rewritten from the preview site without the geo keywords (table below).
   Service Areas match live exactly.
4. **No tracking or verification on the new build**: live head code has
   GTM `GTM-NKPQBTX` (+ noscript), the illow cookie banner and the Ahrefs
   verification meta. Favicon and webclip are Webflow's defaults.
5. **Live URLs with no page yet:** `/privacy-policy` (legal page, must be
   built), `/faq` (FAQs in progress), `/our-services`, `/offers` (Get a
   Quote), `/auctions`, `/auctions/ingram-micro`, `/thank-you`, and
   `/services/used-office-furniture-buyers` (dropped on purpose, cms-plan).
6. **Every blog post is a draft** on the new build, so all 243 live
   `/blog/<slug>` URLs 404 on staging today. 5 more imported posts are
   dated in the future (live's scheduled posts: 2026-11-16 → 12-28); they
   must stay drafts until their date.
7. **Blog post titles get longer:** the Blog Posts template writes
   `{SEO Title} | Michaels Global Trading`; live writes the SEO Title alone.
   234 of 249 titles would pass 60 characters.
8. **Template pages that shouldn't publish:** FAQs (`/faqs-items/…`, 124
   published items), Service Categories (`/service-categories/…`, 4) and
   Clients (`/clients/…`, 13; MANUAL-TODO R) all have "publish template"
   on. They answer 404 on staging today, but nothing stops them becoming
   empty, indexable shell pages.
9. **No Open Graph image anywhere** on the new build. Live binds Hero Image
   on Service Areas and Blog Thumbnail on posts; its Home share image is
   the webclip SVG (social networks don't render SVG).
10. **Sitemap controls need a site plan.** `data_sitemap_tool` answers 403
    ("Site plan doesn't support sitemap indexing controls"); the staging
    sitemap is stale (3 URLs: `/`, `/design/style-guide`, `/design/media`).
    301 redirects and the custom domain also need the plan.

## What staging outputs today

Read from the published HTML on 2026-11-09 (crawl, not page settings).

| Tag | Webflow does it? | Now (staging) | Live |
| --- | --- | --- | --- |
| `<title>`, meta description | Yes, page settings (templates: bound fields) | Set everywhere except **Home** (site name only, no description), 404, Style Guide | Set on every page; `/offers`, `/privacy-policy`, `/auctions/ingram-micro`, `/thank-you` have no description |
| `og:title`, `og:description`, `twitter:*` | Yes ("same as SEO") | Copied on most pages; **missing on Home and Contact Us** (OG not set to "same as SEO"), Media | Copied everywhere |
| `og:image` | Yes (upload, or bind an image field on templates) | **None on any page** | Home: webclip SVG; Service Areas: Hero Image; Blog posts: Blog Thumbnail |
| `<link rel="canonical">` | Yes, Site settings › SEO › Global canonical URL | None (correct for staging) | `https://www.michaelsglobaltrading.com/…` on every page; **two identical canonicals** on Blog and Service Area items (page head code adds a second one — don't port it) |
| `og:site_name`, `og:locale`, `twitter:site` | No: head code in `loader.html` | None | None |
| JSON-LD schema | No: page settings › custom code / `jsonLdSchema` | **None** | Every page (see Schema per page) |
| `lang` | Yes, primary locale | `en` | `en` (schema says `en-CA`) |
| `sitemap.xml` | Yes | Stale: 3 URLs incl. 2 design pages | 280 URLs, no design pages |
| `robots.txt` | Yes | `Disallow: /` (webflow.io default, fine) | `Disallow:` (allow all) + Sitemap line |
| Favicon / webclip | Site settings › General (Designer only) | Webflow defaults | `Favicon.svg`, `Webclip.svg` |
| Tracking / verification | Head code | Loader only | GTM-NKPQBTX, illow cookie banner, Ahrefs verification meta |
| 404 page | Utility page | `/404` page exists, unknown paths answer 404 | Same |
| 301 redirects | Site settings › Publishing (site plan) | None (no plan) | At least `/testimonials → /about-us`; full list only in the live site's settings (export needed) |
| `hreflang` | Head code | None | Home: `en-ca` → `/`, `en-us` → `/service-areas/united-states` (also injected by JS on the US page) |

## Per-page comparison

Status: ✅ matches or better · ⚠️ weaker or missing on new · ❌ no page yet ·
⛔ must not be indexed. "API" = Claude can do it through the Webflow MCP;
"Designer" = a MANUAL-TODO row.

### Static pages

| Live URL → new URL | Title live / new | Description live / new | Other | Status | Fix |
| --- | --- | --- | --- | --- | --- |
| `/` → `/` | "Commercial Liquidation Canada \| Office Furniture, IT, and Tech Decommissioning" (78) / **"Michaels Global Trading"** (no SEO title set) | 211 chars / **none** | OG none; H1 both "Canadian Commercial Liquidation Company"; live JSON-LD Organization + WebSite + 17 Services; live hreflang | ⚠️ | API: set title + description (live's, trimmed to ≤60 / ≤160; drafts in Decisions), OG "same as SEO", OG image = Home hero 1200×630 (decision 6), JSON-LD, hreflang as live (decision 5) |
| `/about-us` → `/about-us` | "About Us \| Michaels Global Trading" both | live 160 / new 160 (rewritten, includes phone) | new not published yet (About session); OG copied; live AboutPage + Breadcrumb | ✅ (pending publish) | API: JSON-LD; check H1 after publish |
| `/contact-us` → `/contact-us` | same both | live 120 / new 134 (better) | **OG not copied → no og tags**; H1 same; live ContactPage + Breadcrumb | ⚠️ | API: OG titleCopied/descriptionCopied true; JSON-LD |
| `/faq` → *(FAQs page, in progress)* | "Frequently Asked Questions \| Michaels Global Trading" (52) / — | 221 (too long) / — | live FAQPage with 10 Q&As | ❌ in progress | FAQs session: page + SEO (≤160 description); then 301 `/faq` → new slug if it differs; FAQPage JSON-LD from the CMS list |
| `/blog` → `/blog` | "Our Blogs \| …" / "Blog \| Michaels Global Trading" | 133 / 111 | H1: live none, new 1 ✅; live CollectionPage + Blog | ✅ | API: JSON-LD |
| — → `/case-studies` | new page | new 155 | OG copied; 1 H1 | ✅ new | API: JSON-LD (CollectionPage) |
| `/our-services` | "Our Services \| …" | 154 | live services hub + ItemList schema | ❌ | Build a services hub at `/our-services` (decision 4) with CollectionPage + ItemList schema |
| `/offers` (Get a Quote) | "Get a Quote \| …" | none | live ContactPage | ❌ | 301 → `/contact-us` |
| `/auctions`, `/auctions/ingram-micro` | "Auctions & Liquidations" / "Ingram Micro® Auction" | 30 / none | thin pages, ingram-micro has no H1 | ❌ | 301 → `/case-studies` (decision 4) |
| `/privacy-policy` | "Privacy Policy" | none | legal page | ❌ | **Build the page** (copy from live); title "Privacy Policy \| Michaels Global Trading", description; not a redirect |
| `/thank-you` (noindex on live) | "Thank you for submitting the form." | none | may be HubSpot's redirect target or a GTM conversion trigger | ❌ | Rebuild as a noindex page until HubSpot form settings and GTM triggers are checked (decision 4) |
| — → `/design/style-guide` | "Style Guide" | none | `noindex, nofollow` meta ✅; 4 H1s (fine, noindex); **in the staging sitemap** | ⛔ ok | At launch (site plan): exclude from sitemap |
| — → `/design/media` | "Media" | internal note | `noindex, nofollow` ✅; in staging sitemap | ⛔ ok | Same |
| `/404` → `/404` | "Not Found" both | — | real 404 status for unknown paths on both | ✅ | — |

### Services (live static pages → new Services CMS template, `/services/<slug>`)

Slugs are identical except `used-office-furniture-buyers` (dropped, 301
below). New titles use the item's SEO Title field as is (no suffix added).
H1s are now the plain service name ("Office Furniture Removal" instead of
"Office Furniture Removal Services"; "IT Asset Disposition" instead of
"IT Asset Disposition (ITAD) Services in Toronto"). Live had WebPage +
BreadcrumbList on each, new has none. OG image: none on either.

| Slug | Title live → new | Description: what changed |
| --- | --- | --- |
| office-furniture-liquidation | "Office Furniture Liquidation Toronto & Canada \| Removal & Resale" (64) → "Office Furniture Liquidation \| Michaels Global Trading" (54) | Both mention Toronto and Canada ✅ |
| office-furniture-decommissioning | "…Toronto & Canada \| Lease Compliance" (68) → "… \| Michaels Global Trading" (58) | Lost "Toronto and Canada", "lease-compliant" |
| office-furniture-removal | "…Toronto & Canada \| Disassembly & Disposal" (66) → "Office Furniture Removal Services \| MGT name" (59) | Lost "Toronto and across Canada" |
| office-furniture-relocation | "…Toronto & Canada \| Commercial Movers" (64) → (62) | Lost "Toronto and Canada", "commercial movers" |
| warehouse-liquidation-services | "Warehouse Liquidation Toronto & Canada \| Racking & Inventory Removal" (68) → (56) | Lost geo |
| warehouse-decommissioning | "…Toronto & Canada \| Teardown & Cleanout" (64) → (51) | Lost geo |
| commercial-asset-liquidation | "…Toronto & Canada \| Equipment Buyers" (64) → (54) | Lost geo |
| industrial-equipment-removal | "…Toronto & Canada \| Machinery Disposal" (66) → (54) | Lost geo |
| it-equipment-liquidation | "…Toronto & Canada \| Sell & Remove Office Tech" (69) → (50) | Lost geo |
| it-asset-disposition | "IT Asset Disposition Toronto & Canada \| Certified ITAD for Business" (67) → (46) | Lost geo and "ITAD" |
| data-center-decommissioning | "…Toronto & Canada \| Server Rack Removal" (66) → (53) | Lost geo |
| e-waste-recycling | "…Toronto & Canada \| Office Electronics Disposal" (64) → (43) | Lost geo, "certified", "chain of custody" |
| sustainable-office-decommissioning | "…Toronto & Canada \| Green Cleanouts" (69) → (60) | Lost geo, "ESG" |
| eco-friendly-office-furniture-disposal | "Eco-Friendly Furniture Disposal Toronto & Canada \| Office Cleanouts" (67) → (64, over 60) | Lost geo |
| office-furniture-donation | "…Toronto & Canada \| Business Pickups" (61) → (51) | Lost geo, "charity matching" |
| landfill-diversion | "Landfill Diversion Toronto & Canada \| Waste Reduction & Recovery" (64) → (53) | Lost geo, "ESG" |
| used-office-furniture-buyers | "Used Office Furniture Liquidation Toronto & Canada \| Sell Surplus" | **no page** → 301 to office-furniture-liquidation |

Fix (API, CMS fields `seo-title` / `meta-description` on the 16 Services
items): the person picks one — restore live's text (it was rewritten for
SEO on 2026-10-30; several titles are 61–69 characters, Google truncates
past ~60) or keep the preview-site copy. Proposed: live's titles trimmed
to ≤60 by dropping the part after "|" where needed (e.g. "Office Furniture
Liquidation Toronto & Canada | MGT"), and live's descriptions where they
are ≤160.

### Service Areas (`/service-areas/<slug>`, same URLs on both)

All 10 items: title, description and H1 **identical** to live ✅. Live's
H1 is assembled by a script in the template's head code; new renders a
real `<h1>` ✅. Missing on new: OG image (live binds Hero Image), JSON-LD
(WebPage + BreadcrumbList), and live's en-us/en-ca `hreflang` on
`/service-areas/united-states` (see Decisions).

### Blog posts (`/blog/<slug>`)

- Slugs: all 243 live posts (sitemap) are in the import with the same
  slug ✅; plus `laptop-server-monitor-liquidation-recovery-rates` (live,
  200, just not in live's sitemap) and 5 future-dated posts (see 6 above).
- SEO Title and Meta Description: same text as live on all 243 (3 differ
  only by whitespace) ✅. No empty fields.
- Template title binding adds " | Michaels Global Trading" → 234 titles
  over 60. Fix (API): template SEO title = `{SEO Title}` only, as live.
- OG image: live binds Blog Thumbnail; new binds none. Fix: bind Thumbnail
  (try through the API with an `ImageRef` token as live's settings show;
  Designer if refused).
- H1: live 242 posts with 1 H1, one with 2. New: check after the posts are
  published.
- JSON-LD: live's BlogPosting is half-finished (`"description":
  "[[POST SUMMARY]]"`, `"image": "[[MAIN IMAGE URL]]"`, dateModified bound
  to the published date). Port it with Excerpt, Thumbnail and the item's
  updated date bound instead.
- Publish state: all drafts → nothing to index until the item publish the
  blog session is waiting on (all except the 5 future-dated posts).

### Case studies (`/case-studies/<slug>`, new)

SNC-Lavalin published: title "SNC-Lavalin Office Decommissioning Case
Study | MGT" (51), description 144, 1 H1 ✅. The other 3 are drafts.
No OG image (bind Hero Image), no JSON-LD (Article + BreadcrumbList).
Live has no case study pages, so no redirects.

### CMS templates and their SEO bindings

| Template | Title binding | Description binding | OG | Publish template? | Fix |
| --- | --- | --- | --- | --- | --- |
| Services | `{seo-title}` | `{meta-description}` | same as SEO, no image | on ✅ | OG image → Hero Image |
| Service Areas | `{seo-title}` | `{meta-description}` | same as SEO, no image | on ✅ | OG image → Hero Image |
| Blog Posts | `{seo-title} \| Michaels Global Trading` | `{meta-description}` | same as SEO, no image | on ✅ | drop the suffix; OG image → Thumbnail |
| Case Studies | `{seo-title}` | `{meta-description}` | same as SEO, no image | on ✅ | OG image → Hero Image |
| Blog Categories | — | — | — | off ✅ (MANUAL-TODO O) | — |
| FAQs (`/faqs-items`) | — | — | — | **on** ⛔ | switch off (Designer, MANUAL-TODO T) |
| Service Categories | — | — | — | **on** ⛔ | switch off (Designer, MANUAL-TODO T) |
| Clients | — | — | — | **on** ⛔ | switch off (MANUAL-TODO R, extended) |

### Image alt text (key images)

No image is missing its `alt` attribute on either site; the question is
empty alts on content images. On staging these key images have `alt=""`:
Home hero (`hero.webp`), CTA team photo (`cta-team.webp`, every page), the
Home/Toronto blog cards (`blog-1/2/3.webp`), the nav logos (`mgt-logo-*.svg`,
inside the home link: the link needs a name), Services template hero and
scope photos (CMS images, 4 per service), the SNC-Lavalin hero. Decorative
icons (checks, reason icons, price icons) are fine empty. Client logos and
case/blog thumbnails have alts ✅. Fix: Designer alt text on static images
(or the asset's alt in Assets), the CMS images through their alt field;
logo link gets `aria-label`. Full audit: `anthropic-skills:asset-audit` at
pre-launch QA.

## Site-level settings

| Setting | Live | New | Fix | Who |
| --- | --- | --- | --- | --- |
| Favicon / webclip | custom SVGs | Webflow defaults | Upload (PNG 32×32 / 256×256; SVG favicons don't show in every browser) | Designer, MANUAL-TODO S |
| Default share image | Webclip SVG on Home only | none | 1200×630 JPG/PNG, set on static pages | person supplies → API |
| Global canonical | `https://www.michaelsglobaltrading.com` | not set | Set at launch only, to the production host | Designer at launch (MANUAL-TODO S) |
| Site head code | GTM, illow banner, Ahrefs meta, loader | loader only | Add GTM + noscript, illow, Ahrefs to `loader.html` piece 1/3 at launch (snippets aren't versioned: re-paste) | API (`set_site_freeform_code`), at launch |
| `og:site_name`, `og:locale` | none | none | add `en_CA` / "Michaels Global Trading" to the head snippet | API, with the above |
| robots.txt | allow all | `Disallow: /` (staging) | At launch: allow all + Sitemap line | Designer at launch |
| Sitemap | auto, 280 URLs | stale, 3 URLs | Needs the site plan; exclude `/design/*` (and anything noindexed) | API after plan |
| 301 redirects | some exist (`/testimonials → /about-us` seen) | none | Person exports live's redirects; merge with the list below; import | person + Designer at launch |
| Language | `en` | `en` | optional: `en-CA` | Designer |
| Site plan / workspace | paid, 2 custom domains | no plan (separate workspace) | needed for domain, redirects, sitemap controls | person |
| Search Console / Bing | unknown (Ahrefs verified by meta) | — | confirm verification method survives the move (meta/GTM/DNS) | person |

## Redirect list

Same URL on both (no redirect needed): `/`, `/about-us`, `/contact-us`,
`/blog`, all 243 `/blog/<slug>`, 16 of 17 `/services/<slug>`, all 10
`/service-areas/<slug>`. Webflow import file: `docs/seo/redirects.csv`
(proposed rows; the open ones are marked there too).

| Old URL | New URL | Status |
| --- | --- | --- |
| `/services/used-office-furniture-buyers` | `/services/office-furniture-liquidation` | decided (cms-plan) |
| `/offers` | `/contact-us` | decided |
| `/our-services` | none: rebuilt as a services hub at the same URL | decided |
| `/faq` | `/faqs` | decided (slug confirmed) |
| `/auctions` | `/case-studies` | decided |
| `/auctions/ingram-micro` | `/case-studies` | decided |
| `/thank-you` | keep as a noindex page until HubSpot/GTM are checked | decided |
| `/testimonials` | `/about-us` | keep live's existing redirect |
| *live's other existing 301s* | from the person's export | **needed** |

Not redirected: `/privacy-policy` (build the page), `/design/*` on live
(already 404), `/location-toronto` (prototype URL only, 404 on live).

## Schema per page

Port live's graph (read through `query_pages_schema_markup`, page ids in
`list_pages` on mgt-live), keeping its `@id`s on the production domain.
Store each as `docs/seo/schema/<page>.jsonld`; write through
`bulk_update_pages_schema_markup` (API).

| Page(s) | Types | Key data / change from live |
| --- | --- | --- |
| Home | `Organization`+`LocalBusiness`+`ProfessionalService`, `WebSite`, `WebPage`, 16 `Service` | name, logo (new logo URL), 65 Shuter St Suite 114 M5B 1B2, geo, hours Mon–Fri 9–5:30 / Sat 9–5, phones, sameAs (Facebook, LinkedIn, Maps). **Phone 647-496-6362** (decision 3). Drop the `used-office-furniture-buyers` service; Service URLs unchanged |
| About Us | `AboutPage`, `BreadcrumbList` | as live |
| Contact Us | `ContactPage`, `BreadcrumbList` | as live |
| FAQs | `FAQPage`, `BreadcrumbList` | from the FAQs CMS list (only where the Q&As show on the page) |
| Blog, Case Studies | `CollectionPage` (+ `Blog`), `BreadcrumbList` | |
| Services template | `Service` + `WebPage`, `BreadcrumbList` | name, url, provider @id; single-line fields only |
| Service Areas template | `WebPage`, `BreadcrumbList` (+ `areaServed` City) | as live |
| Blog Posts template | `BlogPosting`, `BreadcrumbList` | fix live's `[[POST SUMMARY]]` / `[[MAIN IMAGE URL]]` placeholders |
| Case Studies template | `Article`, `BreadcrumbList` | |
| Privacy Policy, 404 | none | |

Rules that cost time before:
- Every item points at the one Organization by `@id`
  (`https://www.michaelsglobaltrading.com/#organization`).
- Webflow inserts CMS values into custom code raw: a line break or `"` in
  a bound field breaks the JSON, and an apostrophe comes out as `&#39;`
  (`wf:seo` fails on both). Bind single-line fields only, and check every
  CMS page after a schema change, not a sample.
- No `Review` or `AggregateRating` about the business itself; `FAQPage`
  only where the content really is a FAQ.

## Decisions (person, 2026-11-09)

1. **Service SEO copy:** live's titles and descriptions, trimmed to
   ≤60 / ≤160 characters, written to the 16 Services items' `seo-title` /
   `meta-description`.
2. **Home:** title "Commercial Liquidation Canada | Office Furniture & IT |
   MGT" (56); description "Commercial liquidation across Canada:
   Michaels Global Trading decommissions and liquidates office furniture,
   IT equipment and technology assets." (147).
3. **Phone: 647-496-6362** in the schema and on the site. The new build
   still shows 647-317-0860 in places, including the About Us and Contact
   Us meta descriptions and page copy: those change to 6362 (check
   every page and the footer when applying).
4. **Unmatched live pages:** build a **services hub at `/our-services`**
   (same URL as live, so no redirect; `/services` can't be a static page
   because the Services collection owns that slug). Redirects: `/offers`
   → `/contact-us`, `/auctions` and `/auctions/ingram-micro` →
   `/case-studies`, `/faq` → the FAQs page; `/thank-you` stays as a
   noindex page until the HubSpot form settings and GTM triggers are
   checked. Live's existing 301s still need the person's export.
5. **hreflang: port as live** — Home head code `en-ca` → `/` and `en-us`
   → `/service-areas/united-states`; the same pair on the US service-area
   page (as a static `<link>` pair in the template head with a condition,
   or the item's own code; live injects it with a script).
6. **Default share image:** the Home hero photo cropped to 1200×630, no
   text, uploaded as an asset and set on every static page without its
   own image.
7. **Production host: www** — `https://www.michaelsglobaltrading.com`;
   the apex keeps redirecting to it.

## Fix now / at launch

### Fix now (staging)

| # | Fix | How |
| --- | --- | --- |
| 1 | Home SEO title, description, OG "same as SEO" | API (after decision 2) |
| 2 | Contact Us OG "same as SEO" | API |
| 3 | Blog Posts template title: drop " \| Michaels Global Trading" | API |
| 4 | Services SEO fields (16 items) | API (after decision 1) |
| 5 | OG image bindings on the 4 templates | API (test one); Designer if refused |
| 6 | Switch off publishing for FAQs, Service Categories, Clients templates | Designer, MANUAL-TODO R + T |
| 7 | JSON-LD for every page and template (files in `docs/seo/schema/`) | API (after decision 4) |
| 8 | Privacy Policy page | build (new page session) |
| 9 | Alt text on the key images listed above | Designer / CMS fields |
| 10 | Favicon and webclip | Designer, MANUAL-TODO S |

### At launch

| # | Fix | How |
| --- | --- | --- |
| 1 | Site plan on the new site; custom domain | person |
| 2 | Publish blog posts (not the 5 future-dated), case studies as ready | API, person's OK |
| 3 | Global canonical = production host | Designer (MANUAL-TODO S) |
| 4 | GTM, illow, Ahrefs, og:site_name/locale in the head snippet; `RELEASE` set | API + `loader.html` |
| 5 | robots.txt allow all; sitemap on, `/design/*` excluded | Designer / API |
| 6 | Import `docs/seo/redirects.csv` merged with live's export; `pnpm wf:redirects test --live` | person + Claude checks |
| 7 | `pnpm wf:seo --live --canonical`; Rich Results Test per page type | Claude checks |
| 8 | Search Console: verify, submit sitemap, watch 404s for 2 weeks | person |

## Needed from the client

- [ ] The official name, address, phone, email and hours for the schema
      (live schema: 65 Shuter St Suite 114, Toronto; 647-496-6362).
- [ ] Social profile URLs (`sameAs`): live has Facebook and LinkedIn.
- [ ] The production domain, www or apex, for canonicals.
- [ ] Approval of the default share image and the drafted meta copy.
- [ ] Live's existing 301 redirects (Site settings › Publishing › export).
- [ ] Privacy Policy text (or approval to reuse live's).
