import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsNav, type NavItem } from './nav-base.js';
/** A folded section of a rail. */
export interface RailGroup {
    label: string;
    items: readonly NavItem[];
    /** Open whatever else is true. A group holding the current item opens
        anyway, which is the case that matters and needs no saying. */
    open?: boolean;
}
export type RailEntry = NavItem | RailGroup;
export declare class SdsRail extends SdsNav {
    static properties: {
        items: {
            type: ArrayConstructor;
        };
        active: {
            type: NumberConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
        };
    };
    protected readonly block = "sds-rail";
    protected readonly item = "sds-rail__item";
    /** What this is the list of, standing over it. A rail holding one section of
        a site says which; a column of ten links with nothing above it does not.
        Left empty there is no heading, which is right where the rail is the whole
        navigation there is. */
    label: string;
    /** The items a server wrote between the tags. Same reason as `sds-menu`: a
        renderer resolves its own tree, and every one of those answers would have
        to be encoded and worked out again to arrive as `items`. What it writes
        are the classes below, so the two shapes are one shape. */
    private taken;
    private flat;
    constructor();
    connectedCallback(): void;
    /** The heading, where there is one. */
    private heading;
    protected render(): TemplateResult;
    /** One item, at its position in the flattened rail. */
    private one;
    private pick;
}
