/* The five planes, in both modes.

   Warm paper and the terminal: the same five tokens, and the pair is the
   point. A card that showed one mode would document half of every token —
   `--surface-sunken` is *lighter* than the canvas on paper and darker than it
   in the dark, and that inversion is the design rather than an accident of
   two palettes. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';
import { fill, modes, swatch, type Swatch } from '../lib/swatch.ts';

/** The planes, in the order a surface stacks them. */
const PLANES: readonly (Omit<Swatch, 'hex' | 'style'> & { light: string; dark: string })[] = [
  { token: '--surface-canvas', light: '#FBFAF7', dark: '#131210' },
  { token: '--surface-raised', light: '#FFFFFF', dark: '#171614' },
  { token: '--surface-sunken', light: '#F4F2EE', dark: '#0C0B0A' },
  { token: '--surface-inset', light: '#EFEBE3', dark: '#221F1B' },
  { token: '--surface-accent-quiet', light: '#FFF6EC', dark: '#1C1A16' },
];

const row = (mode: 'light' | 'dark'): readonly string[] =>
  PLANES.map((p) => swatch({ token: p.token, hex: p[mode], style: fill(p.token) }));

const meta: Meta = {
  title: 'Specimens/Colours/Surfaces',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/colors-surfaces.card.html',
      group: 'Colors',
      name: 'Surfaces',
      subtitle: 'Warm paper and the terminal — the same five planes in both modes',
      theme: 'both',
      viewport: '700x270',
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
