/* Counts as unit squares: one square is one thing, so a count has an area.

   Each row is a grid of squares a fixed number of lines high, filled column
   by column. A part that is not there keeps its squares as dashed outlines
   in the same place, so the shortfall has the size of the gap. */

import type { Context, Drawn, Room, State } from './context.ts';
import { INK, MUTED, SECONDARY, SIZE, WARN, rect, text } from './paint.ts';
import { fit, measure, wrap } from './text.ts';

export interface Part {
  count: number;
  /** `absent` or `degraded`: dashed squares, in warn for a degradation. */
  state?: State;
}

export interface UnitRow {
  label: string;
  /** Lines under the label, in mono: a call, a source. */
  sub?: string[];
  parts: Part[];
  /** A line under the squares of the row's last part that is not there. */
  missing?: string;
  emphasis?: boolean;
}

export interface UnitsSpec {
  kind: 'units';
  /** How many squares stand in a column. */
  lines?: number;
  /** What the labels name, over them. */
  head?: string;
  /** What one square is, over the squares. */
  key?: string;
  rows: UnitRow[];
}

const SQUARE = 15;
const STEP = 21;
const ROW_GAP = 48;

export const units = (spec: UnitsSpec, room: Room, ctx: Context): Drawn => {
  const lines = spec.lines ?? 4;
  const widest = Math.max(
    ...spec.rows.map((r) => measure(r.label, SIZE.body, 'sans', 600)),
    ...spec.rows.flatMap((r) => (r.sub ?? []).map((s) => measure(s, SIZE.label, 'mono'))),
    spec.head ? measure(spec.head, SIZE.label, 'mono') : 0,
  );
  const labelW = Math.min(widest + 40, room.width * 0.4);
  const x0 = room.x + labelW;
  const out: string[] = [];
  let y = room.y;
  if (spec.head || spec.key) {
    if (spec.head) out.push(text(room.x, y + 13, spec.head, { size: SIZE.label, face: 'mono', fill: MUTED }));
    if (spec.key) out.push(text(x0, y + 13, fit(spec.key, room.width - labelW, { size: SIZE.label, face: 'mono' }, `${ctx.name}: the key`), { size: SIZE.label, face: 'mono', fill: MUTED }));
    y += 40;
  }
  for (const row of spec.rows) {
    const what = `${ctx.name}: row ${row.label}`;
    const total = row.parts.reduce((sum, p) => sum + p.count, 0);
    const columns = Math.ceil(total / lines);
    if (x0 + columns * STEP - (STEP - SQUARE) > room.x + room.width + 0.5) ctx.fail(`${what}: ${total} squares in ${lines} lines run past the edge`);
    const label = wrap(row.label, labelW - 24, { size: SIZE.body, weight: 600 }, what);
    let ty = y + 13;
    for (const l of label) {
      out.push(text(room.x, ty, l, { size: SIZE.body, weight: 600 }));
      ty += 19;
    }
    for (const s of row.sub ?? []) {
      out.push(text(room.x, ty + 2, fit(s, labelW - 24, { size: SIZE.label, face: 'mono' }, what), { size: SIZE.label, face: 'mono', fill: SECONDARY }));
      ty += 19;
    }
    /* Column by column, so a part fills whole columns and a missing part
       stands as one block at the end. */
    const colour = row.emphasis ? ctx.emphasis('row', `row ${row.label}`) : INK;
    let i = 0;
    let missingFrom: number | undefined;
    let missingState: State | undefined;
    for (const part of row.parts) {
      const state = part.state ?? 'present';
      if (state !== 'present') [missingFrom, missingState] = [Math.floor(i / lines), state];
      for (let n = 0; n < part.count; n++, i++) {
        const sx = x0 + Math.floor(i / lines) * STEP;
        const sy = y + (i % lines) * STEP;
        out.push(
          state === 'present'
            ? rect(sx, sy, SQUARE, SQUARE, { fill: colour, radius: 2 })
            : rect(sx, sy, SQUARE, SQUARE, { stroke: state === 'degraded' ? WARN : MUTED, radius: 2, dashed: true }),
        );
      }
    }
    let bottom = Math.max(ty - 13, y + lines * STEP);
    if (row.missing && missingFrom !== undefined) {
      const mx = x0 + missingFrom * STEP;
      out.push(text(mx, y + lines * STEP + 16, fit(row.missing, room.x + room.width - mx, { size: SIZE.label }, what), { size: SIZE.label, fill: missingState === 'degraded' ? WARN : MUTED }));
      bottom = Math.max(bottom, y + lines * STEP + 20);
    }
    y = bottom + ROW_GAP;
  }
  return { svg: out.join('\n'), height: y - ROW_GAP - room.y };
};
