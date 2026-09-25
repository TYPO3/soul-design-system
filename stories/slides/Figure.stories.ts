/* A figure, wide.

   Material from a page: a drawing, a table, a screenshot. The head keeps the
   eyebrow and the title at a content slide's step. A note under it is
   optional. The drawing takes the rest, from the margin under the title.
   Its author draws it for the room `slides.rst` states: no head of its
   own, and what each part says inside the part. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { TemplateResult } from 'lit';
import { dsScreen, part } from '../lib/specimen.ts';
import { place, slide, type DeckMode } from '../lib/deck.ts';

export function figureSlide({ flat = false, bare = false }: DeckMode = {}): TemplateResult {
  return slide(
    {
      kind: 'figure',
      eyebrow: place(2),
      heading: 'One key for two languages',
      src: 'assets/diagrams/slide-cache-key.svg',
      alt: 'Three panels. A German call writes the slot of a key. The array holds one slot for each key and no language. An English call for the same key reads the German answer.',
      number: '07',
    },
    undefined,
    { flat, bare },
  );
}

const meta: Meta = {
  title: 'Slides/Figure',
  excludeStories: ['figureSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-figure.html',
      section: 'Slides',
      title: 'Figure',
      subtitle: 'A drawing from a page under the head and its note, grown to the room it has',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Figure',
  render: () => figureSlide(),
};

export const screenHtml = (): string => part(figureSlide({ flat: true }));
