import { type TemplateResult } from 'lit';
import './badge.ts';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
/** The state of what a card stands for, in the signs of the drawings. */
export type CardSign = 'yes' | 'partly' | 'no' | 'unknown';
export interface CardProps {
    /** The name of the entry. The whole card links to it, so this is the line
        a reader chooses by. */
    heading: string;
    /** What is behind the title. Blocks out of a document, a sentence out of a
        property — both land in the same part. */
    body: string | TemplateResult;
    /** Where the card goes. The frame is the link, not a control inside it —
        there is nothing else on a card to press. */
    href?: string;
    /** The picture. Named `src` because everything in this system that takes a
        file names it `src`. */
    src?: string;
    /** What the picture shows, for a reader who does not get it. Empty where
        it carries nothing the heading has not already said. */
    alt?: string;
    /** The tracked-out line over the title: the name or number of a set of
        cards — `CHAPTER 02`, `FOR EDITORS`. Or the entry's date, which is the
        same register and the same line. */
    label?: string;
    /** What kind of entry it is. A badge, because it is a fact about the entry
        rather than a result — no tone. It shares the line with the label. */
    tag?: string;
    /** A glyph above the label, where a set tells its cards apart at a glance. */
    icon?: IconId;
    /** The state of what the card stands for, measured: `yes`, `partly`, `no`
        or `unknown`. The sign the drawings use for it, at the end of the label
        line, and its meaning in words for a reader who hears it. */
    sign?: CardSign;
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
        sign: {
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
    sign?: CardSign;
    footer: string;
    action: string;
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
