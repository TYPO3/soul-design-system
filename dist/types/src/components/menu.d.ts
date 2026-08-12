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
    /** The id of a navigation that lives outside the bar — the page rail. Given
        one, this element is that navigation's toggle and holds no items of its
        own. What differs is only who decides: the sections run out of room in the
        header, which this measures, and the rail runs out of a *column*, which
        `components.css` decides. So a menu with `for` presses, never measures. */
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
    /** The items a server wrote between the tags, moved into the row. A rendered
        site resolves its own navigation before the page is sent, and passing that
        back through `items` would encode and resolve it a second time — so the
        links are kept as written, `target`, `rel` and current mark intact. Either
        way the element does the part a server cannot: measure whether they fit. */
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
    /** The button, which is the same button in both cases — and says which of the
        two it is, because on a narrow page both are in the bar at once. Not
        `actions-menu`, which is an app launcher and at 16px reads as a keypad;
        the set has no hamburger and this is not the place to draw one. So each
        says what it opens: a list of pages, or a column folded away. */
    private get glyph();
    private toggle_;
    protected render(): TemplateResult;
    protected willUpdate(changed: PropertyValues<SdsMenu>): void;
    protected updated(): void;
}
