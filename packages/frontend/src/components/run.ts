/* sds-run — work being done, as the stops it is made of.

   Not `sds-steps`, and the difference is not the drawing. An instruction is
   rendered before it is served and never changes; a run arrives one stop at a
   time, each one carrying what it wrote, and the whole has a verdict at the end
   that an instruction has no place for. So it is an application's component,
   beside `sds-progress` — see `ELSEWHERE` in `scripts/coverage.ts`.

   The share, where the work reports one, is `sds-progress` above it. A run
   whose end is not a number — which is most of them — draws no bar at all. */

import { html, nothing, type TemplateResult } from 'lit';
import './icon.ts';
import { define, SdsElement } from '../lib/element.ts';

/** Where the work is in relation to one stop. */
export type RunState = 'ahead' | 'running' | 'done' | 'failed';

/** What became of the whole. `running` while any of it is still in hand. */
export type RunVerdict = 'running' | 'done' | 'failed';

/** The mark a state draws, and what that mark is called. Named as well as
    drawn: the shape and the colour are one claim, and neither of them reaches
    a reader who is told rather than shown. */
const MARKS: Record<RunState, { icon: string; said: string }> = {
  ahead: { icon: 'actions-circle', said: 'Not started' },
  /* The set's own spinner — a faint ring and the arc that travels round it,
     which is what `.sds-spinner` turns everywhere in this system. Two spinners
     in one system is one too many, whatever either of them is a picture of. */
  running: { icon: 'spinner-circle', said: 'Running' },
  done: { icon: 'actions-check-circle', said: 'Done' },
  failed: { icon: 'actions-exclamation-circle', said: 'Failed' },
};

/** One stop of the work. */
export interface RunStep {
  /** What this stop is. */
  label: string;
  state: RunState;
  /** A quiet word at the far end of the row — a duration, a count. */
  meta?: string;
  /** What is happening to it right now, in words. A mark is a shape and a
      colour, and a reader waiting on a queue is owed a sentence. */
  note?: string;
  /** What it wrote. A stop that wrote nothing does not open: a control that
      opens onto an empty box is a promise the row cannot keep. */
  output?: string;
  /** Which set it belongs to, where the work is many jobs at once rather than
      one sequence. Stops carrying none are one run, read in order. */
  group?: string;
}

export interface RunProps {
  /** What the run is, in one line — or what has become of it, which is what a
      set of jobs says at the top: "Some checks haven't completed yet". */
  heading: string;
  /** What became of the whole. It is the mark beside the heading. */
  verdict: RunVerdict;
  /** The line under the heading: where the work has got to, or the counts. */
  note?: string;
  /** The stops, set from script — being a list, and one that changes. */
  steps: readonly RunStep[];
  /** Whether the whole stands open. A run being watched is written `open`; one
      in a list of past runs is not, and the head is then the whole of it. */
  open?: boolean;
}

/** What the lines this system wrote are told apart by. The tools are handed no
    terminal, so nothing they write carries colour of its own, and colouring it
    by guessing at its meaning is reading tea leaves. */
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
  };

  declare heading: string;
  declare verdict: RunVerdict;
  declare note: string;
  declare steps: readonly RunStep[];
  declare open: boolean;

  /** Which rows the reader has opened or closed against what the state would
      do. Nobody else has an answer for that, so it is the one piece of state
      this element keeps. */
  #decided = new Map<number, boolean>();

  constructor() {
    super();
    this.heading = '';
    this.verdict = 'running';
    this.note = '';
    this.steps = [];
    /* False, because that is what an absent boolean attribute means. A default
       of `true` is one a page cannot turn off by leaving the word out. */
    this.open = false;
  }

  /** The stops in the order they are given, under the group each one named.
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

  /* What a step is writing runs on, so its end is what is shown. */
  protected override updated(): void {
    const output = this.querySelector('.sds-run__step--running .sds-run__output');
    if (output) output.scrollTop = output.scrollHeight;
  }

  /** A press is the reader's answer to "should this stand open?", and the
      answer is the opposite of what stands now — the press itself flips it.
      The press and not `toggle`: that one fires for a row this element opened
      by itself, which would count as opened by hand and stay open long after
      the work had moved on.

      The platform's own toggle is taken off it, because it runs *after* this
      element has already rendered the answer and undoes it. One thing decides
      whether a row stands open, and it is the answer kept here. */
  private decide(event: Event, at: number, open: boolean): void {
    if (!(event.target as HTMLElement).closest('.sds-run__row')) return;
    event.preventDefault();
    this.#decided.set(at, !open);
    this.requestUpdate();
  }

  private row(step: RunStep & { at: number }): TemplateResult {
    const mark = MARKS[step.state];
    const said = step.note ? `${step.label} — ${mark.said}. ${step.note}` : `${step.label} — ${mark.said}`;
    const face = html`<span
      class="sds-run__mark sds-run__mark--${step.state}${step.state === 'running' ? ' sds-spinner' : ''}"
    ><sds-icon name="${mark.icon}" size="em"></sds-icon></span>`;
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
          class="sds-run__chevron" name="actions-chevron-end" size="em"></sds-icon>${words}</summary>
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
  ><sds-icon name="${mark.icon}" label="${mark.said}" size="24"></sds-icon></span><span class="sds-run__headline"><span
    class="sds-run__heading">${this.heading}</span>${
      this.note ? html`<span class="sds-run__note">${this.note}</span>` : nothing
    }</span><sds-icon class="sds-run__chevron" name="actions-chevron-down" size="em"></sds-icon></summary>
  <div class="sds-run__body">${this.sets.map((set) =>
    set.name
      ? html`<details class="sds-run__group" open>
      <summary class="sds-run__group-head"><sds-icon
        class="sds-run__chevron" name="actions-chevron-end" size="em"></sds-icon>${set.name}</summary>
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
