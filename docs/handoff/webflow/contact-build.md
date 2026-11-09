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
  div[data-hubspot-form][data-hubspot-portal][data-hubspot-region]   empty target
  div.button-row[data-hubspot-submit]  › button.button[type=button] › Button Color instance
  div.form-success[data-hubspot-success][role=status]  › icon tile, D5 heading, text
```

The module hides the submit row and the success block on load, moves the
button into HubSpot's form when it is ready, and shows the success block in
place of the form after a submission. The Designer canvas runs no scripts,
so it shows an empty target with the button and the thank-you block under
it; on the live page the success block can show for a moment before the
script runs (it is below the fold).

## New classes (Webflow and the prototype's contact page)

- Form Error — error text: Status/Error, 0.75em, margin-top Spacing/4.
- Form Input › Is Error — Status/Error border.
- Form Success — thank-you card like Next Card (padding 1.75em, border
  Border/Subtle, radius Card, Background/Surface, gap 0.75em).
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

1. **FAQs list** — static six items for now; becomes a Collection List on
   the FAQs collection (Show on Contact) once the other session has made
   it: MANUAL-TODO F (Designer step, slot).
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
