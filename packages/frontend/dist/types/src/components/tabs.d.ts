import { type TemplateResult } from 'lit';
import { SdsNav } from './nav-base.js';
import { type IconId } from './icon.js';
/** One tab in the bar. `tabId` and `panelId` are present where there is a
    panel to point at, which is everywhere except a still picture. */
export interface TabHandle {
    label: string;
    icon?: IconId;
    tabId?: string;
    panelId?: string;
}
/** The bar a set of tabs is. */
export declare function tabsBarMarkup(tabs: readonly TabHandle[], active: number, pick?: (index: number) => void, onKey?: (event: KeyboardEvent) => void): TemplateResult;
export declare class SdsTabs extends SdsNav {
    static properties: {
        items: {
            type: ArrayConstructor;
        };
        active: {
            type: NumberConstructor;
            reflect: boolean;
        };
        /** The word that makes sets follow each other. Named for what it does
            rather than for the set's name. A page that shows one setting in four
            places asks the reader to choose a language once. A set with nothing
            here is a set nobody else moves. */
        sync: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    /** A name every set that moves together shares: a tab picked in one picks
        the same label in all of them. Unset rather than empty. `reflect` writes
        `sync=""`, and a set that follows nobody then answers to `[sync]` — for a
        stylesheet, for a test, and for the registry below. */
    sync?: string;
    protected readonly block = "sds-tabs";
    protected readonly item = "sds-tab";
    static readonly agreeing: Set<SdsTabs>;
    /** The panels written between the tags. */
    private panels;
    /** Take the items written between the tags, if any are there yet. */
    private lift;
    private arriving?;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected choose(index: number): void;
    /** Where the choice lives. One key per group, so two sets that agree
        about nothing on the same origin do not overwrite each other. */
    private get store();
    private get labels();
    private get preferred();
    private agree;
    private follow;
    private recalled;
    private recall;
    /** Tell each panel if it is the one. */
    private show;
    private onKey;
    protected render(): TemplateResult;
    protected updated(): void;
}
