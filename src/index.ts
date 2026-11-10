// Entry point. Keep this file a manifest: one run() call per module.
// Feature code lives in src/modules/<name>.ts and exports an init
// function that no-ops when its selector is absent from the page.
import { initAriaRoles } from './modules/aria-roles';
import { initCarousel } from './modules/carousel';
import { initCompare } from './modules/compare';
import { initCountUp } from './modules/count-up';
import { initCustomSelect } from './modules/custom-select';
import { initFaq } from './modules/faq';
import { initFilterTabs } from './modules/filter-tabs';
import { initFinsweetLoader } from './modules/finsweet-loader';
import { initHubspotForm } from './modules/hubspot-form';
import { initItemIcons } from './modules/item-icons';
import { initMarquee } from './modules/marquee';
import { initNav } from './modules/nav';
import { initParallax } from './modules/parallax';
import { initPlaceholders } from './modules/placeholders';
import { initReadingProgress } from './modules/reading-progress';
import { initReveal } from './modules/reveal';
import { initScrollFx } from './modules/scroll-fx';
import { initSmoothScroll, lenis } from './modules/smooth-scroll';
import { initTabs } from './modules/tabs';
import { initUniqueFormIds } from './modules/unique-form-ids';
import { initYear } from './modules/year';

// Each module runs in isolation: one that throws is logged and skipped,
// and every module after it still initializes.
function run(name: string, init: () => void) {
  try {
    init();
  } catch (error) {
    console.error(`[wfc] ${name} failed to initialize`, error);
  }
}

function boot() {
  // Release the pre-paint scroll lock set by loader.html first, before any
  // module measures the page — smooth-scroll libraries such as Lenis read
  // the scroll height at init and get ~0 while body is still locked. The
  // head snippet also has a fallback timeout.
  document.documentElement.classList.remove('is-loading');
  // Right after the lock is gone: Lenis measures the page height at init.
  run('smooth-scroll', initSmoothScroll);

  // Starter fixes for markup Webflow publishes (conventions.md §9–11).
  run('aria-roles', initAriaRoles);
  run('placeholders', initPlaceholders);
  run('unique-form-ids', initUniqueFormIds);

  // Project modules, ported unchanged from the prototype (prototype/src/main.ts).
  run('year', initYear);
  run('nav', () => { initNav(lenis); });
  run('tabs', initTabs);
  run('faq', initFaq);
  run('filter-tabs', initFilterTabs);
  // Before finsweet-loader: Finsweet reads the native selects this keeps in sync.
  run('custom-select', initCustomSelect);
  run('hubspot-form', () => { initHubspotForm(lenis); });
  run('item-icons', initItemIcons);
  run('compare', initCompare);
  run('carousel', initCarousel);
  run('count-up', initCountUp); // after carousel: reads the slides' Is Dimmed
  run('marquee', initMarquee);
  run('parallax', initParallax);
  run('scroll-fx', initScrollFx); // after smooth-scroll: hooks Lenis
  run('reveal', initReveal); // after scroll-fx: Lenis drives ScrollTrigger
  run('reading-progress', initReadingProgress);
  // Last: adds dist/fs-bundle.js on pages with fs-list-* markup (Blog, Case Studies).
  run('finsweet-loader', initFinsweetLoader);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
