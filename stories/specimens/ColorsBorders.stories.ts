/* The hairlines, in both modes.

   They do the structural work here, because the system has no shadows: a
   plane is told apart from the one under it by a border and a fill and by
   nothing else. Three weights, and the third is the only one that carries the
   accent — which is why it is a border token and not a colour somebody
   reached for. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';
import { hairline, modes, swatch } from '../lib/swatch.ts';

const LINES: readonly { token: string; light: string; dark: string }[] = [
  { token: '--border-subtle', light: '#E3DFD6', dark: '#2B2823' },
  { token: '--border-strong', light: '#C9C3B7', dark: '#37332C' },
  { token: '--border-accent-quiet', light: '#F0C089', dark: '#4A4437' },
];

const row = (mode: 'light' | 'dark'): readonly string[] =>
  LINES.map((l) => swatch({ token: l.token, hex: l[mode], style: hairline(l.token) }));

const meta: Meta = {
  title: 'Specimens/Colours/Borders',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/colors-borders.card.html',
      group: 'Colors',
      name: 'Borders',
      subtitle: 'Hairlines do the structural work — this system has no shadows',
      theme: 'both',
      viewport: '700x230',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string => modes(row('light'), row('dark'));

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
