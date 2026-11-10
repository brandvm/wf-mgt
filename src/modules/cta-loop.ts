// A slow, repeating attention cue on the main call-to-action buttons while
// they are on screen (a light sheen, or a phone ring), to draw the eye
// without moving the layout.
//
// Main CTAs are the quote buttons, whatever their colour (every Button Color
// inside a link to Contact Us or to the page's quote form, #top; the
// hubspot-form submit; any Primary-variant button), marked
// data-cta-loop="sheen", and the Phone Buttons, marked "ring" (their hover
// ring and handset wiggle, 3s after the sheens). "View all…" links are left
// alone. The look and timing are CSS (src/styles.css, "cta-loop"): the loops
// run only on .is-cta-live, toggled by an
// IntersectionObserver, so off-screen buttons do no work. Hover pauses the
// sheen and plays the phone's own hover ring.
// With reduced motion nothing is marked and the CSS never runs.
//
// hubspot-form calls initCtaLoop(frameDocument) once it has moved the
// site's submit button into HubSpot's iframe. An observer only sees targets
// in its own window, so each document gets its own (from its own realm).
const RING = '.phone-button:not([data-cta-loop])';
const SHEEN = [
  'a[href="/contact-us"] .button-color',
  'a[href$="#top"] .button-color',
  '[data-hubspot-submit] .button-color',
  'button .button-color',
  '[data-wf--button-color--variant="primary"]',
]
  .map((s) => `${s}:not([data-cta-loop])`)
  .join(', ');
const observers = new WeakMap<Window, IntersectionObserver>();

export function initCtaLoop(root: Document = document): void {
  const view = root.defaultView;
  if (!view || view.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const buttons = Array.from(root.querySelectorAll<HTMLElement>(`${SHEEN}, ${RING}`)).filter(
    (el) => !el.closest('[data-carousel-copy]'),
  );
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
    button.dataset.ctaLoop = button.classList.contains('phone-button') ? 'ring' : 'sheen';
    observer.observe(button);
  });
}
