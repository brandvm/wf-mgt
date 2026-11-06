// Ported 2026-11-05 from brandvm/mgt-live src/modules/nav.ts (the 2026 nav
// built in the mgt-live sandbox). Changes: the menu breakpoint (below).
// Site nav: one shared mega panel whose content slides between the menus,
// the light bar and the overlay while a menu is open, and the menu at
// below 992px.
// Markup:
//   [data-nav]                              G | Nav W (N26 | Nav W in Webflow
//                                           until launch; Is Open: light theme)
//     [data-nav-overlay]                    Nav Overlay (Is Open: shown)
//     img[data-nav-logo] ×2                 Nav Logo, Nav Logo Is Dark (Is Open swaps them)
//     [data-nav-menu]                       Nav Menu (Is Open: shown at <992)
//       button[data-nav-drop-toggle=<key>]  Nav Link
//         [data-nav-caret]                  Nav Caret (Is Open: turned)
//     button[data-nav-toggle]               Nav Toggle (shown at <992)
//       [data-nav-toggle-icon]              the Phosphor glyph: list ↔ x
//     [data-nav-panel]                      Nav Mega Panel (Is Open: shown)
//       [data-nav-view=<key>]               Nav Mega View (Is Active; Is Before:
//                                           the ones left of it, so content
//                                           slides the way the menus are ordered)
//   G | Nav W.is-instant                    repo CSS: no transitions for one frame
//   G | Nav W.is-hidden                     Is Hidden: slid up out of view on scroll down
//         button[data-nav-back]             Nav Mega Back (<992)
// Desktop: a menu opens on click, Enter, Space, Down (focusing its first
// link) or hover; the panel's height eases to the open menu's content.
// <992: the toggle opens the menu; a menu opens as a view over it, with
// Back. Escape closes the innermost thing and returns focus; a click on the
// overlay or outside the nav closes everything.
// Lenis is optional: the 2026 bundle passes its instance; the live bundle
// (the /design pages, HANDOFF 2026-10-30) has none.
type Lenis = { stop(): void; start(): void };

// 991, not the sandbox's 1279: the nav's CSS switches to the menu at the
// Tablet breakpoint (max-width 991px), on mgt-live too.
const mobile = window.matchMedia('(max-width: 991px)');
const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
const HIDE_AFTER = 2; // bar heights scrolled before it may hide
const TOLERANCE = 8; // px in one direction before it hides or shows
const HOVER_CLICK = 500; // ms after a hover-open in which a click keeps the menu open

