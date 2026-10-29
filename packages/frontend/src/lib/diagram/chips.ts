/* Identifiers as tiles: which of a set of things is where, at a glance.

   A chip is one identifier. Filled, outlined or bare says how far its plan
   goes, and a ring under it adds one condition. The chips stand in rows,
   each under the name of its row at the left, or in columns, each under
   the head of its column. A column can hold a task in words too. */

import type { Context, Drawn, Room } from './context.ts';
import { CANVAS, INK, MUTED, SECONDARY, SIZE, SUBTLE, SUNKEN, circle, line, rect, text } from './paint.ts';
import { fit, measure, wrap } from './text.ts';

export type ChipKind = 'filled' | 'outline' | 'plain';

export interface Chip {
  id: string;
  kind?: ChipKind;
  /** The condition the ring under a chip stands for. */
  ring?: boolean;
  emphasis?: boolean;
}

export interface ChipGroup {
  label: string;
  /** Lines under the label. */
  sub?: string[];
  /** Tasks in words, in a column over its chips. */
  tasks?: string[];
  chips: Chip[];
}

export interface ChipsSpec {
  kind: 'chips';
  /** Groups as rows, the default, or as columns. */
  direction?: 'rows' | 'columns';
  /** How many chips stand side by side in a column. */
  across?: number;
  groups: ChipGroup[];
  /** What each kind of chip and the ring mean, in order. */
  legend?: { kind: ChipKind | 'ring'; label: string }[];
}

const H = 30;
const GAP = 8;
/* The gap between two chips of a row that narrows to fit. */
const TIGHT_GAP = 4;
const RING_H = 18;

const width = (c: Chip): number => Math.max(measure(c.id, SIZE.label, 'mono', 600) + 20, 44);

const chip = (c: Chip, x: number, y: number, w: number, ctx: Context): string => {
  const kind = c.kind ?? 'filled';
  const stroke = c.emphasis ? ctx.emphasis('chip', `chip ${c.id}`) : kind === 'outline' ? INK : undefined;
  const out = [
    kind === 'plain' && !c.emphasis
      ? ''
      : rect(x, y, w, H, { fill: kind === 'filled' ? INK : 'none', stroke, width: stroke ? 2 : 1, radius: 4 }),
    text(x + w / 2, y + 20, c.id, { size: SIZE.label, face: 'mono', weight: 600, anchor: 'middle', fill: kind === 'filled' ? CANVAS : kind === 'plain' ? MUTED : INK }),
  ];
  if (c.ring) out.push(circle(x + w / 2, y + H + 11, 5.5, 'none', INK) + circle(x + w / 2, y + H + 11, 2.5, INK));
  return out.join('');
};

