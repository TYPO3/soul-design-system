/* Nodes on a grid, joined by orthogonal connectors, inside boundaries.

   The author places each node at a column and a row. The layout sizes the
   rows to their tallest node, routes every connector, and refuses a label
   with no room on its segment. Boxes and arrows are the last resort of the
   grammar, so the other layouts come first where a claim fits them. */

import { type CardSpec, drawCard, leastCard, measureCard } from './card.ts';
import type { Context, Drawn, Room, State } from './context.ts';
import { ACCENT, CANVAS, ERROR, MUTED, type Point, SECONDARY, SIZE, STRONG, WARN, arrowhead, connector, fmt, rect, text } from './paint.ts';
import { fit, measure } from './text.ts';

export interface FlowNode extends CardSpec {
  id: string;
  /** Column and row, from 0. */
  at: [number, number];
  /** How many columns the node spans. */
  span?: number;
  /** How many rows the node spans. */
  rows?: number;
}

export interface FlowEdge {
  /** A node id, or `group:<label>` for a boundary. */
  from: string;
  to: string;
  label?: string;
  /** The axis the connector leaves on where it bends. */
  via?: 'h' | 'v';
  /** Where in the gap it bends, from 0 to 1. The middle by default. */
  bend?: number;
  state?: State;
  /** A connector that fails: drawn in the error colour. */
  fails?: boolean;
  /** A head at both ends: a question and its answer on one line. */
  both?: boolean;
  emphasis?: boolean;
}

export interface FlowGroup {
  /** The name a connector uses for the boundary. `group:<label>` without it. */
  id?: string;
  label: string;
  /** Its nodes, and the nodes of the boundaries inside it. */
  nodes: string[];
  state?: State;
  /** The boundary it stands inside, by its name: a part of a part. */
  within?: string;
  /** The boundary is the claim: its outline in the claim colour. */
  emphasis?: boolean;
}

export interface FlowSpec {
  kind: 'flow';
  /** The relative width of each column. */
  columns: number[];
  gap?: [number, number];
  nodes: FlowNode[];
  edges?: FlowEdge[];
  groups?: FlowGroup[];
  /** A label at the left of a row, and a note under it, by row. */
  rows?: { label?: string; note?: string }[];
  /** A head over each column, by column: what the column holds. */
  heads?: string[];
  /** The letter of a part before each head, by column, in the colour of the claim. */
  letters?: string[];
  /** A word in mono capitals over each head, by column: the head is then a title in bold. */
  eyebrows?: string[];
  /** Connectors that leave one side of one node leave it apart, each with
      its own bend, and share no trunk. */
  fan?: boolean;
  /** With `fan`, the connectors across a gap leave the middle of their
      source together and run to their ends as curves. */
  curve?: boolean;
  /** The columns whose head names the claim, in the claim colour. */
  claims?: number[];
  /** Every row as high as the highest: peers in rows of one height. */
  even?: boolean;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  row: number;
}

const PAGE_GROUP = { pad: 16, head: 30, note: 30 };
const PLAIN_CLEAR = 10;

/* A chain on one row, each connector to the next column, folded into rows
   for a slide's room: one, two or three. The fewest rows where no title
   wraps past two lines and no body past three come first, else the fold
   that wraps the least. Each row runs left to right, and the connector at
   its end runs down to the start of the next. */
