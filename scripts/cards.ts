#!/usr/bin/env node
/* Generate the component specimen cards from their stories.

   The direction of truth for the seven component cards runs story → card:
   `stories/Buttons.stories.ts` composes the specimen out of the templates in
   `src/button.ts`, and `specimens/components/core/buttons.card.html` is
   written from it. That is the whole point of the arrangement. Before it, a card was
   hand-written HTML and a story would have been a second copy of the same
   markup — the "second source of truth" `ARCHITECTURE.md` warns about.
   One source, three renderers: the browser upgrades the custom element,
   Storybook renders the story, and this writes the file.

   A card cannot contain `<sds-button>`. The Design System pane opens these
   files with `styles.css` and no JavaScript at all, so what ships is the
   markup the element *produces* — which is why the components expose plain
   template functions and `src/lib/render.ts` turns one into static HTML.

   The guideline specimens under `specimens/guidelines/` are generated the
   same way.
   They were hand-written for a long time, on the argument that a colour
   swatch or a type sample has no component behind it and nothing to vary —
   which was true of the drawing and never true of the file: the theme, the
   viewport, the shell and the `@dsCard` header are the same contract a
   component card has, and every one of them was being kept in step by hand.
   What they document is still the token layer; what generates them is now the
   same three lines as everything else.

     make cards            # write them
     make cards ARGS=--check # fail if any is stale, for CI and verify
*/
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { inlineArtRefs } from '../src/components/art.static.ts';
import { indent, type DsCard, type DsScreen } from '../stories/lib/specimen.ts';
import { cards, inRepo, screens, ROOT } from './lib/cards.ts';

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

/* A picture in a specimen is written the way the story sees it — `../assets/`,
   one climb out of a folder — and eight story files say it that way. Where the
   file finally lands is not a story's business, so the climb is counted here
   from the same `up` the stylesheets use, the way `build.ts` counts it again
   for the bundle. A story that stated a depth would be a fourth place to keep
   true, and this repo has already paid for three. */
const withAssets = (html: string, up: string): string =>
  html.replace(/(src|href)="(?:\.\.\/)+assets\//g, `$1="${up}assets/`);

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
<link rel="stylesheet" href="${up}src/styles/styles.css" />
<link rel="stylesheet" href="${up}src/styles/_specimen.css" />
</head>
<body${cls}>
${indented}
</body>
</html>
`;
}

/* A screen's shell. It differs from a card's in three ways and each is the
   point: the marker is `@startingPoint`, the page has a title because it is a
   page, and it carries no `_specimen.css` — a starting point is a surface
   somebody copies, and it must not inherit the captions a specimen is drawn
   with.

   No `<style>`. A screen used to be allowed one, and every screen used it: a
   shell, a bar, a body and a set of media queries per page, so four pages
   carried four layouts and the breakpoints disagreed. The layout classes are
   the system's now, and a page that cannot say something in them has found a
   gap to fix there rather than a stylesheet to write here. */
function screenShell(screen: DsScreen, body: string): string {
  const up = '../'.repeat(inRepo(screen.path).split('/').length - 1);

  return `<!-- @startingPoint section="${screen.section}" subtitle="${screen.subtitle}" viewport="${screen.viewport}" -->
<!doctype html>
<html lang="en" data-theme="${screen.theme}">
<head>
<meta charset="utf-8" />
<title>${screen.title}</title>
<link rel="stylesheet" href="${up}src/styles/styles.css" />
</head>
<body class="sds-app">
${indent(withAssets(body, up), 0)}
</body>
</html>
`;
}

/* Every story file under `stories/`, at whatever depth.

   The files sit in a folder per group — `components/`, `pages/`,
   `specimens/` — which is a filing decision and nothing else: Storybook builds
   its tree from each story's `title`, not from where the file is, so moving
   one moves nothing a reader sees. What it does change is this, which read the
   directory flat and would have quietly stopped generating every card the
   moment the first file moved into a folder. */
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

/**
 * Card files on disk that no story produces.
 *
 * This is the rule that keeps the arrangement from quietly coming apart. A
 * card whose story is deleted, or one written by hand into `guidelines/`,
 * stays on disk and keeps being shipped: it is a real file with a real
 * `@dsCard` header, so the pane renders it, `make fit` measures it and the
 * pixel diff compares it — and nothing anywhere says it has no source. That
 * is exactly the state this repo just spent thirty-two cards leaving.
 */
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
