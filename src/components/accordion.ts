/* sds-accordion — questions with their answers folded behind them.

   `<details>` and `<summary>`, like the rail's sections: the fold works before
   any script runs, the keyboard reaches it, and find-in-page opens the one it
   lands in. A button drawn to look like a summary looks identical and has none
   of that. Exclusive through `name` rather than a listener, so the platform
   closes the others; `multiple` where the answers are meant to be compared.

   For a list of questions. Where the folded part is the point — a log, a stack
   trace — one `<details>` in the document needs no component. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

/** One question. `open` is for the one a page wants standing open — the first
    answer on a page of them, usually, so the shape of an answer is visible
    without pressing anything. */
export interface Entry {
  question: string;
  answer: string | TemplateResult;
  open?: boolean;
}

export interface AccordionProps {
  entries: readonly Entry[];
  /** More than one at a time. The platform's own exclusivity is otherwise on,
      and it is on because a list is easier to read than a wall. */
  multiple?: boolean;
  /** What the set is called, where the page has several. Two exclusive groups
      on one page must not close each other's answers. */
  name?: string;
}

export class SdsAccordion extends SdsElement {
  static override properties = {
    entries: { type: Array },
    multiple: { type: Boolean, reflect: true },
    name: { type: String },
  };

  declare entries: readonly Entry[];
  declare multiple: boolean;
  declare name: string;

  constructor() {
    super();
    this.entries = [];
    this.multiple = false;
    this.name = 'sds-accordion';
  }

  protected override render(): TemplateResult {
    return html`<div class="sds-accordion">
  ${this.entries.map(
    (entry) => html`<details
    class="sds-accordion__item"
    name="${this.multiple ? nothing : this.name}"
    ?open="${Boolean(entry.open)}"
  >
    <summary class="sds-accordion__head"><sds-icon name="actions-chevron-down"></sds-icon>${entry.question}</summary>
    <div class="sds-accordion__body">${entry.answer}</div>
  </details>`,
  )}
</div>`;
  }
}

define('sds-accordion', SdsAccordion);
