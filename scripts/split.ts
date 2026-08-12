#!/usr/bin/env node
/* The Guides theme, mirrored into the repository it is published from.

     make split                 replay every commit that touches it into .split/
     make split ARGS=--check    assemble this tree and prove the package is whole

   Packagist reads the `composer.json` at the root of a repository, and this
   one's root is the npm package — so everything under `packages/` is pushed to
   a repository of its own. That is what the directory means.

   **Assembled per commit rather than split out of the history.**
   `splitsh-lite` reproduces a subdirectory's commits exactly, which cannot
   work here: the package has to contain a directory the monorepo does not have
   in that place — the drop-in a page links. So each commit that touches the
   package is replayed: its tree is assembled and committed with the author,
   the date and the message it had here, and a `Split-From:` trailer that says
   where the mirror stopped. A commit that changes nothing in the package is
   not one over there either, unless a tag points at it — a release has to
   exist as a commit before it can be tagged.

   Nothing is pushed. The remote is printed with the commands that do it,
   because publishing is a decision and not a build step. */
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

import { ROOT } from './lib/cards.ts';

const CHECK = process.argv.includes('--check');
const flag = (name: string): string | undefined =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');

/** Where it is pushed. Named here so a person and the workflow type the same
    thing, and overridable because the target is given by hand. */
const REMOTE = flag('remote') ?? 'git@github.com:benjaminkott/typo3-soul-guides-theme.git';
const BRANCH = flag('branch') ?? 'main';
const OUT = flag('into') ?? join(ROOT, '.split');

/* The theme, and the drop-in it carries. The second spelling is where the
   theme lived before it moved under `packages/`: a mirror that only knows
   today's path replays half the history as an empty package. */
const THEME_AT = ['packages/guides-theme', 'guides-theme'];
const CONCERNS = [...THEME_AT, 'dist'];

/* What the package is made of. `acceptance/` is not in it: the control surface
   this theme is developed against, pointing at cards generated here. */
const FROM_THEME = ['composer.json', 'README.md', 'src', 'resources/config', 'resources/template'];

/* The drop-in, minus the four that only ever reach npm: a PHP project installs
   no ESM package and reads no declarations. */
const NOT_IN_THE_PACKAGE = ['index.js', 'index.js.map', 'types', 'tsconfig.json'];

const git = (args: string[], cwd = ROOT): string => {
  const run = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (run.status !== 0) throw new Error(`git ${args.slice(0, 2).join(' ')} failed: ${run.stderr?.trim()}`);
  return run.stdout.trim();
};

/** Every file under a directory, relative to it. */
function* walk(dir: string, base = dir): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path, base);
    else yield relative(base, path);
  }
}

/** Which of the two places the theme is in, in a given tree. */
const themeIn = (tree: string): string | undefined =>
  THEME_AT.map((at) => join(tree, at)).find((path) => existsSync(join(path, 'composer.json')));

/**
 * The package, built out of one tree into an empty directory.
 *
 * Nothing here is required to exist: a tree from before a file was written
 * assembles into a package without it, which is what that release was.
 */
function assemble(tree: string, into: string): void {
  const theme = themeIn(tree);
  if (!theme) return;

  for (const path of FROM_THEME) {
    const from = join(theme, path);
    if (existsSync(from)) cpSync(from, join(into, path), { recursive: true });
  }
  if (existsSync(join(tree, 'LICENSE'))) cpSync(join(tree, 'LICENSE'), join(into, 'LICENSE'));

  const dist = join(tree, 'dist');
  if (existsSync(dist)) {
    const drop = join(into, 'resources', 'dist');
    mkdirSync(drop, { recursive: true });
    for (const entry of readdirSync(dist)) {
      if (NOT_IN_THE_PACKAGE.includes(entry)) continue;
      cpSync(join(dist, entry), join(drop, entry), { recursive: true });
    }
  }

  /* Composer's own tree and its lock belong to whoever installs, not to what
     is published. */
  writeFileSync(join(into, '.gitignore'), 'vendor/\ncomposer.lock\n');
}

