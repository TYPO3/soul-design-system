/* Every language the system says it colours, actually coloured.

   `CodeLangName` is a promise. A mapping that quietly lost an entry shows as
   a block set in one grey. That is also what an undeclared language looks
   like, so nothing reports it on its own. */

import { test, expect } from '@playwright/test';
import { highlight } from '../packages/frontend/src/lib/highlight.ts';
import { SAMPLES } from '../stories/lib/languages.ts';
import { gotoStory } from './lib/story.ts';

/* The samples are the story's, the same blocks a reader sees. So a language
   cannot be green here and set in one grey on the page. `text` stays out of
   the loop and has its own claim below. Its grammar's whole job is to mark
   nothing, which is what the loop looks for. */

for (const [lang, source] of Object.entries(SAMPLES).filter(([name]) => name !== 'text')) {
  test(`${lang} is coloured`, () => {
    const out = highlight(lang, source);
    expect(out, `${lang} must be a language this system colours`).not.toBeNull();
    expect(out ?? '', `${lang} produced no token — is the right grammar registered?`)
      .toMatch(/class="hljs-/);
  });
}

/* And the one the loop cannot ask for. Text has a declaration and a grammar,
   and that grammar's whole job is to mark nothing. The claim that it produces
   no token is what keeps it away from a quiet swap for something that does. */
test('text stays as it is', () => {
  const out = highlight('text', SAMPLES.text);
  expect(out).not.toBeNull();
  expect(out ?? '').not.toContain('class="hljs-');
});

/* TypoScript has no grammar in highlight.js, so this system wrote one — see
   `src/lib/grammars/`. What that grammar decides has its claim here rather
   than in the loop above. A block with *some* colour is not the same as a
   block with the right colour, and this is the one nobody else can check. */
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

test('a language nobody declared gets no guess', () => {
  expect(highlight('cobol', 'DISPLAY "hi".')).toBeNull();
});

/* Every declared language, drawn by the element in a browser. The loop above
   is the pure function in Node, and the Guides render is the PHP port on the
   server. This is the third end, and the only one that notices a grammar
   that registers but never reaches the page. `text` stays out for the reason
   it stays out above — its declaration is to mark nothing. */
test('the element itself colours every language', async ({ page }) => {
  await gotoStory(page, 'components-code-code--languages');

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
   in Node. This is the element, in a browser, with the classes the stylesheet
   paints — the two ends of the same claim. */
test('a block on the page carries the colour and the system paints it', async ({ page }) => {
  await gotoStory(page, 'components-code-code--highlighted');

  const tokens = page.locator('sds-code .sds-code__body [class^="hljs-"]');
  await expect(tokens.first()).toBeVisible();

  /* Painted, not merely classed. The mapping onto the three syntax colours
     lives in `components.css`, and a class nothing styles is the same grey as
     no class at all. */
  const colours = await tokens.evaluateAll((els) =>
    [...new Set(els.map((el) => getComputedStyle(el).color))]);
  expect(colours.length, 'the tokens must not all be one colour').toBeGreaterThan(1);
});
