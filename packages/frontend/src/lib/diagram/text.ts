/* Text a drawing sets, measured before the drawing.

   The widths are the shipped faces' own and their fallback's, measured in a
   browser by `make fonts`. A line that does not fit its box is an error at
   build time, not a label that runs over its border where nobody looks. */

import { CHARS, WIDTHS } from './metrics.generated.ts';
import type { Face } from './paint.ts';

const INDEX = new Map([...CHARS].map((c, i) => [c, i]));

const table = (key: string): readonly number[] => {
  const widths = WIDTHS[key];
  if (!widths) throw new Error(`no measurement for ${key} — run \`make fonts\``);
  return widths;
};

const keyOf = (face: Face, weight: number): string =>
  `${face}-${weight >= 600 ? 600 : 400}`;

const sum = (s: string, size: number, widths: readonly number[], spacing: number, round: boolean): number => {
  let total = 0;
  for (const c of s) {
    const i = INDEX.get(c);
    const advance = ((i === undefined ? 1000 : (widths[i] ?? 1000)) * size) / 1000;
    total += (round ? Math.round(advance) : advance) + spacing;
  }
  return total;
};

/** The width of a line in units, at a size, a face and a weight. Three
    settings count: the shipped face, its advances rounded to whole pixels,
    and the fallback for a face that does not arrive. The widest wins, so a
    line that fits here fits on every system. */
export const measure = (s: string, size: number, face: Face = 'sans', weight = 400, spacing = 0): number => {
  const key = keyOf(face, weight);
  const shipped = table(key);
  const fallback = table(`fallback-${key}`);
  return Math.max(sum(s, size, shipped, spacing, false), sum(s, size, shipped, spacing, true), sum(s, size, fallback, spacing, false));
};

/** The width the carried face sets a line at. It places what follows the
    text, a cursor or a mark. It never sizes a box that must hold it. */
export const measureSet = (s: string, size: number, face: Face = 'sans', weight = 400): number =>
  sum(s, size, table(keyOf(face, weight)), 0, false);

export interface Setting {
  size: number;
  face?: Face;
  weight?: number;
  spacing?: number;
}

/* A word wider than the box breaks where a path does, after a slash. A
   part still too wide breaks where an identifier can. That is after a
   hyphen, a dot or an underscore, or before a capital after a small letter.
   The pieces join with no space. */
const PATH = /(?<=\/)/;
const PARTS = /(?<=[-/._])|(?<=[a-z])(?=[A-Z])/;
const pieces = (word: string, fits: (s: string) => boolean): { text: string; joined: boolean }[] => {
  const split = fits(word) ? [word] : word.split(PATH).flatMap((part) => (fits(part) ? [part] : part.split(PARTS)));
  return split.map((text, i) => ({ text, joined: i > 0 }));
};

/* A space after an icon does not break: the icon stays with its word. Nor
   does a space before a separator: a line ends on the separator. */
const AFTER_ICON = /(?<![\uE000-\uF8FF]) (?!·)/;

const lines = (s: string, max: number, fits: (t: string, room: number) => boolean): string[] => {
  const out: string[] = [];
  for (const paragraph of s.split('\n')) {
    let current = '';
    for (const piece of paragraph.split(AFTER_ICON).flatMap((w) => pieces(w, (t) => fits(t, max)))) {
      const next = current + (current && !piece.joined ? ' ' : '') + piece.text;
      if (current && !fits(next, max)) {
        out.push(current);
        current = piece.text;
      } else {
        current = next;
      }
    }
    out.push(current);
  }
  return out;
};

/** The lines of a text broken only after its separators, or none where a
    part alone has no room or there is no separator. */
export const byParts = (s: string, max: number, fits: (t: string, room: number) => boolean): string[] | undefined => {
  const all = s.split(/(?<= ·) /);
  if (all.length < 2 || !all.every((p) => fits(p, max))) return undefined;
  const out: string[] = [];
  for (const p of all) {
    const last = out[out.length - 1];
    if (last !== undefined && fits(`${last} ${p}`, max)) out[out.length - 1] = `${last} ${p}`;
    else out.push(p);
  }
  return out;
};

/** The narrowest box `s` wraps into: its widest piece, where a word
    breaks as `pieces` breaks it. */
export const narrowest = (s: string, setting: Setting, at: RegExp = PARTS): number =>
  Math.max(0, ...s.split(/(?<![\uE000-\uF8FF])\s+(?!·)/).flatMap((word) => word.split(at)).map((piece) => measure(piece, setting.size, setting.face, setting.weight, setting.spacing)));

/** The narrowest box `s` wraps into with every name whole: it breaks at a
    space and after a slash, never inside a name. */
export const unbroken = (s: string, setting: Setting): number => narrowest(s, setting, PATH);

/** The lines of `s` in a box `max` wide, as full as they go. Where the last
    line holds less than a third of the box, the lines even out, so no word
    stands alone under a full line. Throws on a piece that still does not
    fit, and names `what`, so the author knows which text to shorten. */
export const wrap = (s: string, max: number, setting: Setting, what: string): string[] => {
  const width = (t: string): number => measure(t, setting.size, setting.face, setting.weight, setting.spacing);
  const fits = (t: string, room: number): boolean => width(t) <= room + 0.5;
  let out = lines(s, max, fits);
  /* A text of parts breaks after its separators where that takes no more lines. */
  const parted = out.length > 1 && !s.includes('\n') ? byParts(s, max, fits) : undefined;
  if (parted && parted.length <= out.length) return parted;
  const widow = out.length > 1 && width(out[out.length - 1] ?? '') < max / 3;
  if (widow && Number.isFinite(max)) {
    let [low, high] = [max / out.length, max];
    while (high - low > 1) {
      const mid = (low + high) / 2;
      const tried = lines(s, mid, fits);
      if (tried.length === out.length && tried.every((l) => fits(l, mid))) high = mid;
      else low = mid;
    }
    out = lines(s, high, fits);
  }
  for (const l of out) {
    if (!fits(l, max)) throw new Error(`${what}: "${l}" is ${Math.ceil(width(l))} wide, and its box is ${Math.floor(max)}`);
  }
  return out;
};

/** One line that must fit, with no wrap: a label, a value, a name. */
export const fit = (s: string, max: number, setting: Setting, what: string): string => {
  const lines = wrap(s.replace(/\n/g, ' '), Number.POSITIVE_INFINITY, setting, what);
  const one = lines.join(' ');
  const w = measure(one, setting.size, setting.face, setting.weight, setting.spacing);
  if (w - max > 0.5 + 1e-6) throw new Error(`${what}: "${one}" is ${Math.ceil(w)} wide, and its room is ${Math.floor(max)}`);
  return one;
};
