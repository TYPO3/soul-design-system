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

let same = 0, changed = 0, missing = 0;
for (const n of names) {
  const a = join(A, n), b = join(B, n);
  if (!existsSync(a)) { console.log(`  NEW      ${n}`); missing++; continue; }
  if (!existsSync(b)) { console.log(`  DROPPED  ${n}`); missing++; continue; }
  const ia = PNG.sync.read(readFileSync(a));
  const ib = PNG.sync.read(readFileSync(b));
  if (ia.width !== ib.width || ia.height !== ib.height) {
    console.log(`  RESIZED  ${n}  ${ia.width}x${ia.height} -> ${ib.width}x${ib.height}`);
    changed++;
    continue;
  }
  const out = new PNG({ width: ia.width, height: ia.height });
  /* Exact. Everything renders in the container now — same Chromium, same
     fonts, same machine — and two consecutive runs of all 38 cards differ by
     zero pixels, so there is no antialiasing noise to absorb.

     The old 0.1 was not a small allowance. Changing `--text-muted` from
     #6E6860 to #878076 moves 2143 pixels on one card and 0.1 reported none
     of them: a deliberate token change, invisible to the tool meant to catch
     exactly that. If this ever turns noisy, raise it knowing what it costs —
     0.05 already misses a third of that change. */
  const n_diff = pixelmatch(ia.data, ib.data, out.data, ia.width, ia.height, { threshold: 0 });
  if (n_diff === 0) { same++; continue; }
  const pct = (100 * n_diff) / (ia.width * ia.height);
  console.log(`  CHANGED  ${n}  ${pct.toFixed(2)}% of pixels (${n_diff})`);
  changed++;
  if (write) writeFileSync(join(OUT, basename(n)), PNG.sync.write(out));
}
console.log(`\n${same} identical, ${changed} changed, ${missing} missing`);
