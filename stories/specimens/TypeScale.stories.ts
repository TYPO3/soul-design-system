/* The scale, largest to smallest.

   Every step, and nothing between them: a size that is not on this list is a
   size somebody picked. The sans steps carry the heading tracking that goes
   with them. Where the small step is set in mono, tracked and upper case, is
   the mono card's subject rather than this one's.

   Read as a list rather than as a paragraph, so the specimen states each step
   beside its sample instead of describing the ratio. One column, because two
   fill row by row and send the size zigzagging across the card: a scale is
   read down the page, and each step has to be smaller than the one above. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard, specPad } from '../lib/specimen.ts';

interface Step {
  token: string;
  /** What the caption states — the token's value in px. */
  size: number;
  tracking?: string;
  /** The display and h1 steps set their own leading, or the row's baseline
      alignment pulls the sample off the line it shares with its caption. */
  leading?: boolean;
}

const STEPS: readonly Step[] = [
  { token: '--font-size-display', size: 58, tracking: '-0.03em', leading: true },
  { token: '--font-size-h1', size: 44, tracking: '-0.015em', leading: true },
  { token: '--font-size-h2', size: 34, tracking: '-0.015em' },
  { token: '--font-size-h3', size: 24 },
  { token: '--font-size-lead', size: 19 },
  { token: '--font-size-body', size: 16 },
  { token: '--font-size-small', size: 14 },
];

const step = ({ token, size, tracking, leading }: Step): string => {
  const style = [
    /* Drawn by the token rather than by its number, so a sample cannot be a
       size the scale stopped holding. The caption still states the value,
       because a specimen that shows a size without saying it is a picture. */
    `font-size:var(${token});`,
    tracking ? `letter-spacing:${tracking};` : '',
    leading ? 'line-height:1;' : '',
  ].filter(Boolean).join(' ');
  return `<div style="display:flex; align-items:baseline; justify-content:space-between; gap:12px;">` +
    `<span style="${style}">Aa</span>` +
    `<span class="spec-cap">${token} · ${size}</span></div>`;
};

const meta: Meta = {
  title: 'Specimens/Type/Type scale',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/type-scale.card.html',
      group: 'Type',
      name: 'Type scale',
      subtitle: 'Every step in the system, largest to smallest',
      viewport: '700x331',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  specPad(STEPS.map(step), 'display:grid; gap:4px;');

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
