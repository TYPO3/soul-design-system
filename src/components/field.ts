/* sds-field — a text field, a select, and the message when one is wrong.

   A field is sunken, never outlined on the canvas, and the accent appears on
   it in exactly one place: the focus state. That is the whole subject of the
   specimen this renders.

   The specimen draws its states on a `<span>` rather than an `<input>`,
   because a real input cannot be made to *hold* focus or invalidity for a
   screenshot, and the states are the point. The element below renders the
   same classes onto whatever it is given, so a product surface puts
   `sds-field` on a real control and gets the same styling. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface FieldProps {
  /** The text in the field — placeholder-grey unless `filled`. */
  value?: string;
  icon?: IconId;
  /** Draws the focus state statically, caret included. */
  focused?: boolean;
  invalid?: boolean;
  /** The value is the user's, not a prompt. */
  filled?: boolean;
  /** A select rather than a text field: same sunken box, closed by a chevron. */
  select?: boolean;
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

/** Compose a field. */
/** The message under an invalid field. Never a tooltip — an error the
    pointer has to find is an error the keyboard never surfaces at all. */
export class SdsFieldError extends SdsElement {
  static override properties = { message: { type: String } };
  declare message: string;

  constructor() {
    super();
    this.message = '';
  }

  protected override render(): TemplateResult {
    return html`<span class="sds-field-error"><sds-icon name="actions-exclamation-circle"></sds-icon>${this.message}</span>`;
  }
}

define('sds-field-error', SdsFieldError);

export class SdsField extends SdsElement {
  static override properties = {
    value: { type: String },
    icon: { type: String },
    focused: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
    filled: { type: Boolean, reflect: true },
    select: { type: Boolean, reflect: true },
    minWidth: { type: Number, attribute: 'min-width' },
  };

  declare value: string;
  declare icon?: IconId;
  declare focused: boolean;
  declare invalid: boolean;
  declare filled: boolean;
  declare select: boolean;
  declare minWidth: number;

  constructor() {
    super();
    this.value = '';
    this.focused = false;
    this.invalid = false;
    this.filled = false;
    this.select = false;
    this.minWidth = 220;
  }

  protected override render(): TemplateResult {
    const cls = fieldClass(this);

    if (this.select) {
      return html`<span class="${cls}" style="min-width:${this.minWidth}px">${this.value} <span style="color:var(--text-muted);"><sds-icon name="actions-chevron-down"></sds-icon></span></span>`;
    }

    /* The caret is drawn, not simulated: a specimen cannot hold a real one,
       and the accent on a focused field is the thing being documented. */
    const caret = this.focused
      ? html`<span style="width:2px; height:15px; background:var(--accent);"></span>`
      : nothing;
    const text = this.focused
      ? html`<span style="color:var(--text-primary)">${this.value}</span>`
      : this.icon
        ? html`<span>${this.value}</span>`
        : html`${this.value}`;

    return html`<span class="${cls}" style="min-width:${this.minWidth}px">${this.icon ? html`<sds-icon name="${this.icon}"></sds-icon>` : nothing}${text}${caret}</span>`;
  }
}

define('sds-field', SdsField);
