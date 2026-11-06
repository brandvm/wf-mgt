// Lenis smooth scrolling. Same shape as webflow-build recipes/smooth-scroll
// (initSmoothScroll() returns the instance or null), but driven by Lenis's
// own requestAnimationFrame loop. GSAP is now in the prototype (marquee.ts),
// which only reads window.scrollY; in the Webflow build use the recipe's
// gsap.ticker version.
//
// - Skipped under reduced motion: the page scrolls natively and the result
//   is null. Every caller must handle null.
// - Pass the returned instance to modules that need it; never read
//   `window.lenis` (Lenis sets it to a version marker, not the instance).
// - allowNestedScroll: a sideways gesture over the carousel track scrolls
//   the track; a vertical one still scrolls the page.
import Lenis from 'lenis';

export let lenis: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  if (lenis) return lenis;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  lenis = new Lenis({
    // Exponential damping: 0.1 settles a 400px wheel tick in about 1.1 s.
    lerp: 0.1,
    allowNestedScroll: true,
    // Same-page links (#main, the skip link) glide instead of jumping.
    anchors: true,
    autoRaf: true,
  });
  return lenis;
}
