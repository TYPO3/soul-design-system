import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
export interface FieldProps {
    /** What is in the field — its value when `filled`, its placeholder when not. */
    value?: string;
    icon?: IconId;
    /** Force the focus state for a still picture. Live focus needs nothing. */
    focused?: boolean;
    invalid?: boolean;
    /** The value is the user's, not a prompt. Typing sets it too. */
    filled?: boolean;
    /** A select rather than a text field: same sunken box, closed by a chevron. */
    select?: boolean;
    /** What a select offers. A text field ignores it. */
    options?: readonly string[];
    /** What the control is called, for anything that cannot see what it sits
        beside. A field with no visible label of its own owes one here. */
    label?: string;
    minWidth?: number;
}
export declare function fieldClass({ focused, invalid, filled, select }: FieldProps): string;
export declare class SdsField extends SdsElement {
    static properties: {
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
        label: {
            type: StringConstructor;
        };
        minWidth: {
            type: NumberConstructor;
            attribute: string;
        };
    };
    value: string;
    icon?: IconId;
    focused: boolean;
    invalid: boolean;
    filled: boolean;
    select: boolean;
    options: readonly string[];
    label?: string;
    minWidth: number;
    constructor();
    private onInput;
    protected render(): TemplateResult;
}
