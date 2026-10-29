import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export interface LightboxProps {
    /** The drawing on show. Reached with `zoomable` on a figure or an image
        rather than written by hand. */
    src: string;
    /** What it shows, for a reader who does not get it. */
    alt: string;
    /** What the drawing claims, in the head — the same sentence the figure
        carries, so opening it is not a change of subject. */
    caption?: string;
    /** A drawing in place of the file, for a script: an `sds-diagram` with
        `zoomable` gives its own. It stays in the page's tokens. */
    content?: unknown;
    /** If it stands over the page. It is the modal’s behaviour around a
        drawing rather than a question, so it stops at no measure. */
    open?: boolean;
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
        content: {
            attribute: boolean;
        };
        open: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    src: string;
    alt: string;
    caption: string;
    content: unknown;
    open: boolean;
    constructor();
    private get dialog();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private readonly onCommand;
    show(): void;
    close(): void;
    private scale;
    private x;
    private y;
    private fitted;
    private watcher;
    private drag;
    private get stage();
    private get canvas();
    /** The drawing's own size: the viewBox of an inline drawing, or the
        pixels of a file. */
    private natural;
    /** A file has its size once it has loaded. */
    private ready;
    private watch;
    private apply;
    /** The whole drawing in the stage, in the middle. A photograph never
        grows past its own pixels, a drawing does. */
    fit(): void;
    /** Zoom by a factor, about a point of the stage that stays put. */
    zoom(factor: number, at?: {
        x: number;
        y: number;
    }): void;
    private move;
    private readonly onWheel;
    private readonly onDown;
    private readonly onMove;
    private readonly onUp;
    private readonly onKey;
    /** Fitted, the drawing at its own size; otherwise fitted again. */
    private readonly onDouble;
    protected updated(): void;
    protected render(): TemplateResult;
}
