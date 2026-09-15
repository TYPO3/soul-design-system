/* The outline of a long document, in its panel.

   `sds-nav-outline` lists every part and every section of a document with
   more places than a window is tall. The panel it stands in is the height of
   the window, and the list scrolls inside it. So the mark on the part under
   the reader has to stay where the reader can see it. Every row carries its
   number as text, and the heading it points at carries the same number, so
   the two have to agree. Where the panel has no room beside the page, the
   list folds behind one press in the page's head. A press on a row shuts it
   again. */

import { test, expect } from '@playwright/test';

const PARTS = Array.from({ length: 12 }, (_, i) => ({
  id: `part-${i}`,
  label: `Part ${i + 1}`,
  under: [`part-${i}-a`, `part-${i}-b`],
}));

const body = PARTS.map((s, i) => `
  <section class="sds-section" id="${s.id}">
    <h2><span class="sds-section__number">${i + 1}</span> ${s.label}</h2>
    <p style="height:340px">Body of ${s.label}.</p>
    <section class="sds-section" id="${s.under[0]}">
      <h3><span class="sds-section__number">${i + 1}.1</span> ${s.label} first</h3>
      <p style="height:340px">More.</p>
    </section>
    <section class="sds-section" id="${s.under[1]}">
      <h3><span class="sds-section__number">${i + 1}.2</span> ${s.label} second</h3>
      <p style="height:340px">More still.</p>
    </section>
  </section>`).join('');

const entries = PARTS.map((s) => ({
  label: s.label,
  href: `#${s.id}`,
  items: [
    { label: `${s.label} first`, href: `#${s.under[0]}` },
    { label: `${s.label} second`, href: `#${s.under[1]}` },
  ],
}));

const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
<script type="module" src="/dist/soul.js"></script>
</head>
<body class="sds-app">
  <div class="sds-shell">
    <div class="sds-paper">
      <aside class="sds-paper__panel">
        <div class="sds-paper__head"><p class="sds-paper__title">A paper</p></div>
        <sds-nav-outline label="Contents" numbered id="outline"></sds-nav-outline>
        <div class="sds-paper__foot"><p>Draft</p></div>
      </aside>
      <main class="sds-paper__main">
        <article class="sds-prose">
          <section class="sds-section"><h1>A paper with twelve parts</h1></section>
          ${body}
        </article>
      </main>
    </div>
  </div>
  <script type="module">
    document.querySelector('#outline').entries = ${JSON.stringify(entries)};
  </script>
