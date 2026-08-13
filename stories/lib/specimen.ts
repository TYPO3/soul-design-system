/* The specimen scaffolding — the annotation layer a card is drawn with.

   These mirror the classes in `_specimen.css` one for one, so a story composes
   a card out of named pieces instead of hand-indented HTML. Nothing here
   belongs to the system proper: wanting one of these on a product surface means
   wanting a component, not a caption.

   Strings rather than Lit templates, because a rendered `TemplateResult` cannot
   be indented — the whitespace is fixed inside the literal. Components come in
   through `part()`, which renders one to its static markup first. */

import type { TemplateResult } from 'lit';
import { renderStatic } from '../../packages/frontend/src/lib/render.ts';

/** Render a component template to the static markup a card ships. */
export const part = (template: TemplateResult): string => renderStatic(template);

/** Narrow no-break space, U+202F — what this system sets between a number and
    its unit, so `30 px` cannot break across a line. Named rather than typed,
    because an invisible character in source is indistinguishable from an
    ordinary space in review and silently becomes one on the next edit. */
export const NNBSP = '\u202f';

/** `px(30)` → `30 px` with the narrow space, as the cards set it. */
export const px = (n: number, unit = 'px'): string => `${n}${NNBSP}${unit}`;

/** The hairline that separates a closing caption from the examples above it. */
export const DIVIDER = 'border-top:1px solid var(--border-subtle); padding-top:12px;';

/** The same hairline, above a row rather than a caption. */
export const ROW_DIVIDER = 'border-top:1px solid var(--border-subtle); padding-top:14px;';

/** Escape only what HTML requires. Non-ASCII stays literal: `·` and `—` are
    the characters, and a numeric entity in a file the pane parses with a
    regex is a string that never gets decoded. */
export const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Indent a block by `n` spaces, so nesting produces readable output. Skips the
    inside of a `<pre>`, where whitespace is content and indenting it shifts
    every rendered line right. The opening tag still moves with its
    surroundings; the lines after it are left exactly as written. */
export function indent(html: string, n: number): string {
  const pad = ' '.repeat(n);
  let inPre = false;

  return html
    .split('\n')
    .map((line) => {
      const out = inPre || !line.trim() ? line : pad + line;
      const opens = (line.match(/<pre\b/g) ?? []).length;
      const closes = (line.match(/<\/pre>/g) ?? []).length;
      if (opens > closes) inPre = true;
      else if (closes > opens) inPre = false;
      return out;
    })
    .join('\n');
}

const block = (tag: string, attrs: string, children: readonly string[]): string =>
  `<${tag}${attrs}>\n${indent(children.filter(Boolean).join('\n'), 2)}\n</${tag}>`;

const attr = (name: string, value?: string): string => (value ? ` ${name}="${value}"` : '');

export interface SpecOptions {
  /** Sets `--spec-gap` for this card only. */
  gap?: string;
}

/** The standard card scaffold: the padded, stacked column of examples. */
export const spec = (children: readonly string[], { gap }: SpecOptions = {}): string =>
  block('div', ` class="spec"${gap ? ` style="--spec-gap:${gap}"` : ''}`, children);

/** Just the card's padding, for specimens that lay themselves out. */
export const specPad = (children: readonly string[], style?: string): string =>
  block('div', ` class="spec-pad"${attr('style', style)}`, children);

export interface RowOptions {
  style?: string;
  /** Draws the hairline separating a row that belongs to a different
      subject from the ones above it. */
  divided?: boolean;
}

/** One row of examples, closed by the mono caption naming what it shows. The
    caption is annotation and never product text: it says what the row
    demonstrates rather than repeating the labels inside it. */
export function specRow(children: readonly string[], caption?: string, { style, divided }: RowOptions = {}): string {
  const s = [divided ? ROW_DIVIDER : '', style ?? ''].filter(Boolean).join(' ');
  const items = caption ? [...children, `<span class="spec-cap">${esc(caption)}</span>`] : [...children];
  return block('div', ` class="spec-row"${attr('style', s)}`, items);
}

/** A caption standing on its own rather than closing a row — the line that
    states what the whole card is showing. */
export const specCap = (text: string, style?: string): string =>
  `<div class="spec-cap"${attr('style', style)}>${esc(text)}</div>`;

/** Prose under an example. */
export const specNote = (html: string): string => `<div class="spec-note">${html}</div>`;

/** A rule being stated, a step up from a note. */
export const specRule = (html: string): string => `<div class="spec-rule">${html}</div>`;

/** A section heading inside a specimen. */
export const specH = (text: string): string => `<div class="spec-h">${esc(text)}</div>`;

/** The tracked-out label over a group of swatches or samples. */
export const specLbl = (text: string): string => `<div class="spec-lbl">${esc(text)}</div>`;

/** A free-standing column, for specimens that need one beside another. It
    carries the class even though the style is written inline: an unclassed box
    is one no rule in the card chrome can reach, which is how a component's own
    step survives inside a column that already states a gap. */
export const specCol = (children: readonly string[], style: string): string =>
  block('div', ` class="spec-col" style="${style}"`, children);

export interface DsCardInput {
  /** The file to generate, relative to the repo root. */
  path: string;
  group?: string;
  name: string;
  subtitle: string;
  /** The exact size the pane renders the card at. `make fit` fails the
      build when the content does not fit it, so this is a measurement
      rather than a preference. */
  viewport: string;
  /** Which mode the card is pinned to. `both` pins neither and is not a default
      in disguise: a card showing the two panes side by side, or a drawing
      taking the mode it is placed in, must not have one forced on the document
      around it — and nothing checks that it was. */
  theme?: 'light' | 'dark' | 'both';
  /** A class on the card's own `<body>`, for the ground a card is drawn on
      rather than anything in it — `spec-sunken` under the diagram figures.
      A wrapper div inside the body would leave the page behind it painted in
      the canvas colour, which is the one place the difference shows. */
  bodyClass?: string;
}

export interface DsCard extends Required<DsCardInput> {
  width: number;
  height: number;
}

/** Declare the card a story file generates, and how the pane renders it — the
    `@dsCard` contract from `scripts/lib/cards.ts`, stated in the story so the
    story owns it. */
export function dsCard(c: DsCardInput): DsCard {
  const [w, h] = c.viewport.split('x');
  return { group: 'Components', theme: 'dark', bodyClass: '', ...c, width: Number(w), height: Number(h) };
}

export interface DsScreenInput {
  /** The file to generate, relative to the repo root — under `screens/`. */
  path: string;
  section?: string;
  /** The `<title>` of the page, which is a page and not a specimen. */
  title: string;
  subtitle: string;
  viewport: string;
  theme?: 'light' | 'dark';
}

export interface DsScreen extends Required<DsScreenInput> {
  width: number;
  height: number;
}

/** Declare the whole screen a story file generates — the `@startingPoint`
    contract from `scripts/lib/cards.ts`, stated in the story for the reason a
    card's is: composing components anywhere but where they are defined means
    writing their markup a second time. */
export function dsScreen(s: DsScreenInput): DsScreen {
  const [w, h] = s.viewport.split('x');
  return { section: 'Screens', theme: 'dark', ...s, width: Number(w), height: Number(h) };
}
