import { type TemplateResult } from 'lit';
import './search-result.ts';
import { type SearchResultProps } from './search-result.js';
import { SdsElement } from '../lib/element.js';
export interface SearchHitsProps {
    /** The hits, in the reader's order. */
    items: SearchResultProps[];
    /** The query. Marked in every hit, and named in the sentence an empty
        answer gives. */
    match?: string;
    /** What the search covered, said where the hits stand otherwise. The default
        is what a site index holds; a caller that searches something else says
        so. */
    empty?: string;
}
export declare class SdsSearchHits extends SdsElement {
    static properties: {
        items: {
            type: ArrayConstructor;
        };
        match: {
            type: StringConstructor;
        };
        empty: {
            type: StringConstructor;
        };
    };
    items: SearchResultProps[];
    match: string;
    empty: string;
    constructor();
    /** An answer of nothing is an answer: which pages the search covered, and
        what the index leaves out. So a reader can tell a search that found
        nothing from one that broke. */
    private nothing;
    protected render(): TemplateResult;
}
