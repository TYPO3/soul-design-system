/* sds-grid — the wall a reader reads a set in.

   What goes between the tags is whatever stands side by side: cards, planes,
   a column of links. What the element carries is the one decision the set
   makes about itself, and it is not a column count. The grid reflows by a
   minimum width, so a page says what its items hold and names no breakpoint.

   A component rather than a `div` with the class, for the reason every
   surface here is one. It is the system's own name for its own node. A page
   that writes one has a copy of what only the system can change. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

/** How wide the set runs, or if it runs as a wall at all. `flush` is the
    gutter taken out: the cards share a hairline and the set reads as one
    block. That is a shape rather than a distance, so it is a name here rather
    than a number. `default` is a name too: the width every set gets unless it
    says otherwise is a decision, and nobody can ask for an unnamed one. */
export type GridVariant = 'default' | 'wide' | 'dense' | 'flush';

export interface GridProps {
  /** How much room one item holds. `default` is the reading width. `wide` is
      for cards with a picture, `dense` for a set read as a list, `flush` for
      a wall with no air around it. */
  variant?: GridVariant;
}

/** The class each variant is. Written out rather than assembled from a
    fragment. A name no search finds is a name no check can see go stale. The
    check that every class the system defines appears somewhere reads exactly
    this file to find them. */
const VARIANT: Record<GridVariant, string> = {
  default: '',
  wide: 'sds-grid--wide',
  dense: 'sds-grid--dense',
  flush: 'sds-grid--flush',
};

/**
 * The columns a count of items can stand in.
 *
 * `auto-fit` fills a row and drops the rest onto the next one. So four items
 * in a three-wide row wrap as three and one. That is one on its own beside two
 * tracks of nothing, and in a flush set a bite out of the wall. A last row is even
 * enough when it is full, or one short of full. Four across three becomes
 * two and two, five across three stays three and two.
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
        which renders the grid the stylesheet declares. That is the state a
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
    /* The room, not the grid: measured off the grid it reads back its own
       answer and settles wherever it started. The host draws nothing, so what
       the row has is what the parent gives it. */
    /* A frame later, not in the callback: an answer that changes the room
       in the same frame is an observation the browser reports undelivered. */
    this.watch = new ResizeObserver(() => requestAnimationFrame(() => this.isConnected && this.decide()));
    if (this.parentElement) this.watch.observe(this.parentElement);
    void this.updateComplete.then(() => this.decide());
  }

  override disconnectedCallback(): void {
    this.watch?.disconnect();
    super.disconnectedCallback();
  }

  /** What the sheet draws on its own, and what to draw instead.

      The minimum comes off the grid rather than a copy here. The three widths
      differ in exactly that number, and a copy of it in TypeScript is the
      copy that goes stale. */
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

  /* After the update, not in it. A state set inside `updated()` starts the
     next cycle before this one has closed, which Lit's dev build names as
     the inefficiency it is. */
  protected override updated(): void {
    void this.updateComplete.then(() => this.decide());
  }

  protected override render(): TemplateResult {
    const modifier = VARIANT[this.variant] ?? '';
    /* A style rather than a class, because it is a measurement and not a
       name. No page and no stylesheet can state it, and a class per column
       count is the breakpoints this grid exists to avoid. */
    const columns = this.columns > 0 ? `grid-template-columns:repeat(${this.columns},minmax(0,1fr))` : nothing;
    return html`<div class="${modifier ? `sds-grid ${modifier}` : 'sds-grid'}" style="${columns}">${this.taken ?? this.content}</div>`;
  }
}

define('sds-grid', SdsGrid);
