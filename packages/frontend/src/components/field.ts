/* sds-field — a text field and a select.

   Sunken, never outlined on the canvas, and the accent appears on it in exactly
   one place: focus. A real `<input>` or `<select>` inside the box, so the ring
   comes from `:focus-within` and the browser does the rest — anything drawn
   instead looks right in a screenshot and cannot be typed in or read out.

   The state properties exist for the specimen alone, which is a still picture
   and cannot hold focus or invalidity. Set none and the states are the
   browser's. */

import { html, nothing, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import './icon.ts';
import './field-error.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

/** What has to be escaped in an attribute value or in text content. The
    textarea below is assembled as a string, and a value the user typed goes
    into it. */
const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export type FieldSize = 'md' | 'sm' | 'lg';

export interface FieldProps {
  /** The three heights a button has, so the two stand on one line. `sm` for a
      field inside another surface, `lg` where the field is what the screen is
      for. A form's fields are `md`. */
  size?: FieldSize;
  /** What is in the field — its value when `filled`, its placeholder when not. */
  value?: string;
  icon?: IconId;
  /** Force the focus state for a still picture. Live focus needs nothing. */
  focused?: boolean;
  invalid?: boolean;
  /** The value is the user's, not a prompt. Typing sets it too. */
  filled?: boolean;
  /** A select rather than a text field: same sunken box, closed by a chevron. */
  select?: boolean;
  /** What a select offers. A text field ignores it. */
  options?: readonly string[];
  /** What the control is called, for anything that cannot see what it sits
      beside. A field with no visible label of its own owes one here. */
  label?: string;
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
      colour and the sentence cannot disagree. */
  error?: string;
  /** Said in words beside the label, not as an asterisk that needs a legend
      somewhere else on the page. */
  required?: boolean;
  /** The control's id, so the label points at it and an error summary can. */
  fieldId?: string;
  name?: string;
  /** `email`, `tel`, `url` — what the browser validates and which keyboard a
      phone offers. */
  type?: string;
  /** Lines. Anything above one renders a `<textarea>`. */
  rows?: number;
}

export function fieldClass({ focused, invalid, filled, select, rows, error, size = 'md' }: FieldProps): string {
  const cls = ['sds-field'];
  if (select) cls.push('sds-select');
  /* Spelled out rather than interpolated: the size arrives as an attribute,
     and a word this layer does not have would become a class nothing draws. */
  if (size === 'sm') cls.push('sds-field--sm');
  else if (size === 'lg') cls.push('sds-field--lg');
  if (rows && rows > 1) cls.push('sds-field--multi');
  if (focused) cls.push('is-focused');
  /* An error message and the invalid state are the same fact, so one sets the
     other: a field that says what is wrong and is not marked wrong is two
     halves of a state, and the halves drift. */
  if (invalid || error) cls.push('is-invalid');
  if (filled) cls.push('is-filled');
  return cls.join(' ');
}

export class SdsField extends SdsElement {
  static override properties = {
    size: { type: String, reflect: true },
    value: { type: String },
    icon: { type: String },
    focused: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    filled: { type: Boolean, reflect: true },
    select: { type: Boolean, reflect: true },
    options: { type: Array },
    label: { type: String },
    minWidth: { type: Number, attribute: 'min-width' },
    caption: { type: String },
    hint: { type: String },
    error: { type: String },
    required: { type: Boolean, reflect: true },
    fieldId: { type: String, attribute: 'field-id' },
    name: { type: String },
    type: { type: String },
    rows: { type: Number },
  };

  declare size: FieldSize;
  declare value: string;
  declare icon?: IconId;
  declare focused: boolean;
  declare invalid: boolean;
  declare filled: boolean;
  declare select: boolean;
  declare options: readonly string[];
  declare label?: string;
  declare minWidth: number;
  declare caption: string;
  declare hint: string;
  declare error: string;
  declare required: boolean;
  declare fieldId: string;
  declare name: string;
  declare type: string;
  declare rows: number;

  constructor() {
    super();
    this.size = 'md';
    this.value = '';
    this.focused = false;
    this.invalid = false;
    this.filled = false;
    this.select = false;
    this.options = [];
    this.minWidth = 220;
    this.caption = '';
    this.hint = '';
    this.error = '';
    this.required = false;
    this.fieldId = '';
    this.name = '';
    this.type = 'text';
    this.rows = 0;
  }

  /* Typing is what makes a value the user's. `is-filled` used to be a state
     a caller set and then had to unset, which nothing typing into the field
     could ever do. */
  private onInput(event: Event): void {
    const control = event.target as HTMLInputElement | HTMLSelectElement;
    this.value = control.value;
    this.filled = control.value !== '';
    this.dispatchEvent(new CustomEvent<string>('sds-input', { detail: control.value, bubbles: true, composed: true }));
  }

  protected override render(): TemplateResult {
    const control = this.control();
    if (!this.caption) return control;

    /* The row a form owes a control. `for` and the control's own id are the
       same string, so a press on the label reaches the control and an error
       summary can send the reader straight to it. */
    const id = this.fieldId || undefined;
    return html`<div class="sds-field-row">
  <label class="sds-field-label" for="${id ?? nothing}">${this.caption}${
    this.required ? html` <span class="sds-field-req">required</span>` : nothing
  }</label>
  ${control}
  ${this.hint ? html`<span class="sds-field-hint">${this.hint}</span>` : nothing}
  ${this.error ? html`<sds-field-error message="${this.error}"></sds-field-error>` : nothing}
</div>`;
  }

  private control(): TemplateResult {
    const cls = fieldClass(this);
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

    if (this.select) {
      return html`<span class="${cls}" style="${box}"><select class="sds-input" id="${id}" name="${name}" aria-label="${this.label ?? nothing}" aria-invalid="${invalid}" ?required="${this.required}" @change="${(e: Event) => this.onInput(e)}">${
        this.options.length
          ? this.options.map((option) => html`<option ?selected="${option === this.value}">${option}</option>`)
          : html`<option>${this.value}</option>`
      }</select><span style="color:var(--text-muted);"><sds-icon name="actions-chevron-down"></sds-icon></span></span>`;
    }

    /* More than one line is a `<textarea>`, not a taller input: the difference
       is what the browser does with a newline. Built as a string because Lit
       refuses a binding between the tags of a raw text element, and its content
       is the only place a value lives where a file with no script still shows
       it. So the listener sits on the wrapper, reached by bubbling. */
    if (this.rows > 1) {
      const attr = (name: string, value: string): string => (value ? ` ${name}="${esc(value)}"` : '');
      const area =
        `<textarea class="sds-input" rows="${this.rows}"${attr('id', this.fieldId)}${attr('name', this.name)}` +
        `${this.filled ? '' : attr('placeholder', this.value)}${attr('aria-label', this.label ?? '')}` +
        `${this.invalid || this.error ? ' aria-invalid="true"' : ''}${this.required ? ' required' : ''}>` +
        `${this.filled ? esc(this.value) : ''}</textarea>`;
      return html`<span class="${cls}" style="${box}" @input="${(e: Event) => this.onInput(e)}">${unsafeHTML(area)}</span>`;
    }

    /* The caret is drawn only where one was asked for, which is only ever a
       specimen: a still picture cannot hold a real one, and the accent on a
       focused field is the thing being documented. */
    const caret = this.focused
      ? html`<span style="width:2px; height:15px; background:var(--accent);"></span>`
      : nothing;

    return html`<span class="${cls}" style="${box}">${this.icon ? html`<sds-icon name="${this.icon}"></sds-icon>` : nothing}<input class="sds-input" type="${this.type}" id="${id}" name="${name}" value="${this.filled ? this.value : nothing}" placeholder="${this.filled ? nothing : this.value}" aria-label="${this.label ?? nothing}" aria-invalid="${invalid}" ?required="${this.required}" @input="${(e: Event) => this.onInput(e)}">${caret}</span>`;
  }
}

define('sds-field', SdsField);
