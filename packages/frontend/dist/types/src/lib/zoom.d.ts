import { type TemplateResult } from 'lit';
import '../components/lightbox.ts';
export interface ZoomOptions {
    /** The file the trigger links to, and the viewer opens. */
    src: string;
    alt: string;
    /** What the drawing claims, carried into the viewer's head so opening it is
        not a change of subject. An image has none and falls back to its alt. */
    caption?: string;
}
/** The trigger and the viewer, for the element to place. Two parts and not one
    template: they are siblings in an image and a frame apart in a figure. */
export interface ZoomParts {
    trigger: TemplateResult;
    viewer: TemplateResult;
}
/** Wrap `picture` in the press that opens it, and name the viewer that host
    owns. `host` is the element rendering both — the viewer is found under it. */
export declare function zoom(host: Element, picture: TemplateResult, options: ZoomOptions): ZoomParts;
