import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export interface PaginationProps {
    pages: number;
    /** One-based, the way it is written in the page. */
    current?: number;
    /** A page's target, with the number appended. `#page-` by default, so the
        element works on a surface that has no routes yet. */
    href?: string;
    /** What is being paged, for the count at the end of the row — "84 entries".
        Left off, the row is only the controls. */
    count?: string;
}
/** The numbers a row shows: the ends, the neighbours of the current one, and
    `0` where a run was left out. Two gaps at most, and never a gap standing in
    for a single number — "1 … 3" is longer than "1 2 3" and says less. */
export declare function pageNumbers(pages: number, current: number): readonly number[];
export declare class SdsPagination extends SdsElement {
    static properties: {
        pages: {
            type: NumberConstructor;
        };
        current: {
            type: NumberConstructor;
            reflect: boolean;
        };
        href: {
            type: StringConstructor;
        };
        count: {
            type: StringConstructor;
        };
    };
    pages: number;
    current: number;
    href: string;
    count: string;
    constructor();
    private step;
    protected render(): TemplateResult;
}
