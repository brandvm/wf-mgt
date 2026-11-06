// Current year in the footer's copyright line, so it never goes stale.
// The Designer canvas runs no script, so it shows the year typed in the
// element.
// Markup: any element with data-year.
export function initYear() {
  document.querySelectorAll<HTMLElement>('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}
