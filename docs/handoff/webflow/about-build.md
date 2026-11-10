# About Us — build notes (2026-11-09)

Page **About Us** `6af29af4b6d39bded3d833be`, slug `/about-us`, built in
G | Page W's slot like the other static pages (To Slot helper, WHTML
imports with `data-todo` placeholders from `tools/page-build/about-prep.py`,
then `gen.py` for images, Icon Size / Button Color instances and DOM
buttons; placeholders and the helper removed, none left). Published to
webflow.io with the person's OK and checked there.

- SEO title "About Us | Michaels Global Trading"; description written from
  the page copy (the live site's says "international trading firm", the
  preview site serves no meta): "Michaels Global Trading has helped Canadian
  businesses liquidate and decommission office furniture, electronics and
  equipment for over a decade. Call 647-317-0860." (The SEO session later set the site phone to 647-496-6362 in this description.) Open Graph copies both.
- Sections (ids): `#top` hero, Logo Strip › **Logo Marquee** instance (CMS
  Clients, replaces the prototype's single logo image), `#our-story`,
  `#values`, `#services`, `#why-choose`, then Locations and CTA Banner.
- **Why choose** uses Home's Why Split (HANDOFF decision 2026-11-09, every
  Why choose section): head column with the intro and the "not a moving
  company" note + 4 Check Chips; three reasons in the accordion (first open,
  Reason Panel › Is Open). `prototype/about-us/index.html` was changed the
  same way; the old Reason Card / Note Plate markup is kept in a
  `<template>` there so `pnpm style-guide` still finds those specimens.
- No new classes. Icon images use Icon Tile Img (24px), the six value icons
  Icon Tile Img › Is Medium (24px), so none lazy-loads at 0×0.
- New assets: service-liquidation / -ewaste / -appraisal / -donation.svg,
  factor-compliance.svg; factor-replies.svg is the existing price-timing.svg
  asset `6af237d1…` (same file, GOTCHAS 2026-11-09).
- Links: Get a Quote → /contact-us (prototype changed from `#`); Learn More →
  /services/office-furniture-liquidation, -decommissioning,
  /services/e-waste-recycling, /services/office-furniture-donation.
  **Certified Appraisal Services → `#`**: no appraisal service page exists.
- Staging check (compare.mjs at 1440 / 991 / 767 / 375, run from a scratch
  folder whose own `webflow-build.config.json` lists those widths): hero 0
  differences; other sections 2–4px from the 4px-grid rounding (icons 14→16,
  26→24, chip and tag padding), Locations tags 41→37px tall (shared
  component), logo strip 67 vs 80px tall (Logo Marquee vs the prototype's
  single image). 45 images load, accordion opens/closes, no console errors.
- Figma "2026 Compare" › 03 · About Us: staging frame `1877:1873` now holds
  tiles about-0 `1880:2` and about-1 `1880:3`, label updated.
- Checked against the Figma design frame `1877:1407` (copy of `1689:1573`,
  the person's link): all copy and every section match the build except Why
  choose, which Figma draws as a head row + 3 reason cards + note plate. The
  person chose to keep the split accordion (2026-11-09).
- 2026-11-09 (later): site phone changed to **647-496-6362** (SEO-PLAN ›
  Decisions 3). Both About phone buttons now show it and link to
  `tel:+16474966362` (link value `+16474966362`; `tel:…` as the value publishes
  broken, GOTCHAS 2026-11-09); the imported custom `href` attributes were
  removed. Published to webflow.io and checked. The prototype About page was changed the
  same way.
