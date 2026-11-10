// Expandable text: a "Learn more" link that opens a hidden paragraph in
// place (Home hero and About, as on the live site).
//
// Markup (Webflow):
//   <a data-expand-trigger="<key>" data-expand-less="Show less"> label + icon </a>
//   <div class="expand-panel" data-expand-panel="<key>" inert>   (Expand Panel)
//     <div class="expand-inner"> … </div>                      (Expand Inner)
//   </div>
// The closed state is the Designer's: Expand Panel is a one-row grid at 0fr
// and Expand Inner clips it; Expand Panel › Is Open is 1fr, and the class's
// transition animates the height. `inert` in the markup keeps the closed
// panel's links out of the tab order and the reading order until it opens.
// The module toggles Is Open and `inert`, sets aria-expanded/aria-controls
// on the trigger and swaps its first text for data-expand-less while open.
// The trigger keeps its href, so without JS it still goes somewhere useful.
//
// The panel is found by its matching data-expand-panel, or else as the
// nearest .expand-panel around the trigger (the closest ancestor holding
// one): the API can't write attributes inside the page shell's slot, so
// Home's panels carry only the Expand Panel class (GOTCHAS 2026-11-06).
let uid = 0;

function findPanel(trigger: HTMLElement, key?: string): HTMLElement | null {
  const named = key ? document.querySelector<HTMLElement>(`[data-expand-panel="${CSS.escape(key)}"]`) : null;
  if (named) return named;
  for (let el = trigger.parentElement; el; el = el.parentElement) {
    const near = el.querySelector<HTMLElement>('.expand-panel');
    if (near) return near;
  }
  return null;
}

export function initExpand(): void {
  document.querySelectorAll<HTMLElement>('[data-expand-trigger]').forEach((trigger) => {
    const key = trigger.dataset.expandTrigger;
    const panel = findPanel(trigger, key);
    if (!panel) return;
    panel.id ||= `expand-${++uid}`;
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-controls', panel.id);
    trigger.setAttribute('aria-expanded', 'false');

    // The first text node with words: "Learn more" inside the link.
    const walker = document.createTreeWalker(trigger, NodeFilter.SHOW_TEXT);
    let label: Text | null = null;
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if ((n.nodeValue ?? '').trim()) {
        label = n as Text;
        break;
      }
    }
    const more = label?.data ?? '';
    const less = trigger.dataset.expandLess;

    const set = (open: boolean) => {
      panel.classList.toggle('is-open', open);
      panel.toggleAttribute('inert', !open);
      trigger.setAttribute('aria-expanded', String(open));
      if (label && less) label.data = open ? less : more;
    };
    set(false);

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      set(trigger.getAttribute('aria-expanded') !== 'true');
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key !== ' ') return;
      event.preventDefault();
      trigger.click();
    });
  });
}
