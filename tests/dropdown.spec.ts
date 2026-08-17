/* The dropdown's panel, which is a popover.

   Everything that used to be written into the element is the browser's now:
   opening, the press outside that closes it, Escape, the focus going back to
   the button, and the top layer that keeps an ancestor's overflow from
   clipping it. That is a good trade only as long as it is true, and none of it
   is visible in a screenshot of a closed control — so it is pressed here.

   The panel is placed inside a box that clips, because the clipping is the
   whole reason the top layer was worth moving to. */

import { test, expect } from '@playwright/test';

const PAGE = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
<script type="module" src="/dist/soul.js"></script>
</head>
<body class="sds-app">
  <!-- A box that clips, and a control near its bottom edge: before the top
       layer this is where a panel was cut in half. -->
  <div id="clip" style="overflow:hidden;height:120px;width:340px;padding:70px 16px 0">
    <sds-dropdown id="pages" label="Language" name="Language"></sds-dropdown>
  </div>
  <sds-dropdown id="commands" label="Edit"></sds-dropdown>
  <script type="module">
    const pages = document.querySelector('#pages');
    pages.choices = [
      { label: 'English', href: '#en', lang: 'en', current: true },
      { label: 'Deutsch', href: '#de', lang: 'de' },
    ];
    const commands = document.querySelector('#commands');
    commands.choices = [
      { label: 'Duplicate' },
      { label: 'Rename' },
      { label: 'Move to trash', disabled: true },
    ];
  </script>
</body>
</html>`;

test.beforeEach(async ({ page }) => {
  await page.route('**/dropdown-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: PAGE }));
  await page.goto('/dropdown-fixture.html', { waitUntil: 'load' });
  await page.waitForFunction(() => customElements.get('sds-dropdown') !== undefined, undefined, { timeout: 15_000 });
});

const button = (id: string) => `#${id} .sds-dropdown__button`;
const panel = (id: string) => `#${id} .sds-dropdown__panel`;

test('the button opens the panel and says so', async ({ page }) => {
  const trigger = page.locator(button('pages'));
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator(panel('pages'))).toBeHidden();

  await trigger.click();
  await expect(page.locator(panel('pages'))).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
});

/* The reason the panel is a popover at all. A box with `overflow: hidden`
   used to cut it off, and nothing in the element could reach out of it. */
test('the panel is not clipped by a box that clips', async ({ page }) => {
  await page.locator(button('pages')).click();
  const box = await page.locator(panel('pages')).boundingBox();
  const clip = await page.locator('#clip').boundingBox();
  expect(box).not.toBeNull();
  expect(clip).not.toBeNull();
  /* Below the clipping box's own bottom edge, and still drawn. */
  expect(box!.y + box!.height).toBeGreaterThan(clip!.y + clip!.height);
  await expect(page.locator(panel('pages'))).toBeVisible();
});

test('the panel hangs under the button it came from', async ({ page }) => {
  await page.locator(button('pages')).click();
  const at = await page.locator(button('pages')).boundingBox();
  const box = await page.locator(panel('pages')).boundingBox();
  /* Under it, and starting from the same edge — whichever way the engine
     placed it, from its own anchor or from the element's measurement. */
  expect(box!.y).toBeGreaterThanOrEqual(at!.y + at!.height);
  expect(Math.abs(box!.x - at!.x)).toBeLessThan(2);
});

/* The other placement. This browser has anchor positioning, so every test
   above takes the stylesheet's path and the element's own is never run — which
   is exactly the half that breaks unwatched. `CSS.supports` is what the
   element asks, so answering it differently is what puts it on the other
   route, and the inline edge it writes is the proof it went there. */
test('where the engine cannot anchor, the element places the panel itself', async ({ page }) => {
  await page.addInitScript(() => {
    const real = CSS.supports.bind(CSS);
    CSS.supports = ((...args: [string, string?]) =>
      args[0] === 'anchor-name' ? false : real(...(args as [string, string]))) as typeof CSS.supports;
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => customElements.get('sds-dropdown') !== undefined, undefined, { timeout: 15_000 });

  await page.locator(button('pages')).click();
  const placed = page.locator(panel('pages'));
  await expect(placed).toHaveAttribute('style', /inset-block-start:\s*\d/);
  const at = await page.locator(button('pages')).boundingBox();
  const box = await placed.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(at!.y + at!.height);
  expect(Math.abs(box!.x - at!.x)).toBeLessThan(2);
});

test('a press outside closes it, and Escape puts the reader back on the button', async ({ page }) => {
  await page.locator(button('pages')).click();
  await page.mouse.click(5, 5);
  await expect(page.locator(panel('pages'))).toBeHidden();
  await expect(page.locator(button('pages'))).toHaveAttribute('aria-expanded', 'false');

  await page.locator(button('pages')).click();
  await expect(page.locator(panel('pages'))).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator(panel('pages'))).toBeHidden();
  await expect(page.locator(button('pages'))).toBeFocused();
});

/* What is in the list decides what the list is: targets make it a disclosure
   of links, and no targets make it a menu the arrows walk. */
test('entries with a target are links, and are not announced as commands', async ({ page }) => {
  await page.locator(button('pages')).click();
  await expect(page.locator(panel('pages'))).not.toHaveAttribute('role', 'menu');
  const rows = page.locator(`${panel('pages')} .sds-dropdown__item`);
  await expect(rows).toHaveCount(2);
  await expect(rows.first()).toHaveAttribute('href', '#en');
  /* Its own language, so a reader hears the name in the language it names. */
  await expect(rows.nth(1)).toHaveAttribute('lang', 'de');
  await expect(rows.nth(1)).toHaveAttribute('hreflang', 'de');
});

/* The announcement is what the two kinds differ in — not whether a reader can
   reach the list. Down from the button opens it and steps in; up comes in from
   the other end. */
test('the arrows open a list of pages too, and walk it', async ({ page }) => {
  const trigger = page.locator(button('pages'));
  await trigger.focus();
  await trigger.press('ArrowDown');
  await expect(page.locator(panel('pages'))).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  const rows = page.locator(`${panel('pages')} .sds-dropdown__item`);
  await expect(rows.first()).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(rows.nth(1)).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(rows.first()).toBeFocused();
  await page.keyboard.press('End');
  await expect(rows.nth(1)).toBeFocused();
});

test('entries with no target are a menu the arrows walk', async ({ page }) => {
  const trigger = page.locator(button('commands'));
  await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
  await trigger.click();
  await expect(page.locator(panel('commands'))).toHaveAttribute('role', 'menu');

  await trigger.press('ArrowDown');
  const rows = page.locator(`${panel('commands')} .sds-dropdown__item`);
  await expect(rows.first()).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(rows.nth(1)).toBeFocused();
  /* Stops at the end rather than wrapping, and never lands on the disabled
     row — a list that starts over hides how long it was. */
  await page.keyboard.press('ArrowDown');
  await expect(rows.nth(1)).toBeFocused();
});

test('choosing reports the entry and closes the panel', async ({ page }) => {
  await page.evaluate(() => {
    (window as unknown as { chosen: unknown[] }).chosen = [];
    document.addEventListener('sds-dropdown-choose', (event) => {
      (window as unknown as { chosen: unknown[] }).chosen.push((event as CustomEvent).detail.choice.label);
    });
  });
  await page.locator(button('commands')).click();
  await page.locator(`${panel('commands')} .sds-dropdown__item`).first().click();
  await expect(page.locator(panel('commands'))).toBeHidden();
  expect(await page.evaluate(() => (window as unknown as { chosen: string[] }).chosen)).toEqual(['Duplicate']);
});
