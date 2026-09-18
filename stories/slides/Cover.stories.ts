/* The cover.

   The deck's first slide, and the one on the terminal. The deck stands on
   paper, and the flip is the emphasis, so the one accent stays where it is.
   The lockup at the foot is the page's, one step up. Nothing here is a
   slide's own: the eyebrow, the display step and the lead are the registers
   every page has. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import { dsScreen, part } from '../lib/specimen.ts';
import { type PageMode } from '../lib/page.ts';
import { slide } from '../lib/deck.ts';

export function coverSlide({ flat = false }: PageMode = {}): TemplateResult {
  return slide(
    {
      kind: 'cover',
      ground: 'terminal',
      eyebrow: 'Design system · 2026',
      heading: 'One system, every surface',
      lead: 'Custom elements, tokens and the class layer they emit. For pages, for documentation, and for a deck.',
    },
    undefined,
    { flat },
  );
}

const meta: Meta = {
  title: 'Slides/Cover',
  excludeStories: ['coverSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-cover.html',
      section: 'Slides',
      title: 'Cover',
      subtitle: 'The first slide, on the terminal: the occasion, the title, the lead, and the lockup at the foot',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Cover',
  render: () => coverSlide(),
};

export const screenHtml = (): string => part(coverSlide({ flat: true }));
