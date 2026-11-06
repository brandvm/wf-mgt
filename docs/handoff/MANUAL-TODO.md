# Manual Designer steps

Everything the Webflow MCP can't do, for a person to do in the Designer.
Claude adds a row the moment it hits a limit, with *why* the API can't;
the person marks it done; Claude then reads the result back (or checks it on
the canvas when the API can't read it) and says so.

Common reasons, so they don't need re-explaining (see the skill's
`lessons/mcp.md`):
- a value mixing a variable with `calc()`, a gradient or a shadow;
- conditional visibility on a CMS field; a list sourced from a
  multi-reference or multi-image field; "exclude current item";
- a link to the current CMS item, in a list or a component prop;
- tag styles that have never been set; reserved class names;
- placeholders, slot names, variant props exposed from nested instances.

How to enter a value with variables: select the class, switch to the
breakpoint, type `calc(` in the field and insert variables with the
variable picker. Gradients: Backgrounds → gradient, pick each stop from the
variables.

Letters run A, B, C… then AA, AB… and are never reused, so a letter
mentioned in GOTCHAS or a commit stays unambiguous. The next free letter is
also kept in `REVIEW.md` once the review phase starts.

Rows that change something visible on a page also get a marker there, so
the step is found on the canvas and nobody mistakes the unfinished state
for the design: a small Caption next to the element (on the style guide,
next to its specimen) with the attribute `data-manual-todo="<letter>"` and
the text "Manual step <letter>: <what>". When the row is done, Claude
removes the marker in the same batch that ticks the row. Before the build
handoff and before launch, no `data-manual-todo` may be left on any
published page (search the published HTML for it).

Categories to expect on every build. Go through them at the start and
again at each gate, so the steps are found early and not at the end:

1. **Values with variables in a calc, gradient or shadow** (negative
   section padding, nav height + padding, gradient stops).
2. **Reserved class names** (Label, Form) and **tag styles** never set
   before (All H1–H6 Headings, All Paragraphs, All Links): one property
   set by hand, then the API can do the rest.
3. **CMS bindings:** lists from a multi-reference or multi-image field,
   "exclude current item", links to the current item, conditional
   visibility, decimal number formats, date bindings.
4. **Component wiring:** slots made and named, variant props exposed from
   a nested instance, variant styles on an element with a combo class,
   conditional classes (typed text: check the published class list).
5. **Forms:** field names (type a value that differs from the one shown),
   placeholders, the notification address, the success and error states.
6. **Page settings:** sitemap and search exclusion, the 404 and password
   pages (the API can't reach utility pages), Open Graph images for CMS
   templates.
7. **Site settings:** fonts uploaded, head and footer code pasted, the
   staging password.

| ID | Where (page › element or class) | Breakpoint | Set | Why the API can't | Done |
| --- | --- | --- | --- | --- | --- |
| A | Class Form Input › Is Select (the select fields on the Toronto quote form and Contact) | Desktop | Upload `prototype/images/icons/chevron-down.svg` as an asset. On Is Select add a Background image layer with it: no repeat, size 1.1667em (width), position X right with 1em offset (or `calc(100% - 1em)`), Y center. Repeat and size are already on the class through the API. | The style API has no asset upload for backgrounds, and Webflow drops `background-position` from a class with no background image. Both `right 1em center` and `calc(100% - 1em) 50%` were dropped without an error (2026-11-06). | ☐ |
| B | Class Filter Pill Select (the Service / Industry / Sort pills on the Case Studies listing) | Desktop | Upload `prototype/images/icons/chevron-down-navy-16.svg` as an asset. On Filter Pill Select add a Background image layer with it: no repeat, size 1.0667em, position X right, Y center. Repeat and size are already on the class. | Same as A: no asset upload through the style API, and `background-position` is dropped without an image. | ☐ |
| C | Style guide › Forms: the 10 field labels in the Form, Select, Textarea and Contact Form rows (and the same on the Contact and Toronto quote forms when they are built) | Desktop | Select each Form Label, Settings › For: pick its field. Give each field a unique ID first (Settings › ID), e.g. `sg-email`. Also set the two select options ("Select an option") and the radio values (each radio's Value = its label text). | `set_attributes` on elements inside the page shell's slot fails ("MPS rejected update … component map"), and the importer drops `for`, `value` and select options (2026-11-06). | ☐ |
| D | Site settings › Custom code (Head and Footer) and the two HTML Embeds 2a / 2b in G \| Components | — | Re-paste all four loader pieces from `wf-mgt/loader.html` as written there (piece 1 → Head code, 2a and 2b → the two Embeds, 3 → Footer code), then publish to webflow.io. The installed copies are the template's: `SITE = "wf-template"` and a 2a link to `brandvm.github.io/wf-template/styles.css`. | Done by hand. Correction: this was not an API limit. `data_scripts_tool › set_site_freeform_code` writes the head and footer code, and `data_element_settings_tool › set_settings` lists a `code` setting that likely covers the Embeds (untested); only publishing is blocked for Claude (Brand Vision hook). Re-paste through the API next time and leave the publish to the person. | ☑ 2026-11-06, checked: head and footer code match `loader.html` (`RELEASE = null`), the page loads `brandvm.github.io/wf-mgt/index.js` and `styles.css`, no console errors |
