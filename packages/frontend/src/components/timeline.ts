/* sds-timeline — a plan on the calendar: dated stops down one rail, and
   where today stands among them.

   For work that has dates. `sds-steps` is an instruction, which never
   changes; `sds-run` is work in progress, which arrives one stop at a time.
   A plan is neither. The author writes it once, with a date at every stop,
   and a reader asks one thing of it: how far along is it? So one stop says
   it is now, and the rest read as passed or ahead.

   The stops go between the tags as `sds-timeline-stop`, each with what it
   holds, the way an instruction holds its steps. The plan reads them in
   order and writes the state onto each. A page that holds them as data
   hands them over as `.entries` instead. */

import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { CONTENT, define, SdsElement } from '../lib/element.ts';
import { facts } from '../lib/authored.ts';
import { lines } from '../lib/template.ts';
import { type PlacedStop, stopTemplate, type TimelineState } from './timeline-stop.ts';

/** One stop of a plan, where a page has the plan as data. */
export interface TimelineEntry {
  /** When, as the plan says it: `2026-09-30`, `Sprint 2`, `Q1`. */
  when: string;
  heading: string;
  body?: string | TemplateResult;
  /** The stop the plan is at. One per plan; the stops before it have
      passed, the ones after it lie ahead. A stop that holds the one marked
      is at it too. */
  now?: boolean;
  /** The stops inside this one: the packages of a sprint, the steps of a
      phase. Read in order with the rest, so a package marked now puts its
      sprint at now and the packages before it at passed. */
  items?: readonly TimelineEntry[];
}

export interface TimelineProps {
  /** The stops, where a page holds the plan as data. Stops that are blocks
      go between the tags as `sds-timeline-stop` instead, and then this
      stays empty. */
  entries?: readonly TimelineEntry[];
}

/** A stop before the plan places it, from whichever form it arrived in.
    `el` where it is an element in a browser, which gets its state written
    back and renders itself; `body` otherwise, for the plan to render. */
interface Read {
  when: string;
  heading: string;
  now: boolean;
  body?: unknown;
  el?: Element;
  items: Read[];
}

/** A stop with its place in the order a reader reads: where its own line
    falls, and where the last line under it falls. */
interface Placed {
  read: Read;
  start: number;
  end: number;
  items: Placed[];
}

const STOP = 'sds-timeline-stop';

const isStop = (node: Node): node is Element => node.nodeType === 1 && (node as Element).tagName.toLowerCase() === STOP;

/* Every open and close tag of a stop, with the attribute run stepping over
   a quoted `>`. One pattern for both, so a walk reads them in order and
   keeps its depth. A sprint's close is not the first close after its open. */
