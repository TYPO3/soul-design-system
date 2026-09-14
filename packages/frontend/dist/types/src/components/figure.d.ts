import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface FigureProps {
    /** The file — a drawing this system ships, or an image. */
    src: string;
    /** What the picture shows, for a reader who cannot see it. */
    alt: string;
    /** The claim, in a sentence. */
    caption?: string | TemplateResult;
    /** Pressable, and it opens the drawing at its own size. The trigger is a
        link to the file, so a surface with no script still opens it. The
        element only takes the press over once it has upgraded. Worth it for
        anything drawn wider than its column, pointless for a photograph. */
    zoomable?: boolean;
}
export declare class SdsFigure extends SdsElement {
    static properties: {
        src: {
            type: StringConstructor;
        };
        alt: {
            type: StringConstructor;
        };
        caption: {
            type: StringConstructor;
        };
        width: {
            type: NumberConstructor;
        };
        height: {
            type: NumberConstructor;
        };
        zoomable: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    src: string;
    alt: string;
    caption: string | TemplateResult;
    /** The picture's own size, where a document declared one. A figure fills its
        column and needs neither. A drawing that states a width in the source
        states a fact about the file. An element that dropped it left the
        renderer to write the `<img>` itself. */
    width?: number;
    /** The drawing’s own height in pixels, so the page holds the space before
        it loads and does not jump under the reader. */
    height?: number;
    zoomable: boolean;
    private taken;
    private captioned;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
