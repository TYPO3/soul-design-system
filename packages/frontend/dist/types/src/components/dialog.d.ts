import { type TemplateResult } from 'lit';
import './icon.ts';
import './button.ts';
import { SdsElement } from '../lib/element.js';
export interface DialogProps {
    heading: string;
    body: string | TemplateResult;
    /** Rendered buttons. Ghost first, primary last — the destructive-free
        order the rest of the system reads in. */
    actions?: readonly TemplateResult[];
    width?: number;
    open?: boolean;
}
export declare class SdsDialog extends SdsElement {
    static properties: {
        heading: {
            type: StringConstructor;
        };
        body: {
            type: StringConstructor;
        };
        actions: {
            type: ArrayConstructor;
        };
        width: {
            type: NumberConstructor;
            reflect: boolean;
        };
        open: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    heading: string;
    body: string | TemplateResult;
    actions: readonly TemplateResult[];
    width: number;
    open: boolean;
    constructor();
    private get dialog();
    /** Open it modally: the platform makes the rest of the page inert, moves
        the focus in, and traps it until this closes. */
    show(): void;
    close(): void;
    protected updated(): void;
    protected render(): TemplateResult;
}
