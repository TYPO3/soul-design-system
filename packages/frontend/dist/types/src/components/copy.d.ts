import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export interface CopyProps {
    /** What is shown, and the whole of what the button writes. */
    value: string;
    /** What the value is, so four buttons down a column can be told apart by
        somebody who cannot see which line each one is on. It is the tooltip and
        the accessible name from the one property — without it the button says
        only that it copies, which is true and names nothing. */
    label?: string;
}
export declare class SdsCopy extends SdsElement {
    static properties: {
        value: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        copied: {
            type: BooleanConstructor;
            state: boolean;
        };
    };
    value: string;
    label: string;
    copied: boolean;
    constructor();
    private take;
    protected render(): TemplateResult;
}
