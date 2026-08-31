/* sds-copy — a value the reader takes away.

   A path, a database name, a password: what it says in the machine's own font,
   and the button that puts it on the clipboard, on one line.

   `sds-code` is the other shape and the wrong one here. It frames a fence and
   gives it a head, and around a single word that head is a bar with nothing in
   it but the word "copy" — four of them down a column is four frames for four
   words. A block is for a block. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { define, SdsElement } from '../lib/element.ts';
import { SAID, toClipboard } from '../lib/clipboard.ts';

export interface CopyProps {
  /** What is shown, and the whole of what the button writes. */
  value: string;
  /** What the value is, so four buttons down a column can be told apart by
      somebody who cannot see which line each one is on. It is the tooltip and
      the accessible name from the one property — without it the button says
      only that it copies, which is true and names nothing. */
  label?: string;
}

export class SdsCopy extends SdsElement {
  static override properties = {
    value: { type: String },
    label: { type: String },
    copied: { type: Boolean, state: true },
  };

  declare value: string;
  declare label: string;
  declare copied: boolean;

  constructor() {
    super();
    this.value = '';
    this.label = '';
    this.copied = false;
  }

  private async take(): Promise<void> {
    if (!(await toClipboard(this.value))) return;
    this.copied = true;
    setTimeout(() => { this.copied = false; }, SAID);
  }

  protected override render(): TemplateResult {
    /* One glyph, and the sentence in `title` — which is the accessible name and
       the words under the pointer, both from the one attribute. A value stands
       in a list of values and the word beside every one of them is the same
       word four times, which is furniture rather than a label. */
    const said = this.label ? `Copy ${this.label}` : 'Copy this value';
    /* Always drawn. Asking the browser whether it has a clipboard and drawing
       nothing when it says no left no icon, no press and no hover on every
       origin that is not a secure context — see `lib/clipboard.ts`. */
    const button = html`<button
      type="button"
      class="sds-btn sds-btn--ghost sds-btn--icon sds-btn--sm sds-copy__button${this.copied ? ' is-copied' : ''}"
      title="${said}"
      aria-label="${said}"
      @click="${() => void this.take()}"
    ><sds-icon name="${this.copied ? 'actions-check' : 'actions-duplicate'}"></sds-icon></button>`;

    /* And said again where it can only be heard: the word above changed, but a
       word that changes in place is not announced, and `role="status"` on a
       node that was empty is. */
    return html`<span class="sds-copy">
  <span class="sds-copy__value">${this.value}</span>
  ${button}
  <span class="sds-said-only" role="status">${this.copied ? said.replace(/^Copy/, 'Copied') : ''}</span>
</span>`;
  }
}

define('sds-copy', SdsCopy);
