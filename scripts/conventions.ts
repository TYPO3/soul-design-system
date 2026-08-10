#!/usr/bin/env node
/* Check that every name in .design-sync/conventions.md still exists.

   That file is prepended to the uploaded README and inlined into the design
   agent's prompt. An agent trusts it completely: name a class that does not
   resolve and it writes markup that silently does nothing — invisible in
   review, wrong in every design afterwards. So the names have to be checked
   against the built stylesheets, not against memory.

   It never rewrites the file. Drift is reported for a human to resolve,
   because the prose is theirs.

     make verify      # also runs as the last step of make verify
*/
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from './lib/cards.ts';

const DOC = join(ROOT, '.design-sync/conventions.md');
const OUT = join(ROOT, 'ds-bundle');

if (!existsSync(DOC)) {
  console.log('   no conventions.md — nothing to check');
  process.exit(0);
}
if (!existsSync(join(OUT, '_ds_bundle.css'))) {
  console.log('   no build to check against — `make build` first');
  process.exit(1);
}

const doc = readFileSync(DOC, 'utf8');
const css = readFileSync(join(OUT, '_ds_bundle.css'), 'utf8')
  + readdirSync(join(OUT, 'tokens')).map((f) => readFileSync(join(OUT, 'tokens', f), 'utf8')).join('\n');

const definedClasses = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].flatMap((m) => (m[1] ? [m[1]] : [])));

/* Custom element tags are named in the same prose and in the same backticks,
   but they are not classes and never appear in the CSS — the elements render
   light DOM and put the classes on what they produce. The authority for a tag
   is the bundle that registers it, so they are checked against the
   `@ds-bundle` header rather than against the stylesheet. A tag named here
   that nothing registers is the same failure as a class nothing defines: the
   agent writes it, and it stays an unknown element forever. */
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
  console.log('   ! could not read the bundle header — element tags unchecked');
}
const definedTokens = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].flatMap((m) => (m[1] ? [m[1]] : [])));

/* Names appear in backticks: bare (`sds-btn`), pipe-compressed
   (`sds-code__head|__body`), or as a family base followed by its modifiers
   in a table row (`sds-btn` + `--primary` `--secondary`). */
const named = new Set<string>();
/* `--scroll` in a table row is a modifier, not a token — but it is spelled
   exactly like one, and the token check below would go looking for a custom
   property by that name. This used to be a hand-kept list of words to ignore
   (`primary|secondary|ghost|sm|…`), which meant every new modifier failed
   verify until someone remembered to add it there. A modifier is now whatever
   the row logic already consumed as one. */
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

/* And the other direction, for tags only.

   A name that no longer resolves makes the agent write something broken. A
   tag the bundle registers but this file never mentions is quieter and lasts
   longer: the element exists, works, and is styled — and nothing ever reaches
   for it, because the only document the agent reads does not say it is there.
   That is how this header went on describing nine elements while the bundle
   shipped seventeen.

   Classes are not checked this way on purpose. `_ds_bundle.css` carries
   internal and state classes that the prose deliberately does not list; the
   tag list is the public surface and is meant to be complete. */
const unnamedTags = [...definedTags].filter((t) => !named.has(t)).sort();
const missingPrefixes = [...new Set(prefixes)]
  .filter((p) => ![...definedTokens].some((d) => d.startsWith(p))).sort();
const missingTokens = [...new Set(exactTokens)].filter((t) => !definedTokens.has(t)).sort();

console.log(`   ${named.size - namedTags.length} classes, ${namedTags.length} of ${definedTags.size} element tags, ${new Set(prefixes).size} token families, ${new Set(exactTokens).size} exact tokens named`);
const bad = [...missingClasses, ...missingPrefixes, ...missingTokens];
if (bad.length) {
  console.log(`   ✗ ${bad.length} name(s) in conventions.md no longer exist:`);
  for (const n of bad) console.log(`     ${n}`);
  console.log('   Fix the name or cut it — do not leave it; the design agent will trust it.');
  process.exit(1);
}
if (unnamedTags.length) {
  console.log(`   ✗ ${unnamedTags.length} element(s) the bundle registers are not named in conventions.md:`);
  for (const n of unnamedTags) console.log(`     ${n}`);
  console.log('   Add them — an element the header omits is one nothing will ever use.');
  process.exit(1);
}
console.log('   every name still resolves, every element is named');
