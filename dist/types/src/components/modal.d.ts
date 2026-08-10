import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export declare class SdsModal extends SdsElement {
    static properties: {
        heading: {
            type: StringConstructor;
        };
        body: {
            type: StringConstructor;
        };
        /** Rendered buttons. Ghost first, primary last — the destructive-free
            order the rest of the system reads in. */
        actions: {
            type: ArrayConstructor;
        };
        width: {
            type: NumberConstructor;
            reflect: boolean;
        };
    };
    heading: string;
    body: string | TemplateResult;
    actions: readonly TemplateResult[];
    width: number;
    constructor();
    protected render(): TemplateResult;
}
