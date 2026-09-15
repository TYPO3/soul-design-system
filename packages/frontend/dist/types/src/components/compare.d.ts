import { type TemplateResult } from 'lit';
import './figure.ts';
import { SdsElement } from '../lib/element.js';
/** One half: a picture and its claim. */
export interface Half {
    src: string;
    alt: string;
    caption?: string;
}
export interface CompareProps {
    before: Half;
    after: Half;
    /** The word over the first half. */
    beforeLabel?: string;
    /** The word over the second half. */
    afterLabel?: string;
    /** A press opens either picture at its own size. */
    zoomable?: boolean;
}
export declare class SdsCompare extends SdsElement {
    static properties: {
        beforeSrc: {
            type: StringConstructor;
            attribute: string;
        };
        beforeAlt: {
            type: StringConstructor;
            attribute: string;
        };
        beforeCaption: {
            type: StringConstructor;
            attribute: string;
        };
        afterSrc: {
            type: StringConstructor;
            attribute: string;
        };
        afterAlt: {
            type: StringConstructor;
            attribute: string;
        };
        afterCaption: {
            type: StringConstructor;
            attribute: string;
        };
        beforeLabel: {
            type: StringConstructor;
            attribute: string;
        };
        afterLabel: {
            type: StringConstructor;
            attribute: string;
        };
        zoomable: {
            type: BooleanConstructor;
        };
    };
    beforeSrc: string;
    beforeAlt: string;
    beforeCaption: string;
    afterSrc: string;
    afterAlt: string;
    afterCaption: string;
    beforeLabel: string;
    afterLabel: string;
    zoomable: boolean;
    constructor();
    private half;
    protected render(): TemplateResult;
}
