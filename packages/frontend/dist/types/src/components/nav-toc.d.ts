import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
import { type MenuEntry } from './nav-base.js';
export declare class SdsNavToc extends SdsElement {
    static properties: {
        label: {
            type: StringConstructor;
        };
        entries: {
            type: ArrayConstructor;
        };
        at: {
            type: StringConstructor;
            state: boolean;
        };
    };
    /** The heading over the list, and what the navigation is called. */
    label: string;
    /** The sections of the page, nested as deep as the page nests them. */
    entries: MenuEntry[];
    /** Where the reader is, as the href of that section — empty until the page
        has been read, which is where a server stops and the data has the say. */
    at: string;
    private watching?;
    private queued;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** Follow the page. On the document and on the way down, because a scroll
        event does not bubble and the column may be the scroller rather than the
        window; and on resize, which moves every heading at once. One reading a
        frame — a scroll fires far faster than anything can be drawn. */
    private watch;
    /** The headings this list points at, in the order the page has them. An
        entry pointing anywhere but at this page is a link and not a place in it,
        and is left out of the reading rather than made a target of. */
    private marks;
    /** What is moving the headings: the nearest ancestor that scrolls, and the
        page where none does. A pane with a scrollbar of its own is where the
        reading is happening, and the top of the window is not on it. */
    private scroller;
    /** Where a heading jumped to comes to rest: the top of the scroller, plus
        the offset it keeps for whatever stands over it — `scroll-padding-top`,
        which is how the bar is answered for every target on the page at once.
        Measured against that line, the entry a press marks is the entry the
        scroll marks. */
    private line;
    /** As far down as the reader can get. The last heading can stand below the
        line and never reach it, and the list would mark the section above while
        the reader is looking at the last one. Nothing to scroll is no foot to
        arrive at, every section being in view at once. */
    private ended;
    /** Which section the reader is in: the last heading that has passed the
        line, and none while none has — a page opens above its first heading, and
        a list marking something there answers a question nobody asked. */
    private read;
    /** The entry the reader is in. The page wins once it has been read, and the
        data is what a card, a story and a server-rendered page have instead. */
    private isCurrent;
    private list;
    /** One section, and whatever hangs under it. `aria-current="location"` and
        not `page`: every entry here is the page, and what is marked is the part
        of it the reader is at. */
    private row;
    protected render(): TemplateResult;
}
