/* sds-field — one line of whatever a reader types.

   Sunken, never outlined on the canvas, and the accent appears on it in exactly
   one place: focus. A real `<input>` inside the box, so the ring comes from
   `:focus-within` and the browser does the rest — anything drawn instead looks
   right in a screenshot and cannot be typed in or read out.

   An answer of more than one line is `sds-textarea` and a list of answers is
   `sds-select`. Both share this box and little else.

   The state properties exist for the specimen alone, which is a still picture
   and cannot hold focus or invalidity. Set none and the states are the
   browser's. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import './field-error.ts';
import { type IconId } from './icon.ts';
import { define } from '../lib/element.ts';
import { fieldBox, type FieldSize } from '../lib/field-box.ts';
import { fieldRow } from '../lib/field-row.ts';
import { SdsFormElement } from '../lib/form-element.ts';

export { type FieldSize };

export interface FieldProps {
  /** The three heights a button has, so the two stand on one line. `sm` for a
      field inside another surface, `lg` where the field is what the screen is
      for. A form's fields are `md`. */
  size?: FieldSize;
  /** What is in the field — its value when `filled`, its placeholder when not. */
  value?: string;
  /** A glyph inside the box, at the start: what is searched, what is
      measured, what kind of value belongs here. */
  icon?: IconId;
  /** Force the focus state for a still picture. Live focus needs nothing. */
  focused?: boolean;
  /** The box says the value is wrong. What is wrong is `error`, and a state
      drawn with no sentence beside it leaves a reader stuck. */
  invalid?: boolean;
  /** The value is the user's, not a prompt. Typing sets it too. */
  filled?: boolean;
  /** What the control is called, for anything that cannot see what it sits
      beside. A field with no visible label of its own owes one here. */
  label?: string;
  /** The narrowest the box may get, in pixels, for a field in a row that
      shrinks. The attribute is `min-width`. */
  minWidth?: number;
  /** The visible label, which turns this into a field in a *form*. A bare field
      is right where the surface says what it is for — a header, a filter row.
      In a form nothing does, and a placeholder leaves exactly when it is
      needed. Set this and the element renders label, control, hint and error
      instead of the control alone. */
  caption?: string;
  /** What the answer has to be, under the control. Never inside it. */
  hint?: string;
  /** What is wrong with what is in it. Sets the invalid state with it, so the
      colour and the sentence cannot disagree — and the browser refuses to
      submit past it. */
  error?: string;
  /** Said in words beside the label, not as an asterisk that needs a legend
      somewhere else on the page. */
  required?: boolean;
  /** The control's id, so the label points at it and an error summary can. */
  fieldId?: string;
  /** What the value is called when the form is sent. */
  name?: string;
  /** `email`, `tel`, `url`, `number`, `date` — what the browser validates and
      which keyboard a phone offers. */
  type?: string;
  /** Present, and not on offer. The real attribute, so nothing can type in it
      and the form sends nothing for it. */
  disabled?: boolean;
  /** The value is shown and sent but not editable — what a form already knows
      and the reader may not change. Still focusable, still copyable: a disabled
      control is neither, which is why the two are different words. */
  readonly?: boolean;
  /** What stands inside the box before the value: a currency, a scheme, the
      fixed head of an address. Part of the field rather than of the value —
      nothing is typed there and nothing is sent for it. */
  prefix?: string;
  /** The same after it: a unit, a domain, an extension. */
  suffix?: string;
  /** What the browser may fill in — `email`, `street-address`, `off`. A form
      that names them is a form filled in once instead of every time. */
  autocomplete?: string;
  /** Which keyboard a phone offers where `type` does not decide it —
      `numeric`, `decimal`, `search`. */
  inputmode?: string;
  /** The bounds and the step the platform validates against, for a number, a
      date or a time. Strings, because a date's bound is one. */
  min?: string;
  max?: string;
  step?: string;
  /** How much may be typed, and the shape it has to have. Both are the
      browser's own validation, before anything of ours runs. */
  maxlength?: number;
  pattern?: string;
}

