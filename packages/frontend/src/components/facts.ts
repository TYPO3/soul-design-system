/* sds-facts — a block of facts, scanned down the terms.

   Two columns, the terms down one edge and their values down the other. A
   reader scans this: down the names to the one they came for. The pairs
   stand between the tags as `<dt>` and `<dd>`, since a value
   carries a link, a badge or a literal, and no property can. `entries` is
   the same block from a caller that holds the strings, and from a static
   render, which has no children. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

/** One pair: the term a reader scans for, the value they came for, and a
    line about the value that is not part of it. */
export interface FactsEntry {
  term: string;
  value: string | TemplateResult;
  note?: string;
}

export interface FactsProps {
  /** The pairs, where a caller holds them as data or a static render has
      no children. Between the tags otherwise. */
  entries?: readonly FactsEntry[];
}

export class SdsFacts extends SdsElement {
  static override properties = {
    entries: { type: Array },
  };

  declare entries: readonly FactsEntry[];

  /* What a caller wrote between the tags, taken before Lit renders over it —
     see `SdsElement.lifted()` for why the question comes exactly once. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.entries = [];
  }

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    const pairs = this.entries.map(
      ({ term, value, note }) => html`<dt>${term}</dt>
  <dd>${value}${note ? html`<span class="sds-facts__note">${note}</span>` : nothing}</dd>`,
    );
    return html`<dl class="sds-facts">
  ${this.taken ?? this.content ?? pairs}
</dl>`;
  }
}

define('sds-facts', SdsFacts);
