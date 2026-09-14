import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
/** `raised` sits on the canvas and has to read as a plane. `sunken` is machine
    output: code, logs, structured content. `plain` is the hairline with no
    fill, for a statement that stands on the canvas and stays in it. The
    filled two take their names from their fill — `--surface-raised` and
    `--surface-sunken` — not from the box, which is the same box. */
export type Plane = 'plain' | 'raised' | 'sunken';
export interface SurfaceProps {
    /** Which plane it is. `plain` is the hairline with no fill, `raised` a
        panel above the page, `sunken` a well for machine output. */
    plane?: Plane;
    /** What the surface states, at the top of it. Written `heading` on the
        element — `title` is the global attribute and becomes a tooltip. */
    title: string;
    /** The statement itself. Markup where a caller holds it, a sentence where
        a property is all there is. */
    body: string | TemplateResult;
    style?: string;
    /** The tracked-out line over the title, where a set of these has numbers
        or names as a set — `AUDIENCE 01`, `SOURCE`, `STEP 02`. */
    label?: string;
    /** A glyph above the label, where a set of cards tells its cards apart at a
        glance. It stands beside the card's own title, never alone. */
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
    /** What the surface states, at the top of it. Written `heading` on the
        element and in the class: `title` is the global attribute and becomes
        a tooltip. */
    heading: string;
    body: string | TemplateResult;
    /** A size for the plane where one instance needs it, written `box-style`.
        Nothing by default: the element fills the cell a wall stretches for it. */
    boxStyle: string;
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
