/* Work being done, as the stops it is made of.

   The markup lives in `src/components/run.ts`. Not the instruction beside it:
   an instruction is rendered before it is served and never changes, and this
   arrives one stop at a time, carries what each one wrote, and ends on a
   verdict. The two are told apart in the element's own file.

   The card is the sequence, because that is the shape a reader has to be able
   to recognise: the row in hand carries a band, what wrote something opens,
   and the durations line up in a column. The set of jobs is a story below —
   the same rows under groups that fold. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/run.ts';
import '../../packages/frontend/src/components/progress.ts';
import { type RunProps, type RunStep } from '../../packages/frontend/src/components/run.ts';
import { dsCard, part, spec, specCap } from '../lib/specimen.ts';

export const sdsRun = ({ heading, verdict, note, steps, open }: RunProps) =>
  html`<sds-run
    heading="${heading}"
    verdict="${verdict}"
    note="${note ?? ''}"
    ?open="${open ?? false}"
    .steps="${steps}"
  ></sds-run>`;

/* What a step wrote. Written as the characters they are: the lines this system
   put there are told from the lines the tools wrote, and nothing else is —
   a tool handed no terminal writes no colour, and guessing at its meaning is
   reading tea leaves. */
const INDEX_OUTPUT = `→ reading the sitemap at docs.typo3.org
→ 18412 pages listed, 0 refused
✓ sitemap read in 412ms`;

const BUILD_OUTPUT = `→ building the index
12880 of 18412 pages
→ 4 pages have no title and are indexed by their path`;

/** One read of a source, as the stops it goes through. Exported so the page
    that shows a source composes these rather than a second copy of them. */
export const READ: readonly RunStep[] = [
  { label: 'Fetch the sitemap', state: 'done', meta: '0.4s', output: INDEX_OUTPUT },
  { label: 'Read 18,412 pages', state: 'done', meta: '1m 4s' },
  { label: 'Build the index', state: 'running', meta: '23s', output: BUILD_OUTPUT },
  { label: 'Swap it in', state: 'ahead' },
  { label: 'Drop the old index', state: 'ahead' },
];

/** The same work, stopped. What failed wrote why, and the stop after it never
    happened — which is a run saying where it got to rather than what it wanted
    to do. */
export const REFUSED: readonly RunStep[] = [
  { label: 'Fetch the sitemap', state: 'done', meta: '0.4s' },
  {
    label: 'Read 18,412 pages',
    state: 'failed',
    meta: '2m 11s',
    output: `→ 12880 of 18412 pages
✗ docs.typo3.org stopped answering after 12880 pages
✗ the index was not swapped in — the one from 06:12 is still being answered from`,
  },
  { label: 'Build the index', state: 'ahead' },
  { label: 'Swap it in', state: 'ahead' },
];

/** Many jobs at once, which is the other shape. Nothing here follows anything
    else, so the order says nothing and the state is what sorts them — and each
    row says in words what a mark cannot. */
const CHECKS: readonly RunStep[] = [
  { group: '3 queued', label: 'Build PHP (8.3)', state: 'ahead', note: 'Waiting to run this check' },
  { group: '3 queued', label: 'Build PHP (8.4)', state: 'ahead', note: 'Waiting to run this check' },
  { group: '3 queued', label: 'Build PHP (8.5)', state: 'ahead', note: 'Waiting to run this check' },
  { group: '2 in progress', label: 'Build frontend', state: 'running', meta: '24s', note: 'Started now' },
  { group: '2 in progress', label: 'Build PHP (8.2)', state: 'running', meta: '18s', note: 'Started now' },
  { group: '1 failed', label: 'Lint', state: 'failed', meta: '31s', note: 'Two files are off the standard' },
];

const meta: Meta<RunProps> = {
  title: 'Components/Run',
  tags: ['autodocs', '!dev'],
  excludeStories: ['READ', 'REFUSED', 'sdsRun', 'specimenHtml'],
  render: (args) => sdsRun(args),
  args: {
    heading: 'Reading docs.typo3.org',
    verdict: 'running',
    note: 'Step 3 of 5 · 1m 27s so far',
    open: true,
    steps: READ,
  },
  parameters: {
    dsCard: dsCard({
      path: 'components/core/run.card.html',
      name: 'Work being done',
      subtitle: 'The row in hand carries a band, what wrote something opens, the durations line up',
      viewport: '760x860',
    }),
  },
};

export default meta;
type Story = StoryObj<RunProps>;

/** A run in hand. The stop being worked on is open and its output follows to
    the end; the ones behind it are closed, because what a reader wants from a
    finished step is that it finished. */
export const Default: Story = {};

/** Stopped, and the run says where. The stop that failed stands open — it is
    the one thing on the page worth reading — and what came after it never
    happened rather than being drawn as though it might still. */
export const Failed: Story = {
  args: {
    heading: 'The read stopped',
    verdict: 'failed',
    note: 'Failed at step 2 of 4 · 2m 11s',
    open: true,
    steps: REFUSED,
  },
};

/** Done, folded away. This is the shape a past run takes in a list of them:
    the verdict and how long, and the stops are there for whoever asks. */
export const Settled: Story = {
  args: {
    heading: 'Read docs.typo3.org',
    verdict: 'done',
    note: 'All 5 steps · 3m 02s · 2 hours ago',
    open: false,
    steps: READ.map((step) => ({ ...step, state: 'done' as const })),
  },
};

/** Many jobs at once, grouped by what has become of them. The order says
    nothing here — nothing waits for anything — so the groups carry the count
    and fold, and each row says in words what the mark cannot. */
export const Grouped: Story = {
  args: {
    heading: 'Some checks haven’t completed yet',
    verdict: 'running',
    note: '2 in progress, 3 queued, 1 failed',
    steps: CHECKS,
  },
};

/** With the share above it, where the work reports one. The bar is
    `sds-progress` and not something this component grew: a run whose end is
    not a number — which is most of them — draws no bar at all. */
export const WithProgress: Story = {
  render: (args) => html`<div class="sds-stack">
    <sds-progress
      caption="Reading docs.typo3.org"
      value="3"
      max="5"
      readout="count"
      unit="steps"
      note="Building the index — 12,880 of 18,412 pages"
      pulsing
    ></sds-progress>
    ${sdsRun(args)}
  </div>`,
};

/* Both ends of a run on one card, because what a reader has to be able to tell
   apart is the one in hand from the one that stopped — and the marks, the band
   and the two tones in the output only mean anything against each other. */
export const specimenHtml = (): string =>
  spec([
    specCap('In hand — the stop being worked on stands open, the ones behind it are closed'),
    part(sdsRun({
      heading: 'Reading docs.typo3.org',
      verdict: 'running',
      note: 'Step 3 of 5 · 1m 27s so far',
      open: true,
      steps: READ,
    })),
    specCap('Stopped — the stop that failed stands open, and what came after it never happened'),
    part(sdsRun({
      heading: 'The read stopped',
      verdict: 'failed',
      note: 'Failed at step 2 of 4 · 2m 11s',
      open: true,
      steps: REFUSED,
    })),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
