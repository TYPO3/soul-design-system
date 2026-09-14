import { type TemplateResult } from 'lit';
import './badge.ts';
import './entry.ts';
import './table.ts';
import { type BadgeTone } from './badge.js';
import { type EntryProps } from './entry.js';
import { SdsElement } from '../lib/element.js';
/** One group of a register. Its key, which an entry names in `group`; the
    heading over it; the word and the tone every entry in it draws. */
export interface RegisterGroup {
    key: string;
    heading: string;
    label?: string;
    tone?: BadgeTone;
}
/** The groups of a review's findings, in the order a review reads them.
    `blocks` stops the change, `back` sends it to its author, `change` is
    worth one and stops nothing, `ok` is a thing checked and found sound. */
export declare const FINDING_GROUPS: readonly RegisterGroup[];
export interface RegisterProps {
    /** The entries, where a static render has no children to take. Between
        the tags otherwise, as `sds-entry` elements. */
    entries?: readonly EntryProps[];
    /** The groups, in order. With them an entry is `1.1`, its group's place
        and its own; without them the entries count up as written, `1`, `2`. */
    groups?: readonly RegisterGroup[];
    /** The name the group sections and the entries' addresses start with:
        `findings-blocks`, `findings-1-1`. So two registers on one page keep
        apart. */
    name?: string;
    /** What stands before every entry's number, `F` for findings. Nothing
        unless the register says so. */
    prefix?: string;
    /** What stands before the number of what is to do, `T` where the register
        says so. */
    todoPrefix?: string;
}
export declare class SdsRegister extends SdsElement {
    static properties: {
        entries: {
            type: ArrayConstructor;
        };
        groups: {
            type: ArrayConstructor;
        };
        name: {
            type: StringConstructor;
        };
        prefix: {
            type: StringConstructor;
        };
        todoPrefix: {
            type: StringConstructor;
            attribute: string;
        };
    };
    entries: readonly EntryProps[];
    groups: readonly RegisterGroup[];
    name: string;
    prefix: string;
    todoPrefix: string;
    private taken;
    constructor();
    connectedCallback(): void;
    private anchorFor;
    /** The attributes an entry gets from its place, for a form that carries
        them as attributes. */
    private facts;
    private fromElements;
    private fromEntries;
    private fromMarkup;
    private get read();
    /** Every entry with its place. Grouped, an entry is its group's place
        and its own; an entry whose group the register does not name stands
        last, in the order written. Ungrouped, the entries count up. */
    private get placed();
    private badge;
    private get columns();
    private row;
    private get todoColumns();
    /** The work an entry asks for, numbered as the entry is, with the prefix
        that tells the two apart. The number is the way back to the entry. */
    private todoRow;
    protected render(): TemplateResult;
}
