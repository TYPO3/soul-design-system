/* Content written between an element's tags survives its upgrade.

   `sds-code` has two ways in. `.body` is data it turns into spans, and every
   specimen card is made that way — so `make cards` and the pixel diff already
   watch it. Content between the tags had nothing watching it: the element
   renders light DOM, so `render()` replaces its children, and the whole
   feature is the one line in `connectedCallback` that lifts them out first.
   Delete that line and every content-form block becomes an empty frame, with
   the props path green and the cards identical.

   `renderStatic` refuses this form deliberately, which is checked here too:
   a card cannot carry an element, and Lit SSR strands authored children beside
   the element's template rather than inside it. The browser is where this form
   is meant to work, so the browser is where it is proven. */

import { test, expect } from '@playwright/test';
import { gotoStory } from './lib/story.ts';

test('a code block frames the content written between its tags', async ({ page }) => {
  await gotoStory(page, 'components-code--from-content');

  const block = page.locator('sds-code');
  await expect(block).toHaveCount(1);

  /* The frame is the component's, and the content is inside it — not beside
     it, which is what the export produces and what a lost `connectedCallback`
     would leave behind. */
  const body = block.locator('.sds-code__body');
  await expect(body).toHaveCount(1);
  await expect(body.locator('code.language-json')).toHaveCount(1);
  await expect(body).toContainText('"versions": ["12.4", "13.4", "14.3"]');

  /* Nothing stranded outside the body. */
  const stray = await block.evaluate((el) =>
    [...el.children].filter((c) => !c.classList.contains('sds-code')).length);
  expect(stray, 'the element should hold nothing but the frame it renders').toBe(0);
});

test('the head carries the language and a working copy button', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await gotoStory(page, 'components-code--from-content');

  await expect(page.locator('.sds-code__lang')).toHaveText('json');

  const copy = page.locator('.sds-code__copy');
  await expect(copy).toHaveCount(1);
  await copy.click();

  /* The clipboard holds the block and nothing else — asserted whole, because
     `toContain` passed for a year while the head came with it: a paste began
     `json copy` and then the first line. What frames a block is not part of
     it, and the element renders that frame into its own light DOM. */
  const written = await page.evaluate(() => navigator.clipboard.readText());
  expect(written).toBe('{\n  "domains": ["labels", "xlf"],\n  "versions": ["12.4", "13.4", "14.3"]\n}');

  /* The class alone was asserted once and it was not enough: the stylesheet
     hid the duplicate on `is-copied` without ever showing the check, so the
     button lost a glyph and gained nothing while this test stayed green.
     What a person sees is which glyph is on screen. */
  await expect(copy).toHaveClass(/is-copied/);
  await expect(copy.locator('.sds-code__copied')).toBeVisible();
  await expect(copy.locator('.sds-code__glyph')).toBeHidden();
  await expect(copy).toHaveText(/copied/);
});

/* The drawing at the size it was drawn.

   A 1200px diagram scaled into a page column is a picture of a diagram, and
   the viewer is the only place the reader gets the thing itself. Three parts
   have to hold together and only the first is visible in a screenshot: the
   trigger is a real link to the file, so a surface with no script still opens
   it; the element takes the press over once it has upgraded; and the platform
   closes it on Escape and gives the focus back. */
test('a figure opens its drawing, and stays a link where nothing upgraded', async ({ page }) => {
  await gotoStory(page, 'components-figure--zoomable');

  const trigger = page.locator('.sds-figure__zoom');
  /* The href is the fallback, not decoration: without it a script-less surface
     has a cursor that changes over something that does nothing. */
  await expect(trigger).toHaveAttribute('href', /answer-sources\.svg$/);

  const dialog = page.locator('dialog.sds-lightbox');
  await expect(dialog).toBeHidden();

  await trigger.click();
  await expect(dialog).toBeVisible();
  /* The page did not navigate to the file — the element took the press. */
  expect(page.url()).toContain('components-figure--zoomable');
  await expect(dialog.locator('img')).toHaveCount(2);

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});
