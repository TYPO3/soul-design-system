/* Every story renders, in both themes, without saying anything on the way.

   A story that throws still shows *something* — an error overlay, or a blank
   frame that reads as an empty specimen — and the screenshot diff only compares
   cards. So this walks the built index and opens every story for real.

   Console output is part of the assertion: an unregistered element is silent,
   and a Lit warning about a duplicate registration is the first sign the bundle
   was imported twice. */

import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { gotoStory, setStoryTheme } from './lib/story.ts';

const STORIES = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'stories');

/** How many story files generate a specimen card — the opt-in is exporting
    `specimenHtml`, which `scripts/cards.ts` looks for. */
function generators(): number {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return walk(path);
      return entry.name.endsWith('.stories.ts') ? [path] : [];
    });
  return walk(STORIES).filter((path) => /export const specimenHtml\b/.test(readFileSync(path, 'utf8'))).length;
}

interface StoryEntry {
  id: string;
  title: string;
  name: string;
  type: 'story' | 'docs';
  importPath: string;
}

/* Lit's dev build announces itself on every page. It is expected here and
   never in the published bundle, which esbuild builds in production mode. */
const EXPECTED = [/Lit is in dev mode/];
const STORY_SHARDS = 6;

async function storyIds(request: import('@playwright/test').APIRequestContext): Promise<StoryEntry[]> {
  const res = await request.get('/index.json');
  expect(res.ok(), 'the built Storybook’s index.json should be served').toBeTruthy();
  const index = (await res.json()) as { entries: Record<string, StoryEntry> };
  return Object.values(index.entries).filter((e) => e.type === 'story');
}

test('the index lists every component and specimen group', async ({ request }) => {
  const res = await request.get('/index.json');
  const index = (await res.json()) as { entries: Record<string, StoryEntry> };
  const titles = new Set(Object.values(index.entries).map((e) => e.title));

  /* The written pages are not here any more: they are reStructuredText under
     `docs/`, rendered by Guides and published. What Storybook keeps is what
     only Storybook can do — a component with its controls, and the specimen
     each card is generated from. So the list checks those, and a specimen
     group vanishing is still a page that stopped documenting anything. */
  const groups = new Set([...titles].map((t) => t.split('/').slice(0, 2).join('/')));
  for (const group of ['Specimens/Brand', 'Specimens/Colours', 'Specimens/Type', 'Specimens/States']) {
    expect(groups, `${group} should have specimens`).toContain(group);
  }

  for (const expected of [
    /* One page per component, and the list is the check: a component that is
       split out of a file and never given a page of its own documents
       nothing. */
    'Components/Badge',
    'Components/Button',
    'Components/Code',
    'Components/Diff',
    'Components/Dialog',
    'Components/Icon',
    'Components/Image',
    'Components/Link',
    'Components/Menu',
    'Components/Modal',
    'Components/Note',
    'Components/Overlay',
    'Components/Pills',
    'Components/Rail',
    'Components/Surface',
    'Components/Table',
    'Components/Table density',
    'Components/Tabs',
    'Components/Theme',
    /* The parts of a form are their own section: they are looked up together,
       by somebody building one, and a reader after a field does not want to
       arrive by way of the figure and the footer. */
    'Forms/Field',
    'Forms/Field error',
    'Forms/Form errors',
    'Forms/Checkbox',
    'Forms/Radio',
    /* And the whole layouts. They are live in Storybook on purpose — every
       story here is opened by the pass below, so a page is a page under test
       rather than a picture of one. */
    'Pages/Answer',
    'Pages/Documentation',
    'Pages/Feature',
    'Pages/Landing',
    'Pages/Tool reference',
  ]) {
    expect(titles, `${expected} should have a page`).toContain(expected);
  }
});

