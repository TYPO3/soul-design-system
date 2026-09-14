/* The drop-in works the way a consumer takes it.

   `dist/` is a build in git, so a surface with no build step can copy it
   and link two files. The cards, the stories and every other test render
   against `src/`, so nothing else opens the shipped artefact.

   This is a page assembled the way the README says to assemble one: no
   bundler, no `lit` installed, no import map. It asserts the two things
   that make it a drop-in: the stylesheet paints, and the elements upgrade. */

import { test, expect } from '@playwright/test';

/* Served over http, not opened from disk. A module script on a `file://`
   page is subject to CORS and never runs, which says nothing about the
   drop-in. Storybook serves `dist/` at `/dist` for exactly this. */
const HTML = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
<script type="module" src="/dist/soul.js"></script>
</head>
<body class="sds-app">
  <sds-code code-lang="json" copy>{ "versions": ["12.4"] }</sds-code>
  <sds-code code-lang="typoscript" source="page = PAGE"></sds-code>
  <sds-diff path="composer.json"></sds-diff>
  <sds-button variant="primary">Run the checks</sds-button>
  <sds-icon name="actions-search"></sds-icon>
  <sds-icon name="actions-search" class="sds-icon sds-icon--20"></sds-icon>
  <sds-icon name="actions-search" size="24"></sds-icon>
  <sds-icon name="actions-search" size="32"></sds-icon>
</body>
</html>`;

test('a page that only links dist/ has its components upgrade with their style', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.route('**/dropin-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: HTML }));
  await page.goto('/dropin-fixture.html', { waitUntil: 'load' });
  await page.waitForFunction(() => customElements.get('sds-code') !== undefined, undefined, { timeout: 15_000 });
  await page.evaluate(() => customElements.whenDefined('sds-button'));
  await page.evaluate(() => customElements.whenDefined('sds-diff'));

  /* Upgraded: the element framed its content. Addressed by its language,
     because the page carries a second block — see below. */
  const body = page.locator('sds-code[code-lang="json"] .sds-code__body');
  await expect(body).toContainText('"versions": ["12.4"]');
  await expect(page.locator('sds-code[code-lang="json"] .sds-code__lang')).toHaveText('json');

  /* A grammar this system wrote itself, out of the built bundle. It is the
     one thing here that is not highlight.js's. Registered from a module the
     build has to have carried. A block that arrives grey is a drop-in that
     ships a language it declares and cannot colour. */
  const written = page.locator('sds-code[code-lang="typoscript"] code [class^="hljs-"]');
  expect(await written.count(), 'the written grammar did not reach the bundle').toBeGreaterThan(1);

  /* Painted: the sunken surface a code block sits on, and the accent on the
     primary button. A missing stylesheet leaves both transparent. */
  const surface = await body.evaluate((el) => getComputedStyle(el.closest('.sds-code')!).backgroundColor);
  expect(surface, 'the code block must sit on a painted surface').not.toBe('rgba(0, 0, 0, 0)');

  /* A diff's path is product metadata, not specimen annotation. It must take
     its mono register from soul.css alone; `_specimen.css` is absent here. */
  const registers = await page.locator('sds-code[code-lang="json"] .sds-code__lang, .sds-code__path').evaluateAll((elements) =>
    elements.map((element) => {
      const style = getComputedStyle(element);
      return { family: style.fontFamily, tracking: style.letterSpacing };
    }));
  expect(registers).toHaveLength(2);
  expect(registers[1]).toEqual(registers[0]);
  expect(registers[1]?.family).toContain('Source Code Pro');

  const button = await page.locator('button.sds-btn--primary')
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(button, 'the primary button must carry the accent').toBe('rgb(255, 135, 0)');

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
    'the bundled faces must load').toBe(true);
  expect(faces.filter((f) => f.family === 'Source Sans 3' || f.family === 'Source Code Pro')
    .every((f) => f.weight === '200 900' && f.display === 'optional'),
  'every bundled face must be variable and resist a late swap').toBe(true);

  /* An icon is a `<use>` into the sprite that ships beside the bundle. A
     wrong path is a 404 and a blank glyph. The size comes from the class
     rather than the attribute. Both are silent until someone looks. */
  const glyphs = page.locator('svg[data-icon="actions-search"]');
  await expect(glyphs).toHaveCount(4);
  const sizes = await glyphs.evaluateAll((els) =>
    els.map((e) => Math.round(e.getBoundingClientRect().width)));
  /* Both ways to ask. The class is how hand-written markup asks and the
     property is how an element does. A stylesheet rule beats a presentation
     attribute, so the property has to go in as a style. And only on request,
     or the default overrides the class.

     The default is `em` and therefore whatever the text around it is. So the
     claim is that and not a number. A pinned number here makes this spec
     fail the day the base size moves, which says nothing about the icon. The
     other three are the scale and stay pinned. */
  const base = await page.locator('body').evaluate((el) => Math.round(parseFloat(getComputedStyle(el).fontSize)));
  expect(sizes, 'default, class, property, and a whole multiple').toEqual([base, 20, 24, 32]);

  /* Painted, not merely present: a reference the browser cannot resolve
     leaves an element of the right size with nothing in it. */
  const painted = await glyphs.first().evaluate((el) => {
    const use = el.querySelector('use');
    return Boolean(use && (use as SVGUseElement).getBoundingClientRect().width > 0);
  });
  expect(painted, 'the sprite reference must resolve').toBe(true);

  expect(errors, 'the drop-in must boot clean').toEqual([]);
});

/* Nothing moves when the bundle lands. An element is the box it draws, so the
   space an icon takes is the element's own on both sides of the upgrade.
   Before it there is nothing inside to give it a size. The stylesheet reserves
   it, which helps only if it is the box the element then renders. Two rules in
   two files that nothing else holds together. */
test('an icon takes the same space before the script and after', async ({ page }) => {
  const MARKUP = ['', 'size="16"', 'size="20"', 'size="24"', 'size="32"', 'class="sds-icon sds-icon--20"']
    .map((attrs) => `<span style="font-size:13px"><sds-icon name="actions-search" ${attrs}></sds-icon></span>`)
    .join('\n  ');

  /* The stylesheet only. The module arrives after the measurement, so this
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

  const boxes = async (selector: string): Promise<number[]> =>
    page.locator(selector).evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().width * 100) / 100));

  const before = await boxes('sds-icon');
  expect(before, 'every icon must have a box before the script').not.toContain(0);

  await page.addScriptTag({ url: '/dist/soul.js', type: 'module' });
  await page.evaluate(() => customElements.whenDefined('sds-icon'));
  await page.evaluate(() => Promise.all(
    [...document.querySelectorAll('sds-icon')]
      .map((el) => (el as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete),
  ));

  expect(await boxes('sds-icon'), 'the reserved box must be the one the element renders').toEqual(before);
});

/* The same rule one level up, where it costs the whole page rather than one
   glyph. The bar is the first thing on every surface built on this system.
   An empty host is inline until the bundle lands, so the page lays out once
   without it and again with it. What a jump has to clear is the same fact
   from the other end, and it too has its answer before the script. */
test('the bar holds its room, and the jump its offset, before the script', async ({ page }) => {
  await page.route('**/bar-fixture.html', (route) => route.fulfill({
    contentType: 'text/html',
    body: `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8">
