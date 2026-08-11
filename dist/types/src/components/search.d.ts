import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
/** One page, as the index has it. */
export interface SearchEntry {
    title: string;
    url: string;
    /** The first paragraph, or as much of it as the build kept. */
    text: string;
}
export declare class SdsSearch extends SdsElement {
    static properties: {
        /** Where the index is. Relative to the page, like every other asset. */
        index: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        query: {
            type: StringConstructor;
            state: boolean;
        };
        entries: {
            type: ArrayConstructor;
            state: boolean;
        };
        open: {
            type: BooleanConstructor;
            state: boolean;
        };
    };
    index: string;
    label: string;
    query: string;
    entries: SearchEntry[] | null;
    open: boolean;
    constructor();
    private load;
    private get hits();
    private type;
    protected render(): TemplateResult;
}
