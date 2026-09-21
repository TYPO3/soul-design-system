import { type TemplateResult, type PropertyValues } from 'lit';
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
    /** The heading over the list, and the name of the navigation. */
    label: string;
    /** The sections of the page, nested as deep as the page nests them. */
    entries: MenuEntry[];
    /** Where the reader is, as the href of that section. Empty until the
        element reads the page, which is where a server stops and the data has
        the say. */
    at: string;
    private watching?;
    private queued;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** Follow the page. On the document and on the way down: a scroll event
        does not bubble, and the column can be the scroller rather than the
        window. On resize too, which moves every heading at once. One reading a
        frame — a scroll fires far faster than a paint. */
    private watch;
    /** The entries the list draws, by target. Read from the rows rather than
        from the data. Beside the column it shows two levels and hides the rest,
        and which those are is the stylesheet's to say. Empty before the first
        render, and then it says nothing rather than nothing is on the page. */
    private drawn;
    /** The headings this list points at, in the order the page has them. An
        entry that points away from this page is a link and not a place in it,
        so it stays out. So does one the list does not draw. A mark on a heading
        no row shows leaves every visible entry unmarked, which is the list gone
        blank inside a section. */
    private marks;
    /** What moves the headings: the nearest ancestor that scrolls, and the
        page where none does. A pane with a scrollbar of its own is where the
        reader reads, and the top of the window is not on it. */
    private scroller;
    /** Where a heading comes to rest after a jump: the top of the scroller,
        plus the offset it keeps for whatever stands over it. That offset is
        `scroll-padding-top`, which answers the bar for every target at once.
        Measured against that line, the entry a press marks is the entry the
        scroll marks. */
    private line;
    /** As far down as the reader can get. The last heading can stand below the
        line and never reach it. The list then marks the section above while the
        reader looks at the last one. Nothing to scroll is no foot to arrive at,
        with every section in view at once. */
    private ended;
    /** Which section the reader is in: the last heading that has passed the
        line, and none while none has. A page opens above its first heading, and
        a mark there answers a question nobody asked. */
    private read;
    /** The entry the reader is in. The page wins once the element has read it.
        The data is what a card, a story and a server-rendered page have instead. */
    private isCurrent;
    private list;
    /** One section, and whatever hangs under it. `aria-current="location"` and
        not `page`: every entry here is the page, and the mark is the part of it
        the reader is at. */
    private row;
    /** Keep the marked entry where the reader can see it. Beside the column the
        list is a box of its own and scrolls. A page with more sections than the
        box is tall marks one off its bottom edge. The list then says nothing
        about where the reader is, exactly where that matters. Its own `scrollTop`,
        never `scrollIntoView`: that walks up every scroller it finds and takes
        the page along with it. */
    private follow;
    /** A box with more rows than it shows keeps the wheel, by a class the
        sheet reads. Let through, the scroll runs on into the page at the edge,
        the mark moves, and the list jumps back under the reader's pointer.
        Only while it overflows: on a box with nothing to scroll, containment
        swallows the wheel and the page stops. So the element measures it. */
    private keep;
    protected updated(changed: PropertyValues): void;
    protected render(): TemplateResult;
}
