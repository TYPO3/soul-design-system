/* Six things that break the mark.

   A misuse card is the one specimen that is allowed to be wrong on purpose,
   and each panel is wrong in exactly one way — recoloured, stretched,
   outlined, re-spaced, boxed, rotated. One fault per panel, or a reader
   cannot tell which of two is the one being warned about. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';

/** The card, as it is drawn. */
const CARD = `<div class="spec-pad" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:22px 18px;">
  <div style="display:flex; flex-direction:column; gap:9px; align-items:flex-start; overflow:hidden;">
    <div style="height:30px; display:flex; align-items:center;"><span style="display:inline-flex; align-items:center; gap:7.5px;"><svg viewBox="0 0 24 24" width="24" height="24" class="sds-signet sds-signet--muted">
<path d="M10 20H3A2 2 0 0 1 1 18V11" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
<rect x="6" y="8" width="2" height="8" rx="1" fill="var(--text-muted)" /><rect x="10" y="8" width="4" height="8" rx="1" fill="var(--text-muted)" /><rect x="16" y="8" width="2" height="8" rx="1" fill="var(--text-muted)" />
<path d="M14 4H21A2 2 0 0 1 23 6V13" fill="none" stroke="#4CA3E0" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:6.8px; font-size:15px; letter-spacing:-0.018em; line-height:1; white-space:nowrap;"><span style="font-weight:600; color:var(--text-primary);">TYPO3</span><span style="display:inline-block; width:1px; height:13px; background:#4CA3E0; flex:none;"></span><span style="font-weight:300; color:var(--text-secondary);">Soul Design System</span></span></span></div>
    <span class="spec-no">no second colour</span>
  </div>
  <div style="display:flex; flex-direction:column; gap:9px; align-items:flex-start; overflow:hidden;">
    <div style="height:30px; display:flex; align-items:center;"><span style="display:inline-flex; align-items:center; gap:7.5px;"><svg viewBox="0 0 24 24" width="24" height="24" class="sds-signet sds-signet--muted">
<path d="M10 20H3A2 2 0 0 1 1 18V11" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
<rect x="6" y="8" width="2" height="8" rx="1" fill="var(--text-muted)" /><rect x="10" y="8" width="4" height="8" rx="1" fill="var(--text-muted)" /><rect x="16" y="8" width="2" height="8" rx="1" fill="var(--text-muted)" />
<path d="M14 4H21A2 2 0 0 1 23 6V13" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:6.8px; font-size:15px; letter-spacing:-0.018em; line-height:1; white-space:nowrap;"><span style="font-weight:600; color:var(--text-primary);">TYPO3</span><span style="display:inline-block; width:1px; height:13px; background:var(--accent); flex:none;"></span><span style="font-weight:600; color:var(--text-primary);">Soul Design System</span></span></span></div>
    <span class="spec-no">no equal weights</span>
  </div>
  <div style="display:flex; flex-direction:column; gap:9px; align-items:flex-start; overflow:hidden;">
    <div style="height:30px; display:flex; align-items:center;"><span style="display:inline-block; transform:scaleX(1.35); transform-origin:left;"><span style="display:inline-flex; align-items:center; gap:7.5px;"><svg viewBox="0 0 24 24" width="24" height="24" class="sds-signet sds-signet--muted">
<path d="M10 20H3A2 2 0 0 1 1 18V11" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
<rect x="6" y="8" width="2" height="8" rx="1" fill="var(--text-muted)" /><rect x="10" y="8" width="4" height="8" rx="1" fill="var(--text-muted)" /><rect x="16" y="8" width="2" height="8" rx="1" fill="var(--text-muted)" />
<path d="M14 4H21A2 2 0 0 1 23 6V13" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:6.8px; font-size:15px; letter-spacing:-0.018em; line-height:1; white-space:nowrap;"><span style="font-weight:600; color:var(--text-primary);">TYPO3</span><span style="display:inline-block; width:1px; height:13px; background:var(--accent); flex:none;"></span><span style="font-weight:300; color:var(--text-secondary);">Soul Design System</span></span></span></span></div>
    <span class="spec-no">never stretched</span>
  </div>
  <div style="display:flex; flex-direction:column; gap:9px; align-items:flex-start; overflow:hidden;">
    <div style="height:30px; display:flex; align-items:center;"><span style="display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; background:var(--accent); border-radius:7px;"><svg viewBox="0 0 16 16" width="24" height="24" class="sds-signet" style="color:var(--text-on-accent);">
<path d="M7 13.5H2A1.5 1.5 0 0 1 0.5 12V8" fill="none" stroke="var(--text-on-accent)" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" />
<rect x="3" y="5" width="2" height="6" rx="0.5" fill="var(--text-on-accent)" /><rect x="6" y="5" width="4" height="6" rx="0.5" fill="var(--text-on-accent)" /><rect x="11" y="5" width="2" height="6" rx="0.5" fill="var(--text-on-accent)" />
<path d="M9 2.5H14A1.5 1.5 0 0 1 15.5 4V8" fill="none" stroke="var(--text-on-accent)" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" />
</svg></span></div>
    <span class="spec-no">never on orange</span>
  </div>
  <div style="display:flex; flex-direction:column; gap:9px; align-items:flex-start; overflow:hidden;">
    <div style="height:30px; display:flex; align-items:center;"><svg viewBox="0 0 32 32" width="24" height="24" class="sds-signet sds-signet--muted">
<path d="M14 27H4A3 3 0 0 1 1 24V15" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
<rect x="8" y="11" width="3" height="10" rx="1" fill="var(--text-muted)" /><rect x="13" y="11" width="6" height="10" rx="1" fill="var(--text-muted)" /><rect x="21" y="11" width="3" height="10" rx="1" fill="var(--text-muted)" />
<path d="M18 5H28A3 3 0 0 1 31 8V17" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
</svg></div>
    <span class="spec-no">never the large drawing when small</span>
  </div>
  <div style="display:flex; flex-direction:column; gap:9px; align-items:flex-start; overflow:hidden;">
    <div style="height:30px; display:flex; align-items:center;"><svg viewBox="0 0 24 24" width="24" height="24" class="sds-signet sds-signet--muted">
<path d="M10 20H3A2 2 0 0 1 1 18V11" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
<rect x="6" y="8" width="2" height="8" rx="1" fill="var(--text-muted)" /><rect x="10" y="8" width="4" height="8" rx="1" fill="var(--text-muted)" /><rect x="16" y="8" width="2" height="8" rx="1" fill="var(--text-muted)" />
<path d="M14 4H21A2 2 0 0 1 23 6V13" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
</svg></div>
    <span class="spec-no">the accent corner is always orange</span>
  </div>
</div>`;

const meta: Meta = {
  title: 'Specimens/Brand/Misuse',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/brand-misuse.card.html',
      group: 'Brand',
      name: 'Misuse',
      subtitle: 'Six things that break the mark',
      viewport: '700x250',
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
