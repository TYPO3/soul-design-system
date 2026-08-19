/* sds-checkbox-group — tick any of these, under one question.

   `sds-checkbox` is one fact standing on its own; this is the other shape a
   set of boxes takes, and it is a different question: several answers under a
   legend, any number of them true. Written as loose checkboxes it is a heading
   that happens to sit above some rows — nothing binds them, so nothing reads
   them out as one question either.

   The set is the component, as it is for `sds-radio`, and for the same reason:
   the legend, the shared name and what is ticked are three things a caller
   would otherwise keep in step by hand. */

import { html, nothing, type TemplateResult } from 'lit';
import { define } from '../lib/element.ts';
import { SdsFormElement } from '../lib/form-element.ts';

/** One box of the set. */
export interface CheckChoice {
  label: string;
  /** What it sends when it is ticked. The label where there is none. */
  value?: string;
  /** What ticking it commits to, where the label cannot say it in a line. */
  hint?: string;
  /** On the list and not on offer. */
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  /** What is being asked. Rendered as the `<legend>`. */
  legend: string;
  /** What the answers are called when the form is sent. One name for the whole
      set, so a server reads them as a list. */
  name: string;
  /** The boxes, each with its label and what it sends — set from script, being
      a list. */
  choices: readonly CheckChoice[];
  /** Which of them are ticked, by value or by label where a choice has none. */
  values?: readonly string[];
  /** What the whole set commits to, under the legend. */
  hint?: string;
}

export class SdsCheckboxGroup extends SdsFormElement {
  static override properties = {
    legend: { type: String },
    name: { type: String },
    choices: { type: Array },
    values: { type: Array },
    hint: { type: String },
  };

  declare legend: string;
  declare name: string;
  declare choices: readonly CheckChoice[];
  declare values: readonly string[];
  declare hint: string;

  constructor() {
    super();
    this.legend = '';
    this.name = '';
    this.choices = [];
    this.values = [];
    this.hint = '';
  }

  /* What the markup ticked, which is what a reset puts back. `?checked` writes
     the boxes' *defaults*; mirroring the live set into them would make a reset
     restore the last click. */
  #initial?: readonly string[];

  protected override willUpdate(): void {
    this.#initial ??= this.values;
  }

  /* The live state is written onto the control after the render, never as a
     binding. A `.checked` binding is serialised by the static renderer as
     `checked="false"` — which in HTML means checked — so every box on every
     generated card came out ticked. `?checked` stays: it writes the *default*,
     which is what a reset puts back. */
  protected override updated(): void {
    for (const input of this.querySelectorAll('input')) input.checked = this.values.includes(input.value);
  }

  protected override restore(): void {
    this.values = this.#initial ?? [];
  }

  private toggle(value: string, on: boolean): void {
    const kept = this.values.filter((held) => held !== value);
    this.values = on ? [...kept, value] : kept;
    this.dispatchEvent(
      new CustomEvent<readonly string[]>('sds-change', { detail: this.values, bubbles: true, composed: true }),
    );
  }

  protected override render(): TemplateResult {
    return html`<fieldset class="sds-choices">
  <legend class="sds-field-label">${this.legend}</legend>
  ${this.hint ? html`<span class="sds-field-hint">${this.hint}</span>` : nothing}
  ${this.choices.map((choice) => {
    const value = choice.value ?? choice.label;
    return html`<label class="sds-check">
    <input
      class="sds-check__mark"
      type="checkbox"
      name="${this.name}"
      value="${value}"
      ?checked="${(this.#initial ?? this.values).includes(value)}"
      ?disabled="${choice.disabled ?? false}"
      @change="${(e: Event) => this.toggle(value, (e.target as HTMLInputElement).checked)}"
    />
    <span class="sds-check__body">
      <span class="sds-check__label">${choice.label}</span>
      ${choice.hint ? html`<span class="sds-check__hint">${choice.hint}</span>` : nothing}
    </span>
  </label>`;
  })}
</fieldset>`;
  }
}

define('sds-checkbox-group', SdsCheckboxGroup);
