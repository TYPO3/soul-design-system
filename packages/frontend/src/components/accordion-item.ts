/* sds-accordion-item — one question, and the blocks folded behind it.

   The pairing is the whole component, the way `sds-tab-item` pairs a tab with
   its panel: written apart, keeping the two in step is the caller's problem.
   The question is a property because it fits in one; the answer goes between
   the tags, because paragraphs, lists and code blocks are what no attribute can
   carry — which is exactly what a documentation renderer hands over.

   Which set it folds in is `name`, and `sds-accordion` says it. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export class SdsAccordionItem extends SdsElement {
  static override properties = {
    question: { type: String, reflect: true },
    /** Standing open. For the first answer on a page of them, usually, so the
        shape of an answer is visible without pressing anything. */
    open: { type: Boolean, reflect: true },
    /** The set this answer folds in — `<details name>`, which is the platform's
        own exclusivity. Empty where the set was told `multiple`. */
    name: { type: String, reflect: true },
  };

  declare question: string;
  declare open: boolean;
  declare name: string;

  private taken: Node[] | null = null;

  constructor() {
    super();
    this.question = '';
    this.open = false;
    this.name = '';
  }

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    return html`<details
    class="sds-accordion__item"
    name="${this.name || nothing}"
    ?open="${this.open}"
  >
    <summary class="sds-accordion__head"><sds-icon name="actions-chevron-down"></sds-icon>${this.question}</summary>
    <div class="sds-accordion__body">${this.taken ?? this.content}</div>
  </details>`;
  }
}

define('sds-accordion-item', SdsAccordionItem);
