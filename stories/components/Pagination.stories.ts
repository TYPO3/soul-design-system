/* Where a list continues.

   The markup lives in `src/components/pagination.ts`. No `parameters.dsCard`:
   what a card would show is one row of numbers, and what is worth documenting
   is which numbers appear — the ends, the neighbours of the current one, and
   where a run is left out. That is a story per case, not one picture.

   `Middle` and `Dense` are the two the rule was written for: a gap standing in
   for a single number is longer than the number and says less.

   Every story says how many there are and how many go on a page, never how
   many pages that is — the row divides, and a story that stated both would be
   the one place the two could disagree. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/pagination.ts';
import { type PageChange, type PaginationProps } from '../../src/components/pagination.ts';

const sdsPagination = ({ count, perPage = 10, current = 1, href, label }: PaginationProps) =>
  html`<sds-pagination count="${count}" per-page="${perPage}" current="${current}" href="${href ?? '#page-{n}'}" label="${label ?? ''}"></sds-pagination>`;

const meta: Meta<PaginationProps> = {
  title: 'Components/Pagination',
  tags: ['autodocs', '!dev'],
  render: (args) => sdsPagination(args),
  argTypes: {
    count: { control: { type: 'number', min: 0 } },
    perPage: { control: { type: 'number', min: 1 } },
    current: { control: { type: 'number', min: 1, max: 40 } },
    href: { control: 'text' },
    label: { control: 'text' },
  },
  args: { count: 84, perPage: 10, current: 1, label: 'entries' },
};

export default meta;
type Story = StoryObj<PaginationProps>;

/** The first page — 84 entries, ten to a page, nine pages. `Previous` stays in
    place rather than disappearing: a row of controls that changes width as it
    is used moves under the pointer. */
export const First: Story = { args: { count: 84, perPage: 10, current: 1, label: 'entries' } };

/** In the middle of a long list — the ends, the neighbours, and two gaps. The
    total is grouped where it is drawn, so a caller hands over the number it
    has rather than a string it has already written out. */
export const Middle: Story = { args: { count: 2310, perPage: 100, current: 12, label: 'entries' } };

/** Close to an end, where one side has no run left to leave out. */
export const Near: Story = { args: { count: 84, perPage: 10, current: 2, label: 'entries' } };

/** Short enough to show whole. No gap appears for a single missing number:
    “1 … 3” is wider than “1 2 3” and tells the reader less. */
export const Dense: Story = { args: { count: 42, perPage: 10, current: 3, label: 'entries' } };

/** One page — fewer entries than fit on it. The row is still drawn: a list
    that fits on one page has an address too, and a control that vanishes at
    the boundary is a control the reader learns not to trust. */
export const Single: Story = { args: { count: 6, perPage: 10, current: 1, label: 'entries' } };

/** Paged in place. The addresses are still written — the row is the same one —
    and the listener cancelling `sds-change` is what turns them off: the press
    stays on this page and the element moves its own numbers, while
    `event.detail.page` tells whatever draws the list which slice to show. */
export const InPlace: Story = {
  args: { count: 84, perPage: 10, current: 1, label: 'entries' },
  render: ({ count, perPage = 10, current = 1, label }: PaginationProps) =>
    html`<sds-pagination
      count="${count}"
      per-page="${perPage}"
      current="${current}"
      label="${label ?? ''}"
      @sds-change="${(event: CustomEvent<PageChange>) => event.preventDefault()}"
    ></sds-pagination>`,
};
