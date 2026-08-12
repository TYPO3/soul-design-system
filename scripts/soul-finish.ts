#!/usr/bin/env node
/* The step after the renderer, for a project that has only Composer.

   `vendor/bin/guides` writes documents; this turns them into the site. It is
   built into the drop-in as `soul-finish.js` — one file, no dependencies to
   install, run with the Node that is on every CI image anyway:

     node path/to/dist/soul-finish.js site

   It copies itself no further than the four files and two directories a page
   links, draws every element ahead of the browser so the page reads with the
   script switched off, writes the index the bar searches, and refuses a
   reference that leaves the output. `scripts/lib/site.ts` is all four, and
   `make guides` calls the same functions — a documented step that drifts from
   the one we run is worse than no documented step. */
import { existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { finish } from './lib/site.ts';

const argv = process.argv.slice(2);
const flag = (name: string): string | undefined =>
  argv.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');

if (argv.includes('--help') || argv.length === 0) {
  console.log(`
  node soul-finish.js <output-dir> [options]

  Finishes a site rendered by phpdocumentor/guides with the Soul theme.

    --drop-in=<dir>   where the stylesheets and the script are
                      (default: beside this file)
    --no-drop-in      the output already has them
    --styles=<name>   what the directory is called at the site root
                      (default: styles — the theme links this name)
    --search=<name>   the index the bar fetches (default: _search.json)
    --no-search       write no index; the field then finds nothing
`);
  process.exit(argv.length === 0 ? 1 : 0);
}

const root = resolve(argv[0] as string);
if (!existsSync(root) || !statSync(root).isDirectory()) {
  console.error(`✗ ${root} is not a directory — render the documents first`);
  process.exit(1);
}

/* Beside this file, because the drop-in is what this file is shipped in: a
   consumer who copied the directory has the stylesheets by having this. */
const drop = argv.includes('--no-drop-in')
  ? undefined
  : resolve(flag('drop-in') ?? dirname(fileURLToPath(import.meta.url)));

const { drawn, indexed, broken } = finish(root, {
  drop,
  styles: flag('styles'),
  search: argv.includes('--no-search') ? false : flag('search'),
});

if (broken.length) {
  console.error(`\n✗ ${broken.length} reference(s) do not resolve inside ${root}:`);
  for (const line of broken.slice(0, 12)) console.error(`  - ${line}`);
  console.error('\n  A site is published on its own. Anything pointing out of it is a page\n  with no stylesheet on the server, and no error anywhere.');
  process.exit(1);
}

console.log(`✓ ${drawn} page(s) carry their elements already rendered${indexed === null ? '' : `, ${indexed} indexed for search`}`);
