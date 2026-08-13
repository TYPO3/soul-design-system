import { type TemplateResult, type PropertyValues } from 'lit';
import { SdsNav } from './nav-base.js';
import './icon.ts';
import './badge.ts';
import { type BadgeTone } from './badge.js';
import './search.ts';
import './theme.ts';
export declare class SdsHeader extends SdsNav {
    static properties: {
        items: {
            type: ArrayConstructor;
        };
        active: {
            type: NumberConstructor;
            reflect: boolean;
        };
        home: {
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
        version: {
            type: StringConstructor;
        };
        tone: {
            type: StringConstructor;
        };
        search: {
            type: BooleanConstructor;
        };
        index: {
            type: StringConstructor;
        };
        rail: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        themeKey: {
            type: StringConstructor;
            attribute: string;
        };
        open: {
            type: BooleanConstructor;
            state: boolean;
        };
        compactTheme: {
            type: BooleanConstructor;
            state: boolean;
        };
        foldNav: {
            type: BooleanConstructor;
            state: boolean;
        };
        foldSearch: {
            type: BooleanConstructor;
            state: boolean;
        };
        foldRail: {
            type: BooleanConstructor;
            state: boolean;
        };
    };
    protected readonly block = "sds-bar";
    protected readonly item = "sds-pill";
    /** Where the mark goes: the way home, from anywhere on the site. */
    home: string;
    signet: string;
    brand: string;
    product: string;
    /** What is true of the page the reader is on, as the badge beside the
        controls — a fact about this documentation rather than part of its name,
        which is why it is here and not in the lockup. */
    version: string;
    /** The badge's tone. Accent, that fact being a version nine times in ten;
        a screen whose bar names something else says so, because the accent is
        how a reader is told which version they are reading. */
    tone: BadgeTone;
    /** Whether the bar carries a search field. A field with no `index` searches
        nothing, which is a specimen rather than a site. */
    search: boolean;
    /** Where the index is, relative to the page. Setting it is asking for the
        field as well — a site that has an index has a search. */
    index: string;
    /** The id of the page rail. The bar does not own it: a rail is the page's
        navigation and stands where the page put it, until the layout takes its
        column away and it has nowhere to be but in here. */
    rail: string;
    /** What the toggle is called, for a reader who cannot see it is a menu. */
    label: string;
    /** Where `sds-theme` keeps the reader's choice, where it keeps one. */
    themeKey: string;
    open: boolean;
    compactTheme: boolean;
    foldNav: boolean;
    foldSearch: boolean;
    foldRail: boolean;
    private readonly drawerId;
    /** What the sections, the field and the mode pair's two words need in the
        row. Zero means "not measured yet", and each can only be measured where
        it is — standing in the row. */
    private needNav;
    private needSearch;
    private needWords;
    private watch?;
    private watched;
    /** Where the rail stood, so it can be put back exactly there. A remembered
        parent is not enough: a body holds other things, and a rail appended back
        to the end of one is a column in the wrong order. */
    private anchor?;
    /** The links a server wrote between the tags, moved into the row. A rendered
        site resolves its own navigation before the page is sent, and passing that
        back through `items` would encode and resolve it a second time — so they
        are kept as written, `target`, `rel` and current mark intact. */
    private taken;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private readonly onOutside;
    private readonly onFollow;
    private onKey;
    protected choose(index: number): void;
    /** Whether the layout has taken the rail's column away. Read back from the
        layout rather than decided a second time here: the same rule that stacks
        the body says so, so the two cannot disagree about which width it is. */
    private railFolds;
    /** Asked only where it can be answered: in Node there is no document to look
        in, and the bar is rendered there before any page has a rail. */
    private get railEl();
    /** The rail, back where the page put it. */
    private release;
    /** Where the rail belongs at this width, and whether it is there yet. */
    private place;
    /** What is in the row and what is in the drawer, from the room the row has
        rather than from a width. The order is what the bar can best do without:
        the field first, the sections last, and the rail whenever it has no
        column of its own. */
    private decide;
    private field;
    private nav_;
    private toggle_;
    protected render(): TemplateResult;
    protected willUpdate(changed: PropertyValues<SdsHeader>): void;
    protected updated(): void;
}
