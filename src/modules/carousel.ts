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
//
// With only a few slides (3 to MIN_SLIDES - 1) the slide being moved to the
// other end is still on screen, so the move shows as a jump. The set is then
// repeated until there are at least MIN_SLIDES. Copies are hidden from
// assistive tech (aria-hidden) and their links and buttons leave the tab
// order, so each slide is announced and focused once; they still work on
// click. Runs before count-up and parallax, so the copies get those too.
const MIN_SLIDES = 8;

export function initCarousel(): void {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('[data-carousel-track]');
    if (!track) return;
    const list = () => Array.from(track.querySelectorAll<HTMLElement>('[data-carousel-slide]'));
    const first = list()[0];
    if (!first) return;
    const loops = list().length >= 3;

    const originals = list();
    if (loops && originals.length < MIN_SLIDES) {
      const parent = originals[originals.length - 1].parentElement ?? track;
      while (list().length < MIN_SLIDES) {
        originals.forEach((s) => {
          const copy = s.cloneNode(true) as HTMLElement;
          copy.setAttribute('aria-hidden', 'true');
          copy.setAttribute('data-carousel-copy', '');
          copy.removeAttribute('id');
          copy.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
          copy.querySelectorAll('a, button, input, select, textarea, [tabindex]')
            .forEach((el) => el.setAttribute('tabindex', '-1'));
          parent.appendChild(copy);
        });
      }
    }

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
