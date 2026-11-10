// Scroll-linked motion, GSAP ScrollTrigger with scrub (the pattern the live
// site uses, brandvm/mgt-live before-after.ts): every effect follows the
// scroll position and plays backwards when scrolling up.
//
// Footer parallax: [data-footer-parallax] (G | Footer, inside G | Footer W,
//    which clips it) starts up by 20% of the footer's height (at most 20% of
//    the screen) and settles to 0 as the footer's bottom reaches the bottom
//    of the screen. data-footer-parallax="0.3" changes the share.
//
// The section fade-up that was here (every S Wrapper, scrubbed 3em) is
// replaced by reveal.ts: one-time entrances per heading, grid and photo
// (motion-plan.md 10–16, 2026-11-09).
//
// Start states are set here, never in CSS, so the Designer canvas (no
// scripts) and visitors without JS see everything. Skipped under reduced
// motion. Lenis (smooth-scroll.ts) drives ScrollTrigger's updates when on.
// In the Webflow repo, import gsap and ScrollTrigger from src/lib/gsap.ts.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lenis } from './smooth-scroll';

gsap.registerPlugin(ScrollTrigger);

const FOOTER_SHIFT = 0.2;

export function initScrollFx(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (lenis) lenis.on('scroll', ScrollTrigger.update);

  // Footer parallax.
  const layer = document.querySelector<HTMLElement>('[data-footer-parallax]');
  const frame = layer?.parentElement;
  if (layer && frame) {
    const value = parseFloat(layer.dataset.footerParallax ?? '');
    const shift = Number.isFinite(value) && value > 0 ? Math.min(value, 0.5) : FOOTER_SHIFT;
    gsap.fromTo(
      layer,
      { y: () => -shift * Math.min(frame.offsetHeight, window.innerHeight) },
      {
        y: 0,
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
      },
    );
  }

  // Accordions, tabs and late images change the page height after load;
  // re-measure so triggers further down stay in place.
  let timer = 0;
  new ResizeObserver(() => {
    clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
  }).observe(document.body);
}
