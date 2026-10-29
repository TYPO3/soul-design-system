import { type TemplateResult } from 'lit';
import './lightbox.ts';
import { SdsElement } from '../lib/element.js';
export interface DiagramProps {
    /** The text of the drawing, in the syntax of a `.diagram` file, for a
        script. A page writes the text between the tags. */
    source?: string;
    /** The prefix of the ids inside the drawing. Two drawings on one page
        with the same text need two names. */
    name?: string;
    /** The room of a slide, `width,height` in its frame's pixels. The text's
        own `slide=` holds otherwise. */
    room?: string;
    /** A press on the drawing opens it at the size of the window, in the
        page's tokens. For a drawing too dense to read in the column. */
    zoomable?: boolean;
}
export declare class SdsDiagram extends SdsElement {
    static properties: {
        source: {
            type: StringConstructor;
        };
        name: {
            type: StringConstructor;
        };
        room: {
            type: StringConstructor;
        };
        lent: {
            type: StringConstructor;
            reflect: boolean;
        };
        zoomable: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    source: string;
    name: string;
    room: string;
    /** The room a slide lends the drawing, where the author states none. The
        slide sets it. It stands in the markup, so a prerendered page starts
        with the room it drew for and draws nothing anew. */
    lent?: string;
    zoomable: boolean;
    private written;
    /** Lend the drawing a room, `width,height`. A text too dense for it draws
        as on a page instead, and the slide shrinks it as a picture. A room a
        pixel or two off the one it has is the same room, measured again. */
    lend(room: string): boolean;
    /** The room the text needs in the one a slide offers: that room, or the
        same shape larger. A row lends each of its drawings the largest, so
        they share one scale. Reads only. */
    reach(room: string): string;
    constructor();
    connectedCallback(): void;
    /** The text to draw: `source`, else what stands between the tags, else
        the same under a prerender, where Node hands it over as markup. */
    private get text();
    protected getUpdateComplete(): Promise<boolean>;
    protected render(): TemplateResult;
    private fits;
    private tryRooms;
}