for (let shard = 0; shard < STORY_SHARDS; shard++) {
  test(`every story renders cleanly in both themes, shard ${shard + 1}`, async ({ page, request }) => {
    const stories = await storyIds(request);
    expect(stories.length, 'there should be stories to check').toBeGreaterThan(20);
    const assigned = stories.filter((_, index) => index % STORY_SHARDS === shard);

    /* Both themes are one CSS declaration and the toolbar changes only
       `data-theme`, so a story need not be downloaded twice to exercise both. */
    test.setTimeout(Math.max(30_000, assigned.length * 1_500));

    const problems: string[] = [];
    page.on('pageerror', (e) => problems.push(`${String(e).slice(0, 200)}`));
    page.on('console', (m) => {
      if (m.type() !== 'error' && m.type() !== 'warning') return;
      const text = m.text();
      if (EXPECTED.some((rx) => rx.test(text))) return;
      problems.push(`[${m.type()}] ${text.slice(0, 200)}`);
    });

    for (const story of assigned) {
      problems.length = 0;
      await gotoStory(page, story.id, 'dark');

      /* An empty root is a story that "rendered" nothing. Storybook reports
         no error for it, and it looks like a deliberate blank specimen. */
      const filled = await page.locator('#storybook-root').innerHTML();
      expect(filled.trim(), `${story.title} / ${story.name} rendered nothing in dark`).not.toBe('');
      expect(problems, `${story.title} / ${story.name} in dark`).toEqual([]);

      problems.length = 0;
      await setStoryTheme(page, 'light');
      const lightFilled = await page.locator('#storybook-root').innerHTML();
      expect(lightFilled.trim(), `${story.title} / ${story.name} rendered nothing in light`).not.toBe('');
      expect(problems, `${story.title} / ${story.name} in light`).toEqual([]);
    }
  });
}

/* The specimen stories are the ones the cards are generated from, so a
   difference between what Storybook shows and what the card ships would be a
   difference the pixel diff cannot see — it never opens Storybook. */
test('every card generator has a specimen story', async ({ request }) => {
  const specimens = (await storyIds(request)).filter((s) => s.name === 'Specimen');
  /* Counted against the story files that generate a card rather than a number
     written here. A file opts in by exporting `specimenHtml`, and the story a
     card is a picture of is the one named Specimen, so the two sets are the
     same by construction. */
  expect(specimens.length, 'each story that generates a card should have a Specimen story').toBe(generators());
});

for (let shard = 0; shard < STORY_SHARDS; shard++) {
  test(`every specimen story renders the system, shard ${shard + 1}`, async ({ page, request }) => {
    const specimens = (await storyIds(request))
      .filter((story) => story.name === 'Specimen')
      .filter((_, index) => index % STORY_SHARDS === shard);

    for (const story of specimens) {
      await gotoStory(page, story.id);

      /* The subject is drawn from system classes or tokens, not literal values. */
      const built = await page.evaluate(() => {
        const root = document.querySelector('#storybook-root');
        const classes = [...(root?.querySelectorAll('[class]') ?? [])]
          .flatMap((el) => [...el.classList])
          .filter((c) => c.startsWith('sds-'));
        return { classes: new Set(classes).size, tokens: (root?.innerHTML ?? '').includes('var(--') };
      });
      expect(
        built.classes > 0 || built.tokens,
        `${story.title} should be drawn from the system — its classes, or its tokens`,
      ).toBe(true);

      /* Cards open without JavaScript, so no custom element may survive. */
      const elements = await page.evaluate(() =>
        [...document.querySelectorAll('#storybook-root *')]
          .map((el) => el.tagName.toLowerCase())
          .filter((tag) => tag.startsWith('sds-')),
      );
      expect(elements, `${story.title} specimen must be static markup`).toEqual([]);
    }
  });
}

test('the docs preview sits on the themed canvas', async ({ page }) => {
  const CANVAS = { dark: 'rgb(19, 18, 16)', light: 'rgb(251, 250, 247)' };

  for (const theme of ['dark', 'light'] as const) {
    await page.goto(`/iframe.html?viewMode=docs&id=components-button--docs&globals=theme:${theme}`);
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
