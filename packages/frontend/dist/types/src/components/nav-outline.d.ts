import { type TemplateResult, type PropertyValues } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
import { type MenuEntry } from './nav-base.js';
export declare class SdsNavOutline extends SdsElement {
    static properties: {
        label: {
            type: StringConstructor;
        };
        entries: {
            type: ArrayConstructor;
        };
        numbered: {
            type: BooleanConstructor;
        };
        at: {
            type: StringConstructor;
            state: boolean;
        };
    };
    /** The heading over the list, and the name of the navigation. */
    label: string;
    /** The parts of the document, nested as deep as the document nests them. */
    entries: MenuEntry[];
    /** Every entry carries its number, counted from its place in the list the
        way a numbered document counts its parts. Written as text: a browser
        leaves generated content out of the name a row has out loud. */
    numbered: boolean;
    /** Where the reader is, as the href of that part. Empty until the element
        reads the page, which is where a server stops and the data has the say. */
    at: string;
    private watching?;
    private queued;
    constructor();
    connectedCallback(): void;
    /** The fold, and if its press draws. The stylesheet decides where the
        list folds, and draws the press only there. So the element asks the
        press rather than the window, and carries no width of its own. */
    private fold;
    private folds;
    /** Put the fold in the state its width asks for: shut where it folds, open
        where it does not. Only on a change of width, so a reader who opened it
        keeps it open while they read. */
    private narrow;
    private fit;
    /** A press on a row where the list folds: the reader chose a place, and
        the list has done its work. It shuts, and the page under it shows the
        place. */
    private chose;
    protected firstUpdated(): void;
    disconnectedCallback(): void;
    /** One reading, a frame from now. A scroll fires far faster than a paint. */
    private soon;
    /** Follow the page. On the document and on the way down: a scroll event
        does not bubble, and the column can be the scroller rather than the
        window. On resize too, which moves every heading at once. */
    private watch;
    /** The entries the list draws, by target. Read from the rows rather than
        from the data, so a level a stylesheet hides never takes the mark.
        Empty before the first render. */
    private drawn;
    /** The headings this list points at, in the order the page has them. An
        entry that points away from this page is a link and not a place in it,
        so it stays out. So does one the list does not draw. */
    private marks;
    /** What moves the headings: the nearest ancestor that scrolls, and the
        page where none does. */
    private scroller;
    /** Where a heading comes to rest after a jump: the top of the scroller,
        plus `scroll-padding-top`. Measured against that line, the entry a
        press marks is the entry the scroll marks. */
    private line;
    /** As far down as the reader can get. The last heading can stand below the
        line and never reach it. */
    private ended;
    /** Which part the reader is in: the last heading that has passed the line,
        and none while none has. A document opens above its first heading. */
    private read;
    /** The entry the reader is in. The page wins once the element has read it.
        The data is what a card, a story and a server-rendered page have instead. */
    private isCurrent;
    /** The entries at one level, each numbered by its place under the number
        of the entry above: `4`, then `4.1`, `4.2`. */
    private list;
    /** One row. `aria-current="location"` and not `page`: every entry here is
        the document, and the mark is the part of it the reader is at. The
        space after the number is text, so the name a row has out loud keeps
        the two apart. The name stands in a node of its own, so the underline
        under the pointer is the name's and never the space's. */
    private item;
    /** One part, and the sections under it. */
    private row;
    /** Keep the marked row where the reader can see it, by the least move that
        brings it inside. A box that already shows the row stands still and does
        not fight a reader who scrolled it. Its own `scrollTop`, never
        `scrollIntoView`: that walks up every scroller and takes the page along. */
    private follow;
    protected updated(changed: PropertyValues): void;
    protected render(): TemplateResult;
}
