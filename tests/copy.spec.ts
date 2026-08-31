/* A value the reader takes away.

   The clipboard is the one thing here nothing else can see: a card is a
   picture, the markup says only that there is a button, and a browser with no
   clipboard is supposed to get no button at all. Pressed here, and read back
   out of the clipboard rather than off the element that claims to have
   written it. */

import { test, expect } from '@playwright/test';

const PAGE = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/dist/soul.css" />
<script type="module" src="/dist/soul.js"></script>
</head>
<body class="sds-app">
  <dl>
    <dt>Directory</dt>
    <dd><sds-copy id="dir" label="Directory" value="~/projects/blog/.worktrees/14-3-dev"></sds-copy></dd>
    <dt>Database</dt>
    <dd><sds-copy id="db" label="Database" value="companion_14_3_dev"></sds-copy></dd>
  </dl>
  <sds-copy id="bare" value="admin"></sds-copy>
</body>
</html>`;

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test.beforeEach(async ({ page }) => {
  await page.route('**/copy-fixture.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: PAGE }));
  await page.goto('/copy-fixture.html', { waitUntil: 'load' });
  await page.waitForFunction(() => customElements.get('sds-copy') !== undefined, undefined, { timeout: 15_000 });
  await expect(page.locator('#dir button')).toBeVisible();
});

test('the press puts the value on the clipboard, and nothing that frames it', async ({ page }) => {
  await page.locator('#dir button').click();
  const written = await page.evaluate(() => navigator.clipboard.readText());
  expect(written, 'the value whole, with no term and no chrome around it').toBe('~/projects/blog/.worktrees/14-3-dev');

  await page.locator('#db button').click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('companion_14_3_dev');
});

test('each button says what it copies, so two of them can be told apart', async ({ page }) => {
  await expect(page.locator('#dir button')).toHaveAttribute('aria-label', 'Copy Directory');
  await expect(page.locator('#dir button')).toHaveAttribute('title', 'Copy Directory');
  await expect(page.locator('#db button')).toHaveAttribute('aria-label', 'Copy Database');
  /* Without a name it says the true thing that names nothing. */
  await expect(page.locator('#bare button')).toHaveAttribute('aria-label', 'Copy this value');
});

test('a press that worked says so, in the glyph and out loud', async ({ page }) => {
  const said = page.locator('#dir .sds-said-only');
  await expect(said).toHaveText('');
  await expect(page.locator('#dir [data-icon="actions-duplicate"]')).toBeVisible();
  await expect(page.locator('#dir .sds-btn__label'), 'one glyph, and the sentence in title').toHaveCount(0);

  await page.locator('#dir button').click();
  await expect(page.locator('#dir [data-icon="actions-check"]')).toBeVisible();
  await expect(page.locator('#dir [data-icon="actions-duplicate"]')).toHaveCount(0);
  await expect(page.locator('#dir button')).toHaveClass(/is-copied/);
  /* A word that changes in place is not announced; a node that was empty is. */
  await expect(said, 'a press that only changed a glyph is one a reader never hears about')
    .toHaveText('Copied Directory');

  /* And it goes back on its own, so the next press has something to say. */
  await expect(said).toHaveText('', { timeout: 4000 });
  await expect(page.locator('#dir [data-icon="actions-duplicate"]')).toBeVisible();
});

test.describe('an origin that is not a secure context', () => {
  /* Exactly what `http://a-host.test:6006` gives a browser: no async clipboard
     at all. A LAN address or a `.test` domain over http is where a design
     system is looked at, and asking whether the API is there and drawing
     nothing when it is not left no icon, no press and no hover on every one of
     those — which reads as a component that does not work. */
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { get: () => undefined, configurable: true });
    });
    await page.goto('/copy-fixture.html', { waitUntil: 'load' });
    await page.waitForFunction(() => customElements.get('sds-copy') !== undefined, undefined, { timeout: 15_000 });
  });

  test('still draws the press, and still copies', async ({ page }) => {
    await expect(page.locator('#dir button')).toBeVisible();
    await expect(page.locator('#dir [data-icon="actions-duplicate"]')).toBeVisible();

    /* The older way, which every browser has and no context withholds. What it
       put on the clipboard cannot be read back here — the read side is the same
       API that is missing — so the event the browser fires is the witness. */
    const heard = await page.evaluate(async () => {
      let taken: string | null = null;
      document.addEventListener('copy', (event) => {
        taken = (event as ClipboardEvent).target instanceof HTMLTextAreaElement
          ? (event.target as HTMLTextAreaElement).value
          : '';
      }, { once: true });
      (document.querySelector('#dir button') as HTMLElement).click();
      await new Promise((r) => setTimeout(r, 200));
      return taken;
    });
    expect(heard, 'the value whole, by the way that works here').toBe('~/projects/blog/.worktrees/14-3-dev');
    await expect(page.locator('#dir [data-icon="actions-check"]')).toBeVisible();
  });

  test('and a code block keeps its copy button too', async ({ page }) => {
    await page.evaluate(() => {
      const block = document.createElement('sds-code');
      block.id = 'block';
      block.setAttribute('source', 'ls -la');
      block.setAttribute('copy', '');
      document.body.append(block);
    });
    await expect(page.locator('#block .sds-code__copy')).toBeVisible();
  });
});

test('the value gives up the room, never the press', async ({ page }) => {
  const shape = await page.evaluate(() => {
    const host = document.querySelector('#dir') as HTMLElement;
    const value = host.querySelector('.sds-copy__value') as HTMLElement;
    const button = host.querySelector('.sds-copy__button') as HTMLElement;
    /* Squeezed to less than the pair needs, which is a value in a column. */
    host.style.width = '220px';
    return {
      font: getComputedStyle(value).fontFamily,
      wrap: getComputedStyle(value).overflowWrap,
      button: Math.round(button.getBoundingClientRect().width),
      loose: Math.round(button.scrollWidth),
    };
  });
  expect(shape.font, 'a path is the machine’s own text').toContain('Source Code Pro');
  expect(shape.wrap, 'a path has no spaces to break at').toBe('anywhere');
  /* The press keeps what it needs; the path wraps under itself instead. */
  expect(shape.button).toBeGreaterThanOrEqual(shape.loose);
});
