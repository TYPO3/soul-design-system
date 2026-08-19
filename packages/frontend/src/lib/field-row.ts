/* The row a form owes a control: label above, hint under, error under both.

   A contract and not a layout — the `for` and the control's own id are the same
   string, so a press on the words reaches the control and an error summary can
   send a reader straight to it. Written out in each element, the day one of
   them gained a part the others would quietly not have it. */

import { html, nothing, type TemplateResult } from 'lit';
import '../components/field-error.ts';

export interface FieldRow {
  /** The visible label. A control with none renders bare, and whatever is
      around it is what names it. */
  caption?: string;
  /** The control's own id, which the label points at. */
  fieldId?: string;
  /** What the answer has to be, under the control. Never inside it. */
  hint?: string;
  /** What is wrong with it, under both. Never a tooltip. */
  error?: string;
  /** Said in words beside the label, never as an asterisk that needs a legend
      somewhere else on the page. */
  required?: boolean;
}

/** The control wrapped in what a form owes it. Without a caption there is no
    row at all: the bare control is right where the surface around it says what
    it is for — a header, a toolbar, a filter row. */
export function fieldRow(row: FieldRow, control: TemplateResult): TemplateResult {
  if (!row.caption) return control;
  const id = row.fieldId || undefined;
  return html`<div class="sds-field-row">
  <label class="sds-field-label" for="${id ?? nothing}">${row.caption}${
    row.required ? html` <span class="sds-field-req">required</span>` : nothing
  }</label>
  ${control}
  ${row.hint ? html`<span class="sds-field-hint">${row.hint}</span>` : nothing}
  ${row.error ? html`<sds-field-error message="${row.error}"></sds-field-error>` : nothing}
</div>`;
}
