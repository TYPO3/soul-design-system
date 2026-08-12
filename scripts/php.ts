#!/usr/bin/env node
/* Format the theme's PHP against the coding standard.

     make php                    fix the sources
     make php ARGS=--check       report and change nothing — what the gate runs
     make php ARGS="--check --diff"   and show what would change

   The renderer is the one part of this repository written in another language,
   and the one part nothing else holds to a shape. The ruleset is
   `typo3/coding-standards`, in `guides-theme/.php-cs-fixer.dist.php`. The fixer
   lives in a gitignored `vendor/` and is installed on first run. */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { ROOT } from './lib/cards.ts';

const THEME = join(ROOT, 'guides-theme');
const FIXER = join(THEME, 'vendor', 'bin', 'php-cs-fixer');

const args = process.argv.slice(2);
const check = args.includes('--check');
const passthrough = args.filter((a) => a !== '--check');

if (!existsSync(FIXER)) {
  console.log('installing the fixer (first run only)');
  const install = spawnSync('composer', ['install', '--no-interaction', '--no-progress'], { cwd: THEME, stdio: 'inherit' });
  if (install.status !== 0) process.exit(install.status ?? 1);
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
], { cwd: THEME, stdio: 'inherit' });

if (check && fix.status !== 0) {
  console.log('\n   run `make php` to fix them, or `make php ARGS="--check --diff"` to see what it would do');
}
process.exit(fix.status ?? 1);