/* What a project that installed this must find. Each line is something that
   has been left out of a package before: the templates, the configuration that
   registers them, the stylesheet a page links, the step after a render. */
const REQUIRED = [
  'composer.json',
  'README.md',
  'LICENSE',
  'src/DependencyInjection/SoulExtension.php',
  'resources/config/soul.php',
  'resources/template/structure/layout.html.twig',
  'resources/dist/soul.css',
  'resources/dist/document.css',
  'resources/dist/soul.js',
  'resources/dist/soul-boot.js',
  'resources/dist/soul-finish.js',
];

/** Everything the package is missing, said in the terms of what breaks. */
function incomplete(pkg: string, tree: string): string[] {
  const missing = REQUIRED.filter((path) => !existsSync(join(pkg, path)));

  /* Counted rather than listed: a template that stops being copied renders the
     core's own markup, which looks like a styling bug and is not one. */
  const twig = (dir: string): number => (existsSync(dir) ? [...walk(dir)].filter((f) => f.endsWith('.html.twig')).length : 0);
  const here = twig(join(themeIn(tree) ?? '', 'resources', 'template'));
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
}

const report = (pkg: string): void => {
  const files = [...walk(pkg)];
  const bytes = files.reduce((n, f) => n + statSync(join(pkg, f)).size, 0);
  console.log(`  ${files.length} files, ${(bytes / 1024 / 1024).toFixed(1)} MB`);
};

/* ---- the gate's question: does this tree make a package that stands alone ---- */

if (CHECK) {
  const pkg = mkdtempSync(join(tmpdir(), 'soul-split-'));
  assemble(ROOT, pkg);
  const missing = incomplete(pkg, ROOT);
  report(pkg);
  rmSync(pkg, { recursive: true, force: true });
  if (missing.length) {
    console.error('\n✗ the package is not complete:');
    for (const line of missing) console.error(`  - ${line}`);
    process.exit(1);
  }
  console.log('  the theme assembles into a package that stands on its own');
  process.exit(0);
}

/* ---- the mirror ---- */

if (spawnSync('git', ['--version']).status !== 0) {
  console.error('✗ mirroring needs git, and the container image has none — run `node scripts/split.ts` on the host, or the split workflow');
  process.exit(1);
}

/* Reused where it is already a repository, so a second run replays only what
   has happened since. Cloned where the remote can be reached, because the
   mirror has to continue that history rather than replace it. */
if (!existsSync(join(OUT, '.git'))) {
  rmSync(OUT, { recursive: true, force: true });
  const cloned = spawnSync('git', ['clone', '--quiet', REMOTE, OUT], { encoding: 'utf8' });
  if (cloned.status !== 0) {
    console.log(`  ${REMOTE} could not be read — mirroring from the first commit`);
    mkdirSync(OUT, { recursive: true });
    git(['init', '--quiet', '--initial-branch', BRANCH], OUT);
  }
}

/** Where the mirror stopped: the trailer on its last commit. */
function mirrored(): string | undefined {
  const log = spawnSync('git', ['log', '-1', '--format=%B'], { cwd: OUT, encoding: 'utf8' });
  if (log.status !== 0) return undefined;
  return /^Split-From:\s*([0-9a-f]{40})$/m.exec(log.stdout)?.[1];
}

const from = mirrored();
const range = from ? `${from}..HEAD` : 'HEAD';

/* Only what concerns the package — and only from the commit the theme arrived
   in, since a drop-in with no theme beside it is not a version of anything. */
const born = git(['rev-list', '--reverse', 'HEAD', '--', ...THEME_AT]).split('\n')[0];
const touching = new Set(git(['rev-list', range, '--', ...CONCERNS]).split('\n').filter(Boolean));

/* A tag is a release, and a release has to exist as a commit before it can be
   tagged — even where the package itself did not change. */
const tags = new Map<string, string>();
for (const tag of git(['tag', '--list']).split('\n').filter(Boolean)) {
  tags.set(git(['rev-list', '-1', tag]), tag);
}

