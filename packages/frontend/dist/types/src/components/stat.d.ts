import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
import './icon.ts';
import { type IconId } from './icon.js';
export interface StatProps {
    /** The figure. Concrete — "5", "240", "12.4+" — never "many". */
    value: string;
    /** What the figure is in — "ms", "%", "kB". Set smaller and quieter than
        the number, because a reader reads the unit after it and never instead. */
    unit?: string;
    /** The counted thing, in the label register. */
    label: string;
    /** The whole the figure is a part of, said after it — "2 of 3". Only where
        the figure really is a part: 240 ms is out of nothing. */
    of?: string;
    /** With `of`, a bar under the figure: the share it is of the whole, so a
        reader sees the proportion before the numbers. */
    bar?: boolean;
    /** One share of a list of them: the label and the count on one line
        over the bar, and the note under it. For a set of shares where the
        proportion is the point and the figure only its read-out. Takes `of`,
        and draws the bar. */
    list?: boolean;
    /** A glyph on the figure's own line, before it. Muted and never in a status
        colour, for the reason a card's is: a figure is a subject, not a result.
        Beside the number rather than over it — a glyph on a line of its own
        floats above the one thing the tile is for. */
    icon?: IconId;
    /** What bounds the figure. Without one, the number is a boast. The same
        line can stand between the tags instead, which is where it goes when it
        carries a link. */
    note?: string | TemplateResult;
}
export declare class SdsStat extends SdsElement {
    static properties: {
        value: {
            type: StringConstructor;
        };
        unit: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        of: {
            type: StringConstructor;
        };
        bar: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        list: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        icon: {
            type: StringConstructor;
        };
        note: {
            type: StringConstructor;
        };
    };
    value: string;
    unit: string;
    label: string;
    of: string;
    bar: boolean;
    list: boolean;
    icon?: IconId;
    note: string | TemplateResult;
    private taken;
    constructor();
    connectedCallback(): void;
    private at;
    private share;
    protected render(): TemplateResult;
}
