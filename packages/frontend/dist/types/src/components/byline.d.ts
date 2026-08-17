import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface BylineProps {
    /** Who it is. The monogram is built from this unless `initials` says
        otherwise. */
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
    /** Where the name leads — a profile, or the source it is attributed to. */
    href?: string;
    /** No monogram. For an attribution that is not a person: a document, a
        release note, a file. Initials derived from a filename are a person
        invented for a source that has none. */
    unmarked?: boolean;
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
        href: {
            type: StringConstructor;
        };
        unmarked: {
            type: BooleanConstructor;
        };
    };
    name: string;
    as: string;
    meta: string;
    initials: string;
    href: string;
    unmarked: boolean;
    constructor();
    /** First letters of the first and last word — two at most. Three initials
        in a 32px circle is a monogram nobody can read. */
    private get mark();
    protected render(): TemplateResult;
}
