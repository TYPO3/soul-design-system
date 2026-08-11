/* Where a list continues.

   The markup lives in `src/components/pagination.ts`. No `parameters.dsCard`:
   what a card would show is one row of numbers, and what is worth documenting
   is which numbers appear — the ends, the neighbours of the current one, and
   where a run is left out. That is four stories, not one picture.

   `Middle` and `Dense` are the two the rule was written for: a gap standing in
   for a single number is longer than the number and says less. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/pagination.ts';
import { type PaginationProps } from '../../src/components/pagination.ts';

const sdsPagination = ({ pages, current = 1, href, count }: PaginationProps) =>
  html`<sds-pagination pages="${pages}" current="${current}" href="${href ?? '#page-'}" count="${count ?? ''}"></sds-pagination>`;

const meta: Meta<PaginationProps> = {
  title: 'Components/Pagination',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsPagination(args),
  argTypes: {
    pages: { control: { type: 'number', min: 1, max: 40 } },
    current: { control: { type: 'number', min: 1, max: 40 } },
    href: { control: 'text' },
    count: { control: 'text' },
  },
  args: { pages: 9, current: 1, count: '84 entries' },
};

export default meta;
type Story = StoryObj<PaginationProps>;

/** The first page. `Previous` stays in place rather than disappearing: a row
    of controls that changes width as it is used moves under the pointer. */
export const First: Story = { args: { pages: 9, current: 1, count: '84 entries' } };

/** In the middle of a long list — the ends, the neighbours, and two gaps. */
export const Middle: Story = { args: { pages: 24, current: 12, count: '231 entries' } };

/** Close to an end, where one side has no run left to leave out. */
export const Near: Story = { args: { pages: 9, current: 2, count: '84 entries' } };

/** Short enough to show whole. No gap appears for a single missing number:
    “1 … 3” is wider than “1 2 3” and tells the reader less. */
export const Dense: Story = { args: { pages: 5, current: 3 } };

/** One page. The row is still drawn — a list that fits on one page has an
    address too, and a control that vanishes at the boundary is a control the
    reader learns not to trust. */
export const Single: Story = { args: { pages: 1, current: 1, count: '6 entries' } };
