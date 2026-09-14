import { type TemplateResult } from 'lit';
import './badge.ts';
import { type BadgeTone } from './badge.js';
import { SdsElement } from '../lib/element.js';
export interface EntryProps {
    /** Its place in the register, as the register numbers it: `1.1`. In mono,
        because a reader cites it. */
    number?: string;
    /** What stands before the number, `F` for a finding, where a register says
        so. Nothing unless it does. */
    prefix?: string;
    /** The entry, in a line. Sentence case, and never a category name. */
    heading: string;
    /** The kind of entry it is, as the word on its badge: `blocks`,
        `sent back`. A register hands it down from its groups. */
    label?: string;
    /** The tone under that word. */
    tone?: BadgeTone;
    /** The key of the group it belongs to, for the register that groups. */
    group?: string;
    /** Where it came from, in a few words: `introduced by this change`,
        `older than the change`. A fault the change did not make weighs on
        the change differently. */
    origin?: string;
    /** The address of this one entry, so a remark at the code can point at
        it. */
    anchor?: string;
    /** What is to do about it, in one sentence, for whoever acts on it. A
        register collects these into the list of what is to do. An entry with
        none is a fact, and one with one is work. */
    todo?: string;
    /** What stands before the number of that work, `T` where a register says
        so. Nothing unless it does. */
    todoPrefix?: string;
    /** What the entry holds, as prose. Or nothing, when the blocks stand
        between the tags instead: paragraphs, a code block, a table. */
    body?: string | TemplateResult;
}
export declare class SdsEntry extends SdsElement {
    static properties: {
        number: {
            type: StringConstructor;
        };
        prefix: {
            type: StringConstructor;
        };
        heading: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        tone: {
            type: StringConstructor;
        };
        group: {
            type: StringConstructor;
        };
        origin: {
            type: StringConstructor;
        };
        anchor: {
            type: StringConstructor;
        };
        todo: {
            type: StringConstructor;
        };
        todoPrefix: {
            type: StringConstructor;
            attribute: string;
        };
        body: {
            type: StringConstructor;
        };
    };
    number: string;
    prefix: string;
    heading: string;
    label: string;
    tone: BadgeTone;
    group: string;
    origin: string;
    anchor: string;
    todo: string;
    todoPrefix: string;
    body: string | TemplateResult;
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
