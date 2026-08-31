/* The contents list, and where it says the reader is.

   `sds-nav-toc` is the one navigation whose current entry nothing rendering
   the page can name, so it reads the page instead — and past the width that
   stands it beside the column it is a box of its own that scrolls and shows
   only two levels. Both of those can leave the list marking a place the
   reader cannot see, which is the list saying nothing at all while looking
   exactly like a list that is working.

   Neither is visible in a screenshot or in the markup: it takes a page long
   enough to scroll and a box too short to hold the list. */

import { test, expect } from '@playwright/test';

/** Sections enough to outrun the list's own box, each tall enough to be
    scrolled to on its own. Three levels, because the list beside the column
    draws two and the third is what the page still has headings for. */
const SECTIONS = Array.from({ length: 12 }, (_, i) => ({
  id: `part-${i}`,
  label: `Part ${i + 1}`,
  under: [`part-${i}-a`, `part-${i}-b`],
}));

const body = SECTIONS.map((s) => `
  <h2 class="sds-h3" id="${s.id}">${s.label}</h2>
  <p style="height:340px">Body of ${s.label}.</p>
  <h3 class="sds-h4" id="${s.under[0]}">${s.label} first</h3>
  <p style="height:340px">More.</p>
  <h4 class="sds-h5" id="${s.under[1]}">${s.label} deeper</h4>
  <p style="height:340px">More still.</p>`).join('');

const entries = SECTIONS.map((s) => ({
  label: s.label,
  href: `#${s.id}`,
  items: [{
    label: `${s.label} first`,
    href: `#${s.under[0]}`,
    items: [{ label: `${s.label} deeper`, href: `#${s.under[1]}` }],
  }],
}));

const PAGE = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
<script type="module" src="/dist/soul.js"></script>
</head>
<body class="sds-app">
  <div class="sds-shell">
    <div class="sds-body">
      <main class="sds-body__main">
        <article class="sds-prose">
          <section class="sds-section">
            <h1>A page with more parts than the list is tall</h1>
            <div class="sds-aside">
              <sds-nav-toc label="On this page" id="toc"></sds-nav-toc>
            </div>
            ${body}
          </section>
        </article>
      </main>
    </div>
  </div>
  <script type="module">
    document.querySelector('#toc').entries = ${JSON.stringify(entries)};
  </script>
</body>
</html>`;

/* Wide enough that the list stands beside the column, and short enough that it
   does not fit in the reserve — which is a laptop, and the state the list was
   never read in. */
test.use({ viewport: { width: 1440, height: 700 } });

test.beforeEach(async ({ page }) => {
  await page.route('**/toc-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: PAGE }));
  await page.goto('/toc-fixture.html', { waitUntil: 'load' });
  await page.waitForFunction(() => customElements.get('sds-nav-toc') !== undefined, undefined, { timeout: 15_000 });
  await expect(page.locator('.sds-toc__item').first()).toBeVisible();
});

/** Where the mark is, and whether the box it is in is showing it. */
const marked = (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const here = document.querySelector('.sds-toc__item.is-active') as HTMLElement | null;
    if (!here) return null;
    const box = here.closest('.sds-toc') as HTMLElement;
    const edge = box.getBoundingClientRect();
    const row = here.getBoundingClientRect();
    return {
      href: here.getAttribute('href') ?? '',
      inView: row.top >= edge.top - 1 && row.bottom <= edge.bottom + 1,
      tocTop: Math.round(box.scrollTop),
    };
  });

test('the list is a box that scrolls, which is the case the rest of this asks about', async ({ page }) => {
  const box = await page.evaluate(() => {
    const list = document.querySelector('.sds-prose .sds-aside .sds-toc') as HTMLElement;
    const style = getComputedStyle(list);
    return { position: style.position, overflowY: style.overflowY, over: list.scrollHeight - list.clientHeight };
  });
  expect(box.position, 'the list should be resting beside the column').toBe('sticky');
  expect(box.overflowY).toBe('auto');
  expect(box.over, 'the fixture should have more entries than the box holds').toBeGreaterThan(40);
});

test('the marked entry stays where the reader can see it, all the way down', async ({ page }) => {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const missed: unknown[] = [];
  for (let y = 0; y <= height; y += 250) {
    await page.evaluate((to) => window.scrollTo(0, to), y);
    await page.waitForTimeout(40);
    const at = await marked(page);
    if (at && !at.inView) missed.push({ y, href: at.href });
  }
  expect(missed, 'the list marked a section off its own edge').toEqual([]);
});

test('a heading the list does not draw leaves the section it is in marked', async ({ page }) => {
  /* Beside the column the list draws two levels. The third has a heading on
     the page all the same, and the reader standing at one is still inside the
     section above it — a list that marks the heading itself marks a row that
     is not there, and every visible entry goes blank. */
  const hidden = await page.evaluate(() => {
    const rows = [...document.querySelectorAll<HTMLElement>('.sds-toc__item')];
    return rows.filter((row) => !row.getClientRects().length).map((row) => row.getAttribute('href'));
  });
  expect(hidden, 'the fixture should carry a level the list hides').toContain('#part-4-b');

  await page.evaluate(() => document.getElementById('part-4-b')?.scrollIntoView());
  await page.waitForTimeout(120);
  const at = await marked(page);
  expect(at, 'nothing was marked while the reader stood at a hidden heading').not.toBeNull();
  expect(at?.href).toBe('#part-4-a');
  expect(at?.inView).toBe(true);
});

test('a list already showing its mark stands still', async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(60);
  await page.evaluate(() => document.getElementById('part-0')?.scrollIntoView());
  await page.waitForTimeout(120);
  const first = await marked(page);
  expect(first?.tocTop, 'the first entries are in view, so the list had no reason to move').toBe(0);
});

test('in the flow the list neither scrolls nor hides a level', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 700 });
  await page.waitForTimeout(150);
  const state = await page.evaluate(() => {
    const list = document.querySelector('.sds-prose .sds-aside .sds-toc') as HTMLElement;
    const rows = [...document.querySelectorAll<HTMLElement>('.sds-toc__item')];
    return {
      position: getComputedStyle(list).position,
      hidden: rows.filter((row) => !row.getClientRects().length).length,
    };
  });
  expect(state.position, 'below the width that stands it beside the column it is in the flow').toBe('static');
  expect(state.hidden, 'in the flow the list keeps every level').toBe(0);

  await page.evaluate(() => document.getElementById('part-4-b')?.scrollIntoView());
  await page.waitForTimeout(120);
  expect((await marked(page))?.href, 'the deepest entry is drawn here, so it is the mark').toBe('#part-4-b');
});
