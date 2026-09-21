/* A story opened in the built Storybook, the same way every time, and a
   page settled before it measures.

   `?globals=theme:light` is a request, not a fact. Storybook applies globals
   when the preview boots, and only then does `data-theme` land on `<html>`.
   Measure before that lands and the page is still in the previous theme. So:
   wait for the theme asked for, and for the story to have rendered. The
   stories themselves run under Vitest; this is for the specs that open the
   shell around them. */

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

/** A viewport change handed to whatever measures itself: two frames, and then
    every element's own update. Nothing about it is a story — the bar in a
    rendered page reads its room the same way. */
export async function resizeTo(page: Page, width: number, height = 900): Promise<void> {
  await page.setViewportSize({ width, height });
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  );
  await settleElements(page);
}

export async function gotoStory(page: Page, id: string, theme?: Theme): Promise<void> {
  const url = `/iframe.html?id=${id}&viewMode=story${theme ? `&globals=theme:${theme}` : ''}`;
  await page.goto(url);
  /* `attached`, not the default `visible`. A modal `<dialog>` moves to the
     top layer, which leaves its container with no box at all. The question
     here is if the story rendered, not if it has a size. */
  await page.waitForSelector('#storybook-root > *', { state: 'attached', timeout: 15_000 });

  if (theme) {
    await page.waitForFunction(
      (want) => document.documentElement.dataset['theme'] === want,
      theme,
      { timeout: 15_000 },
    );
  }
  await settled(page);
}

/** A page settled before anything measures. The same three steps for a story
    and for a rendered page. A measurement taken before any of them reads a
    page that is not there yet. */
export async function settled(page: Page): Promise<void> {
  /* Wait for every element to upgrade before anything measures. A custom
     element upgrades asynchronously, so a colour read too early comes off
     markup that does not exist yet. Twice, because a nested element only exists
     once its parent has rendered. */
  await settleElements(page);

  /* Fonts change measured contrast and layout alike, and the specimens set
     in a vendored family that arrives over the network like any other. */
  await loadFonts(page);

  /* Freeze transitions before anything measures. A switch of `data-theme`
     changes every token at once and several components carry `transition:
     color`. An axe read inside that window sees an intermediate value and
     reports a contrast failure that belongs to neither theme. Injected after
     navigation, so the stylesheet outranks the component layer. */
  await page.addStyleTag({
    content: '*, *::before, *::after { transition: none !important; animation: none !important; }',
  });
}

/* Wait until no axe run is in flight. Axe is a single global with one run at
   a time. A second caller gets "Axe is already running" rather than a place
   in a queue — a failure that only appears under parallelism. */
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
