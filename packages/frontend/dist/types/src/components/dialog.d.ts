import { type TemplateResult } from 'lit';
import './icon.ts';
import { type ModalSize } from './modal.js';
import { SdsElement } from '../lib/element.js';
/** What kind of press the confirming button is: the work the question is for,
    or the one with no way back. */
export type DialogTone = 'primary' | 'danger';
export interface DialogProps {
    /** The question it asks, which is the whole reason it opened. */
    heading: string;
    /** What the reader needs to answer it. At `auto` a modal stops at
        `--measure-modal` because a reader reads what is in one, not looks at it. */
    body: string | TemplateResult;
    /** Rendered buttons. Ghost first, primary last — the destructive-free
        order the rest of the system reads in. */
    actions?: readonly TemplateResult[];
    /** The label of the button that answers yes, and the whole of what a
        confirmation needs. With it, the dialog draws its own pair and announces
        the press, so a question takes no script at all. */
    confirmLabel?: string;
    /** A glyph on that button, ahead of its label — the press that carries the
        consequence is the one worth marking. The way out stays a word: two
        marked buttons beside each other is a pair nothing distinguishes. */
    confirmIcon?: string;
    /** The way out, beside it. */
    cancelLabel?: string;
    /** What kind of press the confirming one is. */
    tone?: DialogTone;
    /** How much room it takes, in both directions. `auto` is the content's own
        width up to the reading measure. A named size is the same shape
        everywhere, which keeps every dialog in the system one family. */
    size?: ModalSize;
    /** A width of its own, where the question needs one — the exception the
        scale cannot answer, and the one place a dialog carries a number. */
    width?: number;
    /** If it stands over the page. It is a real `<dialog>`, so an open makes
        the rest inert and a close puts the focus back where it came from. */
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
        confirmLabel: {
            type: StringConstructor;
            attribute: string;
        };
        confirmIcon: {
            type: StringConstructor;
            attribute: string;
        };
        cancelLabel: {
            type: StringConstructor;
            attribute: string;
        };
        tone: {
            type: StringConstructor;
            reflect: boolean;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
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
    confirmLabel: string;
    confirmIcon: string;
    cancelLabel: string;
    tone: DialogTone;
    size: ModalSize;
    width: number;
    open: boolean;
    constructor();
    private get dialog();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private readonly onCommand;
    private readonly onClose;
    /** Open it modally: the platform makes the rest of the page inert, moves
        the focus in, and traps it until this closes. */
    show(): void;
    close(): void;
    /** Open it and settle on what the reader chose — `show()` for a caller that
        has to wait for the answer rather than hear about it. */
    ask(): Promise<boolean>;
    protected updated(): void;
    protected render(): TemplateResult;
    private foot;
}
