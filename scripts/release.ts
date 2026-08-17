#!/usr/bin/env node
/* The version this repository releases under, and the commands that release it.

     make release ARGS=0.2.0     write it into every file that carries it
     make release ARGS=--check   the gate: do they all still say the same

   A release is a tag here, and both packages take it: the mirrors carry the
   tag over, Packagist reads the theme's version straight off it, and npm reads
   the frontend's out of a manifest instead — which is why the number is
   written down at all, and why the copies are held against each other.
   Nothing is committed: git is not in the image, and a release is a decision. */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

type Json = Record<string, unknown>;

/** Every place the version is written, and the path to it. The lock file names
    it three times — its own, the workspace root's, and the one package in it —
    and `npm ci` refuses to install against a lock that disagrees. */
const PLACES: readonly { file: string; path: readonly string[] }[] = [
  { file: 'package.json', path: ['version'] },
  { file: 'package-lock.json', path: ['version'] },
  { file: 'package-lock.json', path: ['packages', '', 'version'] },
  { file: 'package-lock.json', path: ['packages', 'packages/frontend', 'version'] },
  { file: 'packages/frontend/package.json', path: ['version'] },
];

/** The theme takes its version from the tag and must not carry one of its own:
    a field here is a second number, and the one nothing regenerates. */
const THEME = 'packages/guides-theme/composer.json';

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

const files = new Map<string, Json>();
const read = (file: string): Json => {
  const held = files.get(file);
  if (held) return held;
  const json = JSON.parse(readFileSync(join(ROOT, file), 'utf8')) as Json;
  files.set(file, json);
  return json;
};

const node = (json: Json, path: readonly string[]): Json | undefined =>
  path.slice(0, -1).reduce<Json | undefined>((held, key) => held?.[key] as Json | undefined, json);
const key = (path: readonly string[]): string => path[path.length - 1] as string;
/** Where in a file the version sits, spelt the way the file spells it. */
const inside = (path: readonly string[]): string => path.reduce(
  (text, step, i) => (i === 0 ? step : i === path.length - 1 ? `${text}.${step}` : `${text}[${JSON.stringify(step)}]`), '');
const spot = ({ file, path }: { file: string; path: readonly string[] }): string => `${file} → ${inside(path)}`;

/** How the tag is spelt. The manifests carry the number, the tag carries a `v`
    in front of it, and a release is the two saying the same thing. */
const tagged = (version: string): string => `v${version}`;

/** Newer, in the one direction a release may go. A prerelease sorts under the
    version it leads to, which is what takes 0.1.0-dev to 0.1.0. */
function newer(next: string, than: string): boolean {
  const [, a1 = '0', a2 = '0', a3 = '0', pre = ''] = SEMVER.exec(next) ?? [];
  const [, b1 = '0', b2 = '0', b3 = '0', was = ''] = SEMVER.exec(than) ?? [];
  const triple = [Number(a1) - Number(b1), Number(a2) - Number(b2), Number(a3) - Number(b3)].find(Boolean);
  if (triple) return triple > 0;
  if (Boolean(pre) !== Boolean(was)) return !pre;
  return pre > was;
}

const argv = process.argv.slice(2);
const asked = argv.find((a) => !a.startsWith('-'))?.replace(/^v/, '');
const tag = argv.find((a) => a.startsWith('--tag='))?.split('=')[1];

/* ---- the gate's question: is there one version, and is it a version ---- */

if (argv.includes('--check')) {
  report.open('release', 'the manifests name one version');
  report.align(PLACES.map((place) => ({ name: place.file, label: inside(place.path) })));

  const problems: string[] = [];
  const found = new Set<string>();
  for (const place of PLACES) {
    const value = node(read(place.file), place.path)?.[key(place.path)];
    const wrong = typeof value !== 'string'
      ? `${spot(place)} carries no version`
      : SEMVER.test(value) ? '' : `${spot(place)} is "${value}", which is not a version`;
    if (typeof value === 'string') found.add(value);
    if (wrong) problems.push(wrong);
    report.row(wrong ? 'bad' : 'ok', place.file, inside(place.path), typeof value === 'string' ? value : '—');
  }
  if (found.size > 1) {
    problems.push(`the manifests name ${[...found].join(' and ')} — one release is one version, and \`make release ARGS=<version>\` writes them together`);
  }
  if (typeof read(THEME)['version'] === 'string') {
    problems.push(`${THEME} carries a version — the theme takes it from the tag, and a second copy is one nothing updates`);
  }
  const version = [...found].join(' / ') || 'nothing';
  if (tag && (found.size !== 1 || tag !== tagged(version))) {
    problems.push(`the tag is ${tag} and the manifests name ${version} — the tag is what a consumer installs`);
  }

  report.summary(`${version}${tag ? ` · tagged ${tag}` : ''}`, problems);
  process.exit(problems.length ? 1 : 0);
}

/* ---- writing one ---- */

report.open('release', 'the version this repository releases under');
report.align(PLACES.map((place) => ({ name: place.file, label: inside(place.path) })));

const current = String(node(read('package.json'), ['version'])?.['version'] ?? '');

if (!asked) {
  report.bad(`say which version — \`make release ARGS=<version>\`, and this tree is at ${current}`);
  process.exit(1);
}
if (!SEMVER.test(asked)) {
  report.bad(`"${asked}" is not a version — three numbers, and a prerelease after a dash`);
  process.exit(1);
}
if (!newer(asked, current)) {
  report.bad(`${asked} is not newer than ${current} — a released version is never rewritten`);
  process.exit(1);
}

for (const place of PLACES) {
  const held = node(read(place.file), place.path);
  if (!held) {
    report.bad(`${spot(place)} is not in this tree — the manifests moved and this list did not`);
    process.exit(1);
  }
  held[key(place.path)] = asked;
  report.row('ok', place.file, inside(place.path), `${current} → ${asked}`);
}
for (const [file, json] of files) {
  if (PLACES.some((place) => place.file === file)) writeFileSync(join(ROOT, file), `${JSON.stringify(json, null, 2)}\n`);
}

console.log();
report.fact('nothing is committed, tagged or pushed. That is yours to run, on the host,');
report.fact('and the gate first — a tag is not taken back:');
console.log();
for (const line of [
  'make verify && make test',
  `git add ${[...new Set(PLACES.map((p) => p.file))].join(' ')}`,
  `git commit -m "release: ${asked}"`,
  `git tag -a ${tagged(asked)} -m "${asked}"`,
  'git push origin main --follow-tags',
]) report.fact(`  ${line}`);

report.close('ok', `${asked} is written into the manifests, and nothing else has happened`);
