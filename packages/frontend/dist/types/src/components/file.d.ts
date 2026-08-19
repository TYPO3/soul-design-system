import { type TemplateResult } from 'lit';
import { SdsFormElement } from '../lib/form-element.js';
export interface FileProps {
    /** The visible label, above the control. A file picker with none is a
        button whose own words are the browser's and say only "Choose File". */
    caption?: string;
    /** What it is called for anything that cannot see what it sits beside. */
    label?: string;
    /** What the files are called when the form is sent. */
    name?: string;
    /** Which kinds the picker offers first — `image/*`, `.pdf,.md`. A filter and
        not a guarantee: what arrives is still checked where it lands. */
    accept?: string;
    /** More than one at a time. */
    multiple?: boolean;
    /** What to attach, under the control. Say the kinds and the size limit here
        rather than after the upload failed. */
    hint?: string;
    /** What is wrong with what was chosen. Sets the invalid state with it. */
    error?: string;
    /** Something has to be chosen before the form goes. Said in words. */
    required?: boolean;
    /** Present but not available. */
    disabled?: boolean;
    /** The control's id, so the label points at it and an error summary can. */
    fieldId?: string;
}
export declare class SdsFile extends SdsFormElement {
    static properties: {
        caption: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        name: {
            type: StringConstructor;
        };
        accept: {
            type: StringConstructor;
        };
        multiple: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        hint: {
            type: StringConstructor;
        };
        error: {
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
        fieldId: {
            type: StringConstructor;
            attribute: string;
        };
    };
    caption: string;
    label?: string;
    name: string;
    accept: string;
    multiple: boolean;
    hint: string;
    error: string;
    required: boolean;
    disabled: boolean;
    fieldId: string;
    constructor();
    protected updated(): void;
    private onChange;
    protected render(): TemplateResult;
}
