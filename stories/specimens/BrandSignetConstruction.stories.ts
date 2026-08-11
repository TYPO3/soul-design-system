/* How the signet is built.

   The grid, the stroke, the rounding and the crop marks, at the size the
   construction is legible — one rounding throughout, half the stroke, which
   is the single rule the whole drawing follows.

   The artwork is the specimen. This card is a drawing of a drawing, and there
   is no component that could produce it: the geometry is the subject, so the
   construction lines, the measurements and the mark itself are one SVG. */

import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { dsCard } from '../lib/specimen.ts';

/** The card, as it is drawn. */
const CARD = `<div class="spec" style="--spec-gap:22px">

  <div class="sds-note sds-note--info">
    <span class="sds-note__icon"><svg class="sds-icon" viewBox="0 0 16 16"><g fill="currentColor"><path d="M8,2c3.3000002,0,6,2.6999998,6,6s-2.6999998,6-6,6s-6-2.6999998-6-6S4.6999998,2,8,2 M8,1C4.0999999,1,1,4.0999999,1,8s3.0999999,7,7,7s7-3.1000004,7-7S11.8999996,1,8,1L8,1z"></path><path d="M7,4.999999C7,4.4477148,7.4477148,4,7.999999,4H8.000001C8.5522852,4,9,4.4477148,9,4.999999V5.000001C9,5.5522852,8.5522852,6,8.000001,6H7.999999C7.4477148,6,7,5.5522852,7,5.000001V4.999999z"></path><path d="M7,7.999999C7,7.4477148,7.4477148,7,7.999999,7H8.000001C8.5522852,7,9,7.4477148,9,7.999999v3.0000019C9,11.5522852,8.5522852,12,8.000001,12H7.999999C7.4477148,12,7,11.5522852,7,11.000001V7.999999z"></path></g></svg></span>
    <div>
      <div class="sds-note__title">The rules are the deliverable, not this drawing</div>
      <div class="sds-note__body">
        The mark below is one worked example of them, carried over from the Dev&nbsp;Companion
        prototype &#8212; a reference implementation, not an approved product mark. A product
        adopting this system draws its own signet to the same construction. A second
        worked example, for TYPO3&nbsp;Tryout, is at the foot of this card: same frame,
        same marker, same rounding, a different word inside.
      </div>
    </div>
  </div>

  <div style="display:flex; align-items:center; gap:34px; flex-wrap:wrap;">
    <svg viewBox="0 0 128 100" width="112.64" height="88.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg>
    <div style="display:flex; flex-direction:column; gap:7px;">
      <div class="sds-mono">DRAWN IN A 128 &#215; 100 BOX</div>
      <div class="spec-cap">stroke &#183; 7 units, round caps and round joins</div>
      <div class="spec-cap">rounding &#183; <span style="color:var(--text-accent-quiet);">3.5 units everywhere</span> &#8212; half the stroke. Frame caps, line ends and the marker&#8217;s three points are one radius</div>
      <div class="spec-cap">gap &#183; 7 units, ink to ink, never less than the stroke</div>
      <div class="spec-cap">marker &#183; 36 across, 52 down &#8212; taller than wide, like the Soul</div>
      <div class="spec-cap">corner radius &#183; 20 units, shared by frame and marker</div>
      <div class="spec-cap">session lines &#183; 56 / 36 / 66 units, the last one accent</div>
      <div class="sds-mono" style="color:var(--text-secondary);">the frame is one open path &#8212; both ends are caps, not cuts</div>
      <div class="sds-mono" style="color:var(--text-secondary);">the frame path stops gap + stroke short, because both caps reach half a stroke further</div>
    </div>
    <div style="display:flex; align-items:center; gap:11px;"><svg viewBox="0 0 128 100" width="38.40" height="30.00" class="sds-signet">
<path d="M56 96.5H20A16.5 16.5 0 0 1 3.5 80V44" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="39" y="30.5" width="11" height="39" rx="3.5" fill="var(--text-muted)" /><rect x="53.5" y="30.5" width="21" height="39" rx="3.5" fill="var(--text-muted)" /><rect x="78" y="30.5" width="11" height="39" rx="3.5" fill="var(--text-muted)" />
<path d="M72 3.5H108A16.5 16.5 0 0 1 124.5 20V56" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><span style="display:inline-flex; align-items:center; gap:9.9px; font-size:22px; letter-spacing:-0.018em; line-height:1; white-space:nowrap;"><span style="font-weight:600; color:var(--text-primary);">TYPO3</span><span style="display:inline-block; width:1.98px; height:18.70px; background:var(--accent); flex:none;"></span><span style="font-weight:300; color:var(--text-secondary);">Soul Design System</span></span></div>
  </div>

  <div>
    <div style="display:flex; align-items:baseline; gap:12px; padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid var(--border-subtle);">
      <span style="font-size:14px; font-weight:600;">Marker rounding</span><span style="font-size:12px; color:var(--text-muted);">it has to be the radius the rest of the mark already uses</span>
    </div>
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px;">      <div style="display:flex; flex-direction:column; gap:10px; padding:13px; border:1px solid var(--border-subtle); border-radius:var(--radius-card);">
      <div style="display:flex; align-items:center; gap:14px; min-height:50px;"><svg viewBox="0 0 128 100" width="53.76" height="42.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M89.75 1.25H108A18.75 18.75 0 0 1 126.75 20V54.25Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M89.75 1.25H108A18.75 18.75 0 0 1 126.75 20V54.25Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="21.76" height="17.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M89.75 1.25H108A18.75 18.75 0 0 1 126.75 20V54.25Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
</svg></div>
      <div><div style="font-family:var(--font-mono); font-size:10px; color:var(--text-muted);">2.5 &#183; its own value</div><div style="font-size:11px; line-height:1.4; color:var(--text-secondary); margin-top:3px;">Sharper than the caps beside it. Two rounding systems in one mark, and the eye catches it.</div></div>
    </div>      <div style="display:flex; flex-direction:column; gap:10px; padding:13px; border:1px solid var(--accent); border-radius:var(--radius-card);">
      <div style="display:flex; align-items:center; gap:14px; min-height:50px;"><svg viewBox="0 0 128 100" width="53.76" height="42.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="21.76" height="17.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg></div>
      <div><div style="font-family:var(--font-mono); font-size:10px; color:var(--accent);">3.5 &#183; chosen, = &#189; stroke</div><div style="font-size:11px; line-height:1.4; color:var(--text-secondary); margin-top:3px;">The same radius as the frame caps and the line ends. One rule for the whole mark.</div></div>
    </div>      <div style="display:flex; flex-direction:column; gap:10px; padding:13px; border:1px solid var(--border-subtle); border-radius:var(--radius-card);">
      <div style="display:flex; align-items:center; gap:14px; min-height:50px;"><svg viewBox="0 0 128 100" width="53.76" height="42.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M94.00 5.5H108A14.5 14.5 0 0 1 122.5 20V50.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M94.00 5.5H108A14.5 14.5 0 0 1 122.5 20V50.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="21.76" height="17.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M94.00 5.5H108A14.5 14.5 0 0 1 122.5 20V50.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" />
</svg></div>
      <div><div style="font-family:var(--font-mono); font-size:10px; color:var(--text-muted);">5.5 &#183; softer than the caps</div><div style="font-size:11px; line-height:1.4; color:var(--text-secondary); margin-top:3px;">Rounder than everything around it; the diagonal stops being a cut.</div></div>
    </div></div>
  </div>

  <div>
    <div style="display:flex; align-items:baseline; gap:12px; padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid var(--border-subtle);">
      <span style="font-size:14px; font-weight:600;">Marker height</span><span style="font-size:12px; color:var(--text-muted);">how far it runs down the right edge</span>
    </div>
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px;">      <div style="display:flex; flex-direction:column; gap:10px; padding:13px; border:1px solid var(--border-subtle); border-radius:var(--radius-card);">
      <div style="display:flex; align-items:center; gap:14px; min-height:50px;"><svg viewBox="0 0 128 100" width="53.76" height="42.00" class="sds-signet">
<path d="M124.5 56.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V42.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet">
<path d="M124.5 56.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V42.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="21.76" height="17.00" class="sds-signet">
<path d="M124.5 56.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V42.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg></div>
      <div><div style="font-family:var(--font-mono); font-size:10px; color:var(--text-muted);">42 down</div><div style="font-size:11px; line-height:1.4; color:var(--text-secondary); margin-top:3px;">Nearly square. Reads as a corner, not as a form with a direction.</div></div>
    </div>      <div style="display:flex; flex-direction:column; gap:10px; padding:13px; border:1px solid var(--accent); border-radius:var(--radius-card);">
      <div style="display:flex; align-items:center; gap:14px; min-height:50px;"><svg viewBox="0 0 128 100" width="53.76" height="42.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="21.76" height="17.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg></div>
      <div><div style="font-family:var(--font-mono); font-size:10px; color:var(--accent);">52 down &#183; chosen</div><div style="font-size:11px; line-height:1.4; color:var(--text-secondary); margin-top:3px;">A 1 : 1.44 form &#8212; close to the Soul&#8217;s own proportion, and the diagonal gets a real slope.</div></div>
    </div>      <div style="display:flex; flex-direction:column; gap:10px; padding:13px; border:1px solid var(--border-subtle); border-radius:var(--radius-card);">
      <div style="display:flex; align-items:center; gap:14px; min-height:50px;"><svg viewBox="0 0 128 100" width="53.76" height="42.00" class="sds-signet">
<path d="M124.5 76.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V62.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet">
<path d="M124.5 76.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V62.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="21.76" height="17.00" class="sds-signet">
<path d="M124.5 76.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V62.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg></div>
      <div><div style="font-family:var(--font-mono); font-size:10px; color:var(--text-muted);">62 down</div><div style="font-size:11px; line-height:1.4; color:var(--text-secondary); margin-top:3px;">Long. Strong reference, but it eats the frame&#8217;s right side and crowds the accent line.</div></div>
    </div></div>
  </div>

  <div>
    <div style="display:flex; align-items:baseline; gap:12px; padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid var(--border-subtle);">
      <span style="font-size:14px; font-weight:600;">Marker width</span><span style="font-size:12px; color:var(--text-muted);">across the top edge</span>
    </div>
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px;">      <div style="display:flex; flex-direction:column; gap:10px; padding:13px; border:1px solid var(--border-subtle); border-radius:var(--radius-card);">
      <div style="display:flex; align-items:center; gap:14px; min-height:50px;"><svg viewBox="0 0 128 100" width="53.76" height="42.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H84.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M98.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H84.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M98.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="21.76" height="17.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H84.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M98.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg></div>
      <div><div style="font-family:var(--font-mono); font-size:10px; color:var(--text-muted);">30 across</div><div style="font-size:11px; line-height:1.4; color:var(--text-secondary); margin-top:3px;">Narrow and steep. Sharpest silhouette, weakest at 17&#8239;px.</div></div>
    </div>      <div style="display:flex; flex-direction:column; gap:10px; padding:13px; border:1px solid var(--accent); border-radius:var(--radius-card);">
      <div style="display:flex; align-items:center; gap:14px; min-height:50px;"><svg viewBox="0 0 128 100" width="53.76" height="42.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="21.76" height="17.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg></div>
      <div><div style="font-family:var(--font-mono); font-size:10px; color:var(--accent);">36 across &#183; chosen</div><div style="font-size:11px; line-height:1.4; color:var(--text-secondary); margin-top:3px;">The width chosen, with the added drop.</div></div>
    </div>      <div style="display:flex; flex-direction:column; gap:10px; padding:13px; border:1px solid var(--border-subtle); border-radius:var(--radius-card);">
      <div style="display:flex; align-items:center; gap:14px; min-height:50px;"><svg viewBox="0 0 128 100" width="53.76" height="42.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H70.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M84.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H70.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M84.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="21.76" height="17.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H70.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M84.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg></div>
      <div><div style="font-family:var(--font-mono); font-size:10px; color:var(--text-muted);">44 across</div><div style="font-size:11px; line-height:1.4; color:var(--text-secondary); margin-top:3px;">Wide enough that the marker stops being a corner and becomes a lid.</div></div>
    </div></div>
  </div>

  <div>
    <div style="display:flex; align-items:baseline; gap:12px; padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid var(--border-subtle);">
      <span style="font-size:14px; font-weight:600;">Stroke weight</span><span style="font-size:12px; color:var(--text-muted);">the gap and the rounding both follow it</span>
    </div>
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px;">      <div style="display:flex; flex-direction:column; gap:10px; padding:13px; border:1px solid var(--border-subtle); border-radius:var(--radius-card);">
      <div style="display:flex; align-items:center; gap:14px; min-height:50px;"><svg viewBox="0 0 128 100" width="53.76" height="42.00" class="sds-signet">
<path d="M125 64.00V80A17 17 0 0 1 108 97H20A17 17 0 0 1 3 80V20A17 17 0 0 1 20 3H80.00" fill="none" stroke="var(--text-secondary)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="27" width="56" height="6" rx="3" fill="var(--text-muted)" /><rect x="22" y="47" width="36" height="6" rx="3" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="67" width="66" height="6" rx="3" fill="var(--accent)" />
<path d="M92.00 3H108A17 17 0 0 1 125 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet">
<path d="M125 64.00V80A17 17 0 0 1 108 97H20A17 17 0 0 1 3 80V20A17 17 0 0 1 20 3H80.00" fill="none" stroke="var(--text-secondary)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="27" width="56" height="6" rx="3" fill="var(--text-muted)" /><rect x="22" y="47" width="36" height="6" rx="3" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="67" width="66" height="6" rx="3" fill="var(--accent)" />
<path d="M92.00 3H108A17 17 0 0 1 125 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="21.76" height="17.00" class="sds-signet">
<path d="M125 64.00V80A17 17 0 0 1 108 97H20A17 17 0 0 1 3 80V20A17 17 0 0 1 20 3H80.00" fill="none" stroke="var(--text-secondary)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="27" width="56" height="6" rx="3" fill="var(--text-muted)" /><rect x="22" y="47" width="36" height="6" rx="3" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="67" width="66" height="6" rx="3" fill="var(--accent)" />
<path d="M92.00 3H108A17 17 0 0 1 125 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" />
</svg></div>
      <div><div style="font-family:var(--font-mono); font-size:10px; color:var(--text-muted);">6 units</div><div style="font-size:11px; line-height:1.4; color:var(--text-secondary); margin-top:3px;">Finer frame, more air. Goes weak below 20&#8239;px.</div></div>
    </div>      <div style="display:flex; flex-direction:column; gap:10px; padding:13px; border:1px solid var(--accent); border-radius:var(--radius-card);">
      <div style="display:flex; align-items:center; gap:14px; min-height:50px;"><svg viewBox="0 0 128 100" width="53.76" height="42.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="21.76" height="17.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg></div>
      <div><div style="font-family:var(--font-mono); font-size:10px; color:var(--accent);">7 units &#183; chosen</div><div style="font-size:11px; line-height:1.4; color:var(--text-secondary); margin-top:3px;">Holds from 17&#8239;px up and matches the weight of the session lines.</div></div>
    </div>      <div style="display:flex; flex-direction:column; gap:10px; padding:13px; border:1px solid var(--border-subtle); border-radius:var(--radius-card);">
      <div style="display:flex; align-items:center; gap:14px; min-height:50px;"><svg viewBox="0 0 128 100" width="53.76" height="42.00" class="sds-signet">
<path d="M123.75 69.00V80A15.75 15.75 0 0 1 108 95.75H20A15.75 15.75 0 0 1 4.25 80V20A15.75 15.75 0 0 1 20 4.25H75.00" fill="none" stroke="var(--text-secondary)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="25.75" width="56" height="8.5" rx="4.25" fill="var(--text-muted)" /><rect x="22" y="45.75" width="36" height="8.5" rx="4.25" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="65.75" width="66" height="8.5" rx="4.25" fill="var(--accent)" />
<path d="M92.00 4.25H108A15.75 15.75 0 0 1 123.75 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="30.72" height="24.00" class="sds-signet">
<path d="M123.75 69.00V80A15.75 15.75 0 0 1 108 95.75H20A15.75 15.75 0 0 1 4.25 80V20A15.75 15.75 0 0 1 20 4.25H75.00" fill="none" stroke="var(--text-secondary)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="25.75" width="56" height="8.5" rx="4.25" fill="var(--text-muted)" /><rect x="22" y="45.75" width="36" height="8.5" rx="4.25" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="65.75" width="66" height="8.5" rx="4.25" fill="var(--accent)" />
<path d="M92.00 4.25H108A15.75 15.75 0 0 1 123.75 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
</svg><svg viewBox="0 0 128 100" width="21.76" height="17.00" class="sds-signet">
<path d="M123.75 69.00V80A15.75 15.75 0 0 1 108 95.75H20A15.75 15.75 0 0 1 4.25 80V20A15.75 15.75 0 0 1 20 4.25H75.00" fill="none" stroke="var(--text-secondary)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="25.75" width="56" height="8.5" rx="4.25" fill="var(--text-muted)" /><rect x="22" y="45.75" width="36" height="8.5" rx="4.25" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="65.75" width="66" height="8.5" rx="4.25" fill="var(--accent)" />
<path d="M92.00 4.25H108A15.75 15.75 0 0 1 123.75 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="8.5" stroke-linejoin="round" stroke-linecap="round" />
</svg></div>
      <div><div style="font-family:var(--font-mono); font-size:10px; color:var(--text-muted);">8.5 units</div><div style="font-size:11px; line-height:1.4; color:var(--text-secondary); margin-top:3px;">Heavy. The interior closes up and the lines lose their separation.</div></div>
    </div></div>
  </div>

  <div class="spec-cap">A SECOND PRODUCT, THE SAME CONSTRUCTION</div>

  <div style="display:flex; gap:30px; align-items:flex-start;">
    <div style="display:flex; flex-direction:column; gap:9px; align-items:flex-start; flex:none;">
      <svg viewBox="0 0 128 100" width="112.64" height="88.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<rect x="22" y="26.5" width="56" height="7" rx="3.5" fill="var(--text-muted)" /><rect x="22" y="46.5" width="36" height="7" rx="3.5" fill="var(--text-muted)" opacity="0.55" /><rect x="22" y="66.5" width="66" height="7" rx="3.5" fill="var(--accent)" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg>
      <div class="spec-cap">DEV COMPANION</div>
      <div class="spec-note" style="max-width:20ch;">A session ending in one answer.</div>
    </div>
    <div style="display:flex; flex-direction:column; gap:9px; align-items:flex-start; flex:none;">
      <svg viewBox="0 0 128 100" width="112.64" height="88.00" class="sds-signet">
<path d="M124.5 66.00V80A16.5 16.5 0 0 1 108 96.5H20A16.5 16.5 0 0 1 3.5 80V20A16.5 16.5 0 0 1 20 3.5H78.00" fill="none" stroke="var(--text-secondary)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<path d="M38 29.5L38 70.5L77 50Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
<path d="M92.00 3.5H108A16.5 16.5 0 0 1 124.5 20V52.00Z" fill="var(--accent)" stroke="var(--accent)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
</svg>
      <div class="spec-cap">TRYOUT</div>
      <div class="spec-note" style="max-width:20ch;">Clone, <span class="sds-mono" style="white-space:nowrap;">ddev start</span>, done.</div>
    </div>
    <div class="spec-note" style="flex:1; min-width:0;">
      Everything structural is shared and not up for redrawing: the frame path, the
      marker at 36&#8239;&#215;&#8239;52, stroke 7, the 3.5 rounding, the 7-unit gap. What a
      product owns is the interior, and it gets exactly one idea there.
      <br /><br />
      The triangle is filled <em>and</em> stroked at the same weight, the way the corner
      marker is. That is not a shortcut: it makes the round join do the rounding, so its
      three points come out at 3.5 like every other corner in the mark, without a second
      construction to keep in step.
    </div>
  </div>

  <div style="display:flex; gap:30px; align-items:flex-start;">
    <div style="display:flex; align-items:flex-end; gap:20px; flex:none; padding-top:6px;">
      <div style="display:flex; flex-direction:column; align-items:center; gap:7px;"><svg class="sds-signet" width="32" height="25.6" aria-hidden="true"><use href="../assets/tryout-signet-l.svg#art"></use></svg><span class="spec-cap">L &#183; 32</span></div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:7px;"><svg class="sds-signet" width="24" height="19.2" aria-hidden="true"><use href="../assets/tryout-signet-m.svg#art"></use></svg><span class="spec-cap">M &#183; 24</span></div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:7px;"><svg class="sds-signet" width="16" height="16" aria-hidden="true"><use href="../assets/tryout-signet-s.svg#art"></use></svg><span class="spec-cap">S &#183; 16</span></div>
    </div>
    <div class="spec-note" style="flex:1; min-width:0;">
      Three files again, redrawn rather than scaled: <span class="sds-mono">tryout-signet-l.svg</span>,
      <span class="sds-mono">-m.svg</span>, <span class="sds-mono">-s.svg</span>. A heavier stroke
      inflates the triangle by half a stroke on every side, so its vertices move inward at
      each step to hold the inked size still. S keeps the square viewBox, because a favicon
      slot is square.
    </div>
  </div>

</div>`;

const meta: Meta = {
  title: 'Specimens/Brand/Signet — construction',
  tags: ['!dev'],
  excludeStories: ['specimenHtml'],
  parameters: {
    dsCard: dsCard({
      path: 'guidelines/brand-signet-construction.card.html',
      group: 'Brand',
      name: 'Signet — construction',
      subtitle: 'How a signet is built for this system — one rounding throughout: half the stroke',
      viewport: '700x1785',
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
