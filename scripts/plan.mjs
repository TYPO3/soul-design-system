#!/usr/bin/env node
/* Produce the exact upload plan, in the order it must be executed.

   The upload itself needs the DesignSync tool and a claude.ai login, so an
   agent performs it — but it must not have to work out *what* to push or in
   *what order*. Both are mechanical, and improvising them is how the last
   sync left 19 renamed font files orphaned in the project and a manifest
   describing an upload that no longer existed.

   The order is not a style preference:
     1. sentinel   fences the app's manifest machinery while we write
     2. writes     everything the build produces (idempotent, so full)
     3. deletes    remote files this build no longer produces
     4. sentinel   re-armed, so the app rebuilds its manifest on next open
     5. anchor     last, because it vouches for all of the above

   Writes `.design-sync/.cache/upload-plan.json` and prints a summary.

     npm run plan
*/
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from './lib/cards.mjs';

const BUILT = join(ROOT, 'ds-bundle/_ds_sync.json');
const ANCHOR = join(ROOT, '.design-sync/.cache/remote-sync.json');
const OUT = join(ROOT, '.design-sync/.cache/upload-plan.json');
const SENTINEL = '_ds_needs_recompile';
const ANCHOR_FILE = '_ds_sync.json';

if (!existsSync(BUILT)) {
  console.log('Kein Build vorhanden — `npm run build` zuerst.');
  process.exit(1);
}
const local = JSON.parse(readFileSync(BUILT, 'utf8'));
if (!local.files) {
  console.log('Der Build kennt keine Dateiliste — `npm run build` mit der aktuellen build.mjs.');
  process.exit(1);
}

const projectId = existsSync(join(ROOT, '.design-sync/config.json'))
  ? JSON.parse(readFileSync(join(ROOT, '.design-sync/config.json'), 'utf8')).projectId
  : null;

/* Content files: everything except the two that carry their own step. */
const content = local.files.filter((f) => f !== SENTINEL && f !== ANCHOR_FILE);

/* Deletes need the previous file list. Without a cached anchor we cannot
   know what is up there, so we say so instead of guessing — an unfounded
   delete is worse than a missed one. */
let deletes = [];
let deletable = true;
if (existsSync(ANCHOR)) {
  const remote = JSON.parse(readFileSync(ANCHOR, 'utf8'));
  if (Array.isArray(remote.files)) {
    const have = new Set(local.files);
    deletes = remote.files.filter((f) => !have.has(f)).sort();
  } else {
    deletable = false; // anchor predates file tracking
  }
} else {
  deletable = false;
}

const plan = {
  projectId,
  localDir: './ds-bundle',
  finalizePlan: {
    writes: ['components/**', 'tokens/**', 'fonts/**', 'assets/**', 'guidelines/**',
      '_ds_bundle.js', '_ds_bundle.css', '_specimen.css', 'styles.css', 'README.md',
      ANCHOR_FILE, SENTINEL],
    deletes: ['components/**', 'tokens/**', 'fonts/**', 'assets/**', 'guidelines/**'],
  },
  steps: [
    { step: 1, action: 'write', why: 'sentinel fences the manifest machinery', files: [SENTINEL] },
    { step: 2, action: 'write', why: 'all content, chunked at <=256 files', files: content },
    { step: 3, action: 'delete', why: 'files this build no longer produces', paths: deletes },
    { step: 4, action: 'write', why: 'sentinel re-armed so the app rebuilds its manifest', files: [SENTINEL] },
    { step: 5, action: 'write', why: 'the anchor vouches for everything above — always last', files: [ANCHOR_FILE] },
  ],
  afterUpload: 'npm run synced',
};

mkdirSync(join(ROOT, '.design-sync/.cache'), { recursive: true });
writeFileSync(OUT, JSON.stringify(plan, null, 2));

console.log(`Upload-Plan → .design-sync/.cache/upload-plan.json`);
console.log(`  Projekt:  ${projectId ?? '(keines in config.json)'}`);
console.log(`  1 Sentinel  ·  2 ${content.length} Dateien  ·  3 ${deletes.length} Löschungen  ·  4 Sentinel  ·  5 Anker`);
if (deletes.length) {
  console.log(`  zu löschen: ${deletes.slice(0, 6).join(', ')}${deletes.length > 6 ? `, … (+${deletes.length - 6})` : ''}`);
}
if (!deletable) {
  console.log('  ! Kein Referenzstand mit Dateiliste — Löschungen konnten nicht berechnet werden.');
  console.log('    /design-sync muss die Projektdateien einmal selbst abgleichen.');
}
console.log('\nNach erfolgreichem Upload:  npm run synced');
