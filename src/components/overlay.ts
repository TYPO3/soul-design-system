/* Modal, overlay and drawer — the surfaces that float over a plane.

   The system has no shadows. That is the whole reason these three belong
   together and away from the planes in `card.ts`: without a shadow an
   overlay needs a wash and a boundary to be an overlay *of* something, which
   is why the specimen draws the modal inside a bordered box rather than
   floating it over the page.

   Each is positioned by whatever opens it, so the position is a property and
   not something the element decides. The host is `display: contents` and is
   not in the box tree, so those styles land on the element that is actually
   laid out. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { lines } from '../lib/template.ts';
import { define, SdsElement } from '../lib/element.ts';

/** The wash a modal or drawer sits on — `--surface-overlay`, never a shadow. */
export class SdsOverlay extends SdsElement {
  protected override render(): TemplateResult {
    return html`<div class="sds-overlay"></div>`;
  }
}

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

/** From the right, full height, and carrying no shadow either. */
export class SdsDrawer extends SdsElement {
  static override properties = {
    body: { type: String },
    width: { type: Number, reflect: true },
  };

  declare body: string | TemplateResult;
  declare width: number;

  constructor() {
    super();
    this.body = '';
    this.width = 120;
  }

  protected override render(): TemplateResult {
    return html`<div class="sds-drawer" style="position:absolute; right:0; top:0; bottom:0; width:${this.width}px">
  ${this.body}
</div>`;
  }
}

define('sds-overlay', SdsOverlay);
define('sds-modal', SdsModal);
define('sds-drawer', SdsDrawer);
