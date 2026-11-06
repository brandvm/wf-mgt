// Count-up. A [data-count] number counts from 0 to the value in its markup
// at a steady rate (no easing), the first time it comes into view. Inside a
// [data-carousel-slide] it counts only while that slide is current (no
// .is-dimmed), and again each time the slide becomes current. The markup
// keeps the final value, so the Designer canvas and no-JS visitors see the
// real number. Text around the number ("$", "k+") is kept.
const DURATION = 1600;

// The first text node that holds a digit: "105" in `105<div>+</div>`.
const numberNode = (el: HTMLElement): Text | null => {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if (/\d/.test(n.nodeValue ?? '')) return n as Text;
  return null;
};

export function initCountUp(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!els.length) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  els.forEach((el) => {
    const node = numberNode(el);
    const match = node?.data.match(/^(\D*)(\d+(?:\.\d+)?)([\s\S]*)$/);
    if (!node || !match) return;
    const [, before, digits, after] = match;
    const target = parseFloat(digits);
    const decimals = digits.split('.')[1]?.length ?? 0;
    const show = (v: number) => (node.data = before + v.toFixed(decimals) + after);

    const slide = el.closest<HTMLElement>('[data-carousel-slide]');
    const isCurrent = () => !slide || !slide.classList.contains('is-dimmed');
    let inView = false;
    let played = false;
    let raf = 0;

    const play = () => {
      played = true;
      cancelAnimationFrame(raf);
      if (still) return show(target);
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / DURATION);
        show(target * p);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      show(0);
      raf = requestAnimationFrame(tick);
    };

    const update = () => {
      if (!isCurrent()) {
        // A side slide: the full value, and count again when it is current.
        cancelAnimationFrame(raf);
        show(target);
        played = false;
        return;
      }
      if (played) return;
      if (inView) play();
      else if (!still) show(0); // waiting to count: don't flash the value first
    };
    update();

    new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        update();
      },
      { threshold: 0.6 },
    ).observe(el);
    if (slide) new MutationObserver(update).observe(slide, { attributes: true, attributeFilter: ['class'] });
  });
}
