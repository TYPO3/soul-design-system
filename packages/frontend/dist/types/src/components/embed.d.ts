import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface EmbedProps {
    /** The document to put in the frame. */
    src: string;
    /** What the frame holds, in a few words. It becomes the accessible name,
        and a screen reader announces an unnamed frame as "frame" and skips it.
        Not `title`, a global attribute, which on the element is a tooltip over
        the frame and the caption both. */
    label: string;
    /** The shape the frame holds while it fills the column, as CSS writes it —
        `16 / 9`. This is what a video, a map or anything else that has no size
        of its own wants, and it is the default. */
    ratio?: string;
    /** The document's own size, in pixels. Both together, and without a
        `ratio`, make the frame fixed. It is exactly this wide, and it scrolls
        rather than reflows what it holds. */
    width?: number;
    /** A height in pixels, for the embed whose own shape is not a ratio.
        `ratio` is the usual answer; this is for the one that is not. */
    height?: number;
    /** The claim, in a sentence, under the frame. It can also stand between
        the tags as `<div class="sds-embed__caption">`. That is the form for a
        caption with markup, and for a page read before the element upgrades.
        Either way it belongs to the element: see `captioned`. */
    caption?: string;
    /** The permissions policy the frame gets. A video player asks for
        `encrypted-media; picture-in-picture; web-share`; a card asks for
        nothing, and gets nothing. */
    allow?: string;
    /** If the frame can take the whole screen. A player usually can, and a
        form in a frame has no reason to. */
    allowfullscreen?: boolean;
}
export declare class SdsEmbed extends SdsElement {
    #private;
    static properties: {
        src: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        ratio: {
            type: StringConstructor;
        };
        width: {
            type: NumberConstructor;
        };
        height: {
            type: NumberConstructor;
        };
        caption: {
            type: StringConstructor;
        };
        allow: {
            type: StringConstructor;
        };
        allowfullscreen: {
            type: BooleanConstructor;
        };
    };
    src: string;
    label: string;
    ratio: string;
    width: number;
    height: number;
    caption: string;
    allow: string;
    allowfullscreen: boolean;
    private taken;
    private captioned;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected firstUpdated(): void;
    /** If the frame has the document's own size rather than the column's. A
        size alone says fixed. A ratio beside it means "fill the column", so it
        wins and the size becomes the document's request. */
    private get fixed();
    /** What goes in the frame: the node a renderer wrote, or the iframe this
        writes when nobody did. Not lazy, deliberately — an embed is the evidence
        on the page, and one that loads on scroll is blank in every screenshot. */
    private get framed();
    protected render(): TemplateResult;
}
