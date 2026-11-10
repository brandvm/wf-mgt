// Custom select: a button + listbox drawn over a native <select> (the ARIA
// "select-only combobox" pattern), styled by Designer classes.
//
// Markup: data-custom-select on the element that holds the select and is
// positioned (Select W on forms, Filter Pill on the listing filters). The
// module
//   - adds a button with the select's own classes (Form Input / Is Select,
//     Filter Pill Select), so the Designer's look and focus states apply;
//   - adds a ul.select-list (Select List, Is Open when shown) of
//     li.select-option (Select Option, Is Active for the highlighted one,
//     Is Selected for the chosen one) to the host;
//   - keeps the native select in the form, visually hidden behind the button
//     (repo CSS, js-state): every choice sets its value and fires `input`
//     and `change`, so Webflow forms submit it and Finsweet List filters and
//     sorts on it. Changes made to the select from outside (a form reset,
//     Finsweet) are read back on `change`, `input`, `reset` and on open.
// The host gets Is Open (`is-open`) while the list shows; Filter Pill has
// an Is Open combo for it. A required select left empty gets Form Input ›
// Is Error (`is-error`) on its button and the list opens on submit.
//
// Keyboard (focus stays on the button; aria-activedescendant names the
// highlighted option): Down/Up/Enter/Space/Alt+Down open; in the list
// Down/Up/Home/End/PageUp/PageDown move, Enter/Space/Alt+Up choose, Escape
// closes, Tab chooses and moves on; typing jumps to the option that starts
// with the typed letters. A click outside closes without choosing.
let uid = 0;

const PAGE = 10;

// `root` is the page by default; the HubSpot form module passes its
// iframe's document, so the lists open and position inside the frame.
export function initCustomSelect(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-custom-select]').forEach((host) => {
    if (host.dataset.customSelectReady !== undefined) return;
    const select = host.querySelector('select');
    if (!select || select.multiple || select.dataset.customSelectNative !== undefined) return;
    enhance(host, select);
  });
}

