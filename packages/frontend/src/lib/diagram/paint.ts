/* The marks that make a diagram, and nothing else.

   Every colour is an attribute: a token with the light hex behind it. So
   the file takes the mode of the page that references it, and still draws
   on its own. Every size is one of the grammar's:
   `docs/design-system/diagrams/index.rst` holds them and the reason for each. */

import { measureSet } from './text.ts';

export const INK = 'var(--text-primary, #1C1A17)';
export const SECONDARY = 'var(--text-secondary, #4A453D)';
export const MUTED = 'var(--text-muted, #726C63)';
export const CANVAS = 'var(--surface-canvas, #FBFAF7)';
export const RAISED = 'var(--surface-raised, #FFFFFF)';
export const SUNKEN = 'var(--surface-sunken, #F3F1EC)';
export const INSET = 'var(--surface-inset, #EFEBE3)';
export const SUBTLE = 'var(--border-subtle, #E3DFD6)';
export const STRONG = 'var(--border-strong, #C9C3B7)';
export const ACCENT = 'var(--accent, #FF8700)';
export const OK = 'var(--status-ok, #4F7A3A)';
export const WARN = 'var(--status-warn, #986200)';
export const ERROR = 'var(--status-error, #A33328)';
/* The quiet wash under a band that ends in a status. */
export const QUIET: Readonly<Record<'ok' | 'warn' | 'error', string>> = {
  ok: 'var(--surface-ok-quiet, #EEF3EA)',
  warn: 'var(--surface-warn-quiet, #FBF3E4)',
  error: 'var(--surface-error-quiet, #FCEFEC)',
};

/** The colour a drawing says its one claim in. The accent, or a status
    colour where the drawing is about a failure or a degradation. */
export type Claim = 'accent' | 'error' | 'warn' | 'ok';
export const CLAIM: Readonly<Record<Claim, string>> = { accent: ACCENT, error: ERROR, warn: WARN, ok: OK };

/** A tone a part takes for what it means, never to tell peers apart. */
export type Tone = 'ink' | 'muted' | 'ok' | 'warn' | 'error';
export const TONE: Readonly<Record<Tone, string>> = { ink: INK, muted: MUTED, ok: OK, warn: WARN, error: ERROR };

export type Face = 'sans' | 'mono';
/* The face the file carries comes first, under a name of its own so that it
   meets no rule of the page around it. The shipped face and the system's
   follow, for a reader whose renderer drops the carried one. */
export const CARRIED: Readonly<Record<Face, string>> = { sans: 'Soul Diagram Sans', mono: 'Soul Diagram Mono' };
const FAMILY: Readonly<Record<Face, string>> = {
  sans: '&#39;Soul Diagram Sans&#39;,&#39;Source Sans 3&#39;,system-ui,sans-serif',
  mono: '&#39;Soul Diagram Mono&#39;,&#39;Source Code Pro&#39;,ui-monospace,monospace',
};

/** The type sizes of the grammar. 13 is the floor. */
export const SIZE = { title: 36, lead: 17, node: 16, body: 14, label: 13 } as const;
export const FLOOR = 13;

/** One decimal, the precision a drawing at 1200 units needs. */
export const fmt = (n: number): string => String(Math.round(n * 10) / 10);

export const escape = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export interface TextStyle {
  size: number;
  fill?: string;
  face?: Face;
  /** 400 or 600: the two weights a drawing carries. */
  weight?: 400 | 600;
  anchor?: 'start' | 'middle' | 'end';
  /** Letter spacing in units, for the capitals of an eyebrow or a label. */
  spacing?: number;
  /** A ground-coloured edge, so a text over a line stays readable. */
  halo?: boolean;
}

/** The small signs a text can hold, written `{clock}` in its quotes. The
    parser turns each into one private character. It is as wide as the type
    is high, so the measure and the wrap count it as one letter. */