</body>
</html>`;

/* Wide enough that the panel stands beside the page, and short enough that
   the list does not fit in it. */
test.use({ viewport: { width: 1440, height: 700 } });

test.beforeEach(async ({ page }) => {
  await page.route('**/outline-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: PAGE }));
  await page.goto('/outline-fixture.html', { waitUntil: 'load' });
  await page.waitForFunction(() => customElements.get('sds-nav-outline') !== undefined, undefined, { timeout: 15_000 });
  /* Attached, not visible: where the list folds, the first row is behind
     the press. */
  await expect(page.locator('.sds-outline__item').first()).toBeAttached();
  await page.waitForTimeout(100);
});

/** Where the mark is, and if the box it is in shows it. */
const marked = (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const here = document.querySelector('.sds-outline__item.is-active') as HTMLElement | null;
    if (!here) return null;
    const box = here.closest('.sds-outline') as HTMLElement;
    const edge = box.getBoundingClientRect();
    const row = here.getBoundingClientRect();
    return {
      href: here.getAttribute('href') ?? '',
      inView: row.top >= edge.top - 1 && row.bottom <= edge.bottom + 1,
    };
  });

/* The number is text in the row and in the heading, so it is in the name
   each has out loud. A counter the stylesheet drew is not: the browser
   leaves generated content out of an accessible name. */
test('the list counts its places, and the headings carry the same numbers', async ({ page }) => {
  await expect(page.locator('.sds-outline__item[href="#part-3"]')).toHaveAccessibleName('4 Part 4');
  await expect(page.locator('#part-3 > h2')).toHaveAccessibleName('4 Part 4');
  await expect(page.locator('.sds-outline__item[href="#part-3-b"]')).toHaveAccessibleName('4.2 Part 4 second');
  await expect(page.locator('#part-3-b > h3')).toHaveAccessibleName('4.2 Part 4 second');
  await expect(page.locator('.sds-outline__item[href="#part-11"]')).toHaveAccessibleName('12 Part 12');
});

test('the panel stands the height of the window and the list scrolls inside it', async ({ page }) => {
  const box = await page.evaluate(() => {
    const panel = document.querySelector('.sds-paper__panel') as HTMLElement;
    const list = document.querySelector('.sds-outline') as HTMLElement;
    return {
      position: getComputedStyle(panel).position,
      height: Math.round(panel.getBoundingClientRect().height),
      overflowY: getComputedStyle(list).overflowY,
      over: list.scrollHeight - list.clientHeight,
      sideways: list.scrollWidth - list.clientWidth,
      press: (document.querySelector('.sds-outline__toggle') as HTMLElement).getClientRects().length,
    };
  });
  expect(box.position).toBe('sticky');
  expect(box.height).toBe(700);
  expect(box.overflowY).toBe('auto');
  expect(box.over, 'the fixture must have more entries than the box holds').toBeGreaterThan(40);
  /* A row's fill bleeds past its text. A box that gives it no room scrolls
     sideways, and draws a bar for it under the list. */
  expect(box.sideways, 'the list scrolls sideways').toBe(0);
  expect(box.press, 'beside the page nothing folds, so no press draws').toBe(0);
});

test('above the first heading nothing has the mark, which is a contents', async ({ page }) => {
  expect(await marked(page)).toBeNull();
});

test('the marked entry stays where the reader can see it, all the way down', async ({ page }) => {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const missed: unknown[] = [];
  for (let y = 0; y <= height; y += 250) {
    await page.evaluate((to) => window.scrollTo(0, to), y);
    await page.waitForTimeout(60);
    const at = await marked(page);
    if (at && !at.inView) missed.push({ y, href: at.href });
  }
  expect(missed, 'the panel marked a place off its own edge').toEqual([]);
  expect((await marked(page))?.href, 'at the foot the last place is the mark').toBe('#part-11-b');
});

test.describe('where the panel has no room beside the page', () => {
  test.use({ viewport: { width: 400, height: 700 } });

  /** The fold, its press, and what the panel shows. */
  const state = (page: import('@playwright/test').Page) =>
    page.evaluate(() => {
      const fold = document.querySelector('.sds-outline__fold') as HTMLDetailsElement;
      const panel = document.querySelector('.sds-paper__panel') as HTMLElement;
      const list = document.querySelector('.sds-outline__fold > .sds-outline__list') as HTMLElement;
      const foot = document.querySelector('.sds-paper__foot') as HTMLElement;
      return {
        open: fold.open,
        press: (document.querySelector('.sds-outline__toggle') as HTMLElement).getClientRects().length > 0,
        list: list.checkVisibility(),
        foot: foot.checkVisibility(),
        position: getComputedStyle(panel).position,
        top: Math.round(panel.getBoundingClientRect().top),
        height: Math.round(panel.getBoundingClientRect().height),
      };
    });

  test('the list folds behind a press in the head, and the head stays at the top', async ({ page }) => {
    const shut = await state(page);
    expect(shut.open, 'the script shuts the fold where the press draws').toBe(false);
    expect(shut.press).toBe(true);
    expect(shut.list).toBe(false);
    expect(shut.foot, 'the foot shows with the list').toBe(false);
    expect(shut.position).toBe('sticky');

    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(60);
    expect((await state(page)).top, 'the head rests at the top of the window').toBe(0);
  });

  test('the press opens the list, and a press on a row shuts it and goes there', async ({ page }) => {
    await page.locator('.sds-outline__toggle').click();
    const open = await state(page);
    expect(open.open).toBe(true);
    expect(open.list).toBe(true);
    expect(open.foot).toBe(true);
    expect(open.height, 'the drop stays inside the window').toBeLessThan(700);

    await page.locator('.sds-outline__item[href="#part-5"]').click();
    await page.waitForTimeout(120);
    expect((await state(page)).open, 'the reader chose a place, and the list has done its work').toBe(false);
    const head = await page.evaluate(() => {
      const heading = document.querySelector('#part-5 > h2') as HTMLElement;
      const panel = document.querySelector('.sds-paper__panel') as HTMLElement;
      return { heading: heading.getBoundingClientRect().top, panel: panel.getBoundingClientRect().bottom };
    });
    expect(head.heading, 'the place arrives under the head, not behind it').toBeGreaterThanOrEqual(head.panel);
  });

  test('back beside the page, the list opens again', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 700 });
    await page.waitForTimeout(150);
    const wide = await state(page);
    expect(wide.open).toBe(true);
    expect(wide.press).toBe(false);
  });
});
