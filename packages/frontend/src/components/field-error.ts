/* sds-field-error — what is said when a field is wrong.

   Under or beside the field, never as a tooltip: an error the pointer has to
   find is an error the keyboard never surfaces at all. It carries its own
   glyph, because colour alone is not a message.

   Its own element rather than a slot on the field: an error is often written
   by whatever validated the value, which is not always what drew the box. */

import { html, type TemplateResult } from 'lit';
import './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

/** The message under an invalid field. Never a tooltip — an error the
    pointer has to find is an error the keyboard never surfaces at all. */
export class SdsFieldError extends SdsElement {
  static override properties = { message: { type: String } };
  declare message: string;

  constructor() {
    super();
    this.message = '';
  }

  protected override render(): TemplateResult {
    return html`<span class="sds-field-error"><sds-icon name="actions-exclamation-circle"></sds-icon>${this.message}</span>`;
  }
}

define('sds-field-error', SdsFieldError);
