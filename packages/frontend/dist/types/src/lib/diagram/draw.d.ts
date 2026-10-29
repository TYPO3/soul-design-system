import { type BarsSpec } from './bars.js';
import { type ColumnsSpec } from './columns.js';
import { type FlowSpec } from './flow.js';
import { type MatrixSpec } from './matrix.js';
import { type Claim } from './paint.js';
import { type SequenceSpec } from './sequence.js';
import { type SketchSpec } from './sketch.js';
import { type TilesSpec } from './tiles.js';
import { type UnitsSpec } from './units.js';
import { type CellsSpec } from './cells.js';
import { type ChipsSpec } from './chips.js';
import { type NotesSpec } from './notes.js';
export type { BarsSpec, CellsSpec, ChipsSpec, ColumnsSpec, FlowSpec, MatrixSpec, NotesSpec, SequenceSpec, SketchSpec, TilesSpec, UnitsSpec };
export interface Frame {
    /** The claim: the accessible name of the drawing. */
    title: string;
    /** What the drawing shows, for a reader who cannot see it. */
    description: string;
    /** The colour of the one emphasis: the accent, or a status colour where
        the drawing is about a failure or a degradation. */
    claim?: Claim;
    /** The room of the slide that the drawing is for, in its frame's pixels.
        A page drawing has none. */
    slide?: {
        width: number;
        height: number;
    };
}
export type Layout = FlowSpec | SequenceSpec | MatrixSpec | TilesSpec | ColumnsSpec | BarsSpec | SketchSpec | UnitsSpec | ChipsSpec | CellsSpec | NotesSpec | ComposeSpec;
/** Layouts side by side or one under the other, in one drawing with one
    emphasis. A part can carry a label over it. */
export interface ComposeSpec {
    kind: 'compose';
    direction?: 'row' | 'column';
    gap?: number;
    /** An arrow across each gap, into the head of the next part: what one part hands the next. */
    chain?: boolean;
    parts: {
        weight?: number;
        label?: string;
        spec: Layout;
    }[];
}
export type DiagramSpec = Frame & Layout;
export interface Options {
    /** The file name without its extension: the prefix of the ids inside. */
    name: string;
    /** A slide's room in its frame's pixels. Without it, a page drawing.
        The drawing in it is dense: tighter controls, rows and gaps. */
    slide?: {
        width: number;
        height: number;
    };
}
export interface Diagram {
    svg: string;
    width: number;
    height: number;
    /** On a slide: how much of the room's height the drawing takes. */
    fill?: number;
}
/** The drawing for a spec, set in the page's faces. Throws, naming the
    part, on anything the grammar refuses. */
export declare const draw: (spec: DiagramSpec, options: Options) => Diagram;
