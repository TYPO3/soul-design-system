import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface LogosProps {
    /** What the marks have in common: `Used by`, `Maintained with`. */
    label?: string;
}
export declare class SdsLogos extends SdsElement {
    static properties: {
        label: {
            type: StringConstructor;
        };
    };
    label: string;
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
