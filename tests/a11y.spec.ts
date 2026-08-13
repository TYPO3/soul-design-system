/* Accessibility, on the specimens that can honestly be judged by a machine.

   SKILL.md commits to `:focus-visible` rings, contrast in both modes and
   nothing reachable by pointer only. axe checks some of that, so this asserts
   on the part it can. Only serious and critical violations fail: the specimens
   deliberately show states no automated pass can interpret — a control drawn
   disabled, a ring on an element that does not have focus — and failing on
   `minor` would train everyone to ignore the run. */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { axeIdle, gotoStory } from './lib/story.ts';

interface StoryEntry {
  id: string;
  title: string;
  name: string;
  type: string;
}

async function storyIds(request: import('@playwright/test').APIRequestContext): Promise<StoryEntry[]> {
  const index = (await (await request.get('/index.json')).json()) as { entries: Record<string, StoryEntry> };
  return Object.values(index.entries).filter((e) => e.type === 'story');
}

/** Every story a card is generated from, minus the whole pages, which have
    their own sweep below. Read out of the index rather than listed here: a
    list kept by hand is one a new component is quietly missing from, and
    nothing says so — the page sweep has read the index for that reason all
    along, and this one had not. */
async function specimenIds(request: import('@playwright/test').APIRequestContext): Promise<StoryEntry[]> {
  return (await storyIds(request)).filter((e) => e.name === 'Specimen' && !e.title.startsWith('Pages/'));
}

/* Sharded so the sweep stays parallel, the way the render pass in
   `stories.spec.ts` is. Each specimen is opened once per test and gets one
   axe run on that page: several `analyze()` calls against the same page hit
   "Axe is already running" — axe is a single global with one run at a time,
   and awaiting the previous call is not enough to clear it. */
const SPECIMEN_SHARDS = 4;

for (const theme of ['dark', 'light'] as const) {
  for (let shard = 0; shard < SPECIMEN_SHARDS; shard++) {
    test(`specimens have no serious axe violations in ${theme}, shard ${shard + 1}`, async ({ page, request }) => {
      const specimens = await specimenIds(request);
      expect(specimens.length, 'there should be specimens to check').toBeGreaterThan(10);
      const assigned = specimens.filter((_, index) => index % SPECIMEN_SHARDS === shard);
      test.setTimeout(Math.max(30_000, assigned.length * 3_000));

      const failures: string[] = [];
      for (const story of assigned) {
        await gotoStory(page, story.id, theme);
        await axeIdle(page);

        const results = await new AxeBuilder({ page })
          .include('#storybook-root')
          /* Colour contrast is checked separately below, on the surfaces where
             the result means something. Run here it flags every muted caption
             in the specimen chrome, which is annotation and not product text. */
          .disableRules(['color-contrast'])
          .analyze();

        for (const v of results.violations) {
          if (v.impact !== 'serious' && v.impact !== 'critical') continue;
          failures.push(`${story.title}: ${v.id} — ${v.help} (${v.nodes.length} node(s): ${v.nodes[0]?.target.join(' ')})`);
        }
      }

      expect(failures, `serious axe violations on specimens (${theme})`).toEqual([]);
    });
  }
}

/* Contrast, held to a baseline rather than to zero. A token below 4.5:1 is a
   design decision to resolve, not something a test papers over — so the
   assertion is on the *set of failing foreground colours*. A known one stays
   written down here; a second turns the suite red. Selectors would be brittle
   and a count would drift with every added row. */
const KNOWN_LOW_CONTRAST: Record<'dark' | 'light', string[]> = {
  dark: [
    /* A control drawn disabled, in the specimen that states the four states
       side by side: `--text-muted` at half opacity. Same exemption as the
       button below — 1.4.3 does not apply to a control that is unavailable,
       and looking unavailable is the whole job of the colour. */
    '#4d4943',
  ],
  light: [
    /* The disabled button's own text. WCAG 1.4.3 explicitly exempts disabled
       controls, and looking unavailable is the entire job of the colour —
       this one is correct as it stands and is not a shortfall to fix. */
    '#8c8a87',
    /* The same disabled state in the states specimen, on the lighter ground. */
    '#b7b3ad',
  ],
};

