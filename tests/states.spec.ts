/* What a state changes, and what it must not.

   A state assigns into a component's own set. A property whose default reads
   the one a state assigns from it is a cycle. That is invalid at computed
   value, which is not an error anywhere: the declaration simply drops. The
   button lost its border under the pointer and shrank by it. Its ink fell
   back to whatever the page inherits, which on the accent fill is unreadable.
   Nothing in the tree can see that, because nothing hovers over a card. */

import { test, expect } from '@playwright/test';

const PAGE = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
<script type="module" src="/dist/soul.js"></script>
</head>
<body class="sds-app">
  <sds-button label="Primary" variant="primary" id="primary"></sds-button>
  <sds-button label="Secondary" variant="secondary" id="secondary"></sds-button>
  <sds-button label="Ghost" variant="ghost" id="ghost"></sds-button>
  <sds-button label="Delete the branch" variant="danger" id="danger"></sds-button>
  <sds-dropdown label="Language" name="Language" id="trigger"></sds-dropdown>
  <script type="module">
    document.querySelector('#trigger').choices = [{ label: 'English', href: '#en', lang: 'en' }];
  </script>
</body>
</html>`;

const BUTTONS = ['#primary button', '#secondary button', '#ghost button', '#danger button'];
const CONTROLS = [...BUTTONS, '#trigger .sds-dropdown__button'];

test.beforeEach(async ({ page }) => {
  await page.route('**/hover.html', (route) => route.fulfill({ contentType: 'text/html', body: PAGE }));
  await page.goto('/hover.html');
  await page.waitForFunction(() => customElements.get('sds-dropdown') !== undefined);
});

test('the pointer changes no box', async ({ page }) => {
  for (const control of CONTROLS) {
    const at = page.locator(control);
    const before = await at.boundingBox();
    await at.hover();
    const after = await at.boundingBox();
    expect(after!.width, `${control} widened under the pointer`).toBeCloseTo(before!.width, 1);
    expect(after!.height, `${control} grew under the pointer`).toBeCloseTo(before!.height, 1);
  }
});

/* An invalid custom property computes to the empty string, which is the one
   reading that says the cycle is back. */
test('every colour the pointer draws with resolves', async ({ page }) => {
  for (const control of CONTROLS) {
    const at = page.locator(control);
    await at.hover();
    const values = await at.evaluate((el) => {
      const style = getComputedStyle(el);
      return ['--sds-btn-ink-hover', '--sds-btn-fill-hover', '--sds-btn-edge-hover', 'color', 'border-top-color'].map(
        (name) => [name, style.getPropertyValue(name).trim()] as const,
      );
    });
    for (const [name, value] of values) {
      expect(value, `${control} left ${name} unresolved under the pointer`).not.toBe('');
    }
  }
});

/* The state has to do something, or the cycle is back in the other direction.
   Three declarations that drop are three declarations nobody sees drop. Read
   after the transition rather than at the press. The three colours are the
   ones the button animates, so at the moment of the hover they are all still
   at rest. */
test('the pointer changes the fill, and leaves the ink that has to stay', async ({ page }) => {
  const at = page.locator('#primary button');
  const read = (el: Element) => [getComputedStyle(el).color, getComputedStyle(el).backgroundColor];
  const [ink, fill] = await at.evaluate(read);
  await at.hover();
  await page.waitForTimeout(400);
  const [inkOver, fillOver] = await at.evaluate(read);
  expect(fillOver, 'the accent did not answer the pointer').not.toBe(fill);
  /* The ink over the accent is the accent's own, and the fall back to the
     page's is what made it unreadable. */
  expect(inkOver).toBe(ink);
  expect(await at.evaluate(() => getComputedStyle(document.body).color)).not.toBe(inkOver);
});

/* The press is the state nothing in this tree can hold still. Nobody presses
   a card, so three properties that compute to nothing are wrong only under a
   finger. Read while the finger holds the button, which is the one place it
   exists. The box reads there too, because the rule that a state moves
   nothing does not stop at the pointer. */
test('the press answers, moves nothing, and resolves every colour', async ({ page }) => {
  const fill = (el: Element) => getComputedStyle(el).backgroundColor;
  for (const control of BUTTONS) {
    const at = page.locator(control);
    await at.hover();
    await page.waitForTimeout(400);
    const hovered = await at.evaluate(fill);
    const before = await at.boundingBox();

    await page.mouse.down();
    await page.waitForTimeout(400);
    const pressed = await at.evaluate(fill);
    const after = await at.boundingBox();
    const values = await at.evaluate((el) => {
      const style = getComputedStyle(el);
      return ['--sds-btn-ink-active', '--sds-btn-fill-active', '--sds-btn-edge-active'].map(
        (name) => [name, style.getPropertyValue(name).trim()] as const,
      );
    });
    await page.mouse.up();

    for (const [name, value] of values) {
      expect(value, `${control} left ${name} unresolved under the press`).not.toBe('');
    }
    expect(pressed, `${control} did not answer the press`).not.toBe(hovered);
    expect(after!.width, `${control} widened under the press`).toBeCloseTo(before!.width, 1);
    expect(after!.height, `${control} grew under the press`).toBeCloseTo(before!.height, 1);
  }
});

/* The wait is a state too, and two of its rules are ones no card can show. A
   bar has to stand in a cell as tall as the row it stands in for. Otherwise
   the table jumps the moment the answer lands. A row that cannot answer anything
   must not light up under the pointer as though it can. */
const WAITING = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
<script type="module" src="/dist/soul.js"></script>
</head>
<body class="sds-app">
  <sds-table id="waiting" loading loading-rows="3"></sds-table>
  <sds-table id="answered"></sds-table>
  <script type="module">
    const columns = [{ head: 'Tool' }, { head: 'Source' }, { head: 'Versions' }];
    const waiting = document.querySelector('#waiting');
    const answered = document.querySelector('#answered');
    waiting.columns = columns;
    answered.columns = columns;
    answered.rows = [{ cells: ['typo3_rule_lookup', 'bundled knowledge', '12.4'] }];
  </script>
</body>
</html>`;

test('a table waiting for its rows holds their height and answers no pointer', async ({ page }) => {
  await page.route('**/waiting.html', (route) => route.fulfill({ contentType: 'text/html', body: WAITING }));
  await page.goto('/waiting.html');
  await page.waitForFunction(() => customElements.get('sds-table') !== undefined);

  const bar = page.locator('#waiting tbody tr:first-child td:first-child .sds-skeleton');
  await expect(bar, 'the waiting table drew no bars').toHaveCount(1);
  expect(await bar.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe('');

  const height = (id: string) => page.locator(`#${id} tbody tr:first-child`).evaluate((el) => el.getBoundingClientRect().height);
  expect(await height('waiting'), 'the table jumps when the rows arrive').toBeCloseTo(await height('answered'), 0);

  const row = page.locator('#waiting tbody tr:first-child');
  await row.hover();
  const fill = await row.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(fill, 'a row with no answer in it lit up under the pointer').toBe('rgba(0, 0, 0, 0)');
});
