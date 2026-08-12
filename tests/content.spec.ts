/* Content written between an element's tags survives its upgrade.

   `sds-code` has two ways in, and the property path is already watched by the
   cards and the pixel diff. Content between the tags is not: the element
   renders light DOM, so `render()` replaces its children, and the whole feature
   is the one line in `connectedCallback` that lifts them out first. Delete it
   and every content-form block is an empty frame with the cards identical.

   `renderStatic` refuses this form deliberately, which is checked here too. The
   browser is where the form works, so the browser is where it is proven. */

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

/* A caption written between the tags is the second thing this form carries,
   and it must not become the first: everything else the component does with
   its children reads them as the block. The theme drew the caption beside the
   element for exactly this reason, and that put the placement of a block's own
   caption outside the block. */
test('a caption written between the tags is kept, above the frame and off the clipboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await gotoStory(page, 'components-code--captioned-from-content');

  const block = page.locator('sds-code');

  /* Inside the element and above the frame — the order is the assertion, and
     it is the same order the `caption` attribute renders. */
  const order = await block.evaluate((el) => [...el.children].map((c) => c.className));
  expect(order).toEqual(['sds-code__caption', 'sds-code']);

  /* The markup inside it survived, which is the whole reason this form exists
     beside the attribute. */
  await expect(block.locator('.sds-code__caption code')).toHaveText('composer.json');

  /* And the block is only the block: not captioned, not highlighted as if the
     sentence were a line of code. */
  const body = block.locator('.sds-code__body');
  await expect(body).not.toContainText('Installing');
  await expect(body).toContainText('composer require typo3/cms-core');

  await page.locator('.sds-code__copy').click();
  const written = await page.evaluate(() => navigator.clipboard.readText());
  expect(written).toBe('composer require typo3/cms-core\nvendor/bin/typo3 cache:flush');
});

/* The frame a renderer wrote, kept rather than written again. A block rendered
   twice is a nuisance; a frame written twice is a *document fetched twice* — a
   video that starts loading, is dropped and starts again. The theme rests on
   the server writing the frame, so the element takes that node. */
test('an embed keeps the frame written between its tags, and fetches it once', async ({ page }) => {
  await gotoStory(page, 'components-embed--given');

  const embed = page.locator('sds-embed');
  const frame = embed.locator('.sds-embed__frame');
  await expect(frame).toHaveCount(1);

  /* One frame, and it is the one the renderer wrote — the same node, moved
     into the element's own frame rather than a second one beside it. */
  const frames = embed.locator('iframe');
  await expect(frames).toHaveCount(1);
  await expect(frames).toHaveAttribute('src', /colors-borders\.card\.html$/);
  expect(await frame.locator('> iframe').count(), 'the frame the element renders holds it').toBe(1);

  /* The caption written beside it is placed where the component puts
     captions — under the frame, with its markup intact. */
  const order = await embed.locator('.sds-embed').evaluate((el) =>
    [...el.children].map((c) => c.className));
  expect(order).toEqual(['sds-embed__frame sds-embed__frame--fixed', 'sds-embed__caption']);
  await expect(embed.locator('.sds-embed__caption .sds-mono')).toHaveText('700x240');
});

/* A card is embedded at the size it was measured at, and a player at none.

   The two shapes are the whole component, and neither is visible in a
   screenshot of a page wide enough for both: what separates them is what
   happens when the column is narrower than the document inside. */
test('an embed holds its ratio where it is fluid and its size where it is fixed', async ({ page }) => {
  await page.setViewportSize({ width: 520, height: 800 });
  await gotoStory(page, 'components-embed--fixed');

  const fixed = page.locator('.sds-embed__frame--fixed');
  const inner = await fixed.locator('iframe').evaluate((el) => el.getBoundingClientRect().width);
  /* Narrower than the card, so the frame scrolls and the card keeps the width
     its `@dsCard` header declares. A frame that had squeezed it would report
     the column's width here. */
  expect(Math.round(inner)).toBe(700);
  expect(await fixed.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);

  await gotoStory(page, 'components-embed--default');
  const fluid = page.locator('.sds-embed__frame--fluid');
  const box = await fluid.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { w: r.width, h: r.height };
  });
  /* 16 / 9 at whatever width the column is, and the document inside fills it
     in both directions. */
  expect(box.w / box.h).toBeCloseTo(16 / 9, 1);
  const filled = await fluid.evaluate((el) => ({
    inside: el.clientWidth,
    frame: el.querySelector('iframe')!.getBoundingClientRect().width,
  }));
  expect(Math.round(filled.frame)).toBe(filled.inside);
});

/* And the same form on the figure, where the stakes are the picture itself: a
   renderer writes the `<img>` for a reader with no script, an element
   rebuilding it from `src` would fetch the file again, and one ignoring the
   children would frame nothing with the picture stranded beside it. */
test('a figure keeps the picture and the caption written between its tags', async ({ page }) => {
  await gotoStory(page, 'components-figure--given');

  const figure = page.locator('sds-figure');
  const pictures = figure.locator('img');
  await expect(pictures).toHaveCount(1);
  expect(await figure.locator('.sds-figure__frame > img').count(), 'inside the frame, not beside it').toBe(1);

  /* The caption is the renderer's own node, under the picture, with the
     markup an attribute could not have carried. */
  const order = await figure.locator('figure.sds-figure').evaluate((el) =>
    [...el.children].map((c) => c.tagName.toLowerCase()));
  expect(order).toEqual(['div', 'figcaption']);
  await expect(figure.locator('figcaption.sds-figure__caption code')).toHaveText('literal');
});

/* The drawing at the size it was drawn, which the viewer is the only place to
   get. Three parts hold together and only the first shows in a screenshot: the
   trigger is a real link, so a surface with no script still opens it; the
   element takes the press over on upgrade; and Escape gives the focus back. */
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
  /* The drawing itself and not a picture of it: referenced into this document
     with `<use>`, which is what lets it take the colours of the page it opened
     over rather than the ones its own file falls back to. */
  await expect(dialog.locator('svg.sds-art use')).toHaveAttribute('href', /answer-sources\.svg#art$/);

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});
