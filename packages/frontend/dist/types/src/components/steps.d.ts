import { type TemplateResult } from 'lit';
import './step.ts';
import { SdsElement } from '../lib/element.js';
/** One stop, where a page has its instruction as data rather than as markup. */
export interface Step {
    heading: string;
    body: string | TemplateResult;
    optional?: boolean;
    /** Where a page links to this one stop. See `sds-step`. */
    anchor?: string;
}
export interface StepsProps {
    /** The stops, where a page holds them as data. An instruction whose stops are
        blocks — what a documentation renderer hands over — is written between the
        tags as `sds-step` instead, and then this stays empty. */
    steps: readonly Step[];
}
export declare class SdsSteps extends SdsElement {
    static properties: {
        steps: {
            type: ArrayConstructor;
        };
    };
    steps: readonly Step[];
    /** The stops written between the tags, for content that is blocks rather than
        a string a property can hold. Taken before Lit renders over them. */
    private taken;
    constructor();
    connectedCallback(): void;
    protected render(): TemplateResult;
}