export const GLYPHS = ['clock', 'people', 'person', 'lock', 'dot', 'ring', 'plus', 'up', 'down', 'text', 'image', 'media', 'list', 'blocked', 'site', 'page', 'yes', 'no', 'partly'] as const;
export type Glyph = (typeof GLYPHS)[number];
const GLYPH_BASE = 0xe000;
const GLYPH_CHAR = /[-]/;
export const glyphChar = (name: string): string | undefined => {
  const i = (GLYPHS as readonly string[]).indexOf(name);
  return i < 0 ? undefined : String.fromCharCode(GLYPH_BASE + i);
};

/* One sign in the box of a letter: centred on `cx`, `cy`, `s` the type size. */
const glyph = (name: Glyph, cx: number, cy: number, s: number, ink: string): string => {
  const u = s / 14;
  const p = (d: string, fill = 'none'): string => `<path d="${d}" fill="${fill}" stroke="${fill === 'none' ? ink : 'none'}" stroke-width="${fmt(1.3 * u)}" stroke-linecap="round" stroke-linejoin="round"></path>`;
  const n = (v: number): string => fmt(v);
  const ring = (r: number): string => `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * u)}" fill="none" stroke="${ink}" stroke-width="${fmt(1.3 * u)}"></circle>`;
  const bars = (x0: number, rows: number[]): string => rows.map((w, i) => rect(x0, cy - 3 * u + i * 3 * u, w * u, 1.6 * u, { fill: ink })).join('');
  switch (name) {
    /* A status keeps its own colour, as in a matrix: the colour is the meaning. */
    case 'yes':
    case 'no':
    case 'partly':
      return `<g transform="translate(${n(cx)} ${n(cy)}) scale(${fmt(u * 0.8)})">${sign(name, 0, 0)}</g>`;
    case 'clock':
      return ring(5.5) + p(`M${n(cx)} ${n(cy - 3.2 * u)} V${n(cy)} H${n(cx + 2.6 * u)}`);
    case 'person':
      return `<circle cx="${n(cx)}" cy="${n(cy - 2.6 * u)}" r="${n(2.7 * u)}" fill="${ink}"></circle>` + p(`M${n(cx - 5 * u)} ${n(cy + 6 * u)} a${n(5 * u)} ${n(5 * u)} 0 0 1 ${n(10 * u)} 0Z`, ink);
    case 'people':
      return [-2.8, 2.8]
        .map((d) => `<circle cx="${n(cx + d * u)}" cy="${n(cy - 2.6 * u)}" r="${n(2.2 * u)}" fill="${ink}"></circle>` + p(`M${n(cx + (d - 3.6) * u)} ${n(cy + 5.5 * u)} a${n(3.6 * u)} ${n(4 * u)} 0 0 1 ${n(7.2 * u)} 0Z`, ink))
        .join('');
    case 'lock':
      return rect(cx - 4.5 * u, cy - 1 * u, 9 * u, 7 * u, { fill: ink, radius: 1 }) + p(`M${n(cx - 2.8 * u)} ${n(cy - 1 * u)} v${n(-2.2 * u)} a${n(2.8 * u)} ${n(2.8 * u)} 0 0 1 ${n(5.6 * u)} 0 v${n(2.2 * u)}`);
    case 'dot':
      return circle(cx, cy, 3.5 * u, ink);
    case 'ring':
      return ring(3.5);
    case 'plus':
      return ring(6) + p(`M${n(cx - 3 * u)} ${n(cy)} H${n(cx + 3 * u)} M${n(cx)} ${n(cy - 3 * u)} V${n(cy + 3 * u)}`);
    case 'up':
    case 'down': {
      const d = name === 'up' ? -1 : 1;
      return ring(6) + p(`M${n(cx)} ${n(cy - d * 3.2 * u)} V${n(cy + d * 3.2 * u)} M${n(cx - 2.6 * u)} ${n(cy + d * 0.8 * u)} L${n(cx)} ${n(cy + d * 3.4 * u)} L${n(cx + 2.6 * u)} ${n(cy + d * 0.8 * u)}`);
    }
    case 'text':
      return bars(cx - 5.5 * u, [11, 11, 7]);
    case 'image':
      return rect(cx - 5.5 * u, cy - 4.5 * u, 11 * u, 9 * u, { stroke: ink, width: 1.2 * u, radius: 1 }) + p(`M${n(cx - 4 * u)} ${n(cy + 3 * u)} L${n(cx - 1 * u)} ${n(cy - 0.5 * u)} L${n(cx + 1.5 * u)} ${n(cy + 1.5 * u)} L${n(cx + 4 * u)} ${n(cy - 1.5 * u)}`);
    case 'media':
      return rect(cx - 5.5 * u, cy - 4 * u, 5 * u, 8 * u, { fill: ink, radius: 1 }) + bars(cx + 1 * u, [4.5, 4.5, 3]);
    case 'list':
      return [0, 1, 2].map((i) => circle(cx - 4.5 * u, cy - 3 * u + i * 3 * u + 0.8 * u, 1 * u, ink)).join('') + bars(cx - 2 * u, [7.5, 7.5, 5.5]);
    case 'blocked':
      return ring(5.5) + p(`M${n(cx - 3.9 * u)} ${n(cy + 3.9 * u)} L${n(cx + 3.9 * u)} ${n(cy - 3.9 * u)}`);
    case 'site':
      return ring(5.5) + p(`M${n(cx - 5.5 * u)} ${n(cy)} H${n(cx + 5.5 * u)} M${n(cx)} ${n(cy - 5.5 * u)} a${n(2.6 * u)} ${n(5.5 * u)} 0 0 0 0 ${n(11 * u)} a${n(2.6 * u)} ${n(5.5 * u)} 0 0 0 0 ${n(-11 * u)}`);
    case 'page':
      return p(`M${n(cx - 4 * u)} ${n(cy - 5.5 * u)} H${n(cx + 1.5 * u)} L${n(cx + 4 * u)} ${n(cy - 3 * u)} V${n(cy + 5.5 * u)} H${n(cx - 4 * u)}Z`);
  }
};

