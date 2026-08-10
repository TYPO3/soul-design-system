#!/usr/bin/env node
/* Build the publishable package — ESM modules plus their types.

   The repo itself needs no build: Node runs the `.ts` sources directly by
   stripping types, and that is what keeps the tooling plain. A *published*
   package cannot rely on that, because a consumer's bundler resolves `.js`
   and wants `.d.ts`. So this step exists for `npm publish` and for nothing
   else — `make storybook`, `verify`, `cards` and Storybook all keep working
   against `src/` with no `dist/` present at all.

   `lit` stays external. Bundling it would give every consumer a private copy
   of Lit's reactive-element registry, and two copies mean two registries and
   an element that upgrades under one of them: it is a peer dependency for
   the same reason React always is.

     make dist
*/
import { rmSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import * as esbuild from 'esbuild';

import { ROOT } from './lib/cards.ts';

const OUT = join(ROOT, 'dist');

/** Every .d.ts under a directory. */
function* walkDts(dir: string): Generator<string> {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walkDts(p);
    else if (e.name.endsWith('.d.ts')) yield p;
  }
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

/* One ESM file. The components are small and import each other; splitting
   them would only give a consumer more requests for the same bytes, and the
   entry registers every element anyway. */
const bundle = await esbuild.build({
  entryPoints: [join(ROOT, 'src', 'index.ts')],
  outfile: join(OUT, 'index.js'),
  bundle: true,
  format: 'esm',
  target: 'es2022',
  external: ['lit', 'lit/*'],
  sourcemap: true,
  metafile: true,
});

/* Types come from tsc, which needs its own config: the repo's tsconfig is
   `noEmit` and allows `.ts` import specifiers, and neither is publishable.
   `rewriteRelativeImportExtensions` turns those specifiers into `.js` on the
   way out, which is what lets one set of sources serve both Node's stripper
   and a published package. */
const tsconfig = {
  extends: '../tsconfig.json',
  compilerOptions: {
    noEmit: false,
    declaration: true,
    emitDeclarationOnly: true,
    rewriteRelativeImportExtensions: true,
    allowImportingTsExtensions: true,
    /* Both explicit: with the config inside dist/, tsc would otherwise
       infer the root as dist/ and reject every source above it. */
    rootDir: '..',
    outDir: 'types',
  },
  include: ['../src/**/*.ts'],
};
/* Written into dist/ rather than the repo root: it is generated, it is only
   meaningful next to the output it describes, and a root full of generated
   config is how a root stops being readable. */
const cfgPath = join(OUT, 'tsconfig.json');
writeFileSync(cfgPath, `${JSON.stringify(tsconfig, null, 2)}\n`);

const tsc = spawnSync(
  process.execPath,
  [join(ROOT, 'node_modules/typescript/bin/tsc'), '-p', cfgPath],
  { encoding: 'utf8' },
);
if (tsc.status !== 0) {
  process.stdout.write(tsc.stdout ?? '');
  process.stderr.write(tsc.stderr ?? '');
  console.error('✗ declaration build failed');
  process.exit(1);
}

/* The sources import each other with explicit `.ts` specifiers, which is what
   lets one set of files serve Node's type stripper and Vite alike. A
   published `.d.ts` must not carry them: a consumer's TypeScript resolves
   `./lib/element.js` to `./lib/element.d.ts` and would reject the `.ts`
   spelling outright. Rewritten here rather than trusted to
   `rewriteRelativeImportExtensions`, which does not reach declaration emit. */
let rewritten = 0;
for (const file of walkDts(join(OUT, 'types'))) {
  const before = readFileSync(file, 'utf8');
  const after = before.replace(/(from\s+['"])(\.[^'"]*?)\.ts(['"])/g, '$1$2.js$3');
  if (after !== before) {
    writeFileSync(file, after);
    rewritten++;
  }
}

const bytes = readFileSync(join(OUT, 'index.js')).length;
const modules = Object.keys(bundle.metafile.inputs).length;
console.log(`dist/index.js — ${(bytes / 1024).toFixed(1)} kB from ${modules} modules, lit external`);
console.log(`dist/types/  — declarations, ${rewritten} rewritten to .js specifiers`);
