/* sds-textarea — an answer of more than one line.

   Its own element and not a taller field, for the reason a select is its own
   element: what it shares with a text field is the sunken box, and what it does
   not share is everything a caller writes. A textarea has lines, it has a
   direction it may be dragged in, its value can hold a newline, and it has
   nothing a `pattern` or an `inputmode` could mean.

   A real `<textarea>`, assembled as a string: Lit refuses a binding between the
   tags of a raw text element, and its content is the only place a value lives
   where a file with no script still shows it. So the listener sits on the box
   around it and is reached by bubbling. */

import { html, nothing, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { define } from '../lib/element.ts';
import { fieldBox, type FieldSize } from '../lib/field-box.ts';
import { fieldRow } from '../lib/field-row.ts';
import { SdsFormElement } from '../lib/form-element.ts';

/** What has to be escaped in an attribute value or in text content — the value
    a user typed goes into both. */
const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Which way a reader may drag the corner. `vertical` is the default because a
    box that widens breaks the column it stands in. */
export type TextareaResize = 'vertical' | 'none' | 'both';

export interface TextareaProps {
  /** Lines. What the box is *worth* asking for, not a limit on the answer. */
  rows?: number;
  /** What is in it — its value when `filled`, its placeholder when not. */
  value?: string;
  /** The visible label, which turns this into a control in a *form*: label
      above, hint under, error under both. */
  caption?: string;
  /** What it is called for anything that cannot see what it sits beside. */
  label?: string;
  /** What the value is called when the form is sent. */
  name?: string;
  /** The control's id, so the label points at it and an error summary can. */
  fieldId?: string;
  /** What the answer has to be, under the control. Never inside it. */
  hint?: string;
  /** What is wrong with what is in it. Sets the invalid state with it, and the
      browser refuses to submit past it. */
  error?: string;
  /** Said in words beside the label. */
  required?: boolean;
  /** Present, and not on offer. */
  disabled?: boolean;
  /** Shown and sent, and not editable. */
  readonly?: boolean;
  /** How much may be typed — the browser's own limit. */
  maxlength?: number;
  /** What the browser may fill in. */
  autocomplete?: string;
  /** Which way the corner drags. */
  resize?: TextareaResize;
  /** The three heights a button has, which here set the type and the padding
      rather than a height: the lines do that. */
  size?: FieldSize;
  /** The width it asks for, in pixels. The attribute is `min-width`. */
  minWidth?: number;
  /** The value is the reader's, not a prompt. Typing sets it too. */
  filled?: boolean;
  /** Force the states a still picture cannot hold. */
  focused?: boolean;
  invalid?: boolean;
}

export class SdsTextarea extends SdsFormElement {
  static override properties = {
    rows: { type: Number },
    value: { type: String },
    caption: { type: String },
    label: { type: String },
    name: { type: String },
    fieldId: { type: String, attribute: 'field-id' },
    hint: { type: String },
    error: { type: String },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },
    maxlength: { type: Number },
    autocomplete: { type: String },
    resize: { type: String, reflect: true },
    size: { type: String, reflect: true },
    minWidth: { type: Number, attribute: 'min-width' },
    filled: { type: Boolean, reflect: true },
    focused: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
  };

  declare rows: number;
  declare value: string;
  declare caption: string;
  declare label?: string;
  declare name: string;
  declare fieldId: string;
  declare hint: string;
  declare error: string;
  declare required: boolean;
  declare disabled: boolean;
  declare readonly: boolean;
  declare maxlength: number;
  declare autocomplete: string;
  declare resize: TextareaResize;
  declare size: FieldSize;
  declare minWidth: number;
  declare filled: boolean;
  declare focused: boolean;
  declare invalid: boolean;

  constructor() {
    super();
    this.rows = 4;
    this.value = '';
    this.caption = '';
    this.name = '';
    this.fieldId = '';
    this.hint = '';
    this.error = '';
    this.required = false;
    this.disabled = false;
    this.readonly = false;
    this.maxlength = 0;
    this.autocomplete = '';
    this.resize = 'vertical';
    this.size = 'md';
    this.minWidth = 420;
    this.filled = false;
    this.focused = false;
    this.invalid = false;
  }

  /* What the markup came with: what the element is drawn holding, and what a
     reset puts back. Read once, before anything is typed. */
  #initial?: string;

  protected override willUpdate(): void {
    this.#initial ??= this.filled ? this.value : '';
  }

  protected override updated(): void {
    /* The control is assembled as a string, so any attribute that changes —
       the placeholder leaving, the invalid mark arriving — replaces the element
       and with it whatever was typed. Its content is the *default* a reset puts
       back; what is actually in it is written here, after the render. The guard
       is what keeps the caret still: assigning the same string moves it to the
       end. */
    const area = this.querySelector('textarea');
    const written = this.filled ? this.value : '';
    if (area && area.value !== written) area.value = written;
    this.setValidity(this.error, 'textarea');
  }

  protected override restore(): void {
    this.value = this.#initial || this.value;
    this.filled = !!this.#initial;
  }

  private onInput(event: Event): void {
    const area = event.target as HTMLTextAreaElement;
    this.value = area.value;
    this.filled = area.value !== '';
    /* Typing answers whatever was wrong. The caller decides what is wrong
       next; leaving the old sentence standing would block the form on a value
       nobody has judged yet. */
    this.error = '';
    this.dispatchEvent(new CustomEvent<string>('sds-input', { detail: area.value, bubbles: true, composed: true }));
  }

  protected override render(): TemplateResult {
    const cls = `${fieldBox(this)} sds-field--multi`;
    const box = `width:${this.minWidth}px; max-width:100%`;
    const disabled = this.disabled || this.inheritedDisabled;
    const attr = (key: string, value: string): string => (value ? ` ${key}="${esc(value)}"` : '');

    const area =
      `<textarea class="sds-input" rows="${this.rows}"${attr('id', this.fieldId)}${attr('name', this.name)}` +
      `${this.filled ? '' : attr('placeholder', this.value)}${attr('aria-label', this.label ?? '')}` +
      `${attr('autocomplete', this.autocomplete)}${this.maxlength ? ` maxlength="${this.maxlength}"` : ''}` +
      `${this.invalid || this.error ? ' aria-invalid="true"' : ''}${this.required ? ' required' : ''}` +
      `${disabled ? ' disabled' : ''}${this.readonly ? ' readonly' : ''}>` +
      `${esc(this.#initial ?? '')}</textarea>`;

    const control = html`<span class="${cls}" style="${box}" @input="${(e: Event) => this.onInput(e)}">${unsafeHTML(area)}</span>`;
    return fieldRow(this, control);
  }
}

define('sds-textarea', SdsTextarea);
