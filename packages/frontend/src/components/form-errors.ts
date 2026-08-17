/* sds-form-errors — what stopped the form, at the top of it.

   Marking the fields is enough for a reader who sees the whole form at once and
   nothing at all for one who does not: a phone is sent back to a page that
   looks unchanged, a screen reader is told nothing happened.

   So the summary is where the reader lands — first, focusable, announced, every
   entry a link to the field it is about. It renders `sds-note` rather than
   drawing the error block again. */

import { html, type TemplateResult } from 'lit';
import './note.ts';
import { define, SdsElement } from '../lib/element.ts';

/** One failure: what is wrong, and which field it is about. */
export interface FormError {
  message: string;
  /** The id of the field. The entry is a link to it, so pressing it moves the
      focus to the control rather than to a heading above it. */
  for?: string;
}

export interface FormErrorsProps {
  /** What went wrong, each naming the field it belongs to — set from script,
      being a list. The summary is what a reader is sent to; the field says
      it again where the value is. */
  errors: readonly FormError[];
  /** What the form calls itself, so the heading names the thing that failed
      rather than saying "there were errors". */
  heading?: string;
  /** This is the result of a submit the reader just made, so send them to it.
      Left off, the summary is drawn and takes nothing — which is what a page
      returned by a server with its errors already in it needs. */
  announce?: boolean;
}

export class SdsFormErrors extends SdsElement {
  static override properties = {
    errors: { type: Array },
    heading: { type: String },
    announce: { type: Boolean, reflect: true },
  };

  declare errors: readonly FormError[];
  declare heading: string;
  declare announce: boolean;

  constructor() {
    super();
    this.errors = [];
    this.heading = '';
    this.announce = false;
  }

  /** Move the reader to the summary. A summary nobody is sent to is a summary
      nobody reads. */
  focusSummary(): void {
    (this.querySelector('.sds-form-errors') as HTMLElement | null)?.focus();
  }

  protected override updated(): void {
    /* Taking the focus is right after a submit and wrong on load, and the
       element cannot tell those apart — it is created by the same render in
       both cases. So the page says which happened, and the default is the one
       that moves nobody: a form sent back by a server with its errors already
       in it must not pull a reader out of wherever they were. */
    if (this.announce && this.errors.length) this.focusSummary();
  }

  protected override render(): TemplateResult {
    if (!this.errors.length) return html``;

    const count = this.errors.length;
    const heading = this.heading || `${count} ${count === 1 ? 'answer needs' : 'answers need'} changing`;

    /* `tabindex="-1"` so the focus can be sent here and nowhere else; `role`
       and `aria-live` so it is announced when it appears rather than only when
       it is reached. */
    return html`<div class="sds-form-errors" tabindex="-1" role="alert" aria-live="assertive">
  <sds-note
    tone="error"
    heading="${heading}"
    .body="${html`<span class="sds-form-errors__list">${this.errors.map(
      (error) => html`<a class="sds-link" href="#${error.for ?? ''}">${error.message}</a>`,
    )}</span>`}"
  ></sds-note>
</div>`;
  }
}

define('sds-form-errors', SdsFormErrors);
