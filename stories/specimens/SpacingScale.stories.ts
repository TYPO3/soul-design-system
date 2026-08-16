/* The space scale.

   A 4px base, halved below 16 and thinning out above 24. The half-steps are
   the small end of the grid, where a glyph beside a word and a label over its
   value are read: without them the value gets typed instead. A gap that is
   not on this list is a gap somebody typed.

   Each step is drawn as a square, so the number under it and the size of the
   mark say the same thing — the scale is read rather than looked up. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard, specPad } from '../lib/specimen.ts';

const STEPS = [2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48, 64] as const;

const step = (px: number): string =>
  `<div style="display:flex; flex-direction:column; align-items:flex-start; gap:6px;">
  <div style="width:${px}px; height:${px}px; background:var(--accent);"></div>
  <div style="font-family:var(--font-mono); font-size:10px; color:var(--text-muted);">${px}</div>
</div>`;

const meta: Meta = {
  title: 'Specimens/Spacing/Space scale',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/spacing-scale.card.html',
      group: 'Spacing',
      name: 'Space scale',
      subtitle: 'A 4px base, halved below 16 and thinning out above 24',
      viewport: '700x126',
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
