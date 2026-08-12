import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
/** `card` is a hairline and 6px with no fill — the default container.
    `panel` is a raised fill, for when it sits on the canvas and has to read
    as a plane. `sunken` is machine output: code, logs, structured content. */
export type Plane = 'card' | 'panel' | 'sunken';
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
