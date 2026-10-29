import type { Context, Drawn, Room, State } from './context.js';
export interface Lane {
    id: string;
    label: string;
    /** A second line under the name: a host, a path, a role. */
    sub?: string;
    shape?: 'node' | 'person' | 'store';
}
export interface Step {
    from: string;
    to: string;
    text: string;
    /** The step does not get through: an error line and a cross. */
    fails?: boolean;
    state?: State;
    emphasis?: boolean;
}
export interface Note {
    note: string;
    /** The first and the last lane it stands over. All of them by default. */
    over?: [string, string];
}
export interface Phase {
    title?: string;
    /** How the phase ends: in a failure, or in the expected result. */
    tone?: 'error' | 'warn' | 'ok';
    steps: (Step | Note)[];
}
export interface SequenceSpec {
    kind: 'sequence';
    lanes: Lane[];
    /** A boundary around the heads of lanes that run in one place. */
    hosts?: {
        label: string;
        lanes: string[];
    }[];
    phases: Phase[];
}
export declare const sequence: (spec: SequenceSpec, room: Room, ctx: Context) => Drawn;
