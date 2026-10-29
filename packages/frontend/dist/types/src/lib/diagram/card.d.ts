import type { Context, State } from './context.js';
/** One entry of a card's list: a name, a line under it, a figure at its right. */
export interface CardItem {
    title: string;
    body?: string;
    value?: string;
}
export interface CardSpec {
    title: string;
    /** Entries under the title and the body, top down. */
    items?: CardItem[];
    /** The entries in this many columns, each filled before the next. */
    across?: number;
    body?: string;
    /** The title is an identifier, a path or a flag. */
    code?: boolean;
    /** A value on the title's line, at the right: the answer to a key. */
    value?: string;
    /** `new` is a part this change adds, `changed` one it alters. */
    mark?: 'new' | 'changed';
    /** A person, or a store the parts read and write. */
    shape?: 'node' | 'person' | 'store';
    state?: State;
    /** The one part the drawing is about. */
    emphasis?: boolean;
    /** Ink ground: the part that acts, against the parts it acts on. */
    ink?: boolean;
    /** An ink outline, 2 wide: one of several peers, apart from the emphasis. */
    strong?: boolean;
    /** The emphasis fills the card, and its text stands on it in the ground colour. */
    fill?: boolean;
    /** No box: a note beside the boxes, as plain text. */
    plain?: boolean;
    /** An identifier before the title, in mono and muted: the key of the part. */
    tag?: string;
    /** A short name over the title, in mono capitals: what kind of part it is. */
    eyebrow?: string;
    /** A dashed outline around text in ink: a way out of the path, there all along. */
    dashed?: boolean;
}
declare const LINES: {
    page: {
        pad: number;
        title: number;
        body: number;
    };
    slide: {
        pad: number;
        title: number;
        body: number;
    };
};
export interface Measured {
    spec: CardSpec;
    width: number;
    height: number;
    title: string[];
    body: string[];
    items: {
        title: string[];
        body: string[];
        item: CardItem;
        hang: number;
    }[][];
    itemWidth: number;
    lines: (typeof LINES)['page'];
}
/** The lines of a card at a width, and the height they take. */
export declare const measureCard: (spec: CardSpec, width: number, what: string, dense?: boolean) => Measured;
/** The narrowest card that holds its longest word on a line. A column
    narrower than that refuses the card, so the flow widens to it. With
    `whole`, the card that holds every name whole, which a flow gives where
    it has the room. */
export declare const leastCard: (spec: CardSpec, whole?: boolean) => number;
/** The card at its place. `height` can be more than it measured, to line
    it up with its row, and the text then centres in it. */
export declare const drawCard: (m: Measured, x: number, y: number, height: number, ctx: Context, what: string) => string;
export {};
