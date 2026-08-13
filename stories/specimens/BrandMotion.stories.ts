/* States and motion.

   Five states in a row, and the rule they share: colour and border change,
   nothing moves and nothing bounces. 140ms with an ease-out — long enough to
   be seen, short enough that it is not being waited for.

   Drawn rather than composed from `sds-button`: hover, focus and disabled are
   states a still picture cannot hold, so they are painted here. Same reason
   as the focus card. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';

/** The card, as it is drawn. */
const CARD = `<div class="spec-pad" style="display:flex; gap:14px; align-items:center;">
  <div style="font-family:var(--font-mono); font-size:13px; color:var(--text-secondary); padding:6px 12px; border:1px solid var(--border-subtle);">rest</div>
  <div style="font-family:var(--font-mono); font-size:13px; color:var(--text-primary); padding:6px 12px; border:1px solid var(--border-strong); background:var(--surface-inset);">hover</div>
  <div style="font-family:var(--font-mono); font-size:13px; color:var(--text-on-accent); padding:6px 12px; background:var(--accent);">active</div>
  <div style="font-family:var(--font-mono); font-size:13px; color:var(--text-primary); padding:6px 12px; border:1px solid var(--accent); box-shadow:0 0 0 3px var(--accent-ring);">focus</div>
  <div style="font-family:var(--font-mono); font-size:13px; color:var(--text-muted); padding:6px 12px; border:1px solid var(--border-subtle); opacity:0.5;">disabled</div>
  <span class="spec-lbl" style="margin-left:auto;">140ms · ease-out</span>
</div>`;

const meta: Meta = {
  title: 'Specimens/Brand/States & motion',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/brand-motion.card.html',
      group: 'Brand',
      name: 'States & motion',
      subtitle: 'Colour and border only — nothing moves position, nothing bounces',
      viewport: '700x90',
    }),
  },
};

export default meta;
type Story = StoryObj;

export const specimenHtml = (): string => CARD;

export const Specimen: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => html`${unsafeHTML(specimenHtml())}`,
};
