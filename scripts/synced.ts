#!/usr/bin/env node
/* Record that the current build is what the project now holds.

   Run this immediately after a successful upload, and only then. It promotes
   the anchor that was just pushed to the local cache, which is what `npm run
   status` and `make plan` compare against. Skip it and both keep
   answering from the previous upload — confidently and wrongly.

     make synced
*/
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { GENERATED, ROOT } from './lib/cards.ts';

const BUILT = join(GENERATED, 'bundle/_ds_sync.json');
const CACHE = join(ROOT, '.design-sync/.cache/remote-sync.json');

if (!existsSync(BUILT)) {
  console.log('Kein Build vorhanden — nichts zu vermerken.');
  process.exit(1);
}
mkdirSync(join(ROOT, '.design-sync/.cache'), { recursive: true });
copyFileSync(BUILT, CACHE);

const a = JSON.parse(readFileSync(CACHE, 'utf8'));
console.log(`Vermerkt: ${Object.keys(a.renderHashes).length} Karten, ${a.files?.length ?? '?'} Dateien sind hochgeladen.`);
console.log('  `make status` vergleicht ab jetzt gegen diesen Stand.');
