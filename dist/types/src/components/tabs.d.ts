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
    protected readonly block = "sds-tabs";
    protected readonly item = "sds-tab";
    /** The panels written between the tags. */
    private panels;
    /** Take the items written between the tags, if any are there yet. */
    private lift;
    private arriving?;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected choose(index: number): void;
    /** Tell each panel whether it is the one. */
    private show;
    private onKey;
    protected render(): TemplateResult;
    protected updated(): void;
}
