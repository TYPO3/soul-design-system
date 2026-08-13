import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface BylineProps {
    name: string;
    /** What they are to the subject — a maintainer, a reviewer, a team.
        The attribute is `as` and not `role`, and that is not a preference:
        `role` is the global ARIA attribute, so `role="maintainer"` told every
        screen reader the element had a role by that name — which does not exist,
        and axe says so. Same collision `sds-note` renamed `title` for. */
    as?: string;
    /** When, and anything else in the label register: a release, a reading
        time, a revision. */
    meta?: string;
    /** Their initials. Taken from the name when it is not given. */
    initials?: string;
}
export declare class SdsByline extends SdsElement {
    static properties: {
        name: {
            type: StringConstructor;
        };
        as: {
            type: StringConstructor;
        };
        meta: {
            type: StringConstructor;
        };
        initials: {
            type: StringConstructor;
        };
    };
    name: string;
    as: string;
    meta: string;
    initials: string;
    constructor();
    /** First letters of the first and last word — two at most. Three initials
        in a 32px circle is a monogram nobody can read. */
    private get mark();
    protected render(): TemplateResult;
}
