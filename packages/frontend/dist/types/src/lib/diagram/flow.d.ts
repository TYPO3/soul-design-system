import { type CardSpec } from './card.js';
import type { Context, Drawn, Room, State } from './context.js';
export interface FlowNode extends CardSpec {
    id: string;
    /** Column and row, from 0. */
    at: [number, number];
    /** How many columns the node spans. */
    span?: number;
    /** How many rows the node spans. */
    rows?: number;
}
export interface FlowEdge {
    /** A node id, or `group:<label>` for a boundary. */
    from: string;
    to: string;
    label?: string;
    /** The axis the connector leaves on where it bends. */
    via?: 'h' | 'v';
    /** Where in the gap it bends, from 0 to 1. The middle by default. */
    bend?: number;
    state?: State;
    /** A connector that fails: drawn in the error colour. */
    fails?: boolean;
    /** A head at both ends: a question and its answer on one line. */
    both?: boolean;
    emphasis?: boolean;
}
export interface FlowGroup {
    /** The name a connector uses for the boundary. `group:<label>` without it. */
    id?: string;
    label: string;
    /** Its nodes, and the nodes of the boundaries inside it. */
    nodes: string[];
    state?: State;
    /** The boundary it stands inside, by its name: a part of a part. */
    within?: string;
    /** The boundary is the claim: its outline in the claim colour. */
    emphasis?: boolean;
}
export interface FlowSpec {
    kind: 'flow';
    /** The relative width of each column. */
    columns: number[];
    gap?: [number, number];
    nodes: FlowNode[];
    edges?: FlowEdge[];
    groups?: FlowGroup[];
    /** A label at the left of a row, and a note under it, by row. */
    rows?: {
        label?: string;
        note?: string;
    }[];
    /** A head over each column, by column: what the column holds. */
    heads?: string[];
    /** The letter of a part before each head, by column, in the colour of the claim. */
    letters?: string[];
    /** A word in mono capitals over each head, by column: the head is then a title in bold. */
    eyebrows?: string[];
    /** Connectors that leave one side of one node leave it apart, each with
        its own bend, and share no trunk. */
    fan?: boolean;
    /** With `fan`, the connectors across a gap leave the middle of their
        source together and run to their ends as curves. */
    curve?: boolean;
    /** The columns whose head names the claim, in the claim colour. */
    claims?: number[];
    /** Every row as high as the highest: peers in rows of one height. */
    even?: boolean;
}
export declare const folds: (spec: FlowSpec, width: number) => FlowSpec[];
export declare const flow: (spec: FlowSpec, space: Room, ctx: Context) => Drawn;
