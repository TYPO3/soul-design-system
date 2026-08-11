/* sds-stat — a number stated as a fact.

   The value first and largest, the label under it, and a line saying what the
   number is bounded by. That third part is the reason this is a component
   rather than two divs: a figure with no bound is a claim, and the writing
   rules here do not allow one. "5 sources" says nothing until it says which
   five and when they are reachable.

   Set in sans. Mono in this system means the machine named the thing — a tool
   name, a path, a version — and a count is a fact about the software rather
   than a string it returns. A version *is* one, which is why `note` takes a
   template and a version inside it sets in `sds-mono` like anywhere else. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

export interface StatProps {
  /** The figure. Concrete — "5", "240 ms", "12.4+" — never "many". */
  value: string;
  /** What was counted, in the label register. */
  label: string;
  /** What the figure is bounded by. Without one, the number is a boast. */
  note?: string | TemplateResult;
}

export class SdsStat extends SdsElement {
  static override properties = {
    value: { type: String },
    label: { type: String },
    note: { type: String },
  };

  declare value: string;
  declare label: string;
  declare note: string | TemplateResult;

  constructor() {
    super();
    this.value = '';
    this.label = '';
    this.note = '';
  }

  protected override render(): TemplateResult {
    return html`<div class="sds-stat">
  <div class="sds-stat__value">${this.value}</div>
  <div class="sds-label">${this.label}</div>
  ${this.note ? html`<div class="sds-stat__note">${this.note}</div>` : ''}
</div>`;
  }
}

define('sds-stat', SdsStat);
