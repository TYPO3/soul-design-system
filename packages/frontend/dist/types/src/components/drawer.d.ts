import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
/** From the right, full height, and carrying no shadow either. */
export declare class SdsDrawer extends SdsElement {
    static properties: {
        body: {
            type: StringConstructor;
        };
        width: {
            type: NumberConstructor;
            reflect: boolean;
        };
    };
    body: string | TemplateResult;
    width: number;
    constructor();
    protected render(): TemplateResult;
}
