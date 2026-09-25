/* Three sketches, each in the figure region.

   A drawing between the tags stands in the slide's own document. So it
   reads the page's tokens and its faces, in either mode. Each is a
   `<figure slot="figure">`: its word as `data-label`, what it shows as its
   `<figcaption>`. The text needs no region name. A static card takes the
   same drawings as the `drawings` property, with `content` for the markup. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, svg, type TemplateResult } from 'lit';
import { dsScreen, part } from '../lib/specimen.ts';
import { place, slide, type DeckMode } from '../lib/deck.ts';

const TABS = ['Pages', 'Structure', 'Library'];

/** One state of a side column: the tabs, the one that is open, its rows. */
const column = (open: number, rows: readonly string[], marked: number): TemplateResult => html`<svg viewBox="0 0 320 220" role="img" aria-label="${TABS[open]} open: ${rows.join(', ')}">
  ${TABS.map((tab, i) => svg`<rect x="${i * 106 + 1}" y="1" width="104" height="30" rx="4" fill="${i === open ? 'var(--surface-sunken, #F4F2EE)' : 'none'}" stroke="${i === open ? 'var(--text-primary, #1C1A17)' : 'var(--border-subtle, #E3DFD6)'}"></rect>
  <text x="${i * 106 + 53}" y="21" text-anchor="middle" font-size="13" font-weight="${i === open ? 600 : 400}" fill="var(--text-primary, #1C1A17)">${tab}</text>`)}
  ${rows.map((row, i) => svg`<rect x="1" y="${46 + i * 34}" width="318" height="28" rx="4" fill="${i === marked ? 'var(--surface-sunken, #F4F2EE)' : 'none'}"></rect>
  <text x="14" y="${65 + i * 34}" font-size="13" fill="var(--text-secondary, #4A453D)">${row}</text>`)}
</svg>`;

const DRAWINGS = [
  { label: 'Pages', caption: 'A press opens the page in the visual view.', content: column(0, ['Summer shop', 'Home', 'Offers', 'Contact'], 2) },
  { label: 'Structure', caption: 'A choice here selects in the page, and back.', content: column(1, ['Hero', 'Grid, 2 columns', 'Text', 'Image'], 0) },
  { label: 'Library', caption: 'A drag inserts at the selection.', content: column(2, ['Text', 'Teaser', 'Contact', 'Offer block'], 1) },
];

export function figureSlotsSlide({ flat = false, bare = false }: DeckMode = {}): TemplateResult {
  return slide(
    { kind: 'figure', layout: 'row', framed: true, eyebrow: place(2), heading: 'Navigation', drawings: flat ? DRAWINGS : [], number: '11' },
    flat
      ? undefined
      : html`${DRAWINGS.map((one) => html`<figure slot="figure" data-label="${one.label}">${one.content}<figcaption>${one.caption}</figcaption></figure>`)}`,
    { flat, bare },
  );
}

const meta: Meta = {
  title: 'Slides/Figure slots',
  excludeStories: ['figureSlotsSlide', 'screenHtml'],
  parameters: {
    layout: 'fullscreen',
    dsScreen: dsScreen({
      path: 'screens/slide-figure-slots.html',
      section: 'Slides',
      title: 'Figure, slots',
      subtitle: 'Drawings between the tags, in the figure region, with their words and captions',
      viewport: '1920x1080',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const Page: Story = {
  name: 'Figure slots',
  render: () => figureSlotsSlide(),
};

export const screenHtml = (): string => part(figureSlotsSlide({ flat: true }));
