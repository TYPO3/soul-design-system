import { type TemplateResult } from 'lit';
import './icon.ts';
import { SdsElement } from '../lib/element.js';
export type ModalSize = 'auto' | 'sm' | 'md' | 'lg';
/** The classes a surface of that size is.

    A size is a shape rather than a width: it says how wide the surface is and
    how tall it may get, after which the body is what scrolls. Named rather than
    interpolated — a word this layer has no size for would become a class
    nothing defines. */
export declare const modalClass: (size: ModalSize) => string;
export declare class SdsModal extends SdsElement {
    static properties: {
        heading: {
            type: StringConstructor;
        };
        body: {
            type: StringConstructor;
        };
        /** Rendered buttons. Ghost first, primary last — the destructive-free
            order the rest of the system reads in. */
        actions: {
            type: ArrayConstructor;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
        width: {
            type: NumberConstructor;
            reflect: boolean;
        };
    };
    /** What the surface is about, at the top of it. */
    heading: string;
    /** What the reader has to take in. At `auto` it stops at `--measure-modal`,
        because what is in a modal is read. */
    body: string | TemplateResult;
    /** The controls along the bottom, set from script — being markup, which an
        attribute cannot carry. */
    actions: readonly TemplateResult[];
    /** How much room it takes, in both directions. `auto` is the content's own
        width up to the reading measure; the named sizes are the same shape
        wherever they are used, which is what keeps a system's surfaces one
        family. */
    size: ModalSize;
    /** A width of its own where the content needs one — the exception the scale
        cannot answer, and the one place a modal carries a number. */
    width: number;
    constructor();
    protected render(): TemplateResult;
}
