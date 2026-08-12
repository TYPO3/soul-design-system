/* Opening a story deterministically.

   `?globals=theme:light` is a request, not a fact: Storybook applies globals
   when the preview boots, and only then is `data-theme` written onto `<html>`.
   Measure before that lands and the page is still in the previous theme, which
   is how a contrast test passes alone and fails in a parallel run. So: wait for
   the theme asked for, and for the story to have rendered. */

import type { Page } from '@playwright/test';

import { loadFonts } from '../../scripts/lib/browser.ts';

export type Theme = 'dark' | 'light';

async function settleElements(page: Page): Promise<void> {
  /* A resize can make a parent render a nested element, so settle twice. */
  await page.evaluate(async () => {
    const settle = async (): Promise<void> => {
      await Promise.all(
        [...document.querySelectorAll('*')]
          .filter((el) => el.tagName.includes('-'))
          .map(async (el) => {
            await customElements.whenDefined(el.tagName.toLowerCase());
            await (el as HTMLElement & { updateComplete?: Promise<unknown> }).updateComplete;
          }),
      );
    };
    await settle();
    await settle();
  });
}

export async function resizeStory(page: Page, width: number, height = 900): Promise<void> {
  await page.setViewportSize({ width, height });
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  );
  await settleElements(page);
}

export async function setStoryTheme(page: Page, theme: Theme): Promise<void> {
  await page.evaluate((want) => {
    document.documentElement.dataset['theme'] = want;
  }, theme);
  await page.waitForFunction((want) => document.documentElement.dataset['theme'] === want, theme);
  await settleElements(page);
}

export async function gotoStory(page: Page, id: string, theme?: Theme): Promise<void> {
  const url = `/iframe.html?id=${id}&viewMode=story${theme ? `&globals=theme:${theme}` : ''}`;
  await page.goto(url);
  /* `attached`, not the default `visible`: a modal `<dialog>` is moved to the
     top layer, which leaves its container with no box at all. The question
     here is whether the story rendered, not whether it has a size. */
  await page.waitForSelector('#storybook-root > *', { state: 'attached', timeout: 15_000 });

  if (theme) {
    await page.waitForFunction(
      (want) => document.documentElement.dataset['theme'] === want,
      theme,
      { timeout: 15_000 },
    );
  }

  /* Wait for every element to upgrade before anything measures: a custom
     element upgrades asynchronously, so a colour read too early is read off
     markup that does not exist yet. Twice, because a nested element only exists
     once its parent has rendered. */
  await settleElements(page);

  /* Fonts change measured contrast and layout alike, and the specimens set
     in a vendored family that arrives over the network like any other. */
  await loadFonts(page);

  /* Freeze transitions before anything measures. Switching `data-theme` changes
     every token at once and several components carry `transition: color`, so
     axe reading inside that window sees an intermediate value and reports a
     contrast failure belonging to neither theme. Injected after navigation, so
     the stylesheet outranks the component layer. */
  await page.addStyleTag({
    content: '*, *::before, *::after { transition: none !important; animation: none !important; }',
  });
}

/* Wait until no axe run is in flight. The addon is configured not to run
   automatically, but the guard stays: axe is a single global with one run at a
   time, and a second caller is thrown "Axe is already running" rather than
   queued — a failure that only appears under parallelism. */
export async function axeIdle(page: Page): Promise<void> {
  await page
    .waitForFunction(
      () => {
        const axe = (globalThis as { axe?: { _running?: boolean } }).axe;
        return !axe || axe._running !== true;
      },
      undefined,
      { timeout: 10_000 },
    )
    .catch(() => undefined);
}
