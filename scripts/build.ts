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

     node scripts/build.ts [outdir]
*/
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import * as esbuild from 'esbuild';

import { byGroup, cards, ROOT, screens, type Card } from './lib/cards.ts';
import { TAGS } from '../src/index.ts';

/** `sds-button` → `SdsButton`, the export name the bundle exposes. */
const pascalTag = (tag: string): string =>
  tag.split('-').map((w) => (w[0] ?? '').toUpperCase() + w.slice(1)).join('');

const OUT = resolve(process.argv[2] ?? join(ROOT, 'ds-bundle'));
const NS = 'SDS';

const sha12 = (b: string | Buffer): string => createHash('sha256').update(b).digest('hex').slice(0, 12);
const read = (p: string): string => readFileSync(join(ROOT, p), 'utf8');

/** Cards move to components/<Group>/<Name>/ — three levels down from the root. */
function rewriteDepth(txt: string): string {
  return txt
    /* The repo keeps its stylesheets in `styles/`; the bundle is flat and has
       them at its root. Both the depth and the directory change here. */
    .replace(/href="(?:\.\.\/)+src\/styles\/styles\.css"/g, 'href="../../../styles.css"')
    .replace(/href="(?:\.\.\/)+src\/styles\/_specimen\.css"/g, 'href="../../../_specimen.css"')
    .replace(/src="(?:\.\.\/)+assets\//g, 'src="../../../assets/');
}

function classesUsed(txt: string): string[] {
  const found = new Set<string>();
  for (const m of txt.matchAll(/class="([^"]*)"/g)) {
    for (const c of (m[1] ?? '').split(/\s+/)) if (c.startsWith('sds-')) found.add(c);
  }
  return [...found].sort();
}

/** A readable excerpt of the card's own markup: SVGs elided, trimmed. */
function snippet(txt: string): string {
  const body = /<body>([\s\S]*)<\/body>/.exec(txt);
  if (!body) return '';
  const s = (body[1] ?? '').replace(/<svg[\s\S]*?<\/svg>/g, '<svg class="sds-icon">…</svg>');
  const lines = s.replace(/\n\s*\n/g, '\n').trim().split('\n');
  return (lines.length > 26 ? [...lines.slice(0, 26), '  <!-- … -->'] : lines).join('\n');
}

function promptDoc(c: Card): string {
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

function countFiles(dir: string): number {
  let n = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    n += e.isDirectory() ? countFiles(join(dir, e.name)) : 1;
  }
  return n;
}

/* Every path that gets uploaded, relative to the bundle root. Recorded in
   the anchor so the next sync can compute deletes for ANY file, not just
   whole components — renaming the font files left 19 orphans in the project
   that a component-level diff could never have seen. */
export function uploadFiles(dir: string, base: string = dir, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = join(dir, e.name);
    const rel = p.slice(base.length + 1);
    const top = rel.split('/')[0] ?? '';
    if (top.startsWith('.') || top === '_screenshots') continue;
    if (e.isDirectory()) uploadFiles(p, base, out);
    else out.push(rel);
  }
  return out;
}

// ---------------------------------------------------------------------------

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const list = cards();

// styling closure
cpSync(join(ROOT, 'src', 'tokens'), join(OUT, 'tokens'), { recursive: true });
for (const d of ['fonts', 'assets']) cpSync(join(ROOT, d), join(OUT, d), { recursive: true });
cpSync(join(ROOT, 'src', 'styles', 'components.css'), join(OUT, '_ds_bundle.css'));
cpSync(join(ROOT, 'src', 'styles', '_specimen.css'), join(OUT, '_specimen.css'));
/* The repo keeps its stylesheets in `styles/` and the tokens one level up;
   the bundle is flat, with `styles.css`, `_ds_bundle.css` and `tokens/` all
   at its root. So both kinds of import are rewritten on the way out — the
   component layer to its bundle name, and the tokens back to siblings. */
const styles = read('src/styles/styles.css')
  .replace('@import "components.css";', '@import "./_ds_bundle.css";')
  .replaceAll('@import "../tokens/', '@import "tokens/');

writeFileSync(join(OUT, 'styles.css'), styles);

