/* Screens as nested regions: where a thing stands in an interface.

   A region splits into a row or a column of regions, so a sketch is a tree
   and never a picture to trace. Text is a placeholder bar, because the claim
   is the place and not the words in it. A numbered marker points a reader
   from the sketch to the text that explains the place. */

import type { Context, Drawn, Room, State } from './context.ts';
import { INK, MUTED, RAISED, SECONDARY, SIZE, STRONG, SUBTLE, SUNKEN, WARN, hatch, marker, rect, text } from './paint.ts';
import { fit, measure, wrap } from './text.ts';
import { type Widget, naturalWidth, widget } from './widgets.ts';

export interface Region {
  label?: string;
  /** How the children stand: side by side, or one under the other. */
  split?: 'row' | 'column';
  /** A fixed length along the parent's split. The other children share the remaining length. */
  size?: number;
  children?: Region[];
  surface?: 'raised' | 'sunken' | 'none';
  /** Placeholder lines of text. */
  lines?: number;
  /** A number or a letter that a text beside the sketch refers to. */
  marker?: string;
  state?: State;
  emphasis?: boolean;
  /** An ink outline, for one of several peers apart from the emphasis. */
  strong?: boolean;
  /** Hatched: there for the editors, hidden from the visitors. */
  hidden?: boolean;
  /** The label as the region's name: the body's size, bold, in the ink. */
  head?: boolean;
  /** The label in the sans face, regular and muted: a name of a part, not an identifier. */
  plain?: boolean;
  /** Controls in the region, one under the other, or side by side with
      `flow: 'row'`. */
  widgets?: Widget[];
  flow?: 'row' | 'column';
  /** Controls in a grid of this many columns, each as wide as the others. */
  across?: number;
  /** Small outlined squares down the region: the icons of a folded column. */
  icons?: number;
}

export interface Screen {
  title?: string;
  caption?: string;
  /** The relative width of the screen. */
  weight?: number;
  /** A phone or a tablet: an ink outline, a wide edge and a bar at its foot. */
  device?: boolean;
  root: Region;
  /** A dashed band under the screen: what the interface holds out of sight.
      Its label stands at its left, its controls in a row after it. */
  band?: Region;
}

export interface SketchSpec {
  kind: 'sketch';
  /** The height of every screen. */
  height: number;
  /** The title of each screen stands over it as a head, in capitals. */
  heads?: boolean;
  screens: Screen[];
}

const GAP = 32;
const INSET = 6;
const LENGTHS = [0.92, 0.7, 0.84, 0.55];

export const sketch = (spec: SketchSpec, room: Room, ctx: Context): Drawn => {
  const height = Math.round(spec.height * ctx.squeeze);
  const total = spec.screens.reduce((sum, s) => sum + (s.weight ?? 1), 0);
  const gap = ctx.pick(GAP, 24);
  const [titleLine, captionLine, under] = ctx.pick([22, 20, 8], [20, 18, 6]);
  const free = room.width - (spec.screens.length - 1) * gap;
  const out: string[] = [];
  const lift = spec.heads ? ctx.pick(26, 22) : 0;
  const top = room.y + lift;
  let x = room.x;
  let bottom = top + height;
  for (const screen of spec.screens) {
    const w = (free * (screen.weight ?? 1)) / total;
    /* A head over a screen whose whole region is the claim takes the claim colour. */
    if (spec.heads && screen.title) {
      const caps = { size: SIZE.label, face: 'mono', weight: 600, spacing: 0.8 } as const;
      out.push(text(x, room.y + 13, fit(screen.title.toUpperCase(), w, caps, `${ctx.name}: a screen`), { ...caps, fill: screen.root.emphasis ? ctx.claim : MUTED }));
    }
    /* A device has an ink outline, a wide edge and a bar at its foot. Its
       radius stays the grammar's, so the edge says phone, not a curve. */
    const edge = screen.device ? 12 : INSET;
    if (screen.device) out.push(rect(x, top, w, height, { fill: RAISED, stroke: INK, width: 2, radius: 6 }) + rect(x + w / 2 - 16, top + height - 8, 32, 3, { fill: INK, radius: 1 }));
    else out.push(rect(x, top, w, height, { fill: RAISED, stroke: STRONG, width: 1.5, radius: 6 }));
    region(screen.root, x + edge, top + edge, w - 2 * edge, height - 2 * edge, out, ctx);
    let y = top + height + under;
    if (screen.band) y = band(screen.band, x, y + under / 2, w, out, ctx) + under;
    if (screen.title && !spec.heads) {
      for (const l of wrap(screen.title, w, { size: SIZE.node, weight: 600 }, `${ctx.name}: a screen`)) {
        y += titleLine;
        out.push(text(x, y, l, { size: SIZE.node, weight: 600 }));
      }
    }
    if (screen.caption) {
      for (const l of wrap(screen.caption, w, { size: SIZE.body }, `${ctx.name}: a screen`)) {
        y += captionLine;
        out.push(text(x, y, l, { size: SIZE.body, fill: SECONDARY }));
      }
    }
    bottom = Math.max(bottom, y + 6);
    x += w + gap;
  }
  return { svg: out.join('\n'), height: bottom - room.y };
};

