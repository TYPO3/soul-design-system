#!/usr/bin/env node
/* Compare two screenshot dirs and report what moved.

     node scripts/diff.ts [baseline] [after] [--write-diffs]

   Prints one line per card: identical, or the share of pixels that changed.
   A refactor meant to be visually neutral should print all-identical;
   anything else is a change to look at on purpose. */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import { ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const write = process.argv.includes('--write-diffs');
const A = resolve(args[0] ?? join(ROOT, '.design-sync/.cache/baseline'));
const B = resolve(args[1] ?? join(ROOT, '.design-sync/.cache/after'));
const OUT = join(B, '..', 'diffs');
if (write) mkdirSync(OUT, { recursive: true });

const names = [...new Set([
  ...(existsSync(A) ? readdirSync(A) : []),
  ...(existsSync(B) ? readdirSync(B) : []),
])].filter((n) => n.endsWith('.png')).sort();

report.open('diff', 'compare the shots against the baseline');
report.align(names.map((n) => ({ name: 'DROPPED', label: n })));

let same = 0, changed = 0, missing = 0;
for (const n of names) {
  const a = join(A, n), b = join(B, n);
  if (!existsSync(a)) { report.row('warn', 'new', n); missing++; continue; }
  if (!existsSync(b)) { report.row('warn', 'dropped', n); missing++; continue; }
  const ia = PNG.sync.read(readFileSync(a));
  const ib = PNG.sync.read(readFileSync(b));
  if (ia.width !== ib.width || ia.height !== ib.height) {
    report.row('bad', 'resized', n, `${ia.width}x${ia.height} → ${ib.width}x${ib.height}`);
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
  report.row('bad', 'changed', n, `${pct.toFixed(2)}% of pixels (${n_diff})`);
  changed++;
  if (write) writeFileSync(join(OUT, basename(n)), PNG.sync.write(out));
}
report.summary(`${same} identical \u00b7 ${changed} changed \u00b7 ${missing} missing`);
