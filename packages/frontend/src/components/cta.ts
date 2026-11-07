/* sds-cta — the one thing a reader can do next, said in full.

   A heading says what the reader gets, a line says what it costs, and the
   press starts it. One primary per view holds here too, so a page has one of
   these. A way into a chapter is `sds-card`, and a set of ways is a set of
   cards.

   Every press is a link: an action with nowhere to go is not a call. So an
   `action` with no `href` draws no button, and a `second` needs a first. */

import { html, type TemplateResult } from 'lit';
import { buttonLabel, buttonMarkup } from './button.ts';
import './icon.ts';
import { type IconId } from './icon.ts';
import { define, isBlank, SdsElement } from '../lib/element.ts';

export interface CtaProps {
  /** What the reader gets, as a claim and not as a command: `Your first site
      in ten minutes`. The press says the command. */
  heading: string;
  /** The line under the heading: what the step costs or asks for. The same
      line can stand between the tags, where it carries a link. */
  body?: string;
  /** The press, in words: `Publish a first site`. A verb first, and never
      `Click here`, because a reader who hears the links hears only this. */
  action: string;
  /** Where the press goes. Without it the element draws no button. */
  href: string;
  /** A glyph in front of the press. */
  icon?: IconId;
  /** The way for a reader who is not ready: `Read the example`. Quieter than
      the press, and only beside one. */
  second?: string;
  /** Where the second press goes. Written `second-href`. */
  secondHref?: string;
}

export class SdsCta extends SdsElement {
  static override properties = {
    heading: { type: String },
    body: { type: String },
    action: { type: String },
    href: { type: String },
    icon: { type: String },
    second: { type: String },
    secondHref: { type: String, attribute: 'second-href' },
  };

  declare heading: string;
  declare body: string;
  declare action: string;
  declare href: string;
  declare icon?: IconId;
  declare second: string;
  declare secondHref: string;

  /* The line as a caller wrote it, taken before Lit renders over it. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.heading = '';
    this.body = '';
    this.action = '';
    this.href = '';
    this.second = '';
    this.secondHref = '';
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  private presses(): TemplateResult | string {
    if (!this.action || !this.href) return '';
    const label = this.icon
      ? html`<sds-icon name="${this.icon}"></sds-icon>${buttonLabel(this.action)}`
      : this.action;
    const first = buttonMarkup({ variant: 'primary', size: 'lg', href: this.href }, label);
    const second = this.second && this.secondHref
      ? buttonMarkup({ variant: 'secondary', href: this.secondHref }, this.second)
      : '';
    return html`<div class="sds-cta__actions">${first}${second}</div>`;
  }

  protected override render(): TemplateResult {
    const written = this.taken ?? this.content;
    const line = written
      ? html`<div class="sds-cta__body">${written}</div>`
      : this.body
        ? html`<p class="sds-cta__body">${this.body}</p>`
        : '';
    return html`<section class="sds-cta">
  <div class="sds-cta__text">
    ${this.heading ? html`<h3 class="sds-cta__title">${this.heading}</h3>` : ''}
    ${line}
  </div>
  ${this.presses()}
</section>`;
  }
}

define('sds-cta', SdsCta);
