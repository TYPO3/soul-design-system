import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'sm';
export interface ButtonProps {
    variant?: ButtonVariant;
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
}
export declare function buttonClass({ variant, size, iconOnly, disabled }: ButtonProps): string;
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
    /** The id of what this button acts on — the same spelling `sds-menu` uses
        for the navigation it opens, because it is the same relationship. */
    for: string;
    /** What it asks of it. `show` unless something else is written, since a
        button pointed at a viewer, a dialog or a drawer is almost always the one
        that opens it. */
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
