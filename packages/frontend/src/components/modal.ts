/* sds-modal — the surface a decision is asked on.

   The system has no shadows, so a modal is told apart from the plane below it
   by the wash `sds-overlay` draws and by a hairline. It is positioned by
   whatever opens it: the host is `display: contents` and is not in the box
   tree, so those styles land on the element that is actually laid out.

   This is the surface alone. Opening one, making the rest of the page inert
   and returning the focus is `sds-dialog`, which uses the platform's
   `<dialog>` to get all three. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { lines } from '../lib/template.ts';
import { define, SdsElement } from '../lib/element.ts';

export class SdsModal extends SdsElement {
  static override properties = {
    heading: { type: String },
    body: { type: String },
    /** Rendered buttons. Ghost first, primary last — the destructive-free
        order the rest of the system reads in. */
    actions: { type: Array },
    width: { type: Number, reflect: true },
  };

  declare heading: string;
  declare body: string | TemplateResult;
  declare actions: readonly TemplateResult[];
  declare width: number;

  constructor() {
    super();
    this.heading = '';
    this.body = '';
    this.actions = [];
    /* Centred, 560px at most — this is the width the specimen documents. */
    this.width = 330;
  }

  protected override render(): TemplateResult {
    return html`<div class="sds-modal" style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:${this.width}px">
  <div class="sds-modal__head">
    <span>${this.heading}</span>
    <span style="color:var(--text-muted);"><sds-icon name="actions-close"></sds-icon></span>
  </div>
  <div class="sds-modal__body">${this.body}</div>
  <div class="sds-modal__foot">
    ${lines(this.actions, 4)}
  </div>
</div>`;
  }
}

define('sds-modal', SdsModal);