const TAGS = /<sds-timeline-stop\b((?:"[^"]*"|'[^']*'|[^>"'])*)>|<\/sds-timeline-stop>/g;

export class SdsTimeline extends SdsElement {
  static override properties = {
    entries: { type: Array },
  };

  declare entries: readonly TimelineEntry[];

  /** The stops written between the tags. Read before Lit renders over
      them, and before each stop lifts its own children away. The elements
      go back into the list with their state on them. */
  private taken: Read[] | null = null;

  constructor() {
    super();
    this.entries = [];
  }

  override connectedCallback(): void {
    /* The tree first, while it still stands. `lifted` removes each stop, a
       removal runs the stop's own `connectedCallback`, and that lifts the
       stops inside it out of reach. */
    if (!this.taken) {
      const written = this.standing().filter(isStop);
      if (written.length) this.taken = this.fromElements(written);
    }
    this.lifted();
    super.connectedCallback();
  }

  /* From elements in a browser. Attributes rather than properties: a child
     has not always upgraded when its parent reads it. The stops inside one
     are its children, or stand in the template a prerender left. */
  private fromElements(elements: readonly Element[]): Read[] {
    return elements.map((el) => {
      const kept = el.querySelector(`:scope > template[${CONTENT}]`) as HTMLTemplateElement | null;
      const under = [...(kept ? kept.content.children : el.children)].filter(isStop);
      return {
        when: el.getAttribute('when') ?? '',
        heading: el.getAttribute('heading') ?? '',
        now: el.hasAttribute('now'),
        el,
        items: this.fromElements(under),
      };
    });
  }

  /* From the property, where a static render has no children. */
  private fromEntries(entries: readonly TimelineEntry[]): Read[] {
    return entries.map((e) => ({
      when: e.when,
      heading: e.heading,
      now: Boolean(e.now),
      body: e.body,
      items: this.fromEntries(e.items ?? []),
    }));
  }

  /* From the markup as the author wrote it, under a prerender. A walk over
     the tags with a stack, because a stop holds stops. What stands between
     a stop's tags and outside the stops inside it is its body. */
  private fromMarkup(markup: string): Read[] {
    interface Written {
      when: string;
      heading: string;
      now: boolean;
      body: string;
      items: Written[];
    }
    const root: Written = { when: '', heading: '', now: false, body: '', items: [] };
    const open = [root];
    let last = 0;
    for (const found of markup.matchAll(TAGS)) {
      const top = open[open.length - 1]!;
      top.body += markup.slice(last, found.index);
      last = found.index + found[0].length;
      if (found[0].startsWith('</')) {
        if (open.length > 1) open.pop();
        continue;
      }
      const tag = facts(found[1] ?? '');
      const stop: Written = { when: tag['when'] ?? '', heading: tag['heading'] ?? '', now: 'now' in tag, body: '', items: [] };
      top.items.push(stop);
      open.push(stop);
    }
    const read = (stops: Written[]): Read[] =>
      stops.map(({ body, items, ...stop }) => ({
        ...stop,
        body: body.trim() ? html`${unsafeHTML(body.trim())}` : undefined,
        items: read(items),
      }));
    return read(root.items);
  }

  private get read(): Read[] {
    if (this.taken) return this.taken;
    if (this.entries.length) return this.fromEntries(this.entries);
    return this.authored ? this.fromMarkup(this.authored) : [];
  }

  /** Every stop in the order a reader reads, each with the lines it holds. */
  private place(stops: readonly Read[], from = 0): { placed: Placed[]; next: number } {
    let next = from;
    const placed = stops.map((read) => {
      const start = next++;
      const under = this.place(read.items, next);
      next = under.next;
      return { read, start, end: next - 1, items: under.placed };
    });
    return { placed, next };
  }

  /** The line the plan is at: the last stop marked now, in order. So a
      package marked now wins over the sprint that holds it. None marked is
      a plan not yet begun. */
  private at(placed: Placed[]): number {
    let found = -1;
    for (const one of placed) {
      if (one.read.now) found = one.start;
      const under = this.at(one.items);
      if (under >= 0) found = under;
    }
    return found;
  }

  /** What a stop is against the line the plan is at. It is that line or
      holds it; it ends before it; or it starts after it. */
  private state(one: Placed, at: number): TimelineState {
    if (at < 0) return 'ahead';
    if (one.start <= at && at <= one.end) return 'now';
    return one.end < at ? 'passed' : 'ahead';
  }

  /** Each stop with its state, down the tree. An element gets it written
      on as an attribute and renders itself from there. */
  private settle(one: Placed, at: number): PlacedStop {
    const state = this.state(one, at);
    const { read } = one;
    read.el?.setAttribute('state', state);
    return { when: read.when, heading: read.heading, now: read.now, state, body: read.body, stops: one.items.map((under) => this.settle(under, at)) };
  }

  /** The stops as a list in ARIA, for the reason `sds-steps` gives. An
      element between the list and its items is a generic the platform no
      longer counts through. */
  protected override render(): TemplateResult {
    const { placed } = this.place(this.read);
    const at = this.at(placed);
    const settled = placed.map((one) => this.settle(one, at));
    const stops = this.taken ? this.taken.map((read) => read.el) : settled.map((stop) => stopTemplate(stop));
    return html`<div class="sds-timeline" role="list">
  ${lines(stops, 2)}
</div>`;
  }
}

define('sds-timeline', SdsTimeline);