export class SdsField extends SdsFormElement {
  static override properties = {
    size: { type: String, reflect: true },
    value: { type: String },
    icon: { type: String },
    focused: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    filled: { type: Boolean, reflect: true },
    label: { type: String },
    minWidth: { type: Number, attribute: 'min-width' },
    caption: { type: String },
    hint: { type: String },
    error: { type: String },
    required: { type: Boolean, reflect: true },
    fieldId: { type: String, attribute: 'field-id' },
    name: { type: String },
    type: { type: String },
    disabled: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },
    prefix: { type: String },
    suffix: { type: String },
    autocomplete: { type: String },
    inputmode: { type: String },
    min: { type: String },
    max: { type: String },
    step: { type: String },
    maxlength: { type: Number },
    pattern: { type: String },
  };

  declare size: FieldSize;
  declare value: string;
  declare icon?: IconId;
  declare focused: boolean;
  declare invalid: boolean;
  declare filled: boolean;
  declare label?: string;
  declare minWidth: number;
  declare caption: string;
  declare hint: string;
  declare error: string;
  declare required: boolean;
  declare fieldId: string;
  declare name: string;
  declare type: string;
  declare disabled: boolean;
  declare readonly: boolean;
  declare prefix: string;
  declare suffix: string;
  declare autocomplete: string;
  declare inputmode: string;
  declare min: string;
  declare max: string;
  declare step: string;
  declare maxlength: number;
  declare pattern: string;

  constructor() {
    super();
    this.size = 'md';
    this.value = '';
    this.focused = false;
    this.invalid = false;
    this.filled = false;
    this.minWidth = 220;
    this.caption = '';
    this.hint = '';
    this.error = '';
    this.required = false;
    this.fieldId = '';
    this.name = '';
    this.type = 'text';
    this.disabled = false;
    this.readonly = false;
    this.prefix = '';
    this.suffix = '';
    this.autocomplete = '';
    this.inputmode = '';
    this.min = '';
    this.max = '';
    this.step = '';
    this.maxlength = 0;
    this.pattern = '';
  }

  /* The value the markup came with, which is what a reset puts back. Read once,
     before anything is typed. */
  #initial?: string;

  protected override willUpdate(): void {
    this.#initial ??= this.filled ? this.value : '';
  }

  /* What the caller said is wrong is what the browser refuses to submit past,
     reported on the box itself. Set from the render rather than from a setter,
     so a page that arrives with the sentence already in it arrives blocked. */
  protected override updated(): void {
    this.setValidity(this.error, 'input');
  }

  protected override restore(): void {
    this.value = this.#initial || this.value;
    this.filled = !!this.#initial;
  }

  /* Typing is what makes a value the user's. `is-filled` used to be a state
     a caller set and then had to unset, which nothing typing into the field
     could ever do. */
  private onInput(event: Event): void {
    const control = event.target as HTMLInputElement;
    this.value = control.value;
    this.filled = control.value !== '';
    /* Typing answers whatever was wrong. The caller decides what is wrong
       next; leaving the old sentence standing would block the form on a value
       nobody has judged yet. */
    this.error = '';
    this.dispatchEvent(new CustomEvent<string>('sds-input', { detail: control.value, bubbles: true, composed: true }));
  }

  protected override render(): TemplateResult {
    return fieldRow(this, this.control());
  }

  private control(): TemplateResult {
    const cls = fieldBox(this);
    /* A width, not a floor. This was `min-width`, and `min-width` wins over
       every other width rule in CSS: a field asking for 260px in a header with
       240px left pushed the page sideways, and nothing in the row looked
       wrong. What a caller gives is the width it wants; what it gets is that
       or the room there is. */
    const box = `width:${this.minWidth}px; max-width:100%`;

    /* Only where a caller gave one. A field in a header has no id and no name
       and never needed either; a field in a form has both, and the label above
       it points at the first. */
    const id = this.fieldId || nothing;
    const name = this.name || nothing;
    const invalid = this.invalid || this.error ? 'true' : nothing;
    const disabled = this.disabled || this.inheritedDisabled;

    /* The caret is drawn only where one was asked for, which is only ever a
       specimen: a still picture cannot hold a real one, and the accent on a
       focused field is the thing being documented. */
    const caret = this.focused
      ? html`<span style="width:2px; height:15px; background:var(--accent);"></span>`
      : nothing;

    /* What stands in the box beside the value and is not part of it. Nothing is
       typed into one and nothing is sent for it. */
    const affix = (text: string): TemplateResult | typeof nothing =>
      text ? html`<span class="sds-field__affix">${text}</span>` : nothing;

    return html`<span class="${cls}" style="${box}">${
      this.icon ? html`<sds-icon name="${this.icon}"></sds-icon>` : nothing
    }${affix(this.prefix)}<input
    class="sds-input"
    type="${this.type}"
    id="${id}"
    name="${name}"
    value="${this.filled ? this.value : nothing}"
    placeholder="${this.filled ? nothing : this.value}"
    aria-label="${this.label ?? nothing}"
    aria-invalid="${invalid}"
    autocomplete="${this.autocomplete || nothing}"
    inputmode="${this.inputmode || nothing}"
    min="${this.min || nothing}"
    max="${this.max || nothing}"
    step="${this.step || nothing}"
    maxlength="${this.maxlength || nothing}"
    pattern="${this.pattern || nothing}"
    ?required="${this.required}"
    ?disabled="${disabled}"
    ?readonly="${this.readonly}"
    @input="${this.onInput}"
  >${affix(this.suffix)}${caret}</span>`;
  }
}

define('sds-field', SdsField);