export const folds = (spec: FlowSpec, width: number): FlowSpec[] => {
  const nodes = [...spec.nodes].sort((a, b) => a.at[0] - b.at[0]);
  const place = (id: string): number => nodes.findIndex((n) => n.id === id);
  const chain =
    nodes.length >= 3 &&
    !spec.groups?.length &&
    !spec.rows?.length &&
    nodes.every((n, i) => n.at[1] === 0 && (n.span ?? 1) === 1 && (n.rows ?? 1) === 1 && n.at[0] === i) &&
    (spec.edges ?? []).every((e) => place(e.from) >= 0 && place(e.to) === place(e.from) + 1);
  if (!chain) return [spec];
  const gap = spec.gap?.[0] ?? 64;
  const out: { spec: FlowSpec; lines: number; tidy: boolean }[] = [];
  for (let rows = 1; rows <= 3; rows++) {
    const across = Math.ceil(nodes.length / rows);
    if (rows > 1 && across === Math.ceil(nodes.length / (rows - 1))) continue;
    const w = rows === 1 ? 0 : (width - (across - 1) * gap) / across;
    let lines = 0;
    let tidy = true;
    try {
      for (const n of nodes) {
        const m = measureCard(n, rows === 1 ? (width - (nodes.length - 1) * gap) / nodes.length : w, 'a fold');
        lines += m.title.length + m.body.length;
        if (m.title.length > 2 || m.body.length > 3) tidy = false;
      }
    } catch {
      continue;
    }
    const turns = (e: FlowEdge): boolean => place(e.to) % across === 0;
    const folded =
      rows === 1
        ? spec
        : {
            ...spec,
            columns: Array<number>(across).fill(1),
            nodes: nodes.map((n): FlowNode => ({ ...n, at: [n.at[0] % across, Math.floor(n.at[0] / across)] })),
            edges: (spec.edges ?? []).map((e): FlowEdge => (turns(e) ? { ...e, via: 'v' } : e)),
          };
    out.push({ spec: folded, lines, tidy });
  }
  const tidy = out.filter((o) => o.tidy);
  const rest = out.filter((o) => !o.tidy).sort((a, b) => a.lines - b.lines);
  return out.length ? [...tidy, ...rest].map((o) => o.spec) : [spec];
};

/* The drawing as written. Where that refuses a word or a label, the drawing
   takes the room its text asks for instead, and the page shrinks it. Where
   that fails too, the first refusal names what to change. */
export const flow = (spec: FlowSpec, space: Room, ctx: Context): Drawn => {
  try {
    return ctx.attempt(() => place(spec, space, ctx, false));
  } catch (first) {
    try {
      return ctx.attempt(() => place(spec, space, ctx, true));
    } catch {
      throw first;
    }
  }
};

