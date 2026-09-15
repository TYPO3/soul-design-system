/* A plan on the calendar.

   The markup lives in `src/components/timeline.ts`. Dated stops down one
   rail, and the one the plan is at. Not `sds-steps`, which is an
   instruction, and not `sds-run`, which is work in progress. A plan has a
   date at every stop, and a reader asks how far along it is. The stops go
   between the tags as elements. The card comes from `Specimen` below. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/timeline.ts';
import { type TimelineEntry, type TimelineProps } from '../../packages/frontend/src/components/timeline.ts';
import { dsCard, part, spec, specCap } from '../lib/specimen.ts';

/** One stop, written out. The date and the title on the element, what it
    holds between the tags, and the stops inside it as more of these. */
export const sdsTimelineStop = ({ when, heading, body, now, items }: TimelineEntry): TemplateResult =>
  html`<sds-timeline-stop when="${when}" heading="${heading}" ?now="${Boolean(now)}">${body ?? ''}${(items ?? []).map((one) => sdsTimelineStop(one))}</sds-timeline-stop>`;

/** The plan as a page writes it: the stops as elements between the tags.
    The source panel under a story shows them, which is what a reader came
    to copy. */
export const sdsTimeline = ({ entries }: TimelineProps): TemplateResult =>
  html`<sds-timeline>
  ${(entries ?? []).map((one) => sdsTimelineStop(one))}
</sds-timeline>`;

/** The other way in: the plan gets its stops and writes them itself. It is
    also the only form a card can take. A static render cannot see an
    element with content between its tags. */
export const sdsTimelineFlat = ({ entries }: TimelineProps): TemplateResult =>
  html`<sds-timeline .entries="${entries ?? []}"></sds-timeline>`;

/** The plan a concept paper ends on. Exported so the concept page composes
    these rather than a second copy. */
export const PLAN: readonly TimelineEntry[] = [
  { when: '2026-09-15', heading: 'Draft 2 to the maintainers', body: 'This paper, with the test and the options in it.' },
  { when: '2026-09-30', heading: 'Decision', body: 'The maintainers answer the question in part 8. Nothing below starts before that.', now: true },
  { when: 'Sprint 1 · 2026-10-05 to 10-16', heading: 'The record, kept', body: 'One file per source, thirty reads. Merged behind a flag.', items: [
    { when: 'W1', heading: 'The server keeps the last thirty reads' },
  ] },
  { when: 'Sprint 2 · 2026-10-19 to 10-30', heading: 'The record, shown', body: 'Every surface reads the same file.', items: [
    { when: 'W2', heading: 'The page of a source shows the record' },
    { when: 'W3', heading: 'Five marks in the status row' },
    { when: 'W4', heading: 'One line in the terminal' },
  ] },
  { when: '2026-11-10', heading: 'Release 1.5', body: 'W5 with it: the manual, and the note at the foot of the status page.' },
];

const meta: Meta<TimelineProps> = {
  title: 'Components/Timeline',
  tags: ['autodocs', '!dev'],
  excludeStories: ['PLAN', 'sdsTimelineStop', 'sdsTimeline', 'sdsTimelineFlat', 'specimenHtml'],
  render: (args) => sdsTimeline(args),
  argTypes: {
    entries: { control: 'object' },
  },
  args: { entries: PLAN },
  parameters: {
    dsCard: dsCard({
      path: 'components/content/timeline.card.html',
      name: 'A plan on the calendar',
      subtitle: 'Dated stops down one rail: what has passed, where the plan is, what lies ahead',
      viewport: '700x783',
    }),
  },
};

export default meta;
type Story = StoryObj<TimelineProps>;

/** Five stops with the plan at the second, and the packages of a sprint
    inside it. The stops before it read as passed, the ones after as ahead,
    and the word beside the title says which one is now. */
export const Default: Story = {};

/** No stop marked: a plan not yet begun, every stop ahead. */
export const NotBegun: Story = {
  args: { entries: PLAN.map(({ now: _now, ...rest }) => rest) },
};

/** The plan at its last stop, which is a plan done. */
export const Done: Story = {
  args: { entries: PLAN.map((stop, i) => ({ ...stop, now: i === PLAN.length - 1 })) },
};

/** The plan inside a sprint: a package marked now puts its sprint at now,
    the package before it at passed, the ones after it ahead. The stops
    outside the sprint read against the same line. */
export const InsideASprint: Story = {
  name: 'Inside a sprint',
  args: {
    entries: PLAN.map((stop) => ({
      ...stop,
      now: false,
      items: stop.items?.map((one) => ({ ...one, now: one.when === 'W3' })),
    })),
  },
};

/** What a stop can hold, which is the reason it goes between the tags. A
    paragraph and a list, where a sentence is not enough to say what a stop
    delivers. */
export const Blocks: Story = {
  render: () => html`<sds-timeline>
    <sds-timeline-stop when="2026-09-30" heading="Decision" now>
      <p>The maintainers answer the question in part 8.</p>
    </sds-timeline-stop>
    <sds-timeline-stop when="Sprint 1 · 2026-10-05 to 10-16" heading="The record, kept">
      <p>One file per source, thirty reads. With it:</p>
      <ul>
        <li>a flag that turns the record off</li>
        <li>the file's shape in the manual</li>
      </ul>
      <sds-timeline-stop when="W1" heading="The server keeps the last thirty reads"></sds-timeline-stop>
    </sds-timeline-stop>
  </sds-timeline>`,
};

export const specimenHtml = (): string =>
  spec([
    part(sdsTimelineFlat({ entries: PLAN })),
    specCap('A PLAN AT ITS SECOND STOP · PASSED, NOW, AHEAD · THE WORD SAYS WHICH'),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
