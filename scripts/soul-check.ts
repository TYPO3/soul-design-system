#!/usr/bin/env node
/* Markup that rebuilt a component instead of addressing it.

   Shipped with the package, because the rule it holds is one only a consumer's
   own tree can break: `<div class="sds-btn">` draws a button that cannot grow
   a part, follow a rename or answer a form. Instructions reach an agent on its
   first draft; a check reaches every draft, including the ones written in a
   session that loaded no instruction at all.

     npx soul-check src/           # or any set of paths; the tree by default
*/
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as report from './lib/report.ts';

/** Where markup is written. A class in a stylesheet is a definition, not a use. */
const MARKUP = ['.html', '.htm', '.php', '.twig', '.vue', '.svelte', '.astro',
  '.jsx', '.tsx', '.js', '.mjs', '.ts', '.hbs', '.liquid', '.mustache', '.ejs'];

/* Somebody else's tree, or this one after a build. A drop-in copied into a
   public directory is this system's own markup and says nothing about the
   project that copied it. */
const SKIP = ['node_modules', '.git', 'vendor', 'dist', 'build', 'out', '.out',
  '.next', '.nuxt', '.svelte-kit', 'coverage', 'storybook-static', 'public'];

interface Declaration {
  tagName?: string;
  cssClasses?: string[];
}

/** The manifest, from beside this file — or from the package it was built in. */
function catalogue(): Declaration[] {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(here, 'custom-elements.json'),
    join(here, '..', 'packages', 'frontend', 'dist', 'custom-elements.json'),
  ];
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    report.summary('no manifest beside this file', candidates.map((p) => `looked in ${p}`));
    process.exit(1);
  }
  const parsed = JSON.parse(readFileSync(found, 'utf8')) as { modules: { declarations: Declaration[] }[] };
  return parsed.modules.flatMap((m) => m.declarations);
}

/** A class down to the thing it belongs to: `sds-card__foot` is `sds-card`'s. */
const family = (cls: string): string => cls.split('--')[0]!.split('__')[0]!;

function* walk(path: string): Generator<string> {
  const stat = statSync(path, { throwIfNoEntry: false });
  if (!stat) return;
  if (stat.isFile()) {
    if (MARKUP.some((ext) => path.endsWith(ext))) yield path;
    return;
  }
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || SKIP.includes(entry.name)) continue;
    yield* walk(join(path, entry.name));
  }
}

report.open('check', 'markup that rebuilds a component instead of addressing it');

/* Every class family an element draws, and which element that is. One family
   can have more than one — an icon is drawn wherever a component composes one
   — and the first is the one whose own name it carries. */
const owner = new Map<string, string>();
for (const d of catalogue()) {
  if (!d.tagName) continue;
  for (const cls of d.cssClasses ?? []) {
    const own = family(cls);
    if (!owner.has(own) || own === d.tagName) owner.set(own, d.tagName);
  }
}

/* A manifest older than this check names no classes, and the walk below would
   then pass every tree it is pointed at. A check that finds nothing has to be
   distinguishable from one that cannot look. */
if (!owner.size) {
  report.summary('the manifest beside this file names no classes',
    ['it was written by an older build — run `make dist`, or update the package']);
  process.exit(1);
}

const roots = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const problems: string[] = [];
let files = 0;

for (const root of roots.length ? roots : ['.']) {
  for (const file of walk(resolve(root))) {
    files++;
    const where = relative(process.cwd(), file);
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      for (const m of line.matchAll(/\bclass(?:Name)?\s*=\s*["']([^"']*)["']/g)) {
        for (const cls of (m[1] ?? '').split(/\s+/).filter((c) => c.startsWith('sds-'))) {
          const tag = owner.get(family(cls));
          if (tag) problems.push(`${where}:${i + 1} — .${cls} is what <${tag}> draws; write the element`);
        }
      }
    });
  }
}

const shown = problems.slice(0, 20);
if (problems.length > shown.length) shown.push(`… and ${problems.length - shown.length} more`);
report.summary(`${files} file(s) \u00b7 ${problems.length} class(es) an element owns`, shown);
process.exit(problems.length ? 1 : 0);
