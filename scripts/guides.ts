#!/usr/bin/env node
/* Render the documentation with the Guides theme.

     make guides

   `site/` is the publish root — what GitHub Pages will serve, and what the
   `site` container serves locally at a root of its own so the two are the
   same shape. More than one project goes into it:

     site/              the manual and the landing page   (from docs/)
     site/_acceptance/  every node the renderer emits     (guides-theme/acceptance/)

   The second is not documentation. It is the acceptance test for the theme —
   the page every claim about a gap is checked against — and it is a control
   surface for whoever works on this, not for a reader. The underscore says so,
   and the publish step leaves it behind.

   Three things happen per project, and only the middle one is interesting.

   **Dependencies.** The renderer is a Composer package and its tree lives in
   the working directory rather than in an image layer — pure PHP, identical on
   every platform, and readable without opening a container. Installed on first
   run, so nobody has to know that.

   **The stylesheets go into the source tree.** Guides copies assets it finds
   referenced from the documents it parsed; a `<link>` to a file outside that
   tree is reported as a missing image and dropped. So the drop-in is copied
   into the project as `styles/`, where `asset()` can find it and rewrite the
   URL per page — which is also what makes a page below the root resolve it.
   That directory is generated and gitignored.

   **The render.** One CLI call per project. Each `guides.xml` says which
   parser to use and where the theme's templates are. */
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { ROOT } from './lib/cards.ts';

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
  const styles = join(project.source, 'styles');
  rmSync(styles, { recursive: true, force: true });
  mkdirSync(styles, { recursive: true });
  for (const file of ['soul.css', 'document.css', 'soul.js']) {
    cpSync(join(DROP, file), join(styles, file));
  }

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

  /* The faces, afterwards and by hand.

     Guides copies an asset it can see a document reach for, and nothing sees
     these: `soul.css` asks for `fonts/` beside itself, and the renderer does
     not read stylesheets. Left out, the whole site falls back to system-ui —
     a page that looks broken while every file it names is present. */
  cpSync(join(DROP, 'fonts'), join(project.out, 'styles', 'fonts'), { recursive: true });
}

console.log(`
  ${PROJECTS.length} project(s) into site/ — the publish root.
  Open http://localhost:4173/ (the port \`make start\` reports), or photograph a page:
    make look ARGS='site/index.html 900'`);
