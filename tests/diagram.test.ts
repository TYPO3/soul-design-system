/* A diagram drawn from data: what it refuses, and what the browser sets.

   The engine measures every text before it draws it. That measurement is
   only worth something if the browser sets the same text no wider. So this
   file draws every spec of the stories in the shipped faces. It then holds
   each text against the width that the engine counted for it. */

import { beforeAll, describe, expect, test } from 'vitest';
import { type DiagramSpec, diagram, parse } from '../packages/frontend/src/lib/diagram/index.ts';
import { measure, wrap } from '../packages/frontend/src/lib/diagram/text.ts';
import { html, render } from 'lit';
import { readable } from '../.storybook/source.ts';
import { diagramElement, sdsDiagram } from '../stories/lib/diagram.ts';
import * as bars from '../stories/diagrams/Bars.stories.ts';
import * as cellsStories from '../stories/diagrams/Cells.stories.ts';
import * as chipsStories from '../stories/diagrams/Chips.stories.ts';
import * as compose from '../stories/diagrams/Compose.stories.ts';
import * as columns from '../stories/diagrams/Columns.stories.ts';
import * as flow from '../stories/diagrams/Flow.stories.ts';
import * as matrix from '../stories/diagrams/Matrix.stories.ts';
import * as sequence from '../stories/diagrams/Sequence.stories.ts';
import * as sketch from '../stories/diagrams/Sketch.stories.ts';
import * as tiles from '../stories/diagrams/Tiles.stories.ts';
import * as units from '../stories/diagrams/Units.stories.ts';

const SPECS: [string, DiagramSpec][] = [bars, cellsStories, chipsStories, columns, compose, flow, matrix, sequence, sketch, tiles, units].flatMap((file) =>
  Object.entries(file)
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
    .map(([name, text]): [string, DiagramSpec] => [name, parse(text)]),
);

/* The faces the stylesheet declares, loaded before the first text asks for
   them. A face with `font-display: optional` that is late keeps its
   fallback, and the widths below are then the fallback's. */
beforeAll(async () => {
  await Promise.all([...document.fonts].map((face) => face.load()));
  for (const font of ['400 13px "Source Code Pro"', '600 13px "Source Code Pro"', '700 16px "Source Sans 3"']) {
    expect(document.fonts.check(font), font).toBe(true);
  }
});

const BASE: DiagramSpec = {
  kind: 'flow',
  title: 'A claim',
  description: 'Two nodes.',
  columns: [1, 1],
  nodes: [
    { id: 'a', at: [0, 0], title: 'One' },
    { id: 'b', at: [1, 0], title: 'Two' },
  ],
  edges: [{ from: 'a', to: 'b' }],
};

