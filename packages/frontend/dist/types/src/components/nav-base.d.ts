import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
/**
 * One entry of a navigation — the whole contract, for every navigation in the
 * system.
 *
 * A bar, a rail, a trail, a row of pills and the columns of a footer are the
 * same list read at different sizes, so they are given the same entry: where it
 * goes, what is under it, and what is true of it on the page being rendered.
 * Whoever renders the page knows all of that; a component works none of it out,
 * and a second shape for the same list is a second place to keep in step.
 */
export interface MenuEntry {
    label: string;
    /** Where it goes. An entry with none is a choice rather than a way out —
        pressing it moves the set it is in and says so with `sds-change`. */
    href?: string;
    icon?: IconId;
    /** Somebody else's site: it opens away, and is never the current entry. */
    external?: boolean;
    /** The page — or the item — the reader is on. */
    current?: boolean;
    /** On the way to it: an entry the current one sits under. */
    here?: boolean;
    /** A front door: it stands in the bar's row as well as in its menu. Which of
        a site's sections those are is the one thing a tree cannot say. */
    front?: boolean;
    /** A fold that starts open whatever else is true. One holding the current
        entry opens anyway, which is the case that matters and needs no saying. */
    open?: boolean;
    items?: readonly MenuEntry[];
}
/** An entry, or the label alone where that is all there is — what a story
    writes when the set is a row of words. */
export type NavItem = string | MenuEntry;
export interface NavProps {
    items: readonly NavItem[];
    active?: number;
}
/** What `sds-change` carries: which item was chosen, by position and by name. */
export interface NavChange {
    index: number;
    label: string;
}
/** The entry behind either shape. */
export declare const asEntry: (item: NavItem) => MenuEntry;
/** An entry and everything under it, in reading order. */
export declare const branch: (entry: MenuEntry) => MenuEntry[];
export declare const navLabel: (item: NavItem) => string;
/** A glyph before the label, where the item asked for one. */
export declare const navInside: (item: NavItem) => TemplateResult;
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
    /** The entries, each a label or an entry that carries its own target, glyph
        and children. A bar handed a `menu` builds these from it instead. */
    items: NavItem[];
    /** Which entry is the current one, by position. The navigation says where
        the reader is; it does not find out on its own, except `sds-nav-toc`. */
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
    /** Which entry is the current one: the entry that says so, and `active`
        where none does. Data wins — a list naming the page it is on is stating a
        fact, while `active` is a position in a set, and believing both at once
        is how two items come out marked. */
    protected at(): number;
    /** The class an item carries, active included. An entry the current one sits
        under is marked too: a section is where the reader is, without being the
        page they are on. */
    protected class_(index: number): string;
    protected items_(): TemplateResult[];
}
