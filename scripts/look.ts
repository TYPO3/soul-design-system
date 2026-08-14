#!/usr/bin/env node
/* Look at one whole page, in both modes.

   `make shots` answers *did this move*; this answers **what does it look
   like**, with a page's defaults: full height at 1440, both modes, no
   animation, into `.out/test-results/`. Scrolled, it is one screen.

     make look ARGS='specimens/screens/news.html 375'   # at a phone's width
     make look ARGS='specimens/screens/news.html 1440 light'   # one mode only
     make look ARGS='http://site:4173/ 1400 both 800'   # 800px down the page
*/
import { existsSync, mkdirSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { loadFonts, withBrowser } from './lib/browser.ts';
import { inRepo, GENERATED, ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

report.open('look', 'photograph one page in both modes');

const [file, widthArg, modeArg, scrollArg] = process.argv.slice(2);
if (!file) {
  report.summary('which page?', [
    'node scripts/look.ts <file> [width] [light|dark|both]',
    'e.g. node scripts/look.ts specimens/screens/feature.html 1440 both',
  ]);
  process.exit(1);
}

/* As given, or as the bundle names it. Both are the same file. */
const target = existsSync(join(ROOT, file)) ? file : inRepo(file);

/* A URL is opened as a URL. A page loading an ES module cannot be photographed
   over `file://` — the browser blocks module scripts there, so every element
   stays unupgraded and the picture is of a page nobody will ever see. The
   rendered site is served by its own container for exactly this reason. A card
   or a screen is still a file, and files carry no modules. */
const address = /^https?:/.test(file) ? file : pathToFileURL(join(ROOT, target)).href;

const width = Number(widthArg ?? 1440);
const scroll = Number(scrollArg ?? 0);
const modes = modeArg === 'light' || modeArg === 'dark' ? [modeArg] : (['light', 'dark'] as const);
const OUT = resolve(join(GENERATED, 'test-results'));
mkdirSync(OUT, { recursive: true });

const name = (basename(file).replace(/\.html$/, '') || 'index').replace(/[^\w.-]/g, '-');

/* `withBrowser` rather than a launch of its own: it closes the browser when
   this throws *and* when it is interrupted, and a script that opens one by
   itself is a script that can leave one running. */
await withBrowser(async (browser) => {
  for (const mode of modes) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    try {
      const page = await ctx.newPage();
      await page.goto(address);
      /* The mode is forced on `<html>` rather than through the emulated
         preference: that is what the theme switch does, and a page has to be
         photographed in the state a reader can actually put it in. */
      await page.evaluate((m) => document.documentElement.setAttribute('data-theme', m), mode);
      await loadFonts(page);
      /* Two runs have to be comparable, and a spinner mid-shot is the one thing
         that makes them differ for no reason. */
      await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });

      /* A full-height picture is always of the top of the page, whatever the
         window has been scrolled to — so asking for a scroll is asking for the
         screen at that point, which is the only place a pinned thing exists. */
      if (scroll) await page.evaluate((y) => window.scrollTo(0, y), scroll);

      const out = join(OUT, `${name}-${width}-${mode}${scroll ? `-at${scroll}` : ''}.png`);
      await page.screenshot({ path: out, fullPage: !scroll });
      report.fact(out.replace(`${ROOT}/`, ''));
    } finally {
      await ctx.close();
    }
  }
});
