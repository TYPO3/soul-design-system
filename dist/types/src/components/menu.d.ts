import { type TemplateResult, type PropertyValues } from 'lit';
import { SdsNav } from './nav-base.js';
import './icon.ts';
export declare class SdsMenu extends SdsNav {
    static properties: {
        items: {
            type: ArrayConstructor;
        };
        active: {
            type: NumberConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
        };
        open: {
            type: BooleanConstructor;
            state: boolean;
        };
        collapsed: {
            type: BooleanConstructor;
            state: boolean;
        };
    };
    protected readonly block = "sds-menu";
    protected readonly item = "sds-pill";
    /** What the toggle is called, for the reader who cannot see it is a menu. */
    label: string;
    open: boolean;
    collapsed: boolean;
    private readonly navId;
    /** The width the items need in a row. Zero means "not measured yet", which
        renders inline — the one state the row can be measured in. */
    private need;
    private watch?;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private readonly onOutside;
    private onKey;
    protected choose(index: number): void;
    /** Collapsed or not, from the room the row has rather than from a width. */
    private decide;
    protected render(): TemplateResult;
    protected willUpdate(changed: PropertyValues<SdsMenu>): void;
    protected updated(): void;
}
