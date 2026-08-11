import { type TemplateResult } from 'lit';
import './icon.ts';
import './link.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
export type EmptyKind = 'quiet' | 'boundary';
export interface EmptyProps {
    kind?: EmptyKind;
    /** What happened, as a fact. Not a category — "No icon matches “dashbord”",
        never "No results". */
    heading: string;
    /** Which source was asked, what it answered, and what it does not cover. */
    body: string | TemplateResult;
    /** The glyph. `boundary` carries `actions-info-circle` on its own; anything
        else says what was searched. */
    icon?: IconId;
    /** The nearest real thing to do next. A boundary usually has none, which is
        why it is optional — an offer that leads nowhere is worse than silence. */
    action?: string;
    /** Where the offer goes. Left empty it is a button that says `sds-action`
        instead: undoing a filter changes this page rather than leaving it, and a
        link to nowhere is the control readers learn to stop pressing. */
    href?: string;
    /** The source and scope, in the label register, where naming them in the
        body would make the sentence about the machine. */
    meta?: string;
    /** Layout for the box, since the host is `display: contents`. */
    boxStyle?: string;
}
export declare class SdsEmpty extends SdsElement {
    private static readonly KIND_ICON;
    static properties: {
        kind: {
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
        action: {
            type: StringConstructor;
        };
        href: {
            type: StringConstructor;
        };
        meta: {
            type: StringConstructor;
        };
        boxStyle: {
            type: StringConstructor;
            attribute: string;
        };
    };
    kind: EmptyKind;
    heading: string;
    body: string | TemplateResult;
    icon?: IconId;
    action: string;
    href: string;
    meta: string;
    boxStyle: string;
    constructor();
    /** Pressed, where the offer changes this page. Composed, because the button
        is inside the element a consumer listens on. */
    private act;
    protected render(): TemplateResult;
}
