/* Shared Playwright plumbing.

   Playwright rather than a `google-chrome` command line: it resolves its own
   browser on every OS, and it can measure the page instead of guessing at
   pixels — the fit check asks the document how tall it is rather than
   scanning a screenshot for the last painted row. */

import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';

export async function withPage(fn, { concurrency = 6 } = {}) {
  const browser = await chromium.launch();
  try {
    return await fn({
      /** Run `job` over `items`, at most `concurrency` pages at a time. */
      async map(items, job) {
        const out = new Array(items.length);
        let next = 0;
        const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
          const ctx = await browser.newContext({ deviceScaleFactor: 1 });
          const page = await ctx.newPage();
          try {
            for (let i = next++; i < items.length; i = next++) {
              out[i] = await job(page, items[i], i);
            }
          } finally {
            await ctx.close();
          }
        });
        await Promise.all(workers);
        return out;
      },
    });
  } finally {
    await browser.close();
  }
}

/** Load a card and wait for its webfonts, so type never measures mid-swap. */
export async function openCard(page, card, { width, height } = {}) {
  await page.setViewportSize({
    width: width ?? card.width,
    height: height ?? card.height,
  });
  await page.goto(pathToFileURL(card.path).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
}
