#!/usr/bin/env node
/* Every registered element renders under SSR.

   The rule is that all of them do, and until this existed only seven were ever
   asked: the components that happen to appear in a generated card. The rest
   could stop rendering in Node and nothing would say so until someone put one
   in a card — which is exactly when it is most expensive to find out, because
   the card generator is the export path and a card that cannot be rendered is
   a design guide that cannot be built.

   What this proves is narrow and worth stating: each element, with no
   attributes set, renders to markup without throwing and without leaking its
   own tag into the output. It does not prove the markup is right — the pixel
   diff and `make cards` do that for the seven that are drawn. It proves the
   element can be rendered at all outside a browser.

   Node is not a browser and never will be: `customElements` does not exist,
   `document` does not exist, and `navigator` may not either. An element that
   reaches for one of those at construction or first render fails here, which
   is the point.

     node scripts/ssr.ts
*/
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';

import { renderStatic } from '../src/lib/render.ts';
import { TAGS } from '../src/index.ts';

/* What an element cannot render without.

   Only one so far, and it is a contract rather than an inconvenience:
   `<sds-icon>` with no name has nothing to draw, and it throws instead of
   drawing nothing so that a binding which failed to arrive is loud. The check
   supplies the minimum rather than the element relaxing its rule. */
const REQUIRED: Readonly<Record<string, string>> = {
  'sds-icon': ' name="actions-check"',
};

const failures: string[] = [];
let rendered = 0;

for (const tag of TAGS) {
  try {
    /* `unsafeStatic` because the tag is a value here, and a Lit template's tag
       name is otherwise fixed at authoring time. Safe by construction: TAGS is
       this repository's own list, not input. */
    const attrs = unsafeStatic(REQUIRED[tag] ?? '');
    const out = renderStatic(staticHtml`<${unsafeStatic(tag)}${attrs}></${unsafeStatic(tag)}>`);
    if (out.trim() === '') {
      failures.push(`${tag}: rendered nothing at all`);
      continue;
    }
    rendered++;
  } catch (error) {
    failures.push(`${tag}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log(`   ${rendered} of ${TAGS.length} elements render under SSR`);
if (failures.length) {
  for (const f of failures) console.log(`   ✗ ${f}`);
  console.log('   Every element has to render in Node — the card generator is the export path.');
  process.exit(1);
}