/* A text with signs in it. Each stretch of letters is a text of its own,
   and each sign takes the box of one letter. The anchor places the whole. */
const withGlyphs = (x: number, y: number, content: string, style: TextStyle): string => {
  const { size } = style;
  const face = style.face ?? 'sans';
  const weight = style.weight ?? 400;
  const parts = content.split(/([-])/).filter(Boolean);
  const widthOf = (s: string): number => (GLYPH_CHAR.test(s) ? size : measureSet(s, size, face, weight));
  const whole = parts.reduce((sum, s) => sum + widthOf(s), 0);
  let cx = style.anchor === 'middle' ? x - whole / 2 : style.anchor === 'end' ? x - whole : x;
  const out: string[] = [];
  for (const s of parts) {
    if (GLYPH_CHAR.test(s)) {
      const name = GLYPHS[s.charCodeAt(0) - GLYPH_BASE];
      if (name) out.push(glyph(name, cx + size / 2, y - size * 0.33, size, style.fill ?? INK));
    } else if (s.trim()) {
      const lead = s.length - s.trimStart().length;
      out.push(text(cx + measureSet(s.slice(0, lead), size, face, weight), y, s.trim(), { ...style, anchor: 'start' }));
    }
    cx += widthOf(s);
  }
  return out.join('');
};

export const text = (x: number, y: number, content: string, style: TextStyle): string => {
  if (style.size < FLOOR) throw new Error(`"${content}": type at ${style.size} is under the floor of ${FLOOR}`);
  if (GLYPH_CHAR.test(content)) return withGlyphs(x, y, content, style);
  const attrs = [
    `x="${fmt(x)}"`,
    `y="${fmt(y)}"`,
    `fill="${style.fill ?? INK}"`,
    `font-family="${FAMILY[style.face ?? 'sans']}"`,
    `font-size="${style.size}"`,
    style.weight && style.weight !== 400 ? `font-weight="${style.weight}"` : '',
    style.anchor && style.anchor !== 'start' ? `text-anchor="${style.anchor}"` : '',
    style.spacing ? `letter-spacing="${style.spacing}"` : '',
    style.halo ? `stroke="${CANVAS}" stroke-width="5" stroke-linejoin="round" paint-order="stroke"` : '',
  ].filter(Boolean);
  return `<text ${attrs.join(' ')}>${escape(content)}</text>`;
};

