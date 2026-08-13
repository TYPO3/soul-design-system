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
    question: string;
    open: boolean;
    name: string;
    anchor: string;
    private taken;
    constructor();
    connectedCallback(): void;
    protected firstUpdated(): void;
    protected render(): TemplateResult;
}
