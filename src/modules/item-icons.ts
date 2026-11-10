// Item icons: the service page's scope tiles take their Phosphor icons from
// one CMS field (Services › Item Icons), because the collection has no room
// for five icon fields (cms-plan.md › Services, option a).
//
// Markup: [data-item-icons] on the tile list, its value bound to Item Icons,
// e.g. "ph-desk, ph-office-chair, ph-columns, ph-users-three, ph-archive";
// each tile's icon box is an [data-item-icon] element holding an Icon Size
// instance whose Icon prop is just "ph" (the attribute can't go on the
// instance's own <i>). The n-th name goes to the <i> in the n-th box.
// "ph ph-desk" and "desk" are accepted too; anything that isn't a Phosphor
// name is skipped, so a typo leaves that tile empty, never broken.
//
// First paint: the tiles are sized by their classes, so an empty glyph until
// the script runs moves nothing.
const NAME = /^(?:ph\s+)?(?:ph-)?([a-z0-9]+(?:-[a-z0-9]+)*)$/;

export function initItemIcons() {
  document.querySelectorAll<HTMLElement>('[data-item-icons]').forEach((list) => {
    const names = (list.dataset.itemIcons || '').split(',').map((s) => s.trim().toLowerCase());
    list.querySelectorAll<HTMLElement>('[data-item-icon]').forEach((box, i) => {
      const match = names[i]?.match(NAME);
      const glyph = box.tagName === 'I' ? box : box.querySelector('i');
      if (!match || !glyph) return;
      glyph.classList.add('ph', `ph-${match[1]}`);
    });
  });
}
