import { type TemplateResult } from 'lit';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
export declare class SdsTabItem extends SdsElement {
    static properties: {
        label: {
            type: StringConstructor;
            reflect: boolean;
        };
        /** A glyph before the label. For a tab whose subject has one — a file
            type, a tool — never as decoration on a set that reads fine without. */
        icon: {
            type: StringConstructor;
            reflect: boolean;
        };
        active: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    /** What the tab is called. The panel it names goes between the tags. */
    label: string;
    /** A glyph before the label, where a set of tabs is told apart before it
        is read. */
    icon?: IconId;
    /** Whether this is the tab being read. One at a time, which the set
        enforces. */
    active: boolean;
    /** Whether a set of tabs is deciding which panel is shown. A panel decides
        for itself until one is — which is what a panel is on a page where nothing
        switches it, and hiding every one there leaves content in the document and
        invisible in it. The set claims them the moment it exists. */
    managed: boolean;
    /** The id its tab points at, and the id its tab carries. */
    readonly panelId: string;
    readonly tabId: string;
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
