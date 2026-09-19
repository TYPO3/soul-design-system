/* The Storybook shell itself: it boots, and its surfaces answer.

   The stories run under Vitest, one test each, with no shell around them.
   This opens the built Storybook. `/`, with the sidebar and the toolbar a
   person looks at. And `/iframe.html`, where a control change re-renders a
   story and the docs page draws on the themed canvas. A manager that crashes
   on load is invisible to a green story run. The manager's configuration is
   in a file the preview never imports, so nothing about the preview can
   stand in for this. */

import { test, expect } from '@playwright/test';

import { VIEWPORTS } from '../.storybook/viewports.ts';
import { gotoStory } from './lib/story.ts';

interface StoryEntry {
  id: string;
  title: string;
  name: string;
  type: 'story' | 'docs';
  importPath: string;
}

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
  await page.goto('/?path=/story/pages-site-landing--page', { waitUntil: 'networkidle' });
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

test('the index lists every component and specimen group', async ({ request }) => {
  const res = await request.get('/index.json');
  expect(res.ok(), 'the built Storybook’s index.json must answer').toBeTruthy();
  const index = (await res.json()) as { entries: Record<string, StoryEntry> };
  const titles = new Set(Object.values(index.entries).map((e) => e.title));

  /* The written pages are not here any more: they are reStructuredText under
     `docs/`, rendered by Guides and published. What Storybook keeps is what
     only Storybook can do — a component with its controls, and the specimen
     each card comes from. So the list checks those, and a specimen group
     that vanishes is still a page that documents nothing any more. */
  const groups = new Set([...titles].map((t) => t.split('/').slice(0, 2).join('/')));
  for (const group of ['Specimens/Brand', 'Specimens/Colours', 'Specimens/Type', 'Specimens/States']) {
    expect(groups, `${group} must have specimens`).toContain(group);
  }

  for (const expected of [
    /* One page per component, and the list is the check. A component split
       out of a file with no page of its own documents nothing. */
    'Components/Content/Badge',
    'Components/Actions/Button',
    'Components/Code/Code',
    'Components/Code/Diff',
    'Components/Overlays/Dialog',
    'Components/Theme/Icon',
    'Components/Content/Image',
    'Components/Actions/Link',
    'Components/Overlays/Modal',
    'Components/Navigation/Nav breadcrumb',
    'Components/Navigation/Nav main',
    'Components/Navigation/Nav pager',
    'Components/Navigation/Nav pagination',
    'Components/Navigation/Nav pills',
    'Components/Navigation/Nav rail',
    'Components/Feedback/Note',
    'Components/Overlays/Overlay',
    'Components/Navigation/Search',
    'Components/Content/Surface',
    'Components/Content/Table',
    'Components/Content/Table density',
    'Components/Navigation/Tabs',
    'Components/Theme/Theme',
    /* The parts of a form are their own domain. Somebody who builds one
       looks them up together. A reader after a field does not want to
       arrive by way of the figure and the footer. */
    'Components/Forms/Field',
    'Components/Forms/Field error',
    'Components/Forms/Form errors',
    'Components/Forms/Checkbox',
    'Components/Forms/Radio',
    /* And the whole layouts. They are live in Storybook on purpose. Vitest
       opens every story, so a page is a page under test rather than a
       picture of one. */
    'Pages/Catalog/Answer',
    'Pages/Docs/Documentation',
    'Pages/Site/Feature',
    'Pages/Site/Landing',
    'Pages/Docs/Tool reference',
  ]) {
    expect(titles, `${expected} should have a page`).toContain(expected);
  }
});

/* What a control does. The story renders a second time, into elements that
   took what stood between their tags on the first — see the decorator in
   `.storybook/preview.ts`. Nothing else renders a story twice. So a
   component that only breaks on the second one reads as green everywhere, as
   the story run opens each story once. */
const STORY = 'components-actions-button--primary';
const CHANGED = { label: 'Stop the checks', variant: 'secondary' };

async function setArgs(page: import('@playwright/test').Page, id: string, args: Record<string, string>): Promise<void> {
  await page.evaluate(([story, updated]) => {
    const channel = (globalThis as { __STORYBOOK_ADDONS_CHANNEL__?: { emit(event: string, payload: unknown): void } })
      .__STORYBOOK_ADDONS_CHANNEL__;
    channel?.emit('updateStoryArgs', { storyId: story, updatedArgs: updated });
  }, [id, args] as [string, Record<string, string>]);
}

test('a control change rebuilds the story on the canvas', async ({ page }) => {
  const problems: string[] = [];
  page.on('pageerror', (e) => problems.push(String(e).slice(0, 200)));
  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(m.text().slice(0, 200));
  });

  await gotoStory(page, STORY, 'dark');
  await expect(page.locator('.sds-btn')).toHaveText('Run the checks');

  await setArgs(page, STORY, CHANGED);

  await expect(page.locator('.sds-btn')).toHaveText(CHANGED.label);
  await expect(page.locator('.sds-btn')).toHaveClass(/sds-btn--secondary/);
  expect(problems, 'a control change must render in silence').toEqual([]);
});

/* The same change on the page the controls are on. Every component carries
   `!dev`, so what the menu offers is the docs page. It fails differently
   too — the throw lands in the story's own block, where no console listener
   hears it. */
test('a control change rebuilds the story in its docs page', async ({ page }) => {
  await page.goto('/iframe.html?viewMode=docs&id=components-actions-button--docs&globals=theme:dark');
  await page.waitForSelector('.sds-btn', { timeout: 20_000 });

  const block = page.locator(`#story--${STORY}--primary`);
  await expect(block).toContainText('Run the checks');

  await setArgs(page, STORY, CHANGED);

  await expect(block).toContainText(CHANGED.label);
  await expect(block.locator('.sds-btn')).toHaveClass(/sds-btn--secondary/);
});

test('the docs preview sits on the themed canvas', async ({ page }) => {
  const CANVAS = { dark: 'rgb(19, 18, 16)', light: 'rgb(251, 250, 247)' };

  for (const theme of ['dark', 'light'] as const) {
    await page.goto(`/iframe.html?viewMode=docs&id=components-actions-button--docs&globals=theme:${theme}`);
    await page.waitForSelector('.sds-btn', { timeout: 20_000 });

    for (const selector of ['.sbdocs.sbdocs-preview', '.sbdocs.sbdocs-preview .docs-story']) {
      await expect
        .poll(
          () => page.locator(selector).first().evaluate((el) => getComputedStyle(el).backgroundColor),
          { timeout: 10_000, message: `${selector} in ${theme}` },
        )
        .toBe(CANVAS[theme]);
    }
  }
});
