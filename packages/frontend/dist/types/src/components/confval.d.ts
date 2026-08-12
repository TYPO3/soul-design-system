import { type TemplateResult } from 'lit';
import './badge.ts';
import { SdsElement } from '../lib/element.js';
export interface Fact {
    /** What the source called it — `type`, `default`, or an option of the
        author's own. It is set as a label and never title-cased: the value
        beside it is what the machine reads, and the key is what it is called. */
    label: string;
    value: string;
}
export interface ConfvalProps {
    /** The name being documented, verbatim. Mono at every size, like everything
        else the machine named. */
    name: string;
    /** Where a link to this value lands. Also what the mark beside the name
        points at, so a reader can take the address of one entry out of a page
        of forty without reading the source. */
    anchor?: string;
    /** Stated where it is true and left off where it is not: a reference of
        fifty values, half of them marked "optional", says nothing twice as
        loudly. */
    required?: boolean;
    /** What the value takes. Text rather than markup, because a type is written
        `array<string>` as often as not and anything parsing that as tags eats
        half of it. */
    type?: string;
    /** What happens if the reader leaves it alone. */
    default?: string;
    /** Anything else the source named, in the order it named it. */
    facts?: readonly Fact[];
    /** The description, where a caller has it as one string. Out of a document
        it is blocks and arrives between the tags instead. */
    body?: string | TemplateResult;
}
export declare class SdsConfval extends SdsElement {
    static properties: {
        name: {
            type: StringConstructor;
        };
        anchor: {
            type: StringConstructor;
        };
        required: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        type: {
            type: StringConstructor;
        };
        default: {
            type: StringConstructor;
        };
        facts: {
            type: ArrayConstructor;
        };
        body: {
            type: StringConstructor;
        };
    };
    name: string;
    anchor: string;
    required: boolean;
    type: string;
    default: string;
    facts: readonly Fact[];
    body: string | TemplateResult;
    private taken;
    constructor();
    connectedCallback(): void;
    /** The two the directive names first, then whatever else the source set.
        Order is fixed rather than alphabetical: a reader comparing two entries
        compares them line by line. */
    private get stated();
    private fact;
    protected render(): TemplateResult;
}
