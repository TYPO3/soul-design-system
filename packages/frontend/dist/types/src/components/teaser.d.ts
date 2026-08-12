import { type TemplateResult } from 'lit';
import './badge.ts';
import { SdsElement } from '../lib/element.js';
export interface TeaserProps {
    heading: string;
    /** The two lines that decide whether it is opened. Not the first two lines
        of the entry — a summary is written, not cut. */
    body: string | TemplateResult;
    href?: string;
    /** What kind of entry it is. A badge, because it is a fact about the entry
        rather than a result — no tone. */
    tag?: string;
    /** When, and anything else that belongs in the label register. */
    meta?: string;
    /** The picture. Named `src` because every element in this system that
        takes a file names it `src` — `sds-image`, `sds-figure`, `sds-embed`,
        `sds-lightbox` — and a component that is the odd one out is one an
        author has to look up rather than write. */
    src?: string;
    alt?: string;
}
export declare class SdsTeaser extends SdsElement {
    static properties: {
        heading: {
            type: StringConstructor;
        };
        body: {
            type: StringConstructor;
        };
        href: {
            type: StringConstructor;
        };
        tag: {
            type: StringConstructor;
        };
        meta: {
            type: StringConstructor;
        };
        src: {
            type: StringConstructor;
        };
        alt: {
            type: StringConstructor;
        };
    };
    heading: string;
    body: string | TemplateResult;
    href: string;
    tag: string;
    meta: string;
    src: string;
    alt: string;
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
