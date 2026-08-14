import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'sm' | 'lg';
export interface ButtonProps {
    variant?: ButtonVariant;
    /** `sm` for a control inside another surface, `lg` for the one action a
        screen is for — a landing's single call, never a row of them. */
    size?: ButtonSize;
    /** No label at all — the icon is the whole control, which then requires
        `title`, because nothing else names it. */
    iconOnly?: boolean;
    title?: string;
    disabled?: boolean;
    /** What pressing it does to a form around it. `button` by default, which is
        the whole reason the property exists: a `<button>` with no type inside a
        `<form>` submits it, so a filter or a Cancel drawn with this element sends
        the form the moment it is pressed. A real submit says so — and then Enter
        in a text field submits too, which only that button should carry. */
    type?: 'button' | 'submit' | 'reset';
    /** Where it goes, for the press that is a link rather than an action. It
        renders an `<a>` and nothing else changes: same classes, same shape, and
        the browser's own middle-click, hover target and status line, none of
        which a `<button>` with a handler on it has. */
    href?: string;
    /** What that link is to this page — `prev`, `next`, `external`. Only with
        `href`, being the anchor's own attribute. */
    rel?: string;
}
export declare function buttonClass({ variant, size, iconOnly, disabled }: ButtonProps): string;
/** The label as the one node it is.

    `.sds-btn` is a flex row, so a word and a version in mono written beside
    each other become two items placed by their boxes — and two faces never
    centre onto one baseline, at any size or leading. In one item they share a
    line box and are aligned as the text they are. */
export declare const buttonLabel: (body: unknown) => TemplateResult;
/** The markup a button is, given whatever stands inside it. */
export declare function buttonMarkup(props: ButtonProps, body: unknown): TemplateResult;
/** What a press asks of something else on the page.

    `source` is the button, because a handler that hears the command usually
    needs to know where it came from — which of three buttons was pressed, and
    where the focus goes back to. */
export interface SdsCommand {
    command: string;
    source: Element;
}
export declare class SdsButton extends SdsElement {
    static properties: {
        variant: {
            type: StringConstructor;
            reflect: boolean;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
        title: {
            type: StringConstructor;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        type: {
            type: StringConstructor;
            reflect: boolean;
        };
        href: {
            type: StringConstructor;
        };
        rel: {
            type: StringConstructor;
        };
        for: {
            type: StringConstructor;
            reflect: boolean;
        };
        command: {
            type: StringConstructor;
            reflect: boolean;
        };
        iconOnly: {
            type: BooleanConstructor;
            attribute: string;
            reflect: boolean;
        };
    };
    variant: ButtonVariant;
    size: ButtonSize;
    disabled: boolean;
    type: 'button' | 'submit' | 'reset';
    /** Where it goes, where the press is a link rather than an action. */
    href: string;
    rel: string;
    /** The id of what this button acts on — the label element's spelling for the
        same relationship, and the one a reader of the markup already knows. */
    for: string;
    /** What it asks of it. `show` unless something else is written, since a
        button pointed at a viewer or a dialog is almost always the one that
        opens it. */
    command: string;
    /** That the label is one glyph and the button is the square. Inferred where
        the label can be read, which it cannot be when it arrives as markup rather
        than nodes — see `SdsElement`, and a button that loses its shape there is
        a round control gone rectangular in a bar. So a caller can also say it. */
    iconOnly: boolean;
    private taken;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private readonly onPress;
    protected render(): TemplateResult;
}
