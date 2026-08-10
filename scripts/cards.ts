#!/usr/bin/env node
/* Generate the component specimen cards from their stories.

   The direction of truth for the seven component cards runs story → card:
   `stories/Buttons.stories.ts` composes the specimen out of the templates in
   `src/button.ts`, and `components/core/buttons.card.html` is written from
   it. That is the whole point of the arrangement. Before it, a card was
   hand-written HTML and a story would have been a second copy of the same
   markup — the "second source of truth" `ARCHITECTURE.md` warns about.
   One source, three renderers: the browser upgrades the custom element,
   Storybook renders the story, and this writes the file.

   A card cannot contain `<sds-button>`. The Design System pane opens these
   files with `styles.css` and no JavaScript at all, so what ships is the
   markup the element *produces* — which is why the components expose plain
   template functions and `src/lib/render.ts` turns one into static HTML.

   The guideline specimens under `guidelines/` are NOT generated. They
   document the token layer rather than components, have no props to vary,
   and are embedded into the MDX pages as they stand.

     make cards            # write them
     make cards ARGS=--check # fail if any is stale, for CI and verify
*/
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { indent, type DsCard } from '../stories/lib/specimen.ts';
import { ROOT } from './lib/cards.ts';

const STORIES = join(ROOT, 'stories');

interface StoryModule {
  default?: { parameters?: { dsCard?: DsCard } };
  /** The composed specimen markup. A story file opts into card generation by
      exporting this alongside `parameters.dsCard`. */
  specimenHtml?: () => string;
}

export interface CardResult {
  file: string;
  path: string;
  changed: boolean;
  existed: boolean;
}

/* The document shell — deliberately the same six lines every card already
   carried: the `@dsCard` marker the pane reads, the theme pinned on <html>
   so the browser's own scrollbars and form controls match, and the two
   stylesheets. `styles.css` is linked exactly as a consuming surface links
   it; `_specimen.css` draws the captions and goes no further. */
function shell(card: DsCard, body: string): string {
  const up = '../'.repeat(card.path.split('/').length - 1);
  // Pre-aware: the body of a code block is content, not formatting.
  const indented = indent(body, 2);

  return `<!-- @dsCard group="${card.group}" viewport="${card.viewport}" subtitle="${card.subtitle}" name="${card.name}" -->
<!doctype html>
<html lang="en" data-theme="${card.theme}">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="${up}src/styles/styles.css" />
<link rel="stylesheet" href="${up}src/styles/_specimen.css" />
</head>
<body>
${indented}
</body>
</html>
`;
}

export async function buildCards({ check = false } = {}): Promise<CardResult[]> {
  const files = readdirSync(STORIES).filter((f) => f.endsWith('.stories.ts')).sort();
  const results: CardResult[] = [];

  for (const file of files) {
    const mod: StoryModule = await import(pathToFileURL(join(STORIES, file)).href);
    const card = mod.default?.parameters?.dsCard;
    if (!card) continue;
    if (!mod.specimenHtml) {
      throw new Error(`${file}: declares parameters.dsCard but exports no specimenHtml() to generate the card from`);
    }

    const out = join(ROOT, card.path);
    const next = shell(card, mod.specimenHtml());

    let prev: string | null = null;
    try {
      prev = readFileSync(out, 'utf8');
    } catch {
      prev = null;
    }

    const changed = prev !== next;
    if (changed && !check) writeFileSync(out, next);
    results.push({ file, path: card.path, changed, existed: prev !== null });
  }

  return results;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const check = process.argv.includes('--check');
  const results = await buildCards({ check });
  const stale = results.filter((r) => r.changed);

  for (const r of results) {
    const state = r.changed ? (check ? 'STALE' : r.existed ? 'updated' : 'created') : 'unchanged';
    console.log(`   ${state.padEnd(9)} ${r.path}  ←  stories/${r.file}`);
  }
  console.log(`   ${results.length} generated cards, ${stale.length} ${check ? 'stale' : 'written'}`);

  if (check && stale.length) {
    console.error(`\n✗ ${stale.length} card(s) do not match their story. Run \`make cards\` and commit the result.`);
    process.exit(1);
  }
}
