/* sds-confval — one configuration value in a reference.

   Three things at once: the name a reader searches for, the facts a machine
   would check against, and prose that runs to whole blocks. So the name is
   mono and carries the anchor, the facts sit in a grid of their own where a
   long union type wraps without pushing the label out of line, and the
   description is ordinary paragraphs under both.

   A hairline above each entry and nothing around it: forty of these in a row
   are a reference and have to read as a list, and a box drawn round each one
   turns that list into forty cards. */

import { html, nothing, type TemplateResult } from 'lit';
import './badge.ts';
import { lines } from '../lib/template.ts';
import { define, SdsElement } from '../lib/element.ts';

export interface Fact {
  /** What the source called it — `type`, `default`, or an option of the
      author's own. It is set as a label and never title-cased: the value
      beside it is what the machine reads, and the key is what it is called. */
  label: string;
  value: string;
}

export interface ConfvalProps {
  /** The name being documented, verbatim. Mono at every size, like everything
      else the machine named. */
  name: string;
  /** Where a link to this value lands. Also what the mark beside the name
      points at, so a reader can take the address of one entry out of a page
      of forty without reading the source. */
  anchor?: string;
  /** Stated where it is true and left off where it is not: a reference of
      fifty values, half of them marked "optional", says nothing twice as
      loudly. */
  required?: boolean;
  /** What the value takes. Text rather than markup, because a type is written
      `array<string>` as often as not and anything parsing that as tags eats
      half of it. */
  type?: string;
  /** What happens if the reader leaves it alone. */
  default?: string;
  /** Anything else the source named, in the order it named it. */
  facts?: readonly Fact[];
  /** The description, where a caller has it as one string. Out of a document
      it is blocks and arrives between the tags instead. */
  body?: string | TemplateResult;
}

export class SdsConfval extends SdsElement {
  static override properties = {
    name: { type: String },
    anchor: { type: String },
    required: { type: Boolean, reflect: true },
    type: { type: String },
    default: { type: String },
    facts: { type: Array },
    body: { type: String },
  };

  declare name: string;
  declare anchor: string;
  declare required: boolean;
  declare type: string;
  declare default: string;
  declare facts: readonly Fact[];
  declare body: string | TemplateResult;

  /* What a caller wrote between the tags — see `SdsElement.lifted()`. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.name = '';
    this.anchor = '';
    this.required = false;
    this.type = '';
    this.default = '';
    this.facts = [];
    this.body = '';
  }

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  /** The two the directive names first, then whatever else the source set.
      Order is fixed rather than alphabetical: a reader comparing two entries
      compares them line by line. */
  private get stated(): Fact[] {
    return [
      ...(this.type ? [{ label: 'type', value: this.type }] : []),
      ...(this.default ? [{ label: 'default', value: this.default }] : []),
      ...this.facts,
    ];
  }

  private fact({ label, value }: Fact): TemplateResult {
    return html`<dt class="sds-label">${label}</dt>
      <dd class="sds-mono">${value}</dd>`;
  }

  protected override render(): TemplateResult {
    const facts = this.stated;
    /* The mark is `#` and not a glyph: it is the character an address is
       written with, it needs no sprite, and it is the one thing on the line
       that is already mono. */
    const mark = this.anchor
      ? html`<a class="sds-confval__mark" href="#${this.anchor}" aria-label="Link to ${this.name}">#</a>`
      : nothing;
    return html`<dl class="sds-confval">
  <dt class="sds-confval__term" id="${this.anchor || nothing}">
    <code class="sds-confval__name">${this.name}</code>
    ${this.required ? html`<sds-badge label="required"></sds-badge>` : nothing}
    ${mark}
  </dt>
  <dd class="sds-confval__detail">
    ${facts.length ? html`<dl class="sds-confval__facts">
      ${lines(facts.map((f) => this.fact(f)), 6)}
    </dl>` : nothing}
    <div class="sds-confval__body">${this.taken ?? this.content ?? this.body}</div>
  </dd>
</dl>`;
  }
}

define('sds-confval', SdsConfval);
