#!/usr/bin/env node
/* The repo's own gate. Run it before shipping anything.

   Four things have to hold, and each has gone wrong at least once:
     1. every card declares a @dsCard header the Design System pane can read
     2. no card uses a class the stylesheets do not define — a silent no-op
     3. every local href/src resolves; a card that ships unstyled looks fine
        in review and wrong everywhere else
     4. every card fits the viewport it declares, and still renders

     npm run verify
*/
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { cards, ROOT } from './lib/cards.mjs';

const fails = [];
const list = cards();

/* fonts/ and assets/icons/ are generated from npm packages and gitignored.
   A clone that skipped `npm ci` has neither, and every card then renders in
   system-ui with no icons — which looks like a design bug and is not one. */
console.log('0. generated assets');
for (const [dir, script] of [['fonts', 'npm run fonts'], ['assets/icons', 'npm run icons']]) {
  const n = existsSync(join(ROOT, dir)) ? readdirSync(join(ROOT, dir)).length : 0;
  console.log(`   ${dir}: ${n} files`);
  if (n === 0) fails.push(`${dir}/ is empty or missing — run \`${script}\` (or \`npm ci\`)`);
}

console.log('1. @dsCard headers');
for (const c of list) {
  if (!/^<!--\s*@dsCard\s+group="[^"]*"[^>]*-->/.test(c.text.split('\n', 1)[0])) {
    fails.push(`${c.rel}: first line is not a @dsCard comment`);
  }
}
console.log(`   ${list.length} cards`);

console.log('2. class vocabulary');
const defined = new Set();
for (const sheet of ['components.css', '_specimen.css']) {
  for (const m of readFileSync(join(ROOT, sheet), 'utf8').matchAll(/\.([a-zA-Z][\w-]*)/g)) {
    defined.add(m[1]);
  }
}
const used = new Map();
for (const c of list) {
  for (const m of c.text.matchAll(/class="([^"]*)"/g)) {
    for (const cls of m[1].split(/\s+/).filter(Boolean)) {
      if (!used.has(cls)) used.set(cls, []);
      used.get(cls).push(c.rel);
    }
  }
}
let unknown = 0;
for (const [cls, where] of [...used].sort()) {
  if (!defined.has(cls)) {
    unknown++;
    fails.push(`class "${cls}" is used in ${where.length} card(s) but defined in no stylesheet (first: ${where[0]})`);
  }
}
console.log(`   ${used.size} distinct classes used, ${defined.size} defined, ${unknown} unknown`);

console.log('3. local references');
let refs = 0, broken = 0;
// the cover is not a card but ships with the system, so it is checked here
const checked = [...list, { rel: 'thumbnail.html', path: join(ROOT, 'thumbnail.html'),
  text: readFileSync(join(ROOT, 'thumbnail.html'), 'utf8') }];
for (const c of checked) {
  // Only real attributes: escaped example markup (&lt;link href="…"&gt;) is documentation.
  const real = c.text.replace(/&lt;[\s\S]*?&gt;/g, '');
  for (const m of real.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const ref = m[1];
    if (/^(https?:|data:|#)/.test(ref)) continue;
    refs++;
    if (!existsSync(resolve(dirname(c.path), ref))) {
      broken++;
      fails.push(`${c.rel}: ${ref} does not resolve`);
    }
  }
}
console.log(`   ${refs} references, ${broken} broken`);

console.log('4. render + fit');
const fit = spawnSync(process.execPath, [join(ROOT, 'scripts/fit.mjs')], { encoding: 'utf8' });
process.stdout.write(fit.stdout.split('\n').filter((l) => l.includes('CROPPED') || l.includes('cards,')).map((l) => `  ${l.trim()}\n`).join(''));
if (fit.status !== 0) fails.push('some cards are cropped by the viewport they declare (see above)');

console.log();
if (fails.length) {
  console.log(`✗ ${fails.length} problem(s):`);
  for (const f of fails) console.log('  -', f);
  process.exit(1);
}
console.log('✓ design system is consistent');
