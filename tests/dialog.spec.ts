/* sds-dialog — the question, and the answer coming back.

   A confirmation is the platform's own: the pair is a `<form method="dialog">`,
   so a press on one closes the dialog and records which. That buys a question
   written entirely in markup. It holds only as long as the two events say
   which press it was, at a second open included. A `returnValue` left in
   place there makes the dialog answer with the last reader's press.

   The size scale measures beside it because a cap is only a cap if something
   gives: the body is what scrolls. And the head measures in every surface
   that draws one. It is `sds-modal`'s node in a `<dialog>` and in a lightbox.
   The lightbox is where a set read off the wrong ancestor showed up as a
   close button in the corner of the border. */

import { test, expect } from '@playwright/test';

const LONG = 'Every size stops somewhere, and this is what it stops. '.repeat(40);

/* A heading nobody shortened, and a word nothing can break. The two ways a
   title takes the whole row and pushes what is beside it out of the box. */
const WIDE = 'Publish the task skills into the workspace and record the setup?';
const UNBREAKABLE = 'Reindexierungsauftragsbestaetigungsbenachrichtigungsdienst';

/* A drawing that needs no server. The lightbox is here for its head, which is
   the modal's, and the stage under it only has to have something in it. */
const DRAWING =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 4 3%22%3E%3C/svg%3E';

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

  <sds-dialog id="wide" heading="${WIDE}" body="Nothing else is touched."
    confirm-label="Publish"></sds-dialog>
  <sds-dialog id="word" heading="${UNBREAKABLE}" body="Nothing else is touched."
    confirm-label="Publish"></sds-dialog>
  <sds-lightbox id="drawing" src="${DRAWING}" alt="A drawing"
    caption="A drawing at the size it was drawn"></sds-lightbox>

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

  /* The way out first and the press with no way back last. That is the order
     the rest of the system reads in. It is also the reason the tone is on the
     second button rather than in the heading. */
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
  await expect.poll(() => heard(page)).toEqual(['sds-dialog-confirm:confirm']);
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
  await expect(page.locator(box('confirm'))).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator(box('confirm'))).toBeHidden();

  /* Polled, not read once. The element speaks on the platform's `close`,
     which comes in a task of its own after the box has gone. */
  await expect.poll(() => heard(page)).toEqual([
    'sds-dialog-cancel:confirm',
    'sds-dialog-cancel:confirm',
    'sds-dialog-cancel:confirm',
  ]);
});

/* `returnValue` outlives a close. Left in place, whoever pressed the first
   question answers the second. */
test('an answered question does not answer the next one', async ({ page }) => {
  await page.locator('#open').click();
  await page.locator(`${foot('confirm')} button`).nth(1).click();
  await expect(page.locator(box('confirm'))).toBeHidden();

  await page.locator('#open').click();
  await expect(page.locator(box('confirm'))).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator(box('confirm'))).toBeHidden();

  await expect.poll(() => heard(page)).toEqual(['sds-dialog-confirm:confirm', 'sds-dialog-cancel:confirm']);
});

test('ask() settles on the press', async ({ page }) => {
  const answer = page.evaluate(() =>
    (document.querySelector('#confirm') as HTMLElement & { ask(): Promise<boolean> }).ask());
  await expect(page.locator(box('confirm'))).toBeVisible();
  await page.locator(`${foot('confirm')} button`).nth(1).click();
  expect(await answer).toBe(true);
});

/* Both directions of one size: the width it takes, and the height it stops at.
   Past that the head and the foot stay where they are and the body is the
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

/* The head is one row in three surfaces. Every value it draws with once came
   off `.sds-modal`, which a lightbox is not. So its whole set arrived as
   nothing: no padding, no rule, and the close button against the corner. */
test('the head places its title and its close alike in every surface', async ({ page }) => {
  const heads: Record<string, unknown>[] = [];
  for (const id of ['confirm', 'wide', 'word', 'drawing']) {
    await page.evaluate((id) => (document.querySelector(`#${id}`) as HTMLElement & { show(): void }).show(), id);
    await expect(page.locator(`#${id} dialog .sds-modal__head`)).toBeVisible();
    heads.push(await page.evaluate((id) => {
      const root = document.querySelector(`#${id}`)!;
      const surface = root.querySelector('dialog')!.getBoundingClientRect();
      const title = root.querySelector('.sds-modal__title')!.getBoundingClientRect();
      const close = root.querySelector('.sds-modal__close')!.getBoundingClientRect();
      const glyph = root.querySelector('.sds-modal__close svg')!.getBoundingClientRect();
      return {
        /* The title starts where the mark ends. A square around a glyph reaches
           the padding edge. The head gives that half back, so the two marks
           stand the same distance from their own edges. */
        titleInset: Math.round(title.left - surface.left),
        glyphInset: Math.round(surface.right - glyph.right),
        /* Never squeezed into a rectangle, and never pushed past the border. */
        close: `${Math.round(close.width)}x${Math.round(close.height)}`,
        clear: close.right <= surface.right && close.left > title.right,
      };
    }, id));
    await page.evaluate((id) => (document.querySelector(`#${id}`) as HTMLElement & { close(): void }).close(), id);
  }

  const first = heads[0]!;
  expect(first).toMatchObject({ close: '28x28', clear: true });
  expect(first.titleInset).toBe(first.glyphInset);
  for (const head of heads.slice(1)) expect(head).toEqual(first);
});

/* Both strips are a row of controls, and the foot's are the taller. So the
   head gets that band as a floor rather than the height its own smaller
   button happens to make. Unequal, the body sits in a lopsided sandwich. */
test('the head and the foot are the same band', async ({ page }) => {
  await page.locator('#open').click();
  const above = (await page.locator(`#confirm .sds-modal__head`).boundingBox())!;
  const below = (await page.locator(foot('confirm')).boundingBox())!;
  expect(Math.round(above.height)).toBe(Math.round(below.height));
});
