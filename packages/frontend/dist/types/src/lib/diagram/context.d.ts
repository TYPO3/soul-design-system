import { type Claim } from './paint.js';
/** The band a layout draws in: its left edge, its top and its width. It
    chooses its own height and returns it. */
export interface Room {
    x: number;
    y: number;
    width: number;
}
export interface Drawn {
    svg: string;
    height: number;
    /** Where a drawing needs more than its room: the width it took. */
    width?: number;
}
/** A part that is not there: `absent` is not there or not yet reachable,
    `degraded` is there in a lesser form. Both draw as a dashed outline. */
export type State = 'present' | 'absent' | 'degraded';
export declare class Context {
    readonly name: string;
    readonly claim: string;
    /** The drawing is for a slide's room: every layout sets its controls,
        rows and gaps tighter, and its type at the same sizes. */
    readonly dense: boolean;
    /** The share of its stated height a screen of a sketch takes. A slide
        lowers it where the drawing is too tall for the room. */
    squeeze: number;
    private spent;
    private kind;
    /** A part of a composed drawing whose legend a later part repeats draws none. */
    legend: boolean;
    /** The box of each control with an id, where the drawing last set it: the ends of a join. */
    readonly places: Map<string, {
        x: number;
        y: number;
        width: number;
        height: number;
    }>;
    constructor(name: string, claim?: Claim, dense?: boolean);
    /** The page's metric, or the slide's where the drawing is dense. */
    pick<T>(page: T, slide: T): T;
    /** The claim colour, for the one part the drawing is about, or for
        peers of one kind that make the same claim. A part of another kind
        that asks for it is an error, because two claims are two drawings. */
    emphasis(kind: string, what: string): string;
    /** One way to draw. A refusal takes back the claim it spent, so the next
        way starts where this one did. */
    attempt<T>(way: () => T): T;
    fail(message: string): never;
}
