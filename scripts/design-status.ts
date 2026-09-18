#!/usr/bin/env node
/* What does a sync change?

   Compares the fresh `project/sync.json` against the record of the last
   upload. That is the file the design system itself stores, a hash per
   guideline section, per layout and per element. So the answer is "what
   moved" rather than "which files did I touch".
   With no cached record it prints what a first upload pushes and exits 0.

     make design-status
*/
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ANCHOR_FILE } from './lib/anchor.ts';
import { GENERATED, ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

const BUILT = join(GENERATED, 'bundle', ANCHOR_FILE);
const ANCHOR = join(ROOT, '.design-sync/.cache/remote-sync.json');

report.open('design-status', 'what a sync changes');

if (!existsSync(BUILT)) {
  report.summary('no build here', ['run `make build` first']);
  process.exit(1);
}
const local = JSON.parse(readFileSync(BUILT, 'utf8'));
const sections = Object.keys(local.renderHashes).sort();

if (!existsSync(ANCHOR)) {
  report.note('no record cached — the plan reads the real state from the system and uploads only what changed');
  report.summary(`${sections.length} sections go up, all of them`);
  process.exit(0);
}

const remote = JSON.parse(readFileSync(ANCHOR, 'utf8'));
const was = remote.renderHashes ?? {};
const added = sections.filter((n) => !(n in was));
const changed = sections.filter((n) => n in was && was[n] !== local.renderHashes[n]);
const removed = Object.keys(was).filter((n) => !(n in local.renderHashes)).sort();
const styling = remote.styleSha !== local.styleSha;

/* Layouts ship with the system and are what a consuming project seeds from,
   so a changed layout is a changed upload. An anchor from before their hashes
   has no `screenHashes` at all. Treat that as "unknown", not as "unchanged",
   or the first sync after this lands reports nothing. */
const wasScreens = remote.screenHashes as Record<string, string> | undefined;
const nowScreens = (local.screenHashes ?? {}) as Record<string, string>;
const screensChanged = wasScreens
  ? Object.keys(nowScreens).filter((n) => wasScreens[n] !== nowScreens[n]).sort()
  : Object.keys(nowScreens).sort();

/* An element's contract is what the agent gets as the component API, so a
   moved property is a moved upload. An anchor from before their hashes is
   unknown rather than unchanged, same as the screens above. */
const wasElements = remote.elementHashes as Record<string, string> | undefined;
const nowElements = (local.elementHashes ?? {}) as Record<string, string>;
const elementsChanged = wasElements
  ? Object.keys(nowElements).filter((n) => wasElements[n] !== nowElements[n]).sort()
  : Object.keys(nowElements).sort();

/* Everything the rows above do not already speak for. The tokens, the
   fonts, the guidelines, the README that holds the conventions header, and
   every picture the index names. A hash of the token names alone stood here
   once, and all of it changed unseen by the record. */
const SPOKEN_FOR = /^project\/components\/[^/]+\/preview\.html$/;
const wasFiles = remote.fileHashes as Record<string, string> | undefined;
const nowFiles = (local.fileHashes ?? {}) as Record<string, string>;
const wasUploads = (remote.uploads ?? {}) as Record<string, { sha: string }>;
const nowUploads = (local.uploads ?? {}) as Record<string, { sha: string }>;
const otherChanged = [
  ...Object.keys(nowFiles).filter((f) => !SPOKEN_FOR.test(f) && (!wasFiles || wasFiles[f] !== nowFiles[f])),
  ...Object.keys(nowUploads).filter((f) => wasUploads[f]?.sha !== nowUploads[f]!.sha).map((f) => `project/${f}`),
].sort();

/* One row per top directory rather than six hundred paths. The answer wanted
   here is which part of the system moved, and the plan holds the list. */
const byArea = new Map<string, number>();
for (const f of otherChanged) {
  const rel = f.replace(/^project\//, '');
  const area = rel.includes('/') ? rel.slice(0, rel.indexOf('/')) : rel;
  byArea.set(area, (byArea.get(area) ?? 0) + 1);
}

if (!added.length && !changed.length && !removed.length && !styling && !screensChanged.length
  && !elementsChanged.length && !otherChanged.length) {
  report.summary(`nothing to do — every one of the ${sections.length} sections is at the uploaded state`);
  process.exit(0);
}

const MOVED = [
  ['sections added', added],
  ['sections changed', changed],
  ['sections removed', removed],
  ['layouts changed', screensChanged],
  ['elements changed', elementsChanged],
] as const;
report.align([...MOVED.map(([label]) => ({ name: label, label })),
  { name: 'other files changed', label: 'other files changed' }]);
for (const [label, names] of MOVED) {
  if (names.length) report.fact(label, `${names.length}: ${names.join(', ')}`);
}
if (otherChanged.length) {
  report.fact('other files changed',
    `${otherChanged.length}: ${[...byArea].map(([a, n]) => `${a} ${n}`).join(', ')}`);
}
if (styling) report.note('tokens or components changed — this reaches every rendered design');
report.fact('next', 'make design-plan, then the plan in Claude Code');
report.summary(`${added.length + changed.length + removed.length + screensChanged.length
  + elementsChanged.length + otherChanged.length} thing(s) would move`);
