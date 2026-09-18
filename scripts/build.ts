#!/usr/bin/env node
/* Assemble the Design System artifact's files from this repo.

   The artifact keeps a system as files under `project/`. An index, the
   tokens as one JSON, a README, a classic-script bundle, the faces. A
   preview and a guideline per component. Every picture as an upload the
   index names. This writes that tree into `.out/bundle/project/`.

     node scripts/build.ts [outdir]
*/
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join, relative, resolve } from 'node:path';

import * as esbuild from 'esbuild';

import { FRONTEND, GENERATED, ROOT, byGroup, cards, pascal, screens, type Card, type Screen } from './lib/cards.ts';
import { elements, type ElementDoc } from './lib/elements.ts';
import { tokens } from './lib/tokens.ts';
import { TAGS } from '../packages/frontend/src/index.ts';
import * as report from './lib/report.ts';

const OUT = resolve(process.argv[2] ?? join(GENERATED, 'bundle'));
const PROJECT = join(OUT, 'project');
const CONFIG = JSON.parse(readFileSync(join(ROOT, '.design-sync/config.json'), 'utf8')) as { title: string; namespace: string };
const NS = CONFIG.namespace;
const ANCHOR = join(ROOT, '.design-sync/.cache/remote-sync.json');

/* A picture up to this size travels inside its preview as a data URI. Past
   it, the preview names the upload and the sync fills the blob in. The
   page caps a preview at 256 kB. */
const INLINE_MAX = 24 * 1024;
const PREVIEW_MAX = 256 * 1024;

const sha12 = (b: string | Buffer): string => createHash('sha256').update(b).digest('hex').slice(0, 12);
const MIME: Readonly<Record<string, string>> = {
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.json': 'application/json', '.woff2': 'font/woff2', '.txt': 'text/plain',
};
const mime = (p: string): string => MIME[extname(p).toLowerCase()] ?? 'application/octet-stream';

// ---------------------------------------------------------------- assets --

/* Where a file of `packages/frontend/assets/` goes. The first folder under
   `assets/` is the group the page shows it in. The icons' lookup and sprites
   stay files at `icons/`, where the bundle's own fallback path finds them. */
interface Upload {
  /** Under `project/`: `assets/<Group>/<name>`. */
  path: string;
  group: string;
  name: string;
  source: string;
}

const GROUPS: readonly (readonly [RegExp, string, string])[] = [
  [/^icons\/svgs\/(.+\.svg)$/, 'Icons', 'xs'],
  [/^diagrams\/(.+\.svg)$/, 'Diagrams', 'l'],
  [/^screenshots\/(.+\.png)$/, 'Screenshots', 'l'],
  [/^placeholders\/(.+\.png)$/, 'Illustrations', 'l'],
  [/^([^/]+\.svg)$/, 'Logos', 'm'],
];
const TILE = new Map(GROUPS.map(([, group, tile]) => [group, tile]));

const GROUP_NOTES: Readonly<Record<string, string>> = {
  Icons: '# Icons\n\nEvery `actions-*` icon of TYPO3.Icons (MIT), 16 × 16, drawn in `currentColor`. An `<img>` cannot inherit a colour: inline the file, or write `<sds-icon name="actions-search">` and the element inlines it. `icons/icons.json` is the lookup, `icons/sprites/` one file per category.\n',
  Logos: '# Logos\n\nThe marks belong to the products named on them. A product on this system brings its own mark: `guidelines/signet-prompt.md` draws one to the construction. `typo3-soul.svg` and `typo3-soul-mono.svg` are the signet of this system.\n',
  Diagrams: '# Diagrams\n\nOne file, in both modes. Every colour reads `var(--token, #light)`, so a page that references a drawing with `<use>` gives it that page\'s tokens. An `<img>` shows the light fallback.\n',
  Illustrations: '# Illustrations\n\nThe picture set: mode-neutral editorial imagery, broad shapes, one halftone field, one accent, and nobody photographed. `guidelines/illustration-prompt.md` extends it.\n',
  Screenshots: '# Screenshots\n\nA story\'s fixture: a screen of this system, photographed for the concept paper that discusses it.\n',
};

function* walk(dir: string, base = dir): Generator<string> {
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p, base);
    else yield relative(base, p);
  }
}

function uploads(): Upload[] {
  const out: Upload[] = [];
  for (const rel of walk(join(FRONTEND, 'assets'))) {
    for (const [re, group] of GROUPS) {
      const m = re.exec(rel);
      if (!m?.[1]) continue;
      out.push({ path: `assets/${group}/${m[1]}`, group, name: m[1], source: join(FRONTEND, 'assets', rel) });
      break;
    }
  }
  return out;
}

