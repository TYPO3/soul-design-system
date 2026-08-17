#!/usr/bin/env node
/* Produce the exact upload plan, in the order it must be executed.

   An agent performs the upload and must not work out what to push, or in what
   order. Neither is a preference:
     1. sentinel   fences the app's manifest machinery while we write
     2. writes     everything the build produces (idempotent, so full)
     3. deletes    remote files this build no longer produces
     4. sentinel   re-armed, so the app rebuilds its manifest on next open
     5. anchor     last, because it vouches for all of the above
     6. verify     the sentinel read back, because its write fails silently
   Before any of it, `preflight`: the target is a design system, or nothing is
   written — that type is fixed when a project is created.
*/
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ANCHOR_FILE, hashesOf, pathsOf } from './lib/anchor.ts';
import { GENERATED, ROOT } from './lib/cards.ts';
import { ELEMENTS_JS } from './lib/elements.ts';
import * as report from './lib/report.ts';

const BUILT = join(GENERATED, 'bundle/_ds_sync.json');
const ANCHOR = join(ROOT, '.design-sync/.cache/remote-sync.json');
const OUT = join(ROOT, '.design-sync/.cache/upload-plan.json');
const SENTINEL = '_ds_needs_recompile';

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

report.open('design-plan', 'the ordered upload plan, with deletes');

