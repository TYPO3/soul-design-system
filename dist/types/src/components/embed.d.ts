import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface EmbedProps {
    /** The document to put in the frame. */
    src: string;
    /** What the frame holds, in a few words: it becomes the accessible name, and
        an unnamed frame is announced as "frame" and skipped. Not `title`, a
        global attribute, which on a `display: contents` host would be a tooltip
        over the frame and the caption both. */
    label: string;
    /** The shape the frame holds while it fills the column, as CSS writes it —
        `16 / 9`. This is what a video, a map or anything else that has no size
        of its own wants, and it is the default. */
    ratio?: string;
    /** The size the document was made for, in pixels. Both together, and
        without a `ratio`, are what makes the frame fixed: it is exactly this
        wide, and it scrolls rather than reflowing what it holds. */
    width?: number;
    height?: number;
    /** The claim, in a sentence, under the frame. It may also be written between
        the tags as `<div class="sds-embed__caption">` — the form for a caption
        carrying markup, and for a page read before the element upgrades. Either
        way it belongs to the element: see `captioned`. */
    caption?: string;
    /** The permissions policy the frame is granted. A video player asks for
        `encrypted-media; picture-in-picture; web-share`; a card asks for
        nothing, and gets nothing. */
    allow?: string;
    allowfullscreen?: boolean;
}
export declare class SdsEmbed extends SdsElement {
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
    /** Whether the frame is the size it was made for rather than the column's. A
        size alone says fixed; a ratio beside it is the answer that means "fill
        the column", so it wins and the size is what the document is asked for. */
    private get fixed();
    /** What goes in the frame: the node a renderer wrote, or the iframe this
        writes when nobody did. Not lazy, deliberately — an embed is the evidence
        on the page, and one that loads on scroll is blank in every screenshot. */
    private get framed();
    protected render(): TemplateResult;
}
