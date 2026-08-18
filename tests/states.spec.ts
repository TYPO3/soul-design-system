/* What a state changes, and what it must not.

   A state assigns into a component's own set, and a property whose default
   reads the one a state assigns from it is a cycle — invalid at computed
   value, which is not an error anywhere: the declaration simply drops. The
   button lost its border under the pointer and shrank by it, and its ink fell
   back to whatever the page inherits, which on the accent fill is unreadable.
   Nothing in the tree could see that, because a card is never hovered. */

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
  <sds-dropdown label="Language" name="Language" id="trigger"></sds-dropdown>
  <script type="module">
    document.querySelector('#trigger').choices = [{ label: 'English', href: '#en', lang: 'en' }];
  </script>
</body>
</html>`;

const CONTROLS = ['#primary button', '#secondary button', '#ghost button', '#trigger .sds-dropdown__button'];

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

/* The state has to do something, or the cycle is back in the other direction:
   three declarations that drop are three declarations nobody sees drop. Read
   after the transition rather than at the press — the three colours are the
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
  /* The ink over the accent is the accent's own, and falling back to the
     page's is what made it unreadable. */
  expect(inkOver).toBe(ink);
  expect(await at.evaluate(() => getComputedStyle(document.body).color)).not.toBe(inkOver);
});
