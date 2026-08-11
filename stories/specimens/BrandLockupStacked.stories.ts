/* The stacked lockup, and the app icon.

   For a narrow header, a splash, and anywhere the mark stands alone. Same
   ratios as the primary lockup, turned through ninety degrees — the wordmark
   sits under the signet rather than beside it, and the pipe goes, because a
   vertical rule between two stacked things separates nothing. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';

/** The card, as it is drawn. */
const CARD = `<div style="padding:22px; display:flex; align-items:flex-end; gap:44px; flex-wrap:wrap;">
  <span style="display:inline-flex; flex-direction:column; align-items:flex-start; gap:11px;"><svg viewBox="-6 -6 140 112" width="53.20" height="42.56" class="sds-signet sds-signet--muted">
<path d="M56 96.5H20A16.5 16.5 0 0 1 3.5 80V44" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="39" y="30.5" width="11" height="39" rx="3.5" fill="var(--text-muted)" /><rect x="53.5" y="30.5" width="21" height="39" rx="3.5" fill="var(--text-muted)" /><rect x="78" y="30.5" width="11" height="39" rx="3.5" fill="var(--text-muted)" />
<path d="M72 3.5H108A16.5 16.5 0 0 1 124.5 20V56" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:8.6px; font-size:19px; letter-spacing:-0.018em; line-height:1; white-space:nowrap;"><span style="font-weight:600; color:var(--text-primary);">TYPO3</span><span style="display:inline-block; width:1.71px; height:16.15px; background:var(--accent); flex:none;"></span><span style="font-weight:300; color:var(--text-secondary);">Soul Design System</span></span></span>
  <div style="display:flex; align-items:flex-end; gap:14px;">
    <span style="display:inline-flex; align-items:center; justify-content:center; width:56px; height:56px; background:var(--surface-inset); border-radius:12px;"><svg viewBox="-6 -6 140 112" width="42.00" height="33.60" class="sds-signet sds-signet--muted">
<path d="M56 95.75H20A15.75 15.75 0 0 1 4.25 80V44" fill="none" stroke="var(--text-secondary)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
<rect x="39" y="30.5" width="10.5" height="39" rx="4.25" fill="var(--text-muted)" /><rect x="53.75" y="30.5" width="20.5" height="39" rx="4.25" fill="var(--text-muted)" /><rect x="78.5" y="30.5" width="10.5" height="39" rx="4.25" fill="var(--text-muted)" />
<path d="M72 4.25H108A15.75 15.75 0 0 1 123.75 20V56" fill="none" stroke="var(--accent)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
</svg></span>
    <span style="display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; background:var(--surface-inset); border-radius:9px;"><svg viewBox="-6 -6 140 112" width="30.80" height="24.64" class="sds-signet sds-signet--muted">
<path d="M56 95.75H20A15.75 15.75 0 0 1 4.25 80V44" fill="none" stroke="var(--text-secondary)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
<rect x="39" y="30.5" width="10.5" height="39" rx="4.25" fill="var(--text-muted)" /><rect x="53.75" y="30.5" width="20.5" height="39" rx="4.25" fill="var(--text-muted)" /><rect x="78.5" y="30.5" width="10.5" height="39" rx="4.25" fill="var(--text-muted)" />
<path d="M72 4.25H108A15.75 15.75 0 0 1 123.75 20V56" fill="none" stroke="var(--accent)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
</svg></span>
    <span style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; background:var(--surface-inset); border-radius:6px;"><svg viewBox="-6 -6 140 112" width="22.40" height="17.92" class="sds-signet sds-signet--muted">
<path d="M56 94.5H20A14.5 14.5 0 0 1 5.5 80V44" fill="none" stroke="var(--text-secondary)" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" />
<rect x="39" y="30.5" width="11" height="39" rx="5.5" fill="var(--text-muted)" /><rect x="55.5" y="30.5" width="17" height="39" rx="5.5" fill="var(--text-muted)" /><rect x="78" y="30.5" width="11" height="39" rx="5.5" fill="var(--text-muted)" />
<path d="M72 5.5H108A14.5 14.5 0 0 1 122.5 20V56" fill="none" stroke="var(--accent)" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" />
</svg></span>
  </div>
  <span class="spec-cap">APP ICON &#183; THE SIGNET NEVER SITS ON ORANGE</span>
</div>`;

const meta: Meta = {
  title: 'Specimens/Brand/Stacked lockup & app icon',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/brand-lockup-stacked.card.html',
      group: 'Brand',
      name: 'Stacked lockup & app icon',
      subtitle: 'For narrow headers, splash, and where the mark stands alone',
      viewport: '700x190',
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
