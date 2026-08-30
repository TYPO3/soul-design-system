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
    The same default `soul-boot.js` has, both ends reading one name.

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
    /** Where the choice is stored. Two products on one origin are two keys, and
        the default is `soul-boot.js`'s: what writes the mode before the paint and
        what shows which side is pressed have to read the same name, or the choice
        is made here and looked for somewhere else on the next page. */
    key: string;
    /** What the reader chose, or null while they have chosen nothing and the
        machine's setting is what they are reading in. */
    current: ThemeChoice | null;
    /** What the machine asks for, watched: it is the mode in force until a
        press, and a button drawn against the wrong one is a button that lies
        about the page it is standing on. */
    machine: ThemeChoice;
    constructor();
    /** What the reader is reading in, which is not always what they chose. */
    private get inForce();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private step;
    protected render(): TemplateResult;
}
