// HubSpot form, in the site's form design. Same file in the prototype and
// the repo (wf-mgt/src/modules/hubspot-form.ts).
//
// Markup (Webflow): an empty target and, beside it in the same parent,
// the parts the Designer owns. Their first-load states are Designer
// classes, so nothing shows or jumps before this script runs:
//   <div class="form-embed" data-hubspot-form="<form id>"
//        data-hubspot-portal="<portal id>" data-hubspot-region="na1"></div>
//        (Form Embed reserves the form's height)
//   <div class="form-submit-w">                                (display none)
//     <div data-hubspot-submit> a C | Button instance </div>  (optional)
//     <p data-hubspot-note> the reCAPTCHA notice </p>          (optional)
//     <div data-hubspot-before="<field name>"> a step header </div> (optional)
//   </div>
//   <div class="form-success" data-hubspot-success> … </div>   (optional;
//        display none, shown with the Is Shown combo)
//
// HubSpot's embed (v2) renders the form into a same-origin iframe, whatever
// options it gets, so its validation, reCAPTCHA, file upload and tracking
// keep working and submissions go to the same HubSpot form. Once the form
// is ready this module restyles it from inside:
//   - removes HubSpot's theme CSS and copies the page's stylesheets in, so
//     the Webflow classes and the repo CSS apply there too;
//   - gives the iframe the page's body font size and variables (the fluid
//     scaling reads 100vw and Webflow's breakpoint variables are media
//     queries: inside the iframe both would follow the iframe's width);
//   - adds the site's Webflow classes to HubSpot's elements (CLASSES), and
//     again whenever HubSpot re-renders (errors replace an input's class);
//   - puts each [data-hubspot-before] in front of its field;
//   - moves [data-hubspot-submit] (and [data-hubspot-note] after it) out of
//     its hidden holder in place of HubSpot's submit input, which stays in the form, hidden, and is
//     clicked by the site's button;
//   - once HubSpot has validated and starts sending, marks the site's button
//     busy (aria-busy, label "Sending…", a spinner in place of its icon;
//     src/styles.css js-state) so nobody clicks twice (motion-plan.md 24);
//   - on submit, swaps the iframe for [data-hubspot-success] (adds Is Shown);
//   - forwards wheel events to Lenis, which never sees events in a frame;
//   - shows each radio question as the site's dropdown (radiosToSelects):
//     a select in a Select W with the caret icon, drawn by the
//     custom-select module inside the iframe. Choosing an option clicks the
//     matching (hidden) radio, so HubSpot validates and submits exactly
//     what it did with the radios.
// Styles stay in the Designer: change a class there, never here. Only
// HubSpot's own markup quirks are in src/styles.css (repo-css: third-party).
import type Lenis from 'lenis';
import { initCustomSelect } from './custom-select';
import { initCtaLoop } from './cta-loop';

const SCRIPT = 'https://js.hsforms.net/forms/embed/v2.js';

// HubSpot selector → the site's classes (Webflow class names).
const CLASSES: [string, string][] = [
  ['form.hs-form', 'form form-columns'],
  ['.hs-form-field:not(.hs-fieldtype-radio):not(.hs-fieldtype-checkbox), .hs-fieldtype-radio[data-radio-select]', 'form-field'],
  ['.hs-fieldtype-radio:not([data-radio-select]), .hs-fieldtype-checkbox', 'choice-group'],
  ['.hs-form-field > label', 'label'],
  ['.hs-fieldtype-radio:not([data-radio-select]) > label, .hs-fieldtype-checkbox > label', 'choice-legend'],
  ['.hs-field-desc', 'form-hint'],
  ['input.hs-input:not([type=radio]):not([type=checkbox]):not([type=file]):not([type=hidden])', 'form-input'],
  ['textarea.hs-input', 'form-input is-textarea'],
  ['select.hs-input', 'form-input is-select'],
  ['input.hs-input[type=file]', 'form-file file-drop'],
  ['.hs-form-radio-display, .hs-form-checkbox-display', 'radio-field choice'],
  ['.hs-form-radio-display > input, .hs-form-checkbox-display > input', 'radio-input'],
  ['.hs-form-radio-display > span, .hs-form-checkbox-display > span', 'radio-label'],
  ['.hs-input.invalid', 'is-error'],
  ['.hs-error-msg, .hs-error-msgs label', 'form-error'],
  ['.hs_error_rollup label', 'form-error'],
];

