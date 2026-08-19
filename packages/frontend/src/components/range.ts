/* sds-range — a value picked along a run of them.

   For a quantity where the *position* is the answer and the exact number is
   not: a zoom, a weight, a threshold somebody is feeling their way to. Where
   the number is what the reader knows, that is a field with `type="number"`,
   which can be typed into and pasted.

   The platform's own `<input type="range">`, painted here — so it is
   draggable, arrow-keyable and reads out as a slider, and only the track and
   the thumb are ours. The read-out is an `<output>`, because a slider with no
   number beside it is a value nobody can report. */

import { html, nothing, type TemplateResult } from 'lit';
import { define } from '../lib/element.ts';
import { SdsFormElement } from '../lib/form-element.ts';

export interface RangeProps {
  /** The visible label. Without one the slider is bare — right where the
      surface around it says what it moves — and it still owes `label`. */
  caption?: string;
  /** What it is called for anything that cannot see what it sits beside. */
  label?: string;
  /** What the value is called when the form is sent. */
  name?: string;
  /** The ends of the run and the distance between two stops. Strings, so a
      caller writes them the way the attribute takes them. */
  min?: string;
  max?: string;
  step?: string;
  /** Where it stands. */
  value?: string;
  /** What the number means, beside the read-out: `px`, `%`, `ms`. */
  unit?: string;
  /** What the answer has to be, under the control. */
  hint?: string;
  /** Present but not available. */
  disabled?: boolean;
  /** The control's id, so the label and the read-out point at it. */
  fieldId?: string;
}

export class SdsRange extends SdsFormElement {
  static override properties = {
    caption: { type: String },
    label: { type: String },
    name: { type: String },
    min: { type: String },
    max: { type: String },
    step: { type: String },
    value: { type: String },
    unit: { type: String },
    hint: { type: String },
    disabled: { type: Boolean, reflect: true },
    fieldId: { type: String, attribute: 'field-id' },
  };

  declare caption: string;
  declare label?: string;
  declare name: string;
  declare min: string;
  declare max: string;
  declare step: string;
  declare value: string;
  declare unit: string;
  declare hint: string;
  declare disabled: boolean;
  declare fieldId: string;

  constructor() {
    super();
    this.caption = '';
    this.name = '';
    this.min = '0';
    this.max = '100';
    this.step = '1';
    this.value = '50';
    this.unit = '';
    this.hint = '';
    this.disabled = false;
    this.fieldId = '';
  }

  /* Where the markup put it, which is what a reset puts back. */
  #initial?: string;

  protected override willUpdate(): void {
    this.#initial ??= this.value;
  }

  protected override updated(): void {
    const input = this.querySelector('input');
    if (input) input.value = this.value;
  }

  protected override restore(): void {
    this.value = this.#initial ?? this.value;
  }

  private onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent<string>('sds-input', { detail: this.value, bubbles: true, composed: true }));
  }

  protected override render(): TemplateResult {
    const id = this.fieldId || nothing;
    /* The attribute is the *default* the reset restores. Where the thumb
       actually stands is written onto the control after the render, in
       `updated` — a `.value` binding is serialised by the static renderer and
       would put the live number back into the default. */
    const slider = html`<input
    class="sds-range__slider"
    type="range"
    id="${id}"
    name="${this.name || nothing}"
    min="${this.min}"
    max="${this.max}"
    step="${this.step}"
    value="${this.#initial ?? this.value}"
    aria-label="${this.label ?? nothing}"
    ?disabled="${this.disabled}"
    @input="${this.onInput}"
  />`;
    if (!this.caption) return html`<span class="sds-range">${slider}</span>`;

    return html`<div class="sds-field-row sds-range">
  <span class="sds-range__head">
    <label class="sds-field-label" for="${id}">${this.caption}</label>
    <output class="sds-range__value" for="${id}">${this.value}${this.unit ? ` ${this.unit}` : ''}</output>
  </span>
  ${slider}
  ${this.hint ? html`<span class="sds-field-hint">${this.hint}</span>` : nothing}
</div>`;
  }
}

define('sds-range', SdsRange);
