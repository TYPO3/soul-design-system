/* sds-dialog — a modal that is actually a dialog.

   `sds-modal` draws the surface, which is what a card can document: a card is a
   still picture and has nothing to open. This is the behaviour — opening,
   taking the focus and giving it back, Escape, the page behind it inert — on
   the platform's `<dialog>`, which does all of it correctly.

   Deliberately not one component: a dialog that had to be opened to be drawn
   would be undocumentable, and a surface that grabbed the focus unusable in a
   specimen. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { buttonClass, buttonLabel, type SdsCommand } from './button.ts';
import { lines } from '../lib/template.ts';
import { modalClass, type ModalSize } from './modal.ts';
import { define, SdsElement } from '../lib/element.ts';

/** What kind of press the confirming button is: the work the question is for,
    or the one that cannot be undone. */
export type DialogTone = 'primary' | 'danger';

/* What the confirming button submits. The pair is a `<form method="dialog">`,
   so the platform puts this in `returnValue` and everything else — Escape, the
   X, a `close()` — leaves it empty. */
const CONFIRM = 'confirm';

export interface DialogProps {
  /** The question it asks, which is the whole reason it opened. */
  heading: string;
  /** What the reader needs in order to answer it. At `auto` a modal stops at
      `--measure-modal` because what is in one is read rather than looked at. */
  body: string | TemplateResult;
  /** Rendered buttons. Ghost first, primary last — the destructive-free
      order the rest of the system reads in. */
  actions?: readonly TemplateResult[];
  /** The label of the button that answers yes, and the whole of what a
      confirmation needs: written, the dialog draws its own pair and announces
      what was pressed, so asking a question takes no script at all. */
  confirmLabel?: string;
  /** A glyph on that button, ahead of its label — the press that carries the
      consequence is the one worth marking. The way out stays a word: two
      marked buttons beside each other is a pair nothing distinguishes. */
  confirmIcon?: string;
  /** The way out, beside it. */
  cancelLabel?: string;
  /** What kind of press the confirming one is. */
  tone?: DialogTone;
  /** How much room it takes, in both directions. `auto` is the content's own
      width up to the reading measure; a named size is the same shape wherever
      it is used, which is what keeps every dialog in the system one family. */
  size?: ModalSize;
  /** A width of its own, where the question needs one — the exception the
      scale cannot answer, and the one place a dialog carries a number. */
  width?: number;
  /** Whether it stands over the page. It is a real `<dialog>`, so opening
      makes the rest inert and closing puts the focus back where it came
      from. */
  open?: boolean;
}

export class SdsDialog extends SdsElement {
  static override properties = {
    heading: { type: String },
    body: { type: String },
    actions: { type: Array },
    confirmLabel: { type: String, attribute: 'confirm-label' },
    confirmIcon: { type: String, attribute: 'confirm-icon' },
    cancelLabel: { type: String, attribute: 'cancel-label' },
    tone: { type: String, reflect: true },
    size: { type: String, reflect: true },
    width: { type: Number, reflect: true },
    open: { type: Boolean, reflect: true },
  };

  declare heading: string;
  declare body: string | TemplateResult;
  declare actions: readonly TemplateResult[];
  declare confirmLabel: string;
  declare confirmIcon: string;
  declare cancelLabel: string;
  declare tone: DialogTone;
  declare size: ModalSize;
  declare width: number;
  declare open: boolean;

  constructor() {
    super();
    this.heading = '';
    this.body = '';
    this.actions = [];
    this.confirmLabel = '';
    this.confirmIcon = '';
    this.cancelLabel = 'Cancel';
    this.tone = 'primary';
    /* A dialog asking one question is the small one; anything else says so. */
    this.size = 'sm';
    this.width = 0;
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

  /* What a button pointed at this one asks for. An id and an event, so neither
     end holds the other and the question is opened from markup rather than
     from a script that has to find both of them. */
  private readonly onCommand = (event: CustomEvent<SdsCommand>): void => {
    const command = event.detail?.command ?? 'show';
    if (command === 'close') this.close();
    else if (command === 'toggle') (this.open ? this.close() : this.show());
    else this.show();
  };

  /* What the reader answered, read off the platform. Dispatched on every
     close, because a question dismissed is an answer a caller has to act on
     just as much as one pressed. */
  private readonly onClose = (): void => {
    const confirmed = this.dialog?.returnValue === CONFIRM;
    this.open = false;
    this.dispatchEvent(
      confirmed
        ? new CustomEvent('sds-dialog-confirm', { bubbles: true, composed: true })
        : new CustomEvent('sds-dialog-cancel', { bubbles: true, composed: true }),
    );
  };

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

  /** Open it and settle on what the reader chose — `show()` for a caller that
      has to wait for the answer rather than hear about it. */
  ask(): Promise<boolean> {
    return new Promise<boolean>((settle) => {
      const heard = (event: Event): void => {
        this.removeEventListener('sds-dialog-confirm', heard);
        this.removeEventListener('sds-dialog-cancel', heard);
        settle(event.type === 'sds-dialog-confirm');
      };
      this.addEventListener('sds-dialog-confirm', heard);
      this.addEventListener('sds-dialog-cancel', heard);
      this.show();
    });
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
      /* Cleared at every opening: `returnValue` outlives a close, and a second
         question dismissed with Escape would otherwise report the first one's
         answer. */
      if (this.open && !el.open) {
        el.returnValue = '';
        el.showModal();
      }
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
      class="${modalClass(this.size)}"
      style="${this.width > 0 ? `width:${this.width}px` : ''}"
      aria-label="${this.heading}"
      @close="${this.onClose}"
    >
  <div class="sds-modal__head">
    <span class="sds-modal__title">${this.heading}</span>
    <button class="sds-btn sds-btn--ghost sds-btn--sm sds-btn--icon sds-modal__close" title="Close" @click="${() => this.close()}"><sds-icon name="actions-close"></sds-icon></button>
  </div>
  <div class="sds-modal__body">${this.body}</div>
  ${this.foot()}
</dialog>`;
  }

  /* Buttons a caller wrote, or the pair a confirmation is: a `<form
     method="dialog">`, which is the platform answering the question itself —
     the press closes the dialog and leaves its value in `returnValue`, with no
     handler in between. At the control size the rest of the system writes,
     because what a dialog asks is the main action of the surface it opened. */
  private foot(): TemplateResult {
    if (this.actions.length || !this.confirmLabel) {
      return html`<div class="sds-modal__foot">
    ${lines(this.actions, 4)}
  </div>`;
    }
    const tone = this.tone === 'danger' ? 'danger' : 'primary';
    /* A glyph is a sibling of the label rather than inside it: the row's gap is
       what sets the two apart, and `<sds-icon>` with no name throws. */
    const glyph = this.confirmIcon ? html`<sds-icon name="${this.confirmIcon}"></sds-icon>` : '';
    return html`<form method="dialog" class="sds-modal__foot">
    <button class="${buttonClass({ variant: 'ghost' })}" type="submit" value="cancel">${buttonLabel(this.cancelLabel)}</button>
    <button class="${buttonClass({ variant: tone })}" type="submit" value="${CONFIRM}">${glyph}${buttonLabel(this.confirmLabel)}</button>
  </form>`;
  }
}

define('sds-dialog', SdsDialog);
