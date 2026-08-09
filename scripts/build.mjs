#!/usr/bin/env node
/* Assemble the claude.ai/design upload bundle from this repo.

   This design system is HTML and CSS — there is no React package to compile,
   so the standard design-sync converter does not apply. The output contract
   is the same either way, and this produces it:

     _ds_bundle.js    namespace stub carrying the @ds-bundle header
     _ds_bundle.css   the component layer (components.css)
     styles.css       tokens + _ds_bundle.css — the whole design-facing closure
     components/<Group>/<Name>/<Name>.html      the specimen card
                      .../<Name>.prompt.md      what the design agent reads
     tokens/ fonts/ assets/ guidelines/ README.md
     _ds_sync.json    content hashes, so a re-sync knows what moved
     _ds_needs_recompile  sentinel the app's self-check consumes

     node scripts/build.mjs [outdir]
*/
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { byGroup, cards, ROOT } from './lib/cards.mjs';

const OUT = resolve(process.argv[2] ?? join(ROOT, 'ds-bundle'));
const NS = 'T3SA';

const sha12 = (b) => createHash('sha256').update(b).digest('hex').slice(0, 12);
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

/** Cards move to components/<Group>/<Name>/ — three levels down from the root. */
function rewriteDepth(txt) {
  return txt
    .replace(/href="(?:\.\.\/)+styles\.css"/g, 'href="../../../styles.css"')
    .replace(/href="(?:\.\.\/)+_specimen\.css"/g, 'href="../../../_specimen.css"')
    .replace(/src="(?:\.\.\/)+assets\//g, 'src="../../../assets/');
}

function classesUsed(txt) {
  const found = new Set();
  for (const m of txt.matchAll(/class="([^"]*)"/g)) {
    for (const c of m[1].split(/\s+/)) if (c.startsWith('tsa-')) found.add(c);
  }
  return [...found].sort();
}

/** A readable excerpt of the card's own markup: SVGs elided, trimmed. */
function snippet(txt) {
  const body = /<body>([\s\S]*)<\/body>/.exec(txt);
  if (!body) return '';
  let s = body[1].replace(/<svg[\s\S]*?<\/svg>/g, '<svg class="tsa-icon">…</svg>');
  const lines = s.replace(/\n\s*\n/g, '\n').trim().split('\n');
  return (lines.length > 26 ? [...lines.slice(0, 26), '  <!-- … -->'] : lines).join('\n');
}

function promptDoc(c) {
  const cls = classesUsed(c.text);
  const out = [c.subtitle ? `${c.label} — ${c.subtitle}` : c.label, ''];
  out.push(`Group: ${c.group}. Rendered at ${c.viewport}.`, '');
  if (cls.length) {
    out.push('## Classes this uses', '', ...cls.map((x) => `- \`.${x}\``), '');
  }
  out.push(
    '## How to build it', '',
    'Link `styles.css` — it carries the tokens and the whole component layer.',
    'Copy the markup below rather than inventing a variant; every class in it is',
    'defined in `_ds_bundle.css` and every value comes from a token.', '',
    '```html', snippet(c.text), '```', '',
  );
  return out.join('\n');
}

function countFiles(dir) {
  let n = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    n += e.isDirectory() ? countFiles(join(dir, e.name)) : 1;
  }
  return n;
}

// ---------------------------------------------------------------------------

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const list = cards();

// styling closure
for (const d of ['tokens', 'fonts', 'assets']) cpSync(join(ROOT, d), join(OUT, d), { recursive: true });
cpSync(join(ROOT, 'components.css'), join(OUT, '_ds_bundle.css'));
cpSync(join(ROOT, '_specimen.css'), join(OUT, '_specimen.css'));
const styles = read('styles.css').replace('@import "components.css";', '@import "./_ds_bundle.css";');
writeFileSync(join(OUT, 'styles.css'), styles);

// namespace stub: no React components, so the namespace is deliberately empty
const header = {
  namespace: NS,
  components: [],
  sourceHashes: { 'components.css': sha12(read('components.css')), 'styles.css': sha12(styles) },
  inlinedExternals: [],
};
writeFileSync(join(OUT, '_ds_bundle.js'),
  `/* @ds-bundle: ${JSON.stringify(header)} */\n(function(){window.${NS}=window.${NS}||{};})();\n`);

// cards
const renderHashes = {}, sourceKeys = {};
for (const c of list) {
  const dir = join(OUT, 'components', c.group, c.name);
  mkdirSync(dir, { recursive: true });
  const html = rewriteDepth(c.text);
  writeFileSync(join(dir, `${c.name}.html`), html);
  writeFileSync(join(dir, `${c.name}.prompt.md`), promptDoc(c));
  renderHashes[c.name] = sha12(html);
  sourceKeys[c.name] = sha12(c.text);
}

// written guidance
mkdirSync(join(OUT, 'guidelines'), { recursive: true });
cpSync(join(ROOT, 'SKILL.md'), join(OUT, 'guidelines/build-rules.md'));
cpSync(join(ROOT, 'RATIONALE.md'), join(OUT, 'guidelines/rationale.md'));

// README: the conventions header, then a generated index of every card
const conv = join(ROOT, '.design-sync/conventions.md');
const parts = existsSync(conv) ? [`${readFileSync(conv, 'utf8').trimEnd()}\n\n`] : [];
parts.push('## Every card in this system\n\n');
for (const [group, items] of byGroup(list)) {
  parts.push(`### ${group}\n\n`);
  for (const c of [...items].sort((a, b) => a.name.localeCompare(b.name))) {
    parts.push(`- **${c.label}** — ${c.subtitle} \`components/${group}/${c.name}/${c.name}.prompt.md\`\n`);
  }
  parts.push('\n');
}
const readme = parts.join('');
writeFileSync(join(OUT, 'README.md'), readme);
if (readme.length > 31900) {
  console.log(`  ! README is ${readme.length} chars — the app inlines only the first 32,000`);
}

// sync anchor + sentinel
writeFileSync(join(OUT, '_ds_needs_recompile'), JSON.stringify({ by: 'design-sync-cli' }));
writeFileSync(join(OUT, '.ds-build-meta.json'),
  JSON.stringify({ componentCount: list.length, shape: 'css-design-system' }, null, 2));
writeFileSync(join(OUT, '_ds_sync.json'), JSON.stringify({
  shape: 'css-design-system',
  styleSha: sha12(styles + read('components.css')),
  renderHashes,
  sourceKeys,
  keyRecipe: 'sha256-12 of the card html as emitted',
  scriptsSha: sha12(readFileSync(join(ROOT, 'scripts/build.mjs'))),
  sourceHashes: header.sourceHashes,
  auxSha: sha12(readdirSync(join(OUT, 'tokens')).sort().join(',')),
  bundleSha12: sha12(readFileSync(join(OUT, '_ds_bundle.js'))),
}, null, 2));

const groups = byGroup(list);
console.log(`built ${OUT}`);
console.log(`  ${list.length} cards in ${groups.size} groups, ${countFiles(OUT)} files`);
console.log(`  groups: ${[...groups].map(([k, v]) => `${k} (${v.length})`).join(', ')}`);
