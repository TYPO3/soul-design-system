import type { Context, Drawn, Room, State } from './context.js';
import { type Sign } from './paint.js';
export interface Tile {
    value: string;
    /** A word after the value: a unit, or what it is out of. */
    unit?: string;
    label: string;
    body?: string;
    sign?: Sign;
    state?: State;
    emphasis?: boolean;
}
export interface TilesSpec {
    kind: 'tiles';
    /** How many tiles stand in a row. All of them by default, four at most. */
    columns?: number;
    /** The value stands at the right of the label, the unit under the label, and a rule closes the head. */
    aside?: boolean;
    tiles: Tile[];
}
export declare const tiles: (spec: TilesSpec, room: Room, ctx: Context) => Drawn;
