import { type TemplateResult } from 'lit';
import './search-result.ts';
import { type SearchResultProps } from './search-result.js';
import { SdsElement } from '../lib/element.js';
export interface SearchHitsProps {
    /** The hits, in the order they are read. */
    items: SearchResultProps[];
    /** What was searched for. Marked in every hit, and named in the sentence an
        empty answer gives. */
    match?: string;
    /** What was searched, said where the hits would have been. The default is
        what a site index holds; a caller searching something else says so. */
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
    /** An answer of nothing is an answer: which pages were read, and what of
        them is not indexed — so a search that found nothing can be told from one
        that broke. */
    private nothing;
    protected render(): TemplateResult;
}