const order = git(['rev-list', '--reverse', '--topo-order', range]).split('\n').filter(Boolean);
const seen = new Set<string>();
let started = !born || Boolean(from);
const replay = order.filter((sha) => {
  if (sha === born) started = true;
  if (!started) return false;
  if (!touching.has(sha) && !tags.has(sha)) return false;
  if (seen.has(sha)) return false;
  seen.add(sha);
  return true;
});

if (replay.length === 0) {
  console.log(`  nothing to mirror — ${OUT} is level with this tree`);
  process.exit(0);
}

const tree = mkdtempSync(join(tmpdir(), 'soul-tree-'));
const pkg = mkdtempSync(join(tmpdir(), 'soul-pkg-'));
let written = 0;
let empty = 0;

for (const sha of replay) {
  /* The tree as it was, and only the parts the package is made of: an archive
     of the whole commit would copy the design system a hundred times over. */
  rmSync(tree, { recursive: true, force: true });
  mkdirSync(tree, { recursive: true });
  const present = git(['ls-tree', '--name-only', sha, '--', ...CONCERNS]).split('\n').filter(Boolean);
  if (existsSync(join(ROOT, 'LICENSE'))) present.push('LICENSE');
  if (present.length) {
    const archive = spawnSync('sh', ['-c',
      `git archive ${sha} -- ${present.map((p) => `'${p}'`).join(' ')} | tar -x -C '${tree}'`],
    { cwd: ROOT });
    if (archive.status !== 0) continue;
  }

  rmSync(pkg, { recursive: true, force: true });
  mkdirSync(pkg, { recursive: true });
  assemble(tree, pkg);
  if (!existsSync(join(pkg, 'composer.json'))) continue;

  /* The working tree replaced wholesale, so a file deleted here is deleted
     there. `.git` is what the mirror is, and stays. */
  for (const entry of readdirSync(OUT)) {
    if (entry !== '.git') rmSync(join(OUT, entry), { recursive: true, force: true });
  }
  for (const entry of readdirSync(pkg)) {
    cpSync(join(pkg, entry), join(OUT, entry), { recursive: true });
  }

  git(['add', '--all'], OUT);
  const changed = spawnSync('git', ['diff', '--cached', '--quiet'], { cwd: OUT }).status !== 0;
  const tag = tags.get(sha);
  if (!changed && !tag) continue;

  const subject = git(['log', '-1', '--format=%s', sha]);
  const body = git(['log', '-1', '--format=%b', sha]);
  const author = git(['log', '-1', '--format=%an <%ae>', sha]);
  const date = git(['log', '-1', '--format=%aI', sha]);
  const message = `${subject}\n\n${body ? `${body}\n\n` : ''}Split-From: ${sha}\n`;

  spawnSync('git', ['commit', '--quiet', '--allow-empty', '--author', author, '--date', date,
    '-m', message], {
    cwd: OUT,
    env: { ...process.env, GIT_COMMITTER_DATE: date, GIT_COMMITTER_NAME: 'Soul Design System', GIT_COMMITTER_EMAIL: 'noreply@example.com' },
    encoding: 'utf8',
  });
  written++;
  if (!changed) empty++;
  if (tag) git(['tag', '--force', tag], OUT);
}

rmSync(tree, { recursive: true, force: true });
rmSync(pkg, { recursive: true, force: true });

const missing = incomplete(OUT, ROOT);
if (missing.length) {
  console.error('\n✗ the package the mirror ends on is not complete:');
  for (const line of missing) console.error(`  - ${line}`);
  process.exit(1);
}

report(OUT);
console.log(`  ${written} commit(s) mirrored${empty ? `, ${empty} of them empty for a tag` : ''}${from ? ` since ${from.slice(0, 7)}` : ''}
  Nothing has been pushed. To publish it:

    git -C ${relative(ROOT, OUT) || OUT} push ${REMOTE} ${BRANCH}
    git -C ${relative(ROOT, OUT) || OUT} push --tags ${REMOTE}`);
