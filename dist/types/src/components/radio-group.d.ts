import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
/** One answer. `hint` is for the consequence a label cannot carry. */
export interface Choice {
    label: string;
    value?: string;
    hint?: string;
}
export interface RadioGroupProps {
    /** What is being asked. Rendered as the `<legend>`. */
    legend: string;
    name: string;
    choices: readonly Choice[];
    /** The chosen value, or the label where a choice has none. */
    value?: string;
    hint?: string;
    required?: boolean;
}
export declare class SdsRadioGroup extends SdsElement {
    static properties: {
        legend: {
            type: StringConstructor;
        };
        name: {
            type: StringConstructor;
        };
        choices: {
            type: ArrayConstructor;
        };
        value: {
            type: StringConstructor;
        };
        hint: {
            type: StringConstructor;
        };
        required: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    legend: string;
    name: string;
    choices: readonly Choice[];
    value: string;
    hint: string;
    required: boolean;
    constructor();
    private choose;
    protected render(): TemplateResult;
}
