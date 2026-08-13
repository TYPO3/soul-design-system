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
    /** A glyph before the label — a repository, a chat, a feed. In running text
        it never replaces the label: the glyphs that say something about a result
        may stand alone, and a word in a sentence may not be a picture. */
    icon?: IconId;
    /** The label names the link without being drawn, and the glyph is the whole
        of it. For a mark that stands where a reader looks for marks — the row of
        accounts at the end of a footer — and nowhere a link sits in a sentence.
        Drawn at 24, because alone it is a target as well as a picture, and the
        external glyph goes: two marks on one link say one thing twice. */
    bare?: boolean;
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
        bare: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    label: string;
    href: string;
    external: boolean;
    icon?: IconId;
    bare: boolean;
    constructor();
    /** Whether a glyph is about direction rather than about the thing. A glyph
        leads its label and a direction glyph follows it, which is a property of
        the glyph — so the component decides. A boolean here would be a caller's
        chance to put an arrow in front of a word. */
    private static leads;
    protected render(): TemplateResult;
}
