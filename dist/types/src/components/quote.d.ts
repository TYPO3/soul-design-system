import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface QuoteProps {
    /** The sentence. Long enough to be worth borrowing, short enough to read at
        lead size — a paragraph in quotation marks is a paragraph. */
    body: string | TemplateResult;
    /** Who said it. A person, a document, a release note. */
    by: string;
    /** What it is to the subject, where the name alone does not say — a
        diagram, a release note, a maintainer.
        The attribute is `as` and not `role`, and that is not a preference:
        `role` is the global ARIA attribute, so `role="maintainer"` told every
        screen reader the element had a role by that name — which does not exist,
        and axe says so. Same collision `sds-note` renamed `title` for. */
    as?: string;
    /** Where it can be read in full. */
    href?: string;
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
    };
    body: string | TemplateResult;
    by: string;
    as: string;
    href: string;
    constructor();
    protected render(): TemplateResult;
}
