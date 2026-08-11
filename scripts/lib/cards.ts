/* Card discovery and the @dsCard contract.

   A specimen card is any .html under `specimens/components/` or
   `specimens/guidelines/` whose FIRST
   line is a @dsCard comment. That line is the contract with the Design
   System pane: it supplies the group, the label, the subtitle and the
   viewport the card is rendered at. Everything downstream — the bundle, the
   fit check, the screenshots — reads cards through here, so there is one
   parser and not five. */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const SKIP = new Set(['node_modules', 'ds-bundle', 'fonts', 'assets']);
const CARD_RE = /@dsCard\s+([\s\S]*?)-->/;
const SP_RE = /@startingPoint\s+([\s\S]*?)-->/;
const ATTR_RE = /(\w+)="([^"]*)"/g;

/** What every specimen shares, whatever marker declared it. */
interface Specimen {
  /** Absolute path on disk. */
  path: string;
  /** Path from the repo root — what a message should print. */
  rel: string;
  text: string;
  subtitle: string;
  /** `WxH`, verbatim from the marker. */
  viewport: string;
  width: number;
  height: number;
  /** PascalCase, derived from the filename — the name the bundle uses. */
  name: string;
}

export interface Card extends Specimen {
  group: string;
  label: string;
}

export interface Screen extends Specimen {
  section: string;
}

/* Where the specimen trees sit in this repo.

   A card's declared path — what a story writes into `parameters.dsCard` — is
   the path the **bundle** uses, and that is a contract: the pane opens
   `components/<Group>/<Name>/`, and `make plan` writes and deletes under those
   names. Where the file lives here is this repo's business and nobody else's,
   so the difference between the two is said once, in this pair, and everything
   that touches the disk goes through it. */
export const SPECIMENS = 'specimens';

/** A declared path, as a path from the repo root. */
export const inRepo = (declared: string): string => join(SPECIMENS, declared);

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

/** PascalCase component name from a `brand-lockup.card.html` style filename. */
export function pascal(basename: string): string {
  return basename
    .replace(/\.card$/, '')
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => (w[0] ?? '').toUpperCase() + w.slice(1))
    .join('');
}

const attrs = (marker: string): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const a of marker.matchAll(ATTR_RE)) {
    if (a[1] && a[2] !== undefined) out[a[1]] = a[2];
  }
  return out;
};


const sizeOf = (viewport: string): [number, number] => {
  const [w, h] = viewport.split('x');
  return [Number(w), Number(h)];
};

const stemOf = (path: string): string => (path.split('/').pop() ?? '').replace(/\.html$/, '');

/** Every card, sorted by path, with its marker parsed. Files without a
    `@dsCard` first line are not cards and are skipped in silence — `verify`
    is where a missing marker is an error. */
export function cards(): Card[] {
  const found: string[] = [];
  for (const root of ['components', 'guidelines']) {
    const base = join(ROOT, SPECIMENS, root);
    try {
      if (!statSync(base).isDirectory()) continue;
    } catch {
      continue;
    }
    found.push(...walk(base));
  }

  const out = found
    .sort()
    .map((path): Card | null => {
      const text = readFileSync(path, 'utf8');
      const m = CARD_RE.exec(text.slice(0, 600));
      if (!m?.[1]) return null;

      const a = attrs(m[1]);
      const viewport = a['viewport'] ?? '700x400';
      const [width, height] = sizeOf(viewport);
      const stem = stemOf(path);

      return {
        path,
        rel: relative(ROOT, path),
        text,
        group: a['group'] ?? 'Components',
        label: a['name'] ?? pascal(stem),
        subtitle: a['subtitle'] ?? '',
        viewport,
        width,
        height,
        name: pascal(stem),
      };
    })
    .filter((c): c is Card => c !== null);

  /* The bundle addresses a card by name, so two cards cannot share one. */
  const seen = new Map<string, string>();
  for (const c of out) {
    const prev = seen.get(c.name);
    if (prev) throw new Error(`duplicate component name ${c.name}: ${c.rel} and ${prev}`);
    seen.set(c.name, c.rel);
  }
  return out;
}

/* Screens under screens/ are the Starting Points a consuming project can
   seed a new design from. Same contract as a card, different marker and a
   `section` instead of a `group`: the app reads
   `<!-- @startingPoint section="…" subtitle="…" viewport="WxH" -->` as the
   first line. There is no separate thumbnail — the screen is its own. */
export function screens(): Screen[] {
  let files: string[];
  try {
    files = walk(join(ROOT, SPECIMENS, 'screens'));
  } catch {
    return [];
  }

  return files
    .sort()
    .map((path): Screen | null => {
      const text = readFileSync(path, 'utf8');
      const m = SP_RE.exec(text.slice(0, 600));
      if (!m?.[1]) return null;

      const a = attrs(m[1]);
      const viewport = a['viewport'] ?? '1440x900';
      const [width, height] = sizeOf(viewport);

      return {
        path,
        rel: relative(ROOT, path),
        text,
        section: a['section'] ?? 'Screens',
        subtitle: a['subtitle'] ?? '',
        viewport,
        width,
        height,
        name: pascal(stemOf(path)),
      };
    })
    .filter((s): s is Screen => s !== null);
}

/** Group by `group`, alphabetically — the order the bundle and the docs use. */
export function byGroup<T extends { group: string }>(list: readonly T[]): Map<string, T[]> {
  const g = new Map<string, T[]>();
  for (const c of list) {
    const bucket = g.get(c.group);
    if (bucket) bucket.push(c);
    else g.set(c.group, [c]);
  }
  return new Map([...g.entries()].sort(([a], [b]) => a.localeCompare(b)));
}
