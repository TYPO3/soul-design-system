/* Table, badges and status.

   Never zebra stripes. A row's background changes on hover or on selection
   and nowhere else — that is what makes a filled row mean something. The
   raised row in the specimen is a selected one, not every other one.

   The badge that used to live here now has its own module — see
   `badge.ts`; the table specimen is where it first appeared, which was never
   a reason for it to be defined here.

   Density is a judgement about the reader, not about the data: compact
   (30px rows, 13px type) when the list *is* the work, airy (48px, 15px)
   when the rows are read rather than scanned, medium (38px) when one
   density has to serve both. */

import { html, type TemplateResult } from 'lit';
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
  cells: readonly string[];
  /** Selection, not striping. */
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

  private cell(value: string, cls: string | undefined): TemplateResult {
    return cls ? html`<td class="${cls}">${value}</td>` : html`<td>${value}</td>`;
  }

  private bodyRow(row: Row): TemplateResult {
    const cells = lines(row.cells.map((v, i) => this.cell(v, this.columns[i]?.cls)), 6);
    /* A filled row is a selected one, never every other one — that is what
       makes a background mean something when it appears. */
    return row.style
      ? html`<tr style="${row.style}">
      ${cells}
    </tr>`
      : html`<tr>
      ${cells}
    </tr>`;
  }

  protected override render(): TemplateResult {
    /* Every modifier the class layer has must be reachable from here, or the
       element stops being the way to use this system: `--scroll` was added to
       `components.css` for a consumer that had written the three declarations
       itself, and for one commit the element could not produce it. A class the
       element cannot emit is a class that invites the markup to be written by
       hand again. */
    const cls = `sds-table sds-table--${this.density}${this.scrollable ? ' sds-table--scroll' : ''}`;
    return html`<table class="${cls}">
  <thead><tr>
    ${lines(this.columns.map((c) => html`<th>${c.head}</th>`), 4)}
  </tr></thead>
  <tbody>
    ${lines(this.rows.map((r) => this.bodyRow(r)), 4)}
  </tbody>
</table>`;
  }
}

define('sds-table', SdsTable);
