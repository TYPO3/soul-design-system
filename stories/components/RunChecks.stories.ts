/* The other shape a run takes: many jobs at once, grouped by what has become
   of them.

   The same rows and the same head as `Run.stories.ts` — a second card rather
   than a second component, because nothing about a row changes here. What
   changes is that the order says nothing: no job waits for another, so what
   sorts them is their state, and the group carries the count so one folded
   away still says what is inside it.

   And each row says in words what a mark cannot. "Queued" and "started now"
   are the difference between a check nobody has picked up and one that is
   working, which is one glyph apart and a whole answer apart. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/run.ts';
import { type RunProps, type RunStep } from '../../packages/frontend/src/components/run.ts';
import { sdsRun } from './Run.stories.ts';
import { dsCard, part, spec, specCap } from '../lib/specimen.ts';

/** A branch's checks, mid-flight. */
const CHECKS: readonly RunStep[] = [
  { group: '2 queued', label: 'Build PHP (8.4)', state: 'ahead', note: 'Waiting to run this check' },
  { group: '2 queued', label: 'Build PHP (8.5)', state: 'ahead', note: 'Waiting to run this check' },
  { group: '2 in progress', label: 'Build frontend', state: 'running', meta: '24s', note: 'Started now' },
  { group: '2 in progress', label: 'Build PHP (8.2)', state: 'running', meta: '18s', note: 'Started now' },
  {
    group: '1 failed',
    label: 'Lint',
    state: 'failed',
    meta: '31s',
    note: 'Two files are off the standard',
    output: `→ vendor/bin/php-cs-fixer fix --dry-run
✗ src/Source/Sitemap.php — 1 violation`,
  },
];

/** The same branch once every check has answered. The head is the one line a
    reader reads, and folded away it is the whole of what they need. */
const SETTLED: readonly RunStep[] = CHECKS.map((step) => ({
  ...step,
  group: '5 successful',
  state: 'done' as const,
  note: 'Successful in 1m 12s',
  meta: '1m 12s',
  output: undefined,
}));

const meta: Meta<RunProps> = {
  title: 'Components/Run checks',
  tags: ['autodocs', '!dev'],
  excludeStories: ['specimenHtml'],
  render: (args) => sdsRun(args),
  args: {
    heading: 'Some checks haven’t completed yet',
    verdict: 'running',
    note: '2 in progress, 2 queued, 1 failed',
    open: true,
    steps: CHECKS,
  },
  parameters: {
    dsCard: dsCard({
      path: 'components/core/run-checks.card.html',
      name: 'Many jobs at once',
      subtitle: 'Nothing waits for anything, so the state sorts them and the group carries the count',
      viewport: '760x901',
    }),
  },
};

export default meta;
type Story = StoryObj<RunProps>;

/** Mid-flight. Every group stands open while the work is going on: a reader
    watching a run wants the rows, and folding is what they do once they have
    seen which one matters. */
export const Default: Story = {};

/** All of them through. One line says it, and the rows are there for whoever
    asks — which is what a fold is for. */
export const Settled: Story = {
  args: {
    heading: 'All checks have passed',
    verdict: 'done',
    note: '5 successful checks',
    open: false,
    steps: SETTLED,
  },
};

/* Both, because the claim is that the head is enough when everything has
   answered and not enough while anything is still moving. */
export const specimenHtml = (): string =>
  spec([
    specCap('Still going — the state sorts them, and each row says in words what the mark cannot'),
    part(sdsRun({
      heading: 'Some checks haven’t completed yet',
      verdict: 'running',
      note: '2 in progress, 2 queued, 1 failed',
      open: true,
      steps: CHECKS,
    })),
    specCap('Answered — folded away, because the one line is the whole of it'),
    part(sdsRun({
      heading: 'All checks have passed',
      verdict: 'done',
      note: '5 successful checks',
      open: false,
      steps: SETTLED,
    })),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
