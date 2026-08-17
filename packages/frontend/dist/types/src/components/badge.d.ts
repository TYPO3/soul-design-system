import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
export type BadgeTone = 'default' | 'accent' | 'ok' | 'warn' | 'error';
export interface BadgeProps {
    /** The word it says, and the whole of what a badge is. */
    label: string;
    /** What it means. `default` is a plain fact, `accent` says where an answer
        came from, and `ok`, `warn` and `error` are the result of one — those
        three carry their own glyph. */
    tone?: BadgeTone;
    /** An explicit glyph, overriding the tone's own. The status tones already
        carry one; `default` and `accent` carry none, because most badges are a
        word and nothing more. Give one where the icon adds a fact the word does
        not — the source an answer came from, the kind of thing being counted. */
    icon?: IconId;
}
export declare class SdsBadge extends SdsElement {
    /** The glyph each result tone carries. */
    private static readonly TONE_ICON;
    static properties: {
        label: {
            type: StringConstructor;
        };
        tone: {
            type: StringConstructor;
            reflect: boolean;
        };
        icon: {
            type: StringConstructor;
        };
    };
    label: string;
    tone: BadgeTone;
    icon?: IconId;
    constructor();
    protected render(): TemplateResult;
}
