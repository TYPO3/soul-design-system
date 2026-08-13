#!/usr/bin/env node
/* Produce the exact upload plan, in the order it must be executed.

   An agent performs the upload and must not work out what to push, or in what
   order. Neither is a preference:
     1. sentinel   fences the app's manifest machinery while we write
     2. writes     everything the build produces (idempotent, so full)
     3. deletes    remote files this build no longer produces
     4. sentinel   re-armed, so the app rebuilds its manifest on next open
     5. anchor     last, because it vouches for all of the above
*/
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { GENERATED, ROOT } from './lib/cards.ts';

const BUILT = join(GENERATED, 'bundle/_ds_sync.json');
const ANCHOR = join(ROOT, '.design-sync/.cache/remote-sync.json');
const OUT = join(ROOT, '.design-sync/.cache/upload-plan.json');
const SENTINEL = '_ds_needs_recompile';
const ANCHOR_FILE = '_ds_sync.json';

/* The sentinel has no file extension, and that is enough to lose it: uploaded
   the ordinary way `write_files` answers `written: 1` and the file is not there
   afterwards. Nothing fails, so a sync looks complete while the one file whose
   job is to say "recompile" never arrives. Naming the type explicitly makes it
   stick, and it is passed inline — the content is the same every time. */
const SENTINEL_UPLOAD = {
  mimeType: 'text/plain',
  data: JSON.stringify({ by: 'design-sync-cli' }),
  note: 'inline with an explicit mimeType — an extensionless localPath upload is dropped silently',
};

if (!existsSync(BUILT)) {
  console.log('No build here — run `make build` first.');
  process.exit(1);
}
const local = JSON.parse(readFileSync(BUILT, 'utf8'));
if (!local.files) {
  console.log('The build knows no file list — run `make build` with the current build.ts.');
  process.exit(1);
}

/* Which project this pushes to is yours, not the repository's: the id makes the
   *second* sync land where the first did, and without one every run is a fresh
   project. Not a credential, but per-person, so a clone does not inherit
   somebody else's. Three places, in order: the environment, an untracked local
   config, the committed one. */
function readProjectId(): string | null {
  const fromEnv = process.env['SDS_DESIGN_PROJECT'];
  if (fromEnv) return fromEnv;
  for (const name of ['config.local.json', 'config.json']) {
    const p = join(ROOT, '.design-sync', name);
    if (!existsSync(p)) continue;
    const id = JSON.parse(readFileSync(p, 'utf8')).projectId as string | undefined;
    if (id) return id;
  }
  return null;
}

const projectId = readProjectId();

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
  localDir: './.out/bundle',
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

console.log(`Upload plan → .design-sync/.cache/upload-plan.json`);
console.log(`  Project:  ${projectId ?? '(none set — see below)'}`);
console.log(`  1 sentinel  ·  2 ${content.length} files  ·  3 ${deletes.length} deletes  ·  4 sentinel  ·  5 anchor`);
if (deletes.length) {
  console.log(`  to delete: ${deletes.slice(0, 6).join(', ')}${deletes.length > 6 ? `, … (+${deletes.length - 6})` : ''}`);
}
if (!projectId) {
  console.log('  ! With no project id every sync creates a new project instead of');
  console.log('    updating the one that is there — the anchor, the deletes and the');
  console.log('    whole update path hang on it. Set it once, and every further');
  console.log('    sync lands in the same project:');
  console.log('      export SDS_DESIGN_PROJECT=<uuid>');
  console.log('      or .design-sync/config.local.json  {"projectId": "<uuid>"}');
  console.log('    No project yet? `/design-sync` creates one and names the id.');
}
if (!deletable) {
  console.log('  ! No reference state with a file list — deletes were NOT computed.');
  console.log('    Fetch the anchor from the project and run again:');
  console.log('      DesignSync get_file  _ds_sync.json');
  console.log('      -> .design-sync/.cache/remote-sync.json');
  console.log('    If it carries no "files" (an upload from before this change),');
  console.log('    hold list_files against the build once.');
}
console.log('\nAfter a successful upload:  make synced');
