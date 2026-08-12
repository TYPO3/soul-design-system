import { type TemplateResult } from 'lit';
import './lightbox.ts';
import { SdsElement } from '../lib/element.js';
export interface FigureProps {
    /** The file — a drawing this system ships, or an image. */
    src: string;
    /** What the picture shows, for a reader who cannot see it. */
    alt: string;
    /** The claim, in a sentence. */
    caption?: string | TemplateResult;
    /** Pressable, opening the drawing at the size it was drawn.
  
        The trigger is a link to the file. A surface running no script still
        opens the drawing with it, and the element takes the press over once it
        has upgraded — so this is never a control that looks like one and does
        nothing. Worth it for anything drawn wider than the column it sits in,
        and pointless for a photograph shown whole. */
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
        column and needs neither; a drawing that states a width in the source is
        stating a fact about the file, and dropping it left the renderer writing
        the `<img>` itself to keep it. */
    width?: number;
    height?: number;
    zoomable: boolean;
    private taken;
    private captioned;
    constructor();
    connectedCallback(): void;
    /** Take the press over from the link. Only where there is something to take
        it over with: if the viewer has not upgraded, the browser follows the
        href and the reader still gets the drawing. */
    private zoom;
    protected render(): TemplateResult;
}
