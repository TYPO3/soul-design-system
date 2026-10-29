import type { Context, Drawn, Room, State } from './context.js';
export interface Part {
    count: number;
    /** `absent` or `degraded`: dashed squares, in warn for a degradation. */
    state?: State;
}
export interface UnitRow {
    label: string;
    /** Lines under the label, in mono: a call, a source. */
    sub?: string[];
    parts: Part[];
    /** A line under the squares of the row's last part that is not there. */
    missing?: string;
    emphasis?: boolean;
}
export interface UnitsSpec {
    kind: 'units';
    /** How many squares stand in a column. */
    lines?: number;
    /** What the labels name, over them. */
    head?: string;
    /** What one square is, over the squares. */
    key?: string;
    rows: UnitRow[];
}
export declare const units: (spec: UnitsSpec, room: Room, ctx: Context) => Drawn;
