/* sds-radio-group — one answer out of a few, all of them visible.

   The group is the component and a single radio is not: what makes one a choice
   is the set it belongs to, the name they share and the fact that exactly one
   holds, and rendering them one at a time leaves the caller to keep the three
   in step. `<fieldset>` and `<legend>` carry the grouping, with the browser's
   border and padding taken away rather than restyled.

   Where the answers are many, or the reader knows the one they want, that is a
   select. Above roughly five the set stops being scannable. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

/** One answer. `hint` is for the consequence a label cannot carry. */
export interface Choice {
  label: string;
  value?: string;
  hint?: string;
}

export interface RadioGroupProps {
  /** What is being asked. Rendered as the `<legend>`. */
  legend: string;
  name: string;
  choices: readonly Choice[];
  /** The chosen value, or the label where a choice has none. */
  value?: string;
  hint?: string;
  required?: boolean;
}

export class SdsRadioGroup extends SdsElement {
  static override properties = {
    legend: { type: String },
    name: { type: String },
    choices: { type: Array },
    value: { type: String },
    hint: { type: String },
    required: { type: Boolean, reflect: true },
  };

  declare legend: string;
  declare name: string;
  declare choices: readonly Choice[];
  declare value: string;
  declare hint: string;
  declare required: boolean;

  constructor() {
    super();
    this.legend = '';
    this.name = '';
    this.choices = [];
    this.value = '';
    this.hint = '';
    this.required = false;
  }

  private choose(choice: Choice): void {
    this.value = choice.value ?? choice.label;
    this.dispatchEvent(
      new CustomEvent<string>('sds-change', { detail: this.value, bubbles: true, composed: true }),
    );
  }

  protected override render(): TemplateResult {
    return html`<fieldset class="sds-choices" name="${this.name || nothing}">
  <legend class="sds-field-label">${this.legend}${
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
      ?checked="${value === this.value}"
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

define('sds-radio-group', SdsRadioGroup);
