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
  <sds-code code-lang="json" copy>{ "versions": ["12.4"] }</sds-code>
  <sds-button variant="primary">Run the checks</sds-button>
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

  /* The variable faces travel with the bundle. They cover the weight axis and
     stay optional so a late response never replaces text after paint. */
  const faces = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].map((f) => ({
      display: f.display,
      family: f.family,
      status: f.status,
      style: f.style,
      weight: f.weight,
    }));
  });
  expect(faces.some((f) => f.family === 'Source Sans 3' && f.status === 'loaded'),
    'the bundled faces should load').toBe(true);
  expect(faces.filter((f) => f.family === 'Source Sans 3' || f.family === 'Source Code Pro')
    .every((f) => f.weight === '200 900' && f.display === 'optional'),
  'every bundled face should be variable and resist a late swap').toBe(true);

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

/* Nothing moves when the bundle lands. A host is `display: contents`, so before
   the script an `<sds-icon>` is no box and every icon pushes its neighbours
   sideways on upgrade. The stylesheet reserves the box the tag will take, which
   helps only if it is the box the element then renders — two rules in two files
   that nothing else holds together. Measured on both sides of the upgrade. */
test('an icon takes the same space before the script and after', async ({ page }) => {
  const MARKUP = ['', 'size="16"', 'size="20"', 'size="24"', 'size="32"', 'class="sds-icon sds-icon--20"']
    .map((attrs) => `<span style="font-size:13px"><sds-icon name="actions-search" ${attrs}></sds-icon></span>`)
    .join('\n  ');

  /* The stylesheet only. The module is added after the measurement, so this
     page really is the state a reader sees while the bundle is in flight. */
  await page.route('**/reserve-fixture.html', (route) => route.fulfill({
    contentType: 'text/html',
    body: `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8">
<link rel="stylesheet" href="/dist/soul.css">
</head><body class="sds-app">
  ${MARKUP}
</body></html>`,
  }));
  await page.goto('/reserve-fixture.html', { waitUntil: 'load' });

  /* The tag before, the glyph after. A host is `display: contents` once it
     has upgraded, so it has no box of its own to measure — what takes up the
     space from then on is the `<svg>` it rendered. Which is the comparison:
     the space, not the element that happens to hold it. */
  const boxes = async (selector: string): Promise<number[]> =>
    page.locator(selector).evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().width * 100) / 100));

  const before = await boxes('sds-icon');
  expect(before, 'every icon should have a box before the script').not.toContain(0);

  await page.addScriptTag({ url: '/dist/soul.js', type: 'module' });
  await page.evaluate(() => customElements.whenDefined('sds-icon'));
  await page.evaluate(() => Promise.all(
    [...document.querySelectorAll('sds-icon')]
      .map((el) => (el as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete),
  ));

  expect(await boxes('sds-icon svg'), 'the reserved box should be the one the element renders').toEqual(before);
});

/* The other way the drop-in is taken: bundled. A bundler moves the module away
   from the assets beside it, so the reference resolved against the module points
   at nothing. Saying where the sprite went is the only fix, and it has to be
   reachable from the entry — a build that cannot say it ships every icon
   blank. */
test('a bundling consumer can say where the sprite went', async ({ page }) => {
  await page.route('**/somewhere-else/actions.svg', (route) =>
    route.fulfill({ path: 'packages/frontend/dist/assets/icons/sprites/actions.svg', contentType: 'image/svg+xml' }));
  await page.route('**/sprite-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: HTML }));
  await page.goto('/sprite-fixture.html', { waitUntil: 'load' });

  /* The entry comes in as an argument: a literal specifier here would be a
     path this project has to resolve, and it is one the browser resolves. */
  const href = await page.evaluate(async (entry) => {
    const module = await import(entry) as { setIconSprite: (url: string) => void };
    module.setIconSprite('/somewhere-else/actions.svg');
    const icon = document.createElement('sds-icon');
    icon.setAttribute('name', 'actions-check');
    icon.id = 'repointed';
    document.body.append(icon);
    await (icon as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    return icon.querySelector('use')?.getAttribute('href');
  }, '/dist/soul.js');
  expect(href).toBe('/somewhere-else/actions.svg#actions-check');

  /* The copy button carries the same glyph from the default sprite, so this
     asks the one that was just appended. */
  await expect.poll(
    () => page.locator('#repointed use').evaluate((el) => el.getBoundingClientRect().width),
    { message: 'the repointed reference should resolve' },
  ).toBeGreaterThan(0);
});

/* And the form a bundler actually emits: one classic script, no modules left.
   `import.meta` does not survive that, so anything resolved against it at
   import time throws before a line of the bundle runs — nothing registers, and
   the only clue is one `Invalid URL` in the console. Bundled here rather than
   from a fixture, which would stop being the current `soul.js`. */
test('the bundle survives being built into a classic script', async ({ page }) => {
  const { build } = await import('esbuild');
  const bundled = await build({
    entryPoints: ['packages/frontend/dist/soul.js'],
    bundle: true,
    format: 'iife',
    target: 'es2017',
    write: false,
    logLevel: 'silent',
  });

  await page.route('**/soul.iife.js', (route) =>
    route.fulfill({ contentType: 'text/javascript', body: bundled.outputFiles[0]!.text }));
  await page.route('**/iife-fixture.html', (route) => route.fulfill({
    contentType: 'text/html',
    body: `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8">
<link rel="stylesheet" href="/dist/soul.css">
<script src="/soul.iife.js"></script>
</head><body class="sds-app"><sds-icon name="actions-search"></sds-icon></body></html>`,
  }));

  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/iife-fixture.html', { waitUntil: 'load' });

  const upgraded = await page.evaluate(() => Promise.race([
    customElements.whenDefined('sds-icon').then(() => true),
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 5_000)),
  ]));
  expect(errors, 'the bundle should evaluate without throwing').toEqual([]);
  expect(upgraded, 'the elements should register').toBe(true);
});
