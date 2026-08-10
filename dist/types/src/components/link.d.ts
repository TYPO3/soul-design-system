import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export interface LinkProps {
    label: string;
    href?: string;
    /** Opens away from this surface: gets the glyph, and says so to the
        browser as well as to the eye. */
    external?: boolean;
}
export declare class SdsLink extends SdsElement {
    static properties: {
        label: {
            type: StringConstructor;
        };
        href: {
            type: StringConstructor;
            reflect: boolean;
        };
        external: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    label: string;
    href: string;
    external: boolean;
    constructor();
    protected render(): TemplateResult;
}
