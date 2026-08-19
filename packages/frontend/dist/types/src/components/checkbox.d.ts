import { type TemplateResult } from 'lit';
import { SdsFormElement } from '../lib/form-element.js';
export interface CheckboxProps {
    /** What ticking it means, in a line beside the box. */
    label: string;
    /** What ticking it commits to, where the label cannot say it in a line. */
    hint?: string;
    /** On or off. The property is the state, so a form reset puts back what
        the markup said rather than what was last pressed. */
    checked?: boolean;
    /** Neither on nor off: the box stands for a set only some of which is
        ticked. Ticking it resolves to on, the way the platform resolves it. */
    indeterminate?: boolean;
    /** What it is called when the form is sent. */
    name?: string;
    /** What it sends when it is on. `on` where nothing is written, which is
        the platform's own default. */
    value?: string;
    /** It has to be ticked before the form goes. Said to everyone, not drawn
        as a mark beside the label. */
    required?: boolean;
    /** Present but not available, and the real attribute so nothing can press
        it. */
    disabled?: boolean;
}
export declare class SdsCheckbox extends SdsFormElement {
    #private;
    static properties: {
        label: {
            type: StringConstructor;
        };
        hint: {
            type: StringConstructor;
        };
        checked: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        indeterminate: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        name: {
            type: StringConstructor;
        };
        value: {
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
    };
    label: string;
    hint: string;
    checked: boolean;
    indeterminate: boolean;
    name: string;
    value: string;
    required: boolean;
    disabled: boolean;
    constructor();
    protected willUpdate(): void;
    protected updated(): void;
    protected restore(): void;
    private onChange;
    protected render(): TemplateResult;
}
