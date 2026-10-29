/* The controls of an interface, drawn as a sketch draws them.

   A sketch of a screen and a case in a column show the same things. That
   is a field with its text, a button, the tabs of a panel, a line of hint.
   One vocabulary keeps the two alike. Each control measures its text and says
   how much room it takes, and a numbered marker can point at any of them. */

import type { Context } from './context.ts';
import { CANVAS, ERROR, type Face, type Glyph, INK, INSET, MUTED, QUIET, RAISED, SECONDARY, SIZE, STRONG, SUBTLE, SUNKEN, TONE, type Tone, WARN, circle, connector, fmt, glyphChar, hatch, line, marker, pointer, rect, text } from './paint.ts';
import type { State } from './context.ts';
import { byParts, fit, measure, measureSet, narrowest, wrap } from './text.ts';

export type Widget = (
  /** `small` sets it at the label size: the caption under a sketch. */
  | { w: 'text'; text: string; code?: boolean; tone?: 'ink' | 'muted' | 'error'; strong?: boolean; large?: boolean; small?: boolean; marker?: string; chip?: string }
  | {
      w: 'field';
      text?: string;
      /** The text is an address, a path or an identifier: mono, at the size of a label. */
      code?: boolean;
      placeholder?: string;
      cursor?: boolean;
      tag?: string;
      lines?: number;
      focus?: boolean;
      /** The ring in the claim colour: the place the drawing is about, or one of its peers. */
      emphasis?: boolean;
      large?: boolean;
      slim?: boolean;
      strong?: boolean;
      /** A dashed outline with no fill: a place that is still empty. */
      state?: State;
      /** Hatched: there for the editors, hidden from the visitors. */
      hidden?: boolean;
      /** A second outline outside the first: the focus ring of the keyboard. */
      ring?: boolean;
      /** A quiet band with no outline: a part the interface dims. */
      dim?: boolean;
      /** No box: a dashed outline around the text alone, as a text changes in place. */
      inplace?: boolean;
      /** A short text at the right end of a slim field, in muted type. */
      right?: string;
      /** More paragraphs under the text, each on lines of its own. */
      more?: string[];
      /** A dot at the top right: a change that nobody saved or published yet. */
      dot?: boolean;
      /** No box and no line around it: the text in the page as the cursor edits it. */
      bare?: boolean;
      marker?: string;
      chip?: string;
    }
  /** `round` is a circle as high as a button, a sign in its middle. */
  /** `square` is a touch target: 44 on each side, its sign in the middle. */
  | { w: 'button'; text: string; strong?: boolean; ink?: boolean; small?: boolean; round?: boolean; square?: boolean; emphasis?: boolean; marker?: string; chip?: string }
  | { w: 'tabs'; items: string[]; active?: number; switch?: boolean; small?: boolean; marker?: string; chip?: string }
  /** An identifier. With a label, a boxed item of a grid: the id, then the label. */
  | { w: 'chip'; text: string; label?: string; emphasis?: boolean; fill?: boolean; strong?: boolean; marker?: string }
  /** A count out of a whole: `value` filled dots of `of`. A text puts a head over them. */
  | { w: 'dots'; value: number; of: number; text?: string; marker?: string }
  | { w: 'hint'; text: string; right?: string; emphasis?: boolean; marker?: string; chip?: string }
  | { w: 'label'; text: string; chip?: string; marker?: string }
  | { w: 'step'; text: string; chip?: string; marker?: string }
  /** One line of code, or several in a light block that keeps their indent. */
  | { w: 'code'; text?: string; lines?: string[]; strong?: boolean; marker?: string; chip?: string }
  /** A state at the right of a head: a short text in a round outline, or filled with `ink`. */
  | { w: 'pill'; text: string; ink?: boolean; marker?: string; chip?: string }
  /** The name of a type or an element, white on ink. */
  | { w: 'tag'; text: string; marker?: string; chip?: string }
  /** A connector down to the next control, with a text beside it. */
  | { w: 'arrow'; text?: string; marker?: string }
  /** How far a run of steps is: an ink share of a track. */
  | { w: 'progress'; value: number; marker?: string }
  /** `dot` marks the element's marker: where the rendered element stands in the page. */
  | { w: 'page'; text: string; dot?: boolean; marker?: string }
  | { w: 'lock'; text: string; strong?: boolean; marker?: string; chip?: string }
  /** A picture, the lines of a text beside it. A text names what the picture stands for. */
  | { w: 'image'; text?: string; lines?: number; marker?: string }
  /** A small picture over its name: a file, an entry of a library, a layout to choose. */
  | { w: 'thumb'; text?: string; show?: 'picture' | 'lines' | 'teaser' | 'page' | 'person'; split?: number[]; selected?: boolean; state?: State; marker?: string }
  /** A picture with a crop frame, its corner handles and a focus point. */
  | { w: 'crop'; marker?: string }
  /** A map with two routes and a pin with its name. */
  | { w: 'map'; text?: string; marker?: string }
  /** A switch with its label after it. */
  | { w: 'toggle'; text: string; on?: boolean; marker?: string }
  /** The line where a dragged element lands, with a name over its start. */
  | { w: 'drop'; text?: string; marker?: string }
  /** An entry of a library: the sign of its type in a tile, its name, and a line under it. */
  | { w: 'entry'; text: string; body?: string; sign?: Glyph; selected?: boolean; state?: State; marker?: string; chip?: string }
  /** A dimension: a line with a tick at each end and its size under it. */
  | { w: 'span'; text: string; marker?: string }
  /** The keys of a screen keyboard, three rows of seven. */
  | { w: 'keyboard'; marker?: string }
  /** An insertion point: a dashed line with a circled plus in its middle,
      filled where the pointer or the focus stands on it. */
  | { w: 'insert'; strong?: boolean; marker?: string; chip?: string }
  | { w: 'tree'; lines?: number; marker?: string }
  | { w: 'tools'; count?: number; marker?: string }
  | { w: 'lines'; lines?: number; marker?: string }
  | { w: 'devices'; text: string; active?: 'phone' | 'tablet' | 'desktop'; chip?: string; marker?: string }
  | {
      w: 'site';
      name: string;
      nav?: string;
      heading?: string;
      cards?: number;
      /** The share of the room the site takes: under 1, a narrow device on a ground. */
      width?: number;
      selected?: boolean;
      cursor?: boolean;
      marker?: string;
    }
  | { w: 'keycap'; text: string; marker?: string }
  /** Buttons with short labels in one bar. `|` divides them, and `active`
      counts the labels from 0. */
  | { w: 'toolbar'; items: string[]; active?: number[]; strong?: boolean; ink?: boolean; marker?: string; chip?: string }
  /** Controls side by side. A control with `push` and those after it stand at the right end.
      `bar` frames them with a hairline: the bar of a screen. */
  | { w: 'row'; items: Widget[]; bar?: boolean }
  /** A box that holds controls: a dialog, a popover, a panel or a message. */
  | {
      w: 'frame';
      title?: string;
      close?: boolean;
      tone?: 'ok' | 'warn' | 'error';
      strong?: boolean;
      state?: State;
      hidden?: boolean;
      /** The share of the room the frame takes, centred: a phone in a page. */
      width?: number;
      /** The height of the frames beside it in a row, set by the row. */
      least?: number;
      /** Filled in ink, its text in the ground colour: a tooltip. */
      ink?: boolean;
      /** It stands over the controls after it, at the right: a menu that opens over a page. */
      over?: boolean;
      /** No outline and no pad: controls stacked in a row of controls. */
      bare?: boolean;
      /** A grey plane: a part of the page, where a white frame is a control. */
      fill?: boolean;
      /** A handle at the top edge: a sheet that slides up from the foot of a phone. */
      sheet?: boolean;
      /** The outline of a phone, its controls inside. */
      device?: boolean;
      dot?: boolean;
      chip?: string;
      marker?: string;
      items: Widget[];
    }
  /** `steps` numbers the rows and joins their numbers with a line. */
  | {
      w: 'list';
      rows: ListRow[];
      handle?: boolean;
      steps?: boolean;
      /** The relative widths of the columns a row's ` | ` divides its label into. */
      columns?: number[];
      /** Each row in a box, a bar of its rendering under its label. */
      rendered?: boolean;
      marker?: string;
    }
  | { w: 'rule' }
) & {
  push?: boolean;
  weight?: number;
  /** A name a `join` line starts or ends at. */
  id?: string;
  /** The marker stands on the top right corner, not beside the control. */
  corner?: boolean;
  /** A pointer over the control, near its right end. */
  pointer?: boolean;
};

/** A row of a list: a label, how deep it stands, and what it says at its end. */
export interface ListRow {
  text: string;
  indent?: number;
  selected?: boolean;
  /** A sunken band with no outline: a group, or the open one of its peers. */
  boxed?: boolean;
  muted?: boolean;
  strong?: boolean;
  state?: 'absent' | 'degraded';
  emphasis?: boolean;
  /** A short text at the right end, in muted type. */
  right?: string;
  /** A small button at the right end: the action the row offers. */
  button?: string;
  mark?: Tone;
  chip?: string;
  /** The head of the columns: their names, in muted type. */
  head?: boolean;
  /** A numbered marker at the right end. */
  marker?: string;
  id?: string;
}

export interface Placed {
  svg: string;
  width: number;
  height: number;
}

const BAR = 6;

/* A text marks a run `~~struck~~`, `__underlined__`, `**bold**` or
   `**__both__**`. The engine measures and wraps the text without the marks.
   It sets a bold run apart, and draws a line through or under a struck or
   underlined run. */
interface Run {
  from: number;
  to: number;
  kind: 'strike' | 'under' | 'bold' | 'both';
}
const RUN = /\*\*__(.+?)__\*\*|~~(.+?)~~|__(.+?)__|\*\*(.+?)\*\*/g;
const KINDS = ['both', 'strike', 'under', 'bold'] as const;
export const plain = (s: string): string => s.replace(RUN, (...m: (string | undefined)[]) => m.slice(1, 5).find((x) => x !== undefined) ?? '');
const runsOf = (s: string): Run[] => {
  const out: Run[] = [];
  let shift = 0;
  for (const m of s.matchAll(RUN)) {
    const at = [1, 2, 3, 4].find((k) => m[k] !== undefined) ?? 4;
    const inner = m[at] ?? '';
    const from = (m.index ?? 0) - shift;
    out.push({ from, to: from + inner.length, kind: KINDS[at - 1] ?? 'bold' });
    shift += m[0].length - inner.length;
  }
  return out;
};
const isBold = (r: Run): boolean => r.kind === 'bold' || r.kind === 'both';

