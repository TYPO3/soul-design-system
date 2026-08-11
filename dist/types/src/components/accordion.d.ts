import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
/** One question. `open` is for the one a page wants standing open — the first
    answer on a page of them, usually, so the shape of an answer is visible
    without pressing anything. */
export interface Entry {
    question: string;
    answer: string | TemplateResult;
    open?: boolean;
}
export interface AccordionProps {
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
    constructor();
    protected render(): TemplateResult;
}
