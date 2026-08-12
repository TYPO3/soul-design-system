/* sds-accordion — questions with their answers folded behind them.

   `<details>` and `<summary>`, like the rail's sections: the fold works before
   any script runs, the keyboard reaches it, and find-in-page opens the one it
   lands in. A button drawn to look like a summary looks identical and has none
   of that. Exclusive through `name` rather than a listener, so the platform
   closes the others; `multiple` where the answers are meant to be compared.

   For a list of questions. Where the folded part is the point — a log, a stack
   trace — one `<details>` in the document needs no component. */

import { html, nothing, type TemplateResult } from 'lit';
import './accordion-item.ts';
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
  /** The questions, where a page has them as data. An answer that is blocks —
      what a documentation renderer hands over — is written between the tags as
      `sds-accordion-item` instead, and then this stays empty. */
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

  /** The questions written between the tags, for answers that are blocks
      rather than a string a property can hold. Taken before Lit renders over
      them, and handed back below. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.entries = [];
    this.multiple = false;
    this.name = 'sds-accordion';
  }

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    const held = this.taken ?? this.content;
    return html`<div class="sds-accordion">
  ${this.entries.length
    ? this.entries.map(
        (entry) => html`<sds-accordion-item
    question="${entry.question}"
    name="${this.multiple ? nothing : this.name}"
    ?open="${Boolean(entry.open)}"
    .content="${entry.answer}"
  ></sds-accordion-item>`,
      )
    : held}
</div>`;
  }

  /* A set is named once and `<details name>` wants that name on every answer in
     it, so the items written between the tags are told rather than a page
     saying it on each. Nothing runs here outside a browser: what a renderer
     writes ahead of one, it writes onto the items itself. */
  protected override updated(): void {
    const group = this.multiple ? '' : this.name;
    for (const item of this.querySelectorAll(':scope > .sds-accordion > sds-accordion-item')) {
      (item as HTMLElement & { name: string }).name = group;
    }
  }
}

define('sds-accordion', SdsAccordion);
