/* A matrix.

   `sds-table` with a sign in every cell, an `sds-icon` with a `label`:
   things down the side, criteria across the top. The legend is the table's caption, so the
   words for the signs travel with it. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import { dsScreen, part } from '../lib/specimen.ts';
import { matrix } from '../components/Table.stories.ts';

import { place, slide, type DeckMode } from '../lib/deck.ts';

export function matrixSlide({ flat = false, bare = false }: DeckMode = {}): TemplateResult {
  return slide(
    {
      eyebrow: place(1),
      heading: 'Where each product edits what',
      note: 'Text in place is common. A preview link is not.',
      number: '07',
    },
    matrix(),
    { flat, bare },
  );
}

const meta: Meta = {
  title: 'Slides/Matrix',
  excludeStories: ['matrixSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-matrix.html',
      section: 'Slides',
      title: 'Matrix',
      subtitle: 'Four products against five criteria, a sign in every cell, the legend under it',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Matrix',
  render: () => matrixSlide(),
};

export const screenHtml = (): string => part(matrixSlide({ flat: true }));
