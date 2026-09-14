import { type TemplateResult } from 'lit';
import { SdsFormElement } from '../lib/form-element.js';
/** One box of the set. */
export interface CheckChoice {
    label: string;
    /** What it sends when it is on. The label where there is none. */
    value?: string;
    /** What ticking it commits to, where the label cannot say it in a line. */
    hint?: string;
    /** On the list and not on offer. */
    disabled?: boolean;
}
export interface CheckboxGroupProps {
    /** The question. Rendered as the `<legend>`. */
    legend: string;
    /** Where the page already draws the question — a dialog's title, a heading
        over the set. The legend then speaks and does not draw, so the set keeps
        its name and the question is not on the page twice. */
    legendSaidOnly?: boolean;
    /** The name the answers travel under when the form submits. One name for the
        whole set, so a server reads them as a list. */
    name: string;
    /** The boxes, each with its label and what it sends — set from script, being
        a list. */
    choices: readonly CheckChoice[];
    /** Which of them are on, by value or by label where a choice has none. */
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
        values: {
            type: ArrayConstructor;
        };
        hint: {
            type: StringConstructor;
        };
    };
    legend: string;
    legendSaidOnly: boolean;
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
