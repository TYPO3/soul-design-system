import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
/** One pair: the term a reader scans for, the value they came for, and a
    line about the value that is not part of it. */
export interface FactsEntry {
    term: string;
    value: string | TemplateResult;
    note?: string;
}
export interface FactsProps {
    /** The pairs, where a caller holds them as data or a static render has
        no children. Between the tags otherwise. */
    entries?: readonly FactsEntry[];
}
export declare class SdsFacts extends SdsElement {
    static properties: {
        entries: {
            type: ArrayConstructor;
        };
    };
    entries: readonly FactsEntry[];
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
