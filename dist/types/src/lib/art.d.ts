import { type TemplateResult } from 'lit';
/** The picture, as whatever it has to be to arrive in the right mode. `cls` is
    what the surface hangs its own sizing on; a width and height are for a
    picture the stylesheet does not size, like a mark in a bar — a figure passes
    neither and fills its column. */
export declare function art(src: string, alt: string, cls?: string, width?: number, height?: number): TemplateResult;