const place = (spec: FlowSpec, space: Room, ctx: Context, grow: boolean): Drawn => {
  const [stated, gapY] = spec.gap ?? [64, ctx.pick(48, 32)];
  const [GROUP_PAD, GROUP_HEAD, NOTE] = ctx.pick([PAGE_GROUP.pad, PAGE_GROUP.head, PAGE_GROUP.note], [12, 24, 22]);
  const groups = spec.groups ?? [];
  const keyOf = (g: FlowGroup): string => g.id ?? `group:${g.label}`;
  const inside = (g: FlowGroup): FlowGroup[] => groups.filter((c) => c.within === keyOf(g));
  /* How many boundaries deep a boundary holds: each adds its pad around the one inside it. */
  const depth = (g: FlowGroup): number => 1 + Math.max(0, ...inside(g).map(depth));
  for (const g of groups) if (g.within && !groups.some((o) => keyOf(o) === g.within)) ctx.fail(`boundary ${g.label} stands inside ${g.within}, and there is no such boundary`);
  /* A boundary stays inside the margin, so its nodes stand in by its pad.
     A row label takes a column of its own at the left. */
  const inset = groups.length ? GROUP_PAD * Math.max(...groups.map(depth)) : 0;
  const labels = (spec.rows ?? []).map((r) => r.label ?? '');
  const labelW = labels.some(Boolean) ? Math.max(...labels.map((l) => measure(l, SIZE.body, 'sans', 600))) + 32 : 0;
  /* A boundary that ends between two columns stands in their gap. One across
     every column ends at the margin, so the gap owes it nothing. */
  const where = new Map(spec.nodes.map((n) => [n.id, n]));
  const reach = (g: FlowGroup): number[] => [...g.nodes.flatMap((id) => { const n = where.get(id); return n ? [n.at[0], n.at[0] + (n.span ?? 1) - 1] : []; }), ...inside(g).flatMap(reach)];
  const parted = groups.some((g) => { const cols = reach(g); return cols.length > 0 && (Math.min(...cols) > 0 || Math.max(...cols) < spec.columns.length - 1); });
  if (parted && stated < 2 * GROUP_PAD + 8) ctx.fail(`a gap of ${stated} between columns leaves no room for a boundary`);
  /* The room the text asks for: a gap the widest label across it, a column
     its widest card at its weight. */
  const column = new Map(spec.nodes.map((n) => [n.id, n.at[0]]));
  const crossed = (spec.edges ?? []).filter((e) => e.label && column.get(e.from) !== column.get(e.to));
  const gapX = !grow ? stated : Math.max(stated, ...crossed.map((e) => measure(e.label ?? '', SIZE.label, 'mono') + 8 + (groups.length ? 2 * GROUP_PAD + 16 : 0)));
  const total = spec.columns.reduce((a, b) => a + b, 0);
  const between = (spec.columns.length - 1) * gapX;
  const given = space.width - labelW - 2 * inset - between;
  /* A column too narrow for its widest card takes what it lacks from the
     others, at their weights. Where they have nothing left to give, the
     drawing grows. A boundary's head and a spanning card share their lack
     out over their columns. */
  let widths = spec.columns.map((w) => (given * w) / total);
  /* Each column at least as wide as the largest of k × its share and `need`,
     with k as large as the room lets it be. */
  const share = (need: number[]): number[] => {
    const at = (k: number): number[] => widths.map((w, c) => Math.max(need[c] ?? 0, w * k));
    let [low, high] = [0, 1];
    for (let i = 0; i < 30; i++) {
      const k = (low + high) / 2;
      if (at(k).reduce((a, w) => a + w, 0) > given) high = k;
      else low = k;
    }
    return at(low);
  };
  /* A name stays whole where the other columns can spare the width. A box
     breaks a name only where the drawing has no room for it. The columns
     that ask the least more go first. */
  const cards = (c: number, whole: boolean): number => Math.max(0, ...spec.nodes.filter((n) => n.at[0] === c && (n.span ?? 1) === 1).map((n) => leastCard(n, whole)));
  const least = spec.columns.map((_, c) => Math.min(cards(c, false), widths[c] ?? 0));
  const whole = spec.columns.map((_, c) => cards(c, true));
  const keep = least.slice();
  for (const c of spec.columns.map((_, c) => c).sort((a, b) => (whole[a] ?? 0) - (least[a] ?? 0) - ((whole[b] ?? 0) - (least[b] ?? 0)))) {
    const tried = keep.map((w, i) => (i === c ? Math.max(w, whole[c] ?? 0) : w));
    if (tried.reduce((a, w) => a + w, 0) <= given) keep[c] = tried[c] ?? 0;
  }
  widths = share(keep);
  if (grow) {
    const need = spec.columns.map((_, c) => Math.max(spec.letters?.[c] ? measure(spec.heads?.[c] ?? '', SIZE.node, 'sans', 600) + measure(spec.letters[c] ?? '', SIZE.node, 'sans', 600) + 8 : measure((spec.heads?.[c] ?? '').toUpperCase(), SIZE.label, 'mono', 600, 0.8), ...spec.nodes.filter((n) => n.at[0] === c && (n.span ?? 1) === 1).map((n) => leastCard(n))));
    /* A boundary's head asks its columns for its width, each at its weight. */
    for (const g of groups) {
      const cs = g.nodes.flatMap((id) => spec.nodes.filter((n) => n.id === id).map((n) => n.at[0]));
      const [first, last] = [Math.min(...cs), Math.max(...cs)];
      const weight = spec.columns.slice(first, last + 1).reduce((a, b) => a + b, 0);
      const head = measure(g.label, SIZE.label, 'mono') - (last - first) * gapX;
      for (let c = first; c <= last; c++) need[c] = Math.max(need[c] ?? 0, (head * (spec.columns[c] ?? 0)) / weight);
    }
    widths = share(need);
    const across = (first: number, last: number, need: number): void => {
      const has = widths.slice(first, last + 1).reduce((a, w) => a + w, 0) + (last - first) * gapX;
      if (has >= need) return;
      for (let c = first; c <= last; c++) widths[c] = (widths[c] ?? 0) * (1 + (need - has) / (has - (last - first) * gapX));
    };
    for (const n of spec.nodes) {
      if ((n.span ?? 1) > 1) across(n.at[0], n.at[0] + (n.span ?? 1) - 1, leastCard(n));
    }
    for (const g of groups) {
      const cs = g.nodes.flatMap((id) => spec.nodes.filter((n) => n.id === id).map((n) => n.at[0]));
      across(Math.min(...cs), Math.max(...cs), measure(g.label, SIZE.label, 'mono'));
    }
  }
  const free = widths.reduce((a, w) => a + w, 0);
  /* Twice its room at most: what needs more is two drawings. */
  if (free + between > 2 * (given + between)) ctx.fail('the text asks for more than twice the room');
  const room = { x: space.x + labelW + inset, y: space.y, width: free + between };
  const colX: number[] = [];
  const colW: number[] = [];
  let cx = room.x;
  for (const width of widths) {
    colX.push(cx);
    colW.push(width);
    cx += width + gapX;
  }
  const columnEdge = (c: number): number => {
    const x = colX[c];
    const w = colW[c];
    if (x === undefined || w === undefined) return ctx.fail(`column ${c} is outside the ${spec.columns.length} the drawing has`);
    return x + w;
  };

  const measured = spec.nodes.map((n) => {
    const [c, r] = n.at;
    const x = colX[c] ?? ctx.fail(`node ${n.id} stands in column ${c}, outside the grid`);
    const w = columnEdge(c + (n.span ?? 1) - 1) - x;
    return { n, x, r, m: measureCard(n, w, `${ctx.name}: node ${n.id}`, ctx.dense) };
  });
  const rows = Math.max(...spec.nodes.map((n) => n.at[1] + (n.rows ?? 1) - 1)) + 1;
  const tall = (m: (typeof measured)[number]): number => m.n.rows ?? 1;
  const rowH = Array.from({ length: rows }, (_, r) => Math.max(0, ...measured.filter((m) => m.r === r && tall(m) === 1).map((m) => m.m.height)));
  if (spec.even) rowH.fill(Math.max(0, ...rowH));
  /* A node over several rows takes what its card lacks from the last of them. */
  for (const m of measured.filter((x) => tall(x) > 1)) {
    const last = m.r + tall(m) - 1;
    const has = rowH.slice(m.r, last + 1).reduce((a, b) => a + b, 0) + (tall(m) - 1) * gapY;
    if (has < m.m.height) rowH[last] = (rowH[last] ?? 0) + m.m.height - has;
  }

  /* A boundary needs a head above its first row and a pad under its last. */
  const ids = new Map(measured.map((m) => [m.n.id, m]));
  const extraAbove = Array<number>(rows).fill(0);
  const extraBelow = Array<number>(rows).fill(0);
  const rowsOf = (g: FlowGroup): number[] => g.nodes.map((id) => (ids.get(id) ?? ctx.fail(`boundary ${g.label} names no node ${id}`)).r);
  /* A boundary inside another on the same first or last row stacks its head or its pad on the other's. */
  const above = (g: FlowGroup): number => 1 + Math.max(0, ...inside(g).filter((c) => Math.min(...rowsOf(c)) === Math.min(...rowsOf(g))).map(above));
  const below = (g: FlowGroup): number => 1 + Math.max(0, ...inside(g).filter((c) => Math.max(...rowsOf(c)) === Math.max(...rowsOf(g))).map(below));
  for (const g of groups) {
    const rs = rowsOf(g);
    const top = Math.min(...rs);
    const bottom = Math.max(...rs);
    extraAbove[top] = Math.max(extraAbove[top] ?? 0, above(g) * ((g.label ? GROUP_HEAD : 0) + GROUP_PAD));
    extraBelow[bottom] = Math.max(extraBelow[bottom] ?? 0, below(g) * GROUP_PAD);
  }
  (spec.rows ?? []).forEach((r, i) => {
    if (r.note && i < rows) extraBelow[i] = (extraBelow[i] ?? 0) + NOTE;
  });
  /* The heads stand over their columns, above everything the columns hold. */
  const lift = spec.eyebrows?.some(Boolean) ? 18 : 0;
  const headH = spec.heads?.some(Boolean) ? ctx.pick(30, 26) + lift : 0;
  const rowY: number[] = [];
  let y = room.y + headH;
  for (let r = 0; r < rows; r++) {
    y += extraAbove[r] ?? 0;
    rowY.push(y);
    y += (rowH[r] ?? 0) + (extraBelow[r] ?? 0) + gapY;
  }
  const bottom = y - gapY;

  const boxes = new Map<string, Box>();
  const heightOf = (n: FlowNode, r: number): number => {
    const last = r + (n.rows ?? 1) - 1;
    return (rowY[last] ?? 0) + (rowH[last] ?? 0) - (rowY[r] ?? 0);
  };
  for (const { n, x, r, m } of measured) {
    if (boxes.has(n.id)) ctx.fail(`two nodes have the id ${n.id}`);
    boxes.set(n.id, { x, y: rowY[r] ?? 0, w: m.width, h: heightOf(n, r), row: r });
  }

  const out: string[] = [];
  /* A lettered head is the title of a part, the letter in the claim colour
     as a lettered column has it. It spends no emphasis. */
  (spec.heads ?? []).forEach((h, c) => {
    if (!h) return;
    if (colX[c] === undefined) ctx.fail(`column ${c} has a head, and the drawing has ${spec.columns.length} columns`);
    const letter = spec.letters?.[c];
    const what = `${ctx.name}: the head of column ${c}`;
    const eyebrow = spec.eyebrows?.[c];
    if (eyebrow) {
      const capitals = { size: SIZE.label, face: 'mono', weight: 600, spacing: 0.8 } as const;
      out.push(text(colX[c] ?? 0, room.y + 13, fit(eyebrow.toUpperCase(), columnEdge(c) - (colX[c] ?? 0), capitals, what), { ...capitals, fill: MUTED }));
      out.push(text(colX[c] ?? 0, room.y + 16 + lift, fit(h, columnEdge(c) - (colX[c] ?? 0), { size: SIZE.node, weight: 600 }, what), { size: SIZE.node, weight: 600 }));
      return;
    }
    if (letter) {
      const lw = measure(letter, SIZE.node, 'sans', 600) + 8;
      out.push(text(colX[c] ?? 0, room.y + 16, letter, { size: SIZE.node, weight: 600, fill: ACCENT }));
      out.push(text((colX[c] ?? 0) + lw, room.y + 16, fit(h, columnEdge(c) - (colX[c] ?? 0) - lw, { size: SIZE.node, weight: 600 }, what), { size: SIZE.node, weight: 600 }));
      return;
    }
    const shown = fit(h.toUpperCase(), columnEdge(c) - (colX[c] ?? 0), { size: SIZE.label, face: 'mono', weight: 600, spacing: 0.8 }, what);
    const claim = spec.claims?.includes(c) ? ctx.emphasis('boundary', `the head ${h}`) : undefined;
    out.push(text(colX[c] ?? 0, room.y + 14, shown, { size: SIZE.label, face: 'mono', weight: 600, spacing: 0.8, fill: claim ?? MUTED }));
  });
  /* The boundaries inside first: one outside takes their boxes as its members. */
  for (const g of [...groups].sort((a, b) => depth(a) - depth(b))) {
    const nested = inside(g).flatMap((c) => c.nodes);
    const members = [...g.nodes.filter((id) => !nested.includes(id)), ...inside(g).map(keyOf)].map((id) => boxes.get(id) as Box);
    const x0 = Math.min(...members.map((b) => b.x)) - GROUP_PAD;
    const x1 = Math.max(...members.map((b) => b.x + b.w)) + GROUP_PAD;
    /* A boundary with no name has no head: a head over its column names it. */
    const y0 = Math.min(...members.map((b) => b.y)) - GROUP_PAD - (g.label ? GROUP_HEAD : 0);
    const y1 = Math.max(...members.map((b) => b.y + b.h)) + GROUP_PAD;
    const state = g.state ?? 'present';
    out.push(
      rect(x0, y0, x1 - x0, y1 - y0, {
        stroke: g.emphasis ? ctx.emphasis('boundary', `boundary ${g.label}`) : state === 'degraded' ? WARN : STRONG,
        width: g.emphasis ? 2 : 1.5,
        radius: 6,
        dashed: state !== 'present',
      }),
    );
    const head = fit(g.label, x1 - x0 - 2 * GROUP_PAD, { size: SIZE.label, face: 'mono' }, `${ctx.name}: boundary ${g.label}`);
    if (head) out.push(text(x0 + GROUP_PAD, y0 + GROUP_HEAD - 4, head, { size: SIZE.label, face: 'mono', fill: MUTED }));
    const key = g.id ?? `group:${g.label}`;
    if (boxes.has(key)) ctx.fail(`a boundary and a node have the same name, ${key}`);
    boxes.set(key, { x: x0, y: y0, w: x1 - x0, h: y1 - y0, row: -1 });
  }

  (spec.rows ?? []).forEach((r, i) => {
    const ry = rowY[i];
    if (ry === undefined) return ctx.fail(`row ${i} has a label, and the grid has ${rows} rows`);
    if (r.label) out.push(text(space.x, ry + (rowH[i] ?? 0) / 2 + 5, r.label, { size: SIZE.body, weight: 600, fill: SECONDARY }));
    if (r.note) {
      const note = fit(r.note, room.width, { size: SIZE.label }, `${ctx.name}: the note of row ${i}`);
      out.push(text(room.x, ry + (rowH[i] ?? 0) + NOTE - 6, note, { size: SIZE.label, fill: SECONDARY }));
    }
  });

  const edgeLabels: string[] = [];
  const groupKeys = new Set(groups.map((g) => g.id ?? `group:${g.label}`));
  const nodeBoxes = [...boxes.entries()].filter(([id]) => !groupKeys.has(id)).map(([, b]) => b);
  const groupBoxes = [...boxes.entries()].filter(([id]) => groupKeys.has(id)).map(([, b]) => b);
  /* A note has no edge, so a connector stops short of its text. */
  const plain = new Set(spec.nodes.filter((n) => n.plain).map((n) => n.id));
  const clear = (id: string, box: Box): Box => (plain.has(id) ? { ...box, x: box.x - PLAIN_CLEAR, w: box.w + 2 * PLAIN_CLEAR } : box);
  const routed = (spec.edges ?? []).map((e) => {
    const what = `edge ${e.from} → ${e.to}`;
    const a = clear(e.from, boxes.get(e.from) ?? ctx.fail(`${what} starts at nothing`));
    const b = clear(e.to, boxes.get(e.to) ?? ctx.fail(`${what} ends at nothing`));
    return { e, what, a, b, points: route(a, b, e.via, (e.bend ?? 0.5) * gapX, (e.bend ?? 0.5) * gapY) };
  });
  if (spec.fan) fan(routed, gapX);
  apart(routed);
  for (const { e, what, a, b, points } of routed) {
    const colour = e.emphasis ? ctx.emphasis('connector', what) : e.fails ? ERROR : e.state === 'degraded' ? WARN : MUTED;
    const across = spec.curve && spec.fan && (b.x >= a.x + a.w || b.x + b.w <= a.x);
    if (across) out.push(curved(a, b, colour, e.emphasis || e.fails ? 2 : 1.5, (e.state ?? 'present') !== 'present'));
    else out.push(connector(points, colour, e.emphasis || e.fails ? 2 : 1.5, (e.state ?? 'present') !== 'present', true, e.both));
    if (e.label) edgeLabels.push(edgeLabel(e.label, points, colour, nodeBoxes, groupBoxes, ctx, what));
  }

  for (const { n, x, r, m } of measured) out.push(drawCard(m, x, rowY[r] ?? 0, heightOf(n, r), ctx, `node ${n.id}`));
  out.push(...edgeLabels);
  const took = room.width + labelW + 2 * inset;
  return took > space.width + 0.5 ? { svg: out.join('\n'), height: bottom - room.y, width: Math.ceil(took) } : { svg: out.join('\n'), height: bottom - room.y };
};

