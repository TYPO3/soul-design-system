import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface EmbedProps {
    /** The document to put in the frame. */
    src: string;
    /** What the frame holds, in a few words. It becomes the frame's accessible
        name, which is the only thing a screen reader has to go on — an unnamed
        frame is announced as "frame" and skipped.
  
        Not `title`, which is a global HTML attribute: written on the host it
        would be a tooltip over everything inside, because `display: contents`
        leaves the attribute inheriting onto the frame and the caption both.
        Same collision the block's `code-lang`, the table's `scrollable` and the
        note's `heading` were renamed for. */
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
    /** The claim, in a sentence, under the frame.
  
        A caption may also be written between the tags as
        `<div class="sds-embed__caption">`, and that is the form for a renderer
        whose caption carries markup — a size in the mono face, a link — and for
        a page that has to read before the element upgrades. Either way it
        belongs to the element: see `captioned`. */
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
    /** Whether the frame is the size it was made for rather than the column's.
  
        A size on its own says fixed, and a ratio beside it says the caller has
        two answers to one question — the ratio is the one that means "fill the
        column", so it wins and the size is what the document inside is asked
        for. */
    private get fixed();
    /** What goes in the frame: the node a renderer wrote, or the iframe this
        writes when nobody did.
  
        Not lazy, and that is a decision rather than an omission. An embed is the
        evidence on the page, and a frame that loads on scroll is a frame that is
        blank in every screenshot taken of it — which is the one place somebody
        looks at all of them at once. */
    private get framed();
    protected render(): TemplateResult;
}
