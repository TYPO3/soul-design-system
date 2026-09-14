/* The wall a set reads in.

   Its own file rather than three stories in `Card.stories.ts`, because what
   shows here is the set and not what is in it. No `parameters.dsCard`, for
   the reason `Card.stories.ts` states. A grid earns its review at the width a
   document gives it, and a card file is a fragment at a fixed size.

   Nothing in a set here is the length of what stands beside it. A wall of
   equal items is a wall that cannot fail. What the grid decides is visible
   only where the items disagree. The row's height, the feet on one line, a
   flush wall with no hole in it. A set that agrees hides it. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../packages/frontend/src/components/grid.ts';
import { type GridProps } from '../../packages/frontend/src/components/grid.ts';
import { type CardProps } from '../../packages/frontend/src/components/card.ts';
import { sdsCard } from './Card.stories.ts';

/* Five, and not four. The grid squares off a short last row — four items in a
   three-wide row land two and two. So an even set lands on the same divisor
   at both widths and `default` draws exactly what `wide` draws. An odd count
   cannot. */
const CHAPTERS: readonly CardProps[] = [
  {
    tag: 'Reference',
    label: 'Chapter 02',
    heading: 'Directives',
    body: 'The markup this theme adds: the bands of a landing page, the grid, and the cards in it.',
    src: 'assets/placeholders/tool-registration.png',
    alt: '',
    action: 'Read it',
  },
  /* Two lines and nothing else — the one that says if the frame beside it
     stops at its own prose or at the row. */
  {
    heading: 'Installation',
    body: 'One package, one copy step, three commands.',
  },
  {
    icon: 'actions-book',
    heading: 'What a page owes before it reaches for a class of its own',
    body: 'A title that is the link, the blocks under it, and where it goes. Everything past that is a decision the document makes for the system rather than with it. A heading two steps larger here, a wider gutter there. By the fourth page the pages no longer agree about anything.',
    footer: 'The rule',
    action: 'Read it',
  },
  {
    label: '9 August 2026',
    heading: 'Publishing',
    body: 'The three commands a project runs, and the one file that decides what a reader gets.',
    action: 'Read it',
  },
  {
    heading: 'Markup',
    body: 'Everything a renderer emits that carries no class at all, and the stylesheet that meets it.',
    src: 'assets/placeholders/community-reference.png',
    alt: '',
  },
];

/* A name and a glyph, which is what `dense` is the width for. Uneven here too:
   a heading that wraps, a line that runs to two, and one that stops at four
   words. */
const ENTRIES: readonly CardProps[] = [
  { icon: 'actions-book', heading: 'Nodes', body: 'Every node the renderer hands over, and what this theme draws for it.' },
  { icon: 'actions-database', heading: 'Configuration', body: 'What the bar says.' },
  { icon: 'actions-tag', heading: 'Versions, and the tab that names them', body: 'One document, read at the version it came out under.' },
  { icon: 'actions-search', heading: 'Search', body: 'The index, and the page a hit resolves from.' },
  { icon: 'actions-extension', heading: 'Directives', body: 'The markup this theme adds on top of reStructuredText.' },
  { icon: 'actions-globe', heading: 'Publishing', body: 'Three commands.' },
];

const wall = (variant: GridProps['variant'], items: readonly CardProps[]) =>
  html`<sds-grid variant="${variant ?? 'default'}">${items.map(sdsCard)}</sds-grid>`;

const meta: Meta<GridProps> = {
  title: 'Components/Grid',
  tags: ['autodocs', '!dev'],
  render: ({ variant }) => wall(variant, CHAPTERS),
};

export default meta;
type Story = StoryObj<GridProps>;

/** Three across on a page, two beside a rail, one on a phone — reflowed by the
    items' own minimum, with nothing here naming a breakpoint. The same set
    draws at every width below, so what differs between the stories is the wall
    and never the content. */
export const Default: Story = { args: {} };

/** Two across: a card with a picture and a paragraph needs the room two of
    them get. The set is the one above, where two of five have a picture. A
    row in which only some entries carry a drawing is the arrangement a real
    one always is. */
export const Wide: Story = { args: { variant: 'wide' } };

/** Five or six across, where a card is a name and a glyph. Its own set. At
    this width a paragraph is not what an item holds, and the chapters here
    are a claim the width does not make. */
export const Dense: Story = {
  args: { variant: 'dense' },
  render: ({ variant }) => wall(variant, ENTRIES),
};

/** The gutter taken out. The cards share a hairline instead of a gap, which
    is what a signpost at the top of a chapter wants. One block to read down,
    not four things to compare. A tile that stops at its own prose leaves the
    wall's ground visible under it. */
export const Flush: Story = { args: { variant: 'flush' } };
