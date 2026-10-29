/* Things as cells in named groups, each with its sign: a state at a glance.

   A cell is one identifier over one sign. The groups stand side by side
   and wrap into a new line where the width ends. So the eye counts a sign
   down a group before it reads a single cell. The legend names each sign
   in use, in the words of the drawing. */

import type { Context, Drawn, Room, State } from './context.ts';
import { MUTED, RAISED, SECONDARY, SIGN_MEANING, SIZE, SUBTLE, type Sign, TONE, WARN, rect, sign, text } from './paint.ts';
import { fit, measure } from './text.ts';

export interface Cell {
  id: string;
  sign?: Sign;
  state?: State;
  emphasis?: boolean;
}

export interface CellGroup {
  title: string;
  sub?: string;
  /** The verdict the sub line says: it stands in its status colour. */
  tone?: 'ok' | 'warn' | 'error';
  cells: Cell[];
}

export interface CellsSpec {
  kind: 'cells';
  groups: CellGroup[];
  /** What each sign means here, where the default word is too general. */
  legend?: Partial<Record<Sign, string>>;
  /** Each group in a box, its cells bare in it and its verdict at its foot. */
  boxed?: boolean;
}

const CELL_H = 64;
const HEAD = 52;

export const cells = (spec: CellsSpec, room: Room, ctx: Context): Drawn => {
  /* A slide sets the cells closer, so a line of groups takes its room at a larger scale. */
  const [pad, GAP, GROUP_GAP] = ctx.pick([20, 6, 40], [10, 4, 20]);
  const cellW = Math.max(...spec.groups.flatMap((g) => g.cells.map((c) => measure(c.id, SIZE.node, 'mono', 600))), 30) + pad;
  const out: string[] = [];
  const used = new Set<Sign>();
  let x = room.x;
  let y = room.y;
  if (spec.boxed) {
    y = boxedGroups(spec, room, ctx, used, out);
  }
  for (const g of spec.boxed ? [] : spec.groups) {
    const what = `${ctx.name}: group ${g.title}`;
    const w = Math.max(
      g.cells.length * (cellW + GAP) - GAP,
      measure(g.title, SIZE.node, 'sans', 600),
      g.sub ? measure(g.sub, SIZE.body, 'sans', g.tone ? 600 : 400) : 0,
    );
    if (w > room.width) ctx.fail(`${what} is wider than the drawing: ${g.cells.length} cells`);
    if (x > room.x && x + w > room.x + room.width) {
      x = room.x;
      y += HEAD + CELL_H + 32;
    }
    out.push(text(x, y + 16, fit(g.title, w, { size: SIZE.node, weight: 600 }, what), { size: SIZE.node, weight: 600 }));
    if (g.sub) out.push(text(x, y + 38, g.sub, g.tone ? { size: SIZE.body, weight: 600, fill: TONE[g.tone] } : { size: SIZE.body, fill: SECONDARY }));
    g.cells.forEach((c, i) => {
      const cx = x + i * (cellW + GAP);
      const state = c.state ?? 'present';
      const stroke = c.emphasis ? ctx.emphasis('cell', `cell ${c.id}`) : state === 'degraded' ? WARN : state === 'absent' ? MUTED : SUBTLE;
      out.push(
        rect(cx, y + HEAD, cellW, CELL_H, {
          fill: state === 'present' ? RAISED : 'none',
          stroke,
          width: c.emphasis ? 2 : state === 'present' ? 1 : 1.5,
          radius: 4,
          dashed: state !== 'present',
        }),
      );
      out.push(text(cx + cellW / 2, y + HEAD + 24, c.id, { size: SIZE.node, face: 'mono', weight: 600, anchor: 'middle', fill: state === 'absent' ? MUTED : undefined }));
      if (c.sign) {
        used.add(c.sign);
        out.push(sign(c.sign, cx + cellW / 2, y + HEAD + 45));
      }
    });
    x += w + GROUP_GAP;
  }
  if (!spec.boxed) y += HEAD + CELL_H;

  if (used.size && ctx.legend) {
    y += 34;
    let lx = room.x;
    for (const s of ['yes', 'partly', 'no', 'unknown', 'dot', 'ring', 'page', 'panel', 'both', 'form', 'bar', 'nav'] as const) {
      if (!used.has(s)) continue;
      const word = spec.legend?.[s] ?? SIGN_MEANING[s];
      const lw = 32 + measure(word, SIZE.body, 'sans', 600) + 32;
      if (lx + lw > room.x + room.width + 32) {
        lx = room.x;
        y += 26;
      }
      out.push(sign(s, lx + 11, y - 5));
      out.push(text(lx + 32, y, word, { size: SIZE.body, weight: 600 }));
      lx += lw;
    }
    y += 6;
  }
  return { svg: out.join('\n'), height: y - room.y };
};

/* Boxed groups in one line: each box as wide as its cells and its words
   ask, and the rest of the width shared out. Its cells stand bare in it,
   the id over the sign, and its verdict at its foot. Returns its end. */
const boxedGroups = (spec: CellsSpec, room: Room, ctx: Context, used: Set<Sign>, out: string[]): number => {
  const [pad, gap, step] = ctx.pick([12, 12, 32], [10, 10, 34]);
  const need = spec.groups.map((g) =>
    Math.max(g.cells.length * step, measure(g.title, SIZE.node, 'sans', 600), g.sub ? measure(g.sub, SIZE.body, 'sans', g.tone ? 600 : 400) : 0) + 2 * pad,
  );
  const sum = need.reduce((a, b) => a + b, 0) + (spec.groups.length - 1) * gap;
  if (sum > room.width) ctx.fail(`the boxed groups are ${Math.ceil(sum)} wide, and the drawing is ${Math.floor(room.width)}`);
  const extra = (room.width - sum) / spec.groups.length;
  const h = ctx.pick(112, 104);
  let x = room.x;
  spec.groups.forEach((g, i) => {
    const w = (need[i] ?? 0) + extra;
    out.push(rect(x, room.y, w, h, { fill: RAISED, stroke: SUBTLE, radius: 6 }));
    out.push(text(x + pad, room.y + pad + 14, g.title, { size: SIZE.node, weight: 600 }));
    g.cells.forEach((c, j) => {
      const cx = x + pad + j * step + step / 2;
      const stroke = c.emphasis ? ctx.emphasis('cell', `cell ${c.id}`) : undefined;
      out.push(text(cx, room.y + pad + 40, c.id, { size: SIZE.label, face: 'mono', weight: 600, anchor: 'middle', fill: stroke ?? ((c.state ?? 'present') === 'absent' ? MUTED : SECONDARY) }));
      if (c.sign) {
        used.add(c.sign);
        out.push(sign(c.sign, cx, room.y + pad + 58));
      }
    });
    if (g.sub) out.push(text(x + pad, room.y + h - pad, g.sub, g.tone ? { size: SIZE.body, weight: 600, fill: TONE[g.tone] } : { size: SIZE.body, fill: SECONDARY }));
    x += w + gap;
  });
  return room.y + h;
};
