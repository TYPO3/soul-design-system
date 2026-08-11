#!/usr/bin/env node
/* Render the documentation fixture with the Guides theme.

     make guides

   What this proves is not that the renderer works — it is theirs, and it
   does. It is that the system sets what the renderer emits. Every node kind a
   document can hold appears once in `guides-theme/fixture/`, and the output
   lands in `site/` where it can be opened and photographed. Until a page
   exists, every statement about a gap is a guess.

   Three things happen here, and only the middle one is interesting.

   **Dependencies.** The renderer is a Composer package and its tree lives in
   the working directory rather than in an image layer — pure PHP, identical
   on every platform, and readable without opening a container. Installed on
   first run, so nobody has to know that.

   **The stylesheets go into the source tree.** Guides copies assets it finds
   referenced from the documents it parsed; a `<link>` to a file outside that
   tree is reported as a missing image and dropped. So the drop-in is copied
   under the fixture as `styles/`, where `asset()` can find it and rewrite the
   URL per page — which is also what makes a nested page resolve it correctly.
   That directory is generated and gitignored.

   **The render.** One CLI call. `guides.xml` beside the fixture says which
   parser to use and where the theme's templates are. */
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { ROOT } from './lib/cards.ts';

const THEME = join(ROOT, 'guides-theme');
const FIXTURE = join(THEME, 'fixture');
const OUT = join(ROOT, 'site');
/* Inside the fixture rather than beside it: see above — Guides only copies
   what the documents it parsed can reach. */
const STYLES = join(FIXTURE, 'styles');

const run = (cmd: string, args: string[], cwd = ROOT): number => {
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit' });
  return r.status ?? 1;
};

if (!existsSync(join(THEME, 'vendor', 'bin', 'guides'))) {
  console.log('installing the renderer (first run only)');
  const code = run('composer', ['install', '--no-interaction', '--no-progress'], THEME);
  if (code !== 0) process.exit(code);
}

/* The drop-in, not the sources: what a consuming site links is one built
   stylesheet and one built script, and rendering against anything else would
   prove the theme works with something nobody ships. */
const drop = join(ROOT, 'dist');
if (!existsSync(join(drop, 'soul.css'))) {
  console.error('dist/soul.css is missing — run `make dist` first');
  process.exit(1);
}
rmSync(STYLES, { recursive: true, force: true });
mkdirSync(STYLES, { recursive: true });
for (const file of ['soul.css', 'document.css', 'soul.js']) {
  cpSync(join(drop, file), join(STYLES, file));
}

rmSync(OUT, { recursive: true, force: true });
const code = run(join(THEME, 'vendor', 'bin', 'guides'), [
  FIXTURE,
  `--output=${OUT}`,
  `-c`, FIXTURE,
  '--no-progress',
  /* A missing reference is the whole point of the exercise, so it must not be
     something a reader has to notice in a log. */
  '--fail-on-error',
]);
if (code !== 0) process.exit(code);

/* The faces, afterwards and by hand.

   Guides copies an asset it can see a document reach for, and nothing sees
   these: `soul.css` asks for `fonts/` beside itself, and the renderer does not
   read stylesheets. Left out, the whole site falls back to system-ui — which
   is a page that looks broken while every file it names is present. */
cpSync(join(drop, 'fonts'), join(OUT, 'styles', 'fonts'), { recursive: true });

console.log(`\n  site/  — open site/index.html, or photograph it:\n    make look ARGS='site/index.html 900'`);