const centre = (b: Box): Point => [b.x + b.w / 2, b.y + b.h / 2];

/* A curve from the middle of the side of `a` to the middle of the side of
   `b` that face each other. It leaves and arrives level, so the head points
   along the row it ends in. */
const curved = (a: Box, b: Box, stroke: string, width: number, dashed: boolean): string => {
  const right = b.x >= a.x + a.w;
  const [x0, y0] = [right ? a.x + a.w : a.x, a.y + a.h / 2];
  const [x1, y1] = [right ? b.x : b.x + b.w, b.y + b.h / 2];
  const pull = (x1 - x0) / 2;
  const end = right ? x1 - 9 : x1 + 9;
  return `<path d="M${fmt(x0)} ${fmt(y0)} C${fmt(x0 + pull)} ${fmt(y0)} ${fmt(x1 - pull)} ${fmt(y1)} ${fmt(end)} ${fmt(y1)} L${fmt(x1)} ${fmt(y1)}" fill="none" stroke="${stroke}" stroke-width="${width}"${dashed ? ' stroke-dasharray="5 4"' : ''}></path>${arrowhead([x1, y1], [end, y1], stroke)}`;
};

/* The connectors that leave one side of one box, in the order of their ends.
   Each leaves at its own height and bends at its own place in the gap, so
   no two share a trunk. A connector that rises bends nearer the higher it
   leaves, and one that falls nearer the lower, so none crosses another. */
