import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
/** One name in the tree, and whatever is under it. */
export interface TreeEntry {
    /** Its name. A directory carries its slash. That is how a reader tells an
        empty one from a file, and the only place to say it. An entry with
        nothing under it looks the same either way. */
    label: string;
    /** What it is for, beside the name. The annotation a tree drawn as text
        lines up with spaces, and the reason those trees go stale. */
    note?: string;
    /** What is under it. Nothing, and it is a leaf. */
    items?: readonly TreeEntry[];
}
export interface TreeProps {
    /** The tree, set from script — being a list, and a nested one. */
    entries?: readonly TreeEntry[];
    /** How deep it stands open. Nothing below it goes: what is deeper folds,
        which a reader can undo, rather than hides, which they cannot. */
    level?: number;
    /** If a folder and a file carry a mark that says so. Off by default. The
        fold says which is which wherever there is anything to fold. A wall of
        glyphs down the left of a short tree is decoration. */
    icons?: boolean;
}
export declare class SdsTree extends SdsElement {
    static properties: {
        entries: {
            type: ArrayConstructor;
        };
        level: {
            type: NumberConstructor;
            reflect: boolean;
        };
        icons: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    entries: readonly TreeEntry[];
    level: number;
    icons: boolean;
    constructor();
    private glyph;
    private said;
    private row;
    private list;
    protected render(): TemplateResult;
}
