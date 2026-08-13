import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
import './byline.ts';
export interface QuoteProps {
    /** The sentence. Long enough to be worth borrowing, short enough to stand
        at heading size — a paragraph in quotation marks is a paragraph. */
    body: string | TemplateResult;
    /** Who said it. A person, a document, a release note. */
    by: string;
    /** What it is to the subject, where the name alone does not say. The
        attribute is `as` and not `role`: `role` is the global ARIA attribute, so
        `role="maintainer"` claims a role that does not exist, and axe says so. */
    as?: string;
    /** Where it can be read in full. */
    href?: string;
    /** When, and anything else in the label register: a release, a revision. */
    meta?: string;
    /** Their initials, and the mark is drawn only where they are given. A byline
        derives them from the name because a byline is a person; a quote does
        not, because half of what is worth quoting is a document, and a monogram
        of a filename is a person invented for a source that has none. */
    initials?: string;
}
export declare class SdsQuote extends SdsElement {
    static properties: {
        body: {
            type: StringConstructor;
        };
        by: {
            type: StringConstructor;
        };
        as: {
            type: StringConstructor;
        };
        href: {
            type: StringConstructor;
        };
        meta: {
            type: StringConstructor;
        };
        initials: {
            type: StringConstructor;
        };
    };
    body: string | TemplateResult;
    by: string;
    as: string;
    href: string;
    meta: string;
    initials: string;
    constructor();
    private taken;
    connectedCallback(): void;
    protected render(): TemplateResult;
}
