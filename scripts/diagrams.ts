#!/usr/bin/env node
/* Read the referenced artwork into the modules that need it.

   Artwork is referenced into the page rather than linked as an image, so that
   its colours are the page's tokens — `src/lib/art.ts` says why. That costs
   two things the files themselves have to supply.

   **The viewBox.** `<use>` carries the shapes across and not the size, so
   something has to state the coordinate system, and the component writing the
   wrapper has never opened the file. A mark names its root `<svg>`, which
   carries its own viewBox and needs nothing from here. A drawing under
   `assets/diagrams/` names a `<g>`, which carries none — so the coordinate
   systems are read out of those files. A hand-kept list would drift the first
   time a drawing was recomposed, and a drifted viewBox is a drawing squashed
   by a fraction: visible, but not obviously a stale constant.

   **The markup.** A specimen card is opened from disk with no server, where a
   reference to another file resolves to nothing — the same reason
   `icon.static.ts` exists, and this is its counterpart for artwork. Only the
   static render path imports it, so the weight never reaches `soul.js`.

   Two directories, because the two are different things and only one of them
   is this system's own. `assets/diagrams/` is drawn here, for these pages.
   `assets/*.svg` at the top holds the marks — worked examples of the signet
   construction, and third-party logos that are nobody's to rewrite. A file up
   there is read only when it says it may be, by naming its root `id="art"`,
   which is the same line a project writes into its own signet.

     make diagrams
     make diagrams ARGS=--check    are the modules still in step
*/
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from './lib/cards.ts';

const ASSETS = join(ROOT, 'assets');
const DIR = join(ASSETS, 'diagrams');

/** The group `<use>` points at in a drawing. Every one of them names it the
    same: pointing at the root `<svg>` would clone the `<title>` and `<desc>`
    into a wrapper that already carries the alt text, and read the drawing out
    twice. A mark has no `<title>` to clone and names its root instead, which
    is what lets the same file be opened on its own and used as a favicon. */
const GROUP = /<g id="art">([\s\S]*)<\/g>/;

/** A mark says it may be referenced by naming its root. */
const ROOTED = /<svg\b[^>]*\sid="art"/;

const viewBoxOf = (file: string, text: string): string => {
  const viewBox = /<svg[^>]*\sviewBox="([^"]+)"/.exec(text)?.[1];
  if (!viewBox) throw new Error(`${file}: no viewBox on the root <svg> — artwork without one cannot be referenced`);
  return viewBox;
};

/* A double dash inside a comment is illegal XML, and an SVG is parsed as XML
   the moment it is fetched — as a reference, as an image, in a favicon slot.
   The file then renders nothing at all, in every one of those places at once,
   and the only thing on the page saying so is a blank space. It is easy to
   write by accident, because the token names these files are full of are
   spelled with two of them: a note explaining `var(--token, #hex)` breaks the
   drawing it is explaining. */
const wellFormed = (file: string, text: string): void => {
  for (const comment of text.matchAll(/<!--([\s\S]*?)-->/g)) {
    if ((comment[1] ?? '').includes('--')) {
      throw new Error(`${file}: a comment carries a double dash — that is malformed XML, and the file draws nothing wherever it is fetched`);
    }
  }
};

const drawings = readdirSync(DIR)
  .filter((f) => f.endsWith('.svg'))
  .sort()
  .map((file) => {
    const text = readFileSync(join(DIR, file), 'utf8');
    wellFormed(file, text);
    const viewBox = viewBoxOf(file, text);
    const shapes = GROUP.exec(text)?.[1];
    if (!shapes) throw new Error(`${file}: no <g id="art"> — the drawing has nothing <use> can reach`);
    return { name: file.replace(/\.svg$/, ''), viewBox, shapes: shapes.trim() };
  });

