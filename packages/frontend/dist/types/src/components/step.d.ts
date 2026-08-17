import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export declare class SdsStep extends SdsElement {
    static properties: {
        /** What is done here, in one line. Spelt `heading` because that is what
            every title in this system is called, and not `title`, which is the
            global attribute a browser draws as a tooltip. */
        heading: {
            type: StringConstructor;
            reflect: boolean;
        };
        /** A stop that may be skipped. The disc is left unfilled and the word
            stands beside the title, because an empty ring says nothing out loud. */
        optional: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        /** Where a page links to this one stop. It lands on the stop itself: a step
            is not folded away, so there is nothing to open first. */
        anchor: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    heading: string;
    optional: boolean;
    anchor: string;
    /** What was written between the tags, taken before Lit renders over them. */
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