const fan = (routed: { e: FlowEdge; a: Box; points: Point[] }[], gapX: number): void => {
  const sides = new Map<string, { a: Box; all: Point[][] }>();
  for (const { e, a, points } of routed) {
    const [start, next] = points;
    if ((points.length !== 4 && points.length !== 2) || !start || !next || start[1] !== next[1] || e.bend !== undefined) continue;
    const key = `${e.from}:${next[0] > start[0] ? 'r' : 'l'}`;
    const side = sides.get(key) ?? { a, all: [] };
    side.all.push(points);
    sides.set(key, side);
  }
  /* Each connector gets its rank within its side first, then a place of its
     own in the gap among every fanned connector that crosses it. */
  const placed: { points: Point[]; y: number; rank: number; right: boolean; x0: number; order: number }[] = [];
  [...sides.entries()].forEach(([key, { a, all }], order) => {
    const right = key.endsWith('r');
    all.sort((p, q) => (p.at(-1)?.[1] ?? 0) - (q.at(-1)?.[1] ?? 0));
    const ys = all.map((_, i) => a.y + (a.h * (i + 1)) / (all.length + 1));
    const up = all.map((p, i) => (p.at(-1)?.[1] ?? 0) < (ys[i] ?? 0));
    const rising = up.filter(Boolean).length;
    all.forEach((points, i) => {
      const end = points.at(-1) as Point;
      /* An end within a few units of its place, and inside the box, runs straight. */
      const y = Math.abs(end[1] - (ys[i] ?? 0)) < 8 && end[1] > a.y && end[1] < a.y + a.h ? end[1] : (ys[i] ?? 0);
      const rank = up[i] ? i / Math.max(1, rising) : (all.length - 1 - i) / Math.max(1, all.length - rising);
      placed.push({ points, y, rank, right, x0: (points[0] as Point)[0], order });
    });
  });
  const gaps = new Map<string, typeof placed>();
  for (const p of placed) {
    const key = `${Math.round(p.x0)}:${p.right}`;
    gaps.set(key, [...(gaps.get(key) ?? []), p]);
  }
  for (const group of gaps.values()) {
    const bending = group.filter((p) => Math.abs((p.points.at(-1) as Point)[1] - p.y) >= 1);
    bending.sort((p, q) => p.rank - q.rank || p.order - q.order);
    for (const p of group) {
      const end = p.points.at(-1) as Point;
      const slot = bending.indexOf(p);
      if (slot < 0) {
        p.points.splice(0, p.points.length, [p.x0, end[1]], end);
        continue;
      }
      const share = 0.15 + (0.7 * slot) / Math.max(1, bending.length - 1);
      const bx = p.right ? p.x0 + gapX * share : p.x0 - gapX * share;
      p.points.splice(0, p.points.length, [p.x0, p.y], [bx, p.y], [bx, end[1]], end);
    }
  }
};

