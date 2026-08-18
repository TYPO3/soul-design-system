#!/usr/bin/env node
/* Write the grammars this system wrote itself where the server can load them
   — `make grammars`, or `ARGS=--check` to ask whether the copy is in step.

   A code block is coloured twice: in the browser by highlight.js, and on the
   rendered site by its PHP port, which reads a language as JSON. The modes
   under `src/lib/grammars/` are the one source of both, and this puts a copy
   of each beside the theme that registers it — the theme is published as a
   Composer package of its own, and nothing on the way out builds. */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { WRITTEN } from '../packages/frontend/src/lib/grammars/index.ts';
import { ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

/** Where the theme looks. The suffix is the only thing a JSON file can say
    about itself: it carries no comment, and a reader who opens one has to be
    told from the name that editing it is reverted by the next run. */
const DIR = join(ROOT, 'packages', 'guides-theme', 'resources', 'highlight');
const SUFFIX = '.generated.json';

const written = Object.entries(WRITTEN)
  .map(([name, mode]) => [name, `${JSON.stringify(mode, null, 2)}\n`] as const)
  .sort(([a], [b]) => a.localeCompare(b));

const check = process.argv.includes('--check');
const problems: string[] = [];

report.open('grammars', check ? 'the theme’s copies match the written grammars' : 'write the grammars where the theme loads them');

mkdirSync(DIR, { recursive: true });
const present = readdirSync(DIR).filter((f) => f.endsWith(SUFFIX));
const expected = new Set(written.map(([name]) => `${name}${SUFFIX}`));

for (const [name, json] of written) {
  const out = join(DIR, `${name}${SUFFIX}`);
  if (check) {
    let held = '';
    try {
      held = readFileSync(out, 'utf8');
    } catch {
      problems.push(`${name}: the theme has no copy of the grammar`);
      continue;
    }
    if (held !== json) problems.push(`${name}: the theme’s copy is out of date`);
  } else {
    writeFileSync(out, json);
    report.fact(name, `${json.length} bytes`);
  }
}

/* A grammar that was dropped leaves a file the theme would still register,
   and a language nothing tests is a colour nobody chose. */
for (const file of present) {
  if (expected.has(file)) continue;
  if (check) problems.push(`${file}: no grammar behind it any more`);
  else {
    rmSync(join(DIR, file));
    report.fact(file, 'removed — no grammar behind it');
  }
}

report.summary(written.map(([name]) => name).join(' · '), problems);
process.exit(problems.length ? 1 : 0);
