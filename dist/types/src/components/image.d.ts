import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface ImageProps {
    /** The file. An SVG is referenced, anything else is linked. */
    src: string;
    /** What the picture shows, for a reader who cannot see it. Empty where the
        text beside it already says the same thing — a mark in a lockup whose
        wordmark spells the name — and the picture is hidden rather than
        announced without a name. */
    alt: string;
    /** A size in pixels, for a picture no stylesheet sizes. Both, and the file's
        own coordinate system keeps the proportions inside them: a 5:4 mark given
        a square box is drawn 5:4 and centred, never stretched to fit. */
    width?: number;
    height?: number;
}
export declare class SdsImage extends SdsElement {
    static properties: {
        src: {
            type: StringConstructor;
        };
        alt: {
            type: StringConstructor;
        };
        width: {
            type: NumberConstructor;
            reflect: boolean;
        };
        height: {
            type: NumberConstructor;
            reflect: boolean;
        };
        cls: {
            attribute: string;
            type: StringConstructor;
        };
    };
    src: string;
    alt: string;
    width: number;
    height: number;
    cls: string;
    constructor();
    protected render(): TemplateResult;
}
