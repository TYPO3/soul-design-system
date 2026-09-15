/* sds-decision — the block that puts the question.

   A concept ends on a decision somebody else makes, and this is where the
   paper asks for it. The question in one line, the answers it can take with
   the one the paper recommends, who decides, and by when. On the raised
   plane, because it is the one block the reader came for. The answers go
   between the tags as `sds-answer`, each with what it means, the way an
   instruction holds its steps. A page that holds them as data hands them
   over as `.answers` instead, and the block writes the elements itself. */

import { html, nothing, type TemplateResult } from 'lit';
import './answer.ts';
import { facts } from '../lib/authored.ts';
import { define, SdsElement } from '../lib/element.ts';

/** One answer the decision can take, where a page has them as data. */
export interface Answer {
  /** Its letter or number, as the paper cites it: `A`. */
  key: string;
  heading: string;
  /** What it means, in a sentence. */
  body?: string | TemplateResult;
  /** The one the paper recommends. */
  recommended?: boolean;
  /** The one the decision took. */
  decided?: boolean;
}

export interface DecisionProps {
  /** The question, in one line. */
  question: string;
  /** The answers, where a page holds them as data. Answers that are blocks
      go between the tags as `sds-answer` instead, and then this stays empty. */
  answers?: readonly Answer[];
  /** Who decides. */
  by?: string;
  /** By when, as written: `2026-09-30`. Once an answer carries
      `decided`, the day the decision fell. */
  due?: string;
  /** The word over the block. `Decision` where nobody names it. */
  label?: string;
  /** What the paper says about the question, before the answers. A
      sentence; blocks go between the tags before the answers. */
  lead?: string;
}

const HEADING = 'Decision';

/** Every answer's tag in the authored markup, with what stands on it. */
const ANSWER_TAGS = /<sds-answer\b([^>]*)>/g;

const isAnswer = (node: Node): node is Element => node.nodeType === 1 && (node as Element).localName === 'sds-answer';

export class SdsDecision extends SdsElement {
  static override properties = {
    question: { type: String },
    answers: { type: Array },
    by: { type: String },
    due: { type: String },
    label: { type: String },
    lead: { type: String },
  };

  declare question: string;
  declare answers: readonly Answer[];
  declare by: string;
  declare due: string;
  declare label: string;
  declare lead: string;

  /** What stood between the tags, taken before Lit renders over it: the
      answers, and any block before them. */
  private taken: Node[] | null = null;

  /** If an answer written between the tags carries `decided`. Read off
      the elements before they lift, because the block speaks in the past
      at its foot only once one does. */
  private settled = false;

  constructor() {
    super();
    this.question = '';
    this.answers = [];
    this.by = '';
    this.due = '';
    this.label = HEADING;
    this.lead = '';
  }

  override connectedCallback(): void {
    this.settled = this.standing().some((node) => isAnswer(node) && node.hasAttribute('decided'));
    const written = this.lifted();
    if (written.length) this.taken = written;
    super.connectedCallback();
  }

  /** If one answer carries `decided`, by whichever route the answers came. */
  private get decided(): boolean {
    if (this.answers.length) return this.answers.some((one) => Boolean(one.decided));
    if (this.taken) return this.settled;
    return [...(this.authored ?? '').matchAll(ANSWER_TAGS)].some((found) => 'decided' in facts(found[1] ?? ''));
  }

  protected override render(): TemplateResult {
    const held = this.taken ?? this.content;
    const label = this.label || HEADING;
    /* The answers from the data, as the elements a page writes by hand.
       `role="list"` on the set, because an element between the set and its
       items is a generic the platform no longer counts through. */
    const answers = this.answers.length
      ? this.answers.map(
          (one) => html`<sds-answer key="${one.key}" heading="${one.heading}" ?recommended="${Boolean(one.recommended)}" ?decided="${Boolean(one.decided)}" .content="${one.body ?? ''}"></sds-answer>`,
        )
      : held;
    /* The facts at the foot: whose call it is, and when it falls due. One
       line, so the reader who skips the answers still sees both. In the
       past only once an answer carries `decided`: an open question is one
       nobody has decided. */
    const decided = this.decided;
    const who = this.by ? html`${decided ? 'Decided by ' : 'Decision by '}<strong>${this.by}</strong>` : nothing;
    let before = decided ? 'On ' : 'Due ';
    if (this.by) before = decided ? ' on ' : ' · due ';
    const when = this.due ? html`${before}<span class="sds-mono">${this.due}</span>` : nothing;
    const foot = this.by || this.due ? html`<p class="sds-decision__meta">${who}${when}</p>` : nothing;
    return html`<section class="sds-decision" aria-label="${label}">
  <p class="sds-label">${label}</p>
  <p class="sds-decision__question">${this.question}</p>
  ${this.lead ? html`<p class="sds-decision__lead">${this.lead}</p>` : nothing}
  <div class="sds-decision__answers" role="list">
  ${answers}
  </div>
  ${foot}
</section>`;
  }
}

define('sds-decision', SdsDecision);
