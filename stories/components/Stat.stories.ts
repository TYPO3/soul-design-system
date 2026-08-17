/* A figure stated as a fact.

   The markup lives in `src/components/stat.ts`. What a single stat looks like
   is the type scale, which `Guidelines → Type` already draws — so the card is
   generated from the set: four figures read against each other, which is the
   only form in which a stat shows what it is for.

   The stories are the two ways one can be wrong: without its bound, and with
   a value that is a claim rather than a count. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../../packages/frontend/src/components/grid.ts';
import '../../packages/frontend/src/components/stat.ts';
import { type StatProps } from '../../packages/frontend/src/components/stat.ts';
import { grid } from '../lib/page.ts';
import { dsCard, DIVIDER, part, spec, specCap } from '../lib/specimen.ts';

export const sdsStat = ({ value, unit, label, of, icon, note }: StatProps) =>
  html`<sds-stat
    value="${value}"
    unit="${unit ?? ''}"
    label="${label}"
    of="${of ?? ''}"
    icon="${icon ?? ''}"
    .note="${note ?? ''}"
  ></sds-stat>`;

/** The set the feature page shows, in the order it shows them. Exported so
    the page composes these rather than its own copy. */
export const SOURCE_FACTS: readonly StatProps[] = [
  {
    value: '5',
    label: 'sources',
    icon: 'actions-database',
    note: 'Bundled knowledge, this checkout, installed packages, the booted installation, and the network.',
  },
  {
    value: '4',
    label: 'preconditions',
    icon: 'actions-list',
    note: 'From nothing running to outbound reach. Each source declares which one it needs.',
  },
  {
    value: '0',
    label: 'writes',
    icon: 'actions-file-shield',
    note: 'Every source is read. Nothing is written back, and nothing is executed to answer.',
  },
  {
    /* The unit is its own property: the element sets it a step down and joins
       it with the narrow no-break space a number may not be split from. */
    value: '240',
    unit: 'ms',
    label: 'typical answer',
    icon: 'actions-clock',
    note: 'From bundled knowledge, with no installation booted and no request leaving the machine.',
  },
];

const meta: Meta<StatProps> = {
  title: 'Components/Stat',
  tags: ['autodocs', '!dev'],
  excludeStories: ['SOURCE_FACTS', 'specimenHtml'],
  render: (args) => sdsStat(args),
  argTypes: {
    value: { control: 'text' },
    unit: { control: 'text' },
    label: { control: 'text' },
    of: { control: 'text' },
    icon: { control: 'text' },
    note: { control: 'text' },
  },
  args: SOURCE_FACTS[0] as StatProps,
  parameters: {
    dsCard: dsCard({
      path: 'components/data/stat.card.html',
      name: 'Figures read as a set',
      subtitle: 'A count, a share, a measurement and a zero — and the wall they stand in',
      viewport: '700x607',
    }),
  },
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

/** A figure that is a part of something states the whole, in the register a
    unit is set in. Only where the number really is a share: a measurement is
    out of nothing. Words rather than a bar, so every figure in a set keeps
    the same three lines and their notes start together. */
export const Share: Story = {
  args: {
    value: '2',
    of: '3',
    label: 'network sources answering',
    icon: 'actions-globe',
    note: 'One is slow and one is unreachable from the checker. Both are read-only and neither is required to answer.',
  },
};

/** One of each kind, which is what a set is in practice: a count, a share of a
    stated whole, a measurement in a unit, and a zero that is the claim. They
    are read against each other, so the set is the specimen and not any one of
    them — and every kind keeps the same three lines, which is what lets the
    notes be compared across the row. */
const MIXED: readonly StatProps[] = [
  SOURCE_FACTS[0] as StatProps,
  {
    value: '2',
    of: '3',
    label: 'network sources answering',
    icon: 'actions-globe',
    note: 'One is slow and one is unreachable from the checker. Neither is required to answer.',
  },
  SOURCE_FACTS[3] as StatProps,
  SOURCE_FACTS[2] as StatProps,
];

/** The set. `sds-grid` lays it out, like any other set read side by side, and
    `dense` is the width a figure holds: a number and the line under it, four
    or five across, where a card carrying a paragraph would take the room of
    two. */
/* Named rather than exported as `Set`: the export would shadow the global one
   for the whole module, and the sidebar reads the name either way. */
export const AsASet: Story = {
  name: 'Set',
  render: () => grid(MIXED.map(sdsStat), { variant: 'dense' }),
};

/** The same set as one wall. The gutter is out, so the figures share a
    hairline and the ground under each is the wall's, not the stat's — which is
    why a figure anywhere else is still bare. Nothing about the stat changes. */
export const Wall: Story = {
  render: () => grid(MIXED.map(sdsStat), { variant: 'flush' }),
};

/** The card, which is the two stories above one under the other: what a set
    decides is only visible against the same figures decided differently.
    `flat` is the form a card can take — a set handed its items as a property,
    an element given children being one a static render cannot flatten. */
export const specimenHtml = (): string =>
  spec([
    part(grid(MIXED.map(sdsStat), { flat: true, variant: 'dense' })),
    specCap('THE SET · A COUNT, A SHARE OF A STATED WHOLE, A MEASUREMENT, A ZERO THAT IS THE CLAIM'),
    part(grid(MIXED.map(sdsStat), { flat: true, variant: 'flush' })),
    specCap('THE SAME FIGURES AS ONE WALL · THE FRAME BELONGS TO THE WALL, NOT TO THE FIGURE', DIVIDER),
  ]);

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
