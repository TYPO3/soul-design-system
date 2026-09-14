#!/usr/bin/env node
/* Render the documentation with the Guides theme.

     make guides

   `.out/site/` ships **standalone**. The repository around it does not go
   with it, so everything the pages need goes inside and the last step here
   proves nothing points out. The one interesting part is that the stylesheets
   go into the *source* tree. Guides copies assets the parsed documents
   reference and drops a `<link>` to anything outside it. So the drop-in goes
   in as `styles/`, where `asset()` can rewrite it per page. */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

import { GENERATED, ROOT, cardChrome } from './lib/cards.ts';
import { PACKAGES } from './lib/packages.ts';
import { PROJECTS } from './lib/projects.ts';
import * as report from './lib/report.ts';

/* This site builds the way the manual tells a project to build one. An empty
   manifest, the theme as a dependency, and the renderer and drop-in taken out
   of the `vendor/` that produces. What differs is where the dependency comes
   from — the package assembled from this tree, or Packagist. */
const CONSUMER = join(GENERATED, 'consumer');
const PACKAGED = join(GENERATED, 'theme');
const argv = process.argv.slice(2);
const RELEASED = argv.includes('--released');

/* Named projects, or all of them. `make guides ARGS=docs` is what the publish
   runs, because the control surface beside the publish root is the gate's
   question and no reader's. */
const wanted = argv.filter((arg) => !arg.startsWith('--'));
const rendering = PROJECTS.filter((project) => wanted.length === 0 || wanted.includes(project.name));
const unknown = wanted.filter((name) => !PROJECTS.some((project) => project.name === name));
report.open('guides', 'render the documents with the installed theme');
report.align(PROJECTS.map((project) => ({ name: project.name, label: project.what })));

if (unknown.length) {
  report.summary(`there is no project called ${unknown.join(', ')}`, [`there is ${PROJECTS.map((p) => p.name).join(' and ')}`]);
  process.exit(1);
}

const GUIDES = join(CONSUMER, 'vendor', 'bin', 'guides');
const DROP = join(CONSUMER, 'vendor', 'typo3', 'soul-guides-theme', 'resources', 'dist');
/* The step after the render, run rather than imported: it is `lib/site.ts`
   bundled, and inside the package it is the file the manual prints. */
const FINISH = join(DROP, 'soul-finish.js');

const run = (cmd: string, args: string[], cwd = ROOT): number =>
  spawnSync(cmd, args, { cwd, stdio: 'inherit' }).status ?? 1;

const theme = PACKAGES.find((pack) => pack.name === 'guides-theme');
if (!theme) throw new Error('there is no guides-theme package to render with');

/* On a desk the repository is the package as it ships: this tree plus the
   drop-in the other package builds. Assembled again every run, because a path
   repository is a symlink and an edited template has to arrive with no
   reinstall. */
if (!RELEASED) {
  rmSync(PACKAGED, { recursive: true, force: true });
  mkdirSync(PACKAGED, { recursive: true });
  theme.assemble(ROOT, PACKAGED);
}

const renderer = `${RELEASED ? 'packagist' : `path ${PACKAGED}`}\n`;
const marker = join(CONSUMER, '.renderer');

/* The commands the manual prints, redone when the source changes or the
   renderer is not there. `composer require` resolves the branch afresh. That
   is what makes a mirror pushed minutes ago the one this renders with, as far
   as Packagist has caught up with it. */
if (!existsSync(GUIDES) || !existsSync(marker) || readFileSync(marker, 'utf8') !== renderer) {
  report.fact('building the renderer', RELEASED ? 'from the published theme' : 'from this tree');
  rmSync(CONSUMER, { recursive: true, force: true });
  mkdirSync(CONSUMER, { recursive: true });
  const composer = (...args: string[]): void => {
    if (run('composer', [...args, '--no-interaction'], CONSUMER) !== 0) process.exit(1);
  };
  composer('init', '--name=typo3/soul-documentation');
  if (!RELEASED) composer('config', 'repositories.soul', 'path', PACKAGED);
  /* `dev-main` and not the released constraint the manual prints: this site
     documents `main`, so it renders with the theme `main` has. A path
     repository takes its version from the checkout around it. On a branch of
     your own that name is somebody else's — `*@dev` takes what is there. */
  composer('require', '--no-progress', `typo3/soul-guides-theme:${RELEASED ? 'dev-main' : '*@dev'}`);
  writeFileSync(marker, renderer);
}

if (!existsSync(FINISH)) {
  report.summary(`the installed theme carries no drop-in at ${DROP}`, ['run `make dist` first']);
  process.exit(1);
}

for (const project of rendering) rmSync(project.out, { recursive: true, force: true });

for (const project of rendering) {
  /* Put there by `make embed`, which `make cards` ends with. The guideline
     pages point at cards. A renderer that fails on a reference it cannot
     resolve reports every one of them instead of the one absent thing. */
  if (!existsSync(join(project.source, '_cards'))) {
    report.summary(`${project.name} has no _cards/ beside its documents`, ['run `make embed` first']);
    process.exit(1);
  }
  const code = run(GUIDES, [
    project.source,
    `--output=${project.out}`,
    '-c', project.source,
    '--no-progress',
    /* A missing reference is the whole point of the exercise, so it must not
       be something a reader has to notice in a log. */
    '--fail-on-error',
  ]);
  if (code !== 0) process.exit(code);

  /* What this site has beyond a reader's project, before the step they share:
     the chrome its embedded cards draw with. */
  cardChrome(project.out);
  /* Last, because it ends with a refusal of any reference that leaves the
     output, and the two copies above are references. Everything a page points
     at has to be beside it before that question comes. Once per project and
     never twice over a page: an element that is already markup does not stay
     as it is, it renders the rendering. */
  const finished = run(process.execPath, [
    FINISH, project.out,
    /* An index is a thing a reader searches, and a reader reads only one of
       these. */
    ...(project.name === 'docs' ? [] : ['--no-search']),
  ]);
  if (finished !== 0) process.exit(1);
}

for (const project of rendering) report.fact(`${relative(ROOT, project.out)}/`, project.what);
report.detail(report.dim('open http://localhost:4173/ (the port `make start` reports), or photograph a page:'));
report.detail(report.dim("make look ARGS='.out/site/index.html 900'"));
report.summary(`${rendering.length} project(s) rendered`);
