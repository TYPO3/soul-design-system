#!/usr/bin/env node
/* Look at one whole page, in both modes.

   `make shots` photographs every card at the size its `@dsCard` line declares,
   which is the refactor safety net and answers a different question: *did this
   move*. This one answers the first question anybody has about a page they
   just composed — **what does it look like** — and it exists because that
   question was being answered by writing the same throwaway script twice.

   A page rather than a card, so the defaults are a page's: the full height at
   1440 wide, both modes, and no animation so two runs of it are comparable.

     make look ARGS=screens/feature.html
     make look ARGS='screens/news.html 375'          # at a phone's width
     make look ARGS='screens/news.html 1440 light'   # one mode only

   The files land in `test-results/`, which is gitignored and already where
   everything a person is meant to open ends up.
*/
import { mkdirSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { chromium } from 'playwright';

import { ROOT } from './lib/cards.ts';

const [file, widthArg, modeArg] = process.argv.slice(2);
if (!file) {
  console.log('usage: node scripts/look.ts <file> [width] [light|dark|both]');
  console.log('   e.g. node scripts/look.ts screens/feature.html 1440 both');
  process.exit(1);
}

const width = Number(widthArg ?? 1440);
const modes = modeArg === 'light' || modeArg === 'dark' ? [modeArg] : (['light', 'dark'] as const);
const OUT = resolve(join(ROOT, 'test-results'));
mkdirSync(OUT, { recursive: true });

const name = basename(file).replace(/\.html$/, '');
const browser = await chromium.launch();

for (const mode of modes) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(join(ROOT, file)).href);
  /* The mode is forced on `<html>` rather than through the emulated preference:
     that is what the theme switch does, and a page has to be photographed in
     the state a reader can actually put it in. */
  await page.evaluate((m) => document.documentElement.setAttribute('data-theme', m), mode);
  await page.evaluate(() => document.fonts.ready);
  // Two runs must be comparable, and a spinner mid-sweep is the one thing that
  // makes them differ for no reason.
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });

  const out = join(OUT, `${name}-${width}-${mode}.png`);
  await page.screenshot({ path: out, fullPage: true });
  console.log(`   ${out.replace(`${ROOT}/`, '')}`);
  await ctx.close();
}

await browser.close();