const region = (r: Region, x: number, y: number, w: number, h: number, out: string[], ctx: Context): void => {
  const what = `region ${r.label ?? r.marker ?? ''}`.trim();
  if (w < 8 || h < 8) ctx.fail(`${what} has no room: ${Math.round(w)} × ${Math.round(h)}`);
  const leaf = !r.children?.length;
  const state = r.state ?? 'present';
  const surface = r.surface ?? (leaf ? 'sunken' : 'none');
  const stroke = r.emphasis ? ctx.emphasis('place', what) : state === 'degraded' ? WARN : state === 'absent' ? MUTED : r.strong ? INK : surface === 'none' ? undefined : SUBTLE;
  const boxed = Boolean(stroke) || surface !== 'none';
  if (boxed) {
    out.push(
      rect(x, y, w, h, {
        fill: state !== 'present' || surface === 'none' ? 'none' : surface === 'raised' ? RAISED : SUNKEN,
        stroke,
        width: r.emphasis || r.strong ? 2 : state === 'present' ? 1 : 1.5,
        radius: 4,
        dashed: state !== 'present',
      }),
    );
  }
  if (r.hidden) out.push(hatch(x + 1, y + 1, w - 2, h - 2));
  /* A region no higher than a bar centres its label and its marker. A
     taller one sets them at its top, above its lines or its children. */
  const bar = h <= 40;
  const head = bar ? y + h / 2 : y + 15;
  let top = y + 8;
  if (r.label) {
    const space = w - 16 - (r.marker ? 26 : 0);
    const face = r.head ? ({ size: SIZE.body, face: 'sans', weight: 600 } as const) : r.plain ? ({ size: SIZE.label, face: 'sans' } as const) : ({ size: SIZE.label, face: 'mono' } as const);
    out.push(text(x + 8, head + 4.5, fit(r.label, space, face, what), { ...face, fill: r.head ? INK : MUTED }));
    top = y + ctx.pick(28, 24);
  }
  if (r.marker) out.push(marker(x + w - 15, head, r.marker));
  if (leaf) {
    for (let i = 0; i < (r.icons ?? 0); i++) out.push(rect(x + w / 2 - 5, top + i * 16, 10, 10, { stroke: INK, width: 1.2, radius: 2 }));
    for (let i = 0; i < (r.lines ?? 0); i++) {
      const ly = top + i * 12;
      if (ly + 6 > y + h - 6) {
        const need = Math.ceil(top - y + ((r.lines ?? 0) - 1) * 12 + 12);
        ctx.fail(`${what}: ${r.lines} lines need a height of ${need}, and it has ${Math.round(h)}`);
      }
      out.push(rect(x + 8, ly, (w - 16) * (LENGTHS[i % LENGTHS.length] ?? 1), 6, { fill: STRONG, radius: 2 }));
    }
    if (r.widgets?.length) controls(r, x, r.lines ? top + r.lines * 12 + 4 : top, w, y + h, out, ctx, what);
    return;
  }
  const children = r.children ?? [];
  const across = r.split === 'row';
  /* Only a region that draws a box pads its children. A bare container
     hands them its whole box, so every edge in a screen keeps one inset. */
  const pad = boxed ? INSET : 0;
  const ix = x + pad;
  const iy = r.label ? top - 4 : y + pad;
  const iw = w - 2 * pad;
  const ih = y + h - pad - iy;
  const length = across ? iw : ih;
  const fixed = children.reduce((sum, c) => sum + (c.size ?? 0), 0);
  const flexible = children.filter((c) => c.size === undefined).length;
  const share = flexible ? (length - fixed - (children.length - 1) * INSET) / flexible : 0;
  if (flexible && share < 8) ctx.fail(`${what}: its children need ${Math.ceil((8 - share) * flexible)} more ${across ? 'width' : 'height'} than it has`);
  let at = across ? ix : iy;
  for (const c of children) {
    const l = c.size ?? share;
    if (across) region(c, at, iy, l, ih, out, ctx);
    else region(c, ix, at, iw, l, out, ctx);
    at += l + INSET;
  }
};

/* A band holds one row of controls, or `across` to a row, after its label.
   It is as high as its controls, and it returns where it ends. */
const band = (r: Region, x: number, y: number, w: number, out: string[], ctx: Context): number => {
  const what = `band ${r.label ?? ''}`.trim();
  const widgets = r.widgets ?? [];
  const pad = ctx.pick(12, 8);
  const labelW = r.label ? measure(r.label, SIZE.label, 'mono') + 24 : 0;
  const placed = grid(widgets, r.across ?? widgets.length, x + pad + labelW, y + pad, w - 2 * pad - labelW, ctx, what);
  const h = Math.max(placed.height, 20) + 2 * pad;
  out.push(rect(x, y, w, h, { stroke: MUTED, width: 1.5, radius: 4, dashed: true }));
  if (r.label) out.push(text(x + pad + 4, y + h / 2 + 4.5, r.label, { size: SIZE.label, face: 'mono', fill: MUTED }));
  out.push(placed.svg);
  return y + h;
};