/** The blob id the last sync recorded for an upload, for a file at that hash. */
function knownBlobs(): Map<string, string> {
  const out = new Map<string, string>();
  if (!existsSync(ANCHOR)) return out;
  const was = JSON.parse(readFileSync(ANCHOR, 'utf8')).uploads as Record<string, { sha: string; blob: string | null }> | undefined;
  for (const [path, rec] of Object.entries(was ?? {})) if (rec.blob) out.set(`${path}@${rec.sha}`, rec.blob);
  return out;
}

// -------------------------------------------------------------- previews --

/* A reference into `packages/frontend/assets/` on the way into a preview. A
   small picture goes in as a data URI, because a preview fetches nothing. A
   large one names its upload, and the sync writes the blob's URL over the
   name once the upload has one. A `#fragment` addresses a `<use>`, which no
   data URI can carry. */
const ASSET_REF = /(src|href)="(?:\.\.\/)+packages\/frontend\/assets\/([^"#]+)(#[^"]*)?"/g;

interface Placed {
  text: string;
  pending: string[];
}

function place(txt: string, byRepo: Map<string, Upload>, blobs: Map<string, string>, shas: Map<string, string>, mode: 'preview' | 'doc'): Placed {
  const pending: string[] = [];
  const text = txt.replace(ASSET_REF, (whole, attr: string, rel: string, frag = '') => {
    const up = byRepo.get(rel);
    if (!up) return whole;
    if (mode === 'doc') return `${attr}="${up.path}${frag}"`;
    const bytes = readFileSync(up.source);
    if (!frag && bytes.length <= INLINE_MAX) return `${attr}="data:${mime(up.source)};base64,${bytes.toString('base64')}"`;
    const blob = blobs.get(`${up.path}@${shas.get(up.path)}`);
    if (blob) return `${attr}="/_blob/${blob}${frag}"`;
    pending.push(up.path);
    return `${attr}="{{upload:${up.path}}}${frag}"`;
  });
  return { text, pending };
}

const SPECIMEN_CSS = readFileSync(join(FRONTEND, 'src', 'styles', '_specimen.css'), 'utf8');

/* The frame loads the tokens, the faces and `bundle.css` before the first
   byte of a preview. So the stylesheet link goes, and the card chrome, which
   no consumer links, goes inline. */
function head(txt: string): string {
  return txt
    .replace(/\s*<link rel="stylesheet" href="[^"]*styles\.css" \/>/, '')
    .replace(/<link rel="stylesheet" href="[^"]*_specimen\.css" \/>/, `<style>\n${SPECIMEN_CSS}</style>`);
}

function marker(group: string, width: number, height: number, subtitle: string, page: boolean): string {
  return `<!-- @dsCard group="${group}" height=${height} width=${width} subtitle="${subtitle}"${page ? ' page' : ''} -->`;
}

/** The second line on: everything after the repo's own marker. */
const body = (txt: string): string => txt.slice(txt.indexOf('\n') + 1);

function classesUsed(txt: string): string[] {
  const found = new Set<string>();
  for (const m of txt.matchAll(/class="([^"]*)"/g)) {
    for (const c of (m[1] ?? '').split(/\s+/)) if (c.startsWith('sds-')) found.add(c);
  }
  return [...found].sort();
}

/** A readable excerpt of the card's own markup: SVGs elided, trimmed. */
function snippet(txt: string): string {
  const b = /<body>([\s\S]*)<\/body>/.exec(txt);
  if (!b) return '';
  const s = (b[1] ?? '').replace(/<svg[\s\S]*?<\/svg>/g, '<svg class="sds-icon">…</svg>');
  const lines = s.replace(/\n\s*\n/g, '\n').trim().split('\n');
  return (lines.length > 26 ? [...lines.slice(0, 26), '  <!-- … -->'] : lines).join('\n');
}

function cardDoc(c: Card, doc: string): string {
  const cls = classesUsed(c.text);
  const out = [`# ${c.label}`, '', `${c.subtitle}.`, '', `Group: ${c.group}. Rendered at ${c.viewport}.`, ''];
  if (cls.length) out.push('## Classes this uses', '', ...cls.map((x) => `- \`.${x}\``), '');
  out.push(
    '## How to build it', '',
    'Link `components/bundle.css`: it carries the tokens, the faces and the whole class layer.',
    'Copy the markup below rather than invent a variant. Every class in it is',
    'defined there, and every value comes from a token.', '',
    '```html', snippet(doc), '```', '',
  );
  return out.join('\n');
}

