#!/usr/bin/env node
/* Materialise assets/icons/ from the @typo3/icons package.

   The icons are TYPO3's own, and the identifiers below are the core's own —
   the same strings `typo3_icon_lookup` returns — so design and runtime name
   the same thing. Pulling them from the package instead of committing copies
   means npm owns the version and drift is impossible.

   A missing icon is contributed upstream, never drawn locally and never
   substituted from another set. So this script FAILS if a declared
   identifier does not exist in the package: that is the rule enforcing
   itself, not an inconvenience to work around.

   Runs from `prepare`, so a fresh `npm ci` leaves a working tree.

     npm run icons
*/
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from './lib/cards.mjs';

/* The 33 icons this design system uses. Adding one here is the only step
   needed to ship it; if it is not upstream yet, contribute it there first. */
const ICONS = [
  'actions-arrow-right', 'actions-book', 'actions-check', 'actions-check-circle',
  'actions-chevron-down', 'actions-chevron-end', 'actions-chevron-start', 'actions-chevron-up',
  'actions-clock', 'actions-close', 'actions-code', 'actions-code-commit',
  'actions-code-compare', 'actions-code-pull-request', 'actions-cog', 'actions-database',
  'actions-debug', 'actions-duplicate', 'actions-exclamation-circle',
  'actions-exclamation-triangle', 'actions-extension', 'actions-filter', 'actions-history',
  'actions-info-circle', 'actions-link', 'actions-list', 'actions-menu-alternative',
  'actions-play', 'actions-question-circle', 'actions-refresh', 'actions-search',
  'actions-tag', 'actions-window-open',
];

const PKG = join(ROOT, 'node_modules', '@typo3', 'icons');
const OUT = join(ROOT, 'assets', 'icons');

/* `src/` rather than `dist/svgs/`: dist is SVGO-optimised, and these files
   are read by people deciding what to inline. The rendered result is the
   same either way. */
const missing = ICONS.filter((id) => !existsSync(join(PKG, 'src', id.split('-')[0], `${id}.svg`)));
if (missing.length) {
  console.error(`✗ not in @typo3/icons: ${missing.join(', ')}`);
  console.error('  Contribute the icon to TYPO3/TYPO3.Icons — do not draw it locally.');
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const id of ICONS) {
  copyFileSync(join(PKG, 'src', id.split('-')[0], `${id}.svg`), join(OUT, `${id}.svg`));
}
copyFileSync(join(PKG, 'LICENSE'), join(OUT, 'LICENSE-TYPO3.Icons.txt'));

const version = JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf8')).version;
console.log(`assets/icons/ — ${ICONS.length} icons from @typo3/icons@${version}, MIT`);
