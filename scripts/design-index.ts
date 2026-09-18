#!/usr/bin/env node
/* Write the ids the uploads came back with into everything that names them.

   Runs between the uploads and the file publish. The store gives a picture
   its id only on upload. Three things carry that id: the index, the record,
   and every preview that shows a picture too big to inline. This fills all
   three from `.design-sync/.cache/uploads.jsonl`, merges the index over the
   one the system holds, and stamps `lastChange`.

     make design-index
*/
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ANCHOR_FILE, INDEX_FILE, type Anchor } from './lib/anchor.ts';
import { GENERATED, ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

const BUNDLE = join(GENERATED, 'bundle');
const CACHE = join(ROOT, '.design-sync/.cache');
const UPLOADED = join(CACHE, 'uploads.jsonl');
const REMOTE_INDEX = join(CACHE, 'remote-index.json');
const PLAN = join(CACHE, 'upload-plan.json');

const sha12 = (b: string | Buffer): string => createHash('sha256').update(b).digest('hex').slice(0, 12);

interface AssetRecord {
  name: string;
  blob: string | null;
  size: number;
  type: string;
}
interface AssetGroup {
  name: string;
  tile?: string;
  order: string[];
  files: Record<string, AssetRecord>;
}
type Index = Record<string, unknown> & { groups?: string[]; assetGroups?: Record<string, AssetGroup> };

report.open('design-index', 'the ids of the uploads, written into the previews, the index and the record');

const anchorPath = join(BUNDLE, ANCHOR_FILE);
const indexPath = join(BUNDLE, INDEX_FILE);
if (!existsSync(anchorPath) || !existsSync(indexPath)) {
  report.summary('no build here', ['run `make build` first']);
  process.exit(1);
}
const anchor = JSON.parse(readFileSync(anchorPath, 'utf8')) as Required<Anchor>;
const built = JSON.parse(readFileSync(indexPath, 'utf8')) as Index;

/* One line per upload, appended by whoever ran it. A line for a path the
   build does not know is an upload of somebody else's and stays out. */
const ids = new Map<string, string>();
if (existsSync(UPLOADED)) {
  for (const line of readFileSync(UPLOADED, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    const rec = JSON.parse(line) as { path: string; blob: string };
    if (rec.path in anchor.uploads && rec.blob) ids.set(rec.path, rec.blob.replace(/^\/?_blob\//, ''));
  }
}
for (const [path, rec] of Object.entries(anchor.uploads)) {
  const id = ids.get(path);
  if (id) rec.blob = id;
}
const missing = Object.entries(anchor.uploads).filter(([, rec]) => !rec.blob).map(([path]) => path).sort();
if (missing.length) {
  report.summary(`${missing.length} upload(s) have no id`, [
    ...missing.slice(0, 12),
    ...(missing.length > 12 ? [`… (+${missing.length - 12})`] : []),
    'run step 1 of the plan for these, then this task again',
  ]);
  process.exit(1);
}

// the previews that named an upload
let rewritten = 0;
for (const rel of anchor.pending ?? []) {
  const file = join(BUNDLE, 'project', rel);
  const before = readFileSync(file, 'utf8');
  const after = before.replace(/\{\{upload:([^}]+)\}\}/g, (whole, path: string) => {
    const blob = anchor.uploads[path]?.blob;
    return blob ? `_blob/${blob}` : whole;
  });
  if (after.includes('{{upload:')) {
    report.summary(`${rel} still names an upload with no id`);
    process.exit(1);
  }
  writeFileSync(file, after);
  anchor.fileHashes[`project/${rel}`] = sha12(after);
  rewritten++;
}
anchor.pending = [];

/* The index: the system's own, with this build's groups written over it.
   The build's groups are the ones its uploads name: this task writes over
   the built index, and a second run reads its own work back. A
   group the page holds and the build does not know stays when a person
   added it: it holds a blob the build never uploaded. A group of known
   blobs is the build's own from before, and goes. */
const remote: Index | null = existsSync(REMOTE_INDEX) ? JSON.parse(readFileSync(REMOTE_INDEX, 'utf8')) : null;
const index: Index = remote ? { ...remote } : built;
if (remote) {
  const ours = new Set(Object.values(anchor.uploads).map((rec) => rec.blob));
  const builtGroups = [...new Set(Object.keys(anchor.uploads).map((p) => p.split('/')[1] ?? ''))];
  const theirsToo = (name: string): boolean => {
    const group = remote.assetGroups?.[name];
    return !!group && Object.values(group.files).some((rec) => rec.blob && !ours.has(rec.blob));
  };
  const kept = (remote.groups ?? []).filter((name) => builtGroups.includes(name) || theirsToo(name));
  index.groups = [...new Set([...kept, ...builtGroups])];
  const assetGroups: Record<string, AssetGroup> = Object.fromEntries(
    Object.entries(remote.assetGroups ?? {}).filter(([name]) => index.groups!.includes(name)),
  );
  for (const [name, group] of Object.entries(built.assetGroups ?? {})) {
    if (!builtGroups.includes(name)) continue;
    const theirs = assetGroups[name];
    assetGroups[name] = theirs
      ? { ...theirs, ...group, order: [...new Set([...group.order, ...theirs.order])], files: { ...theirs.files, ...group.files } }
      : group;
  }
  index.assetGroups = assetGroups;
  index.namespace = built.namespace;
  index.libraries = built.libraries;
}
for (const group of Object.values(index.assetGroups ?? {})) {
  for (const rec of Object.values(group.files)) {
    const path = `assets/${group.name}/${rec.name}`;
    const blob = anchor.uploads[path]?.blob;
    if (blob) rec.blob = blob;
  }
}

const user = spawnSync('git', ['config', 'user.name'], { encoding: 'utf8' }).stdout?.trim();
const plan = existsSync(PLAN) ? JSON.parse(readFileSync(PLAN, 'utf8')) as { steps: { files?: unknown[]; calls?: unknown[] }[] } : null;
const at = new Date().toISOString();
index.lastChange = {
  by: user || 'Claude',
  at,
  via: 'Claude Code · make design-sync',
  note: plan
    ? `synced from the repository: ${(plan.steps[0]?.files ?? []).length} uploads, ${plan.steps[2]?.calls ? 'files in ' + (plan.steps[2].calls as unknown[]).length + ' call(s)' : 'no files'}`
    : 'synced from the repository',
};

writeFileSync(indexPath, JSON.stringify(index, null, 2));
writeFileSync(anchorPath, JSON.stringify(anchor, null, 2));

report.fact('ids written', `${ids.size} from uploads.jsonl`);
report.fact('previews rewritten', String(rewritten));
report.fact('index', remote ? 'merged over the one the system holds' : 'the build\'s own — no remote index cached');
report.fact('lastChange.at', at);
report.summary(`${Object.keys(anchor.uploads).length} uploads named · ${rewritten} previews rewritten`);
