import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
/** The wash a modal or drawer sits on — `--surface-overlay`, never a shadow. */
export declare class SdsOverlay extends SdsElement {
    protected render(): TemplateResult;
}
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
