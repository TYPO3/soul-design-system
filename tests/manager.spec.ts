/* The Storybook shell itself boots.

   Everything else in this suite opens `/iframe.html`, the preview. Nothing
   opens `/`: the sidebar, the toolbar, the surface a person looks at. So a
   manager that crashes on load is invisible to a green run. The manager's
   configuration is in a file the preview never imports, so nothing about the
   preview can stand in for this. */

import { test, expect } from '@playwright/test';

import { VIEWPORTS } from '../.storybook/viewports.ts';

test('the manager shell boots, with its sidebar and no page errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  /* The manager bundle renders the tree. If that bundle threw, the selector
     never appears. That is the failure this test exists for, so it is a claim
     rather than a wait with a catch. */
  await page.waitForSelector('#storybook-explorer-tree', { timeout: 30_000 });

  const links = await page.locator('#storybook-explorer-tree a').count();
  expect(links, 'the sidebar must list the stories').toBeGreaterThan(0);

  /* The system's name, not the tool's. `manager.ts` sets it, and a broken
     theme object takes it down with the rest of the shell. */
  await expect(page.locator('.sidebar-header')).toContainText('Soul Design System');

  expect(errors, 'the manager must boot clean').toEqual([]);
});

/* The viewport list's configuration is in the preview and the manager renders
   it. So `tests/viewports.spec.ts`, which compares two files, cannot see if
   any of it arrives. Both halves have their check here: the entries reach the
   toolbar in the written order, and a choice of one resizes the preview. A
   menu that moves nothing looks exactly like one that works. */
test('the toolbar offers the sizes, and a choice of one resizes the preview', async ({ page }) => {
  await page.goto('/?path=/story/pages-landing--page', { waitUntil: 'networkidle' });
  await page.waitForSelector('#storybook-explorer-tree', { timeout: 30_000 });

  await page.getByRole('button', { name: 'Viewport size' }).click();

  /* Reset comes first and belongs to the tool, not to this system. */
  const offered = await page.getByRole('option').allInnerTexts();
  expect(offered.slice(1)).toEqual(Object.values(VIEWPORTS).map((viewport) => viewport.name));

  const tablet = VIEWPORTS['tablet-portrait'];
  await page.getByRole('option', { name: tablet?.name }).click();

  const frame = page.locator('#storybook-preview-iframe');
  await expect(frame).toHaveCSS('width', tablet?.styles.width ?? '');

  /* And the page inside it answered. 768 is under the width where the bar
     starts to give things up, and the version badge is the first to go.
     Without this the test passes on a preview that resized around a story
     whose stylesheet never loaded. */
  await expect(frame.contentFrame().locator('.sds-bar sds-badge')).toBeHidden();
});
