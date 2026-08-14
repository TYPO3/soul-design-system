#!/usr/bin/env node
/* Build what a consumer takes: a drop-in, and a package.

   The repo needs no build — Node runs the `.ts` sources by stripping types.
   Two audiences do. **The drop-in** is `soul.js`, `soul.css` and the assets
   beside them: copy the directory somewhere public and link two files, Lit
   bundled in. **The package** is `index.js` plus types and keeps `lit`
   external — bundled, a consumer gets a second reactive-element registry.

     make dist
*/
import { cpSync, existsSync, rmSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { watch } from 'node:fs';
import { spawnSync } from 'node:child_process';

import * as esbuild from 'esbuild';

import { FRONTEND, ROOT } from './lib/cards.ts';
import { rulePerLine } from './lib/css.ts';
import * as report from './lib/report.ts';

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
/* Beside `dist/` rather than under `.out/` with everything else generated: the
   check compares bytes, and both the generated tsconfig below and esbuild's
   sourcemaps name their sources relatively. Only a sibling of the real output
   produces the same paths. */
const OUT = join(FRONTEND, CHECK ? '.dist-check' : 'dist');

report.open('dist', CHECK ? 'the committed drop-in matches its source' : 'build the publishable drop-in');

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
  entryPoints: [join(FRONTEND, 'src', 'index.ts')],
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
  extends: '../../../tsconfig.json',
  compilerOptions: {
    noEmit: false,
    declaration: true,
    emitDeclarationOnly: true,
    rewriteRelativeImportExtensions: true,
    allowImportingTsExtensions: true,
    /* Both explicit: with the config inside dist/, tsc would otherwise infer
       the root as dist/ and reject every source above it. The climb is to the
       package, not the repo — `src/` sits beside this output. */
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
  report.summary('the declarations did not build', `${tsc.stdout ?? ''}\n${tsc.stderr ?? ''}`.split('\n').filter(Boolean));
  process.exit(1);
}

/* The sources import each other with explicit `.ts` specifiers, which is what
   lets one set of files serve Node's type stripper and Vite alike. A published
   `.d.ts` must not carry them — a consumer's TypeScript rejects the spelling
   outright — and `rewriteRelativeImportExtensions` does not reach declaration
   emit, so it is done here. */
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
  entryPoints: [join(FRONTEND, 'src', 'index.ts')],
  outfile: join(OUT, 'soul.js'),
  bundle: true,
  format: 'esm',
  target: 'es2022',
  minify: true,
  legalComments: 'none',
  metafile: true,
};

/* The stylesheets are minified and then broken back onto one rule per line.
   They are committed, and a sheet on a single line is a file two changes can
   never merge into — see the head of `lib/css.ts`. The bytes a reader pays
   for it are one newline per rule. */
const perRule: esbuild.Plugin = {
  name: 'rule-per-line',
  setup(build) {
    build.onEnd((result) => {
      const out = build.initialOptions.outfile;
      if (result.errors.length || !out) return;
      writeFileSync(out, rulePerLine(readFileSync(out, 'utf8')));
    });
  },
};

/* One stylesheet: the faces, the tokens and the class layer inlined, with
   the woff2 files copied beside it and their URLs rewritten to match. */
const cssOptions: esbuild.BuildOptions = {
  entryPoints: [join(FRONTEND, 'src/styles/styles.css')],
  outfile: join(OUT, 'soul.css'),
  bundle: true,
  minify: true,
  loader: { '.woff2': 'copy' },
  assetNames: 'fonts/[name]',
  plugins: [perRule],
};

/* The second sheet, and it is second on purpose. `soul.css` is what an
   application surface links; this is what a page linking it *also* links when
   the thing on it is a document rather than an interface. Shipped apart
   because a backend module has no paragraphs to have opinions about — see the
   header of `document.css`. */
const docCssOptions: esbuild.BuildOptions = {
  entryPoints: [join(FRONTEND, 'src/styles/document.css')],
  outfile: join(OUT, 'document.css'),
  bundle: true,
  minify: true,
  plugins: [perRule],
};

/* The pre-paint line, and the only thing here that is not a module: it has to
   run before the page is painted, and `type=module` is deferred whether you ask
   for it or not. So it ships as a classic script, built on its own — the head
   of `src/boot.ts` says what leaving it out costs. */
const bootOptions: esbuild.BuildOptions = {
  entryPoints: [join(FRONTEND, 'src', 'boot.ts')],
  outfile: join(OUT, 'soul-boot.js'),
  bundle: true,
  format: 'iife',
  target: 'es2022',
  minify: true,
  legalComments: 'none',
};