export const chips = (spec: ChipsSpec, room: Room, ctx: Context): Drawn => {
  const out: string[] = [];
  let y = room.y;
  if (spec.direction === 'columns') {
    const n = spec.groups.length;
    const colW = room.width / n;
    const across = spec.across ?? 2;
    const cw = (colW - 20 - (across - 1) * GAP) / across;
    let bottom = y;
    spec.groups.forEach((g, i) => {
      const x = room.x + i * colW + 10;
      let cy = y;
      for (const l of wrap(g.label, colW - 20, { size: SIZE.node, weight: 600 }, `${ctx.name}: column ${g.label}`)) {
        out.push(text(x, cy + 16, l, { size: SIZE.node, weight: 600 }));
        cy += 22;
      }
      for (const l of g.sub ?? []) {
        out.push(text(x, cy + 14, fit(l, colW - 20, { size: SIZE.body }, `${ctx.name}: column ${g.label}`), { size: SIZE.body, fill: SECONDARY }));
        cy += 19;
      }
      cy += 16;
      for (const task of g.tasks ?? []) {
        const lines = wrap(task, colW - 44, { size: SIZE.body }, `${ctx.name}: a task of ${g.label}`);
        const h = lines.length * 18 + 14;
        out.push(rect(x, cy, colW - 20, h, { fill: SUNKEN, radius: 4 }));
        lines.forEach((l, j) => out.push(text(x + 12, cy + 20 + j * 18, l, { size: SIZE.body })));
        cy += h + GAP;
      }
      g.chips.forEach((c, j) => {
        if (width(c) > cw + 0.5) ctx.fail(`chip ${c.id} is wider than its place in ${g.label}`);
        const row = Math.floor(j / across);
        const rowH = H + GAP + (g.chips.slice(row * across, row * across + across).some((k) => k.ring) ? RING_H : 0);
        if (j % across === 0 && j) cy += rowH;
        out.push(chip(c, x + (j % across) * (cw + GAP), cy, cw, ctx));
      });
      if (g.chips.length) cy += H + (g.chips.slice(-across).some((k) => k.ring) ? RING_H : 0);
      bottom = Math.max(bottom, cy);
    });
    /* The rules between the columns, as tall as the tallest. */
    for (let i = 1; i < n; i++) out.push(line(room.x + i * colW, y, room.x + i * colW, bottom + 8, SUBTLE));
    y = bottom + 8;
  } else {
    const labelW =
      Math.max(
        ...spec.groups.map((g) => measure(g.label, SIZE.node, 'sans', 600)),
        ...spec.groups.flatMap((g) => (g.sub ?? []).map((s) => measure(s, SIZE.body))),
      ) + 32;
    /* Every chip of the rows has one width, so the rows line up as columns.
       Where the longest row does not fit, the chips narrow, as far as the
       widest id still holds. Only then does a row wrap. */
    const all = spec.groups.flatMap((g) => g.chips);
    const tightest = Math.max(0, ...all.map((c) => measure(c.id, SIZE.label, 'mono', 600) + ((c.kind ?? 'filled') === 'plain' ? 2 : 10)));
    const longest = Math.max(1, ...spec.groups.map((g) => g.chips.length));
    const free = room.width - labelW;
    const even = Math.max(...all.map(width), 0);
    const fits = (w: number, gap: number): boolean => longest * w + (longest - 1) * gap <= free + 0.5;
    const gap = fits(even, GAP) ? GAP : TIGHT_GAP;
    const uniform = fits(even, gap) ? even : Math.max(tightest, (free - (longest - 1) * gap) / longest);
    for (const g of spec.groups) {
      const what = `${ctx.name}: row ${g.label}`;
      out.push(text(room.x, y + 18, fit(g.label, labelW - 24, { size: SIZE.node, weight: 600 }, what), { size: SIZE.node, weight: 600 }));
      (g.sub ?? []).forEach((s, i) => out.push(text(room.x, y + 38 + i * 19, s, { size: SIZE.body, fill: SECONDARY })));
      let x = room.x + labelW;
      let line0 = y;
      let ringed = false;
      for (const c of g.chips) {
        const w = uniform;
        if (x + w > room.x + room.width + 0.5) {
          line0 += H + GAP + (ringed ? RING_H : 0);
          x = room.x + labelW;
          ringed = false;
        }
        out.push(chip(c, x, line0, w, ctx));
        ringed ||= Boolean(c.ring);
        x += w + gap;
      }
      y = Math.max(line0 + H + (ringed ? RING_H : 0), y + 22 + (g.sub?.length ?? 0) * 19) + 28;
    }
    y -= 12;
  }

  if (spec.legend?.length && ctx.legend) {
    y += 20;
    let x = room.x;
    for (const entry of spec.legend) {
      const sample: Chip = entry.kind === 'ring' ? { id: '', kind: 'plain', ring: true } : { id: 'ID', kind: entry.kind };
      const w = entry.kind === 'ring' ? 12 : width(sample);
      const lw = w + 10 + measure(entry.label, SIZE.body) + 28;
      if (x + lw > room.x + room.width + 28) {
        x = room.x;
        y += 32;
      }
      if (entry.kind === 'ring') out.push(circle(x + 6, y + 15, 5.5, 'none', INK) + circle(x + 6, y + 15, 2.5, INK));
      else out.push(chip(sample, x, y, w, ctx));
      out.push(text(x + w + 10, y + 20, entry.label, { size: SIZE.body, fill: SECONDARY }));
      x += lw;
    }
    y += H;
  }
  return { svg: out.join('\n'), height: y - room.y };
};

