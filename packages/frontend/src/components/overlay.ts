/* sds-overlay — the wash a floating surface sits on.

   The system has no shadows. Without one an overlay needs a wash and a
   boundary to be an overlay *of* something. That is why the specimen draws
   the modal inside a bordered box rather than over the page.

   It is `--surface-overlay` and nothing else: what floats on it is a modal,
   and that is its own element. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

/** The wash a modal sits on — `--surface-overlay`, never a shadow. */
export class SdsOverlay extends SdsElement {
  protected override render(): TemplateResult {
    return html`<div class="sds-overlay"></div>`;
  }
}

define('sds-overlay', SdsOverlay);
