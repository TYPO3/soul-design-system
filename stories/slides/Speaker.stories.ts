/* One speaker.

   Who stands in front of the room. The name at the display step, what they
   are to the subject under it, one sentence. The portrait in the right
   column, edge to edge. A speaker has a portrait, and it is the deck's own
   picture, as a product brings its own mark. The one here follows the
   illustration prompt, a fixture under `assets/portraits/`. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import { dsScreen, part } from '../lib/specimen.ts';

import { slide, type DeckMode } from '../lib/deck.ts';

export function speakerSlide({ flat = false, bare = false }: DeckMode = {}): TemplateResult {
  return slide(
    {
      kind: 'speaker',
      eyebrow: 'Who is speaking',
      heading: 'Benjamin Kott',
      lead: 'Maintainer · Soul Design System',
      portrait: 'assets/portraits/benjamin-kott.png',
      alt: 'Benjamin Kott, drawn: cap, beard, hands in the pockets',
      number: '02',
    },
    html`<p>Answers for the tokens, the elements and the gate that holds them together.</p>`,
    { flat, bare },
  );
}

const meta: Meta = {
  title: 'Slides/Speaker',
  excludeStories: ['speakerSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-speaker.html',
      section: 'Slides',
      title: 'Speaker',
      subtitle: 'One in front of the room: the name, what they are to the subject, and the portrait edge to edge',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Speaker',
  render: () => speakerSlide(),
};

export const screenHtml = (): string => part(speakerSlide({ flat: true }));
