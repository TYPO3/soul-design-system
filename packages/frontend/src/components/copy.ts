/* sds-copy — a value the reader takes away.

   A path, a database name, a password. What it says in the machine's own font,
   and the button that puts it on the clipboard, on one line.

   `sds-code` is the other shape and the wrong one here. It frames a fence and
   gives it a head. Around a single word that head is a bar with nothing in it
   but the word "copy". Four of them down a column is four frames for four
   words. A block is for a block. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { define, SdsElement } from '../lib/element.ts';
import { SAID, toClipboard } from '../lib/clipboard.ts';

/** Which end of a value gives way, where it draws one line high. */
export type CopyEllipsis = 'none' | 'start' | 'end';

export interface CopyProps {
  /** What shows, and the whole of what the button writes. */
  value: string;
  /** What the value is, so somebody who cannot see which line each button is
      on can tell four of them apart. It is the tooltip and the accessible
      name from the one property. Without it the button says only that it
      copies, which is true and names nothing. */
  label?: string;
  /** Where the cut goes when the column is too narrow for the value, instead
      of a wrap. `start` keeps the name a path ends on, `end` keeps the root it
      begins at. Off by default — a value that wraps under itself is still
      readable whole, which a cut one is not. */
  ellipsis?: CopyEllipsis;
}

export class SdsCopy extends SdsElement {
  static override properties = {
    value: { type: String },
    label: { type: String },
    ellipsis: { type: String },
    copied: { type: Boolean, state: true },
  };

  declare value: string;
  declare label: string;
  declare ellipsis: CopyEllipsis;
  declare copied: boolean;

  constructor() {
    super();
    this.value = '';
    this.label = '';
    this.ellipsis = 'none';
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
       in a list of values. The word beside every one of them is the same word
       four times, which is furniture rather than a label. */
    const said = this.label ? `Copy ${this.label}` : 'Copy this value';
    /* Always drawn. A question to the browser about its clipboard left no
       button on every origin outside a secure context — see
       `lib/clipboard.ts`. */
    const button = html`<button
      type="button"
      class="sds-btn sds-btn--ghost sds-btn--icon sds-btn--sm sds-copy__button${this.copied ? ' is-copied' : ''}"
      title="${said}"
      aria-label="${said}"
      @click="${() => void this.take()}"
    ><sds-icon name="${this.copied ? 'actions-check' : 'actions-duplicate'}"></sds-icon></button>`;

    /* One line, cut at the end the caller named. The hidden part is still
       under the pointer, and the press writes the property rather than the
       visible text, so a cut value copies whole. */
    const cut = this.ellipsis === 'start' || this.ellipsis === 'end'
      ? ` sds-copy--ellipsis-${this.ellipsis}`
      : '';

    /* And said again where a reader can only hear it. The word above changed,
       but a screen reader announces no word that changes in place. It does
       announce `role="status"` on a node that was empty. */
    return html`<span class="sds-copy${cut}">
  <span class="sds-copy__value" title="${cut ? this.value : nothing}"><bdi>${this.value}</bdi></span>
  ${button}
  <span class="sds-said-only" role="status">${this.copied ? said.replace(/^Copy/, 'Copied') : ''}</span>
</span>`;
  }
}

define('sds-copy', SdsCopy);
