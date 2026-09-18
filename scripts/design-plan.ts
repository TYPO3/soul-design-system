#!/usr/bin/env node
/* Produce the exact upload plan, in the order it must run.

   An agent with the Artifact tool does the upload and must not work out what
   to push, or in what order. Neither is a preference, and every step below
   carries its own `why`. The uploads go first because the previews and the
   index name their ids, and the index goes last because it vouches for
   everything before it.
*/
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ANCHOR_FILE, INDEX_FILE, hashesOf, pathsOf, uploadsOf, type Anchor } from './lib/anchor.ts';
import { GENERATED, ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

const BUNDLE = join(GENERATED, 'bundle');
const BUILT = join(BUNDLE, ANCHOR_FILE);
const ANCHOR = join(ROOT, '.design-sync/.cache/remote-sync.json');
const OUT = join(ROOT, '.design-sync/.cache/upload-plan.json');
const CONFIG = JSON.parse(readFileSync(join(ROOT, '.design-sync/config.json'), 'utf8')) as { title: string };

/* The tool takes 256 paths and 16 MiB a call. Under both, with room. */
const PATHS_PER_CALL = 200;
const BYTES_PER_CALL = 12 * 1024 * 1024;

report.open('design-plan', 'the ordered upload plan, with removals');

if (!existsSync(BUILT)) {
  report.summary('no build here', ['run `make build` first']);
  process.exit(1);
}
const local = JSON.parse(readFileSync(BUILT, 'utf8')) as Anchor;
if (!local.fileHashes || !local.uploads) {
  report.summary('the build knows no file list', ['run `make build` with the current build.ts']);
  process.exit(1);
}

/* Which artifact this pushes to is yours, not the repository's. The link
   makes the *second* sync land where the first did, and without one every
   run makes a fresh system. Three places, in order: the environment, an
   untracked local config, the committed one. */
function readUrl(): string | null {
  const fromEnv = process.env['SDS_DESIGN_SYSTEM'];
  if (fromEnv) return fromEnv;
  for (const name of ['config.local.json', 'config.json']) {
    const p = join(ROOT, '.design-sync', name);
    if (!existsSync(p)) continue;
    const url = JSON.parse(readFileSync(p, 'utf8')).url as string | undefined;
    if (url) return url;
  }
  return null;
}

const url = readUrl();
const remote: Anchor | null = existsSync(ANCHOR) ? JSON.parse(readFileSync(ANCHOR, 'utf8')) : null;

/* Uploads: every picture the store has no id for yet. A changed file is a
   new upload; the old blob stays, since nothing here removes one. */
const known = remote ? uploadsOf(remote) : {};
const uploads = Object.entries(local.uploads)
  .filter(([path, rec]) => !rec.blob && known[path]?.sha !== rec.sha)
  .map(([path, rec]) => ({ path, file_path: `project/${path}`, bytes: rec.bytes, type: rec.type }));
const orphaned = Object.keys(known).filter((p) => !(p in local.uploads!)).sort();

/* Files: what moved, against a record that hashed every file. Without one
   every file goes up this once. A pending preview always goes: the index
   step rewrites it with the ids the uploads above bring back. */
const localPaths = pathsOf(local);
const content = localPaths.filter((f) => f !== INDEX_FILE && f !== ANCHOR_FILE);
const was = remote ? hashesOf(remote) : null;
const pending = new Set((local.pending ?? []).map((p) => `project/${p}`));
const moved = was ? content.filter((f) => pending.has(f) || was[f] !== local.fileHashes![f]) : content;
const removed = remote ? pathsOf(remote).filter((f) => !localPaths.includes(f)).sort() : [];

/* Chunked by count and by bytes, the removals in the first call. A type
   file is not a served type: it goes as text, as the migrated systems have it. */
type Entry = string | null | { from: string; contentType: string };
interface Call {
  file_path: string;
  files: Record<string, Entry>;
}
const entry = (f: string): Entry => (f.endsWith('.d.ts') ? { from: f, contentType: 'text/plain' } : f);
const calls: Call[] = [];
let current: Record<string, Entry> = {};
let count = 0;
let bytes = 0;
const flush = (): void => {
  const first = Object.keys(current).find((k) => current[k] !== null);
  if (first) calls.push({ file_path: first, files: current });
  current = {};
  count = 0;
  bytes = 0;
};
for (const f of removed) {
  current[f] = null;
  count++;
}
for (const f of moved) {
  const size = statSync(join(BUNDLE, f)).size;
  if (count >= PATHS_PER_CALL || bytes + size > BYTES_PER_CALL) flush();
  current[f] = entry(f);
  count++;
  bytes += size;
}
if (count) flush();

/* Asked before any write, because there is no answer afterwards. A publish
   into an artifact of another type lands every file and never becomes a
   design system. */
const preflight = url
  ? [
      {
        action: 'read', why: 'the record of what the system holds — a fresh clone has no copy, and this is the authority',
        call: { action: 'read', url, path: ANCHOR_FILE }, saveTo: '.design-sync/.cache/remote-sync.json',
        onMissing: 'a first upload into this system: the plan holds no removals, and every file goes up',
        then: 'if the cache had no copy before, run `make design-plan` again: the plan below knows nothing of it',
      },
      {
        action: 'read', why: 'the index goes back with every key the page wrote kept',
        call: { action: 'read', url, path: INDEX_FILE }, saveTo: '.design-sync/.cache/remote-index.json',
        onMissing: 'an empty system: the build\'s own index is the first',
        onForeign: 'an index without a `createdOnFiles` or `convertedFrom` key is not a design system — stop and say so',
      },
      {
        action: 'list', why: 'a publish replaces only a path this session has seen',
        call: { action: 'list', scope: 'files', url },
      },
    ]
  : [{
      action: 'create', why: 'no link — make a NEW design system from the type rather than reuse anything',
      call: { action: 'list', scope: 'types', type_query: 'Design System' },
      then: `publish with that type_url, title "${CONFIG.title}", auto_open "after_first_write" and no files; then \`make design-project ARGS=<the new url>\` and \`make design-plan\` again`,
      note: 'never adopt an existing artifact for a first import. A fresh system starts empty, so this upload is everything in it and touches nothing of the owner\'s.',
    }];

const plan = {
  url,
  checkout: 'the absolute path of this checkout on the machine that runs the Artifact tool — every file_path below is under it',
  root: '.out/bundle',
  preflight,
  steps: [
    {
      step: 1, action: 'upload', why: 'every picture the store has no id for — the previews and the index name these ids',
      each: 'Artifact publish with `url`, `asset: true` and `file_path` = <checkout>/.out/bundle/<file_path>; the result names the blob as `/_blob/<id>`',
      record: '.design-sync/.cache/uploads.jsonl — append one line per upload: {"path": "<path>", "blob": "<id>"}',
      files: uploads,
    },
    {
      step: 2, action: 'run', why: 'writes the ids into the pending previews, the index and the record, and sets lastChange',
      cmd: 'make design-index',
    },
    {
      step: 3, action: 'publish', why: `${was ? 'the files this build moved' : 'all content'}, with the removals in the first call — each call: \`url\`, \`root\` = <checkout>/.out/bundle, \`file_path\` = <checkout>/.out/bundle/<file_path>, \`files\` as given`,
      calls,
    },
    {
      step: 4, action: 'publish', why: 'the index and the record last — their presence means everything above landed',
      call: { file_path: INDEX_FILE, files: { [INDEX_FILE]: INDEX_FILE, [ANCHOR_FILE]: ANCHOR_FILE } },
    },
    {
      step: 5, action: 'verify', why: 'a publish result is not proof — read the index back',
      call: { action: 'read', url, path: INDEX_FILE },
      expect: 'lastChange.at is the value `make design-index` printed',
    },
  ],
  afterUpload: 'make design-synced',
};

mkdirSync(join(ROOT, '.design-sync/.cache'), { recursive: true });
writeFileSync(OUT, JSON.stringify(plan, null, 2));

report.align([{ name: '', label: 'the order it uploads in' }]);
report.fact('written to', '.design-sync/.cache/upload-plan.json');
report.fact('design system', url ?? '(none set — see below)');
report.fact('before it writes', url
  ? 'read the record and the index back, list the files'
  : 'make a new design system from the type — there is no target yet');
report.fact('the order it uploads in', `1 ${uploads.length} uploads · 2 make design-index · 3 ${moved.length} files in ${calls.length} call(s), ${removed.length} removals · 4 index · 5 read back`);
if (was) report.fact('held back', `${content.length - moved.length} file(s) already at the uploaded state`);
if (removed.length) {
  report.fact('to remove', `${removed.slice(0, 6).join(', ')}${removed.length > 6 ? `, … (+${removed.length - 6})` : ''}`);
}
if (orphaned.length) report.note(`${orphaned.length} upload(s) the build no longer makes leave the index; the blobs stay in the store`);
if (!url) {
  report.note('with no link every sync makes a new design system instead of an update to the one that is there');
  report.detail('Set it once:');
  report.detail('export SDS_DESIGN_SYSTEM=<url>');
  report.detail('or .design-sync/config.local.json  {"url": "<url>"}');
}
if (!remote) {
  report.note('no record of what the system holds — the plan has NO removals and every file goes up');
  report.detail('The preflight fetches it. Then run `make design-plan` again.');
}
report.fact('after a successful upload', 'make design-synced');
report.summary(`${uploads.length} uploads · ${moved.length} files · ${removed.length} removals`);
