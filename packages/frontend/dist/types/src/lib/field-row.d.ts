import { type TemplateResult } from 'lit';
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
export declare function fieldRow(row: FieldRow, control: TemplateResult): TemplateResult;
