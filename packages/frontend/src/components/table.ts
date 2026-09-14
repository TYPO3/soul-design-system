/* Table, badges and status.

   Never zebra stripes. A row's background changes on hover or on selection and
   nowhere else — that is what makes a filled row mean something.

   Density is a judgement about the reader, not about the data. Compact (30px
   rows, 13px type) when the list *is* the work. Airy (48px, 14px) when a
   reader reads the rows. Medium (38px) when one has to serve both. */

import { html, nothing, type TemplateResult } from 'lit';
import { lines } from '../lib/template.ts';
import { define, isBlank, SdsElement } from '../lib/element.ts';

export type Density = 'compact' | 'medium' | 'airy';

/** The edge a reader reads a column down. `end` for a count, a date or a
    duration, on its right edge and in tabular figures, so the digits line
    up. There is no third: nobody scans a centred column down an edge. The
    head goes with it, or it names the column beside it. */
export type Align = 'start' | 'end';

export interface Column {
  head: string;
  /** The cell class for the whole column. `sds-td-name` for the identifier
      the machine owns, `sds-td-meta` for anything secondary. `sds-td-into` for
      the column at the end with the way into the row. */
  cls?: string;
  /** The edge a reader reads it down. `start` unless said, as text is. */
  align?: Align;
  /** If the column stays at its content's width. A short hash, a version, a
      date. Left to its share, a seven-character cell sits in a third of the
      table and pushes the reading column to the side. The slack goes to the
      free columns. */
  fit?: boolean;
}

/** A cell with a second line under it: what the row is, and what is true
    about it right now. The branch a checkout stands on, the changes nobody
    has committed. Two facts about one thing belong in one cell. Over two
    columns the head has to name a relation instead of a fact. */
export interface Cell {
  /** The line a reader reads the row by. A component where the identity is
      one: a name with the button that acts on it beside it. */
  value: string | TemplateResult;
  /** The line under it, in a meta cell's register. */
  note?: string | TemplateResult;
}

export type CellValue = string | TemplateResult | Cell;

export interface Row {
  /** Text, or a component where the cell is a piece of state, not a value:
      the badge that says how a row answered. A cell that is only a string
      needs its status spelt out beside the table or drawn into it by hand.
      A `Cell` is the same thing with its own second line. */
  cells: readonly CellValue[];
  /** Selection, not stripes: `.is-selected`. A class the stylesheet has and
      the element cannot emit ends as an inline fill in a story, and the two
      drift to different colours. */
  selected?: boolean;
  /** Anything about this row the class layer has no name for. */
  style?: string;
}

export interface TableProps {
  /** How much air a row gets. `compact` for a reference a reader scans,
      `airy` for a short table a reader reads as prose, `medium` between. */
  density?: Density;
  /** Let a table wider than its column scroll instead of a cut. Not
      `scroll`: `Element.scroll()` is a platform method, and a property by
      that name shadows it. The typechecker sees that; the runtime does not. */
  scrollable?: boolean;
  /** How wide the table itself is, where a source said. The class layer has no
      name for it and cannot have one. It is a fact about these contents, not
      a kind of table, the reason a row carries `style` too. */
  width?: string;
  /** The columns, each with its heading and its edge. Set from script, as a
      list. */
  columns?: readonly Column[];
  /** The cells, a list per row, in the order of the columns. */
  rows?: readonly Row[];
  /** The wait for the answer. The head stays, and the body draws as bars at
      the height the rows will have. A skeleton is honest only where the shape
      is certain, and a table with declared columns has one. Under 200ms show
      nothing at all. With no shape, the answer is `.sds-loading` with a
      spinner. */
  loading?: boolean;
  /** How many bar rows to draw. What the caller knows about the answer, the
      page size it asked for, the count of the last page. Not a guess by this
      element. */
  loadingRows?: number;
}

export class SdsTable extends SdsElement {
  static override properties = {
    density: { type: String, reflect: true },
    scrollable: { type: Boolean, reflect: true },
    width: { type: String },
    columns: { type: Array },
    rows: { type: Array },
    loading: { type: Boolean, reflect: true },
    loadingRows: { type: Number, attribute: 'loading-rows' },
  };

  declare density: Density;
  declare scrollable: boolean;
  declare width: string;
  declare columns: Column[];
  declare rows: Row[];
  declare loading: boolean;
  declare loadingRows: number;

