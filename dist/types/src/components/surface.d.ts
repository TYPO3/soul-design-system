import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
/** `card` is a hairline and 6px with no fill — the default container.
    `panel` is a raised fill, for when it sits on the canvas and has to read
    as a plane. `sunken` is machine output: code, logs, structured content. */
export type Plane = 'card' | 'panel' | 'sunken';
export interface SurfaceProps {
    plane?: Plane;
    title: string;
    body: string | TemplateResult;
    style?: string;
}
export declare class SdsSurface extends SdsElement {
    static properties: {
        plane: {
            type: StringConstructor;
            reflect: boolean;
        };
        heading: {
            type: StringConstructor;
        };
        body: {
            type: StringConstructor;
        };
        boxStyle: {
            type: StringConstructor;
            attribute: string;
        };
    };
    plane: Plane;
    heading: string;
    body: string | TemplateResult;
    boxStyle: string;
    constructor();
    protected render(): TemplateResult;
}
