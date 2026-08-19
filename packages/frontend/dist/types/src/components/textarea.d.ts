import { type TemplateResult } from 'lit';
import { type FieldSize } from '../lib/field-box.js';
import { SdsFormElement } from '../lib/form-element.js';
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
export declare class SdsTextarea extends SdsFormElement {
    #private;
    static properties: {
        rows: {
            type: NumberConstructor;
        };
        value: {
            type: StringConstructor;
        };
        caption: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        name: {
            type: StringConstructor;
        };
        fieldId: {
            type: StringConstructor;
            attribute: string;
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
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        readonly: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        maxlength: {
            type: NumberConstructor;
        };
        autocomplete: {
            type: StringConstructor;
        };
        resize: {
            type: StringConstructor;
            reflect: boolean;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
        minWidth: {
            type: NumberConstructor;
            attribute: string;
        };
        filled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        focused: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        invalid: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    rows: number;
    value: string;
    caption: string;
    label?: string;
    name: string;
    fieldId: string;
    hint: string;
    error: string;
    required: boolean;
    disabled: boolean;
    readonly: boolean;
    maxlength: number;
    autocomplete: string;
    resize: TextareaResize;
    size: FieldSize;
    minWidth: number;
    filled: boolean;
    focused: boolean;
    invalid: boolean;
    constructor();
    protected willUpdate(): void;
    protected updated(): void;
    protected restore(): void;
    private onInput;
    protected render(): TemplateResult;
}
