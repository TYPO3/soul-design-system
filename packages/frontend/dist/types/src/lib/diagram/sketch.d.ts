import type { Context, Drawn, Room, State } from './context.js';
import { type Widget } from './widgets.js';
export interface Region {
    label?: string;
    /** How the children stand: side by side, or one under the other. */
    split?: 'row' | 'column';
    /** A fixed length along the parent's split. The other children share the remaining length. */
    size?: number;
    children?: Region[];
    surface?: 'raised' | 'sunken' | 'none';
    /** Placeholder lines of text. */
    lines?: number;
    /** A number or a letter that a text beside the sketch refers to. */
    marker?: string;
    state?: State;
    emphasis?: boolean;
    /** An ink outline, for one of several peers apart from the emphasis. */
    strong?: boolean;
    /** Hatched: there for the editors, hidden from the visitors. */
    hidden?: boolean;
    /** The label as the region's name: the body's size, bold, in the ink. */
    head?: boolean;
    /** The label in the sans face, regular and muted: a name of a part, not an identifier. */
    plain?: boolean;
    /** Controls in the region, one under the other, or side by side with
        `flow: 'row'`. */
    widgets?: Widget[];
    flow?: 'row' | 'column';
    /** Controls in a grid of this many columns, each as wide as the others. */
    across?: number;
    /** Small outlined squares down the region: the icons of a folded column. */
    icons?: number;
}
export interface Screen {
    title?: string;
    caption?: string;
    /** The relative width of the screen. */
    weight?: number;
    /** A phone or a tablet: an ink outline, a wide edge and a bar at its foot. */
    device?: boolean;
    root: Region;
    /** A dashed band under the screen: what the interface holds out of sight.
        Its label stands at its left, its controls in a row after it. */
    band?: Region;
}
export interface SketchSpec {
    kind: 'sketch';
    /** The height of every screen. */
    height: number;
    /** The title of each screen stands over it as a head, in capitals. */
    heads?: boolean;
    screens: Screen[];
}
export declare const sketch: (spec: SketchSpec, room: Room, ctx: Context) => Drawn;
