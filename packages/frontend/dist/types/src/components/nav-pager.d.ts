import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export interface PagerProps {
    /** The page behind this one — both halves, or neither. A control with a
        target and no name is a control nobody can read. One with a name and no
        target is a control that does nothing. */
    previousHref?: string;
    /** The name of the page before. The name rather than the word “previous”:
        a reader who decides to go back decides about the page, not the
        direction. */
    previousLabel?: string;
    /** Where the page after is. */
    nextHref?: string;
    /** The name of the page after, for the same reason as `previous-label`. */
    nextLabel?: string;
    /** The row's name for a reader who cannot see that it is one. */
    label?: string;
}
export declare class SdsNavPager extends SdsElement {
    static properties: {
        previousHref: {
            type: StringConstructor;
            attribute: string;
        };
        previousLabel: {
            type: StringConstructor;
            attribute: string;
        };
        nextHref: {
            type: StringConstructor;
            attribute: string;
        };
        nextLabel: {
            type: StringConstructor;
            attribute: string;
        };
        label: {
            type: StringConstructor;
        };
    };
    previousHref: string;
    previousLabel: string;
    nextHref: string;
    nextLabel: string;
    label: string;
    constructor();
    private static step;
    protected render(): TemplateResult;
}