function enhance(host: HTMLElement, select: HTMLSelectElement) {
  host.dataset.customSelectReady = '';
  const doc = host.ownerDocument;
  const view = doc.defaultView ?? window;
  const n = ++uid;
  const listId = `custom-select-${n}-list`;
  const buttonId = select.id ? `${select.id}-button` : `custom-select-${n}-button`;

  // The visible label: the host's own <label> (Filter Pill) or the one that
  // points at the select. Its text names the button.
  const wrapLabel = select.closest('label');
  const forLabel = select.id ? doc.querySelector<HTMLLabelElement>(`label[for="${CSS.escape(select.id)}"]`) : null;
  const label = forLabel ?? wrapLabel;
  const nameEl = label?.querySelector<HTMLElement>('.filter-pill-label') ?? label;
  if (nameEl && !nameEl.id) nameEl.id = `custom-select-${n}-label`;

  const button = doc.createElement('button');
  button.type = 'button';
  button.id = buttonId;
  button.className = Array.from(select.classList).filter((c) => !c.startsWith('w-')).join(' ');
  button.setAttribute('role', 'combobox');
  button.setAttribute('aria-haspopup', 'listbox');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', listId);
  if (nameEl) button.setAttribute('aria-labelledby', nameEl.id);
  if (select.required) button.setAttribute('aria-required', 'true');
  if (select.disabled) button.disabled = true;

  // The value sits in a grid cell with every option's text stacked under it
  // (hidden), so the button is as wide as the longest option, like a native
  // select, and doesn't jump when the choice changes.
  const value = doc.createElement('span');
  value.dataset.customSelectValue = '';
  const current = doc.createElement('span');
  current.dataset.customSelectCurrent = '';
  value.append(current);
  button.append(value);

  const list = doc.createElement('ul');
  list.id = listId;
  list.className = 'select-list';
  list.setAttribute('role', 'listbox');
  list.setAttribute('tabindex', '-1');
  list.setAttribute('data-lenis-prevent', '');
  if (nameEl) list.setAttribute('aria-labelledby', nameEl.id);

  let options: HTMLLIElement[] = [];
  let active = -1;
  let open = false;

  const build = () => {
    list.replaceChildren();
    value.querySelectorAll('[data-custom-select-sizer]').forEach((s) => s.remove());
    options = Array.from(select.options).map((opt, i) => {
      const li = doc.createElement('li');
      li.id = `${listId}-${i}`;
      li.className = 'select-option';
      li.setAttribute('role', 'option');
      li.textContent = opt.text;
      if (opt.disabled) li.setAttribute('aria-disabled', 'true');
      list.append(li);
      const sizer = doc.createElement('span');
      sizer.dataset.customSelectSizer = '';
      sizer.setAttribute('aria-hidden', 'true');
      sizer.textContent = opt.text;
      value.append(sizer);
      return li;
    });
  };

  const sync = () => {
    if (options.length !== select.options.length) build();
    const i = select.selectedIndex;
    current.textContent = select.options[i]?.text ?? '';
    options.forEach((li, k) => {
      li.classList.toggle('is-selected', k === i);
      li.setAttribute('aria-selected', String(k === i));
    });
    // validity, not checkValidity(): that fires `invalid` and marks the error.
    if (select.validity.valid) {
      button.classList.remove('is-error');
      button.removeAttribute('aria-invalid');
    }
  };

  const enabled = (i: number) => i >= 0 && i < options.length && !select.options[i].disabled;

  const setActive = (i: number) => {
    options[active]?.classList.remove('is-active');
    active = i;
    const li = options[i];
    if (!li) {
      button.removeAttribute('aria-activedescendant');
      return;
    }
    li.classList.add('is-active');
    button.setAttribute('aria-activedescendant', li.id);
    // Scroll inside the list only; scrollIntoView would also move the page.
    if (li.offsetTop < list.scrollTop) list.scrollTop = li.offsetTop;
    else if (li.offsetTop + li.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = li.offsetTop + li.offsetHeight - list.clientHeight;
    }
  };

  // Next enabled option from i in direction dir, or i itself at the ends.
  const step = (from: number, dir: 1 | -1, by = 1) => {
    let i = from;
    let left = by;
    for (let k = from + dir; k >= 0 && k < options.length; k += dir) {
      if (!enabled(k)) continue;
      i = k;
      if (--left === 0) break;
    }
    return i;
  };

  const place = () => {
    list.style.removeProperty('top');
    list.style.removeProperty('bottom');
    list.style.removeProperty('left');
    list.style.removeProperty('right');
    list.style.removeProperty('margin-top');
    list.style.removeProperty('margin-bottom');
    const r = list.getBoundingClientRect();
    const h = host.getBoundingClientRect();
    if (r.bottom > view.innerHeight && h.top - r.height > 0) {
      const gap = getComputedStyle(list).marginTop;
      list.style.top = 'auto';
      list.style.bottom = '100%';
      list.style.marginTop = '0px';
      list.style.marginBottom = gap;
    }
    if (r.right > doc.documentElement.clientWidth) {
      list.style.left = 'auto';
      list.style.right = '0px';
    }
  };

  const show = (to?: number) => {
    if (open) return;
    sync();
    open = true;
    list.classList.add('is-open');
    host.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    place();
    setActive(to ?? (enabled(select.selectedIndex) ? select.selectedIndex : step(-1, 1)));
    doc.addEventListener('pointerdown', outside, true);
  };

  const hide = () => {
    if (!open) return;
    open = false;
    list.classList.remove('is-open');
    host.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    setActive(-1);
    doc.removeEventListener('pointerdown', outside, true);
  };

  const choose = (i: number) => {
    if (!enabled(i)) return;
    if (select.selectedIndex !== i) {
      select.selectedIndex = i;
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    sync();
  };

  function outside(e: PointerEvent) {
    if (!host.contains(e.target as Node)) hide();
  }

  // Type to jump: letters typed within half a second build one search.
  let typed = '';
  let typedAt = 0;
  const typeahead = (key: string) => {
    const now = Date.now();
    typed = now - typedAt > 500 ? key : typed + key;
    typedAt = now;
    const q = typed.toLowerCase();
    const start = open ? active : select.selectedIndex;
    const order = [...options.keys()].map((k) => (start + 1 + k) % options.length);
    // A repeated single letter cycles through the options with that letter.
    const same = q.split('').every((c) => c === q[0]);
    const hit =
      order.find((k) => enabled(k) && select.options[k].text.toLowerCase().startsWith(q)) ??
      (same ? order.find((k) => enabled(k) && select.options[k].text.toLowerCase().startsWith(q[0])) : undefined);
    return hit;
  };

  button.addEventListener('click', () => (open ? hide() : show()));

  button.addEventListener('keydown', (e) => {
    const { key, altKey } = e;
    if (!open) {
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
        e.preventDefault();
        show();
      } else if (key === 'Home' || key === 'End') {
        e.preventDefault();
        show(key === 'Home' ? step(-1, 1) : step(options.length, -1));
      } else if (key.length === 1 && !e.ctrlKey && !e.metaKey && !altKey) {
        const hit = typeahead(key);
        if (hit !== undefined) {
          e.preventDefault();
          show(hit);
        }
      }
      return;
    }
    switch (key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        if (altKey && key === 'ArrowUp') {
          choose(active);
          hide();
        } else setActive(step(active, key === 'ArrowDown' ? 1 : -1));
        break;
      case 'Home':
      case 'End':
        e.preventDefault();
        setActive(key === 'Home' ? step(-1, 1) : step(options.length, -1));
        break;
      case 'PageDown':
      case 'PageUp':
        e.preventDefault();
        setActive(step(active, key === 'PageDown' ? 1 : -1, PAGE));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(active);
        hide();
        break;
      case 'Escape':
        e.preventDefault();
        hide();
        break;
      case 'Tab':
        choose(active);
        hide();
        break;
      default:
        if (key.length === 1 && !e.ctrlKey && !e.metaKey && !altKey) {
          const hit = typeahead(key);
          if (hit !== undefined) setActive(hit);
          e.preventDefault();
        }
    }
  });

  button.addEventListener('blur', (e) => {
    if (!host.contains(e.relatedTarget as Node)) hide();
  });

  // Keep focus on the button while the pointer is on the list.
  list.addEventListener('mousedown', (e) => e.preventDefault());
  list.addEventListener('mousemove', (e) => {
    const li = (e.target as Element).closest('li');
    const i = li ? options.indexOf(li as HTMLLIElement) : -1;
    if (i !== active && enabled(i)) setActive(i);
  });
  list.addEventListener('click', (e) => {
    // Also stops the click reaching a wrapping <label>, which would focus
    // the hidden select.
    e.preventDefault();
    const li = (e.target as Element).closest('li');
    const i = li ? options.indexOf(li as HTMLLIElement) : -1;
    if (!enabled(i)) return;
    choose(i);
    hide();
    button.focus();
  });

  // A label click focuses the button instead of the hidden select; on a
  // pill (the label wraps the control) it also opens the list.
  if (label) {
    label.addEventListener('click', (e) => {
      if (button.contains(e.target as Node) || list.contains(e.target as Node)) return;
      e.preventDefault();
      button.focus();
      if (label === wrapLabel) (open ? hide() : show());
    });
  }

  select.addEventListener('change', sync);
  select.addEventListener('input', sync);
  select.form?.addEventListener('reset', () => setTimeout(sync));
  // Something focusing the select (a script, the browser) lands on the button.
  select.addEventListener('focus', () => button.focus());
  // Empty and required on submit: no native bubble (it would point at a
  // hidden control); the button shows Is Error and the first one opens.
  select.addEventListener('invalid', (e) => {
    e.preventDefault();
    button.classList.add('is-error');
    button.setAttribute('aria-invalid', 'true');
    if (select.form?.querySelector(':invalid') === select) {
      button.focus();
      show();
    }
  });

  select.dataset.customSelectNative = '';
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');
  build();
  sync();
  select.after(button);
  host.append(list);
}
