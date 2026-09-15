/* sds-run — work in progress, as the stops it consists of.

   Not `sds-steps`, and the difference is not the drawing. An instruction
   renders before the server sends it and never changes. A run arrives one stop
   at a time, each with what it wrote. The whole ends in a verdict that an
   instruction has no place for. So it is an application's component, beside
   `sds-progress` — see `ELSEWHERE` in `scripts/coverage.ts`.

   The share, where the work reports one, is `sds-progress` above it. A run
   whose end is not a number — which is most of them — draws no bar at all. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

/** Where the work is in relation to one stop. */
export type RunState = 'ahead' | 'running' | 'done' | 'failed';

/** What became of the whole. `running` while any of it is still in hand. */
export type RunVerdict = 'running' | 'done' | 'failed';

/** The mark a state draws, and the name of that mark. Named and drawn: the
    shape and the colour are one claim, and neither reaches a reader who hears
    the page rather than sees it. The word is the English one until a page
    says otherwise — `stateWords` is where it says it. */
const MARKS: Record<RunState, { icon: string; said: string }> = {
  ahead: { icon: 'actions-circle', said: 'Not started' },
  /* The set's own spinner — a faint ring and the arc that travels round it,
     which is what `.sds-spinner` turns everywhere in this system. Two spinners
     in one system is one too many, whatever either of them is a picture of. */
  running: { icon: 'spinner-circle', said: 'Running' },
  done: { icon: 'actions-check-circle', said: 'Done' },
  failed: { icon: 'actions-exclamation-circle', said: 'Failed' },
};

/** What a page calls the states, where the page is not in English. Partial:
    a page names the ones it has a word for and the rest stay as they are. So
    a language that arrives one string at a time is never half a run with no
    words at all. */
export type RunWords = Partial<Record<RunState, string>>;

/** One stop of the work. */
export interface RunStep {
  /** What this stop is. */
  label: string;
  state: RunState;
  /** A quiet word at the far end of the row — a duration, a count. */
  meta?: string;
  /** What happens to it right now, in words. A mark is a shape and a
      colour, and a reader who waits on a queue is owed a sentence. */
  note?: string;
  /** What it wrote. A stop that wrote nothing does not open: a control that
      opens onto an empty box is a promise the row cannot keep. */
  output?: string;
  /** Which set it belongs to, where the work is many jobs at once rather than
      one sequence. Stops with none are one run, read in order. */
  group?: string;
}

export interface RunProps {
  /** What the run is, in one line — or what became of it. A set of jobs says
      that at the top: "Some checks haven't completed yet". */
  heading: string;
  /** What became of the whole. It is the mark beside the heading. */
  verdict: RunVerdict;
  /** The line under the heading: where the work has got to, or the counts. */
  note?: string;
  /** The stops, set from script — being a list, and one that changes. */
  steps: readonly RunStep[];
  /** If the whole stands open. A run a reader watches gets `open`; one in a
      list of past runs does not, and the head is then the whole of it. */
  open?: boolean;
  /** The names of the states, where the page is not in English. Every state
      is a word and a mark. The word is the only one of the two a reader who
      hears the page ever gets. */
  stateWords?: RunWords;
}

/** What tells the lines this system wrote apart. The tools get no terminal,
    so nothing they write carries colour of its own. A colour from a guess at
    the meaning is a guess. */
const TONES: readonly { mark: string; tone: string }[] = [
  { mark: '→', tone: 'note' },
  { mark: '✗', tone: 'error' },
  { mark: '✓', tone: 'ok' },
];

export class SdsRun extends SdsElement {
  static override properties = {
    heading: { type: String },
    verdict: { type: String, reflect: true },
    note: { type: String },
    steps: { type: Array },
    open: { type: Boolean, reflect: true },
    stateWords: { type: Object, attribute: 'state-words' },
  };

  declare heading: string;
  declare verdict: RunVerdict;
  declare note: string;
  declare steps: readonly RunStep[];
  declare open: boolean;
  declare stateWords: RunWords;

  /** Which rows the reader has opened or closed against what the state does.
      Nobody else has an answer for that, so it is the one piece of state
      this element keeps. */
  #decided = new Map<number, boolean>();

  constructor() {
    super();
    this.heading = '';
    this.verdict = 'running';
    this.note = '';
    this.steps = [];
    /* False, because that is what an absent boolean attribute means. A default
       of `true` is one a page cannot turn off when it leaves the word out. */
    this.open = false;
    this.stateWords = {};
  }

  /** The name of a state here. The page's word where it has one, and the
      English of the marks where it has not. */
  private said(state: RunState): string {
    return this.stateWords[state] ?? MARKS[state].said;
  }

