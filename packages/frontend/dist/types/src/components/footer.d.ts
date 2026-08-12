import { type TemplateResult } from 'lit';
import './link.ts';
import './image.ts';
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
    /** The machine's name for it, set as the machine's. A product, a package,
        a repository — verbatim, and never title-cased. It is the name in the
        lockup: the end of a site says which site, and the mark alone is a
        picture the reader has to already know. */
    product?: string;
    /** The mark, as the file it is drawn in. Same file the bar carries, and the
        same distinction: an SVG is referenced into the page and follows it into
        dark, anything else is linked. */
    signet?: string;
    /** Whose product it is, where that is a second name — the first half of the
        lockup, with the accent rule between the two. The bar's own form. */
    brand?: string;
    /** Whose it is and from when. A separate line from the note because it is a
        separate claim, and a footer that runs the two together reads as though
        the sentence were part of the notice. */
    copyright?: string;
    /** What has to travel with it: a licence, a version, a legal page. */
    meta?: readonly FooterLink[];
    /** Where else it lives — a repository, a chat, a feed. At the far end of the
        line, because they are the one thing in a footer a reader looks for by
        position rather than by reading. */
    marks?: readonly FooterLink[];
}
export declare class SdsFooter extends SdsElement {
    static properties: {
        groups: {
            type: ArrayConstructor;
        };
        note: {
            type: StringConstructor;
        };
        product: {
            type: StringConstructor;
        };
        signet: {
            type: StringConstructor;
        };
        brand: {
            type: StringConstructor;
        };
        copyright: {
            type: StringConstructor;
        };
        meta: {
            type: ArrayConstructor;
        };
        marks: {
            type: ArrayConstructor;
        };
    };
    groups: readonly FooterGroup[];
    note: string;
    product: string;
    signet: string;
    brand: string;
    copyright: string;
    meta: readonly FooterLink[];
    marks: readonly FooterLink[];
    constructor();
    private static link;
    private lockup;
    protected render(): TemplateResult;
}
