import { type TemplateResult } from 'lit';
import './icon.ts';
import './button.ts';
import { SdsElement } from '../lib/element.js';
export interface DialogProps {
    /** The question it asks, which is the whole reason it opened. */
    heading: string;
    /** What the reader needs in order to answer it. A modal stops at
        `--measure-modal` because what is in one is read rather than looked at. */
    body: string | TemplateResult;
    /** Rendered buttons. Ghost first, primary last — the destructive-free
        order the rest of the system reads in. */
    actions?: readonly TemplateResult[];
    /** A width of its own, where the question needs one. Otherwise the measure
        decides, which is what keeps every dialog in the system the same shape. */
    width?: number;
    /** Whether it stands over the page. It is a real `<dialog>`, so opening
        makes the rest inert and closing puts the focus back where it came
        from. */
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
