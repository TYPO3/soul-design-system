/* The tool rail.

   The markup lives in `src/components/rail.ts`, over the contract every
   navigation in the system shares in `nav-base.ts`. 210px wide, and items are
   tool names, so they set in mono verbatim: never title-cased, never
   prettified. `typo3_icon_lookup` is what `typo3_icon_lookup` is called.

   One entry with its pages under it — the entry's label is the heading, and a
   page holding pages of its own is a fold. The current page is named by the
   data rather than counted from the outside.

   No `parameters.dsCard`: the three share one card, composed in
   `Navigation.stories.ts`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/nav-rail.ts';
import { type MenuEntry } from '../../packages/frontend/src/components/nav-base.ts';

interface RailArgs {
  entry: MenuEntry;
}

const meta: Meta<RailArgs> = {
  title: 'Components/Nav rail',
  tags: ['autodocs', '!dev'],
  render: ({ entry }) => html`<div style="width:210px"><sds-nav-rail .entry="${entry}"></sds-nav-rail></div>`,
  argTypes: {
    entry: { control: 'object' },
  },
  args: {
    entry: {
      label: '',
      items: [
        { label: 'typo3_icon_lookup', current: true },
        { label: 'typo3_label_lookup' },
        { label: 'typo3_schema_lookup' },
      ],
    },
  },
};

export default meta;
type Story = StoryObj<RailArgs>;

export const Default: Story = {};

/** A rail long enough to need sections. A fold is a `<details>`, so folding is
    the platform's, and the one holding the current page starts open — whatever
    depth that page sits at. */
export const Grouped: Story = {
  args: {
    entry: {
      label: 'Reference',
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
            { label: 'typo3_icon_lookup', href: '#icon', current: true },
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
  },
};

/** Where a rail lists pages rather than tools, its items are links. */
export const Links: Story = {
  args: {
    entry: {
      label: '',
      items: [
        { label: 'overview', href: '#overview', current: true },
        { label: 'requirements', href: '#requirements' },
        { label: 'decisions', href: '#decisions' },
      ],
    },
  },
};
