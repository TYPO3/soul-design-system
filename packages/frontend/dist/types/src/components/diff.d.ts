import { type TemplateResult } from 'lit';
import './icon.ts';
import { type IconId } from './icon.js';
import { SdsElement } from '../lib/element.js';
export type DiffKind = 'context' | 'add' | 'del';
export interface DiffLine {
    kind: DiffKind;
    text: string;
}
export interface DiffProps {
    /** The file the diff is of — a path, so it sets in mono. */
    path: string;
    icon?: IconId;
    body: readonly DiffLine[];
}
export declare class SdsDiff extends SdsElement {
    static properties: {
        path: {
            type: StringConstructor;
            reflect: boolean;
        };
        icon: {
            type: StringConstructor;
        };
        body: {
            type: ArrayConstructor;
        };
    };
    path: string;
    icon?: IconId;
    body: readonly DiffLine[];
    constructor();
    private line;
    protected render(): TemplateResult;
}
