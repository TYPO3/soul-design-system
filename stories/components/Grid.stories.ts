/* The wall a set is read in.

   Its own file rather than three stories in `Card.stories.ts`, because what is
   being shown here is the set and not what is in it: how wide it runs is a
   decision about how much room an item needs, and `flush` is a decision about
   whether the set is separated at all. Cards throughout, being the set a page
   most often lays out, but a teaser or a plane is laid out by the same wall.

   No `parameters.dsCard`, for the reason `Card.stories.ts` states: a grid is
   judged at the width a document gives it, and a card file is a fragment at a
   fixed size. The acceptance render is where one meets a real page. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/grid.ts';
import { type GridProps } from '../../packages/frontend/src/components/grid.ts';
import { type CardProps } from '../../packages/frontend/src/components/card.ts';
import { sdsCard } from './Card.stories.ts';

const CHAPTERS: readonly CardProps[] = [
  {
    heading: 'Installation',
    body: 'What the package needs, what it writes, and the three commands that render a project with it.',
    action: 'Read it',
  },
  {
    heading: 'Directives',
    body: 'The markup this theme adds: the bands a landing page is built out of, the grid, and the cards in it.',
    action: 'Read it',
  },
  {
    heading: 'Configuration',
    body: 'Everything the bar, the footer and the tab say that is not the project title.',
    action: 'Read it',
  },
  {
    heading: 'Publishing',
    body: 'The three commands a project runs, and the one file that decides what a reader gets.',
    action: 'Read it',
  },
];

const meta: Meta<GridProps> = {
  title: 'Components/Grid',
  tags: ['autodocs', '!dev'],
  render: ({ variant }) => html`<sds-grid variant="${variant ?? 'default'}">${CHAPTERS.map(sdsCard)}</sds-grid>`,
};

export default meta;
type Story = StoryObj<GridProps>;

/** Three across on a page, two beside a rail, one on a phone — reflowed by the
    items' own minimum, with nothing here naming a breakpoint. */
export const Default: Story = { args: {} };

/** Two across: a card carrying a picture and a paragraph needs the room two of
    them get. */
export const Wide: Story = { args: { variant: 'wide' } };

/** Five or six across, where a card is a name and a glyph. */
export const Dense: Story = { args: { variant: 'dense' } };

/** The gutter taken out. The cards share a hairline instead of standing apart,
    which is what a signpost at the top of a chapter wants: one block to read
    down, not four things to compare. */
export const Flush: Story = { args: { variant: 'flush' } };
