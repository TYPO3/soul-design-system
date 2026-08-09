/* Card discovery and the @dsCard contract.

   A specimen card is any .html under components/ or guidelines/ whose FIRST
   line is a @dsCard comment. That line is the contract with the Design
   System pane: it supplies the group, the label, the subtitle and the
   viewport the card is rendered at. Everything downstream — the bundle, the
   gallery, the fit check — reads cards through here so there is one parser,
   not five. */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const SKIP = new Set(['node_modules', 'ds-bundle', 'fonts', 'assets']);
const CARD_RE = /@dsCard\s+([\s\S]*?)-->/;
const ATTR_RE = /(\w+)="([^"]*)"/g;

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

/** PascalCase component name from a `brand-lockup.card.html` style filename. */
export function pascal(basename) {
  return basename
    .replace(/\.card$/, '')
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('');
}

export function cards() {
  const found = [];
  for (const root of ['components', 'guidelines']) {
    let base;
    try {
      base = statSync(join(ROOT, root)).isDirectory() ? join(ROOT, root) : null;
    } catch {
      continue;
    }
    if (base) found.push(...walk(base));
  }
  const out = found.sort().map((path) => {
    const text = readFileSync(path, 'utf8');
    const m = CARD_RE.exec(text.slice(0, 600));
    if (!m) return null;
    const attrs = {};
    for (const a of m[1].matchAll(ATTR_RE)) attrs[a[1]] = a[2];
    const [w, h] = (attrs.viewport ?? '700x400').split('x').map(Number);
    const stem = path.split('/').pop().replace(/\.html$/, '');
    return {
      path,
      rel: relative(ROOT, path),
      text,
      group: attrs.group ?? 'Components',
      label: attrs.name ?? pascal(stem),
      subtitle: attrs.subtitle ?? '',
      viewport: attrs.viewport ?? '700x400',
      width: w,
      height: h,
      /* The theme the card's own <html> pins. A specimen that exists to show
         one mode must not be flipped by the gallery's toggle. */
      theme: /<html[^>]*data-theme="([a-z]+)"/.exec(text)?.[1] ?? 'dark',
      name: pascal(stem),
    };
  }).filter(Boolean);

  const seen = new Map();
  for (const c of out) {
    if (seen.has(c.name)) throw new Error(`duplicate component name ${c.name}: ${c.rel} and ${seen.get(c.name)}`);
    seen.set(c.name, c.rel);
  }
  return out;
}

/* Screens under screens/ are the Starting Points a consuming project can
   seed a new design from. Same contract as a card, different marker and a
   `section` instead of a `group`: the app reads
   `<!-- @startingPoint section="…" subtitle="…" viewport="WxH" -->` as the
   first line. There is no separate thumbnail — the screen is its own. */
const SP_RE = /@startingPoint\s+([\s\S]*?)-->/;

export function screens() {
  let files;
  try {
    files = walk(join(ROOT, 'screens'));
  } catch {
    return [];
  }
  return files.sort().map((path) => {
    const text = readFileSync(path, 'utf8');
    const m = SP_RE.exec(text.slice(0, 600));
    if (!m) return null;
    const attrs = {};
    for (const a of m[1].matchAll(ATTR_RE)) attrs[a[1]] = a[2];
    const [w, h] = (attrs.viewport ?? '1440x900').split('x').map(Number);
    return {
      path,
      rel: relative(ROOT, path),
      text,
      section: attrs.section ?? 'Screens',
      subtitle: attrs.subtitle ?? '',
      viewport: attrs.viewport ?? '1440x900',
      width: w,
      height: h,
      theme: /<html[^>]*data-theme="([a-z]+)"/.exec(text)?.[1] ?? 'dark',
      name: pascal(path.split('/').pop().replace(/\.html$/, '')),
    };
  }).filter(Boolean);
}

export function byGroup(list) {
  const g = new Map();
  for (const c of list) {
    if (!g.has(c.group)) g.set(c.group, []);
    g.get(c.group).push(c);
  }
  return new Map([...g.entries()].sort(([a], [b]) => a.localeCompare(b)));
}
