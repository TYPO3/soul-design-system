import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export type Density = 'compact' | 'medium' | 'airy';
export interface Column {
    head: string;
    /** The cell class for the whole column — `sds-td-name` for the identifier
        the machine owns, `sds-td-meta` for anything secondary, `sds-td-into` for
        the column at the end that carries the way into the row. */
    cls?: string;
}
/** A cell with a second line under it: what the row is, and what is true about
    it right now — the branch a checkout stands on, the changes nobody has
    committed. Two facts about one thing belong in one cell; spread over two
    columns the head has to name a relationship instead of a fact. */
export interface Cell {
    /** The line the row is read by. A component where the identity is one — a
        name with the button that acts on it beside it. */
    value: string | TemplateResult;
    /** The line under it, in the register a meta cell is set in. */
    note?: string | TemplateResult;
}
export type CellValue = string | TemplateResult | Cell;
export interface Row {
    /** Text, or a component where the cell is a piece of state rather than a
        value — the badge that says how a row answered. A cell that could only
        be a string is a cell whose status has to be spelled out beside the
        table or drawn by hand into it. A `Cell` is the same thing with its own
        second line. */
    cells: readonly CellValue[];
    /** Selection, not striping — `.is-selected`, which the stylesheet already
        had and the element could not emit, so the one story that needed it
        wrote the fill inline and the two drifted to different colours. */
    selected?: boolean;
    /** Anything about this row the class layer has no name for. */
    style?: string;
}
export interface TableProps {
    /** How much air a row gets. `compact` for a reference read by scanning,
        `airy` for a short table read as prose, `medium` between them. */
    density?: Density;
    /** Let a table wider than its column scroll rather than be cut off.
        Not `scroll`: `Element.scroll()` is a platform method, and a property by
        that name shadows it. The typechecker caught it; nothing at runtime
        would have. */
    scrollable?: boolean;
    /** How wide the table itself is, where a source said. The class layer has no
        name for it and cannot have one: it is a fact about these contents rather
        than a kind of table — the same reason a row carries `style`. */
    width?: string;
    /** The columns, each with its heading and how it is aligned — set from
        script, being a list. */
    columns?: readonly Column[];
    /** The cells, a list per row, in the order the columns are declared. */
    rows?: readonly Row[];
    /** Waiting for the answer: the head stays, and the body is drawn as bars at
        the height the rows will have. A skeleton is honest only where the shape
        is already known, and a table whose columns are declared has one — under
        200ms show nothing at all, and where the shape is not known the answer is
        `.sds-loading` with a spinner instead. */
    loading?: boolean;
    /** How many bar rows to draw. What the caller knows about the answer — the
        page size it asked for, the count the last page came back with — rather
        than a number this element could only guess. */
    loadingRows?: number;
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
        width: {
            type: StringConstructor;
        };
        columns: {
            type: ArrayConstructor;
        };
        rows: {
            type: ArrayConstructor;
        };
        loading: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        loadingRows: {
            type: NumberConstructor;
            attribute: string;
        };
    };
    density: Density;
    scrollable: boolean;
    width: string;
    columns: Column[];
    rows: Row[];
    loading: boolean;
    loadingRows: number;
    private taken;
    constructor();
    connectedCallback(): void;
    private stacked;
    private cell;
    private bodyRow;
    private waitingRow;
    protected render(): TemplateResult;
}
