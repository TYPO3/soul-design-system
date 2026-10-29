import type { Context, Drawn, Room } from './context.js';
import { type Sign } from './paint.js';
export type Cell = Sign | '' | {
    sign?: Sign;
    text?: string;
    code?: boolean;
    note?: number;
    chips?: string[];
    path?: string[];
};
export interface MatrixSpec {
    kind: 'matrix';
    /** `split` draws a rule before the column: the start of another set. */
    /** `letter` stands over the label at the size of a node, `sub` under it: an example. */
    /** `end`: in a left table, the head and the texts of the column stand at its right edge. */
    columns: {
        label: string;
        letter?: string;
        sub?: string;
        group?: string;
        split?: boolean;
        sign?: Sign;
        weight?: number;
        end?: boolean;
    }[];
    rows: {
        label: string;
        sub?: string;
        group?: string;
        cells: Cell[];
    }[];
    /** The row or the column the drawing is about, by its label, or several
        that make the same claim. Rows or columns side by side share a frame. */
    emphasis?: {
        row?: string | string[];
        column?: string | string[];
    };
    /** What each sign means here, where the default word is too general. */
    legend?: Partial<Record<Sign, string>>;
    /** A sentence after the words of the legend, on its line. */
    legendNote?: string;
    /** The width of the label column. It fits its longest label otherwise. */
    labelWidth?: number;
    /** Where a row group says its name: over its rows, or beside them. */
    rowGroups?: 'over' | 'beside';
    /** The notes a cell points at by number, under the legend. */
    notes?: string[];
    /** The notes stand outside the drawing, in the page around it: a cell
        keeps its number, and the drawing holds no text of a note. */
    notesOutside?: boolean;
    /** The cells hold figures: their text stands at the size of a value. */
    figures?: boolean;
    /** The heads and the texts stand at the left of their columns, the heads
        in capitals: a table that reads as a list. */
    left?: boolean;
    /** The first word of each row's label is its identifier: mono and muted in a column of its own, the name after it regular. */
    ids?: boolean;
    /** A head over the labels of the rows: what each row names. */
    head?: string;
    /** Each text cell is a block across its column, as a bar of a plan is.
        A text in parentheses is an outlined block: a smaller piece of work. */
    blocks?: boolean;
    /** A rule between every two rows. Without it, only the head, the row
        groups beside and the foot have one: the alignment carries the rows. */
    rules?: boolean;
}
export declare const matrix: (spec: MatrixSpec, space: Room, ctx: Context) => Drawn;
