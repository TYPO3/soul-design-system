/* Columns of items under a head: the parts of a whole, side by side.

   A column is a set, and the columns are its peers. Under its head stand
   its items, a terminal block, a note and a foot, each where the spec has
   one.
   An item can carry an identifier, a sign or a status mark, and one item
   or one column can carry the emphasis. A column with no item yet has a
   dashed outline: its shortfall has the size of the column. */

import type { Context, Drawn, Room, State } from './context.ts';
import { ACCENT, CANVAS, INK, MUTED, RAISED, SECONDARY, SIZE, STRONG, SUBTLE, SUNKEN, type Sign, TONE, type Tone, WARN, connector, line, PLACE, placeSign, rect, sign, text } from './paint.ts';
import { type Widget, leastWidth, naturalWidth, stack, widget } from './widgets.ts';
import { fit, measure, narrowest, wrap } from './text.ts';

export interface Item {
  text: string;
  /** The text is an identifier, a path or a time. */
  code?: boolean;
  /** An identifier before the text, in mono. */
  id?: string;
  sign?: Sign;
  /** A status mark before the text: a small square in its tone. */
  mark?: Tone;
  /** Status marks after the text, at the right, in order. */
  marks?: Tone[];
  /** The item stands in a box of its own, as a row of a list does. */
  boxed?: boolean;
  /** An ink outline: one of several peers a case marks, apart from the emphasis. */
  strong?: boolean;
  state?: State;
  emphasis?: boolean;
  /** The emphasis fills the item, and its text stands on it in the ground colour. */
  fill?: boolean;
}

export interface Column {
  eyebrow?: string;
  /** The letter of a part before the title, in the colour of the claim: the
      parts of a document, lettered. It spends no emphasis. */
  letter?: string;
  /** A figure under the eyebrow, at the size of a tile's value: what the
      column counts. */
  value?: string;
  title?: string;
  /** A line under the title, in mono: the fields or the steps it names. */
  sub?: string;
  /** An identifier at the right of the title. */
  id?: string;
  /** Where in an interface the column happens, as a sign at its top right. */
  place?: Sign;
  /** A condition of the whole case, white on ink across the top edge at its right. */
  badge?: string;
  body?: string;
  items?: Item[];
  /** Lines in a terminal: an ink block, in mono. */
  terminal?: string[];
  /** A note under the items. */
  note?: string;
  /** A last word at the foot, in mono: what the column is for. */
  foot?: string;
  /** Controls of an interface, in order, after the items. */
  widgets?: Widget[];
  /** Lines from the bottom of one control to the top of another, by their ids. */
  joins?: Join[];
  strong?: boolean;
  state?: State;
  emphasis?: boolean;
}

export interface Join {
  from: string;
  to: string;
  /** A dashed line: what does not get through, or a weaker tie. */
  dashed?: boolean;
  /** A head at the end: the line is a move or a step. */
  arrow?: boolean;
  /** The line runs near the right edge of the two controls, not between their middles. */
  right?: boolean;
}

export interface ColumnsSpec {
  kind: 'columns';
  columns: Column[];
  /** What a sign or a chip stands for, under the columns. */
  legend?: { sign?: Sign; chip?: string; badge?: string; pill?: string; label: string }[];
  /** The columns are steps of one chain: an arrow joins each to the next. */
  chain?: boolean;
  /** A staircase: each column starts a step higher than the one before. */
  rise?: boolean;
  /** Names at the left for the items of every column, in order. Each
      item then draws only its sign, and the items line up. */
  rows?: string[];
  /** No card: the items stand as plain text, each id a key in the body's
      size and the muted ink. For a key under a sketch. */
  bare?: boolean;
  /** Each column's title and body stand in its middle, with no rule under
      them: a level that its signs stand under. */
  centred?: boolean;
}

const MARK = 10;
/* The page's metrics, and the tighter ones of a slide: the same type in
   less height. */
const METRICS = {
  page: { pad: 18, gap: 24, line: 19, eyebrow: 18, title: 22, sub: 18, body: 20, item: [14, 10, 8, 2], block: 10, rule: [18, 10], foot: 30, legend: [30, 28] },
  slide: { pad: 12, gap: 16, line: 17, eyebrow: 16, title: 20, sub: 16, body: 18, item: [8, 6, 4, 0], block: 6, rule: [12, 6], foot: 22, legend: [22, 24] },
};
/* The gap a chain's arrow needs: a shaft and its head. */
const CHAIN_GAP = 32;
const VALUE_LINE = 44;
const VALUE_SIZES = [SIZE.title, 32, 28, 24];

