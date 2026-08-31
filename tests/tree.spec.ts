/* A directory, as the shape it has on disk.

   The claim worth holding is that it folds with **no script**: a `<details>`
   per directory, so a page rendered on a server and served to a reader who
   runs nothing still opens and closes. That is invisible in the markup — a
   `<details>` looks the same whether or not anything works — so it is pressed
   here with JavaScript switched off.

   And that a level is how deep it stands open and not how deep it is drawn:
   the theme this spelling comes from stops rendering below the level, which
   takes away what a reader came for. */

import { test, expect } from '@playwright/test';

const ENTRIES = [
  {
    label: 'docs/',
    note: 'the sources',
    items: [
      { label: 'Index.rst' },
      { label: 'Introduction/', items: [{ label: 'Deep.rst', items: [{ label: 'Deeper.rst' }] }] },
    ],
  },
  { label: 'composer.json' },
];

const page = (level: number, icons = false) => `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
<script type="module" src="/dist/soul.js"></script>
</head>
<body class="sds-app">
  <sds-tree id="t" level="${level}"${icons ? ' icons' : ''}
    entries='${JSON.stringify(ENTRIES)}'></sds-tree>
</body>
</html>`;

async function open(p: import('@playwright/test').Page, level: number, icons = false): Promise<void> {
  await p.route('**/tree-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: page(level, icons) }));
  await p.goto('/tree-fixture.html', { waitUntil: 'load' });
  await p.waitForFunction(() => customElements.get('sds-tree') !== undefined, undefined, { timeout: 15_000 });
  await expect(p.locator('#t .sds-tree__name').first()).toBeVisible();
}

test('a level is how deep it stands open, and nothing below it is dropped', async ({ page: p }) => {
  await open(p, 1);
  const state = await p.evaluate(() => {
    const folds = [...document.querySelectorAll('#t details')] as HTMLDetailsElement[];
    return {
      names: [...document.querySelectorAll('#t .sds-tree__name')].map((n) => n.textContent),
      open: folds.map((f) => f.open),
    };
  });
  /* Every name the entries hold is in the page — three levels below the one
     that stands open included. */
  expect(state.names).toEqual(['docs/', 'Index.rst', 'Introduction/', 'Deep.rst', 'Deeper.rst', 'composer.json']);
  expect(state.open, 'the first level stands open and the rest is folded').toEqual([true, false, false]);

  await open(p, 9);
  expect(await p.evaluate(() => [...document.querySelectorAll('#t details')].every((f) => (f as HTMLDetailsElement).open)))
    .toBe(true);
});

test('it folds with no script at all', async ({ browser }) => {
  /* The whole reason for `<details>` over a framework's collapse: a document
     is rendered on a server and read by somebody running nothing. */
  const context = await browser.newContext({ javaScriptEnabled: false });
  const p = await context.newPage();
  await p.route('**/tree-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: page(1) }));
  await p.goto('/tree-fixture.html', { waitUntil: 'load' });

  /* Prerendered markup is what a document carries; here the fixture has none,
     so the element is written out by hand the way the renderer writes it. */
  await p.setContent(`<!doctype html><html lang="en" data-theme="dark"><head>
    <meta charset="utf-8"><link rel="stylesheet" href="${new URL('/dist/soul.css', p.url()).href}">
    </head><body class="sds-app">
    <div class="sds-tree"><ul class="sds-tree__list">
      <li class="sds-tree__item"><details class="sds-tree__fold">
        <summary class="sds-tree__row"><span class="sds-tree__mark"></span><span class="sds-tree__name">docs/</span></summary>
        <ul class="sds-tree__list"><li class="sds-tree__item">
          <span class="sds-tree__row"><span class="sds-tree__name">Index.rst</span></span>
        </li></ul>
      </details></li>
    </ul></div></body></html>`);

  const inner = p.locator('.sds-tree__name', { hasText: 'Index.rst' });
  await expect(inner, 'folded, with nothing running').toBeHidden();
  await p.locator('summary.sds-tree__row').click();
  await expect(inner, 'and the press is the platform’s own').toBeVisible();
  await context.close();
});

test('a leaf name begins where a directory name does', async ({ page: p }) => {
  await open(p, 9);
  const left = await p.evaluate(() => {
    const at = (text: string) => {
      const name = [...document.querySelectorAll('#t .sds-tree__name')]
        .find((n) => n.textContent === text) as HTMLElement;
      return Math.round(name.getBoundingClientRect().left);
    };
    return { directory: at('Introduction/'), leaf: at('Index.rst') };
  });
  /* Both sit one level under `docs/`, so a fold mark on one of them may not
     move the other's name: the mark keeps its box on every row. */
  expect(left.leaf).toBe(left.directory);
});

test('a mark for a directory and one for a file, where they were asked for', async ({ page: p }) => {
  await open(p, 9);
  expect(await p.locator('#t .sds-tree__glyph').count(), 'off unless asked for').toBe(0);

  await open(p, 9, true);
  await expect(p.locator('#t .sds-tree__item', { hasText: 'composer.json' }).locator('[data-icon="actions-file"]').first())
    .toBeVisible();
  await expect(p.locator('#t .sds-tree__fold').first().locator('[data-icon="actions-folder"]').first())
    .toBeVisible();
});
