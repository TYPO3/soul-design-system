import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'sm';
export interface ButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    /** Omit for an icon-only button — which then requires `title`, because the
        icon is the whole control and nothing else names it. */
    label?: string;
    /** Sits before the label with the control gap. Direction icons are the one
        exception and follow it. */
    icon?: IconId;
    title?: string;
    disabled?: boolean;
}
export declare function buttonClass({ variant, size, label, disabled }: ButtonProps): string;
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
        label: {
            type: StringConstructor;
        };
        icon: {
            type: StringConstructor;
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
    label: string;
    icon?: IconId;
    disabled: boolean;
    constructor();
    protected render(): TemplateResult;
}
