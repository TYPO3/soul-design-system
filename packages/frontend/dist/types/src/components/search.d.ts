import { type TemplateResult } from 'lit';
import './icon.ts';
import './search-hits.ts';
import { SdsElement } from '../lib/element.js';
import { type FieldSize } from './field.js';
/** One page, as the index has it. */
export interface SearchEntry {
    title: string;
    url: string;
    /** The first paragraph, or as much of it as the build kept. */
    text: string;
    /** The picture the page carries, where the index kept one. Named from the
        root like `url`, and resolved the same way. */
    image?: string;
}
export declare class SdsSearch extends SdsElement {
    static properties: {
        /** Where the index is. Relative to the page, like every other asset. */
        index: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
        query: {
            type: StringConstructor;
            state: boolean;
        };
        entries: {
            type: ArrayConstructor;
            state: boolean;
        };
        open: {
            type: BooleanConstructor;
            state: boolean;
        };
    };
    index: string;
    label: string;
    /** The height of the box, the field's own three. A bar that runs its own
        controls at `sm` runs the search at `sm` too, or the row has two heights
        in it. The drop is the field's width and follows whatever it is given. */
    size: FieldSize;
    query: string;
    entries: SearchEntry[] | null;
    open: boolean;
    private readonly panelId;
    /** The anchor this drop is placed against, named per instance: one name
        shared by every field on a page resolves to whichever the browser met
        last, and a bar can hold a second search in its drawer. */
    private readonly anchor;
    /** What stops the placement this element made, where it made one. */
    private following?;
    constructor();
    disconnectedCallback(): void;
    private readonly onToggle;
    protected updated(): void;
    private load;
    /** Where the site's root is, from this page. The index lists every page as
        the build sees them, and a reader is rarely standing in the root — so a
        path out of it is resolved against the index's own address, which *is*
        the root. Left to the browser, a hit one directory down names a page that
        does not exist — and a picture beside it a file that is not there. */
    private from;
    private get hits();
    private type;
    /** The links in the drop, in the order they are read.
  
        Asked of the markup rather than kept as a list, because what is in the
        panel is drawn by `sds-search-result` and the class is the contract between
        them — the same contract the stylesheet works through. */
    private links;
    /** In the field: down goes into the list, Escape gives the page back.
  
        Focus moves for real rather than a row being marked as though it had —
        these are links, and a reader who has arrowed to one should be able to
        open it in a new tab like any other. */
    private onFieldKey;
    /** In the drop: the arrows walk it, and up from the first goes back to what
        was typed. Escape closes from anywhere in it, which is where a reader who
        changed their mind is standing. */
    private onPanelKey;
    /** Left entirely — a press elsewhere, or a tab out of the last hit. */
    private onLeave;
    protected render(): TemplateResult;
    /** What the index has, as what a result is drawn from. The only place the
        two vocabularies meet: a page has a title and a URL, a hit has a heading
        and an href, and nothing below here knows about an index.
  
        The whole sentence the index kept: how much of it a reader is shown is
        the drop's question and not this one's, and the class layer answers it —
        a hit under a field gives two lines of it, a page of results the lot. */
    private hitOf;
    /** The drop, and what is in it. The box is this element's — where it hangs
        and how far it may grow are questions about the field it belongs to —
        and `sds-search-hits` draws the answer inside it, hits or none.
  
        The query is handed over rather than the marking done here, because what
        is highlighted has to be what was actually searched. */
    private panel;
}
