/* Rows against columns, with a sign in each cell.

   The answer is the alignment: a column of the same sign reads before a
   single cell does. Rows and columns can stand in named groups, and one row
   or one column can carry the emphasis. The legend under it names only the
   signs the drawing uses. */

import type { Context, Drawn, Room } from './context.ts';
import { INK, MUTED, SECONDARY, SIGN_MEANING, SIZE, STRONG, SUBTLE, SUNKEN, type Sign, WARN, line, rect, sign, text } from './paint.ts';
import { fit, measure, narrowest, wrap } from './text.ts';

/* `path` is a click path: its steps as outlined chips, joined by ›. */
export type Cell = Sign | '' | { sign?: Sign; text?: string; code?: boolean; note?: number; chips?: string[]; path?: string[] };

export interface MatrixSpec {
  kind: 'matrix';
  /** `split` draws a rule before the column: the start of another set. */
  /** `letter` stands over the label at the size of a node, `sub` under it: an example. */
  /** `end`: in a left table, the head and the texts of the column stand at its right edge. */
  columns: { label: string; letter?: string; sub?: string; group?: string; split?: boolean; sign?: Sign; weight?: number; end?: boolean }[];
  rows: { label: string; sub?: string; group?: string; cells: Cell[] }[];
  /** The row or the column the drawing is about, by its label, or several
      that make the same claim. Rows or columns side by side share a frame. */
  emphasis?: { row?: string | string[]; column?: string | string[] };
  /** What each sign means here, where the default word is too general. */
  legend?: Partial<Record<Sign, string>>;
  /** A sentence after the words of the legend, on its line. */
  legendNote?: string;
  /** The width of the label column. It fits its longest label otherwise. */
  labelWidth?: number;
  /** Where a row group says its name: over its rows, or beside them. */
  rowGroups?: 'over' | 'beside';
  /** The notes a cell points at by number, under the legend. */
  notes?: string[];
  /** The notes stand outside the drawing, in the page around it: a cell
      keeps its number, and the drawing holds no text of a note. */
  notesOutside?: boolean;
  /** The cells hold figures: their text stands at the size of a value. */
  figures?: boolean;
  /** The heads and the texts stand at the left of their columns, the heads
      in capitals: a table that reads as a list. */
  left?: boolean;
  /** The first word of each row's label is its identifier: mono and muted in a column of its own, the name after it regular. */
  ids?: boolean;
  /** A head over the labels of the rows: what each row names. */
  head?: string;
  /** Each text cell is a block across its column, as a bar of a plan is.
      A text in parentheses is an outlined block: a smaller piece of work. */
  blocks?: boolean;
  /** A rule between every two rows. Without it, only the head, the row
      groups beside and the foot have one: the alignment carries the rows. */
  rules?: boolean;
}

/** The order the legend names the signs in. */
const ORDER: readonly Sign[] = ['page', 'panel', 'both', 'form', 'bar', 'nav', 'docheader', 'any', 'yes', 'partly', 'no', 'unknown', 'dot', 'ring'];

const chipW = (id: string): number => measure(id, SIZE.label, 'mono', 600) + 14;
const stepW = (step: string): number => measure(step, SIZE.label) + 18;
const HEAD_LINE = 17;
/* The gap a › takes between two steps of a path. */
const JOIN = 20;
const PATH_LINE = 28;

