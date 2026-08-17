/* sds-steps — an instruction read from the top, numbered down one rail.

   For work that has an order: the numbers are the claim that step two follows
   step one, and a set of things to do in any order is a list instead. What each
   stop holds is whatever it takes to do it — a command, a file to edit, the
   output that says it worked — which is why a stop's content goes between its
   tags and not into a property.

   A list said in ARIA rather than as `<ol>`, so a reader is told how many stops
   there are and which one this is; `styles/components/steps.css` carries why the
   markup cannot be the platform's own. */

import { html, nothing, type TemplateResult } from 'lit';
import './step.ts';
import { define, SdsElement } from '../lib/element.ts';

/** One stop, where a page has its instruction as data rather than as markup. */
export interface Step {
  heading: string;
  body: string | TemplateResult;
  optional?: boolean;
  /** Where a page links to this one stop. See `sds-step`. */
  anchor?: string;
}

export interface StepsProps {
  /** The stops, where a page holds them as data. An instruction whose stops are
      blocks — what a documentation renderer hands over — is written between the
      tags as `sds-step` instead, and then this stays empty. */
  steps: readonly Step[];
}

export class SdsSteps extends SdsElement {
  static override properties = {
    steps: { type: Array },
  };

  declare steps: readonly Step[];

  /** The stops written between the tags, for content that is blocks rather than
      a string a property can hold. Taken before Lit renders over them. */
  private taken: Node[] | null = null;

  constructor() {
    super();
    this.steps = [];
  }

  override connectedCallback(): void {
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  protected override render(): TemplateResult {
    const held = this.taken ?? this.content;
    return html`<div class="sds-steps" role="list">
  ${this.steps.length
    ? this.steps.map(
        (step) => html`<sds-step
    heading="${step.heading}"
    anchor="${step.anchor ?? nothing}"
    ?optional="${Boolean(step.optional)}"
    .content="${step.body}"
  ></sds-step>`,
      )
    : held}
</div>`;
  }
}

define('sds-steps', SdsSteps);
