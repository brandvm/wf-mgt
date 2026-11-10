// Loads dist/fs-bundle.js (Finsweet Attributes) only on pages whose markup
// uses one of the bundled attributes (Blog and Case Studies listings:
// fs-list-*). The script comes from the same base and query string as
// index.js, so a release loads its own matching Finsweet bundle.
//
// FS_NAMES must list the attributes in finsweet-registry.ts (`pnpm finsweet
// add <name>`); it is a literal so index.js doesn't import the registry,
// which would pull all of Finsweet into this bundle.
const FS_NAMES = ['list'];

// document.currentScript is only set while index.js first executes, so it
// is read when this module is evaluated, not in the init function.
const ownScript = document.currentScript as HTMLScriptElement | null;

export function initFinsweetLoader() {
  const used = FS_NAMES.some((name) => document.querySelector(`[fs-${name}-element]`));
  if (!used) return;
  // A Finsweet CDN tag left in Webflow would initialise the same elements twice.
  if (document.querySelector('script[src*="@finsweet/attributes"]')) return;
  const src = ownScript?.src || document.querySelector<HTMLScriptElement>('script[src*="/index.js"]')?.src;
  if (!src) return;
  const url = new URL(src);
  url.pathname = url.pathname.replace(/index\.js$/, 'fs-bundle.js');
  const script = document.createElement('script');
  script.src = url.href;
  document.head.appendChild(script);
}
