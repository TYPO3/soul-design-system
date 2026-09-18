#!/usr/bin/env node
/* Record that the current build is what the project now holds.

   Run this immediately after a successful upload, and only then. It promotes
   the record and the index that were just pushed to the local cache, which is
   what `make design-status` and `make design-plan` compare against. Skip it
   and both still answer from the previous upload — with confidence, and
   wrong. It consumes the uploads in flight: their ids are in the record.

     make design-synced
*/
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import { ANCHOR_FILE, INDEX_FILE, pathsOf } from './lib/anchor.ts';
import { GENERATED, ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

const BUILT = join(GENERATED, 'bundle', ANCHOR_FILE);
const INDEX = join(GENERATED, 'bundle', INDEX_FILE);
const CACHE = join(ROOT, '.design-sync/.cache/remote-sync.json');
const CACHED_INDEX = join(ROOT, '.design-sync/.cache/remote-index.json');
const UPLOADED = join(ROOT, '.design-sync/.cache/uploads.jsonl');

report.open('design-synced', 'record that the uploaded system holds this build');

if (!existsSync(BUILT)) {
  report.summary('no build here — nothing to record', ['run `make build` first']);
  process.exit(1);
}
mkdirSync(join(ROOT, '.design-sync/.cache'), { recursive: true });
copyFileSync(BUILT, CACHE);
copyFileSync(INDEX, CACHED_INDEX);
rmSync(UPLOADED, { force: true });

const a = JSON.parse(readFileSync(CACHE, 'utf8'));
report.fact('`make design-status` compares against this state from now on');
report.summary(`${Object.keys(a.renderHashes).length} sections \u00b7 ${pathsOf(a).length} files recorded as uploaded`);
