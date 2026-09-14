import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm' | 'lg';
export interface ButtonProps {
    /** What kind of press it is. `primary` starts the work the view is for.
        `secondary` stands beside it. `ghost` belongs in a bar or a head, where a
        filled box is one weight too many. `danger` is the press with no way
        back. */
    variant?: ButtonVariant;
    /** `sm` for a control inside another surface, `lg` for the one action a
        screen is for — a landing's single call, never a row of them. */
    size?: ButtonSize;
    /** No label at all — the icon is the whole control, which then needs
        `title`, because nothing else names it. */
    iconOnly?: boolean;
    /** The tooltip, and the accessible name where the label cannot carry it.
        A must with `icon-only`, because a glyph names nothing on its own. */
    title?: string;
    /** The real attribute, so the pointer, the keyboard and a screen reader
        all agree that it takes no press. Never a class that only looks it. */
    disabled?: boolean;
    /** What a press does to a form around it. `button` by default, which is
        the whole reason the property exists. A `<button>` with no type inside a
        `<form>` submits it, so a Cancel drawn with this element sends the form.
        A real submit says so — and then Enter in a text field submits too,
        which only that button must carry. */
    type?: 'button' | 'submit' | 'reset';
    /** Where it goes, for the press that is a link rather than an action. It
        renders an `<a>` and nothing else changes: same classes, same shape. The
        browser adds its own middle-click, hover target and status line, which
        a `<button>` with a handler has none of. */
    href?: string;
    /** What that link is to this page — `prev`, `next`, `external`. Only with
        `href`, being the anchor's own attribute. */
    rel?: string;
}
export declare function buttonClass({ variant, size, iconOnly, disabled }: ButtonProps): string;
/** The label as the one node it is.

    `.sds-btn` is a flex row, so a word and a version in mono beside each
    other become two items placed by their boxes. Two faces never centre onto
    one baseline that way, at any size or leading. In one item they share a
    line box and align as the text they are. */
export declare const buttonLabel: (body: unknown) => TemplateResult;
/** The markup a button is, given whatever stands inside it. */
export declare function buttonMarkup(props: ButtonProps, body: unknown): TemplateResult;
/** What a press asks of something else on the page.

    `source` is the button. A handler that hears the command usually needs
    to know where it came from: which of three buttons, and where the focus
    goes back to. */
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
    /** The id of what this button acts on — the label element's spelling for
        the same relationship, which a reader of the markup already knows. */
    for: string;
    /** What it asks of it. `show` unless a caller says otherwise, since a
        button pointed at a viewer or a dialog is almost always the one that
        opens it. */
    command: string;
    /** That the label is one glyph and the button is the square. Inferred from
        the label where it arrives as nodes. As markup it cannot be — see
        `SdsElement` — and a button that loses its shape there is a round
        control gone rectangular in a bar. So a caller can also say it. */
    iconOnly: boolean;
    private taken;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private readonly onPress;
    protected render(): TemplateResult;
}
