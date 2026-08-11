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
    /** Text, or a component where the cell is a piece of state rather than a
        value — the badge that says how a row answered. A cell that could only
        be a string is a cell whose status has to be spelled out beside the
        table or drawn by hand into it. */
    cells: readonly (string | TemplateResult)[];
    /** Selection, not striping — `.is-selected`, which the stylesheet already
        had and the element could not emit, so the one story that needed it
        wrote the fill inline and the two drifted to different colours. */
    selected?: boolean;
    /** Anything about this row the class layer has no name for. */
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
