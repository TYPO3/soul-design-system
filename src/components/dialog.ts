/* sds-dialog — a modal that is actually a dialog.

   `sds-modal` draws the modal *surface*: a box, a head, a body, a foot, and
   an overlay behind it. That is what the specimen card documents and what
   the design guide needs, because a card is a still picture and has nothing
   to open.

   A product needs the behaviour as well: something that opens, takes the
   focus, gives it back, closes on Escape, and tells assistive tech that the
   page behind it is inert. That is a different job, and this is it. It uses
   the platform's own `<dialog>`, which already does all of that correctly
   and is a great deal harder to get right by hand than it looks.

   The two are deliberately not one component. A dialog that could not be
   drawn without being opened would be undocumentable, and a surface that
   grabbed the focus would be unusable in a specimen. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import './button.ts';
import { lines } from '../lib/template.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface DialogProps {
  heading: string;
  body: string | TemplateResult;
  /** Rendered buttons. Ghost first, primary last — the destructive-free
      order the rest of the system reads in. */
  actions?: readonly TemplateResult[];
  width?: number;
  open?: boolean;
}

export class SdsDialog extends SdsElement {
  static override properties = {
    heading: { type: String },
    body: { type: String },
    actions: { type: Array },
    width: { type: Number, reflect: true },
    open: { type: Boolean, reflect: true },
  };

  declare heading: string;
  declare body: string | TemplateResult;
  declare actions: readonly TemplateResult[];
  declare width: number;
  declare open: boolean;

  constructor() {
    super();
    this.heading = '';
    this.body = '';
    this.actions = [];
    /* Centred, 560px at most — the width the specimen documents. */
    this.width = 330;
    this.open = false;
  }

  private get dialog(): HTMLDialogElement | null {
    return this.querySelector('dialog');
  }

  /** Open it modally: the platform makes the rest of the page inert, moves
      the focus in, and traps it until this closes. */
  show(): void {
    this.open = true;
    /* After the render the property change queues, or there is no dialog
       element to call yet. */
    void this.updateComplete.then(() => {
      const el = this.dialog;
      if (el && !el.open) el.showModal();
    });
  }

  close(): void {
    this.dialog?.close();
    this.open = false;
  }

  protected override updated(): void {
    const el = this.dialog;
    if (!el) return;

    /* `showModal()` throws if the element is not in the document — and on the
       first update it need not be yet, depending on when the host was
       appended. An exception here breaks the update cycle and the component
       renders nothing at all, which is how a story that merely opens on load
       came out blank. */
    if (!this.isConnected) return;

    try {
      if (this.open && !el.open) el.showModal();
      if (!this.open && el.open) el.close();
    } catch {
      /* Not modal, but visible and still a dialog: better than nothing on the
         screen. The platform will make it modal on the next open. */
      if (this.open) el.setAttribute('open', '');
    }
  }

  protected override render(): TemplateResult {
    /* `<dialog>` carries the semantics; the `sds-modal` classes carry the
       look. One surface, described once in `components.css`, whether it is
       drawn in a specimen or opened in a product. */
    return html`<dialog
      class="sds-modal"
      style="width:${this.width}px"
      aria-label="${this.heading}"
      @close="${() => {
        this.open = false;
      }}"
    >
  <div class="sds-modal__head">
    <span>${this.heading}</span>
    <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" title="Close" @click="${() => this.close()}"><sds-icon name="actions-close"></sds-icon></button>
  </div>
  <div class="sds-modal__body">${this.body}</div>
  <div class="sds-modal__foot">
    ${lines(this.actions, 4)}
  </div>
</dialog>`;
  }
}

define('sds-dialog', SdsDialog);
