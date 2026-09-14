import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export type ThemeChoice = 'light' | 'dark';
/** What `sds-theme-change` carries: the choice, or null for the machine's. */
export interface ThemeChange {
    theme: ThemeChoice | null;
}
/** The line a document runs before its first paint, so a stored choice is in
    place before anything renders. Returned as source rather than run here:
    it belongs in the head, and by the time an element exists it is too late.
    The same default `soul-boot.js` has, so both ends read one name.

        <script>${themeBoot()}</script> */
export declare const themeBoot: (key?: string) => string;
export declare class SdsTheme extends SdsElement {
    #private;
    static properties: {
        key: {
            type: StringConstructor;
        };
        current: {
            type: StringConstructor;
            state: boolean;
        };
        machine: {
            type: StringConstructor;
            state: boolean;
        };
    };
    /** Where the choice lives. Two products on one origin are two keys, and the
        default is the one `soul-boot.js` has. The boot line and this button
        must read the same name, or the next page looks for the choice
        somewhere else. */
    key: string;
    /** What the reader chose, or null while they have chosen nothing and read
        in the machine's setting. */
    current: ThemeChoice | null;
    /** What the machine asks for, watched. It is the mode in force until a
        press, and a button drawn against the wrong one lies about its page. */
    machine: ThemeChoice;
    constructor();
    /** What the reader reads in, which is not always what they chose. */
    private get inForce();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private step;
    protected render(): TemplateResult;
}
