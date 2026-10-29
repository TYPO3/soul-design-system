import type { Context, Drawn, Room } from './context.js';
export type ChipKind = 'filled' | 'outline' | 'plain';
export interface Chip {
    id: string;
    kind?: ChipKind;
    /** The condition the ring under a chip stands for. */
    ring?: boolean;
    emphasis?: boolean;
}
export interface ChipGroup {
    label: string;
    /** Lines under the label. */
    sub?: string[];
    /** Tasks in words, in a column over its chips. */
    tasks?: string[];
    chips: Chip[];
}
export interface ChipsSpec {
    kind: 'chips';
    /** Groups as rows, the default, or as columns. */
    direction?: 'rows' | 'columns';
    /** How many chips stand side by side in a column. */
    across?: number;
    groups: ChipGroup[];
    /** What each kind of chip and the ring mean, in order. */
    legend?: {
        kind: ChipKind | 'ring';
        label: string;
    }[];
}
export declare const chips: (spec: ChipsSpec, room: Room, ctx: Context) => Drawn;
