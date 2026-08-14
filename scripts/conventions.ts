#!/usr/bin/env node
/* Check that every name in .design-sync/conventions.md still exists.

   That file is inlined into the design agent's prompt and trusted completely:
   name a class that does not resolve and the agent writes markup that silently
   does nothing. So the names are checked against the built stylesheets rather
   than against memory. It never rewrites the file — drift is reported for a
   human to resolve, because the prose is theirs.

     make verify
*/
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { GENERATED, ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

const DOC = join(ROOT, '.design-sync/conventions.md');
const OUT = join(GENERATED, 'bundle');

report.open('conventions', 'the header names what the build defines');

if (!existsSync(DOC)) {
  report.summary('no conventions.md — nothing to check');
  process.exit(0);
}
if (!existsSync(join(OUT, '_ds_bundle.css'))) {
  report.summary('no build to check against', ['run `make build` first']);
  process.exit(1);
}

const doc = readFileSync(DOC, 'utf8');
const css = readFileSync(join(OUT, '_ds_bundle.css'), 'utf8')
  + readdirSync(join(OUT, 'tokens')).map((f) => readFileSync(join(OUT, 'tokens', f), 'utf8')).join('\n');

const definedClasses = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].flatMap((m) => (m[1] ? [m[1]] : [])));

/* Tags are named in the same prose and the same backticks but never appear in
   the CSS, the elements putting their classes on what they produce. So the
   authority is the bundle that registers them, checked against the `@ds-bundle`
   header — a tag nothing registers is the same failure as a class nothing
   defines: the agent writes it and it stays an unknown element forever. */
interface BundleHeader {
  components?: { tag?: string }[];
}

const definedTags = new Set<string>();
try {
  const header = /@ds-bundle:\s*(\{[\s\S]*?\})\s*\*\//.exec(readFileSync(join(OUT, '_ds_bundle.js'), 'utf8'));
  if (!header?.[1]) throw new Error('no @ds-bundle header');
  const parsed = JSON.parse(header[1]) as BundleHeader;
  for (const c of parsed.components ?? []) if (c.tag) definedTags.add(c.tag);
} catch {
  report.note('could not read the bundle header — element tags unchecked');
}
const definedTokens = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].flatMap((m) => (m[1] ? [m[1]] : [])));

/* Names appear in backticks: bare (`sds-btn`), pipe-compressed
   (`sds-code__head|__body`), or as a family base followed by its modifiers
   in a table row (`sds-btn` + `--primary` `--secondary`). */
const named = new Set<string>();
/* `--scroll` in a table row is a modifier, not a token, but is spelled exactly
   like one and the token check below would look for a custom property by that
   name. A modifier is whatever the row logic already consumed as one — a
   hand-kept list of words to ignore fails every time a new modifier is added. */
const modifiers = new Set<string>();
for (const line of doc.split('\n')) {
  const ticked = [...line.matchAll(/`([^`]+)`/g)].flatMap((m) => (m[1] ? [m[1]] : []));
  for (const item of ticked) {
    /* `sds-diff__line--add|--del` means line--add and line--del, not
       diff--add and diff--del: the alternative replaces the last segment of
       the same kind, not everything after the prefix. */
    if (item.includes('|') && item.startsWith('sds-')) {
      const [first = '', ...rest] = item.split('|');
      named.add(first);
      for (const alt of rest) {
        const kind = alt.startsWith('__') ? '__' : '--';
        const cut = first.lastIndexOf(kind);
        named.add((cut === -1 ? first : first.slice(0, cut)) + alt);
      }
      continue;
    }
    for (const tok of item.split(/[\s/]+/)) if (tok.startsWith('sds-')) named.add(tok);
  }
  if (line.startsWith('|')) {
    const base = ticked.find((t) => t.startsWith('sds-'));
    const mods = [...line.matchAll(/`(--[a-z0-9-]+)`/g)].flatMap((m) => (m[1] ? [m[1]] : []));
    if (base && mods.length) for (const m of mods) { named.add(base + m); modifiers.add(m); }
  }
}
named.delete('sds-');   // the prose names the prefix itself

/* Token prefixes are written with a trailing star (`--surface-*`). */
const prefixes = [...doc.matchAll(/`(--[a-z0-9-]*)\*`/g)].flatMap((m) => (m[1] ? [m[1]] : []));
const exactTokens = [...doc.matchAll(/`(--[a-z][a-z0-9-]+)`/g)].flatMap((m) => (m[1] ? [m[1]] : []))
  .filter((t) => definedTokens.size && !modifiers.has(t) && !/^--(modifier)$/.test(t));

const missingClasses = [...named].filter((c) => !definedClasses.has(c) && !definedTags.has(c)).sort();
const namedTags = [...named].filter((c) => definedTags.has(c));

/* And the other direction, for tags only. A tag the bundle registers but this
   file never mentions is the quieter failure: the element exists and works, and
   nothing ever reaches for it, because the only document the agent reads does
   not say it is there. Classes are not checked this way — the stylesheet
   carries internal names the prose deliberately does not list. */
const unnamedTags = [...definedTags].filter((t) => !named.has(t)).sort();
const missingPrefixes = [...new Set(prefixes)]
  .filter((p) => ![...definedTokens].some((d) => d.startsWith(p))).sort();
const missingTokens = [...new Set(exactTokens)].filter((t) => !definedTokens.has(t)).sort();

const bad = [...missingClasses, ...missingPrefixes, ...missingTokens];
const problems = [
  ...bad.map((n) => `${n} is named in conventions.md and no longer exists — fix the name or cut it; the design agent will trust it`),
  ...unnamedTags.map((n) => `${n} is registered by the bundle and named nowhere in conventions.md — an element the header omits is one nothing will ever use`),
];
report.summary(
  `${named.size - namedTags.length} classes \u00b7 ${namedTags.length} of ${definedTags.size} tags`
    + ` \u00b7 ${new Set(prefixes).size} token families \u00b7 ${new Set(exactTokens).size} exact tokens`,
  problems,
);
process.exit(problems.length ? 1 : 0);
