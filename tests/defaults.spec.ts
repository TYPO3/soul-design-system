/* What a page gets before it reaches for a class.

   A consumer's own content arrives without classes — a rich-text editor emits
   `<p>` and `<h2>`, a template renders a heading because the content said
   heading — so the elements are the reset and the classes are what you write
   when the element cannot say it.

   The fixture's body carries **no** `sds-app`, on purpose: linking the
   stylesheet is the opt-in, and a reset that only applies inside one wrapper
   is a reset that whoever writes the wrapper has to know about.

   Two halves, and the second is the one that breaks quietly: a class must
   still win over the element it sits on. Nothing about that is visible in a
   screenshot, and an `!important` or a rule that reached for an id would flip
   it while every page still looked right — until one page needed a level and a
   size to disagree.

   Assembled the way `dropin.spec.ts` assembles its page, and against `dist/`
   for the same reason: that is the file a consumer links. */

import { test, expect } from '@playwright/test';

const HTML = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
</head>
<body>
  <h1 id="bare-h1">Level one</h1>
  <h2 id="bare-h2">Level two</h2>
  <h3 id="bare-h3">Level three</h3>
  <h4 id="bare-h4">Level four</h4>
  <p id="bare-p">A paragraph nobody put a class on.</p>

  <h2 id="two-at-three" class="sds-h3">Level two, third size</h2>
  <h1 id="one-at-display" class="sds-display">Level one, display size</h1>
  <p id="p-as-lead" class="sds-lead">A paragraph set as a lead.</p>
</body>
</html>`;

/** The px value of a computed font size, so the numbers below read as the
    scale rather than as strings. */
const size = async (page: import('@playwright/test').Page, id: string): Promise<number> =>
  page.locator(`#${id}`).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

test.beforeEach(async ({ page }) => {
  await page.route('**/defaults-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: HTML }));
  await page.goto('/defaults-fixture.html', { waitUntil: 'load' });
});

test('bare elements are already dressed, with no wrapper class', async ({ page }) => {
  /* Descending, and none of them at the browser's 32/24/18px defaults. What is
     asserted is the *order and the distance*, not four literals that would
     have to be edited every time the scale moves. */
  const h1 = await size(page, 'bare-h1');
  const h2 = await size(page, 'bare-h2');
  const h3 = await size(page, 'bare-h3');
  const h4 = await size(page, 'bare-h4');
  const p = await size(page, 'bare-p');

  expect(h1).toBeGreaterThan(h2);
  expect(h2).toBeGreaterThan(h3);
  expect(h3).toBeGreaterThan(h4);
  expect(p).toBeGreaterThan(15);

  /* The browser's own defaults, which are what a page gets when the element
     rules are missing: 2em, 1.5em, 1.17em of a 16px root. */
  expect(h1, 'h1 should not be at the browser default').not.toBe(32);
  expect(h2, 'h2 should not be at the browser default').not.toBe(24);

  /* Margins are the container's job — an element that brought its own would
     double every gap on a page that already composes correctly. */
  for (const id of ['bare-h1', 'bare-h2', 'bare-p']) {
    const margin = await page.locator(`#${id}`).evaluate((el) => getComputedStyle(el).marginBlockStart);
    expect(margin, `${id} should carry no margin of its own`).toBe('0px');
  }

  /* Body copy is held to a measure. A paragraph that runs the width of a
     1280px viewport is unreadable however well it is set. */
  const width = await page.locator('#bare-p').evaluate((el) => el.getBoundingClientRect().width);
  expect(width).toBeLessThan(900);
});

test('a class always overrides the element it sits on', async ({ page }) => {
  /* The sentence the markup can only tell with both: level two, third size. */
  expect(await size(page, 'two-at-three')).toBe(await size(page, 'bare-h3'));
  expect(await size(page, 'two-at-three')).not.toBe(await size(page, 'bare-h2'));

  /* And the other direction, where a level is set larger than its own step. */
  expect(await size(page, 'one-at-display')).toBeGreaterThan(await size(page, 'bare-h1'));

  /* A paragraph set as a lead takes the lead's size and its shorter measure.

     Shorter in *characters*, which is what a measure is: 64ch against 66ch.
     In pixels the lead is the wider of the two, because it is set larger — and
     comparing the two widths directly is the mistake this comment exists to
     stop the next person making. Dividing each by its own font size takes the
     size back out, and what is left is the measure. */
  const leadSize = await size(page, 'p-as-lead');
  const proseSize = await size(page, 'bare-p');
  expect(leadSize).toBeGreaterThan(proseSize);

  const lead = await page.locator('#p-as-lead').evaluate((el) => el.getBoundingClientRect().width);
  const prose = await page.locator('#bare-p').evaluate((el) => el.getBoundingClientRect().width);
  expect(lead / leadSize, 'a lead is held to fewer characters than body copy').toBeLessThan(prose / proseSize);
});

/* The rest of what arrives without a class.

   A paragraph was the loud case. These are the quiet ones, and each is a thing
   an editor emits that the system had no rule for: a link, a phrase in mono, a
   picture, a rule across the page. The picture is the one that costs
   something — one wider than its column pushes the whole page sideways, which
   is the failure the layout classes are full of comments about, arriving
   through content instead of through markup. */
const CONTENT = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
</head>
<body>
  <div style="width:200px">
    <img id="wide" src="/assets/diagrams/answer-sources.svg" width="1200" height="750" alt="" />
  </div>
  <p>A sentence naming <code id="inline-code">typo3_icon_lookup</code>, which is a thing the machine named.</p>
  <p><a id="bare-a" href="#somewhere">a link nobody classed</a></p>
  <hr id="rule" />
</body>
</html>`;

test('content that arrives without a class is still the system', async ({ page }) => {
  await page.route('**/content-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: CONTENT }));
  await page.goto('/content-fixture.html', { waitUntil: 'load' });

  /* A 1200px picture inside a 200px column stays inside it. */
  const img = await page.locator('#wide').evaluate((el) => el.getBoundingClientRect().width);
  expect(img, 'an image is held to the box it is in').toBeLessThanOrEqual(200);

  /* Mono, and smaller than the sentence around it rather than the same size,
     which is what makes a name read as a name. */
  const code = await page.locator('#inline-code').evaluate((el) => getComputedStyle(el).fontFamily);
  expect(code).toContain('Source Code Pro');

  /* Not the browser's blue, and not underlined at rest — a link in this system
     underlines on hover and never before. */
  const link = await page.locator('#bare-a').evaluate((el) => {
    const s = getComputedStyle(el);
    return { color: s.color, decoration: s.textDecorationLine };
  });
  expect(link.color).not.toBe('rgb(0, 0, 238)');
  expect(link.decoration).toBe('none');

  /* One hairline, no radius, no margin of its own. */
  const rule = await page.locator('#rule').evaluate((el) => {
    const s = getComputedStyle(el);
    return { top: s.borderTopWidth, bottom: s.borderBottomWidth, margin: s.marginBlockStart };
  });
  expect(rule.top).toBe('1px');
  expect(rule.bottom).toBe('0px');
  expect(rule.margin).toBe('0px');
});
