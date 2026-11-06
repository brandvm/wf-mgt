// Image parallax: a photo drifts inside its frame as the page scrolls.
//
// Markup: data-parallax on an <img> (a Custom Attribute in the Designer)
// whose parent clips it (overflow hidden, or a clip-path) and that fills
// the parent (width/height 100%, object-fit cover). data-parallax="0.1" sets
// how far it moves, as a share of the frame's height each way (default 0.04).
//
// The image is scaled up just enough to cover that travel, then moved from
// -shift (frame entering at the bottom of the screen) to +shift (frame
// leaving at the top). Frames are read each frame, only while on screen, so
// tabs, carousels and late layout changes need no refresh. Works with Lenis
// (smooth-scroll.ts) or native scrolling, without a reference to either.
//
// Skipped under reduced motion. At a breakpoint where the parent does not
// clip, the image stays still (it would spill over its neighbours); this is
// checked again on resize.

const DEFAULT_SHIFT = 0.04;

type Item = { img: HTMLElement; frame: HTMLElement; shift: number; visible: boolean; clips: boolean };

const clips = (el: HTMLElement) => {
  const { overflowX, overflowY, clipPath } = getComputedStyle(el);
  return overflowX !== 'visible' || overflowY !== 'visible' || clipPath !== 'none';
};

export function initParallax(): (() => void) | void {
  const imgs = document.querySelectorAll<HTMLElement>('[data-parallax]');
  if (!imgs.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const items: Item[] = [];
  imgs.forEach((img) => {
    const frame = img.parentElement;
    if (!frame) return;
    const value = parseFloat(img.dataset.parallax ?? '');
    const shift = Number.isFinite(value) && value > 0 ? Math.min(value, 0.3) : DEFAULT_SHIFT;
    items.push({ img, frame, shift, visible: false, clips: false });
  });
  if (!items.length) return;

  const measureClips = () => {
    for (const it of items) {
      it.clips = clips(it.frame);
      if (!it.clips) it.img.style.transform = '';
      it.img.style.willChange = it.clips ? 'transform' : '';
    }
  };

  let raf = 0;
  const update = () => {
    raf = 0;
    const vh = window.innerHeight;
    // Read every frame first, then write, so the browser lays out once.
    const moves = items
      .filter((it) => it.visible && it.clips)
      .map((it) => {
        const r = it.frame.getBoundingClientRect();
        // 0 when the frame's top meets the bottom of the screen, 1 when its
        // bottom leaves the top.
        const progress = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        return { it, y: (progress * 2 - 1) * it.shift * 100 };
      });
    for (const { it, y } of moves) {
      // Scale covers the travel both ways plus a hair against seams.
      it.img.style.transform = `translate3d(0, ${y.toFixed(3)}%, 0) scale(${(1 + it.shift * 2 + 0.01).toFixed(3)})`;
    }
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  const onResize = () => {
    measureClips();
    schedule();
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        items.filter((i) => i.frame === entry.target).forEach((i) => (i.visible = entry.isIntersecting));
      }
      schedule();
    },
    { rootMargin: '10% 0px' },
  );
  new Set(items.map((i) => i.frame)).forEach((frame) => io.observe(frame));

  // Place every image once, on screen or not, so none jumps when it arrives.
  measureClips();
  items.forEach((i) => (i.visible = true));
  update();
  items.forEach((i) => (i.visible = false));

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', onResize);

  return () => {
    io.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', onResize);
    if (raf) cancelAnimationFrame(raf);
    items.forEach(({ img }) => {
      img.style.transform = '';
      img.style.willChange = '';
    });
  };
}
