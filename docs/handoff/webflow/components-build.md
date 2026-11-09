# Global components build — nav, footer, page shell, shared sections

2026-11-06. First session to place elements on the site (`6aecfdb66cfe7667efc6d078`,
MCP server `webflow-michaels-global-trading`, the only site it reaches — checked
with `list_sites` before the first write). Built from the prototype partials
(`prototype/partials/nav.html`, `footer.html`, `contact-cta.html`,
`locations.html`) and the page shell in `prototype/index.html`.

No class, style or variable was created, renamed, updated or removed on
purpose; one empty 3-class chain was added by the importer (see "Styles
touched" below). Nothing was published. This file is the only repo file
written.

## What was built

| Component | Id | Group | What changed |
| --- | --- | --- | --- |
| G \| Page W | `280bc82e-29bf-4fe9-0e6c-feb86b116bc6` | Global | Unchanged. Already matches the prototype shell: Skip Link › G \| Nav W instance › G \| Main W › `main#main.g-main` (slot "G \| Main") › G \| Footer W instance. |
| G \| Nav W | `cc921405-959e-6ca1-e789-02a1926ec57c` | Global | Rebuilt from the starter's "Site name" link to the full 2026 nav (447 elements). |
| G \| Footer W | `c8f1e8c7-5ba2-20b4-2d63-cbdc78216831` | Global | Rebuilt from the starter's "© Site name" to the full footer. |
| Locations | `77b131aa-ebb5-1e05-71b3-bc510d89a3bf` | Sections | New. `section.section.is-compact.is-ruled#locations`. |
| CTA Banner | `c8575dea-1939-c91e-553c-c92559aeaf24` | Sections | New. `section.section#contact-cta` with the photo banner. |
| To Slot | `f42a088e-6c32-02d9-73d5-db3f8ba436fa` | Global | New build helper (a plain `div.to-slot`, dashed outline). Not content. |

Where they are placed:

- **Home** (`6aecfdb66cfe7667efc6d073`): G \| Components, then G \| Page W
  (so Nav and Footer). Its main slot holds, in order: an unlinked To Slot
  div (`3344f3b2-5cef-fc21-1574-1416bd358bab`), Locations, CTA Banner —
  the last two sections of the prototype's Home. Build the other Home
  sections `before` the To Slot div (the API can only build next to a
  plain element in a slot; lessons/mcp.md "Slots: the MCP can work beside a
  plain element"), then remove the div.
- **Style guide** (`6aecfdb66cfe7667efc6d075`): **no element was placed or
  edited on this page** by this session (it belongs to batch 10). Its body
  already held a G \| Page W instance (`720531f9-f798-28d5-bd2a-878178c447d1`)
  from the starter, so it shows the new Nav and Footer through that shell;
  the same goes for 404 and Media. Nothing to fold in.

### G | Nav W, structure

Matches `partials/nav.html` element for element (checked by script: an
outline of the full read-back against the partial, 447 lines, no
differences apart from those listed under "Differences"):

- `div.g-nav-w[data-nav=true]`
  - `div.nav-overlay[data-nav-overlay][aria-hidden]`, `div.nav-bg[aria-hidden]`
  - `nav.g-nav[aria-label=Main]`
    - `a.nav-brand` (aria-label) › 2 × `img.nav-logo` (white; navy with
      Is Dark), `loading=eager`, `data-nav-logo=true`
    - `div#nav-menu.nav-menu[data-nav-menu]` › `.nav-links` (Home link,
      3 × `button.nav-link[data-nav-drop-toggle=services|areas|resources]`
      with `.nav-caret[data-nav-caret]`, About Us, Contact Us) and
      `.nav-actions` (Button Is Bar Phone with Icon Circle Is Button and
      Nav Phone Text; Get a Quote with Button Color Is Light)
    - `button.nav-toggle[aria-expanded=false][aria-controls=nav-menu][data-nav-toggle]`
      › Sr Only "Menu" + list icon
  - `div.nav-mega-panel[data-nav-panel]` › 3 × `div.nav-mega-view`
    (`#nav-mega-services|areas|resources`, `data-nav-view`), each with
    `button.nav-mega-back[data-nav-back]` and Nav Mega W › Nav Mega:
    - Services: 4 Nav Mega Col (head link + 5/4/4/4 drop links), Nav Mega
      Cta (D5, text, phone button and Get a Quote)
    - Service Areas: Nav Mega Grid Is Split › Nav Mega Links Is Two Col
      (10 areas) + Nav Mega Card (photo, 3 stats; opens in a new tab)
    - Resources: Nav Mega Grid Is Resources › Nav Mega Links (Blog,
      Case Studies Is Disabled with "Soon" badge, FAQs) + Nav Posts (2 posts)
- All 7 `<button>`s are real DOM buttons with `type=button` (the importer
  turns buttons into links, so they were rebuilt with the element builder).
- All 56 icons are `<i class="icon-glyph ph ph-…">` with Icon Glyph as the
  style and the Phosphor classes as a custom `class` attribute.

### G | Footer W, structure

Matches `partials/footer.html`: `div.g-footer-w#contact` ›
`footer.g-footer[data-footer-parallax=true]` › `div.s-wrapper` (the
starter's Is Wide combo was removed from this element) › Footer Cta (D2
heading with the line break, Get a Quote, text), Divider, Footer Bottom
(Footer Info › Footer Nav 6 links + Footer Contacts 4 items; Footer Brand ›
logo, Divider, Footer Social 3 buttons, Divider, Footer Legal 2 lines with
`span[data-year]`).

## Differences from the prototype, and why

1. **Classes that didn't exist in Webflow at build time** (all applied since;
   see "Missing classes"):
   - two global classes on one element need a combo that doesn't exist, so
     only the first class is applied (or the more visible one);
   - the typography text-style classes Stat, Caption, Button Text, Link
     Text are not in Webflow at all, so those elements have no class.
2. **Static nav lists instead of CMS lists.** The prototype's mega views
   copy mgt-live's Collection Lists (`w-dyn-list` / `w-dyn-item`). There is
   no Sub-Services / Service Areas / Blog collection on this site, and a
   component can't hold a live CMS binding, so the items are plain divs
   with the same classes (Nav Mega Links › Nav Drop Item › Nav Drop Link;
   Nav Posts › Nav Post). The `w-dyn-list` wrapper divs are gone, so Nav
   Mega Links / Nav Posts are direct children of their grid or column, and
   Webflow's `role=list|listitem` aren't there. `nav.ts` only reads
   `data-*` hooks, so it is unaffected. If these become CMS lists later they
   have to be rebuilt outside the component (lessons/mcp.md "A section
   containing a Collection List can't become a component").
3. **Image attributes:** `width`/`height` can't be set through the API
   (the footer logo had 256×55 in the prototype); Webflow takes them from the
   asset. Decorative images were built with an empty alt; check the
   published `alt=""`.
4. **`data-parallax` / `data-footer-parallax` carry the value `true`**
   instead of no value (Webflow drops empty attributes). Both modules parse
   the value as a number and fall back to their default, so behaviour is
   the same.
5. **Links:** paths that have no Webflow page yet (`/about-us`,
   `/contact-us`, `/faqs`, `/our-services`, `/services/…`, `/service-areas/…`,
   `/blog…`, `/location-toronto`) are URL links with the prototype's path
   and will 404 until those pages exist; switch them to page links then.
   Links that are `#` in the prototype stay `#` (they keep a custom
   `href="#"` attribute, which is their only href). The importer's duplicate
   custom `href` attribute was removed from every other link.
6. **Phone numbers as in the prototype:** the nav (bar and mega CTA) uses
   647-496-6362, the footer and CTA Banner 647-317-0860 (open question
   in the requests list).

## Missing classes (for the class session)

Updated 2026-11-06 after the class session created Stat, Body XS, Button
Text, Link Text, Tab Text and Caption (not re-created here). Applied with
`set_style` and read back:

- Stat on the 3 nav stats (`84a2d4b5-9e42-cfd9-386c-c5dc15bdc435`, `…c43a`, `…c43f`)
- Caption on the 2 footer legal lines (`7a23da4c-3e35-8880-988e-128fb203e472`, `…e474`)
- Button Text on the CTA Banner's "Or call …" (`c8575dea-1939-c91e-553c-c92559aeaf42`)
- Link Text on the 10 Locations tag labels (`77b131aa-ebb5-1e05-71b3-bc510d89a3c9` … `…a3ff`)
- Button Size + Is Icon Lead + Is Icon Only on the nav bar phone (`1fccf209-0f2d-a462-03b0-ca085e614ed2`)

**Two-class combos: done.** The class session created the five combos
(empty on purpose: the published element carries both classes, so the global
Text Secondary, Footer Cta Text and Footer Label rules apply). Applied with
`set_style` using both names and read back, 15 elements:

| Combo | Elements |
| --- | --- |
| Caption + Text Secondary | G \| Nav W: `84a2d4b5-9e42-cfd9-386c-c5dc15bdc437`, `…c43c`, `…c441` (stat captions); `ff2e9763-0cad-f9fc-d1ca-f5a9434cf559`, `…cf565` (post dates) |
| Body S + Text Secondary | G \| Nav W: `e32a5056-dc5f-7e08-9dde-c9254e6ea1c7`; Locations: `77b131aa-ebb5-1e05-71b3-bc510d89a3c5` |
| Label Text + Text Secondary | G \| Nav W: `e32a5056-dc5f-7e08-9dde-c9254e6ea10f`, `84a2d4b5-9e42-cfd9-386c-c5dc15bdc3b9`, `ff2e9763-0cad-f9fc-d1ca-f5a9434cf529` |
| Body L + Footer Cta Text | G \| Footer W: `a82547f3-6f7c-f290-8429-0386c3f7bc81` |
| Label Text + Footer Label | G \| Footer W: `7a23da4c-3e35-8880-988e-128fb203e442`, `…e447`, `…e44c`, `…e457` |

No class from the prototype is missing from these components any more.

**Check after the next publish (not done: this session doesn't publish):**
on staging, the footer CTA text should be 34.125em wide (max 100%) at 0.92
opacity, and the four footer contact labels at 0.62 opacity; the Text
Secondary colour should show on the nav mega labels, stat captions, post
dates, mega CTA text and the Locations text.

## Styles touched

- The WHTML importer created one empty combo entry for the Locations section's
  three classes: `is-ruled`, selector `.section.is-compact.is-ruled`, id
  `7ef12414-fd30-9217-39ed-5defc99ca827`, no properties. This is how
  Webflow stores a 3-class element (lessons/mcp.md "WHTML importer: classes,
  forms, images and limits"); the published element still gets
  `.section.is-ruled` and `.section.is-compact` from the existing combos.
  Check the published CSS for a bare `.is-ruled {}` (harmless while empty).
- No other style was created; the element builder's `set_style` used only
  existing classes and chains.

## Assets uploaded (from `prototype/images/`)

All uploaded through the assets API (create + S3 POST, 201) and read back.
They show size 0 and no variants for now (lessons/mcp.md "API-uploaded assets
stay size 0"): check on the canvas that the images render, and check the
published `srcset` on the photos.

| File | Asset id | Used in |
| --- | --- | --- |
| logos/mgt-logo-white.svg | `6aed474acc68a3a9865ac99f` | Nav Logo |
| nav/mgt-logo-navy.svg | `6aed474acc68a3a9865ac9b3` | Nav Logo Is Dark |
| nav/nav-locations.jpg | `6aed474a5aa41c41687394a9` | Nav Mega Image |
| nav/post-1.jpg | `6aed474bda07b44daa547acf` | Nav Post Image 1 |
| nav/post-2.jpg | `6aed474b7b314c812e49f624` | Nav Post Image 2 |
| logos/mgt-logo-footer.svg | `6aed474b66548f3650113fa1` | Footer Logo Img |
| home/cta-team.webp | `6aed474b6de6f67468f17229` | Cta Banner Img |

No placeholder assets: every image the components need existed locally.
The nav post images and texts are static copies of two mgt-live blog posts
(stand-in content until there is a blog).

## Manual Designer steps (not added to MANUAL-TODO.md; the other session owns it)

Proposed rows, next free letters after A:

- **B · G \| Nav W, G \| Footer W, Locations, CTA Banner: check on the canvas
  that the 7 API-uploaded images render** (and replace in the Assets panel
  if one shows blank). Why: API uploads stay size 0 without variants.
- **C · Before publishing: look at the nav on the canvas.** The mega panel,
  views and mobile menu are positioned and hidden by repo CSS / `nav.ts`
  (batch 9), so on the canvas the panel may show open or stacked under the
  bar until the repo port lands. Not a Designer fix; a check that nobody
  "fixes" it in the Designer.

Nothing else needed the Designer: buttons, attributes, ids, images, links
and the new-tab link were all set through the API and read back.

## Gotchas met (for GOTCHAS.md, to be added by the session that owns it)

- `remove_attribute` hit "MPS returned 410: Gone" (BATCH_FAILED) on 9 of 26
  actions in one call, with the rest succeeding; the same 9 succeeded on a
  retry. Read back after every batch. (template-candidate)
- Removing the importer's custom `href` attribute keeps the link setting
  (tested first), but links imported with `href="#"` have no link setting:
  the custom attribute is their only href, so keep it. (template-candidate)
- Python's `html.parser` lowercases `viewBox` to `viewbox`; restore it
  before importing inline SVG. (template-candidate)

## How it was checked

- After each import: full read-back of the component tree, converted to an
  outline (tag, classes, attributes, text) and diffed against the same
  outline of the prototype partial, after the class fallbacks above. Nav:
  no differences except the dropped CMS roles. Footer, Locations and CTA
  Banner: read back in full and compared by hand.
- `query_elements` after the cleanup: 0 nav links with a custom `href`; the
  footer's 7, Locations' 9 and CTA Banner's 1 remaining are all `#`; 56
  of 56 nav icons carry `icon-glyph ph …` and none still has `data-ph`.
- Not checked: the canvas or a published page (nothing published; element
  snapshots are unreliable per the lessons). Visual parity waits for the
  repo port (batch 9) and a staging publish.
