/* Lanes and the numbered steps between them, in phases.

   Time runs down. A lane is a party. A step is an arrow from one lane to
   another, with its text above it. A phase is a band with its title in the
   gutter on the left. The rows are tight on purpose: a flow of ten steps
   must still fit the room of a slide. */

import type { Context, Drawn, Room, State } from './context.ts';
import {
  ERROR,
  INK,
  MUTED,
  QUIET,
  RAISED,
  SECONDARY,
  SIZE,
  STRONG,
  SUBTLE,
  SUNKEN,
  TONE,
  WARN,
  arrowhead,
  connector,
  cross,
  line,
  marker,
  shapeSign,
  rect,
  text,
} from './paint.ts';
import { fit, measure, wrap } from './text.ts';

export interface Lane {
  id: string;
  label: string;
  /** A second line under the name: a host, a path, a role. */
  sub?: string;
  shape?: 'node' | 'person' | 'store';
}

export interface Step {
  from: string;
  to: string;
  text: string;
  /** The step does not get through: an error line and a cross. */
  fails?: boolean;
  state?: State;
  emphasis?: boolean;
}

export interface Note {
  note: string;
  /** The first and the last lane it stands over. All of them by default. */
  over?: [string, string];
}

export interface Phase {
  title?: string;
  /** How the phase ends: in a failure, or in the expected result. */
  tone?: 'error' | 'warn' | 'ok';
  steps: (Step | Note)[];
}

export interface SequenceSpec {
  kind: 'sequence';
  lanes: Lane[];
  /** A boundary around the heads of lanes that run in one place. */
  hosts?: { label: string; lanes: string[] }[];
  phases: Phase[];
}

const GUTTER = 162;
/* The inset of a phase title from the edge of its band. */
const BAND_PAD = 12;
const HEAD_PAD = 12;
const LINE = 19;
const HOST_PAD = 12;

