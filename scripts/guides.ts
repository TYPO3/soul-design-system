#!/usr/bin/env node
/* Render the documentation with the Guides theme.

     make guides

   `.out/site/` is published **standalone**: the repository around it does not go
   with it, so everything the pages need is copied inside and the last step here
   proves nothing points out. The one interesting part is that the stylesheets
   go into the *source* tree — Guides copies assets referenced from the
   documents it parsed and drops a `<link>` to anything outside it, so the
   drop-in is copied in as `styles/` where `asset()` can rewrite it per page. */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

import { FRONTEND, GENERATED, ROOT, cards, screens } from './lib/cards.ts';

const THEME = join(ROOT, 'packages', 'guides-theme');
const SITE = join(GENERATED, 'site');
const ACCEPTANCE = join(GENERATED, 'acceptance');
const DROP = join(FRONTEND, 'dist');
/* The step after the render, taken out of the drop-in rather than imported
   from `lib/site.ts`: it is that file bundled, so this runs what a reader
   runs — and it is why this task needs a Node and nothing installed. */
const FINISH = join(DROP, 'soul-finish.js');

interface Project {
  /** What it is called in the output and in the log. */
  name: string;
  /** The documents, and the `guides.xml` beside them. */
  source: string;
  /** Its own root: a rendered site resolves everything relative to one. */
  out: string;
}

const PROJECTS: Project[] = [
  /* The manual and the landing page. Renders into the publish root, because
     that is what Pages serves. */
  { name: 'docs', source: join(ROOT, 'docs'), out: SITE },
  /* The acceptance test for the theme: every node the renderer can emit, once,
     where it can be looked at. A control surface rather than a published one,
     so it is a root of its own beside the publish root and not a directory
     inside it — what is published is then the whole of what was rendered
     there, with nothing to remember to take back out. */
  { name: 'acceptance', source: join(THEME, 'acceptance'), out: ACCEPTANCE },
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
      .replace(/href="(?:\.\.\/)+packages\/frontend\/src\/styles\/styles\.css"/g, `href="${up}styles/soul.css"`)
      .replace(/href="(?:\.\.\/)+packages\/frontend\/src\/styles\/_specimen\.css"/g, `href="${up}styles/_specimen.css"`)
      .replace(/(src|href)="(?:\.\.\/)+packages\/frontend\/assets\//g, `$1="${up}styles/assets/`));
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
if (!existsSync(join(DROP, 'soul.css')) || !existsSync(FINISH)) {
  console.error('dist/ is incomplete — run `make dist` first');
  process.exit(1);
}

for (const project of PROJECTS) rmSync(project.out, { recursive: true, force: true });

for (const project of PROJECTS) {
  copyCards(project.source);
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

  /* The drop-in into the output and the elements drawn, by the file a project
     with only Composer runs — one `styles/` per project, because each one is
     linked from where its own pages sit. Not through the source and `asset()`:
     the renderer copies what a parsed document points at, and nothing points
     at the faces or at the icon sprite. */
  const styles = join(project.out, 'styles');
  mkdirSync(styles, { recursive: true });
  /* The chrome the cards are drawn with. Not part of the drop-in and it must
     not be — a design built with this system inherits the token and component
     layers only — but inside a specimen frame it is what draws the captions.
     Copied here rather than into the source because nothing in a document
     points at it: only the cards do, and nothing parses a card. */
  cpSync(join(FRONTEND, 'src', 'styles', '_specimen.css'), join(styles, '_specimen.css'));
  /* And the photography those cards are drawn with, for the same reason and
     from the same place: story fixtures rather than drop-in, and no document
     points at them — only a card does, and nothing parses a card. */
  cpSync(join(FRONTEND, 'assets', 'placeholders'), join(styles, 'assets', 'placeholders'), { recursive: true });
  /* Last, because it ends by refusing a reference that leaves the output and
     the two copies above are references — everything a page points at has to
     be beside it before that question is asked. Once per project and never
     twice over a page: drawing an element that is already markup does not
     leave it alone, it renders the rendering. */
  const finished = run(process.execPath, [
    FINISH, project.out, `--drop-in=${DROP}`,
    /* An index is a thing a reader searches, and only one of these is read
       by one. */
    ...(project.name === 'docs' ? [] : ['--no-search']),
  ]);
  if (finished !== 0) process.exit(1);
}

console.log(`
  .out/site/ — the publish root, and everything in it is published.
  .out/acceptance/ — the theme's control surface, rendered every run, published never.
  Open http://localhost:4173/ (the port \`make start\` reports), or photograph a page:
    make look ARGS='.out/site/index.html 900'`);
