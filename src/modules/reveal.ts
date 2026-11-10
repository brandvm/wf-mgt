// Scroll entrances (docs/handoff/webflow/motion-plan.md, items 10–16 and
// 20). Each element plays once, when its top reaches 85% of the screen,
// in place of the old scrubbed fade of whole sections (scroll-fx.ts).
//
// Kinds:
//   group   its children fade up 2em one after another, 0.1s apart. An
//           H1/H2 child rises line by line from a mask instead (SplitText).
//           A Step Line (or any [data-reveal-draw]) inside a child draws
//           left to right 0.25s after that child.
//   fade    the element itself fades up (a heading row's text column).
//   image   a photo frame opens from the bottom while its photo settles
//           from 1.12 to 1.
//   expand  a panel (CTA Banner) opens from slightly inset, photo settling.
//   settle  the hero photo settles from 1.08 to 1 on load; nothing hidden.
//
// Which elements: the classes in TARGETS (selected by class on purpose, like
// scroll-fx's S Wrapper: they are the shared section parts, used in CMS
// lists and components, so no attribute is needed per page). A data-reveal
// attribute overrides: data-reveal="group" etc. on any element adds it,
// data-reveal="off" leaves one out. data-reveal-delay / -rise / -stagger
// tune a group.
//
// Start states are set here, never in CSS, and only for elements below the
// first screen at load, so the first paint never changes and the Designer
// canvas and no-JS visitors see everything. Skipped under reduced motion.
//
// The photo zoom runs on the CSS `scale` property through --reveal-scale,
// never on `transform`: parallax.ts writes the same image's transform on
// every scroll frame, and a GSAP scale tween (part of transform) fought it
// (GOTCHAS 2026-11-09).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const EASE = 'quint.out';
const RISE = '2em';
const STAGGER = 0.1;
const START = 'top 85%';

type Target = { kind: string; delay?: number; rise?: string; stagger?: number };

const TARGETS: [string, Target][] = [
  ['.head-center, .head-row-title, .why-split-head, .step-grid, .card-grid, .faq-grid, .reason-list', { kind: 'group' }],
  ['.head-row-text', { kind: 'fade', delay: 0.2 }],
  ['.check-chips', { kind: 'group', delay: 0.35, rise: '0.75em', stagger: 0.05 }],
  ['.stat-tiles', { kind: 'group', delay: 0.5 }],
  ['.overview-media, .services-intro-media', { kind: 'image' }],
  ['.cta-banner', { kind: 'expand' }],
  ['.cta-banner-copy', { kind: 'group', delay: 0.3 }],
  ['.cta-banner-actions', { kind: 'group', delay: 0.5 }],
  ['.is-hero .s-bg-media', { kind: 'settle' }],
];

const num = (v: string | undefined) => (v && Number.isFinite(parseFloat(v)) ? parseFloat(v) : undefined);

export function initReveal(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const firstScreen = window.innerHeight;

  const found = new Map<HTMLElement, Target>();
  for (const [selector, target] of TARGETS) {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => found.set(el, target));
  }
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const kind = el.dataset.reveal!;
    found.set(el, {
      ...(found.get(el) ?? {}),
      kind,
      delay: num(el.dataset.revealDelay) ?? found.get(el)?.delay,
      rise: el.dataset.revealRise ?? found.get(el)?.rise,
      stagger: num(el.dataset.revealStagger) ?? found.get(el)?.stagger,
    });
  });

  const zoom = (tl: gsap.core.Timeline, img: HTMLElement, from: number, duration: number) => {
    img.style.scale = 'var(--reveal-scale, 1)';
    tl.fromTo(img, { '--reveal-scale': from }, { '--reveal-scale': 1, duration, ease: EASE, clearProps: '--reveal-scale' }, 0);
  };

  const frame = (tl: gsap.core.Timeline, box: HTMLElement, from: string) => {
    const radius = getComputedStyle(box).borderRadius || '0px';
    const img = box.querySelector<HTMLElement>(':scope > img, :scope > .cta-banner-bg img');
    tl.fromTo(box, { clipPath: `${from} round ${radius})` }, { clipPath: `inset(0% 0% 0% 0% round ${radius})`, duration: 1.2, ease: EASE, clearProps: 'clipPath' }, 0);
    if (img) zoom(tl, img, 1.12, 1.4);
  };

  const lines = (el: HTMLElement) => SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'reveal-line' }).lines;

  found.forEach(({ kind, delay = 0, rise = RISE, stagger = STAGGER }, el) => {
    if (kind === 'off') return;
    const tl = gsap.timeline({ paused: true, delay });

    if (kind === 'settle') {
      zoom(tl, el, 1.08, 1.8);
      tl.play();
      return;
    }
    // Hidden (an inactive tab panel) or on the first screen: leave as is.
    if (!el.getClientRects().length || el.getBoundingClientRect().top + window.scrollY < firstScreen) return;

    if (kind === 'group') {
      Array.from(el.children).forEach((child, i) => {
        const at = i * stagger;
        if (child.matches('h1, h2')) {
          tl.from(lines(child as HTMLElement), { yPercent: 100, duration: 0.9, ease: EASE, stagger: 0.08 }, at);
        } else {
          tl.from(child, { opacity: 0, y: rise, duration: 0.8, ease: EASE, clearProps: 'opacity,transform' }, at);
        }
        child.querySelectorAll('[data-reveal-draw], .step-line').forEach((line) => {
          tl.from(line, { scaleX: 0, transformOrigin: 'left center', duration: 0.8, ease: 'power2.inOut', clearProps: 'transform' }, at + 0.25);
        });
      });
    } else if (kind === 'fade') {
      tl.from(el, { opacity: 0, y: rise, duration: 0.8, ease: EASE, clearProps: 'opacity,transform' });
    } else if (kind === 'image') {
      frame(tl, el, 'inset(100% 0% 0% 0%');
    } else if (kind === 'expand') {
      frame(tl, el, 'inset(6% 4% 6% 4%');
    } else return;

    tl.progress(0);
    ScrollTrigger.create({ trigger: el, start: START, once: true, onEnter: () => tl.play() });
  });
}
