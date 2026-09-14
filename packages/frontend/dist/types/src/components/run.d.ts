import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
/** Where the work is in relation to one stop. */
export type RunState = 'ahead' | 'running' | 'done' | 'failed';
/** What became of the whole. `running` while any of it is still in hand. */
export type RunVerdict = 'running' | 'done' | 'failed';
/** What a page calls the states, where the page is not in English. Partial:
    a page names the ones it has a word for and the rest stay as they are. So
    a language that arrives one string at a time is never half a run with no
    words at all. */
export type RunWords = Partial<Record<RunState, string>>;
/** One stop of the work. */
export interface RunStep {
    /** What this stop is. */
    label: string;
    state: RunState;
    /** A quiet word at the far end of the row — a duration, a count. */
    meta?: string;
    /** What happens to it right now, in words. A mark is a shape and a
        colour, and a reader who waits on a queue is owed a sentence. */
    note?: string;
    /** What it wrote. A stop that wrote nothing does not open: a control that
        opens onto an empty box is a promise the row cannot keep. */
    output?: string;
    /** Which set it belongs to, where the work is many jobs at once rather than
        one sequence. Stops with none are one run, read in order. */
    group?: string;
}
export interface RunProps {
    /** What the run is, in one line — or what became of it. A set of jobs says
        that at the top: "Some checks haven't completed yet". */
    heading: string;
    /** What became of the whole. It is the mark beside the heading. */
    verdict: RunVerdict;
    /** The line under the heading: where the work has got to, or the counts. */
    note?: string;
    /** The stops, set from script — being a list, and one that changes. */
    steps: readonly RunStep[];
    /** If the whole stands open. A run a reader watches gets `open`; one in a
        list of past runs does not, and the head is then the whole of it. */
    open?: boolean;
    /** The names of the states, where the page is not in English. Every state
        is a word and a mark. The word is the only one of the two a reader who
        hears the page ever gets. */
    stateWords?: RunWords;
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
        stateWords: {
            type: ObjectConstructor;
            attribute: string;
        };
    };
    heading: string;
    verdict: RunVerdict;
    note: string;
    steps: readonly RunStep[];
    open: boolean;
    stateWords: RunWords;
    constructor();
    /** The name of a state here. The page's word where it has one, and the
        English of the marks where it has not. */
    private said;
    /** The stops in the order they arrive, under the group each one named.
        A run with no groups is one list, which is the sequence. */
    private get sets();
    protected updated(): void;
    /** A press is the reader's answer to "must this stand open?", and the
        answer is the opposite of what stands now. The press and not `toggle`.
        That one fires for a row this element opened by itself, which then
        counts as opened by hand and stays open too long.
  
        The platform's own toggle stops here, because it runs *after* this
        element has rendered the answer and undoes it. One thing decides if a
        row stands open, and it is the answer kept here. */
    private decide;
    private row;
    private list;
    protected render(): TemplateResult;
}