if (!existsSync(BUILT)) {
  report.summary('no build here', ['run `make build` first']);
  process.exit(1);
}
const local = JSON.parse(readFileSync(BUILT, 'utf8'));
if (!local.fileHashes) {
  report.summary('the build knows no file list', ['run `make build` with the current build.ts']);
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
const localPaths = pathsOf(local);
const content = localPaths.filter((f) => f !== SENTINEL && f !== ANCHOR_FILE);

/* The app overwrites `_ds_bundle.js` with a stub of its own after every upload,
   so the anchor's record of what was sent is never what the project holds. It
   is the one file a hash comparison must not be trusted about. */
const ALWAYS = new Set([ '_ds_bundle.js' ]);

/* Deletes need the previous file list. Without a cached anchor we cannot
   know what is up there, so we say so instead of guessing — an unfounded
   delete is worse than a missed one. */
let deletes: string[] = [];
let deletable = true;
let moved: string[] | null = null;
if (existsSync(ANCHOR)) {
  const remote = JSON.parse(readFileSync(ANCHOR, 'utf8'));
  const remotePaths = pathsOf(remote);
  if (remotePaths.length) {
    const have = new Set<string>(localPaths);
    deletes = remotePaths.filter((f) => !have.has(f)).sort();
  } else {
    deletable = false; // anchor predates file tracking
  }
  /* Only what moved, and only against an anchor that hashed every file: it is
     written last precisely so that finding it means everything before it
     landed. An older anchor vouches for no content, so that sync sends all. */
  const was = hashesOf(remote);
  if (was) moved = content.filter((f) => ALWAYS.has(f) || was[f] !== local.fileHashes[f]);
} else {
  deletable = false;
}
const upload = moved ?? content;

/* Asked before anything is written, because it cannot be answered afterwards:
   the type is fixed when a project is created, so a push into an ordinary one
   lands every file and never becomes a design system. The symptom is a pane
   with nothing in it, which is what a lost sentinel looks like too. */
const preflight = projectId
  ? [{
      action: 'verify', why: 'the target must already be a design system — the type is fixed at creation',
      method: 'get_project', projectId,
      expect: { type: 'PROJECT_TYPE_DESIGN_SYSTEM', canEdit: true },
      onMismatch: 'stop, write nothing, and report it: an ordinary project cannot become a design system. Create one with create_project, then set it here with `make design-project ARGS="<new uuid> --force"`.',
    }]
  : [{
      action: 'create', why: 'no project id — create a NEW design system rather than reusing anything',
      method: 'create_project',
      then: 'report the new id and set it here: `make design-project ARGS=<uuid>`',
      note: 'never adopt an existing project for a first import: a fresh design system starts empty, so this upload is everything in it and nothing of the owner\'s is overwritten or deleted.',
    }];

const plan = {
  projectId,
  preflight,
  localDir: './.out/bundle',
  finalizePlan: {
    writes: ['components/**', 'screens/**', 'tokens/**', 'fonts/**', 'assets/**', 'guidelines/**',
      '_ds_bundle.js', ELEMENTS_JS, '_ds_bundle.css', '_specimen.css', 'styles.css', 'README.md',
      ANCHOR_FILE, SENTINEL],
    deletes: ['components/**', 'screens/**', 'tokens/**', 'fonts/**', 'assets/**', 'guidelines/**'],
  },
  steps: [
    { step: 1, action: 'write', why: 'sentinel fences the manifest machinery', files: [SENTINEL], ...SENTINEL_UPLOAD },
    /* The tool's own maximum is 256 files and a call of exactly that answers
       HTTP 500 — it is the count and not the payload, since 23 files carrying
       2.4 MB go through. A 500 here is answered by resizing, never by stopping. */
    {
      step: 2, action: 'write', files: upload,
      why: `${moved ? 'the files this build moved' : 'all content'}, chunked at <=100 files and <=2 MB`,
    },
    { step: 3, action: 'delete', why: 'files this build no longer produces', paths: deletes },
    { step: 4, action: 'write', why: 'sentinel re-armed so the app rebuilds its manifest', files: [SENTINEL], ...SENTINEL_UPLOAD },
    { step: 5, action: 'write', why: 'the anchor vouches for everything above — always last', files: [ANCHOR_FILE] },
    /* The one write whose failure is silent, read back before anybody is told
       the sync worked. An extensionless upload can answer `written: 1` and put
       nothing there, and a pane with no manifest shows no cards at all — which
       reads as a broken design system rather than a missing 24 bytes. */
    {
      step: 6, action: 'verify', why: 'a write count is not proof — read the sentinel back',
      method: 'get_file', path: SENTINEL,
      onMissing: `404 means the sync did not land: re-run step 4 with the mimeType above, then reopen the design system in the app. Do not report a sync as complete without this file.`,
    },
  ],
  afterUpload: 'make design-synced',
};

mkdirSync(join(ROOT, '.design-sync/.cache'), { recursive: true });
writeFileSync(OUT, JSON.stringify(plan, null, 2));

report.align([{ name: '', label: 'the order it uploads in' }]);
report.fact('written to', '.design-sync/.cache/upload-plan.json');
report.fact('project', projectId ?? '(none set — see below)');
report.fact('before it writes', projectId
  ? 'get_project — the target is a design system, or nothing is written'
  : 'create_project — there is no target yet');
report.fact('the order it uploads in', `1 sentinel · 2 ${upload.length} files · 3 ${deletes.length} deletes · 4 sentinel · 5 anchor · 6 read the sentinel back`);
if (moved) report.fact('held back', `${content.length - upload.length} file(s) already at the uploaded state`);
if (deletes.length) {
  report.fact('to delete', `${deletes.slice(0, 6).join(', ')}${deletes.length > 6 ? `, … (+${deletes.length - 6})` : ''}`);
}
if (!projectId) {
  report.note('with no project id every sync creates a new project instead of updating the one that is there');
  report.detail('the anchor, the deletes and the whole update path hang on it. Set it once:');
  report.detail('export SDS_DESIGN_PROJECT=<uuid>');
  report.detail('or .design-sync/config.local.json  {"projectId": "<uuid>"}');
  report.detail('No project yet? `/design-sync` creates one and names the id.');
}
if (!deletable) {
  report.note('no reference state with a file list — deletes were NOT computed');
  report.detail('Fetch the anchor from the project and run again:');
  report.detail('DesignSync get_file  _ds_sync.json  ->  .design-sync/.cache/remote-sync.json');
  report.detail('If it carries no "fileHashes" (an upload from before this change), hold list_files against the build once.');
}
if (!moved) {
  report.note('the reference state hashes no files \u2014 every file is uploaded this once');
  report.detail('An anchor written before per-file hashes can say what is up there, not what is in it.');
}
report.fact('after a successful upload', 'make design-synced');
report.summary(`${upload.length} files \u00b7 ${deletes.length} deletes`);
