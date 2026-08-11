/* sds-accordion — questions with their answers folded behind them.

   `<details>` and `<summary>`, for the same reason the rail's sections are:
   the fold works before any script has run, the keyboard reaches it because it
   is a real disclosure, and find-in-page opens the one it lands in. A button
   drawn to look like a summary has none of that and looks identical.

   Exclusive by default, through `name` on the details rather than through a
   listener: the platform closes the others itself. A set where every answer
   can be open at once is a set the reader has to close by hand to see the
   list again — which is what they came for. Where the answers are meant to be
   compared, `multiple` says so.

   What it is *for* is a list of questions. Anything where the folded part is
   the point — a log, a stack trace, a diff — is not this: it is one `details`
   in the flow of a document, and it does not need a component. */

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
