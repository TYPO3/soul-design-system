/* Three cards.

   A content slide: the title at the top margin, a wall of planes under it,
   the foot pinned. The planes are `sds-surface`, the wall is `sds-grid`, and
   neither knows it stands on a slide. Nothing floats. A hairline separates,
   and a shadow says the card left the page. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, type TemplateResult } from 'lit';
import '../../packages/frontend/src/components/surface.ts';
import '../../packages/frontend/src/components/grid.ts';
import { dsScreen, part } from '../lib/specimen.ts';
import { grid, type PageMode } from '../lib/page.ts';
import { slide } from '../lib/deck.ts';

const PLACES = [
  { label: 'Story', heading: 'Every element has one', body: 'The source of every specimen card. Edit the story, never the card.' },
  { label: 'Specimen', heading: 'Something draws every class', body: 'A card or an element draws each class, so a rule and its rendering cannot drift apart.' },
  { label: 'Rendered page', heading: 'The Guides renderer made it', body: 'A page built on the system follows the layouts and invents no class.' },
];

export function cardsSlide({ flat = false }: PageMode = {}): TemplateResult {
  return slide(
    { heading: 'Three places for every component', number: '03' },
    grid(
      PLACES.map((one) => html`<sds-surface label="${one.label}" heading="${one.heading}" body="${one.body}"></sds-surface>`),
      { flat },
    ),
    { flat },
  );
}

const meta: Meta = {
  title: 'Slides/Cards',
  excludeStories: ['cardsSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-cards.html',
      section: 'Slides',
      title: 'Cards',
      subtitle: 'A content slide: the title at the top margin, three planes in a wall, the foot pinned',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Cards',
  render: () => cardsSlide(),
};

export const screenHtml = (): string => part(cardsSlide({ flat: true }));
