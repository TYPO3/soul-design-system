/* Three sketches in a row, each on its plane.

   A walk through an interface: the same column in three states, or three
   screens one after the next. Each stands on a plane with a hairline, as a
   card does, with what it shows under it in the small register. The
   caption is text, so it reads at the page's size and never shrinks with
   the picture. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { TemplateResult } from 'lit';
import { dsScreen, part } from '../lib/specimen.ts';
import { place, slide, type DeckMode } from '../lib/deck.ts';

export function figureRowSlide({ flat = false, bare = false }: DeckMode = {}): TemplateResult {
  return slide(
    {
      kind: 'figure',
      layout: 'row',
      framed: true,
      eyebrow: place(2),
      heading: 'Three pages at hand',
      drawings: [
        {
          src: 'assets/screenshots/search-phone.png',
          alt: 'The search page on a phone. The results for label, the filters by kind, and the first hit.',
          label: 'Search',
          caption: 'The filters count the hits, and the first one names where it comes from.',
        },
        {
          src: 'assets/screenshots/glyph-phone.png',
          alt: 'The page of the glyph actions-document-edit on a phone. Its name, what it means, and the versions it is in.',
          label: 'Glyph',
          caption: 'The name at the top, and the versions that carry it under the sentence.',
        },
        {
          src: 'assets/screenshots/checkout-phone.png',
          alt: 'The page of the checkout 14.3-dev on a phone. The actions, and a warning that the build is two commits behind.',
          label: 'Checkout',
          caption: 'The one thing to do next is the only orange button.',
        },
      ],
      number: '10',
    },
    undefined,
    { flat, bare },
  );
}

const meta: Meta = {
  title: 'Slides/Figure row',
  excludeStories: ['figureRowSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-figure-row.html',
      section: 'Slides',
      title: 'Figure, row',
      subtitle: 'Three sketches side by side, each on its plane with its caption',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Figure row',
  render: () => figureRowSlide(),
};

export const screenHtml = (): string => part(figureRowSlide({ flat: true }));
