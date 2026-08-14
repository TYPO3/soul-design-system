import { type TemplateResult } from 'lit';
import './badge.ts';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
export interface CardProps {
    heading: string;
    /** What is behind the title. Blocks out of a document, a sentence out of a
        property — both land in the same part. */
    body: string | TemplateResult;
    href?: string;
    /** The picture. Named `src` because everything in this system that takes a
        file names it `src`. */
    src?: string;
    alt?: string;
    /** The tracked-out line over the title: what a set of cards is named or
        numbered as — `CHAPTER 02`, `FOR EDITORS` — or when the entry is from,
        which is the same register and the same line. */
    label?: string;
    /** What kind of entry it is. A badge, because it is a fact about the entry
        rather than a result — no tone. It shares the line with the label. */
    tag?: string;
    /** A glyph above the label, where a set is told apart before it is read. */
    icon?: IconId;
    /** One line under a hairline: what the reader gets there, who it is for,
        what state it is in. A label register, so it does not compete. */
    footer?: string;
    /** The call to action, in words — `Read the chapter`. Not a button and not a
        second link: the whole card already goes there, so this is the line that
        says so. */
    action?: string;
}
export declare class SdsCard extends SdsElement {
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
        src: {
            type: StringConstructor;
        };
        alt: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        tag: {
            type: StringConstructor;
        };
        icon: {
            type: StringConstructor;
        };
        footer: {
            type: StringConstructor;
        };
        action: {
            type: StringConstructor;
        };
    };
    heading: string;
    body: string | TemplateResult;
    href: string;
    src: string;
    alt: string;
    label: string;
    tag: string;
    icon?: IconId;
    footer: string;
    action: string;
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
