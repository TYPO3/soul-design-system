/* The scale, largest to smallest.

   Ten steps and nothing between them: a size that is not on this list is a
   size somebody picked. The sans steps carry the heading tracking that goes
   with them, and the last three are mono, because below the UI size
   everything in this system is machine text.

   Read as a list rather than as a paragraph, so the specimen states each step
   beside its sample instead of describing the ratio. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard, specPad } from '../lib/specimen.ts';

interface Step {
  token: string;
  /** What the caption states — the token's value in px. */
  size: number;
  /** What the sample is drawn at, where it differs from the step: the two
      mono steps are shown a pixel up so the letterforms stay legible at this
      card's size. */
  drawn?: number;
  tracking?: string;
  /** The display and h1 steps set their own leading, or the row's baseline
      alignment pulls the sample off the line it shares with its caption. */
  leading?: boolean;
  mono?: boolean;
  /** The label register is shown as it is used: two capitals, tracked out. */
  sample?: string;
}

const STEPS: readonly Step[] = [
  { token: '--font-size-display', size: 58, tracking: '-0.03em', leading: true },
  { token: '--font-size-h1', size: 44, tracking: '-0.02em', leading: true },
  { token: '--font-size-h2', size: 34, tracking: '-0.015em' },
  { token: '--font-size-h3', size: 20 },
  { token: '--font-size-lead', size: 19 },
  { token: '--font-size-body', size: 17 },
  { token: '--font-size-ui', size: 15 },
  { token: '--font-size-dense', size: 13, drawn: 14, mono: true },
  { token: '--font-size-micro', size: 12, mono: true },
  { token: '--font-size-label', size: 11, tracking: '0.09em', mono: true, sample: 'AA' },
];

const step = ({ token, size, drawn, tracking, leading, mono, sample }: Step): string => {
  const style = [
    mono ? 'font-family:var(--font-mono);' : '',
    `font-size:${drawn ?? size}px;`,
    tracking ? `letter-spacing:${tracking};` : '',
    leading ? 'line-height:1;' : '',
  ].filter(Boolean).join(' ');
  return `<div style="display:flex; align-items:baseline; justify-content:space-between; gap:12px;">` +
    `<span style="${style}">${sample ?? 'Aa'}</span>` +
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
      viewport: '700x245',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  specPad(STEPS.map(step), 'display:grid; grid-template-columns:repeat(2,1fr); gap:4px 28px;');

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
