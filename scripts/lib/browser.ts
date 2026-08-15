/* Shared Playwright plumbing.

   Playwright rather than a `google-chrome` command line: it resolves its own
   browser on every OS, and it can measure the page instead of guessing at
   pixels — the fit check asks the document how tall it is rather than
   scanning a screenshot for the last painted row. */

import { chromium, type Browser, type Page } from 'playwright';
import { pathToFileURL } from 'node:url';

import * as report from './report.ts';

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

/** Thrown by `openCard` when the document is not setting text in the faces it
    ships. What fixes it is a different page — see `map` below. */
export class FacesMissing extends Error {}

/* The pages `map` has run out of attempts on. What is measured there is
   measured in the fallback, and saying so beats both crashing and lying: one
   page in this repository has an `<iframe>` in it, and a `file://` frame stops
   its parent using its own faces however long anything waits. */
const lenient = new WeakSet<Page>();

/** Which of the shipped families the document is not actually using, asked the
    one way that cannot be answered wrongly: the same string in the family and
    in a family that does not exist. Equal widths mean the fallback is drawing
    both. `document.fonts` is no use — it reports every face `loaded` and
    `check()` true while the paint uses something else. */
export const missingFaces = (page: Page): Promise<string[]> =>
  page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;top:-9999px;font-size:40px;white-space:pre;letter-spacing:0';
    probe.textContent = 'MMMMMWWWWWiiiii';
    document.body.append(probe);
    const width = (family: string): number => {
      probe.style.fontFamily = family;
      return probe.getBoundingClientRect().width;
    };
    const none = width('"sds-no-such-face"');
    const missing = ['Source Sans 3', 'Source Code Pro'].filter((f) => width(`"${f}"`) === none);
    probe.remove();
    return missing;
  });

/** Force the design faces for deterministic measurements. `optional` leaves
    real navigation free to keep its fallback when a face arrives late. */
export async function loadFonts(page: Page): Promise<void> {
  await page.evaluate(async () => {
    /* Every declared face, and asked again until each one says it is loaded.
       Six pages fetching nine files off `file://` at once is a race some of
       them lose, and a lost one is silent: the text simply lays out in the
       fallback, narrower, and a caption that should have wrapped does not. */
    for (let attempt = 0; attempt < 10; attempt++) {
      await Promise.all([...document.fonts].map((face) => face.load().catch(() => face)));
      await document.fonts.ready;
      if ([...document.fonts].every((face) => face.status === 'loaded')) return;
    }
  });
}

/** Wait until the page has stopped arriving. A card references its sprite and
    its drawings as files, and an `<img>` or a `<use>` that is still being
    fetched paints nothing — the screenshot then differs from the last run for
    no reason anybody changed, which is a safety net that cries wolf. */
export async function settled(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const images = [...document.images].every((img) => img.complete);
    const refs = [...document.querySelectorAll('use')]
      .every((use) => use.getBoundingClientRect().width > 0);
    return images && refs;
  }, undefined, { timeout: 15_000 });
}

/** Launch a browser, hand it over, and close it whatever happens. `finally`
    covers the script throwing but not the script being *killed*, which is the
    case that leaves a browser re-parented to the container's init until the
    container goes. So the signals are handled here, once: a script that
    launches chromium by itself is a script that can orphan one. */
export async function withBrowser<R>(fn: (browser: Browser) => Promise<R>): Promise<R> {
  const browser = await chromium.launch();

  const shut = (signal: NodeJS.Signals) => {
    void browser.close().finally(() => {
      /* The conventional exit code for a signal, so a `make` that is
         interrupted reports interrupted rather than failed. */
      process.exit(128 + (signal === 'SIGINT' ? 2 : 15));
    });
  };
  process.once('SIGINT', shut);
  process.once('SIGTERM', shut);

  try {
    return await fn(browser);
  } finally {
    process.off('SIGINT', shut);
    process.off('SIGTERM', shut);
    await browser.close();
  }
}

export async function withPage<R>(
  fn: (tools: Mapper) => Promise<R>,
  { concurrency = 6 }: { concurrency?: number } = {},
): Promise<R> {
  return withBrowser(async (browser) => {
    return await fn({
      async map(items, job) {
        const out = new Array(items.length);
        let next = 0;

        /* One context per worker — a context is expensive and nothing here
           needs isolation between cards — and a page per item, taken again
           where the document did not use the faces it ships. A page that has
           fallen back stays fallen back however often it is reloaded; a new one
           usually does not, and three attempts have always been enough. */
        const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
          const ctx = await browser.newContext({ deviceScaleFactor: 1 });
          try {
            for (let i = next++; i < items.length; i = next++) {
              const item = items[i] as (typeof items)[number];
              for (let attempt = 0; ; attempt++) {
                const page = await ctx.newPage();
                if (attempt === 3) lenient.add(page);
                try {
                  out[i] = await job(page, item, i);
                  break;
                } catch (error) {
                  if (!(error instanceof FacesMissing) || attempt >= 3) throw error;
                } finally {
                  await page.close();
                }
              }
            }
          } finally {
            await ctx.close();
          }
        });

        await Promise.all(workers);
        return out;
      },
    });
  });
}

/** Load a card and its webfonts, so type is measured deterministically. */
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
  await loadFonts(page);
  const missing = await missingFaces(page);
  if (missing.length) {
    const said = `${card.path} is set in neither ${missing.join(' nor ')}`;
    if (!lenient.has(page)) throw new FacesMissing(said);
    report.note(`measured in the fallback face — ${said}`);
  }
  await settled(page);
}
