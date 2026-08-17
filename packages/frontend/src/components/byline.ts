/* sds-byline — who wrote it, and when.

   A component rather than a row a page assembles, because the order is the
   point: who, then what they are to the subject, then when. A page that puts
   the date first has published a date.

   The mark is initials, never a photograph — a face is a file to fetch, keep in
   step and hold a licence for, and none of that says who is answerable. */

import { html, type TemplateResult } from 'lit';
import { define, SdsElement } from '../lib/element.ts';

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

export class SdsByline extends SdsElement {
  static override properties = {
    name: { type: String },
    as: { type: String },
    meta: { type: String },
    initials: { type: String },
    href: { type: String },
    unmarked: { type: Boolean },
  };

  declare name: string;
  declare as: string;
  declare meta: string;
  declare initials: string;
  declare href: string;
  declare unmarked: boolean;

  constructor() {
    super();
    this.name = '';
    this.as = '';
    this.meta = '';
    this.initials = '';
    this.href = '';
    this.unmarked = false;
  }

  /** First letters of the first and last word — two at most. Three initials
      in a 32px circle is a monogram nobody can read. */
  private get mark(): string {
    if (this.initials) return this.initials;
    const words = this.name.trim().split(/\s+/).filter(Boolean);
    const first = words[0]?.[0] ?? '';
    const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';
    return (first + last).toUpperCase();
  }

  protected override render(): TemplateResult {
    const who = this.href ? html`<a class="sds-link" href="${this.href}">${this.name}</a>` : html`${this.name}`;
    return html`<div class="sds-byline">
  ${this.unmarked ? '' : html`<span class="sds-byline__mark" aria-hidden="true">${this.mark}</span>`}
  <div class="sds-byline__who">
    <span class="sds-byline__name">${who}${this.as ? html` <span class="sds-byline__role">· ${this.as}</span>` : ''}</span>
    ${this.meta ? html`<span class="sds-label">${this.meta}</span>` : ''}
  </div>
</div>`;
  }
}

define('sds-byline', SdsByline);
