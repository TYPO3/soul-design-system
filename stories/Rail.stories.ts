/* The tool rail.

   The markup lives in `src/components/rail.ts`, over the base the three
   navigations share in `nav-base.ts`. 210px wide, and items are tool names,
   so they set in mono verbatim: never title-cased, never prettified.
   `typo3_icon_lookup` is what `typo3_icon_lookup` is called.

   No `parameters.dsCard`: the three share one card, composed in
   `Navigation.stories.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../src/components/rail.ts';
import { type NavProps } from '../src/components/nav-base.ts';

const meta: Meta<NavProps> = {
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
type Story = StoryObj<NavProps>;

export const Default: Story = {};

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
