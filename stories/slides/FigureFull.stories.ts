/* A figure, full.

   The drawing takes nearly the whole frame, and only the count shows, at
   its place on every slide. The head stays for a reader who hears the
   slide. For a view that needs the room: an interface, an architecture. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { TemplateResult } from 'lit';
import { dsScreen, part } from '../lib/specimen.ts';
import { place, slide, type DeckMode } from '../lib/deck.ts';

export function figureFullSlide({ flat = false, bare = false }: DeckMode = {}): TemplateResult {
  return slide(
    {
      kind: 'figure',
      layout: 'full',
      eyebrow: place(2),
      heading: 'A page of the manual',
      note: 'A view that needs the whole frame shows only the count.',
      src: 'assets/screenshots/documentation.png',
      alt: 'A page of the manual at the width of a desk. The bar, the column of pages, the page and its contents.',
      number: '05',
    },
    undefined,
    { flat, bare },
  );
}

const meta: Meta = {
  title: 'Slides/Figure full',
  excludeStories: ['figureFullSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-figure-full.html',
      section: 'Slides',
      title: 'Figure, full',
      subtitle: 'A drawing that takes the frame, with its note in the foot',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Figure full',
  render: () => figureFullSlide(),
};

export const screenHtml = (): string => part(figureFullSlide({ flat: true }));
