/* Pill navigation.

   The markup lives in `src/components/pills.ts`, over the base the three
   navigations share. One rule across all three: the active item is a filled
   block, never a tint.

   For the sections of a page. Pressing one makes it current and says so with
   `sds-change`; one that goes somewhere is a link and the browser decides. No
   `parameters.dsCard`: the three share one card. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/pills.ts';
import { type NavProps } from '../../packages/frontend/src/components/nav-base.ts';

const meta: Meta<NavProps> = {
  title: 'Components/Pills',
  tags: ['autodocs', '!dev'],
  render: ({ items, active }) => html`<sds-pills .items="${items}" active="${active ?? 0}"></sds-pills>`,
  argTypes: {
    items: { control: 'object' },
    active: { control: { type: 'number', min: 0 } },
  },
  args: { items: ['overview', 'tools', 'knowledge'], active: 0 },
};

export default meta;
type Story = StoryObj<NavProps>;

/** Press one: the element makes it current. Nothing outside keeps a number
    in step. */
export const Default: Story = {};

/** A glyph where the section has one. */
export const WithIcons: Story = {
  args: {
    items: [
      { label: 'overview', icon: 'actions-viewmode-list' },
      { label: 'tools', icon: 'actions-cog' },
      { label: 'knowledge', icon: 'actions-book' },
    ],
    active: 0,
  },
};

/** An item that goes somewhere is a link and says `href`. Navigating away is
    not a state this element keeps, so the browser is left to it. */
export const Links: Story = {
  args: {
    items: [
      { label: 'overview', href: '#overview' },
      { label: 'tools', href: '#tools' },
      { label: 'knowledge', href: '#knowledge' },
    ],
    active: 1,
  },
};
