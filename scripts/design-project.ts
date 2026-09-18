#!/usr/bin/env node
/* Which Design System artifact a sync uploads into, and how to set it.

   The artifact's URL is what makes a second sync an update rather than a
   second system. The shell cannot look it up, as the Artifact tool works
   through a claude.ai login. So this owns everything else: which source
   answered, that the URL looks like one, and where it lives.

     make design-project               # which design system a sync would upload into
     make design-project ARGS=<url>    # set it; add --force to replace one
     make design-project ARGS=--forget # forget it and the cached state, for a new one
*/
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

const LOCAL = join(ROOT, '.design-sync/config.local.json');
const COMMITTED = join(ROOT, '.design-sync/config.json');
/* What a clone knows about one design system, and all of it. The URL it
   uploads into, the record of what that one holds, the index, the plan and
   the ids of the uploads in flight. The screenshots beside them are the
   visual review's and are not this task's. */
const CACHE = join(ROOT, '.design-sync/.cache');
const STATE = ['remote-sync.json', 'remote-index.json', 'upload-plan.json', 'uploads.jsonl'].map((f) => join(CACHE, f));
const URL_SHAPE = /^https:\/\/claude\.ai\/(?:code\/)?artifact\/[A-Za-z0-9-]+$/;
const ENV = 'SDS_DESIGN_SYSTEM';

const readUrl = (file: string): string | null => {
  if (!existsSync(file)) return null;
  return (JSON.parse(readFileSync(file, 'utf8')).url as string | undefined) ?? null;
};

/* The same order `scripts/design-plan.ts` reads them in, and the reason this
   task exists as a reader too. A stale export explains a sync that landed
   somewhere else, and nothing else in the tree says which source won. */
const SOURCES = [
  [ENV, 'the environment', process.env[ENV] ?? null],
  ['.design-sync/config.local.json', 'this clone, untracked', readUrl(LOCAL)],
  ['.design-sync/config.json', 'committed — a fork can keep one here', readUrl(COMMITTED)],
] as const;

/* One sentence to paste into Claude Code, which does the whole of it. The
   URL lives behind a claude.ai login this task cannot reach. The agent that
   can also has a shell, so nobody has to copy a link by hand. */
function howToGetOne(): void {
  report.detail('Paste this into Claude Code, in this checkout:');
  report.detail('  List my artifacts of the type "Design System" with their links. If exactly one');
  report.detail('  is mine, run `make design-project ARGS=<its link>` here; otherwise show me');
  report.detail('  the list first.');
  report.detail('Nothing uploaded yet? The plan says how to make one, and reports its link.');
}

report.open('design-project', 'which design system a sync uploads into');
report.align(SOURCES.map(([name, what]) => ({ name, label: what })));

const args = process.argv.slice(2);
const force = args.includes('--force');
const given = args.find((a) => !a.startsWith('--'));

/* Back to a clone that has never synced. The URL and the record have to go
   together. Kept, the record describes the old system and the next plan
   removes files from a new one against a list it never had. */
if (args.includes('--forget')) {
  const kept = existsSync(LOCAL) ? JSON.parse(readFileSync(LOCAL, 'utf8')) : {};
  const { url: dropped, ...rest } = kept;
  if (existsSync(LOCAL)) {
    if (Object.keys(rest).length) writeFileSync(LOCAL, `${JSON.stringify(rest, null, 2)}\n`);
    else rmSync(LOCAL);
  }
  for (const f of STATE) rmSync(f, { force: true });
  report.fact('forgotten', dropped ? String(dropped) : '(there was no link)');
  report.fact('cleared', 'the cached record, the index, the plan and the uploads in flight');
  if (process.env[ENV]) {
    report.note(`${ENV} still stands in this shell and outranks the file — unset it`);
  }
  report.fact('next', 'make design-sync — the plan makes a new design system, then make design-project ARGS=<its link>');
  report.summary('this clone has never synced anything');
  process.exit(0);
}

if (given) {
  if (!URL_SHAPE.test(given)) {
    report.bad(`"${given}" is not an artifact link`);
    report.detail('A link reads https://claude.ai/artifact/<id>.');
    howToGetOne();
    /* The problem goes in so the verdict fails. `shown` because it stands
       above — a task that exits 1 under a green tick is a lie. */
    report.summary('nothing written', [`"${given}" is not an artifact link`], { shown: true });
    process.exit(1);
  }
  /* A clone that already names a design system keeps it. Whoever asks for this
     is usually an agent that acts on a list it just read. A silent reassignment
     points the next sync at somebody else's system, over a link this clone got
     on purpose. A change is a decision, so it comes out loud. */
  const current = readUrl(LOCAL);
  if (current && current !== given && !force) {
    report.bad(`this clone already uploads into ${current}`);
    report.detail(`Leave it, or say so: make design-project ARGS="${given} --force"`);
    report.summary('nothing written', ['a different design system already stands here'], { shown: true });
    process.exit(1);
  }
  const kept = existsSync(LOCAL) ? JSON.parse(readFileSync(LOCAL, 'utf8')) : {};
  mkdirSync(join(ROOT, '.design-sync'), { recursive: true });
  writeFileSync(LOCAL, `${JSON.stringify({ ...kept, url: given }, null, 2)}\n`);
  report.fact('written to', '.design-sync/config.local.json');
  report.fact('design system', given);
  /* An export outranks the file just written. That is a sync that lands in a
     system the reader did not name and no other output explains. */
  const env = process.env[ENV];
  if (env && env !== given) {
    report.note(`${ENV} is ${env} and wins over the file — unset it, or export the new link`);
  }
  report.fact('next', 'make design-sync');
  report.summary('this clone now names the design system');
  process.exit(0);
}

for (const [name, what, url] of SOURCES) {
  report.row(url ? 'ok' : 'skip', name, what, url ?? '—');
}

const winner = SOURCES.find(([, , url]) => url);
if (!winner) {
  report.note('no link anywhere — every sync makes a new design system instead of an update to one');
  howToGetOne();
  report.summary('no design system set', ['no artifact link in the environment or either config'], { shown: true });
  process.exit(1);
}
report.summary(`a sync uploads into ${winner[2]} — from ${winner[0]}`);
