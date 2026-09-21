import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
import { type MenuEntry } from './nav-base.js';
export declare class SdsNavRail extends SdsElement {
    static properties: {
        entry: {
            type: ObjectConstructor;
        };
        picked: {
            type: NumberConstructor;
            state: boolean;
        };
    };
    /** What this is the list of, and the list. A rail with one section of a
        site is that section: its label stands over the pages as the way to the
        section's own page. An entry with no label has no heading, which is
        right where the rail is the whole navigation there is. */
    entry: MenuEntry;
    /** Which row a reader pressed, where the rows are choices rather than links.
        -1 until they have. A list that names its own current page states a fact
        about the page, and only a press can overrule it. */
    picked: number;
    /** The rows a server wrote between the tags. A renderer that has resolved
        its own tree writes the classes below, so the two shapes are one shape. */
    private taken;
    private watch?;
    constructor();
    /** The box the rail scrolls in: the nearest ancestor that scrolls, which
        the page writes and the rail stands in. None on a page that has none. */
    private box;
    /** The box keeps the wheel while it has rows to scroll to, for the reason
        the outline does, and by the same measure. The rail measures because
        the box is the page's and a fold that opens is the rail's own height. */
    private keep;
    protected firstUpdated(): void;
    disconnectedCallback(): void;
    connectedCallback(): void;
    /** Every page in the rail, folds flattened. A rail has one current page
        wherever it sits, and a caller who thinks in "third item of the second
        group" thinks about the markup. */
    private flat;
    private isCurrent;
    /** One page, and whatever hangs under it.
  
        A page that holds pages is a row like any other, with the marker that
        opens them beside it. The same pair the bar's row draws, so a reader
        meets one shape and not two. What it holds stands in by a step, because
        a list where everything starts on the same edge says nothing about what
        belongs to what. */
    private row;
    /** What stands in a row: the glyph where the entry asked for one, and the
        name in a node of its own. The rail is one fixed width and its rows are
        names a machine gave, so the name is the half that gives. A cut needs a
        box of its own. */
    private inside;
    private one;
    protected render(): TemplateResult;
    /** A row with nowhere to go is a choice: pressing it makes it current and
        says so, for whatever is beside it to follow. */
    private pick;
}
