import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
/** One answer. `hint` is for the consequence a label cannot carry. */
export interface Choice {
    label: string;
    value?: string;
    /** What the choice commits to, where the legend cannot say it in a line. */
    hint?: string;
}
export interface RadioProps {
    /** What is being asked. Rendered as the `<legend>`. */
    legend: string;
    /** What the answer is called when the form is sent. One name for the whole
        set — that is what makes it one choice rather than several. */
    name: string;
    /** The options, each with its label and what it sends — set from script,
        being a list. */
    choices: readonly Choice[];
    /** The chosen value, or the label where a choice has none. */
    value?: string;
    /** What the whole set commits to, under the legend. A choice carries its
        own where one answer needs saying and the others do not. */
    hint?: string;
    /** One of them has to be picked before the form goes. */
    required?: boolean;
}
export declare class SdsRadio extends SdsElement {
    #private;
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
    protected willUpdate(): void;
    connectedCallback(): void;
    private choose;
    protected render(): TemplateResult;
}
