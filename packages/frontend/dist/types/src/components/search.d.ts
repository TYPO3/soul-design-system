import { type TemplateResult } from 'lit';
import './icon.ts';
import './search-hits.ts';
import { SdsElement } from '../lib/element.js';
import { type FieldSize } from '../lib/field-box.js';
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
    /** Where the index is, relative to the page. Every entry in it is a path
        from the site root, and they resolve against that address. So a hit two
        directories down still names the page it meant. */
    index: string;
    /** The field's name, as the placeholder and as its accessible name both. */
    label: string;
    /** The height of the box, the field's own three. A bar that runs its own
        controls at `sm` runs the search at `sm` too, or the row has two heights
        in it. The drop is the field's width and follows whatever it gets. */
    size: FieldSize;
    query: string;
    entries: SearchEntry[] | null;
    open: boolean;
    private readonly panelId;
    /** The anchor this drop stands against, named per instance. One name for
        every field on a page resolves to whichever the browser met last. A bar
        can hold a second search in its drawer. */
    private readonly anchor;
    /** What stops the placement this element made, where it made one. */
    private following?;
    constructor();
    disconnectedCallback(): void;
    private readonly onToggle;
    protected updated(): void;
    private loading?;
    private load;
    /** Where the site's root is, from this page. The index lists every page as
        the build sees them, and a reader rarely stands in the root. So a path
        out of it resolves against the index's own address, which *is* the
        root. Left to the browser, a hit one directory down names a page that
        does not exist. A picture beside it names a file that is not there. */
    private from;
    private get hits();
    private type;
    /** The links in the drop, in the reader's order.
  
        Asked of the markup, not kept as a list. `sds-search-result` draws what
        is in the panel, and the class is the contract between them, the same
        contract the stylesheet works through. */
    private links;
    /** In the field: down goes into the list, Escape gives the page back.
  
        Focus moves for real, and no row gets a mark as if it had. These are
        links, and a reader who arrowed to one can open it in a new tab like
        any other. */
    private onFieldKey;
    /** In the drop: the arrows walk it, and up from the first goes back to the
        typed text. Escape closes from anywhere in it, which is where a reader
        who changed their mind stands. */
    private onPanelKey;
    /** Left entirely — a press elsewhere, or a tab out of the last hit. */
    private onLeave;
    protected render(): TemplateResult;
    /** What the index has, as what a result draws from. The only place the two
        vocabularies meet. A page has a title and a URL, a hit has a heading and
        an href, and nothing below here knows about an index.
  
        The whole sentence the index kept. How much of it a reader sees is the
        drop's question and not this one's, and the class layer answers it. A
        hit under a field gives two lines of it, a page of results the lot. */
    private hitOf;
    /** The drop, and what is in it. The box is this element's. Where it hangs
        and how far it can grow are questions about the field it belongs to.
        `sds-search-hits` draws the answer inside it, hits or none.
  
        The query goes over, and the mark does not happen here. The highlight
        has to be the real search term. */
    private panel;
}