/* The step after a documentation render, shipped with the drop-in it needs. A
   project with only Composer can render documents and copy a directory; what it
   cannot do is draw this system's elements before the browser arrives. So the
   step travels with the stylesheets, as one file for the Node every CI image
   already has — see `scripts/soul-finish.ts`. */
const finishOptions: esbuild.BuildOptions = {
  entryPoints: [join(ROOT, 'scripts', 'soul-finish.ts')],
  outfile: join(OUT, 'soul-finish.js'),
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node22',
  minify: true,
  legalComments: 'none',
};

/* What a page fetches: the sprites `soul.js` resolves against its own URL, the
   drawings a document references, the marks. Not `icons/svgs`, which is the
   sprite's source and is read by `make icons` alone, and not `placeholders/`,
   which is this system's own story photography — 8.7 MB of it, in every clone
   and every copy anybody makes of the drop-in. */
const NOT_IN_THE_DROP_IN = [join('icons', 'svgs'), 'placeholders'];
const copyAssets = (): void => cpSync(join(FRONTEND, 'assets'), join(OUT, 'assets'), {
  recursive: true,
  filter: (source) => !NOT_IN_THE_DROP_IN.includes(relative(join(FRONTEND, 'assets'), source)),
});

if (WATCH) {
  const stamp = (what: string, errors = 0): void =>
    report.fact(new Date().toTimeString().slice(0, 8), errors ? `${what} failed — ${errors} error(s)` : `rebuilt ${what}`);

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
  /* Appended, never assigned: a spread that replaced `plugins` would drop the
     rewrite above and leave the watched sheets on one line. */
  const watched = (o: esbuild.BuildOptions, what: string): esbuild.BuildOptions =>
    ({ ...o, plugins: [...(o.plugins ?? []), announce(what)] });

  const contexts = await Promise.all([
    esbuild.context(watched(jsOptions, 'dist/soul.js')),
    esbuild.context(watched(cssOptions, 'dist/soul.css')),
    esbuild.context(watched(docCssOptions, 'dist/document.css')),
    esbuild.context(watched(bootOptions, 'dist/soul-boot.js')),
    /* The finishing step too, or a watch run leaves the drop-in without the
       one file a documentation build calls — and the gate, which compares a
       fresh build against this directory, reports it as out of date. */
    esbuild.context(watched(finishOptions, 'dist/soul-finish.js')),
  ]);
  for (const ctx of contexts) await ctx.watch();
  copyAssets();
  watch(join(FRONTEND, 'assets'), { recursive: true }, () => { copyAssets(); stamp('dist/assets'); });
  report.fact('watching src/ and assets/', 'dist/ stays current');
  await new Promise(() => {});
}

const drop = await esbuild.build(jsOptions);
await esbuild.build(cssOptions);
await esbuild.build(docCssOptions);
await esbuild.build(bootOptions);
await esbuild.build(finishOptions);
copyAssets();

const kb = (p: string): string => `${(readFileSync(join(OUT, p)).length / 1024).toFixed(1)} kB`;
const bytes = readFileSync(join(OUT, 'index.js')).length;
const modules = Object.keys(bundle.metafile.inputs).length;
const BUILT: readonly (readonly [file: string, what: string])[] = [
  ['dist/soul.js', `${kb('soul.js')}, lit bundled, from ${Object.keys(drop.metafile?.inputs ?? {}).length} modules`],
  ['dist/soul.css', `${kb('soul.css')}, faces and tokens inlined`],
  ['dist/document.css', `${kb('document.css')}, the document layer, linked beside it`],
  ['dist/soul-boot.js', `${kb('soul-boot.js')}, the pre-paint line, not a module`],
  ['dist/soul-finish.js', `${kb('soul-finish.js')}, the step after a render, for Node`],
  ['dist/index.js', `${(bytes / 1024).toFixed(1)} kB from ${modules} modules, lit external`],
  ['dist/types/', `declarations, ${rewritten} rewritten to .js specifiers`],
];
report.align(BUILT.map(([file]) => ({ name: file, label: file })));
for (const [file, what] of BUILT) report.fact(file, what);

if (CHECK) {
  const live = join(FRONTEND, 'dist');
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

  const shown = stale.slice(0, 8);
  if (stale.length > shown.length) shown.push(`… and ${stale.length - shown.length} more`);
  report.summary(`${fresh.size} files \u00b7 ${stale.length} out of date`, shown);
  process.exit(stale.length ? 1 : 0);
}
report.summary(`${BUILT.length} outputs written`);
