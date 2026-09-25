/* A figure, full.

   The drawing takes nearly the whole frame, and only the count shows, at
   its place on every slide. The head stays for a reader who hears the
   slide. For a view that needs the room: an interface, an architecture. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { TemplateResult } from 'lit';
import { dsScreen, part } from '../lib/specimen.ts';
import { slide, type DeckMode } from '../lib/deck.ts';

export function figureFullSlide({ flat = false, bare = false }: DeckMode = {}): TemplateResult {
  return slide(
    {
      kind: 'figure',
      layout: 'full',
      eyebrow: 'What it consists of · Figure 1',
      heading: 'The system at a glance',
      note: 'One read-only path leaves the machine, and every other source stays on it.',
      src: 'assets/diagrams/system-overview.svg',
      alt: 'The client, the app subprocess and the local sources sit inside the machine; one read-only path crosses to official services outside.',
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
