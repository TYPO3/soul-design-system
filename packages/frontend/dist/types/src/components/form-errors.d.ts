import { type TemplateResult } from 'lit';
import './note.ts';
import { SdsElement } from '../lib/element.js';
/** One failure: what is wrong, and which field it is about. */
export interface FormError {
    message: string;
    /** The id of the field. The entry is a link to it, so pressing it moves the
        focus to the control rather than to a heading above it. */
    for?: string;
}
export interface FormErrorsProps {
    /** What went wrong, each naming the field it belongs to — set from script,
        being a list. The summary is what a reader is sent to; the field says
        it again where the value is. */
    errors: readonly FormError[];
    /** What the form calls itself, so the heading names the thing that failed
        rather than saying "there were errors". */
    heading?: string;
    /** This is the result of a submit the reader just made, so send them to it.
        Left off, the summary is drawn and takes nothing — which is what a page
        returned by a server with its errors already in it needs. */
    announce?: boolean;
}
export declare class SdsFormErrors extends SdsElement {
    static properties: {
        errors: {
            type: ArrayConstructor;
        };
        heading: {
            type: StringConstructor;
        };
        announce: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    errors: readonly FormError[];
    heading: string;
    announce: boolean;
    constructor();
    /** Move the reader to the summary. A summary nobody is sent to is a summary
        nobody reads. */
    focusSummary(): void;
    protected updated(): void;
    protected render(): TemplateResult;
}
