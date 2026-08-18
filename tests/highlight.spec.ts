/* Every language the system says it colours, actually coloured.

   `CodeLang` is a promise, and a mapping that quietly lost an entry shows as a
   block set in one grey — which is also what an undeclared language looks like,
   so it would never be reported. The samples are chosen to produce a token, not
   to be interesting: one comment, one string, one keyword. */

import { test, expect } from '@playwright/test';
import { highlight, highlights } from '../packages/frontend/src/lib/highlight.ts';
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
  scss: '$pad: 1rem; .a { padding: $pad; }',
  sql: 'SELECT 1 FROM t',
  twig: '{{ name }}',
  typescript: 'const a: number = 1;',
  typoscript: '# a note\npage = PAGE',
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

/* And TSconfig, which is the same grammar under the name the backend half of
   the language is written under — an alias stated in the grammar itself, so
   both highlighters answer to it from the one file. */
test('tsconfig is that same grammar', () => {
  expect(highlights('tsconfig')).toBe(true);
  expect(highlight('tsconfig', 'TCEMAIN.linkHandler.page {\n    label = Page\n}') ?? '')
    .toContain('<span class="hljs-attr">TCEMAIN.linkHandler.page</span>');
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
