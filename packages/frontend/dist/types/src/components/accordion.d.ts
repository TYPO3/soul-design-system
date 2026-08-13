import { type TemplateResult } from 'lit';
import './accordion-item.ts';
import { SdsElement } from '../lib/element.js';
/** One question. `open` is for the one a page wants standing open — the first
    answer on a page of them, usually, so the shape of an answer is visible
    without pressing anything. */
export interface Entry {
    question: string;
    answer: string | TemplateResult;
    open?: boolean;
    /** Where a page links to this one answer. See `sds-accordion-item`. */
    anchor?: string;
}
export interface AccordionProps {
    /** The questions, where a page has them as data. An answer that is blocks —
        what a documentation renderer hands over — is written between the tags as
        `sds-accordion-item` instead, and then this stays empty. */
    entries: readonly Entry[];
    /** More than one at a time. The platform's own exclusivity is otherwise on,
        and it is on because a list is easier to read than a wall. */
    multiple?: boolean;
    /** What the set is called, where the page has several. Two exclusive groups
        on one page must not close each other's answers. */
    name?: string;
}
export declare class SdsAccordion extends SdsElement {
    static properties: {
        entries: {
            type: ArrayConstructor;
        };
        multiple: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        name: {
            type: StringConstructor;
        };
    };
    entries: readonly Entry[];
    multiple: boolean;
    name: string;
    /** The questions written between the tags, for answers that are blocks
        rather than a string a property can hold. Taken before Lit renders over
        them, and handed back below. */
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
    protected updated(): void;
}
