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
import { gotoStory } from './lib/story.ts';

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

test('the index lists every component and guideline page', async ({ request }) => {
  const res = await request.get('/index.json');
  const index = (await res.json()) as { entries: Record<string, StoryEntry> };
  const titles = new Set(Object.values(index.entries).map((e) => e.title));

  for (const expected of [
    'Introduction',
    'Guidelines/Brand',
    'Guidelines/Colours',
    'Guidelines/Type',
    'Guidelines/Spacing & layout',
    'Guidelines/Icons',
    'Guidelines/States',
    'Guidelines/Diagrams',
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
    'Components/Modal',
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
    'Pages/Documentation',
    'Pages/Landing',
  ]) {
    expect(titles, `${expected} should have a page`).toContain(expected);
  }
});

for (const theme of ['dark', 'light'] as const) {
  test(`every story renders cleanly in ${theme}`, async ({ page, request }) => {
    const stories = await storyIds(request);
    expect(stories.length, 'there should be stories to check').toBeGreaterThan(20);

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
  expect(specimens.length, 'each component should have a Specimen story').toBe(7);

  for (const story of specimens) {
    await gotoStory(page, story.id);

    const classes = await page.evaluate(() =>
      [...document.querySelectorAll('#storybook-root [class]')]
        .flatMap((el) => [...el.classList])
        .filter((c) => c.startsWith('sds-')),
    );
    expect(new Set(classes).size, `${story.title} should use sds- classes`).toBeGreaterThan(0);

    /* No custom element may survive into a specimen: the cards generated
       from these stories are opened without any JavaScript, so an element
       here would be an empty box there. */
    const elements = await page.evaluate(() =>
      [...document.querySelectorAll('#storybook-root *')].map((el) => el.tagName.toLowerCase()).filter((t) => t.startsWith('sds-')),
    );
    expect(elements, `${story.title} specimen must be static markup`).toEqual([]);
  }
});

/* The theme switch has to reach inside the embedded cards.

   A guideline page is mostly iframes, and an iframe does not inherit
   `data-theme` from the page around it. When these pages replaced the old dev
   gallery that propagation was lost, and the toolbar looked dead on exactly
   the pages where most of the system is shown — a silent regression that
   nothing caught, because every story still rendered fine.

   A card that pins **light** means it and must not be flipped;
   `brand-lockup-light` exists to show the light lockup. */
test('the theme switch reaches the cards embedded in a docs page', async ({ page }) => {
  const NAMES = ['brand-lockup', 'brand-lockup-light'];

  for (const theme of ['dark', 'light'] as const) {
    await page.goto(`/iframe.html?viewMode=docs&id=guidelines-brand--docs&globals=theme:${theme}`);

    /* The embeds are `loading="lazy"` and the lockups sit well below the fold,
       behind a 1455px signet card. Without scrolling them in they never load,
       which passes alone — where the page is idle long enough — and fails
       under parallel load. */
    for (const name of NAMES) {
      const frame = page.locator(`iframe[src$="${name}.card.html"]`);
      await frame.scrollIntoViewIfNeeded();
      await expect
        .poll(
          () => frame.evaluate((f: HTMLIFrameElement) => f.contentDocument?.documentElement?.dataset['theme'] ?? null),
          { timeout: 20_000, message: `${name} never loaded` },
        )
        .not.toBeNull();
    }

    const themeOf = (name: string) =>
      page
        .locator(`iframe[src$="${name}.card.html"]`)
        .evaluate((f: HTMLIFrameElement) => f.contentDocument?.documentElement?.dataset['theme']);

    expect(await themeOf('brand-lockup'), `brand-lockup should follow the ${theme} switch`).toBe(theme);
    expect(await themeOf('brand-lockup-light'), 'a card pinning light keeps it in both modes').toBe('light');
  }
});

/* A story must sit on the surface it was designed for.

   Storybook paints the docs preview block from its own docs theme, which is
   white and knows nothing about `data-theme`. In dark mode that put near-white
   text and a transparent secondary button on white — the component looked
   broken when it was merely on the wrong ground. `.storybook/docs.css` takes
   that block back; this is what stops it drifting again. */
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

/* A table written in a page has to arrive as a table.

   MDX parses CommonMark, and CommonMark has no tables — that is a GFM
   extension, and Storybook's compiler does not load it. So every `| … |` row
   on these pages set as a paragraph of literal pipe characters, and read as a
   page whose author had forgotten to finish it. `.storybook/main.ts` adds the
   plugin; this is what stops it being dropped again, which a Storybook
   upgrade rewriting that file would do silently.

   Only the hand-written pages: an autodocs page is generated from a story and
   has no prose to lose. Written as the absence of the delimiter row rather
   than a count of tables, so it also covers a page that grows its first table
   later — with one positive assertion so it cannot pass by finding nothing. */
test('a table written in a docs page renders as a table', async ({ page, request }) => {
  const res = await request.get('/index.json');
  const index = (await res.json()) as { entries: Record<string, StoryEntry> };
  const pages = Object.values(index.entries).filter((e) => e.type === 'docs' && e.importPath.endsWith('.mdx'));
  expect(pages.length, 'the written pages should be in the index').toBeGreaterThan(0);

  let tables = 0;

  for (const doc of pages) {
    await page.goto(`/iframe.html?viewMode=docs&id=${doc.id}`);
    await page.waitForSelector('.sbdocs-content', { timeout: 20_000 });

    /* The delimiter row, which is the one line of a table that has no meaning
       as prose. If it is on the page as text, the table did not parse. */
    const text = await page.locator('.sbdocs-content').innerText();
    expect(text, `${doc.title} left an unparsed table row in its prose`).not.toMatch(/^\s*\|\s*-{3,}/m);

    tables += await page.locator('.sbdocs-content table').count();
  }

  expect(tables, 'the written pages should render tables at all').toBeGreaterThan(0);
});
