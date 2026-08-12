#!/usr/bin/env node
/* What would a sync change?

   Compares the freshly built `_ds_sync.json` against the anchor of the last
   upload — the file the design project itself stores, a hash per card, so the
   answer is "which cards moved" rather than "which files did I touch". With no
   cached anchor it prints what a first upload would push and exits 0.

     make status
*/
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from './lib/cards.ts';

const BUILT = join(ROOT, 'ds-bundle/_ds_sync.json');
const ANCHOR = join(ROOT, '.design-sync/.cache/remote-sync.json');

if (!existsSync(BUILT)) {
  console.log('Kein Build vorhanden — `make build` zuerst.');
  process.exit(1);
}
const local = JSON.parse(readFileSync(BUILT, 'utf8'));
const cards = Object.keys(local.renderHashes).sort();

if (!existsSync(ANCHOR)) {
  console.log(`Kein Referenzstand zwischengespeichert.`);
  console.log(`  ${cards.length} Karten würden hochgeladen (alles).`);
  console.log(`  /design-sync holt den echten Stand aus dem Projekt und lädt nur Geändertes hoch.`);
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
  console.log(`Nichts zu tun — alle ${cards.length} Karten sind auf dem hochgeladenen Stand.`);
  process.exit(0);
}

const list = (label: string, names: readonly string[]): void => {
  if (!names.length) return;
  console.log(`  ${label} (${names.length}): ${names.join(', ')}`);
};
console.log('Ein Sync würde ändern:');
list('neu', added);
list('geändert', changed);
list('entfernt', removed);
list('Screens geändert', screensChanged);
if (styling) console.log('  Styling: tokens/components geändert — betrifft jedes gerenderte Design');
console.log('\nJetzt in Claude Code:  /design-sync');
