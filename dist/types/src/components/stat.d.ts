import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface StatProps {
    /** The figure. Concrete — "5", "240 ms", "12.4+" — never "many". */
    value: string;
    /** What was counted, in the label register. */
    label: string;
    /** What the figure is bounded by. Without one, the number is a boast. */
    note?: string | TemplateResult;
}
export declare class SdsStat extends SdsElement {
    static properties: {
        value: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        note: {
            type: StringConstructor;
        };
    };
    value: string;
    label: string;
    note: string | TemplateResult;
    constructor();
    protected render(): TemplateResult;
}
