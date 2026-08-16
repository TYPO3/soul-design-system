#!/usr/bin/env node
/* Hold the stylesheets to their shape.

     make css                    format and fix what a rule can fix
     make css ARGS=--check       report and change nothing — what the gate runs

   Biome carries the form and the safety rules — `biome.json` scopes it to the
   handwritten sheets. The one rule it does not have is this system's own and
   is checked here: no colour literal outside `tokens/`. An exception writes
   `colour-literal:` and its reason on the line above. */
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

import { ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

const args = process.argv.slice(2);
const check = args.includes('--check');

report.open('css', check ? 'the stylesheets against their shape' : 'format the stylesheets');

const run = spawnSync(join(ROOT, 'node_modules', '.bin', 'biome'), [
  'check',
  ...(check ? [] : ['--write']),
  '.',
], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const out = `${run.stdout ?? ''}\n${run.stderr ?? ''}`;
const problems: string[] = [];

/* Biome's summary counts; its diagnostics name file and position. Only those
   lines are kept — the framed diffs are what `make css` is for. */
const checked = /Checked (\d+) file/.exec(out)?.[1] ?? '?';
for (const line of out.split('\n')) {
  const m = /^(?:::error.*?::)?(.+\.css):(\d+):\d+\s+(?:lint|format|parse)\S*\s+(.*)$/.exec(line.trim());
  if (m) problems.push(`${m[1]}:${m[2]} — ${m[3]}`.trim());
}
if (run.status !== 0 && !problems.length) {
  const summary = out.split('\n').filter((l) => /error|warn/i.test(l)).slice(0, 10);
  problems.push(...(summary.length ? summary : ['biome did not run — see `make css`']));
}

/* The system's own rule. A mask and a knockout glyph are alpha and blend
   tricks rather than colours, and each says so where it stands. */
const sheets = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? sheets(join(dir, e.name)) : e.name.endsWith('.css') ? [join(dir, e.name)] : []));
let literals = 0;
for (const sheet of sheets(join(ROOT, 'packages', 'frontend', 'src', 'styles'))) {
  /* A reason covers the declaration under it, to whatever line its `;` is on. */
  let covered = false;
  readFileSync(sheet, 'utf8').split('\n').forEach((line, i) => {
    if (/#[0-9a-f]{3,8}\b/i.test(line)) {
      literals++;
      if (!covered) problems.push(`${relative(ROOT, sheet)}:${i + 1} — a colour literal outside tokens/, with no \`colour-literal:\` reason above it`);
    }
    if (line.includes('colour-literal:')) covered = true;
    else if (line.includes(';')) covered = false;
  });
}

report.summary(
  check ? `${checked} files · ${literals} stated literal(s) · ${problems.length} problem(s)` : `${checked} files formatted · ${problems.length} problem(s) left`,
  problems,
);
if (check && problems.length) report.detail(report.dim('run `make css`, and by hand whatever it could not fix'));
process.exit(problems.length ? 1 : 0);
