// A slow light sheen across the main call-to-action buttons (Button Color,
// Primary variant: the yellow quote buttons), repeating while the button is
// on screen, to draw the eye without moving the layout.
//
// The look and timing are CSS (src/styles.css, "cta-loop"): the sheen runs
// only on .is-cta-live, which this module toggles with an
// IntersectionObserver, so off-screen buttons do no work and a button starts
// its loop fresh when it scrolls in. Hover pauses it (the hover lift takes
// over). With reduced motion nothing is observed and the CSS never runs.
//
// hubspot-form calls initCtaLoop(frameDocument) once it has moved the
// site's submit button into HubSpot's iframe. An observer only sees targets
// in its own window, so each document gets its own (from its own realm).
const SELECTOR = '[data-wf--button-color--variant="primary"]';
const observers = new WeakMap<Window, IntersectionObserver>();

export function initCtaLoop(root: Document = document): void {
  const view = root.defaultView;
  if (!view || view.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const buttons = root.querySelectorAll<HTMLElement>(`${SELECTOR}:not([data-cta-loop-ready])`);
  if (!buttons.length) return;
  let observer = observers.get(view);
  if (!observer) {
    const IO = (view as Window & typeof globalThis).IntersectionObserver;
    observer = new IO(
      (entries) => entries.forEach((e) => e.target.classList.toggle('is-cta-live', e.isIntersecting)),
      { threshold: 0.6 },
    );
    observers.set(view, observer);
  }
  buttons.forEach((button) => {
    button.dataset.ctaLoopReady = '';
    observer.observe(button);
  });
}
