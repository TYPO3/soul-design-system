import { type TemplateResult } from 'lit';
import './lightbox.ts';
import { SdsElement } from '../lib/element.js';
export interface FigureProps {
    /** The drawing. The light file, where there is a pair. */
    src: string;
    /** The dark file. Without one, the same drawing is shown in both modes —
        correct for a photograph, wrong for anything drawn in these tokens. */
    dark?: string;
    /** What the drawing shows, for a reader who cannot see it. */
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
        dark: {
            type: StringConstructor;
        };
        alt: {
            type: StringConstructor;
        };
        caption: {
            type: StringConstructor;
        };
        zoomable: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    src: string;
    dark: string;
    alt: string;
    caption: string | TemplateResult;
    zoomable: boolean;
    constructor();
    /** Take the press over from the link. Only where there is something to take
        it over with: if the viewer has not upgraded, the browser follows the
        href and the reader still gets the drawing. */
    private zoom;
    protected render(): TemplateResult;
}
