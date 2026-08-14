#!/usr/bin/env node
/* Render the documentation with the Guides theme.

     make guides

   `.out/site/` is published **standalone**: the repository around it does not go
   with it, so everything the pages need is copied inside and the last step here
   proves nothing points out. The one interesting part is that the stylesheets
   go into the *source* tree — Guides copies assets referenced from the
   documents it parsed and drops a `<link>` to anything outside it, so the
   drop-in is copied in as `styles/` where `asset()` can rewrite it per page. */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

import { GENERATED, ROOT, cardChrome } from './lib/cards.ts';
import { PACKAGES } from './lib/packages.ts';
import { PROJECTS } from './lib/projects.ts';
import * as report from './lib/report.ts';

/* This site is built the way the manual tells a project to build one: an empty
   manifest, the theme required, and the renderer and drop-in taken out of the
   `vendor/` that produces. What differs is where it is required from — the
   package assembled from this tree, or Packagist. */
const CONSUMER = join(GENERATED, 'consumer');
const PACKAGED = join(GENERATED, 'theme');
const argv = process.argv.slice(2);
const RELEASED = argv.includes('--released');

/* Named projects, or all of them — `make guides ARGS=docs` is what publishing
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

/* On a desk the repository is the package as it would be published — this tree
   plus the drop-in the other package builds — reassembled every run, because a
   path repository is a symlink and an edited template has to arrive without a
   reinstall. */
if (!RELEASED) {
  rmSync(PACKAGED, { recursive: true, force: true });
  mkdirSync(PACKAGED, { recursive: true });
  theme.assemble(ROOT, PACKAGED);
}

const renderer = `${RELEASED ? 'packagist' : `path ${PACKAGED}`}\n`;
const marker = join(CONSUMER, '.renderer');

/* The commands the manual prints, redone when the source changes or the
   renderer is not there: `composer require` resolves `dev-main` afresh, which
   is what makes a mirror pushed minutes ago the one this renders with — as far
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
  /* `dev-main` is the branch the mirror publishes and what the manual prints.
     A path repository is versioned from the checkout around it, so on a branch
     of your own that name is somebody else's — `*@dev` takes what is there. */
  composer('require', '--no-progress', `typo3/soul-guides-theme:${RELEASED ? 'dev-main' : '*@dev'}`);
  writeFileSync(marker, renderer);
}

if (!existsSync(FINISH)) {
  report.summary(`the installed theme carries no drop-in at ${DROP}`, ['run `make dist` first']);
  process.exit(1);
}

for (const project of rendering) rmSync(project.out, { recursive: true, force: true });

for (const project of rendering) {
  /* Put there by `make embed`, which `make cards` ends with: the guideline
     pages point at cards, and a renderer told to fail on a reference it cannot
     resolve would report every one of them instead of the one thing missing. */
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
     the chrome its embedded cards are drawn with. */
  cardChrome(project.out);
  /* Last, because it ends by refusing a reference that leaves the output and
     the two copies above are references — everything a page points at has to
     be beside it before that question is asked. Once per project and never
     twice over a page: drawing an element that is already markup does not
     leave it alone, it renders the rendering. */
  const finished = run(process.execPath, [
    FINISH, project.out,
    /* An index is a thing a reader searches, and only one of these is read
       by one. */
    ...(project.name === 'docs' ? [] : ['--no-search']),
  ]);
  if (finished !== 0) process.exit(1);
}

for (const project of rendering) report.fact(`${relative(ROOT, project.out)}/`, project.what);
report.detail(report.dim('open http://localhost:4173/ (the port `make start` reports), or photograph a page:'));
report.detail(report.dim("make look ARGS='.out/site/index.html 900'"));
report.summary(`${rendering.length} project(s) rendered`);
