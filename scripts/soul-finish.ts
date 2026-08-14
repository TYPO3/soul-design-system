#!/usr/bin/env node
/* The step after the renderer, for a project that has only Composer.

   `vendor/bin/guides` writes documents; this turns them into the site. Built
   into the drop-in as `soul-finish.js` — one file, no dependencies, run with
   the Node every CI image has anyway:

     node path/to/dist/soul-finish.js site

   `scripts/lib/site.ts` is the whole of it, and `make guides` calls the same
   functions: a documented step that drifts from the one we run is worse. */
import { existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { finish } from './lib/site.ts';
import * as report from './lib/report.ts';

const argv = process.argv.slice(2);
const flag = (name: string): string | undefined =>
  argv.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');

const OPTIONS: readonly (readonly [flag: string, what: string])[] = [
  ['--drop-in=<dir>', 'where the stylesheets and the script are (default: beside this file)'],
  ['--no-drop-in', 'the output already has them'],
  ['--styles=<name>', 'what the directory is called at the site root (default: styles — the theme links this name)'],
  ['--search=<name>', 'the index the bar fetches (default: _search.json)'],
  ['--no-search', 'write no index; the field then finds nothing'],
];

report.open('soul-finish', 'turn rendered documents into the site');

if (argv.includes('--help') || argv.length === 0) {
  report.align(OPTIONS.map(([option]) => ({ name: option, label: option })));
  report.fact('node soul-finish.js <output-dir> [options]');
  console.log();
  for (const [option, what] of OPTIONS) report.fact(option, what);
  process.exit(argv.length === 0 ? 1 : 0);
}

const root = resolve(argv[0] as string);
if (!existsSync(root) || !statSync(root).isDirectory()) {
  report.summary(`${root} is not a directory`, ['render the documents first']);
  process.exit(1);
}

/* Beside this file, because the drop-in is what this file is shipped in: a
   consumer who copied the directory has the stylesheets by having this. */
const drop = argv.includes('--no-drop-in')
  ? undefined
  : resolve(flag('drop-in') ?? dirname(fileURLToPath(import.meta.url)));

/* Said here rather than left to the reference check, which would report every
   page in the site instead of the one directory that was wrong. */
if (drop && !existsSync(join(drop, 'soul.css'))) {
  report.summary(`${drop} holds no soul.css`, ['name the drop-in with --drop-in=<dir>, or --no-drop-in if the output already has it']);
  process.exit(1);
}

const { drawn, indexed, broken, linked } = finish(root, {
  drop,
  styles: flag('styles'),
  search: argv.includes('--no-search') ? false : flag('search'),
});

/* Said, and not fatal: the picture is on the page either way, and which of the
   two a project wants is a decision about the drawing rather than the build. */
if (linked.length) {
  report.note(`${linked.length} drawing(s) are shown as an image — no id="soul-ref" in the file`);
  for (const line of linked.slice(0, 12)) report.detail(line);
  if (linked.length > 12) report.detail(`… and ${linked.length - 12} more`);
  for (const line of [
    'they keep the colours they were exported with, so they do not follow the page into dark.',
    'to change that, name the root element of the file — the reference points at <file>.svg#soul-ref:',
    '',
    '    <svg id="soul-ref" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">',
    '',
    'and write each colour token first, exported value behind it, so the page can reach it:',
    '',
    '    fill="var(--text-primary, #8A8378)"   stroke="var(--accent, #FF8700)"',
    '',
    'the shapes do not change, and no <style> block or fill on the root may override them.',
    `edit the file in the documentation source, not the copy listed above: those are under ${root},`,
    'which this run wrote and the next render overwrites.',
    'nothing failed here — a drawing that has to keep its exported colours is finished as it is.',
  ]) report.detail(report.dim(line));
}

const problems = broken.length
  ? [
    ...broken.slice(0, 12),
    ...(broken.length > 12 ? [`… and ${broken.length - 12} more`] : []),
    'a site is published on its own — anything pointing out of it is a page with no stylesheet on the server, and no error anywhere',
  ]
  : [];
report.summary(
  `${drawn} page(s) carry their elements already rendered${indexed === null ? '' : ` \u00b7 ${indexed} indexed for search`}`
    + (broken.length ? ` \u00b7 ${broken.length} reference(s) do not resolve inside ${root}` : ''),
  problems,
);
process.exit(problems.length ? 1 : 0);
