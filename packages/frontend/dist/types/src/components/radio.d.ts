import { type TemplateResult } from 'lit';
import { SdsFormElement } from '../lib/form-element.js';
/** One answer. `hint` is for the consequence a label cannot carry. */
export interface Choice {
    label: string;
    value?: string;
    /** What the choice commits to, where the legend cannot say it in a line. */
    hint?: string;
}
export interface RadioProps {
    /** The question. Rendered as the `<legend>`. */
    legend: string;
    /** Where the page already draws the question — a dialog's title, a heading
        over the set. The legend then speaks and does not draw, so the set keeps
        its name and the question is not on the page twice. */
    legendSaidOnly?: boolean;
    /** The name the answer travels under when the form submits. One name for
        the whole set — that is what makes it one choice rather than several. */
    name: string;
    /** The options, each with its label and what it sends — set from script,
        being a list. */
    choices: readonly Choice[];
    /** The chosen value, or the label where a choice has none. */
    value?: string;
    /** What the whole set commits to, under the legend. A choice carries its
        own where one answer needs saying and the others do not. */
    hint?: string;
    /** The reader must pick one of them before the form goes. */
    required?: boolean;
}
export declare class SdsRadio extends SdsFormElement {
    #private;
    static properties: {
        legend: {
            type: StringConstructor;
        };
        legendSaidOnly: {
            type: BooleanConstructor;
            attribute: string;
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
    legendSaidOnly: boolean;
    name: string;
    choices: readonly Choice[];
    value: string;
    hint: string;
    required: boolean;
    constructor();
    protected willUpdate(): void;
    protected updated(): void;
    protected restore(): void;
    private choose;
    protected render(): TemplateResult;
}
