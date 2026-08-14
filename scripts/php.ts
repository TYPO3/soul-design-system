#!/usr/bin/env node
/* Format the theme's PHP against the coding standard.

     make php                    fix the sources
     make php ARGS=--check       report and change nothing — what the gate runs
     make php ARGS="--check --diff"   and show what would change

   The renderer is the one part of this repository written in another language,
   and the one part nothing else holds to a shape. The ruleset is
   `typo3/coding-standards`, in `packages/guides-theme/.php-cs-fixer.dist.php`. The fixer
   lives in a gitignored `vendor/` and is installed on first run. */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

const THEME = join(ROOT, 'packages', 'guides-theme');
const FIXER = join(THEME, 'vendor', 'bin', 'php-cs-fixer');

const args = process.argv.slice(2);
const check = args.includes('--check');
const passthrough = args.filter((a) => a !== '--check');

report.open('php', check ? 'the theme’s sources against the coding standard' : 'format the theme’s sources');

if (!existsSync(FIXER)) {
  report.fact('installing the fixer', 'first run only');
  const install = spawnSync('composer', ['install', '--no-interaction', '--no-progress'], { cwd: THEME, encoding: 'utf8' });
  if (install.status !== 0) {
    report.summary('the fixer could not be installed', `${install.stdout ?? ''}${install.stderr ?? ''}`.split('\n').filter(Boolean));
    process.exit(install.status ?? 1);
  }
}

/* `--show-progress=none`, because this is read from a log as often as from a
   terminal and a progress bar there is a wall of block characters. No cache
   either way: the cache is gitignored and nothing outside it can invalidate it,
   so a run against a newer ruleset hands back files it never opened as clean —
   green here and red on a fresh clone, which is what a gate may not be. */
const fix = spawnSync(FIXER, [
  'fix',
  '--no-interaction',
  '--show-progress=none',
  '--using-cache=no',
  ...(check ? ['--dry-run'] : []),
  ...passthrough,
], { cwd: THEME, encoding: 'utf8' });

/* The fixer says "Found 3 of 46 files", and lists them numbered. Only those
   two things are read: everything else it prints is about the fixer, and a
   gate that quotes its host tool teaches the wrong vocabulary. */
const out = `${fix.stdout ?? ''}\n${fix.stderr ?? ''}`;
const files = out.split('\n').filter((l) => /^\s+\d+\) /.test(l)).map((l) => l.trim().replace(/^\d+\)\s*/, ''));
const total = /Found \d+ of (\d+) files/.exec(out)?.[1] ?? '?';

if (fix.status !== 0 && !files.length) {
  report.summary('the fixer did not run', out.split('\n').filter(Boolean));
  process.exit(fix.status ?? 1);
}
report.summary(
  check ? `${files.length} of ${total} files off the standard` : `${files.length} of ${total} files reformatted`,
  check ? files : [],
);
if (check && files.length) report.detail(report.dim('run `make php`, or `make php ARGS="--check --diff"` to see what it would do'));
process.exit(check && files.length ? 1 : 0);
