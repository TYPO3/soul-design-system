import type { Context, Drawn, Room, State } from './context.js';
import { type Sign, type Tone } from './paint.js';
import { type Widget } from './widgets.js';
export interface Item {
    text: string;
    /** The text is an identifier, a path or a time. */
    code?: boolean;
    /** An identifier before the text, in mono. */
    id?: string;
    sign?: Sign;
    /** A status mark before the text: a small square in its tone. */
    mark?: Tone;
    /** Status marks after the text, at the right, in order. */
    marks?: Tone[];
    /** The item stands in a box of its own, as a row of a list does. */
    boxed?: boolean;
    /** An ink outline: one of several peers a case marks, apart from the emphasis. */
    strong?: boolean;
    state?: State;
    emphasis?: boolean;
    /** The emphasis fills the item, and its text stands on it in the ground colour. */
    fill?: boolean;
}
export interface Column {
    eyebrow?: string;
    /** The letter of a part before the title, in the colour of the claim: the
        parts of a document, lettered. It spends no emphasis. */
    letter?: string;
    /** A figure under the eyebrow, at the size of a tile's value: what the
        column counts. */
    value?: string;
    title?: string;
    /** A line under the title, in mono: the fields or the steps it names. */
    sub?: string;
    /** An identifier at the right of the title. */
    id?: string;
    /** Where in an interface the column happens, as a sign at its top right. */
    place?: Sign;
    /** A condition of the whole case, white on ink across the top edge at its right. */
    badge?: string;
    body?: string;
    items?: Item[];
    /** Lines in a terminal: an ink block, in mono. */
    terminal?: string[];
    /** A note under the items. */
    note?: string;
    /** A last word at the foot, in mono: what the column is for. */
    foot?: string;
    /** Controls of an interface, in order, after the items. */
    widgets?: Widget[];
    /** Lines from the bottom of one control to the top of another, by their ids. */
    joins?: Join[];
    strong?: boolean;
    state?: State;
    emphasis?: boolean;
}
export interface Join {
    from: string;
    to: string;
    /** A dashed line: what does not get through, or a weaker tie. */
    dashed?: boolean;
    /** A head at the end: the line is a move or a step. */
    arrow?: boolean;
    /** The line runs near the right edge of the two controls, not between their middles. */
    right?: boolean;
}
export interface ColumnsSpec {
    kind: 'columns';
    columns: Column[];
    /** What a sign or a chip stands for, under the columns. */
    legend?: {
        sign?: Sign;
        chip?: string;
        badge?: string;
        pill?: string;
        label: string;
    }[];
    /** The columns are steps of one chain: an arrow joins each to the next. */
    chain?: boolean;
    /** A staircase: each column starts a step higher than the one before. */
    rise?: boolean;
    /** Names at the left for the items of every column, in order. Each
        item then draws only its sign, and the items line up. */
    rows?: string[];
    /** No card: the items stand as plain text, each id a key in the body's
        size and the muted ink. For a key under a sketch. */
    bare?: boolean;
    /** Each column's title and body stand in its middle, with no rule under
        them: a level that its signs stand under. */
    centred?: boolean;
}
export declare const columns: (spec: ColumnsSpec, space: Room, ctx: Context) => Drawn;
