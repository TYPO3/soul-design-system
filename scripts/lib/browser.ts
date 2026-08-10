/* Shared Playwright plumbing.

   Playwright rather than a `google-chrome` command line: it resolves its own
   browser on every OS, and it can measure the page instead of guessing at
   pixels — the fit check asks the document how tall it is rather than
   scanning a screenshot for the last painted row. */

import { chromium, type Page } from 'playwright';
import { pathToFileURL } from 'node:url';

/** What a card needs to be opened: where it is and how big it declares itself. */
export interface Openable {
  path: string;
  width: number;
  height: number;
}

export interface Mapper {
  /** Run `job` over `items`, at most `concurrency` pages at a time. */
  map<T, R>(items: readonly T[], job: (page: Page, item: T, index: number) => Promise<R>): Promise<R[]>;
}

export async function withPage<R>(
  fn: (tools: Mapper) => Promise<R>,
  { concurrency = 6 }: { concurrency?: number } = {},
): Promise<R> {
  const browser = await chromium.launch();
  try {
    return await fn({
      async map(items, job) {
        const out = new Array(items.length);
        let next = 0;

        /* One context per worker, not one per item: a context is expensive to
           create and nothing here needs isolation between cards. */
        const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
          const ctx = await browser.newContext({ deviceScaleFactor: 1 });
          const page = await ctx.newPage();
          try {
            for (let i = next++; i < items.length; i = next++) {
              out[i] = await job(page, items[i] as (typeof items)[number], i);
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
export async function openCard(
  page: Page,
  card: Openable,
  { width, height }: { width?: number; height?: number } = {},
): Promise<void> {
  await page.setViewportSize({
    width: width ?? card.width,
    height: height ?? card.height,
  });
  await page.goto(pathToFileURL(card.path).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
}
