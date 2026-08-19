/* sds-switch — a setting that takes effect where it stands.

   A checkbox answers a question the form asks and is sent when the form is
   sent; a switch turns something on now. That is the whole difference, and it
   is why the two look nothing alike: a reader who has to press Save after
   flipping one has been told the wrong thing by the control.

   The platform's own `<input type="checkbox">` under `role="switch"`, painted
   here — so the keyboard, the tap target and how it reads out are the input's,
   and only the picture is ours. */

import { html, nothing, type TemplateResult } from 'lit';
import { define } from '../lib/element.ts';
import { SdsFormElement } from '../lib/form-element.ts';

export interface SwitchProps {
  /** What is on when it is on, in a line beside the track. */
  label: string;
  /** What turning it on does, where the label cannot say it in a line. */
  hint?: string;
  /** On or off. The property is the state, so a form reset puts back what the
      markup said rather than what was last pressed. */
  checked?: boolean;
  /** What it is called when a form carries it after all — a settings page is
      still a form. */
  name?: string;
  /** What it sends when it is on. `on` where nothing is written, which is the
      platform's own default. */
  value?: string;
  /** Present but not available, and the real attribute so nothing can press
      it. */
  disabled?: boolean;
}

export class SdsSwitch extends SdsFormElement {
  static override properties = {
    label: { type: String },
    hint: { type: String },
    checked: { type: Boolean, reflect: true },
    name: { type: String },
    value: { type: String },
    disabled: { type: Boolean, reflect: true },
  };

  declare label: string;
  declare hint: string;
  declare checked: boolean;
  declare name: string;
  declare value: string;
  declare disabled: boolean;

  constructor() {
    super();
    this.label = '';
    this.hint = '';
    this.checked = false;
    this.name = '';
    this.value = '';
    this.disabled = false;
  }

  /* What the markup said, which is what a reset puts back. `?checked` writes
     the `checked` *attribute* — the input's default — so mirroring the live
     state into it would make a reset restore the last press instead. */
  #initial?: boolean;

  protected override willUpdate(): void {
    this.#initial ??= this.checked;
  }

  /* The live state is written onto the control after the render, never as a
     binding. A `.checked` binding is serialised by the static renderer as
     `checked="false"` — which in HTML means checked — so every box on every
     generated card came out ticked. `?checked` stays: it writes the *default*,
     which is what a reset puts back. */
  protected override updated(): void {
    const input = this.querySelector('input');
    if (input) input.checked = this.checked;
  }

  protected override restore(): void {
    this.checked = this.#initial ?? false;
  }

  private onChange(event: Event): void {
    this.checked = (event.target as HTMLInputElement).checked;
    this.dispatchEvent(
      new CustomEvent<boolean>('sds-change', { detail: this.checked, bubbles: true, composed: true }),
    );
  }

  protected override render(): TemplateResult {
    return html`<label class="sds-switch">
  <input
    class="sds-switch__track"
    type="checkbox"
    role="switch"
    name="${this.name || nothing}"
    value="${this.value || nothing}"
    ?checked="${this.#initial ?? this.checked}"
    ?disabled="${this.disabled}"
    @change="${this.onChange}"
  />
  <span class="sds-switch__body">
    <span class="sds-switch__label">${this.label}</span>
    ${this.hint ? html`<span class="sds-switch__hint">${this.hint}</span>` : nothing}
  </span>
</label>`;
  }
}

define('sds-switch', SdsSwitch);
