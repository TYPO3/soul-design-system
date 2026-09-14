import { type TemplateResult } from 'lit';
import './badge.ts';
import { SdsElement } from '../lib/element.js';
export interface SearchResultProps {
    /** The page's name. The whole row is the link to it, not the title
        alone. */
    heading: string;
    /** Where the hit goes, already resolved — a path out of the index is
        relative to the root, and a reader is rarely standing in it. */
    href?: string;
    /** Where it is, as the site's own trail — `Documentation · Tools`. Mono,
        because a path is a machine-named thing. */
    path?: string;
    /** The sentence around the find, cut from the text and not written for the
        list. */
    snippet?: string;
    /** The query. Every occurrence of it in the snippet and the heading gets a
        mark. */
    match?: string;
    /** What kind of thing it is — reference, guide, changelog. */
    kind?: string;
    /** The release it holds for, where it holds for one. */
    meta?: string;
    /** The picture the thing found carries, where it has one. Named `src`
        because everything in this system that takes a file names it `src`. */
    src?: string;
    /** What the thumbnail shows. Empty where it adds nothing the heading has
        not said. */
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
  
        Split rather than replaced, so nothing ever lands as markup. What comes
        back is text nodes and elements, and a query with `<` in it is a query
        and not a tag. */
    private marked;
    private thumb;
    private above;
    /** The whole hit is the link, so the hit *is* an anchor. One element rather
        than a title's anchor stretched over the row by a pseudo-element. That
        is what a card does, and it costs a reader the text selection. Named by
        its heading: without that the link's name is everything in the row read
        out at once. Nowhere to go, no anchor. */
    protected render(): TemplateResult;
}
