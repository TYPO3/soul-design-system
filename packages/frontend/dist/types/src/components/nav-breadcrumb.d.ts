import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
/** One step of the trail. The last one wants no `href` — it is this page. */
export interface Crumb {
    label: string;
    href?: string;
}
export interface CrumbsProps {
    /** The trail, from the root to the page being read — set from script,
        being a list. The last entry is the page itself and is not a link. */
    items: readonly Crumb[];
    /** What the trail is called for a reader who cannot see it is one. */
    label?: string;
}
export declare class SdsNavBreadcrumb extends SdsElement {
    static properties: {
        items: {
            type: ArrayConstructor;
        };
        label: {
            type: StringConstructor;
        };
    };
    items: readonly Crumb[];
    label: string;
    constructor();
    protected render(): TemplateResult;
}
