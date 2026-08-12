/* The tool rail.

   The markup lives in `src/components/rail.ts`, over the base the three
   navigations share in `nav-base.ts`. 210px wide, and items are tool names,
   so they set in mono verbatim: never title-cased, never prettified.
   `typo3_icon_lookup` is what `typo3_icon_lookup` is called.

   No `parameters.dsCard`: the three share one card, composed in
   `Navigation.stories.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/rail.ts';
import { type NavProps } from '../../packages/frontend/src/components/nav-base.ts';
import { type RailEntry } from '../../packages/frontend/src/components/rail.ts';

interface RailArgs extends Omit<NavProps, 'items'> {
  items: readonly RailEntry[];
}

const meta: Meta<RailArgs> = {
  title: 'Components/Rail',
  tags: ['autodocs', '!dev'],
  render: ({ items, active }) =>
    html`<div style="width:210px"><sds-rail .items="${items}" active="${active ?? 0}"></sds-rail></div>`,
  argTypes: {
    items: { control: 'object' },
    active: { control: { type: 'number', min: 0 } },
  },
  args: {
    items: ['typo3_icon_lookup', 'typo3_label_lookup', 'typo3_schema_lookup'],
    active: 0,
  },
};

export default meta;
type Story = StoryObj<RailArgs>;

export const Default: Story = {};

/** A rail long enough to need sections. A group is a `<details>`, so folding is
    the platform's and the group holding the current item starts open. `active`
    counts across the whole rail with the groups flattened: a rail has one
    current item wherever it sits. */
export const Grouped: Story = {
  args: {
    active: 4,
    items: [
      { label: 'overview', href: '#overview' },
      { label: 'glossary', href: '#glossary' },
      {
        label: 'clients',
        items: [
          { label: 'installing', href: '#installing' },
          { label: 'writing a skill', href: '#skill' },
        ],
      },
      {
        label: 'tools',
        items: [
          { label: 'typo3_icon_lookup', href: '#icon' },
          { label: 'typo3_label_lookup', href: '#label' },
          { label: 'typo3_schema_lookup', href: '#schema' },
        ],
      },
      {
        label: 'decisions',
        items: [{ label: 'what is written down', href: '#written' }],
      },
    ],
  },
};

/** Where a rail lists pages rather than tools, its items are links. */
export const Links: Story = {
  args: {
    items: [
      { label: 'overview', href: '#overview' },
      { label: 'requirements', href: '#requirements' },
      { label: 'decisions', href: '#decisions' },
    ],
    active: 0,
  },
};