/* The real bundle. This namespace used to be deliberately empty — the system
   shipped classes and tokens and nothing to import. It now ships the Lit
   elements in src/ as well, so the design agent can reach them and
   `_adherence.oxlintrc.json` comes back with rules in it instead of empty
   lists.

   The elements render LIGHT DOM and emit the same `sds-` classes, so
   `_ds_bundle.css` remains the single source of truth for styling and a
   hand-written `<button class="sds-btn">` is styled identically. The
   specimen cards stay static HTML with no custom elements in them: the pane
   opens them without this bundle, which is why `scripts/cards.ts` renders
   the same templates to markup instead. */
const bundleSrc = join(ROOT, 'src', 'index.ts');
const built = await esbuild.build({
  entryPoints: [bundleSrc],
  bundle: true,
  format: 'iife',
  globalName: NS,
  target: 'es2022',
  minify: true,
  legalComments: 'none',
  write: false,
});
const bundleJs = built.outputFiles[0]?.text ?? '';

const header = {
  namespace: NS,
  components: TAGS.map((tag) => ({ tag, export: pascalTag(tag) })),
  sourceHashes: { 'components.css': sha12(read('src/styles/components.css')), 'styles.css': sha12(styles) },
  inlinedExternals: [],
};
writeFileSync(join(OUT, '_ds_bundle.js'), `/* @ds-bundle: ${JSON.stringify(header)} */\n${bundleJs}`);

// cards
const renderHashes: Record<string, string> = {};
const sourceKeys: Record<string, string> = {};
for (const c of list) {
  const dir = join(OUT, 'components', c.group, c.name);
  mkdirSync(dir, { recursive: true });
  const html = rewriteDepth(c.text);
  writeFileSync(join(dir, `${c.name}.html`), html);
  writeFileSync(join(dir, `${c.name}.prompt.md`), promptDoc(c));
  renderHashes[c.name] = sha12(html);
  sourceKeys[c.name] = sha12(c.text);
}

// starting points: screens a consuming project can seed a design from.
// Same depth in the bundle as in the repo, so their ../styles.css still resolves.
const sp = screens();
if (sp.length) {
  mkdirSync(join(OUT, 'screens'), { recursive: true });
  for (const s of sp) cpSync(s.path, join(OUT, 'screens', s.path.split('/').pop() ?? s.name));
}

// written guidance
mkdirSync(join(OUT, 'guidelines'), { recursive: true });
cpSync(join(ROOT, 'SKILL.md'), join(OUT, 'guidelines/build-rules.md'));
cpSync(join(ROOT, 'RATIONALE.md'), join(OUT, 'guidelines/rationale.md'));

// README: the conventions header, then a generated index of every card
const conv = join(ROOT, '.design-sync/conventions.md');
const parts = existsSync(conv) ? [`${readFileSync(conv, 'utf8').trimEnd()}\n\n`] : [];
if (sp.length) {
  parts.push('## Starting points\n\n');
  parts.push('Whole screens to seed a design from. Open one and copy its structure;\n');
  parts.push('they are built from the same classes as everything else.\n\n');
  for (const s of sp) parts.push(`- **${s.name}** — ${s.subtitle} \`screens/${s.path.split('/').pop()}\`\n`);
  parts.push('\n');
}
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
/* `files` is written before the anchor exists on disk, so add it by hand —
   it is uploaded, and the next sync needs to see it in the previous list to
   avoid proposing it as an orphan. */
const files = [...new Set([...uploadFiles(OUT), '_ds_sync.json'])].sort();
writeFileSync(join(OUT, '_ds_sync.json'), JSON.stringify({
  shape: 'css-design-system',
  styleSha: sha12(styles + read('src/styles/components.css')),
  renderHashes,
  sourceKeys,
  keyRecipe: 'sha256-12 of the card html as emitted',
  scriptsSha: sha12(readFileSync(join(ROOT, 'scripts/build.ts'))),
  sourceHashes: header.sourceHashes,
  auxSha: sha12(readdirSync(join(OUT, 'tokens')).sort().join(',')),
  bundleSha12: sha12(readFileSync(join(OUT, '_ds_bundle.js'))),
  files,
}, null, 2));

const groups = byGroup(list);
console.log(`built ${OUT}`);
console.log(`  ${list.length} cards in ${groups.size} groups, ${sp.length} starting points, ${countFiles(OUT)} files`);
console.log(`  groups: ${[...groups].map(([k, v]) => `${k} (${v.length})`).join(', ')}`);
