/* sds-logos — who stands behind a claim, as a wall of their marks.

   The marks go between the tags: an `img`, or an `a` around one where the mark
   goes somewhere. Each `alt` is a name, because a mark says nothing to a reader
   who cannot see it.

   A mark is a picture with colours of its own, and it does not follow the mode.
   So each one stands on `--surface-art`, the ground those colours are for. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

export interface LogosProps {
  /** What the marks have in common: `Used by`, `Maintained with`. */
  label?: string;
}

export class SdsLogos extends SdsElement {
  static override properties = {
    label: { type: String },
  };

  declare label: string;

  /* The marks as a caller wrote them, taken before Lit renders over them. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.label = '';
  }

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    return html`<div class="sds-logos">
  ${this.label ? html`<div class="sds-eyebrow">${this.label}</div>` : ''}
  <div class="sds-logos__list">${this.taken ?? this.content}</div>
</div>`;
  }
}

define('sds-logos', SdsLogos);
