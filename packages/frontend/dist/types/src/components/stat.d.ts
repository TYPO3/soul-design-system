import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
import './icon.ts';
import { type IconId } from './icon.js';
export interface StatProps {
    /** The figure. Concrete — "5", "240", "12.4+" — never "many". */
    value: string;
    /** What the figure is in — "ms", "%", "kB". Set smaller and quieter than
        the number, because the unit is read after it and never instead. */
    unit?: string;
    /** What was counted, in the label register. */
    label: string;
    /** The whole the figure is a part of, said after it — "2 of 3". Only where
        the figure really is a part: 240 ms is out of nothing. */
    of?: string;
    /** A glyph on the figure's own line, before it. Muted and never in a status
        colour, for the reason a card's is: a figure is a subject, not a result.
        Beside the number rather than over it — a glyph on a line of its own
        floats above the one thing the tile is for. */
    icon?: IconId;
    /** What the figure is bounded by. Without one, the number is a boast. The
        same line may be written between the tags instead, which is where it
        goes when it carries a link. */
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
    icon?: IconId;
    note: string | TemplateResult;
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
