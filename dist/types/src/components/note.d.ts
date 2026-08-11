import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
export type NoteTone = 'info' | 'ok' | 'warn' | 'error';
export interface NoteProps {
    tone?: NoteTone;
    /** The fact, in a line. Sentence case, and never a category name. */
    heading: string;
    /** What it means for the reader. A template where it names a path or a
        command, which sets in mono inside the sentence. */
    body: string | TemplateResult;
    /** An explicit glyph, where the tone's own says less than the note does. */
    icon?: IconId;
}
export declare class SdsNote extends SdsElement {
    /** The glyph each tone carries. */
    private static readonly TONE_ICON;
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
    };
    tone: NoteTone;
    heading: string;
    body: string | TemplateResult;
    icon?: IconId;
    constructor();
    protected render(): TemplateResult;
}
