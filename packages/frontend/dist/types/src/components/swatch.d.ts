import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
/** How the chip carries the value. `fill` is a surface, `line` a hairline. */
export type SwatchKind = 'fill' | 'line';
export interface SwatchProps {
    /** What paints the chip — a token as it is written, or a literal where the
        value belongs to a mode this page is not being read in. */
    value: string;
    /** What it is called. The token where there is one, because that is the name
        a design writes; the human name where a set has no tokens. */
    name: string;
    /** What the name resolves to, written out. A token alone documents half the
        system: the value is the half that says what the mode did with it. */
    resolved?: string;
    /** What the token is for. `fill` is a surface or an ink, `line` a border —
        a hairline drawn as a filled square reads as a colour it is not. */
    kind?: SwatchKind;
}
export declare class SdsSwatch extends SdsElement {
    static properties: {
        value: {
            type: StringConstructor;
        };
        name: {
            type: StringConstructor;
            reflect: boolean;
        };
        resolved: {
            type: StringConstructor;
        };
        kind: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    value: string;
    name: string;
    resolved: string;
    kind: SwatchKind;
    constructor();
    protected render(): TemplateResult;
}
