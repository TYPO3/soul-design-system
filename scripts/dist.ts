#!/usr/bin/env node
/* Build what a consumer takes: a drop-in, and a package.

   The repo itself needs no build — Node runs the `.ts` sources by stripping
   types. Two audiences do.

   **The drop-in.** `soul.js`, `soul.css` and the assets beside them. Copy the
   directory somewhere public, link two files, done: no bundler, no `lit` to
   install, no import map. That is the surface this system was built for — an
   HTML page rendered by something that is not JavaScript. Lit is bundled in,
   because a drop-in has nothing to share a copy with.

   **The package.** `index.js` plus types, `lit` external. Bundling it there
   would give a consumer a second reactive-element registry and an element
   that upgrades under the wrong one — a peer dependency for the reason React
   always is.

     make dist
*/
import { cpSync, existsSync, rmSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { watch } from 'node:fs';
import { spawnSync } from 'node:child_process';

import * as esbuild from 'esbuild';

import { ROOT } from './lib/cards.ts';

/* `--check` builds beside the committed output and compares. The drop-in is
   in git so a consumer can take it over a plain clone; committed and
   unchecked it would be a copy that goes stale against its own source, which
   is the failure this system exists to prevent. */
const CHECK = process.argv.includes('--check');
/* `--watch` keeps the drop-in current while a source file is being edited, so
   the surfaces that link it are never a `make dist` behind. Types are left out
   of it: nothing in the running stack reads them, they are the slowest step by
   an order of magnitude, and `verify` builds them anyway. */
const WATCH = process.argv.includes('--watch');
const OUT = join(ROOT, CHECK ? '.dist-check' : 'dist');

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

/* The drop-in. Lit inside, one stylesheet, and the files both of them ask
   for sitting beside them at the paths they already use. */
const jsOptions: esbuild.BuildOptions = {
  entryPoints: [join(ROOT, 'src', 'index.ts')],
  outfile: join(OUT, 'soul.js'),
  bundle: true,
  format: 'esm',
  target: 'es2022',
  minify: true,
  legalComments: 'none',
  metafile: true,
};

/* One stylesheet: the faces, the tokens and the class layer inlined, with
   the woff2 files copied beside it and their URLs rewritten to match. */
const cssOptions: esbuild.BuildOptions = {
  entryPoints: [join(ROOT, 'src/styles/styles.css')],
  outfile: join(OUT, 'soul.css'),
  bundle: true,
  minify: true,
  loader: { '.woff2': 'copy' },
  assetNames: 'fonts/[name]',
};

/* The second sheet, and it is second on purpose. `soul.css` is what an
   application surface links; this is what a page linking it *also* links when
   the thing on it is a document rather than an interface. Shipped apart
   because a backend module has no paragraphs to have opinions about — see the
   header of `document.css`. */
const docCssOptions: esbuild.BuildOptions = {
  entryPoints: [join(ROOT, 'src/styles/document.css')],
  outfile: join(OUT, 'document.css'),
  bundle: true,
  minify: true,
};

/* The pre-paint line, and the only thing here that is not a module.

   It has to run before the page is painted, and a module cannot: `type=module`
   is deferred whether you ask for it or not. So it ships as a classic script,
   built on its own — see the head of `src/boot.ts` for what it costs to leave
   it out. */
const bootOptions: esbuild.BuildOptions = {
  entryPoints: [join(ROOT, 'src', 'boot.ts')],
  outfile: join(OUT, 'soul-boot.js'),
  bundle: true,
  format: 'iife',
  target: 'es2022',
  minify: true,
  legalComments: 'none',
};

const copyAssets = (): void => cpSync(join(ROOT, 'assets'), join(OUT, 'assets'), { recursive: true });

if (WATCH) {
  const stamp = (what: string, errors = 0): void =>
    console.log(`${new Date().toTimeString().slice(0, 8)}  ${errors ? `FAILED ${what} — ${errors} error(s)` : `rebuilt ${what}`}`);

  /* Say something on every pass. esbuild rebuilds silently, and a watcher you
     cannot tell is alive is the next thing to go wrong without saying so —
     the output would simply stop changing. */
  const announce = (what: string): esbuild.Plugin => ({
    name: 'announce',
    setup(build) {
      build.onEnd((result) => stamp(what, result.errors.length));
    },
  });

  /* esbuild watches what it imported, which is `src/` and the faces. The
     assets are copied rather than imported, so nothing would notice a new
     icon — they get their own watch. */
  const contexts = await Promise.all([
    esbuild.context({ ...jsOptions, plugins: [announce('dist/soul.js')] }),
    esbuild.context({ ...cssOptions, plugins: [announce('dist/soul.css')] }),
    esbuild.context({ ...docCssOptions, plugins: [announce('dist/document.css')] }),
    esbuild.context({ ...bootOptions, plugins: [announce('dist/soul-boot.js')] }),
  ]);
  for (const ctx of contexts) await ctx.watch();
  copyAssets();
  watch(join(ROOT, 'assets'), { recursive: true }, () => { copyAssets(); stamp('dist/assets'); });
  console.log('watching src/ and assets/ — dist/ stays current');
  await new Promise(() => {});
}

const drop = await esbuild.build(jsOptions);
await esbuild.build(cssOptions);
await esbuild.build(docCssOptions);
await esbuild.build(bootOptions);
copyAssets();

const kb = (p: string): string => `${(readFileSync(join(OUT, p)).length / 1024).toFixed(1)} kB`;
const bytes = readFileSync(join(OUT, 'index.js')).length;
const modules = Object.keys(bundle.metafile.inputs).length;
console.log(`dist/soul.js  — ${kb('soul.js')}, lit bundled, from ${Object.keys(drop.metafile?.inputs ?? {}).length} modules`);
console.log(`dist/soul.css — ${kb('soul.css')}, faces and tokens inlined`);
console.log(`dist/document.css — ${kb('document.css')}, the document layer, linked beside it`);
console.log(`dist/soul-boot.js — ${kb('soul-boot.js')}, the pre-paint line, not a module`);
console.log(`dist/index.js — ${(bytes / 1024).toFixed(1)} kB from ${modules} modules, lit external`);
console.log(`dist/types/  — declarations, ${rewritten} rewritten to .js specifiers`);

if (CHECK) {
  const live = join(ROOT, 'dist');
  const walk = (dir: string, base = dir, out: string[] = []): string[] => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p, base, out);
      else out.push(p.slice(base.length + 1));
    }
    return out;
  };
  const fresh = new Set(walk(OUT));
  const committed = existsSync(live) ? new Set(walk(live)) : new Set<string>();
  const stale: string[] = [];
  for (const f of fresh) {
    if (!committed.has(f)) { stale.push(`missing: ${f}`); continue; }
    if (!readFileSync(join(OUT, f)).equals(readFileSync(join(live, f)))) stale.push(`differs: ${f}`);
  }
  for (const f of committed) if (!fresh.has(f)) stale.push(`no longer built: ${f}`);
  rmSync(OUT, { recursive: true, force: true });

  console.log(`   ${fresh.size} files, ${stale.length} out of date`);
  if (stale.length) {
    for (const s of stale.slice(0, 8)) console.log(`   ✗ ${s}`);
    console.log('   Run `make dist` and commit the result.');
    process.exit(1);
  }
}
