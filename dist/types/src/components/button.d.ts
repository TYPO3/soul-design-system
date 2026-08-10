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
}
export declare function buttonClass({ variant, size, iconOnly, disabled }: ButtonProps): string;
/** The markup a button is, given whatever stands inside it. */
export declare function buttonMarkup(props: ButtonProps, body: unknown): TemplateResult;
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
    };
    variant: ButtonVariant;
    size: ButtonSize;
    disabled: boolean;
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