function screenDoc(s: Screen): string {
  return [`# ${s.name}`, '', `${s.subtitle}.`, '',
    `A whole page at ${s.viewport}, to start a design from. Keep its shell and replace its content.`,
    'The shell is the bar, the skip link, and either a column beside a rail or a run of bands.', '',
    `Source: \`specimens/screens/${basename(s.path)}\`.`, ''].join('\n');
}

// -------------------------------------------------------------- elements --

/* A table cell ends at a pipe, and half these types are unions written with
   one. Escaped, because a row that breaks takes the rest of the table with it. */
const cell = (s: string): string => s.replace(/\|/g, '\\|');

/** The first sentence, which is what a table cell has room to carry. */
function opening(doc: string): string {
  return /^(.{0,180}?[.!?])(\s|$)/.exec(doc)?.[1] ?? (doc.length > 180 ? `${doc.slice(0, 177)}…` : doc);
}

/** The element's own contract, as types — its properties, with what they say. */
function elementDts(e: ElementDoc, seen: Set<string>): string {
  const out = [`/** <${e.tag}> — ${e.purpose}`, ' *', ` *  Registered as \`${e.className}\` by \`components/bundle.js\`. Address the element;`,
    ' *  the classes in `components/bundle.css` are what it emits, not a second way to build.', ' */', ''];
  /* What a value of this shape is stands in the source. Here it is only that
     the value is not a string, so a script sets the property rather than an
     attribute. */
  const named = [...new Set(e.props.flatMap((p) => [...p.type.matchAll(/\b[A-Z]\w*/g)].map((m) => m[0])))].filter((n) => !seen.has(n));
  if (named.length) {
    out.push(`/* Declared in ${e.source} — opaque here: a script sets a property that takes one`,
      '   of these, never an attribute. */');
    for (const n of named) {
      out.push(`type ${n} = unknown;`);
      seen.add(n);
    }
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
  const shown = e.props
    .filter((p) => p.lit === 'string' && !(e.takesContent && p.name === 'body'))
    .slice(0, 3);
  const attrs = shown.map((p) => ` ${p.attribute}="${/'([^']*)'/.exec(p.type)?.[1] ?? '…'}"`).join('');
  const out = [`# ${e.tag}`, '', `${e.purpose}`, '',
    `Registered as \`${e.className}\` by \`components/bundle.js\`, and written as an element:`, '',
    '```html', `<${e.tag}${attrs}>${e.takesContent ? '…' : ''}</${e.tag}>`, '```', ''];
  if (e.notes.length) out.push('## How it behaves', '', ...e.notes.flatMap((p) => [p, '']));
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

// -------------------------------------------------------------------------

const write = (rel: string, data: string | Buffer): void => {
  const p = join(PROJECT, rel);
  mkdirSync(join(p, '..'), { recursive: true });
  writeFileSync(p, data);
};

report.open('build', `assemble the Design System artifact's files into ${relative(ROOT, OUT)}`);

/* The stylesheet and the drop-in ship from `dist/`, so the sheet a design
   links is the sheet a project installs. `make verify ARGS=dist` holds that
   directory against `src/`. */
const inlineCss = join(FRONTEND, 'dist', 'soul-inline.css');
if (!existsSync(inlineCss)) {
  report.summary('no drop-in to ship', ['run `make dist` first — the stylesheet is its `soul-inline.css`']);
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(PROJECT, { recursive: true });

// tokens, faces, the stylesheet
const tokensJson = JSON.stringify(tokens(CONFIG.title), null, 2);
write('tokens.json', tokensJson);
cpSync(join(FRONTEND, 'fonts'), join(PROJECT, 'fonts'), { recursive: true, filter: (s) => !s.endsWith('.css') });
const css = readFileSync(inlineCss, 'utf8');
write('components/bundle.css', css);

/* The elements, as the one classic script the page loads before a preview:
   `window.SDS` holds every class. The drop-in is a module and cannot be
   that, so this is the same entry under the other format. A literal `<!--`
   or `</script` ends an inline copy, so both go in as escapes. */
const built = await esbuild.build({
  entryPoints: [join(FRONTEND, 'src', 'index.ts')],
  write: false,
  bundle: true,
  format: 'iife',
  globalName: NS,
  target: 'es2022',
  minify: true,
  legalComments: 'none',
  logLevel: 'silent',
});
const els = elements();
const byTag = new Map(els.map((e) => [e.tag, e]));
const uncontracted = TAGS.filter((t) => !byTag.has(t));
if (uncontracted.length) {
  report.summary(`${uncontracted.length} registered tag(s) ship no contract`, uncontracted);
  process.exit(1);
}
const header = {
  format: 4,
  namespace: NS,
  components: TAGS.flatMap((tag) => (byTag.has(tag) ? [{ name: byTag.get(tag)!.className, tag }] : [])),
};
const js = (built.outputFiles[0]?.text ?? '').replace(/<!--/g, '\\x3C!--').replace(/<\/script/gi, '<\\/script');
const bundleJs = `/* @ds-bundle: ${JSON.stringify(header)} */\n${js}`;
write('components/bundle.js', bundleJs);

// every element: its types and its guideline
const seen = new Set<string>();
const index: string[] = [];
const elementHashes: Record<string, string> = {};
for (const e of els) {
  const dts = elementDts(e, new Set());
  const prompt = elementPrompt(e);
  write(`components/${e.className}/${e.className}.d.ts`, dts);
  write(`components/${e.className}/README.md`, prompt);
  index.push(elementDts(e, seen));
  elementHashes[e.tag] = sha12(dts + prompt);
}
index.push('declare global {', `  interface Window { ${NS}: {`, ...els.map((e) => `    ${e.className}: typeof ${e.className};`),
  '    /** Point the icons at the sprites: a directory URL, one file per category. */', '    setIconSprites(dir: string): void;',
  '  } }', '}', '');
write('components/index.d.ts', index.join('\n'));

// the pictures: uploads the index names, and the icon lookup as files
const ups = uploads();
const byRepo = new Map(ups.map((u) => [relative(join(FRONTEND, 'assets'), u.source), u]));
const shas = new Map(ups.map((u) => [u.path, sha12(readFileSync(u.source))]));
const blobs = knownBlobs();
const uploadRecords: Record<string, { sha: string; bytes: number; type: string; blob: string | null }> = {};
for (const u of ups) {
  mkdirSync(join(PROJECT, u.path, '..'), { recursive: true });
  cpSync(u.source, join(PROJECT, u.path));
  uploadRecords[u.path] = { sha: shas.get(u.path)!, bytes: statSync(u.source).size, type: mime(u.source), blob: blobs.get(`${u.path}@${shas.get(u.path)}`) ?? null };
}
for (const [group, note] of Object.entries(GROUP_NOTES)) write(`assets/${group}/README.md`, note);
cpSync(join(FRONTEND, 'assets', 'icons', 'icons.json'), join(PROJECT, 'icons', 'icons.json'));
cpSync(join(FRONTEND, 'assets', 'icons', 'sprites'), join(PROJECT, 'icons', 'sprites'), { recursive: true });

// cards and screens, each a preview and a guideline
const list = cards();
const renderHashes: Record<string, string> = {};
const sourceKeys: Record<string, string> = {};
const pending = new Set<string>();
const oversized: string[] = [];
const preview = (folder: string, mark: string, text: string): string => {
  const placed = place(head(body(text)), byRepo, blobs, shas, 'preview');
  const html = `${mark}\n${placed.text}`;
  if (placed.pending.length) pending.add(`components/${folder}/preview.html`);
  if (Buffer.byteLength(html) > PREVIEW_MAX) oversized.push(`components/${folder}/preview.html (${Math.round(Buffer.byteLength(html) / 1024)} kB)`);
  write(`components/${folder}/preview.html`, html);
  return html;
};
for (const c of list) {
  const html = preview(c.name, marker(c.group, c.width, c.height, c.subtitle, false), c.text);
  write(`components/${c.name}/README.md`, cardDoc(c, place(c.text, byRepo, blobs, shas, 'doc').text));
  renderHashes[c.name] = sha12(html);
  sourceKeys[c.name] = sha12(c.text);
}
/* A screen is a page to start a design from, at its design width. One that
   embeds another document in an `<iframe>` stays out: a preview holds none. */
const sp = screens();
const screenHashes: Record<string, string> = {};
const skipped: string[] = [];
const shipped: Screen[] = [];
for (const s of sp) {
  if (/<iframe\b/.test(s.text)) {
    skipped.push(`${s.name}: embeds another document`);
    continue;
  }
  const folder = `${pascal(basename(s.path, '.html'))}Screen`;
  const html = preview(folder, marker('Screens', s.width, s.height, s.subtitle, true), s.text);
  write(`components/${folder}/README.md`, screenDoc(s));
  screenHashes[s.name] = sha12(html);
  shipped.push(s);
}

// the cover: the system's face, drawn by hand beside the conventions
const cover = join(ROOT, '.design-sync/cover.html');
if (existsSync(cover)) write('components/Cover/preview.html', readFileSync(cover, 'utf8'));

// the brand book and the written rules
const SCREEN_MARK = '<!-- @startingPoints -->';
const screenBlock = shipped.length
  ? ['## Start from a screen', '',
      'A page is a screen with its content replaced, never a stack of cards. Open the',
      'one nearest the job and keep its shell — the bar, the skip link, and either a',
      'column beside a rail or a run of bands. A card answers what one part looks like.', '',
      ...shipped.map((s) => `- **${s.name}** — ${s.subtitle}: \`components/${pascal(basename(s.path, '.html'))}Screen/preview.html\``), '']
    .join('\n')
  : '';
const conventions = readFileSync(join(ROOT, '.design-sync/conventions.md'), 'utf8').trimEnd();
write('README.md', `${conventions.includes(SCREEN_MARK) ? conventions.replace(SCREEN_MARK, screenBlock.trimEnd()) : `${conventions}\n\n${screenBlock}`}\n`);
/* The prompts, as something to act on rather than read about. A design that
   adopts this system needs a mark and pictures; the alternative is an agent
   that invents both from the cards. The skill's front matter is metadata for
   a loader, not a heading, and stays out. */
const frontMatter = /^---\n[\s\S]*?\n---\n\s*/;
write('guidelines/build-rules.md', readFileSync(join(ROOT, 'SKILL.md'), 'utf8').replace(frontMatter, ''));
write('guidelines/signet-prompt.md', readFileSync(join(ROOT, 'docs/design-system/signet-prompt.md'), 'utf8').replace(frontMatter, ''));
write('guidelines/illustration-prompt.md', readFileSync(join(ROOT, 'docs/design-system/illustration-prompt.md'), 'utf8').replace(frontMatter, ''));

// the index the page opens, and the record the next sync compares against
const groups = [...new Set(ups.map((u) => u.group))];
const assetGroups: Record<string, unknown> = {};
for (const group of groups) {
  const files = ups.filter((u) => u.group === group);
  assetGroups[group] = {
    name: group,
    tile: TILE.get(group) ?? 'm',
    order: files.map((u) => u.name),
    files: Object.fromEntries(files.map((u) => {
      const rec = uploadRecords[u.path]!;
      return [u.name, { name: u.name, blob: rec.blob, size: rec.bytes, type: rec.type }];
    })),
  };
}
write('design-system.json', JSON.stringify({
  v: 3,
  layout: 'files',
  createdOnFiles: { v: 1, at: new Date().toISOString() },
  title: CONFIG.title,
  namespace: NS,
  libraries: [],
  sections: {},
  groups,
  assetGroups,
  blobs: {},
  docs: { readme: 'project/README.md', sections: [] },
}, null, 2));

/* A hash per published file, so a re-sync pushes what moved. The index and
   this record change every sync and stay out. A preview that still names an
   upload waits for its blob id, and the sync rewrites it then. */
const fileHashes: Record<string, string> = {};
for (const rel of walk(PROJECT)) {
  if (rel === 'design-system.json' || rel === 'sync.json' || rel in uploadRecords) continue;
  fileHashes[`project/${rel}`] = sha12(readFileSync(join(PROJECT, rel)));
}
write('sync.json', JSON.stringify({
  shape: 'design-system-artifact',
  styleSha: sha12(css),
  renderHashes,
  screenHashes,
  elementHashes,
  sourceKeys,
  keyRecipe: 'sha256-12 of the preview as emitted',
  scriptsSha: sha12(readFileSync(join(ROOT, 'scripts/build.ts'))),
  bundleSha12: sha12(bundleJs),
  fileHashes,
  uploads: uploadRecords,
  pending: [...pending].sort(),
}, null, 2));

const problems = oversized.map((p) => `${p} is over the page's 256 kB cap for a preview`);
const groupsOf = byGroup(list);
report.align([...groupsOf].map(([group]) => ({ name: group, label: group })));
for (const [group, items] of groupsOf) report.fact(group, `${items.length} cards`);
for (const s of skipped) report.note(`screen left out — ${s}`);
if (pending.size) report.note(`${pending.size} preview(s) name an upload with no blob id yet — the sync fills them in`);
report.summary(`${list.length} cards · ${shipped.length} screens · ${els.length} elements · ${ups.length} uploads · ${Object.keys(fileHashes).length} files`, problems);
if (problems.length) process.exit(1);