describe('the build refuses what the grammar forbids', () => {
  test('a second emphasis on a part of another kind', () => {
    /* Peers of one kind share the claim; a connector beside them is a second one. */
    const peers: DiagramSpec = { ...BASE, nodes: BASE.nodes.map((n) => ({ ...n, emphasis: true })) };
    expect(() => diagram(peers, { name: 'peers' })).not.toThrow();
    const spec: DiagramSpec = { ...peers, edges: [{ from: 'a', to: 'b', emphasis: true }] };
    expect(() => diagram(spec, { name: 'two' })).toThrow(/second emphasis/);
  });

  test('a text too wide for its box', () => {
    const spec: DiagramSpec = { ...BASE, nodes: [{ id: 'a', at: [0, 0], title: 'x'.repeat(200) }, { id: 'b', at: [1, 0], title: 'Two' }] };
    expect(() => diagram(spec, { name: 'wide' })).toThrow(/wide, and its box is/);
  });

  test('a flow that takes the room its words ask for, up to twice its own', () => {
    const long = 'Navigation'.repeat(2);
    const columns = [1, 1, 1, 1, 1, 1];
    const one: DiagramSpec = { ...BASE, columns, nodes: [{ id: 'a', at: [0, 0], title: long }, { id: 'b', at: [5, 0], title: 'Two' }] };
    const all: DiagramSpec = { ...BASE, columns, edges: [], nodes: columns.map((_, c) => ({ id: `n${c}`, at: [c, 0] as [number, number], title: long })) };
    expect(diagram(BASE, { name: 'fits' }).width).toBe(1200);
    /* One narrow column borrows from the others, and the drawing keeps its width. */
    expect(diagram(one, { name: 'borrows' }).width).toBe(1200);
    expect(diagram(all, { name: 'grows' }).width).toBeGreaterThan(1200);
    /* On a slide the room stays the room. A chain folds into rows. */
    expect(diagram(all, { name: 'folds', slide: { width: 800, height: 400 } }).svg).toContain('</svg>');
    const scattered: DiagramSpec = { ...all, nodes: all.nodes.map((n, c) => ({ ...n, at: [c, c % 2] as [number, number] })) };
    expect(() => diagram(scattered, { name: 'slide', slide: { width: 800, height: 400 } })).toThrow(/the slide's room is 800/);
  });

  test('a lettered column draws its letter, and a head with nothing under it has no rule', () => {
    const text = `columns\ntitle "A claim"\ndescription "Two parts."\n\ncolumn "Context" letter="A"\n  body "Why this paper?"\ncolumn "Requirements" letter="B" strong\n  body "What must it be?"\n`;
    const { svg } = diagram(parse(text), { name: 'letters' });
    expect(svg).toContain('>A</text>');
    expect(svg).not.toMatch(/<line /);
  });

  test('a part whose layout shares its name with an option reads as that layout', () => {
    const text = `compose\ntitle "A claim"\ndescription "Two parts."\n\npart\n  columns chain\n  column "One"\n    item "a"\n  column "Two"\n    item "b"\npart\n  tiles\n  tile "1" "one"\n`;
    expect(() => diagram(parse(text), { name: 'parts' })).not.toThrow();
  });

  test('a narrow gap refuses a boundary only where the boundary ends between columns', () => {
    const text = (second: string) => `flow\n  columns 1,1\n  gap 16,12\ntitle "A claim"\ndescription "Two boxes."\n\ngroup "All"\n  a "One"\n    at 0,0\n${second}`;
    expect(() => diagram(parse(text('  b "Two"\n    at 1,0\n')), { name: 'across' })).not.toThrow();
    expect(() => diagram(parse(text('b "Two"\n  at 1,0\n')), { name: 'between' })).toThrow(/leaves no room for a boundary/);
  });

  test('a narrow column wraps a hint and sets its sub line under the place sign', () => {
    const head = `columns\ntitle "A claim"\ndescription "Three panels."\n\n`;
    const one = `column "One"\n  sub "hidden · timed · group"\n  place page\n`;
    const hint = `  hint "THE LANGUAGE COMPARISON OF THE PAGE MODULE"\n  text "a"\n`;
    const text = `${head}${one}${hint}column "Two"\n  text "b"\ncolumn "Three"\n  text "c"\n`;
    const { svg, width } = diagram(parse(text), { name: 'narrow', slide: { width: 640, height: 400 } });
    expect(width).toBe(640);
    expect(svg).not.toContain('>THE LANGUAGE COMPARISON OF THE PAGE MODULE<');
    expect(svg).toContain('>hidden · timed · group<');
  });

  test('a path breaks after its slashes, and a name in it stays whole where it fits', () => {
    expect(wrap('typo3/cms-frontend/preview-simulator', 175, { size: 16, weight: 600 }, 'path')).toEqual(['typo3/', 'cms-frontend/', 'preview-simulator']);
  });

  test('a column takes the width a name needs from the others, where they can spare it', () => {
    const text = `flow\n  columns 1,1,1\ntitle "A claim"\ndescription "Three boxes."\n\na "page-resolver"\n  at 0,0\nb "shortcut-and-mountpoint-redirect"\n  at 1,0\nc "auth"\n  at 2,0\n`;
    const { svg } = diagram(parse(text), { name: 'whole' });
    expect(svg).toContain('>shortcut-and-mountpoint-redirect</text>');
  });

  test('a text of parts breaks after a separator where it can, and no line opens with one', () => {
    const lines = wrap('view of the page module · not the edit view', 192, { size: 13, face: 'mono' }, 'separator');
    expect(lines.length).toBeGreaterThan(1);
    expect(lines.some((l) => l.startsWith('·'))).toBe(false);
    expect(wrap('Ctrl+Alt+P · Esc ends it', 120, { size: 14 }, 'parts')).toEqual(['Ctrl+Alt+P ·', 'Esc ends it']);
  });

  test('a rendered row that wraps draws the bar of its rendering under its last line', () => {
    const head = `columns\ntitle "A claim"\ndescription "Three panels."\n\n`;
    const list = `column "One"\n  list rendered\n    row "⠿ Holiday notice for the summer" absent\n`;
    const text = `${head}${list}column "Two"\n  text "b"\ncolumn "Three"\n  text "c"\n`;
    const { svg } = diagram(parse(text), { name: 'rendered', slide: { width: 520, height: 400 } });
    const last = Math.max(...[...svg.matchAll(/<text[^>]* y="([\d.]+)"[^>]*>[^<]*(?:Holiday|summer)[^<]*</g)].map((m) => Number(m[1])));
    const bar = Number(svg.match(/<rect[^>]* y="([\d.]+)"[^>]* height="4"/)?.[1]);
    expect(bar).toBeGreaterThan(last);
  });

  test('a slim field with no room breaks after its separator and never inside a part', () => {
    const head = `columns\ntitle "A claim"\ndescription "Three panels."\n\n`;
    const field = `column "One"\n  field "Text · Buchen Sie jetzt" slim\n`;
    const text = `${head}${field}column "Two"\n  text "b"\ncolumn "Three"\n  text "c"\n`;
    const { svg } = diagram(parse(text), { name: 'parts', slide: { width: 520, height: 400 } });
    expect(svg).toContain('>Text ·<');
    expect(svg).toContain('>Buchen Sie jetzt<');
  });

  test('a matrix with its notes outside keeps the numbers and draws no note', () => {
    const text = (notes: string) => `matrix\n${notes}title "A claim"\ndescription "Two rows."\n\ncolumn "One"\ncolumn "Two"\n\nrow "A": yes partly^1\nrow "B": no yes\n`;
    expect(() => diagram(parse(text('')), { name: 'inside' })).toThrow(/points at note 1, and there is none/);
    const drawn = diagram(parse(text('  notes outside\n')), { name: 'outside' });
    expect(drawn.svg).toContain('>1</text>');
  });

  test('a chain on a slide folds into the rows that wrap its cards the least', () => {
    const chain: DiagramSpec = {
      ...BASE,
      columns: [1, 1, 1, 1, 1, 1],
      nodes: ['Request with token', 'token valid?', 'in a frame?', 'same browser?', 'page in scope?', 'Preview'].map((title, c) => ({ id: `n${c}`, at: [c, 0] as [number, number], title, body: 'no means an error page' })),
      edges: [0, 1, 2, 3, 4].map((c) => ({ from: `n${c}`, to: `n${c + 1}`, label: 'yes' })),
    };
    const rows = (svg: string): number => new Set([...svg.matchAll(/<rect x="[\d.]+" y="([\d.]+)" width="[\d.]+" height="[\d.]+" rx="6"/g)].map((m) => m[1])).size;
    expect(rows(diagram(chain, { name: 'page' }).svg)).toBe(1);
    expect(rows(diagram(chain, { name: 'slide', slide: { width: 520, height: 400 } }).svg)).toBeGreaterThan(1);
  });

  test('controls wider than their room, in a row, in tabs and in a toolbar', () => {
    const column = (lines: string): DiagramSpec => parse(`columns\ntitle "t"\ndescription "d"\ncolumn "C"\n${lines}`);
    const wide = 'Structure,'.repeat(40).slice(0, -1);
    /* A column grows for a control that cannot wrap, up to twice its room. */
    expect(() => diagram(column(`  row\n${'    button "A long button"\n'.repeat(20)}`), { name: 'row' })).toThrow(/more than twice the room/);
    expect(() => diagram(column(`  tabs "${wide}"`), { name: 'tabs' })).toThrow(/more than twice the room/);
    expect(() => diagram(column(`  toolbar "${wide}"`), { name: 'toolbar' })).toThrow(/more than twice the room/);
    /* A long text in a row wraps before the row refuses it. */
    expect(() => diagram(column('  row\n    button "Retry"\n    text "The connection failed. The text stays in the page, and a retry sends it again."'), { name: 'wraps' })).not.toThrow();
  });

  test('a node holds a list, in columns, and its signed entries hang', () => {
    const one = (lines: string): string => `flow\n  columns 1,1\ntitle "t"\ndescription "d"\na "Box"\n  at 0,0\nlist\n  at 1,0\n  plain\n${lines}a -> list\n`;
    const listed = diagram(parse(one('  item "First" body="its line"\n  item "Second" value="4"\n')), { name: 'list' });
    expect(listed.svg).toContain('>First</text>');
    expect(listed.svg).toMatch(/font-weight="600"[^>]*>First</);
    expect(listed.svg).toContain('>4</text>');
    const x = (svg: string, word: string): number => Number(new RegExp(`x="([\\d.]+)"[^>]*>${word}<`).exec(svg)?.[1]);
    const across = diagram(parse(one('  across 2\n  item "Left"\n  item "Right"\n')), { name: 'across' });
    expect(x(across.svg, 'Right')).toBeGreaterThan(x(across.svg, 'Left'));
    const hung = diagram(parse(one(`  item "{yes} ${'Theme styles stay in the frame. '.repeat(3)}"\n`)), { name: 'hang' });
    const xs = [...hung.svg.matchAll(/<text x="([\d.]+)"[^>]*>Theme|<text x="([\d.]+)"[^>]*>(?!Box)[a-z]/g)].map((m) => Number(m[1] ?? m[2]));
    expect(Math.min(...xs.slice(1))).toBeGreaterThanOrEqual(xs[0] ?? 0);
    expect(() => parse('flow\ntitle "t"\ndescription "d"\nlist\n  at 0,0\n')).toThrow(/needs its title/);
  });

  test('a column grows for a control that cannot wrap, and a row of a list wraps', () => {
    const three = (lines: string): string => `columns\ntitle "t"\ndescription "d"\ncolumn "A"\n${lines}column "B"\n  item "b"\ncolumn "C"\n  item "c"\n`;
    const step = '  step "DataHandler validates again and saves the record of the page"\n';
    const columns = (svg: string): number[] => [...svg.matchAll(/<rect[^>]*width="([\d.]+)"[^>]*rx="6"/g)].map((m) => Number(m[1])).slice(0, 3);
    /* Peers keep one width: a column that needs more grows them all. */
    const grown = diagram(parse(three(step)), { name: 'step' });
    expect(grown.width).toBeGreaterThan(1200);
    expect(new Set(columns(grown.svg)).size).toBe(1);
    expect(diagram(parse(three('  step "Saves"\n')), { name: 'short' }).width).toBe(1200);
    const list = diagram(parse(three('  list\n    row "Hero · Summer offers for the whole family this year"\n')), { name: 'list' });
    expect(list.width).toBe(1200);
    expect([...list.svg.matchAll(/font-size="14">/g)].length).toBeGreaterThan(3);
  });

  test('peers in one claim: rows that touch share a frame, a filled chip, a strong node', () => {
    const rows = diagram(parse('matrix\ntitle "t"\ndescription "d"\ncolumn "A"\nemphasis row="One"\nemphasis row="Two"\nrow "One": yes\nrow "Two": no\nrow "Three": yes\n'), { name: 'rows' });
    expect(rows.svg.match(/stroke="var\(--accent/g)).toHaveLength(1);
    const filled = diagram(parse('sketch\n  height 120\ntitle "t"\ndescription "d"\nscreen\n  region\n    chip "A1" "Text" emphasis fill\n    chip "A2" "Media"\n'), { name: 'fill' });
    expect(filled.svg).toMatch(/fill="var\(--accent, #FF8700\)" stroke="var\(--accent/);
    const strong = diagram(parse('flow\n  columns 1\ntitle "t"\ndescription "d"\na "One"\n  at 0,0\n  strong\n'), { name: 'strong' });
    expect(strong.svg).toMatch(/stroke="var\(--text-primary, #1C1A17\)" stroke-width="2"/);
  });

  test('a staircase, a click path, a nested boundary, a curved fan and one legend', () => {
    const stairs = diagram(parse('columns rise\ntitle "t"\ndescription "d"\ncolumn "L0"\n  item "a"\ncolumn "L1"\n  item "b"\n'), { name: 'rise' });
    const tops = [...stairs.svg.matchAll(/<rect x="[\d.]+" y="([\d.]+)" width="[\d.]+" height="([\d.]+)" rx="6"/g)].map((m) => [Number(m[1]), Number(m[1]) + Number(m[2])]);
    expect(tops[0]?.[0]).toBeGreaterThan(tops[1]?.[0] ?? 0);
    expect(tops[0]?.[1]).toBe(tops[1]?.[1]);
    const path = diagram(parse('matrix\ntitle "t"\ndescription "d"\ncolumn "Click path" weight=3\ncolumn "Needs"\nrow "Change": path="Click › Type › Leave" `F1`\n'), { name: 'path' });
    expect(path.svg.match(/>›</g)).toHaveLength(2);
    const nested = diagram(parse('flow\n  columns 1,1\ntitle "t"\ndescription "d"\ngroup outer "Outer"\n  a "A"\n    at 0,0\n  group inner "Inner"\n    b "B"\n      at 1,0\n'), { name: 'nested' });
    expect(nested.svg).toContain('>Inner</text>');
    expect(nested.svg).toContain('>Outer</text>');
    const curve = diagram(parse('flow fan curve\n  columns 1,1\ntitle "t"\ndescription "d"\na "A"\n  at 0,0\n  rows 2\nb "B"\n  at 1,0\nc "C"\n  at 1,1\na -> b\na -> c\n'), { name: 'curve' });
    expect(curve.svg.match(/d="M[\d. ]+C/g)).toHaveLength(2);
    const legend = 'legend yes="met" no="missing"';
    const once = diagram(parse([`compose`, `  direction column`, `title "t"`, `description "d"`, `part`, `  cells`, `  group "G"`, `    sub "gap"`, `    tone warn`, `    A1 yes`, `  ${legend}`, `part`, `  matrix`, `  column "L0"`, `  row "core": no`, `  ${legend}`, ``].join('\n')), { name: 'once' });
    expect(once.svg.match(/>missing</g)).toHaveLength(1);
    expect(once.svg).toMatch(/fill="var\(--status-warn[^"]*"[^>]*>gap</);
  });

  test('a table in a list, a join, a tooltip in ink, a bold run and a menu over the page', () => {
    const column = (lines: string): DiagramSpec => parse(`columns\ntitle "t"\ndescription "d"\ncolumn "C"\n${lines}`);
    expect(() => diagram(column('  list columns=1,1\n    row "a | b | c"'), { name: 'cells' })).toThrow(/3 cells, and the list has 2 columns/);
    expect(() => diagram(column('  field "a" id=a\n  join a b'), { name: 'join' })).toThrow(/no control has that id/);
    const joined = diagram(column('  field "a" slim id=a\n  field "b" slim id=b\n  join a b dashed'), { name: 'joined' });
    expect(joined.svg).toMatch(/<line [^>]*stroke-dasharray/);
    const ink = diagram(column('  frame ink\n    text "Read-only."'), { name: 'ink' });
    expect(ink.svg).toMatch(/fill="var\(--surface-canvas[^"]*"[^>]*>Read-only\.</);
    const bold = diagram(column('  field "Book your **summer trip** now"'), { name: 'bold' });
    expect(bold.svg).toMatch(/font-weight="600"[^>]*>summer trip</);
    const under = (more: string): number => diagram(column(`  field "Teaser" slim\n${more}  field "Text" slim\n  field "Contact" slim\n`), { name: 'over' }).height;
    expect(under('  frame over\n    text "Move up"\n')).toBe(under(''));
    const heads = diagram(parse('flow\n  columns 1,1\ntitle "t"\ndescription "d"\ncolumn 0 "Rules"\ncolumn 1 "Additions"\na "A"\n  at 0,0\nb "+ B"\n  at 1,0\n  plain\n'), { name: 'heads' });
    expect(heads.svg).toContain('>ADDITIONS</text>');
    expect(heads.svg.match(/<rect [^>]*rx="6"/g)).toHaveLength(1);
    const table = diagram(parse('matrix left head="Task"\ntitle "t"\ndescription "d"\ncolumn "Needs"\nrow "Change": `F1`\n'), { name: 'left' });
    expect(table.svg).toContain('>TASK</text>');
    expect(table.svg).not.toMatch(/text-anchor="middle"[^>]*>F1</);
    const named = diagram(parse('columns rise rows="core,extension"\ntitle "t"\ndescription "d"\ncolumn "L0"\n  item "core" sign=yes\n  item "extension" sign=no\ncolumn "L1"\n  item "core" sign=no\n  item "extension" sign=no\n'), { name: 'rows' });
    expect(named.svg.match(/>extension</g)).toHaveLength(1);
    const boxed = diagram(parse('cells boxed\ntitle "t"\ndescription "d"\ngroup "Edit"\n  sub "large gap"\n  A1 yes\n  A4 partly\n'), { name: 'boxed' });
    expect(boxed.svg.match(/<rect [^>]*stroke=/g)).toHaveLength(1);
    const plan = diagram(parse('matrix blocks\ntitle "t"\ndescription "d"\ncolumn "Sprint 1" letter=A sub="first"\nlegend yes="good" note="A is a proposal."\nrow "WP1": "29"\nrow "WP2": "(1)"\nrow "WP3": yes\n'), { name: 'plan' });
    expect(plan.svg).toMatch(/fill="var\(--surface-sunken[^"]*"><\/rect>\s*<text[^>]*>29</);
    expect(plan.svg).toMatch(/stroke-width="1.2"><\/rect>\s*<text[^>]*>1</);
    expect(plan.svg).toContain('>A is a proposal.</text>');
    const screens = diagram(parse('sketch heads\n  height 120\ntitle "t"\ndescription "d"\nscreen "Small"\n  region\n    emphasis\n'), { name: 'heads' });
    expect(screens.svg).toMatch(/fill="var\(--accent[^"]*"[^>]*>SMALL</);
  });

  test('a sign in a text, a place, an insertion point, an entry and the small marks of a screen', () => {
    const column = (lines: string, head = ''): DiagramSpec => parse(`columns\ntitle "t"\ndescription "d"\ncolumn "C"${head}\n${lines}`);
    const signed = diagram(column('  text "Holiday · {clock} 24.12."\n  text "{nothing} stays"'), { name: 'glyph' });
    expect(signed.svg).toContain('>Holiday ·</text>');
    expect(signed.svg).toContain('>24.12.</text>');
    expect(signed.svg).toContain('>{nothing} stays</text>');
    expect(signed.svg).not.toMatch(/[-]/);
    const placed = diagram(column('  text "a"', '\n  place nav'), { name: 'place' });
    expect(placed.svg.match(/rx="1" fill="var\(--text-primary/g)).toHaveLength(1);
    const insert = diagram(column('  insert strong\n  insert'), { name: 'insert' });
    expect(insert.svg.match(/<circle [^>]*r="8"/g)).toHaveLength(2);
    expect(insert.svg).toMatch(/<line [^>]*stroke-dasharray/);
    const entry = diagram(column('  entry "Text" sign=text body="A heading and a **text**." selected'), { name: 'entry' });
    expect(entry.svg).toMatch(/font-weight="600"[^>]*>Text</);
    expect(entry.svg).toMatch(/font-weight="600"[^>]*>text</);
    expect(() => column('  entry "Text" sign=star')).toThrow(/sign=star/);
    const marks = diagram(column('  frame device\n    frame sheet dot\n      field "a" slim dot\n  button "↑" round\n  thumb "Anna" show=person\n  list\n    row "Banner" button="Show"'), { name: 'marks' });
    expect(marks.svg.match(/<circle [^>]*r="3.5"/g)).toHaveLength(2);
    expect(marks.svg).toContain('>Show</text>');
    expect(marks.svg).toMatch(/text-anchor="middle"[^>]*>Anna</);
    const joined = diagram(column('  button "Unsaved · 2" small id=a\n  button "In progress" small id=b\n  join a b'), { name: 'straight' });
    const [, x1, x2] = joined.svg.match(/<line x1="([\d.]+)" y1="[\d.]+" x2="([\d.]+)"/) ?? [];
    expect(x1).toBeDefined();
    expect(x1).toBe(x2);
  });

  test('even rows, an exit, a chain of parts, a join across, a bare arrow and bold runs', () => {
    const column = (lines: string): DiagramSpec => parse(`columns\ntitle "t"\ndescription "d"\ncolumn "C"\n${lines}`);
    const flow = (head: string): string =>
      diagram(parse(`${head}\n  columns 1,1\ntitle "t"\ndescription "d"\na "A"\n  at 0,0\nb "B"\n  at 0,1\n  dashed\nn "Note"\n  at 1,0\n  plain\n  body "under it"\n`), { name: 'even' }).svg;
    const heights = (svg: string): number[] => [...svg.matchAll(/<rect [^>]*height="([\d.]+)" rx="6"/g)].map((m) => Number(m[1]));
    const [a, b] = heights(flow('flow even'));
    expect(a).toBe(b);
    expect(heights(flow('flow'))[0]).toBeGreaterThan(heights(flow('flow'))[1] ?? 0);
    expect(flow('flow')).toMatch(/rx="6" fill="[^"]*" stroke="var\(--text-muted[^"]*" stroke-width="1.5" stroke-dasharray/);
    const chained = diagram(parse('compose chain\ntitle "t"\ndescription "d"\npart\n  tiles\n  tile "1" "One"\npart\n  tiles\n  tile "2" "Two"\n'), { name: 'chain' });
    expect(chained.svg).toMatch(/<path d="M[\d.]+ ([\d.]+) L[\d.]+ \1"/);
    const across = diagram(column('  row\n    field "a" slim id=a\n    field "b" slim id=b\n  join a b dashed'), { name: 'across' });
    expect(across.svg).toMatch(/<line x1="[\d.]+" y1="([\d.]+)" x2="[\d.]+" y2="\1"[^>]*stroke-dasharray/);
    const arrow = diagram(column('  field "a" slim\n  arrow\n  field "b" slim'), { name: 'arrow' });
    expect(arrow.svg).toMatch(/<path d="M([\d.]+) [\d.]+ L\1 [\d.]+"/);
    const runs = diagram(column('  text "Summer **__offers__**"\n  code\n    line "**  contract: 1**"\n  image "image · panel" lines=0\n  text "WordPress {no}"'), { name: 'runs' });
    expect(runs.svg).toMatch(/font-weight="600"[^>]*>offers</);
    expect(runs.svg).toMatch(/font-weight="600"[^>]*>contract: 1</);
    expect(runs.svg).toContain('>image · panel</text>');
    expect(runs.svg).toMatch(/stroke="var\(--status-error/);
  });

  test('a boundary as the claim, heads with eyebrows, tags, figures aside, ids and the controls of a touch screen', () => {
    const flow = diagram(
      parse('flow\n  columns 1,1\ntitle "t"\ndescription "d"\ncolumn 0 "Template" eyebrow="Pattern A"\ncolumn 1 "Contract" emphasis\ngroup c ""\n  emphasis\n  b "B"\n    at 1,0\na "A"\n  at 0,0\n  eyebrow "Record"\n  tag `T1`\n  body "one\\ntwo"\n'),
      { name: 'claim' },
    );
    expect(flow.svg).toContain('>PATTERN A</text>');
    expect(flow.svg).toContain('>RECORD</text>');
    expect(flow.svg).toMatch(/Mono[^>]*>T1</);
    expect(flow.svg).toMatch(/fill="var\(--accent[^"]*"[^>]*>CONTRACT</);
    expect(flow.svg).toMatch(/stroke="var\(--accent[^"]*" stroke-width="2"/);
    expect(flow.svg).toContain('>two</text>');
    const tiles = diagram(parse('tiles aside\ntitle "t"\ndescription "d"\ntile "27" "Market"\n  unit "of 34 needs"\n'), { name: 'aside' }).svg;
    expect(tiles).toMatch(/text-anchor="end"[^>]*>27</);
    const table = diagram(parse('matrix left ids\ntitle "t"\ndescription "d"\ncolumn "Needs" end\nrow "WP1 Edit contract": `F1`\n'), { name: 'ids' }).svg;
    expect(table).toMatch(/Mono[^>]*>WP1</);
    expect(table).toMatch(/text-anchor="end"[^>]*>F1</);
    const touch = diagram(parse('columns\ntitle "t"\ndescription "d"\ncolumn "C"\n  keyboard\n  button "⋯" square\n  span "44 px"\n  field "Our routes" large bare\n'), { name: 'touch' }).svg;
    expect(touch).toMatch(/width="44" height="44"/);
    expect(touch).toContain('>44 px</text>');
    expect(touch.match(/<rect [^>]*rx="3" fill="var\(--surface-raised/g)?.length).toBe(21);
  });

  test('a pill, a line of a code block and a progress outside its share', () => {
    const column = (lines: string): DiagramSpec => parse(`columns\ntitle "t"\ndescription "d"\ncolumn "C"\n${lines}`);
    const long = 'Hidden '.repeat(60).trim();
    expect(() => diagram(column(`  pill "${long}"`), { name: 'pill' })).toThrow(/more than twice the room/);
    expect(() => diagram(column(`  code\n    line "${long}"`), { name: 'code' })).toThrow(/more than twice the room/);
    expect(() => column('  progress value=2')).toThrow(/a share from 0 to 1/);
    expect(() => parse('matrix\ntitle "t"\ndescription "d"\ncolumn "A"\nrow "R": wide="x"')).toThrow(/not a sign/);
  });

  test('a row divides by weight, and frames side by side are as high as each other', () => {
    const spec = parse(`columns\ntitle "t"\ndescription "d"\ncolumn "C"\n  row\n    frame "A" weight=3\n      text "a"\n    frame "B"\n      text "b"\n      lines lines=4`);
    const boxes = [...diagram(spec, { name: 'weight' }).svg.matchAll(/<rect x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="([\d.]+)" rx="4" fill="var\(--surface-raised/g)].map((m) => [Number(m[1]), Number(m[2])]);
    expect(boxes).toHaveLength(2);
    const [[wa = 0, ha], [wb = 0, hb]] = boxes as [number[], number[]];
    expect(wa / wb).toBeCloseTo(3, 0);
    expect(ha).toBe(hb);
  });

  test('a node over two rows is as high as both, and a fan shares no bend', () => {
    const spec = parse(
      ['flow fan', '  columns 1,1', 'title "t"', 'description "d"', 'a "A" at=0,0 rows=2', 'b "B" at=1,0', 'c "C" at=1,1', 'd "D" at=1,2', 'a -> b', 'a -> c', 'a -> d'].join('\n'),
    );
    const svg = diagram(spec, { name: 'fan' }).svg;
    const bends = [...svg.matchAll(/<path d="M[\d.]+ [\d.]+ L([\d.]+) [\d.]+ L[\d.]+ [\d.]+ L/g)].map((m) => m[1]);
    expect(bends.length).toBeGreaterThan(0);
    expect(new Set(bends).size).toBe(bends.length);
    expect(spec).toMatchObject({ fan: true });
    expect((spec as { nodes: unknown[] }).nodes[0]).toMatchObject({ id: 'a', rows: 2 });
  });

  test('a row of controls in a sketch that runs past its region', () => {
    const text = `sketch\n  height 120\ntitle "t"\ndescription "d"\nscreen\n  region "bar"\n    flow row\n${'    button "A long button"\n'.repeat(12)}`;
    expect(() => diagram(parse(text), { name: 'bar' })).toThrow(/its controls are \d+ wide, and its room is/);
  });

  test('an item wider than its place, and dots past the whole', () => {
    const narrow = (body: string): string => `sketch\n  height 120\ntitle "t"\ndescription "d"\nscreen\n  row\n    region "side"\n      size 120\n${body}    region "page"\n`;
    expect(() => diagram(parse(narrow('      chip "A1" "Text with a live preview"\n')), { name: 'item' })).toThrow(/the item A1 is \d+ wide, and its room is/);
    expect(() => parse(narrow('      dots value=13 of=12\n'))).toThrow(/the value no more than the whole/);
    expect(() => diagram(parse(narrow('      dots "Products" value=3 of=12\n')), { name: 'dots' })).toThrow(/12 dots are \d+ wide/);
  });

  test('an item wider than its column of a grid, and a grid past its region', () => {
    const grid = (body: string): string => `sketch\n  height 120\ntitle "t"\ndescription "d"\nscreen\n  region "page"\n${body}`;
    expect(() => diagram(parse(grid('    across 8\n    chip "A1" "Text with a live preview"\n')), { name: 'item' })).toThrow(/the item A1 is \d+ wide, and its room is/);
    expect(() => diagram(parse(grid(`    across 2\n${'    chip "A1" "Text"\n'.repeat(8)}`)), { name: 'grid' })).toThrow(/its controls are \d+ high/);
  });

  test('a page grid reads its items, its counts and its band', () => {
    const spec = parse(sketch.GRID) as unknown as { screens: { root: { children: { children?: { across?: number; widgets?: unknown[] }[] }[] }; band: { label: string; widgets: unknown[] } }[] };
    const [screen] = spec.screens;
    expect(screen?.band).toMatchObject({ label: 'UNDER THE SURFACE', widgets: [{ w: 'chip', text: 'D3', label: 'Drafts' }, { w: 'chip', text: 'E1' }] });
    const page = screen?.root.children[1]?.children?.[1];
    expect(page?.across).toBe(2);
    expect(page?.widgets?.[0]).toEqual({ w: 'chip', text: 'A1', label: 'Text, live preview', emphasis: true });
    const svg = diagram(parse(sketch.GRID), { name: 'grid' }).svg;
    expect(svg.match(/<circle/g)?.length).toBe(24);
  });

  test('a connector to a node that is not there', () => {
    const spec: DiagramSpec = { ...BASE, edges: [{ from: 'a', to: 'c' }] };
    expect(() => diagram(spec, { name: 'lost' })).toThrow(/ends at nothing/);
  });

  test('a drawing taller than the room of its slide', () => {
    expect(() => diagram(BASE, { name: 'tall', slide: { width: 800, height: 20 } })).toThrow(/the slide's room is 20/);
  });

  test('a matrix row with a cell too few', () => {
    const spec: DiagramSpec = { kind: 'matrix', title: 'A claim', description: 'A row.', columns: [{ label: 'A' }, { label: 'B' }], rows: [{ label: 'R', cells: ['yes'] }] };
    expect(() => diagram(spec, { name: 'short' })).toThrow(/1 cells for 2 columns/);
  });
});

test('the drawing is the file alone: its margin, its canvas and its accessible name', () => {
  const { svg, width } = diagram(BASE, { name: 'alone' });
  expect(width).toBe(1200);
  expect(svg).toContain('<title id="alone-title">A claim</title>');
  expect(svg).toMatch(/<rect x="60" y="60"/);
});

test('a slide drawing has no margin, and says how much of the room it fills', () => {
  const { svg, width, fill } = diagram(BASE, { name: 'slide', slide: { width: 800, height: 400 } });
  expect(width).toBe(800);
  expect(svg).not.toMatch(/<rect x="60" y="60"/);
  expect(fill).toBeGreaterThan(0);
  expect(fill).toBeLessThanOrEqual(1);
});

/* The same text at the same width. On a slide the controls, rows and gaps
   are lower, and the type keeps every size it has on a page. */
test('a slide drawing is denser than the page drawing of the same text, at the same type sizes', () => {
  const sizes = (svg: string): string[] => [...new Set([...svg.matchAll(/font-size="([\d.]+)"/g)].map((m) => m[1] ?? ''))].sort();
  for (const text of [columns.CASES, flow.SYSTEM]) {
    const spec = parse(text);
    const page = diagram(spec, { name: 'page' });
    const slide = diagram(spec, { name: 'dense', slide: { width: 1080, height: 4000 } });
    expect(slide.height, spec.title).toBeLessThan(page.height - 120);
    expect(sizes(slide.svg), spec.title).toEqual(sizes(page.svg));
  }
});

/* An image sees no face of the page, so this is the case the carried cuts
   exist for. The same file with its `<style>` taken out must paint other
   pixels, or the cuts did nothing. */
test('a drawing opened as an image sets its text in the faces it carries', async () => {
  const { svg, width, height } = diagram(BASE, { name: 'image' });
  const paint = async (markup: string): Promise<Uint8ClampedArray> => {
    const img = new Image();
    img.src = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }));
    await img.decode();
    const canvas = document.createElement('canvas');
    [canvas.width, canvas.height] = [width, height];
    const context = canvas.getContext('2d');
    if (!context) throw new Error('no 2d context');
    context.drawImage(img, 0, 0);
    return context.getImageData(0, 0, width, height).data;
  };
  expect(svg).toContain("font-family:'Soul Diagram Sans'");
  const carried = await paint(svg);
  const bare = await paint(svg.replace(/<style>[\s\S]*?<\/style>/, ''));
  expect(carried.some((v, i) => v !== bare[i])).toBe(true);
});

describe('a diagram written as text', () => {
  test('reads to the same spec as the object it stands for', () => {
    const spec = parse(`flow columns=1,1   # two columns
title "A claim"
description "Two nodes."
a "One" at=0,0
b "Two" at=1,0
a->b`);
    expect(spec).toEqual(BASE);
  });

  test('a cell, a segment and a group read from their own syntax', () => {
    const spec = parse(`matrix
title "A claim"
description "One row."
column "A"
column "B"
row "R" group="A group": dot="8 d" \`v1\``);
    expect(spec).toMatchObject({ rows: [{ label: 'R', group: 'A group', cells: [{ sign: 'dot', text: '8 d' }, { text: 'v1', code: true }] }] });
  });

  test('a chip, a cell and a note read from their short forms', () => {
    const chips = parse(`chips
title "t"
description "d"
row "R": A1 (B2)* ~C3!`);
    expect(chips).toMatchObject({ groups: [{ chips: [{ id: 'A1' }, { id: 'B2', kind: 'outline', ring: true }, { id: 'C3', kind: 'plain', emphasis: true }] }] });
    const matrix = parse(`matrix
title "t"
description "d"
column "A"
row "R": partly^1
note "Why in part."`);
    expect(matrix).toMatchObject({ rows: [{ cells: [{ sign: 'partly', note: 1 }] }], notes: ['Why in part.'] });
  });

  test('controls in a row, a frame and a list read from their lines under a column', () => {
    const spec = parse(`columns
title "t"
description "d"
column "C"
  row
    keycap "Ctrl"
    button "Save" small ink chip=D1,D3 push
  frame "Save?" close tone=warn
    text "At once."
  list handle
    row "    Card" selected right="hidden"
  lines lines=2`);
    expect(spec).toMatchObject({
      columns: [
        {
          widgets: [
            { w: 'row', items: [{ w: 'keycap', text: 'Ctrl' }, { w: 'button', text: 'Save', small: true, ink: true, chip: 'D1,D3', push: true }] },
            { w: 'frame', title: 'Save?', close: true, tone: 'warn', items: [{ w: 'text', text: 'At once.' }] },
            { w: 'list', handle: true, rows: [{ text: 'Card', indent: 2, selected: true, right: 'hidden' }] },
            { w: 'lines', lines: 2 },
          ],
        },
      ],
    });
  });

  test('states, marks and new controls read from their lines', () => {
    const spec = parse(`columns
title "t"
description "d"
column "C"
  badge "Needs a workspace"
  toolbar "Banner,Hide" active=1 ink
  frame absent hidden width=0.5
    tag "Hero"
    pill "Hidden" push
  field "Empty" absent slim
  code
    line "{"
    line "  a: 1"
  arrow "opens"
  progress value=0.5
  list steps
    row "One"
  text "a ~~b~~ __c__"
key "Works in a workspace" badge="Needs a workspace"
key "Each case" sign=any`);
    expect(spec).toMatchObject({
      legend: [{ badge: 'Needs a workspace' }, { sign: 'any' }],
      columns: [
        {
          badge: 'Needs a workspace',
          widgets: [
            { w: 'toolbar', ink: true, active: [1] },
            { w: 'frame', state: 'absent', hidden: true, width: 0.5, items: [{ w: 'tag', text: 'Hero' }, { w: 'pill', text: 'Hidden', push: true }] },
            { w: 'field', state: 'absent', slim: true },
            { w: 'code', lines: ['{', '  a: 1'] },
            { w: 'arrow', text: 'opens' },
            { w: 'progress', value: 0.5 },
            { w: 'list', steps: true },
            { w: 'text', text: 'a ~~b~~ __c__' },
          ],
        },
      ],
    });
    const svg = diagram(spec, { name: 'marks' }).svg;
    expect(svg).toContain('stroke-dasharray');
    expect(svg).not.toContain('~~');
    expect(svg).toMatch(/>a b c</);
  });

  test.each([
    ['', 'line 1: the text is empty'],
    ['chart', 'line 1: "chart" is not a layout'],
    ['flow\ndescription "x."', 'line 1: a diagram needs a `title'],
    ['matrix\ntitle "t"\ndescription "d"\nrow "R"', 'line 4: a row lists its cells after a colon'],
    ['matrix\ntitle "t"\ndescription "d"\nrow "R": maybe', 'line 4: "maybe" is not a cell'],
    ['flow\ntitle "t\ndescription "d"', 'line 2: a text with no closing "'],
    ['tiles\ntitle "t"\ndescription "d"\ntile "1" "A" sign=good', 'line 4: sign=good: write one of'],
  ])('%j fails, and the message names its line', (text, message) => {
    expect(() => parse(text)).toThrow(message);
  });
});

test('a story saves the file its text draws, and its source leaves the press out', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  try {
    render(sdsDiagram({ source: flow.SYSTEM, name: 'system' }), host);
    await customElements.whenDefined('sds-button');
    await new Promise((r) => requestAnimationFrame(r));
    const saved = host.querySelector<HTMLAnchorElement>('a[download]');
    expect(saved?.getAttribute('download')).toBe('system.svg');
    const svg = decodeURIComponent((saved?.getAttribute('href') ?? '').replace(/^data:image\/svg\+xml;charset=utf-8,/, ''));
    expect(svg).toBe(diagram(parse(flow.SYSTEM), { name: 'system' }).svg);
    expect(readable(host.innerHTML)).not.toContain('Download');
  } finally {
    host.remove();
  }
});

test('a zoomable drawing opens at the size of the window, drawn inline with ids of its own', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  try {
    render(sdsDiagram({ source: flow.SYSTEM, name: 'system', zoomable: true }), host);
    await customElements.whenDefined('sds-lightbox');
    /* The first drawing fetches the engine: its update waits for it. */
    await host.querySelector<HTMLElement & { updateComplete: Promise<boolean> }>('sds-diagram')?.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));
    const press = host.querySelector<HTMLButtonElement>('sds-diagram button.sds-zoom');
    expect(press?.querySelector('svg #system-title')).not.toBeNull();
    expect(host.querySelector('svg #system-large-title'), 'the closed viewer draws nothing').toBeNull();
    press?.click();
    await expect.poll(() => host.querySelector<HTMLDialogElement>('sds-diagram dialog')?.open).toBe(true);
    const dialog = host.querySelector<HTMLDialogElement>('sds-diagram dialog');
    expect(dialog?.querySelector('svg #system-large-title')).not.toBeNull();
    expect(dialog?.getAttribute('aria-label')).toBe(parse(flow.SYSTEM).title);
  } finally {
    host.remove();
  }
});

test('the viewer opens the drawing fitted, and zooms, moves and fits it again', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  try {
    render(sdsDiagram({ source: flow.SYSTEM, name: 'viewed', zoomable: true }), host);
    await customElements.whenDefined('sds-lightbox');
    /* The first drawing fetches the engine: its update waits for it. */
    await host.querySelector<HTMLElement & { updateComplete: Promise<boolean> }>('sds-diagram')?.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));
    host.querySelector<HTMLButtonElement>('button.sds-zoom')!.click();
    await new Promise((r) => setTimeout(r, 100));
    const stage = host.querySelector<HTMLElement>('.sds-lightbox__art')!;
    const drawing = () => host.querySelector('.sds-lightbox__canvas > svg')!.getBoundingClientRect();
    const scale = () => host.querySelector('.sds-lightbox__scale')!.textContent;
    const inside = () => {
      const s = stage.getBoundingClientRect();
      const d = drawing();
      return d.left >= s.left - 1 && d.right <= s.right + 1 && d.top >= s.top - 1 && d.bottom <= s.bottom + 1;
    };
    expect(inside()).toBe(true);
    const fitted = scale();
    host.querySelector<HTMLButtonElement>('button[title="Zoom in"]')!.click();
    expect(scale()).not.toBe(fitted);
    stage.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    stage.dispatchEvent(new KeyboardEvent('keydown', { key: '0', bubbles: true }));
    expect(scale()).toBe(fitted);
    expect(inside()).toBe(true);
  } finally {
    host.remove();
  }
});

test('a narrow column scrolls the drawing before its type falls under 9 pixels, and a slide scales whole', async () => {
  const host = document.createElement('div');
  host.style.width = '320px';
  document.body.append(host);
  try {
    render(html`${diagramElement({ source: flow.SYSTEM, name: 'narrow' })}${diagramElement({ source: flow.SYSTEM, name: 'slid', room: '1640,560' })}`, host);
    await customElements.whenDefined('sds-diagram');
    await new Promise((r) => requestAnimationFrame(r));
    const [page, slide] = [...host.querySelectorAll<HTMLElement>('.sds-diagram')];
    const svg = page!.querySelector('svg')!;
    expect((13 * svg.getBoundingClientRect().width) / svg.viewBox.baseVal.width).toBeGreaterThanOrEqual(8.99);
    expect(page!.scrollWidth).toBeGreaterThan(page!.clientWidth);
    expect(page!.tabIndex).toBe(0);
    expect(slide!.scrollWidth).toBeLessThanOrEqual(slide!.clientWidth);
  } finally {
    host.remove();
  }
});

/* A rule among a column's controls opens its foot. The foot stands at the
   bottom of the column, so the last lines of every column share a baseline. */
test('the first line after a rule stands on one baseline in every column', () => {
  const { svg } = diagram(
    parse(`columns
title "Two cases"
description "Two columns of unlike height, each with a closing line."
column "Short"
  text "One line."
  rule
  text "The close of the short one."
  text "A second line under its rule."
column "Tall"
  text "One line."
  text "A second line."
  text "A third line."
  rule
  text "The close of the tall one."`),
    { name: 'feet' },
  );
  const at = (words: string): string | undefined => svg.match(new RegExp(`y="([\\d.]+)"[^>]*>${words}<`))?.[1];
  expect(at('The close of the short one.')).toBeDefined();
  expect(at('The close of the short one.')).toBe(at('The close of the tall one.'));
});

/* A key under a sketch is plain text: no card, and each id in sans. A
   region's head is its name in bold sans. */
test('bare columns draw no card, and a head names its region in bold', () => {
  const key = diagram(
    parse(`columns bare
title "A key"
description "Two names and what they stand for."
column
  item "list view" id=Structure
  item "dialog" id=Library`),
    { name: 'key' },
  ).svg;
  expect(key).not.toContain('rx="6"');
  expect(key).toMatch(/font-family="[^"]*Sans[^"]*"[^>]*>Structure</);
  const named = diagram(
    parse(`sketch
  height 120
title "A head"
description "A screen with one named region."
screen
  column
    region "Panel" head`),
    { name: 'head' },
  ).svg;
  expect(named).toMatch(/font-weight="600"[^>]*>Panel</);
});

/* A bar frames its controls and leaves the id of the case outside. A grey
   frame is a part of the page, and only a dialog rules off its title. */
test('a bar frames its controls, a filled frame is grey, and a plain frame has no rule under its title', () => {
  const { svg } = diagram(
    parse(`columns
title "A bar"
description "A bar with its save state and an id, a grey part of the page and a titled frame."
column "Page"
  row bar
    text "Saved"
    button "Discard" small
    chip "D2" push
  frame fill
    text "Hero" strong
  frame "Summer offers"
    text "Book now."`),
    { name: 'bar' },
  );
  const bar = svg.match(/<rect x="([\d.]+)" y="[\d.]+" width="([\d.]+)"[^>]*fill="var\(--surface-raised[^>]*stroke="var\(--border-strong/);
  const chip = svg.match(/<rect x="([\d.]+)"[^>]*>(?:(?!<rect).)*?D2</s);
  expect(bar, 'the bar').not.toBeNull();
  expect(Number(chip?.[1]), 'the id stands after the bar').toBeGreaterThan(Number(bar?.[1]) + Number(bar?.[2]));
  expect(svg).toContain('var(--surface-inset');
  expect(svg.match(/<line /g) ?? []).toHaveLength(0);
});

/* Every `.. diagram::` body in the documents: the indented text under the
   directive, with its options cut off. A refused example is a page that
   teaches a text the engine does not draw. */
const DOCUMENTED = Object.entries(
  import.meta.glob(['../docs/**/*.rst', '../packages/guides-theme/acceptance/**/*.rst'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>,
).flatMap(([file, rst]) =>
  [...rst.matchAll(/^( *)\.\. diagram::\n((?:\1 +.*\n|\n)+)/gm)].map((m, i): [string, string] => {
    const body = (m[2] ?? '').split('\n').filter((l) => !/^\s+:[a-z-]+:/.test(l)).join('\n');
    return [`${file.replace('../', '')} #${i + 1}`, body];
  }),
);

test('the documents hold diagrams to draw', () => {
  expect(DOCUMENTED.length).toBeGreaterThan(0);
});

describe.each(DOCUMENTED.filter(([file]) => !file.includes('acceptance')))('%s', (_, body) => {
  test('the engine draws it', () => {
    expect(() => diagram(parse(body), { name: 'documented' })).not.toThrow();
  });
});

describe.each(SPECS)('%s', (name, spec) => {
  test('every text is no wider in the browser than the engine counted', async () => {
    const host = document.createElement('div');
    host.innerHTML = diagram(spec, { name: name.toLowerCase() }).svg;
    document.body.append(host);
    await document.fonts.ready;
    try {
      const texts = [...host.querySelectorAll<SVGTextElement>('text')];
      expect(texts.length).toBeGreaterThan(0);
      for (const t of texts) {
        const face = (t.getAttribute('font-family') ?? '').includes('Code') ? 'mono' : 'sans';
        const counted = measure(
          t.textContent ?? '',
          Number(t.getAttribute('font-size')),
          face,
          Number(t.getAttribute('font-weight') ?? 400),
          Number(t.getAttribute('letter-spacing') ?? 0),
        );
        expect(t.getComputedTextLength(), `"${t.textContent}"`).toBeLessThanOrEqual(counted + 1);
      }
    } finally {
      host.remove();
    }
  });
});
