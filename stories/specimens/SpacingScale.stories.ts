/* The space scale.

   A 4px base that thins out as it grows: every step doubles or adds the base
   until 24, then steps in eights. A gap that is not on this list is a gap
   somebody typed.

   Each step is drawn as a square, so the number under it and the size of the
   mark say the same thing — the scale is read rather than looked up. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard, specPad } from '../lib/specimen.ts';

const STEPS = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64] as const;

const step = (px: number): string =>
  `<div style="display:flex; flex-direction:column; align-items:flex-start; gap:6px;">
  <div style="width:${px}px; height:${px}px; background:var(--accent);"></div>
  <div style="font-family:var(--font-mono); font-size:10px; color:var(--text-muted);">${px}</div>
</div>`;

const meta: Meta = {
  title: 'Specimens/Spacing/Space scale',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/spacing-scale.card.html',
      group: 'Spacing',
      name: 'Space scale',
      subtitle: 'A 4px base, thinning out as it grows',
      viewport: '700x130',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string =>
  specPad(STEPS.map(step), 'display:flex; align-items:flex-end; gap:14px;');

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
