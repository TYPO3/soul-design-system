/* A screenshot beside its text, to the edge.

   A screenshot has edges of its own, so a margin around it draws a second
   frame. With `bleed` it runs to the top, the bottom and the side of the
   frame, on a plane of its own. The text stands at the start and the
   picture at the end. The count keeps its place over it, on a plate. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/facts.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { place, slide, type DeckMode } from '../lib/deck.ts';

const FACTS = [
  { term: 'Row', value: 'one source' },
  { term: 'Badge', value: 'what it does now' },
  { term: 'Checked', value: 'when it last answered' },
];

export function figureBleedSlide({ flat = false, bare = false }: DeckMode = {}): TemplateResult {
  return slide(
    {
      kind: 'figure',
      layout: 'text-start',
      bleed: true,
      eyebrow: place(2),
      heading: 'The status page',
      src: 'assets/screenshots/status-sources.png',
      alt: 'The status page of dev-companion at the table of six sources. Each row names a source, its state as a badge, when it was last checked, and an Open button.',
      number: '08',
    },
    html`<sds-facts>${FACTS.map(({ term, value }) => html`<dt>${term}</dt><dd>${value}</dd>`)}</sds-facts>`,
    { flat, bare },
  );
}

const meta: Meta = {
  title: 'Slides/Figure bleed',
  excludeStories: ['figureBleedSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-figure-bleed.html',
      section: 'Slides',
      title: 'Figure, bleed',
      subtitle: 'The text at the start, and a screenshot to the edge of the frame beside it',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Figure bleed',
  render: () => figureBleedSlide(),
};

export const screenHtml = (): string => part(figureBleedSlide({ flat: true }));