type HubSpot = { forms: { create: (options: Record<string, unknown>) => void } };
let loading: Promise<HubSpot> | null = null;

// `hidden` alone loses to a class that sets display.
function show(el: HTMLElement, visible: boolean) {
  el.hidden = !visible;
  el.style.display = visible ? '' : 'none';
}

function loadHubSpot(): Promise<HubSpot> {
  const ready = (window as { hbspt?: HubSpot }).hbspt;
  if (ready?.forms) return Promise.resolve(ready);
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT;
    script.async = true;
    script.onload = () => {
      const hbspt = (window as { hbspt?: HubSpot }).hbspt;
      if (hbspt?.forms) resolve(hbspt);
      else reject(new Error('hbspt.forms missing after load'));
    };
    script.onerror = () => reject(new Error(`failed to load ${SCRIPT}`));
    document.head.appendChild(script);
  });
  return loading;
}

function addClasses(root: ParentNode) {
  CLASSES.forEach(([selector, names]) => {
    root.querySelectorAll(selector).forEach((el) => {
      names.split(' ').forEach((name) => {
        if (!el.classList.contains(name)) el.classList.add(name);
      });
    });
  });
  // An input that is valid again loses Is Error (HubSpot drops .invalid).
  root.querySelectorAll('.is-error:not(.invalid)').forEach((el) => el.classList.remove('is-error'));
  // A chosen answer's tile: Choice › Is Checked.
  root.querySelectorAll<HTMLElement>('.choice').forEach((tile) => {
    const checked = !!tile.querySelector<HTMLInputElement>('input:checked');
    if (tile.classList.contains('is-checked') !== checked) tile.classList.toggle('is-checked', checked);
  });
  root.querySelectorAll('form.form-columns').forEach(setWidths);
}

// A radio question as a dropdown. The select has no name, so HubSpot never
// reads it; its change clicks the radio with the same value. The radio list
// stays in the form, hidden, with HubSpot's own state and validation.
// The caret is the Icon Size component's markup at its 14px variant.
const CARET =
  '<div class="icon w-variant-be343e17-9894-2cac-5a01-9e068a36439f"><i aria-hidden="true" class="icon-glyph ph ph-caret-down"></i></div>';
function radiosToSelects(form: HTMLFormElement) {
  const doc = form.ownerDocument;
  form.querySelectorAll<HTMLElement>('.hs-fieldtype-radio:not([data-radio-select])').forEach((field) => {
    const radios = Array.from(field.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    if (!radios.length) return;
    field.dataset.radioSelect = '';
    const list = field.querySelector<HTMLElement>('.inputs-list');
    const legend = field.querySelector<HTMLLabelElement>(':scope > label');
    const select = doc.createElement('select');
    select.id = `${radios[0].id || radios[0].name}-select`;
    select.className = 'form-input is-select';
    if (legend) legend.htmlFor = select.id;
    const blank = doc.createElement('option');
    blank.value = '';
    blank.textContent = 'Select an option';
    select.append(blank);
    radios.forEach((radio) => {
      const option = doc.createElement('option');
      option.value = radio.value;
      option.textContent = (radio.closest('label')?.textContent ?? radio.value).trim();
      option.selected = radio.checked;
      select.append(option);
    });
    select.addEventListener('change', () => {
      const radio = radios.find((r) => r.value === select.value);
      if (radio && !radio.checked) radio.click();
    });
    const wrap = doc.createElement('div');
    wrap.className = 'select-w';
    wrap.dataset.customSelect = 'field';
    const icon = doc.createElement('div');
    icon.className = 'select-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = CARET;
    wrap.append(select, icon);
    if (list) {
      list.style.display = 'none';
      list.after(wrap);
    } else field.append(wrap);
  });
  initCustomSelect(form);
}

// Form Columns (auto-fit, 16em minimum: 2 columns in the quote forms, 1 on
// phones; no breakpoint style, since inside the iframe a media query reads
// the iframe's width, not the page's): every field pairs up side by side
// (text, dropdown, file upload) except a textarea, which spans the row
// (Form Field › Is Full), as does the last of an odd run. Fields with no
// visible control (HubSpot's hidden inputs, reCAPTCHA) are skipped.
const VISIBLE = 'input:not([type=hidden]), select, textarea';
function setWidths(form: Element) {
  let run: Element[] = [];
  const close = () => {
    run.forEach((field, i) => setFull(field, run.length % 2 === 1 && i === run.length - 1));
    run = [];
  };
  Array.from(form.children).forEach((field) => {
    if ((field as HTMLElement).style.display === 'none') return;
    if (!field.classList.contains('form-field')) {
      close();
      return;
    }
    if (field.matches('.hs_recaptcha') || !field.querySelector(VISIBLE)) return;
    if (!field.querySelector('textarea')) run.push(field);
    else {
      close();
      setFull(field, true);
    }
  });
  close();
}

function setFull(field: Element, full: boolean) {
  if (field.classList.contains('is-full') !== full) field.classList.toggle('is-full', full);
}

function copyStyles(frame: Document) {
  frame.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => el.remove());
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((el) => {
    frame.head.appendChild(frame.importNode(el, true));
  });
  frame.documentElement.lang = document.documentElement.lang;
  // Webflow's base sets html height 100% and body min-height 100%: inside
  // the iframe that ties the content to the frame's own height.
  frame.documentElement.style.height = 'auto';
  frame.body.style.minHeight = '0';
  frame.body.style.margin = '0';
  frame.body.style.background = 'transparent';
}

