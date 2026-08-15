/* sds-eyebrow — the line over a title, saying what kind of thing it opens.

   The label register standing as a block in the title group: an eyebrow is
   read with the heading under it, so it carries the group's step itself.
   `sds-label` stays the word in a line — turning one into an eyebrow by
   position was a rule nobody could see in the markup. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

export interface EyebrowProps {
  label: string;
}

export class SdsEyebrow extends SdsElement {
  static override properties = {
    label: { type: String },
  };

  declare label: string;

  constructor() {
    super();
    this.label = '';
  }

  protected override render(): TemplateResult {
    return html`<div class="sds-eyebrow">${this.label}</div>`;
  }
}

define('sds-eyebrow', SdsEyebrow);