/* One line of a text with runs. `start` is where the line starts in the
   whole text. Each stretch of one weight is a text of its own, at the
   width the stretches before it take. */
const setLine = (l: string, start: number, runs: Run[], x: number, y: number, size: number, face: Face, weight: 400 | 600, fill: string): string => {
  const bold = (i: number): boolean => runs.some((r) => isBold(r) && start + i >= r.from && start + i < r.to);
  const at = [0];
  for (let i = 0; i < l.length; i++) at.push((at[i] ?? 0) + measureSet(l[i] ?? '', size, face, bold(i) ? 600 : weight));
  const out: string[] = [];
  let from = 0;
  for (let i = 1; i <= l.length; i++) {
    if (i < l.length && bold(i) === bold(from)) continue;
    /* A page drops the spaces at the ends of a text, so a stretch starts at its first letter. */
    const piece = l.slice(from, i);
    const lead = piece.length - piece.trimStart().length;
    if (piece.trim()) out.push(text(x + (at[from + lead] ?? 0), y, piece.trim(), { size, face, weight: bold(from) ? 600 : weight, fill }));
    from = i;
  }
  for (const r of runs) {
    const [a, b] = [Math.max(r.from - start, 0), Math.min(r.to - start, l.length)];
    if (r.kind === 'bold' || a >= b) continue;
    const yy = r.kind === 'strike' ? y - size * 0.32 : y + 3;
    out.push(line(x + (at[a] ?? 0), yy, x + (at[b] ?? 0), yy, fill, 1.2));
  }
  return out.join('');
};

/* The width the carried face sets a line with runs at: where a cursor goes. */
const setWidth = (l: string, start: number, runs: Run[], size: number, face: Face, weight: 400 | 600): number =>
  [...l].reduce((sum, c, i) => sum + measureSet(c, size, face, runs.some((r) => isBold(r) && start + i >= r.from && start + i < r.to) ? 600 : weight), 0);

/* The lines of a text with runs, each with where it starts in the whole. */
const placeLines = (whole: string, lines: string[]): [string, number][] => {
  let at = 0;
  return lines.map((l) => {
    const start = whole.indexOf(l, at);
    at = start + l.length;
    return [l, start];
  });
};

/* A run of text in a control: its width and its markup. */
const run = (s: string, x: number, y: number, size: number, face: 'sans' | 'mono', weight: 400 | 600, fill: string): string =>
  text(x, y, s, { size, face, weight, fill });

const chipW = (s: string): number => measure(s, SIZE.label, 'mono', 600) + 14;

const chipAt = (s: string, x: number, y: number): string =>
  rect(x, y, chipW(s), 20, { fill: SUNKEN, stroke: STRONG, radius: 4 }) + run(s, x + 7, y + 14.5, SIZE.label, 'mono', 600, INK);

/* Several identifiers in one place: `A1,A2`, 4 apart. */
const ids = (s: string): string[] => s.split(',').map((x) => x.trim()).filter(Boolean);
const chipsW = (s: string): number => ids(s).reduce((sum, id, i) => sum + chipW(id) + (i ? 4 : 0), 0);
const chipsAt = (s: string, x: number, y: number): string => {
  let cx = x;
  return ids(s)
    .map((id) => {
      const out = chipAt(id, cx, y);
      cx += chipW(id) + 4;
      return out;
    })
    .join('');
};

/* A boxed item: its id and its label on one line. */
const itemW = (id: string, label: string): number => measure(id, SIZE.label, 'mono', 600) + 8 + measure(label, SIZE.body, 'sans', 600) + 20;
const DOT = 18;
const dotsW = (of: number): number => (of - 1) * DOT + 10;

const pillW = (s: string): number => measure(s, SIZE.label, 'sans', 600) + 16;
const tagW = (s: string): number => measure(s, SIZE.label, 'sans', 600) + 14;
const keycapW = (s: string): number => Math.max(22, measure(s, SIZE.label, 'mono', 600) + 12);
const toolW = (s: string): number => (s === '|' ? 6 : measure(s, SIZE.label, 'sans', 600) + 10);
const toolbarW = (items: string[]): number => items.reduce((sum, t) => sum + toolW(t) + 2, 6);
const tabsW = (items: string[]): number => items.reduce((sum, t) => sum + measure(t, SIZE.body, 'sans', 600) + 16, 0);

/* The controls that set their chips themselves. Every other control gives
   the chips the right end of its width. */
const OWN_CHIPS = new Set(['label', 'step', 'devices', 'frame', 'chip', 'arrow', 'progress']);
const chipOf = (w: Widget): string | undefined => ('chip' in w && !OWN_CHIPS.has(w.w) ? w.chip : undefined);

/** The natural width of a control in a row, before the row stretches a
    field over the rest of its width. */
export const naturalWidth = (w: Widget): number => {
  const chip = chipOf(w);
  const own = ((): number => {
    switch (w.w) {
      case 'text':
        return measure(plain(w.text), w.large ? 20 : w.code || w.small ? SIZE.label : SIZE.body, w.code ? 'mono' : 'sans', w.strong || w.large || /\*\*/.test(w.text) ? 600 : 400);
      case 'span':
        return Math.max(44, measure(w.text, SIZE.label) + 8);
      case 'button':
        if (w.round) return w.small ? 22 : 28;
        if (w.square) return 44;
        return w.small ? measure(w.text, SIZE.label, 'sans', w.strong || w.ink ? 600 : 400) + 16 : measure(w.text, SIZE.body, 'sans', w.strong || w.ink ? 600 : 400) + 24;
      case 'tabs':
        return w.switch ? 0 : tabsW(w.items);
      case 'chip':
        return w.label ? itemW(w.text, w.label) : chipsW(w.text);
      case 'dots':
        return w.text ? 0 : dotsW(w.of);
      case 'pill':
        return pillW(w.text);
      case 'tag':
        return tagW(w.text);
      case 'tools':
        return (w.count ?? 3) * 22 + 10;
      case 'keycap':
        return keycapW(w.text);
      case 'toolbar':
        return toolbarW(w.items);
      case 'toggle':
        return measure(w.text, SIZE.label) + 36;
      default:
        return 0;
    }
  })();
  return own && chip ? own + chipsW(chip) + 8 : own;
};

/* The width a control takes in a row of controls: its text. A column
   gives it the whole width. 0 shares what the others leave. */
const rowWidth = (w: Widget): number => {
  switch (w.w) {
    case 'text':
      return naturalWidth(w) + (w.chip ? chipsW(w.chip) + 8 : 0);
    case 'hint':
      return measure(w.text, SIZE.label, 'sans', w.emphasis ? 600 : 400) + (w.right ? measure(w.right, SIZE.label) + 10 : 0) + (w.chip ? chipsW(w.chip) + 8 : 0);
    case 'label':
      return measure(w.text, SIZE.label) + (w.chip ? chipsW(w.chip) + 10 : 0);
    case 'step':
      return measure(`↓ ${w.text}`, SIZE.label) + 4 + (w.chip ? chipsW(w.chip) + 10 : 0);
    default:
      return naturalWidth(w);
  }
};

/* The parts of a text between its separators. Each part but the last keeps
   its separator, so a line breaks after one and never inside a part. */
const parts = (s: string): string[] => s.split(/(?<= ·) /);

/** The least width a control draws in without a refusal: its longest word
    where it wraps, its widest part where it cannot. A column grows to it. */
