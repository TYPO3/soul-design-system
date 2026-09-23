/* Three figures.

   Each is `sds-stat`: the value, its unit beside it, and the sentence under
   it. A number never stands alone on a slide, because a number with no
   sentence is a claim with no method. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/stat.ts';
import '../../packages/frontend/src/components/grid.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { grid } from '../lib/page.ts';
import { slide, type DeckMode } from '../lib/deck.ts';

const VALUES = [
  { value: '16', unit: 'px', label: 'Floor', note: 'The floor for the signet and the icons.' },
  { value: '4', unit: 'px', label: 'Radius', note: 'One radius for everything interactive.' },
  { value: '1', unit: 'px', label: 'Hairline', note: 'Hairlines do the structural work.' },
];

export function numbersSlide({ flat = false, bare = false }: DeckMode = {}): TemplateResult {
  return slide(
    { heading: 'The values the design rests on', number: '08' },
    grid(
      VALUES.map((one) => html`<sds-stat value="${one.value}" unit="${one.unit}" label="${one.label}" note="${one.note}"></sds-stat>`),
      { flat },
    ),
    { flat, bare },
  );
}

const meta: Meta = {
  title: 'Slides/Numbers',
  excludeStories: ['numbersSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-numbers.html',
      section: 'Slides',
      title: 'Numbers',
      subtitle: 'Three figures, each with its unit beside it and its sentence under it',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Numbers',
  render: () => numbersSlide(),
};

export const screenHtml = (): string => part(numbersSlide({ flat: true }));
