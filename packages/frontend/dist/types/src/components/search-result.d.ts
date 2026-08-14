import { type TemplateResult } from 'lit';
import './badge.ts';
import { SdsElement } from '../lib/element.js';
export interface SearchResultProps {
    heading: string;
    href?: string;
    /** Where it is, as the site's own trail — `Documentation · Tools`. Mono,
        because a path is a machine-named thing. */
    path?: string;
    /** The sentence it was found in, cut from the text and not written for the
        list. */
    snippet?: string;
    /** What was searched for. Every occurrence of it in the snippet and the
        heading is marked. */
    match?: string;
    /** What kind of thing it is — reference, guide, changelog. */
    kind?: string;
    /** The release it holds for, where it holds for one. */
    meta?: string;
    /** The picture the thing found carries, where it has one. Named `src`
        because everything in this system that takes a file names it `src`. */
    src?: string;
    alt?: string;
}
export declare class SdsSearchResult extends SdsElement {
    static properties: {
        heading: {
            type: StringConstructor;
        };
        href: {
            type: StringConstructor;
        };
        path: {
            type: StringConstructor;
        };
        snippet: {
            type: StringConstructor;
        };
        match: {
            type: StringConstructor;
        };
        kind: {
            type: StringConstructor;
        };
        meta: {
            type: StringConstructor;
        };
        src: {
            type: StringConstructor;
        };
        alt: {
            type: StringConstructor;
        };
    };
    heading: string;
    href: string;
    path: string;
    snippet: string;
    match: string;
    kind: string;
    meta: string;
    src: string;
    alt: string;
    constructor();
    /** The text with every occurrence of the query in a `<mark>`.
  
        Split rather than replaced, so nothing is ever inserted as markup: what
        comes back is text nodes and elements, and a query containing `<` is a
        query and not a tag. */
    private marked;
    private thumb;
    private above;
    /** The whole hit is the link, so the hit *is* an anchor — one element rather
        than a title's anchor stretched over the row by a pseudo-element, which
        is what a card does and what costs a reader the ability to select the
        text. Named by its heading: without that the link's name is everything in
        the row read out at once. Nowhere to go, no anchor. */
    protected render(): TemplateResult;
}
