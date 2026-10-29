/* A diagram from data, laid out: `draw(spec)` is the SVG of the drawing.

   The spec holds the claim, the texts and the structure. This draws them in
   the grammar of `docs/design-system/diagrams/index.rst`. It refuses what the
   grammar forbids: a text too wide for its box, type under the floor, a
   second emphasis, a radius above 6. The file is the drawing alone: the
   page around it says the claim and its consequence, in its heading and its
   caption. On a slide it fills the room of its layout. The faces are the
   page's: `index.ts` puts their cuts into a file. */

import { type BarsSpec, bars } from './bars.ts';
import { type ColumnsSpec, columns } from './columns.ts';
import { Context, type Drawn, type Room } from './context.ts';
import { type FlowSpec, flow, folds } from './flow.ts';
import { type MatrixSpec, matrix } from './matrix.ts';
import { CANVAS, type Claim, MUTED, SIZE, connector, escape, rect, text } from './paint.ts';
import { fit } from './text.ts';
import { type SequenceSpec, sequence } from './sequence.ts';
import { type SketchSpec, sketch } from './sketch.ts';
import { type TilesSpec, tiles } from './tiles.ts';
import { type UnitsSpec, units } from './units.ts';
import { type CellsSpec, cells } from './cells.ts';
import { type ChipsSpec, chips } from './chips.ts';
import { type NotesSpec, notes } from './notes.ts';

export type { BarsSpec, CellsSpec, ChipsSpec, ColumnsSpec, FlowSpec, MatrixSpec, NotesSpec, SequenceSpec, SketchSpec, TilesSpec, UnitsSpec };

export interface Frame {
  /** The claim: the accessible name of the drawing. */
  title: string;
  /** What the drawing shows, for a reader who cannot see it. */
  description: string;
  /** The colour of the one emphasis: the accent, or a status colour where
      the drawing is about a failure or a degradation. */
  claim?: Claim;
  /** The room of the slide that the drawing is for, in its frame's pixels.
      A page drawing has none. */
  slide?: { width: number; height: number };
}

export type Layout =
  | FlowSpec
  | SequenceSpec
  | MatrixSpec
  | TilesSpec
  | ColumnsSpec
  | BarsSpec
  | SketchSpec
  | UnitsSpec
  | ChipsSpec
  | CellsSpec
  | NotesSpec
  | ComposeSpec;

/** Layouts side by side or one under the other, in one drawing with one
    emphasis. A part can carry a label over it. */
export interface ComposeSpec {
  kind: 'compose';
  direction?: 'row' | 'column';
  gap?: number;
  /** An arrow across each gap, into the head of the next part: what one part hands the next. */
  chain?: boolean;
  parts: { weight?: number; label?: string; spec: Layout }[];
}
export type DiagramSpec = Frame & Layout;

export interface Options {
  /** The file name without its extension: the prefix of the ids inside. */
  name: string;
  /** A slide's room in its frame's pixels. Without it, a page drawing.
      The drawing in it is dense: tighter controls, rows and gaps. */
  slide?: { width: number; height: number };
}

export interface Diagram {
  svg: string;
  width: number;
  height: number;
  /** On a slide: how much of the room's height the drawing takes. */
  fill?: number;
}

const WIDTH = 1200;
const MARGIN = 60;
const BODY = WIDTH - 2 * MARGIN;

const layout = (spec: Layout, room: Room, ctx: Context): Drawn => {
  switch (spec.kind) {
    case 'flow':
      return flow(spec, room, ctx);
    case 'sequence':
      return sequence(spec, room, ctx);
    case 'matrix':
      return matrix(spec, room, ctx);
    case 'tiles':
      return tiles(spec, room, ctx);
    case 'columns':
      return columns(spec, room, ctx);
    case 'bars':
      return bars(spec, room, ctx);
    case 'sketch':
      return sketch(spec, room, ctx);
    case 'units':
      return units(spec, room, ctx);
    case 'chips':
      return chips(spec, room, ctx);
    case 'cells':
      return cells(spec, room, ctx);
    case 'notes':
      return notes(spec, room, ctx);
    case 'compose':
      return compose(spec, room, ctx);
  }
};

const PART_LABEL = 30;