/* A mark goes into the card whole, as a nested `<svg>` rather than as loose
   shapes. That is what carries the coordinate system across: the wrapper the
   component wrote states a size and no viewBox, because in a browser the
   referenced root supplies one — and a nested `<svg viewBox>` scales into its
   parent's box exactly the way `<use>` does.

   What comes out is the drawing and nothing else. The file's own name and
   notes are for whoever opens it: the wrapper around the reference already
   says what the picture is, in the words the page needed rather than the ones
   the mark was drawn under, and a card carrying both would read the same thing
   out twice and carry a paragraph of prose per signet on it. The `id` goes
   with them, or a card showing one mark twice ships it twice. */
const CARRIED = [
  [/<\?xml[^>]*\?>\s*/g, ''],
  [/\s*<!--[\s\S]*?-->/g, ''],
  [/\s*<title>[\s\S]*?<\/title>/g, ''],
  [/\s+(?:id|role|aria-label)="[^"]*"/g, ''],
] as const;

const marks = readdirSync(ASSETS)
  .filter((f) => f.endsWith('.svg'))
  .sort()
  .map((file) => ({ file, text: readFileSync(join(ASSETS, file), 'utf8') }))
  .filter(({ text }) => ROOTED.test(text))
  .map(({ file, text }) => {
    wellFormed(file, text);
    viewBoxOf(file, text);
    return {
      name: file.replace(/\.svg$/, ''),
      svg: CARRIED.reduce((svg, [pattern, to]) => svg.replace(pattern, to), text).trim(),
    };
  });

const header = (what: string): string =>
  `/* GENERATED by scripts/diagrams.ts — from assets/. Do not edit.\n` +
  `   ${what}\n` +
  `   Redraw the file and run \`make diagrams\`. */\n\n`;

const MODULES: readonly (readonly [file: string, text: string])[] = [
  [
    'diagrams.generated.ts',
    header('The coordinate systems. Safe for the browser bundle.') +
      `/** The coordinate system each drawing is in, keyed by file name without\n` +
      `    the extension. \`sds-figure\` puts it on the wrapper it references the\n` +
      `    drawing from, because \`<use>\` does not bring a size across. */\n` +
      `export const DIAGRAM_VIEWBOX: Readonly<Record<string, string>> = {\n` +
      drawings.map((d) => `  ${JSON.stringify(d.name)}: ${JSON.stringify(d.viewBox)},`).join('\n') +
      `\n};\n`,
  ],
  [
    'diagrams.svg.generated.ts',
    header('The shapes. For the static export — never imported by src/index.ts.') +
      `export const DIAGRAM_SHAPES: Readonly<Record<string, string>> = {\n` +
      drawings.map((d) => `  ${JSON.stringify(d.name)}: ${JSON.stringify(d.shapes)},`).join('\n') +
      `\n};\n\n` +
      `/** The marks, whole — a nested \`<svg>\` carrying its own coordinate\n` +
      `    system, because the wrapper around a mark states a size and no\n` +
      `    viewBox. Keyed by file name without the extension. */\n` +
      `export const MARK_SVG: Readonly<Record<string, string>> = {\n` +
      marks.map((m) => `  ${JSON.stringify(m.name)}: ${JSON.stringify(m.svg)},`).join('\n') +
      `\n};\n`,
  ],
];

const check = process.argv.includes('--check');
let stale = 0;
for (const [file, text] of MODULES) {
  const out = join(ROOT, 'src', 'components', file);
  if (check) {
    if (readFileSync(out, 'utf8') !== text) {
      console.error(`✗ src/components/${file} is out of date — run \`make diagrams\``);
      stale++;
    }
  } else {
    writeFileSync(out, text);
    console.log(`src/components/${file}`);
  }
}

if (check) {
  if (stale) process.exit(1);
  console.log(`   ${drawings.length} drawings and ${marks.length} marks, in step`);
} else {
  for (const d of drawings) console.log(`${d.name} — ${d.viewBox}`);
  for (const m of marks) console.log(`${m.name} — referenced whole`);
}
