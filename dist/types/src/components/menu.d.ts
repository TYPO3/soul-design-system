import { type TemplateResult, type PropertyValues } from 'lit';
import { SdsNav } from './nav-base.js';
import './icon.ts';
export declare class SdsMenu extends SdsNav {
    static properties: {
        items: {
            type: ArrayConstructor;
        };
        active: {
            type: NumberConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
        };
        for: {
            type: StringConstructor;
            reflect: boolean;
        };
        open: {
            type: BooleanConstructor;
            state: boolean;
        };
        collapsed: {
            type: BooleanConstructor;
            state: boolean;
        };
    };
    protected readonly block = "sds-menu";
    protected readonly item = "sds-pill";
    /** What the toggle is called, for the reader who cannot see it is a menu. */
    label: string;
    /** The id of a navigation that lives outside the bar — the page rail.
  
        Given one, this element is that navigation's toggle and holds no items of
        its own. It is the same button opening the same panel; what differs is
        only which of the two runs out of room first, and therefore who decides.
        The sections run out of room in the header, which this element measures.
        The rail runs out of a *column*, which is the page layout's decision and
        is made in `components.css` at the width where the rail stops being one.
        So a menu with `for` does not measure anything: it presses. */
    for: string;
    open: boolean;
    collapsed: boolean;
    private readonly navId;
    /** The width the items need in a row. Zero means "not measured yet", which
        renders inline — the one state the row can be measured in. */
    private need;
    private watch?;
    /** What is already watched, so re-observing does not call the observer back
        and ask again forever. */
    private readonly watched;
    /** The items a server wrote between the tags, moved into the row.
  
        A rendered site knows its own navigation before the page is sent: where
        each section is from here, and which one the reader is in. Passing that
        back through `items` would mean encoding it as a property and resolving
        it a second time in the browser, so what the server wrote is kept — the
        links themselves, with their `target`, their `rel` and the mark on the
        current one intact.
  
        Written or given, the element does the same thing to them, which is the
        part that cannot be written by a server: measure whether they fit. */
    private taken;
    constructor();
    /** The navigation this opens, where that is not its own items. */
    private get target();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private readonly onOutside;
    private readonly onFollow;
    private onKey;
    protected choose(index: number): void;
    /** Collapsed or not, from the room the row has rather than from a width. */
    private decide;
    /** The button, which is the same button in both cases — and says which of
        the two it is, because on a narrow page both of them are in the bar at
        once.
  
        Not `actions-menu`. The one named for this is TYPO3's three-by-three grid
        of squares — an app launcher, and at 16px a dark block that reads as a
        keypad rather than as a way into anything. The set has no hamburger and
        this is not the place to draw one; every icon here comes from
        `@typo3/icons` and stays there.
  
        So each says what it opens. The sections are a list of pages, which is a
        marker and a line four times over. The rail is a column that has been
        folded away, and the set has the glyph for exactly that — a page with its
        side panel shut. Two identical buttons 200px apart, one leading out of
        the page and one into it, is the reader guessing; a label they cannot see
        is not an answer. */
    private get glyph();
    private toggle_;
    protected render(): TemplateResult;
    protected willUpdate(changed: PropertyValues<SdsMenu>): void;
    protected updated(): void;
}
