#!/usr/bin/env node
/* Screenshot every card at the viewport its @dsCard line declares.

   Used as the refactor safety net: capture a baseline, change things,
   capture again, `make diff`. A card whose pixels moved is a card whose
   meaning may have moved with it.

     node scripts/shoot.ts [outdir]
*/
import { mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { cards, ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';
import { openCard, withPage } from './lib/browser.ts';

const OUT = resolve(process.argv[2] ?? join(ROOT, '.design-sync/.cache/after'));
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const list = cards();
report.open('shots', `photograph every card into ${OUT}`);

await withPage(async ({ map }) => {
  await map(list, async (page, card) => {
    await openCard(page, card);
    // Animations (spinner, skeleton pulse) would make every run differ.
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    await page.screenshot({ path: join(OUT, `${card.rel.replaceAll('/', '__').replace(/\.html$/, '')}.png`) });
  });
});

report.summary(`${list.length} cards photographed`);
