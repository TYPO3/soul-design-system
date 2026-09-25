/* Two figures, side by side.

   Two pictures a reader reads against each other: before and after, one
   product and the next. Each stands under its word in half the room, and
   the note says what the two show together. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { TemplateResult } from 'lit';
import { dsScreen, part } from '../lib/specimen.ts';
import { place, slide, type DeckMode } from '../lib/deck.ts';

export function figurePairSlide({ flat = false, bare = false }: DeckMode = {}): TemplateResult {
  return slide(
    {
      kind: 'figure',
      layout: 'row',
      eyebrow: place(2),
      heading: 'Now and before',
      drawings: [
        {
          src: 'assets/screenshots/status-sources.png',
          alt: 'The status page of dev-companion at the table of six sources. Each row names a source, its state as a badge, when it was last checked, and an Open button.',
          label: 'Status',
        },
        {
          src: 'assets/screenshots/source-reads.png',
          alt: 'The page of the source docs.typo3.org at its lower half. An overview, then two folded rows under Earlier reads, then a note: this is a source, not a service.',
          label: 'Source',
        },
      ],
      number: '09',
    },
    undefined,
    { flat, bare },
  );
}

const meta: Meta = {
  title: 'Slides/Figure pair',
  excludeStories: ['figurePairSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-figure-pair.html',
      section: 'Slides',
      title: 'Figure, pair',
      subtitle: 'Two pictures side by side, each under its word',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Figure pair',
  render: () => figurePairSlide(),
};

export const screenHtml = (): string => part(figurePairSlide({ flat: true }));
