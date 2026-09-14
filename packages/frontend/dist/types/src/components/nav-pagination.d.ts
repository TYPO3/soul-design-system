import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export interface PaginationProps {
    /** How many there are in all — the list, not the page. The pages follow from
        it. */
    count: number;
    /** How many go on one page. */
    perPage?: number;
    /** One-based, the way the page writes it. */
    current?: number;
    /** A page's whole address, with `{n}` where its number goes —
        `/news/page/{n}/`, `?q=typo3&page={n}&sort=date`. `#page-{n}` by default,
        so the element works on a surface that has no routes yet. A template with
        no `{n}` in it is a prefix and the number follows it. */
    href?: string;
    /** The counted thing, in the label register — "entries", "results". Left
        off, the row ends with the bare number. */
    label?: string;
}
/** What `sds-change` carries: the page the press asked for, one-based. */
export interface PageChange {
    page: number;
}
/** A page's address: the number written into the template where `{n}` stands.
    The whole address and not a prefix with the number on the end. A page
    lives at `?q=typo3&page=2&sort=date` as readily as at the end of a path.
    A caller that can only append has to reorder the query it has. */
export declare function pageHref(href: string, page: number): string;
/** How many pages a list of `count` runs to at `perPage` each. Never fewer
    than one. A list with nothing in it is still on its first page, and a row
    with zero pages has no number to draw itself around. */
export declare function pageCount(count: number, perPage: number): number;
/** The numbers a row shows: the ends, the neighbours of the current one, and
    `0` where a run is out. Two gaps at most, and never a gap in place of a
    single number — "1 … 3" is longer than "1 2 3" and says less. */
export declare function pageNumbers(pages: number, current: number): readonly number[];
export declare class SdsNavPagination extends SdsElement {
    static properties: {
        count: {
            type: NumberConstructor;
        };
        perPage: {
            type: NumberConstructor;
            attribute: string;
        };
        current: {
            type: NumberConstructor;
            reflect: boolean;
        };
        href: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
    };
    count: number;
    perPage: number;
    current: number;
    href: string;
    label: string;
    constructor();
    /** What the row draws from, and the one place the division happens. */
    get pages(): number;
    /** Say which page the press asked for, and let the answer decide what the
        press does. Cancelable, because a stop of the navigation is the only way
        a surface that pages in place can take the press over. It is the same
        press either way. */
    private ask;
    private step;
    protected render(): TemplateResult;
}