interface Block {
  height: number;
  draw: (x: number, y: number) => string[];
  /** After a rule among the controls: the column's foot. */
  foot?: boolean;
}

export const columns = (spec: ColumnsSpec, space: Room, ctx: Context): Drawn => {
  const n = spec.columns.length;
  const M = ctx.pick(METRICS.page, METRICS.slide);
  const { line: LINE } = M;
  const PAD = spec.bare ? 0 : M.pad;
  /* An id is a key in the text's own face where the columns stand bare. */
  const key = spec.bare ? ({ size: SIZE.body, face: 'sans', weight: 400 } as const) : ({ size: SIZE.label, face: 'mono', weight: 600 } as const);
  const [boxedPad, plainPad, boxedGap, plainGap] = M.item as [number, number, number, number];
  const gap = spec.chain ? CHAIN_GAP : M.gap;
  /* A column holds the longest word it sets, and each control that cannot
     wrap whole. Where the room cannot give every column that, the drawing
     grows wider, and the page shrinks it. */
  const leasts = spec.columns.map(
    (c) =>
      Math.max(
        narrowest(c.title ?? '', { size: SIZE.node, weight: 600 }) + 1,
        narrowest(c.body ?? '', { size: SIZE.body }) + 1,
        ...(c.items ?? []).map((i) => narrowest(i.text, { size: i.code ? SIZE.label : SIZE.body, face: i.code ? 'mono' : 'sans' }) + 1),
        /* The engine refuses a control half a unit past its room, as it does a text. */
        ...(c.widgets ?? []).map((wd) => (wd.w === 'frame' && wd.over ? leastWidth(wd, ctx) / Math.min(1, wd.width ?? 0.7) : leastWidth(wd, ctx) + ('marker' in wd && wd.marker && !wd.corner && !(naturalWidth(wd) && wd.w !== 'text') ? 18 : 0)) - 0.5),
      ) + 2 * PAD,
  );
  /* Row names take a column of their own at the left. */
  const named = spec.rows ?? [];
  const nameW = named.length ? Math.max(...named.map((r) => measure(r, SIZE.body))) + 16 : 0;
  /* The columns are peers, so they keep one width: an even share of the
     room, or the widest least where that is more. */
  const even = (space.width - nameW - (n - 1) * gap) / n;
  const ws = leasts.map(() => Math.max(even, ...leasts));
  const xs = ws.map((_, i) => ws.slice(0, i).reduce((a, b) => a + b + gap, 0));
  const across = ws.reduce((a, b) => a + b, 0) + (n - 1) * gap;
  /* Twice its room at most: what needs more is two drawings. */
  if (across > 2 * space.width) ctx.fail('the text asks for more than twice the room');
  /* A badge stands across the top edge, so the columns move down by half of it. */
  const lift = spec.columns.some((c) => c.badge) ? 10 : 0;
  const room = { ...space, x: space.x + nameW, y: space.y + lift, width: across };
  const laid = spec.columns.map((c, ci) => {
    const inner = (ws[ci] ?? 0) - 2 * PAD;
    const what = `${ctx.name}: column ${c.title ?? c.eyebrow ?? ci + 1}`;
    const blocks: Block[] = [];

    const eyebrow = c.eyebrow ? wrap(c.eyebrow.toUpperCase(), inner, { size: SIZE.label, face: 'mono', weight: 600, spacing: 0.8 }, what) : [];
    const aside = (c.id ? measure(c.id, SIZE.label, 'mono', 600) + 12 : 0) + (c.place ? PLACE.width + 8 : 0);
    const letterW = c.letter ? measure(c.letter, SIZE.lead, 'sans', 600) + 8 : 0;
    const title = c.title ? wrap(c.title, inner - aside - letterW, { size: SIZE.node, weight: 600 }, what) : [];
    /* A sub line stands beside the place's sign. Where it wraps there and fits
       on fewer lines across the column, it stands under the sign instead. */
    const subSetting = { size: SIZE.label, face: 'mono' } as const;
    const beside = c.sub ? wrap(c.sub, inner - (c.place ? PLACE.width + 8 : 0), subSetting, what) : [];
    const wide = c.sub && c.place && beside.length > 1 ? wrap(c.sub, inner, subSetting, what) : beside;
    const sub = wide.length < beside.length ? wide : beside;
    /* Only so far that its ink clears the sign: a line's ink starts 5 below its top. */
    const drop = sub === beside ? 0 : Math.max(0, PLACE.height - 3 - title.length * M.title);
    const body = c.body ? wrap(c.body, inner, { size: SIZE.body }, what) : [];
    /* A figure too wide for its column steps down, as far as a lead's size. */
    const valueSize = c.value ? (VALUE_SIZES.find((size) => measure(c.value ?? '', size, 'sans', 600) <= inner - aside) ?? SIZE.lead) : SIZE.title;
    const value = c.value ? fit(c.value, inner - aside, { size: valueSize, weight: 600 }, what) : '';
    /* The rule closes the head, so it stands only where something follows. */
    const follows = Boolean(c.items?.length || c.terminal?.length || c.note);
    const ruled = title.length + body.length > 0 && !c.widgets?.length && follows;
    const headH = Math.max(c.place ? PLACE.height + 8 : 0, eyebrow.length * M.eyebrow + (value ? VALUE_LINE : 0) + title.length * M.title + drop + sub.length * M.sub + (body.length ? 4 + body.length * M.body : 0));

    const items = c.items ?? [];
    const idW = Math.max(0, ...items.map((i) => (i.id ? measure(i.id, key.size, key.face, key.weight) + (spec.bare ? 20 : 10) : 0)));
    for (const item of items) {
      /* An item in an outline of any kind keeps its text off the line. */
      const boxed = Boolean(item.boxed || item.emphasis || item.strong || (item.state ?? 'present') !== 'present');
      const lead = (item.sign ? 30 : 0) + (item.mark ? MARK + 10 : 0) + (item.id ? idW : 0) + (boxed ? 10 : 0);
      const trail = item.marks?.length ? item.marks.length * (MARK + 4) + 10 : 0;
      const face = item.code ? 'mono' : 'sans';
      const size = item.code ? SIZE.label : SIZE.body;
      const lines = named.length ? [''] : wrap(item.text, inner - lead - trail - (boxed ? 10 : 0), { size, face }, `${what}, item ${item.id ?? item.text}`);
      const height = lines.length * LINE + (boxed ? boxedPad : plainPad);
      blocks.push({
        height: height + (boxed ? boxedGap : plainGap),
        draw: (x, y) => {
          const out: string[] = [];
          const state = item.state ?? 'present';
          const colour = item.emphasis ? ctx.emphasis('item', `item ${item.id ?? item.text}`) : state === 'degraded' ? WARN : MUTED;
          if (boxed) {
            out.push(
              rect(x, y, inner, height, {
                fill: item.emphasis && item.fill ? colour : item.boxed && state === 'present' ? RAISED : 'none',
                stroke: item.emphasis || state !== 'present' ? colour : item.strong ? INK : SUBTLE,
                width: item.emphasis || item.strong ? 2 : state === 'present' ? 1 : 1.5,
                radius: 4,
                dashed: state !== 'present',
              }),
            );
          }
          let tx = x + (boxed ? 10 : 0);
          const cy = y + height / 2;
          if (item.sign) {
            out.push(sign(item.sign, named.length ? x + inner / 2 : tx + 10, cy));
            tx += 30;
          }
          if (item.mark) {
            out.push(rect(tx, cy - MARK / 2, MARK, MARK, { fill: TONE[item.mark], radius: 2 }));
            tx += MARK + 10;
          }
          if (item.id) {
            out.push(text(tx, y + (boxed ? boxedPad : plainPad) / 2 + 14, item.id, { ...key, fill: item.emphasis && item.fill ? CANVAS : spec.bare ? MUTED : SECONDARY }));
            tx += idW;
          }
          lines.forEach((l, j) =>
            out.push(text(tx, y + (boxed ? boxedPad : plainPad) / 2 + 14 + j * LINE, l, { size, face, fill: item.emphasis && item.fill ? CANVAS : state === 'absent' ? MUTED : INK })),
          );
          (item.marks ?? []).forEach((m, j, all) => {
            const mx = x + inner - (boxed ? 10 : 0) - (all.length - j) * (MARK + 4) + 4;
            out.push(rect(mx, cy - MARK / 2, MARK, MARK, { fill: TONE[m], radius: 2 }));
          });
          return out;
        },
      });
    }

    if (c.terminal?.length) {
      const lines = c.terminal.map((l) => fit(l, inner - 24, { size: SIZE.label, face: 'mono' }, `${what}, the terminal`));
      const edge = ctx.pick(10, 6);
      const height = lines.length * LINE + 2 * edge;
      blocks.push({
        height: height + M.block + 2,
        draw: (x, y) => [
          rect(x, y, inner, height, { fill: INK, radius: 4 }),
          ...lines.map((l, j) => text(x + 12, y + edge + 14 + j * LINE, l, { size: SIZE.label, face: 'mono', fill: CANVAS })),
        ],
      });
    }

    /* From a frame over the controls after it, they stand in one stack. */
    const widgets = c.widgets ?? [];
    const overAt = widgets.findIndex((wd) => wd.w === 'frame' && wd.over);
    let afterRule = false;
    for (const wd of overAt < 0 ? widgets : widgets.slice(0, overAt)) {
      afterRule ||= wd.w === 'rule';
      const marked = 'marker' in wd && wd.marker && !wd.corner ? 18 : 0;
      const ww = naturalWidth(wd) && wd.w !== 'text' ? Math.min(naturalWidth(wd), inner) : inner - marked;
      const probe = widget(wd, 0, 0, ww, ctx, `${what}, a ${wd.w}`);
      blocks.push({ height: probe.height + M.block, draw: (x, y) => [widget(wd, x, y, ww, ctx, `${what}, a ${wd.w}`).svg], foot: afterRule });
    }
    if (overAt >= 0) {
      const rest = widgets.slice(overAt);
      const probe = stack(rest, 0, 0, inner, ctx, what, M.block);
      blocks.push({ height: probe.height + M.block, draw: (x, y) => [stack(rest, x, y, inner, ctx, what, M.block).svg] });
    }

    if (c.note) {
      const lines = wrap(c.note, inner, { size: SIZE.label }, `${what}, the note`);
      blocks.push({
        height: lines.length * M.sub + M.block - 2,
        draw: (x, y) => lines.map((l, j) => text(x, y + 13 + j * M.sub, l, { size: SIZE.label, fill: SECONDARY })),
      });
    }

    const foot = c.foot ? fit(c.foot, inner, { size: SIZE.label, face: 'mono' }, `${what}, the foot`) : '';
    const blocksH = blocks.reduce((sum, b) => sum + b.height, 0);
    const footBlocksH = blocks.reduce((sum, b) => sum + (b.foot ? b.height : 0), 0);
    return { c, eyebrow, value, valueSize, title, sub, drop, body, ruled, headH, blocks, blocksH, footBlocksH, foot };
  });

  const headH = Math.max(...laid.map((l) => l.headH));
  const ruled = laid.some((l) => l.ruled);
  /* A column with no head starts its items at the pad. */
  const top = PAD + (headH > 0 ? headH + (ruled ? M.rule[0] ?? 0 : M.rule[1] ?? 0) : 0);
  const footH = laid.some((l) => l.foot) ? M.foot : 0;
  /* What follows a rule among the controls stands at the foot of its
     column. Every foot starts on one line, so the first line of each shares
     one baseline. */
  const footed = !spec.rise && !named.length && laid.some((l) => l.footBlocksH > 0);
  const blocksH = footed
    ? Math.max(...laid.map((l) => l.blocksH - l.footBlocksH)) + Math.max(...laid.map((l) => l.footBlocksH))
    : Math.max(...laid.map((l) => l.blocksH));
  const h = top + blocksH + footH + PAD - 8;
  const footTop = Math.max(...laid.map((l) => l.blocksH - l.footBlocksH));
  const rise = spec.rise ? ctx.pick(20, 16) : 0;
  const out: string[] = [];
  laid.forEach((l, i) => {
    const x = room.x + (xs[i] ?? 0);
    const w = ws[i] ?? 0;
    /* On a staircase, each column starts a step higher than the one before, and all end on one line. */
    const y0 = room.y + rise * (n - 1 - i);
    const hh = h + rise * i;
    if (spec.chain && i > 0) out.push(connector([[x - gap + 4, y0 + h / 2], [x - 2, y0 + h / 2]]));
    const state = l.c.state ?? 'present';
    const stroke = l.c.emphasis ? ctx.emphasis('column', `column ${l.c.title ?? l.c.eyebrow ?? i + 1}`) : state === 'degraded' ? WARN : state === 'absent' ? MUTED : l.c.strong ? INK : SUBTLE;
    if (!spec.bare) out.push(
      rect(x, y0, w, hh, {
        fill: state === 'present' ? RAISED : 'none',
        stroke,
        width: l.c.emphasis || l.c.strong ? 2 : state === 'present' ? 1 : 1.5,
        radius: 6,
        dashed: state !== 'present',
      }),
    );
    let y = y0 + PAD;
    /* In a chain or a staircase the eyebrow names the step, so the step of the claim says it in its colour. */
    for (const t of l.eyebrow) {
      out.push(text(x + PAD, y + 13, t, { size: SIZE.label, face: 'mono', weight: 600, spacing: 0.8, fill: l.c.emphasis && (spec.chain || spec.rise) ? stroke : MUTED }));
      y += M.eyebrow;
    }
    if (l.value) {
      out.push(text(x + PAD, y + 36, l.value, { size: l.valueSize, weight: 600, spacing: -0.5 }));
      y += VALUE_LINE;
    }
    if (l.c.badge) {
      const label = fit(l.c.badge, w - 2 * PAD - 14, { size: SIZE.label, weight: 600 }, `${ctx.name}: the badge of column ${l.c.title ?? i + 1}`);
      out.push(badge(label, x + w - PAD + 8 - badgeW(label), y0 - 10));
    }
    if (l.c.id) out.push(text(x + w - PAD - (l.c.place ? PLACE.width + 8 : 0), y + 17, l.c.id, { size: SIZE.label, face: 'mono', weight: 600, fill: MUTED, anchor: 'end' }));
    if (l.c.place) out.push(placeSign(l.c.place, x + w - PAD - PLACE.width, y));
    const letterW = l.c.letter ? measure(l.c.letter, SIZE.lead, 'sans', 600) + 8 : 0;
    if (l.c.letter) out.push(text(x + PAD, y + 18, l.c.letter, { size: SIZE.lead, weight: 600, fill: ACCENT }));
    const [hx, anchor] = spec.centred ? [x + w / 2, 'middle' as const] : [x + PAD, 'start' as const];
    for (const t of l.title) {
      out.push(text(spec.centred ? hx : hx + letterW, y + 17, t, { size: SIZE.node, weight: 600, anchor }));
      y += M.title;
    }
    y += l.drop;
    for (const t of l.sub) {
      out.push(text(x + PAD, y + 14, t, { size: SIZE.label, face: 'mono', fill: SECONDARY }));
      y += M.sub;
    }
    if (l.body.length) y += 4;
    for (const t of l.body) {
      out.push(text(hx, y + 15, t, { size: SIZE.body, fill: SECONDARY, anchor }));
      y += M.body;
    }
    if (ruled && !spec.centred) out.push(line(x + PAD, y0 + PAD + headH + (M.rule[0] ?? 0) / 2 + 1, x + w - PAD, y0 + PAD + headH + (M.rule[0] ?? 0) / 2 + 1, SUBTLE));
    /* In a staircase or with row names, the blocks stand at the foot of the
       column, so the rows of every column line up. */
    y = spec.rise || named.length ? y0 + hh - PAD + 8 - footH - l.blocksH : y0 + top;
    for (const b of l.blocks) {
      if (footed && b.foot && !l.blocks[l.blocks.indexOf(b) - 1]?.foot) y = Math.max(y, y0 + top + footTop);
      out.push(...b.draw(x + PAD, y));
      y += b.height;
    }
    if (l.foot) out.push(text(x + PAD, y0 + hh - PAD - 2, l.foot, { size: SIZE.label, face: 'mono', fill: MUTED }));
  });
  /* A join runs from the edge of one control that faces the other to the
     edge of the other, after every column stands. */
  for (const j of spec.columns.flatMap((c) => c.joins ?? [])) {
    const [a, b] = [ctx.places.get(j.from), ctx.places.get(j.to)];
    if (!a || !b) ctx.fail(`a join names ${a ? j.to : j.from}, and no control has that id`);
    /* Side by side, the line runs across, level with the middle of the rows the two share. */
    const [top, foot] = [Math.max(a.y, b.y), Math.min(a.y + a.height, b.y + b.height)];
    if (!j.right && top < foot && (b.x >= a.x + a.width || a.x >= b.x + b.width)) {
      const yy = (top + foot) / 2;
      const [ax, bx] = b.x >= a.x + a.width ? [a.x + a.width, b.x] : [a.x, b.x + b.width];
      const stroke = j.dashed ? MUTED : INK;
      out.push(j.arrow ? connector([[ax, yy], [bx, yy]], stroke, 1.5, j.dashed) : line(ax, yy, bx, yy, stroke, 1.5, j.dashed));
      continue;
    }
    const down = b.y >= a.y + a.height / 2;
    /* Where the two overlap, the line runs straight down the middle of the overlap. */
    const [from, to] = [Math.max(a.x, b.x), Math.min(a.x + a.width, b.x + b.width)];
    const ax = j.right ? to - 14 : from < to ? (from + to) / 2 : a.x + a.width / 2;
    const bx = j.right || from < to ? ax : b.x + b.width / 2;
    const [ay, by] = down ? [a.y + a.height, b.y] : [a.y, b.y + b.height];
    const stroke = j.dashed ? MUTED : INK;
    out.push(j.arrow ? connector([[ax, ay], [bx, by]], stroke, 1.5, j.dashed) : line(ax, ay, bx, by, stroke, 1.5, j.dashed));
  }
  /* Each row name stands level with the items of the last column. */
  const last = laid.at(-1);
  if (named.length && last) {
    let ny = room.y + h + rise * (n - 1) - PAD + 8 - footH - last.blocksH;
    last.blocks.forEach((b, j) => {
      const name = named[j];
      if (name) out.push(text(space.x, ny + (b.height - plainGap) / 2 + 5, name, { size: SIZE.body, fill: SECONDARY }));
      ny += b.height;
    });
  }
  let bottom = room.y + h + rise * (n - 1);
  if (spec.legend?.length && ctx.legend) {
    bottom += M.legend[0] ?? 0;
    /* The key starts at the drawing's edge, under the names of the rows too. */
    let x = space.x;
    /* An entry that runs past the right edge starts a new line. */
    for (const entry of spec.legend) {
      const lead = entry.chip ? measure(entry.chip, SIZE.label, 'mono', 600) + 14 : entry.badge ? badgeW(entry.badge) : entry.pill ? badgeW(entry.pill) + 2 : entry.sign ? (PLACES.has(entry.sign) ? PLACE.width * 0.75 : 22) : 0;
      if (x > space.x && x + lead + 10 + measure(entry.label, SIZE.body) > room.x + room.width) {
        x = space.x;
        bottom += M.legend[1] ?? 0;
      }
      let lw = 0;
      if (entry.chip) {
        const cw = measure(entry.chip, SIZE.label, 'mono', 600) + 14;
        out.push(rect(x, bottom - 15, cw, 20, { fill: SUNKEN, stroke: STRONG, radius: 4 }) + text(x + 7, bottom, entry.chip, { size: SIZE.label, face: 'mono', weight: 600 }));
        lw = cw;
      } else if (entry.badge || entry.pill) {
        const label = entry.badge ?? entry.pill ?? '';
        out.push(entry.badge ? badge(label, x, bottom - 15) : rect(x, bottom - 15, badgeW(label) + 2, 20, { fill: RAISED, stroke: INK, width: 1.2, radius: 6 }) + text(x + badgeW(label) / 2 + 1, bottom, label, { size: SIZE.label, weight: 600, anchor: 'middle' }));
        lw = badgeW(label) + (entry.pill ? 2 : 0);
      } else if (entry.sign && PLACES.has(entry.sign)) {
        /* A place in the key is the sign at the head of a column, smaller. */
        out.push(`<g transform="translate(${x} ${bottom - 18}) scale(0.75)">${placeSign(entry.sign, 0, 0)}</g>`);
        lw = PLACE.width * 0.75;
      } else if (entry.sign) {
        out.push(sign(entry.sign, x + 11, bottom - 5));
        lw = 22;
      }
      out.push(text(x + lw + 10, bottom, entry.label, { size: SIZE.body, fill: SECONDARY }));
      x += lw + 10 + measure(entry.label, SIZE.body) + 32;
    }
    bottom += 6;
  }
  const took = room.width + nameW;
  return took > space.width + 0.5 ? { svg: out.join('\n'), height: bottom - space.y, width: Math.ceil(took) } : { svg: out.join('\n'), height: bottom - space.y };
};

const PLACES = new Set<Sign>(['page', 'panel', 'both', 'form', 'bar', 'nav', 'docheader', 'any']);
const badgeW = (s: string): number => measure(s, SIZE.label, 'sans', 600) + 14;
const badge = (s: string, x: number, y: number): string =>
  rect(x, y, badgeW(s), 20, { fill: INK, radius: 4 }) + text(x + badgeW(s) / 2, y + 14.5, s, { size: SIZE.label, weight: 600, fill: CANVAS, anchor: 'middle' });
