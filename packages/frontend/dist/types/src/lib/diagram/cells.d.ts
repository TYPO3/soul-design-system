import type { Context, Drawn, Room, State } from './context.js';
import { type Sign } from './paint.js';
export interface Cell {
    id: string;
    sign?: Sign;
    state?: State;
    emphasis?: boolean;
}
export interface CellGroup {
    title: string;
    sub?: string;
    /** The verdict the sub line says: it stands in its status colour. */
    tone?: 'ok' | 'warn' | 'error';
    cells: Cell[];
}
export interface CellsSpec {
    kind: 'cells';
    groups: CellGroup[];
    /** What each sign means here, where the default word is too general. */
    legend?: Partial<Record<Sign, string>>;
    /** Each group in a box, its cells bare in it and its verdict at its foot. */
    boxed?: boolean;
}
export declare const cells: (spec: CellsSpec, room: Room, ctx: Context) => Drawn;