  /* The table a document wrote, taken before Lit renders over it. A cell
     there carries a link, a literal, an emphasis, and none survives a JSON
     attribute. `colspan`, `rowspan` and a caption have no property at all.
     The hand-over is the table's own children, so the element still draws
     the `<table>` and decides its density. The parser drops a `<thead>`
     outside a `<table>`. So those children come from a `<template>` or a
     property, never from markup typed into a page. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.density = 'medium';
    this.scrollable = false;
    this.width = '';
    this.columns = [];
    this.rows = [];
    this.loading = false;
    this.loadingRows = 3;
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  /* The one of the three that is a plain object of this system's own. A
     string is not an object at all. A template carries Lit's marker and its
     values, not a value. */
  private stacked = (cell: CellValue): cell is Cell =>
    typeof cell === 'object' && cell !== null && 'value' in cell;

  /** What a column puts on both its head and its cells: what kind of cell it
      is, and its edge. One string, because the head and the cells have to
      stand at the same edge. A class list built twice comes out different
      once. */
  private marks(column: Column | undefined, head = false): string {
    return [
      head ? '' : (column?.cls ?? ''),
      column?.align === 'end' ? 'sds-td-end' : '',
      column?.fit ? 'sds-td-fit' : '',
    ].filter(Boolean).join(' ');
  }

  private cell(value: CellValue, cls: string): TemplateResult {
    const inner = this.stacked(value)
      ? html`${value.value}${value.note ? html`<span class="sds-td-note">${value.note}</span>` : nothing}`
      : value;
    return cls ? html`<td class="${cls}">${inner}</td>` : html`<td>${inner}</td>`;
  }

  private bodyRow(row: Row): TemplateResult {
    const cells = lines(row.cells.map((v, i) => this.cell(v, this.marks(this.columns[i]))), 6);
    /* A filled row is a selected one, never every other one. `nothing` and not
       an empty string. Lit drops an attribute bound to it and writes nothing.
       So a row with neither is the bare `<tr>` a card reads as. */
    return html`<tr class="${row.selected ? 'is-selected' : nothing}" style="${row.style ?? nothing}">
      ${cells}
    </tr>`;
  }

  /* One bar per declared column. Where the table has none, its rows arrive
     as markup, and a single bar is the whole of the shape it knows. */
  private waitingRow(): TemplateResult {
    const cells = Math.max(this.columns.length, 1);
    const bars = Array.from({ length: cells }, (_, i) => {
      const mark = this.marks(this.columns[i]);
      return mark
        ? html`<td class="${mark}"><span class="sds-skeleton"></span></td>`
        : html`<td><span class="sds-skeleton"></span></td>`;
    });
    return html`<tr>
      ${lines(bars, 6)}
    </tr>`;
  }

  protected override render(): TemplateResult {
    /* Every name the class layer has must be reachable from here, or the
       element stops as the way to use this system. A class the element
       cannot emit invites hand-written markup again. That is why scroll is a
       property, not a wrapper the caller has to remember. */
    const cls = `sds-table sds-table--${this.density}${this.loading ? ' sds-table--loading' : ''}`;
    const style = this.width ? `width: ${this.width}` : nothing;
    /* What a document wrote, where it wrote one. Its rows are already markup,
       and a rebuild from properties is a second chance to lose a cell.
       Everything the table itself is stays the element's. While the answer
       is on its way there is nothing to draw either way. */
    const given = this.loading ? null : (this.taken ?? this.content);
    const body = this.loading
      ? Array.from({ length: Math.max(this.loadingRows, 1) }, () => this.waitingRow())
      : this.rows.map((r) => this.bodyRow(r));
    const table = given
      ? html`<table class="${cls}" style="${style}">${given}</table>`
      : html`<table class="${cls}" style="${style}" aria-busy="${this.loading ? 'true' : nothing}">
  <thead><tr>
    ${lines(this.columns.map((c) => {
      const mark = this.marks(c, true);
      return mark ? html`<th class="${mark}">${c.head}</th>` : html`<th>${c.head}</th>`;
    }), 4)}
  </tr></thead>
  <tbody>
    ${lines(body, 4)}
  </tbody>
</table>`;
    /* The scroller is a box around the table rather than a modifier on it —
       see `.sds-table-scroll` for what the modifier form cost. */
    return this.scrollable ? html`<div class="sds-table-scroll">${table}</div>` : table;
  }
}

define('sds-table', SdsTable);