// HubSpot sizes the iframe for its own theme; size it to the restyled form.
// A ResizeObserver never fires for the frame's elements (neither the page's
// nor the frame's own), so refit on what can change the height: DOM changes
// (errors, the thank-you message), stylesheets and fonts loading, resizes.
function fitHeight(frame: Document) {
  const iframe = frame.defaultView?.frameElement as HTMLIFrameElement | null;
  if (!iframe) return;
  let queued = false;
  const fit = () => {
    queued = false;
    // important: HubSpot keeps writing its own height after re-renders.
    iframe.style.setProperty('height', `${Math.ceil(frame.body.getBoundingClientRect().height)}px`, 'important');
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(fit);
  };
  const win = frame.defaultView as (Window & typeof globalThis) | null;
  new (win?.MutationObserver ?? MutationObserver)(queue).observe(frame.body, { subtree: true, childList: true, attributes: true });
  frame.querySelectorAll('link[rel="stylesheet"]').forEach((link) => link.addEventListener('load', queue));
  frame.fonts?.ready.then(queue);
  window.addEventListener('resize', queue);
  queue();
}

// Media queries inside the iframe read the iframe's width, not the window's:
// at desktop the form column is ~720px, so the variables Webflow redeclares
// on body for Tablet and Mobile Landscape would apply. Copy the page's
// resolved body variables (and font size) onto the frame's body instead.
function syncFontSize(frame: Document) {
  const apply = () => {
    const page = getComputedStyle(document.body);
    for (let i = 0; i < page.length; i++) {
      const name = page[i];
      if (name.startsWith('--')) frame.body.style.setProperty(name, page.getPropertyValue(name));
    }
    frame.body.style.fontSize = page.fontSize;
  };
  apply();
  window.addEventListener('resize', apply);
}

function useSiteSubmit(form: HTMLFormElement, template: HTMLElement | null): HTMLElement | undefined {
  const input = form.querySelector<HTMLInputElement>('input[type="submit"], button[type="submit"]');
  if (!input || !template) return undefined;
  const actions = input.parentElement ?? form;
  const note = template.parentElement?.querySelector<HTMLElement>('[data-hubspot-note]');
  show(input, false);
  input.tabIndex = -1;
  actions.appendChild(template);
  if (note) actions.appendChild(note);
  // A link inside the iframe would open inside it.
  [template, note].forEach((part) => part?.querySelectorAll('a[href]').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  }));
  show(template, true);
  const button = template.querySelector<HTMLElement>('button, a') ?? template;
  button.addEventListener('click', (event) => {
    event.preventDefault();
    if (button.getAttribute('aria-busy') === 'true') return;
    input.click();
  });
  return button;
}