for (const theme of ['dark', 'light'] as const) {
  for (let shard = 0; shard < SPECIMEN_SHARDS; shard++) {
    test(`specimens introduce no low-contrast colour in ${theme}, shard ${shard + 1}`, async ({ page, request }) => {
      const assigned = (await specimenIds(request)).filter((_, index) => index % SPECIMEN_SHARDS === shard);
      test.setTimeout(Math.max(30_000, assigned.length * 3_000));

      const found = new Map<string, string>();
      for (const story of assigned) {
        await gotoStory(page, story.id, theme);
        await axeIdle(page);

        const results = await new AxeBuilder({ page })
          .include('#storybook-root')
          .withRules(['color-contrast'])
          /* `.spec-cap` and friends are the specimen's own annotation layer,
             styled by `_specimen.css`, which never ships to a product. */
          .exclude('.spec-cap')
          .exclude('.spec-note')
          .exclude('.spec-lbl')
          .exclude('.spec-h')
          .analyze();

        for (const v of results.violations) {
          for (const node of v.nodes) {
            const summary = node.failureSummary ?? '';
            const fg = /foreground color: (#[0-9a-f]{3,8})/i.exec(summary)?.[1]?.toLowerCase();
            if (fg) found.set(fg, `${story.title} — ${node.target.join(' ')}`);
          }
        }
      }

      const unexpected = [...found.keys()].filter((c) => !KNOWN_LOW_CONTRAST[theme].includes(c)).sort();
      expect(
        unexpected,
        `new low-contrast foreground colour(s) on a specimen (${theme}). Either fix the token or add it ` +
          `to KNOWN_LOW_CONTRAST with a reason.\n` +
          unexpected.map((c) => `  ${c}: ${found.get(c)}`).join('\n'),
      ).toEqual([]);
    });
  }
}

/* The whole pages, which is where the machine-checkable part lives. A specimen
   is a fragment with no landmarks, no heading order and no form, and everything
   axe is genuinely good at needs a page. One test per theme rather than per
   page: the index decides which pages exist, so nothing here is kept in step
   with what has been built. */
async function pageIds(request: import('@playwright/test').APIRequestContext): Promise<StoryEntry[]> {
  return (await storyIds(request)).filter((e) => e.title.startsWith('Pages/'));
}

for (const theme of ['dark', 'light'] as const) {
  test(`every page has no serious axe violations in ${theme}`, async ({ page, request }) => {
    const pages = await pageIds(request);
    expect(pages.length, 'there should be pages to check').toBeGreaterThan(1);
    test.setTimeout(Math.max(30_000, pages.length * 3_000));

    const failures: string[] = [];
    for (const story of pages) {
      await gotoStory(page, story.id, theme);
      await axeIdle(page);

      const results = await new AxeBuilder({ page })
        .include('#storybook-root')
        /* Contrast is the sweep below this one, on the colours rather than on
           the nodes — a page repeats the same muted label thirty times and
           what is worth asserting is the colour, once. */
        .disableRules(['color-contrast'])
        .analyze();

      for (const v of results.violations) {
        if (v.impact !== 'serious' && v.impact !== 'critical') continue;
        failures.push(`${story.title}: ${v.id} — ${v.help} (${v.nodes.length} node(s): ${v.nodes[0]?.target.join(' ')})`);
      }
    }

    expect(failures, `serious axe violations on whole pages (${theme})`).toEqual([]);
  });
}

/* And the colours those pages are actually made of: the specimens carry the
   system's controls, a page carries prose, labels, captions and status text at
   the sizes a reader meets them. Same assertion as above — the set of failing
   foreground colours, not a count and not a selector. */
for (const theme of ['dark', 'light'] as const) {
  test(`no page introduces a low-contrast colour in ${theme}`, async ({ page, request }) => {
    const pages = await pageIds(request);
    test.setTimeout(Math.max(30_000, pages.length * 3_000));

    const found = new Map<string, string>();
    for (const story of pages) {
      await gotoStory(page, story.id, theme);
      await axeIdle(page);

      const results = await new AxeBuilder({ page }).include('#storybook-root').withRules(['color-contrast']).analyze();
      for (const v of results.violations) {
        for (const node of v.nodes) {
          const summary = node.failureSummary ?? '';
          const fg = /foreground color: (#[0-9a-f]{3,8})/i.exec(summary)?.[1]?.toLowerCase();
          if (fg) found.set(fg, `${story.title} — ${node.target.join(' ')}`);
        }
      }
    }

    const unexpected = [...found.keys()].filter((c) => !KNOWN_LOW_CONTRAST[theme].includes(c)).sort();
    expect(
      unexpected,
      `new low-contrast foreground colour(s) on a page (${theme}). Either fix the token or add it ` +
        `to KNOWN_LOW_CONTRAST with a reason.\n` +
        unexpected.map((c) => `  ${c}: ${found.get(c)}`).join('\n'),
    ).toEqual([]);
  });
}
