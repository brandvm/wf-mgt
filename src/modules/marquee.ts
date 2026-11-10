// Marquee: a row that scrolls sideways in an endless loop and follows the
// page scroll. Same markup as webflow-build recipes/snippets/marquee.ts, but
// driven by GSAP's ticker instead of a CSS keyframe, so it can react:
//
// - scrolling down runs it left, scrolling up turns it right; it keeps the
//   last direction when the page stops;
// - the faster the page scrolls, the faster it runs;
// - speed and direction ease (inertia): a reversal slows, stops and picks
//   up again instead of snapping.
//
// Markup: [data-marquee] on a flex row (no wrap) inside a wrapper that clips
// it (overflow hidden in the Designer); its children are the items.
// data-marquee-speed="50" is the resting speed in pixels per second.
//
// The items are cloned (aria-hidden, out of the tab order) until the row
// covers its own width plus one set, and it loops by one set. Paused off
// screen. Without the script, or under reduced motion, nothing is cloned and
// the row keeps its Designer layout.
//
// Scroll speed is read from window.scrollY each frame, so it works with
// Lenis (smooth-scroll.ts) or native scrolling, without a reference to either.
// In the Webflow repo, import gsap from src/lib/gsap.ts, never 'gsap' directly
// (lessons/js.md, "Bundled GSAP plugins register themselves…").
import gsap from 'gsap';

const SPEED = 50; // px per second at rest
const SCROLL_FACTOR = 0.25; // extra px/s per px/s of page scroll
const MAX_BOOST = 1200; // cap on the extra speed, px/s
const EASE = 4; // how quickly speed follows its target, per second (higher = less inertia)

type Row = {
  row: HTMLElement;
  items: HTMLElement[];
  speed: number;
  distance: number;
  x: number;
  visible: boolean;
  setX: (value: number) => void;
};

function cloneSet(row: HTMLElement, items: HTMLElement[]) {
  for (const item of items) {
    const clone = item.cloneNode(true) as HTMLElement;
    clone.setAttribute('aria-hidden', 'true');
    clone.setAttribute('data-marquee-clone', '');
    clone.removeAttribute('id');
    if (clone instanceof HTMLImageElement) clone.alt = '';
    clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
    clone.querySelectorAll('img').forEach((img) => (img.alt = ''));
    clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach((el) => el.setAttribute('tabindex', '-1'));
    row.appendChild(clone);
  }
}

export function initMarquee(): (() => void) | void {
  const els = document.querySelectorAll<HTMLElement>('[data-marquee]');
  if (!els.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const rows: Row[] = [];
  const observers: Array<ResizeObserver | IntersectionObserver> = [];

  els.forEach((row) => {
    const items = Array.from(row.children) as HTMLElement[];
    if (!items.length || row.classList.contains('is-marquee')) return;
    cloneSet(row, items);
    const firstClone = row.children[items.length] as HTMLElement;
    const state: Row = {
      row,
      items,
      speed: Number(row.dataset.marqueeSpeed) || SPEED,
      distance: 0,
      x: 0,
      visible: true,
      setX: gsap.quickSetter(row, 'x', 'px') as (value: number) => void,
    };
    const measure = () => {
      // One set = from the first item to its clone, gap included.
      const distance = firstClone.offsetLeft - items[0].offsetLeft;
      if (distance <= 0) return;
      state.distance = distance;
      // Enough sets to cover the row's width plus the one that slides out.
      const needed = Math.ceil(row.clientWidth / distance) + 1;
      let sets = row.children.length / items.length;
      while (sets < needed) {
        cloneSet(row, items);
        sets++;
      }
    };
    row.classList.add('is-marquee');
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(row);
    resize.observe(items[0]);
    // Watch the clipping wrapper, not the row: the row moves, and when one set
    // is wider than the wrapper it can slide fully out of its own box, read as
    // off screen and never restart.
    const view = new IntersectionObserver(([entry]) => (state.visible = entry.isIntersecting));
    view.observe(row.parentElement ?? row);
    observers.push(resize, view);
    rows.push(state);
  });
  if (!rows.length) return;

  let direction = 1; // 1 = left (scrolling down), -1 = right (scrolling up)
  let velocity = 0; // current signed multiplier of px/s, eased
  let lastY = window.scrollY;

  const tick = (_time: number, deltaMs: number) => {
    const dt = Math.min(deltaMs, 100) / 1000; // a background tab returns a huge delta
    if (!dt) return;
    const dy = window.scrollY - lastY;
    lastY = window.scrollY;
    if (Math.abs(dy) > 0.5) direction = dy > 0 ? 1 : -1;
    const boost = Math.min((Math.abs(dy) / dt) * SCROLL_FACTOR, MAX_BOOST);
    // Frame-rate independent ease toward the target speed.
    const target = direction * (1 + boost / SPEED);
    velocity += (target - velocity) * (1 - Math.exp(-EASE * dt));

    for (const r of rows) {
      if (!r.visible || !r.distance) continue;
      r.x = gsap.utils.wrap(-r.distance, 0, r.x - velocity * r.speed * dt);
      r.setX(r.x);
    }
  };
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    observers.forEach((o) => o.disconnect());
  };
}
