// Scroll-linked motion, GSAP ScrollTrigger with scrub (the pattern the live
// site uses, brandvm/mgt-live before-after.ts): every effect follows the
// scroll position and plays backwards when scrolling up.
//
// 1. Section fade-up: every .s-wrapper (Webflow class S Wrapper, on every
//    section) rises 3em and fades in while its section's top travels from
//    92% to 55% of the screen height. Selected by class on purpose: S Wrapper
//    is the one global section container, so no attribute is needed per
//    section. Skipped: wrappers in the first screen at load (the hero would
//    start half-faded), wrappers nested in another, and data-reveal="off".
// 2. Footer parallax: [data-footer-parallax] (G | Footer, inside G | Footer W,
//    which clips it) starts up by 20% of the footer's height (at most 20% of
//    the screen) and settles to 0 as the footer's bottom reaches the bottom
//    of the screen. data-footer-parallax="0.3" changes the share.
//
// Start states are set here, never in CSS, so the Designer canvas (no
// scripts) and visitors without JS see everything. Skipped under reduced
// motion. Lenis (smooth-scroll.ts) drives ScrollTrigger's updates when on.
// In the Webflow repo, import gsap and ScrollTrigger from src/lib/gsap.ts.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lenis } from './smooth-scroll';

gsap.registerPlugin(ScrollTrigger);

const RISE = '3em';
const SCRUB = 0.6; // seconds the animation takes to catch up with the scroll
const FOOTER_SHIFT = 0.2;

export function initScrollFx(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (lenis) lenis.on('scroll', ScrollTrigger.update);

  // 1. Section fade-up.
  const firstScreen = window.innerHeight;
  document.querySelectorAll<HTMLElement>('.s-wrapper').forEach((wrapper) => {
    if (wrapper.dataset.reveal === 'off' || wrapper.parentElement?.closest('.s-wrapper')) return;
    if (wrapper.getBoundingClientRect().top + window.scrollY < firstScreen) return;
    // The section, not the wrapper, is the trigger: the wrapper moves, and
    // the footer's sits inside the parallax layer.
    const trigger = wrapper.closest<HTMLElement>('.section, .g-footer-w') ?? wrapper;
    gsap.fromTo(
      wrapper,
      { opacity: 0, y: RISE },
      {
        opacity: 1,
        y: 0,
        ease: 'power1.out',
        scrollTrigger: { trigger, start: 'top 92%', end: 'top 55%', scrub: SCRUB },
      },
    );
  });

  // 2. Footer parallax.
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
