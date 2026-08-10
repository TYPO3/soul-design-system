/* Accessibility, on the specimens that can honestly be judged by a machine.

   SKILL.md commits to specific things — `:focus-visible` rings, contrast that
   holds in both modes, nothing reachable by pointer only. axe can check some
   of that and cannot check the rest, so this asserts on the part it can and
   says plainly where the line is.

   Only serious and critical violations fail. The specimens deliberately show
   states no automated pass can interpret: a disabled control that is meant
   to look disabled, a focus ring drawn on an element that does not have
   focus, a caption in `--text-muted` that is annotation rather than content.
   Failing on `minor` here would train everyone to ignore the run. */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { axeIdle, gotoStory } from './lib/story.ts';

const SPECIMENS = [
  'components-button--specimen',
  'components-field--specimen',
  'specimens-navigation--specimen',
  'components-surface--specimen',
  'components-table--specimen',
  'components-table-density--specimen',
  'components-code--specimen',
];

for (const theme of ['dark', 'light'] as const) {
  for (const id of SPECIMENS) {
    test(`${id} has no serious axe violations in ${theme}`, async ({ page }) => {
      await gotoStory(page, id, theme);
      await axeIdle(page);

      const results = await new AxeBuilder({ page })
        .include('#storybook-root')
        /* Colour contrast is checked separately below, on the surfaces where
           the result means something. Run here it flags every muted caption
           in the specimen chrome, which is annotation and not product text. */
        .disableRules(['color-contrast'])
        .analyze();

      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(
        serious.map((v) => `${v.id}: ${v.nodes.length} node(s) — ${v.help}`),
        `${id} (${theme})`,
      ).toEqual([]);
    });
  }
}

/* Contrast, held to a baseline rather than to zero.

   `--text-muted` does not reach 4.5:1 as normal-size text on any of this
   system's surfaces — roughly 3.4:1 on the dark canvas. It is used for
   product text, not only for annotation: table headers, `sds-td-meta` cells,
   inactive tabs, a field's placeholder. That is a real WCAG AA shortfall and
   it is a design decision to resolve, not something a test should quietly
   paper over or unilaterally "fix" by moving a token that every surface
   depends on.

   So the assertion is on the *set of foreground colours* that fail, not on
   the count or the selectors. A known token staying below the line keeps the
   suite green and stays written down here; a second token dropping below it,
   or `--text-muted` spreading to a new kind of surface, turns the suite red.
   Selectors would be too brittle to assert on and a raw count would drift
   with every added row.

   Fix the token and this list gets shorter — delete the entry and the test
   locks the improvement in. */
const KNOWN_LOW_CONTRAST: Record<'dark' | 'light', string[]> = {
  /* `--text-muted` and `--syntax-comment` used to sit here at ~3.3:1 on
     product text — table headers, `sds-td-meta`, an inactive tab, a
     placeholder, a code comment. They were fixed rather than tolerated:
     `#8A8378`/`#6E6860` became `#726C63`/`#878076`, which clears 4.5:1 on
     the worst surface each appears on with a little room to spare.
     `--status-warn` went the same way on the light canvas. */
  dark: [],
  light: [
    /* The disabled button's own text. WCAG 1.4.3 explicitly exempts disabled
       controls, and looking unavailable is the entire job of the colour —
       this one is correct as it stands and is not a shortfall to fix. */
    '#8c8a87',
  ],
};

for (const theme of ['dark', 'light'] as const) {
  for (const id of SPECIMENS) {
    test(`${id} has no new low-contrast colours in ${theme}`, async ({ page }) => {
      /* One axe run per test, deliberately. Several `analyze()` calls against
         the same page hit "Axe is already running" — axe is a single global
         with one run at a time, and awaiting the previous call is not enough
         to clear it. Splitting also names the specimen in the failure. */
      await gotoStory(page, id, theme);
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

      const found = new Map<string, string>();
      for (const v of results.violations) {
        for (const node of v.nodes) {
          const summary = node.failureSummary ?? '';
          const fg = /foreground color: (#[0-9a-f]{3,8})/i.exec(summary)?.[1]?.toLowerCase();
          if (fg) found.set(fg, `${node.target.join(' ')} — ${summary.split('\n')[1]?.trim() ?? v.help}`);
        }
      }

      const unexpected = [...found.keys()].filter((c) => !KNOWN_LOW_CONTRAST[theme].includes(c)).sort();
      expect(
        unexpected,
        `new low-contrast foreground colour(s) in ${id} (${theme}). Either fix the token or add it ` +
          `to KNOWN_LOW_CONTRAST with a reason.\n` +
          unexpected.map((c) => `  ${c}: ${found.get(c)}`).join('\n'),
      ).toEqual([]);
    });
  }
}
