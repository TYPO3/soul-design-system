#!/usr/bin/env node
/* Assemble the claude.ai/design upload bundle from this repo.

   This system is HTML and CSS, so the standard design-sync converter does not
   apply; the output contract is the same either way and this produces it.

     node scripts/build.ts [outdir]
*/
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

import * as esbuild from 'esbuild';

import { FRONTEND, GENERATED, ROOT, byGroup, cards, screens, type Card } from './lib/cards.ts';
import { inlineImports } from './lib/css.ts';
import { elements, type ElementDoc } from './lib/elements.ts';
import { TAGS } from '../packages/frontend/src/index.ts';
import * as report from './lib/report.ts';

const OUT = resolve(process.argv[2] ?? join(GENERATED, 'bundle'));
const NS = 'SDS';

const sha12 = (b: string | Buffer): string => createHash('sha256').update(b).digest('hex').slice(0, 12);
const read = (p: string): string => readFileSync(join(FRONTEND, p), 'utf8');
/* The class layer is four sheets — reset, base, layout, components — in that
   order, and the last one is an index of a file per component. Anything
   hashing or shipping "the stylesheet" takes all of them, imports pulled in:
   the bundle is flat and an `@import` in it would point outside itself. */
const SHEETS = ['reset.css', 'base.css', 'layout.css', 'components.css'];
const sheets = (): string =>
  SHEETS.map((f) => inlineImports(join(FRONTEND, 'src', 'styles', f), (p) => readFileSync(p, 'utf8'))).join('\n');

/* Point a page at the bundle's flat root. The repo keeps its stylesheets in
   the frontend package and the bundle keeps them at its root, so what has to be
   written is the climb back. Counted from the directory a page lands in, never
   written out: a literal is a second place that has to stay true every time
   either tree moves, and it cannot be wrong loudly. */
