import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export type Density = 'compact' | 'medium' | 'airy';
/** The edge a reader reads a column down. `end` for a count, a date or a
    duration, on its right edge and in tabular figures, so the digits line
    up. There is no third: nobody scans a centred column down an edge. The
    head goes with it, or it names the column beside it. */
export type Align = 'start' | 'end';
export interface Column {
    head: string;
    /** The cell class for the whole column. `sds-td-name` for the identifier
        the machine owns, `sds-td-meta` for anything secondary. `sds-td-into` for
        the column at the end with the way into the row. */
    cls?: string;
    /** The edge a reader reads it down. `start` unless said, as text is. */
    align?: Align;
    /** If the column stays at its content's width. A short hash, a version, a
        date. Left to its share, a seven-character cell sits in a third of the
        table and pushes the reading column to the side. The slack goes to the
        free columns. */
    fit?: boolean;
}
/** A cell with a second line under it: what the row is, and what is true
    about it right now. The branch a checkout stands on, the changes nobody
    has committed. Two facts about one thing belong in one cell. Over two
    columns the head has to name a relation instead of a fact. */
export interface Cell {
    /** The line a reader reads the row by. A component where the identity is
        one: a name with the button that acts on it beside it. */
    value: string | TemplateResult;
    /** The line under it, in a meta cell's register. */
    note?: string | TemplateResult;
}
export type CellValue = string | TemplateResult | Cell;
export interface Row {
    /** Text, or a component where the cell is a piece of state, not a value:
        the badge that says how a row answered. A cell that is only a string
        needs its status spelt out beside the table or drawn into it by hand.
        A `Cell` is the same thing with its own second line. */
    cells: readonly CellValue[];
    /** Selection, not stripes: `.is-selected`. A class the stylesheet has and
        the element cannot emit ends as an inline fill in a story, and the two
        drift to different colours. */
    selected?: boolean;
    /** Anything about this row the class layer has no name for. */
    style?: string;
}
export interface TableProps {
    /** How much air a row gets. `compact` for a reference a reader scans,
        `airy` for a short table a reader reads as prose, `medium` between. */
    density?: Density;
    /** Let a table wider than its column scroll instead of a cut. Not
        `scroll`: `Element.scroll()` is a platform method, and a property by
        that name shadows it. The typechecker sees that; the runtime does not. */
    scrollable?: boolean;
    /** How wide the table itself is, where a source said. The class layer has no
        name for it and cannot have one. It is a fact about these contents, not
        a kind of table, the reason a row carries `style` too. */
    width?: string;
    /** The columns, each with its heading and its edge. Set from script, as a
        list. */
    columns?: readonly Column[];
    /** The cells, a list per row, in the order of the columns. */
    rows?: readonly Row[];
    /** The wait for the answer. The head stays, and the body draws as bars at
        the height the rows will have. A skeleton is honest only where the shape
        is certain, and a table with declared columns has one. Under 200ms show
        nothing at all. With no shape, the answer is `.sds-loading` with a
        spinner. */
    loading?: boolean;
    /** How many bar rows to draw. What the caller knows about the answer, the
        page size it asked for, the count of the last page. Not a guess by this
        element. */
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
    /** What a column puts on both its head and its cells: what kind of cell it
        is, and its edge. One string, because the head and the cells have to
        stand at the same edge. A class list built twice comes out different
        once. */
    private marks;
    private cell;
    private bodyRow;
    private waitingRow;
    protected render(): TemplateResult;
}
