/* sds-dialog — the question, and the answer coming back.

   A confirmation is the platform's own: the pair is a `<form method="dialog">`,
   so pressing one closes the dialog and records which. That buys a question
   written entirely in markup, and it holds only as long as the two events say
   what was pressed — including at a second opening, where a `returnValue` left
   standing would have the dialog answering with the last reader's press.

   The size scale is measured beside it because a cap is only a cap if
   something gives: the body is what scrolls. */

import { test, expect } from '@playwright/test';

const LONG = 'Every size stops somewhere, and this is what it stops. '.repeat(40);

const PAGE = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
<script type="module" src="/dist/soul.js"></script>
</head>
<body class="sds-app">
  <sds-button id="open" for="confirm" variant="secondary">Remove the token…</sds-button>
  <sds-dialog id="confirm" heading="Remove this token?"
    body="Anything using it stops answering immediately."
    confirm-label="Remove" confirm-icon="actions-delete"
    cancel-label="Keep it" tone="danger"></sds-dialog>

  <sds-button id="open-long" for="long" variant="secondary">A long one…</sds-button>
  <sds-dialog id="long" heading="A great deal to read" body="${LONG}"
    confirm-label="Got it"></sds-dialog>

  <script type="module">
    globalThis.heard = [];
    for (const name of ['sds-dialog-confirm', 'sds-dialog-cancel']) {
      document.addEventListener(name, (event) => {
        globalThis.heard.push(event.type + ':' + event.target.id);
      });
    }
  </script>
</body>
</html>`;

const heard = (page: import('@playwright/test').Page): Promise<string[]> =>
  page.evaluate(() => (globalThis as unknown as { heard: string[] }).heard);

test.beforeEach(async ({ page }) => {
  await page.route('**/dialog-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: PAGE }));
  await page.goto('/dialog-fixture.html', { waitUntil: 'load' });
  await page.waitForFunction(() => customElements.get('sds-dialog') !== undefined, undefined, { timeout: 15_000 });
});

const box = (id: string) => `#${id} dialog.sds-modal`;
const foot = (id: string) => `#${id} .sds-modal__foot`;

test('a button that names the dialog opens it, and the pair is the labels', async ({ page }) => {
  await expect(page.locator(box('confirm'))).toBeHidden();
  await page.locator('#open').click();
  await expect(page.locator(box('confirm'))).toBeVisible();

  /* The way out first and the press that cannot be undone last — the order
     the rest of the system reads in, and the reason the tone is on the second
     button rather than announced in the heading. */
  const buttons = page.locator(`${foot('confirm')} button`);
  await expect(buttons).toHaveCount(2);
  await expect(buttons.nth(0)).toHaveText('Keep it');
  await expect(buttons.nth(0)).toHaveClass(/sds-btn--ghost/);
  await expect(buttons.nth(1)).toHaveText('Remove');
  await expect(buttons.nth(1)).toHaveClass(/sds-btn--danger/);
  /* The glyph leads, and is a sibling of the label rather than inside it —
     the row's gap is what sets the two apart. */
  const first = await buttons.nth(1).evaluate((el) => el.firstElementChild?.tagName.toLowerCase());
  expect(first).toBe('sds-icon');
});

test('the confirming press is the one that says so', async ({ page }) => {
  await page.locator('#open').click();
  await page.locator(`${foot('confirm')} button`).nth(1).click();
  await expect(page.locator(box('confirm'))).toBeHidden();
  expect(await heard(page)).toEqual(['sds-dialog-confirm:confirm']);
});

/* A question dismissed is an answer a caller has to act on, so all three of
   these are one event rather than silence. */
test('the cancel button, the header X and Escape are all a cancel', async ({ page }) => {
  await page.locator('#open').click();
  await page.locator(`${foot('confirm')} button`).nth(0).click();
  await expect(page.locator(box('confirm'))).toBeHidden();

  await page.locator('#open').click();
  await page.locator(`#confirm .sds-modal__head .sds-btn--icon`).click();
  await expect(page.locator(box('confirm'))).toBeHidden();

  await page.locator('#open').click();
  await page.keyboard.press('Escape');
  await expect(page.locator(box('confirm'))).toBeHidden();

  expect(await heard(page)).toEqual([
    'sds-dialog-cancel:confirm',
    'sds-dialog-cancel:confirm',
    'sds-dialog-cancel:confirm',
  ]);
});

/* `returnValue` outlives a close. Left standing, the second question would be
   answered by whoever pressed the first one. */
test('an answered question does not answer the next one', async ({ page }) => {
  await page.locator('#open').click();
  await page.locator(`${foot('confirm')} button`).nth(1).click();
  await expect(page.locator(box('confirm'))).toBeHidden();

  await page.locator('#open').click();
  await page.keyboard.press('Escape');
  await expect(page.locator(box('confirm'))).toBeHidden();

  expect(await heard(page)).toEqual(['sds-dialog-confirm:confirm', 'sds-dialog-cancel:confirm']);
});

test('ask() settles on what was pressed', async ({ page }) => {
  const answer = page.evaluate(() =>
    (document.querySelector('#confirm') as HTMLElement & { ask(): Promise<boolean> }).ask());
  await expect(page.locator(box('confirm'))).toBeVisible();
  await page.locator(`${foot('confirm')} button`).nth(1).click();
  expect(await answer).toBe(true);
});

/* Both directions of one size: the width it takes, and the height it stops at
   — past which the head and the foot stay where they are and the body is the
   part that gives. */
test('a size is a width and a height, and the body is what scrolls', async ({ page }) => {
  await page.locator('#open-long').click();
  const surface = page.locator(box('long'));
  await expect(surface).toBeVisible();

  const shape = (await surface.boundingBox())!;
  expect(Math.round(shape.width)).toBe(360);
  expect(shape.height).toBeLessThanOrEqual(page.viewportSize()!.height * 0.5 + 1);

  const scrolls = await page.locator(`#long .sds-modal__body`).evaluate(
    (el) => el.scrollHeight > el.clientHeight + 1);
  expect(scrolls).toBe(true);
});