export const leastWidth = (w: Widget, ctx: Context): number => {
  const chip = chipOf(w);
  if (chip) return leastWidth({ ...w, chip: undefined } as Widget, ctx) + chipsW(chip) + 8;
  const k = <T,>(page: T, slide: T): T => ctx.pick(page, slide);
  const own = (c: string | undefined, gap: number): number => (c ? chipsW(c) + gap : 0);
  switch (w.w) {
    case 'text':
      return narrowest(plain(w.text), { size: w.large ? 20 : w.code || w.small ? SIZE.label : SIZE.body, face: w.code ? 'mono' : 'sans', weight: w.strong || w.large || /\*\*/.test(w.text) ? 600 : 400 });
    case 'field': {
      const source = [w.text ?? w.placeholder ?? '', ...(w.more ?? [])].join(' ');
      const shown = plain(source);
      const bold = source !== shown && /\*\*/.test(source);
      const tag = w.tag ? measure(w.tag, SIZE.label, 'sans', 600) + 34 : 0;
      const setting = w.large ? { size: 20, weight: 600 } : w.code ? { size: SIZE.label, face: 'mono' as const } : { size: SIZE.body, weight: bold || w.dim ? 600 : 400 };
      if (w.slim) return Math.max(...parts(shown).map((p) => measure(p, setting.size, setting.face, setting.weight))) + 24 + (w.cursor ? 4 : 0) + (tag ? tag + 6 : 0) + (w.right ? measure(w.right, SIZE.label) + 10 : 0);
      return narrowest(shown, setting) + 24 + (w.cursor ? 4 : 0);
    }
    case 'toggle':
      return naturalWidth(w);
    case 'entry':
      return 54 + Math.max(measure(w.text, SIZE.body, 'sans', 600), w.body ? narrowest(plain(w.body), { size: SIZE.label, weight: /\*\*/.test(w.body) ? 600 : 400 }) : 0);
    case 'drop':
      return w.text ? tagW(w.text) + 24 : 0;
    case 'thumb':
      return w.text ? measure(w.text, SIZE.label, 'sans', w.selected ? 600 : 400) : 0;
    case 'map':
      return w.text ? measure(w.text, SIZE.label) + 80 : 0;
    case 'tabs':
      return w.switch ? w.items.length * (Math.max(0, ...w.items.map((t) => measure(t, w.small ? SIZE.label : SIZE.body, 'sans', 600))) + (w.small ? 7.5 : 15.5)) + 0.5 : tabsW(w.items) - 16;
    case 'hint':
      return narrowest(w.text, { size: SIZE.label, weight: w.emphasis ? 600 : 400 }) + (w.right ? measure(w.right, SIZE.label) + 10 : 0);
    case 'label':
      return measure(w.text, SIZE.label) + own(w.chip, 10);
    case 'step':
      return measure(w.text, SIZE.label) + 16 + own(w.chip, 10);
    case 'code': {
      const lines = [...(w.text ? [w.text] : []), ...(w.lines ?? [])];
      const bare = (l: string): string => l.replace(/^(\s*)\*\*(.*)\*\*$/, '$1$2');
      return Math.max(0, ...lines.map((l) => measure(bare(l).trim(), SIZE.label, 'mono', bare(l) === l ? 400 : 600) + measure(l.slice(0, l.length - l.trimStart().length), SIZE.label, 'mono'))) + 24;
    }
    case 'page':
      return measure(w.text, SIZE.node, 'sans', 600) + 44;
    case 'lock':
      return measure(w.text, SIZE.label) + 48;
    case 'devices':
      return 116 + measure(w.text, SIZE.label, 'sans', 600) + own(w.chip, 10);
    case 'arrow':
      return w.text ? measure(w.text, SIZE.label) + (w.push ? 40 : 28) : 0;
    case 'dots':
      return Math.max(dotsW(w.of), w.text ? measure(w.text, SIZE.node, 'sans', 600) + measure(`${w.value} of ${w.of}`, SIZE.body) + 12 : 0);
    case 'frame': {
      if (w.width !== undefined && w.width < 1 && !w.over) return leastWidth({ ...w, width: undefined }, ctx) / Math.max(0.2, w.width);
      const pad = w.bare ? 0 : k(10, 8);
      const items = w.items.map((wd) => (wd.w === 'frame' && wd.over ? leastWidth(wd, ctx) / Math.min(1, wd.width ?? 0.7) : leastWidth(wd, ctx) + ('marker' in wd && wd.marker && !wd.corner && !naturalWidth(wd) ? 18 : 0)));
      const title = w.title ? narrowest(w.title, { size: SIZE.label, weight: 600 }) + (w.close ? 18 : 0) + own(w.chip, 8) : 0;
      return Math.max(title, ...items) + 2 * pad;
    }
    case 'list':
      return Math.max(
        0,
        ...w.rows.map((r) => {
          const lead = (w.steps ? 34 : 8) + (r.indent ?? 0) * INDENT + (w.handle ? 14 : 0);
          const trail = 6 + own(r.chip, 8) + (r.mark ? 18 : 0) + (r.marker ? 26 : 0) + (r.button ? rowButtonW(r.button) + 8 : 0);
          const setting = { size: r.head ? SIZE.label : SIZE.body, weight: (r.selected || r.strong) && !r.head ? 600 : 400 };
          /* A row in columns needs each cell whole in its column's share. */
          const shares = w.columns ?? [];
          const total = shares.reduce((a, b) => a + b, 0);
          const label = w.columns
            ? Math.max(0, ...r.text.split(/\s*\|\s*/).map((c, j) => ((measure(plain(c.trim()), setting.size, 'sans', runsOf(c).some(isBold) ? 600 : setting.weight) + 8) * total) / (shares[j] ?? 1)))
            : narrowest(plain(r.text), { ...setting, weight: runsOf(r.text).some(isBold) ? 600 : setting.weight });
          return lead + trail + (r.right ? Math.max(measure(r.right, SIZE.label) + 10 + label, measure(r.right, SIZE.label) + 24) : label);
        }),
      );
    case 'row': {
      /* The fixed controls keep their width. Each that shares the rest
         needs its least, and a tight row gives up the weights first. */
      const flexible = w.items.filter((wd) => wd.weight || wd.w === 'text' || !rowWidth(wd));
      const fixed = w.items.filter((wd) => !flexible.includes(wd)).reduce((sum, wd) => sum + rowWidth(wd), 0);
      const leasts = flexible.reduce((sum, wd) => sum + Math.max(24, leastWidth(wd, ctx)), 0);
      const marks = w.items.filter((wd) => 'marker' in wd && wd.marker).length * 28;
      return fixed + leasts + marks + (w.items.length - 1) * ROW_GAP + (w.bar ? 2 * BAR_PAD[0] : 0);
    }
    default:
      return naturalWidth(w);
  }
};

const ROW_GAP = 8;
/* The pad of a bar around its controls, across and down. */
const BAR_PAD = [4, 3] as const;
const BLOCKS = new Set(['list', 'frame', 'image', 'tree']);
const isBlock = (wd: Widget): boolean => BLOCKS.has(wd.w) || (wd.w === 'code' && Boolean(wd.lines?.length));

/* Controls side by side, each at its own width. A control with no width of
   its own shares what the others leave, and a pushed one stands at the
   right end. A line centres on the row, a block stands at its top. */
const row = (items: Widget[], x: number, y: number, width: number, ctx: Context, what: string): Placed => {
  const bare = items.map((wd) => ('marker' in wd && wd.marker ? ({ ...wd, marker: undefined } as Widget) : wd));
  const marks = items.map((wd) => ('marker' in wd && wd.marker ? 28 : 0));
  const sum = (ws: number[]): number => ws.reduce((total, ww, i) => total + ww + (marks[i] ?? 0), 0) + (items.length - 1) * ROW_GAP;
  /* A text keeps its line where the row holds it. Where not, the longest
     text wraps first, then the next, until the row holds them. */
  const widths = bare.map((wd) => (wd.weight ? 0 : rowWidth(wd)));
  const texts = bare.map((wd, i) => i).filter((i) => bare[i]?.w === 'text').sort((a, b) => (widths[b] ?? 0) - (widths[a] ?? 0));
  for (const i of texts) {
    const flexible = widths.filter((ww) => ww === 0).length;
    if (sum(widths) + 24 * flexible <= width) break;
    widths[i] = 0;
  }
  const used = sum(widths);
  /* A control with no width of its own takes its weight's share of what
     the others leave, 1 where it states none. */
  const weights = bare.map((wd, i) => (widths[i] === 0 ? (wd.weight ?? 1) : 0));
  const flexible = weights.filter(Boolean).length;
  /* Where a weight's share is less than a control's least, the control
     takes its least, and the others share the rest by weight. */
  const leasts = bare.map((wd, i) => (weights[i] ? Math.max(24, leastWidth(wd, ctx)) : 0));
  const held = new Set<number>();
  let share = 0;
  for (;;) {
    const open = weights.map((k, i) => (k && !held.has(i) ? i : -1)).filter((i) => i >= 0);
    const total = open.reduce((a, i) => a + (weights[i] ?? 0), 0);
    share = total ? (width - used - [...held].reduce((a, i) => a + (leasts[i] ?? 0), 0)) / total : 0;
    const short = open.filter((i) => share * (weights[i] ?? 0) < (leasts[i] ?? 0) - 0.5);
    if (!short.length || short.length === open.length) break;
    for (const i of short) held.add(i);
  }
  const sized = widths.map((ww, i) => ww || (held.has(i) ? (leasts[i] ?? 0) : share * (weights[i] ?? 1)));
  const least = Math.min(Infinity, ...sized.filter((ww, i) => weights[i]));
  if (flexible && least < 23.5) ctx.fail(`${what}: the controls of a row need ${Math.ceil(used + 24 * flexible)} of width, and the row has ${Math.floor(width)}`);
  if (used > width + 0.5) ctx.fail(`${what}: the controls of a row are ${Math.ceil(used)} wide, and the row is ${Math.floor(width)}`);
  const free = flexible ? 0 : width - used;
  const heights = bare.map((wd, i) => widget(wd, 0, 0, sized[i] ?? 0, ctx, what).height);
  const height = Math.max(0, ...heights);
  /* Frames side by side are as high as the highest of them. */
  if (bare.filter((wd) => wd.w === 'frame').length > 1) {
    bare.forEach((wd, i) => {
      if (wd.w === 'frame') bare[i] = { ...wd, least: height };
    });
  }
  const out: string[] = [];
  const beside = bare.some(isBlock);
  let cx = x;
  let pushed = false;
  bare.forEach((wd, i) => {
    if (wd.push && !pushed) {
      cx += free;
      pushed = true;
    }
    const ww = sized[i] ?? 0;
    const h = heights[i] ?? 0;
    /* A block stands at the top. So does a text beside a block: it reads
       from where the block starts. */
    const block = isBlock(wd) || (wd.w === 'text' && beside);
    out.push(widget(wd, cx, block ? y : y + (height - h) / 2, ww, ctx, what).svg);
    cx += ww;
    const m = items[i];
    if (m && 'marker' in m && m.marker) {
      out.push(marker(cx + 14, y + height / 2, m.marker));
      cx += 28;
    }
    cx += ROW_GAP;
  });
  return { svg: out.join(''), width, height };
};

/** Controls one under the other, `gap` apart, as a column and a frame set
    them. A frame `over` the controls after it takes no height of its own.
    It stands at the right, at its share of the width, over them. */
export const stack = (items: Widget[], x: number, y: number, width: number, ctx: Context, what: string, gap = 10): Placed => {
  const out: string[] = [];
  const over: string[] = [];
  let cy = y;
  let bottom = y;
  for (const wd of items) {
    if (wd.w === 'frame' && wd.over) {
      const fw = width * Math.min(1, wd.width ?? 0.7);
      const placed = widget({ ...wd, width: undefined }, x + width - fw, cy, fw, ctx, `${what}, a frame`);
      over.push(placed.svg);
      bottom = Math.max(bottom, cy + placed.height);
      continue;
    }
    const marked = 'marker' in wd && wd.marker && !wd.corner ? 18 : 0;
    const ww = naturalWidth(wd) && wd.w !== 'text' ? Math.min(naturalWidth(wd), width) : width - marked;
    const placed = widget(wd, x, cy, ww, ctx, `${what}, a ${wd.w}`);
    out.push(placed.svg);
    bottom = Math.max(bottom, cy + placed.height);
    cy += placed.height + gap;
  }
  return { svg: [...out, ...over].join(''), width, height: items.length ? bottom - y : 0 };
};

/* The box of a field: sunken, or a dashed outline with no fill where its
   place is still empty. A hatch marks a part that visitors do not see. */
const box = (x: number, y: number, w: number, h: number, state: State | undefined, hidden: boolean | undefined, ring: string | boolean | undefined): string => {
  const empty = state && state !== 'present';
  return (
    rect(x, y, w, h, {
      fill: empty ? 'none' : SUNKEN,
      stroke: typeof ring === 'string' ? ring : ring ? INK : state === 'degraded' ? WARN : empty ? MUTED : STRONG,
      width: ring ? 2 : empty ? 1.5 : 1,
      radius: 4,
      dashed: Boolean(empty),
    }) + (hidden ? hatch(x + 1, y + 1, w - 2, h - 2) : '')
  );
};

const LIST_ROW = 24;
const rowButtonW = (s: string): number => measure(s, SIZE.label, 'sans', 600) + 14;
const STEP_ROW = 30;
const STEP_GAP = 10;
const INDENT = 16;

