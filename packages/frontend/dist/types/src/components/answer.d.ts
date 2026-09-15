import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export declare class SdsAnswer extends SdsElement {
    static properties: {
        /** Its letter or number, as the paper cites it: `A`. */
        key: {
            type: StringConstructor;
            reflect: boolean;
        };
        /** What it is, in one line. `heading`, the name of every title here. */
        heading: {
            type: StringConstructor;
            reflect: boolean;
        };
        /** The one the paper recommends. The word after its name says it,
            and nothing else on the row changes. */
        recommended: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        /** The one the decision took. The word after the name, the disc
            around the letter, and the block reads it for the voice at its foot. */
        decided: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    key: string;
    heading: string;
    recommended: boolean;
    decided: boolean;
    /** What stood between the tags, taken before Lit renders over them. */
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