export interface BoxStyle {
  fill?: string;
  stroke?: string;
  width?: number;
  radius?: number;
  dashed?: boolean;
}

export const rect = (x: number, y: number, w: number, h: number, style: BoxStyle = {}): string => {
  if ((style.radius ?? 0) > 6) throw new Error(`a radius of ${style.radius} is above the limit of 6`);
  const attrs = [
    `x="${fmt(x)}"`,
    `y="${fmt(y)}"`,
    `width="${fmt(w)}"`,
    `height="${fmt(h)}"`,
    style.radius ? `rx="${style.radius}"` : '',
    `fill="${style.fill ?? 'none'}"`,
    style.stroke ? `stroke="${style.stroke}" stroke-width="${style.width ?? 1}"` : '',
    style.dashed ? 'stroke-dasharray="5 4"' : '',
  ].filter(Boolean);
  return `<rect ${attrs.join(' ')}></rect>`;
};

export const line = (x1: number, y1: number, x2: number, y2: number, stroke = SUBTLE, width = 1, dashed = false): string =>
  `<line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" stroke="${stroke}" stroke-width="${width}"${dashed ? ' stroke-dasharray="5 4"' : ''}></line>`;

export type Point = readonly [number, number];

/** An orthogonal connector with a head at its end, and at its start too
    where it carries a question and its answer. */
export const connector = (points: readonly Point[], stroke = MUTED, width = 1.5, dashed = false, head = true, tail = false): string => {
  const d = points.map(([x, y], i) => `${i ? 'L' : 'M'}${fmt(x)} ${fmt(y)}`).join(' ');
  const path = `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}"${dashed ? ' stroke-dasharray="5 4"' : ''}></path>`;
  const [end, before] = [points.at(-1), points.at(-2)];
  const [start, after] = [points[0], points[1]];
  return (
    path +
    (head && end && before ? arrowhead(end, before, stroke) : '') +
    (tail && start && after ? arrowhead(start, after, stroke) : '')
  );
};

/** The head, 9 long and 8 wide, pointing from `from` to `at`. */
export const arrowhead = ([x, y]: Point, [fx, fy]: Point, fill = MUTED): string => {
  const dx = Math.sign(x - fx);
  const dy = Math.sign(y - fy);
  const [bx, by] = [x - dx * 9, y - dy * 9];
  const [px, py] = [dy * 4, dx * 4];
  return `<path d="M${fmt(bx + px)} ${fmt(by + py)} L${fmt(x)} ${fmt(y)} L${fmt(bx - px)} ${fmt(by - py)}Z" fill="${fill}"></path>`;
};

