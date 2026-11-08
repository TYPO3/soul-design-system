#!/usr/bin/env node
/* What the release page says, written from the commits behind the tag.

     make notes                 what the next release will say
     make notes ARGS=v0.1.1     what a tag said

   The log arrives on stdin because git is not in this image. The same split
   `make release` makes: the host has the history, the container turns it
   into the document. `.github/workflows/ci.yml` pipes the same command into
   the same script and hands the file to `gh release create`. So what a
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
/** `[!!!][TYPE] Subject`, the TYPO3 format every commit here follows. */
const TYPED = /^(\[!!!\])?\[([A-Z]+)\] (.+)$/;
/** The format before it, `<scope>: <sentence>`, which older tags still hold. */
const SCOPED = /^[a-z][a-z0-9-, ]*: (.+)$/;
/** The version bump: what the tag points at, not something that changed. */
const BUMP = /^(\[RELEASE\] |release: \d)/;

/** The heading of each group, in the order the page lists them. A change
    that breaks a project comes first, whatever its type. */
const GROUPS: readonly (readonly [key: string, heading: string])[] = [
  ['!!!', 'Breaking changes'],
  ['SECURITY', 'Security'],
  ['FEATURE', 'Features'],
  ['BUGFIX', 'Bugfixes'],
  ['TASK', 'Tasks'],
  ['DOCS', 'Documentation'],
  ['', 'Other changes'],
];
const rank = (key: string): number => {
  const at = GROUPS.findIndex(([group]) => group === key);
  return at < 0 ? GROUPS.length : at;
};

interface Commit {
  sha: string;
  tags: string[];
  /** The group it lists under: `!!!`, a type, or empty. */
  scope: string;
  /** The subject with its type taken off — the sentence the commit wrote. */
  text: string;
  /** The whole subject, as git has it. */
  subject: string;
}

report.open('notes', 'what a release says on its page');

if (process.stdin.isTTY) {
  report.bad(`the log comes from stdin — \`make notes\`, or \`${LOG} | node scripts/notes.ts\``);
  process.exit(1);
}

/* The log as a stream. One read of a pipe that `docker compose exec` hands
   over non-blocking fails with EAGAIN while the data is still on its way. */
let piped = '';
for await (const chunk of process.stdin) piped += chunk;

const log: Commit[] = piped.split('\n').filter(Boolean).map((line) => {
  const [sha = '', refs = '', subject = ''] = line.split(FIELD);
  const typed = TYPED.exec(subject);
  const type = typed?.[2] ?? '';
  const scope = typed?.[1] ? '!!!' : GROUPS.some(([key]) => key === type) ? type : '';
  const text = typed ? (typed[3] ?? subject) : (SCOPED.exec(subject)?.[1] ?? subject);
  return { sha, scope, text, subject, tags: refs.split(', ').filter((r) => r.startsWith('tag: ')).map((r) => r.slice(5)) };
});

const argv = process.argv.slice(2);
const root = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as Record<string, never>;
const asked = argv.find((a) => a.startsWith('--tag='))?.split('=')[1] ?? argv.find((a) => !a.startsWith('-'));
const version = (asked ?? String(root['version'])).replace(/^v/, '');
const tag = `v${version}`;

/* Where the range starts. A tag that is not in the log yet is the normal case
   on a desk, as a maintainer reads the notes before the release. The tip is
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

const changes = range.filter((commit) => !BUMP.test(commit.subject));
const groups = new Map<string, Commit[]>();
for (const commit of changes) groups.set(commit.scope, [...(groups.get(commit.scope) ?? []), commit]);
const ordered = [...groups].sort(([a], [b]) => rank(a) - rank(b));

/* Every package, as the command that installs it and the page it ships to.
   Read from the manifests rather than spelt here, so a package added to
   `PACKAGES` is a package this document already names. The frontend comes
   first: it is the system, and the theme is one way to publish with it. */
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
  'A page that only links files needs no install: `packages/frontend/dist/` in this tag is the',
  'drop-in — the stylesheet, the script and the faces beside them, copied somewhere public and linked.',
  '',
];

if (ordered.length) {
  body.push('## What changed', '');
  for (const [scope, commits] of ordered) {
    body.push(`### ${GROUPS.find(([key]) => key === scope)?.[1] ?? 'Other changes'}`, '');
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

if (pending) report.note(`${tag} is not a tag here yet — this is what it will say, from the branch as it stands`);
if (!changes.length) report.note(`nothing changed since ${previous || 'the first commit'} — the page carries the install and the links alone`);

report.close('ok', `${NOTES.replace(`${ROOT}/`, '')} — ${tag}${previous ? `, from ${previous}` : ''}`);