/* Two connectors that meet a box at one point read as one line with two
   heads. So an elbow that ends where another connector ends or starts moves
   off the middle. It moves by a quarter of the box, to the side it comes
   from. */
const apart = (routed: { b: Box; points: Point[] }[]): void => {
  const ends = (i: number): Point[] => routed.filter((_, j) => j !== i).flatMap((r) => [r.points[0], r.points.at(-1)]).filter((p): p is Point => !!p);
  routed.forEach(({ b, points }, i) => {
    const last = points.at(-1);
    if (points.length !== 4 || !last || !ends(i).some(([x, y]) => Math.abs(x - last[0]) < 2 && Math.abs(y - last[1]) < 2)) return;
    const [, , turn] = points as [Point, Point, Point, Point];
    const across = turn[1] === last[1];
    if (across) {
      const shift = Math.min(b.h / 4, 14) * (points[0]![1] > last[1] ? 1 : -1);
      points[2] = [turn[0], turn[1] + shift];
      points[3] = [last[0], last[1] + shift];
    } else {
      const shift = Math.min(b.w / 4, 14) * (points[0]![0] > last[0] ? 1 : -1);
      points[2] = [turn[0] + shift, turn[1]];
      points[3] = [last[0] + shift, last[1]];
    }
  });
};

/* Straight where two boxes share a row or a column. Else one elbow out of
   the side of the source, through the gap between the columns. So a fan of
   connectors runs beside the boxes and never behind them. */