/* Controls in `across` columns of one width, row by row. A row is as high
   as its highest control. The engine refuses a control wider than its column. */
const grid = (widgets: Widget[], across: number, x: number, y: number, w: number, ctx: Context, what: string): { svg: string; height: number } => {
  if (!Number.isInteger(across) || across < 1) ctx.fail(`${what}: across=${across} is not a count of columns`);
  const gap = 8;
  const cw = (w - (across - 1) * gap) / across;
  const out: string[] = [];
  let cy = y;
  for (let i = 0; i < widgets.length; i += across) {
    let rowH = 0;
    widgets.slice(i, i + across).forEach((wd, j) => {
      const placed = widget(wd, x + j * (cw + gap), cy, cw, ctx, what);
      out.push(placed.svg);
      rowH = Math.max(rowH, placed.height);
    });
    cy += rowH + gap;
  }
  return { svg: out.join(''), height: widgets.length ? cy - gap - y : 0 };
};

/* The controls of a leaf region. Side by side, a control with no width of
   its own shares what the others leave. One under the other, each takes
   the width less the room a marker at its right needs. */
const controls = (r: Region, x: number, top: number, w: number, bottom: number, out: string[], ctx: Context, what: string): void => {
  const widgets = r.widgets ?? [];
  /* A rail narrower than 40 keeps its icons whole at a smaller inset. */
  const pad = w < 40 ? 4 : 10;
  if (r.across) {
    /* The grid keeps the inset of the region's top at its bottom too. */
    const placed = grid(widgets, r.across, x + pad, top, w - 2 * pad, ctx, what);
    out.push(placed.svg);
    const short = Math.ceil(top + placed.height - (bottom - 8));
    if (short > 0) ctx.fail(`${what}: its controls are ${Math.round(placed.height)} high, ${short} more than its room. Give the region ${short} more size, or the sketch ${short} more height`);
    return;
  }
  if (r.flow === 'row') {
    const label = r.label ? fit(r.label, w, { size: SIZE.label, face: 'mono' }, what) : '';
    const start = x + pad + (label ? 0 : 0);
    const fixed = widgets.reduce((sum, wd) => sum + naturalWidth(wd) + ('marker' in wd && wd.marker ? 28 : 0), 0);
    const flexible = widgets.filter((wd) => naturalWidth(wd) === 0).length;
    const used = fixed + (widgets.length - 1) * 10;
    const share = flexible ? (w - 2 * pad - used) / flexible : 0;
    if (flexible ? share < 24 : used > w - 2 * pad + 0.5) ctx.fail(`${what}: its controls are ${Math.ceil(used + (flexible ? 24 * flexible : 0))} wide, and its room is ${Math.floor(w - 2 * pad)}`);
    /* Right-aligned when the region has a label at its left, as a bar does. */
    let cx = r.label ? x + w - pad - fixed - share * flexible - (widgets.length - 1) * 10 : start;
    const mid = r.label ? top - 28 + (bottom - top + 28) / 2 : top + (bottom - top) / 2;
    /* A marker stands after its control, in the room the row counted for it. */
    for (const wd of widgets) {
      const ww = naturalWidth(wd) || share;
      const own = ['button', 'tabs', 'chip', 'tools', 'keycap', 'toolbar'].includes(wd.w);
      const marked = !own && 'marker' in wd && wd.marker ? wd.marker : '';
      const placed = widget(marked ? ({ ...wd, marker: undefined } as Widget) : wd, cx, mid - ctx.pick(14, 12), ww, ctx, what);
      out.push(placed.svg);
      if (marked) out.push(marker(cx + ww + 14, mid, marked));
      cx += Math.max(placed.width, ww) + (marked ? 28 : 0) + 10;
    }
    return;
  }
  const step = ctx.pick(10, 6);
  let cy = top + 4;
  for (const wd of widgets) {
    const marked = 'marker' in wd && wd.marker && !wd.corner ? 18 : 0;
    const ww = naturalWidth(wd) && wd.w !== 'text' ? Math.min(naturalWidth(wd), w - 2 * pad) : w - 2 * pad - marked;
    const placed = widget(wd, x + pad, cy, ww, ctx, what);
    out.push(placed.svg);
    cy += placed.height + step;
  }
  const short = Math.ceil(cy - step - (bottom - 4));
  if (short > 0) ctx.fail(`${what}: its controls are ${Math.round(cy - top)} high, ${short} more than its room. Give the region ${short} more size, or the sketch ${short} more height`);
};
