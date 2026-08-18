#!/usr/bin/env node
/* What the release page says, written from the commits it was cut from.

     make notes                 what the next release would say
     make notes ARGS=v0.1.1     what a tag said

   The log arrives on stdin because git is not in this image — the split
   `make release` already makes: the host has the history, the container turns
   it into the document. `.github/workflows/ci.yml` pipes the same command into
   the same script and hands the file to `gh release create`, so what a
   maintainer reads here is what the page will carry. */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { GENERATED, ROOT } from './lib/cards.ts';
import { PACKAGES } from './lib/packages.ts';
import * as report from './lib/report.ts';

/** Where the document lands. The workflow names this path too. */
const NOTES = join(GENERATED, 'release', 'notes.md');

/** How the log arrives: one commit per line, three fields, unit-separated so
    no subject can be mistaken for a field boundary. */
const LOG = "git log --no-merges --pretty=format:'%h%x1f%D%x1f%s'";
const FIELD = '\x1f';

/** A tag this repository releases under, told apart from any other tag. */
const RELEASED = /^v\d/;
/** `<scope>: <sentence>`, which is how every commit here is written. */
const SCOPE = /^([a-z][a-z0-9-]*): (.+)$/;
/** The version bump: what the tag points at, not something that changed. The
    digit is the whole test — `release:` is a scope like any other, and only a
    subject that is a version is the commit `make release` wrote. */
const BUMP = /^release: \d/;

/** The scopes that are about this repository rather than about the system
    somebody installs. They come last, in this order; every other scope is a
    part of the system and sorts above them by name. */
const LAST = ['docs', 'tooling', 'test', 'chore', 'ci', 'design-sync'];
const rank = (scope: string): string => {
  const at = LAST.indexOf(scope);
  return at < 0 ? `0${scope}` : `1${at}`;
};

interface Commit {
  sha: string;
  tags: string[];
  scope: string;
  /** The subject with its scope taken off — the sentence the commit wrote. */
  text: string;
}

report.open('notes', 'what a release says on the page it is published to');

if (process.stdin.isTTY) {
  report.bad(`the log is read from stdin — \`make notes\`, or \`${LOG} | node scripts/notes.ts\``);
  process.exit(1);
}

const log: Commit[] = readFileSync(0, 'utf8').split('\n').filter(Boolean).map((line) => {
  const [sha = '', refs = '', subject = ''] = line.split(FIELD);
  const [, scope = '', text = subject] = SCOPE.exec(subject) ?? [];
  return { sha, scope, text, tags: refs.split(', ').filter((r) => r.startsWith('tag: ')).map((r) => r.slice(5)) };
});

const argv = process.argv.slice(2);
const root = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as Record<string, never>;
const asked = argv.find((a) => a.startsWith('--tag='))?.split('=')[1] ?? argv.find((a) => !a.startsWith('-'));
const version = (asked ?? String(root['version'])).replace(/^v/, '');
const tag = `v${version}`;

/* Where the range starts. A tag that is not in the log yet is the normal case
   on a desk — the notes are read before the release is cut — and the tip is
   then whatever the branch is at. */
const at = log.findIndex((commit) => commit.tags.includes(tag));
const pending = at < 0;

let previous = '';
const range: Commit[] = [];
for (const commit of log.slice(Math.max(at, 0))) {
  previous = commit.tags.find((t) => RELEASED.test(t) && t !== tag) ?? '';
  if (previous) break;
  range.push(commit);
}

const changes = range.filter((commit) => !BUMP.test(`${commit.scope}: ${commit.text}`));
const groups = new Map<string, Commit[]>();
for (const commit of changes) groups.set(commit.scope, [...(groups.get(commit.scope) ?? []), commit]);
const ordered = [...groups].sort(([a], [b]) => rank(a).localeCompare(rank(b)));

