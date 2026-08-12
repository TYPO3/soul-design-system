import { type TemplateResult } from 'lit';
export interface ArtOptions {
    /** What the surface hangs its own sizing on. */
    cls?: string;
    /** For a picture the stylesheet does not size, like a mark in a bar — a
        figure passes neither and fills its column. */
    width?: number;
    height?: number;
    /** Linked whatever the name says. A drawing that never named `id="art"`
        resolves to nothing when it is referenced, and only a renderer with the
        file in front of it can know that — `scripts/lib/site.ts` reads the file
        and writes this onto the element, so the picture arrives. */
    linked?: boolean;
}
/** The picture, as whatever it has to be to arrive in the right mode. */
export declare function art(src: string, alt: string, options?: ArtOptions): TemplateResult;