/** A control at its place, `width` wide. Throws, naming the control, on a
    text that does not fit. A control with an id keeps its box for a join. */
export const widget = (w: Widget, x: number, y: number, width: number, ctx: Context, what: string): Placed => {
  const placed = draw(w, x, y, width, ctx, what);
  if (w.id) ctx.places.set(w.id, { x, y, width: w.w === 'button' || w.w === 'tag' || w.w === 'pill' ? placed.width : width, height: placed.height });
  if (!w.pointer) return placed;
  return { ...placed, svg: placed.svg + pointer(x + Math.min(width, placed.width) - 30, y + placed.height / 2 - 2) };
};

const draw = (w: Widget, x: number, y: number, width: number, ctx: Context, what: string): Placed => {
  const chip = chipOf(w);
  if (chip) {
    const cw = chipsW(chip);
    const base = draw({ ...w, chip: undefined } as Widget, x, y, width - cw - 8, ctx, what);
    const top = y + Math.max(0, (Math.min(base.height, 28) - 20) / 2);
    return { svg: base.svg + chipsAt(chip, x + width - cw, top), width, height: Math.max(base.height, 20) };
  }
  const out: string[] = [];
  let height = 0;
  /* On a slide a control is a few units lower, its type the same. */
  const k = <T,>(page: T, slide: T): T => ctx.pick(page, slide);
  const mark = (h: number): void => {
    if ('marker' in w && w.marker) out.push(w.corner ? marker(x + width - 4, y + 4, w.marker) : marker(x + width, y + h / 2, w.marker));
  };
  switch (w.w) {
    case 'text': {
      /* A large text is a heading of the page a sketch shows. */
      const size = w.large ? 20 : w.code || w.small ? SIZE.label : SIZE.body;
      const face = w.code ? 'mono' : 'sans';
      const weight = w.strong || w.large ? 600 : 400;
      const whole = plain(w.text);
      const runs = runsOf(w.text);
      const bold = runs.some(isBold);
      const lines = wrap(whole, width, { size, face, weight: bold ? 600 : weight }, what);
      const fill = w.tone === 'error' ? ERROR : w.tone === 'muted' ? MUTED : w.strong || w.large ? INK : SECONDARY;
      const lead = w.large ? k(26, 24) : w.small ? k(18, 16) : k(19, 17);
      placeLines(whole, lines).forEach(([l, start], i) => out.push(setLine(l, start, runs, x, y + (w.large ? 20 : 14) + i * lead, size, face, weight, fill)));
      height = lines.length * lead + k(2, 1);
      break;
    }
    case 'label':
    case 'hint': {
      const right = w.w === 'label' ? w.chip : w.right;
      const rightW = right ? (w.w === 'label' ? chipsW(right) : measure(right, SIZE.label)) + 10 : 0;
      const o = k(0, -2);
      /* A hint with the emphasis names the claim of its place, in the claim's colour. */
      const claim = w.w === 'hint' && w.emphasis ? ctx.emphasis('place', `hint ${w.text}`) : undefined;
      /* A hint wraps where its column is narrow, and its right stays on its first line. */
      const setting = { size: SIZE.label, weight: claim ? 600 : 400 } as const;
      const lines = w.w === 'hint' ? wrap(w.text, width - rightW, setting, what) : [fit(w.text, width - rightW, setting, what)];
      const lead = k(18, 16);
      lines.forEach((l, i) => out.push(run(l, x, y + 15 + o + i * lead, SIZE.label, 'sans', setting.weight, claim ?? (w.w === 'hint' ? MUTED : SECONDARY))));
      if (right && w.w === 'label') out.push(chipsAt(right, x + width - chipsW(right), y + 1 + o));
      if (right && w.w === 'hint') out.push(text(x + width, y + 15 + o, right, { size: SIZE.label, fill: MUTED, anchor: 'end' }));
      height = 22 + 2 * o + (lines.length - 1) * lead;
      break;
    }
    case 'step': {
      const chip = w.chip ? chipsW(w.chip) + 10 : 0;
      const o = k(0, -2);
      out.push(run(`↓ ${fit(w.text, width - chip - 16, { size: SIZE.label }, what)}`, x + 4, y + 15 + o, SIZE.label, 'sans', 400, SECONDARY));
      if (w.chip) out.push(chipsAt(w.chip, x + width - chipsW(w.chip), y + 1 + o));
      height = 22 + 2 * o;
      break;
    }
    case 'field': {
      const ring = w.emphasis ? ctx.emphasis('place', `field ${w.text ?? w.placeholder ?? ''}`) : w.focus || w.strong || w.ring;
      /* A dimmed field is a quiet band. A field in place has no box: a
         dashed line stands around its text. A ring stands outside the box. */
      const frame = (h: number, tw: number): string =>
        w.bare
          ? ''
          : w.dim
          ? rect(x, y, width, h, { fill: SUBTLE, radius: 4 })
          : w.inplace
            ? rect(x, y, Math.min(width, tw + 24), h, { stroke: INK, width: 1.2, radius: 2, dashed: true })
            : box(x, y, width, h, w.state, w.hidden, ring) + (w.ring ? rect(x - 3, y - 3, width + 6, h + 6, { stroke: INK, width: 1.5, radius: 6 }) : '');
      const ink = w.text && !w.state && !w.dim ? INK : MUTED;
      /* A slim field is one line, as high as a button. Where the line has no
         room, it breaks at its separators and only there, each line a part. */
      if (w.slim) {
        const shown = plain(w.text ?? w.placeholder ?? '');
        const tag = w.tag ? measure(w.tag, SIZE.label, 'sans', 600) + 34 : 0;
        const right = w.right ? measure(w.right, SIZE.label) + 10 : 0;
        const [fs, ff] = w.code ? [SIZE.label, 'mono' as const] : [SIZE.body, 'sans' as const];
        const room = width - 24 - (w.cursor ? 4 : 0) - (tag ? tag + 6 : 0) - right;
        const setting = { size: fs, face: ff, weight: (w.dim ? 600 : 400) as 400 | 600 };
        const fits = (t: string, max: number): boolean => measure(t, fs, ff, setting.weight) <= max + 0.5;
        const split = fits(shown, room) ? [shown] : (byParts(shown, room, fits) ?? [shown]);
        const one = split.length > 1 ? '' : fit(shown, room, setting, what);
        for (const l of split) if (split.length > 1) fit(l, room, setting, what);
        const o = k(0, -2);
        const more = (split.length - 1) * k(20, 18);
        out.push(frame(28 + 2 * o + more, Math.max(...split.map((l) => measure(l, fs, ff))) + (w.cursor ? 4 : 0)));
        if (split.length > 1) split.forEach((l, i) => out.push(text(x + 12, y + 19 + o + i * k(20, 18), l, { ...setting, fill: ink })));
        if (w.tag) {
          out.push(rect(x + width - tag - 5, y + 5 + o, tag, 18, { fill: INK, radius: 4 }));
          out.push(run(`${w.tag} ⠿ ⋯`, x + width - tag + 3, y + 18 + o, SIZE.label, 'sans', 600, CANVAS));
        }
        if (one) out.push(setLine(one, 0, runsOf(w.text ?? ''), x + 12, y + 19 + o, fs, ff, w.dim ? 600 : 400, ink));
        if (w.right) out.push(text(x + width - 12 - tag, y + 19 + o, w.right, { size: SIZE.label, fill: MUTED, anchor: 'end' }));
        if (w.cursor) {
          const cx = x + 12 + (one ? setWidth(one, 0, runsOf(w.text ?? ''), fs, ff, w.dim ? 600 : 400) + 3 : 0);
          out.push(line(cx, y + 7 + o, cx, y + 21 + o, INK, 1.5));
        }
        if (w.dot) out.push(circle(x + width - 10 - tag, y + 14 + o, 3.5, INK));
        height = 28 + 2 * o + more;
        break;
      }
      const size = w.large ? 20 : w.code ? SIZE.label : SIZE.body;
      const face = w.code ? 'mono' : 'sans';
      const weight = w.large ? 600 : 400;
      const source = [w.text ?? w.placeholder ?? '', ...(w.more ?? [])].join('\n');
      const shown = plain(source);
      const runs = runsOf(source);
      const tag = w.tag ? measure(w.tag, SIZE.label, 'sans', 600) + 34 : 0;
      const lines = shown ? wrap(shown, width - 24 - (w.cursor ? 4 : 0), { size, face, weight: runs.some(isBold) ? 600 : weight }, what) : [];
      const [pad, lead, bar] = k([12, 8, 12], [7, 5, 10]);
      const tagged = k(26, 24);
      const top = w.tag ? tagged : pad;
      height = top + lines.length * (size + lead) + (w.lines ?? 0) * bar + pad;
      out.push(frame(height, Math.max(0, ...lines.map((l) => measure(l, size, face, weight))) + (w.cursor ? 4 : 0)));
      if (w.tag) {
        out.push(rect(x + width - tag - 6, y + tagged - 20, tag, 18, { fill: INK, radius: 4 }));
        out.push(run(`${w.tag} ⠿ ⋯`, x + width - tag + 2, y + tagged - 7, SIZE.label, 'sans', 600, CANVAS));
      }
      let ty = y + top;
      placeLines(shown, lines).forEach(([l, start], i) => {
        out.push(setLine(l, start, runs, x + 12, ty + size, size, face, weight, ink));
        if (w.cursor && i === lines.length - 1) {
          const cx = x + 12 + setWidth(l, start, runs, size, face, weight) + 3;
          out.push(line(cx, ty + 4, cx, ty + size + 4, INK, 1.5));
        }
        ty += size + lead;
      });
      if (!lines.length && w.cursor) out.push(line(x + 12, y + pad - 2, x + 12, y + height - pad + 2, INK, 1.5));
      if (w.dot) out.push(circle(x + width - 10, w.tag ? y + height - 10 : y + 10, 3.5, INK));
      for (let i = 0; i < (w.lines ?? 0); i++) out.push(rect(x + 12, ty + 4 + i * bar, (width - 24) * (i % 2 ? 0.45 : 0.68), BAR, { fill: STRONG, radius: 2 }));
      break;
    }
    case 'button': {
      const bw = Math.min(width, naturalWidth(w));
      const weight = w.strong || w.ink ? 600 : 400;
      /* A small button is the size of a label: the buttons of a bar. */
      const [bh, size, inset] = w.small ? [k(22, 20), SIZE.label, 8] : [k(28, 24), SIZE.body, 12];
      const claim = w.emphasis ? ctx.emphasis('place', `button ${w.text}`) : undefined;
      if (w.square) {
        out.push(rect(x, y, 44, 44, { fill: w.ink ? INK : RAISED, stroke: claim ?? INK, width: 2, radius: 4 }));
        /* A sign alone fills the target as a finger sees it: larger than a word. */
        const big = [...w.text].length <= 2 ? 20 : size;
        out.push(text(x + 22, y + 22 + big / 2 - 2, fit(w.text, 40, { size: big, weight: 600 }, what), { size: big, weight: 600, fill: w.ink ? CANVAS : (claim ?? INK), anchor: 'middle' }));
        if (w.marker) out.push(marker(x + 58, y + 22, w.marker));
        return { svg: out.join(''), width: 44 + (w.marker ? 28 : 0), height: 44 };
      }
      if (w.round) {
        out.push(circle(x + bh / 2, y + bh / 2, bh / 2 - 1, w.ink ? INK : RAISED, claim ?? INK));
        out.push(text(x + bh / 2, y + bh / 2 + size / 2 - 2, fit(w.text, bh, { size, weight }, what), { size, weight, fill: w.ink ? CANVAS : (claim ?? INK), anchor: 'middle' }));
        if (w.marker) out.push(marker(x + bh + 14, y + bh / 2, w.marker));
        return { svg: out.join(''), width: bh + (w.marker ? 28 : 0), height: bh };
      }
      out.push(rect(x, y, bw, bh, { fill: w.ink ? INK : RAISED, stroke: claim ?? (w.strong || w.ink ? INK : STRONG), width: w.strong || claim ? 2 : 1, radius: 4 }));
      out.push(run(fit(w.text, bw - 2 * inset, { size, weight }, what), x + inset, y + bh / 2 + size / 2 - 2 + (w.small ? 0.5 : 0), size, 'sans', weight, w.ink ? CANVAS : (claim ?? INK)));
      height = bh;
      if (w.marker) out.push(marker(x + bw + 14, y + bh / 2, w.marker));
      return { svg: out.join(''), width: bw + (w.marker ? 28 : 0), height };
    }
    case 'tabs': {
      if (w.switch) {
        const sw = width / w.items.length;
        const sh = k(28, 24);
        out.push(rect(x, y, width, sh, { fill: RAISED, stroke: STRONG, radius: 4 }));
        w.items.forEach((t, i) => {
          const on = i === (w.active ?? 0);
          if (on) out.push(rect(x + i * sw + 2, y + 2, sw - 4, sh - 4, { fill: SUNKEN, stroke: INK, width: 1.5, radius: 3 }));
          /* A small switch sets its labels at the size of a label, as a bar of short buttons does. */
          const size = w.small ? SIZE.label : SIZE.body;
          const shown = fit(t, sw - (w.small ? 8 : 16), { size, weight: 600 }, `${what}, a switch`);
          out.push(text(x + i * sw + sw / 2, y + sh / 2 + (w.small ? 4.5 : 5), shown, { size, weight: on ? 600 : 400, fill: on ? INK : SECONDARY, anchor: 'middle' }));
        });
        height = sh;
        break;
      }
      const need = tabsW(w.items) - 16;
      if (need > width + 0.5) ctx.fail(`${what}: the tabs "${w.items.join(', ')}" are ${Math.ceil(need)} wide, and their room is ${Math.floor(width)}`);
      let tx = x;
      w.items.forEach((t, i) => {
        const tw = measure(t, SIZE.body, 'sans', 600);
        const active = i === (w.active ?? 0);
        out.push(run(t, tx, y + k(17, 15), SIZE.body, 'sans', active ? 600 : 400, active ? INK : MUTED));
        if (active) out.push(line(tx, y + k(25, 21), tx + tw, y + k(25, 21), INK, 2));
        tx += tw + 16;
      });
      height = k(28, 24);
      if (w.marker) out.push(marker(tx + 4, y + 12, w.marker));
      return { svg: out.join(''), width: tx - x + (w.marker ? 24 : 0), height };
    }
    case 'chip':
      if (w.label) {
        const need = itemW(w.text, w.label);
        if (need > width + 0.5) ctx.fail(`${what}: the item ${w.text} is ${Math.ceil(need)} wide, and its room is ${Math.floor(width)}`);
        const stroke = w.emphasis ? ctx.emphasis('place', `item ${w.text}`) : w.strong ? INK : STRONG;
        const filled = w.emphasis && w.fill;
        const ch = k(28, 24);
        const o = (ch - 28) / 2;
        out.push(rect(x, y, width, ch, { fill: filled ? stroke : RAISED, stroke, width: w.emphasis || w.strong ? 2 : 1, radius: 4 }));
        out.push(run(w.text, x + 10, y + 18.5 + o, SIZE.label, 'mono', 600, filled ? CANVAS : SECONDARY));
        out.push(run(w.label, x + 18 + measure(w.text, SIZE.label, 'mono', 600), y + 19 + o, SIZE.body, 'sans', 600, filled ? CANVAS : INK));
        if (w.marker) out.push(marker(x + width + 14, y + ch / 2, w.marker));
        return { svg: out.join(''), width: width + (w.marker ? 28 : 0), height: ch };
      }
      out.push(chipsAt(w.text, x, y));
      if (w.marker) out.push(marker(x + chipsW(w.text) + 14, y + 10, w.marker));
      return { svg: out.join(''), width: chipsW(w.text) + (w.marker ? 28 : 0), height: 20 };
    case 'dots': {
      if (w.value > w.of) ctx.fail(`${what}: ${w.value} of ${w.of} dots is more than the whole`);
      if (dotsW(w.of) > width + 0.5) ctx.fail(`${what}: ${w.of} dots are ${dotsW(w.of)} wide, and their room is ${Math.floor(width)}`);
      let top = y;
      if (w.text) {
        const count = `${w.value} of ${w.of}`;
        const cw = measure(count, SIZE.body);
        out.push(run(fit(w.text, width - cw - 12, { size: SIZE.node, weight: 600 }, what), x, y + 16, SIZE.node, 'sans', 600, INK));
        out.push(text(x + width, y + 16, count, { size: SIZE.body, fill: SECONDARY, anchor: 'end' }));
        top += k(28, 22);
      }
      /* Under a head, the dots spread over the width the head spans. */
      const step = w.text && w.of > 1 ? Math.min(26, Math.max(DOT, (width - 10) / (w.of - 1))) : DOT;
      for (let i = 0; i < w.of; i++) {
        const cx = x + 5 + i * step;
        out.push(i < w.value ? circle(cx, top + 7, 5, INK) : circle(cx, top + 7, 4.5, 'none', MUTED));
      }
      height = top + 14 - y + (w.text ? k(10, 4) : 0);
      mark(height);
      break;
    }
    case 'code': {
      if (w.lines?.length) {
        /* A block keeps every run of spaces in a line, the indent too. A
           page collapses them in a text, so each word run stands at its
           own measured place. */
        const [lead, edge] = k([19, 8], [17, 5]);
        height = (w.text ? w.lines.length + 1 : w.lines.length) * lead + 2 * edge;
        out.push(rect(x, y, width, height, { fill: SUNKEN, stroke: w.strong ? INK : SUBTLE, width: w.strong ? 2 : 1, radius: 4 }));
        [...(w.text ? [w.text] : []), ...w.lines].forEach((marked, i) => {
          /* A line in `**…**` is bold: the part of the block the case is about. */
          const bold = /^\s*\*\*.*\*\*$/.test(marked);
          const l = bold ? marked.replace(/\*\*(.*)\*\*$/, '$1') : marked;
          fit(l.trim(), width - 24 - measure(l.slice(0, l.length - l.trimStart().length), SIZE.label, 'mono'), { size: SIZE.label, face: 'mono', weight: bold ? 600 : 400 }, what);
          for (const m of l.matchAll(/\S+(?: \S+)*/g)) {
            out.push(run(m[0], x + 12 + measure(l.slice(0, m.index), SIZE.label, 'mono'), y + edge + 14 + i * lead, SIZE.label, 'mono', bold ? 600 : 400, INK));
          }
        });
        break;
      }
      height = k(30, 24);
      out.push(rect(x, y, width, height, { fill: RAISED, stroke: w.strong ? INK : STRONG, width: w.strong ? 2 : 1, radius: 4 }));
      out.push(run(fit(w.text ?? '', width - 24, { size: SIZE.label, face: 'mono' }, what), x + 12, y + height / 2 + 5, SIZE.label, 'mono', 400, INK));
      break;
    }
    case 'page': {
      const [top, th] = k([18, 30], [10, 26]);
      height = k(80, 60);
      out.push(rect(x, y, width, height, { fill: SUNKEN, radius: 4 }));
      const tw = measure(w.text, SIZE.node, 'sans', 600) + 20;
      if (tw > width - 24) ctx.fail(`${what}: "${w.text}" is wider than its page`);
      out.push(rect(x + 12, y + top, tw, th, { fill: RAISED, radius: 2 }));
      out.push(run(w.text, x + 22, y + top + th / 2 + 6, SIZE.node, 'sans', 600, INK));
      out.push(line(x, y + height - 26, x + width, y + height - 32, STRONG, 1.5));
      if (w.dot) out.push(circle(x + width - 16, y + 14, 6, RAISED));
      break;
    }
    case 'lock': {
      height = k(44, 34);
      const o = (height - 44) / 2;
      out.push(rect(x, y, width, height, { fill: SUNKEN, stroke: w.strong ? INK : SUBTLE, width: w.strong ? 2 : 1, radius: 4 }));
      out.push(rect(x + 14, y + 20 + o, 12, 10, { fill: INK, radius: 2 }));
      out.push(`<path d="M${fmt(x + 16)} ${fmt(y + 20 + o)} v-3 a4 4 0 0 1 8 0 v3" fill="none" stroke="${INK}" stroke-width="1.5"></path>`);
      out.push(run(fit(w.text, width - 48, { size: SIZE.label }, what), x + 36, y + 27 + o, SIZE.label, 'sans', 400, SECONDARY));
      break;
    }
    case 'image': {
      height = k(72, 52);
      /* With no lines beside it, the picture takes the whole width. */
      const iw = w.lines === 0 ? width : Math.min(width * 0.45, 150);
      out.push(rect(x, y, iw, height, { fill: SUNKEN, radius: 2 }));
      if (w.text) out.push(text(x + iw / 2, y + height / 2 + 4.5, fit(w.text, iw - 12, { size: SIZE.label }, what), { size: SIZE.label, fill: MUTED, anchor: 'middle' }));
      for (let i = 0; i < (w.lines ?? 2); i++) out.push(rect(x + iw + 12, y + k(10, 8) + i * k(12, 10), (width - iw - 12) * (i % 2 ? 0.7 : 1), BAR, { fill: STRONG, radius: 2 }));
      /* A pin on a picture stands on the picture's corner. */
      if (w.corner && w.marker) return { svg: out.join('') + marker(x + iw - 4, y + 4, w.marker), width, height };
      break;
    }
    case 'tree': {
      const n = w.lines ?? 5;
      const pitch = k(20, 16);
      for (let i = 0; i < n; i++) {
        const indent = i % 3 === 0 ? 0 : 14;
        out.push(rect(x + indent, y + i * pitch + pitch / 2 - 6, 8, 8, { fill: MUTED, radius: 2 }));
        out.push(rect(x + indent + 14, y + i * pitch + pitch / 2 - 5, Math.max(20, width * 0.55 - indent), BAR, { fill: STRONG, radius: 2 }));
      }
      height = n * pitch;
      break;
    }
    case 'tools': {
      const n = w.count ?? 3;
      const tw = n * 22 + 10;
      out.push(rect(x, y, tw, 24, { fill: RAISED, stroke: INK, radius: 4 }));
      for (let i = 0; i < n; i++) out.push(rect(x + 8 + i * 22, y + 7, 14, 10, { fill: MUTED, radius: 2 }));
      if (w.marker) out.push(marker(x + tw + 14, y + 12, w.marker));
      return { svg: out.join(''), width: tw + (w.marker ? 28 : 0), height: 24 };
    }
    case 'lines': {
      const n = w.lines ?? 2;
      const pitch = k(12, 10);
      for (let i = 0; i < n; i++) out.push(rect(x, y + 4 + i * pitch, width * (i % 2 ? 0.6 : 0.85), BAR, { fill: STRONG, radius: 2 }));
      height = n * pitch + 2;
      break;
    }
    case 'devices': {
      height = k(32, 28);
      const o = (height - 32) / 2;
      out.push(rect(x, y, width, height, { fill: RAISED, stroke: STRONG, radius: 4 }));
      const kinds = ['phone', 'tablet', 'desktop'] as const;
      let dx = x + 12;
      for (const k of kinds) {
        const [gw, gh] = k === 'phone' ? [8, 14] : k === 'tablet' ? [12, 16] : [22, 14];
        const on = k === (w.active ?? 'desktop');
        if (on) out.push(rect(dx - 5, y + 4 + o, gw + 10, 24, { stroke: INK, width: 1.5, radius: 4 }));
        out.push(rect(dx, y + 16 + o - gh / 2, gw, gh, { stroke: INK, width: 1.2, radius: 2 }));
        dx += gw + 18;
      }
      const chip = w.chip ? chipsW(w.chip) + 10 : 0;
      out.push(run(fit(w.text, x + width - dx - chip - 8, { size: SIZE.label, weight: 600 }, what), dx + 2, y + 21 + o, SIZE.label, 'sans', 600, INK));
      if (w.chip) out.push(chipsAt(w.chip, x + width - chipsW(w.chip) - 8, y + 6 + o));
      break;
    }
    case 'site': {
      const share = Math.min(1, w.width ?? 1);
      const sw = width * share;
      const sx = x + (width - sw) / 2;
      const narrow = share < 1;
      const cards = w.cards ?? 3;
      const top = narrow ? 8 : 0;
      const inner = sw - 24;
      const heading = w.heading ? fit(w.heading, inner - (w.selected ? 16 : 0), { size: SIZE.node, weight: 600 }, what) : '';
      const grid = narrow ? 1 : cards;
      const cardH = narrow ? 26 : 30;
      const rows = narrow ? Math.min(cards, 2) : 1;
      const body = 28 + 12 + 52 + (heading ? 40 : 0) + rows * (cardH + 8) + (narrow ? 0 : 22) + 8;
      height = body + 2 * top;
      if (narrow) out.push(rect(x, y, width, height, { fill: SUNKEN, radius: 4 }));
      out.push(rect(sx, y + top, sw, body, { fill: RAISED, stroke: INK, width: 1.5, radius: narrow ? 6 : 4 }));
      out.push(rect(sx + 1, y + top + 1, sw - 2, 24, { fill: SUNKEN }));
      out.push(run(fit(w.name, narrow ? inner - 20 : inner * 0.55, { size: SIZE.label, weight: 600 }, what), sx + 10, y + top + 17, SIZE.label, 'sans', 600, SECONDARY));
      const nav = narrow ? '☰' : (w.nav ?? '');
      if (nav) out.push(text(sx + sw - 10, y + top + 17, fit(nav, inner * 0.45, { size: SIZE.label }, what), { size: SIZE.label, fill: MUTED, anchor: 'end' }));
      let cy = y + top + 36;
      out.push(rect(sx + 12, cy, inner, 46, { fill: SUNKEN, radius: 2 }));
      cy += 56;
      if (heading) {
        /* The outline of the selection hugs the heading, as an element's outline does. */
        if (w.selected) out.push(rect(sx + 8, cy, Math.min(inner + 8, measure(heading, SIZE.node, 'sans', 600) + 24), 30, { stroke: INK, width: 1.5, radius: 2 }));
        out.push(run(heading, sx + (w.selected ? 16 : 12), cy + 21, SIZE.node, 'sans', 600, INK));
        if (w.cursor) {
          const cx = sx + (w.selected ? 16 : 12) + measureSet(heading, SIZE.node, 'sans', 600) - 8;
          out.push(line(cx, cy + 6, cx, cy + 25, INK, 1.5));
        }
        cy += 40;
      }
      const cw = (inner - (grid - 1) * 8) / grid;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < grid; c++) {
          out.push(rect(sx + 12 + c * (cw + 8), cy, cw, cardH, { fill: SUNKEN, radius: 2 }));
          if (!narrow) out.push(rect(sx + 12 + c * (cw + 8), cy + cardH + 8, cw, 4, { fill: SUBTLE, radius: 2 }) + rect(sx + 12 + c * (cw + 8), cy + cardH + 16, cw * 0.6, 4, { fill: SUBTLE, radius: 2 }));
        }
        cy += cardH + 8;
      }
      break;
    }
    case 'pill':
    case 'tag': {
      const pw = w.w === 'pill' ? pillW(w.text) : tagW(w.text);
      if (pw > width + 0.5) ctx.fail(`${what}: the ${w.w} "${w.text}" is ${Math.ceil(pw)} wide, and its room is ${Math.floor(width)}`);
      const filled = w.w === 'tag' || w.ink;
      out.push(rect(x, y, pw, 20, { fill: filled ? INK : RAISED, stroke: filled ? undefined : INK, width: 1.2, radius: w.w === 'pill' ? 6 : 4 }));
      out.push(text(x + pw / 2, y + 14.5, w.text, { size: SIZE.label, weight: 600, fill: filled ? CANVAS : INK, anchor: 'middle' }));
      if (w.marker) out.push(marker(x + pw + 14, y + 10, w.marker));
      return { svg: out.join(''), width: pw + (w.marker ? 28 : 0), height: 20 };
    }
    case 'arrow': {
      const say = w.text ? fit(w.text, width - (w.push ? 40 : 28), { size: SIZE.label }, what) : '';
      /* An arrow with no text stands in the middle: the step from the control over it to the one under it. */
      const ax = w.push ? x + width - 12 : say ? x + 12 : x + width / 2;
      height = k(28, 22);
      out.push(connector([[ax, y + 2], [ax, y + height - 2]]));
      if (say) out.push(text(w.push ? ax - 14 : ax + 14, y + height / 2 + 5, say, { size: SIZE.label, fill: MUTED, anchor: w.push ? 'end' : 'start' }));
      break;
    }
    case 'progress': {
      const share = Math.max(0, Math.min(1, w.value));
      out.push(rect(x, y + 2, width, 4, { fill: SUBTLE, radius: 2 }));
      out.push(rect(x, y + 2, width * share, 4, { fill: INK, radius: 2 }));
      height = 8;
      break;
    }
    case 'keycap': {
      const kw = keycapW(w.text);
      out.push(rect(x, y, kw, 22, { fill: RAISED, stroke: INK, width: 1.2, radius: 3 }));
      out.push(text(x + kw / 2, y + 15.5, w.text, { size: SIZE.label, face: 'mono', weight: 600, anchor: 'middle' }));
      height = 22;
      if (w.marker) out.push(marker(x + kw + 14, y + 11, w.marker));
      return { svg: out.join(''), width: kw + (w.marker ? 28 : 0), height };
    }
    case 'toolbar': {
      const tw = toolbarW(w.items);
      if (tw > width + 0.5) ctx.fail(`${what}: the toolbar "${w.items.join(' ')}" is ${Math.ceil(tw)} wide, and its room is ${Math.floor(width)}`);
      /* An ink bar is the menu of a selected element. Its labels are white
         on ink, and the label that is on sits on the ground colour. */
      const bh = k(28, 24);
      const o = (bh - 28) / 2;
      out.push(rect(x, y, tw, bh, { fill: w.ink ? INK : RAISED, stroke: w.strong || w.ink ? INK : STRONG, width: w.strong ? 2 : 1, radius: 4 }));
      let tx = x + 4;
      let n = 0;
      for (const t of w.items) {
        if (t === '|') {
          out.push(line(tx + 3, y + 7 + o, tx + 3, y + 21 + o, w.ink ? MUTED : STRONG));
        } else {
          const on = (w.active ?? []).includes(n++);
          if (on) out.push(rect(tx, y + 3 + o / 2, toolW(t), bh - 6 - o, w.ink ? { fill: CANVAS, radius: 3 } : { fill: SUNKEN, stroke: INK, width: 1.2, radius: 3 }));
          out.push(text(tx + 5, y + 18.5 + o, t, { size: SIZE.label, weight: on || w.ink ? 600 : 400, fill: w.ink && !on ? CANVAS : INK }));
        }
        tx += toolW(t) + 2;
      }
      height = bh;
      if (w.marker) out.push(marker(x + tw + 14, y + bh / 2, w.marker));
      return { svg: out.join(''), width: tw + (w.marker ? 28 : 0), height };
    }
    case 'row': {
      if (!w.bar) return row(w.items, x, y, width, ctx, what);
      /* An id at the end stands outside the bar: it names the case, not a control. */
      const [px, py] = BAR_PAD;
      const last = w.items.at(-1);
      const id = last?.w === 'chip' && last.push && w.items.length > 1 ? last : undefined;
      const idW = id ? chipsW(id.text) + px : 0;
      const inner = row(id ? w.items.slice(0, -1) : w.items, x + px, y + py, width - 2 * px - idW, ctx, what);
      const h = inner.height + 2 * py;
      const tagH = id ? widget(id, 0, 0, idW - px, ctx, what).height : 0;
      const placed = id ? widget(id, x + width - idW + px, y + (h - tagH) / 2, idW - px, ctx, what).svg : '';
      return { svg: rect(x, y, width - idW, h, { fill: RAISED, stroke: STRONG, radius: 4 }) + inner.svg + placed, width, height: h };
    }
    case 'frame': {
      if (w.width !== undefined && w.width < 1 && !w.over) {
        const fw = width * Math.max(0.2, w.width);
        const inner = draw({ ...w, width: undefined }, x + (width - fw) / 2, y, fw, ctx, what);
        return { svg: inner.svg, width, height: inner.height };
      }
      if (w.bare) {
        const body = stack(w.items, x, y, width, ctx, `${what}, a stack`, k(8, 5));
        return { svg: body.svg, width, height: body.height };
      }
      const pad = w.device ? k(12, 10) : k(10, 8);
      /* A sheet carries its handle, a phone the slot of its speaker, over what it holds. */
      const grip = w.sheet || w.device ? k(10, 8) : 0;
      const [edge, lead] = k([12 + grip, 18], [8 + grip, 17]);
      const tone = w.tone ? TONE[w.tone] : undefined;
      const close = w.close ? 18 : 0;
      const chips = w.chip ? chipsW(w.chip) + 8 : 0;
      const title = w.title ? wrap(w.title, width - 2 * pad - close - chips, { size: SIZE.label, weight: 600 }, `${what}, the frame's title`) : [];
      const head = w.title || w.close || w.chip ? edge + Math.max(1, title.length) * lead : 0;
      const top = head ? head + k(6, 4) : pad + grip;
      const body = stack(w.items, x + pad, y + top, width - 2 * pad, ctx, `${what}, the frame ${w.title ?? ''}`.trim(), k(8, 5));
      height = Math.max(w.least ?? 0, w.items.length ? top + body.height + pad : head);
      const state = w.state && w.state !== 'present' ? w.state : undefined;
      out.push(
        rect(x, y, width, height, {
          fill: w.ink ? INK : state ? 'none' : w.tone ? QUIET[w.tone] : w.fill ? INSET : RAISED,
          stroke: w.ink || w.device ? INK : (tone ?? (w.strong ? INK : state === 'degraded' ? WARN : state ? MUTED : STRONG)),
          width: w.strong || w.device ? 2 : tone || state ? 1.5 : 1,
          radius: w.device ? 6 : 4,
          dashed: Boolean(state),
        }),
      );
      if (w.hidden) out.push(hatch(x + 1, y + 1, width - 2, height - 2));
      if (grip) out.push(rect(x + width / 2 - (w.device ? 12 : 16), y + grip / 2, w.device ? 24 : 32, 4, { fill: w.device ? STRONG : MUTED, radius: 2 }));
      if (w.dot) out.push(circle(x + width - pad, y + (head ? edge + 3 : pad), 3.5, INK));
      /* A rule under the head of a dialog only: a frame on a page names itself. */
      if (head && (w.strong || w.close || w.chip) && !w.tone && !w.ink && w.items.length) out.push(line(x + 1, y + head, x + width - 1, y + head, SUBTLE));
      title.forEach((l, i) => out.push(text(x + pad, y + edge + 8 + i * lead, l, { size: SIZE.label, weight: 600, fill: w.ink ? CANVAS : INK })));
      if (w.chip) out.push(chipsAt(w.chip, x + width - pad - close - chips + 8, y + edge - 7));
      if (w.close) out.push(text(x + width - pad, y + edge + 8, '✕', { size: SIZE.label, fill: MUTED, anchor: 'end' }));
      /* On ink, every text the frame holds stands in the ground colour. */
      out.push(w.ink ? [INK, SECONDARY, MUTED].reduce((svg, c) => svg.split(`fill="${c}"`).join(`fill="${CANVAS}"`), body.svg) : body.svg);
      break;
    }
    case 'list': {
      const listRow = k(LIST_ROW, 20);
      const rowH = w.steps ? k(STEP_ROW, 26) : listRow;
      const gap = w.steps ? k(STEP_GAP, 9) : w.rendered ? k(6, 4) : k(2, 1);
      const lead = k(17, 16);
      /* A rendered row carries a bar of its rendering under its label. */
      const extra = w.rendered ? k(12, 10) : 0;
      /* Where a label has no room on one line, it wraps, and its row grows
         by a line. Its marks stay on the first line. A row in columns keeps
         each cell on one line. */
      const laid = w.rows.map((r) => {
        const lx = (w.steps ? 34 : 8) + (r.indent ?? 0) * INDENT + (w.handle ? 14 : 0);
        let rx = width - 6 - (r.chip ? chipsW(r.chip) + 8 : 0) - (r.mark ? 18 : 0) - (r.marker ? 26 : 0) - (r.button ? rowButtonW(r.button) + 8 : 0);
        const right = r.right ? fit(r.right, rx - lx - 24, { size: SIZE.label }, `${what}, the row ${r.text}`) : '';
        if (right) rx -= measure(right, SIZE.label) + 10;
        const weight: 400 | 600 = (r.selected || r.strong) && !r.head ? 600 : 400;
        const size = r.head ? SIZE.label : SIZE.body;
        const lines = w.columns ? [r.text] : wrap(plain(r.text), rx - lx, { size, weight: runsOf(r.text).some(isBold) ? 600 : weight }, `${what}, the row ${r.text}`);
        return { lx, rx, right, weight, size, lines, h: rowH + extra + (lines.length - 1) * lead };
      });
      const joins: string[] = [];
      let ry = y;
      w.rows.forEach((r, i) => {
        const { lines, h, right, weight, size, rx: textEnd } = laid[i] ?? { lines: [], h: rowH, right: '', weight: 400 as const, size: SIZE.body, rx: width };
        const mid = ry + rowH / 2;
        const state = r.state;
        if (r.id) ctx.places.set(r.id, { x, y: ry, width, height: h });
        if (w.steps) {
          /* A step: a box, its number on an ink disc, and a line down to the next. */
          const ring = r.selected || r.strong;
          out.push(rect(x, ry, width, h, { fill: RAISED, stroke: r.emphasis ? ctx.emphasis('place', `step ${r.text}`) : ring ? INK : STRONG, width: ring || r.emphasis ? 2 : 1, radius: 4, dashed: Boolean(state) }));
          if (i < w.rows.length - 1) joins.push(line(x + 18, mid + 9, x + 18, ry + h + gap + rowH / 2 - 9, INK, 1.5));
          out.push(circle(x + 18, mid, 9, INK) + text(x + 18, mid + 4.5, String(i + 1), { size: SIZE.label, weight: 600, fill: CANVAS, anchor: 'middle' }));
        } else if (r.boxed && !r.selected && !state && !r.emphasis) out.push(rect(x, ry, width, h, { fill: SUNKEN, radius: 4 }));
        else if (r.emphasis || r.selected || state || w.rendered) {
          out.push(
            rect(x, ry, width, h, {
              fill: r.selected && !state ? INSET : w.rendered && !state ? RAISED : 'none',
              stroke: r.emphasis ? ctx.emphasis('place', `row ${r.text}`) : state === 'degraded' ? WARN : state ? MUTED : r.selected ? INK : SUBTLE,
              width: r.emphasis || r.selected ? 2 : state ? 1.5 : 1,
              radius: 4,
              dashed: Boolean(state),
            }),
          );
        }
        let lx = x + (w.steps ? 34 : 8) + (r.indent ?? 0) * INDENT;
        if (w.handle) {
          out.push(text(lx, mid + 5, '⠿', { size: SIZE.label, fill: MUTED }));
          lx += 14;
        }
        /* The bar of the rendering stands under the label's last line. */
        if (w.rendered) out.push(rect(lx, mid + rowH / 2 + 1 + (lines.length - 1) * lead, (x + textEnd - lx) * 0.8, 4, { fill: state ? SUBTLE : STRONG, radius: 2 }));
        let rx = x + width - 6;
        if (r.marker) {
          out.push(marker(rx - 11, mid, r.marker));
          rx -= 30;
        }
        if (r.chip) {
          rx -= chipsW(r.chip);
          out.push(chipsAt(r.chip, rx, ry + (rowH - 20) / 2));
          rx -= 8;
        }
        if (r.mark) {
          out.push(rect(rx - 10, mid - 5, 10, 10, { fill: TONE[r.mark], radius: 2 }));
          rx -= 18;
        }
        if (r.button) {
          const bw = rowButtonW(r.button);
          out.push(rect(rx - bw, mid - 9, bw, 18, { fill: RAISED, stroke: INK, width: 1.5, radius: 4 }) + text(rx - bw / 2, mid + 4.5, r.button, { size: SIZE.label, weight: 600, anchor: 'middle' }));
          rx -= bw + 8;
        }
        if (right) out.push(text(rx, mid + 5, right, { size: SIZE.label, fill: MUTED, anchor: 'end' }));
        const fill = r.head || r.muted || state ? MUTED : INK;
        if (w.columns) {
          /* The cells of a row stand at the starts of the columns. */
          const cells = r.text.split(/\s*\|\s*/);
          const shares = w.columns;
          const total = shares.reduce((a, b) => a + b, 0);
          const room = x + textEnd - lx;
          if (cells.length !== shares.length) ctx.fail(`${what}: the row "${r.text}" has ${cells.length} cells, and the list has ${shares.length} columns`);
          let cx = lx;
          cells.forEach((c, j) => {
            const cw = (room * (shares[j] ?? 1)) / total;
            const shown = fit(plain(c.trim()), cw - 8, { size, weight: runsOf(c).some(isBold) ? 600 : weight }, `${what}, the row ${r.text}`);
            if (shown) out.push(setLine(shown, 0, runsOf(c.trim()), cx, mid + 5, size, 'sans', weight, fill));
            cx += cw;
          });
        } else {
          const runs = runsOf(r.text);
          placeLines(plain(r.text), lines).forEach(([l, start], j) => out.push(setLine(l, start, runs, lx, mid + 5 + j * lead, size, 'sans', weight, fill)));
        }
        ry += h + gap;
      });
      out.push(...joins);
      height = ry - gap - y;
      break;
    }
    case 'thumb': {
      /* A small picture over its name. A split draws its columns, the
         other kinds a picture, lines of text, a teaser or a page. */
      const ph = k(40, 34);
      const label = w.text ? fit(w.text, width, { size: SIZE.label, weight: w.selected ? 600 : 400 }, what) : '';
      const empty = w.state && w.state !== 'present';
      /* A person is a round picture with no frame: an avatar. */
      if (w.show !== 'person') out.push(rect(x, y, width, ph, { fill: empty ? 'none' : w.split || w.show === 'page' || w.show === 'lines' ? RAISED : SUNKEN, stroke: w.selected ? INK : empty ? MUTED : STRONG, width: w.selected ? 2 : empty ? 1.5 : 1, radius: 4, dashed: Boolean(empty) }));
      const [ix, iy, iw, ih] = [x + 6, y + 6, width - 12, ph - 12];
      if (w.split) {
        const total = w.split.reduce((a, b) => a + b, 0);
        let sx = ix;
        for (const part of w.split) {
          const sw = ((iw - (w.split.length - 1) * 3) * part) / total;
          out.push(rect(sx, iy, sw, ih, { fill: SUNKEN, stroke: INK, width: 1.2, radius: 2 }));
          sx += sw + 3;
        }
      } else if (!empty) {
        const show = w.show ?? 'picture';
        if (show === 'person') {
          out.push(circle(x + width / 2, y + ph / 2, ph / 2 - 2, SUBTLE));
        } else if (show === 'picture' || show === 'teaser') {
          const pw = show === 'teaser' ? iw * 0.4 : iw;
          const [px, py] = show === 'teaser' ? [ix, iy] : [x, y];
          const [qw, qh] = show === 'teaser' ? [pw, ih] : [width, ph];
          if (show === 'teaser') out.push(rect(px, py, qw, qh, { fill: SUNKEN, radius: 2 }));
          out.push(`<path d="M${fmt(px + 6)} ${fmt(py + qh - 6)} L${fmt(px + qw * 0.35)} ${fmt(py + qh * 0.45)} L${fmt(px + qw * 0.55)} ${fmt(py + qh * 0.7)} L${fmt(px + qw * 0.72)} ${fmt(py + qh * 0.5)} L${fmt(px + qw - 6)} ${fmt(py + qh - 6)}" fill="none" stroke="${MUTED}" stroke-width="1.2"></path>`);
          if (show === 'picture') out.push(circle(px + qw - 14, py + 11, 4, RAISED, STRONG));
          if (show === 'teaser') {
            out.push(rect(ix + pw + 6, iy + 2, (iw - pw - 6) * 0.8, 5, { fill: INK, radius: 1 }));
            out.push(rect(ix + pw + 6, iy + 11, (iw - pw - 6) * 0.6, 4, { fill: STRONG, radius: 1 }));
            out.push(rect(ix + pw + 6, iy + ih - 7, (iw - pw - 6) * 0.4, 7, { fill: INK, radius: 1 }));
          }
        } else {
          [0.85, 0.6, 0.75].slice(0, show === 'page' ? 2 : 3).forEach((share, i) => out.push(rect(ix, iy + i * 7, iw * share, 4, { fill: STRONG, radius: 1 })));
          if (show === 'page') out.push(rect(ix + iw * 0.2, iy + ih - 9, iw * 0.6, 9, { stroke: INK, width: 1.2, radius: 2 }));
        }
      }
      const centred = w.split || w.show === 'person';
      if (label) out.push(text(centred ? x + width / 2 : x, y + ph + 15, label, { size: SIZE.label, weight: w.selected ? 600 : 400, fill: empty ? MUTED : INK, anchor: centred ? 'middle' : 'start' }));
      height = ph + (label ? 20 : 0);
      break;
    }
    case 'crop': {
      /* The frame of a crop variant over its picture: corner handles, and
         the focus point that a crop keeps in view. */
      height = k(96, 80);
      out.push(rect(x, y, width, height, { fill: SUNKEN, radius: 4 }));
      const [fx, fy, fw, fh] = [x + width * 0.08, y + 10, width * 0.7, height - 20];
      out.push(rect(fx, fy, fw, fh, { fill: RAISED, stroke: INK, width: 1.5 }));
      for (const [hx, hy] of [[fx, fy], [fx + fw, fy], [fx, fy + fh], [fx + fw, fy + fh]] as const) out.push(rect(hx - 3.5, hy - 3.5, 7, 7, { fill: RAISED, stroke: INK, width: 1.2 }));
      out.push(circle(fx + fw * 0.8, fy + fh * 0.3, 8, RAISED, INK));
      break;
    }
    case 'map': {
      /* A map: two routes over the ground, a pin and its name. */
      height = k(80, 64);
      out.push(rect(x, y, width, height, { fill: SUNKEN, radius: 4 }));
      out.push(`<path d="M${fmt(x + 10)} ${fmt(y + height - 12)} L${fmt(x + width * 0.4)} ${fmt(y + 12)}" fill="none" stroke="${STRONG}" stroke-width="1.5"></path>`);
      out.push(`<path d="M${fmt(x + width * 0.2)} ${fmt(y + height - 6)} L${fmt(x + width - 10)} ${fmt(y + height * 0.55)}" fill="none" stroke="${STRONG}" stroke-width="1.5"></path>`);
      const [px, py] = [x + width * 0.5, y + height * 0.4];
      out.push(circle(px, py, 6, INK));
      if (w.text) out.push(text(px + 12, py + 4.5, fit(w.text, x + width - px - 18, { size: SIZE.label }, what), { size: SIZE.label, fill: SECONDARY }));
      break;
    }
    case 'toggle': {
      /* A switch: a track with its knob at the end it stands at. */
      const o = k(0, -1);
      out.push(rect(x, y + 3 + o, 28, 14, { fill: w.on ? INK : RAISED, stroke: w.on ? INK : STRONG, radius: 6 }));
      out.push(circle(w.on ? x + 21 : x + 7, y + 10 + o, 4.5, w.on ? CANVAS : STRONG));
      out.push(text(x + 36, y + 14.5 + o, fit(w.text, width - 36, { size: SIZE.label }, what), { size: SIZE.label, fill: INK }));
      height = 20 + 2 * o;
      break;
    }
    case 'drop': {
      /* The line where a dragged element lands: ink, a dot at each end,
         and the name of the element over its start. */
      height = w.text ? 22 : k(14, 10);
      const ly = y + height / 2;
      out.push(line(x + 4, ly, x + width - 4, ly, INK, 2) + circle(x + 4, ly, 3.5, INK) + circle(x + width - 4, ly, 3.5, INK));
      if (w.text) {
        const tw = tagW(w.text);
        out.push(rect(x + 12, y + 1, tw, 20, { fill: INK, radius: 4 }) + text(x + 12 + tw / 2, y + 15.5, fit(w.text, width - 24, { size: SIZE.label, weight: 600 }, what), { size: SIZE.label, weight: 600, fill: CANVAS, anchor: 'middle' }));
      }
      break;
    }
    case 'entry': {
      const empty = w.state && w.state !== 'present';
      const tile = k(30, 26);
      const tx = x + 8 + tile + 10;
      const body = w.body ? wrap(plain(w.body), x + width - 8 - tx, { size: SIZE.label, weight: /\*\*/.test(w.body) ? 600 : 400 }, what) : [];
      const lead = k(16, 15);
      height = Math.max(tile + 12, k(26, 23) + body.length * lead + k(8, 6));
      out.push(rect(x, y, width, height, { fill: w.selected ? SUNKEN : empty ? 'none' : RAISED, stroke: w.selected ? INK : empty ? MUTED : STRONG, width: w.selected ? 2 : empty ? 1.5 : 1, radius: 4, dashed: Boolean(empty) }));
      out.push(rect(x + 8, y + 6, tile, tile, { fill: SUNKEN, stroke: STRONG, radius: 3 }));
      if (w.sign) out.push(text(x + 8 + tile / 2, y + 6 + tile / 2 + 5.5, glyphChar(w.sign) ?? '', { size: 16, fill: empty ? MUTED : INK, anchor: 'middle' }));
      out.push(run(fit(w.text, x + width - 8 - tx, { size: SIZE.body, weight: 600 }, what), tx, y + k(19, 17), SIZE.body, 'sans', 600, empty ? MUTED : INK));
      const runs = runsOf(w.body ?? '');
      placeLines(plain(w.body ?? ''), body).forEach(([l, start], i) => out.push(setLine(l, start, runs, tx, y + k(19, 17) + (i + 1) * lead, SIZE.label, 'sans', 400, empty ? MUTED : SECONDARY)));
      break;
    }
    case 'span': {
      const say = fit(w.text, width, { size: SIZE.label }, what);
      out.push(line(x, y + 6, x + width, y + 6, MUTED, 1.2) + line(x, y + 1, x, y + 11, MUTED, 1.2) + line(x + width, y + 1, x + width, y + 11, MUTED, 1.2));
      out.push(text(x + width / 2, y + 26, say, { size: SIZE.label, fill: SECONDARY, anchor: 'middle' }));
      height = 30;
      break;
    }
    case 'keyboard': {
      const [rows, cols, gap] = [3, 7, 5];
      const kh = k(22, 18);
      const kw = (width - (cols - 1) * gap) / cols;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out.push(rect(x + c * (kw + gap), y + r * (kh + gap), kw, kh, { fill: RAISED, stroke: SUBTLE, radius: 3 }));
      height = rows * kh + (rows - 1) * gap;
      break;
    }
    case 'insert': {
      height = k(24, 20);
      const [cx, cy] = [x + width / 2, y + height / 2];
      out.push(line(x, cy, cx - 12, cy, MUTED, 1.2, true) + line(cx + 12, cy, x + width, cy, MUTED, 1.2, true));
      out.push(circle(cx, cy, 8, w.strong ? INK : RAISED, INK));
      out.push(line(cx - 4, cy, cx + 4, cy, w.strong ? CANVAS : INK, 1.6) + line(cx, cy - 4, cx, cy + 4, w.strong ? CANVAS : INK, 1.6));
      break;
    }
    case 'rule':
      out.push(line(x, y + k(8, 5), x + width, y + k(8, 5), SUBTLE));
      return { svg: out.join(''), width, height: k(16, 10) };
  }
  mark(height);
  return { svg: out.join(''), width, height };
};
