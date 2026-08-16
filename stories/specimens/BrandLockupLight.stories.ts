/* The primary lockup on warm paper.

   The same construction as the dark one, and the card exists to prove exactly
   that: the mark carries no colour of its own beyond the accent, so both
   modes are one drawing. It pins `light` on purpose — a theme toggle around
   it must not flip it, or the pair stops being a pair. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';

/** The card, as it is drawn. */
const CARD = `<div style="padding:24px 22px; display:flex; flex-direction:column; gap:24px;">
  <div><span style="display:inline-flex; align-items:center; gap:12.0px;"><svg viewBox="0 0 32 32" width="32" height="32" class="sds-signet sds-signet--muted">
<path d="M14 27H4A3 3 0 0 1 1 24V15" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
<rect x="8" y="11" width="3" height="10" rx="1" fill="var(--text-muted)" /><rect x="13" y="11" width="6" height="10" rx="1" fill="var(--text-muted)" /><rect x="21" y="11" width="3" height="10" rx="1" fill="var(--text-muted)" />
<path d="M18 5H28A3 3 0 0 1 31 8V17" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:10.8px; font-size:24px; letter-spacing:-0.018em; line-height:1; white-space:nowrap;"><span style="font-weight:600; color:var(--text-primary);">TYPO3</span><span style="display:inline-block; width:2px; height:20px; background:var(--accent); flex:none;"></span><span style="font-weight:300; color:var(--text-secondary);">Soul Design System</span></span></span></div>
  <div style="display:flex; align-items:center; gap:38px; flex-wrap:wrap; padding-top:18px; border-top:1px solid var(--border-subtle);"><span style="display:inline-flex; align-items:center; gap:8.5px;"><svg viewBox="0 0 24 24" width="24" height="24" class="sds-signet sds-signet--muted">
<path d="M10 20H3A2 2 0 0 1 1 18V11" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
<rect x="6" y="8" width="2" height="8" rx="1" fill="var(--text-muted)" /><rect x="10" y="8" width="4" height="8" rx="1" fill="var(--text-muted)" /><rect x="16" y="8" width="2" height="8" rx="1" fill="var(--text-muted)" />
<path d="M14 4H21A2 2 0 0 1 23 6V13" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:7.7px; font-size:17px; letter-spacing:-0.018em; line-height:1; white-space:nowrap;"><span style="font-weight:600; color:var(--text-primary);">TYPO3</span><span style="display:inline-block; width:2px; height:14px; background:var(--accent); flex:none;"></span><span style="font-weight:300; color:var(--text-secondary);">Soul Design System</span></span></span><span style="display:inline-flex; align-items:center; gap:6.5px;"><svg viewBox="0 0 16 16" width="16" height="16" class="sds-signet sds-signet--muted">
<path d="M7 13.5H2A1.5 1.5 0 0 1 0.5 12V8" fill="none" stroke="var(--text-secondary)" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" />
<rect x="3" y="5" width="2" height="6" rx="0.5" fill="var(--text-muted)" /><rect x="6" y="5" width="4" height="6" rx="0.5" fill="var(--text-muted)" /><rect x="11" y="5" width="2" height="6" rx="0.5" fill="var(--text-muted)" />
<path d="M9 2.5H14A1.5 1.5 0 0 1 15.5 4V8" fill="none" stroke="var(--accent)" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:5.9px; font-size:13px; letter-spacing:-0.018em; line-height:1; white-space:nowrap;"><span style="font-weight:600; color:var(--text-primary);">TYPO3</span><span style="display:inline-block; width:1px; height:11px; background:var(--accent); flex:none;"></span><span style="font-weight:300; color:var(--text-secondary);">Soul Design System</span></span></span></div>
</div>`;

const meta: Meta = {
  title: 'Specimens/Brand/Primary lockup — light',
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/brand-lockup-light.card.html',
      group: 'Brand',
      name: 'Primary lockup — light',
      subtitle: 'The same lockup on warm paper',
      viewport: '700x156',
      theme: 'light',
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
