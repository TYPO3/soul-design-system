#!/usr/bin/env node
/* Generate the component specimen cards from their stories.

   Truth runs story → card: a story composes the specimen out of the component's
   own templates, and the card is written from it. One source, three renderers —
   the browser, Storybook, this. A card cannot contain `<sds-button>`, because
   the pane opens these with `styles.css` and no JavaScript.

     make cards              # write them
     make cards ARGS=--check # fail if any is stale
*/
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { inlineArtRefs } from '../packages/frontend/src/components/art.static.ts';
import { indent, type DsCard, type DsScreen } from '../stories/lib/specimen.ts';
import { cards, embedCards, inRepo, screens, ROOT } from './lib/cards.ts';
import { PROJECTS } from './lib/projects.ts';

const STORIES = join(ROOT, 'stories');

interface StoryModule {
  default?: { parameters?: { dsCard?: DsCard; dsScreen?: DsScreen } };
  /** The composed specimen markup. A story file opts into card generation by
      exporting this alongside `parameters.dsCard`. */
  specimenHtml?: () => string;
  /** The composed page. The same opt-in one level up: a screen is a whole
      surface rather than one component shown by itself. */
  screenHtml?: () => string;
}

export interface CardResult {
  file: string;
  path: string;
  changed: boolean;
  existed: boolean;
}

/* A picture in a specimen is written the way the story sees it — `../packages/frontend/assets/`,
   one climb out of a folder. Where the file lands is not a story's business, so
   the climb is counted here from the same `up` the stylesheets use; a story
   that stated a depth would be one more place to keep true. */
