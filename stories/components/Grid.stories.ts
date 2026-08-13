/* The wall a set of cards is read in.

   Its own file rather than three stories in `Card.stories.ts`, because what is
   being shown here is the set and not the card: how wide it runs is a decision
   about how much room a card needs, and `flush` is a decision about whether the
   set is separated at all. The card is the same card in all four.

   No `parameters.dsCard`, for the reason `Card.stories.ts` states: a grid is
   judged at the width a document gives it, and a card file is a fragment at a
   fixed size. The acceptance render is where one meets a real page. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/card-grid.ts';
import { type CardGridProps } from '../../packages/frontend/src/components/card-grid.ts';
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

const meta: Meta<CardGridProps> = {
  title: 'Components/Card grid',
  tags: ['autodocs', '!dev'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['', 'wide', 'dense', 'flush'] },
  },
  render: ({ variant }) =>
    html`<sds-card-grid variant="${variant ?? ''}" style="margin:var(--space-6)"
      >${CHAPTERS.map(sdsCard)}</sds-card-grid
    >`,
};

export default meta;
type Story = StoryObj<CardGridProps>;

/** Three across on a page, two beside a rail, one on a phone — reflowed by the
    cards' own minimum, with nothing here naming a breakpoint. */
export const Grid: Story = { args: {} };

/** Two across: a card carrying a picture and a paragraph needs the room two of
    them get. */
export const Wide: Story = { args: { variant: 'wide' } };

/** Five or six across, where a card is a name and a glyph. */
export const Dense: Story = { args: { variant: 'dense' } };

/** The gutter taken out. The cards share a hairline instead of standing apart,
    which is what a signpost at the top of a chapter wants: one block to read
    down, not four things to compare. */
export const Flush: Story = { args: { variant: 'flush' } };
