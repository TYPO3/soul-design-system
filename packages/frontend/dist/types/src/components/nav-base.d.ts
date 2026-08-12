import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
/** A label; or a label with a glyph, a target, or both. */
export type NavItem = string | {
    label: string;
    href?: string;
    icon?: IconId;
};
export interface NavProps {
    items: readonly NavItem[];
    active?: number;
}
/** What `sds-change` carries: which item was chosen, by position and by name. */
export interface NavChange {
    index: number;
    label: string;
}
export declare const navLabel: (item: NavItem) => string;
export declare abstract class SdsNav extends SdsElement {
    static properties: {
        items: {
            type: ArrayConstructor;
        };
        active: {
            type: NumberConstructor;
            reflect: boolean;
        };
    };
    items: NavItem[];
    active: number;
    /** The class on the wrapper, e.g. `sds-pills`. */
    protected abstract readonly block: string;
    /** The class on each item, e.g. `sds-pill`. */
    protected abstract readonly item: string;
    constructor();
    /** Make an item current, and say so. Called by the items this renders, and
        by a subclass that has its own reason to move. */
    protected choose(index: number): void;
    /** A glyph before the label, where the item asked for one. */
    protected inside_(item: NavItem): TemplateResult;
    /** The class an item carries, active included. */
    protected class_(index: number): string;
    protected items_(): TemplateResult[];
}
