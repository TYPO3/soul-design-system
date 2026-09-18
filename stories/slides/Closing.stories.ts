/* The closing.

   On paper like every slide after the cover, with the cover's lockup, so the
   deck ends on the mark it opened on. The title is the one thing to do next. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import { dsScreen, part } from '../lib/specimen.ts';
import { type PageMode } from '../lib/page.ts';
import { slide } from '../lib/deck.ts';

export function closingSlide({ flat = false }: PageMode = {}): TemplateResult {
  return slide(
    {
      kind: 'closing',
      heading: 'Start from a layout',
      lead: 'Open the one nearest the job and keep its shell. An element answers what one part looks like.',
    },
    undefined,
    { flat },
  );
}

const meta: Meta = {
  title: 'Slides/Closing',
  excludeStories: ['closingSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-closing.html',
      section: 'Slides',
      title: 'Closing',
      subtitle: 'The last slide, with the cover’s lockup and the one thing to do next',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Closing',
  render: () => closingSlide(),
};

export const screenHtml = (): string => part(closingSlide({ flat: true }));
