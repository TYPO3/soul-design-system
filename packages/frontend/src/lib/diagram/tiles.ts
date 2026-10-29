/* Figures in a row: a value, what it counts, and what it means.

   The value is the claim, so it stands largest. The tiles are peers and
   share one treatment, and one of them can carry the emphasis. */

import type { Context, Drawn, Room, State } from './context.ts';
import { MUTED, RAISED, SECONDARY, SIZE, SUBTLE, type Sign, WARN, escape, line, rect, sign, text } from './paint.ts';
import { fit, measure, wrap } from './text.ts';

export interface Tile {
  value: string;
  /** A word after the value: a unit, or what it is out of. */
  unit?: string;
  label: string;
  body?: string;
  sign?: Sign;
  state?: State;
  emphasis?: boolean;
}

export interface TilesSpec {
  kind: 'tiles';
  /** How many tiles stand in a row. All of them by default, four at most. */
  columns?: number;
  /** The value stands at the right of the label, the unit under the label, and a rule closes the head. */
  aside?: boolean;
  tiles: Tile[];
}

const PAD = 20;
const GAP = 24;

export const tiles = (spec: TilesSpec, room: Room, ctx: Context): Drawn => {
  const perRow = spec.columns ?? Math.min(spec.tiles.length, 4);
  const w = (room.width - (perRow - 1) * GAP) / perRow;
  const inner = w - 2 * PAD;
  const laid = spec.tiles.map((t) => {
    const what = `${ctx.name}: tile ${t.label}`;
    const value = fit(t.value, inner - (t.sign ? 36 : 0), { size: SIZE.title, weight: 600 }, what);
    const valueW = measure(value, SIZE.title, 'sans', 600);
    const unit = t.unit ? fit(t.unit, inner - valueW - 8, { size: SIZE.lead }, what) : '';
    const label = wrap(t.label, spec.aside ? inner - valueW - 12 : inner, { size: SIZE.node, weight: 600 }, what);
    const body = t.body ? wrap(t.body, inner, { size: SIZE.body }, what) : [];
    const head = spec.aside ? Math.max(40, label.length * 22 + (t.unit ? 20 : 0)) + 16 : 40 + 12 + label.length * 22;
    const h = PAD + head + (body.length ? 6 + body.length * 20 : 0) + PAD - 6;
    return { t, value, valueW, unit, label, body, h };
  });
  const out: string[] = [];
  let y = room.y;
  for (let start = 0; start < laid.length; start += perRow) {
    const row = laid.slice(start, start + perRow);
    const h = Math.max(...row.map((r) => r.h));
    row.forEach((r, i) => {
      const x = room.x + i * (w + GAP);
      const state = r.t.state ?? 'present';
      const stroke = r.t.emphasis ? ctx.emphasis('tile', `tile ${r.t.label}`) : state === 'degraded' ? WARN : state === 'absent' ? MUTED : SUBTLE;
      out.push(
        rect(x, y, w, h, {
          fill: state === 'present' ? RAISED : 'none',
          stroke,
          width: r.t.emphasis ? 2 : state === 'present' ? 1 : 1.5,
          radius: 6,
          dashed: state !== 'present',
        }),
      );
      const quiet = state === 'absent';
      if (spec.aside) {
        const top = Math.max(40, r.label.length * 22 + (r.t.unit ? 20 : 0));
        out.push(text(x + w - PAD, y + PAD + 32, r.value, { size: SIZE.title, weight: 600, spacing: -0.5, anchor: 'end', fill: quiet ? MUTED : undefined }));
        r.label.forEach((l, j) => out.push(text(x + PAD, y + PAD + 16 + j * 22, l, { size: SIZE.node, weight: 600, fill: quiet ? MUTED : undefined })));
        if (r.unit) out.push(text(x + PAD, y + PAD + 16 + r.label.length * 22, r.unit, { size: SIZE.body, fill: SECONDARY }));
        out.push(line(x + PAD, y + PAD + top + 8, x + w - PAD, y + PAD + top + 8, SUBTLE));
        r.body.forEach((l, j) => out.push(text(x + PAD, y + PAD + top + 16 + 6 + 14 + j * 20, l, { size: SIZE.body, fill: SECONDARY })));
        return;
      }
      let ty = y + PAD + 32;
      if (r.t.sign) out.push(sign(r.t.sign, x + PAD + 10, ty - 12));
      const vx = x + PAD + (r.t.sign ? 36 : 0);
      /* The unit is a run of the value's own text, so it follows the value
         in whatever face the reader's system sets it. */
      const value = text(vx, ty, r.value, { size: SIZE.title, weight: 600, spacing: -0.5, fill: quiet ? MUTED : undefined });
      out.push(r.unit ? value.replace('</text>', `<tspan dx="8" font-size="${SIZE.lead}" font-weight="400" letter-spacing="0" fill="${SECONDARY}">${escape(r.unit)}</tspan></text>`) : value);
      ty += 8;
      for (const l of r.label) {
        ty += 22;
        out.push(text(x + PAD, ty, l, { size: SIZE.node, weight: 600, fill: quiet ? MUTED : undefined }));
      }
      if (r.body.length) ty += 6;
      for (const l of r.body) {
        ty += 20;
        out.push(text(x + PAD, ty, l, { size: SIZE.body, fill: SECONDARY }));
      }
    });
    y += h + GAP;
  }
  return { svg: out.join('\n'), height: y - GAP - room.y };
};
