/* A figure, headed.

   The drawing takes the frame under a short head: the eyebrow in the
   quiet accent ink, the title and a rule. The count stands on its plate,
   and the foot has no lockup. For a view that needs the room and still
   says what it is. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { TemplateResult } from 'lit';
import { dsScreen, part } from '../lib/specimen.ts';
import { place, slide, type DeckMode } from '../lib/deck.ts';

export function figureHeadedSlide({ flat = false, bare = false }: DeckMode = {}): TemplateResult {
  return slide(
    {
      kind: 'figure',
      layout: 'headed',
      eyebrow: place(2),
      heading: 'A page of the manual',
      src: 'assets/screenshots/documentation.png',
      alt: 'A page of the manual at the width of a desk. The bar, the column of pages, the page and its contents.',
      number: '06',
    },
    undefined,
    { flat, bare },
  );
}

const meta: Meta = {
  title: 'Slides/Figure headed',
  excludeStories: ['figureHeadedSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-figure-headed.html',
      section: 'Slides',
      title: 'Figure, headed',
      subtitle: 'A drawing that takes the frame under a short head',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Figure headed',
  render: () => figureHeadedSlide(),
};

/* The key of the drawing at the right of the title. Each kind of key
   stands once: two squares, an id on a plate, an id in mono. */
export const Legend: Story = {
  name: 'Figure headed, with a legend',
  render: () =>
    slide({
      kind: 'figure',
      layout: 'headed',
      eyebrow: place(2),
      heading: 'Roadmap',
      legend: '■ MVP | □ First version | [ID] Feature | ID After the MVP',
      src: 'assets/screenshots/documentation.png',
      alt: 'A page of the manual at the width of a desk.',
      number: '06',
    }),
};

export const screenHtml = (): string => part(figureHeadedSlide({ flat: true }));