const compose = (spec: ComposeSpec, room: Room, ctx: Context): Drawn => {
  const across = (spec.direction ?? 'row') === 'row';
  const gap = spec.gap ?? (across ? ctx.pick(48, 32) : ctx.pick(36, 20));
  const total = spec.parts.reduce((sum, p) => sum + (p.weight ?? 1), 0);
  const free = room.width - (spec.parts.length - 1) * gap;
  const out: string[] = [];
  let x = room.x;
  let y = room.y;
  let bottom = room.y;
  /* A legend that a later part repeats stands once, under that part. */
  const legendOf = (p: Layout): string => {
    if (!('legend' in p) || !p.legend) return '';
    const entries = Array.isArray(p.legend)
      ? p.legend.map((e) => `${'sign' in e ? (e.sign ?? '') : 'tone' in e ? e.tone : 'kind' in e ? e.kind : ''}=${e.label}`)
      : Object.entries(p.legend).map(([k, v]) => `${k}=${String(v)}`);
    return entries.sort().join('|');
  };
  for (const [i, part] of spec.parts.entries()) {
    const w = across ? (free * (part.weight ?? 1)) / total : room.width;
    let top = y;
    if (part.label) {
      out.push(text(x, top + 13, fit(part.label.toUpperCase(), w, { size: SIZE.label, face: 'mono', weight: 600, spacing: 0.8 }, `${ctx.name}: a part`), { size: SIZE.label, face: 'mono', weight: 600, spacing: 0.8, fill: MUTED }));
      top += ctx.pick(PART_LABEL, 22);
    }
    ctx.legend = !legendOf(part.spec) || !spec.parts.slice(i + 1).some((p) => legendOf(p.spec) === legendOf(part.spec));
    const drawn = layout(part.spec, { x, y: top, width: w }, ctx);
    ctx.legend = true;
    if (spec.chain && across && i > 0) {
      const ay = top + ctx.pick(28, 24);
      out.push(connector([[x - gap + 6, ay], [x - 6, ay]]));
    }
    if (drawn.width) ctx.fail(`a part needs ${drawn.width} across, and its room is ${Math.floor(w)}`);
    out.push(drawn.svg);
    bottom = Math.max(bottom, top + drawn.height);
    if (across) x += w + gap;
    else y = top + drawn.height + gap;
  }
  return { svg: out.join('\n'), height: (across ? bottom : y - gap) - room.y };
};

/** The drawing for a spec, set in the page's faces. Throws, naming the
    part, on anything the grammar refuses. */
export const draw = (spec: DiagramSpec, options: Options): Diagram => {
  const { name } = options;
  const slide = options.slide ?? spec.slide;
  /* A room the caller lends sets the drawing dense. A room the text states
     keeps the metrics its author measured it in. */
  const ctx = new Context(options.name, spec.claim, Boolean(options.slide));
  let body: string;
  let width: number;
  let height: number;
  let fill: number | undefined;
  if (slide) {
    /* A chain tries its folds in turn, and the first that fits the room
       wins. Anything else has the one way its author wrote. */
    const ways = spec.kind === 'flow' ? folds(spec, slide.width) : [spec];
    /* A dense drawing then lowers its sketches' screens before the room
       has to grow, so the type keeps the room's scale. */
    const squeezes = ctx.dense && JSON.stringify(spec).includes('"sketch"') ? [1, 0.95, 0.9, 0.85, 0.8, 0.7] : [1];
    let drawn: Drawn | undefined;
    let first: unknown;
    for (const way of ways.flatMap((w) => squeezes.map((s) => [w, s] as const))) {
      try {
        ctx.squeeze = way[1];
        drawn = ctx.attempt(() => {
          const tried = layout(way[0] as Layout, { x: 0, y: 0, width: slide.width }, ctx);
          if (tried.width) ctx.fail(`the drawing needs ${tried.width} across, and the slide's room is ${slide.width}`);
          if (tried.height > slide.height + 0.5) ctx.fail(`the drawing is ${Math.ceil(tried.height)} high, and the slide's room is ${slide.height}`);
          return tried;
        });
        break;
      } catch (error) {
        first ??= error;
      }
    }
    if (!drawn) throw first;
    ({ width } = slide);
    height = Math.ceil(drawn.height);
    fill = drawn.height / slide.height;
    body = drawn.svg;
  } else {
    const drawn = layout(spec, { x: MARGIN, y: MARGIN, width: BODY }, ctx);
    width = Math.max(WIDTH, (drawn.width ?? 0) + 2 * MARGIN);
    height = Math.ceil(drawn.height + 2 * MARGIN);
    body = [rect(0, 0, width, height, { fill: CANVAS }), drawn.svg].join('\n');
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${name}-title ${name}-desc">
<title id="${name}-title">${escape(spec.title)}</title>
<desc id="${name}-desc">${escape(spec.description)}</desc>
<g id="soul-ref">
${body}
</g>
</svg>
`;
  return fill === undefined ? { svg, width, height } : { svg, width, height, fill };
};
