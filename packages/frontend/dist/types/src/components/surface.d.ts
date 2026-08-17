import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
/** `raised` sits on the canvas and has to read as a plane. `sunken` is machine
    output: code, logs, structured content. `plain` is the hairline with no
    fill, for a statement that stands on the canvas without leaving it. The
    filled two are named for their fill — the tokens are `--surface-raised`
    and `--surface-sunken` — rather than for the box, which is the same box. */
export type Plane = 'plain' | 'raised' | 'sunken';
export interface SurfaceProps {
    /** Which plane it is. `plain` is the hairline with no fill, `raised` a
        panel above the page, `sunken` a well for machine output. */
    plane?: Plane;
    /** What the surface states, at the top of it. Written `heading` on the
        element — `title` is the global attribute and would become a tooltip. */
    title: string;
    /** The statement itself. Markup where a caller holds it, a sentence where
        a property is all there is. */
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
    /** What the surface states, at the top of it. Written `heading` on the
        element and in the class: `title` is the global attribute and would
        become a tooltip. */
    heading: string;
    body: string | TemplateResult;
    /** Sizing for the plane where one instance needs it, written `box-style`.
        Nothing by default: the element fills the cell a wall stretches for it. */
    boxStyle: string;
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
