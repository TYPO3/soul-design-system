/* sds-checkbox — one thing that is either so or not.

   The platform's own control in this system's colours, not a box with a glyph
   in it: a replacement re-implements the keyboard, the tap target, the
   indeterminate state and how it all reads out, and skips whichever part nobody
   on the team tests with. A set where exactly one may be true is
   `sds-radio-group` — a different question, a different control.

   A real `<label>` wraps both, so the words are part of the target: a 16px box
   is hard to hit and the sentence beside it is not. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

export interface CheckboxProps {
  label: string;
  /** What ticking it commits to, where the label cannot say it in a line. */
  hint?: string;
  checked?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
}

export class SdsCheckbox extends SdsElement {
  static override properties = {
    label: { type: String },
    hint: { type: String },
    checked: { type: Boolean, reflect: true },
    name: { type: String },
    value: { type: String },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  declare label: string;
  declare hint: string;
  declare checked: boolean;
  declare name: string;
  declare value: string;
  declare required: boolean;
  declare disabled: boolean;

  constructor() {
    super();
    this.label = '';
    this.hint = '';
    this.checked = false;
    this.name = '';
    this.value = '';
    this.required = false;
    this.disabled = false;
  }

  /* Ticking is what makes it checked. A caller that had to write the state
     back is a caller that will forget once. */
  private onChange(event: Event): void {
    this.checked = (event.target as HTMLInputElement).checked;
    this.dispatchEvent(
      new CustomEvent<boolean>('sds-change', { detail: this.checked, bubbles: true, composed: true }),
    );
  }

  protected override render(): TemplateResult {
    return html`<label class="sds-check">
  <input
    class="sds-check__mark"
    type="checkbox"
    name="${this.name || nothing}"
    value="${this.value || nothing}"
    ?checked="${this.checked}"
    ?required="${this.required}"
    ?disabled="${this.disabled}"
    @change="${this.onChange}"
  />
  <span class="sds-check__body">
    <span class="sds-check__label">${this.label}</span>
    ${this.hint ? html`<span class="sds-check__hint">${this.hint}</span>` : nothing}
  </span>
</label>`;
  }
}

define('sds-checkbox', SdsCheckbox);
