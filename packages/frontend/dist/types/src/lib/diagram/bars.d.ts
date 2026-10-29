import type { Context, Drawn, Room } from './context.js';
import { type Tone } from './paint.js';
export interface Segment {
    value: number;
    tone?: Tone;
    /** A stretch the row does not have yet: a dashed outline, no fill. */
    absent?: boolean;
}
export interface Bar {
    label: string;
    /** The label is an identifier. */
    code?: boolean;
    sub?: string;
    group?: string;
    segments: Segment[];
    /** The length the row must reach. */
    target?: number;
    /** The text after the bar. The total and the unit by default, and none
        on a scale of bands. */
    value?: string;
    /** The bar the drawing is about: its ink fills in the claim colour. */
    emphasis?: boolean;
}
export interface BarsSpec {
    kind: 'bars';
    /** The end of the scale. The count of bands where the scale has bands. */
    max?: number;
    unit?: string;
    /** Values the axis under the bars marks. */
    ticks?: number[];
    /** Named steps instead of numbers: one unit of the scale each, named
        over the bars. */
    bands?: string[];
    /** What the scale measures, over the labels. */
    axis?: string;
    rows: Bar[];
    /** What each tone counts, in the order the legend names them. `absent`
        names the dashed stretch. */
    legend?: {
        tone: Tone | 'absent';
        label: string;
    }[];
}
export declare const bars: (spec: BarsSpec, room: Room, ctx: Context) => Drawn;