const withAssets = (html: string, up: string): string =>
  html.replace(/(src|href)="(?:\.\.\/)+(?:packages\/frontend\/)?assets\//g, `$1="${up}packages/frontend/assets/`);

/* The document shell — deliberately the same six lines every card already
   carried: the `@dsCard` marker the pane reads, the theme pinned on <html>
   so the browser's own scrollbars and form controls match, and the two
   stylesheets. `styles.css` is linked exactly as a consuming surface links
   it; `_specimen.css` draws the captions and goes no further. */
function shell(card: DsCard, body: string): string {
  /* From where the file lands, not from what it is called. A card declares
     the path the bundle knows it by; in this repo it sits one level deeper,
     under `specimens/`, and a stylesheet link counted from the declared name
     would climb one step short and resolve to nothing. */
  const up = '../'.repeat(inRepo(card.path).split('/').length - 1);
  /* A card is opened from disk, where a reference to another file is refused
     before it is fetched — so the artwork goes where the reference was, the
     same swap `renderStatic` makes for the component cards. Before the paths
     are counted: what is inlined has no path left to count. */
  // Pre-aware: the body of a code block is content, not formatting.
  const indented = indent(withAssets(inlineArtRefs(body), up), 2);
  /* The diagram cards sit their figures on the sunken plane, which is the
     page's ground rather than anything inside the card — so it goes on the
     body, and the story says so rather than wrapping its own div. */
  const cls = card.bodyClass ? ` class="${card.bodyClass}"` : '';
  /* `both` writes no attribute at all: the card carries both modes inside it,
     and the document around them must stay in whichever one the reader is
     in. */
  const theme = card.theme === 'both' ? '' : ` data-theme="${card.theme}"`;

  return `<!-- @dsCard group="${card.group}" viewport="${card.viewport}" subtitle="${card.subtitle}" name="${card.name}" -->
<!doctype html>
<html lang="en"${theme}>
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="${up}packages/frontend/src/styles/styles.css" />
<link rel="stylesheet" href="${up}packages/frontend/src/styles/_specimen.css" />
</head>
<body${cls}>
${indented}
</body>
</html>
`;
}

/* A screen's shell differs from a card's in three ways, and each is the point:
   the marker is `@startingPoint`, the page has a title, and it carries no
   `_specimen.css` — a starting point is copied and must not inherit a
   specimen's captions. No `<style>` either: a page that cannot say something in
   the layout classes has found a gap to fix there. */
function screenShell(screen: DsScreen, body: string): string {
  const up = '../'.repeat(inRepo(screen.path).split('/').length - 1);

  return `<!-- @startingPoint section="${screen.section}" subtitle="${screen.subtitle}" viewport="${screen.viewport}" -->
<!doctype html>
<html lang="en" data-theme="${screen.theme}">
<head>
<meta charset="utf-8" />
<title>${screen.title}</title>
<link rel="stylesheet" href="${up}packages/frontend/src/styles/styles.css" />
</head>
<body class="sds-app">
${indent(withAssets(body, up), 0)}
</body>
</html>
`;
}

/* Every story file under `stories/`, at whatever depth. The folder per group is
   a filing decision and nothing else — Storybook builds its tree from each
   story's `title` — so moving one moves nothing a reader sees. Read flat, this
   would quietly stop generating a card the moment its file moved. */
function storyFiles(dir: string, prefix = ''): string[] {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) return storyFiles(join(dir, entry.name), rel);
      return entry.name.endsWith('.stories.ts') ? [rel] : [];
    })
    .sort();
}

export async function buildCards({ check = false } = {}): Promise<CardResult[]> {
  const files = storyFiles(STORIES);
  const results: CardResult[] = [];

  for (const file of files) {
    const mod: StoryModule = await import(pathToFileURL(join(STORIES, file)).href);
    const card = mod.default?.parameters?.dsCard;
    const screen = mod.default?.parameters?.dsScreen;
    if (!card && !screen) continue;

    if (card && !mod.specimenHtml) {
      throw new Error(`${file}: declares parameters.dsCard but exports no specimenHtml() to generate the card from`);
    }
    if (screen && !mod.screenHtml) {
      throw new Error(`${file}: declares parameters.dsScreen but exports no screenHtml() to generate the page from`);
    }

    /* Declared, then resolved. `orphans()` compares what was written against
       what is on disk, and the two have to be the same vocabulary — so a
       result carries the repo path, which is also the one worth printing. */
    const path = inRepo(card ? card.path : (screen as DsScreen).path);
    const out = join(ROOT, path);
    const next = card
      ? shell(card, (mod.specimenHtml as () => string)())
      : screenShell(screen as DsScreen, (mod.screenHtml as () => string)());

    let prev: string | null = null;
    try {
      prev = readFileSync(out, 'utf8');
    } catch {
      prev = null;
    }

    const changed = prev !== next;
    if (changed && !check) writeFileSync(out, next);
    results.push({ file, path, changed, existed: prev !== null });
  }

  return results;
}

/** Card files on disk that no story produces — the rule that keeps the
    arrangement from quietly coming apart. A card whose story is deleted, or one
    written by hand, stays on disk and keeps being shipped: the pane renders it,
    `make fit` measures it and the diff compares it, and nothing anywhere says
    it has no source. */
function orphans(generated: readonly CardResult[]): string[] {
  const written = new Set(generated.map((r) => r.path));
  return [...cards(), ...screens()].map((c) => c.rel).filter((rel) => !written.has(rel)).sort();
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const check = process.argv.includes('--check');
  const results = await buildCards({ check });
  const stale = results.filter((r) => r.changed);
  const stray = orphans(results);

  for (const r of results) {
    const state = r.changed ? (check ? 'STALE' : r.existed ? 'updated' : 'created') : 'unchanged';
    console.log(`   ${state.padEnd(9)} ${r.path}  ←  stories/${r.file}`);
  }
  for (const rel of stray) console.log(`   ORPHAN    ${rel}  ←  nothing`);
  console.log(`   ${results.length} generated cards, ${stale.length} ${check ? 'stale' : 'written'}, ${stray.length} orphaned`);

  /* And where the documents can reach them, so a tree that has just generated
     its cards is one the render can be pointed at. Not on `--check`: that run
     is a question about the tree and answers it without changing one. */
  if (!check) {
    for (const project of PROJECTS) console.log(`   ${embedCards(project.source)} beside ${project.name}`);
  }

  if (check && stale.length) {
    console.error(`\n✗ ${stale.length} card(s) do not match their story. Run \`make cards\` and commit the result.`);
    process.exit(1);
  }
  if (stray.length) {
    console.error(
      `\n✗ ${stray.length} card(s) are generated by no story. Write the story that produces one, or delete the file — ` +
        'a card with no source is documentation nothing can keep true.',
    );
    process.exit(1);
  }
}
