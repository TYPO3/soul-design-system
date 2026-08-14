import { type TemplateResult } from 'lit';
/** The name a drawing gives the part of itself that may be reached — the group
    a drawing under `assets/diagrams/` wraps itself in, and what the card
    generator puts the artwork in place of. No page reads it. */
export declare const REF = "soul-ref";
/** Whether the picture keeps the colours it was exported with, so the ground
    under it has to be one those colours were drawn for. A drawing is such a
    picture; a photograph brought its own ground and never was — `--surface-art`
    in `components.css` is what this decides. */
export declare const exported: (src: string) => boolean;
export interface ArtOptions {
    /** What the surface hangs its own sizing on. */
    cls?: string;
    /** For a picture the stylesheet does not size, like a mark in a bar — a
        figure passes neither and fills its column. */
    width?: number;
    height?: number;
}
/** The picture. */
export declare function art(src: string, alt: string, options?: ArtOptions): TemplateResult;
