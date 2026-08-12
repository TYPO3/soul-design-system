#!/usr/bin/env node
/* A package under `packages/`, mirrored into the repository it is published
   from.

     make split ARGS=guides-theme   replay its commits into .split/guides-theme
     make split ARGS=frontend       the same, for the npm package
     make split ARGS=--check        assemble both and prove they are whole

   Packagist reads the `composer.json` at the root of a repository, and npm
   installs from one — so everything under `packages/` is pushed to a repository
   of its own. That is what the directory means, and the only thing it means.

   **Assembled per commit rather than split out of the history.** `splitsh-lite`
   reproduces a subdirectory's commits exactly, which cannot work for the theme:
   its package has to hold a directory this tree does not have in that place —
   the drop-in a page links. So each commit that touches a package is replayed,
   with the author, the date and the message it had here and a `Split-From:`
   trailer saying where the mirror stopped. A commit that changes nothing over
   there is not a commit over there, unless a tag points at it.

   Nothing is pushed. The remote is printed with the commands that do it,
   because publishing is a decision and not a build step. */
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

import { ROOT } from './lib/cards.ts';

const argv = process.argv.slice(2);
const CHECK = argv.includes('--check');
const flag = (name: string): string | undefined =>
  argv.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');

const BRANCH = flag('branch') ?? 'main';

/* Every path that has moved is named twice: a mirror knowing only today's
   spelling replays half the history as an empty package. Newest first — the
   first one that exists in a tree is the one used. */
const THEME_AT = ['packages/guides-theme', 'guides-theme'];
const DROP_AT = ['packages/frontend/dist', 'dist'];

/* What the theme package is made of. `acceptance/` is not in it: the control
   surface the theme is developed against, pointing at cards generated here. */
const FROM_THEME = ['composer.json', 'README.md', 'src', 'resources/config', 'resources/template'];

/* The drop-in, minus the four that only ever reach npm: a PHP project installs
   no ESM package and reads no declarations. */
const NOT_IN_THE_DROP_IN = ['index.js', 'index.js.map', 'types', 'tsconfig.json'];

/* And what the npm package leaves out, which its manifest names as well. */
const NOT_IN_THE_PACKAGE = [join('assets', 'placeholders'), join('assets', 'icons', 'svgs')];

/** Every file under a directory, relative to it — the package, not the
    repository it is kept in. */
function* walk(dir: string, base = dir): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path, base);
    else yield relative(base, path);
  }
}

/** The first of several places that exists in a tree, told apart by a file that
    proves it is the package and not a directory of the same name. */
const found = (tree: string, places: readonly string[], proof: string): string | undefined =>
  places.map((at) => join(tree, at)).find((path) => existsSync(join(path, proof)));

interface Package {
  /** What `make split ARGS=<name>` is called, and its directory under `.split/`. */
  name: string;
  /** Where it is published. */
  remote: string;
  /** Which paths a commit has to touch to belong to its history. */
  concerns: readonly string[];
  /** The manifest that says a package was assembled at all. */
  manifest: string;
  /** Where it is written in a given tree, if that tree has it. */
  at: (tree: string) => string | undefined;
  /** Build it out of one tree into an empty directory. */
  assemble: (tree: string, into: string) => void;
  /** What a project that installed it would find missing, said in the terms of
      what breaks. Each line is something left out of a package before. */
  incomplete: (pkg: string, tree: string) => string[];
}

