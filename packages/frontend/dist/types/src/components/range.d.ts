import { type TemplateResult } from 'lit';
import { SdsFormElement } from '../lib/form-element.js';
export interface RangeProps {
    /** The visible label. Without one the slider is bare — right where the
        surface around it says what it moves — and it still owes `label`. */
    caption?: string;
    /** What it is called for anything that cannot see what it sits beside. */
    label?: string;
    /** What the value is called when the form is sent. */
    name?: string;
    /** The ends of the run and the distance between two stops. Strings, so a
        caller writes them the way the attribute takes them. */
    min?: string;
    max?: string;
    step?: string;
    /** Where it stands. */
    value?: string;
    /** What the number means, beside the read-out: `px`, `%`, `ms`. */
    unit?: string;
    /** What the answer has to be, under the control. */
    hint?: string;
    /** Present but not available. */
    disabled?: boolean;
    /** The control's id, so the label and the read-out point at it. */
    fieldId?: string;
}
export declare class SdsRange extends SdsFormElement {
    #private;
    static properties: {
        caption: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        name: {
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
        value: {
            type: StringConstructor;
        };
        unit: {
            type: StringConstructor;
        };
        hint: {
            type: StringConstructor;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        fieldId: {
            type: StringConstructor;
            attribute: string;
        };
    };
    caption: string;
    label?: string;
    name: string;
    min: string;
    max: string;
    step: string;
    value: string;
    unit: string;
    hint: string;
    disabled: boolean;
    fieldId: string;
    constructor();
    protected willUpdate(): void;
    protected updated(): void;
    protected restore(): void;
    private onInput;
    protected render(): TemplateResult;
}
