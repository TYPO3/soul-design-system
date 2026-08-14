#!/usr/bin/env node
/* Every registered element renders under SSR, and a whole page of them does.

   The rule is that all of them do, and only the ones in a card are otherwise
   asked. What this proves is narrow: each element, with no attributes set,
   renders to markup without throwing and without leaking its own tag — not that
   the markup is right, which the pixel diff does. Node has no `customElements`
   and no `document`, so an element reaching for one fails here.

     node scripts/ssr.ts
*/
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';

import { renderStatic } from '../packages/frontend/src/lib/render.ts';
import { TAGS } from '../packages/frontend/src/index.ts';
import { prerender } from './lib/prerender.ts';
import * as report from './lib/report.ts';

/* More elements than a page anybody writes, because what is being held is a
   limit and not a size: the prerender walks a page, and a walk that recurses
   once per element exhausts the stack somewhere a document cannot see coming.
   The failure is a rendered site that stops mid-build on its longest page. */
const CROWDED = 20_000;

/* What an element cannot render without — a contract rather than an
   inconvenience: `<sds-icon>` with no name has nothing to draw, and throws
   rather than drawing nothing so a binding that failed to arrive is loud. The
   check supplies the minimum rather than the element relaxing its rule. */
const REQUIRED: Readonly<Record<string, string>> = {
  'sds-icon': ' name="actions-check"',
  /* An error summary with no errors in it renders nothing on purpose: an empty
     red box above a form is a form that looks broken before it has been filled
     in. So the minimum is one failure, and what is proven here is the same
     thing as everywhere else — that the element renders in Node. */
  'sds-form-errors': ` errors='[{"message":"needed"}]'`,
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

let crowded = false;
try {
  const page = Array.from({ length: CROWDED }, (_, at) => `<sds-badge label="b${at}"></sds-badge>`).join('');
  prerender(page);
  crowded = true;
} catch (error) {
  failures.push(`a page of ${CROWDED} elements: ${error instanceof Error ? error.message : String(error)}`);
}

report.open('ssr', 'every element renders outside a browser');
if (rendered < TAGS.length) failures.push('every element has to render in Node — the card generator is the export path');
report.summary(
  `${rendered} of ${TAGS.length} elements${crowded ? ` · a page of ${CROWDED} prerendered` : ''}`,
  failures,
);
process.exit(failures.length ? 1 : 0);
