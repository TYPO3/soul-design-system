import { type TemplateResult } from 'lit';
import './icon.ts';
import './result.ts';
import './empty.ts';
import { SdsElement } from '../lib/element.js';
/** One page, as the index has it. */
export interface SearchEntry {
    title: string;
    url: string;
    /** The first paragraph, or as much of it as the build kept. */
    text: string;
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
    query: string;
    entries: SearchEntry[] | null;
    open: boolean;
    private readonly panelId;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private readonly onOutside;
    private load;
    /** Where the site's root is, from this page. The index lists every page as
        the build sees them, and a reader is rarely standing in the root — so it
        is resolved against the index's own address, which *is* the root. Left to
        the browser, a hit one directory down names a page that does not exist. */
    private hrefOf;
    private get hits();
    private type;
    /** The links in the drop, in the order they are read.
  
        Asked of the markup rather than kept as a list, because what is in the
        panel is drawn by `sds-result` and the class is the contract between
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
    /** The drop, and what is in it. `sds-result` draws a hit, marks what was
        searched for and says where the page is — the query is handed over rather
        than the marking done here, because what is highlighted has to be what was
        actually searched. */
    private panel;
}
