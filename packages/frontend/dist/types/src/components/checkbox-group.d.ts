import { type TemplateResult } from 'lit';
import { SdsFormElement } from '../lib/form-element.js';
/** One box of the set. */
export interface CheckChoice {
    label: string;
    /** What it sends when it is ticked. The label where there is none. */
    value?: string;
    /** What ticking it commits to, where the label cannot say it in a line. */
    hint?: string;
    /** On the list and not on offer. */
    disabled?: boolean;
}
export interface CheckboxGroupProps {
    /** What is being asked. Rendered as the `<legend>`. */
    legend: string;
    /** What the answers are called when the form is sent. One name for the whole
        set, so a server reads them as a list. */
    name: string;
    /** The boxes, each with its label and what it sends — set from script, being
        a list. */
    choices: readonly CheckChoice[];
    /** Which of them are ticked, by value or by label where a choice has none. */
    values?: readonly string[];
    /** What the whole set commits to, under the legend. */
    hint?: string;
}
export declare class SdsCheckboxGroup extends SdsFormElement {
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
        values: {
            type: ArrayConstructor;
        };
        hint: {
            type: StringConstructor;
        };
    };
    legend: string;
    name: string;
    choices: readonly CheckChoice[];
    values: readonly string[];
    hint: string;
    constructor();
    protected willUpdate(): void;
    protected updated(): void;
    protected restore(): void;
    private toggle;
    protected render(): TemplateResult;
}