const route = (a: Box, b: Box, via: 'h' | 'v' | undefined, outX: number, outY: number): Point[] => {
  const [ax, ay] = centre(a);
  const [bx, by] = centre(b);
  const overlapY = Math.max(a.y, b.y) < Math.min(a.y + a.h, b.y + b.h);
  const overlapX = Math.max(a.x, b.x) < Math.min(a.x + a.w, b.x + b.w);
  if (via === 'h' || (via !== 'v' && (overlapY || !overlapX))) {
    const right = bx > ax;
    const x0 = right ? a.x + a.w : a.x;
    const x1 = right ? b.x : b.x + b.w;
    if (overlapY) {
      const yy = (Math.max(a.y, b.y) + Math.min(a.y + a.h, b.y + b.h)) / 2;
      return [[x0, yy], [x1, yy]];
    }
    const mx = right ? x0 + outX : x0 - outX;
    return [[x0, ay], [mx, ay], [mx, by], [x1, by]];
  }
  const down = by > ay;
  const y0 = down ? a.y + a.h : a.y;
  const y1 = down ? b.y : b.y + b.h;
  if (overlapX) {
    const xx = (Math.max(a.x, b.x) + Math.min(a.x + a.w, b.x + b.w)) / 2;
    return [[xx, y0], [xx, y1]];
  }
  const my = down ? y0 + outY : y0 - outY;
  return [[ax, y0], [ax, my], [bx, my], [bx, y1]];
};

