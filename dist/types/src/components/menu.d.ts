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
    /** The button, which is the same button in both cases. */
    private toggle_;
    protected render(): TemplateResult;
    protected willUpdate(changed: PropertyValues<SdsMenu>): void;
    protected updated(): void;
}
