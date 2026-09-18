/* Accessibility, on the specimens a machine can judge with honesty.

   SKILL.md commits to `:focus-visible` rings, contrast in both modes and
   nothing reachable by pointer only. Axe checks some of that, so this asserts
   on the part it can. Only serious and critical violations fail. The specimens
   show states on purpose that no automated pass can interpret. A control
   drawn disabled, a ring on an element that does not have focus. A failure
   on `minor` trains everyone to ignore the run. */

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

/** Every story a card comes from, minus the whole pages, which have their
    own sweep below. Read out of the index rather than listed here. A list
    kept by hand is one a new component is quietly absent from, and nothing
    says so. */
async function specimenIds(request: import('@playwright/test').APIRequestContext): Promise<StoryEntry[]> {
  return (await storyIds(request)).filter((e) => e.name === 'Specimen' && !e.title.startsWith('Pages/'));
}

/* Sharded so the sweep stays parallel, the way the render pass in
   `stories.spec.ts` is. Each specimen opens once per test and gets one axe
   run on that page. Several `analyze()` calls against the same page hit "Axe
   is already running". Axe is a single global with one run at a time, and an
   await on the previous call is not enough to clear it. */
const SPECIMEN_SHARDS = 4;

for (const theme of ['dark', 'light'] as const) {
  for (let shard = 0; shard < SPECIMEN_SHARDS; shard++) {
    test(`specimens have no serious axe violations in ${theme}, shard ${shard + 1}`, async ({ page, request }) => {
      const specimens = await specimenIds(request);
      expect(specimens.length, 'there must be specimens to check').toBeGreaterThan(10);
      const assigned = specimens.filter((_, index) => index % SPECIMEN_SHARDS === shard);
      test.setTimeout(Math.max(30_000, assigned.length * 3_000));

      const failures: string[] = [];
      for (const story of assigned) {
        await gotoStory(page, story.id, theme);
        await axeIdle(page);

        const results = await new AxeBuilder({ page })
          .include('#storybook-root')
          /* Colour contrast has its own check below, on the surfaces where
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

/* Contrast, held to zero and not to a baseline. The assertion is on the *set
   of foreground colours that fail*. Not on selectors, which are brittle, and
   not on a count, which drifts with every new row.

   There is no list of tolerated colours. What such a list holds is either a
   token to fix or a control that is unavailable. WCAG exempts the second
   already. So the way to say it is the state in the markup, where a reader
   with a screen reader hears the same thing. Axe skips a disabled node. A
   hex written down here, nobody skips, and it outlives whatever drew it. */

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

      const failing = [...found.keys()].sort();
      expect(
        failing,
        `low-contrast foreground colour(s) on a specimen (${theme}). Fix the token, or — where the ` +
          `colour says a control is unavailable — say that in the markup and axe asks no more.\n` +
          failing.map((c) => `  ${c}: ${found.get(c)}`).join('\n'),
      ).toEqual([]);
    });
  }
}

/* The whole pages, which is where the machine-checkable part lives. A specimen
   is a fragment with no landmarks, no heading order and no form, and everything
   axe is good at needs a page. One test per theme rather than per page. The
   index decides which pages exist, so nothing here has to keep in step with
   the build. */
async function pageIds(request: import('@playwright/test').APIRequestContext): Promise<StoryEntry[]> {
  return (await storyIds(request)).filter((e) => e.title.startsWith('Pages/'));
}

for (const theme of ['dark', 'light'] as const) {
  test(`every page has no serious axe violations in ${theme}`, async ({ page, request }) => {
    const pages = await pageIds(request);
    expect(pages.length, 'there must be pages to check').toBeGreaterThan(1);
    test.setTimeout(Math.max(30_000, pages.length * 3_000));

    const failures: string[] = [];
    for (const story of pages) {
      await gotoStory(page, story.id, theme);
      await axeIdle(page);

      const results = await new AxeBuilder({ page })
        .include('#storybook-root')
        /* Contrast is the sweep below this one, on the colours rather than on
           the nodes. A page repeats the same muted label thirty times and
           the thing to assert is the colour, once. */
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

/* And the colours those pages consist of. The specimens carry the system's
   controls; a page carries prose, labels, captions and status text at the
   sizes a reader meets them. Same assertion as above — the set of foreground
   colours that fail, not a count and not a selector. */
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

    const failing = [...found.keys()].sort();
    expect(
      failing,
      `low-contrast foreground colour(s) on a page (${theme}). Fix the token, or — where the colour ` +
        `says a control is unavailable — say that in the markup and axe asks no more.\n` +
        failing.map((c) => `  ${c}: ${found.get(c)}`).join('\n'),
    ).toEqual([]);
  });
}

/* And the ring axe cannot ask about.

   A card hands its anchor's ring over: the whole card is the target, so the
   ring belongs round the frame. A frame with none gives a keyboard reader a
   card that changes colour and nothing that says which one they are on.
   Nothing sees it. Axe reports a focusable element, not an invisible focus,
   and the specimens draw the ring on an element that does not have focus. So
   the press happens here, in both walls. A tile turns the ring inwards, and
   that is the case where a wrong drawing is no drawing. */
const RINGED: readonly (readonly [wall: string, story: string, halo: boolean])[] = [
  ['an ordinary wall', 'components-content-grid--default', true],
  ['a flush wall', 'components-content-grid--flush', false],
];

for (const [wall, story, halo] of RINGED) {
  test(`a card in ${wall} draws the ring when the keyboard reaches it`, async ({ page }) => {
    await gotoStory(page, story);

    /* Reached with Tab rather than focused. `:focus-visible` is the browser's
       answer about how focus arrived, and a card focused by script is a card
       a reader never gets. */
    for (let press = 0; press < 6; press++) {
      await page.keyboard.press('Tab');
      if (await page.evaluate(() => !!document.activeElement?.closest('.sds-card__title'))) break;
    }

    const ring = await page.evaluate(() => {
      const frame = document.activeElement?.closest('.sds-card') as HTMLElement | null;
      if (!frame) return null;
      const drawn = getComputedStyle(frame);
      const emphasis = getComputedStyle(document.documentElement).getPropertyValue('--border-emphasis').trim();
      return {
        style: drawn.outlineStyle,
        width: drawn.outlineWidth,
        emphasis,
        offset: parseFloat(drawn.outlineOffset),
        halo: drawn.boxShadow !== 'none',
        /* The anchor gives its own up, or the card wears two rings. */
        onWords: getComputedStyle(document.activeElement as HTMLElement).outlineStyle,
      };
    });

    expect(ring, 'the keyboard must reach a card title').not.toBeNull();
    expect(ring!.style, 'the frame draws the ring').toBe('solid');
    expect(ring!.width, 'the ring is --border-emphasis wide').toBe(ring!.emphasis);
    expect(ring!.onWords, 'and the words it moved off do not draw a second one').toBe('none');
    expect(ring!.halo, halo ? 'with its halo' : 'and a tile drops the halo it cannot show').toBe(halo);
    /* Outwards on a card, inwards on a tile: the wall clips its corners. */
    expect(Math.sign(ring!.offset), `the ring stands ${halo ? 'off' : 'inside'} the box`).toBe(halo ? 1 : -1);
  });
}
