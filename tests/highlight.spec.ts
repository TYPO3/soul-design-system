/* Every language the system says it colours, actually coloured.

   `CodeLangName` is a promise, and a mapping that quietly lost an entry shows
   as a block set in one grey — which is also what an undeclared language looks
   like, so it would never be reported on its own. */

import { test, expect } from '@playwright/test';
import { highlight } from '../packages/frontend/src/lib/highlight.ts';
import { SAMPLES } from '../stories/lib/languages.ts';
import { gotoStory } from './lib/story.ts';

/* The samples are the story's — the same blocks a reader is shown, so a
   language cannot be green here and set in one grey on the page. `text` is
   left out of the loop and asserted below: its grammar's whole job is to mark
   nothing, which is what the loop is looking for. */

for (const [lang, source] of Object.entries(SAMPLES).filter(([name]) => name !== 'text')) {
  test(`${lang} is coloured`, () => {
    const out = highlight(lang, source);
    expect(out, `${lang} should be a language this system colours`).not.toBeNull();
    expect(out ?? '', `${lang} produced no token — is the right grammar registered?`)
      .toMatch(/class="hljs-/);
  });
}

/* And the one the loop cannot ask for: text is declared, has a grammar, and
   that grammar's whole job is to mark nothing. Asserting it produces no token
   is what keeps it from being quietly pointed at something that does. */
test('text is left alone', () => {
  const out = highlight('text', SAMPLES.text);
  expect(out).not.toBeNull();
  expect(out ?? '').not.toContain('class="hljs-');
});

/* TypoScript has no grammar in highlight.js, so this system wrote one — see
   `src/lib/grammars/`. What that grammar decides is asserted here rather than
   in the loop above: a block colouring *something* is not the same as it
   colouring the right thing, and this is the one nobody else can check. */
test('typoscript reads as a path, a value and a condition', () => {
  const out = highlight('typoscript', [
    '# what this sets',
    'page = PAGE',
    'page.10.file = {$paths.template}',
    '[siteLanguage("locale") == "de_DE"]',
  ].join('\n')) ?? '';

  expect(out).toContain('<span class="hljs-comment"># what this sets</span>');
  expect(out).toContain('<span class="hljs-attr">page</span>');
  expect(out).toContain('<span class="hljs-built_in">PAGE</span>');
  expect(out).toContain('<span class="hljs-variable">{$paths.template}</span>');
  expect(out).toMatch(/<span class="hljs-meta">\[siteLanguage/);
});

test('a language nobody declared is not guessed at', () => {
  expect(highlight('cobol', 'DISPLAY "hi".')).toBeNull();
});

/* Every declared language, drawn by the element in a browser. The loop above
   is the pure function in Node, and the Guides render is the PHP port on the
   server; this is the third end, and the only one that would notice a grammar
   that registers but never reaches the page. `text` is excluded for the reason
   it is excluded above — it is declared to mark nothing. */
test('every language is coloured by the element itself', async ({ page }) => {
  await gotoStory(page, 'components-code--languages');

  const blocks = page.locator('sds-code');
  await expect(blocks).toHaveCount(Object.keys(SAMPLES).length);

  const grey = await blocks.evaluateAll((els) =>
    els
      .filter((el) => el.getAttribute('code-lang') !== 'text')
      .filter((el) => el.querySelectorAll('[class^="hljs-"]').length === 0)
      .map((el) => el.getAttribute('code-lang') ?? '?'));
  expect(grey, 'these set in one grey — is the grammar registered?').toEqual([]);
});

/* And the same colour reaches the page. The function above is pure and runs
   in Node; this is the element, in a browser, with the classes the stylesheet
   paints — the two ends of the same claim. */
test('a block on the page carries the colour and the system paints it', async ({ page }) => {
  await gotoStory(page, 'components-code--highlighted');

  const tokens = page.locator('sds-code .sds-code__body [class^="hljs-"]');
  await expect(tokens.first()).toBeVisible();

  /* Painted, not merely classed: the mapping onto the three syntax colours
     lives in `components.css`, and a class nothing styles is the same grey as
     no class at all. */
  const colours = await tokens.evaluateAll((els) =>
    [...new Set(els.map((el) => getComputedStyle(el).color))]);
  expect(colours.length, 'the tokens should not all be one colour').toBeGreaterThan(1);
});
