import { type TemplateResult, type PropertyValues } from 'lit';
import { SdsNav, type MenuEntry } from './nav-base.js';
import { type DropdownChoice } from './dropdown.js';
import './icon.ts';
import './dropdown.ts';
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
        languages: {
            type: ArrayConstructor;
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
        a bar gives it. A mark for another box is a new drawing, never a scale. */
    signet: string;
    /** Who publishes this, which is the word that stays across every site. */
    brand: string;
    /** The product's name, beside the brand. A site with only a brand leaves it
        off, and does not repeat the brand in a lighter weight. */
    product: string;
    /** If the bar carries a search field. A field with no `index` searches
        nothing, which is a specimen, not a site. */
    search: boolean;
    /** Where the index is, relative to the page. It asks for the field as
        well: a site with an index has a search. */
    index: string;
    /** The site, as one entry with everything under it. The front doors in the
        row, the pages of one of them in the panel below it, and the whole of it
        in the drawer. The same entry a rail gets, one level up. A section holds
        pages, and the site holds sections. */
    menu: MenuEntry;
    /** The same page in other languages, each entry with its own `lang`. That
        makes a reader hear "Deutsch" in German, not in the voice of the page.
        With none, the bar carries no language control: a site in one language
        does not ask which one. */
    languages: readonly DropdownChoice[];
    /** The toggle's name, for a reader who cannot see that it is a menu. */
    label: string;
    /** Where `sds-theme` keeps the reader's choice, where it keeps one. Set on
        it only when a bar names one. An empty attribute is a name too, and not
        the one the pre-paint script reads. */
    themeKey: string;
    open: boolean;
    /** Which section has its panel open, or -1. One at a time. Two panels over
        one page leave a reader to work out which one the bar answers. */
    opened: number;
    /** How far into the menu the drawer has stepped: the entries on the way,
        the last of them the level on screen. */
    stack: MenuEntry[];
    foldNav: boolean;
    foldSearch: boolean;
    private readonly drawerId;
    /** What the sections and the field need in the row. Zero means "no
        measurement yet". Each measures only where it is: in the row. */
    private needNav;
    private needSearch;
    private watch?;
    private watched;
    /** The close a pointer asked for, still waiting out its grace. */
    private leaving?;
    /** Which way the drawer has just stepped, and how tall it was before it did.
        The render that shows the step reads both once. */
    private stepped;
    private stood;
    /** The links a server wrote between the tags, moved into the row. A rendered
        site resolves its own navigation before it sends the page. A pass back
        through `items` encodes and resolves it a second time. So they stay as
        written, `target`, `rel` and current mark intact. */
    private taken;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private readonly onOutside;
    private readonly onFollow;
    /** Where the drawer opens: on the reader's own level, the entry that holds
        their page. A menu that always opens at the top asks somebody three
        sections deep to walk back down to where they were. The way up is one
        press, and the way down is not. */
    private path;
    /** Back to that level. A reader who stepped somewhere and closed the drawer
        is not still asking about it the next time they open one. */
    private reset;
    private onKey;
    /** The rows of the list the key press happened in: a panel under one
        section, or the drawer with the whole menu. */
    private list;
    /** Down a list of pages and back up it. The arrow that opens a panel steps
        into it in the same breath. Tab stays as it is: it is how a reader
        leaves. */
    private walk;
    protected choose(index: number): void;
    /** What is in the row and what is in the drawer, from the room the row has
        rather than from a width. The order is what the bar can best do without:
        the field first, the sections last. */
    private decide;
    private field;
    /** The languages, as the one control at this end that is not a mode. The
        button says the reader's code and nothing else. The row is short of
        width first, and the names are one press away, each in its own language.
        Hung from the end, or a list from the corner runs off the page. */
    private languages_;
    /** The sections of the menu that stand in the row. Which sections are the
        front doors is the one thing a tree cannot say, so the menu says it. With
        none named, every section is one. */
    private doors;
    /** One front door: the link, and the fold that opens its pages under the row.
        The link stays a link — pressing a section's name goes to that section,
        and what opens the panel is the marker beside it. A `<details>`, so the
        panel works before any script and the bar only has to say which one is
        open.
  
        A pointer opens it too, on the whole section and not the marker alone. A
        menu that answers only a press asks a reader in motion to stop and aim.
        Nothing goes without it. The marker is the control, and the pointer is a
        shortcut to the same state. */
    private door;
    /** A page in a panel. Two levels and no more. The row is the site's own, and
        the panel is one section's pages. A third level under a bar is a sitemap
        on a menu; the drawer is where a reader reads a whole tree. The
        stylesheet decides where the rows break into columns. A wall is one
        list, and its column count is a question about the room. */
    private page;
    /** A pointer over a section opens it, and a pointer off it closes it, only
        while the sections stand in the row. In the drawer they are a list a
        reader scrolls past. A panel that opens under a finger on its way
        somewhere answers a movement nobody made. A mouse only, for the same
        reason. A tap is a press, and the marker beside the link is what a press
        is for. */
    private hover;
    /** Which panel a press left open. The event fires for the bar's own render
        and for a reader's press. The same statement twice keeps the two in
        agreement. */
    private fold;
    /** One level of the menu: what the drawer shows once the row has given the
        sections up.
  
        A level and not the tree: the whole site in one column is forty rows a
        reader scrolls past for the four that matter. So the drawer starts at
        the top level and steps *into* a section. The way in is a control of
        its own, beside the link, because a section is both a page and a place
        to go through. The way back is the row above the list, with the name
        of its target, not "back". */
    private level;
    /** One row of a level: where it goes, and, where it holds pages, the way
        into them. Two controls, for the reason the row above the page has two.
        The label is the page, and the marker is what is under it. */
    private step;
    /** The sections as parts, and which of them the reader is in. Four shapes
        arrive here: as the menu, lifted from the page, handed over as markup, or
        as data. Empty, not absent, where the lift found nothing, so the
        fallback is the length and not a `??` that a `[]` never reaches.
        `lifted()` runs in a browser only. */
    private sections;
    /** The sections: a row in the bar, a column in the drawer. */
    private nav_;
    private toggle_;
    protected render(): TemplateResult;
    protected willUpdate(changed: PropertyValues<SdsNavMain>): void;
    protected updated(): void;
    /** The step, shown as one. The level arrives from the side of its approach,
        and the drawer grows into its new height instead of a jump. Both in the
        one duration and curve the system moves anything in, read from the
        tokens, so a change there reaches this too.
  
        Held still for a reader who asked for that. What goes is the travel, not
        the answer. */
    private travel;
}
