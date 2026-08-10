import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export type Density = 'compact' | 'medium' | 'airy';
export interface Column {
    head: string;
    /** The cell class for the whole column — `sds-td-name` for the identifier
        the machine owns, `sds-td-meta` for anything secondary. */
    cls?: string;
}
export interface Row {
    cells: readonly string[];
    /** Selection, not striping. */
    style?: string;
}
export interface TableProps {
    density?: Density;
    /** Let a table wider than its column scroll rather than be cut off.
        Not `scroll`: `Element.scroll()` is a platform method, and a property by
        that name shadows it. The typechecker caught it; nothing at runtime
        would have. */
    scrollable?: boolean;
    columns: readonly Column[];
    rows: readonly Row[];
}
export declare class SdsTable extends SdsElement {
    static properties: {
        density: {
            type: StringConstructor;
            reflect: boolean;
        };
        scrollable: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        columns: {
            type: ArrayConstructor;
        };
        rows: {
            type: ArrayConstructor;
        };
    };
    density: Density;
    scrollable: boolean;
    columns: Column[];
    rows: Row[];
    constructor();
    private cell;
    private bodyRow;
    protected render(): TemplateResult;
}
