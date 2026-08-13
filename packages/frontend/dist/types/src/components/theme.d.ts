import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export type ThemeChoice = 'light' | 'dark';
/** What `sds-theme-change` carries: the choice, or null for the machine's. */
export interface ThemeChange {
    theme: ThemeChoice | null;
}
/** The line a document runs before its first paint, so a stored choice is in
    place before anything is drawn. Returned as source rather than run here:
    it belongs in the head, and by the time an element exists it is too late.

        <script>${themeBoot()}</script> */
export declare const themeBoot: (key?: string) => string;
export declare class SdsTheme extends SdsElement {
    #private;
    static properties: {
        key: {
            type: StringConstructor;
        };
        compact: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        current: {
            type: StringConstructor;
            state: boolean;
        };
    };
    /** Where the choice is stored. Two products on one origin are two keys. */
    key: string;
    /** The words dropped, the glyphs left standing. Set from outside, because
        what has run out of room is the row and not the control — the bar sheds
        these two words before it sheds anything a reader came for. */
    compact: boolean;
    current: ThemeChoice | null;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private choose;
    protected render(): TemplateResult;
}
