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
    /** What a server wrote between the tags, dropped.
  
        This element takes no content: the picture follows from `src` and
        nothing else. What it does take is a *fallback* — the same picture
        written out in the class layer, for a surface that renders before any
        script does and for a reader who runs none. The Guides theme is that
        surface, and the mark in its bar is the case that matters: it is the
        site's identity, and it may not wait for a bundle.
  
        So the contract is `sds-code`'s, with the halves swapped. There, what
        the server wrote is what the element goes on showing; here the element
        redraws it and the server's copy goes, because two pictures in one box
        is what light DOM gives you otherwise. Either way the element is the
        front door and the class layer stands behind it, which is the rule this
        element could not follow before. */
    connectedCallback(): void;
    protected render(): TemplateResult;
}
