#!/usr/bin/env node
/* The suite: Vitest first, then Playwright, each with its own reporter.

   Vitest runs what lives inside a story or a frame: the stories themselves,
   one test per story and theme, and the `.test.ts` files under `tests/`.
   Playwright runs what needs a server: the `.spec.ts` files. A path names
   the runner that owns it, so `make test ARGS=tests/parity.spec.ts` starts
   no browser it does not need. Without a path both run, and both must pass.

   `--grep` is Playwright's word; Vitest calls the same thing `-t`. One
   flag reaches both. */
import { spawnSync } from 'node:child_process';
import * as report from './lib/report.ts';

const files: string[] = [];
const flags: string[] = [];
for (let i = 0; i < process.argv.slice(2).length; i++) {
  const arg = process.argv[i + 2] as string;
  if (!arg.startsWith('-')) files.push(arg);
  else if (arg === '--grep' || arg === '-g') flags.push('--grep', process.argv[++i + 2] ?? '');
  else flags.push(arg);
}

const owner = (file: string): 'vitest' | 'playwright' => (/\.spec\.ts$/.test(file) ? 'playwright' : 'vitest');
const RUNNERS = {
  vitest: {
    label: 'the stories, and the tests in a frame',
    cmd: ['node_modules/.bin/vitest', 'run', ...flags.map((f) => (f === '--grep' ? '-t' : f))],
  },
  playwright: {
    label: 'the tests against a server',
    cmd: ['node_modules/.bin/playwright', 'test', ...flags],
  },
} as const;

const wanted = new Set(files.length ? files.map(owner) : (['vitest', 'playwright'] as const));

report.open('test', 'the suite');
const failed: string[] = [];
for (const name of ['vitest', 'playwright'] as const) {
  if (!wanted.has(name)) continue;
  const runner = RUNNERS[name];
  const own = files.filter((f) => owner(f) === name);
  report.fact(`${name} · ${runner.label}`);
  console.log();
  const r = spawnSync(runner.cmd[0] as string, [...runner.cmd.slice(1), ...own], { stdio: 'inherit' });
  console.log();
  if (r.status !== 0) failed.push(name);
}

report.close(failed.length ? 'bad' : 'ok', failed.length ? `${failed.join(' and ')} failed` : 'the suite is green');
process.exit(failed.length ? 1 : 0);
