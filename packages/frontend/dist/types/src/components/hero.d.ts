import { type TemplateResult } from 'lit';
import './eyebrow.ts';
import './figure.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
export type HeroAlign = 'start' | 'center' | 'end';
export type HeroLeads = 'start' | 'end';
export interface HeroProps {
    /** The claim, as the `h1` of the page. */
    heading?: string;
    /** The line over the title: what kind of page this is. */
    eyebrow?: string;
    /** The sentence under the title. */
    lead?: string;
    /** The press, in words. Without `href` no button draws. */
    action?: string;
    /** Where the press goes. */
    href?: string;
    /** A glyph in front of the press. */
    icon?: IconId;
    /** The quieter way beside the press. Written `second-href` for its target. */
    second?: string;
    secondHref?: string;
    /** The picture. Without it the copy stands alone. */
    src?: string;
    /** What the picture shows. Empty for decoration. */
    alt?: string;
    /** Where the copy and the picture stand against each other, top to foot.
        Not `align`: a browser reads that attribute as `text-align` on any host. */
    valign?: HeroAlign;
    /** Which half comes first once the two have stacked. */
    leads?: HeroLeads;
}
export declare class SdsHero extends SdsElement {
    static properties: {
        heading: {
            type: StringConstructor;
        };
        eyebrow: {
            type: StringConstructor;
        };
        lead: {
            type: StringConstructor;
        };
        action: {
            type: StringConstructor;
        };
        href: {
            type: StringConstructor;
        };
        icon: {
            type: StringConstructor;
        };
        second: {
            type: StringConstructor;
        };
        secondHref: {
            type: StringConstructor;
            attribute: string;
        };
        src: {
            type: StringConstructor;
        };
        alt: {
            type: StringConstructor;
        };
        valign: {
            type: StringConstructor;
        };
        leads: {
            type: StringConstructor;
        };
    };
    heading: string;
    eyebrow: string;
    lead: string;
    action: string;
    href: string;
    icon?: IconId;
    second: string;
    secondHref: string;
    src: string;
    alt: string;
    valign: HeroAlign;
    leads: HeroLeads;
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
