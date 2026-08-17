import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
/** The message under an invalid field. Never a tooltip — an error the
    pointer has to find is an error the keyboard never surfaces at all. */
export declare class SdsFieldError extends SdsElement {
    static properties: {
        message: {
            type: StringConstructor;
        };
    };
    /** What is wrong with the value, in a sentence a reader can act on. Said
        beside the field, and again in the form’s summary. */
    message: string;
    constructor();
    protected render(): TemplateResult;
}
