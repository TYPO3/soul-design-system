import { type TemplateResult } from 'lit';
import './icon.ts';
import './field-error.ts';
import { type IconId } from './icon.js';
import { type FieldSize } from '../lib/field-box.js';
import { SdsFormElement } from '../lib/form-element.js';
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
    /** A select rather than a text field: same sunken box, closed by a chevron. */
    select?: boolean;
    /** What a select offers. A text field ignores it. */
    options?: readonly string[];
    /** Lines. Anything above one renders a `<textarea>`. */
    rows?: number;
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
export declare class SdsField extends SdsFormElement {
    #private;
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
        rows: {
            type: NumberConstructor;
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
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        readonly: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        prefix: {
            type: StringConstructor;
        };
        suffix: {
            type: StringConstructor;
        };
        autocomplete: {
            type: StringConstructor;
        };
        inputmode: {
            type: StringConstructor;
        };
        min: {
            type: StringConstructor;
        };
        max: {
            type: StringConstructor;
        };
        step: {
            type: StringConstructor;
        };
        maxlength: {
            type: NumberConstructor;
        };
        pattern: {
            type: StringConstructor;
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
    rows: number;
    label?: string;
    minWidth: number;
    caption: string;
    hint: string;
    error: string;
    required: boolean;
    fieldId: string;
    name: string;
    type: string;
    disabled: boolean;
    readonly: boolean;
    prefix: string;
    suffix: string;
    autocomplete: string;
    inputmode: string;
    min: string;
    max: string;
    step: string;
    maxlength: number;
    pattern: string;
    constructor();
    protected willUpdate(): void;
    protected updated(): void;
    protected restore(): void;
    private onInput;
    protected render(): TemplateResult;
    private control;
}