const PACKAGES: readonly Package[] = [
  {
    name: 'guides-theme',
    remote: 'git@github.com:benjaminkott/typo3-soul-guides-theme.git',
    concerns: [...THEME_AT, ...DROP_AT],
    manifest: 'composer.json',
    at: (tree) => found(tree, THEME_AT, 'composer.json'),

    /* The theme, and the drop-in it links — which lives in the other package
       and cannot be a Composer dependency of this one. Nothing is required to
       exist: a tree from before a file was written assembles into the package
       that release was. */
    assemble(tree, into) {
      const theme = this.at(tree);
      if (!theme) return;
      for (const path of FROM_THEME) {
        const from = join(theme, path);
        if (existsSync(from)) cpSync(from, join(into, path), { recursive: true });
      }
      if (existsSync(join(tree, 'LICENSE'))) cpSync(join(tree, 'LICENSE'), join(into, 'LICENSE'));

      const drop = found(tree, DROP_AT, 'soul.css');
      if (drop) {
        const out = join(into, 'resources', 'dist');
        mkdirSync(out, { recursive: true });
        for (const entry of readdirSync(drop)) {
          if (NOT_IN_THE_DROP_IN.includes(entry)) continue;
          cpSync(join(drop, entry), join(out, entry), { recursive: true });
        }
      }
      writeFileSync(join(into, '.gitignore'), 'vendor/\ncomposer.lock\n');
    },

    incomplete(pkg, tree) {
      const missing = [
        'composer.json', 'README.md', 'LICENSE',
        'src/DependencyInjection/SoulExtension.php',
        'resources/config/soul.php',
        'resources/template/structure/layout.html.twig',
        'resources/dist/soul.css', 'resources/dist/document.css',
        'resources/dist/soul.js', 'resources/dist/soul-boot.js',
        'resources/dist/soul-finish.js',
      ].filter((path) => !existsSync(join(pkg, path)));

      /* Counted rather than listed: a template that stops being copied renders
         the core's own markup, which looks like a styling bug and is not one. */
      const twig = (dir: string): number =>
        (existsSync(dir) ? [...walk(dir)].filter((f) => f.endsWith('.html.twig')).length : 0);
      const here = twig(join(this.at(tree) ?? '', 'resources', 'template'));
      const there = twig(join(pkg, 'resources', 'template'));
      if (here !== there) missing.push(`${here - there} template(s) did not make it into the package`);

      const drop = join(pkg, 'resources', 'dist');
      if (!existsSync(join(drop, 'fonts')) || readdirSync(join(drop, 'fonts')).length === 0) {
        missing.push('resources/dist/fonts/ is empty — the site would serve system-ui');
      }
      if (!existsSync(join(drop, 'assets', 'icons', 'sprites'))) {
        missing.push('resources/dist/assets/icons/sprites/ is missing — every icon would be a blank box');
      }
      const name = (JSON.parse(readFileSync(join(pkg, 'composer.json'), 'utf8')) as { name?: string }).name;
      if (name !== 'typo3/soul-guides-theme') missing.push(`composer.json names ${name}, not typo3/soul-guides-theme`);
      return missing;
    },
  },

  {
    name: 'frontend',
    remote: 'git@github.com:benjaminkott/typo3-soul-frontend.git',
    concerns: ['packages/frontend'],
    manifest: 'package.json',
    at: (tree) => found(tree, ['packages/frontend'], 'package.json'),

    /* This one is its own directory, so assembling it is copying it. Its
       history starts where that directory does: before it, what is here was the
       monorepo's root, which was never a package anybody could install. */
    assemble(tree, into) {
      const dir = this.at(tree);
      if (!dir) return;
      for (const entry of readdirSync(dir)) {
        if (entry === '.dist-check' || entry === 'node_modules') continue;
        cpSync(join(dir, entry), join(into, entry), {
          recursive: true,
          /* What `files` in the manifest leaves out, left out here too: the
             photography belongs to this system's own stories, and the single
             icons are the sprite's source. Eight megabytes nobody installing
             this would ever fetch. */
          filter: (from) => !NOT_IN_THE_PACKAGE.includes(relative(dir, from)),
        });
      }
      if (existsSync(join(tree, 'LICENSE'))) cpSync(join(tree, 'LICENSE'), join(into, 'LICENSE'));
      writeFileSync(join(into, '.gitignore'), 'node_modules/\n');
    },

    incomplete(pkg) {
      const missing = [
        'package.json', 'README.md', 'LICENSE',
        'src/index.ts', 'src/styles/styles.css', 'src/styles/components.css',
        'dist/soul.css', 'dist/document.css', 'dist/soul.js', 'dist/soul-boot.js',
        'dist/index.js',
      ].filter((path) => !existsSync(join(pkg, path)));

      if (!existsSync(join(pkg, 'fonts')) || readdirSync(join(pkg, 'fonts')).length === 0) {
        missing.push('fonts/ is empty — every surface linking this falls back to system-ui');
      }
      const manifest = JSON.parse(readFileSync(join(pkg, 'package.json'), 'utf8')) as { name?: string; private?: boolean };
      if (manifest.name !== '@typo3/soul-frontend') missing.push(`package.json names ${manifest.name}, not @typo3/soul-frontend`);
      /* The workspace root is private on purpose, and this must never be: that
         flag is the difference between a package and a refusal to publish. */
      if (manifest.private) missing.push('package.json is private — npm would refuse to publish it');
      return missing;
    },
  },
];

