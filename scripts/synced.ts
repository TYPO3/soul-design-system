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
import * as report from './lib/report.ts';

const BUILT = join(GENERATED, 'bundle/_ds_sync.json');
const CACHE = join(ROOT, '.design-sync/.cache/remote-sync.json');

report.open('synced', 'record that the project holds this build');

if (!existsSync(BUILT)) {
  report.summary('no build here — nothing to record', ['run `make build` first']);
  process.exit(1);
}
mkdirSync(join(ROOT, '.design-sync/.cache'), { recursive: true });
copyFileSync(BUILT, CACHE);

const a = JSON.parse(readFileSync(CACHE, 'utf8'));
report.fact('`make status` compares against this state from now on');
report.summary(`${Object.keys(a.renderHashes).length} cards \u00b7 ${a.files?.length ?? '?'} files recorded as uploaded`);
