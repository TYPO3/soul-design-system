/* Every language the system says it colours, actually coloured.

   `CodeLang` is a promise: it says what this system stands behind, and a menu
   in Storybook offers each one. Nothing checked that the grammar behind a name
   was registered, or that it was the right one — `html` is xml's grammar and
   `text` is plaintext's, and a mapping that quietly lost an entry would show
   as a block that sets in one grey. Which is also what a language nobody
   declared looks like, so it would never be reported.

   The samples are chosen to produce a token, not to be interesting: one
   comment, one string, one keyword is enough to say the grammar ran. */

import { test, expect } from '@playwright/test';
import { highlight, highlights } from '../src/lib/highlight.ts';
import { gotoStory } from './lib/story.ts';

/* A line of each, with something in it the grammar has to recognise. */
const SAMPLES: Record<string, string> = {
  bash: 'echo hi # a note',
  css: '.a { color: red; }',
  diff: '+added\n-removed',
  html: '<a href="#">x</a>',
  javascript: 'const a = 1; // one',
  json: '{ "versions": ["13.4"] }',
  markdown: '# Title\n\nSome **bold** and `code`.\n\n- item',
  php: '<?php echo 1;',
  sql: 'SELECT 1 FROM t',
  twig: '{{ name }}',
  typescript: 'const a: number = 1;',
  xml: '<r><c/></r>',
  yaml: 'versions: [13.4] # a note',
};

for (const [lang, source] of Object.entries(SAMPLES)) {
  test(`${lang} is coloured`, () => {
    const out = highlight(lang, source);
    expect(out, `${lang} should be a language this system colours`).not.toBeNull();
    expect(out ?? '', `${lang} produced no token — is the right grammar registered?`)
      .toMatch(/class="hljs-/);
  });
}

/* Plain text is declared and has a grammar, and that grammar's whole job is to
   mark nothing. Asserting it produces no token is what keeps it from being
   quietly pointed at something that does. */
test('text is left alone', () => {
  const out = highlight('text', 'plain words');
  expect(out).not.toBeNull();
  expect(out ?? '').not.toContain('class="hljs-');
});

/* Declared, and deliberately without a grammar: highlight.js has none for
   TypoScript, and one colour is better than a wrong one. If a grammar ever
   arrives this fails, which is the right way to find out. */
test('typoscript is declared and not coloured', () => {
  expect(highlights('typoscript')).toBe(false);
  expect(highlight('typoscript', 'page = PAGE')).toBeNull();
});

test('a language nobody declared is not guessed at', () => {
  expect(highlight('cobol', 'DISPLAY "hi".')).toBeNull();
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
