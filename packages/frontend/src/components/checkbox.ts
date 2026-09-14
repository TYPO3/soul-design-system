/* sds-checkbox — one thing that is either so or not.

   The platform's own control in this system's colours, not a box with a glyph
   in it. The stylesheet takes the paint and leaves the rest with the input:
   the keyboard, the tap target, the indeterminate state, the read-out. A set
   where exactly one can be true is `sds-radio` — a different
   question, a different control.

   A real `<label>` wraps both, so the words are part of the target. A 16px box
   is hard to hit and the sentence beside it is not. */

import { html, nothing, type TemplateResult } from 'lit';
import { define } from '../lib/element.ts';
import { SdsFormElement } from '../lib/form-element.ts';

export interface CheckboxProps {
  /** What ticking it means, in a line beside the box. */
  label: string;
  /** What ticking it commits to, where the label cannot say it in a line. */
  hint?: string;
  /** On or off. The property is the state, so a form reset puts back what
      the markup said rather than what was last pressed. */
  checked?: boolean;
  /** Neither on nor off: the box stands for a set with only some of it on.
      A tick resolves to on, the way the platform resolves it. */
  indeterminate?: boolean;
  /** The name it travels under when the form submits. */
  name?: string;
  /** What it sends when it is on. `on` where a caller writes nothing, which
      is the platform's own default. */
  value?: string;
  /** It must be on before the form goes. Said to everyone, not drawn as a
      mark beside the label. */
  required?: boolean;
  /** Present but not available, and the real attribute so nothing can press
      it. */
  disabled?: boolean;
}

export class SdsCheckbox extends SdsFormElement {
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

  /* What the markup said, which is what a reset puts back. `?checked` writes
     the `checked` *attribute* — the input's default — so a mirror of the live
     state into it makes a reset restore the last click instead. */
  #initial?: boolean;

  protected override willUpdate(): void {
    this.#initial ??= this.checked;
  }

  /* The live state goes onto the control after the render, never as a
     binding. The static renderer writes a `.checked` binding as
     `checked="false"`, which in HTML means checked. So every box on every
     generated card came out on. `?checked` stays: it writes the *default*,
     which is what a reset puts back. */
  protected override updated(): void {
    const input = this.querySelector('input');
    if (!input) return;
    input.checked = this.checked;
    input.indeterminate = this.indeterminate;
  }

  protected override restore(): void {
    this.checked = this.#initial ?? false;
  }

  /* A tick is what makes it checked. A caller that had to write the state
     back is a caller that will forget once. A mixed box with a tick is no
     longer mixed, which the input has already decided by the time this runs. */
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
    ?checked="${this.#initial ?? this.checked}"
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
