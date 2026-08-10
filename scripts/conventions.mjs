#!/usr/bin/env node
/* Check that every name in .design-sync/conventions.md still exists.

   That file is prepended to the uploaded README and inlined into the design
   agent's prompt. An agent trusts it completely: name a class that does not
   resolve and it writes markup that silently does nothing — invisible in
   review, wrong in every design afterwards. So the names have to be checked
   against the built stylesheets, not against memory.

   It never rewrites the file. Drift is reported for a human to resolve,
   because the prose is theirs.

     npm run conventions      # also runs as the last step of npm run verify
*/
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from './lib/cards.mjs';

const DOC = join(ROOT, '.design-sync/conventions.md');
const OUT = join(ROOT, 'ds-bundle');

if (!existsSync(DOC)) {
  console.log('   no conventions.md — nothing to check');
  process.exit(0);
}
if (!existsSync(join(OUT, '_ds_bundle.css'))) {
  console.log('   no build to check against — `npm run build` first');
  process.exit(1);
}

const doc = readFileSync(DOC, 'utf8');
const css = readFileSync(join(OUT, '_ds_bundle.css'), 'utf8')
  + readdirSync(join(OUT, 'tokens')).map((f) => readFileSync(join(OUT, 'tokens', f), 'utf8')).join('\n');

const definedClasses = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]));
const definedTokens = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));

/* Names appear in backticks: bare (`tsa-btn`), pipe-compressed
   (`tsa-code__head|__body`), or as a family base followed by its modifiers
   in a table row (`tsa-btn` + `--primary` `--secondary`). */
const named = new Set();
for (const line of doc.split('\n')) {
  const ticked = [...line.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
  for (const item of ticked) {
    /* `tsa-diff__line--add|--del` means line--add and line--del, not
       diff--add and diff--del: the alternative replaces the last segment of
       the same kind, not everything after the prefix. */
    if (item.includes('|') && item.startsWith('tsa-')) {
      const [first, ...rest] = item.split('|');
      named.add(first);
      for (const alt of rest) {
        const kind = alt.startsWith('__') ? '__' : '--';
        const cut = first.lastIndexOf(kind);
        named.add((cut === -1 ? first : first.slice(0, cut)) + alt);
      }
      continue;
    }
    for (const tok of item.split(/[\s/]+/)) if (tok.startsWith('tsa-')) named.add(tok);
  }
  if (line.startsWith('|')) {
    const base = ticked.find((t) => t.startsWith('tsa-'));
    const mods = [...line.matchAll(/`(--[a-z0-9-]+)`/g)].map((m) => m[1]);
    if (base && mods.length) for (const m of mods) named.add(base + m);
  }
}
named.delete('tsa-');   // the prose names the prefix itself

/* Token prefixes are written with a trailing star (`--surface-*`). */
const prefixes = [...doc.matchAll(/`(--[a-z0-9-]*)\*`/g)].map((m) => m[1]);
const exactTokens = [...doc.matchAll(/`(--[a-z][a-z0-9-]+)`/g)].map((m) => m[1])
  .filter((t) => definedTokens.size && !/^--(primary|secondary|ghost|sm|icon|ok|warn|error|info|accent|muted|compact|medium|airy|add|del|external|modifier|20|24)$/.test(t));

const missingClasses = [...named].filter((c) => !definedClasses.has(c)).sort();
const missingPrefixes = [...new Set(prefixes)]
  .filter((p) => ![...definedTokens].some((d) => d.startsWith(p))).sort();
const missingTokens = [...new Set(exactTokens)].filter((t) => !definedTokens.has(t)).sort();

console.log(`   ${named.size} classes, ${new Set(prefixes).size} token families, ${new Set(exactTokens).size} exact tokens named`);
const bad = [...missingClasses, ...missingPrefixes, ...missingTokens];
if (bad.length) {
  console.log(`   ✗ ${bad.length} name(s) in conventions.md no longer exist:`);
  for (const n of bad) console.log(`     ${n}`);
  console.log('   Fix the name or cut it — do not leave it; the design agent will trust it.');
  process.exit(1);
}
console.log('   every name still resolves');