// The busy state between HubSpot's onFormSubmit (validation passed) and its
// answer. The label keeps the button's width; a slow or failed send frees
// the button again after 15s.
const SENDING = 'Sending…';
function setSending(button: HTMLElement | undefined, on: boolean) {
  if (!button) return;
  const label = button.querySelector<HTMLElement>('.button-content > :not(.button-icon)');
  if (on) {
    if (label) {
      label.dataset.label ??= label.textContent ?? '';
      label.style.minWidth = `${label.offsetWidth}px`;
      label.textContent = SENDING;
      label.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease' });
    }
    button.setAttribute('aria-busy', 'true');
    window.setTimeout(() => setSending(button, false), 15000);
  } else {
    button.removeAttribute('aria-busy');
    if (label?.dataset.label !== undefined) {
      label.textContent = label.dataset.label;
      label.style.minWidth = '';
    }
  }
}
const buttons = new Map<HTMLElement, HTMLElement>();

// Designer-owned parts placed inside HubSpot's form: [data-hubspot-before=
// "<field name>"] (a step header) goes in front of that field. They wait in
// the hidden Form Submit W holder until then.
function placeParts(target: HTMLElement, form: HTMLFormElement) {
  target.parentElement?.querySelectorAll<HTMLElement>('[data-hubspot-before]').forEach((part) => {
    const field = form.querySelector(`.hs_${CSS.escape(part.dataset.hubspotBefore ?? '')}`);
    if (field) field.before(part);
  });
}

function forwardWheel(frame: Document, lenis: Lenis | null) {
  if (!lenis) return;
  frame.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      lenis.scrollTo(lenis.targetScroll + event.deltaY);
    },
    { passive: false },
  );
}

function restyle(target: HTMLElement, form: HTMLFormElement, lenis: Lenis | null) {
  const frame = form.ownerDocument;
  if (frame !== document) {
    copyStyles(frame);
    syncFontSize(frame);
    fitHeight(frame);
    forwardWheel(frame, lenis);
  }
  radiosToSelects(form);
  addClasses(frame.body);
  form.addEventListener('change', () => addClasses(frame.body));
  const win = frame.defaultView as (Window & typeof globalThis) | null;
  new (win?.MutationObserver ?? MutationObserver)(() => {
    radiosToSelects(form);
    addClasses(frame.body);
  }).observe(frame.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class'],
  });
  placeParts(target, form);
  const button = useSiteSubmit(form, target.parentElement?.querySelector<HTMLElement>('[data-hubspot-submit]') ?? null);
  if (button) buttons.set(target, button);
  initCtaLoop(frame);
  target.dataset.hubspotState = 'ready';
}

function showSuccess(target: HTMLElement) {
  const success = target.parentElement?.querySelector<HTMLElement>('[data-hubspot-success]');
  target.dataset.hubspotState = 'submitted';
  if (!success) return;
  show(target, false);
  success.classList.add('is-shown');
  success.setAttribute('tabindex', '-1');
  success.focus({ preventScroll: true });
}

let count = 0;

export function initHubspotForm(lenis: Lenis | null = null): void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-hubspot-form][data-hubspot-portal]')).filter(
    (el) => !el.dataset.hubspotState,
  );
  if (!targets.length) return;
  targets.forEach((target) => {
    target.dataset.hubspotState = 'loading';
    target.id ||= `hubspot-form-${++count}`;
  });

  loadHubSpot()
    .then((hbspt) => {
      targets.forEach((target) => {
        hbspt.forms.create({
          region: target.dataset.hubspotRegion || 'na1',
          portalId: target.dataset.hubspotPortal,
          formId: target.dataset.hubspotForm,
          target: `#${target.id}`,
          css: '',
          onFormReady: (form: HTMLFormElement | ArrayLike<HTMLFormElement>) => {
            // The form lives in the iframe's realm: `instanceof HTMLElement` is false.
            const el = 'nodeType' in form ? form : form[0];
            if (el) restyle(target, el, lenis);
          },
          onFormSubmit: () => setSending(buttons.get(target), true),
          onFormSubmitted: () => {
            setSending(buttons.get(target), false);
            showSuccess(target);
          },
        });
      });
    })
    .catch((error) => {
      console.error('[wfc] hubspot-form', error);
      targets.forEach((target) => {
        target.dataset.hubspotState = 'error';
      });
    });
}
