/* sds-lightbox — a drawing at the size it was drawn.

   The behaviour is the platform's `<dialog>`, exactly as `sds-dialog` uses it:
   it opens modally, makes the page behind it inert, takes the focus and gives
   it back, and closes on Escape. None of that is worth writing twice.

   The surface is not the modal's. A modal stops at `--measure-modal` because
   what is inside one is *read*; a drawing is looked at, and a 1200px diagram
   scaled into a page column is a picture of a diagram rather than the diagram.

   It shows the same file a figure does, referenced the same way — the viewer
   opening in the mode the reader is not in would be a strange way to discover
   that a drawing is drawn twice.

   Opening it is written in markup, by name:

     <sds-button for="the-drawing">Open the drawing</sds-button>
     <sds-lightbox id="the-drawing" src="…" alt="…"></sds-lightbox>

   `sds-figure` is the other way in and needs none of that: it owns the viewer
   it renders, so it calls `show()` on it. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
/* Type-only, and deliberately so: hearing a command must not drag the element
   that sends one into every page that opens a drawing. */
import type { SdsCommand } from './button.ts';
import { art } from '../lib/art.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface LightboxProps {
  src: string;
  alt: string;
  /** What the drawing claims, in the head — the same sentence the figure
      carries, so opening it is not a change of subject. */
  caption?: string;
  open?: boolean;
}

export class SdsLightbox extends SdsElement {
  static override properties = {
    src: { type: String },
    alt: { type: String },
    caption: { type: String },
    open: { type: Boolean, reflect: true },
  };

  declare src: string;
  declare alt: string;
  declare caption: string;
  declare open: boolean;

  constructor() {
    super();
    this.src = '';
    this.alt = '';
    this.caption = '';
    this.open = false;
  }

  private get dialog(): HTMLDialogElement | null {
    return this.querySelector('dialog');
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('sds-command', this.onCommand as EventListener);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('sds-command', this.onCommand as EventListener);
    super.disconnectedCallback();
  }

  /* What a button pointed at this one asks for. `sds-figure` opens its own
     viewer by calling `show()`, because it owns it; anything else names this
     element by id and sends the command, so opening a drawing is written in
     markup rather than in a script that has to find both ends. */
  private readonly onCommand = (event: CustomEvent<SdsCommand>): void => {
    const command = event.detail?.command ?? 'show';
    if (command === 'close') this.close();
    else if (command === 'toggle') (this.open ? this.close() : this.show());
    else this.show();
  };

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
    ${art(this.src, this.alt)}
  </div>
</dialog>`;
  }
}

define('sds-lightbox', SdsLightbox);
