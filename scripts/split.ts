#!/usr/bin/env node
/* A package under `packages/`, mirrored into the repository it ships from.

     make split ARGS=guides-theme   replay its commits into .out/split/guides-theme
     make split ARGS=frontend       the same, for the npm package
     make split ARGS=--check        assemble both and prove they are whole

   Packagist reads the `composer.json` at the root of a repository, and npm
   installs from one. So everything under `packages/` goes to a repository of
   its own. That is what the directory means, and the only thing it means.

   **Assembled per commit rather than split out of the history.** `splitsh-lite`
   reproduces a subdirectory's commits exactly, which cannot work for the theme.
   Its package has to hold a directory this tree does not have in that place:
   the drop-in a page links. So each commit that touches a package replays,
   with the author, the date and the message it had here. A `Split-From:`
   trailer says where the mirror stopped. A commit that changes nothing over
   there is not a commit over there, unless a tag points at it.

   Nothing goes up. The remote prints with the commands that push it, because
   a publish is a decision and not a build step. */
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

import { GENERATED, ROOT } from './lib/cards.ts';
import { PACKAGES, walk } from './lib/packages.ts';
import * as report from './lib/report.ts';

const argv = process.argv.slice(2);
const CHECK = argv.includes('--check');
const flag = (name: string): string | undefined =>
  argv.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');

const BRANCH = flag('branch') ?? 'main';

/** How big a package came out — the one fact that deserves a line about an
    assembly that otherwise only speaks up when it is incomplete. */
