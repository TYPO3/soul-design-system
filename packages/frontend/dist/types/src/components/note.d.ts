import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
export type NoteTone = 'info' | 'ok' | 'warn' | 'error';
export interface NoteProps {
    tone?: NoteTone;
    /** The fact, in a line. Sentence case, and never a category name.
  
        Optional, because a note whose body is a document's own prose has
        nothing to head it with — see `label`. */
    heading?: string;
    /** What it means for the reader. A template where it names a path or a
        command, which sets in mono inside the sentence.
  
        Or nothing, when the body is written between the tags instead. */
    body?: string | TemplateResult;
    /** An explicit glyph, where the tone's own says less than the note does. */
    icon?: IconId;
    /** What the glyph says out loud, because a colour cannot be the only carrier
        of a meaning. Each tone names its own word and a caller may say a truer
        one: a renderer collapsing many admonition types onto four tones knows
        which this was, so `caution` and `danger` stay apart after both are
        `warn`. */
    label?: string;
}
export declare class SdsNote extends SdsElement {
    /** The glyph each tone carries. */
    private static readonly TONE_ICON;
    /** And what it says, for a reader who is not looking at the colour. */
    private static readonly TONE_LABEL;
    static properties: {
        tone: {
            type: StringConstructor;
            reflect: boolean;
        };
        heading: {
            type: StringConstructor;
        };
        body: {
            type: StringConstructor;
        };
        icon: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
    };
    tone: NoteTone;
    heading: string;
    body: string | TemplateResult;
    icon?: IconId;
    label: string;
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
