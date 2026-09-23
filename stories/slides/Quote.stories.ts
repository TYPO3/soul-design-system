/* A quote.

   `sds-quote`, centred like a statement: a
   borrowed sentence keeps the weight of a paragraph and takes the size. The
   byline marks the source with initials, never a photograph. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/quote.ts';
import { dsScreen, part } from '../lib/specimen.ts';

import { slide, type DeckMode } from '../lib/deck.ts';

export function quoteSlide({ flat = false, bare = false }: DeckMode = {}): TemplateResult {
  return slide(
    { kind: 'statement', number: '09' },
    html`<sds-quote
      body="Comments carry the reason, not the story. No changelog, no anecdote, and never the name of another project."
      by="AGENTS.md"
      as="what fails review"
    ></sds-quote>`,
    { flat, bare },
  );
}

const meta: Meta = {
  title: 'Slides/Quote',
  excludeStories: ['quoteSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-quote.html',
      section: 'Slides',
      title: 'Quote',
      subtitle: 'A borrowed sentence at heading size, and who said it',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Quote',
  render: () => quoteSlide(),
};

export const screenHtml = (): string => part(quoteSlide({ flat: true }));
