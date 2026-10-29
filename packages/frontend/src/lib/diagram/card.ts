/* A node: the one box every layout draws a thing in.

   Peers share one treatment and their names tell them apart. A card can
   also carry a mark above it, the sign of a person or a store before its
   name, and a state.
   Each says one thing in every drawing. */

import type { Context, State } from './context.ts';
import { CANVAS, INK, MUTED, RAISED, SECONDARY, SIZE, SUBTLE, WARN, rect, shapeSign, text } from './paint.ts';
import { measure, narrowest as least, unbroken, wrap } from './text.ts';

/** One entry of a card's list: a name, a line under it, a figure at its right. */
export interface CardItem {
  title: string;
  body?: string;
  value?: string;
}

export interface CardSpec {
  title: string;
  /** Entries under the title and the body, top down. */
  items?: CardItem[];
  /** The entries in this many columns, each filled before the next. */
  across?: number;
  body?: string;
  /** The title is an identifier, a path or a flag. */
  code?: boolean;
  /** A value on the title's line, at the right: the answer to a key. */
  value?: string;
  /** `new` is a part this change adds, `changed` one it alters. */
  mark?: 'new' | 'changed';
  /** A person, or a store the parts read and write. */
  shape?: 'node' | 'person' | 'store';
  state?: State;
  /** The one part the drawing is about. */
  emphasis?: boolean;
  /** Ink ground: the part that acts, against the parts it acts on. */
  ink?: boolean;
  /** An ink outline, 2 wide: one of several peers, apart from the emphasis. */
  strong?: boolean;
  /** The emphasis fills the card, and its text stands on it in the ground colour. */
  fill?: boolean;
  /** No box: a note beside the boxes, as plain text. */
  plain?: boolean;
  /** An identifier before the title, in mono and muted: the key of the part. */
  tag?: string;
  /** A short name over the title, in mono capitals: what kind of part it is. */
  eyebrow?: string;
  /** A dashed outline around text in ink: a way out of the path, there all along. */
  dashed?: boolean;
}

const PAD_X = 16;
/* A plain card is a note: no box, so no inset, and its title at the size of a body. */
const padX = (spec: CardSpec): number => (spec.plain ? 0 : PAD_X);
const titleSetting = (spec: CardSpec): { size: number; weight: 400 | 600; face: 'mono' | 'sans' } => ({ size: spec.plain ? SIZE.body : SIZE.node, weight: spec.plain ? 400 : 600, face: spec.code ? 'mono' : 'sans' });
/* The page's pad and leading, and the tighter ones on a slide. */
const LINES = { page: { pad: 14, title: 22, body: 20 }, slide: { pad: 9, title: 20, body: 18 } };
const MARK_LINE = 20;
/* How far the ink of a 16 line starts below the line's top. */
const RISE = 3;
/* A plain card with a body leaves room between its title and its body, so
   a connector that runs through it passes between them. */
const SPLIT = 12;
const GLYPH = 20;
/* The room between two entries of a list, between its columns, and above it. */
const ITEM = { gap: 6, across: 24, lead: 10 };
/* An entry that opens with a sign hangs its other lines under its words. */
const signed = (s: string): boolean => /^[\ue000-\ue0ff] /.test(s);
/* An entry with a line under it is a name, so it sets in bold. */
const itemSetting = (item: CardItem): { size: number; weight: 400 | 600 } => ({ size: SIZE.body, weight: item.body ? 600 : 400 });

export interface Measured {
  spec: CardSpec;
  width: number;
  height: number;
  title: string[];
  body: string[];
  /* The entries of each column, as lines. */
  items: { title: string[]; body: string[]; item: CardItem; hang: number }[][];
  itemWidth: number;
  lines: (typeof LINES)['page'];
}

