/* sds-file — the one native control that looks like nothing else on a page.

   A file input is a button and a sentence the browser draws itself, in the
   platform's own chrome, and no amount of markup replaces it: the picker only
   opens for a press the user made on a real one. So the real one stays and its
   button is painted — `::file-selector-button` is that button, and the
   sentence beside it is the browser's, in its own language, saying what is
   chosen.

   What is deliberately not here is a drawn box with a hidden input behind it.
   It photographs well, drops nothing, and loses the keyboard. */

import { html, nothing, type TemplateResult } from 'lit';
import { define } from '../lib/element.ts';
import { fieldRow } from '../lib/field-row.ts';
import { SdsFormElement } from '../lib/form-element.ts';

export interface FileProps {
  /** The visible label, above the control. A file picker with none is a
      button whose own words are the browser's and say only "Choose File". */
  caption?: string;
  /** What it is called for anything that cannot see what it sits beside. */
  label?: string;
  /** What the files are called when the form is sent. */
  name?: string;
  /** Which kinds the picker offers first — `image/*`, `.pdf,.md`. A filter and
      not a guarantee: what arrives is still checked where it lands. */
  accept?: string;
  /** More than one at a time. */
  multiple?: boolean;
  /** What to attach, under the control. Say the kinds and the size limit here
      rather than after the upload failed. */
  hint?: string;
  /** What is wrong with what was chosen. Sets the invalid state with it. */
  error?: string;
  /** Something has to be chosen before the form goes. Said in words. */
  required?: boolean;
  /** Present but not available. */
  disabled?: boolean;
  /** The control's id, so the label points at it and an error summary can. */
  fieldId?: string;
}

export class SdsFile extends SdsFormElement {
  static override properties = {
    caption: { type: String },
    label: { type: String },
    name: { type: String },
    accept: { type: String },
    multiple: { type: Boolean, reflect: true },
    hint: { type: String },
    error: { type: String },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    fieldId: { type: String, attribute: 'field-id' },
  };

  declare caption: string;
  declare label?: string;
  declare name: string;
  declare accept: string;
  declare multiple: boolean;
  declare hint: string;
  declare error: string;
  declare required: boolean;
  declare disabled: boolean;
  declare fieldId: string;

  constructor() {
    super();
    this.caption = '';
    this.name = '';
    this.accept = '';
    this.multiple = false;
    this.hint = '';
    this.error = '';
    this.required = false;
    this.disabled = false;
    this.fieldId = '';
  }

  /* What the caller said is wrong is what the browser refuses to submit past,
     reported on the control itself rather than on the element around it. */
  protected override updated(): void {
    this.setValidity(this.error, 'input');
  }

  private onChange(event: Event): void {
    const files = [...((event.target as HTMLInputElement).files ?? [])];
    this.dispatchEvent(new CustomEvent<File[]>('sds-change', { detail: files, bubbles: true, composed: true }));
  }

  protected override render(): TemplateResult {
    const id = this.fieldId || nothing;
    const control = html`<input
    class="sds-file"
    type="file"
    id="${id}"
    name="${this.name || nothing}"
    accept="${this.accept || nothing}"
    aria-label="${this.label ?? nothing}"
    aria-invalid="${this.error ? 'true' : nothing}"
    ?multiple="${this.multiple}"
    ?required="${this.required}"
    ?disabled="${this.disabled || this.inheritedDisabled}"
    @change="${this.onChange}"
  />`;
    return fieldRow(this, control);
  }
}

define('sds-file', SdsFile);
