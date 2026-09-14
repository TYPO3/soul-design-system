/* sds-modal — the surface that asks for a decision.

   The system has no shadows, so the wash `sds-overlay` draws and a hairline
   tell a modal from the plane below it. Whatever opens it places it. The host
   is `display: contents` and not in the box tree, so those styles land on the
   element with a box.

   This is the surface alone. The open, the inert page and the focus that
   comes back are `sds-dialog`, which uses the platform's `<dialog>` to get
   all three. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { lines } from '../lib/template.ts';
import { define, SdsElement } from '../lib/element.ts';

export type ModalSize = 'auto' | 'sm' | 'md' | 'lg';

/** The classes a surface of that size is.

    A size is a shape rather than a width: how wide the surface is, and how tall
    before the body scrolls. Named rather than interpolated — a word this layer
    has no size for otherwise becomes a class nothing defines. */
export const modalClass = (size: ModalSize): string =>
  size === 'sm' || size === 'md' || size === 'lg' ? `sds-modal sds-modal--${size}` : 'sds-modal';

export class SdsModal extends SdsElement {
  static override properties = {
    heading: { type: String },
    body: { type: String },
    /** Rendered buttons. Ghost first, primary last — the destructive-free
        order the rest of the system reads in. */
    actions: { type: Array },
    size: { type: String, reflect: true },
    width: { type: Number, reflect: true },
  };

  /** What the surface is about, at the top of it. */
  declare heading: string;
  /** What the reader has to take in. At `auto` it stops at `--measure-modal`,
      because a reader reads what is in a modal. */
  declare body: string | TemplateResult;
  /** The controls along the bottom, set from script — being markup, which an
      attribute cannot carry. */
  declare actions: readonly TemplateResult[];
  /** How much room it takes, in both directions. `auto` is the content's own
      width up to the reading measure. The named sizes are the same shape
      everywhere, which keeps a system's surfaces one family. */
  declare size: ModalSize;
  /** A width of its own where the content needs one — the exception the scale
      cannot answer, and the one place a modal carries a number. */
  declare width: number;

  constructor() {
    super();
    this.heading = '';
    this.body = '';
    this.actions = [];
    /* A surface asking one question is the small one; anything else says so. */
    this.size = 'sm';
    this.width = 0;
  }

  protected override render(): TemplateResult {
    /* A width only on request: without it the size decides, and an empty
       declaration is what lets the class do that. */
    const width = this.width > 0 ? ` width:${this.width}px` : '';
    return html`<div class="${modalClass(this.size)}" style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);${width}">
  <div class="sds-modal__head">
    <span class="sds-modal__title">${this.heading}</span>
    <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon sds-modal__close" title="Close"><sds-icon name="actions-close"></sds-icon></button>
  </div>
  <div class="sds-modal__body">${this.body}</div>
  <div class="sds-modal__foot">
    ${lines(this.actions, 4)}
  </div>
</div>`;
  }
}

define('sds-modal', SdsModal);
