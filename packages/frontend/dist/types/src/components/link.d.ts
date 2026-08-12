import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
export interface LinkProps {
    label: string;
    href?: string;
    /** Opens away from this surface: gets the glyph, and says so to the
        browser as well as to the eye. */
    external?: boolean;
    /** A glyph before the label — a repository, a chat, a feed. It never
        replaces the label: four glyphs in this system may stand alone, and all
        four say something about a result. A row of bare marks is a row of
        pictures the reader has to already know. */
    icon?: IconId;
}
export declare class SdsLink extends SdsElement {
    static properties: {
        label: {
            type: StringConstructor;
        };
        href: {
            type: StringConstructor;
            reflect: boolean;
        };
        external: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        icon: {
            type: StringConstructor;
        };
    };
    label: string;
    href: string;
    external: boolean;
    icon?: IconId;
    constructor();
    /** Whether a glyph is about direction rather than about the thing. A glyph
        leads its label and a direction glyph follows it, which is a property of
        the glyph — so the component decides. A boolean here would be a caller's
        chance to put an arrow in front of a word. */
    private static leads;
    protected render(): TemplateResult;
}
