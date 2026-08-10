/* The drop-in works the way a consumer takes it.

   `dist/` is built and committed so a surface with no build step can copy it
   and link two files. Nothing here opened those two files: the cards, the
   stories and every other test render against `src/`, so the shipped artefact
   was the one thing in the repository that was never used.

   This is a page assembled the way the README says to assemble one — no
   bundler, no `lit` installed, no import map — and it asserts the two things
   that make it a drop-in: the stylesheet paints, and the elements upgrade. */

import { test, expect } from '@playwright/test';

/* Served over http, not opened from disk: a module script loaded from a
   `file://` page is subject to CORS and never runs, which says nothing about
   the drop-in. Storybook serves `dist/` at `/dist` for exactly this. */
const HTML = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
<script type="module" src="/dist/soul.js"></script>
</head>
<body class="sds-app">
  <sds-code lang="json" copy>{ "versions": ["12.4"] }</sds-code>
  <sds-button variant="primary" label="Run the checks"></sds-button>
  <sds-icon name="actions-search"></sds-icon>
  <sds-icon name="actions-search" class="sds-icon sds-icon--20"></sds-icon>
  <sds-icon name="actions-search" size="24"></sds-icon>
  <sds-icon name="actions-search" size="32"></sds-icon>
</body>
</html>`;

test('a page that only links dist/ gets styled, upgraded components', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.route('**/dropin-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: HTML }));
  await page.goto('/dropin-fixture.html', { waitUntil: 'load' });
  await page.waitForFunction(() => customElements.get('sds-code') !== undefined, undefined, { timeout: 15_000 });
  await page.evaluate(() => customElements.whenDefined('sds-button'));

  /* Upgraded: the element framed the content it was given. */
  const body = page.locator('sds-code .sds-code__body');
  await expect(body).toContainText('"versions": ["12.4"]');
  await expect(page.locator('sds-code .sds-code__lang')).toHaveText('json');

  /* Painted: the sunken surface a code block sits on, and the accent on the
     primary button. A missing stylesheet leaves both transparent. */
  const surface = await body.evaluate((el) => getComputedStyle(el.closest('.sds-code')!).backgroundColor);
  expect(surface, 'the code block should sit on a painted surface').not.toBe('rgba(0, 0, 0, 0)');

  const button = await page.locator('button.sds-btn--primary')
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(button, 'the primary button should carry the accent').toBe('rgb(255, 135, 0)');

  /* The faces travel with it: `soul.css` copies the woff2 files beside itself
     and rewrites their URLs, and a wrong path here is invisible until a page
     sets in the fallback. */
  const loaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family);
  });
  expect(loaded, 'the bundled faces should load').toContain('Source Sans 3');

  /* An icon is a `<use>` into the sprite that ships beside the bundle. A
     wrong path is a 404 and a blank glyph, and the size comes from the class
     rather than the attribute — both are silent until someone looks. */
  const glyphs = page.locator('svg[data-icon="actions-search"]');
  await expect(glyphs).toHaveCount(4);
  const sizes = await glyphs.evaluateAll((els) =>
    els.map((e) => Math.round(e.getBoundingClientRect().width)));
  /* Both ways of asking. The class is how hand-written markup asks and the
     property is how an element does; a stylesheet rule beats a presentation
     attribute, so the property has to be written as a style — and only when
     it was asked for, or the default would override the class. */
  expect(sizes, 'default, class, property, and a whole multiple').toEqual([16, 20, 24, 32]);

  /* Painted, not merely present: a reference the browser cannot resolve
     leaves an element of the right size with nothing in it. */
  const painted = await glyphs.first().evaluate((el) => {
    const use = el.querySelector('use');
    return Boolean(use && (use as SVGUseElement).getBoundingClientRect().width > 0);
  });
  expect(painted, 'the sprite reference should resolve').toBe(true);

  expect(errors, 'the drop-in should boot clean').toEqual([]);
});
