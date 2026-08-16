#!/usr/bin/env node
/* Compare two screenshot dirs and report what moved.

     node scripts/diff.ts [baseline] [after]

   One line per card: identical, or the share of pixels that changed, and under
   a changed one the three files to open — before, after, and the mask marking
   what moved. A refactor meant to be neutral prints all-identical. */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import { GENERATED, ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const A = resolve(args[0] ?? join(ROOT, '.design-sync/.cache/baseline'));
const B = resolve(args[1] ?? join(ROOT, '.design-sync/.cache/after'));
/* The mask is this task's own output rather than the shots' — under `.out/`,
   where a reader looks for what a task wrote and `make clean` takes it. */
const OUT = join(GENERATED, 'diffs');
mkdirSync(OUT, { recursive: true });

/* Every path is printed from the root, because a reader opens it from there. */
const rel = (p: string): string => relative(ROOT, p) || p;
const where = (...paths: readonly string[]): void => report.detail(paths.map(rel).join('\n'));

const names = [...new Set([
  ...(existsSync(A) ? readdirSync(A) : []),
  ...(existsSync(B) ? readdirSync(B) : []),
])].filter((n) => n.endsWith('.png')).sort();

report.open('diff', 'compare the shots against the baseline');
report.align(names.map((n) => ({ name: 'DROPPED', label: n })));

let same = 0, changed = 0, missing = 0;
for (const n of names) {
  const a = join(A, n), b = join(B, n);
  if (!existsSync(a)) { report.row('warn', 'new', n); where(b); missing++; continue; }
  if (!existsSync(b)) { report.row('warn', 'dropped', n); where(a); missing++; continue; }
  const ia = PNG.sync.read(readFileSync(a));
  const ib = PNG.sync.read(readFileSync(b));
  if (ia.width !== ib.width || ia.height !== ib.height) {
    report.row('bad', 'resized', n, `${ia.width}x${ia.height} → ${ib.width}x${ib.height}`);
    where(a, b);
    changed++;
    continue;
  }
  const out = new PNG({ width: ia.width, height: ia.height });
  /* Exact comparison keeps small token changes visible; a tolerance can erase
     the change this command exists to expose. Some cards still drift between
     unchanged runs, so reproduce a change and fix its moving source rather
     than hiding it behind a threshold. */
  const n_diff = pixelmatch(ia.data, ib.data, out.data, ia.width, ia.height, { threshold: 0 });
  if (n_diff === 0) { same++; continue; }
  const pct = (100 * n_diff) / (ia.width * ia.height);
  const marked = join(OUT, basename(n));
  writeFileSync(marked, PNG.sync.write(out));
  report.row('bad', 'changed', n, `${pct.toFixed(2)}% of pixels (${n_diff})`);
  where(a, b, marked);
  changed++;
}
report.summary(`${same} identical \u00b7 ${changed} changed \u00b7 ${missing} missing`);
