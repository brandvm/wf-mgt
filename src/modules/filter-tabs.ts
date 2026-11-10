// Filter tabs. [data-filter-tabs] holds buttons with data-filter="<key>";
// the list it filters is the next [data-filter-list] in the same section.
// Items carry data-category="<key> <key>…", or a CMS option name bound to
// the attribute ("IT & data"), which matches the key "it-data" as a whole;
// "all" shows everything. The pressed tab gets .is-active (a Designer combo,
// js-state) and aria-pressed. Items with no data-category always show.
// A [data-filter-count] inside a tab gets the number of items it shows.
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function initFilterTabs(): void {
  document.querySelectorAll<HTMLElement>('[data-filter-tabs]').forEach((group) => {
    const tabs = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-filter]'));
    const list = group.closest('section')?.querySelector<HTMLElement>('[data-filter-list]');
    const items = () => Array.from(list?.querySelectorAll<HTMLElement>(':scope > *') ?? []);
    const matches = (item: HTMLElement, key: string) => {
      const raw = item.dataset.category?.trim();
      const cats = raw ? [slug(raw), ...raw.split(/\s+/)] : null;
      return key === 'all' || !cats || cats.includes(key);
    };
    tabs.forEach((t) => {
      const count = t.querySelector<HTMLElement>('[data-filter-count]');
      if (count) count.textContent = String(items().filter((i) => matches(i, t.dataset.filter ?? 'all')).length);
    });
    const select = (tab: HTMLButtonElement) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-pressed', String(on));
      });
      const key = tab.dataset.filter ?? 'all';
      items().forEach((item) => {
        item.hidden = !matches(item, key);
      });
    };
    tabs.forEach((t) => t.addEventListener('click', () => select(t)));
  });
}
