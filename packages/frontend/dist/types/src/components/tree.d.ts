import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
/** One name in the tree, and whatever is under it. */
export interface TreeEntry {
    /** What it is called. A directory is written with its slash — that is how a
        reader tells an empty one from a file, and the only place it can be said:
        an entry with nothing under it looks the same either way. */
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
    /** How deep it stands open. Nothing is dropped below it: what is deeper is
        folded, which a reader can undo, rather than hidden, which they cannot. */
    level?: number;
    /** Whether a folder and a file are marked as such. Off by default: the fold
        says which is which wherever there is anything to fold, and a wall of
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
