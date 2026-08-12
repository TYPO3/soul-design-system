import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
/** `raised` sits on the canvas and has to read as a plane. `sunken` is machine
    output: code, logs, structured content. Named for the fill each one is —
    the tokens are `--surface-raised` and `--surface-sunken` — rather than for
    the box, which is the same box. */
export type Plane = 'raised' | 'sunken';
export interface SurfaceProps {
    plane?: Plane;
    title: string;
    body: string | TemplateResult;
    style?: string;
    /** The tracked-out line over the title, where a set of these is numbered or
        named as a set — `AUDIENCE 01`, `SOURCE`, `STEP 02`. */
    label?: string;
    /** A glyph above the label, where a set of cards is told apart before it is
        read. It stands beside the card's own title, never alone. */
    icon?: IconId;
}
export declare class SdsSurface extends SdsElement {
    static properties: {
        plane: {
            type: StringConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
        };
        icon: {
            type: StringConstructor;
        };
        heading: {
            type: StringConstructor;
        };
        body: {
            type: StringConstructor;
        };
        boxStyle: {
            type: StringConstructor;
            attribute: string;
        };
    };
    plane: Plane;
    label: string;
    icon?: IconId;
    heading: string;
    body: string | TemplateResult;
    boxStyle: string;
    constructor();
    protected render(): TemplateResult;
}
