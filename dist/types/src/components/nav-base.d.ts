import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface NavProps {
    items: readonly string[];
    active?: number;
}
export declare abstract class SdsNav extends SdsElement {
    static properties: {
        items: {
            type: ArrayConstructor;
        };
        active: {
            type: NumberConstructor;
            reflect: boolean;
        };
    };
    items: string[];
    active: number;
    /** The class on the wrapper, e.g. `sds-pills`. */
    protected abstract readonly block: string;
    /** The class on each item, e.g. `sds-pill`. */
    protected abstract readonly item: string;
    constructor();
    protected items_(): TemplateResult[];
}
