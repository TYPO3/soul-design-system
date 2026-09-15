import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
/** One stop of a plan, where a page has the plan as data. */
export interface TimelineEntry {
    /** When, as the plan says it: `2026-09-30`, `Sprint 2`, `Q1`. */
    when: string;
    heading: string;
    body?: string | TemplateResult;
    /** The stop the plan is at. One per plan; the stops before it have
        passed, the ones after it lie ahead. A stop that holds the one marked
        is at it too. */
    now?: boolean;
    /** The stops inside this one: the packages of a sprint, the steps of a
        phase. Read in order with the rest, so a package marked now puts its
        sprint at now and the packages before it at passed. */
    items?: readonly TimelineEntry[];
}
export interface TimelineProps {
    /** The stops, where a page holds the plan as data. Stops that are blocks
        go between the tags as `sds-timeline-stop` instead, and then this
        stays empty. */
    entries?: readonly TimelineEntry[];
}
export declare class SdsTimeline extends SdsElement {
    static properties: {
        entries: {
            type: ArrayConstructor;
        };
    };
    entries: readonly TimelineEntry[];
    /** The stops written between the tags. Read before Lit renders over
        them, and before each stop lifts its own children away. The elements
        go back into the list with their state on them. */
    private taken;
    constructor();
    connectedCallback(): void;
    private fromElements;
    private fromEntries;
    private fromMarkup;
    private get read();
    /** Every stop in the order a reader reads, each with the lines it holds. */
    private place;
    /** The line the plan is at: the last stop marked now, in order. So a
        package marked now wins over the sprint that holds it. None marked is
        a plan not yet begun. */
    private at;
    /** What a stop is against the line the plan is at. It is that line or
        holds it; it ends before it; or it starts after it. */
    private state;
    /** Each stop with its state, down the tree. An element gets it written
        on as an attribute and renders itself from there. */
    private settle;
    /** The stops as a list in ARIA, for the reason `sds-steps` gives. An
        element between the list and its items is a generic the platform no
        longer counts through. */
    protected render(): TemplateResult;
}
