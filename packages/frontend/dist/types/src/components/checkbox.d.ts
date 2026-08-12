import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface CheckboxProps {
    label: string;
    /** What ticking it commits to, where the label cannot say it in a line. */
    hint?: string;
    checked?: boolean;
    /** Neither on nor off: the box stands for a set only some of which is
        ticked. Ticking it resolves to on, the way the platform resolves it. */
    indeterminate?: boolean;
    name?: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
}
export declare class SdsCheckbox extends SdsElement {
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
    private onChange;
    protected render(): TemplateResult;
}