/* Every package, as the command that installs it and the page it is published
   to — read from the manifests rather than spelt here, so a package added to
   `PACKAGES` is a package this document already names. The frontend comes
   first: it is the system, and the theme is one way of publishing with it. */
const installs = PACKAGES.map((pkg) => {
  const dir = pkg.at(ROOT);
  if (!dir) return undefined;
  const json = JSON.parse(readFileSync(join(dir, pkg.manifest), 'utf8')) as Record<string, never>;
  const name = String(json['name']);
  const npm = pkg.manifest === 'package.json';
  const peers = Object.keys((json['peerDependencies'] ?? {}) as Record<string, string>);
  return {
    name,
    npm,
    command: npm
      ? `npm install ${[`${name}@${version}`, ...peers].join(' ')}`
      : `composer require ${name}:^${version}`,
    registry: npm ? `https://www.npmjs.com/package/${name}` : `https://packagist.org/packages/${name}`,
    where: npm ? 'npm' : 'Packagist',
    mirror: pkg.remote.replace(/^git@github\.com:/, 'https://github.com/').replace(/\.git$/, ''),
  };
}).filter((pkg) => pkg !== undefined).sort((a, b) => Number(b.npm) - Number(a.npm));

const slug = /github\.com[/:]([^/]+\/[^/.]+)/.exec(String((root['repository'] as unknown as Record<string, string>)['url']))?.[1] ?? '';
const [owner = '', name = ''] = slug.split('/');
const repo = `https://github.com/${slug}`;
/* Where Pages serves a project site from, which is where the manual is. */
const manual = `https://${owner.toLowerCase()}.github.io/${name}/`;

const body = [
  `The Soul design system at **${version}** — the tokens, the \`sds-\` class layer and the elements`,
  'that upgrade it, with the packages below cut from this tag.',
  '',
  '## Install',
  '',
  '```sh',
  ...installs.map((pkg) => pkg.command),
  '```',
  '',
  'No install is needed for a page that only links files: `packages/frontend/dist/` in this tag is the',
  'drop-in — the stylesheet, the script and the faces beside them, copied somewhere public and linked.',
  '',
];

if (ordered.length) {
  body.push('## What changed', '');
  for (const [scope, commits] of ordered) {
    if (scope) body.push(`### ${scope}`, '');
    for (const commit of commits) body.push(`- ${commit.text} ([\`${commit.sha}\`](${repo}/commit/${commit.sha}))`);
    body.push('');
  }
}

body.push(
  '## Where the rest of it is',
  '',
  `- [The manual](${manual}) — the design rules, every component, and the theme's own pages`,
  ...installs.map((pkg) => `- [\`${pkg.name}\`](${pkg.registry}) on ${pkg.where}, mirrored to [${pkg.mirror.replace('https://github.com/', '')}](${pkg.mirror})`),
  '',
  previous
    ? `**Every commit in this release**: [${previous}…${tag}](${repo}/compare/${previous}...${tag})`
    : `**Every commit in this release**: [the whole history](${repo}/commits/${tag})`,
  '',
);

mkdirSync(dirname(NOTES), { recursive: true });
writeFileSync(NOTES, `${body.join('\n')}\n`);

report.align([...changes.map((c) => ({ name: c.scope, label: c.text })),
  ...range.map((c) => ({ name: c.scope, label: c.text }))]);
for (const [, commits] of ordered) for (const commit of commits) report.row('ok', commit.scope, commit.text, commit.sha);
for (const commit of range.filter((c) => !changes.includes(c))) report.row('skip', commit.scope, commit.text, commit.sha);

if (pending) report.note(`${tag} is not a tag here yet — this is what it would say, from the branch as it stands`);
if (!changes.length) report.note(`nothing changed since ${previous || 'the first commit'} — the page would carry the install and the links alone`);

report.close('ok', `${NOTES.replace(`${ROOT}/`, '')} — ${tag}${previous ? `, from ${previous}` : ''}`);
