#!/usr/bin/env node
/* Screenshot every card at the viewport its @dsCard line declares.

   Used as the refactor safety net: capture a baseline, change things,
   capture again, `npm run diff`. A card whose pixels moved is a card whose
   meaning may have moved with it.

     node scripts/shoot.mjs [outdir]
*/
import { mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { cards, ROOT } from './lib/cards.mjs';
import { openCard, withPage } from './lib/browser.mjs';

const OUT = resolve(process.argv[2] ?? join(ROOT, '.design-sync/.cache/after'));
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const list = cards();
console.log(`shooting ${list.length} cards -> ${OUT}`);

await withPage(async ({ map }) => {
  await map(list, async (page, card) => {
    await openCard(page, card);
    // Animations (spinner, skeleton pulse) would make every run differ.
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    await page.screenshot({ path: join(OUT, `${card.rel.replaceAll('/', '__').replace(/\.html$/, '')}.png`) });
  });
});

console.log(`done: ${list.length} ok`);
