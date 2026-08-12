/* sds-drawer — from the right, full height, and carrying no shadow either.

   A drawer is where something is worked on beside the page rather than
   instead of it. Like the modal it is positioned by whatever opens it, and
   like the modal it is a surface and not a behaviour.

   Its width is a property because a drawer is as wide as what it holds — a
   list of identifiers and a form are not the same drawer. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

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

define('sds-drawer', SdsDrawer);
