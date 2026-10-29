/* The room a figure slide lends its drawing, from the slide's markup and
   with no browser. A browser measures the art's box once the stylesheet
   lays the slide out. Here the same box follows from the lines of the head,
   set in the engine's metrics, and from the sizes of the slide's set.

   Those sizes copy the stylesheet. So `tests/slide-room.test.ts` lays the
   figure slides out in a browser and fails where the two rooms part. */

import { measure } from '../../packages/frontend/src/lib/diagram/text.ts';

/* The frame in its own pixels, as `slide.css` sets it. The head starts under
   the eyebrow, and the figure a gap under the head. The art stops a hairline
   inside the figure. */
const FRAME = {
  headTop: 57.1,
  /* A head of one title line and one line of note. */
  headBase: 51.5,
  figureGap: 24,
  /* Where the figure ends: over a foot, with no foot, and on a headed
     slide with its count and without. */
  footed: 458.9,
  bare: 498.9,
  headed: 475,
  headedBare: 497.3,
  inset: 2.1,
  width: 875.7,
  rowGap: 34.05,
  word: 24.8,
  wordGap: 18,
} as const;

/* Each line of the head: its size, weight, letter spacing, line height and
   measure. A headed slide sets its lead at the size of a note. */
const TITLE = { size: 34, weight: 700, spacing: -0.51, line: 36.72, measure: 879.2 } as const;
const NOTE = { size: 14, weight: 400, spacing: 0, line: 21.7, measure: 768 } as const;
/* On a deck's stage the frame draws at full size. A note there runs longer
   before it wraps, and the art stands a little larger. */
const STAGE = { note: 1080, width: 0.7, height: 1.7, row: 0.5, rowWidth: 2.4 } as const;
const LEAD = { size: 19, weight: 400, spacing: 0, line: 29.45, measure: 1194, after: 3.35 } as const;
const HEADED_LEAD = { size: 14, weight: 400, spacing: 0, line: 21.7, measure: 960, after: -4.6 } as const;

/** A drawing a slide draws a tenth larger than the art's box. */
export const ROOM = 1.1;

/* The engine knows the semibold and the regular. A bold line is a little
   wider than the semibold one, so it counts at that much more. */
const BOLD = 1.03;

/** How many lines a text takes at a measure, wrapped at spaces. */
export const linesOf = (text: string, setting: { size: number; weight: number; spacing: number; measure: number }): number => {
  const words = text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  if (!words.length) return 0;
  const width = (t: string): number => measure(t, setting.size, 'sans', setting.weight, setting.spacing) * (setting.weight >= 700 ? BOLD : 1);
  let lines = 1;
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && width(next) > setting.measure) {
      lines += 1;
      line = word;
    } else line = next;
  }
  return lines;
};

/** What the room depends on, read off the slide's rendered markup. */
export interface SlideHead {
  layout: 'wide' | 'headed' | 'row' | 'other';
  title: string;
  lead: string;
  note: string;
  foot: boolean;
  drawings: { word: boolean; caption: boolean }[];
}

/** The art's box for each drawing, in the frame's pixels, or `undefined`
    for a slide whose room this does not know. */
export const artOf = (head: SlideHead, stage = false): { width: number; height: number } | undefined => {
  if (head.layout === 'other' || !head.drawings.length || head.drawings.some((one) => one.caption)) return undefined;
  const lead = head.layout === 'headed' ? HEADED_LEAD : LEAD;
  const leadLines = linesOf(head.lead, lead);
  const noteLines = linesOf(head.note, stage ? { ...NOTE, measure: STAGE.note } : NOTE);
  const top = FRAME.headTop
    + FRAME.headBase
    + (Math.max(1, linesOf(head.title, TITLE)) - 1) * TITLE.line
    + (noteLines ? noteLines - 1 : 0) * NOTE.line
    + (leadLines ? leadLines * lead.line + lead.after : 0)
    + FRAME.figureGap;
  const bottom = head.layout === 'headed' ? (head.foot ? FRAME.headed : FRAME.headedBare) : head.foot ? FRAME.footed : FRAME.bare;
  const count = head.layout === 'row' ? head.drawings.length : 1;
  const width = (FRAME.width + (stage ? (head.layout === 'row' ? STAGE.rowWidth : STAGE.width) : 0) - (count - 1) * FRAME.rowGap) / count;
  const word = head.drawings.some((one) => one.word) ? FRAME.word + FRAME.wordGap : 0;
  const height = bottom - top - (head.layout === 'row' ? word : FRAME.inset) + (stage ? (head.layout === 'row' ? STAGE.row : STAGE.height) : 0);
  return { width, height };
};

/** The room the slide lends, `width,height`, as `slide.ts` works it out. */
export const roomOf = (art: { width: number; height: number }, grow = 1): string =>
  `${Math.round(Math.floor(art.width * ROOM) * grow)},${Math.round(Math.floor(art.height * ROOM) * grow)}`;

const words = (markup: string): string =>
  markup.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

/** What a figure slide's room depends on, read off the markup the slide
    drew: its frame and what follows. `undefined` for any other slide. */
export const headOf = (drawn: string): SlideHead | undefined => {
  const frame = /<div class="sds-slide( [^"]*)?"/.exec(drawn)?.[1] ?? '';
  if (!frame.includes('sds-slide--figure')) return undefined;
  const layout = frame.includes('--headed') ? 'headed' : frame.includes('--row') ? 'row' : /--(full|text-|bleed|framed)/.test(frame) ? 'other' : 'wide';
  const head = /<div class="sds-slide__head">([\s\S]*?)<\/div>\s*(?:<!--[^>]*-->\s*)*<div class="sds-slide__figure/.exec(drawn)?.[1] ?? '';
  const parts = drawn.split('<div class="sds-slide__drawing">').slice(1);
  return {
    layout,
    title: words(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/.exec(head)?.[1] ?? ''),
    lead: words(/<p class="sds-lead">([\s\S]*?)<\/p>/.exec(head)?.[1] ?? ''),
    note: words(/<p class="sds-slide__note">([\s\S]*?)<\/p>/.exec(head)?.[1] ?? ''),
    foot: drawn.includes('class="sds-slide__foot"'),
    drawings: parts.map((part) => ({ word: part.includes('sds-slide__word'), caption: part.includes('sds-slide__caption') })),
  };
};
