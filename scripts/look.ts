#!/usr/bin/env node
/* Look at one whole page, in both modes.

   `make shots` photographs every card at the size its `@dsCard` line declares,
   which is the refactor safety net and answers a different question: *did this
   move*. This one answers the first question anybody has about a page they
   just composed — **what does it look like** — and it exists because that
   question was being answered by writing the same throwaway script twice.

   A page rather than a card, so the defaults are a page's: the full height at
   1440 wide, both modes, and no animation so two runs of it are comparable.

     make look ARGS=specimens/screens/feature.html
     make look ARGS='specimens/screens/news.html 375'   # at a phone's width
     make look ARGS='specimens/screens/news.html 1440 light'   # one mode only

   A path a card declares works too — `screens/news.html` is what the bundle
   calls the same file, and typing the name a story wrote should not be an
   error just because this repo files it one level deeper.

   The files land in `test-results/`, which is gitignored and already where
   everything a person is meant to open ends up.
*/
import { existsSync, mkdirSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { withBrowser } from './lib/browser.ts';
import { inRepo, ROOT } from './lib/cards.ts';

const [file, widthArg, modeArg] = process.argv.slice(2);
if (!file) {
  console.log('usage: node scripts/look.ts <file> [width] [light|dark|both]');
  console.log('   e.g. node scripts/look.ts specimens/screens/feature.html 1440 both');
  process.exit(1);
}

/* As given, or as the bundle names it. Both are the same file. */
const target = existsSync(join(ROOT, file)) ? file : inRepo(file);

const width = Number(widthArg ?? 1440);
const modes = modeArg === 'light' || modeArg === 'dark' ? [modeArg] : (['light', 'dark'] as const);
const OUT = resolve(join(ROOT, 'test-results'));
mkdirSync(OUT, { recursive: true });

const name = basename(file).replace(/\.html$/, '');

/* `withBrowser` rather than a launch of its own: it closes the browser when
   this throws *and* when it is interrupted, and a script that opens one by
   itself is a script that can leave one running. */
await withBrowser(async (browser) => {
  for (const mode of modes) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    try {
      const page = await ctx.newPage();
      await page.goto(pathToFileURL(join(ROOT, target)).href);
      /* The mode is forced on `<html>` rather than through the emulated
         preference: that is what the theme switch does, and a page has to be
         photographed in the state a reader can actually put it in. */
      await page.evaluate((m) => document.documentElement.setAttribute('data-theme', m), mode);
      await page.evaluate(() => document.fonts.ready);
      /* Two runs have to be comparable, and a spinner mid-shot is the one thing
         that makes them differ for no reason. */
      await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });

      const out = join(OUT, `${name}-${width}-${mode}.png`);
      await page.screenshot({ path: out, fullPage: true });
      console.log(`   ${out.replace(`${ROOT}/`, '')}`);
    } finally {
      await ctx.close();
    }
  }
});
