/* sds-accordion-item — one question, and the blocks folded behind it.

   The pair is the whole component, the way `sds-tab-item` pairs a tab with
   its panel. Written apart, the caller has to keep the two in step. The
   question is a property because it fits in one. The answer goes between the
   tags, because no attribute can carry paragraphs, lists and code blocks —
   which is exactly what a documentation renderer hands over.

   Which set it folds in is `name`, and `sds-accordion` says it. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export class SdsAccordionItem extends SdsElement {
  static override properties = {
    question: { type: String, reflect: true },
    /** Open. For the first answer on a page of them, usually, so the shape
        of an answer is visible before any press. */
    open: { type: Boolean, reflect: true },
    /** The set this answer folds in — `<details name>`, which is the platform's
        own exclusivity. Empty where the set says `multiple`. */
    name: { type: String, reflect: true },
    /** The address of this one answer. It lands on the answer and not on the
        question. The platform opens a fold when a jump lands *inside* it, and
        one the jump lands *at* stays shut. */
    anchor: { type: String, reflect: true },
  };

  /** The question, which is the row a reader presses. The answer goes
      between the tags. */
  declare question: string;
  /** If this one stands open. A `<details>` underneath, so it opens before
      any script and a reader who printed the page gets the answer too. */
  declare open: boolean;
  /** The group it belongs to. Entries sharing a name open one at a time,
      which is the platform’s own exclusive accordion. */
  declare name: string;
  /** The id the row is reachable at, so a link can name one answer in a page
      of them. */
  declare anchor: string;

  private taken: Node[] | null = null;

  constructor() {
    super();
    this.question = '';
    this.open = false;
    this.name = '';
    this.anchor = '';
  }

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  /* The browser unfolds an answer a fragment points into and scrolls to it,
     before any of this runs. Then the upgrade writes that answer again, and
     the arrival goes with the node it happened to. Made once more here, by
     the element that took it away. */
  protected override firstUpdated(): void {
    if (!this.anchor || globalThis.location?.hash !== `#${this.anchor}`) return;
    this.open = true;
    void this.updateComplete.then(() =>
      requestAnimationFrame(() => this.querySelector(`#${CSS.escape(this.anchor)}`)?.scrollIntoView()),
    );
  }

  protected override render(): TemplateResult {
    return html`<details
    class="sds-accordion__item"
    name="${this.name || nothing}"
    ?open="${this.open}"
  >
    <summary class="sds-accordion__head"><sds-icon name="actions-chevron-down"></sds-icon>${this.question}</summary>
    <div class="sds-accordion__body" id="${this.anchor || nothing}">${this.taken ?? this.content}</div>
  </details>`;
  }
}

define('sds-accordion-item', SdsAccordionItem);
