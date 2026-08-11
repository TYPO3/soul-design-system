/* Every story renders, in both themes, without saying anything on the way.

   A story that throws still shows *something* in Storybook — an error
   overlay, or a blank frame that reads as an empty specimen. Neither is
   visible in a screenshot diff, because the diff only compares the cards.
   This walks the built index and opens every story for real.

   Console output is part of the assertion. A missing icon throws, an
   unregistered element is silent, and a Lit warning about a duplicate
   registration is the first sign that the bundle got imported twice — all of
   them are things you only ever find by reading the console, which nobody
   does. */

import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { gotoStory } from './lib/story.ts';

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

async function storyIds(request: import('@playwright/test').APIRequestContext): Promise<StoryEntry[]> {
  const res = await request.get('/index.json');
  expect(res.ok(), 'storybook-static/index.json should be served').toBeTruthy();
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
    'Components/Drawer',
    'Components/Field',
    'Components/Field error',
    'Components/Icon',
    'Components/Link',
    'Components/Menu',
    'Components/Modal',
    'Components/Note',
    'Components/Overlay',
    'Components/Pills',
    'Components/Rail',
    'Components/Surface',
    'Components/Signet',
    'Components/Table',
    'Components/Table density',
    'Components/Tabs',
    'Components/Theme',
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

for (const theme of ['dark', 'light'] as const) {
  test(`every story renders cleanly in ${theme}`, async ({ page, request }) => {
    const stories = await storyIds(request);
    expect(stories.length, 'there should be stories to check').toBeGreaterThan(20);

    /* One test opens every story in the index, so its budget is a function of
       how many there are — not a number that has to be raised by hand every
       time a component arrives with four stories behind it. The default 30s
       was that number, and it ran out as a page layout was being added. */
    test.setTimeout(Math.max(30_000, stories.length * 1_200));

    const problems: string[] = [];
    page.on('pageerror', (e) => problems.push(`${String(e).slice(0, 200)}`));
    page.on('console', (m) => {
      if (m.type() !== 'error' && m.type() !== 'warning') return;
      const text = m.text();
      if (EXPECTED.some((rx) => rx.test(text))) return;
      problems.push(`[${m.type()}] ${text.slice(0, 200)}`);
    });

    for (const story of stories) {
      problems.length = 0;
      await gotoStory(page, story.id, theme);

      /* An empty root is a story that "rendered" nothing. Storybook reports
         no error for it, and it looks like a deliberate blank specimen. */
      const filled = await page.locator('#storybook-root').innerHTML();
      expect(filled.trim(), `${story.title} / ${story.name} rendered nothing`).not.toBe('');

      expect(problems, `${story.title} / ${story.name}`).toEqual([]);
    }
  });
}

/* The specimen stories are the ones the cards are generated from, so a
   difference between what Storybook shows and what the card ships would be a
   difference the pixel diff cannot see — it never opens Storybook. */
test('every specimen story renders the classes the system defines', async ({ page, request }) => {
  const specimens = (await storyIds(request)).filter((s) => s.name === 'Specimen');
  /* Counted against the story files that generate a card rather than against
     a number written here. A file opts into card generation by exporting
     `specimenHtml`, and the story that card is a picture of is the one named
     Specimen — so the two sets are the same by construction. The literal this
     replaces was a second number to keep in step, and it was not: it still
     said 7 while the guideline cards were becoming stories one after another. */
  expect(specimens.length, 'each story that generates a card should have a Specimen story').toBe(generators());

  for (const story of specimens) {
    await gotoStory(page, story.id);

    /* Built from the system rather than from values somebody typed: its
       classes, or — for a card whose whole subject is a token — the tokens
       themselves.

       Classes alone was the rule while every specimen was a component. It
       stopped being true the moment the guideline cards became stories: a
       swatch of `--accent` is a box painted from a custom property, and there
       is no class for "this colour" and should not be. What both halves rule
       out is the same thing, which is a specimen that hard-codes what it is a
       picture of. */
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

    /* No custom element may survive into a specimen: the cards generated
       from these stories are opened without any JavaScript, so an element
       here would be an empty box there. */
    const elements = await page.evaluate(() =>
      [...document.querySelectorAll('#storybook-root *')].map((el) => el.tagName.toLowerCase()).filter((t) => t.startsWith('sds-')),
    );
    expect(elements, `${story.title} specimen must be static markup`).toEqual([]);
  }
});

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
