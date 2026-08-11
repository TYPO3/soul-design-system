#!/usr/bin/env node
/* Format the theme's PHP against the coding standard.

     make php                    fix the sources
     make php ARGS=--check       report and change nothing — what the gate runs
     make php ARGS="--check --diff"   and show what would change

   The renderer is the one part of this repository written in another
   language, and it is the one part nothing was holding to a shape: the
   TypeScript has a typecheck and the CSS has the class check, while a PHP
   file was whatever the last hand left behind. The ruleset is
   `typo3/coding-standards`, declared in `guides-theme/.php-cs-fixer.dist.php`
   — see there for why it is that list and not one written here.

   Fixing is the default and checking is the flag, the same way round as
   `cards.ts` and `dist.ts`: the tool that can repair the drift should not
   have to be asked twice.

   The fixer is a dev dependency of the theme, so it lives in a `vendor/`
   that is gitignored and may not exist yet. Installing it here on first run
   costs a few seconds once and saves a clone from failing the gate with a
   missing file, which is what `guides.ts` does with the renderer for the
   same reason. Anything not recognised here is handed to the fixer. */
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

/* `--show-progress=none` because this is read from a log as often as from a
   terminal, and a progress bar written into one is a wall of block
   characters around the sentence that matters.

   No cache, in either direction. The cache is a file the fixer keeps beside
   the sources, gitignored, and nothing outside it can invalidate it: a run
   against a ruleset newer than the one that wrote it hands back files it
   never opened as clean. That is a gate green here and red on a fresh clone,
   which is the one thing a gate may not be — and fixing inherits the same
   blindness, so the repair for a drift the check finally reports would do
   nothing. Fifteen files take a tenth of a second; there is nothing to buy. */
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
