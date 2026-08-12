/* sds-checkbox — one thing that is either so or not.

   The platform's own control in this system's colours, not a box with a glyph
   in it: the stylesheet takes the paint and leaves the keyboard, the tap
   target, the indeterminate state and how it all reads out with the input. A
   set where exactly one may be true is `sds-radio-group` — a different
   question, a different control.

   A real `<label>` wraps both, so the words are part of the target: a 16px box
   is hard to hit and the sentence beside it is not. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

export interface CheckboxProps {
  label: string;
  /** What ticking it commits to, where the label cannot say it in a line. */
  hint?: string;
  checked?: boolean;
  /** Neither on nor off: the box stands for a set only some of which is
      ticked. Ticking it resolves to on, the way the platform resolves it. */
  indeterminate?: boolean;
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
    indeterminate: { type: Boolean, reflect: true },
    name: { type: String },
    value: { type: String },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  declare label: string;
  declare hint: string;
  declare checked: boolean;
  declare indeterminate: boolean;
  declare name: string;
  declare value: string;
  declare required: boolean;
  declare disabled: boolean;

  constructor() {
    super();
    this.label = '';
    this.hint = '';
    this.checked = false;
    this.indeterminate = false;
    this.name = '';
    this.value = '';
    this.required = false;
    this.disabled = false;
  }

  /* Ticking is what makes it checked. A caller that had to write the state
     back is a caller that will forget once — and a mixed box that is ticked is
     no longer mixed, which the input has already decided by the time this runs. */
  private onChange(event: Event): void {
    this.checked = (event.target as HTMLInputElement).checked;
    this.indeterminate = false;
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
    .indeterminate="${this.indeterminate}"
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
