#!/usr/bin/env node
/* Render the documentation with the Guides theme.

     make guides

   `site/` is published **standalone**: the repository around it does not go
   with it, so everything the pages need is copied inside and the last step here
   proves nothing points out. The one interesting part is that the stylesheets
   go into the *source* tree — Guides copies assets referenced from the
   documents it parsed and drops a `<link>` to anything outside it, so the
   drop-in is copied in as `styles/` where `asset()` can rewrite it per page. */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

import { cards, ROOT, screens } from './lib/cards.ts';
import { dropIn, finish } from './lib/site.ts';

const THEME = join(ROOT, 'guides-theme');
const SITE = join(ROOT, 'site');
const DROP = join(ROOT, 'dist');

interface Project {
  /** What it is called in the output and in the log. */
  name: string;
  /** The documents, and the `guides.xml` beside them. */
  source: string;
  /** Where it lands under the publish root. */
  out: string;
}

const PROJECTS: Project[] = [
  /* The manual and the landing page. Renders into the root, because that is
     what Pages serves. */
  { name: 'docs', source: join(ROOT, 'docs'), out: SITE },
  /* The acceptance test for the theme: every node the renderer can emit, once,
     where it can be looked at. A control surface rather than a published one —
     hence the underscore, and hence excluded when the site is published. */
  { name: 'acceptance', source: join(THEME, 'acceptance'), out: join(SITE, '_acceptance') },
];

/* The specimen cards, where the documents can reach them. A guideline page
   embeds the card that renders the rule it states, and a card is a whole
   document with a stylesheet of its own, so it has to be copied into the
   source: `asset()` only carries what a parsed document points at. The links
   inside are rewritten on the way, counted rather than written down. */
function copyCards(source: string): void {
  const out = join(source, '_cards');
  rmSync(out, { recursive: true, force: true });
  /* Screens as well as cards. A guideline page about layout embeds whole
     pages, and they are specimens by the same definition — a rendering of a
     rule, kept beside the rule. */
  for (const card of [...cards(), ...screens()]) {
    const rel = relative(join(ROOT, 'specimens'), card.path);
    const target = join(out, rel);
    mkdirSync(join(target, '..'), { recursive: true });
    /* Two levels: `_cards/<group>/<file>` in the output, so the climb is
       counted from where each card lands rather than assumed flat. */
    const up = '../'.repeat(rel.split('/').length);
    writeFileSync(target, readFileSync(card.path, 'utf8')
      .replace(/href="(?:\.\.\/)+src\/styles\/styles\.css"/g, `href="${up}styles/soul.css"`)
      .replace(/href="(?:\.\.\/)+src\/styles\/_specimen\.css"/g, `href="${up}styles/_specimen.css"`)
      .replace(/(src|href)="(?:\.\.\/)+assets\//g, `$1="${up}styles/assets/`));
  }
}

/* The starter example, where the manual can quote it.

   A page that prints a workflow somebody is meant to copy must print the file
   that is actually built, not a second copy of it going stale in prose — so
   the three files are copied in and `literalinclude`d. Flattened, and no
   `.rst` among them: everything the parser recognises in the source tree is
   parsed as a document, and the example's pages are not this site's pages. */
function copyStarter(source: string): void {
  const out = join(source, 'guides-theme', '_starter');
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  for (const from of ['.github/workflows/publish.yml', 'composer.json', 'docs/guides.xml']) {
    cpSync(join(ROOT, 'examples', 'starter', from), join(out, from.split('/').pop() as string));
  }
}

const run = (cmd: string, args: string[], cwd = ROOT): number =>
  spawnSync(cmd, args, { cwd, stdio: 'inherit' }).status ?? 1;

if (!existsSync(join(THEME, 'vendor', 'bin', 'guides'))) {
  console.log('installing the renderer (first run only)');
  const code = run('composer', ['install', '--no-interaction', '--no-progress'], THEME);
  if (code !== 0) process.exit(code);
}

/* The drop-in, not the sources: what a consuming site links is one built
   stylesheet and one built script, and rendering against anything else would
   prove the theme works with something nobody ships. */
if (!existsSync(join(DROP, 'soul.css'))) {
  console.error('dist/soul.css is missing — run `make dist` first');
  process.exit(1);
}

rmSync(SITE, { recursive: true, force: true });

for (const project of PROJECTS) {
  copyCards(project.source);
  /* The manual quotes the example; the fixture has nothing to say about it. */
  if (project.name === 'docs') copyStarter(project.source);

  const code = run(join(THEME, 'vendor', 'bin', 'guides'), [
    project.source,
    `--output=${project.out}`,
    '-c', project.source,
    '--no-progress',
    /* A missing reference is the whole point of the exercise, so it must not
       be something a reader has to notice in a log. */
    '--fail-on-error',
  ]);
  if (code !== 0) process.exit(code);

  /* The drop-in, into the output, in one piece — the same copy a project with
     only Composer makes, out of the same function. Not through the source and
     `asset()`: the renderer copies what a parsed document points at, and
     nothing points at the faces or at the icon sprite. */
  const styles = join(project.out, 'styles');
  dropIn(DROP, styles);
  /* The chrome the cards are drawn with. Not part of the drop-in and it must
     not be — a design built with this system inherits the token and component
     layers only — but inside a specimen frame it is what draws the captions.
     Copied here rather than into the source because nothing in a document
     points at it: only the cards do, and nothing parses a card. */
  cpSync(join(ROOT, 'src', 'styles', '_specimen.css'), join(styles, '_specimen.css'));
  /* And the photography those cards are drawn with, for the same reason and
     from the same place: story fixtures rather than drop-in, and no document
     points at them — only a card does, and nothing parses a card. */
  cpSync(join(ROOT, 'assets', 'placeholders'), join(styles, 'assets', 'placeholders'), { recursive: true });
}

/* The three steps between a render and a site — every element drawn ahead of
   the browser, the index the bar searches, and the refusal of a reference that
   leaves the output. They are `scripts/lib/site.ts`, which is also what
   `dist/soul-finish.js` is: what is published here and what the documentation
   tells another project to run are the same code. */
const { drawn, indexed, broken } = finish(SITE);

if (broken.length) {
  console.error(`\n✗ ${broken.length} reference(s) do not resolve inside site/:`);
  for (const line of broken.slice(0, 12)) console.error(`  - ${line}`);
  process.exit(1);
}

console.log(`
  ${drawn} pages carry their elements already rendered.
  ${indexed} pages indexed for search.
  ${PROJECTS.length} project(s) into site/ — the publish root.
  Open http://localhost:4173/ (the port \`make start\` reports), or photograph a page:
    make look ARGS='site/index.html 900'`);
