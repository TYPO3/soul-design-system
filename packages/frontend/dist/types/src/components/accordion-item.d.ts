import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export declare class SdsAccordionItem extends SdsElement {
    static properties: {
        question: {
            type: StringConstructor;
            reflect: boolean;
        };
        /** Standing open. For the first answer on a page of them, usually, so the
            shape of an answer is visible without pressing anything. */
        open: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        /** The set this answer folds in — `<details name>`, which is the platform's
            own exclusivity. Empty where the set was told `multiple`. */
        name: {
            type: StringConstructor;
            reflect: boolean;
        };
        /** The address of this one answer. It lands on the answer and not on the
            question: a fold whose content is jumped *into* is opened by the
            platform, and one jumped *at* stays shut. */
        anchor: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    /** What is being asked, which is the row a reader presses. The answer goes
        between the tags. */
    question: string;
    /** Whether this one stands open. A `<details>` underneath, so it opens
        before any script and a reader who printed the page gets the answer
        too. */
    open: boolean;
    /** The group it belongs to. Entries sharing a name open one at a time,
        which is the platform’s own exclusive accordion. */
    name: string;
    /** The id the row is reachable at, so a link can name one answer in a page
        of them. */
    anchor: string;
    private taken;
    constructor();
    connectedCallback(): void;
    protected firstUpdated(): void;
    protected render(): TemplateResult;
}
