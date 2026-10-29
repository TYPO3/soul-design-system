/* Lengths on one scale: a claim that is a quantity.

   Every bar starts at the same edge, so the eye compares ends. Each segment
   of a bar has the tone of what it counts. A target is the dashed outline of
   the length the row must reach. The gap between them is the shortfall,
   with a size and no sentence. */

import type { Context, Drawn, Room } from './context.ts';
import { MUTED, SECONDARY, SIZE, STRONG, SUBTLE, TONE, type Tone, fmt, line, rect, text } from './paint.ts';
import { fit, measure, wrap } from './text.ts';

export interface Segment {
  value: number;
  tone?: Tone;
  /** A stretch the row does not have yet: a dashed outline, no fill. */
  absent?: boolean;
}

export interface Bar {
  label: string;
  /** The label is an identifier. */
  code?: boolean;
  sub?: string;
  group?: string;
  segments: Segment[];
  /** The length the row must reach. */
  target?: number;
  /** The text after the bar. The total and the unit by default, and none
      on a scale of bands. */
  value?: string;
  /** The bar the drawing is about: its ink fills in the claim colour. */
  emphasis?: boolean;
}

export interface BarsSpec {
  kind: 'bars';
  /** The end of the scale. The count of bands where the scale has bands. */
  max?: number;
  unit?: string;
  /** Values the axis under the bars marks. */
  ticks?: number[];
  /** Named steps instead of numbers: one unit of the scale each, named
      over the bars. */
  bands?: string[];
  /** What the scale measures, over the labels. */
  axis?: string;
  rows: Bar[];
  /** What each tone counts, in the order the legend names them. `absent`
      names the dashed stretch. */
  legend?: { tone: Tone | 'absent'; label: string }[];
}

const ROW = 34;
const BAR = 16;
const VALUE = 96;

