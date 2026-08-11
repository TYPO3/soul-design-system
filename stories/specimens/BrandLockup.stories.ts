/* The primary lockup.

   Signet, wordmark, one orange pipe, at three sizes. Everything is a ratio of
   the type size — the signet is 1.36 × it, the gap 0.5 × it, the pipe 0.09 ×
   it — which is why the lockup survives being set at 13px and at 24px without
   anybody redrawing it.

   The mark is drawn muted here rather than through `sds-signet`: this card is
   about proportion, and the element's ink follows `currentColor`, which would
   make the wordmark and the mark the same weight of grey. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';

/** The card, as it is drawn. */
const CARD = `<div style="padding:24px 22px; display:flex; flex-direction:column; gap:24px;">
  <div><span style="display:inline-flex; align-items:center; gap:12.0px;"><svg viewBox="-6 -6 140 112" width="45.70" height="36.56" class="sds-signet sds-signet--muted">
<path d="M56 96.5H20A16.5 16.5 0 0 1 3.5 80V44" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="39" y="30.5" width="11" height="39" rx="3.5" fill="var(--text-muted)" /><rect x="53.5" y="30.5" width="21" height="39" rx="3.5" fill="var(--text-muted)" /><rect x="78" y="30.5" width="11" height="39" rx="3.5" fill="var(--text-muted)" />
<path d="M72 3.5H108A16.5 16.5 0 0 1 124.5 20V56" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:10.8px; font-size:24px; letter-spacing:-0.018em; line-height:1; white-space:nowrap;"><span style="font-weight:600; color:var(--text-primary);">TYPO3</span><span style="display:inline-block; width:2.16px; height:20.40px; background:var(--accent); flex:none;"></span><span style="font-weight:300; color:var(--text-secondary);">Soul Design System</span></span></span></div>
  <div style="display:flex; align-items:center; gap:38px; flex-wrap:wrap; padding-top:18px; border-top:1px solid var(--border-subtle);">
    <span style="display:inline-flex; align-items:center; gap:8.5px;"><svg viewBox="-6 -6 140 112" width="32.37" height="25.89" class="sds-signet sds-signet--muted">
<path d="M56 95.75H20A15.75 15.75 0 0 1 4.25 80V44" fill="none" stroke="var(--text-secondary)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
<rect x="39" y="30.5" width="10.5" height="39" rx="4.25" fill="var(--text-muted)" /><rect x="53.75" y="30.5" width="20.5" height="39" rx="4.25" fill="var(--text-muted)" /><rect x="78.5" y="30.5" width="10.5" height="39" rx="4.25" fill="var(--text-muted)" />
<path d="M72 4.25H108A15.75 15.75 0 0 1 123.75 20V56" fill="none" stroke="var(--accent)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:7.7px; font-size:17px; letter-spacing:-0.018em; line-height:1; white-space:nowrap;"><span style="font-weight:600; color:var(--text-primary);">TYPO3</span><span style="display:inline-block; width:1.53px; height:14.45px; background:var(--accent); flex:none;"></span><span style="font-weight:300; color:var(--text-secondary);">Soul Design System</span></span></span><span style="display:inline-flex; align-items:center; gap:6.5px;"><svg viewBox="-6 -6 140 112" width="24.75" height="19.80" class="sds-signet sds-signet--muted">
<path d="M56 94.5H20A14.5 14.5 0 0 1 5.5 80V44" fill="none" stroke="var(--text-secondary)" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" />
<rect x="39" y="30.5" width="11" height="39" rx="5.5" fill="var(--text-muted)" /><rect x="55.5" y="30.5" width="17" height="39" rx="5.5" fill="var(--text-muted)" /><rect x="78" y="30.5" width="11" height="39" rx="5.5" fill="var(--text-muted)" />
<path d="M72 5.5H108A14.5 14.5 0 0 1 122.5 20V56" fill="none" stroke="var(--accent)" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:5.9px; font-size:13px; letter-spacing:-0.018em; line-height:1; white-space:nowrap;"><span style="font-weight:600; color:var(--text-primary);">TYPO3</span><span style="display:inline-block; width:1.17px; height:11.05px; background:var(--accent); flex:none;"></span><span style="font-weight:300; color:var(--text-secondary);">Soul Design System</span></span></span>
    <span class="spec-cap">SIGNET 1.36 &#215; TYPE &#183; GAP 0.5 &#215; TYPE</span>
  </div>
</div>`;

const meta: Meta = {
  title: 'Specimens/Brand/Primary lockup',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/brand-lockup.card.html',
      group: 'Brand',
      name: 'Primary lockup',
      subtitle: 'Signet, wordmark, one orange pipe — signet at 1.36 × the type size',
      viewport: '700x215',
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
