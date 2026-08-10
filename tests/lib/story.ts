/* Opening a story deterministically.

   `?globals=theme:light` is a request, not a fact. Storybook applies globals
   when the preview boots, and the decorator in `.storybook/preview.ts` only
   then writes `data-theme` onto `<html>`. Measure before that lands and the
   page is still in the previous theme — which is exactly how the contrast
   tests passed alone and failed in a parallel run, reporting dark-mode
   colours from a test that asked for light.

   So: wait for the theme the test asked for, and for the story to have
   rendered something, before touching the page. */

import type { Page } from '@playwright/test';

export type Theme = 'dark' | 'light';

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

  /* Wait for every element to upgrade before anything measures.

     The stories render live components now, and a custom element upgrades
     asynchronously — so a colour read too early is read off markup that has
     not been produced yet. That is what made one a11y test fail on roughly
     one run in three while passing alone.

     Twice, because a nested element only exists once its parent has
     rendered, and the first pass cannot have waited for it. */
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

  /* Fonts change measured contrast and layout alike, and the specimens set
     in a vendored family that arrives over the network like any other. */
  await page.evaluate(() => document.fonts.ready);

  /* Freeze transitions before anything measures.

     Switching `data-theme` changes every colour token at once, and several
     components carry `transition: color` — so a theme switch animates the
     whole page for 140ms. axe reading a colour inside that window sees an
     intermediate value and reports a contrast failure that exists for a
     tenth of a second and belongs to neither theme. That is what made the
     navigation specimen fail on some runs and pass on others.

     Injected after navigation rather than as an init script, because the
     stylesheet has to outrank the component layer and be present when the
     story renders. */
  await page.addStyleTag({
    content: '*, *::before, *::after { transition: none !important; animation: none !important; }',
  });
}

/* Wait until no axe run is in flight.

   The a11y addon is configured not to run automatically, but the guard stays:
   axe is a single global with one run at a time, and a second caller gets a
   thrown "Axe is already running" rather than a queue. That failure only
   appears under parallelism, which makes it the kind of flake that gets
   re-run rather than fixed. */
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
