import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
export interface IconTileProps {
    /** Which glyph. `name` because that is what `sds-icon` calls it, and one
        identifier should not be spelt two ways across two elements. */
    name: IconId;
    /** What is written under it, where the set shows something other than the
        identifier. The identifier otherwise, which is what a reader retypes. */
    caption?: string;
    /** Where the tile goes. Without one it is still a tile: a wall documenting a
        set rather than indexing it presses nowhere. */
    href?: string;
    /** The one fact the drawing cannot show — that it mirrors, that it is new,
        that it is going. One word, in the corner the glyph does not use. */
    tag?: string;
}
export declare class SdsIconTile extends SdsElement {
    static properties: {
        name: {
            type: StringConstructor;
            reflect: boolean;
        };
        caption: {
            type: StringConstructor;
        };
        href: {
            type: StringConstructor;
        };
        tag: {
            type: StringConstructor;
        };
    };
    name: IconId;
    caption: string;
    href: string;
    tag: string;
    constructor();
    protected render(): TemplateResult;
}
