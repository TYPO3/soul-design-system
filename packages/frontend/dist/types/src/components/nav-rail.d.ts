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
    /** What this is the list of, and the list. A rail holding one section of a
        site is that section: its label stands over the pages as the way to the
        section's own page, and an entry with no label has no heading — which is
        right where the rail is the whole navigation there is. */
    entry: MenuEntry;
    /** Which row a reader pressed, where the rows are choices rather than links.
        -1 until they have: a list that names its own current page is stating a
        fact about the page, and a press is the only thing allowed to overrule
        it. */
    picked: number;
    /** The rows a server wrote between the tags. A renderer that has resolved
        its own tree writes the classes below, so the two shapes are one shape. */
    private taken;
    constructor();
    connectedCallback(): void;
    /** Every page in the rail, folds flattened: a rail has one current page
        wherever it sits, and a caller thinking in "third item of the second
        group" is thinking about the markup. */
    private flat;
    private isCurrent;
    /** One page, and whatever hangs under it.
  
        A page that holds pages is a row like any other with the marker that
        opens them beside it — the same pair the bar's row draws, so a reader
        meets one shape and not two. What it holds is set in by a step, because
        a list where everything starts on the same edge says nothing about what
        belongs to what. */
    private row;
    private one;
    protected render(): TemplateResult;
    /** A row with nowhere to go is a choice: pressing it makes it current and
        says so, for whatever is beside it to follow. */
    private pick;
}
