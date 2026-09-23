import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export interface DeckProps {
    /** The name of the deck, in its head: what the reader has open. */
    label?: string;
    /** The id of the part of the page whose slides the deck runs through.
        Empty is the whole document. A deck with slides of its own ignores it. */
    from?: string;
    /** If it stands over the page. */
    open?: boolean;
    /** What every slide of the deck has in common, said once. A slide that
        says its own keeps it. The lockup in every foot, and the larger mark a
        cover and a closing carry. */
    brand?: string;
    product?: string;
    signet?: string;
    signetLarge?: string;
    /** If the deck counts its slides in their feet. A cover and a closing
        carry no count. */
    numbered?: boolean;
}
export declare class SdsDeck extends SdsElement {
    static properties: {
        label: {
            type: StringConstructor;
        };
        from: {
            type: StringConstructor;
        };
        open: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        at: {
            type: NumberConstructor;
            state: boolean;
        };
        titles: {
            type: ArrayConstructor;
            state: boolean;
        };
        listed: {
            type: BooleanConstructor;
            state: boolean;
        };
        full: {
            type: BooleanConstructor;
            state: boolean;
        };
        brand: {
            type: StringConstructor;
        };
        product: {
            type: StringConstructor;
        };
        signet: {
            type: StringConstructor;
        };
        signetLarge: {
            type: StringConstructor;
            attribute: string;
        };
        numbered: {
            type: BooleanConstructor;
        };
    };
    label: string;
    from: string;
    open: boolean;
    at: number;
    titles: string[];
    listed: boolean;
    full: boolean;
    brand: string;
    product: string;
    signet: string;
    signetLarge: string;
    numbered: boolean;
    /** The slides written between the tags, if any. */
    private own;
    private slides;
    private loan?;
    private keys?;
    private asks?;
    /** The slide to come back to after a print, if the deck was open. */
    private resume;
    private drag?;
    /** A drag just ended, so the click the pointer sends after it is no press. */
    private dragged;
    constructor();
    private get dialog();
    connectedCallback(): void;
    private hand;
    disconnectedCallback(): void;
    protected firstUpdated(): void;
    private readonly onCommand;
    private readonly onAsk;
    /** The slides in the order the page has them, read at every opening. A
        page that grew a slide since the last one has it in the deck. A slide
        of another deck belongs to that one. */
    private collect;
    show(at?: number): void;
    close(): void;
    private get screen();
    /** The deck on the whole screen, or back in the window. The head steps
        aside until the pointer asks for it, and a press on the slide turns it,
        as a room expects of a deck. */
    fullscreen(): void;
    /** Show slide `index`, counted from zero. Past either end it stays. The
        slide on the stage goes out the way the deck moves, and the next one
        comes in behind it. `from` is where a drag let go of the slide. */
    go(index: number, { from }?: {
        from?: number;
    }): void;
    private ghost;
    private push;
    private draw;
    private lend;
    private giveBack;
    private follow;
    private listen;
    private readonly onKey;
    /** Every slide on a page of its own, and the browser's print. Its dialog
        saves a PDF: text stays text, and a link stays a link. The slides go
        back when the print is over. */
    print(): void;
    private get stage();
    private readonly onDown;
    private readonly onMove;
    private readonly onUp;
    private readonly onStageClick;
    private readonly onClose;
    protected updated(): void;
    private poster;
    private pick;
    private list;
    protected render(): TemplateResult;
}
