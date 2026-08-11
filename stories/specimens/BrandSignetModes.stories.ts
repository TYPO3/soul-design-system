/* The signet in context, and in both modes.

   Inline, the mark follows the interface it sits in; linked as a file, it
   follows the operating system instead — an `<img>` inherits nothing, so the
   file carries its own two greys and a `prefers-color-scheme` query. The card
   shows both, and the 16px floor in place under them. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';

/** The card, as it is drawn. */
const CARD = `<div class="spec" style="--spec-gap:24px">

  <div class="spec-note" style="max-width:76ch;">
    Drawn on the Dev&nbsp;Companion mark, a worked example rather than the system's
    own. What this card documents is the two mechanisms &#8212; inlined follows the UI,
    linked follows the OS &#8212; and both apply to every mark in the family.
  </div>

  <div>
    <div style="display:flex; align-items:baseline; gap:12px; padding-bottom:9px; margin-bottom:14px; border-bottom:1px solid var(--border-subtle);">
      <span style="font-size:14px; font-weight:600;">Light and dark</span><span style="font-size:12px; color:var(--text-muted);">two mechanisms, because linked and inlined SVGs behave differently</span>
    </div>
    <div style="border:1px solid var(--border-subtle); border-radius:var(--radius-card); overflow:hidden; margin-bottom:12px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--border-subtle);">
        <div data-theme="dark" style="background:var(--surface-canvas); padding:16px;"><div style="display:flex; align-items:flex-end; gap:22px; flex-wrap:wrap;"><svg viewBox="0 0 128 100" width="56.32" height="44.00" class="sds-signet sds-signet--muted">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="currentColor" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.50" width="56" height="7" rx="3.50" fill="var(--text-muted)" /><rect x="22" y="46.50" width="36" height="7" rx="3.50" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.50" width="66" height="7" rx="3.50" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet sds-signet--muted">
<path d="M123.75 71.00V80A15.75 15.75 0 0 1 108 95.75H20A15.75 15.75 0 0 1 4.25 80V20A15.75 15.75 0 0 1 20 4.25H75.00" fill="none" stroke="currentColor" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="29.75" width="52" height="8.5" rx="4.25" fill="var(--text-muted)" /><rect x="22" y="61.75" width="66" height="8.5" rx="4.25" fill="var(--accent)" />
<path d="M92.00 4.25H108A15.75 15.75 0 0 1 123.75 20V54.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="20.48" height="16.00" class="sds-signet sds-signet--muted">
<path d="M122.5 80.00V80A14.5 14.5 0 0 1 108 94.5H20A14.5 14.5 0 0 1 5.5 80V20A14.5 14.5 0 0 1 20 5.5H66.00" fill="none" stroke="currentColor" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="28.50" width="52" height="11" rx="5.50" fill="var(--text-muted)" /><rect x="22" y="60.50" width="66" height="11" rx="5.50" fill="var(--accent)" />
<path d="M88.00 5.5H108A14.5 14.5 0 0 1 122.5 20V58.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:10px; margin-left:6px;"><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet sds-signet--muted">
<path d="M123.75 71.00V80A15.75 15.75 0 0 1 108 95.75H20A15.75 15.75 0 0 1 4.25 80V20A15.75 15.75 0 0 1 20 4.25H75.00" fill="none" stroke="currentColor" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="29.75" width="52" height="8.5" rx="4.25" fill="var(--text-muted)" /><rect x="22" y="61.75" width="66" height="8.5" rx="4.25" fill="var(--accent)" />
<path d="M92.00 4.25H108A15.75 15.75 0 0 1 123.75 20V54.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:7.7px; font-size:17px; letter-spacing:-0.018em; line-height:1; white-space:nowrap;"><span style="font-weight:600; color:var(--text-primary);">TYPO3</span><span style="display:inline-block; width:1.53px; height:14.45px; background:var(--accent); flex:none;"></span><span style="font-weight:300; color:var(--text-secondary);">Soul Design System</span></span></span></div></div>
        <div data-theme="light" style="background:var(--surface-canvas); padding:16px;"><div style="display:flex; align-items:flex-end; gap:22px; flex-wrap:wrap;"><svg viewBox="0 0 128 100" width="56.32" height="44.00" class="sds-signet sds-signet--muted">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="currentColor" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.50" width="56" height="7" rx="3.50" fill="var(--text-muted)" /><rect x="22" y="46.50" width="36" height="7" rx="3.50" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.50" width="66" height="7" rx="3.50" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet sds-signet--muted">
<path d="M123.75 71.00V80A15.75 15.75 0 0 1 108 95.75H20A15.75 15.75 0 0 1 4.25 80V20A15.75 15.75 0 0 1 20 4.25H75.00" fill="none" stroke="currentColor" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="29.75" width="52" height="8.5" rx="4.25" fill="var(--text-muted)" /><rect x="22" y="61.75" width="66" height="8.5" rx="4.25" fill="var(--accent)" />
<path d="M92.00 4.25H108A15.75 15.75 0 0 1 123.75 20V54.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="20.48" height="16.00" class="sds-signet sds-signet--muted">
<path d="M122.5 80.00V80A14.5 14.5 0 0 1 108 94.5H20A14.5 14.5 0 0 1 5.5 80V20A14.5 14.5 0 0 1 20 5.5H66.00" fill="none" stroke="currentColor" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="28.50" width="52" height="11" rx="5.50" fill="var(--text-muted)" /><rect x="22" y="60.50" width="66" height="11" rx="5.50" fill="var(--accent)" />
<path d="M88.00 5.5H108A14.5 14.5 0 0 1 122.5 20V58.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:10px; margin-left:6px;"><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet sds-signet--muted">
<path d="M123.75 71.00V80A15.75 15.75 0 0 1 108 95.75H20A15.75 15.75 0 0 1 4.25 80V20A15.75 15.75 0 0 1 20 4.25H75.00" fill="none" stroke="currentColor" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="29.75" width="52" height="8.5" rx="4.25" fill="var(--text-muted)" /><rect x="22" y="61.75" width="66" height="8.5" rx="4.25" fill="var(--accent)" />
<path d="M92.00 4.25H108A15.75 15.75 0 0 1 123.75 20V54.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:7.7px; font-size:17px; letter-spacing:-0.018em; line-height:1; white-space:nowrap;"><span style="font-weight:600; color:var(--text-primary);">TYPO3</span><span style="display:inline-block; width:1.53px; height:14.45px; background:var(--accent); flex:none;"></span><span style="font-weight:300; color:var(--text-secondary);">Soul Design System</span></span></span></div></div>
      </div>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
      <div class="spec-note"><span class="sds-mono">INLINE &#183; IN THE PRODUCT</span><br />Paste the markup. The frame is <span class="spec-cap">currentColor</span> and the lines are <span class="spec-cap">--text-muted</span> / <span class="spec-cap">--accent</span>, so the mark follows whatever mode the UI is in &#8212; including a subtree that forces one against the OS. This is what the panes above show.</div>
      <div class="spec-note"><span class="sds-mono">LINKED &#183; FAVICON, TAB, README</span><br />The three files carry <span class="spec-cap">prefers-color-scheme</span> and follow the OS. They cannot inherit <span class="spec-cap">currentColor</span>, so their base is a mid warm grey that holds either way. Correct for anywhere the OS decides &#8212; never for a UI that sets its own mode.</div>
    </div>
  </div>

  <div>
    <div style="display:flex; align-items:baseline; gap:12px; padding-bottom:9px; margin-bottom:14px; border-bottom:1px solid var(--border-subtle);">
      <span style="font-size:14px; font-weight:600;">In place</span><span style="font-size:12px; color:var(--text-muted);">tab strip, server list, header</span>
    </div>
    <div style="display:flex; flex-direction:column; gap:14px;">
      <div style="display:flex; align-items:center; gap:0; background:var(--surface-sunken); border:1px solid var(--border-subtle); border-radius:var(--radius-card); padding:6px; width:fit-content;">
        <span style="display:flex; align-items:center; gap:7px; background:var(--surface-inset); border-radius:4px; padding:6px 12px;"><svg viewBox="0 0 128 100" width="20.48" height="16.00" class="sds-signet sds-signet--muted">
<path d="M122.5 80.00V80A14.5 14.5 0 0 1 108 94.5H20A14.5 14.5 0 0 1 5.5 80V20A14.5 14.5 0 0 1 20 5.5H66.00" fill="none" stroke="currentColor" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="28.50" width="52" height="11" rx="5.50" fill="var(--text-muted)" />
<rect x="22" y="60.50" width="66" height="11" rx="5.50" fill="var(--accent)" />
<path d="M88.00 5.5H108A14.5 14.5 0 0 1 122.5 20V58.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="font-size:12px; color:var(--text-primary);">Soul Design System</span></span>
        <span style="display:flex; align-items:center; gap:7px; padding:6px 12px;"><span style="width:16px; height:16px; border-radius:3px; background:var(--border-strong);"></span><span style="font-size:12px; color:var(--text-muted);">docs.typo3.org</span></span>
      </div>
      <div style="display:flex; align-items:center; gap:10px; border:1px solid var(--border-subtle); border-radius:var(--radius-card); padding:9px 12px; width:fit-content;">
        <svg viewBox="0 0 128 100" width="25.60" height="20.00" class="sds-signet">
<path d="M123.75 71.00V80A15.75 15.75 0 0 1 108 95.75H20A15.75 15.75 0 0 1 4.25 80V20A15.75 15.75 0 0 1 20 4.25H75.00" fill="none" stroke="var(--text-secondary)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="29.75" width="52" height="8.5" rx="4.25" fill="var(--text-muted)" /><rect x="22" y="61.75" width="66" height="8.5" rx="4.25" fill="var(--accent)" />
<path d="M92.00 4.25H108A15.75 15.75 0 0 1 123.75 20V54.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="font-family:var(--font-mono); font-size:13px; color:var(--text-primary);">typo3-support-app</span><span style="font-family:var(--font-mono); font-size:11px; color:var(--status-ok);">&#9679; running</span>
      </div>
      <div style="display:flex; align-items:center; gap:11px;"><svg viewBox="0 0 128 100" width="38.40" height="30.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.50" width="56" height="7" rx="3.50" fill="var(--text-muted)" /><rect x="22" y="46.50" width="36" height="7" rx="3.50" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.50" width="66" height="7" rx="3.50" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:9.9px; font-size:22px; letter-spacing:-0.018em; line-height:1; white-space:nowrap;"><span style="font-weight:600; color:var(--text-primary);">TYPO3</span><span style="display:inline-block; width:1.98px; height:18.70px; background:var(--accent); flex:none;"></span><span style="font-weight:300; color:var(--text-secondary);">Soul Design System</span></span></div>
    </div>
  </div>

</div>`;

const meta: Meta = {
  title: 'Specimens/Brand/Signet — modes & context',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/brand-signet-modes.card.html',
      group: 'Brand',
      name: 'Signet — modes & context',
      subtitle: 'Inline follows the UI, linked follows the OS — and the 16px floor in place',
      viewport: '700x608',
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
