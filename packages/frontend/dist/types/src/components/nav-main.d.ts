import { type TemplateResult, type PropertyValues } from 'lit';
import { SdsNav, type MenuEntry } from './nav-base.js';
import './icon.ts';
import './overlay.ts';
import './search.ts';
import './theme.ts';
export declare class SdsNavMain extends SdsNav {
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
        search: {
            type: BooleanConstructor;
        };
        index: {
            type: StringConstructor;
        };
        menu: {
            type: ObjectConstructor;
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
        opened: {
            type: NumberConstructor;
            state: boolean;
        };
        stack: {
            type: ArrayConstructor;
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
    };
    protected readonly block = "sds-bar";
    protected readonly item = "sds-pill";
    /** Where the mark goes: the way home, from anywhere on the site. */
    home: string;
    /** The mark, as a file to link. The 20–31px drawing, since that is the size
        a bar gives it — a mark picked for another box is redrawn, never scaled. */
    signet: string;
    /** Who publishes this, which is the word that stays across every site. */
    brand: string;
    /** What this one is called, set beside the brand. A site with only a brand
        leaves it off rather than repeating the brand in a lighter weight. */
    product: string;
    /** Whether the bar carries a search field. A field with no `index` searches
        nothing, which is a specimen rather than a site. */
    search: boolean;
    /** Where the index is, relative to the page. Setting it is asking for the
        field as well — a site that has an index has a search. */
    index: string;
    /** The site, as one entry with everything under it: the front doors in the
        row, the pages of one of them in the panel below it, and the whole of it
        in the drawer. The same entry a rail is given, one level up — a section
        holds pages, and the site holds sections. */
    menu: MenuEntry;
    /** What the toggle is called, for a reader who cannot see it is a menu. */
    label: string;
    /** Where `sds-theme` keeps the reader's choice, where it keeps one. Written
        onto it only when a bar names one: an empty attribute is a name too, and
        it is not the one the pre-paint script reads. */
    themeKey: string;
    open: boolean;
    /** Which section has its panel open, or -1. One at a time: two panels over
        one page is a reader working out which of them the bar is answering. */
    opened: number;
    /** How far into the menu the drawer has been stepped: the entries walked
        through, the last of them being the level on screen. */
    stack: MenuEntry[];
    compactTheme: boolean;
    foldNav: boolean;
    foldSearch: boolean;
    private readonly drawerId;
    /** What the sections, the field and the mode pair's two words need in the
        row. Zero means "not measured yet", and each can only be measured where
        it is — standing in the row. */
    private needNav;
    private needSearch;
    private needWords;
    private watch?;
    private watched;
    /** The close a pointer asked for, still waiting out its grace. */
    private leaving?;
    /** Which way the drawer has just stepped, and how tall it was before it did.
        Both are read once, by the render that has to show the step. */
    private stepped;
    private stood;
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
    /** Where the drawer opens: on the level the reader is standing on, which is
        the entry holding the page they are reading. A menu that always opened at
        the top would ask somebody three sections deep to walk back down to where
        they already were — and the way up is one press, which the way down is
        not. */
    private path;
    /** Back to that level. A reader who stepped somewhere and closed the drawer
        is not still asking about it the next time they open one. */
    private reset;
    private onKey;
    /** The rows of whichever list the key was pressed in: a panel under one
        section, or the drawer holding the whole menu. */
    private list;
    /** Down a list of pages and back up it. The arrow that opens a panel steps
        into it in the same breath, and Tab is left alone: it is how a reader
        leaves. */
    private walk;
    protected choose(index: number): void;
    /** What is in the row and what is in the drawer, from the room the row has
        rather than from a width. The order is what the bar can best do without:
        the field first, the sections last. */
    private decide;
    private field;
    /** The sections of the menu that stand in the row. Which of a site's
        sections are its front doors is the one thing its tree cannot say, so the
        menu says it; with none named, every section is one. */
    private doors;
    /** One front door: the link, and the fold that opens its pages under the row.
        The link stays a link — pressing a section's name goes to that section,
        and what opens the panel is the marker beside it. A `<details>`, so the
        panel works before any script and the bar only has to say which one is
        open.
  
        A pointer opens it too, and on the whole section rather than the marker
        alone: a menu that only answers a press asks a reader who is already
        moving to stop and aim. Nothing is lost without it — the marker is the
        control, and the pointer is a shortcut to the same state. */
    private door;
    /** A page in a panel. Two levels and no more: the row is the site's own, the
        panel is one section's pages, and a third level under a bar is a sitemap
        hanging off a menu — what the drawer opens is where a whole tree is read.
        Where the rows break into columns is the stylesheet's: a wall is one list,
        and how many columns it takes is a question about the room. */
    private page;
    /** A pointer over a section opens it, and leaving closes it — but only while
        the sections are standing in the row. In the drawer they are a list being
        scrolled past, and a panel that opens under a finger on its way somewhere
        is a menu answering a movement nobody made. A mouse only, for the same
        reason: a tap is a press, and the marker beside the link is what a press
        is for. */
    private hover;
    /** Which panel a press left open. The event fires for the bar's own render
        as well as for a reader's press, and saying the same thing twice is what
        keeps the two from arguing. */
    private fold;
    /** One level of the menu: what the drawer shows once the row has given the
        sections up.
  
        A level and not the tree. A phone is a window onto a long list, and the
        whole site unfolded into one column is forty rows a reader scrolls past
        to reach the four that are the site. So the drawer starts at the top
        level and steps *into* a section — the way in is a control of its own,
        beside the link, because a section is both a page to read and a place to
        go through. The way back is the row above the list, naming what it
        returns to rather than saying "back" to a reader who has forgotten. */
    private level;
    /** One row of a level: where it goes, and — where it holds pages — the way
        into them. Two controls rather than one, for the reason the row above the
        page has two: the label is the page, and the marker is what is under it. */
    private step;
    /** The sections as parts, and which of them the reader is in. Four shapes
        arrive here: as the menu, lifted from the page, handed over as markup, or
        as data. Empty rather than absent where nothing was lifted, so the
        fallback is the length and not a `??` that a `[]` never reaches.
        `lifted()` runs in a browser only. */
    private sections;
    /** The sections: a row in the bar, a column in the drawer. */
    private nav_;
    private toggle_;
    protected render(): TemplateResult;
    protected willUpdate(changed: PropertyValues<SdsNavMain>): void;
    protected updated(): void;
    /** The step, shown as one. The level arrives from the side it was reached
        from and the drawer grows into its new height rather than jumping to it,
        both in the one duration and curve the system moves anything in — read
        from the tokens, so a change there reaches this too.
  
        Held still for a reader who asked for that: what goes is the travel, not
        the answer. */
    private travel;
}