export const bars = (spec: BarsSpec, room: Room, ctx: Context): Drawn => {
  const bands = spec.bands ?? [];
  const max = spec.max ?? (bands.length || ctx.fail('a scale needs max=, or bands='));
  const valued = !bands.length || spec.rows.some((r) => r.value !== undefined);
  const widest = Math.max(
    ...spec.rows.map((r) => measure(r.label, SIZE.body, r.code ? 'mono' : 'sans', 600)),
    ...spec.rows.map((r) => (r.sub ? measure(r.sub, SIZE.label, r.code ? 'sans' : 'mono') : 0)),
    spec.axis ? measure(spec.axis, SIZE.label, 'sans', 600) : 0,
  );
  const labelW = Math.min(widest + 32, room.width * 0.35);
  const x0 = room.x + labelW;
  const scale = (room.width - labelW - (valued ? VALUE : 0)) / max;
  const out: string[] = [];
  let y = room.y;
  if (bands.length) {
    if (spec.axis) out.push(text(room.x, y + 14, fit(spec.axis, labelW - 16, { size: SIZE.label, weight: 600 }, `${ctx.name}: the axis`), { size: SIZE.label, weight: 600, fill: SECONDARY }));
    const heads = bands.map((b) => wrap(b, scale - 16, { size: SIZE.label, face: 'mono' }, `${ctx.name}: band ${b}`));
    const lines = Math.max(...heads.map((h) => h.length));
    heads.forEach((h, i) => {
      h.forEach((l, j) => out.push(text(x0 + i * scale + 8, y + 14 + (lines - h.length + j) * 17, l, { size: SIZE.label, face: 'mono', fill: MUTED })));
    });
    y += 32 + (lines - 1) * 17;
  }
  const top = y;
  let group: string | undefined;
  spec.rows.forEach((row, index) => {
    const what = `${ctx.name}: bar ${row.label}`;
    if (row.group && row.group !== group) {
      group = row.group;
      out.push(text(room.x, y + 22, row.group.toUpperCase(), { size: SIZE.label, face: 'mono', weight: 600, spacing: 0.8, fill: MUTED }));
      y += 32;
    }
    const face = row.code ? 'mono' : 'sans';
    const subFace = row.code ? 'sans' : 'mono';
    const label = wrap(row.label, labelW - 16, { size: SIZE.body, weight: 600, face }, what);
    const sub = row.sub ? fit(row.sub, labelW - 16, { size: SIZE.label, face: subFace }, what) : '';
    const h = Math.max(ROW, label.length * 18 + (sub ? 17 : 0) + 14);
    let ty = y + (h - (label.length * 18 + (sub ? 17 : 0))) / 2 + 13;
    for (const t of label) {
      out.push(text(room.x, ty, t, { size: SIZE.body, weight: 600, face }));
      ty += 18;
    }
    if (sub) out.push(text(room.x, ty - 1, sub, { size: SIZE.label, face: subFace, fill: SECONDARY }));
    const by = y + (h - BAR) / 2;
    /* The emphasis fills the ink of its bar in the claim colour. A bar with
       no ink takes an outline in it instead. */
    const inked = row.segments.some((s) => !s.absent && (s.tone ?? 'ink') === 'ink');
    const claim = row.emphasis ? ctx.emphasis('bar', `bar ${row.label}`) : undefined;
    /* A run of filled segments meets square inside and has the radius
       outside. An absent stretch is a dashed box with a gap to its run. */
    let x = x0;
    let run: string[] = [];
    let runStart = x0;
    const close = (): void => {
      if (!run.length) return;
      const clip = `${ctx.name}-bar-${index}-${runStart.toFixed(0)}`;
      out.push(`<clipPath id="${clip}">${rect(runStart, by, x - runStart, BAR, { radius: 4 })}</clipPath>`);
      out.push(`<g clip-path="url(#${clip})">${run.join('')}</g>`);
      run = [];
    };
    for (const s of row.segments) {
      if (s.value < 0) ctx.fail(`${what}: a segment of ${s.value}`);
      const w = s.value * scale;
      if (s.absent) {
        close();
        out.push(rect(x, by, w - 4, BAR, { stroke: STRONG, width: 1.5, radius: 4, dashed: true }));
        x += w;
        runStart = x;
        continue;
      }
      const tone = s.tone ?? 'ink';
      run.push(rect(x, by, w, BAR, { fill: claim && tone === 'ink' ? claim : TONE[tone] }));
      x += w;
    }
    close();
    const total = row.segments.reduce((sum, s) => sum + s.value, 0);
    const filled = row.segments.reduce((sum, s) => sum + (s.absent ? 0 : s.value), 0);
    const end = Math.max(total, row.target ?? 0);
    if (end > max) ctx.fail(`${what}: ${end} runs past the end of the scale, ${max}`);
    if (row.target !== undefined && row.target > total) out.push(shortfall(x0 + total * scale, x0 + row.target * scale, by, total === 0));
    if (claim && !inked) out.push(rect(x0 - 6, by - 6, end * scale + 12, BAR + 12, { stroke: claim, width: 2, radius: 6 }));
    if (valued) {
      const value = row.value ?? `${fmt(filled)}${spec.unit ? ` ${spec.unit}` : ''}`;
      out.push(text(x0 + end * scale + 12, by + 12.5, fit(value, VALUE - 12, { size: SIZE.label, face: 'mono' }, what), { size: SIZE.label, face: 'mono', fill: SECONDARY }));
    }
    y += h;
  });
  /* The band edges, behind the rows. */
  for (let i = 1; i < bands.length; i++) out.unshift(line(x0 + i * scale, top - 4, x0 + i * scale, y, SUBTLE));

  if (spec.ticks?.length) {
    y += 6;
    out.push(line(x0, y, x0 + max * scale, y, SUBTLE));
    for (const t of spec.ticks) {
      const tx = x0 + t * scale;
      out.push(line(tx, y, tx, y + 5, SUBTLE));
      out.push(text(tx, y + 22, String(t), { size: SIZE.label, face: 'mono', fill: MUTED, anchor: 'middle' }));
    }
    y += 26;
  }

  if (spec.legend?.length && ctx.legend) {
    y += 30;
    let x = room.x;
    for (const entry of spec.legend) {
      const w = 22 + measure(entry.label, SIZE.label) + 28;
      if (x + w > room.x + room.width + 28) {
        x = room.x;
        y += 24;
      }
      out.push(
        entry.tone === 'absent'
          ? rect(x, y - 11, 12, 12, { stroke: STRONG, width: 1.5, radius: 2, dashed: true })
          : rect(x, y - 11, 12, 12, { fill: TONE[entry.tone], radius: 2 }),
      );
      out.push(text(x + 20, y, entry.label, { size: SIZE.label, fill: SECONDARY }));
      x += w;
    }
    y += 6;
  }
  return { svg: out.join('\n'), height: y - room.y };
};

/* The dashed outline of the shortfall, from the end of the fill to the
   target. Open towards the fill, so no dash crosses a filled segment. With
   no fill, it is the whole bar. */
const shortfall = (from: number, to: number, y: number, whole: boolean): string => {
  const r = Math.min(4, (to - from) / 2);
  const right = `H${fmt(to - r)} A${r} ${r} 0 0 1 ${fmt(to)} ${fmt(y + r)} V${fmt(y + BAR - r)} A${r} ${r} 0 0 1 ${fmt(to - r)} ${fmt(y + BAR)}`;
  const d = whole
    ? `M${fmt(from + r)} ${fmt(y)} ${right} H${fmt(from + r)} A${r} ${r} 0 0 1 ${fmt(from)} ${fmt(y + BAR - r)} V${fmt(y + r)} A${r} ${r} 0 0 1 ${fmt(from + r)} ${fmt(y)}Z`
    : `M${fmt(from)} ${fmt(y)} ${right} H${fmt(from)}`;
  return `<path d="${d}" fill="none" stroke="${MUTED}" stroke-width="1.5" stroke-dasharray="5 4"></path>`;
};
