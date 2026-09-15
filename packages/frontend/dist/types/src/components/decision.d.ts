import { type TemplateResult } from 'lit';
import './answer.ts';
import { SdsElement } from '../lib/element.js';
/** One answer the decision can take, where a page has them as data. */
export interface Answer {
    /** Its letter or number, as the paper cites it: `A`. */
    key: string;
    heading: string;
    /** What it means, in a sentence. */
    body?: string | TemplateResult;
    /** The one the paper recommends. */
    recommended?: boolean;
    /** The one the decision took. */
    decided?: boolean;
}
export interface DecisionProps {
    /** The question, in one line. */
    question: string;
    /** The answers, where a page holds them as data. Answers that are blocks
        go between the tags as `sds-answer` instead, and then this stays empty. */
    answers?: readonly Answer[];
    /** Who decides. */
    by?: string;
    /** By when, as written: `2026-09-30`. Once an answer carries
        `decided`, the day the decision fell. */
    due?: string;
    /** The word over the block. `Decision` where nobody names it. */
    label?: string;
    /** What the paper says about the question, before the answers. A
        sentence; blocks go between the tags before the answers. */
    lead?: string;
}
export declare class SdsDecision extends SdsElement {
    static properties: {
        question: {
            type: StringConstructor;
        };
        answers: {
            type: ArrayConstructor;
        };
        by: {
            type: StringConstructor;
        };
        due: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        lead: {
            type: StringConstructor;
        };
    };
    question: string;
    answers: readonly Answer[];
    by: string;
    due: string;
    label: string;
    lead: string;
    /** What stood between the tags, taken before Lit renders over it: the
        answers, and any block before them. */
    private taken;
    /** If an answer written between the tags carries `decided`. Read off
        the elements before they lift, because the block speaks in the past
        at its foot only once one does. */
    private settled;
    constructor();
    connectedCallback(): void;
    /** If one answer carries `decided`, by whichever route the answers came. */
    private get decided();
    protected render(): TemplateResult;
}
