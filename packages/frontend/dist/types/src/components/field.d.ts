import { type TemplateResult } from 'lit';
import './icon.ts';
import './field-error.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
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
export declare function fieldClass({ focused, invalid, filled, select, rows, error, size }: FieldProps): string;
export declare class SdsField extends SdsElement {
    static properties: {
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
        value: {
            type: StringConstructor;
        };
        icon: {
            type: StringConstructor;
        };
        focused: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        invalid: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        filled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        select: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        options: {
            type: ArrayConstructor;
        };
        label: {
            type: StringConstructor;
        };
        minWidth: {
            type: NumberConstructor;
            attribute: string;
        };
        caption: {
            type: StringConstructor;
        };
        hint: {
            type: StringConstructor;
        };
        error: {
            type: StringConstructor;
        };
        required: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        fieldId: {
            type: StringConstructor;
            attribute: string;
        };
        name: {
            type: StringConstructor;
        };
        type: {
            type: StringConstructor;
        };
        rows: {
            type: NumberConstructor;
        };
    };
    size: FieldSize;
    value: string;
    icon?: IconId;
    focused: boolean;
    invalid: boolean;
    filled: boolean;
    select: boolean;
    options: readonly string[];
    label?: string;
    minWidth: number;
    caption: string;
    hint: string;
    error: string;
    required: boolean;
    fieldId: string;
    name: string;
    type: string;
    rows: number;
    constructor();
    private onInput;
    protected render(): TemplateResult;
    private control;
}
