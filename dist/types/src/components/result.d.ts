import { type TemplateResult } from 'lit';
import './badge.ts';
import { SdsElement } from '../lib/element.js';
export interface ResultProps {
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
}
export declare class SdsResult extends SdsElement {
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
    };
    heading: string;
    href: string;
    path: string;
    snippet: string;
    match: string;
    kind: string;
    meta: string;
    constructor();
    /** The text with every occurrence of the query in a `<mark>`.
  
        Split rather than replaced, so nothing is ever inserted as markup: what
        comes back is text nodes and elements, and a query containing `<` is a
        query and not a tag. */
    private marked;
    protected render(): TemplateResult;
}
