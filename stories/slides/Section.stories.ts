/* A divider.

   The slide that opens a section carries the deck's outline at its foot, with
   its own entry marked. That list is the deck's navigation. The mark on the
   current entry is the accent under the active item of a bar, the third
   place the colour stands on a slide. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import { OUTLINE, slide, type DeckMode } from '../lib/deck.ts';
import { dsScreen, part } from '../lib/specimen.ts';


export function sectionSlide({ flat = false, bare = false }: DeckMode = {}): TemplateResult {
  return slide(
    {
      kind: 'section',
      eyebrow: 'Section 02 of 04',
      heading: 'What it consists of',
      number: '03',
      sections: OUTLINE,
      current: 1,
    },
    undefined,
    { flat, bare },
  );
}

const meta: Meta = {
  title: 'Slides/Section',
  excludeStories: ['sectionSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-section.html',
      section: 'Slides',
      title: 'Section',
      subtitle: 'A section opens: its number, its title, and the outline with this entry marked',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Section',
  render: () => sectionSlide(),
};

export const screenHtml = (): string => part(sectionSlide({ flat: true }));
