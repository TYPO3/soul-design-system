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
    protected readonly block = "sds-rail";
    protected readonly item = "sds-rail__item";
    private flat;
    protected render(): TemplateResult;
    /** One item, at its position in the flattened rail. */
    private one;
    private pick;
}
