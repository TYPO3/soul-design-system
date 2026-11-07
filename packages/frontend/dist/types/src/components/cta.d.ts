import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
export interface CtaProps {
    /** What the reader gets, as a claim and not as a command: `Your first site
        in ten minutes`. The press says the command. */
    heading: string;
    /** The line under the heading: what the step costs or asks for. The same
        line can stand between the tags, where it carries a link. */
    body?: string;
    /** The press, in words: `Publish a first site`. A verb first, and never
        `Click here`, because a reader who hears the links hears only this. */
    action: string;
    /** Where the press goes. Without it the element draws no button. */
    href: string;
    /** A glyph in front of the press. */
    icon?: IconId;
    /** The way for a reader who is not ready: `Read the example`. Quieter than
        the press, and only beside one. */
    second?: string;
    /** Where the second press goes. Written `second-href`. */
    secondHref?: string;
}
/** The press and the quieter way, in the one form a page states them.
    `sds-hero` draws the same two. */
export declare function pressRow({ action, href, icon, second, secondHref }: Pick<CtaProps, 'action' | 'href' | 'icon' | 'second' | 'secondHref'>, cls: string): TemplateResult | string;
export declare class SdsCta extends SdsElement {
    static properties: {
        heading: {
            type: StringConstructor;
        };
        body: {
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
    };
    heading: string;
    body: string;
    action: string;
    href: string;
    icon?: IconId;
    second: string;
    secondHref: string;
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
