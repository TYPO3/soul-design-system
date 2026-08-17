#!/usr/bin/env node
/* Which design system at claude.ai/design a sync uploads into, and how to set it.

   The app addresses an uploaded system by a project id, and that id is what makes
   a second sync an update rather than a second system. The shell cannot look it
   up — the API authorises a claude.ai login — so this owns everything else:
   which source answered, that the id looks like one, and where it is kept.

     make design-project               # which design system a sync would upload into
     make design-project ARGS=<uuid>   # set it; add --force to replace one
     make design-project ARGS=--forget # forget it and the cached state, for a new one
*/
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

const LOCAL = join(ROOT, '.design-sync/config.local.json');
const COMMITTED = join(ROOT, '.design-sync/config.json');
/* What a clone knows about one design system, and all of it: the id it uploads
   into, the record of what that one holds, and the plan written against both.
   The screenshots beside them are the visual review's and are not this task's. */
const ANCHOR = join(ROOT, '.design-sync/.cache/remote-sync.json');
const PLAN = join(ROOT, '.design-sync/.cache/upload-plan.json');
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const readId = (file: string): string | null => {
  if (!existsSync(file)) return null;
  return (JSON.parse(readFileSync(file, 'utf8')).projectId as string | undefined) ?? null;
};

/* The same order `scripts/design-plan.ts` reads them in, and the reason this task
   exists as a reader too: a stale export explains a sync that landed
   somewhere else, and nothing else in the tree says which source won. */
const SOURCES = [
  ['SDS_DESIGN_PROJECT', 'the environment', process.env['SDS_DESIGN_PROJECT'] ?? null],
  ['.design-sync/config.local.json', 'this clone, untracked', readId(LOCAL)],
  ['.design-sync/config.json', 'committed — a fork may keep one here', readId(COMMITTED)],
] as const;

/* One sentence to paste into Claude Code, which does the whole of it: the id
   lives behind a claude.ai login this task cannot reach, and the agent that
   can also has a shell — so nobody has to copy a uuid by hand. */
function howToGetOne(): void {
  report.detail('Paste this into Claude Code, in this checkout:');
  report.detail('  List my claude.ai design systems with their project ids. If exactly one');
  report.detail('  is mine, run `make design-project ARGS=<its id>` here; otherwise show me');
  report.detail('  the list first.');
  report.detail('Nothing uploaded yet? /design-sync creates a system and reports its id.');
}

report.open('design-project', 'which design system a sync uploads into');
report.align(SOURCES.map(([name, what]) => ({ name, label: what })));

const args = process.argv.slice(2);
const force = args.includes('--force');
const given = args.find((a) => !a.startsWith('--'));

/* Back to a clone that has never synced. The id and the anchor have to go
   together: kept, the anchor describes the old system and the next plan deletes
   files from a new one against a list it never had. */
if (args.includes('--forget')) {
  const kept = existsSync(LOCAL) ? JSON.parse(readFileSync(LOCAL, 'utf8')) : {};
  const { projectId: dropped, ...rest } = kept;
  if (existsSync(LOCAL)) {
    if (Object.keys(rest).length) writeFileSync(LOCAL, `${JSON.stringify(rest, null, 2)}\n`);
    else rmSync(LOCAL);
  }
  for (const f of [ANCHOR, PLAN]) rmSync(f, { force: true });
  report.fact('forgotten', dropped ? String(dropped) : '(no id was set)');
  report.fact('cleared', 'the cached anchor and the upload plan');
  if (process.env['SDS_DESIGN_PROJECT']) {
    report.note('SDS_DESIGN_PROJECT is still set in this shell and outranks the file — unset it');
  }
  report.fact('next', '/design-sync creates a new design system, then make design-project ARGS=<its id>');
  report.summary('this clone has never synced anything');
  process.exit(0);
}

if (given) {
  if (!UUID.test(given)) {
    report.bad(`"${given}" is not a project id`);
    report.detail('An id is a uuid, e.g. 0189a4c1-6f2e-4b7a-9c31-2d8f5e0a7b64.');
    howToGetOne();
    /* The problem is passed so the verdict fails, and `shown` because it was
       printed above — a task that exits 1 under a green tick is a lie. */
    report.summary('nothing written', [`"${given}" is not a project id`], { shown: true });
    process.exit(1);
  }
  /* A clone that already names a design system keeps it. Whoever asks for this
     is usually an agent acting on a list it just read, and a silent reassignment
     points the next sync at somebody else's system — over an id this clone was
     deliberately given. Changing one is a decision, so it is said out loud. */
  const current = readId(LOCAL);
  if (current && current !== given && !force) {
    report.bad(`this clone already uploads into ${current}`);
    report.detail(`Leave it, or say so: make design-project ARGS="${given} --force"`);
    report.summary('nothing written', ['a different project id is already set here'], { shown: true });
    process.exit(1);
  }
  const kept = existsSync(LOCAL) ? JSON.parse(readFileSync(LOCAL, 'utf8')) : {};
  mkdirSync(join(ROOT, '.design-sync'), { recursive: true });
  writeFileSync(LOCAL, `${JSON.stringify({ ...kept, projectId: given }, null, 2)}\n`);
  report.fact('written to', '.design-sync/config.local.json');
  report.fact('design system', given);
  /* An export outranks the file that was just written, which is a sync landing
     in a project the reader did not name and no other output explains. */
  const env = process.env['SDS_DESIGN_PROJECT'];
  if (env && env !== given) {
    report.note(`SDS_DESIGN_PROJECT is ${env} and wins over the file — unset it, or export the new id`);
  }
  report.fact('next', 'make design-sync');
  report.summary('the project is set for this clone');
  process.exit(0);
}

for (const [name, what, id] of SOURCES) {
  report.row(id ? 'ok' : 'skip', name, what, id ?? '—');
}

const winner = SOURCES.find(([, , id]) => id);
if (!winner) {
  report.note('no project id anywhere — every sync would create a new design system instead of updating one');
  howToGetOne();
  report.summary('no project set', ['no project id in the environment or either config'], { shown: true });
  process.exit(1);
}
report.summary(`a sync uploads into ${winner[2]} — from ${winner[0]}`);
