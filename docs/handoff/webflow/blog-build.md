# Blog build — Blog Categories, Blog Posts, /blog and the post template

2026-11-09, side session (started by the main build session). Site
`6aecfdb66cfe7667efc6d078` through `webflow-michaels-global-trading` only
(`list_sites`: one site). Live content read through the read-only
`webflow-michaels-global-trading-live` server (site `658c5919dffd45bc022c9153`).
Plan: `cms-plan.md` › 6.

**Items published 2026-11-09 (person's OK); site not published; nothing committed.** 249 posts imported 2026-11-09 as drafts (MANUAL-TODO L, see Import below).

## Design sources (the person, 2026-11-09)

- **/blog listing:** Figma "07 · Blog" › "Blog — 1440w" (1689:3390), with
  **Finsweet List** for the filter tabs and Load more.
- **Post template:** the live post layout
  (`michaelsglobaltrading.com/blog/office-furniture-liquidation-timeline`:
  hero with photo, back link, category, date, title, description → body →
  three related posts → CTA), "refined to the new system": the Case Hero
  (dark, photo background, breadcrumb Home / Blog), the case study's
  Article Layout with a sticky dark Aside Card (quote CTA), Keep reading
  (three Article Cards), CTA Banner component. No Figma frame for it.

## Collections

### Blog Categories `6af279595b24d1dab6ebc9ba` (slug `blog-category`)

| Field | Id | Type |
| --- | --- | --- |
| Name | `8f23b1aaf8e99d8c7c74e5b60e227a6e` | PlainText (help text: chip + filter tab label) |
| Slug | `dbb65c6dbf66e108adde3e937d15c953` | |
| Order | `58bf2fadb55f457ec7fa2bda8542d4dc` | Number |

Field group: **Listing** (Order), "Not on this page: …". Template page "Blog Categories
Template" `6af279595b24d1dab6ebc9e0` is empty; switch it off (MANUAL-TODO O).

Items (drafts, read back in the create response):

| Name | Slug | Order | Id |
| --- | --- | --- | --- |
| Office Liquidation | `office-liquidation` | 1 | `6af2798092b6eeac8e1ebb97` |
| Decommissioning | `decommissioning` | 2 | `6af2798092b6eeac8e1ebb99` |
| IT & E-Waste | `it-e-waste` | 3 | `6af2798092b6eeac8e1ebb9b` |
| Sustainability | `sustainability` | 4 | `6af2798092b6eeac8e1ebb9d` |
| Liquidation | `liquidation` | 5 | `6af2798092b6eeac8e1ebb9f` |

The first four are the Figma's filter tabs; **Liquidation** is the
catch-all chip the Figma cards also show (not a tab). The live site had six
other categories (Liquidation 180 posts, Office Liquidation 36, Business 14,
Electronics 10, Remote Working 4, Auction 1, none 6) and a Blog Tags
collection (8 tags); both are replaced: each post is mapped by its title
(`tools/blog/blog-csv.py › category()`, the six Figma posts by Figma):
Liquidation 123, Office Liquidation 57, IT & E-Waste 34, Sustainability 19,
Decommissioning 16.
**For the person to review** (editors can change any post's category).
Tags are not carried over. No live category or tag pages are in the live
sitemap, so nothing to redirect.

### Blog Posts `6af2795a34e29c9d0c9e180b` (slug `blog` → `/blog/<slug>`)

| Field | Id | Type | Group |
| --- | --- | --- | --- |
| Title (name) | `54cca4d021be8e5c1c375077de7506b0` | PlainText | — |
| Slug | `31894bfeef0484bb1c707a44a9d0948e` | | — |
| Category | `a17b6df9d825fd52b3587117d48327c1` | Reference → Blog Categories | Hero and card |
| Published Date | `73142cdaa87d8d18b0502f8bca7ff17c` | DateTime | Hero and card |
| Excerpt | `f160e4cc52e2fedd6110a8f2d8adca37` | PlainText | Hero and card |
| Thumbnail | `1c4a4667240224779d9bb18dba2360ab` | Image | Hero and card |
| Body | `ead1d40030a189bbdfa6d683120d6e3f` | RichText | Article |
| Featured | `cef618fa4a3ca472572de6ba7274648c` | Switch | Listing |
| SEO Title | `f792bad33268224cacf79decab70d32a` | PlainText | SEO |
| Meta Description | `7ab83e6ec826092c1c5ace5b5e45d7f1` | PlainText | SEO |

Every field has help text; groups in the person's order (SEO first, then
page order, off-page settings last): **SEO**, **Hero** (Category, Published
Date, Excerpt, Thumbnail), **Article** (Body), **Listing** (Featured, "Not
on this page: …"); read back with `get_collection_field_groups`. Excerpt is single-line plain text (the API
has no multi-line flag; the live descriptions are one paragraph).

## Content sources (the person, 2026-11-09)

Order per field: the preview site
(`mgt-office-liquidation-preview…chatgpt.site`), then Figma, then the live
site. **The preview has no blog** (its only blog link goes to the live
`/blog`; `/blog` there is a 404), so:
- **/blog page copy** (chip, H1, intro, tab names): Figma 1689:3392.
- **Six posts** have card copy in that Figma frame, so their **Title,
  Excerpt and Category** come from Figma (`FIGMA` in `blog-csv.py`):
  `tax-benefits-donating-office-furniture-canada` (Office Liquidation),
  `5-tips-to-optimize-your-product-sourcing` (Liquidation),
  `commercial-office-decommissioning-checklist` (Decommissioning),
  `office-furniture-disposal-costs-breakdown` (Office Liquidation),
  `office-furniture-liquidation-esg-sustainability` (Sustainability),
  `liquidation-auctions-canada` (Liquidation). Their Body, Thumbnail, SEO
  Title and Meta Description are live. **Exception (confirmed below):** their dates stay live; the Figma's card dates look like
  mock-ups (e.g. "5 Tips" is Oct 13, 2026 in Figma, 2018-02-04 on live).
- **Every other post and field:** the live site (read-only live MCP).
- **Decided by the person 2026-11-09 ("Keep live dates"):** the six Figma
  posts keep their live publish dates; only Title, Excerpt and Category come
  from Figma.
- Template static copy: "Have a space to clear?" card from the case study
  prototype; "See all blogs" from Figma (Home Blog section); "Keep reading
  / More from the blog." is new (no source has a related-posts heading).

## Content: 249 live posts → CSV (MANUAL-TODO L)

Live Blogs `65b96bae53fc6d4a10dbe28a`: 251 items (248 published, 3 drafts).
Left out: `imported-item-105` / `-108` (no title, body or image). Kept as
drafts like the rest: `office-furniture-disposal-canada-regulations`, a draft
on live. **All slugs are the live slugs** (no redirects needed for posts).

`tools/blog/blog-csv.py live-blogs.json out.csv out-map.json` writes the
import CSV and the slug → category map:
- Body: absolute `michaelsglobaltrading.com` links made site-relative
  (745), the one body `<h1>` dropped, `<strong>` removed inside headings,
  zero-width joiners and empty paragraphs removed, `loading="lazy"` on all
  246 body images (lessons/mcp.md: kept when written through the API; to
  check after the CSV import).
- Published Date: the live Blog Date; 14 posts had none → their live
  `createdOn` (2024-01/02, one 2024-06). **5 posts are dated in the
  future** (2026-11-16 … 12-28, scheduled on live): they sort first.
- Thumbnail: live CDN URL (re-hosted by the import). The live thumbnails
  are mostly ~2 MB PNG screenshots: worth converting to WebP later
  (`webflow-compress-cms-image` skill) for the listing's speed.
- SEO Title = Title, Meta Description = Excerpt (the live description was
  its meta description). Featured = on for
  `tax-benefits-donating-office-furniture-canada` only (the Figma's
  featured card).
- Internal links still point at live URLs that may change (`/services/*`
  471 links, `/blog/*` 132, `/faq` 3): the redirect map covers them.

Files (outside the repo, in the session group's shared notes folder):
`blog-posts-import.csv` (2.1 MB) and `blog-cat-map.json` (slug → category
item id). After the import: write `category` + `isDraft: true` per item
through the API (`update_collection_items`, ≤ 50 per call), then read back
counts per category, images on the CDN, a body with images.

## Import (2026-11-09, MANUAL-TODO L done)

Designer CMS › Blog Posts › Import in the person's Chrome, backup taken.
Result: 249 items, read back through the API:
- titles and excerpts identical to the CSV (0 mismatches), all 249 with a
  thumbnail on this site's CMS CDN, a body and a date; Featured on
  `tax-benefits-donating-office-furniture-canada` only;
- **Category** came through: the import matched the slug column to the
  categories (the preview said "does not exist", the result has all 249);
- items arrive staged; all set to `isDraft: true` through the API
  (`update_collection_items` with `fieldData: {}` works; the response
  echoes every full body, so it lands in a file);
- body images: 244 re-hosted; `loading="lazy"` was **dropped** by the
  import (all are `loading="auto"`) and 7 alts are `__wf_reserved_inherit`.
  Rich-text images publish eager, so long posts load all their images: a
  known issue (lessons/mcp.md 2026-10-29); fixing it means writing every
  body through the API again;
- removed two images broken on live too: an empty-`src` figure in
  `auction-vs-liquidation` (the import's "1 failed" item) and a 403 file in
  `online-auction`.

## Prototype

`prototype/blog/index.html` (listing) and
`prototype/blog/office-furniture-liquidation-timeline/index.html` (template,
one real post), generated by `prototype/scripts/gen-blog-pages.py` from
`prototype/blog/_data/posts.json` (the CSV rows, newest first) and
`images.json` (10 thumbnails in `prototype/images/blog/`, JPEG). The
prototype filters with the `filter-tabs` module; Webflow uses Finsweet.
Checked at 1440 and 375: no horizontal overflow, cards 397 × 549 (Figma
397 × 566), sticky aside, article h2/h3 27 / 24.75px on the 18px body.

New CSS (`new-classes.css` › Blog), created in Webflow 2026-11-09 and read
back in the create responses: **Segmented › Is Start**, **Featured Case ›
Is Photo First** (link reset; tablet column), **Featured Case Photo › Is
Wide** (38.75em; tablet 100%), **Article Card Body › Is Fill**, **Arrow Link
› Is End** (margin-top auto), **Article Aside › Is Sticky** (top = Layout ›
Calc › Nav Height + Spacing 48; tablet static), **Rich Body › Is Article**
(body-large size and line height, flex 1). Rich Body child styles h2 / h3 /
h4 / figure / img / figcaption: MANUAL-TODO M.
On the person's 4px grid (rule of 2026-11-09): Is Wide 38.75em = 620px,
Load More gap 0.5em, Rich Body h2/h3/h4 margins 1.5em / 0.5em / 1.25em;
the other values are variables. Later classes: Card List W (100%), Load More,
Load More Row (variables only).

## Webflow pages

Both built in G | Page W's slot (To Slot helper inserted with
`insert_in_slot`, unlinked, removed), WHTML import with `data-todo`
placeholders (`tools/blog/blog-prep.py`, adapted from `svc-prep.py`), then
images by the builder, Icon Size / Button Color instances with props.

### Blog Posts Template `6af2795a34e29c9d0c9e1811` (`/blog/<slug>`)

Sections: `#top` hero `f44a8679-…7021`, `#article` `bce5ae7f-…e275`,
`#related` `524e433a-…0a35`, then the CTA Banner instance.
- Bound (read back in the write results): Category › Name → chip, Published
  Date → caption, Title → H1, Excerpt → hero lead, Thumbnail → hero
  background (S Bg Media, `fetchpriority=high`, `loading=eager`,
  `data-parallax`, alt ""), Body → Rich Text (Rich Body › Is Article).
- Page SEO: title `{SEO Title} | Michaels Global Trading`, description
  Meta Description; Open Graph copies them. No OG image (needs the head-code
  token, lessons/mcp.md 2026-10-08).
- Aside: Aside Card › Is Dark with "Have a space to clear?", Get a Quote
  (Button Color, /contact-us), phone 647-317-0860.
- `#related`: one static Article Card in Card Grid `[data-todo=list-related]`
  waiting for the Designer-made list (MANUAL-TODO N).

### Blog `6af27b2d5e0d8a18863790b9` (`/blog`, static page)

Section `#articles` `3350c626-…0ce0` (head row, filters, featured, grid),
then the CTA Banner instance. SEO title "Blog | Michaels Global Trading".
- **Filters** (Finsweet List 2.7.1, fixed 2026-11-09 after the person flagged
  it; checked against the package source): DOM `form.segmented.is-start`
  `[fs-list-element=filters]` `b66f88b2-…48ef` › 5 × `label.segmented-tab`
  › `input.sr-only` `type=radio name=category fs-list-field=category
  fs-list-activeclass=is-active` + Tab Text. **All** is a radio with
  `value=""` + `fs-list-value=""` + `checked` (its label starts with Is
  Active); the others have `fs-list-value` = the category Name exactly
  (radios use the `equal` operator). The card chip (bound to Category ›
  Name) has `fs-list-field="category"` (re-added: the importer had dropped
  it). Earlier "All" was a `fs-list-element="clear"` button, which never
  toggles the active class.
- **Load more:** `fs-list-element="list"` + `fs-list-load="more"` on the main
  Collection List (Card Grid); Webflow pagination 9 per page; Finsweet
  fetches all pages, filters across them and uses the Next link ("Load more
  articles", hidden when all are shown).
- Featured card (Featured Case › Is Photo First) inside
  `[data-todo=list-featured]`; one Article Card in Card Grid
  `[data-todo=list-main]`; both wait for MANUAL-TODO N.
- Collection List writes: an API-built list here took `source` but refused
  `sort` ("[Conflict] … component map"), so it was removed; all three blog
  lists are Designer steps (N).

## Designer steps done 2026-11-09 (person's Chrome)

- **M** Rich Body child styles: nested h2 / h3 / h4 with Typography Styles
  modes H4 / H5 / H6 (27 / 24.75 / 20.25px on the 18px article body, as the
  prototype), margins through the API. Figures keep Webflow's defaults.
- **N** lists: featured (Blog page, `2edd4a4e-…76bd`: Featured is on, limit
  1), main (`7f5be249-…635f`: Published Date newest first, 9 per page,
  `fs-list-element=list` + `fs-list-load=more` on the Card Grid list),
  related (template `54000915-…7d94`: ≠ current post, newest first, limit
  3). Cards moved in and bound (Title, Excerpt, Published Date, Category ›
  Name, Thumbnail), links → Blog Posts › URL Path, dates MMM D, YYYY (hero
  too), wrappers **Card List W** (new class, width 100%). Pagination: Next
  has the new **Load More** class (navy pill, Button type, Navy Hover) and
  the label "Load more articles"; Previous hidden; row class **Load More
  Row** (centred, 48px above).
- **O** Blog Categories Template off (`shouldPublish: false`).
- The Designer shows the lists empty and the hero chip blank: every post and
  category is a draft.

## Staging check (2026-11-09, after the main session's site publish)

Headless Chromium on wf-mgt.webflow.io, 1440 and 390:
- **/blog:** fs-bundle.js loads, Finsweet fetches page 2; each tab shows
  only its category (Office Liquidation / Decommissioning / IT & E-Waste /
  Sustainability), the active tab follows, All resets; Load more 9 → 18;
  Previous hidden; featured card = Tax Benefits; cards link to
  `/blog/<slug>`; no overflow, no console errors.
- **Post page** (`office-furniture-liquidation-timeline`): hero chip, date,
  H1, lead, background image; title "… | Michaels Global Trading", meta
  description; body 18px, h2 27px, h3 24.75px; aside sticky (static at
  390); no overflow, no errors. **Keep reading** leaves out the current post
  (on the newest post it lists the next three).
- **Dates: fixed 2026-11-09 (person: "Yes, fix both").** All 249 Published
  Dates rewritten at `T12:00:00Z` on the same day (read back 249/249) and
  the 244 public posts republished; the 5 scheduled posts unpublished (now
  drafts, 404 on staging). Checked on staging: Tax Benefits Oct 19, timeline
  Oct 27 (as live); newest card Nov 6; Keep reading Nov 6 / Oct 19 / Oct 9.
  **Editors:** publish those 5 on their dates (Nov 16, Nov 27, Dec 7,
  Dec 17, Dec 28, 2026). Dates typed in the CMS editor are saved at
  midnight Toronto time, so they display correctly.
- Original finding:
  1. **One day early everywhere** (Tax Benefits shows Oct 18, live Oct 19).
     235 of the live dates are stored at `T00:00:00Z`; this site's time
     zone is America/Toronto, so Webflow formats them as the evening
     before. Fix: rewrite every Published Date at `T12:00:00Z` (lessons/mcp.md
     2026-10-07), 249 API updates; or set the site time zone to UTC (site
     settings; affects every date field on the site).
  2. **Five posts dated in the future lead every list** (nav Resources,
     /blog, Keep reading): `year-end-asset-recovery-when-q4-liquidation-makes-sense`
     (Dec 28), `liquidation-process-what-happens-to-your-old-electronics`
     (Dec 17), `used-office-furniture-sell-donate-liquidate` (Dec 7),
     `large-scale-warehouse-liquidation-lessons-in-canada` (Nov 27),
     `how-to-choose-liquidation-company-canada` (Nov 16). Not a mapping
     error: the live CMS has those dates, but these posts were **never
     published on live** (404 there; four created on live 2026-11-09), i.e.
     scheduled content. Options: set them back to draft here until their
     dates, or keep them.

## Cards fill their cells, link at the bottom (2026-11-09, person's request)

Measured on staging first: in CMS lists the card sat inside the Collection
Item, which stretched while the card didn't (22–51px short); on Home and
Toronto the cards filled their cells but the body didn't grow, so "Read
article" floated 29–63px above the bottom. Classes only, no repo CSS:
- **Article Card Body** (shared base): `flex: 1 1 auto` (read back).
- **Card Cell** (new): `display: grid`, columns `minmax(0, 1fr)`, rows
  `auto`, on the Collection Items of /blog (`7f5be249-…6361`), Keep reading
  (`54000915-…7d96`) and the Case Studies listing (`c3f156e3-…dee0`).
- **Arrow Link › Is Small › Is End** (new chain, `margin-top: auto`) on the
  card links of Home ×3, Service Areas Template ×3, Style Guide ×2, Case
  Studies ×1 (blog cards already had Is End).
- Prototype mirrors it (`new-classes.css` › Blog; `is-end` on 14 card links).
Checked on staging after the publish (headless, 1440 / 991 / 767 / 390, /blog,
a post, Home, Toronto, /case-studies): every card is as tall as the tallest
in its row (0px short), and "Read article" sits at the body's bottom padding
on every card (within 1px, rounding). Columns 3 / 2 / 1 / 1. /case-studies
has one published item, so row equality there is untested until more go live.

## What is left

1. **Items published 2026-11-09 (person's OK):** 5 categories and 249 posts
   (`publish_collection_items` 100 + 100 + 49, no errors; read back
   `isDraft: false`, `lastPublished` set). **Site publish:** the main
   session's call, with the person's OK. Then a staging check: `/blog` and
   `/blog/<slug>` both resolve (static page + collection on `blog`), the
   related list excludes the current post (the API can't read that filter),
   cards link to their posts, dates read "Oct 19, 2026", hero chip shows,
   no horizontal overflow at 390.
2. **Finsweet List in the repo: done 2026-11-09 (person's OK), commit
   19efbd3, pushed to master.** @finsweet/attributes 2.7.1 (List only) via
   the recipe, as a second bundle `dist/fs-bundle.js` (110 KB) that
   `src/modules/finsweet-loader.ts` adds only on pages with `fs-list-*`
   markup, from the same base and query as index.js. Runs on /blog now;
   /case-studies has no fs-list markup yet (its filter bar and load more are
   the case-studies session's follow-up), so it loads nothing there until
   that is wired. Checked headless on a two-page fixture with the Blog
   markup (needs a `window.Webflow.push` stub: List waits for webflow.js):
   filtering across both pages, active tab, All, load more; `pnpm check`
   and `pnpm test` pass. No loader.html change.
3. Rich-text images publish eager (`loading` dropped by the import): known
   performance issue on long posts.
4. Home / Toronto Resources and the nav's latest posts can become Blog Posts
   lists (cms-plan › 6; open decision 6). Redirect map for old internal
   links (`/faq`, removed services) in BUILD-NOTES.
5. Person to confirm: the category mapping by title (dates: decided, keep
   live).
