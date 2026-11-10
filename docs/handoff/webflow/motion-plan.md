# Interaction motion plan

2026-11-09 · **Built: every item except 22** (yellow highlight), chosen by the person; headings use 11. Not yet published or committed: see Build status at the end. Round 2 the same day: scroll entrances 10–16 replace the section-fade tune. Round 3: image reveals fixed to work with the parallax; extras 17–24 added. Nothing is built
in Webflow or the repo yet.

Live preview: `prototype/design/motion/` (http://127.0.0.1:5608/design/motion).
Every proposal has its own block with the real components and a
Current / Proposed switch; the top bar flips all of them and simulates
"reduce motion". The proposed CSS is `prototype/design/motion/motion.css`
(scoped to `.mo-on`), the JS parts are `motion.ts`.

## Rules for every item

- Interactions (1–9): 150–250ms, 500ms only for a photo zoom; travel
  0.125em–0.5em. Scroll entrances (10–16): 0.8–1.4s, 2em travel, staggers
  of 0.1s, once per element. No bounce, no loop, no hidden text on load.
- One curve for movement: **ease-out-quint**, `cubic-bezier(0.23, 1, 0.32, 1)`
  (Webflow transition easing "Ease Out Quint"). Colour fades keep `ease`.
- Only `transform` / `scale` / `opacity` / colours move. No height or
  padding transitions added (the FAQ panel's existing height animation
  stays).
- Hover effects only under `@media (hover: hover) and (pointer: fine)` when
  they live in repo CSS; Designer hover states are already mouse-only in
  practice (touch gets the Active state).
- Reduced motion: no movement; colour fades stay (they are not motion).
  Repo rules go in the §07 `prefers-reduced-motion` block; JS checks
  `matchMedia('(prefers-reduced-motion: reduce)')`.
- Designer first (AGENTS.md CSS policy). Repo CSS only for "on parent hover,
  move a child" and JS states, each tagged.

## Survey: what already moves

| Where | Today | Verdict |
| --- | --- | --- |
| Section fade-up (`scroll-fx.ts`) | Every `.s-wrapper` below the first screen rises 3em, scrubbed from `top 92%` to `top 55%` | Barely noticed (the person, 2026-11-09), yet text sits half-faded until mid-screen. Replaced by the scroll entrances 10–16. |
| Footer parallax, image parallax, logo marquee | Scrubbed / linear | Keep. Calm, and already off under reduced motion. |
| Count-up, carousel dim, compare nudge | 1.6s count, 300ms dim | Keep. |
| FAQ / reason panel | Height + opacity 300ms (`faq.ts`) | Keep; the icon beside it snaps (item 5). |
| Mega menu | Height 300ms `ease`, views slide 2.5em | Fine; item 9 is a small tune. |
| Buttons, Phone Button, Tag, nav links | Background colour 200ms; press = darker inset shadow | Keep; item 3 adds a press scale. |
| Service rows, article cards, arrow links, FAQ triggers, footer links | **No hover state at all**, only Active opacity .8 | Items 1, 2, 4, 5. |
| Custom select list, tab panels, form focus ring | Switch in one frame | Items 6, 7, 8. |
| Template utilities in `src/styles.css` §05 (`.image-w` zoom 1.12, `.link-underline`, `.button-link` at 800ms) | Not used on any page | Don't adopt: 800ms and a 12% zoom are too slow and too big. Leave unused. |

## Proposals

Ordered by how much they help. "Webflow" = Designer class/state through the
MCP; "repo" = `src/styles.css` or a module, then `pnpm build`.

### 1 · Service rows: hover

- **What moves:** the row background tints, the arrow circle fills navy
  with a white caret, the caret nudges forward (item 2).
- **Why:** 64 rows on Home alone are links with no hover sign.
- **Values:** background-color 200ms ease; arrow circle background /
  border / colour 200ms ease.
- **Where:** Webflow: Service Row `transition: background-color 200ms ease`
  and Hover › background Colors Semantic › Background/Tint; Service Row
  Arrow `transition` on background-color, border-color, color.
  Repo (`designer-cant`, a child styled on the parent's hover):
  `.service-row:hover .service-row-arrow` navy fill. It reads
  `--_colors---brand--navy` / `--_colors---base--white`, already on the
  approved watch list (GOTCHAS 2026-11-06), so no new variable names.
- **Markup:** none.
- **Reduced motion:** unchanged (colour only).

### 2 · Arrows nudge forward on hover

- **What moves:** the caret inside Button (Button Icon), Arrow Link's Icon
  Circle, a card's arrow when the card is hovered, Service Row Arrow.
- **Why:** one consistent "this goes somewhere" cue.
- **Values:** `transform: translateX(0.125em)` 200ms ease-out-quint, eases
  back the same way.
- **Where:** repo `designer-cant` (parent hover → child), one rule list
  in §05 with the transition on the child so it also eases back.
- **Markup:** none.
- **Reduced motion:** no nudge.

### 3 · Buttons: press

- **What moves:** Button Color and Phone Button settle to 98% while held.
- **Why:** feedback on touch, where hover doesn't exist; today a press only
  darkens.
- **Values:** Active `transform: scale(0.98)`; transition transform 150ms
  ease-out-quint (background-color stays 200ms ease).
- **Where:** Webflow: Button Color and Phone Button › Active state
  transform, and add transform to each class's transition. Icon Button Box
  the same if wanted.
- **Markup:** none.
- **Reduced motion:** repo §07 adds `transform: none` on
  `.button-color:active, .phone-button:active` (`designer-cant`: media
  query on a state).

### 4 · Article cards: hover

- **What moves:** card border darkens; the photo zooms 4%; arrow nudges
  (item 2).
- **Why:** the whole card is a link with no hover state (Home Resources,
  Blog, Blog Post related).
- **Values:** border-color 200ms ease; image `scale` 1 → 1.04 over 500ms
  ease-out-quint. The CSS `scale` property, not `transform`, so it adds to
  the parallax module's transform on the same image instead of replacing
  it.
- **Where:** Webflow: Article Card transition border-color and Hover ›
  border Border/Active. Repo `designer-cant`:
  `.article-card:hover .article-card-img { scale: 1.04 }` plus its
  transition (the style API has no `scale` property and it's a parent
  hover).
- **Markup:** none.
- **Reduced motion:** no zoom (the parallax is already off).

### 5 · Accordions: plus to minus

- **What moves:** the FAQ / reason icon's vertical bar turns flat as it
  fades (it disappears today); the circle's navy and the reason tile's
  yellow fade in with the panel; a light tint on the circle when a closed
  question is hovered.
- **Why:** the panel animates over 300ms but its icon snaps in one frame.
- **Values:** bar `rotate(90deg)` + opacity 250ms (rotate ease-out-quint);
  circle background / colour 250ms ease; hover tint
  `color-mix(in srgb, currentColor 10%, transparent)` 150ms (no variable
  name).
- **Where:** repo, in the existing §05 js-state block for
  `[aria-expanded="true"] .faq-icon-bar` (tag `js-state`; the SVG path
  needs `transform-box: fill-box`, which the Designer can't set on a path).
  Faq Icon / Icon Tile transitions could be Designer, but they only serve
  this state, so they sit with it.
- **Markup:** none.
- **Reduced motion:** bar fades without turning; colours still fade.

### 6 · Service tabs: panel switch

- **What moves:** the new panel fades in and rises 0.5em; the tab icon's
  navy fill eases.
- **Why:** the panel swaps in one frame, which reads as a page jump.
- **Values:** panel opacity 0 → 1, translateY(0.5em) → 0, 220ms
  ease-out-quint, on a click only (never on load, so no first-paint
  change). Tab icon background / colour 200ms ease.
- **Where:** repo `src/modules/tabs.ts`: in `select()` when called from a
  click, `panel.animate(...)` (WAAPI, cancelled if another tab is clicked
  first). Webflow: Services Tab Icon transition on background-color and
  color.
- **Markup:** none.
- **Reduced motion:** fade only, no rise.

### 7 · Dropdown (custom select): open and close

- **What moves:** Select List fades in from just under the pill and grows
  from its top edge; it closes with a quicker fade; the chevron turns over.
- **Why:** the list appears from nowhere; the chevron doesn't say it's
  open.
- **Values:** open opacity 0 → 1, `translateY(-0.25em) scale(0.98)` →
  none, 150ms ease-out-quint, `transform-origin: top left`; close 100ms
  ease; chevron `rotate(180deg)` 200ms ease-out-quint.
- **Where:** repo `designer-cant`: `@starting-style` and
  `transition-behavior: allow-discrete` on `display` (Select List › Is Open
  keeps its Designer `display: flex`). Chevron: `js-state`,
  `.is-open .select-icon .icon` (Filter Pill and Select W get Is Open from
  the module). Browsers without `@starting-style` simply open instantly,
  as today.
- **Markup:** none.
- **Reduced motion:** fade only; the chevron flips without turning.

### 8 · Form fields: focus and error

- **What moves:** the border colour and the 3px Form/Focus Ring fade in;
  an empty required field's red border (Is Error) fades in the same way.
- **Why:** the ring is thick; snapping on reads harsh. No shake.
- **Values:** border-color and outline-color 150ms ease.
- **Where:** Webflow: Form Input base gets `outline: 3px solid
  transparent`, offset 0, and the transition; the Focus / Focus Visible
  states keep only the ring colour. Check after: the §07
  `:focus:not(:focus-visible) { outline: none }` rule still applies to
  non-text controls.
- **Markup:** none.
- **Reduced motion:** unchanged (colour only).

### 9 · Mega menu: tune the open

- **What moves:** nothing new. The panel height and the menu-to-menu slide
  get the ease-out curve and a slightly shorter time; the slide distance
  drops from 2.5em to 1.5em.
- **Values:** Nav Mega Panel height 300ms ease → 250ms ease-out-quint (and
  its Is Open); Nav Mega View opacity/transform 300ms → 250ms, transform
  ease-out-quint, offset 2.5em → 1.5em (and Is Before −1.5em). Below 992px
  the views keep sliding the full width.
- **Where:** Webflow, all on existing classes and combos.
- **Markup:** none.
- **Reduced motion:** unchanged; the nav module already sets the duration
  to 0 under reduced motion for the whole-menu open.

### Scroll entrances (10–16)

Added 2026-11-09 after the person's feedback: "section fade is not that
noticeable, we need more … like for steps we can have stagger fade in".
These **replace** the scrubbed fade of whole sections in `scroll-fx.ts`
(its section part is removed; the footer parallax stays). One new repo
module, `src/modules/reveal.ts` (prototype draft:
`prototype/design/motion/reveal.ts`), GSAP + ScrollTrigger + SplitText
(all in the bundled gsap 3.15).

How it plays: each marked element plays **once**, when its top reaches 85%
of the screen; 0.8–1.4s, `quint.out` (ease-out-quint). Entrances run longer
than the hover effects because they introduce content, not answer a click.
Nothing is hidden in CSS: the start state is set by the script, only for
elements below the first screen, so the first paint never changes and
visitors without JS see everything. Reduced motion: the module does
nothing.

Markup: one `data-reveal` attribute per element (the person allowed small
markup changes). Two ways to place them, for the person to choose:
(a) attributes in Webflow on each class instance (explicit; ~6–10 per page,
some inside the page shell's slot where `set_attributes` has failed before,
GOTCHAS 2026-11-06), or (b) the module applies the same defaults by class
(Head Center / Head Row / Why Split Head → group, Step Grid, Card Grid,
Faq Grid, Reason List, Stat Tiles → group, Overview Media / Services Intro
Media / Featured Case Photo → image, CTA Banner → expand), with
`data-reveal="off"` to opt out. (b) needs no Webflow writes and covers CMS
lists and components automatically; scroll-fx already targets
`.s-wrapper` by class on purpose (HANDOFF Decisions 2026-11-05).
Recommendation: (b).

| # | What | Values | Markup |
| --- | --- | --- | --- |
| 10 | **Section headings**: chip, heading, text and buttons fade up in turn | each child opacity 0 → 1, translateY(2em) → 0, 0.8s, 0.1s apart | `data-reveal="group"` on the heading block |
| 11 | **Heading lines** (alternative to 10 for H2s): each line slides up from behind its own edge, then the rest follows | SplitText lines with a mask, yPercent 100 → 0, 0.9s, 0.08s between lines | `data-reveal-lines` on the H2 inside the group. Pick 10 or 11. |
| 12 | **Steps**: the four cards rise in order and the line after each number draws toward the next | cards as 10; Step Line scaleX 0 → 1 from the left, 0.8s ease-in-out, 0.25s after its card | `data-reveal="group"` on Step Grid, `data-reveal-draw` on Step Line |
| 13 | **Card grids and lists**: article / case cards, FAQ and reason items one after another | as 10 | `data-reveal="group"` on Card Grid, Faq Grid, Reason List |
| 14 | **Feature photos** open from the bottom while the photo settles; stat tiles follow | clip-path inset(100% 0 0 0) → inset(0) with the frame's radius, 1.2s; image `scale` 1.12 → 1, 1.4s; Stat Tiles group delay 0.5s | `data-reveal="image"` on the frame (About, service intros, featured case), not thumbnails |
| 15 | **CTA banner** opens out from slightly inset, photo settles, then copy and buttons | clip-path inset(6% 4%) → inset(0), 1.2s; copy / actions groups at 0.3s / 0.5s | `data-reveal="expand"` on CTA Banner |
| 16 | **Hero photo** settles on load (text not animated: it's the LCP and must show at once) | `scale` 1.08 → 1, 1.8s from boot; nothing hidden | `data-reveal="settle"` on the hero S Bg Media |

**Works with the parallax (fixed in round 3).** The first preview tweened
GSAP's `scale`, which GSAP writes into `transform`; `parallax.ts` writes
the same image's `transform` every scroll frame, so the two overwrote each
other and the photo jittered (seen by the person on 14 and 16). The zoom now
runs on the separate CSS `scale` property through a variable
(`img.style.scale = var(--reveal-scale)`, GSAP tweens `--reveal-scale`), so
the browser applies parallax translate × reveal zoom together. Checked in
the preview: mid-reveal the image has both `transform: translate3d(…)
scale(1.09)` (parallax) and `scale: 1.06` (reveal). Rule for the build:
**nothing but parallax.ts writes `transform` on a `[data-parallax]` image.**

### More (17–24)

Added 2026-11-09 (round 3, "show me some more").

| # | What | Values | Where |
| --- | --- | --- | --- |
| 17 | **Stat tiles count up** (About block 105+ / 2k+ / 13+), like the case study stats | existing count-up: linear 1.6s, once in view | markup: `data-count` on each Stat Tile Number (Webflow attribute) |
| 18 | **Tab rows follow the panel** (builds on 6): after the panel fades in, its service rows come in 40ms apart | rows opacity 0 → 1, translateY(0.5em) → 0, 300ms ease-out-quint, from 80ms | `tabs.ts` (WAAPI), on click only |
| 19 | **Accordion answers rise in** (builds on 5): the answer text fades up while its panel opens | opacity 0 → 1, translateY(0.5em) → 0, 300ms, 60ms after the panel starts | `faq.ts` (WAAPI) |
| 20 | **Check chips and tags**: quick stagger after the text above | group with rise 0.75em, stagger 0.05s, delay 0.35s | `data-reveal="group"` + `data-reveal-rise` / `-stagger` on Check Chips (or by class) |
| 21 | **Text links: underline draws on hover** (Footer Link, More Link; they have no hover state today) | 1px `::after` scaleX 0 → 1 from the left, leaves to the right, 250ms ease-out-quint, mouse only | repo `designer-cant` (pseudo-element), no variable names (currentColor) |
| 22 | **Yellow highlight** under one key phrase in a few headings (hero, CTA, chosen section titles) | Text Mark span: yellow gradient 0.2em at the bottom; `data-reveal="mark"` draws it, background-size 0% → 100%, 1s ease-in-out, 0.4s after the heading | new Webflow class **Text Mark** (background is Designer-expressible) + a span in the heading text; no-JS shows the full underline |
| 23 | **Blog posts: reading progress** bar under the nav | 3px Brand/Yellow, `transform: scaleX(progress)` from the article body, no transition; fades in/out 200ms | new element in the Blog Posts Template + small module `reading-progress.ts`; stays under reduced motion (it's information) |
| 24 | **Forms: sending state** so nobody clicks twice | label crossfades to "Sending…" + spinner (0.8s linear, slower under reduced motion), 150ms; button keeps its width | `hubspot-form.ts` sets **Is Sending** (Designer combo) on the submit between click and HubSpot's answer |

## Considered and left out

- **CTA banner photo zoom on hover:** a large area that isn't one link;
  decoration.
- **Image wipes and staggers everywhere:** now proposed (10–16), but only
  for headings, grids and the big photos; not thumbnails, logos, body
  paragraphs or anything in the nav.
- **Nav link underline sweeps:** seen on every page view; the colour change
  is enough.
- **Shake on a form error:** reads as scolding; the colour fade (item 8)
  is enough.
- **Hero text on load:** the hero heading is the page's largest content;
  hiding it until the footer-loaded bundle runs would delay it and risk a
  flash. Only the hero photo settles (16).
- **Footer links:** they have no hover state at all, but that's a missing
  Designer colour state, not motion (Footer Link › Hover, e.g. opacity
  or White). Worth adding with item 1.
- **Nav Drop Link `transition: padding`:** padding is a layout property;
  no state changes it today, so it is harmless, but drop it from the
  transition list when touching the nav (item 9).

## Build order once chosen

1. Webflow (MCP, read back): items 1, 3, 4, 8, 9 and the Designer parts of
   5 and 6. Check the site ID first (AGENTS.md).
2. Repo: §05 rules for 1, 2, 4, 5, 7; §07 reduced-motion lines; `tabs.ts`
   (6); new `reveal.ts` and the section part of `scroll-fx.ts` removed
   (10–16); `pnpm build`, `pnpm check`. Commit only with
   the person's OK.
3. Publish to webflow.io when the person asks; check each item on staging
   with Playwright (hover via `page.hover`, reduced motion via
   `emulateMedia`), at 1440 and 375.
4. Port the approved rules into the prototype CSS so it keeps mirroring
   the site; delete `prototype/design/motion/` when the client has seen it.

## Build status (2026-11-09)

Webflow (written through the MCP, echoed back; on staging after the next
publish):
- Service Row: transition background-color 200ms; Hover background Colors
  Semantic › Background/Tint (1).
- Button Color, Phone Button: transition + transform 150ms ease-out-quint;
  Active `scale(0.98)` (3). Phone Button's transition longhands replaced by
  the shorthand.
- Article Card: transition border-color 200ms; Hover border Border/Active (4).
- Services Tab Icon: transition background-color, color 200ms (6).
- Form Input: outline 3px solid transparent, offset 0; transition
  border-color, outline-color 150ms (8).
- Nav Mega Panel (+ Is Open), Nav Mega View (+ Is Active, Is Before):
  250ms, ease-out-quint on height / transform, offset 1.5em (9). Tablet
  overrides unchanged.
- New class **Reading Progress** (fixed, top 0, 0.25em, Brand/Yellow,
  `scaleX(0)` from the left) on a new div `[data-reading-progress=".rich-body.is-article"]`
  before the hero of the Blog Posts Template (23).
- Home › the three Stat Tile Numbers: `data-count="true"` (17).

Repo (`pnpm check` and `pnpm build` pass; not committed):
- `src/modules/reveal.ts` (new; 10–16, 20), `reading-progress.ts` (new; 23),
  `tabs.ts` (6, 18), `faq.ts` (19), `hubspot-form.ts` (24: aria-busy +
  "Sending…" between HubSpot's onFormSubmit and onFormSubmitted),
  `scroll-fx.ts` (section fade removed, footer parallax kept), `index.ts`.
- `src/styles.css` §05 "Interaction motion" (1, 2, 4, 5, 7, 21, 24, SplitText
  lines) and the §07 reduced-motion block; `--ease-out` in §01.

Checked before publishing: headless Playwright on the staging pages with
the bundle requests answered from the local `dist/` (Home, About Us, Case
Studies, Blog, Contact Us, FAQs, Our Services at 1440 and 375): entrances
play and end fully visible, nothing left hidden or clipped after a full
scroll, no horizontal overflow, no script errors; the photo reveal runs
alongside the parallax (mid-reveal clip 16%, `scale` 1.026, parallax
transform intact); count-up, service row hover, tab and FAQ animations,
article zoom with parallax, link underline, dropdown fade and chevron;
under reduced motion nothing is hidden or split.
Not checked yet: the Designer states, the reading bar and the button press
(need the publish); the sending state (needs a real form submission).
