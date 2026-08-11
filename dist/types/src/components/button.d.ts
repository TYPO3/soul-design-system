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
    /** What pressing it does to a form around it.
  
        `button` by default, and that default is the whole reason this property
        exists: a `<button>` with no type inside a `<form>` is a submit button,
        so a filter, a toggle or a Cancel drawn with this element submits the
        form the moment it is pressed. The browser then also blocks the
        submission on the first invalid required field and moves the focus
        there — which is a page doing something nobody asked it to, decided by an
        attribute nobody wrote.
  
        A real submit says so. Then Enter in a text field submits too, which is
        the behaviour a form should have and only that button should carry. */
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
    private taken;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private readonly onPress;
    protected render(): TemplateResult;
}
