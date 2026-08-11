import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
/** Which drawing. `s` is 16–19px, `m` 20–31, `l` from 32 up. */
export type SignetSize = 's' | 'm' | 'l';
/** The drawing for a size in pixels — the bands the mark was drawn for. */
export declare const signetFor: (px: number) => SignetSize;
export declare class SdsSignet extends SdsElement {
    static properties: {
        size: {
            type: NumberConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
        };
    };
    size: number;
    /** What the mark is called, for anything that cannot see it. Empty where
        the wordmark beside it already says the name. */
    label?: string;
    constructor();
    protected render(): TemplateResult;
}