export function initNav(lenis?: Lenis | null) {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  const panel = nav?.querySelector<HTMLElement>('[data-nav-panel]');
  if (!nav || !panel) return null;
  // Fixed only once this runs: G | Nav W itself stays absolute (conventions
  // §1), so the Designer canvas and style guide specimens keep it in place.
  nav.classList.add('is-fixed');
  const menu = nav.querySelector<HTMLElement>('[data-nav-menu]');
  const toggle = nav.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const toggleIcon = nav.querySelector<HTMLElement>('[data-nav-toggle-icon]');
  const overlay = nav.querySelector<HTMLElement>('[data-nav-overlay]');
  const logos = Array.from(nav.querySelectorAll<HTMLElement>('[data-nav-logo]'));
  const views = Array.from(panel.querySelectorAll<HTMLElement>('[data-nav-view]'));
  const toggles = Array.from(nav.querySelectorAll<HTMLButtonElement>('[data-nav-drop-toggle]'));
  const viewOf = (key: string) => views.find((v) => v.dataset.navView === key);
  toggles.forEach((t) => {
    const view = viewOf(t.dataset.navDropToggle!);
    if (view) t.setAttribute('aria-controls', view.id);
    t.setAttribute('aria-expanded', 'false');
  });

  let active: string | null = null;
  let menuOpen = false;

  // Below 1280 a view is open only inside the menu: the bar follows the menu,
  // so it can turn dark while a closing menu still shows its view.
  const theme = () => {
    const open = menuOpen || (active !== null && !mobile.matches);
    nav.classList.toggle('is-open', open);
    logos.forEach((l) => l.classList.toggle('is-open', open));
    overlay?.classList.toggle('is-open', active !== null && !mobile.matches);
  };
  const fit = () => {
    const view = active ? viewOf(active) : null;
    panel.style.height = mobile.matches ? '' : `${view ? view.offsetHeight : 0}px`;
  };
  // Content slides only when switching between two menus. Opening the panel
  // from closed, or closing it, only fades: a slide would carry the full-width
  // CTA band sideways and uncover white at its edge. The view is held in
  // place (inline, no transition) until its fade is over.
  const holds = new Map<HTMLElement, number>();
  const release = (v: HTMLElement) => {
    clearTimeout(holds.get(v));
    holds.delete(v);
    v.style.transform = '';
  };
  const hold = (v: HTMLElement) => {
    release(v);
    v.style.transition = 'none';
    v.style.transform = 'none';
    void v.offsetWidth;
    v.style.transition = '';
    holds.set(v, window.setTimeout(() => release(v), 350));
  };
  const show = (key: string | null) => {
    const prev = active;
    if (prev !== key) {
      const from = prev ? viewOf(prev) : undefined;
      const to = key ? viewOf(key) : undefined;
      if (mobile.matches || (from && to)) [from, to].forEach((v) => v && release(v));
      else (from ?? to) && hold((from ?? to)!);
    }
    active = key;
    const index = views.findIndex((v) => v.dataset.navView === key);
    views.forEach((v, i) => {
      v.classList.toggle('is-active', i === index);
      v.classList.toggle('is-before', index >= 0 && i < index);
      v.toggleAttribute('inert', i !== index);
    });
    toggles.forEach((t) => {
      const on = t.dataset.navDropToggle === key;
      t.setAttribute('aria-expanded', String(on));
      t.querySelector('[data-nav-caret]')?.classList.toggle('is-open', on);
    });
    panel.classList.toggle('is-open', key !== null);
    fit();
    theme();
  };
  // Applies a change with no transitions: the forced layout commits the
  // styles before they return.
  const instant = (change: () => void) => {
    nav.classList.add('is-instant');
    change();
    void nav.offsetHeight;
    nav.classList.remove('is-instant');
  };
  // Opening or closing the whole menu is one motion: the bar's colour eases
  // (Nav Bg) while the menu and any open view fade together. They stay light
  // while fading (Nav Menu Is Open and Nav Mega Panel are in the Base mode).
  // Closing resets the view only once the fade is done, so it never slides
  // back to the list on the way out.
  let fades: Animation[] = [];
  const fade = (open: boolean, done?: () => void) => {
    fades.forEach((a) => a.cancel());
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 250;
    const frames = open ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }];
    fades = [menu, panel].filter((el): el is HTMLElement => !!el)
      .map((el) => el.animate(frames, { duration, easing: 'ease', fill: open ? 'none' : 'forwards' }));
    const these = fades;
    // A timer too: animations don't advance in a background tab.
    const end = () => {
      if (fades !== these) return;
      fades = [];
      done?.();
      these.forEach((a) => a.cancel());
    };
    Promise.all(these.map((a) => a.finished)).then(end, () => {});
    setTimeout(end, duration + 50);
  };
  const setMenu = (open: boolean) => {
    if (!menu || !toggle) return;
    menuOpen = open;
    if (open) menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only')!.textContent = open ? 'Close menu' : 'Menu';
    toggleIcon?.classList.replace(open ? 'ph-list' : 'ph-x', open ? 'ph-x' : 'ph-list');
    document.documentElement.classList.toggle('is-nav-open', open);
    // With Lenis the wheel still scrolls an overflow-hidden page: stop it too.
    if (open) lenis?.stop(); else lenis?.start();
    theme();
    fade(open, open ? undefined : () => instant(() => { menu.classList.remove('is-open'); show(null); }));
  };
  const closeAll = () => { if (menuOpen) setMenu(false); else show(null); };
  // An element in a view that is still turning visible can't take focus yet:
  // retry briefly (timers, not frames: frames pause in a background tab).
  const focusWhenShown = (el: HTMLElement | null | undefined, tries = 20) => {
    if (!el) return;
    el.focus({ preventScroll: true });
    if (document.activeElement !== el && tries > 0) setTimeout(() => focusWhenShown(el, tries - 1), 30);
  };
  const firstLink = (key: string) => viewOf(key)?.querySelector<HTMLElement>('.nav-mega a, .nav-mega button');

  // Safe triangle ("menu aim"): while a menu is open, the pointer on its way
  // down to the panel may cross another menu's button or a link in the bar.
  // That must not switch or close the menu. The pointer is heading for the
  // panel when it is inside the triangle from where it was a few moves ago to
  // the panel's two top corners. Then the switch waits: it happens if the
  // pointer stays on that button (or turns sideways), not if it reaches the
  // panel. Moving along the bar switches at once.
  const trail: { x: number; y: number }[] = [];
  document.addEventListener('mousemove', (e) => {
    trail.push({ x: e.clientX, y: e.clientY });
    if (trail.length > 4) trail.shift();
  }, { passive: true });
  const side = (p: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }) => (p.x - b.x) * (a.y - b.y) - (a.x - b.x) * (p.y - b.y);
  const aiming = (e: MouseEvent) => {
    if (active === null || trail.length < 2) return false;
    const from = trail[0];
    const r = panel.getBoundingClientRect();
    const p = { x: e.clientX, y: e.clientY };
    const left = { x: r.left, y: r.top };
    const right = { x: r.right, y: r.top };
    const d1 = side(p, from, left), d2 = side(p, left, right), d3 = side(p, right, from);
    return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0)) && p.y > from.y;
  };
  let aimTimer = 0;
  const intend = (e: MouseEvent, el: HTMLElement, act: () => void) => {
    clearTimeout(aimTimer);
    if (!aiming(e)) return act();
    aimTimer = window.setTimeout(() => { if (el.matches(':hover')) act(); }, 300);
  };
  panel.addEventListener('mouseenter', () => clearTimeout(aimTimer));

  let timer = 0;
  // A mouse opens a menu on hover, so the click that usually follows must not
  // toggle it shut again: a click within HOVER_CLICK ms of a hover-open keeps it.
  let hoverOpened = { key: '', at: 0 };
  const showOnHover = (key: string) => {
    if (active !== key) hoverOpened = { key, at: performance.now() };
    show(key);
  };
  toggles.forEach((t) => {
    const key = t.dataset.navDropToggle!;
    t.addEventListener('click', () => {
      const justHovered = hoverOpened.key === key && performance.now() - hoverOpened.at < HOVER_CLICK;
      show(active === key && !justHovered ? null : key);
      // On phones the view slides in over the menu: focus its Back button once it shows.
      if (mobile.matches && active) focusWhenShown(viewOf(key)?.querySelector<HTMLElement>('[data-nav-back]'));
    });
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' || mobile.matches) return;
      e.preventDefault();
      show(key);
      firstLink(key)?.focus({ preventScroll: true });
    });
    t.addEventListener('mouseenter', (e) => {
      if (mobile.matches || !hover.matches) return;
      clearTimeout(timer);
      intend(e, t, () => showOnHover(key));
    });
    // Resting or turning sideways on a button the pointer only crossed.
    t.addEventListener('mousemove', (e) => {
      if (mobile.matches || !hover.matches || active === key) return;
      intend(e, t, () => showOnHover(key));
    });
  });
  // Leaving the bar and the panel closes the menu (desktop, mouse). The
  // overlay is part of the nav but counts as outside: the page under it.
  const leave = () => {
    if (mobile.matches || !hover.matches || active === null) return;
    clearTimeout(timer);
    timer = window.setTimeout(() => show(null), 200);
  };
  nav.addEventListener('mouseleave', leave);
  overlay?.addEventListener('mouseenter', leave);
  [nav.querySelector('nav'), panel].forEach((el) => el?.addEventListener('mouseenter', () => clearTimeout(timer)));
  // Pointing at another top link closes the open menu (unless only crossed on the way down).
  nav.querySelectorAll<HTMLElement>('.nav-links > a, .nav-brand').forEach((a) =>
    a.addEventListener('mouseenter', (e) => { if (!mobile.matches && hover.matches) intend(e, a, () => show(null)); }));
  views.forEach((v) => v.querySelector('[data-nav-back]')?.addEventListener('click', () => {
    const key = active;
    show(null);
    toggles.find((t) => t.dataset.navDropToggle === key)?.focus();
  }));

  toggle?.addEventListener('click', () => setMenu(!menuOpen));
  overlay?.addEventListener('click', closeAll);
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (active !== null) {
      const key = active;
      show(null);
      toggles.find((t) => t.dataset.navDropToggle === key)?.focus();
    } else if (menuOpen) { setMenu(false); toggle?.focus(); }
  });
  document.addEventListener('click', (e) => { if (!nav.contains(e.target as Node)) closeAll(); });
  // Tabbing out of the nav closes a desktop menu.
  nav.addEventListener('focusout', (e) => {
    if (!mobile.matches && active !== null && !nav.contains(e.relatedTarget as Node | null)) show(null);
  });
  // Hide on scroll: past HIDE_AFTER × the bar's height, scrolling down slides
  // the bar up out of view (Is Hidden) and scrolling up brings it back. A
  // move must add up to TOLERANCE px in one direction, so a trackpad's jitter
  // doesn't flicker it. Never while a menu is open or focus is in the nav.
  let lastY = window.scrollY;
  let run = 0;
  const setHidden = (on: boolean) => nav.classList.toggle('is-hidden', on);
  window.addEventListener('scroll', () => {
    const y = Math.max(0, window.scrollY);
    const dy = y - lastY;
    lastY = y;
    if (!dy) return;
    run = Math.sign(dy) === Math.sign(run) ? run + dy : dy;
    if (active !== null || menuOpen || nav.contains(document.activeElement)) return setHidden(false);
    if (y <= nav.offsetHeight * HIDE_AFTER) setHidden(false);
    else if (run > TOLERANCE) setHidden(true);
    else if (run < -TOLERANCE) setHidden(false);
  }, { passive: true });
  nav.addEventListener('focusin', () => setHidden(false));

  // The open menu's content can change height (wrapping, images): follow it.
  const sizes = new ResizeObserver(fit);
  views.forEach((v) => sizes.observe(v));
  mobile.addEventListener('change', () => { closeAll(); fit(); });
  show(null);
  // For page transitions: close everything before a page leaves.
  return { close: closeAll };
}