  /** The stops in the order they arrive, under the group each one named.
      A run with no groups is one list, which is the sequence. */
  private get sets(): readonly { name: string; steps: readonly (RunStep & { at: number })[] }[] {
    const held = new Map<string, (RunStep & { at: number })[]>();
    this.steps.forEach((step, at) => {
      const name = step.group ?? '';
      const set = held.get(name) ?? [];
      set.push({ ...step, at });
      held.set(name, set);
    });
    return [...held].map(([name, steps]) => ({ name, steps }));
  }

  /* What a step writes runs on, so the reader sees its end. */
  protected override updated(): void {
    const output = this.querySelector('.sds-run__step--running .sds-run__output');
    if (output) output.scrollTop = output.scrollHeight;
  }

  /** A press is the reader's answer to "must this stand open?", and the
      answer is the opposite of what stands now. The press and not `toggle`.
      That one fires for a row this element opened by itself, which then
      counts as opened by hand and stays open too long.

      The platform's own toggle stops here, because it runs *after* this
      element has rendered the answer and undoes it. One thing decides if a
      row stands open, and it is the answer kept here. */
  private decide(event: Event, at: number, open: boolean): void {
    if (!(event.target as HTMLElement).closest('.sds-run__row')) return;
    event.preventDefault();
    this.#decided.set(at, !open);
    this.requestUpdate();
  }

  private row(step: RunStep & { at: number }): TemplateResult {
    const mark = MARKS[step.state];
    const word = this.said(step.state);
    const said = step.note ? `${step.label} — ${word}. ${step.note}` : `${step.label} — ${word}`;
    const face = html`<span
      class="sds-run__mark sds-run__mark--${step.state}${step.state === 'running' ? ' sds-spinner' : ''}"
    ><sds-icon name="${mark.icon}"></sds-icon></span>`;
    const words = html`${face}<span class="sds-run__label">${step.label}</span>${
      step.note ? html`<span class="sds-run__said">${step.note}</span>` : nothing
    }<span class="sds-run__meta">${step.meta ?? ''}</span>`;

    /* Nothing written, nothing to open — and it does not offer to be. */
    if (!step.output) {
      return html`<li class="sds-run__step sds-run__step--${step.state}">
      <div class="sds-run__row" aria-label="${said}">${words}</div>
    </li>`;
    }
    const open = this.#decided.get(step.at) ?? step.state !== 'done';
    return html`<li class="sds-run__step sds-run__step--${step.state}">
      <details class="sds-run__fold" ?open="${open}" @click="${(e: Event) => this.decide(e, step.at, open)}">
        <summary class="sds-run__row" aria-label="${said}"><sds-icon
          class="sds-run__chevron" name="actions-chevron-end"></sds-icon>${words}</summary>
        <pre class="sds-run__output">${lines(step.output)}</pre>
      </details>
    </li>`;
  }

  private list(steps: readonly (RunStep & { at: number })[]): TemplateResult {
    return html`<ol class="sds-run__list">${steps.map((step) => this.row(step))}</ol>`;
  }

  protected override render(): TemplateResult {
    const mark = MARKS[this.verdict];
    return html`<details class="sds-run" ?open="${this.open}">
  <summary class="sds-run__head"><span
    class="sds-run__verdict sds-run__verdict--${this.verdict}${this.verdict === 'running' ? ' sds-spinner' : ''}"
  ><sds-icon name="${mark.icon}" label="${this.said(this.verdict)}" size="24"></sds-icon></span><span class="sds-run__headline"><span
    class="sds-run__heading">${this.heading}</span>${
      this.note ? html`<span class="sds-run__note">${this.note}</span>` : nothing
    }</span><sds-icon class="sds-run__chevron" name="actions-chevron-down"></sds-icon></summary>
  <div class="sds-run__body">${this.sets.map((set) =>
    set.name
      ? html`<details class="sds-run__group" open>
      <summary class="sds-run__group-head"><sds-icon
        class="sds-run__chevron" name="actions-chevron-end"></sds-icon>${set.name}</summary>
      ${this.list(set.steps)}
    </details>`
      : this.list(set.steps),
  )}</div>
</details>`;
  }
}

/** The output, with the lines this system wrote set apart from the lines the
    tools wrote. One span per line, so the gutter is a counter and the numbers
    are never in the text a reader copies out. */
function lines(output: string): TemplateResult[] {
  return output.split('\n').map((line) => {
    const tone = TONES.find(({ mark }) => line.startsWith(mark))?.tone ?? '';
    return html`<span class="sds-run__line${tone ? ` sds-run__line--${tone}` : ''}">${line}</span>`;
  });
}

define('sds-run', SdsRun);
