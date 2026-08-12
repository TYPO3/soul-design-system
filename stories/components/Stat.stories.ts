/* A figure stated as a fact.

   The markup lives in `src/components/stat.ts`. No `parameters.dsCard`: what
   a stat looks like is the type scale, which `Guidelines → Type` already
   draws. What it is *for* is only visible in a row of them on a page, which
   is what `Pages/Feature` shows.

   The stories are the two ways one can be wrong: without its bound, and with
   a value that is a claim rather than a count. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/stat.ts';
import { type StatProps } from '../../packages/frontend/src/components/stat.ts';
import { NNBSP } from '../lib/specimen.ts';

const sdsStat = ({ value, label, note }: StatProps) =>
  html`<sds-stat value="${value}" label="${label}" .note="${note ?? ''}"></sds-stat>`;

/** The set the feature page shows, in the order it shows them. Exported so
    the page composes these rather than its own copy. */
export const SOURCE_FACTS: readonly StatProps[] = [
  {
    value: '5',
    label: 'sources',
    note: 'Bundled knowledge, this checkout, installed packages, the booted installation, and the network.',
  },
  {
    value: '4',
    label: 'preconditions',
    note: 'From nothing running to outbound reach. Each source declares which one it needs.',
  },
  {
    value: '0',
    label: 'writes',
    note: 'Every source is read. Nothing is written back, and nothing is executed to answer.',
  },
  {
    /* The narrow no-break space before a unit is the system's own typography:
       a number cannot be split from what it counts across a line. */
    value: `240${NNBSP}ms`,
    label: 'typical answer',
    note: 'From bundled knowledge, with no installation booted and no request leaving the machine.',
  },
];

const meta: Meta<StatProps> = {
  title: 'Components/Stat',
  tags: ['autodocs', '!dev'],
  excludeStories: ['SOURCE_FACTS'],
  render: (args) => sdsStat(args),
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    note: { control: 'text' },
  },
  args: SOURCE_FACTS[0] as StatProps,
};

export default meta;
type Story = StoryObj<StatProps>;

/** A count, and what it counts. The note is what keeps it a fact: "5 sources"
    means nothing until it says which five. */
export const Default: Story = { args: SOURCE_FACTS[0] as StatProps };

/** A measurement carries the state it was measured in, for the same reason an
    answer carries its source. */
export const Measurement: Story = { args: SOURCE_FACTS[3] as StatProps };

/** Zero is worth stating where it is the property being claimed. */
export const Zero: Story = { args: SOURCE_FACTS[2] as StatProps };

/** Without a note. Allowed, and rarely right: a figure alone is a number the
    reader has to take on trust. */
export const Unbounded: Story = { args: { value: '5', label: 'sources' } };

/** The row, which is how they are actually read — the values line up and the
    notes are compared, so the grid is the specimen and not any one of them. */
export const Row: Story = {
  render: () => html`<div class="sds-stats">${SOURCE_FACTS.map(sdsStat)}</div>`,
};
