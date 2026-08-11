import { type TemplateResult } from 'lit';
import './link.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
/** A link in a column. `external` gets the glyph and opens away; `icon` is
    for the marks a footer is the usual home of — a repository, a chat, a
    feed. Labelled, always: a row of bare brand glyphs is a row of pictures
    the reader has to already recognise. */
export interface FooterLink {
    label: string;
    href?: string;
    external?: boolean;
    icon?: IconId;
}
/** One column: what it collects, and what is in it. */
export interface FooterGroup {
    label: string;
    items: readonly FooterLink[];
}
export interface FooterProps {
    groups: readonly FooterGroup[];
    /** What this is. Stated, never implied — and never whose it is. */
    note: string;
    /** What has to travel with it: a licence, a version, a legal page. */
    meta?: readonly FooterLink[];
}
export declare class SdsFooter extends SdsElement {
    static properties: {
        groups: {
            type: ArrayConstructor;
        };
        note: {
            type: StringConstructor;
        };
        meta: {
            type: ArrayConstructor;
        };
    };
    groups: readonly FooterGroup[];
    note: string;
    meta: readonly FooterLink[];
    constructor();
    private static link;
    protected render(): TemplateResult;
}
