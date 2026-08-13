/* sds-grid — the wall a set is read in.

   What goes between the tags is whatever is read side by side: cards, planes,
   a column of links. What the element carries is the one decision the
   set makes about itself, and it is not a column count — the grid reflows by a
   minimum width, so a page says what its items hold and names no breakpoint.

   A component rather than a `div` wearing the class, for the reason every
   surface here is one: it is the system's own name for its own node, and a
   page that writes one has taken a copy of what only the system may change. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

/** How wide the set runs, or whether it runs as a wall at all. `flush` is the
    gutter taken out — the cards share a hairline and the set reads as one
    block, which is a shape rather than a distance and so is a name here rather
    than a number. `default` is a name too: the width every set gets unless it
    says otherwise is a decision, and an unnamed one cannot be asked for. */
export type GridVariant = 'default' | 'wide' | 'dense' | 'flush';

export interface GridProps {
  variant?: GridVariant;
}

/** The class each variant is. Written out rather than assembled from a
    fragment: a name no search finds is a name no check can see going stale,
    and the check that every class the system defines is drawn somewhere reads
    exactly this file to find them. */
const VARIANT: Record<GridVariant, string> = {
  default: '',
  wide: 'sds-grid--wide',
  dense: 'sds-grid--dense',
  flush: 'sds-grid--flush',
};

/**
 * The columns a count of items may be laid out in.
 *
 * `auto-fit` fills a row and drops what is left over onto the next one, so
 * four items in a three-wide row wrap as three and one — one on its own beside
 * two tracks of nothing, and in a flush set a bite out of the wall.
 * A last row is even enough when it is full, or one short of full: four across
 * three becomes two and two, five across three stays three and two.
 */
export function evenColumns(count: number, fits: number): number {
  for (let columns = Math.min(fits, count); columns > 1; columns--) {
    const rest = count % columns;
    if (rest === 0 || rest >= columns - 1) return columns;
  }
  return 1;
}

export class SdsGrid extends SdsElement {
  static override properties = {
    variant: { type: String },
    /** The columns the last measurement settled on. Zero is "not measured",
        which renders the reflowing grid the stylesheet declares — the state a
        page arrives in and the only one a reader with no script ever sees. */
    columns: { type: Number, state: true },
  };

  declare variant: GridVariant;
  declare columns: number;

  /* What a caller wrote between the tags, taken before Lit renders over it.
     Nothing else about the set is content: what an item is, is its own
     business, and the grid never reaches inside one. */
  private taken: Node[] | null = null;
  private watch?: ResizeObserver;

  constructor() {
    super();
    this.variant = 'default';
    this.columns = 0;
  }

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
    /* The room, not the grid: measured off the grid it would read back its own
       answer and settle wherever it happened to start. The host draws nothing,
       so what the row actually has is what the parent gives it. */
    this.watch = new ResizeObserver(() => this.decide());
    if (this.parentElement) this.watch.observe(this.parentElement);
    void this.updateComplete.then(() => this.decide());
  }

  override disconnectedCallback(): void {
    this.watch?.disconnect();
    super.disconnectedCallback();
  }

  /** What the sheet would draw, and what to draw instead.

      The minimum is read off the grid rather than repeated here: the three
      widths differ in exactly that number, and a copy of it in TypeScript is
      the copy that goes stale. */
  private decide(): void {
    const grid = this.firstElementChild as HTMLElement | null;
    if (!grid) return;
    /* Two items cannot wrap unevenly and one is a row. Left to the sheet,
       which is the answer that needs no measuring. */
    const count = grid.childElementCount;
    if (count < 3) {
      this.columns = 0;
      return;
    }

    const style = getComputedStyle(grid);
    const min = parseFloat(style.getPropertyValue('--grid-min'));
    const gap = parseFloat(style.columnGap) || 0;
    const room = grid.getBoundingClientRect().width;
    if (!(min > 0) || !(room > 0)) return;

    const fits = Math.max(1, Math.floor((room + gap) / (min + gap)));
    const wanted = evenColumns(count, fits);
    /* Nothing to say where the sheet already lands there. */
    this.columns = wanted >= fits ? 0 : wanted;
  }

  protected override updated(): void {
    this.decide();
  }

  protected override render(): TemplateResult {
    const modifier = VARIANT[this.variant] ?? '';
    /* Written as a style rather than a class, because it is a measurement and
       not a name: no page and no stylesheet can state it, and a class per
       column count would be the breakpoints this grid exists to avoid. */
    const columns = this.columns > 0 ? `grid-template-columns:repeat(${this.columns},minmax(0,1fr))` : nothing;
    return html`<div class="${modifier ? `sds-grid ${modifier}` : 'sds-grid'}" style="${columns}">${this.taken ?? this.content}</div>`;
  }
}

define('sds-grid', SdsGrid);