/** The lines of a card at a width, and the height they take. */
export const measureCard = (spec: CardSpec, width: number, what: string, dense = false): Measured => {
  const lines = dense ? LINES.slide : LINES.page;
  const inner = width - 2 * padX(spec);
  const glyph = spec.shape && spec.shape !== 'node' ? GLYPH : 0;
  const value = spec.value ? measure(spec.value, SIZE.body) + 12 : 0;
  if (value > inner / 2) throw new Error(`${what}: the value "${spec.value}" takes more than half the card`);
  const tag = spec.tag ? measure(spec.tag, SIZE.label, 'mono', 600) + 8 : 0;
  const title = spec.title ? wrap(spec.title, inner - glyph - value - tag, titleSetting(spec), what) : [];
  const body = spec.body ? wrap(spec.body, inner, { size: SIZE.body }, what) : [];
  const across = Math.max(1, spec.across ?? 1);
  const itemWidth = (inner - (across - 1) * ITEM.across) / across;
  const entries = (spec.items ?? []).map((item) => {
    const value = item.value ? measure(item.value, SIZE.body) + 12 : 0;
    const hang = signed(item.title) ? SIZE.body + measure(' ', SIZE.body) : 0;
    const words = wrap(hang ? item.title.slice(2) : item.title, itemWidth - value - hang, itemSetting(item), what);
    const title = hang ? words.map((l, i) => (i ? l : `${item.title.slice(0, 2)}${l}`)) : words;
    return { item, hang, title, body: item.body ? wrap(item.body, itemWidth, { size: SIZE.body }, what) : [] };
  });
  const per = Math.ceil(entries.length / across);
  const items = Array.from({ length: entries.length ? across : 0 }, (_, c) => entries.slice(c * per, (c + 1) * per));
  const list = Math.max(0, ...items.map((col) => col.reduce((a, e) => a + (e.title.length + e.body.length) * lines.body, 0) + (col.length - 1) * ITEM.gap));
  const above = title.length || body.length ? ITEM.lead : 0;
  const height =
    lines.pad * 2 + (spec.mark ? MARK_LINE : 0) + (spec.eyebrow ? MARK_LINE : 0) + title.length * lines.title + body.length * lines.body - 6 + (spec.plain && body.length ? SPLIT : 0) + (list ? above + list : 0);
  return { spec, width, height, title, body, items, itemWidth, lines };
};

/** The narrowest card that holds its longest word on a line. A column
    narrower than that refuses the card, so the flow widens to it. With
    `whole`, the card that holds every name whole, which a flow gives where
    it has the room. */
export const leastCard = (spec: CardSpec, whole = false): number => {
  const narrowest = whole ? unbroken : least;
  const glyph = spec.shape && spec.shape !== 'node' ? GLYPH : 0;
  const value = spec.value ? measure(spec.value, SIZE.body) + 12 : 0;
  const tag = spec.tag ? measure(spec.tag, SIZE.label, 'mono', 600) + 8 : 0;
  const title = narrowest(spec.title, titleSetting(spec)) + glyph + value + tag;
  const across = Math.max(1, spec.across ?? 1);
  const item = Math.max(0, ...(spec.items ?? []).map((i) => Math.max(narrowest(i.title, itemSetting(i)) + (i.value ? measure(i.value, SIZE.body) + 12 : 0), narrowest(i.body ?? '', { size: SIZE.body }))));
  return 2 * padX(spec) + Math.max(title, narrowest(spec.body ?? '', { size: SIZE.body }), 2 * value, across * item + (across - 1) * ITEM.across);
};

/** The card at its place. `height` can be more than it measured, to line
    it up with its row, and the text then centres in it. */