export const sequence = (spec: SequenceSpec, room: Room, ctx: Context): Drawn => {
  const titled = spec.phases.some((p) => p.title);
  const x0 = room.x + (titled ? GUTTER : 0);
  const span = (room.x + room.width - x0) / spec.lanes.length;
  const laneX = new Map(spec.lanes.map((l, i) => [l.id, x0 + span * i + span / 2]));
  const at = (id: string, what: string): number => laneX.get(id) ?? ctx.fail(`${what} names no lane ${id}`);
  const out: string[] = [];
  const rows: string[] = [];
  const hosted = (spec.hosts ?? []).length > 0;
  const headY = room.y + (hosted ? 34 : 0);

  /* The heads: one card per lane, as high as the highest. Under a host they
     stand in by its pad, so two hosts side by side keep a gap. */
  const headW = span - (hosted ? 40 : 16);
  const heads = spec.lanes.map((l) => {
    const glyph = l.shape && l.shape !== 'node' ? 20 : 0;
    const title = wrap(l.label, headW - 24 - glyph, { size: SIZE.node, weight: 600 }, `${ctx.name}: lane ${l.id}`);
    const sub = l.sub ? fit(l.sub, headW - 24, { size: SIZE.label, face: 'mono' }, `${ctx.name}: lane ${l.id}`) : '';
    return { l, title, sub, glyph };
  });
  const headH = Math.max(...heads.map((h) => HEAD_PAD * 2 + h.title.length * 21 + (h.sub ? 18 : 0)));
  for (const h of heads) {
    const cx = at(h.l.id, 'a lane');
    out.push(rect(cx - headW / 2, headY, headW, headH, { fill: RAISED, stroke: SUBTLE, radius: 6 }));
    const block = h.title.length * 21 + (h.sub ? 18 : 0);
    let ty = headY + (headH - block) / 2 + 15;
    const widest = Math.max(...h.title.map((t) => measure(t, SIZE.node, 'sans', 600)));
    if (h.glyph) out.push(shapeSign(h.l.shape, cx - widest / 2 - h.glyph / 2 - 6, ty - 4));
    for (const t of h.title) {
      out.push(text(cx + h.glyph / 2, ty, t, { size: SIZE.node, weight: 600, anchor: 'middle' }));
      ty += 21;
    }
    if (h.sub) out.push(text(cx, ty - 2, h.sub, { size: SIZE.label, face: 'mono', fill: SECONDARY, anchor: 'middle' }));
  }

  const lifeTop = headY + headH;
  let y = lifeTop + (hosted ? HOST_PAD : 0) + 16;
  let number = 0;
  const bands: { y0: number; y1: number; title: string[]; tone: Phase['tone'] }[] = [];
  for (const phase of spec.phases) {
    const y0 = y;
    y += 12;
    const title = phase.title
      ? wrap(phase.title.toUpperCase(), GUTTER - 20, { size: SIZE.label, face: 'mono', weight: 600, spacing: 0.6 }, `${ctx.name}: a phase`)
      : [];
    for (const step of phase.steps) {
      if ('note' in step) {
        const [first, last] = step.over ?? [spec.lanes[0]?.id ?? '', spec.lanes.at(-1)?.id ?? ''];
        const a = Math.min(at(first, 'a note'), at(last, 'a note')) - span / 2 + 16;
        const b = Math.max(at(first, 'a note'), at(last, 'a note')) + span / 2 - 16;
        const lines = wrap(step.note, b - a - 24, { size: SIZE.body }, `${ctx.name}: a note`);
        const h = lines.length * LINE + 14;
        rows.push(rect(a, y, b - a, h, { fill: RAISED, stroke: STRONG, radius: 4 }));
        lines.forEach((t, i) => rows.push(text((a + b) / 2, y + 21 + i * LINE, t, { size: SIZE.body, anchor: 'middle' })));
        y += h + 12;
        continue;
      }
      number++;
      const what = `${ctx.name}: step ${number}`;
      const xa = at(step.from, `step ${number}`);
      const xb = at(step.to, `step ${number}`);
      const colour = step.emphasis ? ctx.emphasis('step', `step ${number}`) : step.fails ? ERROR : step.state === 'degraded' ? WARN : MUTED;
      const weight = step.emphasis || step.fails ? 2 : 1.5;
      const dashed = (step.state ?? 'present') !== 'present';
      if (xa === xb) {
        const lines = wrap(step.text, Math.min(span - 52, room.x + room.width - xa - 44), { size: SIZE.body }, what);
        const ly = y + 8;
        rows.push(connector([[xa + 12, ly], [xa + 36, ly], [xa + 36, ly + 18], [xa + 2, ly + 18]], colour, weight, dashed));
        lines.forEach((t, i) => rows.push(text(xa + 44, ly + 13 + i * LINE, t, { size: SIZE.body, fill: step.fails ? ERROR : INK, halo: true })));
        rows.push(marker(xa, ly, String(number)));
        y += Math.max(36, lines.length * LINE + 16);
        continue;
      }
      const right = xb > xa;
      const lines = wrap(step.text, Math.abs(xb - xa) - 44, { size: SIZE.body }, what);
      const ay = y + lines.length * LINE + 6;
      lines.forEach((t, i) =>
        rows.push(text((xa + xb) / 2, y + 14 + i * LINE, t, { size: SIZE.body, fill: step.fails ? ERROR : INK, anchor: 'middle', halo: true })),
      );
      /* A step that gets through ends in a head on the lifeline. One that
         fails ends in a cross on the lifeline, where it stops. */
      const dir = right ? 1 : -1;
      const end = step.fails ? xb - dir * 6 : xb - dir;
      rows.push(line(xa + dir * 11, ay, end, ay, colour, weight, dashed));
      rows.push(step.fails ? cross(xb, ay) : arrowhead([end, ay], [xa, ay], colour));
      rows.push(marker(xa, ay, String(number)));
      y += lines.length * LINE + 22;
    }
    y = Math.max(y, y0 + 12 + title.length * 17 + 8);
    bands.push({ y0, y1: y, title, tone: phase.tone });
    y += 4;
  }
  const lifeBottom = y;
  /* A phase rule ends where the lanes end, at the edge of a host if one
     stands there. */
  const right = Math.max(...spec.lanes.map((l) => at(l.id, 'a lane'))) + headW / 2 + (hosted ? HOST_PAD : 0);

  /* A phase is a quiet band: the canvas sunk, or the wash of the status it
     ends in. The lanes run over it. */
  for (const band of bands) {
    out.push(rect(room.x, band.y0, right - room.x, band.y1 - band.y0, { fill: band.tone ? QUIET[band.tone] : SUNKEN, radius: 6 }));
    const colour = band.tone ? TONE[band.tone] : MUTED;
    band.title.forEach((t, i) =>
      out.push(text(room.x + BAND_PAD, band.y0 + 26 + i * 17, t, { size: SIZE.label, face: 'mono', weight: 600, spacing: 0.6, fill: colour })),
    );
  }
  for (const l of spec.lanes) {
    const x = at(l.id, 'a lane');
    out.push(line(x, lifeTop, x, lifeBottom, STRONG));
  }
  for (const host of spec.hosts ?? []) {
    const xs = host.lanes.map((id) => at(id, `host ${host.label}`));
    const a = Math.min(...xs) - headW / 2 - HOST_PAD;
    const b = Math.max(...xs) + headW / 2 + HOST_PAD;
    out.push(rect(a, room.y, b - a, headY + headH + HOST_PAD - room.y, { stroke: STRONG, width: 1.5, radius: 6 }));
    out.push(text(a + 12, room.y + 22, fit(host.label, b - a - 24, { size: SIZE.label, face: 'mono' }, `${ctx.name}: host`), { size: SIZE.label, face: 'mono', fill: MUTED }));
  }
  out.push(...rows);
  return { svg: out.join('\n'), height: lifeBottom - room.y };
};
