/* A figure beside its text.

   The text column holds the head at the h2 step, the body and the foot, as
   the page of a speaker slide does. The drawing takes the other column. So
   a slide can say three things about a picture and show the picture. The
   column stands at the start, and `text-end` puts it at the end. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import { dsScreen, part } from '../lib/specimen.ts';
import { place, slide, type DeckMode } from '../lib/deck.ts';

export function figureTextSlide({ flat = false, bare = false }: DeckMode = {}): TemplateResult {
  return slide(
    {
      kind: 'figure',
      layout: 'text-start',
      eyebrow: place(2),
      heading: 'Five sources',
      src: 'assets/diagrams/answer-sources.svg',
      alt: 'The five sources against the state of the machine each one needs. Bundled knowledge and the checkout need nothing. Packages need files on disk. The installation needs a booted site, and network sources need outbound reach.',
      number: '06',
    },
    html`<ul class="sds-list">
      <li>Bundled knowledge and the checkout need nothing running.</li>
      <li>Packages need their files on disk.</li>
      <li>The installation needs a booted site.</li>
    </ul>`,
    { flat, bare },
  );
}

const meta: Meta = {
  title: 'Slides/Figure text',
  excludeStories: ['figureTextSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-figure-text.html',
      section: 'Slides',
      title: 'Figure, text',
      subtitle: 'A column of text at the start, and the drawing beside it',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Figure text',
  render: () => figureTextSlide(),
};

export const screenHtml = (): string => part(figureTextSlide({ flat: true }));