export const drawCard = (m: Measured, x: number, y: number, height: number, ctx: Context, what: string): string => {
  const { spec } = m;
  const state = spec.state ?? 'present';
  /* A part the change alters keeps a solid edge in the colour of its word.
     A degraded part has the dashed one. */
  const changed = spec.mark === 'changed' && state === 'present' && !spec.ink;
  const stroke = spec.emphasis ? ctx.emphasis('node', what) : state === 'degraded' || changed ? WARN : state === 'absent' || spec.dashed ? MUTED : spec.strong ? INK : SUBTLE;
  const filled = spec.emphasis && spec.fill;
  const out = [
    spec.plain ? '' : rect(x, y, m.width, height, {
      fill: filled ? stroke : spec.ink ? INK : state === 'present' ? RAISED : 'none',
      stroke: spec.ink && !spec.emphasis ? undefined : stroke,
      width: spec.emphasis || spec.strong ? 2 : changed || state !== 'present' || spec.dashed ? 1.5 : 1,
      radius: 6,
      dashed: state !== 'present' || Boolean(spec.dashed),
    }),
  ];
  const quiet = state === 'absent';
  const [ink, soft] = spec.ink || filled ? [CANVAS, CANVAS] : [quiet ? MUTED : INK, quiet ? MUTED : SECONDARY];
  /* The pad counts from the top of the line, and the ink of a line starts
     below it. So the text rises by that much, and its ink centres in the box. */
  let ty = y + (height - m.height) / 2 + m.lines.pad - RISE;
  if (spec.mark) {
    const label = spec.mark === 'new' ? 'NEW' : 'CHANGED';
    out.push(text(x + PAD_X, ty + 12, label, { size: SIZE.label, face: 'mono', weight: 600, spacing: 1.2, fill: spec.mark === 'new' ? INK : WARN }));
    ty += MARK_LINE;
  }
  if (spec.eyebrow) {
    out.push(text(x + padX(spec), ty + 12, spec.eyebrow.toUpperCase(), { size: SIZE.label, face: 'mono', weight: 600, spacing: 0.8, fill: quiet ? MUTED : soft }));
    ty += MARK_LINE;
  }
  const glyph = spec.shape && spec.shape !== 'node' ? GLYPH : 0;
  if (glyph) out.push(shapeSign(spec.shape, x + PAD_X, ty + 11, ink));
  const tag = spec.tag ? measure(spec.tag, SIZE.label, 'mono', 600) + 8 : 0;
  if (spec.tag) out.push(text(x + padX(spec) + glyph, ty + 16, spec.tag, { size: SIZE.label, face: 'mono', weight: 600, fill: quiet ? MUTED : soft }));
  m.title.forEach((l, i) => {
    out.push(
      text(x + padX(spec) + glyph + tag, ty + 16 + i * m.lines.title, l, { ...titleSetting(spec), fill: ink }),
    );
  });
  if (spec.value) {
    out.push(text(x + m.width - PAD_X, ty + 16, spec.value, { size: SIZE.body, fill: soft, anchor: 'end' }));
  }
  ty += m.title.length * m.lines.title + (spec.plain && m.body.length ? SPLIT : 0);
  m.body.forEach((l, i) => {
    out.push(text(x + padX(spec), ty + 14 + i * m.lines.body, l, { size: SIZE.body, fill: soft }));
  });
  ty += m.body.length * m.lines.body + (m.title.length || m.body.length ? ITEM.lead : 0);
  m.items.forEach((col, c) => {
    const ix = x + padX(spec) + c * (m.itemWidth + ITEM.across);
    let iy = ty;
    for (const e of col) {
      e.title.forEach((l, i) => out.push(text(ix + (i ? e.hang : 0), iy + 14 + i * m.lines.body, l, { ...itemSetting(e.item), fill: ink })));
      if (e.item.value) out.push(text(ix + m.itemWidth, iy + 14, e.item.value, { size: SIZE.body, fill: soft, anchor: 'end' }));
      iy += e.title.length * m.lines.body;
      e.body.forEach((l, i) => out.push(text(ix, iy + 14 + i * m.lines.body, l, { size: SIZE.body, fill: soft })));
      iy += e.body.length * m.lines.body + ITEM.gap;
    }
  });
  return out.join('\n');
};
