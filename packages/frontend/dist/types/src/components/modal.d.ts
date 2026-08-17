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
    /** What the surface is about, at the top of it. */
    heading: string;
    /** What the reader has to take in. It stops at `--measure-modal`, because
        what is in a modal is read. */
    body: string | TemplateResult;
    /** The controls along the bottom, set from script — being markup, which an
        attribute cannot carry. */
    actions: readonly TemplateResult[];
    /** A width of its own where the content needs one. Otherwise the measure
        decides, which keeps every modal in the system the same shape. */
    width: number;
    constructor();
    protected render(): TemplateResult;
}
