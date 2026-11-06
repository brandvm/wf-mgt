// Computed-style diff of one page: prototype vs Webflow staging, per class.
//   node docs/handoff/webflow/tools/page-build/styles-diff.mjs <path> [width]
// For every element in <main>, keyed by its class list (w-* and variant
// tokens dropped), compares a fixed set of computed properties and prints
// each class whose values differ, once, with the first element's values.
import { loadConfig, browser, page, bust } from '../../../../../.claude/skills/webflow-build/scripts/lib.mjs';

const [route = '/', width = '1440'] = process.argv.slice(2);
const cfg = loadConfig();
const size = cfg.widths.find(([w]) => w === +width) || [+width, 900];
const PROPS = ['display', 'flexDirection', 'alignItems', 'justifyContent', 'gap', 'paddingTop', 'paddingRight',
  'paddingBottom', 'paddingLeft', 'marginTop', 'marginBottom', 'width', 'height', 'fontFamily', 'fontSize',
  'fontWeight', 'lineHeight', 'letterSpacing', 'color', 'backgroundColor', 'borderTopWidth', 'borderTopColor',
  'borderTopLeftRadius', 'opacity', 'position', 'objectFit', 'textTransform'];

const b = await browser(cfg);
const read = async (base) => {
  const p = await page(b, cfg, base + route, size, {});
  await p.goto(bust(base + route), { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  const r = await p.evaluate((PROPS) => {
    const out = {};
    document.querySelectorAll('main [class]').forEach((e) => {
      if (typeof e.className !== 'string') return;
      const key = e.className.split(/\s+/).filter((c) => c && !c.startsWith('w-') && c !== 'ph' && !c.startsWith('ph-')).join('.');
      if (!key || out[key]) return;
      const cs = getComputedStyle(e);
      out[key] = Object.fromEntries(PROPS.map((k) => [k, cs[k]]));
    });
    return out;
  }, PROPS);
  await p.close();
  return r;
};
const P = await read(cfg.prototypeUrl);
const W = await read(cfg.stagingUrl);
await b.close();
let n = 0;
for (const key of Object.keys(P)) {
  if (!W[key]) { console.log(`only in prototype: .${key}`); continue; }
  const d = PROPS.filter((k) => P[key][k] !== W[key][k] && !(k === 'width' || k === 'height'));
  if (d.length) { n++; console.log(`.${key}\n` + d.map((k) => `   ${k}: P ${P[key][k]}  W ${W[key][k]}`).join('\n')); }
}
for (const key of Object.keys(W)) if (!P[key]) console.log(`only in webflow: .${key}`);
console.log(`\n${n} classes differ at ${size[0]}px (width/height left out: layout follows)`);
