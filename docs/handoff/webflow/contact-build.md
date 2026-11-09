# Contact Us — build notes (2026-11-09)

Page **Contact Us** `6af23a88945e5bef00bfac52`, slug `/contact-us`, SEO
title and description set. Built by a parallel session; not published.

## The form: the live site's HubSpot form, restyled

- Same HubSpot form as michaelsglobaltrading.com/contact-us: portal
  `44243593`, form `07684124-bff7-4657-8d8e-f485d95e757b`, region `na1`
  (legacy forms, embed v2). Submissions keep going to that form. No new
  HubSpot form was made, nothing changed in HubSpot.
- Fields match the prototype one to one (the prototype form was rebuilt
  from screenshots of this form): Name*, Company name, Business Email*,
  Phone number*, Project Location*, three radio questions, project
  textarea with hint, optional file upload, plus a hidden GCLID field and
  invisible reCAPTCHA (its inline badge shows under the file field, as on
  the live site). Option text comes from HubSpot ("IT & equipment" vs the
  prototype's "IT / equipment").
- Submit label: the Designer's button says "Request my office assessment"
  (prototype); HubSpot's own submit text is "Submit Project". Ask the
  person which they want; change the Button Color Label prop.
- How it works (`src/modules/hubspot-form.ts`, same file in
  `prototype/src/modules/`): HubSpot renders into a same-origin iframe; the
  module removes HubSpot's CSS, copies the page's stylesheets in and adds
  the site's classes (Form Stack, Form Field, Label, Form Hint, Form Input
  (+ Is Textarea), Radio Group / Legend / Field / Input / Label, Form File,
  Form Error, Form Input › Is Error). Details and pitfalls: GOTCHAS
  2026-11-09 "HubSpot's v2 embed always renders in an iframe".
- Repo CSS: `src/styles.css` §05, `repo-css: third-party` block that only
  undoes HubSpot's wrappers (`.input`, the radio `ul`/`li` → `display:
  contents`, legend padding, the `*` spacing). No Webflow variable names.

### Markup in Webflow (Contact Main)

```
div (no class)
  div.form-embed[data-hubspot-form][data-hubspot-portal][data-hubspot-region]   empty target
  div.form-submit-w  › div.button-row[data-hubspot-submit] › button.button[type=button] › Button Color instance
  div.form-success[data-hubspot-success][role=status]  › icon tile, D5 heading, text
