import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export declare class SdsStep extends SdsElement {
    static properties: {
        /** What happens here, in one line. Spelt `heading` because that is the
            name of every title in this system. Not `title`, which is the global
            attribute a browser draws as a tooltip. */
        heading: {
            type: StringConstructor;
            reflect: boolean;
        };
        /** A stop a reader can skip. The disc stays unfilled and the word stands
            beside the title, because an empty ring says nothing out loud. */
        optional: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        /** Where a page links to this one stop. It lands on the stop itself: a step
            has no fold, so there is nothing to open first. */
        anchor: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    /** What this stop is, on the line beside its number. The rest goes between
        the tags. */
    heading: string;
    /** The disc stays unfilled and the word stands beside the title. Work a
        reader can skip and the run still succeeds. */
    optional: boolean;
    /** The id the stop answers to, so a page can link to an instruction by
        name. */
    anchor: string;
    /** What stood between the tags, taken before Lit renders over them. */
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
