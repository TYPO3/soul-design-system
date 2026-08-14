/* The way on from a page.

   The markup lives in `src/components/pager.ts`. No `parameters.dsCard`: it is
   two buttons in a row, and a card of it would show the button a second time.
   Where it belongs is at the foot of a documentation page, which is what the
   Guides render shows it doing.

   The stories worth having are the three states a page can be in — a page in
   the middle of a manual, its first page, and its last — because the row is
   the same in all of them and only which ends are filled changes. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/nav-pager.ts';
import { type PagerProps } from '../../packages/frontend/src/components/nav-pager.ts';

const sdsNavPager = ({ previousHref, previousLabel, nextHref, nextLabel, label }: PagerProps) =>
  html`<sds-nav-pager
    previous-href="${previousHref ?? ''}" previous-label="${previousLabel ?? ''}"
    next-href="${nextHref ?? ''}" next-label="${nextLabel ?? ''}"
    label="${label ?? 'Pages either side of this one'}"></sds-nav-pager>`;

const meta: Meta<PagerProps> = {
  title: 'Components/Nav pager',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsNavPager(args),
  argTypes: {
    previousHref: { control: 'text' },
    previousLabel: { control: 'text' },
    nextHref: { control: 'text' },
    nextLabel: { control: 'text' },
    label: { control: 'text' },
  },
  args: {
    previousHref: '#',
    previousLabel: 'Installing the server',
    nextHref: '#',
    nextLabel: 'Writing a task skill',
  },
};

export default meta;
type Story = StoryObj<PagerProps>;

/** In the middle of a manual: the page behind at one end, the page ahead at
    the other. The glyph carries the direction and joins the page title in the
    name a screen reader announces, rather than replacing it. */
export const Default: Story = {};

/** The first page. The one control keeps its end — a way on that moved to the
    left because there is nothing to its left reads as a way back. */
export const First: Story = { args: { previousHref: '', previousLabel: '' } };

/** And the last. Nothing is drawn where the next would be: an inert control is
    a control a reader tries. */
export const Last: Story = { args: { nextHref: '', nextLabel: '' } };
