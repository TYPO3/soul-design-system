import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export interface PagerProps {
    /** The page behind this one — both halves, or neither: a control with a
        target and no name is a control nobody can read, and one with a name and
        no target is a control that does nothing. */
    previousHref?: string;
    previousLabel?: string;
    nextHref?: string;
    nextLabel?: string;
    /** What the row is called for a reader who cannot see that it is one. */
    label?: string;
}
export declare class SdsPager extends SdsElement {
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
