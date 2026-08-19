import { type TemplateResult } from 'lit';
import { SdsFormElement } from '../lib/form-element.js';
export interface SwitchProps {
    /** What is on when it is on, in a line beside the track. */
    label: string;
    /** What turning it on does, where the label cannot say it in a line. */
    hint?: string;
    /** On or off. The property is the state, so a form reset puts back what the
        markup said rather than what was last pressed. */
    checked?: boolean;
    /** What it is called when a form carries it after all — a settings page is
        still a form. */
    name?: string;
    /** What it sends when it is on. `on` where nothing is written, which is the
        platform's own default. */
    value?: string;
    /** Present but not available, and the real attribute so nothing can press
        it. */
    disabled?: boolean;
}
export declare class SdsSwitch extends SdsFormElement {
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
        name: {
            type: StringConstructor;
        };
        value: {
            type: StringConstructor;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    label: string;
    hint: string;
    checked: boolean;
    name: string;
    value: string;
    disabled: boolean;
    constructor();
    protected willUpdate(): void;
    protected updated(): void;
    protected restore(): void;
    private onChange;
    protected render(): TemplateResult;
}
