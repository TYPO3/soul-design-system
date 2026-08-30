import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
/** Where the work is in relation to one stop. */
export type RunState = 'ahead' | 'running' | 'done' | 'failed';
/** What became of the whole. `running` while any of it is still in hand. */
export type RunVerdict = 'running' | 'done' | 'failed';
/** One stop of the work. */
export interface RunStep {
    /** What this stop is. */
    label: string;
    state: RunState;
    /** A quiet word at the far end of the row — a duration, a count. */
    meta?: string;
    /** What is happening to it right now, in words. A mark is a shape and a
        colour, and a reader waiting on a queue is owed a sentence. */
    note?: string;
    /** What it wrote. A stop that wrote nothing does not open: a control that
        opens onto an empty box is a promise the row cannot keep. */
    output?: string;
    /** Which set it belongs to, where the work is many jobs at once rather than
        one sequence. Stops carrying none are one run, read in order. */
    group?: string;
}
export interface RunProps {
    /** What the run is, in one line — or what has become of it, which is what a
        set of jobs says at the top: "Some checks haven't completed yet". */
    heading: string;
    /** What became of the whole. It is the mark beside the heading. */
    verdict: RunVerdict;
    /** The line under the heading: where the work has got to, or the counts. */
    note?: string;
    /** The stops, set from script — being a list, and one that changes. */
    steps: readonly RunStep[];
    /** Whether the whole stands open. A run being watched is written `open`; one
        in a list of past runs is not, and the head is then the whole of it. */
    open?: boolean;
}
export declare class SdsRun extends SdsElement {
    #private;
    static properties: {
        heading: {
            type: StringConstructor;
        };
        verdict: {
            type: StringConstructor;
            reflect: boolean;
        };
        note: {
            type: StringConstructor;
        };
        steps: {
            type: ArrayConstructor;
        };
        open: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    heading: string;
    verdict: RunVerdict;
    note: string;
    steps: readonly RunStep[];
    open: boolean;
    constructor();
    /** The stops in the order they are given, under the group each one named.
        A run with no groups is one list, which is the sequence. */
    private get sets();
    protected updated(): void;
    /** A press is the reader's answer to "should this stand open?", and the
        answer is the opposite of what stands now — the press itself flips it.
        The press and not `toggle`: that one fires for a row this element opened
        by itself, which would count as opened by hand and stay open long after
        the work had moved on.
  
        The platform's own toggle is taken off it, because it runs *after* this
        element has already rendered the answer and undoes it. One thing decides
        whether a row stands open, and it is the answer kept here. */
    private decide;
    private row;
    private list;
    protected render(): TemplateResult;
}
