import { type TemplateResult } from 'lit';
/** What the reference points at — the root of the file, or the group a drawing
    under `assets/diagrams/` wraps itself in. It names the part rather than what
    is in it: a file is prepared by declaring where a reference may point, and
    an SVG holding a picture was never the thing in question. */
export declare const REF = "soul-ref";
export interface ArtOptions {
    /** What the surface hangs its own sizing on. */
    cls?: string;
    /** For a picture the stylesheet does not size, like a mark in a bar — a
        figure passes neither and fills its column. */
    width?: number;
    height?: number;
    /** Linked whatever the name says. A drawing that never named `id="soul-ref"`
        resolves to nothing when it is referenced, and only a renderer with the
        file in front of it can know that — `scripts/lib/site.ts` reads the file
        and writes this onto the element, so the picture arrives. */
    linked?: boolean;
    /** The file's own `viewBox`, from the same reader for the same reason: the
        generated table below holds this system's drawings and nothing else, so a
        document's own drawing arrives with no ratio and `height: auto` falls back
        to the 150px a box with no intrinsic size gets. */
    viewBox?: string;
}
/** The picture, as whatever it has to be to arrive in the right mode. */
export declare function art(src: string, alt: string, options?: ArtOptions): TemplateResult;
