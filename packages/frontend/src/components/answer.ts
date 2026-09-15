/* sds-answer — one answer a decision can take, and what it means.

   The pair is the whole component, the way `sds-step` pairs a stop with
   its blocks. The letter and the name are properties because each fits in
   one. What the answer means goes between the tags: a sentence, or the
   blocks a paper needs to say it. See `sds-decision`. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, isBlank, SdsElement } from '../lib/element.ts';

export class SdsAnswer extends SdsElement {
  static override properties = {
    /** Its letter or number, as the paper cites it: `A`. */
    key: { type: String, reflect: true },
    /** What it is, in one line. `heading`, the name of every title here. */
    heading: { type: String, reflect: true },
    /** The one the paper recommends. The word after its name says it,
        and nothing else on the row changes. */
    recommended: { type: Boolean, reflect: true },
    /** The one the decision took. The word after the name, the disc
        around the letter, and the block reads it for the voice at its foot. */
    decided: { type: Boolean, reflect: true },
  };

  declare key: string;
  declare heading: string;
  declare recommended: boolean;
  declare decided: boolean;

  /** What stood between the tags, taken before Lit renders over them. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.key = '';
    this.heading = '';
    this.recommended = false;
    this.decided = false;
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    const held = this.taken ?? this.content;
    /* `role` because the box the set draws is one generic away from this
       one, as with a step. */
    return html`<div class="${this.decided ? 'sds-decision__answer is-decided' : 'sds-decision__answer'}" role="listitem">
    <span class="sds-decision__key">${this.key}</span>
    <div class="sds-decision__what">
      <p class="sds-decision__label">${this.heading}${this.recommended ? html` <span class="sds-label sds-decision__mark sds-decision__mark--recommended">recommended</span>` : nothing}${this.decided ? html` <span class="sds-label sds-decision__mark sds-decision__mark--decided">decided</span>` : nothing}</p>
      ${held ? html`<div class="sds-decision__body">${held}</div>` : nothing}
    </div>
  </div>`;
  }
}

define('sds-answer', SdsAnswer);
