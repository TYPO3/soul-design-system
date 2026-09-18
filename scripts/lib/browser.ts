/* Shared Playwright plumbing.

   Playwright rather than a `google-chrome` command line. It resolves its own
   browser on every OS, and it can measure the page instead of guess at
   pixels. The fit check asks the document how tall it is rather than scans a
   screenshot for the last painted row. */

import { chromium, type Browser, type Page } from 'playwright';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FRONTEND } from './cards.ts';

import * as report from './report.ts';

/** What a card needs to open: where it is and how big it declares itself. */
export interface Openable {
  path: string;
  width: number;
  height: number;
}

export interface Mapper {
  /** Run `job` over `items`, one page at a time — see `withPage`. */
  map<T, R>(items: readonly T[], job: (page: Page, item: T, index: number) => Promise<R>): Promise<R[]>;
}

/** Thrown by `openCard` when the document is not setting text in the faces it
    ships. What fixes it is a different page — see `map` below. */
export class FacesMissing extends Error {}

/* The pages `map` has run out of tries on. The measurement there is in the
   fallback, and to say so beats both a crash and a lie. One page in this
   repository has an `<iframe>` in it, and a `file://` frame stops its parent
   from its own faces, whatever the wait. */
const lenient = new WeakSet<Page>();

/** Which of the shipped families the document does not use, asked the one
    way that has no wrong answer. The same string in the family and in a
    family that does not exist. Equal widths mean the fallback draws both.
    `document.fonts` is no use — it reports every face `loaded` and `check()`
    true while the paint uses something else. */
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

interface Face {
  family: string;
  style: string;
  weight: string;
  range: string;
  src: string;
}

/** The faces the cards link, as `fonts.css` declares them, read once. Once
    `font-display: optional` runs out of patience a `file://` page keeps its
    fallback for good, whatever `load()` says later. A disk that answers
    late loses that race on every page, because `file://` passes every cache
    the browser has. A face added through the API has no such period. Text
    set in it switches when the file arrives. So the same declarations go in
    again by hand, because the CSSOM of a `file://` stylesheet is out of
    reach from a `file://` document. */
const FACES: readonly Face[] = (() => {
  const dir = join(FRONTEND, 'fonts');
  const css = readFileSync(join(dir, 'fonts.css'), 'utf8');
  return [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map((m) => {
    const block = m[1] ?? '';
    const get = (name: string): string => (block.match(new RegExp(`${name}:\\s*([^;]+);`)) ?? [])[1]?.trim() ?? '';
    return {
      family: get('font-family').replace(/^'|'$/g, ''),
      style: get('font-style') || 'normal',
      weight: get('font-weight') || 'normal',
      range: get('unicode-range') || 'U+0-10FFFF',
      src: get('src').replace(/url\('([^']+)'\)/, (_, file: string) => `url('${pathToFileURL(join(dir, file)).href}')`),
    };
  });
})();

/** Force the design faces for deterministic measurements. `optional` leaves
    real navigation free to keep its fallback when a face arrives late. */
export async function loadFonts(page: Page): Promise<void> {
  /* Every declared face, asked again until the *probe* agrees. A loop on
     `face.status` is a loop on the answer this file already says is
     unreliable. It reads `loaded` while the paint uses something else, so the
     loop ended happy and the page measured in the fallback. */
  for (let attempt = 0; attempt < 10; attempt++) {
    await page.evaluate(async () => {
      await Promise.all([...document.fonts].map((face) => face.load().catch(() => face)));
      await document.fonts.ready;
    });
    if (!(await missingFaces(page)).length) return;
    /* The page has given up on the linked faces. The same ones again, through
       the API, which does not give up. A `file://` page only: a served page
       has a cache behind it, and it cannot load a `file://` face at all. */
    if (attempt === 0 && page.url().startsWith('file:')) {
      await page.evaluate(async (faces: readonly Face[]) => {
        for (const f of faces) {
          const face = new FontFace(f.family, f.src, { weight: f.weight, style: f.style, unicodeRange: f.range, display: 'block' });
          document.fonts.add(face);
          await face.load().catch(() => face);
        }
        await document.fonts.ready;
      }, FACES);
    }
  }
}

/** Wait until the page has all arrived. A card references its sprite and its
    drawings as files, and an `<img>` or a `<use>` still in flight paints
    nothing. The screenshot then differs from the last run for no reason
    anybody changed, which is a safety net that cries wolf. */
export async function settled(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const images = [...document.images].every((img) => img.complete);
    const refs = [...document.querySelectorAll('use')]
      .every((use) => use.getBoundingClientRect().width > 0);
    return images && refs;
  }, undefined, { timeout: 15_000 });
}

/** Launch a browser, hand it over, and close it whatever happens. `finally`
    covers a throw but not a *kill*. That is the case that leaves a browser
    re-parented to the container's init until the container goes. So the
    signals get their handler here, once: a script that launches chromium by
    itself is a script that can orphan one. */
export async function withBrowser<R>(fn: (browser: Browser) => Promise<R>): Promise<R> {
  /* The same page twice has to give the same bytes. On its own Chromium
     picks a colour profile from the host and positions glyphs at subpixel
     offsets. It antialiases text against the ground it thinks it has. All of
     those vary, and each turns a rounded corner into a pixel that differs by
     one between two runs of an unchanged tree. */
  const browser = await chromium.launch({
    args: [
      '--force-color-profile=srgb',
      '--disable-lcd-text',
      '--disable-font-subpixel-positioning',
      '--disable-partial-raster',
    ],
  });

  const shut = (signal: NodeJS.Signals) => {
    void browser.close().finally(() => {
      /* The conventional exit code for a signal, so a `make` that stops on a
         signal reports interrupted rather than failed. */
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

export async function withPage<R>(fn: (tools: Mapper) => Promise<R>): Promise<R> {
  return withBrowser(async (browser) => {
    const ctx = await browser.newContext({ deviceScaleFactor: 1 });
    try {
      return await fn({
        async map(items, job) {
          const out = new Array(items.length);
          /* One page at a time. Six of them that fetch nine `file://` faces at
             once is a race, and the loser lays out in the fallback in silence.
             Serial, nothing races. The fallback stays only where nothing can
             win it. Two runs of the same tree differ in nothing or in one
             pixel of corner antialiasing. It costs `shots` six seconds and
             `fit` eight. */
          for (const [i, item] of items.entries()) {
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
          return out;
        },
      });
    } finally {
      await ctx.close();
    }
  });
}

/** Load a card and its webfonts, so type measures the same every time. */
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
    const said = `${card.path} sets in neither ${missing.join(' nor ')}`;
    if (!lenient.has(page)) throw new FacesMissing(said);
    report.note(`measured in the fallback face — ${said}`);
  }
  await settled(page);
}