/* Above the first horizontal stretch with room for it, where a reader
   follows the connector out of its source. A stretch ends at a boundary's
   edge. Else under the first stretch where nothing stands, else beside the
   longest vertical segment. A box in the way is an error. */
const edgeLabel = (label: string, points: readonly Point[], colour: string, boxes: readonly Box[], groups: readonly Box[], ctx: Context, what: string): string => {
  const w = measure(label, SIZE.label, 'mono');
  const segments = points.slice(1).map((q, i) => [points[i] as Point, q] as const);
  const stretches = segments
    .filter(([[, py], [, qy]]) => py === qy)
    .flatMap(([[px, py], [qx]]) => {
      const [a, b] = [Math.min(px, qx), Math.max(px, qx)];
      const cuts = groups.flatMap((g) => (py > g.y && py < g.y + g.h ? [g.x, g.x + g.w] : [])).filter((x) => x > a && x < b);
      const edges = [a, ...cuts.sort((m, n) => m - n), b];
      return edges.slice(1).map((end, i) => ({ from: (edges[i] ?? a) + (i ? 8 : 0), to: end - (i < edges.length - 2 ? 8 : 0), y: py }));
    });
  const across = stretches.find((s) => s.to - s.from >= w + 8);
  const clear = (x: number, y: number): boolean =>
    !boxes.some((b) => x + w > b.x && x < b.x + b.w && y > b.y && y - 13 < b.y + b.h) &&
    !groups.some((g) => (g.x > x && g.x < x + w) || (g.x + g.w > x && g.x + g.w < x + w));
  const under = stretches[0] && clear(stretches[0].from + 8, stretches[0].y + 20) ? stretches[0] : undefined;
  let lx: number;
  let ly: number;
  if (across) {
    lx = (across.from + across.to) / 2 - w / 2;
    ly = across.y - 8;
  } else if (under) {
    lx = under.from + 8;
    ly = under.y + 20;
  } else {
    const down = segments.filter(([[px], [qx]]) => px === qx);
    const longest = down.sort(([a, b], [c, d]) => Math.abs(d[1] - c[1]) - Math.abs(b[1] - a[1]))[0];
    if (!longest) return ctx.fail(`${what}: the label "${label}" has no room on its connector — widen the gap or shorten the label`);
    const [[px, py], [, qy]] = longest;
    lx = px + 8;
    ly = (py + qy) / 2 + 4;
  }
  const hit = boxes.find((b) => lx + w > b.x && lx < b.x + b.w && ly > b.y && ly - 13 < b.y + b.h);
  if (hit) ctx.fail(`${what}: the label "${label}" runs into a node — widen the gap or shorten the label`);
  return rect(lx - 3, ly - 13, w + 6, 18, { fill: CANVAS }) + text(lx, ly, label, { size: SIZE.label, face: 'mono', fill: colour });
};
