import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
/** What a stop is against the one the plan is at. */
export type TimelineState = 'passed' | 'now' | 'ahead';
/** One stop with its state, as the plan hands it down where the stops are
    data: the form a static render can take. */
export interface PlacedStop {
    when: string;
    heading: string;
    now: boolean;
    state: TimelineState;
    body?: unknown;
    stops: readonly PlacedStop[];
}
/** A stop as the plan writes it from data, with the stops inside it as its
    own. Never children between the tags: a static render has no
    `connectedCallback` to move them. */
export declare const stopTemplate: (stop: PlacedStop) => TemplateResult;
export declare class SdsTimelineStop extends SdsElement {
    static properties: {
        /** When, as the plan says it: `2026-09-30`, `Sprint 2`, `Q1`. Text
            nothing parses. */
        when: {
            type: StringConstructor;
            reflect: boolean;
        };
        /** What happens here, in one line. `heading`, the name of every title
            here. */
        heading: {
            type: StringConstructor;
            reflect: boolean;
        };
        /** The stop the plan is at. One per plan; the stops before it have
            passed, the ones after it lie ahead. */
        now: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        /** What this stop is against the one marked now. The plan writes it;
            a page does not. */
        state: {
            type: StringConstructor;
            reflect: boolean;
        };
        /** The stops inside this one, where the plan renders from data. Between
            the tags otherwise, as more of these. */
        stops: {
            type: ArrayConstructor;
        };
    };
    when: string;
    heading: string;
    now: boolean;
    state: TimelineState;
    stops: readonly PlacedStop[];
    /** What stood between the tags, taken before Lit renders over it: the
        stops inside this one, and the blocks that are its own. */
    private under;
    private body;
    constructor();
    connectedCallback(): void;
    /** The mark says its state out loud, and the word beside the title says
        it again for the one that is now. `aria-current="step"` on that one.
        `role` because the box the plan draws is one generic away from this
        one, as with a step. */
    protected render(): TemplateResult;
}
