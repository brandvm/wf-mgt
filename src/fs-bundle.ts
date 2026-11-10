// Second bundle (dist/fs-bundle.js): Finsweet Attributes, loaded only on
// pages that use them (modules/finsweet-loader.ts adds the script), so the
// ~100 KB stays out of index.js. Lesson: webflow-build › lessons/js.md
// (Finsweet recipe: keep it out of index.js).
import { initFinsweet } from './modules/finsweet';

initFinsweet();
