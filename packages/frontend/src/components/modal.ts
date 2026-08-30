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

export type ModalSize = 'auto' | 'sm' | 'md' | 'lg';

/** The classes a surface of that size is.

    A size is a shape rather than a width: how wide the surface is, and how tall
    before the body scrolls. Named rather than interpolated — a word this layer
    has no size for would otherwise become a class nothing defines. */
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
      because what is in a modal is read. */
  declare body: string | TemplateResult;
  /** The controls along the bottom, set from script — being markup, which an
      attribute cannot carry. */
  declare actions: readonly TemplateResult[];
  /** How much room it takes, in both directions. `auto` is the content's own
      width up to the reading measure; the named sizes are the same shape
      wherever they are used, which is what keeps a system's surfaces one
      family. */
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
    /* A width only where one was asked for: without it the size decides, and
       an empty declaration is what lets the class do that. */
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
