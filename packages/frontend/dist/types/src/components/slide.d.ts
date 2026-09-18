import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
import './eyebrow.ts';
import './image.ts';
/** What a slide is in the run of a deck. `cover` and `closing` hold the title
    up and the lockup down, and `section` holds the outline down. `statement`
    centres one sentence, and `content` keeps its title at the top margin.
    `speaker` gives the name the left column and a portrait the right, edge
    to edge. */
export type SlideKind = 'cover' | 'section' | 'statement' | 'content' | 'closing' | 'speaker';
/** The ground. A deck stands on paper, and the slide that opens it on the
    terminal. The flip is the emphasis, and the one accent stays where it is.
    Paper unless said, whatever mode the page is in. A room watches a deck,
    and a room has no mode. */
export type SlideGround = 'paper' | 'terminal';
export interface SlideProps {
    kind?: SlideKind;
    ground?: SlideGround;
    /** The line over the title, in the label register: the occasion, the
        section's number, the date. */
    eyebrow?: string;
    /** The title. A cover, a divider and a statement set it at the display
        step. A content slide sets it at the h2 step, so the body has room. */
    heading?: string;
    /** The sentence under a cover's or a closing's title. */
    lead?: string;
    /** The line under a statement: where the sentence is from. */
    note?: string;
    /** The slide's count, in the foot. A string, because a deck numbers its
        slides the way it likes: `03`, `3 / 12`. */
    number?: string;
    /** The mark and the name, as the bar and the footer draw them. The lockup
        stands at the foot of a cover and a closing, and in the foot of every
        other kind. Without a product there is no lockup. */
    signet?: string;
    brand?: string;
    product?: string;
    /** The deck's outline, on a divider, and which entry this section is. */
    sections?: readonly string[];
    current?: number;
    /** On a speaker slide: the portrait, which is the deck's own picture, as
        a product brings its own mark. A speaker has one. Without it the
        column stands empty, which is the gap it is. */
    portrait?: string;
    alt?: string;
    /** What the slide shows between its title and its foot. Markup where a
        caller holds it: the elements of the system at the page's size. */
    body?: string | TemplateResult;
    /** If the frame scales to the room it has. The room is the width its
        parent gives it and the height from there to the bottom of the window.
        Unset, it draws at the size the stylesheet states: a 1920 × 1080
        viewport. */
    fit?: boolean;
}
export declare class SdsSlide extends SdsElement {
    static properties: {
        kind: {
            type: StringConstructor;
            reflect: boolean;
        };
        ground: {
            type: StringConstructor;
            reflect: boolean;
        };
        eyebrow: {
            type: StringConstructor;
        };
        heading: {
            type: StringConstructor;
        };
        lead: {
            type: StringConstructor;
        };
        note: {
            type: StringConstructor;
        };
        number: {
            type: StringConstructor;
        };
        signet: {
            type: StringConstructor;
        };
        brand: {
            type: StringConstructor;
        };
        product: {
            type: StringConstructor;
        };
        sections: {
            type: ArrayConstructor;
        };
        current: {
            type: NumberConstructor;
        };
        portrait: {
            type: StringConstructor;
        };
        alt: {
            type: StringConstructor;
        };
        body: {
            type: StringConstructor;
        };
        fit: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        /** The zoom the last measurement settled on. Zero is "not measured". */
        zoom: {
            type: NumberConstructor;
            state: boolean;
        };
    };
    kind: SlideKind;
    ground: SlideGround;
    eyebrow: string;
    heading: string;
    lead: string;
    note: string;
    number: string;
    signet: string;
    brand: string;
    product: string;
    sections: readonly string[];
    current: number;
    portrait: string;
    alt: string;
    body: string | TemplateResult;
    fit: boolean;
    zoom: number;
    private watch?;
    private taken;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** How far to scale the frame so it fits. The frame's size comes off the
        stylesheet, never a copy here. `--sds-slide-width` and its height are
        the set's, and a copy in TypeScript is the copy that goes stale. */
    private decide;
    private head;
    private outline;
    private foot;
    private portraitColumn;
    protected render(): TemplateResult;
}