const report = (pkg: string): void => {
  const files = [...walk(pkg)];
  const bytes = files.reduce((n, f) => n + statSync(join(pkg, f)).size, 0);
  console.log(`   ${files.length} files, ${(bytes / 1024 / 1024).toFixed(1)} MB`);
};

/* ---- the gate's question: do these trees make packages that stand alone ---- */

if (CHECK) {
  let bad = 0;
  for (const pack of PACKAGES) {
    const into = mkdtempSync(join(tmpdir(), `soul-${pack.name}-`));
    pack.assemble(ROOT, into);
    const missing = existsSync(join(into, pack.manifest))
      ? pack.incomplete(into, ROOT)
      : [`${pack.name} is not in this tree`];
    console.log(`   ${pack.name}`);
    if (existsSync(join(into, pack.manifest))) report(into);
    rmSync(into, { recursive: true, force: true });
    if (missing.length) {
      bad++;
      console.error(`\n✗ ${pack.name} is not complete:`);
      for (const line of missing) console.error(`  - ${line}`);
    }
  }
  if (bad) process.exit(1);
  console.log('   both assemble into packages that stand on their own');
  process.exit(0);
}

/* ---- the mirror ---- */

const wanted = argv.filter((a) => !a.startsWith('--'));
const packs = PACKAGES.filter((p) => wanted.length === 0 || wanted.includes(p.name));
if (packs.length === 0) {
  console.error(`✗ no package called ${wanted.join(', ')} — there is ${PACKAGES.map((p) => p.name).join(' and ')}`);
  process.exit(1);
}

if (spawnSync('git', ['--version']).status !== 0) {
  console.error('✗ mirroring needs git, and the container image has none — run `node scripts/split.ts` on the host, or the split workflow');
  process.exit(1);
}

const git = (args: string[], cwd = ROOT): string => {
  const run = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (run.status !== 0) throw new Error(`git ${args.slice(0, 2).join(' ')} failed: ${run.stderr?.trim()}`);
  return run.stdout.trim();
};

/* A tag is a release, and a release has to exist as a commit before it can be
   tagged — even where the package itself did not change in it. */
const tags = new Map<string, string>();
for (const tag of git(['tag', '--list']).split('\n').filter(Boolean)) {
  tags.set(git(['rev-list', '-1', tag]), tag);
}

