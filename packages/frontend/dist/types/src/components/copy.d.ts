import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
/** Which end of a value gives way, where it is drawn one line high. */
export type CopyEllipsis = 'none' | 'start' | 'end';
export interface CopyProps {
    /** What is shown, and the whole of what the button writes. */
    value: string;
    /** What the value is, so four buttons down a column can be told apart by
        somebody who cannot see which line each one is on. It is the tooltip and
        the accessible name from the one property — without it the button says
        only that it copies, which is true and names nothing. */
    label?: string;
    /** Where the value is cut when the column is too narrow for it, instead of
        wrapping: `start` keeps the name a path ends on, `end` keeps the root it
        begins at. Off by default — a value that wraps under itself is still
        readable whole, which a cut one is not. */
    ellipsis?: CopyEllipsis;
}
export declare class SdsCopy extends SdsElement {
    static properties: {
        value: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        ellipsis: {
            type: StringConstructor;
        };
        copied: {
            type: BooleanConstructor;
            state: boolean;
        };
    };
    value: string;
    label: string;
    ellipsis: CopyEllipsis;
    copied: boolean;
    constructor();
    private take;
    protected render(): TemplateResult;
}
