// Filter tabs. [data-filter-tabs] holds buttons with data-filter="<key>";
// the list it filters is the next [data-filter-list] in the same section.
// Items carry data-category="<key> <key>…"; "all" shows everything. The
// pressed tab gets .is-active (a Designer combo, js-state) and aria-pressed.
// Items with no data-category always show (none have one yet: the file
// doesn't say which question belongs to which topic).
export function initFilterTabs(): void {
  document.querySelectorAll<HTMLElement>('[data-filter-tabs]').forEach((group) => {
    const tabs = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-filter]'));
    const list = group.closest('section')?.querySelector<HTMLElement>('[data-filter-list]');
    const select = (tab: HTMLButtonElement) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-pressed', String(on));
      });
      const key = tab.dataset.filter ?? 'all';
      list?.querySelectorAll<HTMLElement>(':scope > *').forEach((item) => {
        const cats = item.dataset.category?.split(/\s+/);
        item.hidden = key !== 'all' && !!cats && !cats.includes(key);
      });
    };
    tabs.forEach((t) => t.addEventListener('click', () => select(t)));
  });
}
