import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
export interface FieldProps {
    /** The text in the field — placeholder-grey unless `filled`. */
    value?: string;
    icon?: IconId;
    /** Draws the focus state statically, caret included. */
    focused?: boolean;
    invalid?: boolean;
    /** The value is the user's, not a prompt. */
    filled?: boolean;
    /** A select rather than a text field: same sunken box, closed by a chevron. */
    select?: boolean;
    minWidth?: number;
}
export declare function fieldClass({ focused, invalid, filled, select }: FieldProps): string;
/** Compose a field. */
/** The message under an invalid field. Never a tooltip — an error the
    pointer has to find is an error the keyboard never surfaces at all. */
export declare class SdsFieldError extends SdsElement {
    static properties: {
        message: {
            type: StringConstructor;
        };
    };
    message: string;
    constructor();
    protected render(): TemplateResult;
}
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
    minWidth: number;
    constructor();
    protected render(): TemplateResult;
}