export const circle = (cx: number, cy: number, r: number, fill: string, stroke?: string): string =>
  `<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="1.5"` : ''}></circle>`;

/* The signs. One meaning each, the same in every drawing, and colour and
   shape say the same thing, so a sign still reads in greyscale. */
export type Sign = 'yes' | 'partly' | 'no' | 'unknown' | 'dot' | 'ring' | 'page' | 'panel' | 'both' | 'form' | 'bar' | 'nav' | 'docheader' | 'any';

export const SIGN_MEANING: Readonly<Record<Sign, string>> = {
  yes: 'yes, available',
  partly: 'in part',
  no: 'no, missing',
  unknown: 'not known',
  dot: 'present',
  ring: 'planned',
  page: 'in the page',
  panel: 'in a panel next to the page',
  both: 'both',
  form: 'in a form or dialog',
  bar: 'in the bar over the page',
  nav: 'in the navigation beside the page',
  docheader: 'in the head of a module',
  any: 'in the editing interface, filled for each case',
};

/* A place in an interface: a screen with its page filled, its panel filled,
   both, or a sheet with lines for a form. */
const screen = (cx: number, cy: number, page: boolean, panel: boolean): string =>
  rect(cx - 11, cy - 8, 22, 16, { stroke: INK, width: 1.5, radius: 2 }) +
  (page ? rect(cx - 7, cy - 4, panel ? 8 : 14, 8, { fill: INK }) : '') +
  (panel ? rect(cx + 3, cy - 8, 8, 16, { fill: INK, radius: 2 }) : '');

const check = (cx: number, cy: number, stroke: string): string =>
  `<path d="M${fmt(cx - 6)} ${fmt(cy)} L${fmt(cx - 2)} ${fmt(cy + 4)} L${fmt(cx + 6)} ${fmt(cy - 5)}" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>`;

export const sign = (kind: Sign, cx: number, cy: number): string => {
  switch (kind) {
    case 'yes':
      return check(cx, cy, OK);
    case 'partly': {
      const arc = (side: 1 | -1): string =>
        `<path d="M${fmt(cx + side * 9)} ${fmt(cy - 8)} A9 9 0 0 ${side > 0 ? 1 : 0} ${fmt(cx + side * 9)} ${fmt(cy + 8)}" fill="none" stroke="${WARN}" stroke-width="1.5" stroke-linecap="round"></path>`;
      return arc(-1) + check(cx, cy, WARN) + arc(1);
    }
    case 'no':
      return `<line x1="${fmt(cx - 6)}" y1="${fmt(cy)}" x2="${fmt(cx + 6)}" y2="${fmt(cy)}" stroke="${ERROR}" stroke-width="2" stroke-linecap="round"></line>`;
    case 'unknown':
      return text(cx, cy + 6, '?', { size: 18, fill: MUTED, face: 'mono', weight: 600, anchor: 'middle' });
    case 'dot':
      return circle(cx, cy, 5, INK);
    case 'ring':
      return circle(cx, cy, 4.5, 'none', INK);
    case 'page':
      return screen(cx, cy, true, false);
    case 'panel':
      return screen(cx, cy, false, true);
    case 'both':
      return screen(cx, cy, true, true);
    case 'nav':
      return rect(cx - 11, cy - 8, 22, 16, { stroke: INK, width: 1.5, radius: 2 }) + rect(cx - 11, cy - 8, 8, 16, { fill: INK, radius: 2 });
    case 'docheader':
      return (
        rect(cx - 11, cy - 8, 22, 16, { stroke: INK, width: 1.5, radius: 2 }) +
        rect(cx - 11, cy - 8, 22, 4, { fill: INK, radius: 2 }) +
        rect(cx - 8, cy - 2, 16, 3, { fill: INK })
      );
    /* No place of its own: the parts of a screen, each in a quiet fill. */
    case 'any':
      return (
        rect(cx - 11, cy - 8, 22, 16, { fill: RAISED, stroke: MUTED, radius: 2 }) +
        [[-10, -7, 20, 3], [-10, -3, 5, 10], [-4, -3, 9, 10], [6, -3, 4, 10]]
          .map(([dx = 0, dy = 0, w = 0, h = 0]) => rect(cx + dx, cy + dy, w, h, { fill: STRONG, radius: 1 }))
          .join('')
      );
    case 'bar':
      return rect(cx - 11, cy - 8, 22, 16, { stroke: INK, width: 1.5, radius: 2 }) + rect(cx - 11, cy - 8, 22, 4, { fill: INK, radius: 2 });
    case 'form':
      return (
        rect(cx - 7, cy - 9, 14, 18, { stroke: INK, width: 1.5, radius: 2 }) +
        [-4, 0, 4].map((d) => `<line x1="${fmt(cx - 3.5)}" y1="${fmt(cy + d)}" x2="${fmt(cx + 3.5)}" y2="${fmt(cy + d)}" stroke="${INK}" stroke-width="1.2"></line>`).join('')
      );
  }
};

/** The place of a case in the editing interface, at the head of a column.
    The screen has quiet parts, and the part of the case is ink. The parts
    are the head of the module, the navigation, the bar, the page and the
    panel. `any` fills none of them. */
export const PLACE = { width: 44, height: 28 } as const;
export const placeSign = (kind: Sign, x: number, y: number): string => {
  const { width: w, height: h } = PLACE;
  const parts: [Sign[], number, number, number, number][] = [
    [['docheader'], 2, 2, w - 4, 4],
    [['nav'], 2, 7.5, 10, h - 9.5],
    [['bar'], 13.5, 7.5, w - 15.5, 3.5],
    [['page', 'both', 'form'], 13.5, 12.5, 18, h - 14.5],
    [['panel', 'both'], 33, 12.5, w - 35, h - 14.5],
  ];
  return (
    rect(x, y, w, h, { fill: RAISED, stroke: MUTED, radius: 3 }) +
    parts.map(([on, dx, dy, pw, ph]) => rect(x + dx, y + dy, pw, ph, { fill: on.includes(kind) ? INK : SUBTLE, radius: 1 })).join('') +
    (kind === 'form' ? [16, 20, 24].map((d) => line(x + 16, y + d, x + 29, y + d, CANVAS, 1.2)).join('') : '')
  );
};

/** Diagonal lines across a box, 8 apart: a part that is there for the
    editors and hidden from the visitors. */
export const hatch = (x: number, y: number, w: number, h: number, stroke = STRONG): string => {
  const d: string[] = [];
  for (let k = 8; k < w + h; k += 8) {
    const [x0, y0] = k <= w ? [x + k, y] : [x + w, y + k - w];
    const [x1, y1] = k <= h ? [x, y + k] : [x + k - h, y + h];
    d.push(`M${fmt(x0)} ${fmt(y0)} L${fmt(x1)} ${fmt(y1)}`);
  }
  return `<path d="${d.join(' ')}" fill="none" stroke="${stroke}" stroke-width="1"></path>`;
};

/** A numbered step: the ink disc a sequence or a sketch points with. */
export const marker = (cx: number, cy: number, label: string): string =>
  circle(cx, cy, 11, INK) + text(cx, cy + 4.5, label, { size: 13, fill: CANVAS, weight: 600, anchor: 'middle' });

/** A pointer, its tip at x, y: where a hand rests on a control. */
export const pointer = (x: number, y: number): string =>
  `<path d="M${fmt(x)} ${fmt(y)} l0 15 l4 -3.5 l3 6.5 l2.5 -1.2 l-3 -6.3 l5.5 -0.5 Z" fill="${INK}" stroke="${CANVAS}" stroke-width="1" stroke-linejoin="round"></path>`;

/** A crossed end: the step that does not get through. */
export const cross = (cx: number, cy: number): string =>
  `<path d="M${fmt(cx - 6)} ${fmt(cy - 6)} L${fmt(cx + 6)} ${fmt(cy + 6)} M${fmt(cx + 6)} ${fmt(cy - 6)} L${fmt(cx - 6)} ${fmt(cy + 6)}" stroke="${ERROR}" stroke-width="2" stroke-linecap="round"></path>`;

/** A person: a head and shoulders, set before the name of a lane or a node. */
export const person = (x: number, cy: number, stroke = INK): string =>
  `<circle cx="${fmt(x + 6)}" cy="${fmt(cy - 4)}" r="3.5" fill="none" stroke="${stroke}" stroke-width="1.5"></circle>` +
  `<path d="M${fmt(x)} ${fmt(cy + 7)} a6 6 0 0 1 12 0" fill="none" stroke="${stroke}" stroke-width="1.5"></path>`;

/** A store: a cylinder, set before the name of a lane or a node that the
    other parts read and write. */
export const store = (x: number, cy: number, stroke = INK): string =>
  `<ellipse cx="${fmt(x + 6)}" cy="${fmt(cy - 5)}" rx="6" ry="2.5" fill="none" stroke="${stroke}" stroke-width="1.5"></ellipse>` +
  `<path d="M${fmt(x)} ${fmt(cy - 5)} V${fmt(cy + 5)} a6 2.5 0 0 0 12 0 V${fmt(cy - 5)} M${fmt(x)} ${fmt(cy)} a6 2.5 0 0 0 12 0" fill="none" stroke="${stroke}" stroke-width="1.5"></path>`;

/** The sign of a shape before a name: a person or a store. A node has none. */
export const shapeSign = (shape: 'node' | 'person' | 'store' | undefined, x: number, cy: number, stroke = INK): string =>
  shape === 'person' ? person(x, cy, stroke) : shape === 'store' ? store(x, cy, stroke) : '';
