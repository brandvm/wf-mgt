// Reading progress (motion-plan.md 23). A bar fills as the reader moves
// through an article.
//
// Markup: [data-reading-progress] on the bar (Webflow class Reading Progress,
// Blog Posts Template: fixed at the top, 3px, Brand/Yellow, transform-origin
// left, transform scaleX(0) so the first paint is empty). Its value is the
// selector of the text it follows; empty means the page's first Rich Text.
//
// The bar's scaleX is 0 when the text's top reaches the top of the screen
// and 1 when its bottom reaches the bottom. It follows the scroll exactly
// (no easing) and stays under reduced motion: it is information, not effect.
export function initReadingProgress(): void {
  const bar = document.querySelector<HTMLElement>('[data-reading-progress]');
  if (!bar) return;
  const body = document.querySelector<HTMLElement>(bar.dataset.readingProgress || '.w-richtext');
  if (!body) return;

  let raf = 0;
  const update = () => {
    raf = 0;
    const r = body.getBoundingClientRect();
    const travel = r.height - window.innerHeight;
    const p = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : r.top < 0 ? 1 : 0;
    bar.style.transform = `scaleX(${p.toFixed(4)})`;
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
}
