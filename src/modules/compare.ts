// Before/after slider. [data-compare] holds the two photos; the module sets
// --compare (0–100%) on it, which clips the before photo and places the line,
// [data-compare-handle] and the hint (repo CSS, js-state). Drag anywhere on
// the photo, or focus the handle and use the arrow keys, Home and End.
//
// Affordance: the first time the slider is half in view it nudges left and
// right once (skipped with reduced motion). The first drag or key press adds
// .is-touched (js-state), which fades the "Drag to compare" hint and cancels
// a nudge still running.
const NUDGE_MS = 1600;
const NUDGE_DEPTH = 14; // percentage points either side of the middle

export function initCompare(): void {
  document.querySelectorAll<HTMLElement>('[data-compare]').forEach((root) => {
    const handle = root.querySelector<HTMLElement>('[data-compare-handle]');
    let value = 50;
    let touched = false;
    const set = (v: number) => {
      value = Math.min(100, Math.max(0, v));
      root.style.setProperty('--compare', `${value}%`);
      handle?.setAttribute('aria-valuenow', String(Math.round(value)));
    };
    const touch = () => {
      if (touched) return;
      touched = true;
      root.classList.add('is-touched');
    };
    if (handle) {
      handle.tabIndex = 0;
      handle.setAttribute('role', 'slider');
      handle.setAttribute('aria-label', 'Before and after');
      handle.setAttribute('aria-valuemin', '0');
      handle.setAttribute('aria-valuemax', '100');
      handle.addEventListener('keydown', (e) => {
        const step = e.shiftKey ? 10 : 2;
        const next = { ArrowLeft: value - step, ArrowDown: value - step, ArrowRight: value + step, ArrowUp: value + step, Home: 0, End: 100 }[e.key];
        if (next === undefined) return;
        e.preventDefault();
        touch();
        set(next);
      });
    }
    const fromPointer = (e: PointerEvent) => {
      const box = root.getBoundingClientRect();
      set(((e.clientX - box.left) / box.width) * 100);
    };
    root.addEventListener('pointerdown', (e) => {
      // No text/image selection or native image drag while sliding.
      e.preventDefault();
      touch();
      root.setPointerCapture(e.pointerId);
      fromPointer(e);
    });
    root.addEventListener('pointermove', (e) => {
      if (root.hasPointerCapture(e.pointerId)) fromPointer(e);
    });
    root.addEventListener('dragstart', (e) => e.preventDefault());
    set(value);

    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const nudge = () => {
      const start = performance.now();
      const frame = (now: number) => {
        if (touched) return;
        const t = Math.min(1, (now - start) / NUDGE_MS);
        // One full sine: middle → left → middle → right → middle.
        set(50 - NUDGE_DEPTH * Math.sin(2 * Math.PI * t));
        if (t < 1) requestAnimationFrame(frame);
        else set(50);
      };
      requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((en) => en.isIntersecting)) return;
        io.disconnect();
        if (!touched) setTimeout(nudge, 300);
      },
      { threshold: 0.5 },
    );
    io.observe(root);
  });
}