```

First-load states are Designer classes, not script (asked by the person,
2026-11-09), so nothing flashes or jumps before the module runs:
Form Embed reserves the form's height (min-height 89em, 90.5em on
Mobile), Form Submit W is `display: none` (the module moves the button row
out of it into HubSpot's form), Form Success is `display: none` and the
module adds its **Is Shown** combo (`display: flex`) after a submission.
Checked with scripts off and on at 1440 / 820 / 390: submit and thank-you
take no space before the script, the section height changes by at most
1.3px when the form arrives, CLS 0. If HubSpot's form changes length, update
Form Embed's min-height. In the Designer, add Is Shown to the thank-you
block to see it while editing, then remove it.

## Design (2026-11-09, asked by the person: "make the form nicer", "more designy")

The form sits in **Form Card** (white, Border/Subtle, radius Card, soft navy
shadow, padding 2.5em / 1.25em on Mobile Landscape). **Form Card Head** above
the form (outside the iframe): Chip "Free assessment", D4 title, intro, three
Check Chips. Inside HubSpot's form:
- **Form Columns** (grid, columns at least 20em): short fields in pairs,
  the module gives the rest and the odd one out Form Field › Is Full.
- **Form Step** (+ › Is First, Form Step Text): numbered step headers 01 Your
  details / 02 Your project / 03 The details (Step Number Is Small Is Accent,
  D6, Body S). They live in Form Submit W with
  `data-hubspot-before="<HubSpot field name>"`; the module moves each in front
  of that field. Edit their text in the Designer.
- **Choice Group** / **Choice Legend** / **Choice** (+ › Is Checked): radio
  answers as tiles (two columns when there is room, at least 18em); hover
  and focus-within states in the Designer; the module adds Is Checked
  (Brand/Navy fill, white text). The tile's own radio ring/dot is repo CSS
  (`appearance`, `:checked`).
- **File Drop**: dashed upload area; its button is repo CSS
  (`::file-selector-button`).
- **Form Note › Is Start** (`data-hubspot-note`): Google's reCAPTCHA notice
  under the submit; the badge is hidden (repo CSS), which Google allows when
  the notice shows. Its links open in a new tab (set by the module).

**Media queries inside the iframe read the iframe's width** (~720px at
desktop), so classes used inside the form must not rely on breakpoint
styles: Form Columns and Choice Group size their columns intrinsically, and
the module copies the page's resolved body variables (Webflow redeclares
them per breakpoint) onto the iframe's body.

Reserved height (Form Embed min-height, a little under the form in each
range so no gap is left): 96em, 141.5em at Mobile Landscape, 142.5em at
Mobile. Tablet (768–991) and 992–1199 forms are taller than the reserve; the
growth is below the fold (CLS 0 measured at 1440 / 820 / 390). Re-measure if
the form changes (`heights.mjs`-style check: iframe height / body font size).

## New classes (Webflow and the prototype's contact page)

- Form Card, Form Card Head, Form Columns, Form Step (› Is First), Form
  Step Text, Choice Group, Choice Legend, Choice (› Is Checked), File Drop,
  Form Note › Is Start — see Design above.
- Form Error — error text: Status/Error, 0.75em, margin-top Spacing/4.
- Form Input › Is Error — Status/Error border.
- Form Success — thank-you card like Next Card (padding 1.75em, border
  Border/Subtle, radius Card, Background/Surface, gap 0.75em), hidden by
  default; › Is Shown displays it.
- Form Embed — the HubSpot target, min-height 89em (Mobile 90.5em).
- Form Submit W — hidden holder for the site's submit button.
- Icon Tile Img › Is Small (20px) and › Is Medium (22px) — the contact
  icons (an image without a size lazy-loads at 0×0, GOTCHAS 2026-11-06).

The prototype has these, and a copy of the repo CSS block, in a `<style>`
in `prototype/contact-us/index.html` (other sessions were editing the
shared CSS files). Move them to `src/css/new-classes.css` and
`src/css/repo.css`. The prototype's `src/main.ts` registers the module.
The style guide's Contact Form specimen is kept in a `<template>` on the
prototype page so `pnpm style-guide` still finds it; the style guide needs
a row for the new classes.

## Page sections (G | Page W slot)

Hero (`#top`, new asset contact-hero.webp `6af23ac28cca27cf9c576a1a`),
Contact (`#contact-form`), Locations (component instance), FAQs (`#faqs`).
Built like Home batch 11: G | Components + G | Page W with To Slot /
Locations / To Slot in the slot, WHTML imports with `data-todo`
placeholders, images by the builder, Icon Size (phone) and Button Color
(See all FAQs, Secondary; submit) instances, Faq Trigger DOM buttons;
placeholders and helper divs removed and checked (none left).

## Left to do

1. **FAQs list** — static six items for now. The FAQs collection
   (`6af23a559e6a408b624c5d08`) now holds the six Contact FAQs as drafts
   (`contact-q1`…`q6`, Order 1–6, Show on Contact on; q2–q6 answers are
   `[PLACEHOLDER] Answer to come.`). Swap the static list for a Collection
   List filtered on Show on Contact, sorted by Order: MANUAL-TODO F
   (Designer step, slot).
2. **Publish** (the person asks) → check on staging: the form renders with
   the site's classes, no console errors, the iframe height after errors,
   `pnpm wf:compare /contact-us` against the prototype at 1440 / 820 /
   667 / 390. The repo push (staging bundle) has to happen first, or
   staging has no hubspot-form module.
3. A test submission to HubSpot only if the person says so (it creates a
   contact in the client's HubSpot).
4. The submit label choice (above). Nav/footer "Contact Us" links can now
   point at this page.
5. MANUAL-TODO C (the Contact Form row of the style guide) is only about
   the style guide specimen; the page itself has no Webflow form.

## FAQ and reason panels: closed by default (2026-11-09, approved by the person: "Yes, fix FAQs")

Before, every FAQ answer showed open until `faq.ts` ran and closed it
(Contact FAQs 1425 → 1171px, Home 1957 → 1498px on staging). Now:
- Webflow: **Faq Panel** and **Reason Panel** are `display: none`; new combos
  **Faq Panel › Is Open** and **Reason Panel › Is Open** are `display: block`.
- `src/modules/faq.ts` (repo and prototype) toggles `is-open` with `hidden`;
  on close it removes it when the animation ends.
- A panel that starts open carries Is Open in the Designer and
  `aria-expanded="true"` on its trigger: Home's first reason (Overstock)
  and the style guide's reason specimen 01. In the Designer, add Is Open to
  a panel to edit its text, then remove it (unless it should start open).
- Prototype: the same in `src/css/new-classes.css`, `index.html` and the
  style guide page.
- Checked in the prototype with scripts off vs on: Home (reasons + FAQs),
  Contact, Toronto at 1440 and 390 are identical, and clicking opens and
  closes (with and without reduced motion).
- **Until the repo is pushed, staging's faq module never adds Is Open**, so
  a publish before the push would leave every FAQ unable to open. Push
  first, then publish.
