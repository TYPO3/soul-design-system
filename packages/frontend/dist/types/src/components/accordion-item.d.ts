import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export declare class SdsAccordionItem extends SdsElement {
    static properties: {
        question: {
            type: StringConstructor;
            reflect: boolean;
        };
        /** Open. For the first answer on a page of them, usually, so the shape
            of an answer is visible before any press. */
        open: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        /** The set this answer folds in — `<details name>`, which is the platform's
            own exclusivity. Empty where the set says `multiple`. */
        name: {
            type: StringConstructor;
            reflect: boolean;
        };
        /** The address of this one answer. It lands on the answer and not on the
            question. The platform opens a fold when a jump lands *inside* it. One
            the jump lands *at* stays shut, and so does one it lands on the summary
            of. The stylesheet keeps the question over the arrival. */
        anchor: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    /** The question, which is the row a reader presses. The answer goes
        between the tags. */
    question: string;
    /** If this one stands open. A `<details>` underneath, so it opens before
        any script and a reader who printed the page gets the answer too. */
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
