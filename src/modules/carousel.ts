// Looping slider on a scroll-snap track. [data-carousel] holds
// [data-carousel-track] with [data-carousel-slide]s and the
// [data-carousel-prev] / [data-carousel-next] buttons. The slide nearest the
// centre is current; the others get .is-dimmed (a Designer combo, js-state).
//
// The loop moves slides, not clones: after each scroll (and before each arrow
// step) slides are taken from one end and put on the other so the current
// one sits in the middle of the list, and scrollLeft is corrected by the same
// amount, so nothing moves on screen. The current slide stays the same
// element, so its dimming and count-up are not restarted. With fewer than
// three slides it doesn't loop. It starts on the first slide in the markup.
export function initCarousel(): void {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('[data-carousel-track]');
    if (!track) return;
    const list = () => Array.from(track.querySelectorAll<HTMLElement>('[data-carousel-slide]'));
    const first = list()[0];
    if (!first) return;
    const loops = list().length >= 3;

    const current = () => {
      const mid = track.getBoundingClientRect().left + track.clientWidth / 2;
      let best = first;
      let dist = Infinity;
      list().forEach((s) => {
        const r = s.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < dist) [best, dist] = [s, d];
      });
      return best;
    };
    const mark = () => {
      const c = current();
      list().forEach((s) => s.classList.toggle('is-dimmed', s !== c));
    };
    // The scroll position that puts a slide in the middle of the track.
    const centre = (s: HTMLElement) => {
      const t = track.getBoundingClientRect();
      const r = s.getBoundingClientRect();
      return track.scrollLeft + (r.left - t.left) - (track.clientWidth - r.width) / 2;
    };
    // Rotate the slides so `c` is in the middle of the list, without a visible jump.
    const recentre = (c: HTMLElement) => {
      if (!loops) return;
      const before = c.getBoundingClientRect().left;
      const middle = Math.floor(list().length / 2);
      for (let s = list(); s.indexOf(c) > middle; s = list()) s[s.length - 1].after(s[0]);
      for (let s = list(); s.indexOf(c) < middle; s = list()) s[0].before(s[s.length - 1]);
      track.scrollLeft += c.getBoundingClientRect().left - before;
    };
    const go = (step: number) => {
      const c = current();
      recentre(c);
      const s = list();
      const next = s[Math.min(s.length - 1, Math.max(0, s.indexOf(c) + step))];
      const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollTo({ left: centre(next), behavior: still ? 'auto' : 'smooth' });
    };
    root.querySelector('[data-carousel-prev]')?.addEventListener('click', () => go(-1));
    root.querySelector('[data-carousel-next]')?.addEventListener('click', () => go(1));

    let raf = 0;
    let idle = 0;
    const settle = () => recentre(current());
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(mark);
      // scrollend isn't fired everywhere (older Safari, some programmatic
      // scrolls), so also settle once scrolling has paused. Settling twice is harmless.
      clearTimeout(idle);
      idle = window.setTimeout(settle, 150);
    }, { passive: true });
    track.addEventListener('scrollend', settle);

    recentre(first);
    track.scrollTo({ left: centre(first), behavior: 'auto' });
    mark();
  });
}
