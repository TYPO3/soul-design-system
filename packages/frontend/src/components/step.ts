/* sds-step — one stop of an instruction, and the blocks that carry it out.

   The pair is the whole component, the way `sds-accordion-item` pairs a
   question with its answer. The title is a property because it fits in one.
   What a reader has to do goes between the tags — a paragraph, a command, a
   picture of what it looked like.

   The number is not here and cannot be. A stop's name is its place in the
   set, and the set is what keeps that. See `sds-steps`. */

import { html, nothing, type TemplateResult } from 'lit';
import { define, isBlank, SdsElement } from '../lib/element.ts';

export class SdsStep extends SdsElement {
  static override properties = {
    /** What happens here, in one line. Spelt `heading` because that is the
        name of every title in this system. Not `title`, which is the global
        attribute a browser draws as a tooltip. */
    heading: { type: String, reflect: true },
    /** A stop a reader can skip. The disc stays unfilled and the word stands
        beside the title, because an empty ring says nothing out loud. */
    optional: { type: Boolean, reflect: true },
    /** Where a page links to this one stop. It lands on the stop itself: a step
        has no fold, so there is nothing to open first. */
    anchor: { type: String, reflect: true },
  };

  /** What this stop is, on the line beside its number. The rest goes between
      the tags. */
  declare heading: string;
  /** The disc stays unfilled and the word stands beside the title. Work a
      reader can skip and the run still succeeds. */
  declare optional: boolean;
  /** The id the stop answers to, so a page can link to an instruction by
      name. */
  declare anchor: string;

  /** What stood between the tags, taken before Lit renders over them. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.heading = '';
    this.optional = false;
    this.anchor = '';
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isBlank(node));
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    /* Dropped rather than left empty where a stop has no title: an empty
       paragraph is the step's own gap drawn twice. */
    const title = this.heading
      ? html`<p class="sds-steps__title">${this.heading}${this.optional ? html`<span class="sds-label">Optional</span>` : ''}</p>`
      : '';
    /* `role` because the box the set draws is one generic away from this one —
       see `styles/components/steps.css` for why that rules `<ol>` out. */
    return html`<div
    class="sds-steps__step${this.optional ? ' sds-steps__step--optional' : ''}"
    role="listitem"
    id="${this.anchor || nothing}"
  >
    ${title}
    ${this.taken ?? this.content}
  </div>`;
  }
}

define('sds-step', SdsStep);
