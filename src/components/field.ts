/* sds-field — a text field and a select.

   A field is sunken, never outlined on the canvas, and the accent appears on
   it in exactly one place: focus.

   It is a control, not a picture of one. It used to render a `<span>` with a
   drawn caret, which looked right in a screenshot and could not be typed in,
   tabbed to, or read out — a demo of a field rather than a field. What it
   renders now is an `<input>` (or a `<select>`) inside the sunken box, so the
   focus ring comes from `:focus-within` and the browser does the rest.

   The state properties stay, and are for one thing: a specimen card is a
   still picture and cannot hold focus or invalidity long enough to be
   photographed. Set none of them and the states are the browser's own. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface FieldProps {
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
}

export function fieldClass({ focused, invalid, filled, select }: FieldProps): string {
  const cls = ['sds-field'];
  if (select) cls.push('sds-select');
  if (focused) cls.push('is-focused');
  if (invalid) cls.push('is-invalid');
  if (filled) cls.push('is-filled');
  return cls.join(' ');
}

export class SdsField extends SdsElement {
  static override properties = {
    value: { type: String },
    icon: { type: String },
    focused: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    filled: { type: Boolean, reflect: true },
    select: { type: Boolean, reflect: true },
    options: { type: Array },
    label: { type: String },
    minWidth: { type: Number, attribute: 'min-width' },
  };

  declare value: string;
  declare icon?: IconId;
  declare focused: boolean;
  declare invalid: boolean;
  declare filled: boolean;
  declare select: boolean;
  declare options: readonly string[];
  declare label?: string;
  declare minWidth: number;

  constructor() {
    super();
    this.value = '';
    this.focused = false;
    this.invalid = false;
    this.filled = false;
    this.select = false;
    this.options = [];
    this.minWidth = 220;
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
    const cls = fieldClass(this);
    const box = `min-width:${this.minWidth}px`;

    if (this.select) {
      return html`<span class="${cls}" style="${box}"><select class="sds-input" aria-label="${this.label ?? nothing}" @change="${(e: Event) => this.onInput(e)}">${
        this.options.length
          ? this.options.map((option) => html`<option ?selected="${option === this.value}">${option}</option>`)
          : html`<option>${this.value}</option>`
      }</select><span style="color:var(--text-muted);"><sds-icon name="actions-chevron-down"></sds-icon></span></span>`;
    }

    /* The caret is drawn only where one was asked for, which is only ever a
       specimen: a still picture cannot hold a real one, and the accent on a
       focused field is the thing being documented. */
    const caret = this.focused
      ? html`<span style="width:2px; height:15px; background:var(--accent);"></span>`
      : nothing;

    return html`<span class="${cls}" style="${box}">${this.icon ? html`<sds-icon name="${this.icon}"></sds-icon>` : nothing}<input class="sds-input" type="text" value="${this.filled ? this.value : nothing}" placeholder="${this.filled ? nothing : this.value}" aria-label="${this.label ?? nothing}" aria-invalid="${this.invalid ? 'true' : nothing}" @input="${(e: Event) => this.onInput(e)}">${caret}</span>`;
  }
}

define('sds-field', SdsField);