function rewriteRefs(txt: string, dir: string): string {
  const up = '../'.repeat(relative(OUT, dir).split(sep).filter(Boolean).length);
  return txt
    .replace(/href="(?:\.\.\/)+packages\/frontend\/src\/styles\/styles\.css"/g, `href="${up}styles.css"`)
    .replace(/href="(?:\.\.\/)+packages\/frontend\/src\/styles\/_specimen\.css"/g, `href="${up}_specimen.css"`)
    /* Either attribute. A diagram is an `<img src>` and the link to its own
       file is an `<a href>`, and a rule that knew only about `src` shipped the
       second one with the climb it had in the repo — which lands outside the
       bundle. */
    .replace(/(src|href)="(?:\.\.\/)+packages\/frontend\/assets\//g, `$1="${up}assets/`);
}

/* Every local reference in the bundle has to resolve inside the bundle.
   `make verify` checks the repo's own links and cannot see this, because the
   tree it walks is not the tree that ships: a path into `src/styles/` resolves
   perfectly there and to nothing here. */
function unresolvedRefs(): string[] {
  const bad: string[] = [];
  for (const rel of uploadFiles(OUT)) {
    if (!rel.endsWith('.html')) continue;
    /* Escaped example markup is documentation, not a reference. */
    const txt = readFileSync(join(OUT, rel), 'utf8').replace(/&lt;[\s\S]*?&gt;/g, '');
    for (const m of txt.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const ref = m[1];
      if (!ref || /^(https?:|data:|#)/.test(ref)) continue;
      /* A fragment names something inside the file, not a second file. A
         referenced drawing is written `…/mark.svg#soul-ref`, and resolving that
         whole string looks for a file with a `#` in its name and reports every
         drawing in the bundle as missing. */
      const target = resolve(dirname(join(OUT, rel)), ref.replace(/#.*$/, ''));
      /* Leaving the bundle is its own failure, and it has to be asked before
         existence: one climb too many lands in the repo, where `assets/` and
         `src/` both exist — so the file is found, the check passes, and what
         ships resolves to nothing on anybody else's disk. */
      if (!target.startsWith(OUT + sep)) {
        bad.push(`${rel} → ${ref} (climbs out of the bundle)`);
        continue;
      }
      if (!existsSync(target)) bad.push(`${rel} → ${ref}`);
    }
  }
  return bad;
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

/* `dir` because the markup in here is the card's, and a path in it has to
   climb the same way the card beside it climbs. It used to embed the repo's
   own text: the snippet told a reader to copy an `<img>` whose source sat one
   directory above the bundle. Nothing loads a fenced block, so nothing ever
   said so. */
function promptDoc(c: Card, dir: string): string {
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
    '```html', snippet(rewriteRefs(c.text, dir)), '```', '',
  );
  return out.join('\n');
}

/* A table cell ends at a pipe, and half these types are unions written with
   one. Escaped, because a row that breaks takes the rest of the table with it. */
const cell = (s: string): string => s.replace(/\|/g, '\\|');

/** The first sentence, which is what a table cell has room to carry. */
function opening(doc: string): string {
  return /^(.{0,180}?[.!?])(\s|$)/.exec(doc)?.[1] ?? (doc.length > 180 ? `${doc.slice(0, 177)}…` : doc);
}

/** The element's own contract, as types — its properties, with what they say. */
function elementDts(e: ElementDoc): string {
  const out = [`/** <${e.tag}> — ${e.purpose}`, ' *', ` *  Registered as \`${e.className}\` by \`_ds_bundle.js\`. Address the element;`,
    ' *  the classes in `_ds_bundle.css` are what it emits, not a second way to build.', ' */', ''];
  /* What a value of this shape is stands in the source; here it is only that
     the value is not a string, so the property is set from script rather than
     written as an attribute. */
  const named = [...new Set(e.props.flatMap((p) => [...p.type.matchAll(/\b[A-Z]\w*/g)].map((m) => m[0])))];
  if (named.length) {
    out.push(`/* Declared in ${e.source} — opaque here: a property taking one of these is set`,
      '   from script, never written as an attribute. */');
    for (const n of named) out.push(`type ${n} = unknown;`);
    out.push('');
  }
  out.push(`export interface ${e.className}Props {`);
  for (const p of e.props) {
    if (p.doc) out.push(`  /** ${p.doc} */`);
    if (p.attribute !== p.name.toLowerCase()) out.push(`  /* Written \`${p.attribute}\` on the element. */`);
    out.push(`  ${p.name}?: ${p.type};`);
  }
  out.push('}', '',
    `export declare class ${e.className} extends HTMLElement implements ${e.className}Props {}`, '',
    'declare global {', '  interface HTMLElementTagNameMap {', `    '${e.tag}': ${e.className};`, '  }', '}', '');
  return out.join('\n');
}

/** The same contract as something to write, which is what an agent reads. */
function elementPrompt(e: ElementDoc): string {
  /* Shape-true rather than invented: what a page can write is what a string
     holds, in the order the element declares it, and a body an element takes
     between its tags is not shown twice. */
  const shown = e.props
    .filter((p) => p.lit === 'string' && !(e.takesContent && p.name === 'body'))
    .slice(0, 3);
  const attrs = shown.map((p) => ` ${p.attribute}="${/'([^']*)'/.exec(p.type)?.[1] ?? '…'}"`).join('');
  const out = [`${e.tag} — ${e.purpose}`, '',
    `Registered as \`${e.className}\` by \`_ds_bundle.js\`, and written as an element:`, '',
    '```html', `<${e.tag}${attrs}>${e.takesContent ? '…' : ''}</${e.tag}>`, '```', ''];
  if (e.props.length) {
    out.push('## Attributes', '', '| Attribute | Type | What it is |', '| --- | --- | --- |');
    for (const p of e.props) out.push(`| \`${p.attribute}\` | \`${cell(p.type)}\` | ${cell(opening(p.doc))} |`);
    out.push('');
  }
  out.push(e.takesContent
    ? 'Between the tags goes what an attribute cannot carry — prose, a block, a section of a document. Everything else is an attribute.'
    : 'This element carries no content: everything it shows is an attribute.', '',
    `Source: \`${e.source}\`.`, '');
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

report.open('build', `assemble the upload bundle into ${relative(ROOT, OUT)}`);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const list = cards();

// styling closure
cpSync(join(FRONTEND, 'src', 'tokens'), join(OUT, 'tokens'), { recursive: true });
for (const d of ['fonts', 'assets']) cpSync(join(FRONTEND, d), join(OUT, d), { recursive: true });
writeFileSync(join(OUT, '_ds_bundle.css'), sheets());
cpSync(join(FRONTEND, 'src', 'styles', '_specimen.css'), join(OUT, '_specimen.css'));
/* The repo keeps its stylesheets in `styles/` and the tokens one level up;
   the bundle is flat, with `styles.css`, `_ds_bundle.css` and `tokens/` all
   at its root. So both kinds of import are rewritten on the way out — the
   component layer to its bundle name, and the tokens back to siblings. */
const styles = read('src/styles/styles.css')
  .replace(/@import "reset\.css";\n@import "base\.css";\n@import "layout\.css";\n@import "components\.css";/, '@import "./_ds_bundle.css";')
  .replaceAll('@import "../tokens/', '@import "tokens/')
  /* The faces sit one level further up in the repo and at the bundle's root
     here, same as the tokens. */
  .replaceAll('@import "../../fonts/', '@import "fonts/');

writeFileSync(join(OUT, 'styles.css'), styles);

/* The real bundle: the namespace carries the Lit elements in `src/`, so the
   design agent can reach them. They render light DOM and emit the same `sds-`
   classes, which keeps `_ds_bundle.css` the single source for styling. The
   cards stay static HTML — the pane opens them without this bundle, which is
   why `scripts/cards.ts` renders the same templates to markup. */
const bundleSrc = join(FRONTEND, 'src', 'index.ts');
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

/* Every registered tag ships its contract, because the app compiles the header
   below into the component API the design agent is given — and an agent given
   no API writes the class layer by hand, which is the fallback and not the
   system. A tag with no contract is a component nobody can address. */
const els = elements();
const byTag = new Map(els.map((e) => [e.tag, e]));
const uncontracted = TAGS.filter((t) => !byTag.has(t));
if (uncontracted.length) {
  report.summary(`${uncontracted.length} registered tag(s) ship no contract`, uncontracted);
  process.exit(1);
}
const elementHashes: Record<string, string> = {};
for (const e of els) {
  const dir = join(OUT, 'components', 'Elements', e.className);
  mkdirSync(dir, { recursive: true });
  const dts = elementDts(e);
  const prompt = elementPrompt(e);
  writeFileSync(join(dir, `${e.className}.d.ts`), dts);
  writeFileSync(join(dir, `${e.className}.prompt.md`), prompt);
  elementHashes[e.tag] = sha12(dts + prompt);
}

const header = {
  namespace: NS,
  /* `name` and `sourcePath` are the shape the app compiles into
     `_ds_manifest.json`; `tag` is this repository's own, and what `verify`
     holds the conventions header against. */
  components: TAGS.flatMap((tag) => {
    const e = byTag.get(tag);
    return e
      ? [{ name: e.className, tag, export: e.className, sourcePath: `components/Elements/${e.className}/${e.className}.d.ts` }]
      : [];
  }),
  sourceHashes: { 'components.css': sha12(sheets()), 'styles.css': sha12(styles) },
  inlinedExternals: [],
};
writeFileSync(join(OUT, '_ds_bundle.js'), `/* @ds-bundle: ${JSON.stringify(header)} */\n${bundleJs}`);

// cards
const renderHashes: Record<string, string> = {};
const sourceKeys: Record<string, string> = {};
for (const c of list) {
  const dir = join(OUT, 'components', c.group, c.name);
  mkdirSync(dir, { recursive: true });
  const html = rewriteRefs(c.text, dir);
  writeFileSync(join(dir, `${c.name}.html`), html);
  writeFileSync(join(dir, `${c.name}.prompt.md`), promptDoc(c, dir));
  renderHashes[c.name] = sha12(html);
  sourceKeys[c.name] = sha12(c.text);
}

// starting points: screens a consuming project can seed a design from.
const sp = screens();
/* Hashed like the cards are. Without this the anchor knows nothing about a
   screen, so `make design-status` reports "nothing to do" while all three of them
   have changed — which is what it said on the build that first shipped them
   without a stylesheet. */
const screenHashes: Record<string, string> = {};
if (sp.length) {
  mkdirSync(join(OUT, 'screens'), { recursive: true });
  for (const s of sp) {
    const html = rewriteRefs(s.text, join(OUT, 'screens'));
    writeFileSync(join(OUT, 'screens', s.path.split('/').pop() ?? s.name), html);
    screenHashes[s.name] = sha12(html);
  }
}

// written guidance
mkdirSync(join(OUT, 'guidelines'), { recursive: true });
cpSync(join(ROOT, 'SKILL.md'), join(OUT, 'guidelines/build-rules.md'));
/* The two prompts, as something to act on rather than read about: a design
   adopting this system needs a mark and pictures, and the alternative is the
   agent inventing both from the cards. They live beside the pages that print
   them, a prompt being the same file however it is reached. */
cpSync(join(ROOT, 'docs/design-system/signet-prompt.md'), join(OUT, 'guidelines/signet-prompt.md'));
cpSync(join(ROOT, 'docs/design-system/illustration-prompt.md'), join(OUT, 'guidelines/illustration-prompt.md'));

// README: the conventions header, then a generated index of every card
const conv = join(ROOT, '.design-sync/conventions.md');
/* The screens are named where the header puts the marker rather than after it:
   only the first 32,000 characters reach the agent's prompt, and a page is
   started from a screen before any of the class vocabulary is needed. */
const SCREEN_MARK = '<!-- @startingPoints -->';
const screenBlock = sp.length
  ? [
      '## Start from a screen\n\n',
      'A page is a screen with its content replaced, never a stack of cards. Open the\n',
      'one nearest the job and keep its shell — the bar, the skip link, and either a\n',
      'column beside a rail or a run of bands. A card answers what one part looks like.\n\n',
      ...sp.map((s) => `- **${s.name}** — ${s.subtitle} \`screens/${s.path.split('/').pop()}\`\n`),
    ].join('')
  : '';
const conventions = existsSync(conv) ? `${readFileSync(conv, 'utf8').trimEnd()}\n\n` : '';
const parts = [conventions.includes(SCREEN_MARK)
  ? conventions.replace(SCREEN_MARK, screenBlock.trimEnd())
  : conventions + screenBlock];
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
  report.note(`the README is ${readme.length} chars — the app inlines only the first 32,000`);
}

/* Before the anchor, which vouches for the bundle: nothing should vouch for
   one whose own pages cannot find their stylesheet. */
const badRefs = unresolvedRefs();
if (badRefs.length) {
  report.summary(`${badRefs.length} reference(s) do not resolve inside the bundle`, badRefs);
  process.exit(1);
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
  styleSha: sha12(styles + sheets()),
  renderHashes,
  screenHashes,
  elementHashes,
  sourceKeys,
  keyRecipe: 'sha256-12 of the card html as emitted',
  scriptsSha: sha12(readFileSync(join(ROOT, 'scripts/build.ts'))),
  sourceHashes: header.sourceHashes,
  auxSha: sha12(readdirSync(join(OUT, 'tokens')).sort().join(',')),
  bundleSha12: sha12(readFileSync(join(OUT, '_ds_bundle.js'))),
  files,
}, null, 2));

const groups = byGroup(list);
report.align([...groups].map(([group]) => ({ name: group, label: group })));
for (const [group, items] of groups) report.fact(group, `${items.length} cards`);
report.summary(`${list.length} cards \u00b7 ${groups.size} groups \u00b7 ${sp.length} starting points \u00b7 ${countFiles(OUT)} files`);
