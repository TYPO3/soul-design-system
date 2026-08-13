import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface FigureProps {
    /** The file — a drawing this system ships, or an image. */
    src: string;
    /** What the picture shows, for a reader who cannot see it. */
    alt: string;
    /** The claim, in a sentence. */
    caption?: string | TemplateResult;
    /** Pressable, opening the drawing at the size it was drawn. The trigger is a
        link to the file, so a surface running no script still opens it and the
        element only takes the press over once it has upgraded. Worth it for
        anything drawn wider than its column, pointless for a photograph. */
    zoomable?: boolean;
    /** The picture is linked rather than referenced — an SVG that never named
        `id="art"`. Written by the build, which is what can read the file;
        `src/lib/art.ts` holds the reasoning. */
    linked?: boolean;
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
        linked: {
            type: BooleanConstructor;
        };
    };
    src: string;
    alt: string;
    caption: string | TemplateResult;
    /** The picture's own size, where a document declared one. A figure fills its
        column and needs neither; a drawing that states a width in the source is
        stating a fact about the file, and dropping it left the renderer writing
        the `<img>` itself to keep it. */
    width?: number;
    height?: number;
    zoomable: boolean;
    linked: boolean;
    private taken;
    private captioned;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
