// Hero slideshow: the photos behind a hero crossfade in a loop, as on the
// old site's Home hero (mgt-live's CSS keyframes `hs`: three photos, 12s
// loop, 1s ease-in-out crossfade, the first photo full for its first 3s).
// No arrows, dots or pause on hover; the text and buttons don't change.
//
// Markup: two or more images with data-hero-slide (a Custom Attribute) in
// the same parent (S Bg), stacked by the Designer class S Bg Media › Is
// Slide (absolute, opacity 0, opacity transition 1000ms ease-in-out). The
// first carries Is Active (opacity 1) in the Designer, so it is the first
// paint with or without this script. data-hero-slides-hold="4000" on the
// parent changes the time from one change to the next (ms).
//
// This module only moves the `is-active` class; it never writes opacity or
// transform (parallax.ts owns transform on these images, reveal.ts scale).
// The fade itself is the Designer transition.
//
// Under reduced motion nothing runs and the first photo stays. Paused while
// the tab is hidden or the hero is off screen. A slide is shown only once
// its image has loaded (the later slides are lazy), so it never fades to an
// empty frame.

const ACTIVE = 'is-active';
const HOLD = 4000; // ms from one change to the next (3s full + 1s fade)
const FADE = 1000; // ms, the Designer transition; the first slide skips its fade-in

type Show = { slides: HTMLImageElement[]; hold: number; index: number; visible: boolean; timer: number };

function ready(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalWidth > 0) return Promise.resolve();
  img.loading = 'eager';
  return new Promise((resolve) => {
    const done = () => resolve();
    img.addEventListener('load', done, { once: true });
    // A broken image is skipped over by advance(); don't wait on it forever.
    img.addEventListener('error', done, { once: true });
  });
}

export function initHeroSlides(): (() => void) | void {
  const all = document.querySelectorAll<HTMLImageElement>('img[data-hero-slide]');
  if (all.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const byParent = new Map<HTMLElement, HTMLImageElement[]>();
  all.forEach((img) => {
    const parent = img.parentElement;
    if (!parent) return;
    byParent.set(parent, [...(byParent.get(parent) ?? []), img]);
  });

  const shows = new Map<HTMLElement, Show>();
  byParent.forEach((slides, parent) => {
    if (slides.length < 2) return;
    const hold = parseFloat(parent.dataset.heroSlidesHold ?? '');
    const start = Math.max(0, slides.findIndex((s) => s.classList.contains(ACTIVE)));
    slides.forEach((s, i) => s.classList.toggle(ACTIVE, i === start));
    shows.set(parent, { slides, hold: hold >= FADE ? hold : HOLD, index: start, visible: true, timer: 0 });
  });
  if (!shows.size) return;

  const stop = (show: Show) => {
    window.clearTimeout(show.timer);
    show.timer = 0;
  };

  const advance = (show: Show) => {
    show.timer = 0;
    const next = (show.index + 1) % show.slides.length;
    const img = show.slides[next];
    void ready(img).then(() => {
      if (show.timer || !show.visible || document.hidden) return;
      if (img.naturalWidth > 0) {
        show.slides[show.index].classList.remove(ACTIVE);
        img.classList.add(ACTIVE);
      }
      show.index = next;
      schedule(show, show.hold);
    });
  };

  const schedule = (show: Show, delay: number) => {
    stop(show);
    if (!show.visible || document.hidden) return;
    show.timer = window.setTimeout(() => advance(show), delay);
  };

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const show = shows.get(entry.target as HTMLElement);
      if (!show || show.visible === entry.isIntersecting) continue;
      show.visible = entry.isIntersecting;
      if (show.visible) schedule(show, show.hold - FADE);
      else stop(show);
    }
  });
  const onVisibility = () => {
    shows.forEach((show) => (document.hidden ? stop(show) : schedule(show, show.hold - FADE)));
  };
  document.addEventListener('visibilitychange', onVisibility);

  shows.forEach((show, parent) => {
    io.observe(parent);
    // The first slide is already full at load, so it changes after
    // hold - fade (3s), as the old site's -1s animation delay did.
    schedule(show, show.hold - FADE);
  });

  return () => {
    io.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    shows.forEach(stop);
  };
}
