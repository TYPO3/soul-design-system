#!/usr/bin/env node
/* Draw each drawing that has a spec, then read the referenced artwork into
   the modules that need it — `make diagrams`, or `ARGS=--check`.

   A page references artwork rather than links it, so its colours are the
   page's tokens, and the files then owe two things. The viewBox, since `<use>`
   carries the shapes and not the size, and a drawing names a `<g>`, which
   carries none. Kept by hand a viewBox drifts, and a drifted one is a drawing
   squashed by a fraction. And the markup, because a card opened from disk
   resolves a reference to nothing. Only the static render path imports that,
   so `soul.js` never pays for it. */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { type DiagramSpec, diagram, parse } from '../packages/frontend/src/lib/diagram/index.ts';
import { FRONTEND, ROOT } from './lib/cards.ts';
import * as report from './lib/report.ts';

const ASSETS = join(FRONTEND, 'assets');
const DIR = join(ASSETS, 'diagrams');
const check = process.argv.includes('--check');
const stale: string[] = [];

/* A drawing with a spec beside it is output: the spec is the source, and
   the engine in `src/lib/diagram/` draws the file. A spec is a `.diagram`
   text or a `.json` object, never both. An author still draws a drawing
   with no spec by hand. */
const SPEC = /\.(diagram|json)$/;
const sources = new Map<string, string>();
const specs = readdirSync(DIR)
  .filter((f) => SPEC.test(f))
  .sort()
  .map((file) => {
    const name = file.replace(SPEC, '');
    const source = readFileSync(join(DIR, file), 'utf8');
    if (file.endsWith('.diagram')) sources.set(name, source);
    let spec: DiagramSpec;
    try {
      spec = file.endsWith('.json') ? (JSON.parse(source) as DiagramSpec) : parse(source);
    } catch (error) {
      throw new Error(`assets/diagrams/${file}: ${(error as Error).message}`);
    }
    const { svg } = diagram(spec, { name });
    const out = join(DIR, `${name}.svg`);
    if (!check) writeFileSync(out, svg);
    else if (!existsSync(out) || readFileSync(out, 'utf8') !== svg) stale.push(`assets/diagrams/${name}.svg is out of step with its spec`);
    return name;
  });
const twice = specs.filter((name, i) => specs.indexOf(name) !== i);
if (twice.length) throw new Error(`assets/diagrams/: ${twice.join(', ')} has a .diagram and a .json spec — keep one`);

/** The group `<use>` points at in a drawing. Every one of them names it the
    same. A reference to the root `<svg>` clones the `<title>` and `<desc>`
    into a wrapper that already carries the alt text. The drawing then reads
    out twice. A mark has no `<title>` to clone and names its root instead. That
    is what lets the same file open on its own and serve as a favicon. */
const GROUP = /<g id="soul-ref">([\s\S]*)<\/g>/;

/** A mark names its root to say a reference can point at it. */
const ROOTED = /<svg\b[^>]*\sid="soul-ref"/;

const viewBoxOf = (file: string, text: string): string => {
  const viewBox = /<svg[^>]*\sviewBox="([^"]+)"/.exec(text)?.[1];
  if (!viewBox) throw new Error(`${file}: no viewBox on the root <svg> — no reference can point at artwork without one`);
  return viewBox;
};

/* A double dash inside a comment is illegal XML, and an SVG parses as XML the
   moment a fetch brings it. So the file renders nothing anywhere and the only
   sign of it is a blank space. Easy to write by accident, because the token
   names these files are full of carry two. A note that explains
   `var(--token, #hex)` breaks the drawing it explains. */
const wellFormed = (file: string, text: string): void => {
  for (const comment of text.matchAll(/<!--([\s\S]*?)-->/g)) {
    if ((comment[1] ?? '').includes('--')) {
      throw new Error(`${file}: a comment carries a double dash — that is invalid XML, and the file draws nothing wherever it lands`);
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
    if (!shapes) throw new Error(`${file}: no <g id="soul-ref"> — the drawing has nothing <use> can reach`);
    /* The faces a drawing carries are for a file shown on its own. Inline, the
       page's faces set it, and a card carries no style block. */
    return { name: file.replace(/\.svg$/, ''), viewBox, shapes: shapes.replace(/<style>[\s\S]*?<\/style>\s*/, '').trim() };
  });

/* A mark goes into the card whole, as a nested `<svg>` rather than loose
   shapes. That is what carries the coordinate system across, since the wrapper
   states a size and no viewBox. What comes out is the drawing and nothing
   else. The wrapper already says what the picture is, and the `id` goes too,
   or a card with one mark twice ships it twice. */
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
      `\n};\n\n` +
      `/** The text of each drawing, keyed by file name without the\n` +
      `    extension, for an element that draws it in a page's tokens. */\n` +
      `export const DIAGRAM_SOURCES: Readonly<Record<string, string>> = {\n` +
      [...sources].map(([n, t]) => `  ${JSON.stringify(n)}: ${JSON.stringify(t)},`).join('\n') +
      `\n};\n`,
  ],
];

report.open('diagrams', check ? 'the drawings match their specs, and the modules the drawings' : 'draw the specs, and read the drawings into the modules');

for (const [file, text] of MODULES) {
  const out = join(FRONTEND, 'src', 'components', file);
  if (check) {
    if (readFileSync(out, 'utf8') !== text) stale.push(`src/components/${file} is out of date`);
  } else {
    writeFileSync(out, text);
    report.fact(`src/components/${file}`, 'written');
  }
}

if (!check) {
  for (const d of drawings) report.fact(d.name, `${d.viewBox}${specs.includes(d.name) ? ' · from its spec' : ''}`);
  for (const m of marks) report.fact(m.name, 'referenced whole');
}
report.summary(`${drawings.length} drawings · ${marks.length} marks`, stale);
process.exit(stale.length ? 1 : 0);
