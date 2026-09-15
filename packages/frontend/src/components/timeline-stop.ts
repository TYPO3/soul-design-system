/* sds-timeline-stop — one stop of a plan: when, what, and what it holds.

   The pair is the whole component, the way `sds-step` pairs a stop with its
   blocks. The date and the title are properties because each fits in one.
   What the stop holds goes between the tags: a sentence, the blocks a plan
   needs, and the stops inside it as more of these.

   The state is not the stop's to say. Where it stands against the one
   marked now is a reading of the whole order, and `sds-timeline` writes it
   here. So a stop on its own reads as ahead. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { lines } from '../lib/template.ts';
import { define, isBlank, SdsElement } from '../lib/element.ts';

/** What a stop is against the one the plan is at. */
export type TimelineState = 'passed' | 'now' | 'ahead';

/** The mark each state draws, and what it says out loud. The same glyphs
    `sds-run` gives a stop, so a plan and a run read the same way. */
const MARKS: Record<TimelineState, { icon: string; said: string }> = {
  passed: { icon: 'actions-check-circle', said: 'Done' },
  now: { icon: 'actions-circle-full', said: 'Now' },
  ahead: { icon: 'actions-circle', said: 'Ahead' },
};

/** One stop with its state, as the plan hands it down where the stops are
    data: the form a static render can take. */
export interface PlacedStop {
  when: string;
  heading: string;
  now: boolean;
  state: TimelineState;
  body?: unknown;
  stops: readonly PlacedStop[];
}

/** A stop as the plan writes it from data, with the stops inside it as its
    own. Never children between the tags: a static render has no
    `connectedCallback` to move them. */
export const stopTemplate = (stop: PlacedStop): TemplateResult =>
  html`<sds-timeline-stop when="${stop.when}" heading="${stop.heading}" ?now="${stop.now}" state="${stop.state}" .content="${stop.body ?? ''}" .stops="${stop.stops}"></sds-timeline-stop>`;

export class SdsTimelineStop extends SdsElement {
  static override properties = {
    /** When, as the plan says it: `2026-09-30`, `Sprint 2`, `Q1`. Text
        nothing parses. */
    when: { type: String, reflect: true },
    /** What happens here, in one line. `heading`, the name of every title
        here. */
    heading: { type: String, reflect: true },
    /** The stop the plan is at. One per plan; the stops before it have
        passed, the ones after it lie ahead. */
    now: { type: Boolean, reflect: true },
    /** What this stop is against the one marked now. The plan writes it;
        a page does not. */
    state: { type: String, reflect: true },
    /** The stops inside this one, where the plan renders from data. Between
        the tags otherwise, as more of these. */
    stops: { type: Array },
  };

  declare when: string;
  declare heading: string;
  declare now: boolean;
  declare state: TimelineState;
  declare stops: readonly PlacedStop[];

  /** What stood between the tags, taken before Lit renders over it: the
      stops inside this one, and the blocks that are its own. */
  private under: Element[] | null = null;
  private body: Node[] | null = null;

  constructor() {
    super();
    this.when = '';
    this.heading = '';
    this.now = false;
    this.state = 'ahead';
    this.stops = [];
  }

  override connectedCallback(): void {
    const written = this.lifted().filter((node) => !isBlank(node));
    const under = written.filter((node): node is Element => node.nodeType === 1 && (node as Element).tagName.toLowerCase() === 'sds-timeline-stop');
    const body = written.filter((node) => !under.includes(node as Element));
    if (under.length) this.under = under;
    if (body.length) this.body = body;
    super.connectedCallback();
  }

  /** The mark says its state out loud, and the word beside the title says
      it again for the one that is now. `aria-current="step"` on that one.
      `role` because the box the plan draws is one generic away from this
      one, as with a step. */
  protected override render(): TemplateResult {
    const state = MARKS[this.state] ? this.state : 'ahead';
    const mark = MARKS[state];
    const body = this.body ?? this.content;
    const under = this.under ?? this.stops.map((stop) => stopTemplate(stop));
    return html`<div role="listitem" class="sds-timeline__stop sds-timeline__stop--${state}" aria-current="${state === 'now' ? 'step' : nothing}">
    <span class="sds-timeline__mark"><sds-icon name="${mark.icon}" label="${mark.said}"></sds-icon></span>
    <p class="sds-timeline__when">${this.when}</p>
    <p class="sds-timeline__title">${this.heading}${state === 'now' ? html`<span class="sds-label">Now</span>` : nothing}</p>
    ${body ? html`<div class="sds-timeline__body">${body}</div>` : nothing}
    ${under.length
      ? html`<div class="sds-timeline__list" role="list">
      ${lines(under, 6)}
    </div>`
      : nothing}
  </div>`;
  }
}

define('sds-timeline-stop', SdsTimelineStop);
