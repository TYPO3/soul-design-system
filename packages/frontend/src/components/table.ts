/* Table, badges and status.

   Never zebra stripes. A row's background changes on hover or on selection and
   nowhere else — that is what makes a filled row mean something.

   Density is a judgement about the reader, not about the data: compact (30px
   rows, 13px type) when the list *is* the work, airy (48px, 15px) when the rows
   are read rather than scanned, medium (38px) when one has to serve both. */

import { html, nothing, type TemplateResult } from 'lit';
import { lines } from '../lib/template.ts';
import { define, SdsElement } from '../lib/element.ts';

export type Density = 'compact' | 'medium' | 'airy';

export interface Column {
  head: string;
  /** The cell class for the whole column — `sds-td-name` for the identifier
      the machine owns, `sds-td-meta` for anything secondary. */
  cls?: string;
}

export interface Row {
  /** Text, or a component where the cell is a piece of state rather than a
      value — the badge that says how a row answered. A cell that could only
      be a string is a cell whose status has to be spelled out beside the
      table or drawn by hand into it. */
  cells: readonly (string | TemplateResult)[];
  /** Selection, not striping — `.is-selected`, which the stylesheet already
      had and the element could not emit, so the one story that needed it
      wrote the fill inline and the two drifted to different colours. */
  selected?: boolean;
  /** Anything about this row the class layer has no name for. */
  style?: string;
}

export interface TableProps {
  density?: Density;
  /** Let a table wider than its column scroll rather than be cut off.
      Not `scroll`: `Element.scroll()` is a platform method, and a property by
      that name shadows it. The typechecker caught it; nothing at runtime
      would have. */
  scrollable?: boolean;
  columns: readonly Column[];
  rows: readonly Row[];
}

export class SdsTable extends SdsElement {
  static override properties = {
    density: { type: String, reflect: true },
    scrollable: { type: Boolean, reflect: true },
    columns: { type: Array },
    rows: { type: Array },
  };

  declare density: Density;
  declare scrollable: boolean;
  declare columns: Column[];
  declare rows: Row[];

  constructor() {
    super();
    this.density = 'medium';
    this.scrollable = false;
    this.columns = [];
    this.rows = [];
  }

  private cell(value: string | TemplateResult, cls: string | undefined): TemplateResult {
    return cls ? html`<td class="${cls}">${value}</td>` : html`<td>${value}</td>`;
  }

  private bodyRow(row: Row): TemplateResult {
    const cells = lines(row.cells.map((v, i) => this.cell(v, this.columns[i]?.cls)), 6);
    /* A filled row is a selected one, never every other one. `nothing` and not
       an empty string: an attribute bound to it is dropped rather than written
       empty, so a row with neither is the bare `<tr>` a card is read as. */
    return html`<tr class="${row.selected ? 'is-selected' : nothing}" style="${row.style ?? nothing}">
      ${cells}
    </tr>`;
  }

  protected override render(): TemplateResult {
    /* Every name the class layer has must be reachable from here, or the
       element stops being the way to use this system: a class the element
       cannot emit is a class that invites the markup to be written by hand
       again. That is why scrolling is a property rather than a wrapper the
       caller is expected to remember. */
    const cls = `sds-table sds-table--${this.density}`;
    const table = html`<table class="${cls}">
  <thead><tr>
    ${lines(this.columns.map((c) => html`<th>${c.head}</th>`), 4)}
  </tr></thead>
  <tbody>
    ${lines(this.rows.map((r) => this.bodyRow(r)), 4)}
  </tbody>
</table>`;
    /* The scroller is a box around the table rather than a modifier on it —
       see `.sds-table-scroll` for what the modifier form cost. */
    return this.scrollable ? html`<div class="sds-table-scroll">${table}</div>` : table;
  }
}

define('sds-table', SdsTable);
