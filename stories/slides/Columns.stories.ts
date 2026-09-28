/* Columns.

   A content slide: the title, and `sds-grid` with plain text in each
   cell: an eyebrow, a heading and a paragraph. No frame. The grid's gap is
   what tells two apart. For points a room reads side by side. `columns`
   sets how many stand across: 2, 3 or 4. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/grid.ts';
import '../../packages/frontend/src/components/eyebrow.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { grid } from '../lib/page.ts';
import { type GridColumns } from '../../packages/frontend/src/components/grid.ts';
import { place, slide, type DeckMode } from '../lib/deck.ts';

const RULES = [
  { label: 'Tokens', heading: 'One source for every value', body: 'A size, a colour or a gap comes from a token, never from a figure in a declaration.' },
  { label: 'Elements', heading: 'Address a component', body: 'Everything that fits in a string is a property. Content goes between the tags.' },
  { label: 'Documents', heading: 'True in the same commit', body: 'A change is complete when every page that describes it is true again.' },
  { label: 'Gate', heading: 'Green before a commit', body: 'The checks and the suite run over every part before it goes in.' },
];

const HEADINGS: Record<GridColumns, string> = {
  2: 'Two rules the system keeps',
  3: 'Three rules the system keeps',
  4: 'Four rules the system keeps',
};

export function columnsSlide({ flat = false, bare = false, columns = 3 }: DeckMode & { columns?: GridColumns } = {}): TemplateResult {
  return slide(
    { eyebrow: place(1), heading: HEADINGS[columns], number: '05' },
    grid(
      RULES.slice(0, columns).map((one) => html`<div><sds-eyebrow label="${one.label}"></sds-eyebrow><h3>${one.heading}</h3><p>${one.body}</p></div>`),
      { flat, columns },
    ),
    { flat, bare },
  );
}

const meta: Meta = {
  title: 'Slides/Columns',
  excludeStories: ['columnsSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-columns.html',
      section: 'Slides',
      title: 'Columns',
      subtitle: 'Three columns with no frame, each a label, a title and its text',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Columns',
  render: () => columnsSlide(),
};

/** Two across: each point has half the room. */
export const Two: Story = {
  render: () => columnsSlide({ columns: 2 }),
};

/** Four across: each column keeps 150 px, which a slide holds. */
export const Four: Story = {
  render: () => columnsSlide({ columns: 4 }),
};

export const screenHtml = (): string => part(columnsSlide({ flat: true }));
