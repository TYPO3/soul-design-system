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

     make plan
*/
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from './lib/cards.ts';

const BUILT = join(ROOT, 'ds-bundle/_ds_sync.json');
const ANCHOR = join(ROOT, '.design-sync/.cache/remote-sync.json');
const OUT = join(ROOT, '.design-sync/.cache/upload-plan.json');
const SENTINEL = '_ds_needs_recompile';
const ANCHOR_FILE = '_ds_sync.json';

/* The sentinel has no file extension, and that is enough to lose it.

   Uploaded the ordinary way — `localPath`, no `mimeType` — `write_files`
   answers `written: 1` and the file is not there afterwards: `list_files`
   omits it and `get_file` 404s. Nothing fails, so a sync looks complete
   while the one file whose whole job is to say "recompile" never arrives,
   and the pane keeps serving the manifest it built last time. That is
   exactly how an upload of 160 current files sat behind a card index six
   hours old.

   Naming the type explicitly makes it stick. It is passed inline rather
   than from disk for the same reason: 24 bytes need no file, and the
   content is the same every time. */
const SENTINEL_UPLOAD = {
  mimeType: 'text/plain',
  data: JSON.stringify({ by: 'design-sync-cli' }),
  note: 'inline with an explicit mimeType — an extensionless localPath upload is dropped silently',
};

if (!existsSync(BUILT)) {
  console.log('Kein Build vorhanden — `make build` zuerst.');
  process.exit(1);
}
const local = JSON.parse(readFileSync(BUILT, 'utf8'));
if (!local.files) {
  console.log('Der Build kennt keine Dateiliste — `make build` mit der aktuellen build.ts.');
  process.exit(1);
}

const projectId = existsSync(join(ROOT, '.design-sync/config.json'))
  ? JSON.parse(readFileSync(join(ROOT, '.design-sync/config.json'), 'utf8')).projectId
  : null;

/* Content files: everything except the two that carry their own step. */
const content = (local.files as string[]).filter((f) => f !== SENTINEL && f !== ANCHOR_FILE);

/* Deletes need the previous file list. Without a cached anchor we cannot
   know what is up there, so we say so instead of guessing — an unfounded
   delete is worse than a missed one. */
let deletes: string[] = [];
let deletable = true;
if (existsSync(ANCHOR)) {
  const remote = JSON.parse(readFileSync(ANCHOR, 'utf8'));
  if (Array.isArray(remote.files)) {
    const have = new Set<string>(local.files);
    deletes = (remote.files as string[]).filter((f) => !have.has(f)).sort();
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
    writes: ['components/**', 'screens/**', 'tokens/**', 'fonts/**', 'assets/**', 'guidelines/**',
      '_ds_bundle.js', '_ds_bundle.css', '_specimen.css', 'styles.css', 'README.md',
      ANCHOR_FILE, SENTINEL],
    deletes: ['components/**', 'screens/**', 'tokens/**', 'fonts/**', 'assets/**', 'guidelines/**'],
  },
  steps: [
    { step: 1, action: 'write', why: 'sentinel fences the manifest machinery', files: [SENTINEL], ...SENTINEL_UPLOAD },
    { step: 2, action: 'write', why: 'all content, chunked at <=256 files', files: content },
    { step: 3, action: 'delete', why: 'files this build no longer produces', paths: deletes },
    { step: 4, action: 'write', why: 'sentinel re-armed so the app rebuilds its manifest', files: [SENTINEL], ...SENTINEL_UPLOAD },
    { step: 5, action: 'write', why: 'the anchor vouches for everything above — always last', files: [ANCHOR_FILE] },
  ],
  afterUpload: 'make synced',
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
  console.log('  ! Kein Referenzstand mit Dateiliste — Löschungen wurden NICHT berechnet.');
  console.log('    Hol den Anker aus dem Projekt und lauf noch einmal:');
  console.log('      DesignSync get_file  _ds_sync.json');
  console.log('      -> .design-sync/.cache/remote-sync.json');
  console.log('    Trägt er kein "files" (Upload vor dieser Änderung), einmalig');
  console.log('    list_files gegen den Build halten.');
}
console.log('\nNach erfolgreichem Upload:  make synced');
