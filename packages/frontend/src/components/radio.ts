/* sds-radio — one answer out of a few, all of them visible.

   The set is the component and a single button is not: what makes one a choice
   is the set it belongs to, the name they share and that exactly one holds, and
   rendering them one at a time leaves the caller to keep the three in step. So
   the element is named for the control and takes the whole question, with
   `<fieldset>` and `<legend>` carrying the grouping.

   Where the answers are many, or the reader knows the one they want, that is a
   select. Above roughly five the set stops being scannable. */

import { html, nothing, type TemplateResult } from 'lit';
import { define } from '../lib/element.ts';
import { SdsFormElement } from '../lib/form-element.ts';

/** One answer. `hint` is for the consequence a label cannot carry. */
export interface Choice {
  label: string;
  value?: string;
  /** What the choice commits to, where the legend cannot say it in a line. */
  hint?: string;
}

export interface RadioProps {
  /** What is being asked. Rendered as the `<legend>`. */
  legend: string;
  /** Where the page already draws the question — a dialog's title, a heading
      over the set. The legend is said and not drawn, so the set is still named
      and the question is not on the page twice. */
  legendSaidOnly?: boolean;
  /** What the answer is called when the form is sent. One name for the whole
      set — that is what makes it one choice rather than several. */
  name: string;
  /** The options, each with its label and what it sends — set from script,
      being a list. */
  choices: readonly Choice[];
  /** The chosen value, or the label where a choice has none. */
  value?: string;
  /** What the whole set commits to, under the legend. A choice carries its
      own where one answer needs saying and the others do not. */
  hint?: string;
  /** One of them has to be picked before the form goes. */
  required?: boolean;
}

export class SdsRadio extends SdsFormElement {
  static override properties = {
    legend: { type: String },
    legendSaidOnly: { type: Boolean, attribute: 'legend-said-only' },
    name: { type: String },
    choices: { type: Array },
    value: { type: String },
    hint: { type: String },
    required: { type: Boolean, reflect: true },
  };

  declare legend: string;
  declare legendSaidOnly: boolean;
  declare name: string;
  declare choices: readonly Choice[];
  declare value: string;
  declare hint: string;
  declare required: boolean;

  constructor() {
    super();
    this.legend = '';
    this.legendSaidOnly = false;
    this.name = '';
    this.choices = [];
    this.value = '';
    this.hint = '';
    this.required = false;
  }

  /* The answer the markup came with, which is what a reset puts back.
     `?checked` writes the `checked` *attribute* — the input's default — so
     mirroring the chosen value into it would make a reset restore the last
     click instead of the answer the page was drawn with. */
  #initial?: string;

  protected override willUpdate(): void {
    this.#initial ??= this.value;
  }

  /* The live state is written onto the control after the render, never as a
     binding. A `.checked` binding is serialised by the static renderer as
     `checked="false"` — which in HTML means checked — so every box on every
     generated card came out ticked. `?checked` stays: it writes the *default*,
     which is what a reset puts back. */
  protected override updated(): void {
    for (const input of this.querySelectorAll('input')) input.checked = input.value === this.value;
  }

  protected override restore(): void {
    this.value = this.#initial ?? '';
  }

  private choose(choice: Choice): void {
    this.value = choice.value ?? choice.label;
    this.dispatchEvent(
      new CustomEvent<string>('sds-change', { detail: this.value, bubbles: true, composed: true }),
    );
  }

  protected override render(): TemplateResult {
    return html`<fieldset class="sds-choices" name="${this.name || nothing}">
  <legend class="sds-field-label${this.legendSaidOnly ? ' sds-said-only' : ''}">${this.legend}${
    this.required ? html` <span class="sds-field-req">required</span>` : nothing
  }</legend>
  ${this.hint ? html`<span class="sds-field-hint">${this.hint}</span>` : nothing}
  ${this.choices.map((choice) => {
    const value = choice.value ?? choice.label;
    return html`<label class="sds-check">
    <input
      class="sds-check__mark"
      type="radio"
      name="${this.name}"
      value="${value}"
      ?checked="${value === (this.#initial ?? this.value)}"
      ?required="${this.required}"
      @change="${() => this.choose(choice)}"
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

define('sds-radio', SdsRadio);
