import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface ChecksProps {
    /** `ok` draws the checks in the status green. Without it they take the ink of
        the text. */
    tone?: 'ok';
}
export declare class SdsChecks extends SdsElement {
    static properties: {
        tone: {
            type: StringConstructor;
        };
    };
    tone?: 'ok';
    private taken;
    connectedCallback(): void;
    protected render(): TemplateResult;
}