export const matrix = (spec: MatrixSpec, space: Room, ctx: Context): Drawn => {
  const beside = spec.rowGroups === 'beside';
  /* A row, a group's head and a cell's pad: tighter on a slide. */
  const [ROW, GROUP_ROW, PAD, LEGEND_GAP, LEGEND_WORD, HEAD_PAD, GROUP_GAP] = ctx.pick([34, 34, 16, 28, 32, 9, 24], [24, 24, 6, 14, 28, 5, 16]);
  /* A group's name is a head in bold sans capitals, not a machine's word. */
  const groupSetting = { size: SIZE.label, face: 'sans', weight: 600, spacing: 0.8 } as const;
  const groupW = beside ? Math.max(0, ...spec.rows.map((r) => (r.group ? measure(r.group.toUpperCase(), SIZE.label, 'sans', 600, 0.8) : 0))) + GROUP_GAP : 0;
  /* With ids, a label is its identifier in mono, then its name in the regular weight. */
  const split = (label: string): [string, string] => (spec.ids ? [label.split(' ')[0] ?? '', label.split(' ').slice(1).join(' ')] : ['', label]);
  const idW = spec.ids ? Math.max(...spec.rows.map((r) => measure(split(r.label)[0], SIZE.label, 'mono', 600))) + 12 : 0;
  const labelWeight = spec.ids ? 400 : 600;
  const widest = Math.max(...spec.rows.map((r) => idW + measure(split(r.label)[1], SIZE.body, 'sans', labelWeight)));
  const labelW = spec.labelWidth ?? Math.min(widest + GROUP_GAP, space.width * 0.4 - groupW);
  /* A column holds the longest word of its head. Where the room cannot give
     every column that, the drawing grows wider, and the page shrinks it. */
  const weights = spec.columns.map((c) => c.weight ?? 1);
  const total = weights.reduce((a, b) => a + b, 0);
  /* A path asks for its widest step, a weight for its share of the width. */
  const steps = spec.columns.map((_, i) => Math.max(0, ...spec.rows.map((r) => { const c = r.cells[i]; return typeof c === 'object' && c.path ? Math.max(...c.path.map(stepW)) + 10 : 0; })));
  const least = Math.max(0, ...spec.columns.map((c, i) => (Math.max(narrowest(c.label, { size: SIZE.label, weight: 600 }) + HEAD_PAD, steps[i] ?? 0)) / (weights[i] ?? 1)));
  const unit = Math.max((space.width - groupW - labelW) / total, least);
  const widths = weights.map((k) => unit * k);
  const room = { ...space, width: groupW + labelW + unit * total };
  const labelX = room.x + groupW;
  const colX = (i: number): number => labelX + labelW + widths.slice(0, i).reduce((a, b) => a + b, 0);
  const out: string[] = [];
  let y = room.y;

  /* The column groups, over the columns they hold. */
  const grouped = spec.columns.some((c) => c.group);
  if (grouped) {
    let start = 0;
    spec.columns.forEach((c, i) => {
      const next = spec.columns[i + 1];
      if (next && next.group === c.group) return;
      if (c.group) {
        const a = colX(start) + 6;
        const b = colX(i + 1) - 6;
        const label = fit(c.group.toUpperCase(), b - a, { size: SIZE.label, face: 'mono', weight: 600, spacing: 0.8 }, `${ctx.name}: column group`);
        out.push(text((a + b) / 2, y + 14, label, { size: SIZE.label, face: 'mono', weight: 600, spacing: 0.8, fill: MUTED, anchor: 'middle' }));
        out.push(line(a, y + 24, b, y + 24, SUBTLE));
      }
      start = i + 1;
    });
    y += 34;
  }

  const used = new Set<Sign>();
  const capitals = { size: SIZE.label, face: 'mono', weight: 600, spacing: 0.8 } as const;
  /* A letter stands over a head and an example under it, each on a line of its own. */
  const lettered = spec.columns.some((c) => c.letter);
  /* A head that names a model or a period, over its letter or its blocks, is
     a name in the ink of a row's. A head over signs stays a quiet label. */
  const named = lettered || spec.blocks;
  const headSetting = { size: SIZE.label, weight: 600 } as const;
  const heads = spec.columns.map((c, i) =>
    spec.left ? [fit(c.label.toUpperCase(), (widths[i] ?? 0) - 8, capitals, `${ctx.name}: column ${c.label}`)] : wrap(c.label, (widths[i] ?? 0) - 4, headSetting, `${ctx.name}: column ${c.label}`),
  );
  const exampled = spec.columns.some((c) => c.sub);
  const headH = (Math.max(...heads.map((h) => h.length)) + (exampled ? 1 : 0)) * HEAD_LINE + (lettered ? 22 : 0) + 10;
  const top = y;
  if (spec.head) out.push(text(labelX, y + headH - 10, fit(spec.head.toUpperCase(), labelW - 8, capitals, `${ctx.name}: the head of the rows`), { ...capitals, fill: MUTED }));
  heads.forEach((lines, i) => {
    if (spec.left) {
      const end = spec.columns[i]?.end;
      out.push(text(end ? colX(i) + (widths[i] ?? 0) - 5 : colX(i) + 5, y + headH - 10, lines[0] ?? '', { ...capitals, fill: MUTED, anchor: end ? 'end' : 'start' }));
      return;
    }
    const column = spec.columns[i];
    const marked = column?.sign;
    const cx = colX(i) + (widths[i] ?? 0) / 2 + (marked ? 14 : 0);
    const base = y + headH - 10 - (exampled ? HEAD_LINE : 0);
    lines.forEach((t, j) => {
      out.push(text(cx, base - (lines.length - 1 - j) * HEAD_LINE, t, { ...headSetting, fill: named ? INK : SECONDARY, anchor: 'middle' }));
    });
    if (column?.letter) out.push(text(cx, base - lines.length * HEAD_LINE - 4, column.letter, { size: SIZE.node, weight: 600, anchor: 'middle' }));
    if (column?.sub) out.push(text(cx, base + HEAD_LINE, fit(column.sub, (widths[i] ?? 0) - 8, { size: SIZE.label }, `${ctx.name}: column ${column.label}`), { size: SIZE.label, fill: MUTED, anchor: 'middle' }));
    if (marked) {
      out.push(sign(marked, cx - Math.max(...lines.map((t) => measure(t, headSetting.size, 'sans', 600))) / 2 - 16, y + headH - 15));
    }
  });
  y += headH;
  out.push(line(room.x, y, room.x + room.width, y, SUBTLE));

  let group: string | undefined;
  const emphasised = (key: 'row' | 'column'): string[] => [spec.emphasis?.[key] ?? []].flat();
  const rowSpans: { label: string; y0: number; y1: number }[] = [];
  for (const row of spec.rows) {
    if (row.cells.length !== spec.columns.length) {
      ctx.fail(`row ${row.label} has ${row.cells.length} cells for ${spec.columns.length} columns`);
    }
    let groupLabel = '';
    if (row.group && row.group !== group) {
      if (beside) {
        if (group !== undefined) out.push(line(room.x, y, room.x + room.width, y, SUBTLE));
        groupLabel = fit(row.group.toUpperCase(), groupW - 16, groupSetting, `${ctx.name}: row group`);
      } else {
        if (group !== undefined && !spec.rules) out.push(line(room.x, y, room.x + room.width, y, SUBTLE));
        out.push(text(room.x, y + GROUP_ROW - 10, row.group.toUpperCase(), { ...groupSetting, fill: MUTED }));
        y += GROUP_ROW;
      }
      group = row.group;
    }
    const [rowId, name] = split(row.label);
    const label = wrap(name, labelW - 16 - idW, { size: SIZE.body, weight: labelWeight }, `${ctx.name}: row ${row.label}`);
    const rowX = labelX;
    const sub = row.sub ? fit(row.sub, labelW - 16, { size: SIZE.label, face: 'mono' }, `${ctx.name}: row ${row.label}`) : '';
    /* A cell's text wraps, and its chips go on to the next line where the
       column ends. The row is as high as its fullest cell. */
    const cells = row.cells.map((cell, ci) => {
      const colW = widths[ci] ?? 0;
      const c: Exclude<Cell, string> = typeof cell === 'string' ? (cell ? { sign: cell } : {}) : cell;
      const face: 'mono' | 'sans' = c.code ? 'mono' : 'sans';
      const size = spec.figures ? SIZE.title : SIZE.label;
      const weight: 400 | 600 = spec.figures ? 600 : 400;
      const room = c.sign ? colW - 40 : colW - 10;
      const what = `${ctx.name}: a cell of ${row.label}`;
      const lines = !c.text ? [] : spec.figures ? [fit(c.text, room, { size, face, weight }, what)] : wrap(c.text, room, { size, face, weight }, what);
      const chipLines: string[][] = [];
      for (const id of c.chips ?? []) {
        const current = chipLines.at(-1);
        const width = (ids: string[]): number => ids.reduce((sum, x, i) => sum + chipW(x) + (i ? 4 : 0), 0);
        if (chipW(id) > colW - 10) ctx.fail(`${what}: the chip ${id} is ${Math.ceil(chipW(id))} wide, and its cell is ${Math.floor(colW - 10)}`);
        if (current && width([...current, id]) <= colW - 10) current.push(id);
        else chipLines.push([id]);
      }
      /* A path goes on to the next line where the column ends. */
      const pathLines: string[][] = [];
      for (const step of c.path ?? []) {
        const current = pathLines.at(-1);
        const width = (all: string[]): number => all.reduce((sum, x, i) => sum + stepW(x) + (i ? JOIN : 0), 0);
        if (current && width([...current, step]) <= colW - 10) current.push(step);
        else pathLines.push([step]);
      }
      return { c, face, size, weight, lines, chipLines, pathLines };
    });
    const tallest = Math.max(0, ...cells.map((x) => (x.lines.length > 1 ? x.lines.length * 17 : 0) + x.chipLines.length * 24 + x.pathLines.length * PATH_LINE + PAD));
    const h = Math.max(spec.figures ? 56 : ROW, label.length * 18 + (sub ? 17 : 0) + PAD, tallest);
    let ty = y + (h - (label.length * 18 + (sub ? 17 : 0))) / 2 + 13;
    if (groupLabel) out.push(text(room.x, ty, groupLabel, { ...groupSetting, fill: MUTED }));
    if (rowId) out.push(text(rowX, ty, rowId, { size: SIZE.label, face: 'mono', weight: 600, fill: MUTED }));
    for (const t of label) {
      out.push(text(rowX + idW, ty, t, { size: SIZE.body, weight: labelWeight }));
      ty += 18;
    }
    if (sub) out.push(text(rowX, ty - 1, sub, { size: SIZE.label, face: 'mono', fill: SECONDARY }));
    const cy = y + h / 2;
    cells.forEach(({ c, face, size, weight, lines, chipLines, pathLines }, i) => {
      const colW = widths[i] ?? 0;
      const cx = colX(i) + colW / 2;
      let py = cy - (pathLines.length * PATH_LINE - 6) / 2;
      pathLines.forEach((all, j) => {
        let px = colX(i) + 5;
        all.forEach((step, k) => {
          if (k) out.push(text(px - JOIN / 2, py + 15, '›', { size: SIZE.label, fill: MUTED, anchor: 'middle' }));
          out.push(rect(px, py, stepW(step), 22, { fill: 'none', stroke: STRONG, radius: 6 }) + text(px + 9, py + 15, step, { size: SIZE.label, fill: INK }));
          px += stepW(step) + JOIN;
        });
        if (j < pathLines.length - 1) out.push(text(px - JOIN / 2, py + 15, '›', { size: SIZE.label, fill: MUTED, anchor: 'middle' }));
        py += PATH_LINE;
      });
      if (c.sign) {
        used.add(c.sign);
        out.push(sign(c.sign, c.text ? cx - colW / 2 + 18 : cx, cy));
      }
      if (c.note !== undefined) {
        if (!spec.notesOutside && !spec.notes?.[c.note - 1]) ctx.fail(`a cell of ${row.label} points at note ${c.note}, and there is none`);
        out.push(text((c.sign ? cx : cx + 8) + 13, cy - 5, String(c.note), { size: SIZE.label, face: 'mono', weight: 600, fill: WARN }));
      }
      const block = (lines.length > 1 ? lines.length * 17 : lines.length ? 17 : 0) + chipLines.length * 24 - (chipLines.length ? 4 : 0);
      let ty = lines.length > 1 || chipLines.length ? cy - block / 2 + 12.5 : cy + (spec.figures ? 12 : 4.5);
      if (spec.blocks && c.text && !c.sign) {
        const outlined = /^\(.*\)$/.test(c.text);
        const shown = fit(outlined ? c.text.slice(1, -1) : c.text, colW - 16, { size, face: 'mono', weight: 600 }, `${ctx.name}: a cell of ${row.label}`);
        out.push(rect(colX(i) + 4, cy - 10, colW - 8, 20, outlined ? { fill: 'none', stroke: INK, width: 1.2, radius: 3 } : { fill: SUNKEN, radius: 3 }));
        out.push(text(cx, cy + 4.5, shown, { size, face: 'mono', weight: 600, fill: INK, anchor: 'middle' }));
        lines.length = 0;
      }
      for (const t of lines) {
        const end = spec.left && spec.columns[i]?.end && !c.sign;
        out.push(text(c.sign ? cx - colW / 2 + 32 : end ? colX(i) + colW - 5 : spec.left ? colX(i) + 5 : cx, ty, t, { size, face, weight, fill: INK, anchor: end ? 'end' : c.sign || spec.left ? 'start' : 'middle' }));
        ty += 17;
      }
      let chipY = lines.length ? ty - 12.5 + 4 : cy - block / 2;
      for (const ids of chipLines) {
        const width = ids.reduce((sum, x, k) => sum + chipW(x) + (k ? 4 : 0), 0);
        let chipX = cx - width / 2;
        for (const id of ids) {
          out.push(rect(chipX, chipY, chipW(id), 20, { fill: SUNKEN, stroke: STRONG, radius: 4 }) + text(chipX + 7, chipY + 14.5, id, { size: SIZE.label, face: 'mono', weight: 600 }));
          chipX += chipW(id) + 4;
        }
        chipY += 24;
      }
    });
    if (emphasised('row').includes(row.label)) rowSpans.push({ label: row.label, y0: y, y1: y + h });
    y += h;
    if (spec.rules && !beside && row !== spec.rows.at(-1)) out.push(line(room.x, y, room.x + room.width, y, SUBTLE));
  }
  out.push(line(room.x, y, room.x + room.width, y, SUBTLE));
  /* A rule before each column that starts another set, through the rows. */
  spec.columns.forEach((c, i) => {
    if (c.split && i > 0) out.push(line(colX(i), top - 4, colX(i), y, SUBTLE));
  });

  for (const label of emphasised('row')) if (!rowSpans.some((r) => r.label === label)) ctx.fail(`the emphasis names no row ${label}`);
  /* Emphasised rows that touch share one frame. */
  rowSpans.forEach((r, i) => {
    const before = rowSpans[i - 1];
    if (before && before.y1 === r.y0) return;
    let end = i;
    while (rowSpans[end + 1]?.y0 === rowSpans[end]?.y1) end++;
    const colour = ctx.emphasis('row', `row ${r.label}`);
    out.push(rect(room.x - 8, r.y0 + 2, room.width + 16, (rowSpans[end]?.y1 ?? r.y1) - r.y0 - 4, { stroke: colour, width: 2, radius: 4 }));
  });
  const marked = emphasised('column').map((label) => {
    const i = spec.columns.findIndex((c) => c.label === label);
    return i < 0 ? ctx.fail(`the emphasis names no column ${label}`) : i;
  });
  for (const i of marked) {
    if (marked.includes(i - 1)) continue;
    let end = i;
    while (marked.includes(end + 1)) end++;
    const colour = ctx.emphasis('column', `column ${spec.columns[i]?.label}`);
    out.push(rect(colX(i) + 2, top - 4, colX(end + 1) - colX(i) - 4, y - top + 8, { stroke: colour, width: 2, radius: 4 }));
  }

  /* The legend: the signs in use, in one line that wraps. */
  if (used.size && ctx.legend) {
    y += 34;
    let x = room.x;
    for (const s of ORDER) {
      if (!used.has(s)) continue;
      const word = spec.legend?.[s] ?? SIGN_MEANING[s];
      const w = LEGEND_WORD + measure(word, SIZE.label) + LEGEND_GAP;
      if (x + w > room.x + room.width + LEGEND_GAP) {
        x = room.x;
        y += 24;
      }
      out.push(sign(s, x + 11, y - 4));
      out.push(text(x + LEGEND_WORD, y, word, { size: SIZE.label, fill: SECONDARY }));
      x += w;
    }
    if (spec.legendNote) {
      const note = fit(spec.legendNote, room.x + room.width - x, { size: SIZE.label }, `${ctx.name}: the note of the legend`);
      out.push(text(x, y, note, { size: SIZE.label, fill: SECONDARY }));
    }
    y += 6;
  }
  (spec.notesOutside ? [] : (spec.notes ?? [])).forEach((note, i) => {
    const lines = wrap(note, room.width - 24, { size: SIZE.label }, `${ctx.name}: note ${i + 1}`);
    y += 10;
    out.push(text(room.x, y + 13, String(i + 1), { size: SIZE.label, face: 'mono', weight: 600, fill: WARN }));
    lines.forEach((l, j) => out.push(text(room.x + 20, y + 13 + j * 18, l, { size: SIZE.label, fill: SECONDARY })));
    y += lines.length * 18;
  });
  return room.width > space.width + 0.5 ? { svg: out.join('\n'), height: y - room.y, width: Math.ceil(room.width) } : { svg: out.join('\n'), height: y - room.y };
};
