/* One block of every language this system colours.

   The list has the type `CodeLangName`, so a language declared with no example
   does not compile. That is the half of "declared, not surveyed" a union
   alone cannot hold. The suite reads the same samples. A snippet nobody looks
   at proves the grammar registered and nothing about how it reads, and a
   snippet nobody tests goes stale in a story.

   Each one is real, and short enough for one glance: a comment, a name, a
   value. Not a tour of the language — the block shows a palette of three
   colours, and does not teach PHP. */

import type { CodeLangName } from '../../packages/frontend/src/components/code.ts';

export const SAMPLES: Readonly<Record<CodeLangName, string>> = {
  bash: `# Publish what the tree holds
composer install --no-dev
vendor/bin/typo3 cache:flush`,

  css: `.sds-code {
  /* Every declaration reads the component's own set. */
  --sds-code-ink: var(--syntax-text);

  color: var(--sds-code-ink);
  border-radius: var(--radius-2);
}`,

  diff: `--- a/composer.json
+++ b/composer.json
 {
     "require": {
-        "typo3/cms-core": "^12.4",
+        "typo3/cms-core": "^13.4",
         "typo3/soul-guides-theme": "^1.0"
     }
 }`,

  html: `<sds-code code-lang="bash" copy>
  <div class="sds-code__caption">What a project runs to publish.</div>
  composer require typo3/soul-guides-theme
</sds-code>`,

  javascript: `import { finish } from './soul-finish.js';

// Every element drawn before the page goes out.
const pages = await finish('site');
console.log(\`\${pages.length} page(s) carry their elements\`);`,

  json: `{
  "name": "@typo3/soul-frontend",
  "type": "module",
  "exports": {
    ".": "./index.js",
    "./soul.css": "./soul.css"
  }
}`,

  markdown: `# Installing

Run \`composer require typo3/soul-guides-theme\`, then **select the theme**:

- \`theme="soul"\` in \`guides.xml\`
- nothing else`,

  php: `<?php
namespace TYPO3\\CMS\\Core;

// The scope a question gets its answer in.
final class Version
{
    public function __construct(private readonly string $number) {}
}`,

  scss: `$pad: 1rem;

.card {
    // A variable and a nested rule, which is what the grammar reads.
    padding: $pad;

    &:hover {
        border-color: currentColor;
    }
}`,

  sql: `SELECT uid, title
FROM pages
WHERE deleted = 0 AND hidden = 0
ORDER BY sorting;`,

  text: `A block whose language is text: escaped, uncoloured, and the
honest answer when nobody said what it is.`,

  tsconfig: `# Page TSconfig — the same syntax, read by the backend
TCEMAIN.linkHandler.page {
    handler = TYPO3\\CMS\\Backend\\LinkHandler\\PageLinkHandler
    label = Page
}`,

  twig: `{# The element, not a hand-built frame #}
<sds-code code-lang="{{ node.language|default('text') }}" copy>
    {{- node.value|highlight(node.language) -}}
</sds-code>`,

  typescript: `export interface CodeLine {
  kind: CodeKind;
  text: string;
}

export const said = (parts: readonly CodeLine[]): string =>
  parts.map(({ text }) => text).join('\\n');`,

  typoscript: `# The site's page object
page = PAGE
page {
    10 = FLUIDTEMPLATE
    10.file = EXT:my_site/Resources/Private/Templates/Main.html
}

plugin.tx_myext.settings.limit = {$plugin.tx_myext.settings.limit}

[siteLanguage("locale") == "de_DE"]
page.10.settings.lang = de
[END]`,

  xml: `<guides theme="soul">
    <project title="Soul" version="0.1"/>
    <extension class="TYPO3\\Soul\\GuidesTheme\\DependencyInjection\\SoulExtension">
        <signet>_images/signet.svg</signet>
    </extension>
</guides>`,

  yaml: `versions:
  - "13.4"   # LTS
  - "14.3"
domains: [labels, xlf]`,
};

/** The names, in the order of the samples. For a control that offers the set
    rather than a free text field, and for a page that shows all of them. */
export const LANGUAGES = Object.keys(SAMPLES) as readonly CodeLangName[];

/** The sample for whatever a caller got, which is an open string. The control
    offers the set, and a story told a language nobody wrote one for shows an
    empty block rather than throws. */
export const sampleOf = (lang: string): string => SAMPLES[lang as CodeLangName] ?? '';
