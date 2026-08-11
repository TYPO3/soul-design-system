/* sds-lightbox — a drawing at the size it was drawn.

   The behaviour is the platform's `<dialog>`, exactly as `sds-dialog` uses it:
   it opens modally, makes the page behind it inert, takes the focus and gives
   it back, and closes on Escape. None of that is worth writing twice.

   The surface is not the modal's. A modal stops at `--measure-modal` because
   what is inside one is *read*; a drawing is looked at, and a 1200px diagram
   scaled into a page column is a picture of a diagram rather than the diagram.

   It shows the same two files a figure does, swapped by the same rule — the
   viewer opening in the mode the reader is not in would be a strange way to
   discover that the pair mechanism has two implementations. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface LightboxProps {
  src: string;
  dark?: string;
  alt: string;
  /** What the drawing claims, in the head — the same sentence the figure
      carries, so opening it is not a change of subject. */
  caption?: string;
  open?: boolean;
}

export class SdsLightbox extends SdsElement {
  static override properties = {
    src: { type: String },
    dark: { type: String },
    alt: { type: String },
    caption: { type: String },
    open: { type: Boolean, reflect: true },
  };

  declare src: string;
  declare dark: string;
  declare alt: string;
  declare caption: string;
  declare open: boolean;

  constructor() {
    super();
    this.src = '';
    this.dark = '';
    this.alt = '';
    this.caption = '';
    this.open = false;
  }

  private get dialog(): HTMLDialogElement | null {
    return this.querySelector('dialog');
  }

  show(): void {
    this.open = true;
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
    /* `showModal()` throws on an element that is not in the document yet, and
       an exception here breaks the update cycle and renders nothing at all. */
    if (!el || !this.isConnected) return;
    try {
      if (this.open && !el.open) el.showModal();
      if (!this.open && el.open) el.close();
    } catch {
      if (this.open) el.setAttribute('open', '');
    }
  }

  protected override render(): TemplateResult {
    const art = this.dark
      ? html`<img class="sds-art sds-art--light" src="${this.src}" alt="${this.alt}" />
      <img class="sds-art sds-art--dark" src="${this.dark}" alt="${this.alt}" />`
      : html`<img class="sds-art" src="${this.src}" alt="${this.alt}" />`;

    return html`<dialog
      class="sds-lightbox"
      aria-label="${this.caption || this.alt}"
      @close="${() => {
        this.open = false;
      }}"
    >
  <div class="sds-modal__head">
    <span>${this.caption || this.alt}</span>
    <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon" title="Close" @click="${() => this.close()}"><sds-icon name="actions-close"></sds-icon></button>
  </div>
  <div class="sds-lightbox__art">
    ${art}
  </div>
</dialog>`;
  }
}

define('sds-lightbox', SdsLightbox);
