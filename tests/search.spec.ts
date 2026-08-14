/* The site search, on a page that is not the site root.

   The index is a file the build writes, and every entry in it is a path from
   the root, which is the only place a build can name a page from. A reader is
   usually standing elsewhere, and a hit written into the page as it came out of
   the index resolves against *their* directory.

   Nothing else catches that: a screenshot of a search field with a panel under
   it looks correct from any directory. So this opens the panel from two
   directories deep and follows what is in it. */

import { test, expect } from '@playwright/test';

const INDEX = JSON.stringify([
  { title: 'Colours', url: 'guidelines/colours.html', text: 'Every colour in this system is a semantic token.', image: 'assets/colours.png' },
  { title: 'Frontend', url: 'frontend.html', text: 'Two files, and no assumptions about this system.' },
]);

/* Two levels down, and the index is where the build put it: the root. The
   `index` attribute is the one thing the page tells the element about where it
   is standing, which is exactly what a rendered layout can compute. */
const PAGE = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
<script type="module" src="/dist/soul.js"></script>
</head>
<body class="sds-app">
  <header class="sds-bar">
    <sds-search index="../_search.json" label="Search"></sds-search>
  </header>
</body>
</html>`;

test.beforeEach(async ({ page }) => {
  await page.route('**/site-fixture/deep/page.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: PAGE }));
  await page.route('**/site-fixture/_search.json', (route) =>
    route.fulfill({ contentType: 'application/json', body: INDEX }));
  await page.goto('/site-fixture/deep/page.html', { waitUntil: 'load' });
  await page.waitForFunction(() => customElements.get('sds-search') !== undefined, undefined, { timeout: 15_000 });
});

test('a hit opens the page it names, from wherever the reader is standing', async ({ page }) => {
  await page.locator('sds-search .sds-input').fill('colour');

  const hit = page.locator('.sds-search__panel a.sds-result').first();
  await expect(hit.locator('.sds-result__title')).toHaveText('Colours');

  /* From the root the index names it, not from the directory this page is in.
     The assertion is the whole URL for a reason: a relative href that looks
     right in the markup is the bug. */
  const href = await hit.evaluate((a) => (a as HTMLAnchorElement).href);
  expect(new URL(href).pathname).toBe('/site-fixture/guidelines/colours.html');
});

test('the drop is drawn by the components that draw results everywhere else', async ({ page }) => {
  await page.locator('sds-search .sds-input').fill('colour');
  /* Not a shape rebuilt in here: a result marks what was searched for, and a
     search that wrote its own row would mark what it thought was searched. */
  await expect(page.locator('.sds-search__panel sds-search-result')).toHaveCount(1);
  await expect(page.locator('.sds-search__panel mark').first()).toHaveText(/colour/i);

  await page.locator('sds-search .sds-input').fill('nothing here matches this');
  await expect(page.locator('.sds-search__panel .sds-hits__empty')).toBeVisible();
});

test('a picture in the index is resolved from the root the hit is', async ({ page }) => {
  await page.locator('sds-search .sds-input').fill('colour');

  /* The same resolution the href gets, and for the same reason: a path the
     build wrote is a path from the root, and a reader standing two
     directories down would otherwise be shown a file that is not there. */
  const src = await page
    .locator('.sds-search__panel .sds-result__thumb img')
    .evaluate((img) => (img as HTMLImageElement).src);
  expect(new URL(src).pathname).toBe('/site-fixture/assets/colours.png');
});

test('the whole hit is the target, not the title alone', async ({ page }) => {
  await page.route('**/site-fixture/guidelines/colours.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Colours</title>' }));

  await page.locator('sds-search .sds-input').fill('colour');
  const hit = page.locator('.sds-search__panel .sds-result');
  const box = (await hit.boundingBox())!;

  /* The bottom corner: past the title, past the end of the snippet, and still
     inside the row — which is the part a reader aims at and the part a list of
     linked titles does not answer. The row is the anchor, so this is a press
     on the link and not on something laid over it. */
  await hit.click({ position: { x: box.width - 8, y: box.height - 8 } });
  await page.waitForURL('**/guidelines/colours.html');
});

test('the row says it is a target before it is pressed', async ({ page }) => {
  await page.locator('sds-search .sds-input').fill('colour');
  const hit = page.locator('.sds-search__panel .sds-result');

  /* The hit's own background, because the hit is the anchor: nothing is laid
     over the row and nothing is inserted under it. */
  const fill = async (): Promise<string> =>
    hit.evaluate((el) => getComputedStyle(el).backgroundColor);
  const before = await fill();
  await hit.hover();
  /* Polled rather than read once: the plane fades in, and a value read on the
     same tick as the pointer is a value read halfway there. */
  await expect.poll(fill).not.toBe(before);
});

test('the panel hangs from the field, and gives the page back', async ({ page }) => {
  const field = page.locator('sds-search .sds-input');
  await field.fill('colour');

  /* Anchored to the element's own box. It used to have none — the host is
     `display: contents` — so the drop resolved against the bar and sat at the
     header's right edge, which happens to look almost right and is not. */
  const boxes = await page.evaluate(() => {
    const search = document.querySelector('.sds-search')!.getBoundingClientRect();
    const panel = document.querySelector('.sds-search__panel')!.getBoundingClientRect();
    return { left: search.left, right: search.right, panelRight: panel.right, panelTop: panel.top, bottom: search.bottom };
  });
  expect(Math.abs(boxes.panelRight - boxes.right)).toBeLessThan(2);
  expect(boxes.panelTop).toBeGreaterThan(boxes.bottom);

  await field.press('Escape');
  await expect(page.locator('.sds-search__panel')).toHaveCount(0);
});

test('the arrows walk the hits, and the field keeps what was typed', async ({ page }) => {
  const field = page.locator('sds-search .sds-input');
  /* Both entries match, so there is a list to walk rather than one row. */
  await field.fill('system');
  await expect(page.locator('.sds-search__panel sds-search-result')).toHaveCount(2);

  await field.press('ArrowDown');
  await expect(page.locator('.sds-search__panel a').first()).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('.sds-search__panel a').nth(1)).toBeFocused();
  /* Up from the first goes back to what was typed, rather than out of the
     panel and into whatever the page has above it. */
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(field).toBeFocused();
  await expect(field).toHaveValue('system');
});
