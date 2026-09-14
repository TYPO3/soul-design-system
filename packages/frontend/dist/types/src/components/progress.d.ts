import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
/** How the bar says its position. Never `none` where the bar stands on its
    own — the read-out is the only part of it a reader can quote. */
export type ProgressReadout = 'percent' | 'count' | 'none';
export type ProgressSize = 'medium' | 'small';
export interface ProgressProps {
    /** What the work is, over the bar. Without one the bar is bare — right
        where the surface around it names the job — and it still owes `label`. */
    caption?: string;
    /** Its name, for anything that cannot see what it sits beside. */
    label?: string;
    /** Where it stands, in the same unit as `max`. Set it from outside as the
        work reports; the bar travels to the new width in `--duration-fast`. */
    value?: number;
    /** The whole the value is a part of. */
    max?: number;
    /** `percent` is the share, `count` is the two numbers themselves — "3 of
        12 files", where the counted thing is the useful part. */
    readout?: ProgressReadout;
    /** What the numbers count, said after them in a `count` read-out. */
    unit?: string;
    /** What the work does right now. Over 2s this is what has to say why. The
        same line can stand between the tags where it carries a link or a name
        in mono. */
    note?: string | TemplateResult;
    /** `small` is the bar in a row of other things — the track alone gets
        thinner, and nothing else about it changes. */
    size?: ProgressSize;
    /** That work happens right now: a hatch travels through the filled part
        while the bar stands still. Off the moment the work stops — one that
        travels at a standstill claims something nobody measured — and off when
        the run is complete. */
    pulsing?: boolean;
}
export declare class SdsProgress extends SdsElement {
    static properties: {
        caption: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        value: {
            type: NumberConstructor;
        };
        max: {
            type: NumberConstructor;
        };
        readout: {
            type: StringConstructor;
        };
        unit: {
            type: StringConstructor;
        };
        note: {
            type: StringConstructor;
        };
        size: {
            type: StringConstructor;
        };
        pulsing: {
            type: BooleanConstructor;
        };
    };
    caption: string;
    label?: string;
    value: number;
    max: number;
    readout: ProgressReadout;
    unit: string;
    note: string | TemplateResult;
    size: ProgressSize;
    pulsing: boolean;
    private taken;
    constructor();
    connectedCallback(): void;
    /** The whole. A caller that counts from a total it has not got yet can
        report zero. A share of nothing is a division this cannot do. */
    private get whole();
    /** Where it stands, clamped. Work that overruns its own estimate draws a
        full bar, never one that runs out of its track. A value that is not a
        number at all is nothing done rather than a bar of `NaN`. */
    private get at();
    /** The number a reader gets. Rounded, because a percentage with two
        decimals is a measurement and this is a position. */
    private get percent();
    /** What the read-out says, and what a screen reader gets in place of the
        bare number. Empty where the caller asked for no read-out. */
    private said;
    protected render(): TemplateResult;
}
