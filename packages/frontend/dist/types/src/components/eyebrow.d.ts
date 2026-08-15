import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface EyebrowProps {
    label: string;
}
export declare class SdsEyebrow extends SdsElement {
    static properties: {
        label: {
            type: StringConstructor;
        };
    };
    label: string;
    constructor();
    protected render(): TemplateResult;
}