<link rel="stylesheet" href="/dist/soul.css">
</head><body class="sds-app">
  <sds-nav-main product="Soul"></sds-nav-main>
  <div class="sds-page"><h2 id="target">A heading somebody jumped to</h2></div>
</body></html>`,
  }));
  await page.goto('/bar-fixture.html', { waitUntil: 'load' });

  const room = () => page.locator('sds-nav-main')
    .evaluate((el) => Math.round(el.getBoundingClientRect().height));
  const before = await room();
  expect(before, 'the bar must have a box before the script').toBeGreaterThan(0);

  /* And the offset a target scrolled to the top keeps. So the heading does not
     land underneath the bar in the window before the element upgrades. */
  const jump = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop));
  expect(jump, 'a jump clears the bar before the element draws one').toBeGreaterThan(before);

  await page.addScriptTag({ url: '/dist/soul.js', type: 'module' });
  await page.evaluate(() => customElements.whenDefined('sds-nav-main'));
  await page.evaluate(() => (document.querySelector('sds-nav-main') as
    HTMLElement & { updateComplete: Promise<unknown> }).updateComplete);

  expect(await room(), 'the reserved room must be the room the bar takes').toBe(before);
});

/* The other way a consumer takes the drop-in: bundled. A bundler moves the
   module away from the assets beside it, so the reference resolved against the
   module points at nothing. The only fix is to say where the sprites went, and
   that has to be reachable from the entry. A build that cannot say it ships
   every icon blank.

   The *directory*, because there is one sprite per category. A glyph from the
   second one is what proves the element resolves its own file and does not
   point everything at the first. */
test('a bundling consumer can say where the sprites went', async ({ page }) => {
  for (const category of ['actions', 'spinner']) {
    await page.route(`**/somewhere-else/${category}.svg`, (route) =>
      route.fulfill({
        path: `packages/frontend/dist/assets/icons/sprites/${category}.svg`,
        contentType: 'image/svg+xml',
      }));
  }
  await page.route('**/sprite-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: HTML }));
  await page.goto('/sprite-fixture.html', { waitUntil: 'load' });

  /* The entry comes in as an argument. A literal specifier here is a path
     this project has to resolve, and it is one the browser resolves. */
  const hrefs = await page.evaluate(async (entry) => {
    const module = await import(entry) as { setIconSprites: (dir: string) => void };
    module.setIconSprites('/somewhere-else/');
    const drawn: (string | null | undefined)[] = [];
    for (const [id, name] of [['repointed', 'actions-check'], ['other-category', 'spinner-circle']]) {
      const icon = document.createElement('sds-icon');
      icon.setAttribute('name', name as string);
      icon.id = id as string;
      document.body.append(icon);
      await (icon as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
      drawn.push(icon.querySelector('use')?.getAttribute('href'));
    }
    return drawn;
  }, '/dist/soul.js');
  expect(hrefs[0]).toBe('/somewhere-else/actions.svg#actions-check');
  expect(hrefs[1], 'a second category is a second sprite').toBe('/somewhere-else/spinner.svg#spinner-circle');

  /* The copy button carries the same glyph from the default sprite, so this
     asks the one that was just appended. */
  await expect.poll(
    () => page.locator('#repointed use').evaluate((el) => el.getBoundingClientRect().width),
    { message: 'the repointed reference must resolve' },
  ).toBeGreaterThan(0);
});

/* And the form a bundler emits: one classic script, no modules left.
   `import.meta` does not survive that. Anything resolved against it at
   import time throws before a line of the bundle runs. Nothing registers, and
   the only clue is one `Invalid URL` in the console. Bundled here rather than
   from a fixture, which drifts from the current `soul.js`. */
test('the bundle survives a build into a classic script', async ({ page }) => {
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
  expect(errors, 'the bundle must evaluate with no throw').toEqual([]);
  expect(upgraded, 'the elements must register').toBe(true);
});

/* The mode switch, as a page that copies the drop-in gets it.

   `soul-boot.js` and `<sds-theme>` are two shipped files that have to agree on
   what `data-theme` means, and nothing rendered against `src/` can catch a
   disagreement. Boot that resolves the machine's setting into the attribute
   is one. The element reads that back as a choice, so the press that gives
   the machine its setting back writes it straight on again. On a machine set
   to dark that is a button that moves nothing, at any number of presses. */
test.describe('the mode switch a machine set to dark starts in', () => {
  test.use({ colorScheme: 'dark' });

  const SWITCH = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<script src="/dist/soul-boot.js"></script>
<link rel="stylesheet" href="/dist/soul.css" />
<script type="module" src="/dist/soul.js"></script>
</head>
<body class="sds-app">
  <sds-theme></sds-theme>
</body>
</html>`;

  /** What the document says the mode is, which is what both files read. */
  const written = (page: import('@playwright/test').Page) =>
    page.evaluate(() => document.documentElement.dataset['theme'] ?? null);

  test('one press steps to the next of three, and the third gives the machine back', async ({ page }) => {
    await page.route('**/theme-fixture.html', (route) =>
      route.fulfill({ contentType: 'text/html', body: SWITCH }));
    await page.goto('/theme-fixture.html', { waitUntil: 'load' });
    await page.evaluate(() => customElements.whenDefined('sds-theme'));

    const press = page.locator('sds-theme button');

    /* Nobody has chosen, so the attribute is not there and the mark is the
       device. The page is in dark because the machine is, not because anybody
       said so. */
    await expect.poll(() => written(page)).toBeNull();
    await expect(page.locator('.sds-theme__mark--machine')).toHaveCSS('opacity', '1');

    await press.click();
    await expect.poll(() => written(page)).toBe('light');

    await press.click();
    await expect.poll(() => written(page)).toBe('dark');

    await press.click();
    await expect.poll(() => written(page)).toBeNull();
    expect(await page.evaluate(() => localStorage.getItem('soul-theme')),
      'the machine’s setting is a stop, so the store holds nothing at it').toBeNull();
    await expect(page.locator('.sds-theme__mark--machine')).toHaveCSS('opacity', '1');
  });

  test('a stored choice is on the root before the first paint', async ({ page }) => {
    await page.route('**/theme-fixture.html', (route) =>
      route.fulfill({ contentType: 'text/html', body: SWITCH }));
    await page.addInitScript(() => localStorage.setItem('soul-theme', 'light'));
    await page.goto('/theme-fixture.html', { waitUntil: 'commit' });

    /* Read before the module can have run. This is boot's whole job, and an
       attribute that only arrives with `soul.js` is the flash it exists to
       prevent. */
    await expect.poll(() => written(page)).toBe('light');
  });
});