for (const pack of packs) {
  const out = flag('into') ?? join(ROOT, '.split', pack.name);
  const remote = flag('remote') ?? pack.remote;

  /* Reused where it is already a repository, so a second run replays only what
     has happened since. Cloned where the remote can be read, because the mirror
     continues that history rather than replacing it. */
  if (!existsSync(join(out, '.git'))) {
    rmSync(out, { recursive: true, force: true });
    if (spawnSync('git', ['clone', '--quiet', remote, out]).status !== 0) {
      console.log(`   ${pack.name}: ${remote} could not be read — mirroring from the first commit`);
      mkdirSync(out, { recursive: true });
      git(['init', '--quiet', '--initial-branch', BRANCH], out);
    }
  }

  /* Where the mirror stopped: the trailer on its last commit. */
  const log = spawnSync('git', ['log', '-1', '--format=%B'], { cwd: out, encoding: 'utf8' });
  const from = log.status === 0 ? /^Split-From:\s*([0-9a-f]{40})$/m.exec(log.stdout)?.[1] : undefined;
  const range = from ? `${from}..HEAD` : 'HEAD';

  const born = git(['rev-list', '--reverse', 'HEAD', '--', ...pack.concerns]).split('\n')[0];
  const touching = new Set(git(['rev-list', range, '--', ...pack.concerns]).split('\n').filter(Boolean));

  let started = Boolean(from);
  const replay = git(['rev-list', '--reverse', '--topo-order', range]).split('\n').filter(Boolean)
    .filter((sha) => {
      if (sha === born) started = true;
      return started && (touching.has(sha) || tags.has(sha));
    });

  if (replay.length === 0) {
    console.log(`   ${pack.name}: nothing to mirror — ${relative(ROOT, out)} is level with this tree`);
    continue;
  }

  const tree = mkdtempSync(join(tmpdir(), 'soul-tree-'));
  const staged = mkdtempSync(join(tmpdir(), 'soul-pkg-'));
  let written = 0;
  let empty = 0;

  for (const sha of replay) {
    /* The tree as it was, and only the parts the package is made of: an archive
       of the whole commit would copy the design system once per commit. */
    rmSync(tree, { recursive: true, force: true });
    mkdirSync(tree, { recursive: true });
    const present = [...git(['ls-tree', '--name-only', sha, '--', ...pack.concerns]).split('\n').filter(Boolean), 'LICENSE'];
    const archive = spawnSync('sh', ['-c',
      `git archive ${sha} -- ${present.map((path) => `'${path}'`).join(' ')} | tar -x -C '${tree}'`], { cwd: ROOT });
    if (archive.status !== 0) continue;

    rmSync(staged, { recursive: true, force: true });
    mkdirSync(staged, { recursive: true });
    pack.assemble(tree, staged);
    if (!existsSync(join(staged, pack.manifest))) continue;

    /* The working tree replaced wholesale, so a file deleted here is deleted
       there. `.git` is what the mirror is, and stays. */
    for (const entry of readdirSync(out)) {
      if (entry !== '.git') rmSync(join(out, entry), { recursive: true, force: true });
    }
    for (const entry of readdirSync(staged)) cpSync(join(staged, entry), join(out, entry), { recursive: true });

    git(['add', '--all'], out);
    const changed = spawnSync('git', ['diff', '--cached', '--quiet'], { cwd: out }).status !== 0;
    const tag = tags.get(sha);
    if (!changed && !tag) continue;

    const subject = git(['log', '-1', '--format=%s', sha]);
    const body = git(['log', '-1', '--format=%b', sha]);
    const date = git(['log', '-1', '--format=%aI', sha]);
    spawnSync('git', ['commit', '--quiet', '--allow-empty',
      '--author', git(['log', '-1', '--format=%an <%ae>', sha]), '--date', date,
      '-m', `${subject}\n\n${body ? `${body}\n\n` : ''}Split-From: ${sha}\n`], {
      cwd: out,
      env: { ...process.env, GIT_COMMITTER_DATE: date, GIT_COMMITTER_NAME: 'Soul Design System', GIT_COMMITTER_EMAIL: 'noreply@example.com' },
    });
    written++;
    if (!changed) empty++;
    if (tag) git(['tag', '--force', tag], out);
  }

  rmSync(tree, { recursive: true, force: true });
  rmSync(staged, { recursive: true, force: true });

  const missing = pack.incomplete(out, ROOT);
  if (missing.length) {
    console.error(`\n✗ the ${pack.name} package the mirror ends on is not complete:`);
    for (const line of missing) console.error(`  - ${line}`);
    process.exit(1);
  }

  console.log(`   ${pack.name}`);
  report(out);
  console.log(`   ${written} commit(s) mirrored${empty ? `, ${empty} of them empty for a tag` : ''}${from ? ` since ${from.slice(0, 7)}` : ''}

    git -C ${relative(ROOT, out)} push ${remote} ${BRANCH}
    git -C ${relative(ROOT, out)} push --tags ${remote}
`);
}
