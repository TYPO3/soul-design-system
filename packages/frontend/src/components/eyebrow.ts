/* sds-eyebrow — the line over a title, saying what kind of thing it opens.

   The label register as a block in the title group. A reader reads an eyebrow
   with the heading under it, so it carries the group's step itself.
   `sds-label` stays the word in a line — a label turned eyebrow by position
   was a rule nobody can see in the markup. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

export interface EyebrowProps {
  /** The line itself — what kind of thing the title under it opens. */
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
