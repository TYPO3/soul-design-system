#!/usr/bin/env node
/* What would a sync change?

   Compares the freshly built `_ds_sync.json` against the anchor of the last
   upload — the file the design project itself stores, a hash per card, so the
   answer is "which cards moved" rather than "which files did I touch". With no
   cached anchor it prints what a first upload would push and exits 0.

     make design-status
*/
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { GENERATED, ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

const BUILT = join(GENERATED, 'bundle/_ds_sync.json');
const ANCHOR = join(ROOT, '.design-sync/.cache/remote-sync.json');

report.open('design-status', 'what a sync would change');

if (!existsSync(BUILT)) {
  report.summary('no build here', ['run `make build` first']);
  process.exit(1);
}
const local = JSON.parse(readFileSync(BUILT, 'utf8'));
const cards = Object.keys(local.renderHashes).sort();

if (!existsSync(ANCHOR)) {
  report.note('no reference state cached — /design-sync reads the real state from the project and uploads only what changed');
  report.summary(`${cards.length} cards would be uploaded, all of them`);
  process.exit(0);
}

const remote = JSON.parse(readFileSync(ANCHOR, 'utf8'));
const was = remote.renderHashes ?? {};
const added = cards.filter((n) => !(n in was));
const changed = cards.filter((n) => n in was && was[n] !== local.renderHashes[n]);
const removed = Object.keys(was).filter((n) => !(n in local.renderHashes)).sort();
const styling = remote.styleSha !== local.styleSha;

/* Screens ship with the system and are what a consuming project seeds from,
   so a changed screen is a changed upload. An anchor from before they were
   hashed has no `screenHashes` at all — treat that as "unknown", not as
   "unchanged", or the first sync after this lands would report nothing. */
const wasScreens = remote.screenHashes as Record<string, string> | undefined;
const nowScreens = (local.screenHashes ?? {}) as Record<string, string>;
const screensChanged = wasScreens
  ? Object.keys(nowScreens).filter((n) => wasScreens[n] !== nowScreens[n]).sort()
  : Object.keys(nowScreens).sort();

if (!added.length && !changed.length && !removed.length && !styling && !screensChanged.length) {
  report.summary(`nothing to do — every one of the ${cards.length} cards is at the uploaded state`);
  process.exit(0);
}

const MOVED = [
  ['added', added],
  ['changed', changed],
  ['removed', removed],
  ['screens changed', screensChanged],
] as const;
report.align(MOVED.map(([label]) => ({ name: label, label })));
for (const [label, names] of MOVED) {
  if (names.length) report.fact(label, `${names.length}: ${names.join(', ')}`);
}
if (styling) report.note('tokens or components changed — this reaches every rendered design');
report.fact('next, in Claude Code', '/design-sync');
report.summary(`${added.length + changed.length + removed.length + screensChanged.length} card(s) would move`);
