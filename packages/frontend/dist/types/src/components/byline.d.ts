import { type TemplateResult } from 'lit';
import { SdsElement } from '../lib/element.js';
export interface BylineProps {
    /** Who it is. The monogram comes from this unless `initials` says
        otherwise. */
    name: string;
    /** What they are to the subject — a maintainer, a reviewer, a team. The
        attribute is `as` and not `role`, and that is not a preference. `role`
        is the global ARIA attribute, so `role="maintainer"` claims a role by
        that name, which does not exist, and axe says so. Same collision
        `sds-note` renamed `title` for. */
    as?: string;
    /** When, and anything else in the label register: a release, a reading
        time, a revision. */
    meta?: string;
    /** Their initials. Taken from the name when a caller gives none. */
    initials?: string;
    /** Where the name leads — a profile, or the source it stands for. */
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
        in a mark the size of a control is a monogram nobody can read. */
    private get mark();
    protected render(): TemplateResult;
}