const size = (pkg: string): string => {
  const files = [...walk(pkg)];
  const bytes = files.reduce((n, f) => n + statSync(join(pkg, f)).size, 0);
  return `${files.length} files, ${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

/* ---- where they go, for whoever has to authenticate to it ---- */

/* One name and one address per line. The workflow rewrites these into an
   https URL with a token, as a runner has no key for an SSH remote. The
   question here is what keeps the addresses in one place. */
if (argv.includes('--remotes')) {
  for (const pack of PACKAGES) console.log(`${pack.name} ${pack.remote}`);
  process.exit(0);
}

/* ---- the gate's question: do these trees make packages that stand alone ---- */

if (CHECK) {
  report.open('split', 'each package assembles into something installable');
  report.align(PACKAGES.map((p) => ({ name: p.name, label: 'assembles into a package that stands alone' })));
  const problems: string[] = [];
  const sizes: string[] = [];
  for (const pack of PACKAGES) {
    const into = mkdtempSync(join(tmpdir(), `soul-${pack.name}-`));
    pack.assemble(ROOT, into);
    const there = existsSync(join(into, pack.manifest));
    const missing = there ? pack.incomplete(into, ROOT) : [`${pack.name} is not in this tree`];
    const facts = there ? size(into) : 'nothing assembled';
    if (there) sizes.push(`${pack.name} ${facts}`);
    rmSync(into, { recursive: true, force: true });
    report.row(missing.length ? 'bad' : 'ok', pack.name, 'assembles into a package that stands alone', facts);
    for (const line of missing) report.detail(line);
    problems.push(...missing.map((line) => `${pack.name}: ${line}`));
  }
  report.summary(sizes.join(' \u00b7 '), problems, { shown: true });
  process.exit(problems.length ? 1 : 0);
}

/* ---- the mirror ---- */

const wanted = argv.filter((a) => !a.startsWith('--'));
const packs = PACKAGES.filter((p) => wanted.length === 0 || wanted.includes(p.name));
if (packs.length === 0) {
  report.bad(`there is no package called ${wanted.join(', ')} — there is ${PACKAGES.map((p) => p.name).join(' and ')}`);
  process.exit(1);
}

if (spawnSync('git', ['--version']).status !== 0) {
  report.bad('a mirror needs git, and the container image has none — run `node scripts/split.ts` on the host, or the split workflow');
  process.exit(1);
}

report.open('split', 'mirror each package into the repository it ships from');
report.align(PACKAGES.map((p) => ({ name: p.name, label: 'nothing to mirror' })));

const git = (args: string[], cwd = ROOT): string => {
  const run = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (run.status !== 0) throw new Error(`git ${args.slice(0, 2).join(' ')} failed: ${run.stderr?.trim()}`);
  return run.stdout.trim();
};

/* A tag is a release. A release has to exist as a commit before a tag can
   point at it, even where the package itself did not change in it. */
const tags = new Map<string, string>();
for (const tag of git(['tag', '--list']).split('\n').filter(Boolean)) {
  tags.set(git(['rev-list', '-1', tag]), tag);
}

for (const pack of packs) {
  const out = flag('into') ?? join(GENERATED, 'split', pack.name);
  const remote = flag('remote') ?? pack.remote;

  /* Reused where it is already a repository, so a second run replays only what
     has happened since. Cloned where the remote answers, because the mirror
     continues that history rather than replaces it. */
  if (!existsSync(join(out, '.git'))) {
    rmSync(out, { recursive: true, force: true });
    if (spawnSync('git', ['clone', '--quiet', remote, out]).status !== 0) {
      report.note(`${pack.name}: ${remote} did not answer — the mirror starts from the first commit`);
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

  const tree = mkdtempSync(join(tmpdir(), 'soul-tree-'));
  const staged = mkdtempSync(join(tmpdir(), 'soul-pkg-'));
  let written = 0;
  let empty = 0;

  for (const sha of replay) {
    /* The tree as it was, and only the parts the package consists of. An
       archive of the whole commit copies the design system once per commit. */
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

    /* The working tree replaced wholesale, so a file gone here goes there.
       `.git` is what the mirror is, and stays. */
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
  }

  rmSync(tree, { recursive: true, force: true });
  rmSync(staged, { recursive: true, force: true });

  /* Every tag against the whole mirror, rather than only against what this run
     replayed. A tag on a commit the mirror already has — a release cut from a
     commit on `main` — belongs to no range this run walks. `git push --tags`
     then pushes a tag nobody applied. It fails at nothing and the release
     reaches no package manager. */
  const placed: string[] = [];
  if (spawnSync('git', ['rev-parse', '--verify', '--quiet', 'HEAD'], { cwd: out }).status === 0) {
    const mirrored = new Map<string, string>();
    for (const entry of git(['log', '--format=%H%x00%B%x01'], out).split('\x01')) {
      const [sha = '', body = ''] = entry.trim().split('\x00');
      const source = /^Split-From:\s*([0-9a-f]{40})$/m.exec(body)?.[1];
      if (source) mirrored.set(source, sha);
    }
    for (const [sha, tag] of tags) {
      const at = mirrored.get(sha);
      if (!at || at === spawnSync('git', ['rev-list', '-1', tag], { cwd: out, encoding: 'utf8' }).stdout?.trim()) continue;
      git(['tag', '--force', tag, at], out);
      placed.push(tag);
    }
  }

  if (replay.length === 0 && placed.length === 0) {
    report.row('skip', pack.name, 'nothing to mirror', `${relative(ROOT, out)} is level with this tree`);
    continue;
  }

  const missing = pack.incomplete(out, ROOT);
  if (missing.length) {
    report.summary(`the ${pack.name} package the mirror ends on is not complete`, missing);
    process.exit(1);
  }

  const what = written
    ? `${written} commit(s) mirrored${empty ? `, ${empty} empty for a tag` : ''}${from ? ` since ${from.slice(0, 7)}` : ''}`
    : 'level with this tree';
  report.row('ok', pack.name, `${what}${placed.length ? `, tagged ${placed.join(' ')}` : ''}`, size(out));
  report.detail(`git -C ${relative(ROOT, out)} push ${remote} ${BRANCH}`);
  report.detail(`git -C ${relative(ROOT, out)} push --tags ${remote}`);
}
