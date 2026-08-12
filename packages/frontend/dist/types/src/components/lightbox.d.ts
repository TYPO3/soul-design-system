import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export interface LightboxProps {
    src: string;
    alt: string;
    /** What the drawing claims, in the head — the same sentence the figure
        carries, so opening it is not a change of subject. */
    caption?: string;
    open?: boolean;
    /** The picture is linked rather than referenced — an SVG that never named
        `id="art"`. Passed on by the figure that opens this one, so the drawing
        at full size is the drawing in the page. */
    linked?: boolean;
}
export declare class SdsLightbox extends SdsElement {
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
        open: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        linked: {
            type: BooleanConstructor;
        };
    };
    src: string;
    alt: string;
    caption: string;
    open: boolean;
    linked: boolean;
    constructor();
    private get dialog();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private readonly onCommand;
    show(): void;
    close(): void;
    protected updated(): void;
    protected render(): TemplateResult;
}
